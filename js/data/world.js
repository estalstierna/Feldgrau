// World data: stats, calendar, ranks, character creation options, backstory.
window.SIM = window.SIM || {};

SIM.STATS = {
  health:     { label: 'Health', short: 'Health',     desc: 'Physical condition. At zero, you die.' },
  morale:     { label: 'Morale', short: 'Morale',     desc: 'Will to go on. At zero, you break.' },
  food:       { label: 'Food', short: 'Food',       desc: 'How well fed you are. Drops every phase.' },
  comrades:   { label: 'Comrades', short: 'Comr.',   desc: 'How the men in your squad see you.' },
  officers:   { label: 'Superiors', short: 'Sup.',  desc: 'How your NCOs and officers judge you.' },
  suspicion:  { label: 'Suspicion', short: 'Susp.',  desc: 'Doubts about your political reliability. At 100, you are arrested.', bad: true },
  conscience: { label: 'Conscience', short: 'Consc.', desc: 'What is left of the person you were before.' },
  warmth:     { label: 'Warmth', short: 'Warm', desc: 'How cold you are. Below 20 you start to freeze: frostbite, and worse.', show: s => !!SIM.chv(s, 'cold') },
  hope:       { label: 'Hope', short: 'Hope', desc: 'Whether you still believe you will go home. Below 20 the body follows the mind.', show: s => !!SIM.chv(s, 'hope') && s.stats.hope !== undefined }
};

