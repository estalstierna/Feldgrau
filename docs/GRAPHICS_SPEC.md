# Feldgrau: Graphics Specification

A complete inventory of every graphic in the game, written so that a designer, or another AI model, can recreate or restyle the assets.

**Status:** today all graphics are drawn in code as SVG:
- scene banners and maps in `js/scenes.js`,
- medals and ribbons in `js/data/medals.js`,
- portraits as initials in `js/ui.js`.

The file names below are the **proposed** names for drop-in replacements. Section 9 describes how they would be wired in. Until then, files placed in `assets/` are not used.

---

## 1. The game in one paragraph

*Feldgrau* is a text-driven life simulator. The player is an ordinary German conscript in the Second World War: Poland 1939, Belgium and France 1940, occupied France 1940. The tone is **realistic, dark and serious**: moral choices, not heroics.

The graphics support the text, they do not compete with it. They should feel like period illustrations, faded photographs or lithographs in an old paybook. Nothing should look like a modern video game.

---

## 2. Rules for all graphics

### 2.1 Content that must NOT appear
- **No regime symbols**:
  - no swastika (Hakenkreuz),
  - no SS runes,
  - no Nazi eagle (Hoheitszeichen),
  - no Reich war flag,
  - no Party badges or armbands.

  This applies to uniforms, buildings, vehicles and medals. Where a historical object carried such a symbol, leave the space **plain** (for example the centre of the Iron Cross).
- **No gore**: no visible wounds, blood or bodies in close-up. Death is shown by absence, distance, silhouette or aftermath.
- **No real, identifiable people.** That includes Hitler, Pétain and others.
- **No text inside images**, except where explicitly specified (the year "1939" on the Iron Cross and the year on the icon). Place names, labels and dates are added by the game.
- **No glorification**: no heroic poses, triumphant lighting or recruitment-poster style.

### 2.2 Visual style
- **Look:** muted, matte, painterly. Think gouache illustration or old lithograph, or silhouettes against a soft sky. Light paper grain is welcome.
- **Detail:** low to medium. The banners are small and sit behind text headers, so legibility of shapes matters more than detail.
- **Figures:** small and distant, mostly silhouettes, never facing the viewer with expressions (except portraits).
- **Uniforms:** German army field grey (feldgrau `#4d5345`), M35 helmet silhouette, rifles (Kar98k), MG 34. French: khaki/mustard brown, Adrian helmet. Polish: olive-khaki, rogatywka cap. Belgian Chasseurs Ardennais: green beret.

### 2.3 Colour palette
These are the game's UI tokens. The images should sit comfortably on them.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#1b1c18` | Page background (almost black, warm) |
| `--paper` | `#e9e1cb` | Cards, text background (aged paper) |
| `--paper-2` | `#ddd3b8` | Secondary paper |
| `--ink` | `#2a2620` | Body text |
| `--ink-soft` | `#5d5648` | Secondary text |
| `--feldgrau` | `#4d5345` | Primary UI colour, uniforms |
| `--accent` | `#7a2e22` | Dates, highlights (oxide red) |
| `--ok` | `#56683f` | Good bars |
| `--warn` | `#b0802d` | Warning bars |
| `--crit` | `#9a2f22` | Critical bars |
| `--line` | `#b9ae90` | Rules and borders |

**Sky colours by time of day** (used in the scene banners):

| Phase | Top of sky | Horizon | Mood |
|---|---|---|---|
| Morning | `#c9b48a` | `#8d8a78` | Pale, dusty, ochre dawn |
| Afternoon | `#b9b29c` | `#7f8576` | Flat, grey-green daylight |
| Night | `#1d2430` | `#0c0f14` | Blue-black, a few stars, warm firelight `#e0913a` / `#f0a040` where noted |

Foreground silhouettes: `#2b2e27` by day and `#06080b` at night. Mid-ground: `#4a4d40` by day and `#0d1117` at night.

### 2.4 Fonts (for reference only; images should not contain text)
- **Special Elite:** typewriter, used for headings and dates.
- **Source Serif 4:** body text.

---

## 3. Technical requirements

