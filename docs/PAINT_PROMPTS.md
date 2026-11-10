# Feldgrau: Prompts for Painted Artwork

Prompts for an **image-generating** model (for example ChatGPT image generation, Midjourney or Gemini).

**How to use:**
1. Paste the **master prompt** first, once per conversation.
2. Send **one asset prompt at a time**.
3. Save each image under the file name given, put them all in one zip and send it over.

You do **not** need to match the exact pixel sizes or formats, or make backgrounds transparent (the developer cuts out the medals). Wide images in any resolution are fine, and the developer will crop, resize and convert them to WebP. The only thing that matters is the composition: important things in the centre, with the horizon in the lower half.

The ribbon bars and maps from the earlier code-drawn pack are kept. The medals get their own prompts (section 4).

**Attach two images** together with the master prompt:
- `docs/emblem.png`: the emblem used on flags, caps and medals.
- `docs/style-reference.png`: the painting style (only the style, not the subjects).

**Wording:** these prompts describe only what should be visible. Image models' safety filters react to certain historical words (even in sentences like "do not draw…"), so the prompts avoid them on purpose. If a prompt is still refused, try a neutral scene such as `village` first, to find out whether it is the master prompt or one asset prompt that is blocked.

---

## 1. Master prompt (paste first)

```
You are painting a series of illustrations for "Feldgrau", a serious, melancholic historical drama game set in Europe in 1939–1940. The pictures sit above blocks of text, like illustrations in an old book.

STYLE, for every image:
- Hand-painted gouache or watercolour on slightly textured, aged paper, like a 1940s book illustration or a war artist's sketchbook. Visible brush strokes and paper grain.
- Muted, desaturated palette: ochre, olive, field grey, umber, slate blue, faded cream paper. Night scenes are blue-black with small warm orange lights.
- Soft, atmospheric light, low contrast, a quiet and reflective mood. Never glossy, photorealistic or video-game-like, and never heroic or triumphant.
- People are small, distant and mostly seen as silhouettes or from behind (except in portraits).
- No text, letters or numbers in the image. No blood or injuries.

UNIFORMS: soldiers wear 1940-era field-grey wool uniforms with dark green collars and plain steel helmets. Where an emblem appears (on a flag, a cap or a medal), it is always the same simple design shown in the attached image "emblem.png": an upright sword, point up, with two oak leaves crossed above the hilt.

HOW TO DELIVER:
- Paint EVERY image as its own separate generation, in its final format. Do NOT make sheets, collages or grids, and do NOT crop from larger images.
- Paint the whole frame; no blurred or stretched edges.
- For the morning, afternoon and night versions, repaint the scene in that light. Keep the same composition and do not just darken one image.
- Every portrait is a clearly different person; nobody shares a face.
- Use the attached "style-reference.png" only for the painting style, not for its subjects.

FORMAT: scene banners are very wide panoramas (about 15:4, or 16:9 if that is not possible), with the important things in the centre and the horizon low. Portraits are square, head and shoulders.

I will send one image request at a time.
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
Scene "camp": an army field camp at the edge of a pine forest in Pomerania, 1939. Three or four triangular canvas tents in a sandy clearing, a canvas-covered army truck half-hidden under cut pine branches, a stack of rifles. Two or three small soldier silhouettes. Quiet, waiting. Night version: a single shaded campfire glowing between the tents.
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
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1940 photograph in gouache, plain dark olive background (#3b3d34). Soldiers wear a 1940-era field-grey wool tunic with a dark green collar.
```

Then add the description:

| File | Description |
|---|---|
| `hartmann.webp` | Willi Hartmann, 22, a docker's son from Hamburg. Lanky, crooked cheeky grin, side cap pushed back, a cigarette tucked behind one ear. The squad joker. |
| `lenz.webp` | Karl Lenz, 22. Neat, pale, thin lips, cold correct gaze, very straight posture. A peaked cap and a crescent-shaped metal plate on a chain around his neck. |
| `rau.webp` | Fritz Rau, 19. Round, very young face, big ears, slightly frightened eyes, a uniform a size too large. |
| `vogel.webp` | Ernst Vogel, 22, a Swabian farm boy. Stocky, sunburnt, anxious and gentle eyes. |
| `brandt.webp` | Paul Brandt, 35, a twelve-year career sergeant. Square jaw, cropped greying hair, a face "like a closed door", hard but fair. |
| `albrecht.webp` | Joachim von Albrecht, 24, a young officer from an old aristocratic family. Fine, serious features, a small old scar on his left cheek, a peaked officer's cap. |
| `sattler.webp` | Bruno Sattler, 28, a streetwise Berliner. Sharp, amused face, slicked-back hair, a knowing half-smile: a man who can get you anything. |
| `pohl.webp` | Gustav Pohl, 41, a reservist plumber with four children. Bushy moustache, thinning hair, tired kind eyes. |
| `kuehn.webp` | Heinz Kühn, 20. Blond, hard unblinking stare, chin raised, very upright. Steel helmet. |
| `brenner.webp` | Josef Brenner, 24, a Bavarian farmhand. Huge, broad calm face, slow and gentle expression. |
| `claire.webp` | Claire Girard, 20, a French village schoolteacher, 1940. Civilian, no uniform. Dark hair pinned up, grey cardigan, guarded but intelligent look. |
| `madame.webp` | Madame Girard, 50, a French war widow, 1940. Civilian. Black dress, grey hair in a bun, arms folded, unforgiving eyes. |

