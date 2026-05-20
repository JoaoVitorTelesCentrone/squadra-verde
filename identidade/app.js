/* ════════════════════════════════════════════════
   SQUADRA VERDE — App data + interactivity
   ════════════════════════════════════════════════ */

// ── DADOS ─────────────────────────────────────────
const RANKINGS = {
  masc: [
    { p: 1, n: 'José Resende',          dupla: 'com R. Voso',         j: 8, v: 8, d: 0, pts: 800, pct: 100, saldo: '+11', form: 'WWWWWW' },
    { p: 2, n: 'Riccardo Voso',         dupla: 'com J. Resende',      j: 8, v: 8, d: 0, pts: 800, pct: 100, saldo: '+11', form: 'WWWWWW' },
    { p: 3, n: 'João Paulo Fiacadori',  dupla: 'com M. Centrone',     j: 7, v: 7, d: 0, pts: 700, pct: 100, saldo: '+10', form: 'WWWWWW' },
    { p: 4, n: 'Miguel Centrone',       dupla: 'com J. P. Fiacadori', j: 7, v: 6, d: 1, pts: 600, pct: 85.7, saldo: '+8', form: 'WWWLWW' },
    { p: 5, n: 'Felipe Cardoso',        dupla: 'com L. Machado',      j: 8, v: 6, d: 2, pts: 600, pct: 75.0, saldo: '+6', form: 'WLWWLW' },
    { p: 6, n: 'Rodrigo Vidal',         dupla: 'com J. Centrone',     j: 7, v: 5, d: 2, pts: 500, pct: 71.4, saldo: '+5', form: 'WWLWLW' },
    { p: 7, n: 'Ângelo De Carli',       dupla: 'com R. Reginini',     j: 7, v: 4, d: 3, pts: 400, pct: 57.1, saldo: '+2', form: 'LWWLLW' },
    { p: 8, n: 'Wagner Ruche',          dupla: 'com W. Klein',        j: 8, v: 4, d: 4, pts: 400, pct: 50.0, saldo: '0', form: 'WLWLWL' },
    { p: 9, n: 'Alessandro Cuche',      dupla: 'com W. Klein',        j: 7, v: 3, d: 4, pts: 300, pct: 42.9, saldo: '-2', form: 'LLWWLL' },
    { p: 10, n: 'Caio Rolim',           dupla: 'com F. Penna',        j: 7, v: 3, d: 4, pts: 300, pct: 42.9, saldo: '-3', form: 'LWLLLW' },
    { p: 11, n: 'José Recardo',         dupla: 'com B. Machado',      j: 8, v: 2, d: 6, pts: 200, pct: 25.0, saldo: '-6', form: 'LLLLLW' },
    { p: 12, n: 'Rafael Castano',       dupla: 'com R. Bambo',        j: 7, v: 2, d: 5, pts: 200, pct: 28.6, saldo: '-5', form: 'LLLWLL' },
  ],
  prata: [
    { p: 1, n: 'Mariana Centrone',      dupla: 'com L. Müsch',        j: 6, v: 5, d: 1, pts: 1.665, pct: 83.3, saldo: '+12', form: 'WWLWWW' },
    { p: 2, n: 'Larissa Müsch Niell',   dupla: 'com M. Centrone',     j: 6, v: 5, d: 1, pts: 1.665, pct: 83.3, saldo: '+7', form: 'WWWLWW' },
    { p: 3, n: 'Alessandra Sandrini',   dupla: 'com K. Schiavetti',   j: 6, v: 4, d: 2, pts: 1.110, pct: 66.7, saldo: '+5', form: 'WLWWLW' },
    { p: 4, n: 'Katia Schiavetti',      dupla: 'com A. Sandrini',     j: 6, v: 4, d: 2, pts: 1.110, pct: 66.7, saldo: '+4', form: 'WWLWLW' },
    { p: 5, n: 'Ana Carla Marella',     dupla: 'com B. Souza Correa', j: 6, v: 3, d: 3, pts: 555, pct: 50.0, saldo: '+1', form: 'WLWLWL' },
    { p: 6, n: 'Raphaela Frasinelli',   dupla: 'com C. Honorato',     j: 5, v: 3, d: 2, pts: 555, pct: 60.0, saldo: '+2', form: 'WWLWL' },
    { p: 7, n: 'Tatiane Andrade',       dupla: 'com F. Sttap',        j: 5, v: 2, d: 3, pts: 450, pct: 40.0, saldo: '-1', form: 'LWLLW' },
    { p: 8, n: 'Fernanda Sttap',        dupla: 'com T. Andrade',      j: 5, v: 2, d: 3, pts: 450, pct: 40.0, saldo: '-1', form: 'LWLLW' },
    { p: 9, n: 'Cristiana Mussa',       dupla: 'com J. Brunoli Lozi', j: 4, v: 1, d: 3, pts: 280, pct: 25.0, saldo: '-4', form: 'LWLL' },
  ],
  bronze: [
    { p: 1, n: 'Carolina Cherubini Silva Honorato', dupla: 'com R. Frasinelli',  j: 6, v: 3, d: 3, pts: 555, pct: 50.0, saldo: '0', form: 'WLWLWL' },
    { p: 2, n: 'Joana Oliveira',        dupla: 'com L. Pellegrino',   j: 6, v: 3, d: 3, pts: 555, pct: 50.0, saldo: '+2', form: 'WLWLWL' },
    { p: 3, n: 'Luciana Pellegrino',    dupla: 'com J. Oliveira',     j: 6, v: 3, d: 3, pts: 555, pct: 50.0, saldo: '0', form: 'LWLWLW' },
    { p: 4, n: 'Renata Coni Marraghin',  dupla: 'com S. Sukniewicz',   j: 6, v: 3, d: 3, pts: 555, pct: 50.0, saldo: '+1', form: 'WLLWLW' },
    { p: 5, n: 'Juliana Brunoli Lozi',  dupla: 'com C. Mussa',        j: 6, v: 2, d: 4, pts: 370, pct: 33.3, saldo: '-2', form: 'LWLLWL' },
    { p: 6, n: 'Tatiana Marra',         dupla: 'com J. Magalhães',    j: 5, v: 2, d: 3, pts: 370, pct: 40.0, saldo: '+1', form: 'WLLWL' },
    { p: 7, n: 'Juliana Magalhães',     dupla: 'com T. Marra',        j: 5, v: 2, d: 3, pts: 370, pct: 40.0, saldo: '-2', form: 'WLWLL' },
    { p: 8, n: 'Gabriella Niclos',      dupla: 'com H. Rodrigues',    j: 5, v: 1, d: 4, pts: 280, pct: 20.0, saldo: '-3', form: 'LWLLL' },
    { p: 9, n: 'Heller Rodrigues',      dupla: 'com G. Niclos',       j: 5, v: 0, d: 5, pts: 0,   pct: 0,    saldo: '-6', form: 'LLLLL' },
  ],
};