| Asset type | Format | Size (px) | Aspect | Background | Max file size |
|---|---|---|---|---|---|
| Scene banner | WebP (plus a PNG fallback if needed) | **1800 × 480** | 3.75 : 1 | Opaque | 150 KB |
| Map | **SVG** (preferred) or PNG | 960 × 750 (PNG) / viewBox `0 0 320 250` (SVG) | 32 : 25 | Opaque | 60 KB |
| Medal (full) | PNG | 256 × 358 (ribbon medals), 256 × 256 (badges) | see 6 | **Transparent** | 40 KB |
| Ribbon bar | **SVG** or PNG | 108 × 33 (PNG @3x) / viewBox `0 0 36 11` | 36 : 11 | Opaque | 5 KB |
| Portrait | WebP | 256 × 256 | 1 : 1 | Opaque, displayed as a circle | 25 KB |
| App icon | SVG + PNG | 512, 192, 180 | 1 : 1 | Opaque | 30 KB |

### 3.1 Safe area for scene banners
Banners are cropped to fill their box:
- **Desktop:** 160 px tall, about 840 px wide. Ratio 5.25 : 1, so the top and bottom are cropped.
- **Phone:** 120 px tall, about 390 px wide. Ratio 3.25 : 1, so the sides are cropped.

Keep every important element inside the **central 60 % horizontally** and the **middle 70 % vertically**. The horizon should sit between 55 % and 75 % of the height.

---

## 4. Scene banners (25 files)

Each scene has three versions: `morning`, `afternoon` and `night`.

**File names:** `assets/scenes/scene-<scene>-<phase>.webp`, for example `assets/scenes/scene-camp-night.webp`.

One scene is used across several countries (for example `village` appears in Poland, Belgium and France). Keep it **generic European-rural** unless a chapter variant is made (see 4.10).

### 4.1 `camp`: field camp under pines
- **Used:** 24 times.
- **Example events:** Roll Call in the Pines, First Night, The Order, Fall Gelb, Taking Stock, Political Instruction, A Deputy, Skat in the Guardroom.
- **Content:** a pine forest edge. Three or four canvas army tents (triangular) in a clearing, a supply truck half-hidden under branches, a rifle stack.
- **Night:** a single shaded campfire or lantern glow between the tents (warm orange). Stars.
- **Mood:** waiting, tired, crowded, quiet.

### 4.2 `forest`: dense pine forest
- **Used:** 7 times.
- **Example events:** Vogel's Secret, Sentry Duty, The Voice from London, Shadows, Felled Trees, Ambush on the Forest Road, Live Grenade Drill.
- **Content:** two layers of pines, dark foreground trunks, a narrow sandy track disappearing between them. Optionally a felled trunk across the track.
- **Night:** almost black, cold blue moonlight through the trees.
- **Mood:** enclosed, watchful, danger off-screen.

### 4.3 `field`: open field, wire, fog
- **Used:** 11 times.
- **Example events:** Digging In, 04:45 (invasion of Poland), Onhaye (tank counterattack), Flavion, Burial Detail, Stukas at Dusk, NCO course, Final Examination, Paper from the Sky, The Range at Wahn.
- **Content:** a flat stubble or wheat field, a distant tree line, a low fog band across the middle, a row of fence posts with sagging barbed wire in the foreground. Optionally a distant shell burst or smoke column (small, no flash).
- **Morning:** heavy ground fog.
- **Night:** a flare in the sky casting a pale light.
- **Mood:** exposure, nowhere to hide.

### 4.4 `village`: farm village
- **Used:** 17 times.
- **Example events:** Frau Kruse's Eggs, The Wounded Pole, Freischärler, An Empty Farm, The Widow of 1914, Smoke, Prisoners on the Far Bank, The Man in the Cellar, The Billet, The Eleventh of November, Yellow Posters, Market Day, Fire!.
- **Content:** a row of four or five modest farmhouses and barns with pitched roofs, a well or pump, a dirt road. One chimney with a thin smoke plume. A distant church spire.
- **Night:** one or two windows dimly lit (warm), the rest dark.
- **Mood:** ordinary lives disturbed. Civilian, not military.

### 4.5 `road`: road with refugees or a column
- **Used:** 5 times.
- **Example events:** Refugees on the Road, Sunday Broadcast, The Column, Tirailleurs, Encore.
- **Content:** a straight road in perspective, lined with poplars, receding to the horizon. Small silhouettes of a horse-cart, a handcart and walking figures carrying bundles. Keep it ambiguous whether they are refugees or soldiers.
- **Night:** an empty road, moonlit.
- **Mood:** displacement, endless movement.