---

## 4. Medals (15 images)

Start each medal with this line:

```
A single military decoration, painted as a precise, realistic museum-catalogue illustration in gouache: front view, centred, soft even light, subtle metal sheen. Plain flat light-grey background (#d8d8d8) with nothing else in the image, so it can be cut out. No text except where stated. Where an emblem appears, it is the sword-and-oak-leaves emblem from emblem.png.
```

**Ribbon medals** hang from a short ribbon: the ribbon at the top (about a third of the height, stripes running vertically), a small ring, then the medal. **Badges** are shown on their own, without a ribbon.

Ribbon stripes are listed left to right; the widths are relative.

| File | Prompt |
|---|---|
| `medal-ek2.png` | Iron Cross, 2nd Class (1939). A black cross pattée with a raised silver frame, hanging from its ribbon. The sword-and-oak-leaves emblem in the centre of the cross, "1939" small on the lower arm. Ribbon stripes: black 3, white 2, red 6, white 2, black 3. |
| `medal-ek1.png` | Iron Cross, 1st Class (1939). The same black cross with silver frame and the sword-and-oak-leaves emblem in the centre, "1939" small on the lower arm, but WITHOUT a ribbon: pinned flat onto a square of field-grey wool breast-pocket cloth with visible stitching and a pocket button above it. |
| `medal-kvk2.png` | War Merit Cross, 2nd Class with Swords. A bronze cross with straight, flared arms and a raised border, a small round centre medallion with the sword-and-oak-leaves emblem inside a small oak wreath, and two crossed swords behind the cross. Ribbon stripes: red 3, white 2, black 6, white 2, red 3. |
| `medal-kvk2ns.png` | War Merit Cross, 2nd Class without swords. The same bronze cross and centre medallion, with no swords. Same ribbon as above. |
| `medal-sudeten.png` | A 1938 commemorative medal. A round bronze medal: a man holding a flag (showing the sword-and-oak-leaves emblem) steps up onto a platform where a second man pulls him up. Ribbon stripes: red 2, white 1, black 10, white 1, red 2. |
| `medal-westwall.png` | West Wall Medal. An oval bronze medal: an eagle with spread wings above a bunker, holding the sword-and-oak-leaves emblem in a wreath, with a crossed sword and spade below. Ribbon stripes: white 2, brown 12, white 2. |
| `medal-rescue.png` | Life Saving Medal. A round silver medal with a simple laurel border and a plain face. Ribbon stripes: white 2, orange-red 12, white 2. |
| `medal-longservice4.png` | Long Service Award, 4 Years. A round matte silver medal with an eagle holding the sword-and-oak-leaves emblem in a wreath. A solid cornflower-blue ribbon. |
| `medal-isa.png` | Infantry Assault Badge in silver. A vertical oval wreath of oak leaves, with a Kar98k rifle and fixed bayonet running diagonally from bottom-left to top-right across it, and a small eagle at the top holding the sword-and-oak-leaves emblem. No ribbon. |
| `medal-wound_black.png` | Wound Badge in Black. A vertical oval badge with a laurel-wreath edge, a steel helmet in profile in the centre (the sword-and-oak-leaves emblem on the helmet) above two crossed swords. Black lacquer finish. No ribbon. |
| `medal-wound_silver.png` | Wound Badge in Silver. The same design as the black wound badge, in matte silver. |
| `medal-wound_gold.png` | Wound Badge in Gold. The same design, in matte gold. |
| `medal-schnur1.png` | Marksmanship Lanyard, 1st Grade. A braided silver-grey aluminium cord hanging in a U-shaped loop from a short shoulder bar. No acorns. |
| `medal-schnur2.png` | Marksmanship Lanyard, 2nd Grade. The same braided lanyard with ONE small silver acorn hanging at the bottom. |
| `medal-schnur3.png` | Marksmanship Lanyard, 3rd Grade. The same braided lanyard with TWO small silver acorns. |
| `medal-tankbadge.png` | Tank Destruction Badge. A vertical strip of braided silver-aluminium cord about three times as tall as it is wide, with a thin dark band at the top and bottom, and a small black metal tank (side view, plain, no markings) fixed across the middle. No ribbon. |

**Tip:** paint `medal-wound_black.png` first. Then ask for "the same badge, now in matte silver" and "…in matte gold", and do the same for the three lanyards. That keeps each set consistent.

---

## 4b. Optional: eastern scene banners (Chapter IV)

Chapter IV (the Soviet Union, summer 1941) reuses the existing banners. These optional variants would make it look more like the East. Use the same three-light method as the other scenes.

| Files | Prompt |
|---|---|
| `scene-village-east-<phase>.webp` | A Belarusian village in summer 1941: low wooden log houses with carved, painted window frames, a well with a long wooden sweep pole, sunflowers, a dirt road, birch trees. Civilian, no soldiers. |
| `scene-road-east-<phase>.webp` | An endless sandy road across flat steppe-like fields under a huge sky, birch woods in the distance, a column of small marching silhouettes raising a long cloud of grey dust. |
| `scene-river-east-<phase>.webp` | A wide, slow Russian river with low sandy banks, reeds, a wooden bridge partly destroyed, birch forest on both sides. No cliffs, no church on the bank. |

---

## 4c. Chapter V: winter before Moscow

Chapter V uses winter versions of the scenes. Until they are painted, the game shows the drawn scenes with snow added. These are the six most useful.

