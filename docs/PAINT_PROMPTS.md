# Feldgrau: Prompts for Painted Artwork

Prompts for an **image-generating** model (for example ChatGPT image generation, Midjourney or Gemini).

**How to use:**
1. Paste the **master prompt** first, once per conversation.
2. Send **one asset prompt at a time**.
3. Save each image under the file name given, put them all in one zip and send it over.

You do **not** need to match the exact pixel sizes or formats. Wide images in any resolution are fine, and the developer will crop, resize and convert them to WebP. The only thing that matters is the composition: important things in the centre, with the horizon in the lower half.

The medals, ribbons and maps from the earlier code-drawn pack are kept for now. Painting them is not needed.

---

## 1. Master prompt (paste first)

```
You are painting illustrations for "Feldgrau", a serious, realistic text game about an ordinary German conscript in the Second World War (Poland 1939, Belgium/France 1940, occupied France 1940). The pictures sit above blocks of text, like illustrations in an old book.

STYLE, for every image:
- Hand-painted gouache or watercolour on slightly textured, aged paper, like a 1940s book illustration or a war artist's sketchbook. Visible brush strokes and paper grain.
- Muted, desaturated palette: ochre, olive, field grey (#4d5345), umber, slate blue, faded paper (#e9e1cb). Night scenes are blue-black with small warm orange lights.
- Soft, atmospheric light, low contrast, a slightly melancholic mood. Never glossy, never photorealistic, never a modern video-game look, never heroic or triumphant.
- People are small, distant and mostly seen as silhouettes or from behind (except in portraits).

STRICT RULES:
- No swastikas, no Nazi eagles, no SS runes, no flags of any kind, no armbands, no badges or emblems on uniforms, helmets, buildings or vehicles. Uniforms and helmets are plain.
- No text, letters, numbers or signatures anywhere in the image.
- No blood, no wounds, no dead bodies in view.
- No real, recognisable people.

FORMAT:
- Scene banners: a very wide panorama (aspect ratio about 15:4; if you cannot do that, 16:9 is fine). Keep all important elements in the central 60 % horizontally, with the horizon at about 60–70 % of the height. The top and sides may be cropped.
- Portraits: square, head and shoulders.

I will send one image request at a time, each with a file name. Make one image per request and keep the style consistent across the whole series. When I ask for the same scene at a different time of day, keep the SAME composition and change only the light.
```

---

## 2. Scene banners (25 images)

Make the **morning** version first, then ask for:

```
The same composition as the last image, now in [afternoon / night] light.
```

**Time of day:**

| Phase | Light |
|---|---|
| morning | Pale, dusty ochre dawn, low mist |
| afternoon | Flat, overcast grey-green daylight |
| night | Blue-black sky with a few stars, only small warm lights |

### camp
- **Files:** `scene-camp-morning.webp`, `scene-camp-afternoon.webp`, `scene-camp-night.webp`
```
Scene "camp": a German army field camp at the edge of a pine forest in Pomerania, 1939. Three or four triangular canvas tents in a sandy clearing, a canvas-covered army truck half-hidden under cut pine branches, a stack of rifles. Two or three small soldier silhouettes. Quiet, waiting. Night version: a single shaded campfire glowing between the tents.
```

### forest
- **Files:** `scene-forest-morning.webp`, `scene-forest-afternoon.webp`, `scene-forest-night.webp`
```
Scene "forest": a dense pine forest. Two layers of tall pines with dark trunks in the foreground and a narrow sandy track disappearing between the trees. A felled tree lies across the track. Enclosed and watchful, as if someone is hidden in the trees. Night version: almost black, cold moonlight between the trunks.
```

### field
- **Files:** `scene-field-morning.webp`, `scene-field-afternoon.webp`, `scene-field-night.webp`
```
Scene "field": a wide, flat stubble field with a distant tree line. A low band of ground fog across the middle and a row of wooden fence posts with sagging barbed wire in the foreground. Far away, a thin column of smoke rises. Exposed, nowhere to hide. Night version: a single flare hangs in the sky casting pale light on the fog.
```

### village
- **Files:** `scene-village-morning.webp`, `scene-village-afternoon.webp`, `scene-village-night.webp`
```
Scene "village": a modest European farm village. Four or five farmhouses and barns with pitched roofs, a stone well, a dirt road, and a church spire in the distance. One chimney with a thin plume of smoke. Ordinary civilian life, no soldiers. Night version: one or two windows dimly lit, the rest dark.
```

### road
- **Files:** `scene-road-morning.webp`, `scene-road-afternoon.webp`, `scene-road-night.webp`
```
Scene "road": a straight country road lined with tall poplars, receding to the horizon. Small distant silhouettes of refugees: a horse-drawn cart piled with belongings, a handcart, people walking with bundles. Endless movement, displacement. Night version: the road is empty and moonlit.
```

