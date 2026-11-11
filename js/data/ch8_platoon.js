// Chapter VIII: command. On the front track a good NCO can take over a platoon (Zugführer):
// three squads, orders in battle, transfers, recommendations and discipline. In the camp a
// prisoner can become brigade leader (Brigadier) over sixty men.
window.SIM = window.SIM || {};

(function () {
  const { ss, has, men, say } = SIM.ch8;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 7 }, o));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const P = s => s.platoon;
  // Sub-units are squads in a platoon, platoons in a company (Chapter IX).
  const SUB = s => (s.platoon && s.platoon.company) ? 'platoon' : 'squad';
  SIM.subUnit = SUB;
  SIM.unitName = s => (s.platoon && s.platoon.company) ? 'company' : 'platoon';
  const active = s => !!(s.platoon && s.platoon.active);
  SIM.platoonActive = active;
  const nco = s => SIM.rankTitle(s, 4);

  SIM.EXTRA_PEOPLE = Object.assign(SIM.EXTRA_PEOPLE || {}, {
    dorn: { name: 'Heinz Dorn', roleSS: 'Leader of the platoon\'s 2nd squad. Twenty-five, from the Ruhr, a veteran of the division since France 1940, Iron Cross at Kharkov. Attacks first and thinks afterwards.', role: 'Leader of the platoon\'s 2nd squad. Twenty-five, from the Ruhr, Iron Cross at Rzhev. Attacks first and thinks afterwards.', present: f => f.hadPlatoon, base: () => 5 },
    saal: { name: 'Wilhelm Saal', roleSS: 'Leader of the platoon\'s 3rd squad. Thirty-eight, a carpenter from Franconia, transferred from the police divisions in 1942. Careful, slow, never loses a man he does not have to.', role: 'Leader of the platoon\'s 3rd squad. Forty-one, a carpenter from Franconia, a reservist since 1939. Careful, slow, never loses a man he does not have to.', present: f => f.hadPlatoon, base: () => 10 }
  });

  // ───────────────────────── The platoon ─────────────────────────
  SIM.makePlatoon = s => {
    s.platoon = {
      active: true, recs: 0,
      squads: {
        dorn: { id: 'dorn', name: 'Heinz Dorn', short: 'Dorn', trait: 'bold', strength: 9, morale: 70, ammo: 8, alive: true },
        saal: { id: 'saal', name: 'Wilhelm Saal', short: 'Saal', trait: 'careful', strength: 9, morale: 60, ammo: 8, alive: true }
      }
    };
    s.flags.hadPlatoon = true;
  };
  SIM.PLATOON_TRAITS = { bold: 'Leads attacks well and loses men doing it. May charge when told to hold.', careful: 'Gives steady fire support and keeps his men alive. Slow in the attack; hesitates when morale is low.', none: 'A stand-in. Does what he is told, no more.' };
  const sq = (s, id) => P(s).squads[id];
  const lname = (s, q) => q.alive ? q.short : `${q.short}'s old ${SUB(s)}`;
  const scale = q => (q.full || 10) / 10;
  SIM.platoonNight = s => {
    if (!active(s)) return;
    Object.values(P(s).squads).forEach(q => { q.ammo = clamp(q.ammo + 1, 0, 12); q.morale = clamp(q.morale + 2, 0, 100); });
  };

  // How strong a squad is in a role.
  const power = (s, id, role) => {
    if (id === 'own') {
      const n = (men(s).length + 1) * ((P(s) && P(s).company) ? 1.4 : 1);
      const mor = SIM.squadMorale ? SIM.squadMorale(s) : 60;
      const ammo = s.supplies && s.supplies.ammo <= 2 ? 0.7 : 1;
      return (n / 6) * (0.5 + mor / 200) * ammo * (1 + SIM.skill(s, 'leadership') * 0.06);
    }
    const q = sq(s, id);
    if (q.strength <= 0) return 0;
    let p = (q.strength / (q.full || 10)) * (0.5 + q.morale / 200) * (q.ammo <= 2 ? 0.7 : 1);
    if (q.trait === 'bold') p *= role === 'assault' ? 1.25 : 0.95;
    if (q.trait === 'careful') p *= role === 'assault' ? 0.8 : 1.25;
    return p;
  };

  // Resolve a platoon order. plan: { assault, support, reserve } with 'own' | 'dorn' | 'saal'.
  SIM.platoonAction = function (s, x, plan, prof) {
    const out = [];
    let assault = plan.assault, support = plan.support;
    const d = sq(s, 'dorn'), sa = sq(s, 'saal');
    // Dorn does not like holding back.
    if (support === 'dorn' && d.alive && d.strength > 0 && SIM.rel(s, 'dorn') < 15 && x.roll(0.3)) {
      out.push(`${d.short} does not wait for your signal: his ${SUB(s)} goes forward with ${lname(s, sq(s, assault) || d)}'s men.`);
      support = null; plan = Object.assign({}, plan, { dornCharged: true });
    }
    let p = 0.32 + power(s, assault, 'assault') * 0.42 + (support ? power(s, support, 'support') * 0.3 : 0) + (plan.dornCharged ? 0.08 : 0) + (prof.bonus ? prof.bonus(s) : 0);
    if (assault === 'saal' && sa.morale < 35) { p -= 0.2; out.push(`${sa.short}'s men are slow to leave the trench. He does not drive them.`); }
    p = clamp(p, 0.12, 0.9);
    const ok = x.roll(p);
    // Losses.
    const lose = (id, n) => {
      if (id === 'own') return;
      const q = sq(s, id); if (!q || q.strength <= 0) return;
      n = Math.round(n * scale(q));
      q.strength = Math.max(0, q.strength - n);
      q.morale = clamp(q.morale + (ok ? 4 : -10) - Math.round(n * 2 / scale(q)), 0, 100);
      if (q.alive && (q.strength <= 2 * scale(q) || x.roll(id === assault ? 0.08 : 0.03))) {
        q.alive = false; q.trait = 'none';
        out.push(`${q.name} is killed. The senior NCO takes over what is left of his ${SUB(s)}.`);
        SIM.addLog(s, `${q.name}, ${SUB(s)} leader in your ${SIM.unitName(s)}, was killed ${prof.where}.`);
        x.apply({ morale: -6 });
      }
    };
    const leadLoss = (ok ? 1 : 2) + (x.roll(prof.base * 2) ? 1 : 0);
    lose(assault, leadLoss);
    if (plan.dornCharged) lose('dorn', 1 + (x.roll(0.5) ? 1 : 0));
    if (support) lose(support, x.roll(0.3) ? 1 : 0);
    ['dorn', 'saal'].forEach(id => { const q = sq(s, id); if (id === assault) q.ammo = Math.max(0, q.ammo - 2); else if (id === support) q.ammo = Math.max(0, q.ammo - 1); });
    if (assault === 'own' || support === 'own') x.supply('ammo', assault === 'own' ? -2 : -1);
    // Your own squad and you.
    if (assault === 'own') {
      const m = x.casualty(prof.base * 1.2, prof.where);
      say(x, m, m => `${m.name} is killed ${prof.where}.`, m => `${m.name} is wounded ${prof.where}.`);
      if (x.roll(prof.base * 0.9)) { const dmg = SIM.rand(12, 36); x.apply({ health: -dmg }); SIM.woundBadge(s); s.deathCause = prof.cause; out.push('You are hit leading your men forward.'); }
      SIM.markAssault(s);
    } else if (support === 'own' && x.roll(0.1)) {
      const m = x.casualty(0.5, prof.where); say(x, m, m => `${m.name} is killed by return fire.`, m => `${m.name} is wounded by return fire.`);
    }
    const names = { own: `your own ${SUB(s)}`, dorn: `${lname(s, d)}`, saal: `${lname(s, sa)}` };
    if (ok) { x.apply({ merit: assault === 'own' ? 4 : 3, officers: 4, morale: 3 }); out.push(prof.win(names[assault], support ? names[support] : null)); }
    else { x.apply({ merit: 1, officers: -2, morale: -4 }); out.push(prof.lose(names[assault])); }
    out.forEach(t => x.say(t));
    return ok;
  };

  const ORDERS = [
    { label: s => `${sq(s, 'dorn').alive ? 'Dorn' : `The 2nd ${SUB(s)}`} leads the attack. ${sq(s, 'saal').alive ? 'Saal' : `The 3rd ${SUB(s)}`} gives fire support. Your own ${SUB(s)} is the reserve.`, plan: { assault: 'dorn', support: 'saal', reserve: 'own' } },
    { label: s => `${sq(s, 'saal').alive ? 'Saal' : `The 3rd ${SUB(s)}`} goes forward slowly. ${sq(s, 'dorn').alive ? 'Dorn' : `The 2nd ${SUB(s)}`} covers the flank. Your own ${SUB(s)} is the reserve.`, plan: { assault: 'saal', support: 'dorn', reserve: 'own' } },
    { label: s => `You lead the attack with your own ${SUB(s)}. ${sq(s, 'saal').alive ? 'Saal' : `The 3rd ${SUB(s)}`} gives fire support.`, plan: { assault: 'own', support: 'saal', reserve: 'dorn' } }
  ];
  // Give a battle event a set of platoon orders, used instead of its own choices when you command a platoon.
  const withOrders = (id, prof) => {
    const e = SIM.EVENTS.find(e => e.id === id);
    if (!e) return;
    e.choices.forEach(ch => { const old = ch.show; ch.show = s => !active(s) && (!old || old(s)); });
    ORDERS.forEach(o => e.choices.push({
      text: o.label, order: true,
      show: s => active(s) && (o.plan.assault === 'own' || sq(s, o.plan.assault).strength > 0),
      outcome: (s, x) => SIM.platoonAction(s, x, o.plan, prof)
    }));
  };
  const front = (id, where, cause, base, win, lose, bonus) => withOrders(id, { where, cause, base, win, lose, bonus });
  SIM.withUnitOrders = (id, where, cause, base, win, lose, bonus) => withOrders(id, { where, cause, base, win, lose, bonus });
  front('c8f_7m', 'on patrol in the minefield', 'Killed by a mine on patrol before Kursk, June 1943.', 0.08,
    (a, b) => `${a[0].toUpperCase() + a.slice(1)} maps the minefield in four hours on their bellies${b ? `, with ${b} watching the Soviet line` : ''}. Eleven mines, all marked.`,
    a => `A flash in the grass. ${a[0].toUpperCase() + a.slice(1)} comes back with a wounded man and half a map.`);
  front('c8f_10m', 'on the first day of Citadel', 'Killed leading your platoon on the first day of Operation Citadel, 5 July 1943.', 0.18,
    (a, b) => `Behind the Tigers, through the mines, into the first Soviet trench. ${a[0].toUpperCase() + a.slice(1)} takes it${b ? `, while ${b} keeps the Soviet heads down` : ''}. By noon the platoon is two kilometres in.`,
    a => `${a[0].toUpperCase() + a.slice(1)} is stopped in the wire by a machine gun nobody had seen. It takes the whole afternoon and a Tiger to get them out.`,
    s => s.flags.tigerDrill ? 0.06 : 0);
  front('c8f_11m', 'attacking the gun line', 'Killed leading your platoon against a Soviet anti-tank line, July 1943.', 0.2,
    (a, b) => `${a[0].toUpperCase() + a.slice(1)} goes round through the balka and into the gun pits with grenades. Three guns silenced${b ? `; ${b} kept the covering trench busy` : ''}.`,
    a => `The gun line was wider than anyone thought. ${a[0].toUpperCase() + a.slice(1)} is pinned down in the corn until dark.`);
  front('c8f_12m', 'at Prokhorovka', 'Killed leading your platoon at Prokhorovka, 12 July 1943.', 0.18,
    (a, b) => `${a[0].toUpperCase() + a.slice(1)} holds the flank and strips the infantry off the Soviet tanks${b ? `, with ${b} firing from the second trench` : ''}. The tanks come on without them, into the German guns.`,
    a => `${a[0].toUpperCase() + a.slice(1)} is overrun. The survivors come back through the corn, one by one, until after dark.`);
  front('c8f_13m', 'in the rearguard', 'Killed commanding the rearguard as the Germans fell back from Kursk, July 1943.', 0.14,
    (a, b) => `${a[0].toUpperCase() + a.slice(1)} holds the village on the hill for twelve hours while the battalion pulls back through it${b ? `, ${b} covering the road` : ''}. Then the platoon runs, and nobody is left behind.`,
    a => `The Soviets come faster than anyone expected. ${a[0].toUpperCase() + a.slice(1)} gets out, but leaves men in the village.`);

  // ───────────────────────── Front: the platoon ─────────────────────────
  const eligible = s => s.rank >= 4 && !s.flags.penal;
  const deserves = s => s.stats.officers >= 62 || SIM.hasMedal(s, 'ek1') || (SIM.hasMedal(s, 'ek2') && s.stats.officers >= 50) || (s.chMerit || 0) >= 4;
  const fieldPromotion = (s, x, date) => {
    SIM.makePlatoon(s);
    if (s.rank === 4) { s.rank = 5; s.rankHistory.push({ rank: 5, date }); x.log(`Field promotion to ${SIM.rankTitle(s, 5)}. Took over the platoon.`); }
    else x.log('Took over the platoon as Zugführer.');
  };

  ev({ id: 'c8f_3n', track: 'front', day: 3, phase: 2, scene: 'city-east', time: '22:00',
    title: 'The Platoon',
    cond: eligible,
    text: s => `Your platoon commander, a Leutnant who came from the officer school in January, is killed by a sniper in the ruins of Kharkov in the evening, on his fourth day at the front.

The company commander calls the NCOs together by candlelight. "The battalion has no officers to send. One of you takes the platoon." He looks round the room${deserves(s) ? ', and stops at you. "You were at Stalingrad. The men know it. Can you do it?"' : '. His eyes pass over you, and stop at an Oberfeldwebel from the 1st platoon. "Hagen. You take it."'}`,
    choices: [
      { text: '"Yes, Herr Hauptmann."', show: deserves, effects: { officers: 4, morale: 6 }, squad: { all: { morale: 4, loyalty: 4 } },
        outcome: (s, x) => { fieldPromotion(s, x, '16 March 1943'); x.say(`Three squads, thirty-odd men. Your own, and two more: Heinz Dorn's, a young firebrand with an Iron Cross, and Wilhelm Saal's, a careful carpenter in his late thirties. ${s.rank === 5 ? `By morning you are ${SIM.rankTitle(s, 5)}, on a field promotion.` : ''}`); } },
      { text: '"I would rather keep my squad."', show: deserves, effects: { officers: -4 }, squad: { all: { loyalty: 8 } },
        result: 'The Hauptmann looks at you for a long moment. "As you wish." He gives the platoon to Oberfeldwebel Hagen. Your men heard. They do not forget it.' },
      { text: 'Say nothing.', show: s => !deserves(s), effects: { morale: -2 }, set: { passedOver: true },
        result: 'Hagen takes the platoon. Walking back through the ruins, you wonder what you would have to do to be the one they look at.' }
    ] });

  ev({ id: 'c8f_6n', track: 'front', day: 6, phase: 2, scene: 'camp', time: '21:00',
    title: 'Hagen',
    cond: s => !active(s) && eligible(s) && !!s.flags.passedOver && (s.stats.officers >= 55 || (s.chMerit || 0) >= 3),
    text: 'Oberfeldwebel Hagen has been ordered to the officer candidate course in Germany. The Hauptmann sends for you. "You have done well since Kharkov. The platoon is yours, if you want it."',
    choices: [
      { text: '"Yes, Herr Hauptmann."', effects: { officers: 4, morale: 6 },
        outcome: (s, x) => { fieldPromotion(s, x, '15 May 1943'); x.say('Dorn\'s squad, Saal\'s squad, and your own. Thirty-odd men who will go into the Kursk bulge on your orders.'); } },
      { text: '"No. My squad needs me."', squad: { all: { loyalty: 8 } }, result: 'He shrugs and gives it to Dorn, acting, until a Leutnant can be found. Dorn grins at you like a man who has won a bet.' }
    ] });

  // Discipline: the platoon leader decides how much the army learns.
  ev({ id: 'c8f_5n', track: 'front', day: 5, phase: 2, scene: 'camp', time: '03:00',
    title: 'Asleep at the Post',
    cond: active,
    text: 'Checking the sentries at three in the morning, you find a man from Saal\'s squad asleep at the machine gun, his head on the ammunition box. In the field, asleep on sentry is a court-martial offence. Men have been shot for it. Saal is beside you; he has seen it too.',
    choices: [
      { text: 'Report him. The rules exist for a reason.', effects: { officers: 5, conscience: -6 }, rel: { saal: -15 },
        outcome: (s, x) => { sq(s, 'saal').strength = Math.max(0, sq(s, 'saal').strength - 1); sq(s, 'saal').morale = clamp(sq(s, 'saal').morale - 10, 0, 100); x.say('Two years in a penal unit. Saal says "Jawohl" when you tell him, and nothing else, for a week.'); } },
      { text: 'Punish him yourself: a week of the worst duties, and a warning in front of the squad.', effects: { officers: -1 }, rel: { saal: 8 }, train: { leadership: 1 },
        outcome: (s, x) => { sq(s, 'saal').morale = clamp(sq(s, 'saal').morale + 4, 0, 100); x.say('Latrines, wire, the forward listening post every night. He is never asleep at a post again. Saal shakes your hand afterwards, without saying why.'); } },
      { text: 'Wake him quietly and say nothing.', effects: { conscience: 3 }, rel: { saal: 12 },
        outcome: (s, x) => { if (x.roll(0.3)) { x.apply({ suspicion: 10, officers: -6 }); x.say('Somebody talks. Kessler hears of it, as he hears of everything: "a platoon commander who covers for sentries". It goes into your file.'); } else x.say('He looks up at you, white with fear. You put a finger to your lips and walk on.'); } }
    ] });

  ev({ id: 'c8f_7n', track: 'front', day: 7, phase: 2, scene: 'field', time: '23:00',
    title: 'Dorn\'s Prisoners',
    cond: s => active(s) && sq(s, 'dorn').alive,
    text: 'Dorn\'s squad brings back two Soviet prisoners from a patrol. An hour later you hear two shots behind the dugouts. "Shot trying to escape," Dorn reports. His men will not look at you. One of them has been sick behind the dugout.',
    choices: [
      { text: 'Report it to the company commander.', effects: { conscience: 6, officers: -3 }, rel: { dorn: -25 },
        outcome: (s, x) => { sq(s, 'dorn').morale = clamp(sq(s, 'dorn').morale - 8, 0, 100); x.say('The Hauptmann listens, and writes nothing down. "Shot trying to escape," he says. "You heard him." Dorn knows what you did. So do his men, and some of them are grateful.'); } },
      { text: 'Deal with Dorn yourself: in your platoon, prisoners live.', effects: { conscience: 4 }, rel: { dorn: -8 }, train: { leadership: 1 },
        result: '"Next time," you tell him, alone, "I will report it, and I will testify." He stares at you, then nods once. You do not know whether he will listen. He knows you mean it.' },
      { text: 'Accept the report. It is the East.', effects: { conscience: -7 }, rel: { dorn: 10 },
        result: '"Shot trying to escape," you write. Dorn looks relieved, and then something worse than relieved.' }
    ] });

  ev({ id: 'c8f_12n', track: 'front', day: 12, phase: 2, scene: 'tanks', time: '22:00',
    title: 'The Runner',
    cond: active,
    text: s => `During the tank attack, a man from ${sq(s, 'saal').alive ? 'Saal\'s' : 'the 3rd'} squad threw down his rifle and ran. The Feldgendarmerie picked him up two kilometres back. Now a Feldwebel with a gorget is at your dugout. "Cowardice before the enemy. Your statement, Herr ${SIM.rankTitle(s)}, and he is ours."`,
    choices: [
      { text: '"I sent him back with a message."', effects: { conscience: 6, suspicion: 8 }, rel: { saal: 12 },
        outcome: (s, x) => { if (x.roll(0.75)) x.say('The Feldwebel looks at you for a long time, then tears up his form. The boy is back in his trench by midnight, shaking. He will never run again.'); else { x.apply({ suspicion: 10, officers: -6 }); x.say('"Which message?" You cannot say. They take him anyway, and they take your name too.'); } } },
      { text: 'Give your statement. He ran.', effects: { officers: 3, conscience: -8 }, rel: { saal: -10 },
        outcome: (s, x) => { sq(s, 'saal').strength = Math.max(0, sq(s, 'saal').strength - 1); x.say('They shoot him at dawn behind the regimental command post, with the platoon made to watch. Afterwards nobody in Saal\'s squad will meet your eyes.'); } },
      { text: '"Leave him with me. I will deal with it."', effects: { officers: -2 }, rel: { saal: 6 }, train: { leadership: 1 },
        result: 'The Feldwebel shrugs: one less form. You put the boy in your own squad, beside you, for the rest of the summer. He does not run again.' }
    ] });

  // ───────────────────────── Camp: the brigade ─────────────────────────
  const brig = s => !!s.flags.brigadier;
  ev({ id: 'c8c_3n', track: 'camp', day: 3, phase: 2, scene: 'barracks', time: '20:00',
    title: 'Brigadier',
    cond: s => !brig(s) && (s.stats.comrades >= 45 || SIM.skill(s, 'leadership') >= 2),
    text: 'The camp administration organises the prisoners into work brigades of sixty men, each under a prisoner "Brigadier" who answers for the norm, the bread and the count. The Soviet officer in charge has watched you. "You," he says through the interpreter. "Your brigade."',
    choices: [
      { text: 'Accept.', set: { brigadier: true }, effects: { food: 10, hope: 4 },
        outcome: (s, x) => { s.brigade = { men: 60, morale: 50 }; x.say('Sixty men, a list of names, a pencil. A little more bread for you, and the power to decide who carries bricks and who carries the dead. You understand, slowly, that this is a kind of rank.'); } },
      { text: 'Refuse.', effects: { hope: -1, comrades: 2 }, result: 'A Feldwebel from a Panzer division takes it instead. Within a week he has his own little court around him.' }
    ] });

  ev({ id: 'c8c_4n', track: 'camp', day: 4, phase: 2, scene: 'barracks', time: '20:00',
    title: 'The Brigade\'s Bread',
    cond: brig,
    text: 'Your brigade met the norm. The foreman hands you the extra bread, for sixty men, to divide as you see fit. You see sixty pairs of eyes.',
    choices: [
      { text: 'Equally, to the last crumb.', effects: { conscience: 5, hope: 4, comrades: 6 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale + 10, 0, 100); x.say('Sixty equal pieces. It takes an hour and a borrowed knife. Nobody complains.'); } },
      { text: 'More for the men who worked hardest.', effects: { conscience: -1 }, train: { leadership: 1 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale + 2, 0, 100); x.say('The strong get stronger and the weak get the crusts. The norm will be met next week too. Some of the weak will not be there to see it.'); } },
      { text: 'A share for you and your own men first.', effects: { food: 14, conscience: -6, comrades: -6 }, squad: { all: { morale: 6 } }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale - 12, 0, 100); x.say('Your men eat. The others watch them eat. You are a Brigadier now; this is what Brigadiers do. You tell yourself that.'); } }
    ] });

  ev({ id: 'c8c_6n', track: 'camp', day: 6, phase: 2, scene: 'barracks', time: '21:00',
    title: 'Ten Names',
    cond: brig,
    text: 'The Soviets want ten men from your brigade for the peat-cutting detail in the marshes: wet to the waist all day, half of them will be in the hospital within a month. You must give them ten names by morning.',
    choices: [
      { text: 'The healthiest ten.', effects: { conscience: -2, hope: -2 }, outcome: (s, x) => { s.brigade.men -= 3; x.say('The healthiest ten. Three of them die in the marshes. The arithmetic was correct.'); } },
      { text: 'Volunteers, and your own name first.', effects: { health: -14, conscience: 6, hope: 3, comrades: 8 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale + 12, 0, 100); x.say('You write your own name at the top. Nine men follow. Three weeks in the marsh. You come back. The brigade will follow you anywhere after that.'); } },
      { text: 'The die-hards who still salute the Führer in the barrack.', effects: { conscience: -3, hope: 2 }, rel: { starck: -15 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale - 4, 0, 100); x.say('Ten names, and every one of them a man who called you a traitor. The Antifa nod. Starck\'s friends do not forget.'); } }
    ] });

  ev({ id: 'c8c_9n', track: 'camp', day: 9, phase: 2, scene: 'office', time: '01:00',
    title: 'The Brigadier\'s List',
    cond: brig,
    text: 'Belov again, this time with a list. "As Brigadier, you know your men. Which of them were in the SS? Which of them are fascists? Which of them were at Babi Yar, at Białystok, at Kharkov?" He pushes a pencil across the table.',
    choices: [
      { text: 'Give him the names of the men you know did terrible things.', effects: { conscience: 4, hope: 4, comrades: -6 }, rel: { belov: 10 }, result: 'Four names. You saw them do it. You write slowly. Belov does not thank you; he puts the list in a drawer.' },
      { text: '"I am a Brigadier, not an informer."', effects: { hope: -3, comrades: 6 }, rel: { belov: -10 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale + 8, 0, 100); x.say('"Then you will not be a Brigadier for long," Belov says. He is wrong, for now. The brigade hears of it by morning.'); } },
      { text: 'Give him the names of men who are already dead.', effects: { conscience: -1, hope: 2 }, train: { scrounging: 1 }, outcome: (s, x) => { if (x.roll(0.6)) x.say('Belov reads them, then looks at you. "All dead," he says. "How convenient." He lets you go.'); else { x.rel('belov', -15); x.apply({ hope: -8, food: -10 }); x.say('"All dead," Belov says. "I checked." A week in the punishment block.'); } } }
    ] });

  ev({ id: 'c8c_11n', track: 'camp', day: 11, phase: 2, scene: 'barracks', time: '22:00',
    title: 'A Thief',
    cond: brig,
    text: 'A man in your brigade is caught stealing bread from a sick comrade. The brigade wants him punished the way the camp punishes bread thieves: with fists, at night. They are waiting for you to say yes.',
    choices: [
      { text: '"Do it."', effects: { conscience: -5, comrades: 4 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale + 4, 0, 100); x.say('You go out for a walk while it is done. When you come back, he is lying on his plank with his face to the wall.'); } },
      { text: 'Make him repay it, double, from his own ration.', effects: { conscience: 3 }, train: { leadership: 1 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale + 2, 0, 100); x.say('Two weeks of half rations, and the sick man gets the rest. Nobody is beaten. Some of the men think you are soft. The sick man lives.'); } },
      { text: 'Report him to the Soviets.', effects: { conscience: -2, comrades: -6, food: 5 }, outcome: (s, x) => { s.brigade.morale = clamp(s.brigade.morale - 8, 0, 100); x.say('The punishment block. He comes back a month later, much thinner. The brigade does not like the camp authorities inside its own walls.'); } }
    ] });

  SIM.EVENTS.push(...E);

  // ───────────────────────── Your powers as Zugführer ─────────────────────────
  const FIRST = ['Hans', 'Kurt', 'Otto', 'Rudi', 'Fritz', 'Walter', 'Emil', 'Alfred', 'Bernd', 'Gerhard', 'Josef', 'Karl'];
  const LAST = ['Becker', 'Hoffmann', 'Schulte', 'Krämer', 'Wolff', 'Lang', 'Seidel', 'Arnold', 'Busch', 'Frank', 'Winter', 'Roth'];
  const TRAITS = [['steady'], ['brave'], ['tired'], ['green'], ['joker'], ['devout'], ['strong'], ['nervous']];
  // Why a platoon action cannot be done now, or null.
  SIM.platoonBlock = (s, kind, a) => {
    if (!active(s) || s.stage !== 'event') return 'Only as Zugführer, during the chapter.';
    if (kind === 'recommend' && (P(s).recd || []).includes(a)) return 'Already recommended.';
    if (kind === 'recommend' && P(s).recs >= 2) return 'You have used your two recommendations this summer.';
    if (kind === 'take' && sq(s, a) && sq(s, a).strength <= 3) return `That ${SUB(s)} cannot spare anyone.`;
    if (kind !== 'recommend' && (s.used || {}).platoon === SIM.phaseKey(s)) return 'One transfer per morning, afternoon or night.';
    return null;
  };
  SIM.platoonDo = function (s, kind, a, b) {
    if (SIM.platoonBlock(s, kind, a)) return null;
    const mark = () => { s.used = Object.assign({}, s.used, { platoon: SIM.phaseKey(s) }); };
    if (kind === 'give') {           // a: man id, b: squad id
      const m = SIM.man(s, a), q = sq(s, b);
      if (!m || m.status !== 'ok' || !q || q.strength >= 12) return null;
      m.status = 'transferred'; m.fate = `Transferred to ${q.alive ? q.short + '\'s' : 'the ' + (b === 'dorn' ? '2nd' : '3rd')} ${SUB(s)}, ${SIM.today(s).date}`;
      q.strength++; q.morale = clamp(q.morale + 2, 0, 100);
      SIM.squadMod(s, 'all', { morale: SIM.hasTrait(m, 'informer') || SIM.hasTrait(m, 'schemer') ? 2 : -3 });
      if (s.flags.deputy === m.id) delete s.flags.deputy;
      SIM.addLog(s, `Transferred ${m.name} to ${q.short}'s ${SUB(s)}.`);
      mark();
      return `${m.name} moves his kit to ${q.alive ? q.short + '\'s' : 'the other'} ${SUB(s)}.`;
    }
    if (kind === 'take') {           // a: squad id
      const q = sq(s, a);
      if (!q || q.strength <= 3) return null;
      q.strength--; q.morale = clamp(q.morale - 3, 0, 100);
      if (q.alive) s.rel[a] = (s.rel[a] || 0) - 3;
      const n = (s.squad || []).length;
      const m = { id: 'plt' + n + '_' + s.day, name: `${FIRST[(n * 5 + s.day) % FIRST.length]} ${LAST[(n * 7 + s.day * 3) % LAST.length]}`, role: 'Rifleman', age: 19 + ((n * 3 + s.day) % 14),
        traits: TRAITS[(n + s.day) % TRAITS.length].slice(), loyalty: 45, morale: 55, rank: 1, status: 'ok', bio: `Came over from ${q.alive ? q.short + '\'s' : 'the ' + (a === 'dorn' ? '2nd' : '3rd')} squad in ${SIM.today(s).short.split(' ').slice(2).join(' ') || 'the summer'}.` };
      s.squad.push(m);
      SIM.addLog(s, `Took ${m.name} into your own ${SUB(s)} from ${q.short}'s.`);
      mark();
      return `${m.name} reports to you from ${q.short}'s ${SUB(s)}. ${q.alive ? q.short + ' is not pleased.' : ''}`;
    }
    if (kind === 'recommend') {      // a: man id or squad leader id
      P(s).recs++; P(s).recd = (P(s).recd || []).concat(a);
      if (a === 'dorn' || a === 'saal') {
        const q = sq(s, a); if (!q.alive) return null;
        s.rel[a] = (s.rel[a] || 0) + 12; q.morale = clamp(q.morale + 8, 0, 100);
        SIM.addLog(s, `Recommended ${q.name} for the Iron Cross.`);
        return `You recommend ${q.name} for the Iron Cross. When he hears, he comes to your dugout and stands there, not knowing what to say.`;
      }
      const m = SIM.man(s, a); if (!m || m.status !== 'ok') return null;
      m.loyalty = clamp(m.loyalty + 15, 0, 100); m.morale = clamp(m.morale + 10, 0, 100);
      m.rank = (m.rank || 0) + 1;
      SIM.squadMod(s, 'all', { morale: 3 });
      SIM.addLog(s, `Recommended ${m.name} for promotion.`);
      return `You put ${m.name} forward for promotion. The company clerk types it up the same day. ${m.name.split(' ')[0]} pretends not to care, and sews the new stripe on that night.`;
    }
    return null;
  };

  // Keep the platoon's ammunition and morale moving each night.
  const ch8 = SIM.CHAPTERS.find(c => c.id === 'tworoads');
  ch8.onNight = s => SIM.platoonNight(s);

  // Penal unit: the platoon goes to someone else.
  const verdict = SIM.EVENTS.find(e => e.id === 'c8f_8a');
  if (verdict) {
    const o = verdict.choices[0].outcome;
    verdict.choices[0].outcome = (s, x) => { o(s, x); if (s.flags.penal && active(s)) { s.platoon.active = false; x.say('Your platoon is given to Dorn, acting. You go to the probation company with nothing but your rifle.'); } };
  }
})();
