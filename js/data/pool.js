// Random events. Drawn for any slot without a scripted event (currently: nights).
// { id, phases:[...], cond?, weight?, scene, title, text, choices }
window.SIM = window.SIM || {};

const peace = s => !SIM.DAYS[s.day].war;
const war = s => !!SIM.DAYS[s.day].war;

SIM.POOL = [
  // ── Peace (in the camp, before 1 September) ──
  {
    id: 'p_skat', phases: [2], cond: peace, scene: 'camp',
    title: 'A Game of Skat',
    text: 'Behind a supply truck, a reservist from Köslin is running a skat game by torchlight. "One more hand," he says. "Pfennig a point, two marks to sit down."',
    choices: [
      { text: 'Sit down (2 RM).', req: s => s.marks >= 2, reqText: 'You need 2 RM.',
        outcome: (s, x) => {
          const p = s.flags.trader ? 0.6 : 0.45;
          if (x.roll(p)) { x.apply({ marks: 4, morale: 4, comrades: 2 }); x.say('Your cards are good and your counting is better. You walk away four marks richer.'); }
          else { x.apply({ marks: -2, morale: 1, comrades: 2 }); x.say('You lose, cheerfully, to a man who has clearly been doing this since the Kaiser\'s time.'); }
        } },
      { text: 'Watch for a while, then go to bed.', effects: { health: 3, morale: 1 }, result: 'You learn some new swear words and get an early night.' }
    ]
  },
  {
    id: 'p_radio', phases: [2], cond: peace, scene: 'forest',
    title: 'The Voice from London',
    text: 'A signaller has a receiver set up in a hollow among the pines. Three men are crouched around it. The voice is speaking German, but it isn\'t Berlin: it\'s the BBC\'s German service, talking about the crisis, about Danzig, about British guarantees to Poland.\n\nOne of the men looks up and sees you.',
    choices: [
      { text: 'Crouch down and listen.',
        effects: { conscience: 4, suspicion: 7 },
        set: { heardBBC: true },
        result: 'The voice is calm and reasonable. It says that Britain will fight if Poland is attacked. Nobody around the set says anything. You all walk back to the tents separately.',
        log: 'Listened to the BBC in the forest.' },
      { text: 'Pretend you didn\'t see anything and walk on.', effects: { suspicion: 1 },
        result: 'You walk on. Better not to know, better not to have been there.' },
      { text: 'Report the signaller.',
        effects: { officers: 4, comrades: -8, conscience: -8, suspicion: -6 },
        result: 'The signaller is taken off duty the next morning. Nobody knows who reported him. Not officially.',
        log: 'Reported a signaller for listening to London.' }
    ]
  },
  {
    id: 'p_sentry', phases: [2], scene: 'forest',
    title: 'Sentry Duty',
    text: s => `Two hours on sentry at the edge of the camp, ${war(s) ? 'with Polish stragglers somewhere in the woods' : 'staring at the dark trees toward the border'}. It is cold now, and your eyes keep closing.`,
    choices: [
      { text: 'Stay alert. Pinch yourself, walk, count stars.', effects: { health: -4, officers: 2 },
        result: 'Two hours feel like two days. But when the duty officer comes round, you are awake.' },
      { text: 'Sit down against a tree. Just for a minute.',
        outcome: (s, x) => {
          x.apply({ health: 4 });
          if (x.roll(war(s) ? 0.45 : 0.3)) { x.apply({ officers: -12, suspicion: 5, morale: -4 }); x.say('You wake to a boot in your ribs and Brandt\'s face above you. "Asleep on sentry in the field. Do you know what that\'s worth? I could have you shot." He doesn\'t. But he writes it down.'); x.log('Caught asleep on sentry duty.'); }
          else x.say('You wake with a jerk an hour later. Nothing has happened. Nobody saw. Your heart doesn\'t slow down until morning.');
        } }
    ]
  },
  {
    id: 'p_blisters', phases: [2], scene: 'camp',
    title: 'Blisters',
    text: 'Your feet. The new boots have rubbed your heels raw, and one blister has burst and looks angry.',
    choices: [
      { text: 'Use the old trick: soap in the socks, and tallow.', show: s => s.flags.farm || s.flags.hardship, effects: { health: 5 },
        result: 'Your grandfather taught you this. By morning it\'s better.' },
      { text: 'Go to the medical orderly.', effects: { health: 4, officers: -1 },
        result: 'He paints it purple with iodine and calls you a princess. It helps.' },
      { text: 'Ignore it.', effects: { health: -5 },
        result: 'By morning, every step is a small knife.' }
    ]
  },
  {
    id: 'p_hartmann', phases: [2], cond: s => peace(s) && !s.flags.betrayedHartmann, scene: 'camp',
    title: 'Hartmann Talks',
    text: 'Hartmann can\'t sleep either. He lies on his back in the tent, talking about Hamburg: the harbour at night, his father who was in the Red Front until 1933, his girl in St. Pauli. "When this is over," he says, "I\'m going to sail to Argentina. Want to come?"',
    choices: [
      { text: '"Argentina. Why not."', effects: { comrades: 6, morale: 5 }, set: { hartmannFriend: true },
        result: 'You plan it out in whispers: the ship, the job on a cattle ranch, the beaches. It\'s all nonsense, and it\'s the best hour you\'ve had in a month.' },
      { text: '"Keep your voice down about your father."', effects: { comrades: 2, suspicion: -2 },
        result: '"Yeah," he says, after a while. "Yeah, I know." He turns over. But you think he was grateful.' }
    ]
  },

  // ── War (in Poland, from 1 September) ──
  {
    id: 'w_shadows', phases: [2], cond: war, scene: 'forest',
    title: 'Shadows',
    text: 'You are on sentry duty at the edge of a field. Everyone is jumpy; last night someone in another company shot at a cow. Now a shape is moving toward you through the dark. Thirty metres. Twenty.',
    choices: [
      { text: 'Challenge it: "Halt! Password!"',
        risk: { chance: 0.15, dmg: [10, 25], cause: 'Killed on sentry duty in Poland by a Polish straggler in the dark.',
          hit: 'A rifle cracks from the dark and you feel a blow in your side. Other sentries open fire; when they find the Polish straggler at dawn, he is already dead.',
          miss: '"Dorn!" comes the answer, the right password, in a voice you know. It\'s a reservist coming back from the latrine. He almost faints when he sees your rifle.' } },
      { text: 'Fire first.',
        outcome: (s, x) => {
          const r = Math.random();
          if (r < 0.4) { x.apply({ morale: -2 }); x.say('Your shot tears through the dark. In the morning you find the cow. The whole company laughs at you for days.'); }
          else if (r < 0.75) { x.apply({ conscience: -6, morale: -5 }); x.say('In the morning they find a Polish soldier in the grass with his rifle slung across his back. He may have been coming to surrender. You will never know.'); x.log('Shot a man in the dark. He may have been surrendering.'); }
          else { x.apply({ comrades: -12, officers: -8, morale: -12, conscience: -4 }); x.say('Someone screams in German. It\'s a reservist from the second platoon, coming back from the latrine. He will live. He might keep his leg.'); x.log('Shot one of our own in the dark.'); }
        } }
    ]
  },
  {
    id: 'w_burial', phases: [2], cond: war, scene: 'field',
    title: 'Burial Detail',
    text: 'You are told off for the burial detail. German dead first: their identity discs are broken in half, one half left with the body, one for the records. Then the Polish dead, in a common grave at the edge of the field.',
    choices: [
      { text: 'Work, and say a prayer over the Polish grave too.', effects: { conscience: 4, morale: -4 },
        result: 'An Our Father, mumbled. Some of the men look at you oddly. One of them takes his helmet off.' },
      { text: 'Take a dead Pole\'s boots. Better than yours.', effects: { health: 4, conscience: -4 }, set: { goodBoots: true },
        result: 'Good leather, nearly new. They fit. You try not to think about it.' },
      { text: 'Work fast and don\'t look at the faces.', effects: { morale: -6 },
        result: 'You look at them anyway. One of them could have been your cousin.' }
    ]
  },
  {
    id: 'w_barn', phases: [2], cond: war, scene: 'village',
    title: 'An Empty Farm',
    text: 'The squad is billeted in an abandoned farm. The family must have left in a hurry: the table is set, the stove is still warm. There are potatoes in the cellar and a pig in the sty.',
    choices: [
      { text: 'Sleep on the hay. Nothing else.', effects: { health: 8, morale: 2 },
        result: 'Hay, a roof, no shells. You sleep like the dead.' },
      { text: 'Help yourself from the cellar.', effects: { food: 25, conscience: -2 },
        result: 'Hartmann cooks the potatoes with bacon he finds hanging in the chimney. It\'s the best meal of your life. Somebody else\'s.' },
      { text: 'Help the others slaughter the pig.', effects: { food: 30, comrades: 5, conscience: -4, officers: -2 },
        result: 'A feast. Lenz makes a speech about the spoils of victory. Leutnant von Albrecht, who has made it clear that requisitioning requires a receipt, pretends not to smell the roasting.' }
    ]
  },
  {
    id: 'w_nightmare', phases: [2], cond: s => war(s) && (s.flags.firingSquad || s.flags.shotPole || s.flags.lenzKilled || s.stats.conscience < 30), weight: 3, scene: 'camp',
    title: 'The Dream',
    text: s => s.flags.firingSquad
      ? 'You are back at the barn wall. The hat rolls in the dust and stops. It rolls again. And again. You wake up with your hand over your mouth.'
      : 'In the dream, a young man in a Polish tunic reaches into his pocket, very slowly, and takes out a photograph. He holds it out to you. You wake up soaked in sweat.',
    choices: [
      { text: 'Tell Hartmann about it.', show: s => !s.flags.betrayedHartmann,
        effects: { morale: 3, comrades: 3 },
        result: '"Everybody dreams," he says. "My father still dreams about the Somme." It doesn\'t help much. It helps a little.' },
      { text: 'Tell yourself it was necessary. It was war.', effects: { morale: 4, conscience: -6 },
        result: 'You repeat it until it sounds true. It gets easier each time. That frightens you, briefly, and then that gets easier too.' },
      { text: 'Lie awake until dawn.', effects: { health: -5, morale: -6, conscience: 2 },
        result: 'You stare at the roof until the sky goes grey. You owe them that much, at least.' }
    ]
  },
  {
    id: 'w_letter', phases: [2], cond: war, scene: 'letter',
    title: 'Field Post Card',
    text: 'The company clerk hands out field post cards. One line, he says: the censors are not paid to read novels.',
    choices: [
      { text: '"I am well. Don\'t worry."', effects: { morale: 4 },
        result: 'Five words. Everything you can\'t say fits between them.' },
      { text: 'Write what you have seen.', effects: { conscience: 3, suspicion: 8, morale: 2 },
        result: 'You write it small, cramming the card. You doubt it will get through. You needed to write it anyway.' }
    ]
  }
];