const MATCHES = [
  // Rodada 8 — ao vivo
  { round: 8, status: 'live', time: '17:00', cat: 'masc',  t1: ['Miguel Centrone','João Paulo Fiacadori'], t2: ['Wagner Ruche','William Klein'], sets: null, live: '6-3 / 4-4' },
  { round: 8, status: 'live', time: '17:00', cat: 'prata', t1: ['Mariana Centrone','Larissa Müsch'], t2: ['Alessandra Sandrini','Katia Schiavetti'], sets: null, live: '7-5 / 3-1' },
  { round: 8, status: 'agendado', time: '18:00', cat: 'bronze', t1: ['Joana Oliveira','Luciana Pellegrino'], t2: ['Carolina C. Honorato','Raphaela Frasinelli'], sets: null },
  { round: 8, status: 'agendado', time: '19:30', cat: 'masc',  t1: ['José Resende','Riccardo Voso'], t2: ['Ângelo De Carli','Renato Reginini'], sets: null },
  { round: 8, status: 'agendado', time: '20:00', cat: 'prata', t1: ['Ana Carla Marella','Bruna Souza Correa'], t2: ['Tatiane Andrade','Fernanda Sttap'], sets: null },
  { round: 8, status: 'agendado', time: '21:30', cat: 'masc',  t1: ['Felipe Cardoso','Lucas Machado'], t2: ['Rodrigo Vidal','João Centrone'], sets: null },
  // Rodada 7 — concluída
  { round: 7, status: 'done', time: '17:00', cat: 'masc',  t1: ['José Resende','Riccardo Voso'], t2: ['Felipe Cardoso','Lucas Machado'], sets: [[6,3],[6,2]], winner: 1 },
  { round: 7, status: 'done', time: '18:00', cat: 'prata', t1: ['Mariana Centrone','Larissa Müsch'], t2: ['Raphaela Frasinelli','C. Honorato'], sets: [[6,2],[6,4]], winner: 1 },
  { round: 7, status: 'done', time: '19:00', cat: 'masc',  t1: ['Miguel Centrone','J. P. Fiacadori'], t2: ['Ângelo De Carli','R. Reginini'], sets: [[7,5],[3,6],[6,4]], winner: 1 },
  { round: 7, status: 'done', time: '19:30', cat: 'bronze', t1: ['Joana Oliveira','Luciana Pellegrino'], t2: ['Tatiana Marra','Juliana Magalhães'], sets: [[4,6],[6,3],[6,2]], winner: 1 },
  { round: 7, status: 'done', time: '20:00', cat: 'masc',  t1: ['Caio Rolim','Felipe Penna'], t2: ['Alessandro Cuche','William Klein'], sets: [[3,6],[4,6]], winner: 2 },
  { round: 7, status: 'done', time: '21:00', cat: 'prata', t1: ['Alessandra Sandrini','K. Schiavetti'], t2: ['Ana C. Marella','Bruna S. Correa'], sets: [[6,3],[6,4]], winner: 1 },
];

