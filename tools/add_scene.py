"""Crop painted scene images to the banner format and register them in js/scenes.js.

Usage:
  python3 tools/add_scene.py <scene> <morning.png> <afternoon.png> <night.png> [--center 0.62]
  python3 tools/add_scene.py letter <image.png> --single

Images are cropped to 3.2:1 around a vertical centre (fraction of the height),
resized to 1800 px wide and saved as WebP in assets/scenes/.
"""
import re
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PHASES = ['morning', 'afternoon', 'night']


def crop(src, dst, center):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    ch = min(h, round(w / 3.2))
    top = max(0, min(h - ch, round(h * center - ch / 2)))
    im.crop((0, top, w, top + ch)).resize((1800, round(1800 * ch / w)), Image.LANCZOS).save(dst, 'WEBP', quality=80, method=6)


def register(scene, value):
    p = ROOT / 'js' / 'scenes.js'
    s = p.read_text()
    m = re.search(r"SIM\.SCENE_IMAGES = \{(.*?)\};", s)
    entries = dict(re.findall(r"'?([\w-]+)'?: (\[[^\]]*\]|'single')", m.group(1)))
    entries[scene] = value
    body = ', '.join(f"{k if re.fullmatch(r'\w+', k) else repr(k)}: {v}" for k, v in entries.items())
    s = s[:m.start()] + "SIM.SCENE_IMAGES = { " + body + " };" + s[m.end():]
    p.write_text(s)


def main():
    args = sys.argv[1:]
    center = 0.62
    if '--center' in args:
        i = args.index('--center'); center = float(args[i + 1]); del args[i:i + 2]
    single = '--single' in args
    if single:
        args.remove('--single')
    scene, files = args[0], args[1:]
    out = ROOT / 'assets' / 'scenes'
    out.mkdir(parents=True, exist_ok=True)
    if single:
        crop(files[0], out / f'scene-{scene}.webp', center)
        register(scene, "'single'")
    else:
        for f, ph in zip(files, PHASES):
            crop(f, out / f'scene-{scene}-{ph}.webp', center)
        register(scene, '[' + ', '.join(f"'{ph}'" for ph in PHASES[:len(files)]) + ']')
    print('registered', scene)


if __name__ == '__main__':
    main()
