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

SIM.sceneSVG = function (scene, phase, seed) {
  const rnd = seeded(seed || 7);
  const [top, bot] = SIM.SKIES[phase] || SIM.SKIES[0];
  const night = phase === 2;
  const dark = night ? '#06080b' : '#2b2e27';
  const mid = night ? '#0d1117' : '#4a4d40';
  let body = '';

  if (scene === 'camp') {
    body += pines(rnd, 26, 120, 40, 85, mid);
    body += `<rect x="0" y="118" width="600" height="42" fill="${dark}"/>`;
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

// Schematic map of Pomerania and the Polish Corridor, 1939.
SIM.mapSVG = function (s) {
  const visited = SIM.DAYS.slice(0, s.day + 1).map(d => d.place).filter((p, i, a) => a.indexOf(p) === i);
  const cur = SIM.PLACES[SIM.DAYS[Math.min(s.day, SIM.DAYS.length - 1)].place];
  const path = visited.map(p => SIM.PLACES[p]).map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  const town = (x, y, name, anchor = 'start', dx = 5) => `<circle cx="${x}" cy="${y}" r="2.2" class="m-town"/><text x="${x + (anchor === 'end' ? -dx : dx)}" y="${y + 3}" text-anchor="${anchor}" class="m-label">${name}</text>`;
  return `<svg viewBox="0 0 320 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of the Polish Corridor, 1939">
    <rect width="320" height="250" class="m-land"/>
    <path d="M0,0 L320,0 L320,48 C300,52 285,40 270,38 C262,50 250,58 244,46 C230,40 200,62 160,66 C120,70 80,78 40,84 L0,92 Z" class="m-sea"/>
    <text x="70" y="40" class="m-sea-label">Baltic Sea</text>
    <path d="M168,66 C172,100 178,130 176,160 C174,190 182,215 190,250" class="m-border"/>
    <path d="M262,52 C270,90 280,110 300,130 L320,135" class="m-border"/>
    <path d="M256,46 C252,80 250,120 250,160 C252,190 262,220 272,250" class="m-river"/>
    <text x="40" y="200" class="m-country">GERMANY</text>
    <text x="198" y="235" class="m-country">POLAND</text>
    <text x="272" y="100" class="m-country m-small">EAST</text><text x="268" y="111" class="m-country m-small">PRUSSIA</text>
    <text x="204" y="104" class="m-small m-label" transform="rotate(-80 204 104)">CORRIDOR</text>
    ${town(28, 108, 'Stettin')}
    ${town(130, 146, 'Hammerstein', 'end')}
    ${town(192, 150, 'Konitz')}
    ${town(258, 50, 'Danzig')}
    ${town(232, 44, 'Gdingen', 'end')}
    ${town(250, 200, 'Bromberg', 'end')}
    ${town(254, 168, 'Schwetz')}
    <path d="${path}" class="m-path"/>
    ${visited.map(p => `<circle cx="${SIM.PLACES[p].x}" cy="${SIM.PLACES[p].y}" r="3" class="m-visited"/>`).join('')}
    <circle cx="${cur.x}" cy="${cur.y}" r="6" class="m-you"/><circle cx="${cur.x}" cy="${cur.y}" r="10" class="m-you-ring"/>
  </svg>`;
};