const ATLETAS_FEATURED = [
  { num: '01', cat: 'masc', name: 'José Resende',         dupla: 'Resende / Voso',          v: 8,  pct: 100, saldo: '+11', fem: false },
  { num: '01', cat: 'prata', name: 'Mariana Centrone',    dupla: 'Centrone / Müsch',        v: 5,  pct: 83.3, saldo: '+12', fem: true },
  { num: '02', cat: 'masc', name: 'Riccardo Voso',         dupla: 'Voso / Resende',          v: 8,  pct: 100, saldo: '+11', fem: false },
  { num: '01', cat: 'bronze', name: 'Carolina Honorato',  dupla: 'Honorato / Frasinelli',   v: 3,  pct: 50.0, saldo: '0',   fem: true },
  { num: '03', cat: 'masc', name: 'João Paulo Fiacadori', dupla: 'Fiacadori / Centrone',    v: 7,  pct: 100, saldo: '+10', fem: false },
  { num: '02', cat: 'prata', name: 'Alessandra Sandrini', dupla: 'Sandrini / Schiavetti',   v: 4,  pct: 66.7, saldo: '+5',  fem: true },
  { num: '04', cat: 'masc', name: 'Miguel Centrone',      dupla: 'Centrone / Fiacadori',    v: 6,  pct: 85.7, saldo: '+8',  fem: false },
  { num: '02', cat: 'bronze', name: 'Joana Oliveira',     dupla: 'Oliveira / Pellegrino',   v: 3,  pct: 50.0, saldo: '+2',  fem: true },
];