**Format for every image:** landscape 16:9, at least 1600 × 900 pixels, PNG. Horizon at about 55–60 % of the height. Keep everything important between 30 % and 80 % of the height; the top 30 % and bottom 15 % may be cropped away. No text, letters, numbers or signature.

**Style for every image:** hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Muted, desaturated palette. NOT photorealistic.

Make the morning version first, then the afternoon and night versions in the same conversation, with "The same scene and composition as the last image, repainted in … light."

| Files | Scene |
|---|---|
| `scene-camp-winter-<phase>.png` | A German army position in a Russian birch forest in deep snow, December 1941, minus thirty. Dugouts roofed with logs and snow, a thin plume of smoke from a stovepipe, a few hunched soldiers in greatcoats with blankets over their shoulders and plain steel helmets. Night version: the stovepipe glowing, stars, bitter cold. |
| `scene-field-winter-<phase>.png` | A vast white snowfield under a low grey sky, a dark birch wood on the horizon, a line of fence posts half buried in drifts. Small dark figures far away crossing the snow. Night version: moonlight on the snow and a single flare in the sky. |
| `scene-village-winter-<phase>.png` | A Russian village of log houses buried in snow to the windows, smoke from chimneys, a well with a sweep pole, birch trees, a horse-drawn sledge on the road. Night version: one or two windows lit by oil lamps, deep blue snow. |
| `scene-road-winter-<phase>.png` | A long road through deep snow, lined with abandoned trucks and a frozen horse-drawn cart, a column of small soldier silhouettes trudging west in greatcoats, a burning village on the horizon. Night version: the column black against the snow, the glow of the fire. |
| `scene-forest-winter-<phase>.png` | A dense pine and birch forest in heavy snow, a narrow track, snow-laden branches. Night version: almost black, cold moonlight between the trunks. |
| `scene-river-winter-<phase>.png` | A frozen river with snow on the ice, a wooden bridge, birch forest on both banks, a low winter sun. Night version: the ice glowing faintly blue under the moon. |

## 4d. Portrait: Starck

**`starck.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1940 photograph in gouache, plain dark olive background (#3b3d34).

Wolfram Starck, 35, an officer, a former schoolteacher. Tall, lean, clean-shaven, pale grey eyes, a cold, intelligent, controlled face with the faintest hint of a smile. He wears a long grey leather coat with a fur collar and a grey peaked officer's cap. Where an emblem appears, it is the sword-and-oak-leaves emblem from emblem.png.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

## 4e. Medal: Eastern Front Medal

**`medal-ostmedaille.png`** (start with the medal line from section 4)
```
Eastern Front Medal (Winter 1941/42). A round medal of dark gunmetal grey with a narrow silver rim, showing a stylised eagle above a laurel branch and a small steel helmet, hanging from its ribbon. Ribbon stripes: red 6, white 1, black 2, white 1, red 6. The eagle holds the sword-and-oak-leaves emblem.
```

## 4f. Chapter VI: scenes at home

**Format for every image:** landscape 16:9, at least 1600 × 900 pixels, PNG. Keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

**Style for every image:** hand-painted gouache on textured, aged paper, visible brush strokes and paper grain, like a 1940s book illustration. Muted, desaturated palette. NOT photorealistic.

| Files | Scene |
|---|---|
| `scene-street-morning.png`, `-afternoon.png`, `-night.png` | A German city street in spring 1942: four-storey apartment buildings, a tram line, a corner bakery with a queue of women, chestnut trees in flower, blackout paper on some windows. A few people, no soldiers marching. Night version: total blackout, searchlights in the sky. |
| `scene-station.png` (one image) | A German railway station platform in 1942: an iron and glass roof, a steam train, soldiers with packs and women saying goodbye, steam and smoke. Flags hang from the roof beams; where a flag shows an emblem, it is the sword-and-oak-leaves emblem from emblem.png. |
| `scene-kitchen.png` (one image) | A small working-class kitchen in 1942 at evening: a scrubbed wooden table with plates of potatoes and cabbage, a coal stove, a radio on a shelf, a crucifix or a framed photograph on the wall, lamplight. |
| `scene-cellar.png` (one image) | An air-raid shelter in the cellar of an apartment building, 1942: whitewashed brick walls, wooden benches, families in coats with suitcases, a single bulb, dust falling from the ceiling. |
| `scene-church.png` (one image) | A small registry office or parish church in a German town in spring 1942: plain wooden pews, light through tall windows, a bunch of lilies of the valley on a table. |

## 4g. Chapter VI: portraits

### The Waffen-SS section (for players who transferred)

Rank insignia are set for each man and follow the 1942 Waffen-SS pattern, with the runes on the right collar patch replaced by the sword-and-oak-leaves emblem.

| Man | Rank | Left collar patch | Sleeve |
|---|---|---|---|
| Voss | SS-Rottenführer | two silver stripes | two chevrons |
| Wendt, Mayr, Brück | SS-Sturmmann | one silver stripe | one chevron |
| Nowak, Haas | SS-Schütze | plain black | none |

**`voss.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Erich Voss, mid-twenties, a hardened veteran section deputy and machine gunner. Lean, weather-beaten, short fair hair, hard pale-blue eyes, a thin scar through one eyebrow, a confident, unsmiling face.

