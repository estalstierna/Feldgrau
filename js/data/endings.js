// Endings. Early endings fire immediately; the rest are chosen after the final event of the chapter.
window.SIM = window.SIM || {};

SIM.ENDINGS = {
  kia: {
    title: 'Killed in Action',
    final: true,
    text: s => {
      const ch = SIM.chapter(s);
      if (ch.kiaText) return ch.kiaText(s);
      return `${s.deathCause || ch.deathDefault}

A field post letter arrives in ${SIM.townName(s.char.hometown)} three weeks later, signed by ${ch.commander}. It says that ${SIM.RANKS[s.rank]} ${s.char.first} ${s.char.last} fell bravely for Führer, Volk and Vaterland, and that he did not suffer. ${s.flags.lastLetter ? 'In the same envelope is a letter in your own handwriting.' : ''}${SIM.hasMedal(s, 'ek2') ? ' His Iron Cross is enclosed.' : ''}

You were ${ch.year - s.char.birthYear} years old. ${ch.casualties}`;
    }
  },
  arrested: {
    title: 'Arrested',
    final: true,
    text: s => `The Feldgendarmerie come for you at night. The charge is Wehrkraftzersetzung: undermining the fighting spirit of the armed forces. Lenz's statement runs to three pages.${s.flags.spd ? ' The file from 1933 about your father is attached.' : ''}

The court-martial takes forty minutes. Under the new wartime decree, the penalty is death. In a mercy that is not a mercy, it is commuted to service in a penal unit.

Most men in those units did not live to see the end of the war.`
  },
  breakdown: {
    title: 'Broken',
    final: true,
    text: s => `It happens in the middle of an ordinary moment. You simply stop. You sit down at the side of the road and you cannot get up again, and you cannot stop shaking, and when Brandt shouts at you, you cannot even hear him.

The medical officer writes "nervous exhaustion" on your tag. In ${SIM.chapter(s).year} the army does not have a better word for it. You are sent to a military hospital in ${SIM.chapter(s).hospital}, and then to a "special ward", where the doctors are less interested in curing you than in deciding whether you are a malingerer.

The war goes on without you. For now.`
  },
  desertion: {
    title: 'West Through the Forest',
    final: true,
    resolve: s => (Math.random() < 0.65 ? 'desertion_caught' : 'desertion_escaped')
  },
  desertion_caught: {
    title: 'Caught',
    final: true,
    text: s => `You and Vogel make it eleven kilometres before dawn. A Feldgendarmerie patrol finds you asleep in a hayloft near the railway, two boys in uniform with no papers and no excuse.

The court-martial is convened the day after war begins. Desertion in the face of the enemy. There is no defence. Vogel cries throughout. You don't.

The Wehrmacht executed around 15,000 of its own soldiers during the war, most of them for desertion. You are among the first.`
  },
  desertion_escaped: {
    title: 'Vanished',
    final: true,
    text: s => `Two nights of walking, one of hiding. Vogel twists his ankle near Neustettin and you leave him with a farmer who promises to hide him; you never find out if he did. You burn your uniform. You trade your boots for a workman's jacket.

By the time the war is a week old you are a farmhand with no name on an estate in Mecklenburg, where the foreman asks no questions because he needs hands and the men are all at the front.

You will spend six years waiting for the knock on the door. ${s.char.family === 'spd' ? 'Your father, if he knew, would understand.' : 'Your family is told you are missing. They never learn the truth.'}`
  },

  // ── End of chapter ──
  wounded: {
    title: 'Heimatschuss',
    text: s => `Your wounds are bad enough to get you out. A "home shot", the old soldiers call it, with envy. You are put on a hospital train to Stettin with a tag on your collar and a fever that lasts for days.

In the bed next to you is a boy from the next regiment with no legs. He asks you what it was like, at the front, because he didn't see much of it.

You will recover. The army will want you back. The war will still be there.`
  },
  decorated: {
    title: 'A Good Soldier',
    text: s => `Your name is read out by Leutnant von Albrecht. You are recommended for the Iron Cross, Second Class, for bravery on ${s.flags.flanked ? 'the forest road in the Tuchel Heath' : s.flags.charged ? 'the first morning, at the border' : 'the Vistula'}, and for promotion to Oberschütze.

Brandt shakes your hand. ${s.flags.savedBrandt ? 'His grip is very strong. "I owe you one," he says, and he means it.' : '"Don\'t let it go to your head."'} ${s.flags.party ? 'Your father will tell the whole Ortsgruppe.' : ''}

${s.stats.conscience < 35 ? 'You are good at this. You are beginning to understand what that means.' : 'You are proud, and then you think of the field outside Konitz, and you are not sure what you are proud of.'}`
  },
  marked: {
    title: 'A Name in a File',
    text: s => `You survive the first week. But somewhere, in a field office behind the lines, there is now a file with your name on it: ${s.flags.refusedOrder ? 'refusal to obey an order' : 'remarks, associations, doubts'}. ${s.flags.spd ? 'Next to it, someone has added a cross-reference to your father.' : ''}

Nothing happens. Not yet. Brandt is a little colder; Lenz watches you. Every letter you write, you wonder who else will read it.

In this army, you have learned, the enemy is not only across the river.`
  },
  hardened: {
    title: 'The Front Has You',
    text: s => `You survive the first week. You have learned to sleep anywhere, to eat anything, to take what you need, and to fire when you are told.

Lenz treats you as one of his own now. ${s.flags.betrayedHartmann ? 'Hartmann does not.' : ''} When you write home, you find you have nothing to say, so you write about the weather.

The man who left ${SIM.townName(s.char.hometown)} would not recognise you. You are not sure that matters any more.`
  },
  witness: {
    title: 'Witness',
    text: s => `You survive the first week, and you carry it with you: ${[
      s.flags.savedPole && 'a Polish boy called Tadeusz and a photograph of his mother',
      s.flags.stoppedReprisal && 'five farmers who were not shot',
      s.flags.refusedOrder && 'a rifle you would not raise',
      s.flags.gaveBread && 'a girl in a too-big coat breaking your bread in half',
      s.flags.vogelSaved && 'Ernst Vogel, alive in a ditch'
    ].filter(Boolean).join('; ') || 'everything you saw, and everything you refused to stop seeing'}.

You have not become the soldier they wanted. You have not become anything else either. You are still here, in their uniform, on the bank of the Vistula.

That is the question the coming years will ask you, again and again: how long can a man stay decent inside this?`
  },
  survivor: {
    title: 'Survivor',
    text: s => `You survive the first week. That is all, and it is not nothing.

You were not a hero and not a villain. You kept your head down, you did what you were told, mostly, and you are still alive on the bank of the Vistula while others are under the sand of the Tuchel Heath.

Poland will fall within a month. Your regiment will be sent west. The war that Hartmann said would last years has only begun.`
  }
};

// Chooses the end-of-chapter ending for Chapter I.
SIM.chapterEnding = function (s) {
  if (s.stats.health < 35) return 'wounded';
  if (s.chMerit >= 6 && s.stats.officers >= 58 && !s.flags.refusedOrder) return 'decorated';
  if (s.stats.suspicion >= 55 || s.flags.refusedOrder) return 'marked';
  if (s.stats.conscience <= 25) return 'hardened';
  if (s.stats.conscience >= 70) return 'witness';
  return 'survivor';
};