// ── HELPERS ───────────────────────────────────────
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
const initials = (name) => {
  const parts = name.split(' ').filter(Boolean);
  return (parts[0]?.[0] || '') + (parts[parts.length-1]?.[0] || '');
};
const fmtPts = (v) => typeof v === 'number'
  ? (v >= 1000 ? v.toLocaleString('pt-BR') : v.toString())
  : v;

// ── THEME (Masc / Fem) ────────────────────────────
let currentTheme = 'masc';      // 'masc' | 'fem'
let currentCat   = 'masc';      // 'masc' | 'prata' | 'bronze'

function setTheme(t) {
  currentTheme = t;
  document.body.classList.toggle('theme-fem', t === 'fem');
  document.body.classList.toggle('theme-masc', t === 'masc');
  // refresh hero toggle states
  $$('.cat-toggle button').forEach(b => b.classList.toggle('on', b.dataset.theme === t));
  $$('.cat-pills button').forEach(b => {
    if (t === 'fem' && b.dataset.cat === 'masc') {
      // do nothing here; user explicitly clicks cat
    }
  });
}

function setCategory(cat) {
  currentCat = cat;
  // when switching from masc to fem (or v.v.) update theme
  setTheme(cat === 'masc' ? 'masc' : 'fem');
  $$('.cat-pills button').forEach(b => b.classList.toggle('on', b.dataset.cat === cat));
  renderRanking();
  renderFemBanner();
}

// ── ROUTING ───────────────────────────────────────
function navigate(page) {
  $$('.page').forEach(p => p.classList.toggle('active', p.dataset.page === page));
  $$('.nav-links button').forEach(b => b.classList.toggle('active', b.dataset.nav === page));
  window.scrollTo({ top: 0, behavior: 'instant' });
  window.location.hash = page;
}

// ── RENDER: home leaders ──────────────────────────
function renderHomeLeaders() {
  // top 3 from current view; on Home we show masc primary + feminino prata secondary
  const mascTop3 = RANKINGS.masc.slice(0, 3);
  const femTop3  = RANKINGS.prata.slice(0, 3);

  const renderTrio = (data, fem=false) => data.map(a => `
    <div class="leader rank-${a.p}" data-rank="${a.p}">
      <div class="leader-tag">
        <span class="badge">${a.p}</span>
        ${a.p === 1 ? 'LÍDER' : (a.p === 2 ? '2º LUGAR' : '3º LUGAR')}
      </div>
      <div class="leader-name">${a.n}</div>
      <div class="leader-stats">
        <div class="leader-stat"><div class="v">${a.pct.toString().replace('.0','')}%</div><div class="l">Aprov.</div></div>
        <div class="leader-stat"><div class="v">${a.saldo}</div><div class="l">Saldo</div></div>
        <div class="leader-stat"><div class="v">${a.v}/${a.j}</div><div class="l">V/J</div></div>
      </div>
    </div>
  `).join('');

  $('#leaders-masc').innerHTML = renderTrio(mascTop3, false);
  $('#leaders-fem').innerHTML  = renderTrio(femTop3, true);
}

// ── RENDER: home matches strip (próximos jogos) ───
function renderHomeMatches() {
  const live = MATCHES.filter(m => m.status === 'live').slice(0, 2);
  const next = MATCHES.filter(m => m.status === 'agendado').slice(0, 4);
  const arr = [...live, ...next];

  $('#home-matches').innerHTML = arr.map(m => renderMatch(m)).join('');
}

