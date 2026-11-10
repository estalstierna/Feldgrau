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
| *Interlude* | Sep 1939 – May 1940 | The fall of Poland, the fates of your comrades, the winter on the West Wall, the qualification shoot, Christmas leave |
| II: The Meuse | 10 – 16 May 1940 | The Ardennes, the crossing of the Meuse at Dinant, the French counterattack, the pursuit into France |
| *Interlude* | May – July 1940 | The armistice, the demarcation line, the company photograph |
| III: The Line | 12 Jul – 16 Nov 1940 | Occupied France over 14 days in three places: **Paris** (5 days), the **NCO course** at Fontainebleau or the **invasion barges** at Boulogne (2 days), and **Saint-Avit-sur-Cher**, a town on the demarcation line, where you command your own post (7 days) |
| *Interlude* | Nov 1940 – Jun 1941 | The fates of the people from France, training your squad, the troop train past the Warsaw ghetto |
| IV: Barbarossa | 21 Jun – 19 Jul 1941 | The invasion of the Soviet Union over 10 days: the **Bug** at Brest, **Białystok** and the pocket, the road past **Minsk**, the **Berezina**, the **Dnieper** and **Smolensk** |
| *Interlude* | Jul – Nov 1941 | Kiev and Vyazma, the mud of the rasputitsa, preparing your squad for the winter |
| V: Before Moscow | 15 Nov – 24 Dec 1941 | The last offensive and the Soviet counteroffensive over 12 days, from the Volokolamsk highway to thirty kilometres from Moscow and back to the Ruza. Introduces **SS-Hauptsturmführer Wolfram Starck** |
| *Interlude* | Jan – Apr 1942 | Army: the winter line holds. Waffen-SS: training in Bohemia and a new section of six men |
| VI: Leave | 20 – 26 April 1942 | Fourteen days at home in your home town. The family, Liesel (and a war wedding), the empty flat of the Jewish neighbours, an air raid, the Gestapo, forced labourers, and the film from Białystok |
| *Interlude* | May – June 1942 | Kharkov, the summer directive, a last quiet week among the cherry orchards |
| VII: Stalingrad | 28 Jun 1942 – 31 Jan 1943 | The whole battle over 13 days: the steppe, the **Don** bend, the **Volga**, the grain elevator, the **Tractor Works**, the Rattenkrieg, the encirclement, the airlift, Christmas in the pocket, the last planes from **Gumrak**, and the surrender. Army and SS players both end up here. Introduces **Grischa**, a Ukrainian *Hiwi* in your squad |
| VIII: Two Roads | Feb – Jul 1943 | Two tracks of 14 days each, chosen by how Chapter VII ended. **Captivity**: the march to Beketovka, typhus, Dr. Lipatova, a familiar face in a private's coat, Camp 27 at Krasnogorsk, the NKVD, and the founding of the National Committee for a Free Germany. **Front**: hospital, Major Kessler's investigation of how you got out, Kharkov, and Operation Citadel at Kursk |

Chapters I and II are 7 days each; Chapter III is 14 days, Chapter IV 10 days, Chapter V 12 days, Chapter VII 13 days and Chapter VIII 14 days, across several places. Each day has 3 phases (morning, afternoon, night). Choices in Chapter I follow you: who you saved, who you betrayed, and who is still in your squad.

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

## Systems

The sidebar (or the bottom bar on a phone) has panels for each system.

### Comrades
Hartmann, Lenz, Rau, Vogel, Brandt, Albrecht and the people you meet later each have a relationship with you, from Hostile to Close. Every choice since Chapter I counts. Relationships unlock or close off options, and decide who covers for you and who reports you.

### Squad
From Chapter III you command your own men: each has a name, an age, traits and a morale and loyalty score.

| Trait | What it does |
|---|---|
| joker | Lifts spirits |
| zealot, informer | Watches the others and reports you |
| schemer | Always has a deal going |
| steady | Calm and reliable |
| nervous | Frightened easily |
| devout | Has a conscience |
| strong | Can carry anything |
| green | New, and learns from you |
| tired | Old for a soldier, wants to go home |

Some orders ask you to **choose a man** for the task. What happens depends on who he is. You also choose a deputy.

From Chapter IV, men can be **killed, wounded or sent to the rear**. Whom you send on dangerous tasks decides who comes home. Training in the interlude (digging in, first aid) and checking kit before battle lower the odds.

### Cold (Chapter V)
A **Warmth** value appears in winter, and the temperature shows in the date line. Cold drains warmth every phase:

- **Kit** protects you: a sheepskin coat, felt boots, a blanket.
- **Shelter** at night gives warmth back.
- Below 20 warmth, you start to **freeze**. Frostbite counts as a wound for the Wound Badge.
- The squad has its own **winter kit** level. The colder it is, the more men are lost to frostbite at night.

### Supplies (Chapter VII)
In Stalingrad your squad has three **supplies**: ammunition, rations and medical kit (0–12 each).

- Before the encirclement, the supply lines bring one of each every night.
- In the **pocket** the squad eats rations every night (more men, more bread). When they run out, everyone starves.
- Only the **airlift** brings anything, and less each week: 60 % of nights in November, none at the end.
- **Low ammunition** (2 or less) makes every fight more dangerous for you and your men.
- **Medical kit** can turn a man's death into a wound, and blunts the worst of your own wounds. Each use costs one.

