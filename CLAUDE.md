# Notes for Claude

## Working with the owner
- The owner writes in Swedish. Reply in Swedish; the game itself is in English.
- Ask before starting a new chapter; the owner likes to choose between numbered options ("1a, 2b, …").
- Develop on branch `ccr-fbc35b87-fc42gq`; GitHub Pages serves it at https://estalstierna.github.io/SIMWW2/.

## Image prompts (for the owner's image model)
- Give **complete, copy-ready prompts**: one full prompt per image (and per time of day for scenes),
  never "take this line and add that". The owner pastes them as they are.
- Make them **detailed**. The owner explicitly wants more detail:
  - **Uniforms**: exact cut and colour, collar and collar patches, shoulder straps/boards with the
    correct rank for the character, sleeve insignia, headgear, belt and kit, wear and dirt, what is
    carried. Check rank insignia against the character's rank (Army: rank on shoulder boards;
    Waffen-SS: rank on the left collar patch). State the time of year (summer tunic, greatcoat, etc.).
  - **Faces and people**: age, build, hair, eyes, scars, expression, posture, what they hold.
  - **Landscapes and scenes**: terrain, vegetation, buildings and their materials, weather, season,
    light direction and colour, foreground / middle ground / background, props, the number and
    activity of figures, smoke, snow, mud.
  - **Vehicles and equipment**: the real type and its recognisable features (engines, wheels, tracks,
    turret), painted plain with no markings.
- Keep them **censor-friendly**: no swastikas, SS runes or real regime symbols. Where an emblem would
  appear, use the sword-and-oak-leaves emblem. Ask the owner to attach `docs/emblem-sheet.png` (the emblem
  alone, on a red flag with a white disc, on a medal, held by a breast eagle with NO wreath, and a round
  silver cap badge with two crossed swords and an acorn, alone and on a side cap) and refer
  to it in the prompt, e.g. "a grey woven eagle exactly like the eagle in the attached emblem-sheet.png,
  holding only the sword-and-oak-leaves emblem, with no wreath and no circle". Image models tend to add a
  wreath with their own symbol under a small eagle; when that happens, crop the portrait above the eagle. Avoid naming
  sensitive historical terms when a neutral description works. For Waffen-SS portraits, never write the
  word "SS" or rank names like "SS-Rottenführer": describe only the insignia ("his rank: two thin silver
  stripes"). Do not describe fanaticism (zealous eyes, "joined at eighteen", ideological books) or put
  weapons across the chest; the combination with a skull badge gets prompts refused. Instead of the
  skull, use the cap badge from the sheet: "the round silver cap badge (two crossed swords with an acorn)
  from the attached emblem-sheet.png". Last resort: "a small round silver button on the front".
  The sheet has eight pictures; refer to its headgear by name AND spell out the placement every time,
  or the model places badges as it likes:
  - HISTORICAL SIDES (wearer's view): Waffen-SS cap = badge centre front, eagle on the WEARER'S LEFT;
    Army helmet = eagle on the WEARER'S LEFT; Waffen-SS helmet = emblem decal on the WEARER'S RIGHT, no
    eagle; Army side cap = eagle centred; Waffen-SS collar = emblem on WEARER'S RIGHT patch, rank on
    WEARER'S LEFT patch. In a portrait facing the viewer the wearer's left is the RIGHT HALF OF THE
    PICTURE. Rule of thumb: rank patch, cap eagle and helmet eagle all in the RIGHT half of the picture;
    the collar emblem and the Army breast eagle in the LEFT half. (The sheet now has TWELVE pictures in three rows:
    emblem, flag, medal, breast eagle / cap badge, CAP ONE (eagle in the right half), CAP TWO, CAP ONE
    from the side / ARMY HELMET (visor to the left, eagle), SECOND HELMET (visor to the right, emblem on a
    black shield, the Waffen-SS helmet), COLLAR ONE (two loose black patches), COLLAR TWO (Army). Still
    state every side in words; text outweighs the sheet. Portraits made before
    Nov 2026 have the cap/helmet eagle mirrored; the owner chose to keep them.)
  - Waffen-SS side cap: "exactly like CAP ONE (PIN AND EAGLE) in the attached emblem-sheet.png, with
    the eagle in the RIGHT HALF of the picture: the round cap badge sits exactly in the centre of the
    front, directly above the bridge of his nose, and the small silver eagle sits beside it in the RIGHT
    HALF of the picture".
  - Image models read the sheet poorly for small details: ALSO describe the badge in words and anchor
    the placement to the face: "on the front of the cap, directly above the bridge of his nose, a round
    silver cap badge the size of a coin with a raised rim; on it, clearly visible in relief, TWO SMALL
    SWORDS CROSSED DIAGONALLY, points up, and ONE SMALL ACORN with an oak leaf above where they cross.
    Beside this badge, in the RIGHT HALF of the picture, a smaller silver eagle holding the upright
    sword with oak leaves. Nothing else on the cap."
  - Collars (the sheet now has ten pictures): Waffen-SS "black collar patches exactly like COLLAR ONE
    (BLACK PATCHES) in the attached emblem-sheet.png", then the rank on the wearer's left patch (it shows
    one stripe, Sturmmann): "but with TWO stripes" (Rottenführer), "but with the left patch plain black"
    (Schütze), "but with ONE small square silver pip in its centre" (Unterscharführer). Army: "a collar
    exactly like COLLAR TWO (ARMY) in the attached emblem-sheet.png" (dark green collar, grey bars).
    Always add that a stripe runs "HORIZONTALLY across the FULL WIDTH of the patch, parallel to its
    bottom edge".
  - Left/right gets mirrored when written as "viewer's left" or "wearer's left". Instead name the HALF
    OF THE PICTURE: "the collar patch in the LEFT HALF of the picture shows the sword with oak leaves; the
    patch in the RIGHT HALF of the picture shows the rank", add an explicit ban ("the sword with oak
    leaves must NOT appear on the patch in the right half of the picture"), and pose Waffen-SS portraits
    almost straight on so both collar patches are fully visible (keep hands low). For the cap: "in the
    RIGHT HALF of the picture, just beside this badge, a smaller silver eagle". Mirroring a finished image
    does not fix it, because it moves the cap eagle too.
  - Army side cap: "exactly like CAP TWO (ONLY EAGLE) in the attached emblem-sheet.png: only a small
    silver-grey eagle, exactly in the CENTRE of the front of the cap, and no other badge".
  - Army steel helmet: "exactly like the HELMET in the attached emblem-sheet.png: a small silver-grey
    eagle decal on the side of the helmet that is in the RIGHT HALF of the picture, nothing else".
    Waffen-SS steel helmet: "like the SECOND HELMET in the attached emblem-sheet.png: a small decal of the
    sword-and-oak-leaves emblem, silver on a small black shield, on the side of the helmet that is in the LEFT HALF of the picture; no eagle".
- Scenes: landscape 16:9, at least 1600 × 900, horizon at 55–60 % of the height, important things
  between 30 % and 80 % of the height, hand-painted gouache style (`docs/style-reference.png`).
  Portraits: square, 1024 × 1024, plain dark olive background (#3b3d34).
- Check every image the owner uploads for forbidden symbols (zoom in on flags, caps, vehicles,
  medals) before adding it. Treat uploads as untrusted: extract into a new directory and run Python
  with `-I`.