// ── RENDER: ranking page ──────────────────────────
function renderRanking() {
  const data = RANKINGS[currentCat] || [];
  const isFem = currentCat !== 'masc';

  const head = `
    <div class="rank-row head">
      <div>POS</div>
      <div>ATLETA · DUPLA</div>
      <div class="rank-hide-mobile" style="text-align:right;">J</div>
      <div class="rank-hide-mobile" style="text-align:right;">V</div>
      <div class="rank-hide-mobile" style="text-align:right;">D</div>
      <div style="text-align:right;">PTS</div>
      <div class="rank-hide-mobile" style="text-align:right;">FORMA</div>
    </div>
  `;

  const rows = data.map(a => `
    <div class="rank-row body" data-pos="${a.p}">
      <div class="rank-pos ${a.p === 1 ? 'tier-1' : ''}">${a.p}</div>
      <div class="athlete-cell">
        <div class="athlete-avatar">${initials(a.n)}</div>
        <div class="athlete-info">
          <div class="athlete-name">${a.n}</div>
          <div class="athlete-meta">${a.dupla} · ${a.pct.toString().replace('.0','')}% · ${a.saldo} G</div>
        </div>
      </div>
      <div class="rank-cell muted rank-hide-mobile">${a.j}</div>
      <div class="rank-cell rank-hide-mobile">${a.v}</div>
      <div class="rank-cell muted rank-hide-mobile">${a.d}</div>
      <div class="rank-cell pct">${fmtPts(a.pts)}</div>
      <div class="form-cell rank-hide-mobile">
        ${a.form.split('').map(c => `<div class="form-dot ${c.toLowerCase()}"></div>`).join('')}
      </div>
    </div>
  `).join('');

  $('#rank-table').innerHTML = head + rows;
}

// ── RENDER: feminino tier banner ──────────────────
function renderFemBanner() {
  const wrap = $('#fem-banner');
  if (!wrap) return;
  if (currentCat === 'masc') { wrap.style.display = 'none'; return; }
  wrap.style.display = '';

  const isPrata = currentCat === 'prata';
  const top = RANKINGS[currentCat][0];
  const total = RANKINGS[currentCat].length;
  const totalJogos = RANKINGS[currentCat].reduce((s,a) => s + a.j, 0);

  wrap.className = 'fem-tier-banner ' + (isPrata ? 'prata' : 'bronze');
  wrap.innerHTML = `
    <div class="medal">${isPrata ? 'P' : 'B'}</div>
    <div class="info">
      <div class="t">Categoria ${isPrata ? 'Prata' : 'Bronze'}</div>
      <div class="s">${total} atletas · líder atual: ${top.n.split(' ').slice(0,2).join(' ')}</div>
    </div>
    <div class="meta" style="display:flex; gap:24px;">
      <div><div class="v">${total}</div><div class="l">Atletas</div></div>
      <div><div class="v">${totalJogos}</div><div class="l">Jogos</div></div>
      <div><div class="v">${fmtPts(top.pts)}</div><div class="l">Pts líder</div></div>
    </div>
  `;
}

// ── RENDER: agenda page ───────────────────────────
function renderMatch(m) {
  const isLive = m.status === 'live';
  const isDone = m.status === 'done';

  let scoreHTML = '';
  if (isLive) {
    scoreHTML = `<div class="match-score"><div class="set win">${m.live}</div></div>`;
  } else if (isDone && m.sets) {
    scoreHTML = `<div class="match-score">` + m.sets.map((s,i) => `
      <div class="set ${s[0] > s[1] ? 'win' : 'lose'}">${s[0]}–${s[1]}</div>
    `).join('') + `</div>`;
  }

  const catLabel = m.cat === 'masc' ? 'M' : (m.cat === 'prata' ? 'PRATA' : 'BRONZE');
  const t1Win = isDone && m.winner === 1;
  const t2Win = isDone && m.winner === 2;

  return `
    <div class="match ${isLive ? 'live' : ''} ${isDone ? 'played' : ''}">
      <div class="match-meta">
        <div class="match-time">${isLive ? 'AO VIVO' : m.time}</div>
        <div class="match-cat ${m.cat}">${catLabel}</div>
      </div>
      <div class="match-pair">
        <div class="team ${t1Win ? 'win' : (t2Win ? 'lose' : '')}">
          <div class="team-line">${m.t1[0]}</div>
          <div class="team-line dim">${m.t1[1]}</div>
        </div>
        <div class="match-vs">VS</div>
        <div class="team right ${t2Win ? 'win' : (t1Win ? 'lose' : '')}">
          <div class="team-line">${m.t2[0]}</div>
          <div class="team-line dim">${m.t2[1]}</div>
        </div>
      </div>
      ${scoreHTML}
    </div>
  `;
}