The chapter ends in one of four ways: **flown out** from Gumrak (by Starck's favour, your wounds, or a forged tag), **captivity** (alone or with your squad), a **breakout** across 200 km of snow, or death. All but death lead on.

### Hope (Chapter VIII, captivity)
In the camp, **Hope** replaces the squad's supplies. Letters, faith, comrades and small kindnesses raise it; deaths and betrayals lower it. Below 20, men stop eating, and you lose health every night.

### Statements on record (Chapter VIII, front)
Major Kessler of the Secret Field Police asks every man who got out of Stalingrad how he did it, more than once. What you tell him is kept **on record** (shown in the Soldbuch). He compares: telling the same lie twice is safer than changing your story, and the truth is safest of all, unless the truth is a crime.

### Using supplies and kit yourself
When your **food is below 60** you can eat one of the squad's rations; when your **health is below 70** you can use the medical kit. Some kit can be used too: drink vodka or schnapps, brew coffee, smoke. Each once per morning, afternoon or night, from the Status panel or the Kit tab.

### Starck
SS officer **Wolfram Starck** is a recurring character from Chapter II on: a former schoolteacher and a true believer. You meet him:

- by a fire at Onhaye in May 1940,
- at Maxim's in Paris on 14 July 1940,
- at your barrier on the Cher, travelling with Lenz,
- on the sand roads east of the Bug in June 1941, where he speaks about the "special task forces",
- and in Chapter V, where he remembers you.

- His view of you is built from everything you have done since Chapter I.
- He respects courage and hardness, and despises softness.
- He can help you: winter clothing, protection from Lenz, a transfer to the Waffen-SS.
- He can also hurt you: searching your pack, reporting you to the SD, standing one of your men before a summary court.

### Kit
Things you carry follow you between chapters:

- **Keepsakes:** the rosary from your mother, a French officer's watch and pistol, a letter you never sent.
- **Goods:** cigarettes, coffee, silk stockings and wine. You can use them to bribe, trade, comfort or sell on the black market.

### Skills
Your five skills are Shooting, French, First aid, Leadership and Scrounging. Each runs from 0 to 5:

- **Starting level** comes from your background and your deeds.
- **Practice** raises them.
- **Higher levels** open up new options and improve your chances.

## Army or Waffen-SS

From Chapter VI the player who accepted Starck's offer wears **Waffen-SS rank titles**:

| Army | Waffen-SS |
|---|---|
| Gefreiter | SS-Sturmmann |
| Obergefreiter | SS-Rottenführer |
| Unteroffizier | SS-Unterscharführer |
| Feldwebel | SS-Oberscharführer |

They also lead a **new section** of six men, and home receives the black collar patches differently from the field grey.

## Promotions

A promotion board sits at the end of every chapter:

- **Time in service** gives one step, unless your record is stained: suspicion of 60 or more, a refused order, or being caught asleep on sentry duty.
- **Merit** (the chapter's merit score plus your standing with your superiors) gives a recommendation. Skipping a rank requires an exceptional record.
- **Ranks:** Schütze → Oberschütze → Gefreiter → Obergefreiter → Unteroffizier → Feldwebel. Unteroffizier requires passing the NCO course in Chapter III. The course depends on your leadership skill, your standing with your superiors, and how you prepared.

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
| War Merit Cross, 2nd Class with Swords | Saving others under fire, such as dragging Brandt out of the road or saving a comrade from the Meuse |
| Life Saving Medal | Pulling a drowning soldier out of the Meuse |
| Marksmanship Lanyard, grades 1–3 | The qualification shoot at the range at Wahn during the interlude (grade 3 comes in later chapters) |
| War Merit Cross, 2nd Class (without swords) | Courage away from the front, such as rescuing a family from a house fire |
| Tank Destruction Badge | Destroying a T-34 single-handed with a bundle charge (instituted in 1942, awarded retroactively) |
| Eastern Front Medal | Surviving the winter battle of 1941/42 (instituted in May 1942) |
| Long Service Award, 4 Years | Automatically after four years of service (from Chapter III for the 1917 class) |

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
js/data/ch3.js      Chapter III: interlude, Paris, NCO course / Boulogne
js/data/ch3_town.js Chapter III: the town on the Cher, random events, endings
js/data/ch4.js      Chapter IV: interlude, the Bug, Białystok, the pocket
js/data/ch4_more.js Chapter IV: Minsk road to Smolensk, random events, endings
js/data/ch5.js      Chapter V: interlude, the offensive, Starck, the eviction
js/data/ch5_more.js Chapter V: the counteroffensive, retreat, Christmas, endings
js/data/ch6.js      Chapter VI: interludes (Army / SS), days 0–3 at home
js/data/ch6_more.js Chapter VI: days 4–6, random events, endings
js/data/ch7.js      Chapter VII: interlude, the steppe to the encirclement (days 0–6)
js/data/ch7_more.js Chapter VII: the pocket, Gumrak, the surrender, random events, endings
js/data/ch8.js      Chapter VIII: both calendars, the interlude, the captivity track
js/data/ch8_front.js Chapter VIII: the front track (Kessler, Kursk)
js/data/ch8_more.js Chapter VIII: random events, endings
js/data/starck.js   Starck's appearances in Chapters II–IV
js/systems.js       relationships, skills, kit, squad
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
      rel: { lenz: -10 }, items: { coffee: -1 }, train: { french: 1 },
      squad: { all: { morale: 5 }, kuehn: { loyalty: -10 } },
      assign: true,               // ask the player which man to send (outcome gets x.man)
      assault: true,              // counts toward the Infantry Assault Badge
      delay: { in: 3, effects: { morale: -10 }, note: '...' },  // delayed effect
      log: 'Diary entry', next: 'eventId', end: 'endingId' }
  ]
}
```

## Ideas for future chapters

A new chapter is a file like `js/data/ch2.js` that pushes itself onto `SIM.CHAPTERS`.

The Eastern Front 1941–43 · home leave and bombing raids · 1944–45 · captivity · coming home, 1945–1950.