### 4.6 `river`: river gorge (the Meuse; also the Channel harbour and the Cher)
- **Used:** 9 times.
- **Example events:** Above the Meuse, The Night Before the River, Rubber Boats, A Morning by the River, The Barges (Boulogne), Air Raid, Postponed, Footprints at the Ford, Lights on the River.
- **Content:** a broad slow river with grey limestone cliffs on both sides. A small town of stone houses and a church tower on the far bank. A small inflatable boat with seated silhouettes in the water (small, mid-river).
- **Night:** smoke over the town and orange glow from burning houses reflecting in the water.
- **Mood:** an obstacle, a crossing, being exposed on water.

### 4.7 `city`: Paris rooftops
- **Used:** 15 times.
- **Example events:** Tourists in Field Grey, The Bouquiniste, Pigalle, Quatorze Juillet, Rue des Rosiers, Sattler's Offer, The Daily Parade, Last Night in Paris, The Last Métro, Students.
- **Content:** a skyline of Haussmann-style roofs with chimneys and mansard windows. The Eiffel Tower small in the right third. No flags on buildings.
- **Night:** blackout: dark roofs, a few chinks of warm light, stars.
- **Mood:** beautiful, empty, occupied.

### 4.8 `bridge`: the demarcation-line bridge on the Cher
- **Used:** 10 times.
- **Example events:** The Bridge on the Cher, Lenz Arrives, Papers, The Missing Rifle, The Duty Roster, Inspection, Lenz's Hunch, Night on the Cher (climax), A Cold Night.
- **Content:** a long stone bridge of seven arches over a calm river. On the near bank (left), a small wooden sentry hut and a red-and-white striped barrier pole. Bare winter trees. Far bank lower and greener. A distant mill.
- **Night:** a lantern glow at the hut, mist on the water.
- **Mood:** a border inside one country. Quiet, tense.

### 4.9 `letter`: letters, paperwork (one file is enough)
- **Used:** 7 times.
- **Example events:** Feldpost, Field Post Card, Christmas Leave, A Letter in French, News from Home, A Parcel Home, Pohl's Letter.
- **Content:** a top-down still life on a dark wooden table: a handwritten letter on yellowed paper (illegible scribble, no real words), an envelope with a plain stamp shape (no symbols), a pencil, maybe a small photograph face-down.
- **File:** `scene-letter.webp` (no phase variants needed; optionally `-night` with candlelight).

### 4.10 Optional chapter variants (not required)
To make places more specific, an extra suffix can be added:
- `scene-village-poland-<phase>.webp`: wooden houses, thatched roofs.
- `scene-village-belgium-<phase>.webp`: grey stone, slate.
- `scene-village-france-<phase>.webp`: stone, shutters, a war memorial.

The game would use a chapter variant if it exists and fall back to the generic one otherwise.

---

## 5. Campaign maps (3 files)

**File names:** `assets/maps/map-<id>.svg`.

**Coordinates matter.** The game draws the player's route, the visited dots and the pulsing "you are here" marker *on top of* the map at the coordinates below, using the viewBox `0 0 320 250`. A replacement map must keep every place and town at these exact coordinates. Geography may be schematic: it does not need to be geodetically correct.

**Style:** hand-drawn period staff-map feel.

| Element | Colour or style |
|---|---|
| Land | `#d4c9a8` |
| Sea | `#9fb0aa` |
| Rivers | `#6f8f98`, about 2 px |
| Borders | `#6b2a20`, dashed |
| Country names | Spaced capitals in `#8d8266` |
| Town dots | `#3d382c` |

The town labels may be part of the map, or can be left off, in which case the game adds them.

### 5.1 `map-poland.svg`: Pomerania and the Polish Corridor, 1939 (Chapter I)
- **Geography:**
  - Baltic coast across the top.
  - The German–Polish border running roughly north–south at x ≈ 168–190.
  - The East Prussian border on the right.
  - The Vistula from Danzig (top) south through Schwetz and Bromberg.
  - The word "CORRIDOR" rotated along the strip between the borders.
- **Country labels:** GERMANY (left), POLAND (bottom), EAST PRUSSIA (right).

**Towns:**

| Town | x | y |
|---|---|---|
| Stettin | 28 | 108 |
| Hammerstein | 130 | 146 |
| Konitz | 192 | 150 |
| Danzig | 258 | 50 |
| Gdingen | 232 | 44 |
| Bromberg | 250 | 200 |
| Schwetz | 254 | 168 |