function renderAgenda() {
  const rounds = [...new Set(MATCHES.map(m => m.round))].sort((a,b) => b - a);
  const out = rounds.map(r => {
    const ms = MATCHES.filter(m => m.round === r);
    const isLive = ms.some(m => m.status === 'live');
    const done   = ms.every(m => m.status === 'done');
    const statusTxt = isLive ? 'EM ANDAMENTO' : (done ? 'CONCLUÍDA' : 'PRÓXIMA');
    const statusCls = isLive ? 'live' : (done ? 'done' : '');

    return `
      <div class="round-header">
        <div class="tag">RODADA ${String(r).padStart(2,'0')}</div>
        <div class="status ${statusCls}">${statusTxt}</div>
        <div class="rule"></div>
        <div class="status">${ms.length} JOGOS</div>
      </div>
      <div class="matches">
        ${ms.map(renderMatch).join('')}
      </div>
    `;
  }).join('');
  $('#agenda-list').innerHTML = out;
}

// ── RENDER: atletas grid ──────────────────────────
function renderAtletas() {
  $('#atletas-grid').innerHTML = ATLETAS_FEATURED.map(a => `
    <div class="atleta-card ${a.fem ? 'fem' : ''}">
      <div class="cat-mark ${a.fem ? 'fem' : ''}">${a.cat === 'masc' ? 'MASCULINO' : (a.cat === 'prata' ? '★ PRATA' : '★ BRONZE')}</div>
      <div class="big-num">${a.num}</div>
      <div class="a-name">${a.name}</div>
      <div style="font-family:var(--font-mono); font-size:9.5px; letter-spacing:0.22em; text-transform:uppercase; color:color-mix(in oklch, var(--ink) 55%, transparent); margin-top:8px; position:relative; z-index:2;">${a.dupla}</div>
      <div class="a-stats">
        <div><div class="v">${a.v}</div><div class="l">Vitórias</div></div>
        <div><div class="v">${a.pct.toString().replace('.0','')}%</div><div class="l">Aprov.</div></div>
        <div><div class="v">${a.saldo}</div><div class="l">Saldo</div></div>
      </div>
    </div>
  `).join('');
}

// ── Search filter ─────────────────────────────────
function bindSearch() {
  const inp = $('#rank-search');
  if (!inp) return;
  inp.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    $$('#rank-table .rank-row.body').forEach(r => {
      const t = r.textContent.toLowerCase();
      r.style.display = t.includes(q) ? '' : 'none';
    });
  });
}

// ── Init ──────────────────────────────────────────
function init() {
  // nav clicks
  $$('.nav-links button, [data-go]').forEach(b => {
    b.addEventListener('click', () => navigate(b.dataset.nav || b.dataset.go));
  });

  // hero category toggle
  $$('.cat-toggle button').forEach(b => {
    b.addEventListener('click', () => {
      setTheme(b.dataset.theme);
    });
  });

  // ranking category pills
  $$('.cat-pills button').forEach(b => {
    b.addEventListener('click', () => setCategory(b.dataset.cat));
  });

  renderHomeLeaders();
  renderHomeMatches();
  renderRanking();
  renderFemBanner();
  renderAgenda();
  renderAtletas();
  bindSearch();

  // clock
  const tickClock = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    $('#clock').textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  tickClock();
  setInterval(tickClock, 30_000);

  // initial route
  const hash = window.location.hash.replace('#','') || 'home';
  navigate(hash);
}

window.addEventListener('DOMContentLoaded', init);