Uniform, painted accurately: a field-grey wool tunic of 1942 with a dark field-grey collar and silver-grey buttons. BLACK collar patches on both sides of the collar. The RIGHT collar patch shows the sword-and-oak-leaves emblem from emblem.png in silver. Black shoulder straps with thin white piping. A small silver eagle on the upper left sleeve, its wreath holding the sword-and-oak-leaves emblem. On his head a field-grey side cap (a soft, boat-shaped forage cap) with a small silver eagle on its left side and a small silver skull-and-crossbones on the front. The LEFT collar patch is black with TWO thin parallel silver stripes across its lower part. TWO small silver chevrons, point down, on the upper left sleeve below the eagle.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

**`wendt.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Theo Wendt, mid-twenties, a former office clerk from Hamburg and the section joker. Narrow, lively face, dark hair a little too long, a crooked grin, laughter lines at the eyes.

Uniform, painted accurately: a field-grey wool tunic of 1942 with a dark field-grey collar and silver-grey buttons. BLACK collar patches on both sides of the collar. The RIGHT collar patch shows the sword-and-oak-leaves emblem from emblem.png in silver. Black shoulder straps with thin white piping. A small silver eagle on the upper left sleeve, its wreath holding the sword-and-oak-leaves emblem. On his head a field-grey side cap (a soft, boat-shaped forage cap) with a small silver eagle on its left side and a small silver skull-and-crossbones on the front. The LEFT collar patch is black with ONE thin silver stripe across its lower part. ONE small silver chevron, point down, on the upper left sleeve below the eagle.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

**`mayr.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Anton Mayr, about thirty, a former policeman from the Tyrol mountains. Broad, weathered, tired face, black stubble, a heavy moustache, watchful dark eyes that have seen too much.

Uniform, painted accurately: a field-grey wool tunic of 1942 with a dark field-grey collar and silver-grey buttons. BLACK collar patches on both sides of the collar. The RIGHT collar patch shows the sword-and-oak-leaves emblem from emblem.png in silver. Black shoulder straps with thin white piping. A small silver eagle on the upper left sleeve, its wreath holding the sword-and-oak-leaves emblem. On his head a field-grey side cap (a soft, boat-shaped forage cap) with a small silver eagle on its left side and a small silver skull-and-crossbones on the front. The LEFT collar patch is black with ONE thin silver stripe across its lower part. ONE small silver chevron, point down, on the upper left sleeve below the eagle.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

**`brueck.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Karl-Heinz Brück, late twenties, a former coal miner from the Ruhr. A huge man with a thick neck, a broad flat face, small calculating grey eyes and a closed, watchful expression.

Uniform, painted accurately: a field-grey wool tunic of 1942 with a dark field-grey collar and silver-grey buttons. BLACK collar patches on both sides of the collar. The RIGHT collar patch shows the sword-and-oak-leaves emblem from emblem.png in silver. Black shoulder straps with thin white piping. A small silver eagle on the upper left sleeve, its wreath holding the sword-and-oak-leaves emblem. On his head a field-grey side cap (a soft, boat-shaped forage cap) with a small silver eagle on its left side and a small silver skull-and-crossbones on the front. The LEFT collar patch is black with ONE thin silver stripe across its lower part. ONE small silver chevron, point down, on the upper left sleeve below the eagle.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

**`nowak.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Paul Nowak, early twenties, from a German family in Łódź. Slim, pale, dark-haired, sensitive face, anxious brown eyes, looking slightly away.

Uniform, painted accurately: a field-grey wool tunic of 1942 with a dark field-grey collar and silver-grey buttons. BLACK collar patches on both sides of the collar. The RIGHT collar patch shows the sword-and-oak-leaves emblem from emblem.png in silver. Black shoulder straps with thin white piping. A small silver eagle on the upper left sleeve, its wreath holding the sword-and-oak-leaves emblem. On his head a field-grey side cap (a soft, boat-shaped forage cap) with a small silver eagle on its left side and a small silver skull-and-crossbones on the front. The LEFT collar patch is plain black with no insignia at all. No sleeve chevrons.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

**`haas.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Jürgen Haas, early twenties, an eager new recruit. Fresh, clean-shaven, earnest face, neatly combed blond hair, bright eyes full of conviction, chin raised.

Uniform, painted accurately: a field-grey wool tunic of 1942 with a dark field-grey collar and silver-grey buttons. BLACK collar patches on both sides of the collar. The RIGHT collar patch shows the sword-and-oak-leaves emblem from emblem.png in silver. Black shoulder straps with thin white piping. A small silver eagle on the upper left sleeve, its wreath holding the sword-and-oak-leaves emblem. On his head a field-grey side cap (a soft, boat-shaped forage cap) with a small silver eagle on its left side and a small silver skull-and-crossbones on the front. The LEFT collar patch is plain black with no insignia at all. No sleeve chevrons.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

### Home

**`mother.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

A German working-class mother, about fifty, in 1942. A thin, kind, tired face, grey-streaked brown hair pinned up in a bun, a plain dark blue dress with a small white collar and a knitted cardigan, an apron. Warm, worried eyes.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

**`father.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

A German working man, about fifty-five, in 1942, a veteran of the First World War. A lined, stern, closed face, short grey hair, a grey moustache, a worn dark suit jacket over a waistcoat and a collarless white shirt. No badges or pins.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

**`liesel.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Liesel, a young German woman in her early twenties who works at the post office, in 1942. A frank, warm face, light brown hair in soft waves to the collar, a small smile, a blue wool coat over a white blouse.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

---

