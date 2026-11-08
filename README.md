# Feldgrau

A text-driven life simulator set in the Second World War. You play an ordinary German conscript: you create your own character, live through the war day by day, and make moral choices with real consequences. You can die, be arrested, desert, or survive in many different ways.

## How to play

Open `index.html` in a browser. No build step and no server needed.

**Play online:** https://estalstierna.github.io/SIMWW2/ (once GitHub Pages is enabled). The game works on phones, and you can add it to your home screen to run it like an app.

Choose with the mouse or by tapping, or press **1–4** to pick a choice and **Enter** to continue. Progress is saved automatically in the browser.

## Chapter I: The Corridor (28 August – 3 September 1939)

The first playable week covers the mobilisation in Pomerania and the invasion of Poland through the Polish Corridor and the Tuchel Heath.

- **Character creation:** name, birth year, home town, background and family. These change your starting stats and some events.
- **Prologue:** your life from 1930 to 1939, written from your choices.
- **Time:** 7 days with 3 phases each (morning, afternoon, night).
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

  You also have Reichsmarks to spend, plus a hidden **merit** score that can earn promotion or a decoration.
- **Randomness:** combat choices carry a risk of being wounded, and nights draw random events.
- **Endings:** 6 early endings (killed in action, arrested, breakdown, and three desertion outcomes) and 6 end-of-chapter endings.

## Project structure

```
index.html          screens and layout
css/style.css       styling
js/data/world.js    stats, calendar, places, character creation, prologue
js/data/events.js   scripted story events (one per day and phase)
js/data/pool.js     random events (nights)
js/data/endings.js  endings and the end-of-chapter logic
js/engine.js        state, effects, event selection, saving
js/scenes.js        SVG scene banners and the campaign map
js/ui.js            rendering and input
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
      log: 'Diary entry', next: 'eventId', end: 'endingId' }
  ]
}
```

## Ideas for future chapters

France 1940 · the Eastern Front 1941–43 · home leave and bombing raids · 1944–45 · captivity · coming home, 1945–1950.
