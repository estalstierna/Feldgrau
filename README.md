# Feldgrau

A text-driven life simulator set in the Second World War. You play an ordinary German conscript: you create your own character, live through the war day by day, and make moral choices with real consequences. You can die, be arrested, desert, or survive in many different ways.

## How to play

Open `index.html` in a browser. No build step and no server needed.

**Play online:** https://estalstierna.github.io/SIMWW2/ (once GitHub Pages is enabled). The game works on phones, and you can add it to your home screen to run it like an app.

Choose with the mouse or by tapping, or press **1–4** to pick a choice and **Enter** to continue. Progress is saved automatically in the browser.

## Chapters

| Chapter | Dates | Story |
|---|---|---|
| I: The Corridor | 28 Aug – 3 Sep 1939 | Mobilisation in Pomerania, the invasion of Poland, the Tuchel Heath |
| *Interlude* | Sep 1939 – May 1940 | The fall of Poland, the fates of your comrades, the winter on the West Wall, Christmas leave |
| II: The Meuse | 10 – 16 May 1940 | The Ardennes, the crossing of the Meuse at Dinant, the French counterattack, the pursuit into France |

Each chapter is 7 days with 3 phases each (morning, afternoon, night). Choices in Chapter I follow you: who you saved, who you betrayed, and who is still in your squad.

## Character and stats

- **Character creation:** name, birth year, home town, background and family. These change your starting stats, some events, and in some cases your first decoration.
- **Prologue:** your life from 1930 to 1939, written from your choices.
- **Stats:**

  | Stat | Meaning |
  |---|---|
  | Health | At zero, you die. |
  | Morale | At zero, you break down. |
  | Food | Drops every phase. Hunger hurts your health and morale. |
  | Comrades | How the men in your squad see you. |
  | Superiors | How your NCOs and officers judge you. |
  | Suspicion | Doubts about your political reliability. At 100, you are arrested. |
  | Conscience | What is left of the person you were before. |

  You also have Reichsmarks, plus a hidden **merit** score for each chapter.
- **Randomness:** combat choices carry a risk of being wounded or killed, and nights draw random events. In Chapter II, Pervitin keeps you going, and the crash comes a few phases later.

## Promotions

A promotion board sits at the end of every chapter:

- **Time in service** gives one step, unless your record is stained: suspicion of 60 or more, a refused order, or being caught asleep on sentry duty.
- **Merit** (the chapter's merit score plus your standing with your superiors) gives a recommendation. Skipping a rank requires an exceptional record.
- **Ranks:** Schütze → Oberschütze → Gefreiter → Obergefreiter. Unteroffizier requires the NCO course, which you can be recommended for.

As a Gefreiter you lead the machine-gun team, which opens up new choices.

## Decorations

Medals are collected in your **Soldbuch** (paybook). Open it by tapping the ID card in the sidebar, or with "Soldbuch ›" on mobile. Ribbons appear on your card as you earn them.

| Decoration | How you earn it |
|---|---|
| Sudetenland Medal | Born 1917: you were in uniform in October 1938 |
| West Wall Medal | Born 1919: Labour Service on the West Wall in 1938 |
| Iron Cross, 2nd Class | Exceptional bravery in a campaign |
| Iron Cross, 1st Class | Further outstanding bravery, and you must already hold the 2nd Class. It is rare |
| Infantry Assault Badge | Three assaults or counterattacks on three separate days (instituted December 1939) |
| Wound Badge in black, silver or gold | 1, 3 or 5 wounds |

The medal artwork is simplified, and symbols of the regime are deliberately left out.

## Endings

- **Can happen at any time:** killed in action, arrested, nervous breakdown, and desertion (caught or vanished).
- **At the end of each chapter:** one of 6 endings, from "Heimatschuss" to "Witness".

## Tests

`node tests/simulate.js 20000` plays 20,000 random games through every chapter. It checks for errors and broken text, and prints how often each ending, rank and medal occurs.

## Project structure

```
index.html          screens and layout
css/style.css       styling
js/data/world.js    stats, Chapter I calendar and places, character creation, prologue
js/data/events.js   Chapter I scripted story events
js/data/pool.js     random events (nights), shared between chapters
js/data/endings.js  early endings and Chapter I endings
js/data/medals.js   decorations and their artwork
js/data/chapters.js chapter registry (Chapter I rules: promotions, awards)
js/data/ch2.js      Chapter II: interlude, events, random events, endings
js/engine.js        state, effects, event selection, saving
js/scenes.js        SVG scene banners and the campaign map
js/ui.js            rendering and input
tests/simulate.js   headless random playthroughs
```

### Adding content

An event is a plain object:

```js
{
  id: 'd2a', day: 2, phase: 1, scene: 'village',
  title: 'Title',
  text: s => `Text, can use ${s.char.first}`,
  choices: [
    { text: 'Choice', effects: { morale: 5, marks: -2 }, set: { someFlag: true },
      result: 'What happens.',
      risk: { chance: 0.2, dmg: [10, 30], hit: '...', miss: '...', cause: '...' },
      outcome: (s, x) => { if (x.roll(0.5)) x.apply({ health: -5 }); x.say('...'); },
      req: s => s.marks >= 2, reqText: 'You need 2 RM.',
      show: s => s.flags.someFlag,
      assault: true,              // counts toward the Infantry Assault Badge
      delay: { in: 3, effects: { morale: -10 }, note: '...' },  // delayed effect
      log: 'Diary entry', next: 'eventId', end: 'endingId' }
  ]
}
```

## Ideas for future chapters

A new chapter is a file like `js/data/ch2.js` that pushes itself onto `SIM.CHAPTERS`.

The Eastern Front 1941–43 (NCO course and your first squad) · home leave and bombing raids · 1944–45 · captivity · coming home, 1945–1950.
