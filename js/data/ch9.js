// Chapter IX: "The Long Retreat", August 1943 – spring 1944.
// Front: the officer candidate course in Dresden (or, for those who did not go, the retreat to the
// Dnieper), then a company in the long retreat to the Cherkassy pocket and the breakout at Lysianka.
// Camp: Krasnogorsk, the Antifa course or the labour camp at Yelabuga on the Kama, and an escape plan.
// This file: the chapter, both calendars, the interlude, and the front track's first four days.
window.SIM = window.SIM || {};

(function () {
  const ss = s => !!s.flags.joinedSS;
  const has = (s, id) => !!SIM.man(s, id) && SIM.man(s, id).status === 'ok';
  const men = s => SIM.squadMen(s);
  const say = (x, m, killed, wounded) => { if (m) x.say(m.status === 'killed' ? killed(m) : wounded(m)); };
  const track = s => s.flags.track9 || s.flags.track8 || 'front';
  const camp = s => track(s) === 'camp';
  const course = s => !!s.flags.course9;
  const officer = s => s.rank >= 7;
  const lt = s => SIM.rankTitle(s, 7);
  const score = s => (s.chMerit || 0) + (s.stats.officers - 50) / 10;

  // ── Calendars ──
  const COURSE_DAYS = [
    { date: 'Monday, 16 August 1943', short: 'Mon 16 Aug', place: 'dresden', temp: 24 },
    { date: 'Wednesday, 1 September 1943', short: 'Wed 1 Sep', place: 'dresden', temp: 21 },
    { date: 'Tuesday, 21 September 1943', short: 'Tue 21 Sep', place: 'dresden', temp: 16 },
    { date: 'Saturday, 9 October 1943', short: 'Sat 9 Oct', place: 'dresden', temp: 12 }
  ];
  const RETREAT_DAYS = [
    { date: 'Sunday, 22 August 1943', short: 'Sun 22 Aug', place: 'kharkov_road', war: true, temp: 27, variant: 'east' },
    { date: 'Thursday, 9 September 1943', short: 'Thu 9 Sep', place: 'scorched', war: true, temp: 22, variant: 'east' },
    { date: 'Friday, 24 September 1943', short: 'Fri 24 Sep', place: 'kanev', war: true, temp: 16, variant: 'east' },
    { date: 'Tuesday, 12 October 1943', short: 'Tue 12 Oct', place: 'bukrin', war: true, temp: 10, variant: 'east' }
  ];
  const FRONT_DAYS = [
    { date: 'Sunday, 24 October 1943', short: 'Sun 24 Oct', place: 'dnieper', war: true, temp: 8, variant: 'east' },
    { date: 'Friday, 5 November 1943', short: 'Fri 5 Nov', place: 'kiev', war: true, temp: 4, variant: 'east' },
    { date: 'Saturday, 20 November 1943', short: 'Sat 20 Nov', place: 'zhitomir', war: true, temp: 0, variant: 'east' },
    { date: 'Friday, 24 December 1943', short: 'Fri 24 Dec', place: 'berdichev', war: true, temp: -8, variant: 'winter' },
    { date: 'Saturday, 1 January 1944', short: 'Sat 1 Jan', place: 'zvenigorodka', war: true, temp: -6, variant: 'winter' },
    { date: 'Monday, 24 January 1944', short: 'Mon 24 Jan', place: 'korsun', war: true, temp: -4, variant: 'winter', foodDrain: -6 },
    { date: 'Friday, 28 January 1944', short: 'Fri 28 Jan', place: 'korsun', war: true, temp: -2, variant: 'winter', foodDrain: -6 },
    { date: 'Saturday, 5 February 1944', short: 'Sat 5 Feb', place: 'korsun', war: true, temp: 2, foodDrain: -6 },
    { date: 'Monday, 14 February 1944', short: 'Mon 14 Feb', place: 'shenderovka', war: true, temp: -5, variant: 'winter', foodDrain: -6 },
    { date: 'Wednesday, 16 February 1944', short: 'Wed 16 Feb', place: 'lysianka', war: true, temp: -10, variant: 'winter', foodDrain: -6 }
  ];
  const CAMP_DAYS = [
    { date: 'Monday, 2 August 1943', short: 'Mon 2 Aug', place: 'krasnogorsk', temp: 22, foodDrain: -4 },
    { date: 'Saturday, 4 September 1943', short: 'Sat 4 Sep', place: s => s.flags.signedNKFD ? 'krasnogorsk' : 'train_east', temp: 17, foodDrain: -4 },
    { date: 'Friday, 1 October 1943', short: 'Fri 1 Oct', place: s => s.flags.signedNKFD ? 'krasnogorsk' : 'yelabuga', temp: 8, foodDrain: -4 },
    { date: 'Sunday, 7 November 1943', short: 'Sun 7 Nov', place: 'yelabuga', temp: -3, variant: 'winter', foodDrain: -5 },
    { date: 'Wednesday, 1 December 1943', short: 'Wed 1 Dec', place: 'kama_forest', temp: -14, variant: 'winter', foodDrain: -5 },
    { date: 'Friday, 24 December 1943', short: 'Fri 24 Dec', place: 'yelabuga', temp: -22, variant: 'winter', foodDrain: -5 },
    { date: 'Saturday, 1 January 1944', short: 'Sat 1 Jan', place: 'yelabuga', temp: -25, variant: 'winter', foodDrain: -5 },
    { date: 'Saturday, 22 January 1944', short: 'Sat 22 Jan', place: 'kama_forest', temp: -30, variant: 'winter', foodDrain: -5 },
    { date: 'Tuesday, 15 February 1944', short: 'Tue 15 Feb', place: 'yelabuga', temp: -18, variant: 'winter', foodDrain: -5 },
    { date: 'Wednesday, 15 March 1944', short: 'Wed 15 Mar', place: 'kama_forest', temp: -6, variant: 'winter', foodDrain: -4 },
    { date: 'Saturday, 1 April 1944', short: 'Sat 1 Apr', place: 'kama', temp: 3, foodDrain: -4 },
    { date: 'Saturday, 15 April 1944', short: 'Sat 15 Apr', place: 'yelabuga', temp: 8, foodDrain: -4 },
    { date: 'Sunday, 30 April 1944', short: 'Sun 30 Apr', place: 'yelabuga', temp: 11, foodDrain: -4 },
    { date: 'Monday, 1 May 1944', short: 'Mon 1 May', place: 'kama', temp: 9, foodDrain: -4 }
  ];
  const PLACES = {
    dresden: { name: 'War school, Dresden', x: 0, y: 0 },
    kharkov_road: { name: 'The road west from Kharkov', x: 0, y: 0 },
    scorched: { name: 'Falling back across the Ukraine', x: 0, y: 0 },
    kanev: { name: 'The Dnieper at Kanev', x: 0, y: 0 },
    bukrin: { name: 'The Bukrin bridgehead', x: 0, y: 0 },
    dnieper: { name: 'The Dnieper line south of Kiev', x: 0, y: 0 },
    kiev: { name: 'Before Kiev', x: 0, y: 0 },
    zhitomir: { name: 'Near Zhitomir', x: 0, y: 0 },
    berdichev: { name: 'The road to Berdichev', x: 0, y: 0 },
    zvenigorodka: { name: 'Near Zvenigorodka', x: 0, y: 0 },
    korsun: { name: 'The Korsun–Cherkassy pocket', x: 0, y: 0 },
    shenderovka: { name: 'Shenderovka, the edge of the pocket', x: 0, y: 0 },
    lysianka: { name: 'The breakout towards Lysianka', x: 0, y: 0 },
    krasnogorsk: { name: 'Camp 27, Krasnogorsk', x: 0, y: 0 },
    train_east: { name: 'A prisoner train, going east', x: 0, y: 0 },
    yelabuga: { name: 'Camp 97, Yelabuga, on the Kama', x: 0, y: 0 },
    kama_forest: { name: 'The logging camp in the forest above the Kama', x: 0, y: 0 },
    kama: { name: 'The banks of the Kama', x: 0, y: 0 }
  };

  SIM.CHAPTERS.push({
    id: 'retreat', num: 'IX', title: 'The Long Retreat', year: 1943, start: [1943, 8],
    range: s => camp(s) ? 'August 1943 – May 1944' : 'August 1943 – February 1944',
    track, days: s => camp(s) ? CAMP_DAYS : (course(s) ? COURSE_DAYS : RETREAT_DAYS).concat(FRONT_DAYS), places: PLACES,
    map: s => camp(s) ? 'pow' : (course(s) && s.day < 4 ? 'germany' : 'dnieper'), maps: ['pow', 'germany', 'dnieper'],
    cold: true, hope: s => camp(s), supplies: s => !camp(s) && !(course(s) && s.day < 4),
    nightMorale: s => camp(s) ? 1 : 2,
    kitchenNote: 'The evening soup: cabbage water, a slice of black bread.',
    finalEvent: ['c9c_13m', 'c9f_13m'],
    commander: 'your battalion commander',
    hospital: 'the field hospital at Korsun',
    deathDefault: 'Killed in the retreat across the Ukraine, 1943–44.',
    kiaText: s => camp(s)
      ? `${s.deathCause || 'Died in the camp at Yelabuga, winter 1943–44.'}\n\nYou are buried in the camp cemetery above the Kama, under a wooden post with a number on it. In the 1990s the graves at Yelabuga were found and marked by a German war graves commission. Most of the names were never matched to the numbers.`
      : `${s.deathCause || 'Killed in the retreat across the Ukraine, winter 1943–44.'}\n\nOf the roughly 56,000 men trapped in the Korsun–Cherkassy pocket, perhaps 35,000 got out. They left behind their guns, their vehicles, their wounded and their dead in the snow of the Gniloy Tikich valley.\n\nA letter reaches ${SIM.townName(s.char.hometown)} six weeks later.`,
    arrestText: s => `Your file reaches a court-martial at last: refusal to obey orders in the face of the enemy. The trial takes a quarter of an hour.\n\nYou are stripped of your rank and sent to a penal battalion to clear minefields in front of the German lines.`,
    breakdownText: s => camp(s)
      ? 'One morning in the logging camp you sit down in the snow and will not get up. The Soviet guard prods you with his rifle, then shrugs. They carry you to the hospital barrack, where you lie looking at the ceiling for a long time.'
      : 'In the pocket, in the middle of an ordinary order, you cannot speak. Your hands shake so much you cannot hold the map. The battalion doctor sends you out on the last plane with the wounded. You are never sent to the front again.',
    casualties: '',
    warFoodDrain: -4,
    promoDate: '28 February 1944',
    maxRank: s => camp(s) ? s.rank : (officer(s) ? 7 : (s.platoon && s.platoon.active && score(s) >= 10 ? 6 : Math.max(5, s.rank))),
    meritBar: 8,
    routineReason: 'Time in service.',
    meritReason: s => officer(s) ? 'Recommended for leading a company in the Cherkassy pocket.' : 'Recommended for conduct in the retreat to the Dnieper and the Cherkassy pocket.',
    interludeDate: 'August 1943',
    interludeTitle: 'Summer 1943',
    blackMarks: s => camp(s) ? ['In Soviet captivity.'] : (s.flags.relieved9 ? ['Relieved of command for refusing orders.'] : []),
    awards: (s, sc) => {
      if (camp(s)) return;
      const close = (s.assaultDays || []).filter(k => k.startsWith('8-')).length;
      if (close >= 3) SIM.award(s, 'nahkampf', 'For close combat in the Cherkassy pocket, February 1944.', 'February 1944');
      if (!SIM.hasMedal(s, 'ek2') && sc >= 9) SIM.award(s, 'ek2', 'For bravery in the retreat to the Dnieper, 1943.', 'February 1944');
      else if (SIM.hasMedal(s, 'ek2') && !SIM.hasMedal(s, 'ek1') && sc >= 14) SIM.award(s, 'ek1', 'For leading the breakout from the Cherkassy pocket, February 1944.', 'February 1944');
      if (s.flags.carriedWounded9) SIM.award(s, 'kvk2', 'For bringing the wounded out of the Cherkassy pocket, February 1944.', 'February 1944');
    },
    ending: s => SIM.ch9Ending(s),
    onInterlude: s => {
      s.flags.track9 = s.flags.track8 || 'front';
      if (camp(s)) {
        s.stats.health = Math.max(s.stats.health, 55); s.stats.food = Math.max(s.stats.food, 50);
        s.stats.hope = s.stats.hope !== undefined ? Math.max(30, s.stats.hope) : 45;
        s.supplies = null; s.shelter = 1;
      } else {
        s.stats.health = Math.max(s.stats.health, 75); s.stats.food = 80; s.stats.warmth = 80;
        s.stats.morale = Math.max(s.stats.morale, 50);
        s.supplies = { ammo: 8, rations: 8, med: 5 };
        s.squadWinter = Math.max(1, s.squadWinter || 0); s.shelter = 0;
        if (s.flags.penal && s.flags.penalCleared) s.flags.penal = false;
      }
      s.stats.suspicion = Math.max(0, s.stats.suspicion - 15);
    },
    onStart: s => {
      s.statements = s.statements || {};
      s.orders9 = { obeyed: 0, bent: 0, refused: 0 };
      if (camp(s)) s.escape = { food: 0, map: false, compass: false, boots: false, partner: null, risk: 0 };
    },
    onNight: s => { if (SIM.platoonNight) SIM.platoonNight(s); },
    interlude: s => interludeItems(s),
    interludeEvents: ['i9_course']
  });

  function interludeItems(s) {
    const out = [];
    if (camp(s)) {
      out.push({ year: 'July 1943', text: 'The loudspeakers in the camp announce every Soviet victory: Orel, Belgorod, then Kharkov, for the last time. In Italy, the Allies land in Sicily, and Mussolini falls. The guards say "Gitler kaput" more often now, and more cheerfully.' });
      out.push({ year: 'August', text: `${s.flags.signedNKFD ? 'Your name is on the manifesto of the Free Germany committee. In Germany, the Gestapo has a list of the men who signed.' : 'You did not sign. The Antifa men are polite to you, and keep a list.'} The camp is reorganised: the healthy will be sent east, to work.` });
    } else {
      out.push({ year: 'July 1943', text: 'After Citadel, the Soviets do not stop. Orel falls, then Belgorod; on 23 August, Kharkov, for the last time. In Italy the Allies have landed. In Hamburg, in eight nights of fire, the British kill thirty-five thousand people.' });
      out.push({ year: 'August', text: `${s.flags.officerOffer ? 'The Hauptmann\'s recommendation has come through: the officer candidate course.' : 'Every division is short of officers. The battalion asks its best NCOs whether they want to go to the war school.'} The army needs Leutnants who have been at the front. It does not have enough of them, because they are the first to die.` });
    }
    return out;
  }

  SIM.INTERLUDE_EVENTS.i9_course = {
    id: 'i9_course', scene: 'office',
    cond: s => !camp(s) && s.rank >= 4 && !s.flags.penal,
    title: 'The War School',
    text: s => `${s.flags.officerOffer ? 'The orders are on the Hauptmann\'s table: officer candidate course, war school Dresden, report on 16 August.' : 'The battalion commander offers you a place on the officer candidate course at the war school in Dresden.'} Eight weeks. If you pass, you come back a Leutnant${ss(s) ? ' (Untersturmführer)' : ''}, and you will not come back to your own men: officers are posted where they are needed.

${men(s).length ? `${men(s).map(m => m.name.split(' ')[0]).join(', ')} pretend not to have heard.` : ''}`,
    choices: [
      { text: 'Go to Dresden.', set: { course9: true }, effects: { morale: 4, officers: 4 },
        result: 'You hand over your men and take the train west. Through the window: the Dnieper, Poland, then Germany, green and whole, with no war in it.' },
      { text: '"My place is with my men."', set: { course9: false }, effects: { officers: -4 }, squad: { all: { loyalty: 10, morale: 6 } },
        result: 'The battalion commander does not argue. "Then you will be a Feldwebel for the rest of the war," he says, "which may not be very long." Your men find out by evening. Nobody says anything, but somebody leaves a bottle of schnapps on your pack.', items: { schnapps: 1 } }
    ]
  };

  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 8, track: 'front' }, o));
  const cev = o => ev(Object.assign({ cond: course }, o));
  const rev = o => ev(Object.assign({ cond: s => !course(s) }, o));

  // ───────────────────────── Course: day 0 · arrival ─────────────────────────
  cev({ id: 'c9k_0m', day: 0, phase: 0, scene: 'city', time: '09:00',
    title: 'Dresden',
    text: s => `Dresden in August: the Elbe, baroque churches, cafés with real cream on the cakes, trams, girls in summer dresses. Nobody has bombed it. Nobody thinks anyone ever will.

The war school is a set of red-brick barracks on the edge of the city. Two hundred candidates: NCOs from every front, with ribbons and wound badges, and boys from the Hitler Youth who have never seen a shot fired. You share a room with ${ss(s) ? 'three men from SS divisions in Italy and Norway' : 'a Feldwebel from Leningrad, a paratrooper from Crete and a seventeen-year-old who has been in the army for nine months'}.`,
    choices: [
      { text: 'Walk through the city on the first evening.', effects: { morale: 10, conscience: 2 },
        result: 'You walk along the Elbe at dusk. A string quartet is playing in a hotel garden. You stand at the railings and listen, and a waiter asks whether the Herr Feldwebel would like to come in. You go back to the barracks instead, because you do not know how to sit at a table like that any more.' },
      { text: 'Get to know the boys, and teach them what the books do not.', effects: { officers: 3 }, train: { leadership: 1 },
        result: 'You tell them about digging in, about water, about mines in the grass. The seventeen-year-old writes it all down. At the end he asks whether it is true that the Russians are not really human. You tell him the truth.' },
      { text: 'Sleep. Sleep in a bed with sheets.', effects: { health: 12 }, result: 'You sleep eleven hours. In the morning you do not know where you are, and then you do, and you lie very still and listen to the trams.' }
    ] });
  cev({ id: 'c9k_0a', day: 0, phase: 1, scene: 'office', time: '15:00',
    title: 'The Inspection Officer',
    text: 'The course commander, an Oberst with one arm, looks at your file. "Stalingrad. Kursk. Recommended by your Hauptmann." He closes it. "Here you will learn to give orders to men who will die because of them. Some candidates cannot do it. We find out early who they are."',
    choices: [
      { text: '"I have done it already, Herr Oberst."', effects: { officers: 5 }, result: 'He looks at you for a long moment. "Yes," he says. "I see you have." He writes something in the margin.' },
      { text: '"I don\'t know whether I can, Herr Oberst."', effects: { officers: 1, conscience: 3 }, result: '"Good," he says, to your surprise. "The ones who are sure are the dangerous ones."' }
    ] });
  cev({ id: 'c9k_0n', day: 0, phase: 2, scene: 'barracks', time: '22:00',
    title: 'Letters to the Front',
    text: s => `Your first night in Germany since you left the front. You write to ${men(s).length ? men(s)[0].name : 'your old squad'}, care of the field post.`,
    choices: [
      { text: 'Write that you will come back to them.', effects: { morale: 4 }, squad: { all: { loyalty: 4 } }, result: 'It is probably a lie. You write it anyway.' },
      { text: 'Write the truth: you will not see them again.', effects: { conscience: 2 }, result: 'A short letter. You fold it twice and post it before you can tear it up.' }
    ] });

  // ───────────────────────── Course: day 1 · the sand table ─────────────────────────
  cev({ id: 'c9k_1m', day: 1, phase: 0, scene: 'office', time: '08:00',
    title: 'The Sand Table',
    text: 'Tactics, every morning: a table of sand with wooden blocks for houses and pins for platoons. Today: a company in defence at a river crossing, a Soviet attack expected at dawn. The instructor, a Major who lost an eye at Rzhev, points at you. "Your company. Your orders."',
    choices: [
      { text: 'Defend in depth: one platoon forward, two back, the river behind you.', effects: { merit: 2, officers: 4 }, train: { leadership: 1 }, set: { tacticsDepth: true },
        result: '"Correct," says the Major, "and almost nobody does it. They put everyone in the front line because it looks brave." He moves your pins one centimetre. "And this is why you will lose fewer men than they do."' },
      { text: 'Everything forward. Hold the bank.', effects: { officers: -2 },
        result: '"And when they break through," the Major says, "your company is gone, and the bridge with it." He sweeps your pins off the table. "Again."' },
      { text: 'Ask what the orders from battalion are, first.', effects: { officers: 2 }, train: { leadership: 1 }, set: { askOrders9: true },
        result: '"Sensible," he says dryly. "Battalion says: hold the bank to the last man." He waits. "Now what will you actually do?" The room goes quiet. It is the most important question on the course, and he never asks it again.' }
    ] });
  cev({ id: 'c9k_1a', day: 1, phase: 1, scene: 'field', time: '14:00',
    title: 'Field Exercise',
    text: 'A field exercise on the training ground outside the city: an attack on a wood with live ammunition overhead. The candidates take turns commanding a platoon of recruits. It is your turn, and one of the recruits freezes in the open, lying flat, crying.',
    choices: [
      { text: 'Go out and get him yourself.', effects: { merit: 2, conscience: 3 }, risk: { chance: 0.04, dmg: [5, 15], cause: 'Killed in a training accident at the war school in Dresden, September 1943.', hit: 'A ricochet from the machine gun overhead.', miss: 'You crawl out, take him by the collar and drag him into the ditch. You talk to him until he stops shaking. The instructor notes it.' } },
      { text: 'Order the others on and leave him.', effects: { officers: 3, conscience: -3 }, result: 'The attack goes in and takes the wood on time. The boy is still lying in the open when it is over. The instructor writes "decisive". You are not sure it is praise.' },
      { text: 'Halt the exercise.', effects: { officers: -3, conscience: 4 }, result: '"In Russia," the instructor says, "you will not be able to stop the war." He lets you, all the same.' }
    ] });

  // ───────────────────────── Course: day 2 · the political officer ─────────────────────────
  cev({ id: 'c9k_2m', day: 2, phase: 0, scene: 'office', time: '10:00',
    title: 'Weltanschauung',
    text: s => `Two hours a week of "ideological instruction". The lecturer is a party official in uniform with a war-service ribbon and no other decoration. Today: "The Jewish question and the war in the East". He asks the candidates who have been in Russia to confirm what he says.${s.flags.toldFilm || s.flags.filmHidden ? '\n\nYou think of the film from Białystok.' : ''}`,
    choices: [
      { text: 'Say nothing. Write down what he says.', effects: { officers: 2, conscience: -3 }, result: 'You fill two pages with his words. Afterwards you cannot remember any of them, only the faces in the room, and which of them were nodding.' },
      { text: 'Tell him what you saw.', effects: { conscience: 6, suspicion: 15, officers: -6 }, set: { spokeCourse9: true },
        result: 'You describe it in a level voice: the ditch, the shooting, the women. The lecturer goes white. "That is not appropriate," he says. The Oberst calls you in that evening. "I believe you," he says. "Never say it again in a room with a party man in it. Do you understand me?"' },
      { text: 'Ask him whether he has been to Russia.', effects: { suspicion: 6, comrades: 6, conscience: 2 }, result: 'He has not. The room laughs, very quietly. He makes a note of your name.' }
    ] });
  cev({ id: 'c9k_2a', day: 2, phase: 1, scene: 'office', time: '16:00',
    title: 'The Leadership Test',
    text: 'The final leadership assessment: you are given a scenario on paper, and two hours. "Your company is ordered to hold a village to the last man. Your position is hopeless. The battalion commander cannot be reached. Write your orders."',
    choices: [
      { text: 'Hold, as ordered.', effects: { officers: 4 }, set: { testObey9: true }, result: 'You write the orders carefully. The examiner marks it "correct". Under it, in pencil, someone has written: "and your company?"' },
      { text: 'Hold until dark, then fall back and report.', effects: { officers: 2, merit: 2 }, set: { testBend9: true }, train: { leadership: 1 }, result: 'The examiner reads it twice. "This is what good officers do," he says, "and what we are not allowed to teach." He passes you with the best mark of your group.' },
      { text: 'Withdraw at once. An empty village is not worth a company.', effects: { officers: -4, conscience: 3 }, set: { testRefuse9: true }, result: '"Disobedience," the examiner writes, and then, after a pause, crosses it out and writes "independent judgement". You pass, narrowly.' }
    ] });
  cev({ id: 'c9k_2n', day: 2, phase: 2, scene: 'city', time: '21:00',
    title: 'A Dance',
    text: 'A dance in a hall by the Elbe for the officer candidates. Girls from the city, a band playing American jazz with German words. A young woman with a bandaged hand asks you to dance. She works in a factory making fuses.',
    choices: [
      { text: 'Dance.', effects: { morale: 10 }, outcome: (s, x) => x.say(s.flags.married ? 'You dance twice and tell her about your wife and your daughter. She laughs and says that is the best kind of soldier: the safe kind.' : 'You dance until the band stops. Her name is Ilse. She writes her address on a tram ticket, and you keep it for the rest of the war.') },
      { text: 'Watch from the side.', effects: { morale: 3 }, result: 'You stand by the wall with a glass of thin beer. You are twenty-five and you feel fifty.' }
    ] });

  // ───────────────────────── Course: day 3 · commission ─────────────────────────
  cev({ id: 'c9k_3m', day: 3, phase: 0, scene: 'office', time: '11:00',
    title: 'Leutnant',
    text: s => `The passing-out parade. The Oberst with one arm hands each of you your commission. You exchange your NCO shoulder straps for an officer's: flat silver braid. You are now ${lt(s)} ${s.char.last}.

${score(s) < 4 && s.flags.spokeCourse9 ? 'Your name is read out last. You passed, narrowly; the party lecturer\'s report was not kind.' : 'Your name is read out with the others.'}`,
    choices: [
      { text: 'Salute, and think of your old squad.', effects: { morale: 6 },
        outcome: (s, x) => { s.rank = 7; s.rankHistory.push({ rank: 7, date: '9 October 1943' }); x.log(`Commissioned ${lt(s)} at the war school in Dresden.`); x.say('A silver braid on each shoulder. A pistol instead of a rifle. A new paybook. The men you led are eighteen hundred kilometres away, and you will never again be one of them.'); } },
      { text: 'Ask to be posted back to your old division.', effects: { morale: 4 },
        outcome: (s, x) => { s.rank = 7; s.rankHistory.push({ rank: 7, date: '9 October 1943' }); s.flags.sameDivision9 = true; x.log(`Commissioned ${lt(s)} at the war school in Dresden.`); x.say('"Granted," says the Oberst, unexpectedly. "They have lost nine officers since July. They will be glad of you." It is the kindest thing he could have said, and the worst.'); } }
    ] });
  cev({ id: 'c9k_3a', day: 3, phase: 1, scene: 'station', time: '18:00',
    title: 'The Train East',
    text: s => `The train east again. In the first-class carriage now, among officers, with a compartment of your own. ${s.flags.married ? `You had two days at home: Liesel, and ${s.flags.daughter || 'the baby'}, seven months old, who screamed when she saw your uniform.` : 'You had two days at home. Your mother sewed the new shoulder straps on properly, and cried.'}`,
    choices: [
      { text: 'Study the maps of the Dnieper line.', effects: { officers: 2 }, train: { leadership: 1 }, result: 'Four hundred kilometres of river, and the Soviets already across it in a dozen places. By the time you reach the front you know the names of every village between Kiev and Cherkassy.' },
      { text: 'Drink with the other young officers.', effects: { morale: 6, health: -3 }, result: 'A Leutnant from Vienna has three bottles of Slivovitz. By Warsaw, you have all promised to meet again in Vienna after the war.' }
    ] });

  // ───────────────────────── No course: day 0–3, the retreat to the Dnieper ─────────────────────────
  rev({ id: 'c9r_0m', day: 0, phase: 0, scene: 'road', time: '05:00',
    title: 'Kharkov, Again',
    text: s => `Kharkov is given up for the last time. Your ${ss(s) ? 'section' : 'squad'} marches west along a road choked with trucks, guns, refugees and herds of cattle being driven to Germany. Behind you, sappers are blowing up the factories.${s.flags.penal ? '\n\nThe probation company marches at the back, with the sappers.' : ''}`,
    choices: [
      { text: 'Keep your men together and moving.', squad: { all: { loyalty: 4 } }, train: { leadership: 1 }, result: 'Forty kilometres a day in the dust. Nobody falls out.' },
      { text: 'Help a column of refugees off the road out of the way of the tanks.', effects: { conscience: 4, health: -3 }, result: 'Old women, children, a cart with a dead horse still in the shafts. You push the cart into the ditch. A girl of six holds your hand for a kilometre and does not say a word.' }
    ] });
  rev({ id: 'c9r_0a', day: 0, phase: 1, scene: 'village', time: '14:00',
    title: 'The Order',
    text: 'An order from division: "scorched earth". Everything of value is to be taken or destroyed: grain, cattle, wells, houses. The population of military age is to be taken west. Your squad is ordered to burn a village.',
    choices: [
      { text: 'Burn it.', effects: { conscience: -8, officers: 3 }, outcome: (s, x) => { s.orders9 = s.orders9 || { obeyed: 0, bent: 0, refused: 0 }; s.orders9.obeyed++; x.say('Thatch burns fast. The women stand in the road with what they could carry. One old man refuses to leave his house. Your men do not look at you.'); } },
      { text: 'Burn the barns and the grain. Leave the houses.', effects: { conscience: 2 }, outcome: (s, x) => { s.orders9 = s.orders9 || { obeyed: 0, bent: 0, refused: 0 }; s.orders9.bent++; x.say('Smoke from the barns, enough to be seen from the road. The houses stay standing. Nobody at battalion counts houses.'); } },
      { text: 'Report the village as already burnt.', effects: { conscience: 5, suspicion: 8 }, outcome: (s, x) => { s.orders9 = s.orders9 || { obeyed: 0, bent: 0, refused: 0 }; s.orders9.refused++; x.say('You march through without stopping. In your report the village is "destroyed". If anyone ever checks, you will be shot.'); } }
    ] });
  rev({ id: 'c9r_1m', day: 1, phase: 0, scene: 'field', time: '07:00',
    title: 'The Rearguard',
    text: 'Rearguard in a sunflower field. Soviet cavalry and tanks are pressing the retreat on both flanks.',
    choices: [
      { text: 'Hold the field until the column is past.', effects: { merit: 3, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.16, dmg: [12, 36], cause: 'Killed in the rearguard on the retreat to the Dnieper, September 1943.', hit: 'A T-34 comes through the sunflowers.', miss: 'You hold the edge of the field for three hours. Then you run, through the sunflowers taller than a man.' },
        outcome: (s, x) => { const m = x.casualty(0.2, 'in the rearguard'); say(x, m, m => `${m.name} is killed in the sunflowers.`, m => `${m.name} is wounded in the sunflowers.`); } },
      { text: 'Fall back early and save your men.', effects: { officers: -2 }, squad: { all: { loyalty: 4 } }, outcome: (s, x) => { const m = x.casualty(0.06, 'on the retreat'); if (!m) x.say('You pull back an hour early. Nobody is hit. Nobody at battalion finds out.'); else say(x, m, m => `${m.name} is killed by a shell on the way back.`, m => `${m.name} is wounded on the way back.`); } }
    ] });
  rev({ id: 'c9r_1a', day: 1, phase: 1, scene: 'village', time: '17:00',
    title: 'The Women of Lubny',
    text: 'In a village the women are being rounded up for transport to Germany as labourers. A girl breaks away and runs towards your squad. Behind her, a Feldgendarm.',
    choices: [
      { text: 'Let her run past you into the corn.', effects: { conscience: 6, suspicion: 5 }, result: 'You step aside. She vanishes into the corn. The Feldgendarm looks at you, and then at your men, and decides not to ask.' },
      { text: 'Stop her.', effects: { conscience: -6, officers: 2 }, result: 'You catch her arm. She does not struggle. That is the worst of it.' }
    ] });
  rev({ id: 'c9r_2m', day: 2, phase: 0, scene: 'river', time: '06:00',
    title: 'The Dnieper',
    text: 'The Dnieper at Kanev: a kilometre of brown water, high cliffs on the western bank. The army is crossing on a handful of bridges, under air attack, everything at once: guns, carts, wounded, cattle. This is the Eastern Wall, the radio says. Here the Soviets will be stopped.',
    choices: [
      { text: 'Get your men across in good order.', effects: { officers: 3 }, train: { leadership: 1 },
        risk: { chance: 0.08, dmg: [10, 28], cause: 'Killed by Soviet aircraft on the Dnieper bridge at Kanev, September 1943.', hit: 'Stormoviks over the bridge.', miss: 'Twenty minutes on the bridge, eyes on the sky. Then the western bank.' } },
      { text: 'Find a boat upstream and avoid the bridge.', effects: { health: -3 }, train: { scrounging: 1 }, result: 'A fisherman\'s boat, a rope, two trips. You watch the bridge being bombed from the far bank.' }
    ] });
  rev({ id: 'c9r_2n', day: 2, phase: 2, scene: 'field', time: '23:00',
    title: 'Parachutes',
    text: 'At night the sky over the river fills with parachutes: Soviet airborne troops, dropped behind the German line on the western bank. Many of them land among the German positions.',
    choices: [
      { text: 'Hunt them in the dark.', effects: { merit: 3 }, assault: true,
        risk: { chance: 0.14, dmg: [12, 34], cause: 'Killed fighting Soviet paratroopers at night near Kanev, September 1943.', hit: 'A burst from a gully.', miss: 'Until dawn, gully by gully. By morning there are dead paratroopers in the trees, and twenty prisoners, most of them boys.' } },
      { text: 'Hold your position and wait for dawn.', outcome: (s, x) => { const m = x.casualty(0.1, 'in the night fighting'); if (!m) x.say('A long night of shots and flares. At dawn you count your men. All there.'); else say(x, m, m => `${m.name} is killed in the dark.`, m => `${m.name} is wounded in the dark.`); } }
    ] });
  rev({ id: 'c9r_3m', day: 3, phase: 0, scene: 'river', time: '08:00',
    title: 'The Bridgehead',
    text: 'The Soviets have a bridgehead on the western bank at Bukrin. Your battalion attacks it, again and again, for a week.',
    choices: [
      { text: 'Lead your men in.', effects: { merit: 4, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.18, dmg: [12, 38], cause: 'Killed attacking the Bukrin bridgehead, October 1943.', hit: 'Artillery from the far bank.', miss: 'Up the ravine, into the Soviet trench. You hold it for an afternoon. At night they take it back.' },
        outcome: (s, x) => { const m = x.casualty(0.2, 'at Bukrin'); say(x, m, m => `${m.name} is killed at Bukrin.`, m => `${m.name} is wounded at Bukrin.`); } },
      { text: 'Support the attack with fire.', supply: { ammo: -1 }, outcome: (s, x) => { const m = x.casualty(0.08, 'at Bukrin'); if (!m) x.say('You fire from the ridge until the barrels are hot. The attack fails anyway.'); else say(x, m, m => `${m.name} is killed by counter-fire.`, m => `${m.name} is wounded by counter-fire.`); } }
    ] });
  rev({ id: 'c9r_3a', day: 3, phase: 1, scene: 'camp',
    title: 'A New Leutnant',
    text: 'A new company commander arrives from the war school: a Leutnant of twenty, very clean. He asks you to show him the line. He walks upright between the holes.',
    choices: [
      { text: 'Pull him down and teach him.', effects: { officers: 3 }, train: { leadership: 1 }, result: 'You pull him into the trench by his belt. He is furious, then grateful. He listens to you for a week, and then he does not need to.' },
      { text: 'Say nothing. He outranks you.', effects: { conscience: -2 }, result: 'A sniper kills him on his second day. You get another one.' }
    ] });

  SIM.EVENTS.push(...E);
  SIM.ch9 = { ss, has, men, say, track, camp, course, officer, lt, score };
})();