## 4h. Chapter VII: Stalingrad

### Scenes

**Format for every image:** landscape 16:9, at least 1600 × 900 pixels, PNG. Horizon at about 55–60 % of the height. Keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

**Style for every image:** hand-painted gouache on textured, aged paper, visible brush strokes and paper grain, like a 1940s book illustration. Muted, desaturated palette. NOT photorealistic.

Make the morning version first, then the afternoon and night versions in the same conversation.

| Files | Scene |
|---|---|
| `scene-steppe-<phase>.png` | The open Russian steppe in high summer 1942: flat to the horizon, gold wheat and sunflowers, a dry ravine (balka), a dust cloud from a distant column of trucks and small soldier silhouettes in shirtsleeves. Night version: a dark plain, a red glow of burning fields on the horizon. |
| `scene-ruins-<phase>.png` | The ruins of a large Soviet city in autumn 1942: gutted multi-storey apartment blocks with empty window holes, rubble, a twisted lamp post, smoke. The broad grey river visible between the ruins. Night version: fires in the ruins, a flare hanging in the sky. |
| `scene-factory-<phase>.png` | A huge ruined tractor factory: roofless steel halls, broken gantries, tall chimneys, rail tracks, machinery under rubble, smoke. Night version: dark silhouettes of girders against burning sky. |
| `scene-ruins-winter-<phase>.png` | The same ruined city in January 1943: snow on the rubble, frozen, grey, silent; a few hunched figures in greatcoats with blankets. Night version: deep blue snow, a single fire. |
| `scene-factory-winter-<phase>.png` | The ruined factory halls in deep winter: snow drifting through the broken roofs, icicles on the girders. Night version: moonlight through the roof. |
| `scene-airfield-winter-<phase>.png` | A makeshift airfield on the snowy steppe in January 1943: a trampled snow runway, a three-engined transport plane with corrugated metal skin, wrecked aircraft, stretchers with wounded men in the snow, smoke from shellfire. Plain grey aircraft with no markings. Night version: dark, a plane's landing light, fires. |
| `scene-field-winter-<phase>.png`, `scene-village-winter-<phase>.png` | Already painted for Chapter V: reused. |

### Portrait: Grischa

