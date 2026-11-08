// Chapter III, part two: Saint-Avit-sur-Cher (a fictional town on the demarcation line),
// random events for Paris and the town, and the chapter's endings.
window.SIM = window.SIM || {};

(function () {
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 2 }, o));
  const title = s => s.flags.passedCourse ? 'Unteroffizier' : 'post commander';
  const inSquad = (s, id) => !!SIM.man(s, id) && SIM.man(s, id).status === 'ok';
  // Does an informer in the squad report you? Kühn reports unless he is loyal to you.
  const informed = (s, x, base = 0.35) => {
    const k = SIM.man(s, 'kuehn');
    if (!k || k.status !== 'ok') return false;
    const p = base * (1 - k.loyalty / 120) + (s.flags.deputy === 'kuehn' ? 0.1 : 0);
    return x.roll(p);
  };

  // ── Day 7 · Sunday 10 November ──
  ev({ id: 'c3_7m', day: 7, phase: 0, scene: 'bridge', time: '10:00',
    title: 'The Bridge on the Cher',
    text: s => `Saint-Avit-sur-Cher: a small grey town of slate roofs, a church, a château, a stone bridge of seven arches. The demarcation line runs down the middle of the river. On the far bank, under the Vichy flag, two French gendarmes watch you arrive.

Your post is a hut, a barrier, a sandbagged machine-gun position and a rack of rifles. Nobody may cross without an Ausweis, a pass from the German authorities. Hundreds try every week anyway: refugees, smugglers, escaped prisoners, families split in two by a river.

As ${title(s)}, the first thing you decide is how the post will be run.`,
    choices: [
      { text: 'Strictly. A tight roster, inspections, no slack.', effects: { officers: 6 }, squad: { all: { morale: -6, loyalty: -3 } }, set: { strictPost: true }, train: { leadership: 1 },
        result: 'You post the roster on the hut door, typed. Sattler reads it twice and sighs. Kühn approves. Pohl says nothing, which from Pohl is criticism.' },
      { text: 'Fairly. A rotation everyone can see, and you take your own turns.', squad: { all: { loyalty: 6 } }, effects: { health: -3 }, train: { leadership: 1 },
        result: 'You put your own name on the roster for the worst watch, 02:00 to 04:00. Pohl raises his eyebrows. By evening the whole squad knows. It costs you sleep. It buys you something more useful.' },
      { text: 'Easy. It\'s a quiet bridge. Let the men rest.', squad: { all: { morale: 10 } }, set: { laxPost: true }, effects: { officers: -3 },
        result: 'Hartmann declares you the best commander in the Wehrmacht. Sattler starts organising card games. You hope nobody important comes by.' }
    ] });

  ev({ id: 'c3_7a', day: 7, phase: 1, scene: 'village',
    title: 'The Billet',
    text: `You are quartered in the house of the Girard family by the church. Madame Girard is a widow of fifty in black; her husband died at Verdun in 1916, and his photograph hangs in the kitchen with a ribbon across the corner. Her daughter Claire, about twenty, teaches at the village school. Her son Paul is fourteen and looks at your uniform as if he would like to set fire to it.

They have been ordered to give you their best room. Madame Girard stands in the doorway with her arms folded.`,
    choices: [
      { text: 'Thank her, in your best French, and take the small room instead.', train: { french: 1 }, rel: { madame: 20, claire: 15 }, set: { metClaire: true },
        outcome: (s, x) => x.say(x.skill('french') >= 2 ? '"Merci, madame. La petite chambre suffit." Madame Girard\'s eyebrows go up a centimetre. Claire looks at you properly for the first time. Paul goes out and slams the door.' : 'Your French is terrible, but they understand. Madame Girard\'s eyebrows go up a centimetre. Claire, almost smiling, corrects your grammar. Paul goes out and slams the door.') },
      { text: 'Give them a bag of coffee.', show: s => SIM.has(s, 'coffee'), items: { coffee: -1 }, rel: { madame: 25, claire: 10 }, set: { metClaire: true },
        result: 'Madame Girard holds the bag to her face and breathes in. Real coffee. Nobody in Saint-Avit has had any since June. "You are trying to buy us," she says. But that evening there is a cup by your bed.' },
      { text: 'Take the best room. That is the order.', rel: { madame: -15, claire: -15 }, set: { metClaire: true }, effects: { health: 4, officers: 1 },
        result: 'The best room has a soft bed and a view of the river and a crucifix over the door. You sleep wonderfully. In the morning nobody in the house speaks to you.' }
    ] });

  // ── Day 8 · Monday 11 November ──
  ev({ id: 'c3_8m', day: 8, phase: 0, scene: 'village', time: '10:45',
    title: 'The Eleventh of November',
    text: `The eleventh of November: the anniversary of the 1918 armistice, the day France won the last war. All ceremonies are forbidden. In Paris, you will hear later, students march to the Arc de Triomphe today and German troops fire on them.

In Saint-Avit, at a quarter to eleven, people begin to gather quietly at the war memorial in the square: a stone soldier and sixty-three names, four of them Girards. Old men in berets. Women in black. Children. No flags, no speeches, nothing you could call a demonstration. Not yet.

Orders say gatherings are to be dispersed. You have to send someone.`,
    choices: [
      { text: 'Send a man to watch them.', assign: true, assignPrompt: 'Who do you send to the war memorial?',
        outcome: (s, x) => {
          const m = x.man;
          const said = {
            kuehn: () => { x.apply({ conscience: -6, officers: 2 }); x.rel('madame', -15); x.rel('claire', -10); x.squadMod('kuehn', { morale: 8 }); x.say('Kühn orders them to disperse in a voice that carries across the square, and when an old man is too slow, he shoves him. The old man falls against the memorial. The crowd goes very quiet and then very slowly goes home. Madame Girard was there. She saw who sent him.'); },
            pohl: () => { x.apply({ conscience: 4, suspicion: 4 }); x.rel('madame', 15); x.squadMod('pohl', { loyalty: 6, morale: 4 }); x.say('Pohl stands at the edge of the square while they lay their flowers. At eleven o\'clock, when the church bell strikes, he takes off his cap. He was at the Somme. Some of the old men nod to him as they leave.'); },
            hartmann: () => { x.apply({ suspicion: 3 }); x.rel('claire', 8); x.say('Hartmann leans on the wall smoking, says "Bonjour" to everyone, and lets them get on with it. Ten minutes and it\'s over. Nobody can say there was a demonstration; there wasn\'t.'); },
            sattler: () => { x.apply({ marks: 2, suspicion: 2 }); x.say('Sattler sells cigarettes to the old men at the edge of the square. By the time anyone thinks of dispersing anything, it is over, and he is two marks richer.'); },
            brenner: () => { x.apply({ conscience: 3 }); x.say('Brenner stands at the edge of the square like a statue. When the bell strikes eleven he crosses himself. A woman in black crosses herself too, looking at him. Nobody is dispersed.'); },
            rau: () => { x.squadMod('rau', { morale: -5 }); x.say('Rau tries to tell them to go home and nobody understands him, and an old woman pats his cheek, and he comes back red to the ears. But it passes off quietly.'); },
            vogel: () => { x.apply({ conscience: 3 }); x.say('Vogel stands with his helmet in his hands and his lips moving. A priest comes and stands next to him. When it\'s over, the priest shakes his hand.'); }
          };
          (said[m.id] || said.brenner)();
        } },
      { text: 'Go yourself, and let them finish.', effects: { conscience: 5, suspicion: 5 }, rel: { madame: 15, claire: 10 }, train: { french: 1 },
        result: 'You stand at the back of the square while they lay their flowers and the church bell strikes eleven. Madame Girard sees you. She does not nod. But that evening there is soup on the table for you without your asking.' },
      { text: 'Break it up yourself. Orders.', effects: { officers: 4, conscience: -5 }, rel: { madame: -20, claire: -15 },
        result: 'You tell them, in bad French, to go home. They go, slowly, leaving their flowers on the steps. An old man spits on the ground near your boots. You don\'t do anything about it.' }
    ] });

  ev({ id: 'c3_8a', day: 8, phase: 1, scene: 'bridge',
    title: 'Lenz Arrives',
    text: s => `A motorcycle with a sidecar comes over the hill: the Feldgendarmerie. In the sidecar, with the metal gorget on his chest, sits Karl Lenz.

"Well, well," he says, climbing out. "${s.flags.passedCourse ? 'Herr Unteroffizier' : 'Herr Postenführer'}. My district runs from here to Vierzon. We'll be seeing a lot of each other." He looks over the post, the men, the barrier. ${s.flags.signedAgainstHartmann ? 'He winks at you. Hartmann, behind him, does not see it.' : s.flags.warnedHartmann ? 'His eyes rest on Hartmann for a long moment.' : ''}`,
    choices: [
      { text: 'Welcome him like an old comrade.', rel: { lenz: 12 }, effects: { suspicion: -5 }, squad: { hartmann: { loyalty: -6 } },
        result: 'Coffee, a cigarette, old stories from Pomerania. Lenz is pleased. He is easier to handle pleased. Hartmann watches the two of you from the hut and says nothing.' },
      { text: 'Strictly correct. Report, salute, nothing more.', effects: { officers: 2 },
        result: '"Correct as ever," Lenz says. "You haven\'t changed." He means it as a warning, and you take it as one.' },
      { text: 'Offer him a bottle of wine for the road.', show: s => SIM.has(s, 'wine'), items: { wine: -1 }, rel: { lenz: 18 }, effects: { suspicion: -6 },
        result: 'Lenz weighs the bottle in his hand. "Bordeaux. You always did know how to get along." From now on, he will expect bottles.' }
    ] });

  // ── Day 9 · Tuesday 12 November ──
  ev({ id: 'c3_9m', day: 9, phase: 0, scene: 'bridge',
    title: 'Papers',
    text: s => `A family at the barrier: a man in a good coat, a woman, two small girls in matching red hats. Their Ausweis says they are the Moreau family, going to a funeral in Châteauroux. The stamp is slightly smudged. The man's hands are steady. The woman's are not.

${SIM.skill(s, 'french') >= 2 ? 'You ask a few questions in French. The man answers smoothly, with a slight accent from somewhere east. One of the girls calls her father "Papa" and then, in a whisper, something in Yiddish.' : 'You don\'t have enough French to question them properly.'} ${inSquad(s, 'kuehn') ? 'Kühn is on the barrier with you, watching.' : ''}

You are almost certain they are Jews from Paris trying to reach the unoccupied zone, where the round-ups have not started. Not yet.`,
    choices: [
      { text: 'Stamp the pass and lift the barrier.', effects: { conscience: 10 },
        outcome: (s, x) => {
          x.say('"Bon voyage." The barrier goes up. They walk across the bridge without hurrying and without looking back, the little girls holding hands. On the far bank the French gendarmes check the pass again and let them through.');
          if (informed(s, x)) { x.apply({ suspicion: 15 }); x.rel('lenz', -5); x.say('That evening Lenz drops by. "Kühn tells me you let a family of Jews over the bridge with a forged pass." You say the pass looked fine to you. He smiles. "Of course it did."'); }
          x.log('Let a Jewish family cross the bridge.');
        } },
      { text: 'Turn them back, quietly. Tell them where the river is shallow at night.', req: s => SIM.skill(s, 'french') >= 1, reqText: 'Needs French 1.', effects: { conscience: 7 }, train: { french: 1 },
        result: '"Pas aujourd\'hui," you say loudly, for Kühn. Then, more quietly, as you hand back the pass: "La rivière. Le gué. Sous le moulin. La nuit." The man looks at you for one second. Then he takes his family back up the road. You never see them again. You hope that\'s good news.',
        log: 'Turned a family back from the bridge and told them about the ford.' },
      { text: 'Hand them over to the Feldgendarmerie. That is the regulation.', effects: { conscience: -15, officers: 4, suspicion: -8 }, rel: { lenz: 10 },
        result: 'Lenz comes on his motorcycle and takes them away. The little girls\' red hats are the last thing you see. You will never find out what happened to them, and you will never stop wondering.',
        log: 'Handed a family over to the Feldgendarmerie.' }
    ] });

  ev({ id: 'c3_9a', day: 9, phase: 1, scene: 'village',
    title: 'Sattler\'s Network',
    text: s => `Sattler has been busy. In three days he has found a farmer who sells wine and tobacco from the Vichy side, a café owner who will buy coffee at any price, and a vegetable cart that crosses the bridge every morning with an Ausweis.

"All I need," he says, "is for the barrier to be a little bit blind on Thursday mornings. Your share is a third. ${s.flags.sattlerPartner ? 'As agreed in Paris, partner.' : 'Think it over.'}"`,
    choices: [
      { text: 'Go in with him.', effects: { marks: 12, conscience: -4, suspicion: 6 }, items: { tobacco: 2 }, set: { blackMarket: true, sattlerPartner: true }, squad: { sattler: { loyalty: 20 } }, train: { scrounging: 1 },
        outcome: (s, x) => {
          if (SIM.has(s, 'coffee', 2)) { x.item('coffee', -2); x.apply({ marks: 10 }); x.say('You throw in your own Paris coffee too. The café owner pays in crisp new francs.'); }
          x.say('The first run goes perfectly. Twelve marks, two pouches of good tobacco, and a warm feeling in your stomach that you know is not entirely honesty.');
          x.log('Went into the black market with Sattler.');
        } },
      { text: 'Take a small cut and see nothing.', effects: { marks: 5, conscience: -2, suspicion: 3 }, set: { blackMarket: true }, squad: { sattler: { loyalty: 8 } },
        result: '"A gentleman\'s arrangement," Sattler says. Five marks appear in your coat pocket. You don\'t remember putting your hand out.' },
      { text: 'Forbid it. "Not on my post."', effects: { officers: 3, conscience: 2 }, squad: { sattler: { loyalty: -20, morale: -10 } },
        result: 'Sattler shrugs. "Your post, your rules." He goes on doing it, of course, but somewhere else. And he no longer thinks of you as a friend.' }
    ] });

  // ── Day 10 · Wednesday 13 November ──
  ev({ id: 'c3_10m', day: 10, phase: 0, scene: 'bridge',
    title: 'The Missing Rifle',
    text: `At morning roll call, the rifle rack in the hut has an empty slot. A Kar98k, serial number on the list, is gone.

Losing a weapon in occupied territory is a serious matter. If it has gone to the French, it could turn up in a sabotage case and lead straight back to your post. If you report it, there will be an investigation, and the investigation will start with you.`,
    choices: [
      { text: 'Report the loss to the company.', effects: { officers: -6, suspicion: 8, conscience: 2 }, set: { lostRifleReported: true }, rel: { albrecht: -5 },
        result: 'Albrecht comes himself. He is angry, but in a cold, precise way that is worse. A report goes to battalion. The rifle is not found. Your record now has a line in it about "insufficient supervision".' },
      { text: 'Send a man to find it, quietly.', assign: true, assignPrompt: 'Who do you send to find the rifle?',
        outcome: (s, x) => {
          const m = x.man;
          if (m.id === 'sattler') { s.flags.rifleFound = true; s.flags.paulProtected = true; x.squadMod('sattler', { loyalty: 6 }); x.say('Sattler comes back by noon with the rifle wrapped in a sack. "A boy had it in a hayloft. I bought it back for a carton of cigarettes, no names, no questions." You do not ask which boy. You think you know.'); }
          else if (m.id === 'kuehn') { s.flags.rifleFound = true; s.flags.paulCaught = true; x.apply({ conscience: -8 }); x.rel('madame', -40); x.rel('claire', -30); x.next('c3_10m2'); x.say('Kühn finds the rifle in the Girards\' barn within an hour, and Paul Girard with it. He drags the boy to the hut by his collar. He wants to call the Feldgendarmerie. Madame Girard is standing in the road, white-faced.'); }
          else if (m.id === 'hartmann' || m.id === 'pohl') { s.flags.rifleFound = true; s.flags.paulProtected = true; x.squadMod(m.id, { loyalty: 8 }); x.rel('madame', 10); x.say(`${m.name.split(' ')[0]} finds the rifle in the Girards' barn, under the hay, and Paul Girard standing next to it, shaking. ${m.id === 'pohl' ? 'Pohl, who has four children of his own, takes the bolt out, puts the rifle under his coat, and tells the boy that if he ever does it again, he will hand him to the Feldgendarmerie himself.' : 'Hartmann boxes the boy\'s ears, not hard, and walks the rifle back under a pile of firewood.'} Nobody else needs to know.`); }
          else { if (x.roll(0.5)) { s.flags.rifleFound = true; s.flags.paulProtected = true; x.say(`${m.name.split(' ')[0]} finds the rifle in a hayloft and brings it back without asking whose hayloft it was. You don't ask either.`); } else { x.apply({ suspicion: 6 }); x.say(`${m.name.split(' ')[0]} searches all day and finds nothing. The empty slot in the rack looks at you every time you go into the hut.`); } }
        } },
      { text: 'Ask Claire whether she knows anything.', show: s => SIM.rel(s, 'claire') >= 0, train: { french: 1 },
        outcome: (s, x) => {
          if (SIM.rel(s, 'claire') >= 20 || x.roll(0.4)) { s.flags.rifleFound = true; s.flags.paulProtected = true; x.rel('claire', 15); x.rel('madame', 10); x.say('Claire goes pale, then very still. That evening the rifle is lying on your bed, wrapped in a blanket. Nothing is said. At dinner Paul doesn\'t look at you, and Madame Girard serves you first.'); }
          else { x.rel('claire', -10); x.say('"How would I know?" she says, too fast. The rifle stays missing.'); }
        } }
    ] });

  ev({ id: 'c3_10m2', day: -1, phase: 0, scene: 'bridge', time: '11:00',
    title: 'The Boy in the Hut',
    text: 'Paul Girard sits on a bench in the hut, fourteen years old, with a bleeding lip. Kühn stands over him. "Sabotage. Theft of Wehrmacht property. The Feldgendarmerie will want him." In the road, Madame Girard waits.',
    choices: [
      { text: 'Hand him over to the Feldgendarmerie.', effects: { conscience: -15, officers: 3 }, rel: { lenz: 8, madame: -40, claire: -40 }, squad: { kuehn: { loyalty: 10 } }, set: { paulArrested: true },
        result: 'Lenz takes him away in the sidecar. A boy his age, with a rifle: he will be sent to a prison in Germany. Madame Girard doesn\'t scream. She just walks into the house and closes the door, and from that moment you are living with a woman who hopes you will die.',
        log: 'Handed Paul Girard to the Feldgendarmerie.' },
      { text: 'Overrule Kühn. The boy goes home; the rifle is back; there is no case.', effects: { conscience: 8, suspicion: 8 }, squad: { kuehn: { loyalty: -20 } }, rel: { madame: 30, claire: 25 }, set: { paulProtected: true }, train: { leadership: 1 },
        result: '"He\'s a child. The rifle\'s back. There\'s nothing to report." Kühn stares at you. "Jawohl," he says at last, in a voice that means he will write to someone tonight. You walk Paul to his mother yourself.',
        log: 'Sent Paul Girard home instead of to the Feldgendarmerie.' }
    ] });

  ev({ id: 'c3_10a', day: 10, phase: 1, scene: 'camp',
    title: 'Blood in the Guardroom',
    cond: s => inSquad(s, 'kuehn') && inSquad(s, 'hartmann') && !s.flags.strictPost,
    text: 'Shouting from the guardroom. Kühn and Hartmann are on the floor, Brenner pulling them apart. Hartmann\'s nose is bleeding; Kühn has a split eyebrow.\n\n"He insulted the Führer," Kühn says. "He said the Führer should try standing on a bridge in November."\n\n"I said the Führer should try being Kühn for a day," says Hartmann. "Which is worse."',
    choices: [
      { text: 'Punish Hartmann. Discipline is discipline.', squad: { hartmann: { loyalty: -15, morale: -10 }, kuehn: { loyalty: 10 } }, effects: { officers: 3, suspicion: -4 }, rel: { hartmann: -10 },
        result: 'Three days of extra watches for Hartmann. He takes the punishment without a word, which is worse than any word.' },
      { text: 'Punish Kühn. He started it, and everyone knows it.', squad: { kuehn: { loyalty: -15 }, hartmann: { loyalty: 8 }, all: { morale: 3 } }, effects: { suspicion: 6 },
        outcome: (s, x) => { x.say('Kühn takes the extra watches with a look of martyrdom.'); if (informed(s, x, 0.5)) { x.apply({ suspicion: 10 }); x.say('A week later you hear from Lenz that someone has written to the battalion about "political unreliability at the Saint-Avit post".'); } } },
      { text: 'Both of them, equally. And it goes no further.', squad: { kuehn: { loyalty: -5 }, hartmann: { loyalty: -3 }, all: { morale: 2 } }, train: { leadership: 1 },
        result: 'Both on extra watches, together, on the coldest shift. By the second night they are sharing a cigarette. Not friends. But not reporting each other either.' }
    ] });
  ev({ id: 'c3_10a_alt', day: 10, phase: 1, scene: 'camp',
    title: 'Weapons Cleaning',
    text: 'A quiet afternoon. You make the squad strip and clean every weapon on the post, including the machine gun, while you check the rifle numbers against the list yourself.',
    choices: [
      { text: 'Teach the young ones properly.', train: { leadership: 1, shooting: 1 }, squad: { all: { loyalty: 3 } }, result: 'Rau can strip an MG 34 blindfolded by evening. He is absurdly proud.' },
      { text: 'Leave them to it and write your reports.', effects: { officers: 2 }, result: 'Paperwork. The army runs on it. You hate every line.' }
    ] });

  // ── Day 11 · Thursday 14 November ──
  ev({ id: 'c3_11m', day: 11, phase: 0, scene: 'village',
    title: 'Yellow Posters',
    text: `An order from the Feldkommandantur, delivered by Lenz: under the new ordinance, every Jewish-owned business in the occupied zone must display a yellow notice, "Entreprise juive". In Saint-Avit there is one: Monsieur Lévy, tailor, who took in your trousers last week and refused to charge you.

Lenz hands you the poster and a pot of paste. "Your post, your town. Today, please."`,
    choices: [
      { text: 'Put it up yourself.', effects: { conscience: -7, officers: 2 }, rel: { lenz: 5 },
        result: 'Monsieur Lévy watches you through the window while you paste it on the glass. When you are finished, he comes out, looks at it, and says, in careful German, "Thank you for doing it neatly." You cannot tell whether he means it.' },
      { text: 'Send Kühn.', effects: { conscience: -10 }, squad: { kuehn: { morale: 10, loyalty: 5 } },
        result: 'Kühn does it with enthusiasm, and puts up a second notice on the door that nobody asked for. That night someone throws a stone through Monsieur Lévy\'s window. Nobody investigates.' },
      { text: 'Go to Lévy first. Warn him, give him a day to move his stock.', effects: { conscience: 8, suspicion: 8 }, train: { french: 1 },
        outcome: (s, x) => { x.say('You tell him what is coming. He listens without surprise. "Thank you, Monsieur. One day is a great deal." When you come back with the poster the next morning, the shop is half empty. You paste the notice on the glass of an empty window.'); if (informed(s, x, 0.25)) { x.apply({ suspicion: 10 }); x.say('Lenz notices the empty shelves, and the date, and you.'); } x.log('Warned Monsieur Lévy before posting the notice.'); } },
      { text: 'Refuse. "My post guards a bridge. It doesn\'t post notices."', effects: { conscience: 10, suspicion: 20, officers: -10 }, rel: { lenz: -20 }, set: { refusedOrder3: true },
        result: 'Lenz looks at you for a long time. "I\'ll do it myself, then. And I\'ll write it down." He does both.',
        log: 'Refused to post the "Jewish business" notice.' }
    ] });

  ev({ id: 'c3_11a', day: 11, phase: 1, scene: 'village', cond: s => SIM.rel(s, 'claire') >= 10 && !s.flags.paulArrested,
    title: 'Claire',
    text: `Claire finds you alone in the kitchen in the afternoon. She closes the door.

"I am going to ask you something," she says in slow, careful German. "You can say no. You can report me. I think you won't." She takes a breath. "On Saturday night, at two o'clock, some people will cross at the ford under the mill. Not on your bridge. Two men. English. Escaped from a camp in the north. If your sentry is looking at the bridge and not the river... they will be in the free zone in ten minutes, and then Spain."`,
    choices: [
      { text: '"I\'ll see what I can do."', effects: { conscience: 6, suspicion: 4 }, rel: { claire: 20 }, set: { promisedCrossing: true },
        result: 'She lets out a breath she has been holding for a long time. "Merci." Then, at the door: "My father would hate me for trusting a German. I think he would be wrong."',
        log: 'Promised Claire to look away on Saturday night.' },
      { text: '"I didn\'t hear any of this. Don\'t ask me again."', rel: { claire: 5 }, set: { silentCrossing: true },
        result: '"Of course." She understands perfectly. You have not said yes. You have not said no. It will happen anyway, and you will be on the bridge when it does.' },
      { text: 'Report her.', effects: { conscience: -25, officers: 6, suspicion: -15 }, rel: { claire: -80, madame: -60, lenz: 20 }, set: { reportedClaire: true },
        result: 'Lenz is delighted. On Saturday night the Feldgendarmerie wait at the ford. You do not go to the window. You hear the shots anyway.',
        log: 'Reported Claire Girard to the Feldgendarmerie.' }
    ] });
  ev({ id: 'c3_11a_alt', day: 11, phase: 1, scene: 'river',
    title: 'Footprints at the Ford',
    text: 'Brenner comes back from patrol along the river. Under the old mill, where the Cher is shallow enough to wade, there are footprints in the mud on both banks. Fresh ones. Someone is using the ford at night.',
    choices: [
      { text: 'Report it to the Feldgendarmerie.', effects: { officers: 3, suspicion: -3 }, rel: { lenz: 8 }, set: { lenzWatchesFord: true },
        result: 'Lenz is very interested. He says he will look into it, personally.' },
      { text: 'Note it in the post log and do nothing.', set: { silentCrossing: true },
        result: 'You write "tracks at the mill ford" in the post log, in small letters, and close the book. It is a long river. You have seven men.' }
    ] });

  // ── Day 12 · Friday 15 November ──
  ev({ id: 'c3_12m', day: 12, phase: 0, scene: 'village',
    title: 'Market Day',
    text: s => `Friday is market day in the square. There is not much: turnips, a few eggs, rabbits, chestnuts. Prices have doubled since the summer. Half of what used to be here is now on its way to Germany.

A requisitioning officer from the Feldkommandantur is going from farm to farm with a list. One of the names on it is Girard: their pig.`,
    choices: [
      { text: 'Sell your Paris goods in the café behind the church.', show: s => SIM.has(s, 'coffee') || SIM.has(s, 'stockings') || SIM.has(s, 'perfume') || SIM.has(s, 'tobacco'), effects: { suspicion: 3 }, train: { scrounging: 1 },
        outcome: (s, x) => {
          let total = 0;
          const mult = 1 + SIM.skill(s, 'scrounging') * 0.25;
          ['coffee', 'stockings', 'perfume', 'tobacco'].forEach(id => { const n = (s.items[id] || 0); if (n) { total += Math.round(n * SIM.ITEMS[id].value * mult); x.item(id, -n); } });
          x.apply({ marks: total });
          x.say(`The café owner counts out the money under the table. ${total} marks. You feel rich and dirty in roughly equal parts.`);
          s.flags.blackMarket = true;
        } },
      { text: 'Buy chestnuts and eggs for the squad (3 RM).', req: s => s.marks >= 3, reqText: 'You need 3 RM.', effects: { marks: -3, food: 15 }, squad: { all: { morale: 6, loyalty: 3 } },
        result: 'Roast chestnuts in the guard hut, eggs fried on the stove. Pohl says it is the first time in the army he has been fed by his commander.' },
      { text: 'Talk to the requisitioning officer about the Girards\' pig.', train: { french: 1 },
        outcome: (s, x) => {
          if (SIM.has(s, 'wine') || SIM.has(s, 'cigarettes', 2)) { if (SIM.has(s, 'wine')) x.item('wine', -1); else x.item('cigarettes', -2); x.rel('madame', 25); x.rel('claire', 10); x.say('A bottle (or two packs of cigarettes), a word about "the household that quarters the bridge post", and a pencil line goes through the name Girard. The pig lives. Madame Girard never mentions it. But she knits you a pair of socks.'); }
          else { x.say('He listens politely and leaves the name on the list. "Everybody has a reason, Herr Kamerad." The pig goes on Monday.'); x.rel('madame', 3); }
        } }
    ] });

  ev({ id: 'c3_12a', day: 12, phase: 1, scene: 'bridge',
    title: 'The Duty Roster',
    text: s => `You draw up the roster for Saturday night. The worst watch is 01:00 to 04:00 on the bridge, with a view of the whole river, including the ford under the mill.

${s.flags.promisedCrossing ? 'You know what is going to happen at two o\'clock. Whoever stands on the bridge will see it, or not, depending on who he is.' : s.flags.silentCrossing ? 'You have a feeling about Saturday night that you would rather not examine.' : 'It\'s just a roster.'}`,
    choices: [
      { text: 'Put a man on the 01:00 watch.', assign: true, assignPrompt: 'Who stands on the bridge at 01:00 on Saturday night?',
        outcome: (s, x) => { s.flags.nightGuard = x.man.id; x.say(`${x.man.name} is on the roster for 01:00. ${SIM.hasTrait(x.man, 'zealot') ? 'He asks why him. You tell him because you trust his eyes. He is flattered.' : SIM.hasTrait(x.man, 'schemer') ? 'He looks at the time, then at you, and smiles a little.' : 'He nods and goes back to his soup.'}`); } },
      { text: 'Take the 01:00 watch yourself.', effects: { health: -3 }, set: { nightGuard: 'self' }, squad: { all: { loyalty: 3 } },
        result: 'Your own name, in your own handwriting, on the worst watch of the week. The men notice. So might other people.' }
    ] });

  // ── Day 13 · Saturday 16 November ──
  ev({ id: 'c3_13m', day: 13, phase: 0, scene: 'bridge',
    title: 'Inspection',
    text: s => `Oberleutnant von Albrecht arrives unannounced at nine to inspect the post. He looks at everything: the roster, the log, the rifles, the men's boots, their faces.

At the end he takes you aside. "Your men are ${SIM.squadLoyalty(s) >= 60 ? 'with you' : SIM.squadLoyalty(s) >= 45 ? 'mostly with you' : 'not with you'}. I can always tell." He pauses. "${s.flags.lostRifleReported ? 'The rifle business was badly handled.' : s.flags.paulProtected ? 'I heard something about a rifle. I heard it was handled. I did not hear anything else.' : 'The post is in order.'}"`,
    choices: [
      { text: 'Ask him what he thinks of Lenz.', rel: { albrecht: 5 },
        outcome: (s, x) => x.say(`Albrecht's mouth tightens. "Gefreiter Lenz has found his calling. That is all I will say." Then, more quietly: "Be careful what he sees. I can protect a soldier from his superiors. Not from the police."`) },
      { text: 'Ask for leave for Pohl. His son is ill.', show: s => s.flags.pohlSonIll, squad: { pohl: { loyalty: 20, morale: 15 } }, rel: { albrecht: 3 },
        result: '"Two weeks," Albrecht says, after a moment. "Compassionate grounds. Write it up." Pohl, when you tell him, has to go outside for a while.' },
      { text: 'Report that all is in order.', effects: { officers: 3 },
        result: '"Good," Albrecht says. He looks at you for a moment longer, then gets back into his car.' }
    ] });

  ev({ id: 'c3_13a', day: 13, phase: 1, scene: 'bridge',
    title: 'Lenz\'s Hunch',
    text: s => `Late in the afternoon Lenz rolls up on his motorcycle. He is in a very good mood.

"A little bird tells me something will cross the Cher tonight," he says. "Not on your bridge. Somewhere near. I thought I'd keep you company on the watch. Two o'clock, let's say." He grins. "Like old times."

${s.flags.promisedCrossing ? 'Two o\'clock. The ford under the mill.' : s.flags.reportedClaire ? 'He winks. He already knows where; you told him.' : ''}`,
    choices: [
      { text: 'Get word to Claire: not tonight.', show: s => s.flags.promisedCrossing, effects: { suspicion: 4 }, rel: { claire: 10 }, set: { crossingCalledOff: true },
        outcome: (s, x) => { x.say('A word in the kitchen, very low. Claire nods once and goes out. Somewhere a message goes down a chain you will never see.'); if (informed(s, x, 0.2)) { x.apply({ suspicion: 10 }); x.say('Kühn saw you talking in the kitchen. He saw her go out.'); } } },
      { text: 'Keep Lenz busy tonight. Cards, wine, old stories.', show: s => s.flags.promisedCrossing || s.flags.silentCrossing, set: { distractLenz: true },
        outcome: (s, x) => {
          const sweet = SIM.has(s, 'wine') || SIM.has(s, 'schnapps');
          if (sweet) { if (SIM.has(s, 'wine')) x.item('wine', -1); else x.item('schnapps', -1); s.flags.lenzDrunk = true; x.say('"Come to the hut at midnight," you say. "I\'ve got a bottle I\'ve been saving." Lenz\'s eyes light up.'); }
          else x.say('"Come to the hut at midnight. We\'ll play skat." Lenz agrees. Without a bottle, though, you are not sure how long he will sit still.');
        } },
      { text: '"Glad to have you, Karl."', rel: { lenz: 5 },
        result: 'He claps you on the shoulder and roars off. You have five hours to think.' }
    ] });

  ev({ id: 'c3_13n', day: 13, phase: 2, scene: 'bridge', time: '01:55',
    title: 'Night on the Cher',
    text: s => {
      const g = s.flags.nightGuard === 'self' ? 'you' : (SIM.man(s, s.flags.nightGuard) || { name: 'the sentry' }).name;
      let t = `Five to two. Mist on the river, the moon behind cloud. On the bridge: ${g}. ${s.flags.distractLenz ? (s.flags.lenzDrunk ? 'In the hut, Lenz is three glasses into your bottle and losing at skat.' : 'In the hut, Lenz is playing skat with you, restless, glancing at the window.') : 'Lenz is somewhere in the dark by the mill, waiting.'}`;
      if (s.flags.crossingCalledOff) t += '\n\nNothing will cross tonight. You hope.';
      else if (s.flags.reportedClaire) t += '\n\nThe Feldgendarmerie are waiting at the ford. You know who will come.';
      else if (s.flags.promisedCrossing || s.flags.silentCrossing) t += '\n\nAt two o\'clock exactly, below the mill, shapes begin to move in the water.';
      else t += '\n\nAt two o\'clock you hear something at the ford under the mill: splashing, voices, then silence.';
      return t;
    },
    choices: [
      { text: 'Wait and see what happens.', outcome: (s, x) => SIM.ch3Climax(s, x) }
    ] });

  SIM.EVENTS.push(...E);

  // ── The climax, resolved from everything that happened ──
  SIM.ch3Climax = function (s, x) {
    const f = s.flags;
    if (f.crossingCalledOff) {
      x.say('Lenz waits by the mill until dawn and catches nobody. He comes back frozen and furious. "Someone talked," he says, looking at each of you in turn. Three nights later, you hear, two English soldiers crossed the Cher twenty kilometres downstream.');
      x.apply({ suspicion: 6, conscience: 4 });
      f.savedCrossers = true;
      return;
    }
    if (f.reportedClaire) {
      x.apply({ morale: -15 });
      x.say('Shots at the ford, and shouting. In the morning the house is empty: Claire has been taken to the prison in Tours, and the two Englishmen to a camp. Madame Girard sits in the kitchen with her husband\'s photograph. Paul is gone too; he has run south across the river.');
      x.log('Claire Girard was arrested at the ford.');
      return;
    }
    const active = f.promisedCrossing || f.silentCrossing;
    const guard = f.nightGuard === 'self' ? null : SIM.man(s, f.nightGuard);
    // Does the sentry raise the alarm?
    let alarm = false;
    if (guard) {
      if (SIM.hasTrait(guard, 'zealot')) alarm = guard.loyalty < 70 || x.roll(0.5);
      else if (SIM.hasTrait(guard, 'schemer') || SIM.hasTrait(guard, 'joker')) alarm = false;
      else alarm = guard.loyalty < 35 && x.roll(0.5);
    }
    const lenzNear = !f.distractLenz || (!f.lenzDrunk && x.roll(0.5));
    if (!active) {
      if (alarm || lenzNear) { x.apply({ officers: 4 }); x.say('A flare goes up over the ford. Two men in the water, running. Shots. Lenz brings one back, an escaped English soldier, soaked and shaking; the other gets away into the Vichy zone. Lenz gets the credit. You get a mention.'); }
      else x.say('Whatever crossed the ford tonight, nobody saw it. In the morning there are footprints in the mud on the far bank.');
      return;
    }
    if (alarm) {
      x.say(`${guard.name} sees the shapes in the water and fires a flare. The night turns white. Two men in the river, running. Shots from the mill: Lenz.`);
      if (x.roll(0.5)) { x.apply({ conscience: -4, morale: -8 }); x.say('One of them is caught on the bank. The other makes it into the trees on the far side. In the morning Lenz questions everyone in the Girard house. Claire says nothing. They have nothing on her. Yet.'); f.claireSuspected = true; }
      else { x.apply({ morale: -4 }); x.say('Both of them make it to the trees on the far side. Lenz comes back cursing. In the morning he asks who drew up the roster.'); x.apply({ suspicion: 10 }); f.savedCrossers = true; }
      return;
    }
    if (lenzNear) {
      x.say('Lenz is at the mill. You hear his voice, "Halt!", then nothing, then a long, uncertain silence.');
      if (x.roll(0.55)) { f.savedCrossers = true; x.apply({ conscience: 8, suspicion: 8 }); x.say('He comes back an hour later with mud to his knees and nothing to show for it. "Lost them in the mist," he says, and looks at you for a very long time.'); x.log('Two English soldiers crossed the Cher on my watch.'); }
      else { f.crossersCaught = true; x.apply({ morale: -10, suspicion: 15 }); x.say('He brings back one of them, a red-haired English corporal, soaked and grinning with despair. The other is shot in the water. In the morning Lenz asks who drew up the roster, and who is billeted with the Girards.'); if (s.stats.suspicion >= 75) { x.say('By noon the Feldgendarmerie have come for you.'); x.end('arrested'); } }
      return;
    }
    f.savedCrossers = true;
    x.apply({ conscience: 10, morale: 6 });
    x.rel('claire', 15);
    x.say(`${guard ? `${guard.name} stands on the bridge looking steadily at the bridge.` : 'You stand on the bridge looking steadily at the bridge.'} Below the mill, two shapes wade the Cher, slip on the stones, steady each other, and climb out on the far bank into the free zone. The mist closes behind them. It takes four minutes.${f.lenzDrunk ? ' In the hut, Lenz wins a hand of skat and laughs.' : ''}`);
    x.log('Two English soldiers crossed the Cher on my watch. I watched the bridge.');
  };

  // ───────────────────────── Random events ─────────────────────────
  const paris = s => s.chapter === 2 && s.day <= 4;
  const town = s => s.chapter === 2 && s.day >= 7;
  SIM.POOL.push(
    { id: 'px_metro', chapters: [2], phases: [2], cond: paris, scene: 'city',
      title: 'The Last Métro',
      text: 'You lose track of time in a bar in Montparnasse and miss the last Métro. It is twenty to midnight and a long walk to the barracks. Around the corner, torches: a Feldgendarmerie patrol.',
      choices: [
        { text: 'Bribe them with cigarettes.', show: s => SIM.has(s, 'cigarettes', 2), items: { cigarettes: -2 },
          result: 'Two packs change hands. The Feldgendarm, a tired Bavarian, waves you on. "Run, then."' },
        { text: 'Run for it through the side streets.', train: { scrounging: 1 },
          outcome: (s, x) => { if (x.roll(0.55)) x.say('Left, right, an alley, a courtyard, a gate. You come out by the Seine with your heart hammering, alone and free.'); else { x.apply({ officers: -6, suspicion: 3 }); x.say('A dead end. Torches in your face. Your name in a book, and a week of latrine duty.'); } } },
        { text: 'Walk up to them and report yourself.', effects: { officers: -2 },
          result: 'They are surprised enough by your honesty to give you a lift in the truck, and a lecture, and a note to your company.' }
      ] },
    { id: 'px_cafe', chapters: [2], phases: [2], cond: paris, scene: 'city',
      title: 'Students',
      text: 'In a café in the Latin Quarter, a table of students goes silent when you sit down. Then one of them, a girl in glasses, says something to the others and they laugh.',
      choices: [
        { text: 'Answer in French.', train: { french: 1 },
          outcome: (s, x) => { if (x.skill('french') >= 2) { x.apply({ morale: 5, conscience: 2 }); x.say('"I heard that," you say in French. Silence. Then the girl laughs, and asks where a German learned French, and for an hour you argue about Goethe and Victor Hugo. When you leave, nobody shakes your hand. But nobody spits, either.'); } else { x.apply({ morale: -2 }); x.say('Your French makes them laugh harder. You pay and leave.'); } } },
        { text: 'Leave. You know when you\'re not wanted.', result: 'You finish your coffee standing up and go.' }
      ] },
    { id: 'px_parcel', chapters: [2], phases: [2], cond: s => paris(s) && (SIM.has(s, 'stockings') || SIM.has(s, 'perfume')), scene: 'letter',
      title: 'A Parcel Home',
      text: 'The field post office is overwhelmed: every soldier in Paris is sending parcels home. Stockings, perfume, lingerie, cognac, shoes. The clerks call it "Operation Silk".',
      choices: [
        { text: 'Send your stockings and perfume home.', effects: { morale: 8 },
          outcome: (s, x) => { ['stockings', 'perfume'].forEach(id => { if (SIM.has(s, id)) x.item(id, -(s.items[id])); }); x.say(s.flags.sweetheart ? 'You send them to Liesel. Three weeks later a letter comes back that you read eleven times.' : 'Your mother writes back that she has never owned anything so beautiful, and that she will save them for your sister\'s wedding, and then for church.'); } },
        { text: 'Keep them. They\'ll be worth more in the provinces.', train: { scrounging: 1 }, result: 'Sattler would be proud of you. You are not sure you are.' }
      ] },
    { id: 'px_letter', chapters: [2], phases: [2], cond: paris, scene: 'letter',
      title: 'News from Home',
      text: s => ({
        spd: 'A letter from your mother. Your father has been called in by the Gestapo again, "just a conversation". He came home and went straight to bed. "He asks if you are well. He asks if you are still you."',
        catholic: 'A letter from your mother. The priest in the next parish was arrested for a sermon. "Father Kaspar is very careful now. We are all very careful."',
        party: 'A letter from your father. He has been made Ortsgruppenleiter. He wants to know how many Frenchmen you have shot and whether you have met any generals.',
        none: 'A letter from your sister. Rationing is worse; they have stopped selling coffee entirely. "Is it true that in Paris you can buy anything?"'
      }[s.char.family]),
      choices: [
        { text: 'Write back honestly.', effects: { conscience: 3, suspicion: 3, morale: 3 }, result: 'You write more than you should. You post it anyway.' },
        { text: 'Write back about the Eiffel Tower.', effects: { morale: 4 }, result: 'Safe, cheerful, and false. The censor will like it.' }
      ] },

    { id: 'tx_cards', chapters: [2], phases: [2], cond: town, scene: 'camp',
      title: 'Skat in the Guardroom',
      text: 'A stove, a lamp, a pack of greasy cards. Hartmann deals. The squad crowds round.',
      choices: [
        { text: 'Play, and lose gracefully.', effects: { marks: -2, morale: 4 }, squad: { all: { loyalty: 4, morale: 5 } }, result: 'You lose two marks to Brenner, who turns out to be a card shark behind that slow face. The men like you better for it.' },
        { text: 'Play to win.', train: { scrounging: 1 }, outcome: (s, x) => { if (x.roll(0.5)) { x.apply({ marks: 4 }); x.squadMod('all', { morale: 2 }); x.say('You win four marks and a grudging respect.'); } else { x.apply({ marks: -3 }); x.say('Sattler cleans you out with a smile. You suspect the deck.'); } } },
        { text: 'Go to bed. Someone has to be fresh in the morning.', effects: { health: 4 } }
      ] },
    { id: 'tx_pohl', chapters: [2], phases: [2], cond: s => town(s) && inSquad(s, 'pohl'), scene: 'letter',
      title: 'Pohl\'s Letter',
      text: 'Pohl sits by the stove with a letter, not reading it, just holding it. His youngest, Hänschen, five years old, has diphtheria. The hospital in Leipzig has no serum.',
      choices: [
        { text: 'Give him money to send home (5 RM).', req: s => s.marks >= 5, reqText: 'You need 5 RM.', effects: { marks: -5, conscience: 3 }, squad: { pohl: { loyalty: 20, morale: 10 } }, set: { pohlSonIll: true },
          result: 'He tries to refuse and can\'t. "I\'ll pay you back." You both know he won\'t, and that you don\'t care.' },
        { text: 'Promise to ask Albrecht for compassionate leave.', squad: { pohl: { loyalty: 10, morale: 5 } }, set: { pohlSonIll: true },
          result: '"Would you?" He looks at you as if you have offered him a miracle.' },
        { text: 'Tell him to keep his mind on his duty.', squad: { pohl: { loyalty: -15, morale: -15 } }, effects: { officers: 1 },
          result: '"Jawohl." He folds the letter very small and puts it away.' }
      ] },
    { id: 'tx_rau', chapters: [2], phases: [2], cond: s => town(s) && inSquad(s, 'rau'), scene: 'village',
      title: 'Rau Sings',
      text: 'Rau has found the café\'s cognac and is singing "Erika" in the square at midnight, after curfew, very loudly.',
      choices: [
        { text: 'Carry him home and say nothing.', squad: { rau: { loyalty: 15 } }, effects: { health: -2 }, rel: { rau: 10 }, result: 'He weighs nothing. He is asleep before you reach the door. In the morning he can\'t look at you. In the afternoon he follows you around like a dog.' },
        { text: 'Put him on report.', squad: { rau: { loyalty: -10 }, all: { loyalty: -2 } }, effects: { officers: 3 }, train: { leadership: 1 }, result: 'Three days of extra duty. He takes it like a soldier. Something between you cools.' }
      ] },
    { id: 'tx_lights', chapters: [2], phases: [2], cond: town, scene: 'river',
      title: 'Lights on the River',
      text: 'On your rounds after midnight you see a lantern on the water downstream: a rowing boat, crossing to the Vichy side. Smugglers, refugees, lovers: who knows.',
      choices: [
        { text: 'Fire a flare and challenge them.', effects: { officers: 4, conscience: -3 },
          outcome: (s, x) => { if (x.roll(0.5)) x.say('The lantern goes out. Shouts, splashing. In the morning a boat is found upturned on the far bank. Nobody inside.'); else { x.apply({ merit: 1 }); x.say('Two black-market boys from the town, with sacks of tobacco. You hand them over. Sattler is furious for a week.'); x.squadMod('sattler', { loyalty: -8 }); } } },
        { text: 'Watch it go. Not your bridge.', effects: { conscience: 2 }, result: 'The lantern reaches the far bank and goes out. The river is quiet again.' }
      ] },
    { id: 'tx_leaflets', chapters: [2], phases: [2], cond: town, scene: 'field',
      title: 'Paper from the Sky',
      text: 'A British plane passes over in the night. In the morning the fields are white with leaflets in French: "The RAF will return. Courage. France will live." Reading or keeping them is forbidden.',
      choices: [
        { text: 'Have the squad collect and burn them.', effects: { officers: 3 }, squad: { kuehn: { morale: 5 } }, result: 'A bonfire in the square. Children watch from doorways. One of them is Paul Girard, with a leaflet in his pocket.' },
        { text: 'Read one first.', train: { french: 1 }, effects: { suspicion: 3, conscience: 2 }, result: 'Courage. France will live. It is strange to read hope written for someone else.' }
      ] },
    { id: 'tx_fire', chapters: [2], phases: [2], cond: town, scene: 'village',
      title: 'Fire!',
      text: 'Shouting in the night. A chimney fire has spread to the thatch of a farmhouse on the edge of town. A woman is screaming that her father is still inside.',
      choices: [
        { text: 'Go in after him.', effects: { conscience: 8, merit: 2 }, rel: { madame: 15, claire: 10 }, train: { medicine: 1 },
          risk: { chance: 0.25, dmg: [10, 30], fatal: 0.05, cause: 'Killed in a house fire at Saint-Avit-sur-Cher, November 1940, while rescuing a French civilian.',
            hit: 'A beam comes down as you drag him to the door. You both get out, burned.',
            miss: 'Smoke, heat, an old man on the floor. You drag him out by his collar. He lives.' },
          outcome: (s, x) => { s.flags.fireRescue = true; x.log('Pulled an old man out of a burning farmhouse.'); } },
        { text: 'Organise the squad into a bucket chain.', squad: { all: { morale: 4, loyalty: 3 } }, train: { leadership: 1 }, rel: { madame: 8 }, effects: { officers: 3 },
          result: 'German soldiers and French farmers passing buckets from the well, side by side, until the fire is out. The old man is brought out alive by his neighbours. For one night, nobody is anybody\'s enemy.' },
        { text: 'It\'s not your house. Keep the post manned.', effects: { conscience: -4 }, result: 'You watch the glow from the bridge. In the morning there is a blackened shell, and the town knows who did not come.' }
      ] },
    { id: 'tx_brenner', chapters: [2], phases: [2], cond: s => town(s) && inSquad(s, 'brenner'), scene: 'camp',
      title: 'Brenner\'s Question',
      text: 'Brenner, who never talks, sits down next to you on watch. After a long time he says: "In Belgium. The houses we burned. Does God forgive that, do you think? If we were ordered?"',
      choices: [
        { text: '"I don\'t know. I think about it too."', effects: { conscience: 4 }, squad: { brenner: { loyalty: 15 } }, result: 'He nods slowly, as if that is the best possible answer. Perhaps it is.' },
        { text: '"Orders are orders. The responsibility lies above us."', effects: { conscience: -3 }, squad: { brenner: { morale: 5 } }, result: '"Yes," he says. "Yes. Above us." He doesn\'t sound convinced. Neither do you.' }
      ] },
    { id: 'tx_cold', chapters: [2], phases: [2], cond: town, scene: 'bridge',
      title: 'A Cold Night',
      text: 'The first hard frost. The sentries on the bridge are stamping their feet and blowing on their hands, and the stove in the hut has run out of wood.',
      choices: [
        { text: 'Share your coffee with the sentries.', show: s => SIM.has(s, 'coffee'), items: { coffee: -1 }, squad: { all: { morale: 10, loyalty: 5 } }, result: 'Real coffee, boiled on the stove, at three in the morning. Hartmann says he will follow you into hell.' },
        { text: 'Share your schnapps.', show: s => SIM.has(s, 'schnapps'), items: { schnapps: -1 }, squad: { all: { morale: 8, loyalty: 3 } }, effects: { officers: -1 }, result: 'Strictly forbidden on duty. Strictly appreciated.' },
        { text: 'Send two men to "find" firewood.', assign: true, assignPrompt: 'Who goes to find firewood?',
          outcome: (s, x) => { const m = x.man; if (SIM.hasTrait(m, 'schemer') || SIM.hasTrait(m, 'strong')) { x.squadMod('all', { morale: 6 }); x.say(`${m.name.split(' ')[0]} comes back with an armful of seasoned oak. You do not ask from whose woodpile.`); } else { x.squadMod(m.id, { morale: -4 }); x.say(`${m.name.split(' ')[0]} comes back with wet branches that smoke and hiss and give no heat.`); } } }
      ] }
  );

  // ───────────────────────── Endings ─────────────────────────
  const east = 'In the spring of 1941 the division is relieved on the Cher and loaded onto trains. They go east, through Germany, through Poland, to the new border with the Soviet Union. Nobody says why. Everybody knows.';
  SIM.ch3Ending = function (s) {
    const f = s.flags;
    if (s.stats.health < 30) return 'oc_wounded';
    if (f.blackMarket && s.stats.suspicion >= 70) { f.blackMarketCaught = true; return 'oc_court'; }
    if (f.savedCrossers && s.stats.suspicion < 70) return 'oc_line';
    if (SIM.squadLoyalty(s) >= 62 && s.stats.officers >= 55) return 'oc_leader';
    if (s.stats.suspicion >= 55) return 'oc_marked';
    if (f.blackMarket && s.marks >= 40) return 'oc_profiteer';
    if (s.stats.conscience <= 25) return 'oc_hardened';
    if (s.stats.conscience >= 70) return 'oc_witness';
    return 'oc_survivor';
  };
  Object.assign(SIM.ENDINGS, {
    oc_wounded: { title: 'A Bed in Paris', text: s => `You end the year in a requisitioned hospital in Paris, under the care of French nurses who are polite to you and no more. The burns, or the wounds, will heal.\n\n${east}` },
    oc_court: { title: 'Court-Martial', text: s => `The Feldgendarmerie raid Sattler's café in December. Under questioning, the café owner names Sattler, and Sattler, to save himself, names you.\n\nBlack-market dealing in occupied territory: four months' imprisonment, reduction to Schütze. You serve it in the military prison at Torgau, and then you are sent back to a unit, any unit, in the east.\n\n${east}`,
      onFinish: s => { if (s.rank > 0) { s.rank = 0; s.rankHistory.push({ rank: 0, date: 'February 1941' }); } } },
    oc_line: { title: 'The Ford Under the Mill', text: s => `Two men crossed the Cher on your watch and nobody will ever be able to prove anything. ${SIM.rel(s, 'claire') >= 30 ? 'When the company leaves Saint-Avit, Claire Girard stands in the doorway and says, "Au revoir," not "adieu". In French, the difference matters.' : ''}\n\nYou did not save the world. You looked at a bridge instead of a river for four minutes. It turns out that this, too, is a kind of courage, and a kind of treason, depending on who is counting.\n\n${east}` },
    oc_leader: { title: 'An NCO', text: s => `Your post on the Cher is the best-run on the battalion's stretch of the line, and your men would follow you anywhere. ${s.flags.passedCourse ? 'Albrecht says you are the kind of Unteroffizier the army was built on.' : 'Albrecht says it is time you went on the NCO course, and this time he means it.'}\n\nIt is a good feeling. You will need those men to follow you, very soon, to places none of you can imagine.\n\n${east}` },
    oc_marked: { title: 'Lenz\'s File', text: s => `By the end of the year, the file that Karl Lenz keeps on you at the Feldgendarmerie in Vierzon is as thick as a novel. Nothing in it is quite enough. Together, it is almost enough.\n\nAlbrecht gets you transferred out of Lenz's district before it is. You never know whether he does it to protect you or to protect the company.\n\n${east}` },
    oc_profiteer: { title: 'Business as Usual', text: s => `By Christmas you have more money than you have ever had in your life. You send a parcel home every week. Your mother asks no questions. Sattler calls you "partner" in front of the men, and some of them have started to look at you the way they look at him.\n\n${east}` },
    oc_hardened: { title: 'Occupier', text: s => `You have learned the occupier's trade: how to look through people, how to take what is offered, how to post a notice on a shop window and walk away. It was easier than you expected. That is the part you try not to think about.\n\n${east}` },
    oc_witness: { title: 'What France Taught You', text: s => `You leave France speaking better French than you arrived with, and carrying more faces: the old man at the Arc, the girls in red hats, Monsieur Lévy behind his window, a fourteen-year-old with a stolen rifle.\n\nYou are still in the uniform. But you have begun to understand that the war is not only fought at the front.\n\n${east}` },
    oc_survivor: { title: 'Quiet Months', text: s => `Months on a bridge over a quiet river. You did your duty, mostly. You looked away, sometimes. You were not a hero and not a villain. In later years, when people ask what you did in France, you will say "guard duty", and it will be true.\n\n${east}` }
  });
})();