**Route stops (drawn by the game):**

| Stop | x | y |
|---|---|---|
| Camp near Hammerstein | 140 | 150 |
| Border | 178 | 152 |
| Konitz | 192 | 150 |
| Tuchel Heath | 222 | 140 |
| Vistula near Schwetz | 252 | 168 |

### 5.2 `map-france.svg`: the Ardennes and the Meuse, 1940 (Chapter II)
- **Geography:**
  - North Sea in the top-left corner.
  - The German border on the right (x ≈ 270).
  - Luxembourg as a small enclosed area bottom-right.
  - The French–Belgian border running from the left edge (y ≈ 140) to Luxembourg.
  - The Meuse: from the bottom (Sedan) north through Dinant to Namur, then east to Liège.
- **Labels:** BELGIUM, FRANCE, GERMANY (rotated), LUX., MEUSE (along the river).

**Towns:**

| Town | x | y |
|---|---|---|
| Namur | 156 | 80 |
| Liège | 216 | 56 |
| Dinant | 150 | 116 |
| Philippeville | 116 | 136 |
| Avesnes | 72 | 152 |
| Sedan | 174 | 197 |
| Bastogne | 222 | 150 |
| St. Vith | 258 | 110 |
| Prüm | 292 | 112 |
| Brussels | 70 | 52 |

**Route stops:**

| Stop | x | y |
|---|---|---|
| Eifel | 286 | 112 |
| Belgian border | 262 | 118 |
| Ardennes | 222 | 128 |
| Heights above the Meuse | 163 | 112 |
| Houx / Dinant | 152 | 108 |
| Onhaye | 140 | 120 |
| Flavion | 122 | 130 |
| French frontier | 98 | 146 |

### 5.3 `map-occupied.svg`: occupied France, 1940 (Chapter III)
- **Geography:**
  - The English Channel across the top-left.
  - The Atlantic down the left edge.
  - The Loire and the Cher.
  - The **demarcation line** as a dashed red line running from the right edge (Swiss border) west past Vierzon, then south along the Atlantic side.
- **Labels:** OCCUPIED ZONE (north), VICHY FRANCE (south), "Loire", "Cher".

**Towns:**

| Town | x | y |
|---|---|---|
| Paris | 168 | 72 |
| Boulogne | 120 | 18 |
| Fontainebleau | 176 | 92 |
| Tours | 100 | 128 |
| Vierzon | 160 | 150 |
| Vichy | 200 | 196 |
| Saint-Avit (fictional) | 140 | 150 |

**Route stops:**

| Stop | x | y |
|---|---|---|
| Paris | 168 | 72 |
| NCO course | 176 | 92 |
| Boulogne | 120 | 18 |
| Saint-Avit-sur-Cher | 140 | 150 |

---

## 6. Decorations: medals and ribbons (15 decorations)

Every decoration needs **two** images:

1. **Full medal:** `assets/medals/medal-<id>.png`. Transparent background, shown at 26–90 px tall.
2. **Ribbon bar:** `assets/medals/ribbon-<id>.svg`. Only for decorations of kind *ribbon*, shown at 36 × 11 px on the paybook card.

**Ribbon medals** (kind: ribbon) hang from a short ribbon. The composition is a ribbon rectangle at the top (about 35 % of the height), a small grey suspension ring, and the medal below. Canvas 256 × 358.

**Badges** (kind: badge) are pinned to the tunic without a ribbon. Canvas 256 × 256, or taller for oval badges.

Ribbon stripes are given left to right as **colour : relative width**. They are symmetrical.

