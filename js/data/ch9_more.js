// Chapter IX: random events and endings.
window.SIM = window.SIM || {};

(function () {
  const { ss, men, camp, course, officer, lt } = SIM.ch9;
  const schoolDays = s => s.chapter === 8 && course(s) && s.day < 4;

  // Night events from Chapter VIII that fit Chapter IX too (not at the war school).
  ['pc_lice', 'pc_food', 'pc_bread', 'pc_stars', 'pc_rumour', 'pc_dream', 'pf_stalingrad', 'pf_nightmare', 'pf_letter', 'pf_fink', 'pf_flares'].forEach(id => {
    const e = SIM.POOL.find(p => p.id === id);
    if (!e) return;
    e.chapters = (e.chapters || []).concat(8);
    const c = e.cond;
    e.cond = s => !schoolDays(s) && (!c || c(s));
  });

  SIM.POOL.push(
    { id: 'p9_school', chapters: [8], track: 'front', phases: [2], cond: schoolDays, scene: 'barracks',
      title: 'Lights Out',
      text: 'Lights out in the war school. Somebody in the next bunk is reading a letter by torchlight. Somebody else is crying very quietly, and pretending not to be.',
      choices: [
        { text: 'Pretend not to hear.', effects: { health: 4 }, result: 'You sleep. In the morning nobody mentions it.' },
        { text: 'Talk to him.', effects: { conscience: 2, morale: 2 }, train: { leadership: 1 }, result: 'His brother was killed at Orel last month. You talk until three. You both pass the course.' }
      ] },
    { id: 'p9_partisans', chapters: [8], track: 'front', phases: [2], cond: s => s.chapter === 8 && !schoolDays(s), weight: 2, scene: 'forest',
      title: 'The Road at Night',
      text: 'Partisans mine the supply road at night. A truck goes up a kilometre from your position.',
      choices: [
        { text: 'Send a patrol to the road.', effects: { merit: 1 },
          risk: { chance: 0.07, dmg: [10, 26], cause: 'Killed by partisans on the supply road, winter 1943–44.', hit: 'A second mine, for the men who come to look at the first.', miss: 'Two dead drivers, a burnt truck, tracks in the snow leading into the forest. You do not follow them.' } },
        { text: 'Stay in your positions.', effects: { health: 2 }, result: 'At dawn, the engineers sweep the road. They find three more mines.' }
      ] },
    { id: 'p9_wolves', chapters: [8], track: 'camp', phases: [2], cond: s => s.chapter === 8 && s.day >= 3 && s.day <= 9, scene: 'forest',
      title: 'Wolves',
      text: 'At night, from the forest beyond the wire, the wolves howl. The old Russians in the village say it has been a hard winter for them too.',
      choices: [
        { text: 'Listen.', effects: { hope: -2 }, result: 'You think about the forest, and the eight hundred kilometres, and the wolves.' },
        { text: 'Sleep.', effects: { health: 3 }, result: 'You are too tired to be afraid of wolves.' }
      ] }
  );

  // ───────────────────────── Endings ─────────────────────────
  SIM.ch9Ending = function (s) {
    if (camp(s)) {
      if (s.flags.escaped9 === 'out') return 'ix_escaped';
      if (s.flags.escaped9 === 'caught') return 'ix_caught';
      return s.flags.signedNKFD && !s.flags.declinedSchool ? 'ix_school' : 'ix_kama';
    }
    if (s.flags.out9 === 'captured') return 'ix_captured';
    if (s.flags.relieved9) return 'ix_relieved';
    return 'ix_lysianka';
  };
  const orderLine = s => {
    const o = s.orders9 || { obeyed: 0, bent: 0, refused: 0 };
    const n = o.obeyed + o.bent + o.refused;
    if (!n) return '';
    return ` Of the orders you were given in those months you obeyed ${o.obeyed}, bent ${o.bent} and refused ${o.refused}.${s.flags.hostages9 ? ' You think about the barn wall more than about any of them.' : ''}`;
  };
  const unitLine = s => {
    const p = s.platoon;
    if (!p || !p.active) return '';
    const d = p.squads.dorn, sa = p.squads.saal;
    const part = (q, n) => q.alive ? `${q.short} with ${q.strength} men` : `the ${n} ${SIM.subUnit(s)}, ${q.strength} men, without ${q.short}`;
    return `\n\nWhat is left of your ${SIM.unitName(s)}: your own ${SIM.subUnit(s)}, ${part(d, '2nd')}, and ${part(sa, '3rd')}.`;
  };
  const planLine = s => {
    const e = s.escape || {};
    return e.partner === 'haller' ? ' Haller was beside you.' : e.partner ? ` ${(SIM.man(s, e.partner) || {}).name || 'Your partner'} was beside you.` : '';
  };
  Object.assign(SIM.ENDINGS, {
    ix_lysianka: { title: 'Lysianka', text: s => `You came out of the Cherkassy pocket, across the Gniloy Tikich, into the German lines at Lysianka. Perhaps thirty-five thousand of the fifty-six thousand got out. They left everything behind: guns, vehicles, the wounded at Shenderovka, and the dead in the snow.${orderLine(s)}${unitLine(s)}\n\nThe survivors are sent to Poland to be rebuilt. In the spring of 1944, everyone knows that the Allies will land in France. Nobody knows where.` },
    ix_relieved: { title: 'Relieved of Command', text: s => `You came out of the pocket without your ${s.platoon && s.platoon.company ? 'company' : 'command'}. The court of inquiry into your refusals sits in Lublin in March, and finds, after an hour, that "the officer's judgement, while insubordinate, was not without merit". You are posted to a training battalion.${orderLine(s)}\n\nIn the spring of 1944 you teach seventeen-year-olds to dig, and think about the men you left in the Ukraine.` },
    ix_captured: { title: 'The Gully', text: s => `You did not get across the river. In a gully west of Shenderovka you came out with your hands up, among forty men, into the snow and the Soviet submachine guns.${orderLine(s)}\n\n${s.flags.flown || s.flags.brokeOut ? 'You got out of Stalingrad. You did not get out of this.' : 'You join the long columns walking east.'} Your war is over. Your captivity has begun.` },
    ix_escaped: { title: 'South-West', text: s => `You are out: in the forests of the Kama, two thousand kilometres from the nearest German soldier, with a few days of bread and a compass that may or may not be true.${planLine(s)}\n\nVery few German prisoners ever escaped from the Soviet Union and reached home. Most were caught within days, or found dead in the summer. You know this. You walk south-west, at night, by the stars.` },
    ix_caught: { title: 'Brought Back', text: s => `They brought you back to Camp 97 and showed you to the others at the evening count.${planLine(s)} The punishment camp is worse than anything except Beketovka.\n\nBut you are alive, and the war is ending. ${s.stats.hope >= 40 ? 'You still believe you will go home.' : 'Some nights you no longer believe you will go home.'}` },
    ix_school: { title: 'The School', text: s => `You stayed. An Antifa activist, a man some prisoners call a traitor and some call honest. In the summer of 1944 the Soviets begin sending Antifa men to the front, with loudspeakers, to talk German soldiers into surrendering.\n\nYou may be asked to go. You may be asked to talk to men you once served with.` },
    ix_kama: { title: 'The Kama', text: s => `You stayed in Camp 97, above the Kama, and lived through the winter. In the spring the forests turn green, and the loudspeakers announce that the Red Army has reached the borders of Poland and Romania.\n\n${s.stats.hope >= 50 ? 'For the first time since Stalingrad you let yourself think about the journey home.' : 'You try not to think about home. It is safer.'}` }
  });
})();
