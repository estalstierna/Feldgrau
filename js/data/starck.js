// Wolfram Starck's earlier appearances, Chapters II–IV. He first meets the player in
// Belgium in May 1940 and comes back in Paris, on the Cher and on the road east, so that
// by the winter before Moscow he knows exactly who the player is.
window.SIM = window.SIM || {};

(function () {
  const met = s => !!s.flags.metStarck;
  const rankName = s => (s.chapter || 0) >= 3 ? 'Hauptsturmführer' : 'Obersturmführer';
  // What he remembers about you, in one sentence.
  const memory = s => {
    const f = s.flags;
    if (f.starckParis) return 'You dined with him at Maxim\'s.';
    if (f.starckBelgium) return 'You shared a bottle with him at Onhaye.';
    return 'You have met before.';
  };

  const E = [];

  // ───────────────────────── Chapter II · Onhaye, 14 May 1940 ─────────────────────────
  E.push({ id: 'st_2', chapter: 1, day: 4, phase: 2, scene: 'village', time: '22:00',
    title: 'The Black Collar Patches',
    text: s => `Night in Onhaye after the counterattack. A motorcycle with a sidecar pulls up by your squad's fire, and an officer climbs out: thirty-three or so, tall, with the black collar patches of the SS. SS-Obersturmführer Wolfram Starck, liaison officer from an SS regiment following behind the panzers.

He warms his hands at your fire as if it were his own. "${SIM.hasMedal(s, 'ek2') ? 'An Iron Cross from Poland. Good.' : 'Poland, I hear. And now this.'}" He looks round at your men. "I was in Poland too. Behind the front. Necessary work, which the Army was too delicate to do." He smiles. "You have the face of a man who saw some of it."`,
    choices: [
      { text: '"We saw some of that work. In a village in the Tuchel Heath."', show: s => s.flags.firingSquad || s.flags.refusedOrder || s.flags.triedToStop || s.flags.stoppedReprisal || s.flags.lenzKilled,
        effects: { suspicion: 4, conscience: 3 }, rel: { starck: -6 }, set: { metStarck: true, starckBelgium: true, starckPoland: true },
        result: 'You say it flatly, without adjectives. Starck listens with his head on one side. "And it troubles you," he says. "Interesting. Most of the Army has the same sickness. It will pass, or it will not." He writes something in a small black notebook.' },
      { text: 'Share your bottle and talk about the crossing at Houx.', show: s => SIM.has(s, 'wine') || SIM.has(s, 'schnapps'),
        rel: { starck: 8 }, set: { metStarck: true, starckBelgium: true },
        outcome: (s, x) => { if (SIM.has(s, 'wine')) x.item('wine', -1); else x.item('schnapps', -1); x.say(`He drinks from the bottle like a soldier. He wants to know everything about the rubber boats, the French bunkers, ${s.flags.tookBoat ? 'the paddle, which he has already heard about' : 'the pioneers'}. "You are a fighter," he says when he leaves. "I will remember your name."`); } },
      { text: 'Ask him about the SS. Why does a schoolteacher join?', rel: { starck: 6 }, set: { metStarck: true, starckBelgium: true, askedSS: true },
        result: '"Because I taught history," he says. "Versailles, the inflation, the street battles. I watched my country humiliated for fifteen years. Then someone came who said: enough." His eyes are very pale in the firelight. "We are not soldiers like you. We are the Idea, with rifles."' },
      { text: 'Be correct, and say as little as possible.', set: { metStarck: true, starckBelgium: true },
        result: '"The Army\'s answer to everything," Starck says pleasantly. "Correctness." He finishes warming his hands and goes, and the fire seems to burn more easily without him.' }
    ] });

  // ───────────────────────── Chapter III · Paris, 14 July 1940 ─────────────────────────
  E.push({ id: 'st_3a', chapter: 2, day: 2, phase: 2, scene: 'city', time: '21:00',
    title: 'Maxim\'s',
    text: s => `The evening of the fourteenth of July. Outside Maxim's on the Rue Royale, the most famous restaurant in Paris, now full of German officers, someone calls your name.

${met(s) ? `It is Starck, from the fire at Onhaye. ${memory(s)}` : 'An SS-Obersturmführer you have never met, tall, pale-eyed, holding a cigarette.'} "${s.char.last}! Come. I am celebrating. The French have no national day this year, so I am having one for them." He holds the door open. Inside: white tablecloths, champagne, waiters with faces like stone.`,
    choices: [
      { text: 'Accept. Champagne at Maxim\'s, on the SS.', effects: { morale: 8, food: 15 }, rel: { starck: 8 }, set: { metStarck: true, starckParis: true },
        outcome: (s, x) => {
          x.say('He orders for both of you without looking at the menu. Over the oysters he talks about the future: a new Europe, run from Berlin, cleansed. "The Jews of Paris," he says, as one might mention the weather, "will be dealt with. Not yet. There is a sequence to these things."');
          if (s.flags.lenzFeldgendarm || SIM.rel(s, 'lenz') !== undefined) x.say('"Your old comrade Lenz," he adds, "is going to the Feldgendarmerie. I wrote him a recommendation. A good man. He sees things clearly."');
        } },
      { text: 'Accept, and push back when he talks about the Jews.', effects: { conscience: 5, suspicion: 6, food: 12 }, rel: { starck: -4 }, set: { metStarck: true, starckParis: true, arguedStarck: true },
        result: 'When he says "dealt with", you put down your fork and ask him what that means, exactly. The table goes quiet. Starck looks at you with real interest, like a doctor at a symptom. "It means exactly what it sounds like," he says. "You will see. And you will get used to it. Everyone does." He pays for the dinner anyway.' },
      { text: 'Decline politely. You have to be back at the barracks.', set: { metStarck: true }, rel: { starck: -2 },
        result: '"Duty," he says, amused. "Of course." He goes inside without you. Through the window you see him raise a glass to a table of generals.' }
    ] });

  // ───────────────────────── Chapter III · Saint-Avit, 15 November 1940 ─────────────────────────
  E.push({ id: 'st_3b', chapter: 2, day: 12, phase: 2, scene: 'bridge', time: '20:00',
    title: 'Passing Through',
    text: s => {
      const f = s.flags;
      let t = `A black Mercedes stops at your barrier after dark. In the back seat: Starck, on his way to Bordeaux, and beside him, Lenz. ${met(s) ? memory(s) : 'Lenz introduces him: SS-Obersturmführer Starck.'}\n\n"Lenz tells me interesting things about your bridge," Starck says through the open window.`;
      if (f.savedCrossers === undefined && (f.promisedCrossing || f.silentCrossing)) t += ' "Something about the ford under the mill."';
      return t;
    },
    choices: [
      { text: '"It is a quiet bridge, Herr Obersturmführer. Nothing crosses that shouldn\'t."', set: { metStarck: true },
        outcome: (s, x) => {
          const handed = s.seen && s.seen.c3_9m && !s.flags.letCross;
          if (s.flags.reportedClaire) { x.rel('starck', 10); x.say('"Lenz says you reported a smuggling ring. Good work." Starck nods to you. "I like men who understand where their loyalty lies."'); }
          else if (SIM.rel(s, 'lenz') < -10) { x.rel('starck', -6); x.apply({ suspicion: 4 }); x.say('Lenz says nothing, which says a great deal. Starck looks from one of you to the other. "Old comrades," he says. "How touching." The car drives on.'); }
          else x.say('"Of course," says Starck. He smiles. Lenz smiles. The car drives on into the dark.');
        } },
      { text: 'Offer them coffee from your Paris supply.', show: s => SIM.has(s, 'coffee'), items: { coffee: -1 }, rel: { starck: 5, lenz: 5 }, set: { metStarck: true },
        result: 'Real coffee, boiled on the guard-hut stove at eight in the evening. Starck drinks it standing by the barrier and looks across the river into the free zone. "One day," he says, "there will be no line. All of it will be ours." Then he says to you, quietly: "If Lenz ever becomes a problem for you, write to me." He gives you a card with an address in Berlin.',
        log: 'Starck gave me his address in Berlin.' }
    ] });

  // ───────────────────────── Chapter IV · east of the Bug, 23 June 1941 ─────────────────────────
  E.push({ id: 'st_4', chapter: 3, day: 2, phase: 2, scene: 'camp', time: '22:00',
    title: 'Special Tasks',
    text: s => `A staff car on the sand road at nightfall. Starck, now an SS-Hauptsturmführer, liaison to a group he calls only "the special task forces". ${met(s) ? memory(s) : 'He introduces himself and asks for your name, and writes it down.'}

He is in a strange, bright mood. "Behind you," he says, nodding toward the west, "my people will make this country safe. Commissars, agitators, saboteurs. Jews. The Army fights the war. We win the peace." He offers you a cigarette. "In a week you will hear things. Do not believe the exaggerations. Believe the rest."`,
    choices: [
      { text: 'Ask him what "the rest" means.', effects: { conscience: 3, morale: -6 }, rel: { starck: 2 }, set: { metStarck: true, starckWarned: true },
        result: 'He tells you. Calmly, precisely, the way a teacher explains a lesson: lists, round-ups, pits outside towns. You realise, listening, that he is not boasting. He is confiding in you. That is the worst part.' },
      { text: '"I don\'t want to know."', rel: { starck: -3 }, set: { metStarck: true },
        result: '"No," he says. "None of you do. That is why it falls to us." He gets back into the car.' },
      { text: '"The Army will do its part, Herr Hauptsturmführer."', effects: { conscience: -5, suspicion: -4 }, rel: { starck: 8 }, set: { metStarck: true },
        result: '"I knew you would understand," he says, pleased. "I have always thought you were wasted in the infantry."' }
    ] });

  SIM.EVENTS.push(...E);

  // In Chapter V he remembers you.
  const intro = SIM.EVENTS.find(e => e.id === 'c5_1m');
  if (intro) {
    const old = intro.text;
    intro.text = s => !met(s) ? old(s) : `A staff car with SS runes on the number plate pulls up at the company command post. The officer who gets out wears a long leather coat lined with fur: Wolfram Starck, SS-Hauptsturmführer, liaison officer from the Waffen-SS division on your right flank. Tomorrow the two units attack together.

${memory(s)} He walks straight up to you as if no time had passed.

"${s.char.last}." He looks at your ${SIM.hasMedal(s, 'ek2') ? 'Iron Cross ribbon' : 'empty buttonhole'}, then at your face. "${SIM.rel(s, 'starck') >= 25 ? 'I asked for your company on this flank. I wanted men I could rely on.' : SIM.rel(s, 'starck') <= -15 ? 'You are still here. I wondered.' : 'Still alive. Good. We will see what you are made of.'}"`;
  }
})();