| ID | Name (English / German) | Kind | Ribbon stripes | Medal design (with regime symbols omitted) |
|---|---|---|---|---|
| `sudeten` | Sudetenland Medal / *Medaille zur Erinnerung an den 1. Oktober 1938* | ribbon | `#b3262a`:2, `#f2f2f2`:1, `#111111`:10, `#f2f2f2`:1, `#b3262a`:2 | Round bronze-coloured medal, plain or with a simple wreath. **No eagle.** |
| `westwall` | West Wall Medal / *Deutsches Schutzwall-Ehrenzeichen* | ribbon | `#f2f2f2`:2, `#7a4a26`:12, `#f2f2f2`:2 | Oval bronze medal showing a simple bunker shape with a crossed sword and spade. **No eagle.** |
| `ek2` | Iron Cross, 2nd Class / *Eisernes Kreuz 2. Klasse* | ribbon | `#111111`:3, `#f2f2f2`:2, `#b3262a`:6, `#f2f2f2`:2, `#111111`:3 | Black cross pattée with a silver frame. **Centre left plain black.** "1939" in small silver numerals on the **lower arm**. Hangs from the ribbon. |
| `ek1` | Iron Cross, 1st Class / *Eisernes Kreuz 1. Klasse* | badge | none | The **same cross**, but **no ribbon**: shown pinned to a patch of field-grey breast-pocket cloth (`#5d6352`) with visible stitching and a pocket button above. This is how it differs visually from the 2nd Class. |
| `isa` | Infantry Assault Badge (silver) / *Infanterie-Sturmabzeichen* | badge | none | Vertical oval wreath of oak leaves in silver. A Kar98k rifle with fixed bayonet runs diagonally (bottom-left to top-right) across it. A small ribbon tie at the bottom. **No eagle at the top**; leave the top of the wreath closed. |
| `kvk2` | War Merit Cross, 2nd Class with Swords / *Kriegsverdienstkreuz 2. Kl. mit Schwertern* | ribbon | `#b3262a`:3, `#f2f2f2`:2, `#111111`:6, `#f2f2f2`:2, `#b3262a`:3 | Bronze cross with straight, flared arms and a raised border, a small round centre medallion (**plain**), and two crossed swords behind the cross. |
| `kvk2ns` | War Merit Cross, 2nd Class / *Kriegsverdienstkreuz 2. Kl. ohne Schwerter* | ribbon | same as `kvk2` | Same bronze cross, **without swords**. |
| `rescue` | Life Saving Medal / *Medaille für Rettung aus Gefahr* | ribbon | `#f2f2f2`:2, `#d0562e`:12, `#f2f2f2`:2 | Round silver medal, plain face with a simple laurel border. |
| `longservice4` | Long Service Award, 4 Years / *Wehrmacht-Dienstauszeichnung 4. Klasse* | ribbon | `#5f86c8`:1 (solid cornflower blue) | Round matte silver medal with a raised "4" (the one allowed numeral). **No eagle.** |
| `schnur1` | Marksmanship Lanyard, 1st Grade / *Schützenschnur, 1. Stufe* | badge | none | A braided silver-grey cord in a U-shaped loop hanging from a short shoulder bar. No acorns. |
| `schnur2` | Marksmanship Lanyard, 2nd Grade | badge | none | Same lanyard with **one** small silver acorn at the bottom. |
| `schnur3` | Marksmanship Lanyard, 3rd Grade | badge | none | Same lanyard with **two** small silver acorns. |
| `wound_black` | Wound Badge in Black / *Verwundetenabzeichen in Schwarz* | badge | none | Vertical oval, laurel-wreath edge, a steel helmet in profile in the centre above two crossed swords. Black lacquer finish. **Helmet plain, no symbol.** |
| `wound_silver` | Wound Badge in Silver | badge | none | Same design in matte silver. |
| `wound_gold` | Wound Badge in Gold | badge | none | Same design in matte gold `#c9a240`. |

**Display rules (handled by the game):** higher grades hide lower grades of the same decoration:
- `wound_silver` hides `wound_black`,
- `wound_gold` hides `wound_silver`,
- `schnur2` hides `schnur1`,
- `schnur3` hides `schnur2`.

Ribbons on the bar are ordered by importance: `ek2`, `kvk2`, `kvk2ns`, `rescue`, `sudeten`, `westwall`, `longservice4`.

---

## 7. Portraits (13 files, optional; currently shown as initials in a circle)

**File names:** `assets/portraits/<id>.webp`, 256 × 256, displayed as a 34 px circle in the Comrades and Squad panels.

**Style:**
- Head and shoulders, three-quarter view.
- Muted painted look, like a hand-coloured period photograph.
- Neutral dark background `#3b3d34`.
- No insignia beyond plain shoulder straps.

**German soldiers** (field-grey tunic, M35 helmet or side cap):

