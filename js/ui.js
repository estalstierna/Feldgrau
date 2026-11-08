// UI: screens, rendering, input.
window.SIM = window.SIM || {};

(function () {
  const $ = sel => document.querySelector(sel);
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paras = t => esc(t).split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => `<p>${p}</p>`).join('');
  const pick = a => a[Math.floor(Math.random() * a.length)];

  let S = null;        // game state
  let current = null;  // current event object

  function show(id) {
    document.querySelectorAll('.screen').forEach(el => el.hidden = el.id !== id);
    window.scrollTo(0, 0);
  }

  // ── Title ──
  function renderTitle() {
    const saved = SIM.load();
    $('#btn-continue').hidden = !(saved && !saved.ending && saved.current);
    show('title');
  }

  // ── Character creation ──
  const draft = { first: '', last: '', birthYear: 1918, hometown: 'hamburg', background: 'factory', family: 'none' };

  function optionGroup(key, list) {
    return `<fieldset class="opt-group"><legend>${{ birthYear: 'Born', hometown: 'Home town', background: 'Before the army', family: 'Family' }[key]}</legend>
      <div class="opts">${list.map(o => `
        <label class="opt ${draft[key] === o.id ? 'sel' : ''}">
          <input type="radio" name="${key}" value="${o.id}" ${draft[key] === o.id ? 'checked' : ''}>
          <span class="opt-title">${esc(o.label)}</span>
          <span class="opt-desc">${esc(o.desc)}</span>
        </label>`).join('')}</div></fieldset>`;
  }

  function renderCreate() {
    if (!draft.first) { draft.first = pick(SIM.FIRST_NAMES); draft.last = pick(SIM.LAST_NAMES); }
    const C = SIM.CREATION;
    $('#create-body').innerHTML = `
      <fieldset class="opt-group"><legend>Name</legend>
        <div class="name-row">
          <input id="in-first" maxlength="20" value="${esc(draft.first)}" aria-label="First name" placeholder="First name">
          <input id="in-last" maxlength="20" value="${esc(draft.last)}" aria-label="Surname" placeholder="Surname">
          <button type="button" class="btn small" id="btn-randname">Random</button>
        </div>
      </fieldset>
      ${optionGroup('birthYear', C.birthYear)}
      ${optionGroup('hometown', C.hometown)}
      ${optionGroup('background', C.background)}
      ${optionGroup('family', C.family)}`;
    $('#in-first').oninput = e => draft.first = e.target.value;
    $('#in-last').oninput = e => draft.last = e.target.value;
    $('#btn-randname').onclick = () => { draft.first = pick(SIM.FIRST_NAMES); draft.last = pick(SIM.LAST_NAMES); renderCreate(); };
    document.querySelectorAll('#create-body input[type=radio]').forEach(r => r.onchange = e => {
      const k = e.target.name; draft[k] = k === 'birthYear' ? Number(e.target.value) : e.target.value; renderCreate();
    });
    show('create');
  }

  // ── Prologue ──
  function renderPrologue() {
    const c = Object.assign({}, draft);
    c.first = (c.first || '').trim() || pick(SIM.FIRST_NAMES);
    c.last = (c.last || '').trim() || pick(SIM.LAST_NAMES);
    S = SIM.newState(c);
    $('#prologue-name').textContent = `${c.first} ${c.last}`;
    $('#prologue-body').innerHTML = SIM.backstory(c).map(b => `<div class="tl-item"><div class="tl-year">${esc(b.year)}</div><div class="tl-text">${paras(b.text)}</div></div>`).join('');
    show('prologue');
  }

  // ── Sidebar ──
  function renderSidebar() {
    const c = S.char;
    $('#char-name').textContent = `${c.first} ${c.last}`;
    $('#char-rank').textContent = `${SIM.RANKS[S.rank]} (${SIM.RANK_EN[S.rank]})`;
    $('#char-unit').textContent = `3rd Coy, 2nd Bn · born ${c.birthYear}, ${SIM.townName(c.hometown)}`;
    $('#stats').innerHTML = Object.keys(SIM.STATS).map(k => {
      const st = SIM.STATS[k], v = S.stats[k];
      const level = st.bad ? (v >= 70 ? 'crit' : v >= 40 ? 'warn' : 'ok') : (v <= 20 ? 'crit' : v <= 40 ? 'warn' : 'ok');
      return `<div class="stat" title="${esc(st.desc)}"><div class="stat-head"><span>${st.label}</span><span>${v}</span></div>
        <div class="bar"><div class="fill ${level} ${st.bad ? 'bad' : ''}" style="width:${v}%"></div></div></div>`;
    }).join('') + `<div class="stat money"><span>Reichsmarks</span><span>${S.marks} RM</span></div>`;
    $('#map').innerHTML = SIM.mapSVG(S);
    $('#diary').innerHTML = S.log.length ? S.log.slice().reverse().map(l => `<li><span class="d-date">${esc(l.date)}</span> ${esc(l.text)}</li>`).join('') : '<li class="muted">Nothing yet.</li>';
    $('#days').innerHTML = SIM.DAYS.map((d, i) => `<span class="day ${i < S.day ? 'past' : i === S.day ? 'now' : ''}">${esc(d.short.split(' ')[1])}</span>`).join('');
    $('#mini-stats').innerHTML = Object.keys(SIM.STATS).map(k => {
      const st = SIM.STATS[k], v = S.stats[k];
      const level = st.bad ? (v >= 70 ? 'crit' : v >= 40 ? 'warn' : 'ok') : (v <= 20 ? 'crit' : v <= 40 ? 'warn' : 'ok');
      return `<span class="mini ${level}" title="${esc(st.label)}">${st.short} <b>${v}</b></span>`;
    }).join('') + `<span class="mini">RM <b>${S.marks}</b></span>`;
  }

  // ── Events ──
  function header(ev) {
    const d = SIM.DAYS[S.day];
    const place = SIM.PLACES[ev.place || d.place].name;
    $('#ev-date').textContent = `${d.date} · ${ev.time || SIM.PHASE_TIME[S.phase]}`;
    $('#ev-place').textContent = place;
    $('#banner').innerHTML = SIM.sceneSVG(ev.scene, S.phase, (S.day + 1) * 13 + S.phase * 5 + ev.id.length);
  }

  function renderEvent(ev) {
    current = ev;
    S.current = ev.id;
    SIM.save(S);
    renderSidebar();
    header(ev);
    $('#notes').innerHTML = (S.notes || []).map(n => `<div class="note">${esc(n)}</div>`).join('');
    $('#ev-title').textContent = ev.title;
    $('#ev-text').innerHTML = paras(SIM.fmt(S, ev.text));
    $('#result').hidden = true;
    const box = $('#choices');
    box.hidden = false;
    box.innerHTML = '';
    ev.choices.filter(ch => SIM.choiceVisible(S, ch)).forEach((ch, i) => {
      const ok = SIM.choiceAllowed(S, ch);
      const b = document.createElement('button');
      b.className = 'choice';
      b.disabled = !ok;
      b.innerHTML = `<span class="ch-num">${i + 1}</span><span class="ch-text">${esc(SIM.fmt(S, ch.text))}${!ok && ch.reqText ? `<small>${esc(ch.reqText)}</small>` : ''}${ch.risk ? '<small class="risky">Dangerous</small>' : ''}</span>`;
      b.onclick = () => choose(ch);
      box.appendChild(b);
    });
    $('#main').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function chips(deltas) {
    return Object.keys(deltas).map(k => {
      const v = deltas[k];
      const label = k === 'marks' ? 'RM' : SIM.STATS[k].label;
      const good = k === 'suspicion' ? v < 0 : v > 0;
      return `<span class="chip ${good ? 'good' : 'bad'}">${v > 0 ? '+' : ''}${v} ${label}</span>`;
    }).join('');
  }

  function choose(ch) {
    const out = SIM.resolveChoice(S, current, ch);
    $('#choices').hidden = true;
    const r = $('#result');
    r.hidden = false;
    r.innerHTML = `<div class="chosen">“${esc(SIM.fmt(S, ch.text))}”</div>${paras(out.texts.join('\n\n'))}<div class="chips">${chips(out.deltas)}</div><button class="btn primary" id="btn-next">Continue</button>`;
    renderSidebar();
    SIM.save(S);
    $('#btn-next').onclick = () => proceed(out);
    $('#btn-next').focus({ preventScroll: true });
  }

  function proceed(out) {
    if (out.end) return renderEnding(SIM.finish(S, out.end));
    const f = SIM.fatal(S);
    if (f) return renderEnding(SIM.finish(S, f));
    if (out.next) { S.notes = []; return renderEvent(SIM.findEvent(out.next)); }
    if (current.id === 'd6n') return renderEnding(SIM.finish(S, SIM.chapterEnding(S)));
    const res = SIM.advance(S);
    const f2 = SIM.fatal(S);
    if (f2) return renderEnding(SIM.finish(S, f2));
    if (res === 'chapterEnd') return renderEnding(SIM.finish(S, SIM.chapterEnding(S)));
    const ev = SIM.pickEvent(S);
    if (!ev) { return proceed({}); }
    renderEvent(ev);
  }

  // ── Ending ──
  function renderEnding(id) {
    const e = SIM.ENDINGS[id];
    S.current = null;
    SIM.save(S);
    $('#end-kicker').textContent = e.final ? 'The End' : 'End of Chapter I: The Corridor';
    $('#end-title').textContent = e.title;
    $('#end-text').innerHTML = paras(SIM.fmt(S, e.text));
    const c = S.char;
    $('#end-summary').innerHTML = `
      <h3>${esc(SIM.RANKS[S.rank])} ${esc(c.first)} ${esc(c.last)}, born ${c.birthYear}, ${esc(SIM.townName(c.hometown))}</h3>
      <div class="end-stats">${Object.keys(SIM.STATS).map(k => `<div><span>${SIM.STATS[k].label}</span><b>${S.stats[k]}</b></div>`).join('')}</div>
      <h3>Diary</h3>
      <ul class="diary">${S.log.map(l => `<li><span class="d-date">${esc(l.date)}</span> ${esc(l.text)}</li>`).join('') || '<li class="muted">You wrote nothing down.</li>'}</ul>
      ${e.final ? '' : '<p class="next-chapter">Chapter II (France, 1940) is not yet written. Your soldier will be waiting.</p>'}`;
    show('ending');
  }

  // ── Wiring ──
  function init() {
    $('#btn-new').onclick = () => { draft.first = ''; renderCreate(); };
    $('#btn-continue').onclick = () => {
      const saved = SIM.load();
      if (!saved || !saved.current) return renderTitle();
      S = saved;
      show('game');
      renderEvent(SIM.findEvent(saved.current));
    };
    $('#btn-create').onclick = renderPrologue;
    $('#btn-back').onclick = renderTitle;
    $('#btn-start').onclick = () => { S.notes = []; show('game'); renderEvent(SIM.pickEvent(S)); };
    $('#btn-again').onclick = () => { SIM.clearSave(); renderTitle(); };
    $('#btn-quit').onclick = () => { if (confirm('Return to the title screen? Your progress is saved.')) renderTitle(); };
    $('#toggle-diary').onclick = () => { const d = $('#diary-wrap'); d.hidden = !d.hidden; };
    document.addEventListener('keydown', e => {
      if ($('#game').hidden) return;
      if (e.key === 'Enter' && !$('#result').hidden) { $('#btn-next').click(); return; }
      const n = parseInt(e.key, 10);
      if (n >= 1 && !$('#choices').hidden) {
        const btns = [...document.querySelectorAll('#choices .choice')];
        if (btns[n - 1] && !btns[n - 1].disabled) btns[n - 1].click();
      }
    });
    renderTitle();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