### river
- **Files:** `scene-river-morning.webp`, `scene-river-afternoon.webp`, `scene-river-night.webp`
```
Scene "river": the broad, slow Meuse river in Belgium between grey limestone cliffs. On the far bank, a small town of stone houses and a church tower. In mid-river, one small inflatable rubber boat with a few hunched figures paddling. Tense: a crossing under threat. Night version: smoke over the town and an orange glow of burning houses reflected in the dark water.
```

### city
- **Files:** `scene-city-morning.webp`, `scene-city-afternoon.webp`, `scene-city-night.webp`
```
Scene "city": the rooftops of Paris in July 1940, seen from a high window. Grey zinc mansard roofs, chimney pots and dormer windows, with the Eiffel Tower small in the right third of the image. The streets below are almost empty. No flags on any building. Beautiful but hollow: an occupied city. Night version: blackout, dark roofs, a few thin chinks of warm light, stars.
```

### bridge
- **Files:** `scene-bridge-morning.webp`, `scene-bridge-afternoon.webp`, `scene-bridge-night.webp`
```
Scene "bridge": a long old stone bridge of seven arches over the calm river Cher in central France, November 1940. On the near (left) bank, a small wooden sentry hut and a red-and-white striped barrier pole across the road. Bare winter trees, an old water mill in the distance on the far bank. A border inside one country: quiet and tense. Night version: lantern glow at the hut, mist on the water.
```

### letter
- **File:** `scene-letter.webp`
```
Scene "letter": a top-down still life on a dark, worn wooden table, very wide format. A handwritten letter on yellowed paper (the handwriting is only illegible squiggles, no readable words), an envelope with a plain blank stamp, a pencil stub, and a small photograph lying face down. Warm lamplight.
```

---

## 3. Portraits (12 images)

Start each portrait with this line:

```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1940 photograph in gouache, plain dark olive background (#3b3d34). German soldiers wear a plain field-grey wool tunic with a dark green collar and NO badges, eagles or emblems.
```

Then add the description:

| File | Description |
|---|---|
| `hartmann.webp` | Willi Hartmann, 22, a docker's son from Hamburg. Lanky, crooked cheeky grin, side cap pushed back, a cigarette tucked behind one ear. The squad joker. |
| `lenz.webp` | Karl Lenz, 22, a former Hitler Youth leader, now a military policeman. Neat, pale, thin lips, cold correct gaze, perfectly straight posture. Wears a plain crescent-shaped metal plate on a chain around his neck (no emblem on it). |
| `rau.webp` | Fritz Rau, 19, "the choirboy". Round, very young face, big ears, slightly frightened eyes, a uniform a size too large. |
| `vogel.webp` | Ernst Vogel, 22, a Swabian farm boy. Stocky, sunburnt, anxious and gentle eyes. |
| `brandt.webp` | Paul Brandt, 35, a twelve-year career sergeant. Square jaw, cropped greying hair, a face "like a closed door", hard but fair. |
| `albrecht.webp` | Joachim von Albrecht, 24, an aristocratic infantry officer. Fine, serious features, a small old duelling scar on his left cheek, a plain peaked officer's cap with no badge. |
| `sattler.webp` | Bruno Sattler, 28, a streetwise Berliner. Sharp, amused face, slicked-back hair, a knowing half-smile: a man who can get you anything. |
| `pohl.webp` | Gustav Pohl, 41, a reservist plumber with four children. Bushy moustache, thinning hair, tired kind eyes. |
| `kuehn.webp` | Heinz Kühn, 20, a zealous former youth leader. Blond, hard unblinking stare, chin up. |
| `brenner.webp` | Josef Brenner, 24, a Bavarian farmhand. Huge, broad calm face, slow and gentle expression. |
| `claire.webp` | Claire Girard, 20, a French village schoolteacher, 1940. Civilian, no uniform. Dark hair pinned up, grey cardigan, guarded but intelligent look. |
| `madame.webp` | Madame Girard, 50, a French war widow, 1940. Civilian. Black dress, grey hair in a bun, arms folded, unforgiving eyes. |

---

## 4. Title image (1 image)

- **File:** `title.webp`
```
A very quiet, dark, atmospheric image for a title screen, wide 16:9. A lone soldier seen from behind, small, walking along an empty country road lined with poplars at dusk, under a heavy grey sky. Muted, melancholic. Most of the image is calm sky and empty space, dark enough that light text could sit on top.
```

---

## 5. Checklist

| Type | Count |
|---|---|
| Scenes | 25 (8 scenes × 3 times of day, plus letter) |
| Portraits | 12 |
| Title image | 1 |

Put them all in one zip, in any folder structure. The file names are what matter.
