// Simple procedural SVG art: scene banners and the campaign map.
window.SIM = window.SIM || {};

SIM.SKIES = [
  ['#c9b48a', '#8d8a78'], // morning: pale, dusty
  ['#b9b29c', '#7f8576'], // afternoon
  ['#1d2430', '#0c0f14']  // night
];

function seeded(n) { let x = n; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }

function pines(rnd, count, yBase, hMin, hMax, color) {
  let s = '';
  for (let i = 0; i < count; i++) {
    const x = rnd() * 620 - 10, h = hMin + rnd() * (hMax - hMin), w = h * 0.32;
    s += `<polygon points="${x},${yBase - h} ${x - w},${yBase} ${x + w},${yBase}" fill="${color}"/>`;
    s += `<rect x="${x - 1.5}" y="${yBase - 4}" width="3" height="6" fill="${color}"/>`;
  }
  return s;
}

// Painted banners in assets/scenes/scene-<scene>-<phase>.webp. Scenes not listed use the drawn art.
SIM.PHASE_NAMES = ['morning', 'afternoon', 'night'];
SIM.SCENE_IMAGES = { camp: ['morning', 'afternoon', 'night'], forest: ['morning', 'afternoon', 'night'], field: ['morning', 'afternoon', 'night'], village: ['morning', 'afternoon', 'night'], road: ['morning', 'afternoon', 'night'], river: ['morning', 'afternoon', 'night'], city: ['morning', 'afternoon', 'night'], bridge: ['morning', 'afternoon', 'night'], letter: 'single', 'village-east': ['morning', 'afternoon', 'night'], 'road-east': ['morning', 'afternoon', 'night'], 'river-east': ['morning', 'afternoon', 'night'], 'city-east': ['morning', 'afternoon', 'night'], 'camp-winter': ['morning', 'afternoon', 'night'], 'field-winter': ['morning', 'afternoon', 'night'], 'village-winter': ['morning', 'afternoon', 'night'], 'river-winter': ['morning', 'afternoon', 'night'], 'forest-winter': ['morning', 'afternoon', 'night'], 'road-winter': ['morning', 'afternoon', 'night'] };
// A chapter can have its own variant of a scene (e.g. 'village-east'); it falls back to the generic one.
SIM.sceneImage = function (scene, phase, variant) {
  if (variant && SIM.VARIANT_ONLY && SIM.VARIANT_ONLY.includes(variant)) return SIM.SCENE_IMAGES[`${scene}-${variant}`] ? SIM.sceneImage(`${scene}-${variant}`, phase) : null;
  if (variant && SIM.SCENE_IMAGES[`${scene}-${variant}`]) {
    const v = SIM.sceneImage(`${scene}-${variant}`, phase);
    if (v) return v;
  }
  const avail = SIM.SCENE_IMAGES[scene];
  if (!avail) return null;
  if (avail === 'single') return `assets/scenes/scene-${scene}.webp`;
  const name = SIM.PHASE_NAMES[phase];
  return avail.includes(name) ? `assets/scenes/scene-${scene}-${name}.webp` : null;
};

