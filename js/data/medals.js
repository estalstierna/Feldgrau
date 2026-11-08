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
    desc: 'For bravery in the face of the enemy. The cross hung from a ribbon; day to day only the ribbon was worn, threaded through the second buttonhole of the tunic. Every cross awarded from 1939 to 1945 bears the year 1939, when the order was re-instituted.'
  },
  ek1: {
    name: 'Iron Cross, 1st Class', german: 'Eisernes Kreuz 1. Klasse', kind: 'badge', order: 5, shape: 'cross',
    desc: 'For repeated, outstanding bravery, and only for holders of the 2nd Class. The same cross, but with no ribbon: it was pinned straight onto the left breast pocket. Rare among enlisted men in 1940.'
  },
  isa: {
    name: 'Infantry Assault Badge', german: 'Infanterie-Sturmabzeichen in Silber', kind: 'badge', order: 20, shape: 'wreath-rifle',
    desc: 'Instituted in December 1939. It was awarded for taking part in three assaults, weapon in hand, on three separate days.'
  },
  kvk2: {
    name: 'War Merit Cross, 2nd Class with Swords', german: 'Kriegsverdienstkreuz 2. Klasse mit Schwertern', kind: 'ribbon', order: 12, pendant: 'kvk',
    stripes: [['#b3262a', 3], ['#f2f2f2', 2], ['#111', 6], ['#f2f2f2', 2], ['#b3262a', 3]],
    desc: 'Instituted in October 1939 for merit under enemy fire that did not fit the Iron Cross: rescuing the wounded, bringing up ammunition, saving others. Its ribbon reverses the colours of the Iron Cross ribbon.'
  },
  kvk2ns: {
    name: 'War Merit Cross, 2nd Class', german: 'Kriegsverdienstkreuz 2. Klasse ohne Schwerter', kind: 'ribbon', order: 13, pendant: 'kvk', swords: false,
    stripes: [['#b3262a', 3], ['#f2f2f2', 2], ['#111', 6], ['#f2f2f2', 2], ['#b3262a', 3]],
    desc: 'The same cross without swords: for merit away from enemy fire, such as rescues, exemplary service and courage in accidents and disasters.'
  },
  rescue: {
    name: 'Life Saving Medal', german: 'Medaille für Rettung aus Gefahr', kind: 'ribbon', order: 40,
    stripes: [['#f2f2f2', 2], ['#d0562e', 12], ['#f2f2f2', 2]],
    desc: 'A civil decoration for saving a life at the risk of one\'s own, most often from drowning. Soldiers could receive it too.'
  },
  longservice4: {
    name: 'Long Service Award, 4 Years', german: 'Wehrmacht-Dienstauszeichnung 4. Klasse', kind: 'ribbon', order: 70,
    stripes: [['#5f86c8', 1]],
    desc: 'Awarded automatically after four years of service. A plain silver medal on a cornflower-blue ribbon.'
  },
  schnur1: {
    name: 'Marksmanship Lanyard, 1st Grade', german: 'Schützenschnur, 1. Stufe', kind: 'badge', order: 80, shape: 'lanyard', grade: 1,
    desc: 'A braided cord worn from the right shoulder, earned by meeting set standards on the rifle range. Higher grades added small acorns.'
  },
  schnur2: {
    name: 'Marksmanship Lanyard, 2nd Grade', german: 'Schützenschnur, 2. Stufe', kind: 'badge', order: 79, shape: 'lanyard', grade: 2, replaces: 'schnur1',
    desc: 'The second grade of the lanyard, for better results on the range.'
  },
  schnur3: {
    name: 'Marksmanship Lanyard, 3rd Grade', german: 'Schützenschnur, 3. Stufe', kind: 'badge', order: 78, shape: 'lanyard', grade: 3, replaces: 'schnur2',
    desc: 'The third grade of the lanyard. Only very good shots reached it.'
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
  const replaced = new Set();
  ids.forEach(id => { let r = SIM.MEDALS[id].replaces; while (r) { replaced.add(r); r = SIM.MEDALS[r].replaces; } });
  return s.medals.filter(m => !replaced.has(m.id)).sort((a, b) => SIM.MEDALS[a.id].order - SIM.MEDALS[b.id].order);
};

SIM.ribbonSVG = function (id, w = 36, h = 11) {
  const m = SIM.MEDALS[id];
  const total = m.stripes.reduce((a, s) => a + s[1], 0);
  let x = 0;
  const rects = m.stripes.map(([c, n]) => { const r = `<rect x="${x}" y="0" width="${(n / total) * w + 0.3}" height="${h}" fill="${c}"/>`; x += (n / total) * w; return r; }).join('');
  return `<svg class="ribbon" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${rects}<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" fill="none" stroke="rgba(0,0,0,.35)"/></svg>`;
};

