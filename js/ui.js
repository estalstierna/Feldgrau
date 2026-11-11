// UI: screens, rendering, input.
window.SIM = window.SIM || {};

(function () {
  const $ = sel => document.querySelector(sel);
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paras = t => esc(t).split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => `<p>${p}</p>`).join('');
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rankName = r => `${SIM.rankTitle(S, r)} (${SIM.RANK_EN[r]})`;

  let S = null;        // game state
  let current = null;  // current event object

  function show(id) {
    document.querySelectorAll('.screen').forEach(el => el.hidden = el.id !== id);
    const nav = document.querySelector('#bottom-nav');
    if (nav) nav.hidden = id !== 'game';
    window.scrollTo(0, 0);
  }

  function resumable(s) {
    if (!s) return false;
    if (s.stage === 'event') return !!s.current;
    if (s.stage === 'interlude') return true;
    // A chapter ending that is not the end of the soldier's story stays resumable,
    // even before the next chapter is written.
    if (s.stage === 'ending') return !!s.ending && !!SIM.ENDINGS[s.ending] && !SIM.ENDINGS[s.ending].final;
    return false;
  }

  // ── Title ──
  function renderTitle() {
    $('#btn-continue').hidden = !resumable(SIM.load());
    $('#btn-archive').hidden = !SIM.loadArchive().length;
    $('#title-chapters').textContent = SIM.CHAPTERS.map(c => `Chapter ${c.num}: ${c.title} · ${c.range}`).join('\n');
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
          <span class="opt-desc">${esc(o.desc)}${o.medal ? ` <em>Starts with the ${esc(SIM.MEDALS[o.medal].name)}.</em>` : ''}</span>
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
    $('#prologue-body').innerHTML = timeline(SIM.backstory(c));
    show('prologue');
  }

  const timeline = items => items.map(b => `<div class="tl-item"><div class="tl-year">${esc(b.year)}</div><div class="tl-text">${paras(b.text)}</div></div>`).join('');

  // ── Medals ──
  function ribbonBar(s) {
    const shown = SIM.displayMedals(s);
    const ribbons = shown.filter(m => SIM.MEDALS[m.id].kind === 'ribbon');
    const badges = shown.filter(m => SIM.MEDALS[m.id].kind === 'badge');
    if (!shown.length) return '<span class="muted small">No decorations.</span>';
    return `${ribbons.length ? `<div class="ribbon-bar">${ribbons.map(m => `<span title="${esc(SIM.MEDALS[m.id].name)}">${SIM.ribbonSVG(m.id)}</span>`).join('')}</div>` : ''}
      ${badges.length ? `<div class="badge-row">${badges.map(m => `<span title="${esc(SIM.MEDALS[m.id].name)}">${SIM.badgeSVG(m.id, 26)}</span>`).join('')}</div>` : ''}`;
  }

  function medalCards(ids, s) {
    return ids.map(id => {
      const m = SIM.MEDALS[id];
      const rec = s && s.medals.find(r => r.id === id);
      const wide = m.shape === 'clasp';
      return `<div class="medal-card${wide ? ' wide' : ''}">
        <div class="medal-art">${SIM.badgeSVG(id, wide ? 64 : 96)}</div>
        <div class="medal-info"><b>${esc(m.name)}</b><span class="muted small"><i>${esc(m.german)}</i></span>
        ${rec ? `<span class="small">${esc(rec.date)}${rec.reason ? ' · ' + esc(rec.reason) : ''}</span>` : ''}
        <span class="small muted">${esc(m.desc)}</span></div></div>`;
    }).join('');
  }

  // ── Past soldiers (title screen) ──
  function openArchive() {
    const list = SIM.loadArchive();
    const medal = id => SIM.MEDALS[id] ? `<figure class="archive-medal${SIM.MEDALS[id].shape === 'clasp' ? ' wide' : ''}" title="${esc(SIM.MEDALS[id].german || '')}">${SIM.badgeSVG(id, SIM.MEDALS[id].shape === 'clasp' ? 30 : 56)}<figcaption>${esc(SIM.MEDALS[id].name)}</figcaption></figure>` : '';
    const mark = r => r.how === 'kia' ? '†' : r.how === 'unfinished' ? '…' : '•';
    $('#profile-body').innerHTML = `<div class="kicker">Past soldiers</div><h2>The Fallen and the Others</h2>
      <p class="small muted">Every soldier whose story has ended, newest first. Kept in this browser only.</p>` +
      list.map(r => {
        const lost = (r.squad || []).filter(m => m.status === 'killed').length;
        return `<div class="archive-card ${r.how === 'kia' ? 'fallen' : ''}">
          <div class="person-top"><b>${mark(r)} ${esc(r.rank)} ${esc(r.name)}</b><span class="small muted">${esc(r.finished)}</span></div>
          <div class="small">Born ${r.born}, ${esc(r.town)}${r.ss ? ' · Waffen-SS' : ''}</div>
          <div class="archive-end"><b>${esc(r.title)}</b> · Chapter ${esc(r.chapter)}: ${esc(r.chapterTitle)}, ${esc(r.date)}</div>
          ${r.cause ? `<div class="small muted"><i>${esc(r.cause)}</i></div>` : ''}
          ${r.medals.length ? `<div class="archive-medals">${r.medals.map(medal).join('')}</div>` : ''}
          ${[r.wounds ? `Wounded ${r.wounds} time${r.wounds === 1 ? '' : 's'}` : '', lost ? `${lost} of his men killed` : '', r.lastWords ? `Last diary entry: “${esc(r.lastWords)}”` : ''].filter(Boolean).length ? `<div class="small muted">${[r.wounds ? `Wounded ${r.wounds} time${r.wounds === 1 ? '' : 's'}` : '', lost ? `${lost} of his men killed` : '', r.lastWords ? `Last diary entry: “${esc(r.lastWords)}”` : ''].filter(Boolean).join(' · ')}</div>` : ''}
        </div>`;
      }).join('') + `<p><button class="btn small" id="btn-clear-archive">Clear the list</button></p>`;
    $('#profile').hidden = false;
    $('#btn-close-profile').focus();
    $('#btn-clear-archive').onclick = () => { if (confirm('Forget all past soldiers?')) { SIM.clearArchive(); closeProfile(); renderTitle(); } };
  }

  // ── Profile (Soldbuch) ──
  function openProfile() {
    lastPanel = null;
    const s = S, c = s.char;
    const said = Object.values(s.statements || {}).filter(st => st.t);
    const shown = SIM.displayMedals(s);
    const chaptersDone = Object.keys(s.reviews).map(Number).map(i => `Chapter ${SIM.CHAPTERS[i].num}: ${SIM.CHAPTERS[i].title} (${SIM.CHAPTERS[i].range})`);
    $('#profile-body').innerHTML = `
      <div class="kicker">Soldbuch · Paybook</div>
      <h2>${esc(c.first)} ${esc(c.last)}</h2>
      <p class="profile-rank">${esc(rankName(s.rank))}</p>
      <div class="profile-grid">
        <div><span>Born</span><b>${c.birthYear}, ${esc(SIM.townName(c.hometown))}</b></div>
        <div><span>Unit</span><b>3rd Company, 2nd Battalion</b></div>
        <div><span>In service since</span><b>${esc(SIM.serviceStart(c))}</b></div>
        <div><span>Wounds</span><b>${s.wounds || 0}</b></div>
        <div><span>Assault days</span><b>${s.assaultDays.length}</b></div>
        <div><span>Reichsmarks</span><b>${s.marks} RM</b></div>
      </div>
      <h3>Decorations</h3>
      <div class="profile-ribbons">${ribbonBar(s)}</div>
      ${shown.length ? medalCards(shown.map(m => m.id), s) : '<p class="muted">None yet.</p>'}
      ${said.length ? `<h3>On record</h3><p class="small muted">What you have told your interrogators. They compare.</p><ul class="plain">${said.map(st => `<li><span class="d-date">${esc(st.date)}</span> ${esc(st.t)}</li>`).join('')}</ul>` : ''}
      <h3>Rank history</h3>
      <ul class="plain">${s.rankHistory.map(r => `<li><span class="d-date">${esc(r.date)}</span> ${esc(rankName(r.rank))}</li>`).join('')}</ul>
      <h3>Campaigns</h3>
      <ul class="plain">${chaptersDone.map(t => `<li>${esc(t)}</li>`).join('') || `<li>Chapter ${SIM.chapter(s).num}: ${esc(SIM.chapter(s).title)} (in progress)</li>`}</ul>
      <p class="small muted">Symbols of the regime have been left out of the medal artwork.</p>`;
    $('#profile').hidden = false;
    $('#btn-close-profile').focus();
  }
  function closeProfile() { $('#profile').hidden = true; }

  // ── Sidebar ──
  function level(st, v) { return st.bad ? (v >= 70 ? 'crit' : v >= 40 ? 'warn' : 'ok') : (v <= 20 ? 'crit' : v <= 40 ? 'warn' : 'ok'); }

  // A button to use a supply on yourself; disabled, with the reason, when it cannot be used.
  function useButton(k) {
    const u = SIM.SUPPLY_USE[k];
    if (!u) return '';
    const why = S.stage !== 'event' ? 'Only during the chapter.' : SIM.supplyBlock(S, k);
    return `<button class="use-btn" data-use="${k}"${why ? ` disabled title="${esc(why)}"` : ''}>${esc(u.verb)}</button>${why ? `<span class="use-why">${esc(why)}</span>` : ''}`;
  }
  function itemButton(id) {
    const u = SIM.ITEM_USE[id];
    if (!u) return '';
    const why = S.stage !== 'event' ? 'Only during the chapter.' : SIM.itemBlock(S, id);
    return `<button class="use-btn" data-item="${id}"${why ? ` disabled title="${esc(why)}"` : ''}>${esc(u.verb)}</button>`;
  }
  function toast(text) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = text; t.classList.add('on');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('on'), 3200);
  }
  function afterUse(text) {
    if (!text) return;
    SIM.save(S); renderSidebar(); renderTab();
    if (!$('#profile').hidden && lastPanel) $('#profile-body').innerHTML = panelHTML(lastPanel);
    toast(text);
  }
  let lastPanel = null;

  function renderSidebar() {
    const c = S.char;
    $('#char-name').textContent = `${c.first} ${c.last}`;
    $('#char-rank').textContent = rankName(S.rank);
    $('#char-unit').textContent = `3rd Coy, 2nd Bn · born ${c.birthYear}, ${SIM.townName(c.hometown)}`;
    $('#char-ribbons').innerHTML = ribbonBar(S);
    $('#stats').innerHTML = SIM.visibleStats(S).map(k => {
      const st = SIM.STATS[k], v = S.stats[k];
      return `<div class="stat" title="${esc(st.desc)}"><div class="stat-head"><span>${st.label}</span><span>${v}</span></div>
        <div class="bar"><div class="fill ${level(st, v)} ${st.bad ? 'bad' : ''}" style="width:${v}%"></div></div></div>`;
    }).join('') + `<div class="stat money"><span>Reichsmarks</span><span>${S.marks} RM</span></div>` + (SIM.hasSupplies && SIM.hasSupplies(S) ? `<div class="supplies"><div class="kicker small">Squad supplies</div>${Object.keys(SIM.SUPPLY).map(k => { const v = S.supplies[k]; return `<div class="stat" title="${esc(SIM.SUPPLY[k].desc)}"><div class="stat-head"><span>${SIM.SUPPLY[k].name}</span><span>${v} / ${SIM.SUPPLY_MAX}</span></div><div class="bar"><div class="fill ${v <= 2 ? 'crit' : v <= 4 ? 'warn' : 'ok'}" style="width:${100 * v / SIM.SUPPLY_MAX}%"></div></div>${useButton(k)}</div>`; }).join('')}</div>` : '');
    $('#map').innerHTML = SIM.mapSVG(S);
    const ch = SIM.chapter(S);
    $('#map-title').textContent = `Chapter ${ch.num} · ${SIM.chv(S, 'range')}`;
    const log = S.log.filter(l => (l.chapter || 0) === (S.chapter || 0));
    $('#diary').innerHTML = log.length ? log.slice().reverse().map(l => `<li><span class="d-date">${esc(l.date)}</span> ${esc(l.text)}</li>`).join('') : '<li class="muted">Nothing yet.</li>';
    $('#days').innerHTML = SIM.days(S).map((d, i) => `<span class="day ${i < S.day ? 'past' : i === S.day ? 'now' : ''}">${esc(d.short.split(' ')[1])}</span>`).join('');
    $('#mini-stats').innerHTML = `<span class="mini rank">${esc(SIM.rankTitle(S))}</span>` + SIM.visibleStats(S).map(k => {
      const st = SIM.STATS[k], v = S.stats[k];
      return `<span class="mini ${level(st, v)}" title="${esc(st.label)}">${st.short} <b>${v}</b></span>`;
    }).join('') + `<span class="mini">RM <b>${S.marks}</b></span>` + (SIM.hasSupplies && SIM.hasSupplies(S) ? Object.keys(SIM.SUPPLY).map(k => `<span class="mini ${S.supplies[k] <= 2 ? 'crit' : S.supplies[k] <= 4 ? 'warn' : 'ok'}">${SIM.SUPPLY[k].short} <b>${S.supplies[k]}</b></span>`).join('') : '') + `<button class="mini link" id="mini-profile">Soldbuch ›</button>`;
    $('#mini-profile').onclick = openProfile;
    renderTab();
  }

  // ── Events ──
  function header(ev) {
    const d = SIM.today(S);
    const place = SIM.place(S, ev.place || SIM.dayPlace(S, d)).name;
    $('#ev-date').textContent = `${d.date} · ${ev.time || SIM.PHASE_TIME[S.phase]}${d.temp !== undefined ? ` · ${d.temp < 0 ? '−' : ''}${Math.abs(d.temp)} °C` : ''}`;
    $('#ev-place').textContent = place;
    const variant = d.variant || SIM.chapter(S).sceneVariant;
    $('#banner').innerHTML = SIM.sceneSVG(ev.scene, S.phase, (S.day + 1) * 13 + S.phase * 5 + ev.id.length + S.chapter * 31, variant);
    $('#banner').classList.toggle('painted', !!SIM.sceneImage(ev.scene, S.phase, variant));
  }

  function choiceButtons(ev, box, onPick) {
    box.hidden = false;
    box.innerHTML = '';
    ev.choices.filter(ch => SIM.choiceVisible(S, ch)).forEach((ch, i) => {
      const ok = SIM.choiceAllowed(S, ch);
      const b = document.createElement('button');
      b.className = 'choice';
      b.disabled = !ok;
      b.innerHTML = `<span class="ch-num">${i + 1}</span><span class="ch-text">${esc(SIM.fmt(S, ch.text))}${!ok && ch.reqText ? `<small>${esc(ch.reqText)}</small>` : ''}${ch.risk ? '<small class="risky">Dangerous</small>' : ''}</span>`;
      b.onclick = () => ch.assign ? pickMan(ev, box, ch, onPick) : onPick(ch);
      box.appendChild(b);
    });
  }

  // Choose which man of your squad carries out an order.
  function pickMan(ev, box, ch, onPick) {
    const men = SIM.squadMen(S).filter(m => typeof ch.assign !== 'function' || ch.assign(m));
    box.innerHTML = `<div class="assign-head">${esc(ch.assignPrompt || 'Who do you send?')}</div>`;
    men.forEach((m, i) => {
      const b = document.createElement('button');
      b.className = 'choice man-choice';
      b.innerHTML = `<span class="ch-num">${i + 1}</span>${avatar(m.id, m.name, 'small')}<span class="ch-text"><b>${esc(m.name)}</b>${S.flags.deputy === m.id ? ' <span class="deputy">deputy</span>' : ''}
        <small>${esc(m.role)} · ${m.traits.map(t => esc(t)).join(', ')}</small>
        <span class="man-bars">${miniBar('Morale', m.morale)}${miniBar('Loyalty', m.loyalty)}</span></span>`;
      b.onclick = () => onPick(ch, m);
      box.appendChild(b);
    });
    const back = document.createElement('button');
    back.className = 'btn small';
    back.textContent = 'Back';
    back.onclick = () => choiceButtons(ev, box, onPick);
    box.appendChild(back);
  }
  const miniBar = (label, v) => `<span class="mbar"><span>${label}</span><span class="bar"><span class="fill ${v <= 30 ? 'crit' : v <= 50 ? 'warn' : 'ok'}" style="width:${v}%"></span></span></span>`;

  // ── Character panels: comrades, squad, kit, skills ──
  function relBar(v) {
    const left = v < 0 ? 50 + v / 2 : 50, width = Math.abs(v) / 2;
    return `<span class="relbar"><span class="mid"></span><span class="relfill ${v < 0 ? 'neg' : 'pos'}" style="left:${left}%;width:${width}%"></span></span>`;
  }
  const initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2);
  const avatar = (id, name, cls = '') => (SIM.PORTRAITS || []).includes(id)
    ? `<img class="avatar portrait ${cls}" src="assets/portraits/${SIM.portraitFile(S, id)}.webp" alt="" loading="lazy">`
    : `<span class="avatar ${cls}">${esc(initials(name))}</span>`;
  function panelHTML(name) {
    if (name === 'comrades') {
      const people = SIM.knownPeople(S);
      const card = id => {
        const p = SIM.PEOPLE[id], v = SIM.rel(S, id);
        return `<div class="person">${avatar(id, p.name)}<div class="person-info">
          <div class="person-top"><b>${esc(p.name)}</b><span class="rel-label ${v < -15 ? 'neg' : v >= 15 ? 'pos' : ''}">${SIM.relLabel(v)}</span></div>
          ${relBar(v)}<span class="small muted">${esc(SIM.personStatus(S, id) || (S.flags.joinedSS && p.roleSS) || p.role)}</span></div></div>`;
      };
      const groups = SIM.PEOPLE_GROUPS.concat({ id: 'other', name: 'Others' });
      return `<div class="kicker">Comrades &amp; people</div>` + groups.map(g => {
        const ids = people.filter(id => SIM.personGroup(S, id) === g.id);
        return ids.length ? `<h4 class="people-group">${esc(typeof g.name === 'function' ? g.name(S) : g.name)}</h4>${ids.map(card).join('')}` : '';
      }).join('');
    }
    if (name === 'squad') {
      if (!S.squad) return `<div class="kicker">Squad</div><p class="muted small">You do not command any men yet. That may change.</p>`;
      const plt = SIM.platoonActive && SIM.platoonActive(S);
      const brig = S.flags.brigadier && S.brigade && SIM.track(S) === 'camp' ? `<div class="kicker">Your work brigade</div><div class="item"><div class="person-top"><b>${S.brigade.men} men</b><span>Brigadier</span></div>${miniBar('Morale', S.brigade.morale)}<span class="small muted">You answer for the norm, the bread and the count. They answer to you.</span></div>` : '';
      return brig + (plt ? platoonHTML() : '') + `<div class="kicker">Your squad</div>
        <div class="squad-sum">${miniBar('Morale', SIM.squadMorale(S))}${miniBar('Loyalty', SIM.squadLoyalty(S))}</div>` +
        S.squad.map(m => `<div class="person ${m.status !== 'ok' ? 'gone' : ''}">${avatar(m.id, m.name)}<div class="person-info">
          <div class="person-top"><b>${esc(m.name)}</b>${S.flags.deputy === m.id ? '<span class="deputy">deputy</span>' : ''}</div>
          <span class="small muted">${esc(m.role)}, ${m.age}${m.status !== 'ok' ? ' · ' + esc(m.fate || m.status) : ''}</span>
          <div class="traits">${m.traits.map(t => `<span class="trait" title="${esc(SIM.TRAITS[t] || '')}">${esc(t)}</span>`).join('')}</div>
          ${miniBar('Morale', m.morale)}${miniBar('Loyalty', m.loyalty)}
          ${m.bio ? `<span class="small muted">${esc(m.bio)}</span>` : ''}${plt && m.status === 'ok' ? manActions(m) : ''}</div></div>`).join('');
    }
    if (name === 'kit') {
      const ids = Object.keys(S.items || {}).filter(id => S.items[id] > 0);
      const sup = SIM.hasSupplies(S) ? `<div class="kicker">Squad supplies</div>` + Object.keys(SIM.SUPPLY).map(k => `<div class="item"><div class="person-top"><b>${esc(SIM.SUPPLY[k].name)}</b><span>${S.supplies[k]} / ${SIM.SUPPLY_MAX}</span></div><span class="small muted">${esc(SIM.SUPPLY[k].desc)}</span>${useButton(k)}</div>`).join('') : '';
      return sup + `<div class="kicker">Kit</div><p class="small muted">Reichsmarks: <b>${S.marks} RM</b></p>` + (ids.length ? ids.map(id => {
        const it = SIM.ITEMS[id];
        return `<div class="item"><div class="person-top"><b>${esc(it.name)}</b><span>${S.items[id] > 1 || it.unit ? '× ' + S.items[id] : ''}</span></div>
          <span class="small muted">${esc(it.desc)}${it.value ? ` Worth about ${it.value} RM.` : ''}</span>${itemButton(id)}</div>`;
      }).join('') : '<p class="muted small">Nothing but what the army issued.</p>');
    }
    if (name === 'skills') {
      return `<div class="kicker">Skills</div><p class="small muted">Skills grow with use and open up new choices.</p>` + Object.keys(SIM.SKILLS).map(k => {
        const lv = SIM.skill(S, k);
        return `<div class="item"><div class="person-top"><b>${esc(SIM.SKILLS[k].name)}</b><span class="pips">${[1, 2, 3, 4, 5].map(i => `<span class="pip ${i <= lv ? 'on' : ''}"></span>`).join('')}</span></div>
          <span class="small muted">${esc(SIM.SKILLS[k].desc)}</span></div>`;
      }).join('');
    }
    return '';
  }
  // ── The platoon (Chapter VIII) ──
  function pltButton(kind, a, b, label) {
    const why = SIM.platoonBlock(S, kind, a);
    return `<span class="plt-btn"><button class="use-btn" data-plt="${kind}" data-a="${a}" data-b="${b || ''}"${why ? ` disabled title="${esc(why)}"` : ''}>${esc(label)}</button>${why ? `<span class="use-why">${esc(why)}</span>` : ''}</span>`;
  }
  function manActions(m) {
    const q = S.platoon.squads;
    return `<div class="plt-actions">${['dorn', 'saal'].map(id => pltButton('give', m.id, id, `To ${q[id].alive ? q[id].short : (id === 'dorn' ? '2nd' : '3rd') + ' squad'}`)).join('')}${pltButton('recommend', m.id, '', 'Recommend for promotion')}</div>`;
  }
  function platoonHTML() {
    const p = S.platoon;
    const left = 2 - p.recs;
    return `<div class="kicker">Your platoon</div><p class="small muted">You command three squads. In battle you give the orders; your squad leaders carry them out in their own way. Recommendations left this summer: ${left}.</p>` +
      ['dorn', 'saal'].map((id, i) => { const q = p.squads[id]; const v = SIM.rel(S, id);
        return `<div class="person">${q.alive ? avatar(id, q.name) : avatar(id + '_x', (i ? '3rd' : '2nd') + ' squad')}<div class="person-info">
          <div class="person-top"><b>${q.alive ? esc(q.name) : `${i ? '3rd' : '2nd'} squad`}</b>${q.alive ? `<span class="rel-label ${v < -15 ? 'neg' : v >= 15 ? 'pos' : ''}">${SIM.relLabel(v)}</span>` : '<span class="rel-label neg">leader killed</span>'}</div>
          <span class="small muted">${i ? '3rd' : '2nd'} squad · ${q.strength} men · ${esc(SIM.PLATOON_TRAITS[q.trait])}</span>
          ${miniBar('Morale', q.morale)}${miniBar('Ammunition', Math.round(100 * q.ammo / 12))}
          <div class="plt-actions">${pltButton('take', id, '', 'Take a man into your squad')}${q.alive ? pltButton('recommend', id, '', 'Recommend him for the Iron Cross') : ''}</div></div></div>`; }).join('');
  }

  let activeTab = 'status';
  function renderTab() {
    document.querySelectorAll('#tabs .tab').forEach(t => t.classList.toggle('on', t.dataset.tab === activeTab));
    $('#tab-status').hidden = activeTab !== 'status';
    $('#tab-panel').hidden = activeTab === 'status';
    if (activeTab !== 'status') $('#tab-panel').innerHTML = panelHTML(activeTab);
  }
  function openPanel(name) {
    if (name === 'profile') return openProfile();
    lastPanel = name;
    $('#profile-body').innerHTML = panelHTML(name);
    $('#profile').hidden = false;
    $('#btn-close-profile').focus();
  }

  // Portraits of the people in a scene. The one named in the title is shown larger.
  function castHTML(list) {
    if (!list.length) return '';
    const fig = c => `<figure class="cast-p${c.featured ? ' featured' : ''}${c.alive ? '' : ' gone'}"><img src="assets/portraits/${SIM.portraitFile(S, c.id)}.webp" alt="" loading="lazy"><figcaption>${esc(c.name)}</figcaption></figure>`;
    const main = list.find(c => c.featured), rest = list.filter(c => c !== main);
    return `${rest.length ? `<div class="cast">${rest.map(fig).join('')}</div>` : ''}${main ? fig(main) : ''}`;
  }

  function renderEvent(ev) {
    current = ev;
    S.current = ev.id;
    S.stage = 'event';
    SIM.save(S);
    show('game');
    renderSidebar();
    header(ev);
    $('#notes').innerHTML = (S.notes || []).map(n => `<div class="note">${esc(n)}</div>`).join('');
    $('#ev-title').textContent = ev.title;
    const evText = SIM.fmt(S, ev.text);
    current.cast = SIM.castIn(S, evText, ev.title);
    $('#ev-cast').innerHTML = '';
    $('#ev-text').innerHTML = castHTML(current.cast) + paras(evText);
    $('#result').hidden = true;
    choiceButtons(ev, $('#choices'), choose);
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
  const extraChips = list => (list || []).map(e => `<span class="chip ${e.good ? 'good' : 'bad'} ${e.kind || ''}">${esc(e.label)}</span>`).join('');

  function resultHTML(ch, out, btnLabel, btnId = 'btn-next') {
    const awards = (out.awards || []).length ? `<div class="award-box"><div class="kicker">Awarded</div>${medalCards(out.awards, S)}</div>` : '';
    const said = SIM.fmt(S, ch.text);
    // People who appear only in the outcome (a man hit, a visitor): show them too, the dead in grey.
    const shown = ((current && current.cast) || []).map(c => c.id);
    const extra = SIM.castIn(S, out.texts.join('\n'), '', { allowDead: true, max: 3 }).filter(c => !shown.includes(c.id)).map(c => Object.assign(c, { featured: false }));
    return `${castHTML(extra)}<div class="chosen">${/^["“]/.test(said) ? esc(said) : `“${esc(said)}”`}</div>${paras(out.texts.join('\n\n'))}<div class="chips">${chips(out.deltas)}${extraChips(out.extra)}</div>${awards}<button class="btn primary" id="${btnId}">${btnLabel}</button>`;
  }

  function revealResult(r, btnId = 'btn-next') {
    $('#' + btnId).focus({ preventScroll: true });
    // On small screens the outcome appears below the fold; bring it into view.
    const top = r.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + top - 16, behavior: 'smooth' });
  }

  function choose(ch, man) {
    const ev = current;
    const out = SIM.resolveChoice(S, ev, ch, man);
    $('#choices').hidden = true;
    const r = $('#result');
    r.hidden = false;
    r.innerHTML = resultHTML(ch, out, 'Continue');
    renderSidebar();
    // Move on at once, so a save made while the result is on screen resumes at the next
    // event instead of replaying this one (and applying its effects twice).
    const next = SIM.step(S, ev, out);
    if (next.type === 'event') S.current = next.ev.id;
    SIM.save(S);
    $('#btn-next').onclick = () => {
      if (next.type === 'ending') renderEnding(next.id);
      else renderEvent(next.ev);
    };
    revealResult(r);
  }

  // ── Ending (final or end of chapter) ──
  function renderEnding(id) {
    const e = SIM.ENDINGS[id];
    const ch = SIM.chapter(S);
    S.current = null;
    SIM.save(S);
    const fun = id === 'kia' && SIM.funeralImage ? SIM.funeralImage(S) : null;
    $('#end-banner').hidden = !fun;
    $('#end-banner').innerHTML = fun ? `<img class="scene-img" src="${fun}" alt="">` : '';
    $('#end-kicker').textContent = e.final ? 'The End' : `End of Chapter ${ch.num}: ${ch.title}`;
    $('#end-title').textContent = e.title;
    $('#end-text').innerHTML = paras(SIM.fmt(S, e.text));
    const c = S.char;
    const rv = !e.final && S.reviews[S.chapter];
    const next = SIM.hasNextChapter(S) && SIM.CHAPTERS[S.chapter + 1];
    const review = rv ? `
      <div class="review">
        <div class="kicker">Promotion board · ${esc(ch.promoDate)}</div>
        <p class="review-rank">${rv.to > rv.from ? `${esc(rankName(rv.from))} <span class="arrow">→</span> <b>${esc(rankName(rv.to))}</b>` : `Remains ${esc(rankName(rv.from))}`}</p>
        <ul class="plain small">${rv.reasons.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        ${rv.awards.length ? `<div class="kicker" style="margin-top:1rem">Decorations</div>${medalCards(rv.awards, S)}` : ''}
      </div>` : '';
    $('#end-summary').innerHTML = `
      ${review}
      <h3>${esc(SIM.rankTitle(S))} ${esc(c.first)} ${esc(c.last)}, born ${c.birthYear}, ${esc(SIM.townName(c.hometown))}</h3>
      <div class="profile-ribbons">${ribbonBar(S)}</div>
      <div class="end-stats">${SIM.visibleStats(S).map(k => `<div><span>${SIM.STATS[k].label}</span><b>${S.stats[k]}</b></div>`).join('')}</div>
      <h3>Diary</h3>
      <ul class="diary">${S.log.map(l => `<li><span class="d-date">${esc(l.date)}</span> ${esc(l.text)}</li>`).join('') || '<li class="muted">You wrote nothing down.</li>'}</ul>
      ${!e.final && !next ? '<p class="next-chapter">The next chapter is not yet written. Your soldier will be waiting.</p>' : ''}`;
    $('#btn-again').hidden = false;
    $('#btn-again').textContent = e.final ? 'Play again' : 'New game';
    $('#btn-next-chapter').hidden = !next;
    if (next) $('#btn-next-chapter').textContent = `Continue to Chapter ${next.num}`;
    $('#btn-end-profile').hidden = false;
    show('ending');
  }

  // ── Interlude between chapters ──
  function renderInterlude() {
    if (S.stage !== 'interlude') SIM.enterInterlude(S);
    SIM.save(S);
    const ch = SIM.chapter(S);
    $('#interlude-kicker').textContent = `Before Chapter ${ch.num}`;
    $('#interlude-title').textContent = ch.interludeTitle;
    $('#interlude-body').innerHTML = timeline(ch.interlude(S));
    const r = $('#interlude-result');
    const begin = () => {
      const first = SIM.startChapter(S);
      renderEvent(first);
    };
    const ev = SIM.pendingInterlude(S)[0];
    if (!ev) {
      $('#interlude-choices').hidden = true;
      r.hidden = false;
      r.innerHTML = `<button class="btn primary" id="btn-inext">Begin Chapter ${ch.num}: ${esc(ch.title)}</button>`;
      $('#btn-inext').onclick = begin;
    } else {
      $('#interlude-ev-title').textContent = ev.title;
      const iText = SIM.fmt(S, ev.text);
      $('#interlude-ev-text').innerHTML = castHTML(SIM.castIn(S, iText, ev.title)) + paras(iText);
      r.hidden = true;
      choiceButtons(ev, $('#interlude-choices'), (chc, man) => {
        const out = SIM.resolveChoice(S, ev, chc, man);
        const more = SIM.pendingInterlude(S).length > 0;
        $('#interlude-choices').hidden = true;
        r.hidden = false;
        r.innerHTML = resultHTML(chc, out, more ? 'Continue' : `Begin Chapter ${ch.num}: ${esc(ch.title)}`, 'btn-inext');
        SIM.save(S);
        $('#btn-inext').onclick = () => {
          if (!more) return begin();
          renderInterlude();
          $('.interlude-event').scrollIntoView({ behavior: 'smooth' });
        };
        revealResult(r, 'btn-inext');
      });
    }
    show('interlude');
  }

  // ── Wiring ──
  function init() {
    $('#btn-new').onclick = () => {
      const saved = SIM.load();
      if (resumable(saved) && !confirm(`You have a saved game: ${saved.char.first} ${saved.char.last}, ${SIM.rankTitle(saved)}, Chapter ${SIM.CHAPTERS[saved.chapter || 0].num}.\n\nStarting a new soldier will erase it. Continue?`)) return;
      if (resumable(saved)) SIM.archive(saved, 'unfinished');
      draft.first = ''; renderCreate();
    };
    $('#btn-archive').onclick = openArchive;
    $('#btn-continue').onclick = () => {
      const saved = SIM.load();
      if (!resumable(saved)) return renderTitle();
      S = saved;
      if (S.stage === 'event') return renderEvent(SIM.findEvent(S.current));
      if (S.stage === 'interlude') return renderInterlude();
      return renderEnding(S.ending);
    };
    $('#btn-create').onclick = renderPrologue;
    $('#btn-back').onclick = renderTitle;
    $('#btn-start').onclick = () => { S.notes = []; renderEvent(SIM.pickEvent(S)); };
    $('#btn-again').onclick = () => {
      if (SIM.hasNextChapter(S) && !confirm('Start a new soldier? This one\'s story will be lost.')) return;
      SIM.clearSave(); renderTitle();
    };
    $('#btn-next-chapter').onclick = renderInterlude;
    $('#btn-end-profile').onclick = openProfile;
    $('#btn-interlude-profile').onclick = openProfile;
    $('#btn-quit').onclick = () => { if (confirm('Return to the title screen? Your progress is saved.')) renderTitle(); };
    $('#toggle-diary').onclick = () => { const d = $('#diary-wrap'); d.hidden = !d.hidden; };
    document.querySelectorAll('#tabs .tab').forEach(t => t.onclick = () => { activeTab = t.dataset.tab; renderTab(); });
    document.querySelectorAll('#bottom-nav button').forEach(b => b.onclick = () => openPanel(b.dataset.panel));
    $('#id-card').onclick = openProfile;
    $('#btn-close-profile').onclick = closeProfile;
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-use], [data-item], [data-plt]');
      if (!b || b.disabled || !S || S.stage !== 'event') return;
      if (b.dataset.plt) return afterUse(SIM.platoonDo(S, b.dataset.plt, b.dataset.a, b.dataset.b));
      afterUse(b.dataset.use ? SIM.useSupply(S, b.dataset.use) : SIM.useItem(S, b.dataset.item));
    });
    $('#profile').onclick = e => { if (e.target.id === 'profile') closeProfile(); };
    document.addEventListener('keydown', e => {
      if (!$('#profile').hidden) { if (e.key === 'Escape') closeProfile(); return; }
      const screen = !$('#game').hidden ? 'game' : !$('#interlude').hidden ? 'interlude' : null;
      if (!screen) return;
      const res = screen === 'game' ? $('#result') : $('#interlude-result');
      const box = screen === 'game' ? $('#choices') : $('#interlude-choices');
      const nextBtn = res.querySelector('.btn.primary');
      if (e.key === 'Enter' && !res.hidden && nextBtn) { e.preventDefault(); nextBtn.click(); return; }
      const n = parseInt(e.key, 10);
      if (n >= 1 && !box.hidden) {
        const btns = [...box.querySelectorAll('.choice')];
        if (btns[n - 1] && !btns[n - 1].disabled) btns[n - 1].click();
      }
    });
    renderTitle();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