SIM.sceneSVG = function (scene, phase, seed, variant, drawnOnly) {
  const img = drawnOnly ? null : SIM.sceneImage(scene, phase, variant);
  if (img) return `<img class="scene-img" src="${img}" alt="">`;
  if (variant === 'winter' && !drawnOnly && scene !== 'letter') return SIM.winterize(SIM.sceneSVG(scene, phase, seed, null, true), phase, seed);
  const rnd = seeded(seed || 7);
  const [top, bot] = SIM.SKIES[phase] || SIM.SKIES[0];
  const night = phase === 2;
  const dark = night ? '#06080b' : '#2b2e27';
  const mid = night ? '#0d1117' : '#4a4d40';
  let body = '';

  if (scene === 'camp') {
    body += pines(rnd, 26, 120, 40, 85, mid);
    body += `<rect x="0" y="134" width="600" height="26" fill="${dark}"/>`;
    [[120, 40], [200, 34], [330, 44], [460, 36]].forEach(([x, w]) => {
      body += `<polygon points="${x - w},140 ${x},${140 - w * 0.9} ${x + w},140" fill="${night ? '#151a1f' : '#5b5a45'}" stroke="${dark}" stroke-width="2"/>`;
      body += `<polygon points="${x - 5},140 ${x},${140 - w * 0.4} ${x + 5},140" fill="${dark}"/>`;
    });
    if (night) body += `<circle cx="265" cy="142" r="22" fill="url(#glow)"/><polygon points="258,146 265,130 272,146" fill="#e0913a"/>`;
  } else if (scene === 'forest') {
    body += pines(rnd, 40, 125, 50, 110, mid);
    body += pines(rnd, 22, 160, 70, 140, dark);
    body += `<rect x="0" y="150" width="600" height="10" fill="${dark}"/>`;
  } else if (scene === 'field') {
    body += pines(rnd, 18, 95, 18, 34, mid);
    body += `<rect x="0" y="93" width="600" height="67" fill="${night ? '#0c0f12' : '#6b6646'}"/>`;
    for (let i = 0; i < 40; i++) body += `<line x1="${i * 16}" y1="${100 + (i % 3) * 18}" x2="${i * 16 + 6}" y2="${98 + (i % 3) * 18}" stroke="${dark}" stroke-width="1"/>`;
    body += `<path d="M0,112 Q300,96 600,110 L600,124 L0,124 Z" fill="${dark}" opacity=".7"/>`;
    for (let i = 0; i < 9; i++) { const x = 30 + i * 70; body += `<line x1="${x}" y1="152" x2="${x}" y2="128" stroke="${dark}" stroke-width="3"/>`; }
    body += `<path d="M30,134 ${Array.from({ length: 9 }, (_, i) => `L${30 + i * 70},${134 + (i % 2) * 4}`).join(' ')}" stroke="${dark}" fill="none" stroke-dasharray="3 2"/>`;
    body += `<rect x="0" y="0" width="600" height="160" fill="url(#fog)"/>`;
  } else if (scene === 'village') {
    body += pines(rnd, 14, 110, 30, 60, mid);
    body += `<rect x="0" y="108" width="600" height="52" fill="${dark}"/>`;
    [[70, 60, 34], [170, 46, 28], [300, 70, 40], [430, 52, 30], [520, 44, 26]].forEach(([x, w, h]) => {
      body += `<rect x="${x}" y="${120 - h}" width="${w}" height="${h}" fill="${night ? '#10141a' : '#3a3628'}"/>`;
      body += `<polygon points="${x - 6},${120 - h} ${x + w / 2},${120 - h - w * 0.45} ${x + w + 6},${120 - h}" fill="${dark}"/>`;
      body += `<rect x="${x + w * 0.35}" y="${120 - h * 0.6}" width="7" height="8" fill="${night ? '#c98a3a' : '#1b1b16'}" opacity="${night ? 0.8 : 1}"/>`;
    });
    body += `<path d="M330,70 C320,40 350,30 340,0" stroke="#555" stroke-width="14" fill="none" opacity=".35"/>`;
  } else if (scene === 'road') {
    body += pines(rnd, 20, 100, 20, 45, mid);
    body += `<rect x="0" y="98" width="600" height="62" fill="${night ? '#0b0e11' : '#5d5940'}"/>`;
    body += `<polygon points="280,98 320,98 470,160 130,160" fill="${night ? '#1a1e22' : '#9a9070'}"/>`;
    [[300, 104, 0.35], [292, 116, 0.55], [312, 128, 0.75], [270, 140, 1]].forEach(([x, y, k]) => {
      body += `<g transform="translate(${x},${y}) scale(${k})" fill="${dark}"><rect x="-12" y="-14" width="24" height="10"/><circle cx="-8" cy="-2" r="4"/><circle cx="8" cy="-2" r="4"/><rect x="-28" y="-18" width="5" height="14"/><circle cx="-25.5" cy="-21" r="3"/></g>`;
    });
  } else if (scene === 'river') {
    // A river gorge: limestone cliffs, water, a town on the far bank.
    body += `<polygon points="0,40 70,30 140,55 190,70 190,160 0,160" fill="${night ? '#141a1f' : '#8f8c7c'}"/>`;
    body += `<polygon points="600,35 520,28 450,50 400,72 400,160 600,160" fill="${night ? '#10161b' : '#7f7d6e'}"/>`;
    body += pines(rnd, 10, 45, 12, 26, mid).replace(/<polygon/g, '<polygon opacity=".9"');
    body += `<rect x="0" y="104" width="600" height="56" fill="${night ? '#0d1a22' : '#5f7a77'}"/>`;
    for (let i = 0; i < 10; i++) body += `<line x1="${60 + i * 55}" y1="${115 + (i % 3) * 12}" x2="${85 + i * 55}" y2="${115 + (i % 3) * 12}" stroke="${night ? '#2e4652' : '#9db4b0'}" stroke-width="1.5" opacity=".7"/>`;
    [[205, 30, 26], [240, 24, 32], [270, 34, 22], [310, 26, 30], [345, 30, 24]].forEach(([x, w, h]) => {
      body += `<rect x="${x}" y="${104 - h}" width="${w}" height="${h}" fill="${night ? '#151a20' : '#3e3a2e'}"/>`;
      body += `<polygon points="${x - 3},${104 - h} ${x + w / 2},${104 - h - w * 0.4} ${x + w + 3},${104 - h}" fill="${dark}"/>`;
    });
    body += `<rect x="285" y="40" width="16" height="64" fill="${night ? '#151a20' : '#3e3a2e'}"/><polygon points="281,40 293,14 305,40" fill="${dark}"/>`;
    body += `<path d="M200,70 C230,40 260,60 300,30 C340,10 380,40 420,20" stroke="${night ? '#3a3a3a' : '#777'}" stroke-width="22" fill="none" opacity=".35"/>`;
    if (night) [[230, 92], [320, 88]].forEach(([x, y]) => { body += `<circle cx="${x}" cy="${y}" r="18" fill="url(#glow)"/>`; });
    body += `<path d="M250,132 l40,0 l-6,8 l-28,0 Z" fill="${dark}"/><g fill="${dark}">${[256, 264, 272, 280].map(x => `<circle cx="${x}" cy="129" r="2.6"/>`).join('')}</g>`;
  } else if (scene === 'city') {
    // Paris rooftops with the Eiffel Tower.
    const roof = night ? '#0e1218' : '#4b4a42';
    body += `<g fill="${night ? '#151a20' : '#6b6a5e'}"><path d="M440,120 L452,30 L456,30 L468,120 Z"/><rect x="449" y="60" width="10" height="3"/><rect x="445" y="88" width="18" height="4"/><path d="M438,120 Q454,95 470,120 Z" fill="${night ? '#0e1218' : '#8e8c7c'}"/><line x1="454" y1="18" x2="454" y2="30" stroke="${night ? '#151a20' : '#6b6a5e'}" stroke-width="2"/></g>`;
    let x0 = 0;
    while (x0 < 600) { const w = 40 + rnd() * 50, h = 30 + rnd() * 35; body += `<rect x="${x0}" y="${160 - h}" width="${w}" height="${h}" fill="${roof}"/><polygon points="${x0},${160 - h} ${x0 + w * 0.15},${160 - h - 10} ${x0 + w * 0.85},${160 - h - 10} ${x0 + w},${160 - h}" fill="${dark}"/>`;
      for (let i = 0; i < 3; i++) body += `<rect x="${x0 + 8 + i * (w / 3.2)}" y="${170 - h}" width="5" height="8" fill="${night ? (rnd() > 0.7 ? '#c98a3a' : '#0a0d10') : '#2a2b25'}"/>`;
      x0 += w + 2; }
  } else if (scene === 'bridge') {
    // A stone bridge over a quiet river, a barrier and a sentry hut.
    body += pines(rnd, 16, 98, 18, 40, mid);
    body += `<rect x="0" y="96" width="600" height="64" fill="${night ? '#0d1a22' : '#6f8582'}"/>`;
    for (let i = 0; i < 8; i++) body += `<line x1="${20 + i * 75}" y1="${130 + (i % 3) * 9}" x2="${50 + i * 75}" y2="${130 + (i % 3) * 9}" stroke="${night ? '#2e4652' : '#a9bdb9'}" stroke-width="1.4" opacity=".7"/>`;
    body += `<rect x="60" y="92" width="480" height="12" fill="${night ? '#1a1f24' : '#7c7462'}"/>`;
    for (let i = 0; i < 7; i++) body += `<path d="M${68 + i * 68},126 a30,24 0 0 1 60,0 Z" fill="${night ? '#0d1a22' : '#6f8582'}"/><rect x="${64 + i * 68}" y="104" width="8" height="24" fill="${night ? '#1a1f24' : '#7c7462'}"/>`;
    body += `<rect x="60" y="104" width="480" height="4" fill="${night ? '#1a1f24' : '#7c7462'}"/>`;
    body += `<rect x="40" y="62" width="34" height="32" fill="${dark}"/><polygon points="36,62 57,48 78,62" fill="${dark}"/>`;
    body += `<rect x="96" y="70" width="4" height="24" fill="${dark}"/><rect x="96" y="70" width="90" height="4" fill="#9a2f22"/><rect x="120" y="70" width="14" height="4" fill="#e9e1cb"/><rect x="150" y="70" width="14" height="4" fill="#e9e1cb"/>`;
    if (night) body += `<circle cx="57" cy="80" r="16" fill="url(#glow)"/>`;
  } else if (scene === 'letter') {
    return `<svg viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="600" height="160" fill="#3b3426"/>
      <g transform="rotate(-4 300 80)"><rect x="170" y="18" width="270" height="150" fill="#e6dcc0"/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M190,${45 + i * 13} q${40 + (i * 13) % 30},-3 ${210 - (i * 37) % 60},1" stroke="#3a3a6a" stroke-width="1.4" fill="none" opacity=".75"/>`).join('')}
      </g><rect x="420" y="30" width="58" height="66" fill="#7a2e22" transform="rotate(8 450 60)"/>
      <circle cx="452" cy="64" r="16" fill="none" stroke="#e6dcc0" stroke-width="2" transform="rotate(8 450 60)"/></svg>`;
  }

  return `<svg viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
      <radialGradient id="glow"><stop offset="0" stop-color="#f0a040" stop-opacity=".8"/><stop offset="1" stop-color="#f0a040" stop-opacity="0"/></radialGradient>
      <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#d8d3c0" stop-opacity="0"/><stop offset=".75" stop-color="#d8d3c0" stop-opacity=".55"/><stop offset="1" stop-color="#d8d3c0" stop-opacity=".2"/></linearGradient>
    </defs>
    <rect width="600" height="160" fill="url(#sky)"/>
    ${night ? Array.from({ length: 30 }, () => `<circle cx="${rnd() * 600}" cy="${rnd() * 70}" r="${rnd() * 1.1 + .2}" fill="#cfd6e0" opacity=".7"/>`).join('') : ''}
    ${body}
  </svg>`;
};

// Campaign maps: one schematic per chapter.
SIM.MAPS = {
  poland: () => ({
    label: 'Map of Pomerania and the Polish Corridor, 1939',
    base: `<rect width="320" height="250" class="m-land"/>
    <path d="M0,0 L320,0 L320,48 C300,52 285,40 270,38 C262,50 250,58 244,46 C230,40 200,62 160,66 C120,70 80,78 40,84 L0,92 Z" class="m-sea"/>
    <text x="70" y="40" class="m-sea-label">Baltic Sea</text>
    <path d="M168,66 C172,100 178,130 176,160 C174,190 182,215 190,250" class="m-border"/>
    <path d="M262,52 C270,90 280,110 300,130 L320,135" class="m-border"/>
    <path d="M256,46 C252,80 250,120 250,160 C252,190 262,220 272,250" class="m-river"/>
    <text x="40" y="200" class="m-country">GERMANY</text>
    <text x="198" y="235" class="m-country">POLAND</text>
    <text x="272" y="100" class="m-country m-small">EAST</text><text x="268" y="111" class="m-country m-small">PRUSSIA</text>
    <text x="204" y="104" class="m-small m-label" transform="rotate(-80 204 104)">CORRIDOR</text>`,
    towns: [[28, 108, 'Stettin'], [130, 146, 'Hammerstein', 'end'], [192, 150, 'Konitz'], [258, 50, 'Danzig'], [232, 44, 'Gdingen', 'end'], [250, 200, 'Bromberg', 'end'], [254, 168, 'Schwetz']]
  }),
  france: () => ({
    label: 'Map of the Ardennes and the Meuse, 1940',
    base: `<rect width="320" height="250" class="m-land"/>
    <path d="M0,0 L120,0 C100,20 60,30 0,34 Z" class="m-sea"/>
    <text x="12" y="18" class="m-sea-label">North Sea</text>
    <path d="M270,0 C268,40 276,80 272,118 C268,140 282,150 292,165" class="m-border"/>
    <path d="M240,160 C252,150 270,152 292,165 C296,180 290,196 280,205 C262,206 248,200 240,190 Z" class="m-lux"/>
    <path d="M0,140 C40,138 80,150 110,165 C140,180 160,192 180,196 C210,200 232,196 240,190" class="m-border"/>
    <path d="M175,250 C176,225 178,205 172,190 C165,170 158,140 152,115 C150,100 152,90 156,80 C175,70 200,62 216,56 C235,45 250,20 255,0" class="m-river"/>
    <text x="164" y="168" class="m-small m-label" transform="rotate(-72 164 168)">MEUSE</text>
    <text x="282" y="70" class="m-country m-small" transform="rotate(90 282 70)">GERMANY</text>
    <text x="70" y="95" class="m-country">BELGIUM</text>
    <text x="60" y="215" class="m-country">FRANCE</text>
    <text x="244" y="182" class="m-country m-small">LUX.</text>`,
    towns: [[156, 80, 'Namur', 'end'], [216, 56, 'Liège'], [150, 116, 'Dinant', 'end'], [116, 136, 'Philippeville', 'end'], [72, 152, 'Avesnes', 'end'], [174, 197, 'Sedan', 'end'], [222, 150, 'Bastogne'], [258, 110, 'St. Vith', 'end'], [292, 112, 'Prüm', 'end'], [70, 52, 'Brussels']]
  })
};

SIM.MAPS.occupied = () => ({
  label: 'Map of occupied France, 1940',
  base: `<rect width="320" height="250" class="m-land"/>
    <path d="M0,0 L180,0 C160,8 140,12 120,14 C100,16 80,30 60,40 C40,48 30,60 10,62 L0,62 Z" class="m-sea"/>
    <path d="M0,62 C10,90 30,110 20,140 C12,170 30,200 20,250 L0,250 Z" class="m-sea"/>
    <text x="40" y="22" class="m-sea-label">English Channel</text>
    <path d="M300,140 C280,148 262,152 248,150 C232,160 216,170 205,175 C190,168 170,158 150,150 C132,146 118,140 108,135 C100,160 92,190 80,215 C74,230 70,240 66,250" class="m-border"/>
    <path d="M30,128 C70,124 110,126 140,138 C150,142 160,150 166,158" class="m-river"/>
    <path d="M40,40 C80,50 120,60 168,72 C200,70 230,60 250,50" class="m-river"/>
    <text x="40" y="100" class="m-country m-small">OCCUPIED ZONE</text>
    <text x="150" y="220" class="m-country m-small">VICHY FRANCE</text>
    <text x="120" y="162" class="m-small m-label">Cher</text>
    <text x="95" y="122" class="m-small m-label">Loire</text>`,
  towns: [[168, 72, 'Paris'], [120, 18, 'Boulogne', 'end'], [176, 92, 'Fontainebleau'], [100, 128, 'Tours', 'end'], [160, 150, 'Vierzon'], [200, 196, 'Vichy'], [140, 150, 'Saint-Avit', 'end']]
});

// Variants that must not fall back to the generic (summer) paintings.
SIM.VARIANT_ONLY = ['winter'];
// Turn a drawn scene into winter: pale sky, snow on the ground, falling snow.
SIM.winterize = function (svg, phase, seed) {
  const rnd = seeded((seed || 7) + 99);
  const night = phase === 2;
  const flakes = Array.from({ length: 70 }, () => `<circle cx="${(rnd() * 600).toFixed(0)}" cy="${(rnd() * 160).toFixed(0)}" r="${(rnd() * 1.4 + .4).toFixed(1)}" fill="#fff" opacity="${night ? .5 : .8}"/>`).join('');
  const overlay = `<rect width="600" height="160" fill="${night ? '#1c2836' : '#dfe4e8'}" opacity="${night ? .25 : .35}"/>
    <rect x="0" y="134" width="600" height="26" fill="${night ? '#5a6878' : '#eef1f3'}" opacity="${night ? .55 : .85}"/>
    <path d="M0,136 Q80,130 160,137 T320,134 T480,138 T600,133 L600,141 L0,141 Z" fill="${night ? '#6d7b8b' : '#f6f8f9'}" opacity=".9"/>${flakes}`;
  return svg.replace(/<\/svg>\s*$/, overlay + '</svg>');
};

SIM.MAPS.moscow = () => ({
  label: 'Map of the approaches to Moscow, winter 1941',
  base: `<rect width="320" height="250" class="m-land"/>
    <path d="M0,70 C60,80 120,60 180,70 C220,76 260,60 320,64" class="m-river" opacity=".6"/>
    <path d="M150,250 C160,210 175,180 200,160 C230,140 270,130 320,128" class="m-river"/>
    <path d="M190,0 C192,40 196,80 205,110" class="m-river" opacity=".7"/>
    <ellipse cx="290" cy="125" rx="14" ry="10" fill="#c5bb98"/>
    <path d="M168,30 C190,70 205,95 222,112 C232,125 238,150 248,180 C255,205 262,225 270,250" class="m-border" stroke-dasharray="2 3" opacity=".8"/>
    <text x="226" y="200" class="m-small m-label" transform="rotate(-62 226 200)">front, 5 Dec 1941</text>
    <text x="10" y="232" class="m-country">SOVIET UNION</text>
    <text x="196" y="102" class="m-small m-label">Istra</text>`,
  towns: [[18, 150, 'Smolensk'], [90, 150, 'Vyazma'], [168, 150, 'Mozhaisk', 'end'], [165, 96, 'Volokolamsk', 'end'], [205, 58, 'Klin'], [160, 38, 'Kalinin', 'end'], [290, 125, 'Moscow', 'end', 16], [268, 226, 'Tula'], [175, 120, 'Ruza', 'end']]
});

SIM.MAPS.east = () => ({
  label: 'Map of the Soviet borderlands, summer 1941',
  base: `<rect width="320" height="250" class="m-land"/>
    <path d="M44,0 C50,40 40,80 52,120 C58,150 46,190 50,250" class="m-border"/>
    <path d="M50,250 C52,210 46,190 54,168 C60,140 52,110 58,80" class="m-river"/>
    <path d="M186,0 C182,40 192,80 186,110 C182,140 188,180 184,250" class="m-river"/>
    <path d="M320,62 C300,70 285,78 272,80 C262,84 256,92 252,110 C248,140 260,180 250,250" class="m-river"/>
    <ellipse cx="140" cy="205" rx="70" ry="22" fill="#c5bb98" opacity=".6"/>
    <text x="96" y="208" class="m-small m-label">Pripet Marshes</text>
    <text x="56" y="152" class="m-small m-label" transform="rotate(-80 56 152)">BUG</text>
    <text x="190" y="140" class="m-small m-label" transform="rotate(-85 190 140)">BEREZINA</text>
    <text x="256" y="150" class="m-small m-label" transform="rotate(-80 256 150)">DNIEPER</text>
    <text x="4" y="40" class="m-country m-small">GENERAL</text><text x="4" y="50" class="m-country m-small">GOVERNMENT</text>
    <text x="200" y="40" class="m-country">SOVIET UNION</text>`,
  towns: [[50, 180, 'Brest', 'end'], [60, 108, 'Białystok', 'end'], [98, 124, 'Wołkowysk'], [150, 108, 'Minsk'], [186, 96, 'Borisov'], [232, 104, 'Orsha'], [276, 76, 'Smolensk'], [14, 150, 'Warsaw']]
});

SIM.mapSVG = function (s) {
  const ch = SIM.chapter(s);
  const m = SIM.MAPS[ch.map]();
  const days = ch.days;
  const visited = days.slice(0, s.day + 1).map(d => SIM.dayPlace(s, d)).filter((p, i, a) => a.indexOf(p) === i);
  const cur = ch.places[SIM.dayPlace(s, days[Math.min(s.day, days.length - 1)])];
  const path = visited.map(p => ch.places[p]).map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  const town = (x, y, name, anchor = 'start', dx = 5) => `<circle cx="${x}" cy="${y}" r="2.2" class="m-town"/><text x="${x + (anchor === 'end' ? -dx : dx)}" y="${y + 3}" text-anchor="${anchor}" class="m-label">${name}</text>`;
  return `<svg viewBox="0 0 320 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${m.label}">
    ${m.base}
    ${m.towns.map(t => town(...t)).join('')}
    <path d="${path}" class="m-path"/>
    ${visited.map(p => `<circle cx="${ch.places[p].x}" cy="${ch.places[p].y}" r="3" class="m-visited"/>`).join('')}
    <circle cx="${cur.x}" cy="${cur.y}" r="6" class="m-you"/><circle cx="${cur.x}" cy="${cur.y}" r="10" class="m-you-ring"/>
  </svg>`;
};