// Painted medals in assets/medals/medal-<id>.png. Others use the drawn SVG.
SIM.MEDAL_IMAGES = ['ek2', 'kvk2', 'kvk2ns', 'ek1', 'sudeten', 'westwall', 'rescue'];

SIM.badgeSVG = function (id, size = 44) {
  if (SIM.MEDAL_IMAGES.includes(id)) return `<img class="medal-img" src="assets/medals/medal-${id}.png" alt="" style="height:${size}px">`;
  const m = SIM.MEDALS[id];
  if (m.kind === 'ribbon') {
    // Full medal: ribbon above a disc or cross.
    const cross = id === 'ek2';
    const kvk = m.pendant === 'kvk';
    return `<svg viewBox="0 0 40 56" width="${size * 0.72}" height="${size}" aria-hidden="true">
      ${SIM.ribbonSVG(id, 40, 20).replace('<svg class="ribbon" viewBox="0 0 40 20" width="40" height="20" aria-hidden="true">', '<g>').replace('</svg>', '</g>')}
      <polygon points="14,20 26,20 20,26" fill="#555"/>
      ${cross ? crossPath(20, 40, 15, '#111', '#c0c4c8') : kvk ? kvkPath(20, 40, 14, m.swords !== false) : `<circle cx="20" cy="40" r="12" fill="#a8a294" stroke="#6b665a" stroke-width="2"/><circle cx="20" cy="40" r="7" fill="none" stroke="#6b665a" stroke-width="1"/>`}
    </svg>`;
  }
  if (m.shape === 'cross') {
    // The 1st Class had no ribbon: it was pinned straight onto the left breast pocket.
    return `<svg viewBox="0 0 44 48" width="${size * 0.92}" height="${size}" aria-hidden="true">
      <rect x="2" y="6" width="40" height="40" rx="3" fill="#5d6352"/>
      <path d="M2,14 L42,14" stroke="#474c3f" stroke-width="1.5"/>
      <rect x="4.5" y="8.5" width="35" height="35" rx="2" fill="none" stroke="#7b826e" stroke-width=".8" stroke-dasharray="1.6 1.4"/>
      <circle cx="22" cy="10" r="2.2" fill="#6f7563" stroke="#3d4136" stroke-width=".6"/>
      <g transform="translate(0 3)">${crossPath(22, 26, 15, '#111', '#c0c4c8')}</g>
      <ellipse cx="22" cy="44" rx="13" ry="1.6" fill="rgba(0,0,0,.25)"/>
    </svg>`;
  }
  if (m.shape === 'lanyard') {
    // Braided aluminium cord, looped, with acorns for higher grades.
    const acorns = Array.from({ length: m.grade - 1 }, (_, i) => `<g transform="translate(${15 + i * 10} 40)"><ellipse cx="0" cy="2" rx="2.6" ry="3.4" fill="#b8bcc2" stroke="#6f747a" stroke-width=".5"/><path d="M-2.8,0 Q0,-3 2.8,0 Z" fill="#8d9299"/></g>`).join('');
    return `<svg viewBox="0 0 40 50" width="${size * 0.8}" height="${size}" aria-hidden="true">
      <path d="M8,6 C2,20 6,34 20,36 C34,34 38,20 32,6" fill="none" stroke="#9ba0a7" stroke-width="4"/>
      <path d="M8,6 C2,20 6,34 20,36 C34,34 38,20 32,6" fill="none" stroke="#d3d6da" stroke-width="4" stroke-dasharray="2 2"/>
      <path d="M12,6 C9,18 12,28 20,30 C28,28 31,18 28,6" fill="none" stroke="#9ba0a7" stroke-width="2.6"/>
      <path d="M12,6 C9,18 12,28 20,30 C28,28 31,18 28,6" fill="none" stroke="#e1e3e6" stroke-width="2.6" stroke-dasharray="1.5 1.5"/>
      <rect x="6" y="2" width="28" height="5" rx="1.5" fill="#7f858c"/>
      ${acorns}
    </svg>`;
  }
  if (m.shape === 'wound') return `<svg viewBox="0 0 40 48" width="${size * 0.83}" height="${size}" aria-hidden="true">
      <ellipse cx="20" cy="24" rx="17" ry="21" fill="${m.color}" stroke="#555" stroke-width="1.5"/>
      <ellipse cx="20" cy="24" rx="12.5" ry="16.5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2" stroke-dasharray="2 2"/>
      <path d="M11,27 C11,17 15,13 20,13 C25,13 29,17 29,27 L32,28 L32,30 L8,30 L8,28 Z" fill="rgba(0,0,0,.55)"/>
      <path d="M12,35 L28,35 M14,38 L26,38" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>
    </svg>`;
  if (m.shape === 'wreath-rifle') {
    // Oval oak-leaf wreath with a rifle and fixed bayonet across it.
    let leaves = '';
    for (let i = 0; i < 22; i++) {
      const t = (i / 22) * Math.PI * 2;
      const x = 20 + 15.5 * Math.cos(t), y = 25 + 20.5 * Math.sin(t);
      const ang = (Math.atan2(20.5 * Math.cos(t), -15.5 * Math.sin(t)) * 180) / Math.PI + 35;
      leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.4" ry="1.7" transform="rotate(${ang.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${i % 2 ? '#c4c8cd' : '#9ba0a7'}" stroke="#6f747a" stroke-width=".4"/>`;
    }
    return `<svg viewBox="0 0 40 50" width="${size * 0.8}" height="${size}" aria-hidden="true">
      ${leaves}
      <polygon points="8,41 13,35.5 16,38 11,44" fill="#8d9299" stroke="#5f646a" stroke-width=".5"/>
      <line x1="14" y1="37" x2="30" y2="14" stroke="#a7acb2" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="16" y1="36" x2="26" y2="22" stroke="#6f747a" stroke-width=".8"/>
      <line x1="30" y1="14" x2="34.5" y2="7.5" stroke="#d3d6da" stroke-width="1.1" stroke-linecap="round"/>
      <rect x="15" y="44.5" width="10" height="3.5" rx="1" fill="#9ba0a7" stroke="#6f747a" stroke-width=".4"/>
    </svg>`;
  }
  return '';
};

// War Merit Cross: a bronze cross with straight, flared arms and crossed swords.
function kvkPath(cx, cy, r, swords = true) {
  const b = r * 0.28;
  const d = `M${cx - b},${cy - b} L${cx - b * 1.5},${cy - r} L${cx + b * 1.5},${cy - r} L${cx + b},${cy - b}
    L${cx + r},${cy - b * 1.5} L${cx + r},${cy + b * 1.5} L${cx + b},${cy + b}
    L${cx + b * 1.5},${cy + r} L${cx - b * 1.5},${cy + r} L${cx - b},${cy + b}
    L${cx - r},${cy + b * 1.5} L${cx - r},${cy - b * 1.5} Z`;
  return `<path d="${d}" fill="#8a6a3a" stroke="#5a4423" stroke-width=".8"/>
    <path d="${d}" fill="none" stroke="#c49a5a" stroke-width=".7" transform="translate(${cx} ${cy}) scale(.78) translate(${-cx} ${-cy})"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.32}" fill="#8a6a3a" stroke="#c49a5a" stroke-width=".6"/>
    ${swords ? `<line x1="${cx - r * 0.95}" y1="${cy + r * 0.95}" x2="${cx + r * 0.95}" y2="${cy - r * 0.95}" stroke="#4a3a20" stroke-width="1.4"/>
    <line x1="${cx + r * 0.95}" y1="${cy + r * 0.95}" x2="${cx - r * 0.95}" y2="${cy - r * 0.95}" stroke="#4a3a20" stroke-width="1.4"/>` : ''}`;
}

// Cross pattée with a silver frame. As on the 1939 version, the year sits on the lower arm.
// (The real centre carried the swastika, which is left out here.)
function crossPath(cx, cy, r, fill, edge) {
  const a = r, b = r * 0.3;
  const d = `M${cx - b},${cy - b} L${cx - b * 1.9},${cy - a} L${cx + b * 1.9},${cy - a} L${cx + b},${cy - b}
    L${cx + a},${cy - b * 1.9} L${cx + a},${cy + b * 1.9} L${cx + b},${cy + b}
    L${cx + b * 1.9},${cy + a} L${cx - b * 1.9},${cy + a} L${cx - b},${cy + b}
    L${cx - a},${cy + b * 1.9} L${cx - a},${cy - b * 1.9} Z`;
  return `<path d="${d}" fill="${edge}" stroke="#7d8288" stroke-width=".5"/>
    <path d="${d}" fill="${fill}" transform="translate(${cx} ${cy}) scale(.82) translate(${-cx} ${-cy})"/>
    <text x="${cx}" y="${cy + r * 0.72}" text-anchor="middle" font-size="${(r * 0.24).toFixed(1)}" fill="${edge}" font-family="serif">1939</text>`;
}