**`grischa.png`**
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1942 photograph in gouache, plain dark olive background (#3b3d34).

Grigori "Grischa" Sobol, 27, a Ukrainian former tractor driver serving as an auxiliary with the German army in 1942. A broad, weathered peasant face, high cheekbones, short dark-blond hair, a few days of stubble, careful, watchful grey eyes, the faintest hint of a wary smile. He wears a plain, worn field-grey German army tunic with no collar insignia, no shoulder straps, no badges and no eagle, over a faded Soviet-style collarless shirt, and a plain white cloth armband with no writing on his left upper arm. A soft grey side cap with no badge.

Format: square, at least 1024 x 1024 pixels, PNG. No text, letters or numbers.
```

### Medal: Close Combat Clasp

**`medal-nahkampf.png`** (start with the medal line from section 4)
```
Close Combat Clasp in Bronze (1942). A horizontal bronze clasp, about three times as wide as it is tall. In the centre a small round medallion with a crossed bayonet and stick grenade, framed by oak leaves; on each side of it a spray of oak leaves fanning outward, all on a dark matt backing. The medallion holds the sword-and-oak-leaves emblem. No ribbon. Isolated on a plain light grey background.
```

## 4i. Chapter VIII: Two Roads

The scene prompts below are complete: paste each one on its own (after the master prompt, with `style-reference.png` attached). Single images (`-single`) look the same at every time of day.

### Scenes

**scene-powcamp-winter-morning.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A prisoner-of-war camp on the frozen steppe in February 1943, early morning, pale grey light, bitter cold. A few low brick buildings and earth-covered dugouts, a simple barbed-wire fence on wooden posts, a wooden watchtower. Long rows of gaunt prisoners in ragged grey greatcoats, with blankets over their heads, standing in the snow for the morning count. Two guards in long quilted coats and fur caps. No flags, no emblems.
```

**scene-powcamp-winter-afternoon.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A prisoner-of-war camp on the frozen steppe in February 1943, late afternoon. A low, weak winter sun, pale pink-gold light on the snow and long blue shadows. A few low brick buildings and earth-covered dugouts, a simple barbed-wire fence on wooden posts, a wooden watchtower. Gaunt prisoners in ragged grey greatcoats queue with tin cans at a steaming soup cauldron. Two guards in long quilted coats and fur caps. No flags, no emblems.
```

**scene-powcamp-winter-night.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A prisoner-of-war camp on the frozen steppe in February 1943, at night. Deep blue snow, the black outlines of low buildings and earth-covered dugouts, a barbed-wire fence, a wooden watchtower with a single searchlight sweeping the snow. A faint orange glow and a thread of smoke from one stovepipe. A cold, starry sky. No flags, no emblems.
```

**scene-powcamp-morning.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A prisoner-of-war camp in a birch and pine forest near Moscow, early summer 1943, soft morning light. Long wooden barracks with tarpaper roofs, a sandy parade ground, a simple barbed-wire fence and a wooden watchtower. Thin prisoners in faded grey uniforms without insignia stand in rows for the count. A guard in a summer tunic and side cap. No flags, no emblems.
```

**scene-powcamp-afternoon.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A prisoner-of-war camp in a birch and pine forest near Moscow, summer 1943, warm late-afternoon light and long shadows. Long wooden barracks with tarpaper roofs, a sandy parade ground, a barbed-wire fence and a wooden watchtower. Prisoners in faded grey uniforms without insignia sit against the barrack walls in the sun, carving wood; a few play football with a ball made of rags. No flags, no emblems.
```

**scene-powcamp-night.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A prisoner-of-war camp in a birch and pine forest near Moscow, a short summer night in 1943. Deep blue light that never quite becomes dark, the silhouettes of long wooden barracks and birch trees, a barbed-wire fence, a watchtower with a dim lamp. A few lit windows. No flags, no emblems.
```

**scene-tanks-morning.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

The open, rolling steppe of southern Russia in July 1943, early morning, hazy light and dust. Heavy, boxy grey tanks advance in a wide line through ripe wheat, with small infantry silhouettes in plain steel helmets walking behind them. Smoke and flashes on the horizon. All vehicles plain grey with no markings: no crosses, no letters, no numbers, no emblems.
```

**scene-tanks-afternoon.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A tank battlefield on the steppe in July 1943, hot late afternoon, the sun low and orange through smoke. Burning and wrecked tanks scattered across a trampled wheat field, black smoke columns rising into the sky, a few small infantry figures in a shallow trench in the foreground. All vehicles plain grey or plain green with no markings: no crosses, no stars, no letters, no numbers, no emblems.
```

**scene-tanks-night.png**
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Horizon at about 55–60 % of the height; keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A tank battlefield on the steppe on a July night in 1943. Dark blue sky, the black silhouettes of wrecked tanks, several still burning orange, sparks rising. Flares hanging in the sky. A trench with a few dark figures in the foreground. All vehicles with no markings: no crosses, no stars, no letters, no numbers, no emblems.
```

**scene-barracks.png** (one image)
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

The inside of a prisoner-of-war barrack in 1943: rows of crowded wooden plank bunks in two tiers, gaunt men in ragged grey uniforms lying close together under greatcoats, a small iron stove glowing in the middle, a single window with frost on it, dim lamplight. No flags, no emblems.
```

**scene-hospital.png** (one image)
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A makeshift military hospital ward in a former schoolroom, 1943: iron beds in rows with grey blankets, bandaged men, a tall window with winter light, a nurse in a white apron and headscarf bending over a bed, a blackboard still on the wall, wiped clean. No flags, no emblems.
```

**scene-office.png** (one image)
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

A small, bare interrogation room at night in 1943: a wooden table with an open file, a fountain pen, a glass of tea, a desk lamp throwing a hard pool of light, two empty wooden chairs facing each other, dark walls, a curtained window. No people. No flags, no portraits on the wall, no emblems.
```

**scene-train.png** (one image)
```
Hand-painted gouache on textured, aged paper, with visible brush strokes and paper grain, like a 1940s book illustration. Smooth, even paint surface. Muted, desaturated palette. NOT photorealistic. Landscape 16:9, at least 1600 x 900 pixels. Keep everything important between 30 % and 80 % of the height. No text, letters, numbers or signature.

The inside of a crowded wooden cattle car on a moving train in spring 1943: gaunt prisoners in grey greatcoats sitting packed on the straw-covered floor, a small barred window high on the wall with a bright square of light and a glimpse of birch trees passing, dust in the light beam. No flags, no emblems.
```

### Portraits

Start each portrait with this line, then add the description:
```
Portrait, square, head and shoulders, three-quarter view, painted like a hand-coloured 1943 photograph in gouache, plain dark olive background (#3b3d34). No text, letters or numbers.
```

| File | Description |
|---|---|
| `kessler.png` | Major Ludwig Kessler, about 50, an officer of the German army field police in 1943. A neat, grey, forgettable face, rimless round glasses, thinning grey hair combed flat, clean-shaven, a calm, attentive, faintly tired expression, a fountain pen in his breast pocket. A well-pressed field-grey officer's tunic with a dark bottle-green collar; on BOTH sides of the collar an officer's patch of two parallel silver embroidered bars on dark green. Shoulder boards of a major: BRAIDED, interwoven silver cord in a plaited pattern, with NO stars. Above the right breast pocket a small silver-grey eagle holding the sword-and-oak-leaves emblem from emblem.png (attach it). No medals or ribbons. (In the army, rank was shown on the shoulder boards, not the collar.) |

#### The replacements and the squad leaders (front track)

All five replacements and both squad leaders wear the Army's 1943 pattern: an M43 field-grey wool tunic with a field-grey collar (no dark green), four pleated pockets with straight flaps, six grey-painted buttons, and plain mouse-grey collar tabs (two short parallel bars on field-grey). Field-grey shoulder straps with thin white piping (infantry). Rank is shown as given for each man. Where a breast eagle appears, it holds the sword-and-oak-leaves emblem from `emblem.png` (attach it). If a prompt is refused, replace the eagle sentence with "No eagle."

**`rehm.png`** (Grenadier, no rank insignia)
```
Portrait, square, head and shoulders, three-quarter view facing slightly left, painted like a hand-coloured 1943 photograph in gouache, soft daylight from the left, plain dark olive background (#3b3d34). No text, letters or numbers.

Paul Rehm, 17, a brand-new German infantryman in spring 1943 who lied about his age to join. A very young, round, beardless face with pink cheeks and a few freckles, short fair hair cut high at the back, wide pale-blue eyes, eager and a little too proud, a slightly nervous half-smile.

Uniform, painted accurately: a new, still stiff M43 field-grey wool tunic with a field-grey collar, buttoned to the throat, plain mouse-grey collar tabs with two short parallel bars, plain field-grey shoulder straps with thin white piping and NO rank insignia. Above the right breast pocket, a small grey woven eagle whose talons hold the sword-and-oak-leaves emblem from emblem.png. A plain field-grey steel helmet, a size too big, sitting low on his ears, its leather chin strap hanging loose. A black leather Y-strap over the shoulders.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`tamas.png`** (Gefreiter, machine gunner)
```
Portrait, square, head and shoulders, three-quarter view facing slightly right, painted like a hand-coloured 1943 photograph in gouache, warm light from the right, plain dark olive background (#3b3d34). No text, letters or numbers.

Andreas Tamás, 23, an ethnic German from the Banat in Romania, a machine gunner in 1943. A lean, dark, serious face with high cheekbones, black hair combed back, heavy dark eyebrows, deep-set brown eyes, a two-day shadow of beard. Calm, watchful, devout. A small plain wooden cross on a leather thong just visible at his open collar.

Uniform, painted accurately: a worn M43 field-grey wool tunic with a field-grey collar, top button undone, plain mouse-grey collar tabs with two short parallel bars, field-grey shoulder straps with thin white piping. On the upper LEFT sleeve, ONE silver-grey chevron (an inverted V of braid, point down) for the rank of Gefreiter. Above the right breast pocket, a small grey woven eagle whose talons hold the sword-and-oak-leaves emblem from emblem.png. A belt of machine-gun ammunition, brass cartridges glinting, slung over one shoulder and across his chest; a field-grey side cap with no badge, worn slightly tilted.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`lorenz.png`** (Gefreiter, transferred from the air force)
```
Portrait, square, head and shoulders, three-quarter view facing slightly left, painted like a hand-coloured 1943 photograph in gouache, bright summer light, plain dark olive background (#3b3d34). No text, letters or numbers.

Ewald Lorenz, 38, a former air force aircraft mechanic transferred to the infantry in 1943. A cheerful, lined, sunburnt face, a big drooping brown moustache with grey in it, laughing crow's feet round small blue eyes, a slightly crooked nose, thinning brown hair. A joker's grin, an unlit pipe in the corner of his mouth.

Uniform, painted accurately: an army M43 field-grey wool tunic with a field-grey collar, collar open over a grey wool shirt, plain mouse-grey collar tabs with two short parallel bars, field-grey shoulder straps with thin white piping. On the upper LEFT sleeve, ONE silver-grey chevron (an inverted V of braid, point down) for the rank of Gefreiter. On his head, his old blue-grey air force side cap (a soft boat-shaped cap) with no badge, pushed back on his head. A smear of engine grease on one cheek. No eagle.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`fink.png`** (Oberschütze, back from a penal company)
```
Portrait, square, head and shoulders, three-quarter view facing slightly right, painted like a hand-coloured 1943 photograph in gouache, hard side light from the right, plain dark olive background (#3b3d34). No text, letters or numbers.

Georg Fink, 26, a German infantryman and black-marketeer in 1943. A broad, strong, heavy-jawed face, a nose broken more than once, a small scar through the left eyebrow, close-cropped dark-blond hair, shrewd grey eyes, a sly, knowing grin. A cigarette tucked behind his ear. Thick neck, big shoulders.

Uniform, painted accurately: a faded, much-mended M43 field-grey wool tunic with a field-grey collar, collar open, sleeves pushed up to the elbows showing hairy forearms, plain mouse-grey collar tabs with two short parallel bars, field-grey shoulder straps with thin white piping. On the upper LEFT sleeve, ONE small round silver-grey pip on a circular field-grey patch, for the rank of Oberschütze. A field-grey side cap with no badge folded under one shoulder strap. A Russian leather map case slung across his chest, bulging with things that are not maps. No eagle.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`kraus.png`** (Grenadier, ammunition carrier)
```
Portrait, square, head and shoulders, three-quarter view facing slightly left, painted like a hand-coloured 1943 photograph in gouache, soft evening light, plain dark olive background (#3b3d34). No text, letters or numbers.

Martin Kraus, 19, a baker's apprentice from Würzburg, an ammunition carrier in 1943. A thin, gentle, pale face, soft brown hair falling over his forehead, large anxious brown eyes, a sensitive mouth, ears that stick out a little. He holds a short pencil and a folded letter against his chest.

Uniform, painted accurately: an M43 field-grey wool tunic with a field-grey collar, slightly too large for his narrow shoulders, plain mouse-grey collar tabs with two short parallel bars, plain field-grey shoulder straps with thin white piping and NO rank insignia. Above the right breast pocket, a small grey woven eagle whose talons hold the sword-and-oak-leaves emblem from emblem.png. A black leather Y-strap over the shoulders. A plain field-grey steel helmet hanging from his belt, just visible at the bottom of the picture.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`dorn.png`** (Unteroffizier, leader of the 2nd squad)
```
Portrait, square, head and shoulders, three-quarter view facing slightly right, painted like a hand-coloured 1943 photograph in gouache, strong summer sun from the right, plain dark olive background (#3b3d34). No text, letters or numbers.

Heinz Dorn, 25, a miner's son from the Ruhr, a bold squad leader in 1943. A hard, handsome, reckless face, a lean jaw with a fresh pink scar along the chin, dark hair cut short at the sides, quick dark eyes, a cocky half-smile. Dust in the creases of his face.

Uniform, painted accurately: a sweat-stained M43 field-grey wool tunic with a field-grey collar, plain mouse-grey collar tabs with two short parallel bars. The rank of Unteroffizier: a band of silver-grey braid running along the edge of the whole collar, and field-grey shoulder straps with thin white piping edged with the same silver-grey braid. Above the right breast pocket, a small grey woven eagle whose talons hold the sword-and-oak-leaves emblem from emblem.png. A short black-white-red ribbon of the Iron Cross 2nd class threaded through the second buttonhole of the tunic. A battered field-grey side cap with no badge, pushed back. The canvas strap of a machine pistol over one shoulder and three long magazine pouches on his belt.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`saal.png`** (Unteroffizier, leader of the 3rd squad)
```
Portrait, square, head and shoulders, three-quarter view facing slightly left, painted like a hand-coloured 1943 photograph in gouache, soft overcast light, plain dark olive background (#3b3d34). No text, letters or numbers.

Wilhelm Saal, 41, a carpenter from Franconia, a reservist squad leader since 1939. A broad, calm, weathered face, deep lines across the forehead, grey stubble, a grey moustache, steady patient brown eyes, big rough hands. A pencil stub behind one ear and a short pipe in his breast pocket.

Uniform, painted accurately: an older M40 field-grey wool tunic with a dark green collar, well worn and neatly mended, plain mouse-grey collar tabs with two short parallel bars. The rank of Unteroffizier: a band of silver-grey braid running along the edge of the whole collar, and field-grey shoulder straps with thin white piping edged with the same silver-grey braid. Above the right breast pocket, a small grey woven eagle whose talons hold the sword-and-oak-leaves emblem from emblem.png. A field-grey steel helmet pushed back on his head, its chin strap hanging. Binoculars on a leather strap round his neck.

Format: square, at least 1024 x 1024 pixels, PNG.
```

#### The camp (captivity track)

**`vera.png`** (Soviet military doctor)
```
Portrait, square, head and shoulders, three-quarter view facing slightly right, painted like a hand-coloured 1943 photograph in gouache, cold grey window light from the right, plain dark olive background (#3b3d34). No text, letters or numbers.

Dr. Vera Lipatova, about 38, a Soviet army doctor running a prison camp hospital in winter 1943. A small, thin, intelligent face, prominent cheekbones, tired grey-green eyes with dark shadows under them, a firm, unsmiling mouth, no make-up. Dark brown hair with a first streak of grey, pulled back tightly under a white cotton cap.

Clothing, painted accurately: a white doctor's coat, washed thin and buttoned to the neck, worn over a padded khaki winter jacket whose quilted collar shows at the throat; the coat hides her shoulders, so no rank is visible. A rubber stethoscope round her neck. Her hands, red from cold water, hold a thin cardboard file against her chest. No badges, no stars, no emblems.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`belov.png`** (NKVD captain)
```
Portrait, square, head and shoulders, three-quarter view facing slightly left, painted like a hand-coloured 1943 photograph in gouache, the warm light of a desk lamp from below left, plain dark olive background (#3b3d34). No text, letters or numbers.

Captain Arkady Belov, about 40, a Soviet security officer and interrogator in 1943. A long, clever, ironic face, a high forehead, dark hair combed straight back with grey at the temples, heavy-lidded dark eyes, a thin mouth with the faintest trace of a smile. A cigarette held between two long fingers, a thin line of smoke rising.

Uniform, painted accurately: a well-fitted khaki wool officer's tunic of 1943 with a standing collar and two breast pockets, stiff shoulder boards in khaki with a single narrow lengthwise stripe and four small plain metal rank pips. A peaked cap with a dark blue crown and a deep red band, with no badge, set straight on his head. No medals, no emblems.

Format: square, at least 1024 x 1024 pixels, PNG.
```

**`wiese.png`** (German prisoner, "Antifa" instructor)
```
Portrait, square, head and shoulders, three-quarter view facing slightly right, painted like a hand-coloured 1943 photograph in gouache, soft summer light, plain dark olive background (#3b3d34). No text, letters or numbers.

Konrad Wiese, 28, a German prisoner of war who now works with the Soviets, summer 1943. A fair, open, earnest face, thin from captivity, short fair hair, round steel-rimmed glasses mended at one hinge with wire, clear blue eyes, an intense, persuasive expression. A worn book held against his chest.

Clothing, painted accurately: his old German field-grey wool tunic, clean and pressed, with EVERY insignia removed: no collar tabs, no shoulder straps, only faint outlines and loose threads where the eagle and the badges used to be. On the left breast a small ribbon bow in three horizontal colours, black, white and red. No other badges, no emblems.

Format: square, at least 1024 x 1024 pixels, PNG.
```

---

## 5. Title image (1 image)

- **File:** `title.webp`
```
A very quiet, dark, atmospheric image for a title screen, wide 16:9. A lone soldier seen from behind, small, walking along an empty country road lined with poplars at dusk, under a heavy grey sky. Muted, melancholic. Most of the image is calm sky and empty space, dark enough that light text could sit on top.
```

---

## 6. Checklist

| Type | Count |
|---|---|
| Scenes | 25 (8 scenes × 3 times of day, plus letter) |
| Portraits | 12 |
| Medals | 17 |
| Title image | 1 |

Put them all in one zip, in any folder structure. The file names are what matter.
