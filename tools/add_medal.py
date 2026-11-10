"""Cut a painted medal out of its flat background and register it in js/data/medals.js.

Usage:
  python3 tools/add_medal.py <medal-id> <image.png> [--tolerance 28] [--holes]

--holes also clears enclosed background areas, such as the inside of a wreath.

The background colour is sampled from the image corners. Every pixel that is close
to it and connected to the image edge becomes transparent, with a soft edge. The
result is trimmed, fitted into a 256 px wide canvas and saved as
assets/medals/medal-<id>.png.
"""
import re
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent


def cut_out(src, tolerance, holes=0.0):
    im = Image.open(src).convert('RGB')
    # Work at reduced size for the flood fill, then scale the mask back up.
    scale = 512 / max(im.size)
    small = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    a = np.asarray(small).astype(np.int16)
    h, w, _ = a.shape
    corners = np.concatenate([a[:4, :4].reshape(-1, 3), a[:4, -4:].reshape(-1, 3), a[-4:, :4].reshape(-1, 3), a[-4:, -4:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    close = np.sqrt(((a - bg) ** 2).sum(axis=2)) < tolerance
    outside = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if close[y, x] and not outside[y, x]:
                outside[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if close[y, x] and not outside[y, x]:
                outside[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and close[ny, nx] and not outside[ny, nx]:
                outside[ny, nx] = True; q.append((ny, nx))
    if holes:
        # Also clear enclosed background areas (for example inside a wreath), if they are large enough.
        seen = outside.copy()
        min_size = holes * h * w
        for sy in range(h):
            for sx in range(w):
                if close[sy, sx] and not seen[sy, sx]:
                    comp = [(sy, sx)]; seen[sy, sx] = True; i = 0
                    while i < len(comp):
                        y, x = comp[i]; i += 1
                        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            ny, nx = y + dy, x + dx
                            if 0 <= ny < h and 0 <= nx < w and close[ny, nx] and not seen[ny, nx]:
                                seen[ny, nx] = True; comp.append((ny, nx))
                    if len(comp) >= min_size:
                        for y, x in comp:
                            outside[y, x] = True
    mask = Image.fromarray(np.where(outside, 0, 255).astype(np.uint8)).resize(im.size, Image.LANCZOS)
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert('RGBA')
    out.putalpha(mask)
    box = mask.point(lambda v: 255 if v > 40 else 0).getbbox()
    return out.crop(box) if box else out


def register(mid):
    p = ROOT / 'js' / 'data' / 'medals.js'
    s = p.read_text()
    m = re.search(r"SIM\.MEDAL_IMAGES = \[(.*?)\];", s)
    if not m:
        s = s.replace("SIM.badgeSVG = function (id, size = 44) {",
                      "// Painted medals in assets/medals/medal-<id>.png. Others use the drawn SVG.\nSIM.MEDAL_IMAGES = [];\n\nSIM.badgeSVG = function (id, size = 44) {\n  if (SIM.MEDAL_IMAGES.includes(id)) return `<img class=\"medal-img\" src=\"assets/medals/medal-${id}.png\" alt=\"\" style=\"height:${size}px\">`;", 1)
        m = re.search(r"SIM\.MEDAL_IMAGES = \[(.*?)\];", s)
    ids = [x.strip().strip("'") for x in m.group(1).split(',') if x.strip()]
    if mid not in ids:
        ids.append(mid)
    s = s[:m.start()] + "SIM.MEDAL_IMAGES = [" + ', '.join(f"'{i}'" for i in ids) + "];" + s[m.end():]
    p.write_text(s)


def main():
    args = sys.argv[1:]
    tol = 28
    if '--tolerance' in args:
        i = args.index('--tolerance'); tol = float(args[i + 1]); del args[i:i + 2]
    holes = 0.0
    if '--holes' in args:
        args.remove('--holes'); holes = 0.004
    mid, src = args
    img = cut_out(src, tol, holes)
    # Wide clasps get more pixels so they stay sharp at their larger display width.
    img.thumbnail((768, 512) if img.width > img.height * 2 else (256, 512), Image.LANCZOS)
    out = ROOT / 'assets' / 'medals'
    out.mkdir(parents=True, exist_ok=True)
    img.save(out / f'medal-{mid}.png', optimize=True)
    register(mid)
    print('registered', mid, img.size)


if __name__ == '__main__':
    main()
