// Decorations. Ribbons are drawn as stripes; badges as simplified emblems.
// Symbols of the regime are deliberately left out of the artwork.
window.SIM = window.SIM || {};

SIM.MEDALS = {
  sudeten: {
    name: 'Sudetenland Medal', german: 'Medaille zur Erinnerung an den 1. Oktober 1938', kind: 'ribbon', order: 50,
    stripes: [['#b3262a', 2], ['#f2f2f2', 1], ['#111', 10], ['#f2f2f2', 1], ['#b3262a', 2]],
    desc: 'Given to the soldiers who marched into the Sudetenland in October 1938. Almost everyone in uniform that autumn received one.'
  },
  westwall: {
    name: 'West Wall Medal', german: 'Deutsches Schutzwall-Ehrenzeichen', kind: 'ribbon', order: 60,
    stripes: [['#f2f2f2', 2], ['#7a4a26', 12], ['#f2f2f2', 2]],
    desc: 'For work on the fortifications along the western border. Hundreds of thousands of Labour Service men received it for digging there in 1938.'
  },
  ek2: {
    name: 'Iron Cross, 2nd Class', german: 'Eisernes Kreuz 2. Klasse', kind: 'ribbon', order: 10,
    stripes: [['#111', 3], ['#f2f2f2', 2], ['#b3262a', 6], ['#f2f2f2', 2], ['#111', 3]],
    desc: 'For bravery in the face of the enemy. Only the ribbon was worn day to day, threaded through the second buttonhole of the tunic.'
  },
  ek1: {
    name: 'Iron Cross, 1st Class', german: 'Eisernes Kreuz 1. Klasse', kind: 'badge', order: 5, shape: 'cross',
    desc: 'For repeated, outstanding bravery. It required the 2nd Class first, and was pinned on the left breast pocket. Rare among enlisted men in 1940.'
  },
  isa: {
    name: 'Infantry Assault Badge', german: 'Infanterie-Sturmabzeichen in Silber', kind: 'badge', order: 20, shape: 'wreath-rifle',
    desc: 'Instituted in December 1939. It was awarded for taking part in three assaults, weapon in hand, on three separate days.'
  },
  wound_black: {
    name: 'Wound Badge in Black', german: 'Verwundetenabzeichen in Schwarz', kind: 'badge', order: 30, shape: 'wound', color: '#222',
    desc: 'For one or two wounds received in action.'
  },
  wound_silver: {
    name: 'Wound Badge in Silver', german: 'Verwundetenabzeichen in Silber', kind: 'badge', order: 29, shape: 'wound', color: '#b8bcc2', replaces: 'wound_black',
    desc: 'For three or four wounds, or the loss of a hand, foot or eye.'
  },
  wound_gold: {
    name: 'Wound Badge in Gold', german: 'Verwundetenabzeichen in Gold', kind: 'badge', order: 28, shape: 'wound', color: '#c9a240', replaces: 'wound_silver',
    desc: 'For five or more wounds, or total disability.'
  }
};

// Medals worth displaying: higher grades hide lower ones.
SIM.displayMedals = function (s) {
  const ids = s.medals.map(m => m.id);
  return s.medals
    .filter(m => !ids.some(other => SIM.MEDALS[other].replaces === m.id || (SIM.MEDALS[other].replaces && SIM.MEDALS[SIM.MEDALS[other].replaces].replaces === m.id)))
    .sort((a, b) => SIM.MEDALS[a.id].order - SIM.MEDALS[b.id].order);
};

SIM.ribbonSVG = function (id, w = 36, h = 11) {
  const m = SIM.MEDALS[id];
  const total = m.stripes.reduce((a, s) => a + s[1], 0);
  let x = 0;
  const rects = m.stripes.map(([c, n]) => { const r = `<rect x="${x}" y="0" width="${(n / total) * w + 0.3}" height="${h}" fill="${c}"/>`; x += (n / total) * w; return r; }).join('');
  return `<svg class="ribbon" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${rects}<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" fill="none" stroke="rgba(0,0,0,.35)"/></svg>`;
};

SIM.badgeSVG = function (id, size = 44) {
  const m = SIM.MEDALS[id];
  if (m.kind === 'ribbon') {
    // Full medal: ribbon above a disc or cross.
    const cross = id === 'ek2';
    return `<svg viewBox="0 0 40 56" width="${size * 0.72}" height="${size}" aria-hidden="true">
      ${SIM.ribbonSVG(id, 40, 20).replace('<svg class="ribbon" viewBox="0 0 40 20" width="40" height="20" aria-hidden="true">', '<g>').replace('</svg>', '</g>')}
      <polygon points="14,20 26,20 20,26" fill="#555"/>
      ${cross ? crossPath(20, 40, 15, '#111', '#c0c4c8') : `<circle cx="20" cy="40" r="12" fill="#a8a294" stroke="#6b665a" stroke-width="2"/><circle cx="20" cy="40" r="7" fill="none" stroke="#6b665a" stroke-width="1"/>`}
    </svg>`;
  }
  if (m.shape === 'cross') return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">${crossPath(20, 20, 18, '#111', '#c0c4c8')}</svg>`;
  if (m.shape === 'wound') return `<svg viewBox="0 0 40 48" width="${size * 0.83}" height="${size}" aria-hidden="true">
      <ellipse cx="20" cy="24" rx="17" ry="21" fill="${m.color}" stroke="#555" stroke-width="1.5"/>
      <ellipse cx="20" cy="24" rx="12.5" ry="16.5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2" stroke-dasharray="2 2"/>
      <path d="M11,27 C11,17 15,13 20,13 C25,13 29,17 29,27 L32,28 L32,30 L8,30 L8,28 Z" fill="rgba(0,0,0,.55)"/>
      <path d="M12,35 L28,35 M14,38 L26,38" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>
    </svg>`;
  if (m.shape === 'wreath-rifle') return `<svg viewBox="0 0 40 50" width="${size * 0.8}" height="${size}" aria-hidden="true">
      <ellipse cx="20" cy="25" rx="17" ry="22" fill="none" stroke="#b8bcc2" stroke-width="5"/>
      <ellipse cx="20" cy="25" rx="17" ry="22" fill="none" stroke="#7f858c" stroke-width="5" stroke-dasharray="3 3"/>
      <line x1="9" y1="40" x2="31" y2="10" stroke="#9a9fa6" stroke-width="3"/>
      <line x1="27" y1="15" x2="33" y2="7" stroke="#6f747a" stroke-width="1.5"/>
      <rect x="15" y="43" width="10" height="5" fill="#9a9fa6"/>
    </svg>`;
  return '';
};

function crossPath(cx, cy, r, fill, edge) {
  const a = r, b = r * 0.32;
  const d = `M${cx - b},${cy - b} L${cx - b * 1.6},${cy - a} L${cx + b * 1.6},${cy - a} L${cx + b},${cy - b}
    L${cx + a},${cy - b * 1.6} L${cx + a},${cy + b * 1.6} L${cx + b},${cy + b}
    L${cx + b * 1.6},${cy + a} L${cx - b * 1.6},${cy + a} L${cx - b},${cy + b}
    L${cx - a},${cy + b * 1.6} L${cx - a},${cy - b * 1.6} Z`;
  return `<path d="${d}" fill="${edge}"/><path d="${d}" fill="${fill}" transform="translate(${cx} ${cy}) scale(.8) translate(${-cx} ${-cy})"/>
    <text x="${cx}" y="${cy + 3}" text-anchor="middle" font-size="${r * 0.38}" fill="${edge}" font-family="serif">1939</text>`;
}
