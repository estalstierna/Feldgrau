// Chapter registry. Each chapter: calendar, places, map, final event, endings and review rules.
// Later chapters push themselves onto SIM.CHAPTERS from their own files.
window.SIM = window.SIM || {};

SIM.CHAPTERS = [
  {
    id: 'poland', num: 'I', start: [1939, 8], title: 'The Corridor', range: '28 August – 3 September 1939', year: 1939,
    days: SIM.DAYS, places: SIM.PLACES, map: 'poland',
    finalEvent: 'd6n',
    ending: s => SIM.chapterEnding(s),
    commander: 'Hauptmann Steiner',
    hospital: 'Stettin',
    deathDefault: 'Killed in Poland, September 1939.',
    casualties: 'Around 16,000 German soldiers and 66,000 Polish soldiers were killed in the September campaign. Tens of thousands of Polish civilians died with them.',
    promoDate: '1 April 1940',
    maxRank: 2,
    routineReason: 'Time in service. By spring 1940, almost every man of your year group with a clean record has been promoted.',
    meritReason: 'Recommended by Leutnant von Albrecht for conduct in the Polish campaign.',
    blackMarks: s => {
      const b = [];
      if (s.flags.refusedOrder) b.push('You refused a direct order in the Tuchel Heath.');
      if (s.flags.asleep_0) b.push('You were found asleep on sentry duty.');
      return b;
    },
    awards: (s, score) => {
      if (s.ending === 'decorated' || score >= 9) SIM.award(s, 'ek2', 'For bravery during the Polish campaign, September 1939.', 'October 1939');
      if (s.flags.savedBrandt) SIM.award(s, 'kvk2', 'For rescuing his wounded squad leader under machine-gun fire in the Tuchel Heath.', 'March 1940');
      else if (s.flags.vogelSaved) SIM.award(s, 'kvk2', 'For bringing a comrade forward under fire at the border, 1 September 1939.', 'March 1940');
    }
  }
];