| ID | Name | Age | Description |
|---|---|---|---|
| `hartmann` | Willi Hartmann | 22 | Hamburg docker's son. Lanky, crooked grin, cap pushed back, cigarette behind the ear. Machine gunner, joker. |
| `lenz` | Karl Lenz | 22 | Former Hitler Youth leader, now military police. Neat, pale, thin lips, very correct posture. From Chapter III wears the Feldgendarmerie metal gorget: a crescent plate on a chain, shown **blank**. |
| `rau` | Fritz Rau | 19 | The "choirboy". Round, very young face, big ears, uniform slightly too large. |
| `vogel` | Ernst Vogel | 22 | Swabian farm boy. Stocky, anxious eyes, sunburnt neck. |
| `brandt` | Paul Brandt | 35 | Twelve-year regular. Square jaw, cropped grey-flecked hair, face "like a closed door". NCO braid on the collar. |
| `albrecht` | Joachim von Albrecht | 23–24 | Junker's son, officer. Fine features, a small duelling scar on the left cheek, peaked officer's cap. |
| `sattler` | Bruno Sattler | 28 | Berliner. Sharp, amused face, slicked hair, knowing half-smile. |
| `pohl` | Gustav Pohl | 41 | Reservist plumber, four children. Moustache, tired kind eyes, thinning hair. |
| `kuehn` | Heinz Kühn | 20 | Former Hitler Youth leader. Blond, hard stare, very straight. |
| `brenner` | Josef Brenner | 24 | Bavarian farmhand. Huge, broad face, calm, slow expression. |

**French civilians:**

| ID | Name | Age | Description |
|---|---|---|---|
| `claire` | Claire Girard | 20 | Village schoolteacher. Dark hair pinned up, cardigan, guarded, intelligent look. |
| `madame` | Madame Girard | 50 | War widow. Black dress, grey hair in a bun, arms folded, unforgiving eyes. |

**Optional:**

| ID | Name | Description |
|---|---|---|
| `kowalczyk` | Max Kowalczyk | 30, Ruhr miner's son, cheerful broad face. Mentioned in Chapter II but not yet shown in the panels. |

---

## 8. App icons and title (current files)

| File | Format | Size | Description |
|---|---|---|---|
| `icon.svg` | SVG | viewBox 512 | A field-grey square (`#4d5345`), a dark M35 helmet silhouette in the centre, and "1939" in typewriter numerals in paper colour (`#e9e1cb`) below it. |
| `icon-180.png` | PNG | 180 × 180 | Apple touch icon, rendered from `icon.svg`. |
| `icon-192.png` | PNG | 192 × 192 | PWA icon. |
| `icon-512.png` | PNG | 512 × 512 | PWA icon. Keep the helmet inside the central 80 % (maskable safe zone). |

**Optional new asset:** `assets/title.webp`, 1600 × 900, a quiet atmospheric image for behind the title card. A lone soldier seen from behind at dusk on a country road, or an empty field with a distant tree line. It must stay dark enough for paper-coloured text to sit on top.

---

## 9. Integration notes (for the developer)

Proposed folder structure:

```
assets/
  scenes/    scene-<scene>-<morning|afternoon|night>.webp, scene-letter.webp
  maps/      map-poland.svg, map-france.svg, map-occupied.svg
  medals/    medal-<id>.png, ribbon-<id>.svg
  portraits/ <id>.webp
  title.webp
```

To wire these in:

- **Scenes:** in `SIM.sceneSVG()` (`js/scenes.js`), return an `<img src="assets/scenes/scene-${scene}-${phase}.webp" onerror="…">` that falls back to the current SVG drawing when the file is missing. Phase index: 0 = morning, 1 = afternoon, 2 = night.
- **Maps:** in `SIM.mapSVG()`, replace `m.base` with an `<image href="assets/maps/map-${id}.svg" width="320" height="250"/>` inside the same SVG. The route and markers are drawn over it.
- **Medals:** in `SIM.badgeSVG()` and `SIM.ribbonSVG()` (`js/data/medals.js`), use the image when it exists.
- **Portraits:** in `panelHTML()` (`js/ui.js`), replace the initials `<span class="avatar">` with `<img class="avatar" src="assets/portraits/${id}.webp">`. Keep the initials as a fallback.

---

## 10. Checklist

| Category | Count | Files |
|---|---|---|
| Scene banners | 25 | 8 scenes × 3 phases + 1 letter (+ optional chapter variants) |
| Maps | 3 | poland, france, occupied |
| Medals | 15 full images + 7 ribbon bars | see section 6 |
| Portraits | 12 (+1 optional) | see section 7 |
| App icons | 4 | existing, may be restyled |
| Title image | 1 | optional |
