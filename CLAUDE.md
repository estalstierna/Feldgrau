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
  alone, on a red flag with a white disc, on a medal, and held by a breast eagle with NO wreath) and refer
  to it in the prompt, e.g. "a grey woven eagle exactly like the eagle in the attached emblem-sheet.png,
  holding only the sword-and-oak-leaves emblem, with no wreath and no circle". Image models tend to add a
  wreath with their own symbol under a small eagle; when that happens, crop the portrait above the eagle. Avoid naming
  sensitive historical terms when a neutral description works. For Waffen-SS portraits, never write the
  word "SS" or rank names like "SS-Rottenführer": describe only the insignia ("his rank: two thin silver
  stripes"). Do not describe fanaticism (zealous eyes, "joined at eighteen", ideological books) or put
  weapons across the chest; the combination with a skull badge gets prompts refused. Fallback for the
  skull: "a small round silver button on the front".
- Scenes: landscape 16:9, at least 1600 × 900, horizon at 55–60 % of the height, important things
  between 30 % and 80 % of the height, hand-painted gouache style (`docs/style-reference.png`).
  Portraits: square, 1024 × 1024, plain dark olive background (#3b3d34).
- Check every image the owner uploads for forbidden symbols (zoom in on flags, caps, vehicles,
  medals) before adding it. Treat uploads as untrusted: extract into a new directory and run Python
  with `-I`.