SIM.RANKS = ['Schütze', 'Oberschütze', 'Gefreiter', 'Obergefreiter', 'Unteroffizier', 'Feldwebel'];
SIM.RANK_EN = ['Private', 'Senior Private', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant'];

// Waffen-SS equivalents of the Army ranks, used once the player has transferred.
SIM.SS_RANKS = ['SS-Schütze', 'SS-Oberschütze', 'SS-Sturmmann', 'SS-Rottenführer', 'SS-Unterscharführer', 'SS-Oberscharführer'];
SIM.rankTitle = (s, r) => ((s && s.flags && s.flags.joinedSS) ? SIM.SS_RANKS : SIM.RANKS)[r === undefined ? s.rank : r];

SIM.PHASES = ['Morning', 'Afternoon', 'Night'];
SIM.PHASE_TIME = ['06:30', '14:00', '21:30'];

SIM.PLACES = {
  hammerstein: { name: 'Forest camp near Hammerstein, Pomerania', x: 140, y: 150 },
  border:      { name: 'The Polish border west of Konitz',        x: 178, y: 152 },
  konitz:      { name: 'Outskirts of Konitz (Chojnice), Poland',  x: 192, y: 150 },
  tuchel:      { name: 'Tuchel Heath (Bory Tucholskie), Poland',  x: 222, y: 140 },
  vistula:     { name: 'Near Schwetz on the Vistula, Poland',     x: 252, y: 168 }
};

SIM.DAYS = [
  { date: 'Monday, 28 August 1939',    short: 'Mon 28 Aug', place: 'hammerstein' },
  { date: 'Tuesday, 29 August 1939',   short: 'Tue 29 Aug', place: 'hammerstein' },
  { date: 'Wednesday, 30 August 1939', short: 'Wed 30 Aug', place: 'hammerstein' },
  { date: 'Thursday, 31 August 1939',  short: 'Thu 31 Aug', place: 'hammerstein' },
  { date: 'Friday, 1 September 1939',  short: 'Fri 1 Sep',  place: 'konitz', war: true },
  { date: 'Saturday, 2 September 1939', short: 'Sat 2 Sep', place: 'tuchel', war: true },
  { date: 'Sunday, 3 September 1939',  short: 'Sun 3 Sep',  place: 'vistula', war: true }
];

SIM.FIRST_NAMES = ['Hans', 'Friedrich', 'Heinrich', 'Walter', 'Kurt', 'Werner', 'Gerhard', 'Helmut', 'Herbert', 'Günter', 'Erich', 'Rudolf', 'Wilhelm', 'Josef', 'Franz', 'Otto', 'Ludwig', 'Alfred'];
SIM.LAST_NAMES = ['Müller', 'Schmidt', 'Becker', 'Hoffmann', 'Krüger', 'Wagner', 'Neumann', 'Schulz', 'Richter', 'Wolff', 'Braun', 'Zimmermann', 'Lange', 'Fischer', 'Weber', 'Koch', 'Peters', 'Hahn'];

SIM.CREATION = {
  birthYear: [
    { id: 1917, label: '1917', desc: 'Called up in November 1937. Nearly two years in uniform. You know the drill.', effects: { officers: 5, comrades: 3 }, medal: 'sudeten', medalReason: 'Marched into the Sudetenland with the regiment, October 1938.', medalDate: 'December 1938' },
    { id: 1918, label: '1918', desc: 'Called up in November 1938. Basic training done, still learning.', effects: {} },
    { id: 1919, label: '1919', desc: 'Called up in spring 1939. Green, barely trained.', effects: { morale: -5, officers: -3 }, medal: 'westwall', medalReason: 'Labour Service on the West Wall fortifications, summer 1938.', medalDate: 'January 1939' }
  ],
  hometown: [
    { id: 'berlin',  label: 'Berlin (Wedding)',     desc: 'A red working-class district, once.', effects: { comrades: 3 } },
    { id: 'hamburg', label: 'Hamburg (Altona)',     desc: 'Harbour city. Ships, cranes and the smell of fish.', effects: { morale: 3 } },
    { id: 'munich',  label: 'Munich',               desc: 'The "Capital of the Movement".', effects: { officers: 3 } },
    { id: 'breslau', label: 'Breslau, Silesia',     desc: 'A border city. Many families have Polish names.', effects: { conscience: 3 } },
    { id: 'stolp',   label: 'Stolp, Pomerania',     desc: 'You grew up two days\' walk from where your regiment now waits.', effects: { food: 5 }, flag: 'local' }
  ],
  background: [
    { id: 'farm',       label: 'Farmhand',          desc: 'Strong back, used to hunger and hard weather.', effects: { health: 10 }, flag: 'farm' },
    { id: 'factory',    label: 'Factory worker',    desc: 'You know how to get along with all kinds of men.', effects: { comrades: 8 }, flag: 'factory' },
    { id: 'student',    label: 'Gymnasium pupil',   desc: 'You passed the Abitur. You read maps, and too many books.', effects: { officers: 5, conscience: 5, morale: -3 }, flag: 'educated' },
    { id: 'apprentice', label: 'Shop apprentice',   desc: 'A grocer\'s boy. You know the value of a Reichsmark.', effects: { marks: 8 }, flag: 'trader' },
    { id: 'unemployed', label: 'Unemployed youth',  desc: 'The Depression years left marks on you.', effects: { health: -5, comrades: 5, morale: 3 }, flag: 'hardship' }
  ],
  family: [
    { id: 'spd',      label: 'Social Democrat father', desc: 'Your father was held for three weeks in 1933. He never speaks of it.', effects: { suspicion: 15, conscience: 10 }, flag: 'spd' },
    { id: 'catholic', label: 'Devout Catholic family', desc: 'Mass every Sunday. Your mother still prays for the Pope.', effects: { conscience: 10, morale: 5 }, flag: 'catholic' },
    { id: 'party',    label: 'Party family',           desc: 'Your father joined the NSDAP in 1932 and has done well by it.', effects: { officers: 8, suspicion: -10, conscience: -8 }, flag: 'party' },
    { id: 'none',     label: 'Apolitical family',      desc: 'Keep your head down, earn your bread, don\'t ask questions.', effects: { marks: 5 } }
  ]
};

SIM.BASE_STATS = { health: 80, morale: 70, food: 70, comrades: 50, officers: 50, suspicion: 10, conscience: 60, warmth: 70 };
SIM.visibleStats = s => Object.keys(SIM.STATS).filter(k => !SIM.STATS[k].show || SIM.STATS[k].show(s));
SIM.BASE_MARKS = 6;

SIM.serviceStart = c => ({ 1917: 'November 1937', 1918: 'November 1938', 1919: 'April 1939' }[c.birthYear] || '1938');

SIM.townName = function (id) {
  const t = SIM.CREATION.hometown.find(h => h.id === id);
  return t ? t.label.replace(/ \(.*\)/, '') : id;
};

// The years 1930–1939, written from the character's choices.
SIM.backstory = function (c) {
  const town = SIM.townName(c.hometown);
  const age30 = 1930 - c.birthYear;
  const out = [];

  const work = {
    farm: 'your father worked another man\'s land, and you followed him into the fields at dawn',
    factory: 'your father lost his place at the works and stood in the dole queue with half the street',
    student: 'your father, a minor civil servant, kept you at the Gymnasium even as his salary was cut twice',
    apprentice: 'your father\'s little shop sold on credit to customers who would never pay',
    unemployed: 'your father vanished for weeks at a time looking for work, and came back with nothing'
  }[c.background];
  out.push({ year: '1930', text: `You were ${age30} years old in ${town}. The Depression had come, and ${work}. Six million out of work. Men marched in the streets under red flags and brown ones, and sometimes they fought.` });

  const t33 = {
    spd: 'In February the SA came for your father. He came home three weeks later, thinner, and from then on he only talked about the weather. The red flags disappeared from the windows of your street almost overnight.',
    catholic: 'Your mother lit a candle and said the new men would at least deal with the Communists. The priest preached about obedience to authority. Later the Catholic youth groups were dissolved, and the priest preached less.',
    party: 'Your father came home in his new brown shirt and opened a bottle of wine. "Now things will change," he said. They did. By autumn he had a better job at the town hall.',
    none: 'Your parents listened to the radio and said nothing. Work came back slowly, the autobahn was being built, and that was what mattered at your kitchen table.'
  }[c.family];
  out.push({ year: '1933', text: `On 30 January, Adolf Hitler was appointed Chancellor. ${t33}` });

  out.push({ year: '1935', text: 'Conscription was reintroduced. The newspapers called it the restoration of German honour. In the schoolyard and at work, the boys talked about which branch they would join. Some joined the Hitler Youth because everyone did; by 1936 it was no longer a choice.' });

  const callUp = { 1917: 'November 1937', 1918: 'November 1938', 1919: 'April 1939' }[c.birthYear];
  out.push({ year: c.birthYear === 1919 ? '1938' : '1937', text: 'Six months in the Reich Labour Service: digging drainage ditches with a spade you were taught to present like a rifle. Then came the letter from the military district command.' });
  out.push({ year: callUp.slice(-4), text: `You were called up in ${callUp} to an infantry regiment in Pomerania. 3rd Company, 2nd Battalion. The barracks smelled of floor polish and boiled cabbage. You learned to march, to shoot, to clean, to obey.` });
  out.push({ year: '1939', text: 'On 26 August the regiment was quietly mobilised. Reservists in ill-fitting uniforms joined the ranks. Trains carried you east, toward the border with Poland. Nobody would say what for. Everybody knew.' });
  return out;
};
