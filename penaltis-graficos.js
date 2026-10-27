/**
 * penaltis-graficos.js — DataVirtual | Pênaltis FutVirtual
 * Seções do template "20 jogos" adaptadas aos pênaltis (sem HT, sem minutos fixos):
 *   Quadrantes · Ranking · Confrontos · Máximas · Renko · Gráfico de Mercados · Modo Trader
 *
 * Depende de: Chart.js 3.9, tabela-penaltis.js (window.PENALTIS) e de <div id="pgRoot"></div> na página.
 * Carregue DEPOIS do tabela-penaltis.js.
 */
(function () {
  'use strict';
  if (window.__PEN_GRAF__) return;
  window.__PEN_GRAF__ = true;

  const P = window.PENALTIS;
  if (!P) { console.error('[PEN-GRAF] carregue tabela-penaltis.js antes deste arquivo.'); return; }
  if (typeof Chart === 'undefined') { console.error('[PEN-GRAF] Chart.js não encontrado.'); return; }

  const CFG = P.CONFIG, MERC = P.MERCADOS, GRUPOS = P.GRUPOS;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LS = 'pg_';
  const ls = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(LS + k)); return v == null ? d : v; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (_) {} }
  };
  const liga = () => CFG.LIGAS.find(l => l.slug === P.prefs.liga) || CFG.LIGAS[0];
  const merc = id => MERC.find(m => m.id === id) || MERC[0];
  const hit = (id, g) => !!merc(id).test({ ga: g.ga, gb: g.gb, total: g.ga + g.gb });
  const optMercados = sel => GRUPOS.map(g => `<optgroup label="${esc(g.nome)}">${g.itens.map(m => `<option value="${m.id}"${m.id === sel ? ' selected' : ''}>${esc(m.label)}</option>`).join('')}</optgroup>`).join('');
  const avg = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const infoJogo = g => `${g.hh}:${g.mm} · ${g.a} ${g.ga}x${g.gb} ${g.b}`;
  const GRID = 'rgba(255,255,255,0.06)', TXT = '#9ca3af';
  const PALETA = ['#1fcc59', '#f87171', '#60a5fa', '#fbbf24', '#a78bfa', '#22d3ee', '#fb923c', '#f472b6', '#a3e635', '#e879f9'];

  // ═══════════════════════════════════════════════════════════════
  // DADOS (até 72h da liga atual, ordem cronológica)
  // ═══════════════════════════════════════════════════════════════
  const D = { slug: null, res: [] };
  const MODS = [];
  let carregando = false;

  async function carregar() {
    if (carregando) return;
    carregando = true;
    const l = liga();
    try {
      const url = `${CFG.API_BASE}/resultados/futpen/${encodeURIComponent(l.nome)}?horas=72&timestamp=${Date.now()}`;
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      if (l.slug !== liga().slug) return;
      D.slug = l.slug;
      D.res = (Array.isArray(j) ? j : []).map(P.normRes).filter(Boolean).sort((a, b) => a.ts - b.ts);
      notificar();
    } catch (e) { console.warn('[PEN-GRAF]', e.message); }
    finally { carregando = false; }
  }

  function grupos(res) {
    const m = new Map();
    for (const r of res) {
      const k = r.date + '|' + r.hh;
      if (!m.has(k)) m.set(k, { k, date: r.date, hh: r.hh, ts: r.ts, jogos: [] });
      m.get(k).jogos.push(r);
    }
    return [...m.values()];
  }
  function ultimasHoras(res, h) {
    if (!res.length) return [];
    const corte = res[res.length - 1].ts - h * 3600000;
    return res.filter(r => r.ts > corte);
  }

  const visivel = m => m.el && m.el.classList.contains('pg-open');
  function renderMod(m) { if (!visivel(m)) return; try { m.render(); } catch (e) { console.error('[PEN-GRAF] ' + m.id, e); } }
  function notificar() { MODS.forEach(renderMod); }

  // ═══════════════════════════════════════════════════════════════
  // CSS
  // ═══════════════════════════════════════════════════════════════
  (function css() {
    const s = document.createElement('style');
    s.id = 'pg-css';
    s.textContent = `
    .pg-closed{display:none!important}
    .pg-open{display:block!important;max-height:none!important;overflow:visible!important}
    .pg-body{padding:8px 6px;color:#d1d5db;font-size:12px}
    .pg-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px}
    .pg-row>label,.pg-sl label{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;font-weight:600}
    .pg-sl{display:flex;flex-direction:column;gap:3px;min-width:140px;flex:1}
    .pg-sl label b{color:#4D96FF;margin-left:6px}
    .pg-sl input[type=range]{width:100%;accent-color:#4D96FF}
    .pg-sel,.pg-in{background:#0e1320;color:#e5e7eb;border:1px solid #2a3347;border-radius:6px;padding:4px 8px;font-size:12px}
    .pg-in{width:58px;text-align:center}
    .pg-chk{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:#9ca3af;cursor:pointer;user-select:none}
    .pg-chk input{accent-color:#1fcc59}
    .pg-grp{display:inline-flex;gap:3px;flex-wrap:wrap}
    .pg-btn{background:#0e1320;color:#8b95a7;border:1px solid #2a3347;border-radius:4px;padding:3px 9px;font-size:10px;font-weight:600;cursor:pointer;letter-spacing:.3px}
    .pg-btn:hover{color:#e5e7eb;border-color:#3b4a66}
    .pg-btn.on{background:rgba(79,114,255,.18);color:#8ab4ff;border-color:#4f72ff}
    .pg-btn.g{color:#4ade80;border-color:#14532d;background:#0d2216}
    .pg-btn.y{color:#fbbf24;border-color:#5c4410;background:#241c08}
    .pg-btn.r{color:#f87171;border-color:#5c1a1a;background:#240d0d}
    .pg-chart{position:relative;width:100%;background:#0a0d16;border:1px solid #1c2436;border-radius:8px;overflow:hidden;margin-bottom:6px}
    .pg-msg{text-align:center;padding:16px;color:#6b7280}
    .pg-tbl-wrap{overflow-x:auto;border:1px solid #1c2436;border-radius:8px}
    .pg-tbl{border-collapse:collapse;width:100%;min-width:760px;font-size:12px}
    .pg-tbl th{background:#111827;color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:.4px;padding:8px 6px;white-space:nowrap}
    .pg-tbl td{padding:7px 6px;text-align:center;border-top:1px solid #1c2436;white-space:nowrap}
    .pg-tbl tbody tr:hover{background:rgba(79,114,255,.08)}
    .pg-tbl .tm{text-align:left;font-weight:700}
    .pg-bar{width:70px;height:6px;border-radius:9px;background:#2a3347;margin:0 auto 3px;overflow:hidden}.pg-bar i{display:block;height:100%}
    .pg-badge{display:inline-block;min-width:64px;padding:3px 8px;border-radius:99px;font-weight:700;font-size:10px}
    .pg-elite{background:rgba(30,201,127,.14);color:#8ff1c3;border:1px solid rgba(30,201,127,.35)}
    .pg-medio{background:rgba(240,184,75,.14);color:#ffd98a;border:1px solid rgba(240,184,75,.35)}
    .pg-fraco{background:rgba(239,91,91,.14);color:#ff9b9b;border:1px solid rgba(239,91,91,.35)}
    .fV{color:#1ec97f}.fD{color:#ef5b5b}
    .rk-eye{background:none;border:1px solid transparent;border-radius:5px;cursor:pointer;padding:2px 3px;margin-left:5px;opacity:.5}
    .rk-eye:hover,.rk-eye.on{opacity:1;border-color:rgba(62,207,163,.5);background:rgba(62,207,163,.1)}
    .pg-cards{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
    .pg-gc{flex:1 1 160px;min-width:150px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:8px 12px;cursor:pointer;text-align:center}
    .pg-gc:hover{border-color:rgba(255,255,255,.2)}.pg-gc.sel{border-color:#3b82f6;background:rgba(59,130,246,.1)}
    .pg-gc .t{font-size:11px;color:#6b7280;margin-bottom:3px}.pg-gc .n{font-size:12px;font-weight:600;color:#e5e7eb}.pg-gc .n span{color:#4b5563;font-size:10px}
    .pg-panel{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
    @media(max-width:760px){.pg-panel{grid-template-columns:1fr}}
    .pg-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px}
    .pg-card h5{margin:0 0 6px;font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:#6b7280}
    .pg-big{font-size:24px;font-weight:700;color:#f3f4f6;line-height:1}.pg-sub{font-size:10px;color:#6b7280;margin:2px 0 8px}
    .pg-mini{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:6px}
    .pg-mini div{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:6px;padding:4px 8px}
    .pg-mini small{display:block;font-size:9px;color:#6b7280}.pg-mini b{font-size:12px;color:#e5e7eb}
    .pg-forma{display:flex;gap:4px;margin-top:8px}.pg-forma span{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;background:rgba(255,255,255,.06)}
    .pg-pred{grid-column:1/-1;background:rgba(59,130,246,.05);border:1px solid rgba(59,130,246,.18);border-radius:10px;padding:10px 12px}
    .pg-predgrid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
    .pg-pi{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 9px;border-radius:6px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03)}
    .pg-pi.hi{border-color:rgba(34,197,94,.3);background:rgba(34,197,94,.07)}.pg-pi.md{border-color:rgba(245,158,11,.25);background:rgba(245,158,11,.06)}.pg-pi.lo{border-color:rgba(239,68,68,.15)}
    .pg-pi b{font-size:13px}.pg-pi.hi b{color:#22c55e}.pg-pi.md b{color:#f59e0b}.pg-pi.lo b{color:#ef4444}.pg-pi em{font-style:normal;font-size:10px;color:#fbbf24}
    .pg-blk{border:1px solid #1a2436;border-radius:10px;overflow:hidden;margin-bottom:10px;background:#0c121c}
    .pg-blk h5{margin:0;padding:8px 12px;background:#131a26;border-bottom:1px solid #1f2a3a;font-size:11px;color:#eaf1f9;text-transform:uppercase;letter-spacing:.6px}
    .pg-blk .sc{overflow-x:auto}.pg-blk table{border-collapse:collapse;min-width:max-content;width:100%}
    .pg-blk th{padding:7px 8px;font-size:9.5px;color:#6f88a8;background:#05080f;text-transform:uppercase;border-right:1px solid #131f2b;min-width:76px}
    .pg-blk td{padding:8px;text-align:center;font-weight:600;color:#7a9ac0;border-right:1px solid #131f2b;font-size:12.5px}
    .pg-blk td.al{color:#ff6b4a;background:#2a120c;box-shadow:inset 3px 0 0 #ff3d1a}.pg-blk td.px{color:#ffb300;background:#2a2005}
    .pg-blk td.hi{color:#4fc3f7;background:#0d1f2b}.pg-blk td.hm{color:#ff4d8f;background:#2a0d1c}
    .pg-chips{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-bottom:8px}
    .pg-chip{display:inline-flex;align-items:center;gap:6px;background:#0e1320;border:1px solid #2a3347;border-radius:16px;padding:3px 11px;font-size:11px;color:#9ca3af;cursor:pointer}
    .pg-chip.on{border-color:#1fcc59;color:#e5e7eb;background:rgba(31,204,89,.1)}.pg-chip i{font-style:normal;opacity:.6}.pg-chip i:hover{opacity:1}
    .pg-dot{width:9px;height:9px;border-radius:50%;display:inline-block}
    .pg-modal{display:none;background:#0f1420;border:1px solid #2a3347;border-radius:10px;padding:12px;margin-bottom:8px}
    .pg-modal .lst{max-height:250px;overflow-y:auto;margin:8px 0}
    .pg-modal .gt{font-size:10px;color:#6b7280;text-transform:uppercase;margin:6px 0 2px}
    .pg-mrow{display:flex;align-items:center;gap:8px;padding:2px 4px;font-size:12px}.pg-mrow span{flex:1}
    .pg-mrow input[type=color]{width:26px;height:20px;padding:0;border:none;background:none}
    .pg-rk-sum{display:flex;gap:4px;flex-wrap:wrap}.pg-pill{font-size:10px;padding:2px 8px;border-radius:3px;border:1px solid;font-weight:600}
    details.pg-det{margin-bottom:8px;background:#0e1320;border:1px solid #1c2436;border-radius:8px;padding:6px 10px}
    details.pg-det summary{cursor:pointer;font-size:11px;color:#9ca3af}
    `;
    document.head.appendChild(s);
  })();

  // ═══════════════════════════════════════════════════════════════
  // HELPERS UI / CHART
  // ═══════════════════════════════════════════════════════════════
  const root = $('pgRoot');
  function acordeao(id, titulo, html, render, onInit) {
    const it = document.createElement('div');
    it.className = 'accordion-item';
    const aberto = ls.get('open_' + id, false);
    it.innerHTML = `<button type="button" class="accordion-button" data-pg="${id}">▼ ${titulo} ▲</button><div class="accordion-content ${aberto ? 'pg-open' : 'pg-closed'}" id="pg_${id}"><div class="pg-body">${html}</div></div>`;
    root.appendChild(it);
    const m = { id, el: it.querySelector('.accordion-content'), render };
    MODS.push(m);
    if (onInit) onInit(m.el);
    if (aberto) renderMod(m);
    return m;
  }
  function grpHTML(id, opts, cur) {
    return `<div class="pg-grp" id="${id}">${opts.map(([v, l]) => `<button type="button" class="pg-btn${String(v) === String(cur) ? ' on' : ''}" data-v="${v}">${l}</button>`).join('')}</div>`;
  }
  function grpBind(id, fn) {
    const g = $(id); if (!g) return;
    g.addEventListener('click', e => {
      const b = e.target.closest('button[data-v]'); if (!b) return;
      g.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      fn(b.dataset.v);
    });
  }
  function grpSet(id, v) { const g = $(id); if (g) g.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.v === String(v))); }

  const CH = {};
  function draw(id, cfg) {
    const cv = $(id); if (!cv) return null;
    let c = CH[id];
    if (c && c.canvas !== cv) { c.destroy(); c = null; }
    if (c) { c.data = cfg.data; c.options = cfg.options; c.update('none'); }
    else c = CH[id] = new Chart(cv.getContext('2d'), cfg);
    return c;
  }
  function kill(id) { if (CH[id]) { CH[id].destroy(); delete CH[id]; } }

  // plugins compartilhados
  const plugAtual = {
    id: 'pgAtual',
    afterDraw(ch, _a, o) {
      if (!o || !o.on) return;
      const { ctx, chartArea: ca, scales } = ch, ys = scales.y;
      if (!ca || !ys) return;
      const it = [];
      ch.data.datasets.forEach((d, i) => {
        if (d._noLast || !ch.isDatasetVisible(i)) return;
        let v = null;
        for (let j = d.data.length - 1; j >= 0; j--) { const x = d.data[j]; if (x != null && isFinite(x)) { v = x; break; } }
        if (v == null) return;
        const y = ys.getPixelForValue(v);
        if (!isFinite(y) || y < ca.top || y > ca.bottom) return;
        it.push({ y, v, c: typeof d.borderColor === 'string' ? d.borderColor : '#fff' });
      });
      it.sort((a, b) => a.y - b.y);
      let prev = -99;
      ctx.save();
      for (const t of it) {
        ctx.strokeStyle = t.c; ctx.lineWidth = 1.1; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(ca.left, t.y); ctx.lineTo(ca.right, t.y); ctx.stroke(); ctx.setLineDash([]);
        const by = Math.max(t.y, prev + 17); prev = by;
        const txt = o.fmt ? o.fmt(t.v) : String(Math.round(t.v));
        ctx.font = 'bold 10px monospace'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        const w = Math.ceil(ctx.measureText(txt).width) + 10;
        ctx.fillStyle = 'rgba(9,11,18,.95)'; ctx.fillRect(ca.right + 3, by - 8, w, 16);
        ctx.strokeRect(ca.right + 3, by - 8, w, 16);
        ctx.fillStyle = t.c; ctx.fillText(txt, ca.right + 8, by);
      }
      ctx.restore();
    }
  };
  const plugFib = {
    id: 'pgFib',
    afterDraw(ch, _a, o) {
      if (!o || !o.on) return;
      const ys = ch.scales.y, ca = ch.chartArea; if (!ys || !ca) return;
      const ctx = ch.ctx;
      [0, 23.6, 38.2, 50, 61.8, 100].forEach(l => {
        const y = ys.getPixelForValue(ys.min + (l / 100) * (ys.max - ys.min));
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(0,255,120,.45)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ca.left, y); ctx.lineTo(ca.right, y); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(0,255,120,.85)'; ctx.font = '10px Arial'; ctx.textBaseline = 'bottom'; ctx.fillText(l + '%', ca.left + 4, y - 2);
        ctx.restore();
      });
    }
  };
  const plugRot = {
    id: 'pgRot',
    afterDatasetsDraw(ch, _a, o) {
      if (!o || !o.on) return;
      const { ctx, chartArea: ca } = ch;
      ch.data.datasets.forEach((d, i) => {
        if (d._noRot || !ch.isDatasetVisible(i)) return;
        const meta = ch.getDatasetMeta(i);
        ctx.save(); ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = typeof d.borderColor === 'string' ? d.borderColor : '#fff';
        meta.data.forEach((pt, j) => {
          const v = d.data[j];
          if (v == null || !isFinite(v) || !pt || pt.x < ca.left || pt.x > ca.right) return;
          ctx.fillText(String(Math.round(v)), pt.x, pt.y - 4);
        });
        ctx.restore();
      });
    }
  };
  Chart.register(plugAtual, plugFib, plugRot);
  const tipBase = { backgroundColor: 'rgba(10,12,20,.96)', borderColor: '#2a3347', borderWidth: 1, titleColor: '#e5e7eb', bodyColor: '#c8cdd8', padding: 9, cornerRadius: 6 };

  // ═══════════════════════════════════════════════════════════════
  // 1) QUADRANTES — gols por quadrante da hora (4 quadrantes por ordem de jogo)
  // ═══════════════════════════════════════════════════════════════
  const QD = { n: ls.get('qd_n', 16), lim: ls.get('qd_lim', null), fib: false, atual: true };

  function qdPontos() {
    const gs = grupos(D.res);
    if (gs.length > 1) gs.shift();                       // 1ª hora pode vir cortada
    const size = Math.ceil(liga().jogosHora / 4), pts = [];
    for (const g of gs) for (let q = 0; q < 4; q++) {
      const js = g.jogos.slice(q * size, (q + 1) * size);
      if (!js.length) continue;
      pts.push({ q: q + 1, hh: g.hh, date: g.date, n: js.length, gols: js.reduce((s, j) => s + j.ga + j.gb, 0) });
    }
    return pts;
  }
  function qdRender() {
    const pts = qdPontos(), vis = pts.slice(-QD.n);
    $('qdMsg').textContent = vis.length ? '' : 'Sem dados.';
    if (!vis.length) return;
    const gols = vis.map(p => p.gols);
    const lim = QD.lim != null ? QD.lim : Math.round(avg(gols) * 2) / 2;
    $('qdLV').textContent = lim; $('qdL').value = lim; $('qdNV').textContent = QD.n; $('qdN').value = QD.n;
    const size = Math.ceil(liga().jogosHora / 4), mn = Math.min(...gols), mx = Math.max(...gols), pad = Math.max(1, (mx - mn) * 0.1);
    draw('qdCanvas', {
      type: 'line',
      data: { labels: vis.map(p => `Q${p.q} ${p.hh}h`), datasets: [{ label: 'Gols por quadrante', data: gols, borderColor: '#4D96FF', backgroundColor: '#4D96FF', pointBackgroundColor: gols.map(v => (v >= lim ? '#2ecc71' : '#e74c3c')), pointBorderColor: 'rgba(0,0,0,.4)', borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, fill: false }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 20, right: 64 } },
        plugins: {
          legend: { display: false }, pgAtual: { on: QD.atual, fmt: v => Math.round(v) + ' gols' }, pgFib: { on: QD.fib },
          tooltip: { ...tipBase, callbacks: {
            title: it => { const p = vis[it[0].dataIndex]; return p ? `Q${p.q} · hora ${p.hh} (${p.date.slice(8, 10)}/${p.date.slice(5, 7)})` : ''; },
            label: c => `Gols: ${c.parsed.y}`,
            afterLabel: c => { const p = vis[c.dataIndex]; return p ? `${p.n}/${size} jogos | ${p.gols >= lim ? '▲' : '▼'} ${lim}` : ''; }
          } }
        },
        scales: { x: { ticks: { display: false }, grid: { display: false } }, y: { min: Math.max(0, Math.floor(mn - pad)), max: Math.ceil(mx + pad), ticks: { color: TXT, precision: 0 }, grid: { color: GRID } } }
      }
    });
  }
  acordeao('qd', 'Gráfico Quadrantes', `
    <div class="pg-chart" style="height:340px"><canvas id="qdCanvas"></canvas></div><div class="pg-msg" id="qdMsg"></div>
    <div class="pg-row">
      <div class="pg-sl"><label>Quadrantes <b id="qdNV">16</b></label><input type="range" id="qdN" min="4" max="120" step="1" value="16"></div>
      <div class="pg-sl"><label>Limite média <b id="qdLV">0</b></label><input type="range" id="qdL" min="0" max="120" step="0.5" value="0"></div>
      <label class="pg-chk"><input type="checkbox" id="qdFib"> Fibonacci</label>
      <label class="pg-chk"><input type="checkbox" id="qdAtual" checked> Linha atual</label>
    </div>`, qdRender, () => {
    $('qdN').addEventListener('input', e => { QD.n = +e.target.value; ls.set('qd_n', QD.n); qdRender(); });
    $('qdL').addEventListener('input', e => { QD.lim = +e.target.value; ls.set('qd_lim', QD.lim); qdRender(); });
    $('qdFib').addEventListener('change', e => { QD.fib = e.target.checked; qdRender(); });
    $('qdAtual').addEventListener('change', e => { QD.atual = e.target.checked; qdRender(); });
  });

  // ═══════════════════════════════════════════════════════════════
  // 2) RANKING — times por mercado
  // ═══════════════════════════════════════════════════════════════
  const RK = Object.assign({ mkt: 'over5.5', top: 10, sort: 'ocorrencias', min: 3, h: 24, modo: 'ambos' }, ls.get('rk', {}));
  const rkSave = () => ls.set('rk', RK);
  const lado = id => (/^casa/.test(id) ? 'a' : /^fora/.test(id) ? 'b' : 'ab');

  function rkRender() {
    const out = $('rkOut');
    const jogos = ultimasHoras(D.res, RK.h);
    if (!jogos.length) { out.innerHTML = '<div class="pg-msg">Sem dados.</div>'; return; }
    const ld = lado(RK.mkt), modo = ld === 'a' ? 'casa' : ld === 'b' ? 'fora' : RK.modo;
    const nw = () => ({ J: 0, oc: 0, gp: 0, gc: 0, pts: 0 });
    const T = {};
    const get = n => T[n] || (T[n] = { name: n, all: nw(), casa: nw(), fora: nw(), forma: [] });
    for (const g of jogos) {
      const ok = hit(RK.mkt, g), A = get(g.a), B = get(g.b);
      [[A, 'casa', g.ga, g.gb], [B, 'fora', g.gb, g.ga]].forEach(([t, ctx, gf, gs]) => {
        const cnt = ok && (ld === 'ab' || (ld === 'a' && ctx === 'casa') || (ld === 'b' && ctx === 'fora'));
        for (const k of ['all', ctx]) { const o = t[k]; o.J++; o.gp += gf; o.gc += gs; if (gf > gs) o.pts += 3; if (cnt) o.oc++; }
        t.forma.push(gf > gs ? 'V' : 'D'); if (t.forma.length > 5) t.forma.shift();
      });
    }
    let arr = Object.values(T).map(t => {
      const o = t[modo === 'ambos' ? 'all' : modo];
      return { name: t.name, J: o.J, oc: o.oc, pts: o.pts, gp: o.gp, gc: o.gc, sg: o.gp - o.gc, pct: o.J ? (o.oc / o.J) * 100 : 0, idx: o.J ? (o.gp + o.gc) / o.J : 0, forma: t.forma };
    }).filter(t => t.J >= RK.min);
    if (!arr.length) { out.innerHTML = `<div class="pg-msg">Nenhum time com ${RK.min}+ jogos nas últimas ${RK.h}h.</div>`; return; }
    const mxP = Math.max(...arr.map(t => t.pct), 1), mxI = Math.max(...arr.map(t => t.idx), 1);
    arr.forEach(t => { t.score = (t.pct / mxP) * 0.6 + (t.idx / mxI) * 0.4; });
    const rank = [...arr].sort((a, b) => b.score - a.score);
    const nq = Math.max(1, Math.floor(rank.length * 0.25));
    rank.forEach((t, i) => { t.st = i < nq ? ['🚀 Elite', 'elite'] : i >= rank.length - nq ? ['❌ Fraco', 'fraco'] : ['⚠ Médio', 'medio']; });
    if (RK.sort === 'percentual') arr.sort((a, b) => b.pct - a.pct || b.oc - a.oc);
    else if (RK.sort === 'indice') arr.sort((a, b) => b.idx - a.idx || b.pct - a.pct);
    else arr.sort((a, b) => b.oc - a.oc || b.pct - a.pct);
    arr = arr.slice(0, RK.top);
    const sel = P.Estado.timesSelecionados, cores = ['#b8962e', '#9ca3af', '#a0653a'];
    const ml = modo === 'casa' ? '🏠 Casa' : modo === 'fora' ? '✈ Fora' : 'Casa/Fora';
    out.innerHTML = `<div class="pg-tbl-wrap"><table class="pg-tbl"><thead><tr><th>#</th><th style="text-align:left">Equipe</th><th title="Pontos (V=3)">P</th><th>J (${ml})</th><th>GP</th><th>GC</th><th>SG</th><th>Ocorr.</th><th>% Merc.</th><th title="(GP+GC)/J">Índ. Ofensivo</th><th>Forma</th><th>Status</th></tr></thead><tbody>${arr.map((t, i) => {
      const bc = t.pct >= mxP * 0.75 ? '#1c8f60' : t.pct >= mxP * 0.5 ? '#2d9e76' : t.pct >= mxP * 0.25 ? '#a07c2a' : '#7a3535';
      const on = sel.includes(t.name);
      return `<tr><td style="font-weight:700;color:${cores[i] || '#4a5260'}">${i + 1}º</td><td class="tm">${esc(t.name)}<button type="button" class="rk-eye${on ? ' on' : ''}" data-t="${esc(t.name)}" title="Destacar na tabela">👁</button></td><td style="font-weight:700">${t.pts}</td><td>${t.J}</td><td style="color:#72b0ff">${t.gp}</td><td style="color:#ef5b5b">${t.gc}</td><td style="color:${t.sg > 0 ? '#1ec97f' : t.sg < 0 ? '#ef5b5b' : '#9fb0c5'}">${t.sg > 0 ? '+' : ''}${t.sg}</td><td style="color:#3ecfa3;font-weight:700">${t.oc}</td><td><div class="pg-bar"><i style="width:${((t.pct / mxP) * 100).toFixed(0)}%;background:${bc}"></i></div><b>${t.pct.toFixed(1)}%</b></td><td style="color:#b8a0ff;font-weight:700">${t.idx.toFixed(2)}</td><td>${t.forma.map(r => `<span class="f${r}">${r}</span>`).join('')}</td><td><span class="pg-badge pg-${t.st[1]}">${t.st[0]}</span></td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  acordeao('rk', 'Ranking Times', `
    <div class="pg-row"><label>Mercado</label><select id="rkMkt" class="pg-sel">${optMercados(RK.mkt)}</select>
      <label>Exibir</label><select id="rkTop" class="pg-sel"><option value="5">Top 5</option><option value="10">Top 10</option><option value="20">Top 20</option></select>
      <label>Ordenar</label><select id="rkSort" class="pg-sel"><option value="ocorrencias">Ocorrências</option><option value="percentual">Percentual (%)</option><option value="indice">Índice ofensivo</option></select>
      <div class="pg-sl"><label>Mín. jogos <b id="rkMinV">3</b></label><input type="range" id="rkMin" min="1" max="50" value="3"></div></div>
    <div class="pg-row"><label>Período</label>${grpHTML('rkH', [[6, '6h'], [12, '12h'], [24, '24h'], [48, '48h'], [72, '72h']], RK.h)}
      ${grpHTML('rkModo', [['ambos', 'Casa/Fora'], ['casa', '🏠 Casa'], ['fora', '✈ Fora']], RK.modo)}</div>
    <div id="rkOut"></div>`, rkRender, () => {
    $('rkTop').value = RK.top; $('rkSort').value = RK.sort; $('rkMin').value = RK.min; $('rkMinV').textContent = RK.min;
    $('rkMkt').addEventListener('change', e => { RK.mkt = e.target.value; rkSave(); rkRender(); });
    $('rkTop').addEventListener('change', e => { RK.top = +e.target.value; rkSave(); rkRender(); });
    $('rkSort').addEventListener('change', e => { RK.sort = e.target.value; rkSave(); rkRender(); });
    $('rkMin').addEventListener('input', e => { RK.min = +e.target.value; $('rkMinV').textContent = RK.min; rkSave(); rkRender(); });
    grpBind('rkH', v => { RK.h = +v; rkSave(); rkRender(); });
    grpBind('rkModo', v => { RK.modo = v; rkSave(); rkRender(); });
    $('rkOut').addEventListener('click', e => {
      const b = e.target.closest('.rk-eye'); if (!b) return;
      P.Estado.toggleSelecao('timesSelecionados', b.dataset.t);
      const sel = $('mostrarTimes');
      if (sel && sel.value !== 'sim') { sel.value = 'sim'; sel.dispatchEvent(new Event('change')); } else P.criarTabela();
      rkRender();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 3) CONFRONTOS — próximos jogos, forma dos times, H2H e previsão
  // ═══════════════════════════════════════════════════════════════
  const CF = { h: ls.get('cf_h', 24), sel: null, mA: 'ambos', mB: 'ambos' };
  const LINHAS = [4.5, 5.5, 6.5, 7.5];

  function cfProximos() {
    const tem = new Set(D.res.map(r => r.eventId)), lim = Date.now() - CFG.PROX_TOLERANCIA_MIN * 60000;
    return (P.C.prox || []).map(P.normProx).filter(Boolean).filter(p => !tem.has(p.eventId) && p.ts >= lim).sort((a, b) => a.ts - b.ts).slice(0, 6);
  }
  function tStats(jogos, team, modo) {
    let n = 0, w = 0, gf = 0, ga = 0, forma = []; const tots = [];
    for (const g of jogos) {
      const h = g.a === team, a = g.b === team;
      if (!h && !a) continue;
      if (modo === 'casa' && !h) continue;
      if (modo === 'fora' && !a) continue;
      const f = h ? g.ga : g.gb, c = h ? g.gb : g.ga;
      n++; gf += f; ga += c; if (f > c) w++; forma.push(f > c ? 'V' : 'D'); tots.push(g.ga + g.gb);
    }
    return { n, w, l: n - w, gf, ga, tots, forma: forma.slice(-5), apr: n ? (w / n) * 100 : 0, idx: n ? (gf + ga) / n : 0 };
  }
  function h2h(jogos, A, B) {
    const c = jogos.filter(g => (g.a === A && g.b === B) || (g.a === B && g.b === A));
    let wA = 0, wB = 0, tg = 0; const tots = [];
    for (const g of c) { const fa = g.a === A ? g.ga : g.gb, fb = g.a === A ? g.gb : g.ga; if (fa > fb) wA++; else wB++; tots.push(g.ga + g.gb); tg += g.ga + g.gb; }
    return { n: c.length, wA, wB, tots, media: c.length ? tg / c.length : 0 };
  }
  const shareOver = (tots, L) => (tots.length ? (tots.filter(t => t > L).length / tots.length) * 100 : null);

  function teamCard(titulo, st, side, modo) {
    const tabs = [['ambos', 'Casa/Fora'], ['casa', '🏠 Casa'], ['fora', '✈ Fora']].map(([v, l]) => `<button type="button" class="pg-btn${v === modo ? ' on' : ''}" data-side="${side}" data-v="${v}">${l}</button>`).join('');
    return `<div class="pg-card"><h5>${esc(titulo)}</h5><div class="pg-grp" style="margin-bottom:8px">${tabs}</div>
      <div class="pg-big">${st.apr.toFixed(1)}%</div><div class="pg-sub">aproveitamento · ${st.n} jogos</div>
      <div class="pg-mini"><div><small>Vitórias</small><b style="color:#22c55e">${st.w}</b></div><div><small>Derrotas</small><b style="color:#ef4444">${st.l}</b></div>
      <div><small>Gols pró</small><b>${st.gf}</b></div><div><small>Gols sofridos</small><b>${st.ga}</b></div>
      <div style="grid-column:1/-1"><small>Índice ofensivo (gols/jogo)</small><b style="color:#a78bfa">${st.idx.toFixed(2)}</b></div></div>
      <div class="pg-forma">${st.forma.map(r => `<span class="f${r}">${r}</span>`).join('')}</div></div>`;
  }

  function cfRender() {
    const prox = cfProximos(), box = $('cfGames'), panel = $('cfPanel');
    if (!prox.length) { box.innerHTML = '<div class="pg-msg" style="width:100%">Nenhum próximo jogo disponível no momento.</div>'; panel.innerHTML = ''; return; }
    if (!prox.some(p => p.eventId === CF.sel)) CF.sel = prox[0].eventId;
    box.innerHTML = prox.map(p => `<div class="pg-gc${p.eventId === CF.sel ? ' sel' : ''}" data-id="${esc(p.eventId)}"><div class="t">${p.hh}:${p.mm}</div><div class="n">${esc(p.a)} <span>vs</span> ${esc(p.b)}</div></div>`).join('');
    const g = prox.find(p => p.eventId === CF.sel), A = g.a, B = g.b;
    const jogos = ultimasHoras(D.res, CF.h);
    const sA = tStats(jogos, A, CF.mA), sB = tStats(jogos, B, CF.mB), H = h2h(jogos, A, B);
    const odds = (P.C.odds || []).find(o => o.match_id === g.eventId) || null;

    const rawA = H.n ? sA.apr * 0.6 + (H.wA / H.n) * 100 * 0.4 : sA.apr, rawB = H.n ? sB.apr * 0.6 + (H.wB / H.n) * 100 * 0.4 : sB.apr;
    const s = rawA + rawB || 1, pCasa = Math.round((rawA / s) * 100), pFora = 100 - pCasa;
    const xg = (sA.n && sB.n) ? ((sA.gf / sA.n + sB.ga / sB.n) / 2 + (sB.gf / sB.n + sA.ga / sA.n) / 2) : 0;
    const itens = [[`🏠 ${A} vence`, pCasa, 'casaVence'], [`✈ ${B} vence`, pFora, 'foraVence']];
    for (const L of LINHAS) {
      const parts = [shareOver(sA.tots, L), shareOver(sB.tots, L)].filter(v => v != null);
      if (H.n >= 3) parts.push(shareOver(H.tots, L));
      const p = parts.length ? Math.round(avg(parts)) : 0;
      itens.push([`Over ${L}`, p, 'over' + L], [`Under ${L}`, 100 - p, 'under' + L]);
    }
    const cls = p => (p >= 60 ? 'hi' : p >= 40 ? 'md' : 'lo');
    const od = id => { const v = P.getOddValue(odds, id); return v === 'N/A' ? '' : `<em>@${v}</em>`; };
    panel.innerHTML = `<div class="pg-panel">
      ${teamCard(A + ' — casa', sA, 'A', CF.mA)}
      <div class="pg-card"><h5>H2H · ${H.n} jogos</h5>
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px"><span><b>${H.wA}</b> ${esc(A)}</span><span style="text-align:right"><b>${H.wB}</b> ${esc(B)}</span></div>
        <div style="display:flex;height:5px;border-radius:4px;overflow:hidden;margin-bottom:10px"><div style="flex:${H.wA || 0.1};background:#3b82f6"></div><div style="flex:${H.wB || 0.1};background:#ef4444"></div></div>
        <div class="pg-big" style="text-align:center">${H.media.toFixed(2)}</div><div class="pg-sub" style="text-align:center">média de gols/disputa</div>
        ${LINHAS.map(L => { const o = H.tots.filter(t => t > L).length; return `<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid rgba(255,255,255,.06)"><span style="color:#9ca3af">Over / Under ${L}</span><span><b style="color:#22c55e">O ${o}</b> · <b style="color:#9ca3af">U ${H.n - o}</b></span></div>`; }).join('')}
      </div>
      ${teamCard(B + ' — fora', sB, 'B', CF.mB)}
      <div class="pg-pred"><h5 style="margin:0 0 6px;color:#60a5fa">👉 Leitura do confronto · gols esperados ${xg ? xg.toFixed(1) : '--'}${odds ? '' : ''}</h5>
        <div class="pg-predgrid">${itens.map(([l, p, id]) => `<div class="pg-pi ${cls(p)}"><span>${esc(l)} ${od(id)}</span><b>${p}%</b></div>`).join('')}</div></div>
    </div>`;
  }
  acordeao('cf', 'Ver Confrontos', `<div class="pg-row"><label>Período</label>${grpHTML('cfH', [[6, '6h'], [12, '12h'], [24, '24h'], [48, '48h'], [72, '72h']], CF.h)}</div>
    <div id="cfGames" class="pg-cards"></div><div id="cfPanel"></div>`, cfRender, () => {
    grpBind('cfH', v => { CF.h = +v; ls.set('cf_h', CF.h); cfRender(); });
    $('cfGames').addEventListener('click', e => { const c = e.target.closest('.pg-gc'); if (!c) return; CF.sel = c.dataset.id; CF.mA = 'ambos'; CF.mB = 'ambos'; cfRender(); });
    $('cfPanel').addEventListener('click', e => {
      const b = e.target.closest('button[data-side]'); if (!b) return;
      if (b.dataset.side === 'A') CF.mA = b.dataset.v; else CF.mB = b.dataset.v;
      cfRender();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 4) MÁXIMAS — sequências sem sair, placares repetidos, média por hora
  // ═══════════════════════════════════════════════════════════════
  const MX = { h: ls.get('mx_h', 24) };
  const MX_MERC = ['casaVence', 'foraVence', 'over4.5', 'under4.5', 'over5.5', 'under5.5', 'over6.5', 'under6.5', 'over7.5', 'under7.5'];

  function seq(jogos, test) {
    let max = 0, atual = 0, last = -1;
    jogos.forEach((g, i) => { if (test(g)) { if (last !== -1) max = Math.max(max, i - last - 1); last = i; atual = 0; } else atual++; });
    return { max, atual };
  }
  const cellMax = r => `<td class="${r.max > 0 && r.atual >= r.max ? 'al' : r.max > 0 && r.atual >= r.max - 2 ? 'px' : ''}" title="Máxima ${r.max} | Atual ${r.atual}">${r.max} <span style="color:#3a4f5c">/</span> ${r.atual}</td>`;
  const blk = (titulo, ths, tds) => `<div class="pg-blk"><h5>${titulo}</h5><div class="sc"><table><thead><tr>${ths.map(t => `<th>${esc(t)}</th>`).join('')}</tr></thead><tbody><tr>${tds}</tr></tbody></table></div></div>`;

  function mxRender() {
    const jogos = ultimasHoras(D.res, MX.h), out = $('mxOut');
    if (!jogos.length) { out.innerHTML = '<div class="pg-msg">Sem dados.</div>'; return; }
    const cont = {};
    jogos.forEach(g => { const k = `${g.ga}x${g.gb}`; cont[k] = (cont[k] || 0) + 1; });
    const ord = Object.entries(cont).sort((a, b) => b[1] - a[1]);
    const placares = ord.slice(0, 11).map(e => e[0]);
    const t1 = blk('Máximas de Placares', placares, placares.map(p => cellMax(seq(jogos, g => `${g.ga}x${g.gb}` === p))).join(''));
    const t2 = blk('Máximas de Mercados', MX_MERC.map(m => merc(m).label), MX_MERC.map(m => cellMax(seq(jogos, g => hit(m, g)))).join(''));
    const rep = ord.slice(0, 12), lim = Math.max(3, Math.round(jogos.length * 0.12));
    const t3 = blk('Placares Mais Repetidos', rep.map(e => e[0]), rep.map(e => `<td class="${e[1] >= lim ? 'hi' : ''}" title="${e[0]}: ${e[1]} vezes">${e[1]}</td>`).join(''));
    let gs = grupos(jogos).filter(g => g.jogos.length >= liga().jogosHora * 0.8);
    if (!gs.length) gs = grupos(jogos);
    const t4 = blk('Média de Mercados por Hora', MX_MERC.map(m => merc(m).label), MX_MERC.map(m => {
      const media = avg(gs.map(g => g.jogos.filter(j => hit(m, j)).length));
      return `<td class="${media >= liga().jogosHora * 0.7 ? 'hm' : ''}" title="${media.toFixed(1)} por hora">${Math.round(media)}</td>`;
    }).join(''));
    out.innerHTML = t1 + t2 + t3 + t4;
  }
  acordeao('mx', 'Ver Máximas', `<div class="pg-row"><label>Período</label>${grpHTML('mxH', [[3, '3h'], [6, '6h'], [12, '12h'], [24, '24h'], [48, '48h'], [72, '72h']], MX.h)}</div><div id="mxOut"></div>`, mxRender, () => {
    grpBind('mxH', v => { MX.h = +v; ls.set('mx_h', MX.h); mxRender(); });
  });

  // ═══════════════════════════════════════════════════════════════
  // 5) RENKO — acumulado +1 / −1 do mercado
  // ═══════════════════════════════════════════════════════════════
  const RN = Object.assign({ mkt: 'over5.5', jan: 80, alt: 220, atual: true, ini: Infinity, lastMax: Infinity }, ls.get('rn', {}));
  RN.ini = Infinity; RN.lastMax = Infinity;
  const rnSave = () => ls.set('rn', { mkt: RN.mkt, jan: RN.jan, alt: RN.alt, atual: RN.atual });
  const RN_BTN = [['over5.5', 'O5.5'], ['under5.5', 'U5.5'], ['over4.5', 'O4.5'], ['over6.5', 'O6.5'], ['over7.5', 'O7.5'], ['casaVence', 'Casa'], ['foraVence', 'Fora']];

  function rnRender() {
    const jogos = D.res;
    if (!jogos.length) { $('rnInfo').textContent = 'Aguardando dados...'; return; }
    const m = merc(RN.mkt), pontos = [], dirs = [], plac = [], lab = [];
    let ac = 0, wins = 0;
    for (const g of jogos) { const ok = hit(RN.mkt, g); ac += ok ? 1 : -1; if (ok) wins++; pontos.push(ac); dirs.push(ok ? 1 : -1); plac.push(`${g.ga} x ${g.gb}`); lab.push(`${g.hh}:${g.mm}`); }
    const n = pontos.length, maxIni = Math.max(0, n - RN.jan);
    if (RN.ini === Infinity || RN.ini >= RN.lastMax) RN.ini = maxIni;
    RN.ini = Math.min(Math.max(0, RN.ini), maxIni); RN.lastMax = maxIni;
    const sc = $('rnScroll'); sc.min = 0; sc.max = maxIni; sc.value = RN.ini; sc.disabled = maxIni <= 0;
    const xMin = RN.ini, xMax = Math.min(n - 1, xMin + RN.jan - 1);
    $('rnInfo').textContent = `Exibindo ${xMin + 1}–${xMax + 1} de ${n} jogos`;
    const G = '#1fcc59', R = '#ef4444';
    $('rnWrap').style.height = RN.alt + 'px';
    draw('rnCanvas', {
      type: 'line',
      data: { labels: lab, datasets: [{ label: m.label, data: pontos, borderColor: G, borderWidth: 2, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: dirs.map(d => (d > 0 ? G : R)), pointBorderColor: '#090b12', tension: 0, fill: false, segment: { borderColor: c => (c.p1.parsed.y >= c.p0.parsed.y ? G : R) } }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { right: 56, top: 6 } },
        plugins: {
          legend: { display: false }, pgAtual: { on: RN.atual },
          tooltip: { ...tipBase, callbacks: { title: it => { const g = jogos[it[0].dataIndex]; return g ? infoJogo(g) : ''; }, label: c => { const d = dirs[c.dataIndex]; return [`${d > 0 ? '✔' : '✖'} ${d > 0 ? m.label : 'Não ' + m.label}`, `Acum ${c.parsed.y > 0 ? '+' : ''}${c.parsed.y}`, `Placar ${plac[c.dataIndex]}`]; } } }
        },
        scales: { x: { min: xMin, max: xMax, ticks: { color: '#2e3f52', maxRotation: 0, autoSkip: true, font: { size: 8 } }, grid: { color: GRID } }, y: { ticks: { color: '#5a6b7e', stepSize: 1, font: { size: 9 } }, grid: { color: GRID } } }
      }
    });
    const losses = n - wins, pct = ((wins / n) * 100).toFixed(1);
    let streak = '';
    if (n > 1) { const last = dirs[n - 1]; let c = 1; for (let i = n - 2; i >= 0 && dirs[i] === last; i--) c++; if (c >= 2) streak = `<span class="pg-pill" style="color:${last > 0 ? G : R};border-color:${last > 0 ? G : R}55">${last > 0 ? '↑' : '↓'} Seq ${c}</span>`; }
    $('rnSum').innerHTML = `<span class="pg-pill" style="color:${G};border-color:${G}55">✔ ${wins}</span><span class="pg-pill" style="color:${R};border-color:${R}55">✖ ${losses}</span><span class="pg-pill" style="color:#ffc83c;border-color:#ffc83c55">${pct}%</span><span class="pg-pill" style="color:#9ca3af;border-color:#2a3347">${n} jogos</span>${streak}<span class="pg-pill" style="color:${ac >= 0 ? G : R};border-color:${ac >= 0 ? G : R}55">Acum ${ac > 0 ? '+' : ''}${ac}</span>`;
  }
  acordeao('rn', 'Renko de Mercados', `
    <div class="pg-row">${grpHTML('rnMkt', RN_BTN, RN.mkt)}<select id="rnSel" class="pg-sel">${optMercados(RN.mkt)}</select></div>
    <div class="pg-row"><label>Janela</label><select id="rnJan" class="pg-sel">${[20, 40, 80, 160, 320].map(v => `<option value="${v}">${v}</option>`).join('')}</select>
      <label>Altura</label><button type="button" class="pg-btn" id="rnAm">−</button><input id="rnAlt" class="pg-in" type="number" min="120" max="600" step="10"><button type="button" class="pg-btn" id="rnAp">+</button>
      <label class="pg-chk"><input type="checkbox" id="rnAtual"> Linha atual</label></div>
    <div class="pg-chart" id="rnWrap"><canvas id="rnCanvas"></canvas></div>
    <input type="range" id="rnScroll" min="0" max="0" value="0" style="width:100%;accent-color:#4f72ff">
    <div class="pg-row" style="margin-top:6px"><span id="rnInfo" style="color:#4b5563;font-size:10px"></span><div class="pg-rk-sum" id="rnSum"></div></div>`, rnRender, () => {
    $('rnJan').value = RN.jan; $('rnAlt').value = RN.alt; $('rnAtual').checked = RN.atual;
    const setM = v => { RN.mkt = v; rnSave(); grpSet('rnMkt', v); $('rnSel').value = v; rnRender(); };
    grpBind('rnMkt', setM);
    $('rnSel').addEventListener('change', e => setM(e.target.value));
    $('rnJan').addEventListener('change', e => { RN.jan = +e.target.value; RN.ini = Infinity; rnSave(); rnRender(); });
    const setAlt = v => { RN.alt = Math.min(600, Math.max(120, v || 220)); $('rnAlt').value = RN.alt; rnSave(); $('rnWrap').style.height = RN.alt + 'px'; if (CH.rnCanvas) CH.rnCanvas.resize(); };
    $('rnAlt').addEventListener('change', e => setAlt(+e.target.value));
    $('rnAm').addEventListener('click', () => setAlt(RN.alt - 10));
    $('rnAp').addEventListener('click', () => setAlt(RN.alt + 10));
    $('rnAtual').addEventListener('change', e => { RN.atual = e.target.checked; rnSave(); rnRender(); });
    $('rnScroll').addEventListener('input', e => { RN.ini = +e.target.value; rnRender(); });
  });

  // ═══════════════════════════════════════════════════════════════
  // 6) GRÁFICO DE MERCADOS — % móvel de vários mercados + setups + ferramentas de desenho
  // ═══════════════════════════════════════════════════════════════
  const defSetups = () => [
    { id: 's1', name: 'Over/Under 5.5', items: [{ m: 'over5.5', c: '#1fcc59' }, { m: 'under5.5', c: '#f87171' }] },
    { id: 's2', name: 'Vencedor', items: [{ m: 'casaVence', c: '#60a5fa' }, { m: 'foraVence', c: '#fbbf24' }] },
    { id: 's3', name: 'Totais Over', items: [{ m: 'over4.5', c: '#22d3ee' }, { m: 'over5.5', c: '#1fcc59' }, { m: 'over6.5', c: '#a78bfa' }, { m: 'over7.5', c: '#fb923c' }] }
  ];
  const GM = Object.assign({ points: 6, base: 40, fib: false, mm: false, y: 'left', atual: true, rot: false, active: 's1', vis: {}, setups: null }, ls.get('gm', {}));
  if (!Array.isArray(GM.setups) || !GM.setups.length) GM.setups = defSetups();
  const gmSave = () => ls.set('gm', GM);
  let GMD = { lines: [], tools: [] }, GMDslug = null, GMJ = [];
  const GMS = { tool: null, pend: null, sel: -1, drag: -1, edit: null };
  const gmDKey = () => 'gmdraw_' + liga().slug;
  function gmLoadDraw() { if (GMDslug !== liga().slug) { GMD = Object.assign({ lines: [], tools: [] }, ls.get(gmDKey(), {})); GMDslug = liga().slug; GMS.sel = -1; GMS.pend = null; GMS.tool = null; } }
  const gmSaveDraw = () => ls.set(gmDKey(), GMD);

  function tsIdx(ts) { for (let i = 0; i < GMJ.length; i++) if (GMJ[i].ts >= ts) return i; return GMJ.length - 1; }

  const plugGmDraw = {
    id: 'pgGmDraw',
    afterDatasetsDraw(ch) {
      const { ctx, chartArea: ca, scales } = ch, xs = scales.x, ys = scales.y;
      if (!ca || !xs || !ys || !GMJ.length) return;
      const badges = [];
      ctx.save(); ctx.beginPath(); ctx.rect(ca.left, ca.top, ca.right - ca.left, ca.bottom - ca.top); ctx.clip();
      GMD.lines.forEach((l, i) => {
        const y = ys.getPixelForValue(l.y); if (!isFinite(y)) return;
        ctx.strokeStyle = l.c; ctx.lineWidth = i === GMS.sel ? 2 : 1; ctx.setLineDash(i === GMS.sel ? [4, 2] : []);
        ctx.beginPath(); ctx.moveTo(ca.left, y); ctx.lineTo(ca.right, y); ctx.stroke(); ctx.setLineDash([]);
        badges.push({ y, t: Math.round(l.y) + '%', c: l.c });
      });
      const tools = GMD.tools.map(t => ({ ...t, pre: false }));
      if (GMS.pend) tools.push({ ...GMS.pend, t: GMS.tool, pre: true });
      for (const t of tools) {
        const x1 = xs.getPixelForValue(tsIdx(t.x1)), x2 = xs.getPixelForValue(tsIdx(t.x2));
        const y1 = ys.getPixelForValue(t.y1), y2 = ys.getPixelForValue(t.y2);
        ctx.globalAlpha = t.pre ? 0.6 : 1;
        if (t.t === 'fib') {
          const xa = Math.min(x1, x2);
          [0, 23.6, 38.2, 50, 61.8, 100].forEach(lv => {
            const y = y2 + (y1 - y2) * (lv / 100);
            ctx.strokeStyle = t.c; ctx.lineWidth = 1; ctx.setLineDash(lv === 0 || lv === 100 ? [] : [4, 4]);
            ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(ca.right, y); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = t.c; ctx.font = '9px monospace'; ctx.textBaseline = 'bottom'; ctx.fillText(lv + '%', xa + 3, y - 1);
          });
        } else if (x2 !== x1) {
          const sl = (y2 - y1) / (x2 - x1), xe = ca.right;
          ctx.strokeStyle = t.c; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(xe, y1 + sl * (xe - x1)); ctx.stroke();
          ctx.fillStyle = t.c; ctx.beginPath(); ctx.arc(x1, y1, 3, 0, 7); ctx.arc(x2, y2, 3, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      ctx.save(); ctx.font = 'bold 10px monospace'; ctx.textBaseline = 'middle';
      for (const b of badges) { const w = ctx.measureText(b.t).width + 8; ctx.fillStyle = 'rgba(9,11,18,.95)'; ctx.fillRect(ca.right + 3, b.y - 8, w, 16); ctx.strokeStyle = b.c; ctx.strokeRect(ca.right + 3, b.y - 8, w, 16); ctx.fillStyle = b.c; ctx.fillText(b.t, ca.right + 7, b.y); }
      ctx.restore();
    }
  };
  const gmSetup = () => GM.setups.find(s => s.id === GM.active) || GM.setups[0];

  function gmRender() {
    gmLoadDraw();
    gmBarra();
    const all = D.res;
    if (!all.length) { $('gmMsg').textContent = 'Sem dados.'; return; }
    $('gmMsg').textContent = '';
    const s = gmSetup(), n = GM.points * liga().jogosHora, off = Math.max(0, all.length - n);
    GMJ = all.slice(off);
    const itens = s.items.filter(it => GM.vis[s.id + '|' + it.m] !== false);
    const ds = itens.map(it => {
      const pref = [0]; all.forEach(g => pref.push(pref[pref.length - 1] + (hit(it.m, g) ? 1 : 0)));
      const vals = all.map((_, i) => { const a = Math.max(0, i + 1 - GM.base); return +(((pref[i + 1] - pref[a]) / (i + 1 - a)) * 100).toFixed(1); }).slice(off);
      return { label: merc(it.m).label, data: vals, borderColor: it.c, backgroundColor: it.c, borderWidth: 1.8, pointRadius: 2, pointHoverRadius: 4, pointBackgroundColor: '#12151f', pointBorderColor: it.c, fill: false, tension: 0.1 };
    });
    if (GM.mm && ds.length) {
      const base = ds[0].data, mk = p => base.map((_, i) => avg(base.slice(Math.max(0, i - p + 1), i + 1)));
      ds.push({ label: 'MM9', data: mk(9), borderColor: '#00ff00', borderWidth: 1.2, pointRadius: 0, fill: false, _noLast: true, _noRot: true });
      ds.push({ label: 'MM21', data: mk(21), borderColor: '#ff3b30', borderWidth: 1.2, pointRadius: 0, fill: false, _noLast: true, _noRot: true });
    }
    draw('gmCanvas', {
      type: 'line', plugins: [plugGmDraw],
      data: { labels: GMJ.map(() => ''), datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false }, layout: { padding: { top: 14, right: 60 } },
        plugins: {
          legend: { display: false }, pgAtual: { on: GM.atual, fmt: v => Math.round(v) + '%' }, pgFib: { on: GM.fib }, pgRot: { on: GM.rot },
          tooltip: { ...tipBase, callbacks: { title: it => { const g = GMJ[it[0].dataIndex]; return g ? infoJogo(g) : ''; }, label: c => `${c.dataset.label}: ${c.parsed.y}%` } }
        },
        scales: { x: { ticks: { display: false }, grid: { display: false } }, y: { position: GM.y, min: 0, max: 100, ticks: { color: TXT, stepSize: 10, callback: v => v + '%' }, grid: { color: GRID } } }
      }
    });
    $('gmCont').textContent = `${GMD.lines.length}/6 linhas · ${GMD.tools.filter(t => t.t === 'fib').length}/4 fib · ${GMD.tools.filter(t => t.t !== 'fib').length}/6 tendências`;
  }
  function gmBarra() {
    $('gmSetups').innerHTML = GM.setups.map(s => `<span class="pg-chip${s.id === GM.active ? ' on' : ''}" data-sid="${s.id}">${esc(s.name)} <i data-edit="${s.id}" title="Editar">✎</i> <i data-del="${s.id}" title="Remover">×</i></span>`).join('') + `<span style="color:#6b7280;font-size:10px">${GM.setups.length}/10</span>`;
    const s = gmSetup();
    $('gmLines').innerHTML = s.items.map(it => { const on = GM.vis[s.id + '|' + it.m] !== false; return `<span class="pg-chip${on ? ' on' : ''}" data-tg="${it.m}" style="${on ? '' : 'opacity:.45'}"><span class="pg-dot" style="background:${it.c}"></span>${esc(merc(it.m).label)}</span>`; }).join('');
  }
  function gmModal(setup) {
    GMS.edit = setup ? setup.id : null;
    const box = $('gmModal'); box.style.display = 'block';
    $('gmModalTit').textContent = setup ? 'Editar setup' : 'Criar setup';
    $('gmName').value = setup ? setup.name : '';
    const mapa = {}; if (setup) setup.items.forEach(i => { mapa[i.m] = i.c; });
    let k = 0;
    $('gmMList').innerHTML = GRUPOS.map(g => `<div class="gt">${esc(g.nome)}</div>` + g.itens.map(m => { const on = mapa[m.id] != null; return `<label class="pg-mrow"><input type="checkbox" data-m="${m.id}"${on ? ' checked' : ''}><span>${esc(m.label)}</span><input type="color" data-c="${m.id}" value="${mapa[m.id] || PALETA[k++ % PALETA.length]}"></label>`; }).join('')).join('');
  }
  function gmSalvarModal() {
    const name = $('gmName').value.trim().slice(0, 30), items = [];
    $('gmMList').querySelectorAll('input[data-m]:checked').forEach(cb => items.push({ m: cb.dataset.m, c: $('gmMList').querySelector(`input[data-c="${cb.dataset.m}"]`).value }));
    if (!name) { alert('Dê um nome ao setup.'); return; }
    if (!items.length) { alert('Selecione ao menos um mercado.'); return; }
    if (items.length > 8) { alert('Máximo de 8 mercados por setup.'); return; }
    if (GMS.edit) { const s = GM.setups.find(x => x.id === GMS.edit); if (s) { s.name = name; s.items = items; } }
    else { if (GM.setups.length >= 10) { alert('Limite de 10 setups.'); return; } const id = 's' + Date.now(); GM.setups.push({ id, name, items }); GM.active = id; }
    $('gmModal').style.display = 'none'; gmSave(); gmRender();
  }
  function gmPos(e) { const r = $('gmCanvas').getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function gmVal(ch, p) {
    const i = Math.max(0, Math.min(GMJ.length - 1, Math.round(ch.scales.x.getValueForPixel(p.x))));
    return { ts: GMJ[i].ts, y: Math.max(0, Math.min(100, ch.scales.y.getValueForPixel(p.y))) };
  }
  function gmTool(t) {
    const lim = t === 'fib' ? 4 : 6, ja = GMD.tools.filter(x => (t === 'fib') === (x.t === 'fib')).length;
    if (ja >= lim) { alert('Limite atingido. Remova um desenho antes.'); return; }
    GMS.tool = t; GMS.pend = null; $('gmCanvas').style.cursor = 'crosshair';
  }
  acordeao('gm', 'Gráfico Mercados', `
    <div class="pg-chips" id="gmSetups"></div>
    <div class="pg-row"><button type="button" class="pg-btn g" id="gmNovo">＋ Novo Setup</button><span id="gmLines" class="pg-chips" style="margin:0"></span></div>
    <div class="pg-modal" id="gmModal"><b id="gmModalTit" style="color:#e5e7eb">Criar setup</b>
      <div class="pg-row" style="margin-top:6px"><input id="gmName" class="pg-sel" maxlength="30" placeholder="Nome do setup" style="width:220px"></div>
      <div class="lst" id="gmMList"></div>
      <div class="pg-row"><button type="button" class="pg-btn g" id="gmSave">✔ Salvar</button><button type="button" class="pg-btn" id="gmCancel">Cancelar</button><span style="color:#6b7280;font-size:10px">até 8 mercados</span></div></div>
    <div class="pg-chart" style="height:430px"><canvas id="gmCanvas"></canvas></div><div class="pg-msg" id="gmMsg"></div>
    <div class="pg-row">
      <select id="gmPts" class="pg-sel">${[1, 2, 3, 4, 6, 8, 12, 24, 48, 72].map(h => `<option value="${h}">${h} ${h === 1 ? 'Hora' : 'Horas'}</option>`).join('')}</select>
      <select id="gmBase" class="pg-sel">${[20, 40, 60, 80, 100, 120].map(b => `<option value="${b}">Base ${b}</option>`).join('')}</select>
      <select id="gmY" class="pg-sel"><option value="left">% Esquerda</option><option value="right">% Direita</option></select>
      <label class="pg-chk"><input type="checkbox" id="gmFib"> Fibo</label><label class="pg-chk"><input type="checkbox" id="gmMM"> MM</label>
      <label class="pg-chk"><input type="checkbox" id="gmAtual"> Atual</label><label class="pg-chk"><input type="checkbox" id="gmRot"> Rótulos</label>
    </div>
    <div class="pg-row"><label>Ferramentas</label><input type="color" id="gmCor" value="#1fcc59" style="width:30px;height:24px;border:none;background:none">
      <button type="button" class="pg-btn g" id="gmAddL">➕ Linha</button><button type="button" class="pg-btn" id="gmFibT">Fib+</button>
      <button type="button" class="pg-btn g" id="gmLTA">▲ LTA</button><button type="button" class="pg-btn r" id="gmLTB">▼ LTB</button>
      <button type="button" class="pg-btn y" id="gmDelSel">🗑 Selecionada</button><button type="button" class="pg-btn y" id="gmUndo">↶ Último traço</button><button type="button" class="pg-btn r" id="gmClear">🧹 Limpar</button>
      <span id="gmCont" style="color:#6b7280;font-size:10px"></span></div>
    <div style="color:#4b5563;font-size:10px">Linhas: arraste para mover. LTA/LTB/Fib+: clique em dois pontos do gráfico.</div>`, gmRender, () => {
    $('gmPts').value = GM.points; $('gmBase').value = GM.base; $('gmY').value = GM.y;
    $('gmFib').checked = GM.fib; $('gmMM').checked = GM.mm; $('gmAtual').checked = GM.atual; $('gmRot').checked = GM.rot;
    const bind = (id, fn) => $(id).addEventListener('change', e => { fn(e.target); gmSave(); gmRender(); });
    bind('gmPts', t => { GM.points = +t.value; }); bind('gmBase', t => { GM.base = +t.value; }); bind('gmY', t => { GM.y = t.value; });
    bind('gmFib', t => { GM.fib = t.checked; }); bind('gmMM', t => { GM.mm = t.checked; }); bind('gmAtual', t => { GM.atual = t.checked; }); bind('gmRot', t => { GM.rot = t.checked; });
    $('gmSetups').addEventListener('click', e => {
      const ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]'), ch = e.target.closest('[data-sid]');
      if (ed) { gmModal(GM.setups.find(s => s.id === ed.dataset.edit)); return; }
      if (dl) { if (GM.setups.length <= 1) { alert('Mantenha ao menos um setup.'); return; } GM.setups = GM.setups.filter(s => s.id !== dl.dataset.del); if (GM.active === dl.dataset.del) GM.active = GM.setups[0].id; gmSave(); gmRender(); return; }
      if (ch) { GM.active = ch.dataset.sid; gmSave(); gmRender(); }
    });
    $('gmLines').addEventListener('click', e => { const c = e.target.closest('[data-tg]'); if (!c) return; const k = gmSetup().id + '|' + c.dataset.tg; GM.vis[k] = GM.vis[k] === false; gmSave(); gmRender(); });
    $('gmNovo').addEventListener('click', () => { if (GM.setups.length >= 10) { alert('Limite de 10 setups atingido.'); return; } gmModal(null); });
    $('gmSave').addEventListener('click', gmSalvarModal);
    $('gmCancel').addEventListener('click', () => { $('gmModal').style.display = 'none'; });
    $('gmAddL').addEventListener('click', () => { if (GMD.lines.length >= 6) return; GMD.lines.push({ y: 50, c: $('gmCor').value }); GMS.sel = GMD.lines.length - 1; gmSaveDraw(); gmRender(); });
    $('gmFibT').addEventListener('click', () => gmTool('fib'));
    $('gmLTA').addEventListener('click', () => { gmTool('lta'); });
    $('gmLTB').addEventListener('click', () => { gmTool('ltb'); });
    $('gmDelSel').addEventListener('click', () => { if (GMS.sel >= 0) { GMD.lines.splice(GMS.sel, 1); GMS.sel = -1; gmSaveDraw(); gmRender(); } });
    $('gmUndo').addEventListener('click', () => { GMD.tools.pop(); gmSaveDraw(); gmRender(); });
    $('gmClear').addEventListener('click', () => { GMD = { lines: [], tools: [] }; GMS.sel = -1; GMS.pend = null; GMS.tool = null; gmSaveDraw(); gmRender(); });
    const cv = $('gmCanvas');
    cv.addEventListener('mousedown', e => {
      const ch = CH.gmCanvas; if (!ch || !GMJ.length) return;
      const p = gmPos(e);
      if (GMS.tool) {
        const v = gmVal(ch, p);
        if (!GMS.pend) GMS.pend = { x1: v.ts, y1: v.y, x2: v.ts, y2: v.y, c: GMS.tool === 'lta' ? '#1fcc59' : GMS.tool === 'ltb' ? '#f87171' : $('gmCor').value };
        else { GMD.tools.push({ t: GMS.tool, x1: GMS.pend.x1, y1: GMS.pend.y1, x2: v.ts, y2: v.y, c: GMS.pend.c }); GMS.tool = null; GMS.pend = null; cv.style.cursor = ''; gmSaveDraw(); gmRender(); return; }
        ch.draw(); return;
      }
      let best = -1, bd = 9;
      GMD.lines.forEach((l, i) => { const d = Math.abs(ch.scales.y.getPixelForValue(l.y) - p.y); if (d < bd) { bd = d; best = i; } });
      GMS.sel = best; GMS.drag = best; ch.draw();
    });
    cv.addEventListener('mousemove', e => {
      const ch = CH.gmCanvas; if (!ch || !GMJ.length) return;
      if (GMS.drag >= 0) { GMD.lines[GMS.drag].y = gmVal(ch, gmPos(e)).y; ch.draw(); }
      else if (GMS.pend) { const v = gmVal(ch, gmPos(e)); GMS.pend.x2 = v.ts; GMS.pend.y2 = v.y; ch.draw(); }
    });
    const stop = () => { if (GMS.drag >= 0) { GMS.drag = -1; gmSaveDraw(); } };
    cv.addEventListener('mouseup', stop); cv.addEventListener('mouseleave', stop);
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && GMS.tool) { GMS.tool = null; GMS.pend = null; cv.style.cursor = ''; CH.gmCanvas && CH.gmCanvas.draw(); } });
  });

  // ═══════════════════════════════════════════════════════════════
  // 7) MODO TRADER — série do mercado + MM, RSI, MACD, Bollinger, Estocástico, ATR, Reg. Linear
  // ═══════════════════════════════════════════════════════════════
  const ma = (a, p) => a.map((_, i) => avg(a.slice(Math.max(0, i - p + 1), i + 1).filter(v => v != null)));
  const ema = (a, p) => { const k = 2 / (p + 1), o = []; let pr = null; a.forEach(v => { if (v == null) { o.push(null); return; } pr = pr == null ? v : v * k + pr * (1 - k); o.push(pr); }); return o; };
  const macdC = (a, f, s, g) => { const ef = ema(a, f), es = ema(a, s), m = ef.map((v, i) => (v == null || es[i] == null ? null : v - es[i])), sg = ema(m, g); return { m, sg, h: m.map((v, i) => (v == null || sg[i] == null ? null : v - sg[i])) }; };
  const rsiC = (a, per) => { const o = Array(a.length).fill(null); for (let i = per; i < a.length; i++) { let g = 0, l = 0; for (let j = i - per + 1; j <= i; j++) { const d = a[j] - a[j - 1]; if (d > 0) g += d; else l -= d; } o[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l); } return o; };
  const bollC = (a, p, k) => { const u = [], m = [], l = []; a.forEach((_, i) => { if (i < p - 1) { u.push(null); m.push(null); l.push(null); return; } const s = a.slice(i - p + 1, i + 1), mean = avg(s), sd = Math.sqrt(avg(s.map(v => (v - mean) ** 2))); m.push(mean); u.push(mean + k * sd); l.push(mean - k * sd); }); return { u, m, l }; };
  const stochC = (a, kp, dp) => { const k = a.map((v, i) => { if (i < kp - 1) return null; const s = a.slice(i - kp + 1, i + 1), lo = Math.min(...s), hi = Math.max(...s); return hi === lo ? 50 : ((v - lo) / (hi - lo)) * 100; }); const d = k.map((_, i) => { const s = k.slice(Math.max(0, i - dp + 1), i + 1).filter(v => v != null); return s.length === dp ? avg(s) : null; }); return { k, d }; };
  const atrC = (a, p) => { const tr = a.map((v, i) => (i ? Math.abs(v - a[i - 1]) : 0)); return tr.map((_, i) => (i < p ? null : avg(tr.slice(i - p + 1, i + 1)))); };
  const regC = (a, p) => a.map((_, i) => { if (i < p - 1) return null; const s = a.slice(i - p + 1, i + 1), mx = (p - 1) / 2, my = avg(s); let nu = 0, de = 0; s.forEach((v, j) => { nu += (j - mx) * (v - my); de += (j - mx) ** 2; }); const sl = de ? nu / de : 0; return sl * (p - 1) + (my - sl * mx); });

  const TRI = ['trSerie', 'trH', 'trBase', 'trMA1', 'trMA2', 'trMF', 'trMS', 'trMG', 'trRSI', 'trBP', 'trBD', 'trSK', 'trSD', 'trAP', 'trRP', 'trRng'];
  const TRC = ['trMM', 'trRngOn', 'trPV', 'trVal', 'trAtual', 'trShRSI', 'trShBoll', 'trShStoch', 'trShATR', 'trShReg', 'trShMacd'];
  let TRX = { rng: [], max: null, min: null, rngOn: true, pv: true };
  const plugTr = {
    id: 'pgTr',
    afterDraw(ch) {
      const { ctx, chartArea: ca, scales } = ch, ys = scales.y; if (!ca || !ys) return;
      const linha = (v, cor, dash, txt, lw) => {
        const y = ys.getPixelForValue(v); if (!isFinite(y) || y < ca.top || y > ca.bottom) return;
        ctx.save(); ctx.strokeStyle = cor; ctx.lineWidth = lw || 1; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(ca.left, y); ctx.lineTo(ca.right, y); ctx.stroke(); ctx.setLineDash([]);
        if (txt) { ctx.font = 'bold 9px monospace'; ctx.fillStyle = cor; ctx.textBaseline = 'bottom'; ctx.fillText(txt, ca.left + 4, y - 2); } ctx.restore();
      };
      if (TRX.pv && TRX.max != null) { linha(TRX.max, 'rgba(76,175,80,.75)', [6, 6], 'pico ' + Math.round(TRX.max)); linha(TRX.min, 'rgba(229,115,115,.75)', [6, 6], 'vale ' + Math.round(TRX.min)); }
      if (TRX.rngOn) TRX.rng.forEach(v => linha(v, 'rgba(255,215,0,.85)', [4, 4], 'range ' + v));
    }
  };

  function trCfg() { const o = {}; TRI.forEach(i => { o[i] = $(i).value; }); TRC.forEach(i => { o[i] = $(i).checked; }); return o; }
  function trRender() {
    const all = D.res; if (!all.length) { $('trMsg').textContent = 'Sem dados.'; return; }
    $('trMsg').textContent = '';
    const c = trCfg(); ls.set('tr', c);
    const key = c.trSerie, base = +c.trBase || 20, n = (+c.trH || 4) * liga().jogosHora, isInd = key.startsWith('ind:');
    let full;
    if (isInd) { const f = { 'ind:golsFT': g => g.ga + g.gb, 'ind:golsCasa': g => g.ga, 'ind:golsFora': g => g.gb }[key], v = all.map(f); full = v.map((_, i) => avg(v.slice(Math.max(0, i - base + 1), i + 1))); }
    else { const pref = [0]; all.forEach(g => pref.push(pref[pref.length - 1] + (hit(key, g) ? 1 : 0))); full = all.map((_, i) => { const a = Math.max(0, i + 1 - base); return ((pref[i + 1] - pref[a]) / (i + 1 - a)) * 100; }); }
    const jogos = all.slice(-n), pts = full.slice(-n).map(v => +v.toFixed(2));
    const nome = isInd ? ({ 'ind:golsFT': 'Total de gols', 'ind:golsCasa': 'Gols casa', 'ind:golsFora': 'Gols fora' }[key]) : merc(key).label;
    const pc = jogos.map(g => (isInd ? '#9ca3af' : hit(key, g) ? '#4CAF50' : '#FF3B30'));
    const NO = { _noLast: true, _noRot: true };
    const ds = [{ label: nome, data: pts, borderColor: '#ffffff', borderWidth: 2, pointRadius: 2.5, pointBackgroundColor: pc, pointBorderColor: pc, tension: 0.1, fill: false, order: 0 }];
    if (c.trMM) { ds.push({ label: 'MA' + c.trMA1, data: ma(pts, +c.trMA1), borderColor: '#00FF00', borderWidth: 1.4, pointRadius: 0, fill: false, ...NO }); ds.push({ label: 'MA' + c.trMA2, data: ma(pts, +c.trMA2), borderColor: '#FF0000', borderWidth: 1.3, pointRadius: 0, fill: false, ...NO }); }
    if (c.trShBoll) { const b = bollC(pts, +c.trBP, +c.trBD); [['BB sup', b.u], ['BB méd', b.m], ['BB inf', b.l]].forEach(([l, d]) => ds.push({ label: l, data: d, borderColor: 'rgba(100,180,255,.7)', borderDash: [4, 3], borderWidth: 1, pointRadius: 0, fill: false, ...NO })); }
    if (c.trShReg) ds.push({ label: 'RegLin', data: regC(pts, +c.trRP), borderColor: '#a78bfa', borderDash: [6, 3], borderWidth: 1.5, pointRadius: 0, fill: false, ...NO });
    if (c.trShRSI) ds.push({ label: 'RSI', data: rsiC(pts, +c.trRSI), borderColor: '#facc15', borderWidth: 1, pointRadius: 0, fill: false, yAxisID: 'rsi', ...NO });
    const mx = Math.max(...pts), mn = Math.min(...pts), cont = {};
    pts.forEach(v => { const r = Math.round(v); cont[r] = (cont[r] || 0) + 1; });
    TRX = { max: mx, min: mn, pv: c.trPV, rngOn: c.trRngOn, rng: Object.entries(cont).sort((a, b) => b[1] - a[1]).slice(0, +c.trRng || 2).map(e => +e[0]) };
    const scales = { x: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,.04)' } }, y: { ticks: { color: TXT }, grid: { color: 'rgba(255,255,255,.04)' }, afterFit(s) { s.width = 46; } } };
    if (!isInd) { scales.y.suggestedMin = 0; scales.y.suggestedMax = 100; }
    if (c.trShRSI) scales.rsi = { position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false }, ticks: { color: '#facc15', stepSize: 25 } };
    draw('trMain', {
      type: 'line', plugins: [plugTr],
      data: { labels: jogos.map(() => ''), datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false }, layout: { padding: { top: 14, right: c.trShRSI ? 20 : 56 } },
        plugins: { legend: { display: false }, pgAtual: { on: c.trAtual, fmt: v => (isInd ? v.toFixed(1) : Math.round(v) + '%') }, pgRot: { on: c.trVal }, tooltip: { ...tipBase, callbacks: { title: it => { const g = jogos[it[0].dataIndex]; return g ? infoJogo(g) : ''; }, label: x => `${x.dataset.label}: ${x.parsed.y == null ? '-' : x.parsed.y.toFixed(2)}` } } },
        scales
      }
    });
    const sub = (wrap, canvas, on, cfg) => { const w = $(wrap); if (!on) { w.style.display = 'none'; kill(canvas); return; } w.style.display = 'block'; draw(canvas, cfg); };
    const so = (yfix, extra) => ({ responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false }, layout: { padding: { right: 56, top: 4 } }, plugins: { legend: { display: false }, tooltip: { ...tipBase, callbacks: { title: it => { const g = jogos[it[0].dataIndex]; return g ? infoJogo(g) : ''; } } } }, scales: { x: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,.04)' } }, y: { ...yfix, ticks: { color: TXT }, grid: { color: 'rgba(255,255,255,.04)' }, afterFit(s) { s.width = 46; } } }, ...extra });
    const lab = jogos.map(() => '');
    const mc = macdC(pts, +c.trMF, +c.trMS, +c.trMG);
    sub('trMacdW', 'trMacd', c.trShMacd, { type: 'bar', data: { labels: lab, datasets: [
      { label: 'Hist', data: mc.h, type: 'bar', backgroundColor: mc.h.map((v, i) => { const p = i ? mc.h[i - 1] || 0 : 0; return (v || 0) >= 0 ? ((v || 0) >= p ? 'rgba(0,229,160,.9)' : 'rgba(0,229,160,.4)') : ((v || 0) <= p ? 'rgba(255,63,91,.9)' : 'rgba(255,63,91,.4)'); }), barThickness: 4, order: 3 },
      { label: 'MACD', data: mc.m, type: 'line', borderColor: '#fff', borderWidth: 1.6, pointRadius: 0, tension: 0.15, order: 2 },
      { label: 'Sinal', data: mc.sg, type: 'line', borderColor: '#facc15', borderWidth: 1.4, pointRadius: 0, tension: 0.15, order: 1 }] }, options: so({}) });
    const st = stochC(pts, +c.trSK, +c.trSD);
    sub('trStochW', 'trStoch', c.trShStoch, { type: 'line', data: { labels: lab, datasets: [{ label: '%K', data: st.k, borderColor: '#34d399', borderWidth: 1.5, pointRadius: 0, fill: false }, { label: '%D', data: st.d, borderColor: '#f97316', borderWidth: 1.2, pointRadius: 0, fill: false }] }, options: so({ min: 0, max: 100 }) });
    const at = atrC(pts, +c.trAP);
    sub('trAtrW', 'trAtr', c.trShATR, { type: 'bar', data: { labels: lab, datasets: [{ label: 'ATR', data: at, backgroundColor: at.map((v, i) => (v != null && i && at[i - 1] != null && v > at[i - 1] ? 'rgba(248,113,113,.8)' : 'rgba(74,222,128,.8)')), barThickness: 3 }] }, options: so({}) });
  }
  const trNum = (id, lbl, v, mn, mx, st) => `<label style="font-size:10px;color:#9ca3af">${lbl}</label><input class="pg-in" id="${id}" type="number" value="${v}" min="${mn}" max="${mx}"${st ? ` step="${st}"` : ''}>`;
  const trChk = (id, lbl, on) => `<label class="pg-chk"><input type="checkbox" id="${id}"${on ? ' checked' : ''}> ${lbl}</label>`;
  acordeao('tr', 'Modo Trader', `
    <div class="pg-row"><label>Série</label><select id="trSerie" class="pg-sel"><optgroup label="Indicadores"><option value="ind:golsFT">Total de gols</option><option value="ind:golsCasa">Gols casa</option><option value="ind:golsFora">Gols fora</option></optgroup>${optMercados('over5.5')}</select>
      <label>Amostras</label><select id="trH" class="pg-sel">${[1, 2, 3, 4, 6, 8, 12, 24, 48, 72].map(h => `<option value="${h}"${h === 4 ? ' selected' : ''}>${h}h</option>`).join('')}</select>
      ${trNum('trBase', 'Base', 20, 5, 120)}</div>
    <div class="pg-row">${trChk('trMM', 'Médias', true)}${trChk('trRngOn', 'Range', true)}${trChk('trPV', 'Pico/Vale', true)}${trChk('trVal', 'Exibir valores', false)}${trChk('trAtual', 'Referência', true)}</div>
    <div class="pg-row">${trChk('trShRSI', 'RSI', false)}${trChk('trShBoll', 'Bollinger', false)}${trChk('trShStoch', 'Estocástico', false)}${trChk('trShATR', 'ATR', false)}${trChk('trShReg', 'Reg.Lin', false)}${trChk('trShMacd', 'MACD', true)}</div>
    <details class="pg-det"><summary>⚙ Parâmetros dos indicadores</summary><div class="pg-row" style="margin-top:8px">
      ${trNum('trMA1', 'MA1', 9, 2, 50)}${trNum('trMA2', 'MA2', 21, 2, 50)}${trNum('trRng', 'Linhas range', 2, 1, 5)}${trNum('trMF', 'MACD rápida', 9, 1, 50)}${trNum('trMS', 'MACD lenta', 21, 1, 100)}${trNum('trMG', 'MACD sinal', 8, 1, 50)}${trNum('trRSI', 'RSI', 14, 2, 50)}
      ${trNum('trBP', 'Boll per.', 20, 2, 100)}${trNum('trBD', 'Boll desvio', 2, 1, 4, 0.5)}${trNum('trSK', 'Estoc %K', 14, 2, 50)}${trNum('trSD', 'Estoc %D', 3, 1, 20)}${trNum('trAP', 'ATR', 14, 2, 50)}${trNum('trRP', 'RegLin', 20, 3, 100)}</div></details>
    <div class="pg-chart" style="height:310px"><canvas id="trMain"></canvas></div>
    <div class="pg-chart" id="trMacdW" style="height:140px"><canvas id="trMacd"></canvas></div>
    <div class="pg-chart" id="trStochW" style="height:110px;display:none"><canvas id="trStoch"></canvas></div>
    <div class="pg-chart" id="trAtrW" style="height:90px;display:none"><canvas id="trAtr"></canvas></div>
    <div class="pg-msg" id="trMsg"></div>`, trRender, () => {
    const saved = ls.get('tr', null);
    if (saved) { TRI.forEach(i => { if (saved[i] != null && $(i)) $(i).value = saved[i]; }); TRC.forEach(i => { if (saved[i] != null && $(i)) $(i).checked = saved[i]; }); }
    TRI.concat(TRC).forEach(i => $(i).addEventListener('change', trRender));
  });

  // ═══════════════════════════════════════════════════════════════
  // INICIALIZAÇÃO
  // ═══════════════════════════════════════════════════════════════
  function init() {
    const sl = $('seletorLiga');
    if (sl) sl.addEventListener('change', () => { D.res = []; GMDslug = null; RN.ini = Infinity; RN.lastMax = Infinity; notificar(); carregar(); });
    carregar();
    setInterval(() => { if (!document.hidden) carregar(); }, 10000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) carregar(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.PENALTIS_GRAF = { D, grupos, ultimasHoras, carregar, notificar };
})();
