/**
 * MARCADOR.JS — Ferramenta de anotação para BetStat
 * Uso: <script src="marcador.js"></script>  ← só isso!
 *
 * O script detecta automaticamente a estrutura da página:
 *  - Cria o botão e injeta na .seletor-container
 *  - Cobre a #tabelaResultados com o canvas
 *
 * Configuração opcional (antes do script):
 *   window.MARCADOR_TARGET = '#meuElemento'   // seletor do elemento alvo
 *   window.MARCADOR_PARENT = '.meu-container' // onde injetar o botão
 */
(function () {
  'use strict';

  // ── CSS ────────────────────────────────────────────────────────────
  const css = `
    #btnMarcador {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 5px 12px;
      border-radius: 8px;
      border: 1px solid rgba(31,172,137,0.35);
      background: rgba(31,172,137,0.12);
      color: #1fac89;
      font-size: 11px;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
      font-family: inherit;
      height: 30px;
      vertical-align: middle;
    }
    #btnMarcador:hover {
      border-color: #1fac89;
      background: rgba(31,172,137,0.25);
      color: #26d4a7;
      box-shadow: 0 0 20px rgba(31,172,137,0.18);
    }
    #btnMarcador.mrc-active {
      border-color: #1fac89;
      background: rgba(31,172,137,0.25);
      color: #fff;
      box-shadow: 0 0 20px rgba(31,172,137,0.18);
    }
    #btnMarcador svg { width: 12px; height: 12px; flex-shrink: 0; }

    #mrcRoot {
      position: absolute;
      inset: 0;
      z-index: 999;
      pointer-events: none;
      overflow: hidden;
      border-radius: inherit;
    }
    #mrcRoot.mrc-active { pointer-events: all; }

    #mrcRoot::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(28,31,38,0.15);
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    #mrcRoot.mrc-active::before { opacity: 1; }

    #mrcRoot.mrc-active::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 1.5px solid rgba(31,172,137,0.4);
      border-radius: inherit;
      pointer-events: none;
      animation: mrc-border 2.5s ease-in-out infinite;
    }
    @keyframes mrc-border {
      0%,100% { border-color: rgba(31,172,137,0.4); }
      50%      { border-color: rgba(31,172,137,0.1); }
    }

    #mrcCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      cursor: crosshair;
      display: block;
    }

    /* Toolbar — fixed para ficar visível mesmo com scroll na tabela */
    #mrcToolbar {
      position: fixed;
      right: 16px;
      top: 50%;
      transform: translateY(-50%) translateX(8px);
      width: 48px;
      background: #22262f;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 8px 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 24px rgba(31,172,137,0.18);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s, transform 0.25s;
      z-index: 10000;
    }
    body.mrc-open #mrcToolbar {
      opacity: 1;
      pointer-events: all;
      transform: translateY(-50%) translateX(0);
    }

    .mrc-btn {
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid transparent;
      background: transparent;
      color: rgba(255,255,255,0.35);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.14s;
      flex-shrink: 0;
      position: relative;
      padding: 0;
    }
    .mrc-btn svg { width: 15px; height: 15px; }
    .mrc-btn:hover {
      background: rgba(31,172,137,0.12);
      color: #26d4a7;
      border-color: rgba(31,172,137,0.2);
    }
    .mrc-btn.mrc-active {
      background: rgba(31,172,137,0.25);
      border-color: rgba(31,172,137,0.5);
      color: #26d4a7;
      box-shadow: 0 0 12px rgba(31,172,137,0.2);
    }
    .mrc-btn.mrc-danger:hover { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.25); }
    .mrc-btn.mrc-warn:hover   { background: rgba(251,191,36,0.1);  color: #fbbf24; border-color: rgba(251,191,36,0.25); }

    .mrc-btn::after {
      content: attr(data-tip);
      position: absolute;
      right: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
      background: #2f3542;
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.85);
      font-size: 10px;
      font-family: monospace;
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s;
      letter-spacing: 0.04em;
    }
    .mrc-btn:hover::after { opacity: 1; }

    .mrc-sep { width: 26px; height: 1px; background: rgba(255,255,255,0.07); margin: 3px 0; flex-shrink: 0; }

    .mrc-color-wrap {
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; padding: 5px;
      transition: border-color 0.14s;
    }
    .mrc-color-wrap:hover { border-color: rgba(31,172,137,0.4); }
    #mrcColor { width: 100%; height: 100%; border: none; padding: 0; cursor: pointer; background: transparent; border-radius: 6px; }

    .mrc-size-wrap { display: flex; align-items: center; justify-content: center; height: 64px; }
    #mrcSize { writing-mode: vertical-lr; direction: rtl; width: 24px; height: 56px; accent-color: #1fac89; cursor: pointer; }

    #mrcBadge {
      position: fixed;
      top: 14px; left: 50%;
      transform: translateX(-50%);
      background: #22262f;
      border: 1px solid rgba(31,172,137,0.35);
      border-radius: 20px;
      padding: 5px 16px;
      font-size: 11px; font-family: monospace;
      color: #1fac89;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.25s;
      pointer-events: none;
      box-shadow: 0 4px 20px rgba(31,172,137,0.15);
      display: flex; align-items: center; gap: 7px;
      z-index: 10001;
    }
    body.mrc-open #mrcBadge { opacity: 1; }

    .mrc-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #1fac89; flex-shrink: 0;
      animation: mrc-pulse 2s ease-in-out infinite;
    }
    @keyframes mrc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

    #mrcBtnFechar {
      position: fixed;
      top: 14px; left: 16px;
      height: 32px; padding: 0 12px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.12);
      background: #22262f;
      color: rgba(255,255,255,0.35);
      cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; font-family: monospace;
      letter-spacing: 0.05em;
      transition: all 0.14s;
      opacity: 0; pointer-events: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      z-index: 10001;
    }
    body.mrc-open #mrcBtnFechar { opacity: 1; pointer-events: all; }
    #mrcBtnFechar:hover { border-color: rgba(248,113,113,0.4); color: #f87171; background: rgba(248,113,113,0.06); }
    #mrcBtnFechar svg { width: 12px; height: 12px; }

    #mrcContador {
      position: fixed;
      bottom: 14px; right: 76px;
      background: #22262f;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 10px; font-family: monospace;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.06em;
      opacity: 0; transition: opacity 0.2s;
      pointer-events: none;
      z-index: 10001;
    }
    body.mrc-open #mrcContador { opacity: 1; }

    #mrcTextInput {
      position: absolute;
      background: transparent; border: none;
      border-bottom: 1.5px solid #1fac89;
      color: #fff; font-size: 15px; font-family: monospace;
      outline: none; min-width: 140px;
      padding: 2px 6px; z-index: 20; display: none;
      caret-color: #1fac89;
    }
  `;

  // ── SVGs ──────────────────────────────────────────────────────────
  const svg = {
    pencil:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
    close:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    linha:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="19" x2="19" y2="5"/></svg>',
    seta:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="9,5 19,5 19,15"/></svg>',
    caneta:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    rect:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
    circle:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/></svg>',
    texto:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="4,7 4,4 20,4 20,7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    borracha:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H7L3 16l9-9 8 8-3 3z"/><path d="M6.5 17.5l5-5"/></svg>',
    undo:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,14 4,19 4,14"/><path d="M20 9a4 4 0 0 0-4-4H4"/><path d="M4 19h8a8 8 0 0 0 8-8"/></svg>',
    lixeira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>',
  };

  // ── Injetar CSS ───────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    // Elemento alvo (onde o canvas fica por cima)
    const targetSel = window.MARCADOR_TARGET || '#tabelaResultados';
    const target    = document.querySelector(targetSel);
    if (!target) { console.warn('[Marcador] Elemento alvo não encontrado:', targetSel); return; }

    // Garante position relative no target
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';

    // ─ Criar botão e injetar na .seletor-container
    const btnAbrir = document.createElement('button');
    btnAbrir.id = 'btnMarcador';
    btnAbrir.innerHTML = svg.pencil + ' Marcar';

    const parentSel = window.MARCADOR_PARENT || '.seletor-container';
    const btnParent = document.querySelector(parentSel);
    if (btnParent) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:inline-flex;align-items:center;';
      wrap.appendChild(btnAbrir);
      btnParent.appendChild(wrap);
    } else {
      target.parentElement.insertBefore(btnAbrir, target);
    }

    // ─ Root do marcador (canvas overlay) — dentro do target
    const root = document.createElement('div');
    root.id = 'mrcRoot';
    root.innerHTML = '<canvas id="mrcCanvas"></canvas><input id="mrcTextInput" type="text" placeholder="escreva... Enter pra confirmar">';
    target.appendChild(root);

    // ─ Elementos fixed (fora do root, no body)
    const toolbar = document.createElement('div');
    toolbar.id = 'mrcToolbar';
    toolbar.innerHTML =
      '<button class="mrc-btn mrc-active" data-tool="linha"     data-tip="Linha - L">'     + svg.linha   + '</button>' +
      '<button class="mrc-btn"            data-tool="seta"      data-tip="Seta - A">'       + svg.seta    + '</button>' +
      '<button class="mrc-btn"            data-tool="caneta"    data-tip="Caneta - P">'     + svg.caneta  + '</button>' +
      '<button class="mrc-btn"            data-tool="retangulo" data-tip="Retangulo - R">'  + svg.rect    + '</button>' +
      '<button class="mrc-btn"            data-tool="circulo"   data-tip="Circulo - C">'    + svg.circle  + '</button>' +
      '<button class="mrc-btn"            data-tool="texto"     data-tip="Texto - T">'      + svg.texto   + '</button>' +
      '<button class="mrc-btn"            data-tool="borracha"  data-tip="Borracha - E">'   + svg.borracha+ '</button>' +
      '<div class="mrc-sep"></div>' +
      '<div class="mrc-color-wrap" data-tip="Cor"><input id="mrcColor" type="color" value="#1fac89"></div>' +
      '<div class="mrc-size-wrap"><input id="mrcSize" type="range" min="1" max="40" value="3" data-tip="Espessura"></div>' +
      '<div class="mrc-sep"></div>' +
      '<button class="mrc-btn mrc-warn"   id="mrcUndo"   data-tip="Desfazer - Ctrl+Z">' + svg.undo    + '</button>' +
      '<button class="mrc-btn mrc-danger" id="mrcLimpar" data-tip="Apagar tudo - Del">' + svg.lixeira + '</button>';

    const badge = document.createElement('div');
    badge.id = 'mrcBadge';
    badge.innerHTML = '<span class="mrc-dot"></span> modo marcacao';

    const btnFechar = document.createElement('button');
    btnFechar.id = 'mrcBtnFechar';
    btnFechar.innerHTML = svg.close + ' sair';

    const contador = document.createElement('div');
    contador.id = 'mrcContador';
    contador.textContent = '0 marcacoes';

    document.body.appendChild(toolbar);
    document.body.appendChild(badge);
    document.body.appendChild(btnFechar);
    document.body.appendChild(contador);

    // ── Referências ──────────────────────────────────────────────
    const canvas    = root.querySelector('#mrcCanvas');
    const colorEl   = toolbar.querySelector('#mrcColor');
    const sizeEl    = toolbar.querySelector('#mrcSize');
    const btnDesfaz = toolbar.querySelector('#mrcUndo');
    const btnLimpar = toolbar.querySelector('#mrcLimpar');
    const textInput = root.querySelector('#mrcTextInput');
    const ctx       = canvas.getContext('2d');

    let ferramenta = 'linha', desenhando = false;
    let startX = 0, startY = 0, snapshot = null;
    let historico = [], aberto = false, totalMarcacoes = 0;

    function atualizarContador() {
      contador.textContent = totalMarcacoes + (totalMarcacoes === 1 ? ' marcacao' : ' marcacoes');
    }

    function resizeCanvas() {
      var img = canvas.width > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
      canvas.width  = target.offsetWidth;
      canvas.height = target.offsetHeight;
      if (img) ctx.putImageData(img, 0, 0);
    }

    function abrir() {
      resizeCanvas();
      root.classList.add('mrc-active');
      document.body.classList.add('mrc-open');
      btnAbrir.classList.add('mrc-active');
      btnAbrir.innerHTML = svg.pencil + ' Sair';
      aberto = true;
    }

    function fechar() {
      root.classList.remove('mrc-active');
      document.body.classList.remove('mrc-open');
      btnAbrir.classList.remove('mrc-active');
      btnAbrir.innerHTML = svg.pencil + ' Marcar';
      fecharTexto();
      aberto = false;
    }

    btnAbrir.addEventListener('click', function() { aberto ? fechar() : abrir(); });
    btnFechar.addEventListener('click', fechar);

    toolbar.querySelectorAll('[data-tool]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        ferramenta = btn.dataset.tool;
        toolbar.querySelectorAll('[data-tool]').forEach(function(b) { b.classList.remove('mrc-active'); });
        btn.classList.add('mrc-active');
        canvas.style.cursor = ferramenta === 'borracha' ? 'cell' : 'crosshair';
      });
    });

    var getCor = function() { return colorEl.value; };
    var getTam = function() { return parseInt(sizeEl.value); };

    function salvarHistorico() {
      historico.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (historico.length > 80) historico.shift();
    }

    function getPos(e) {
      var r = canvas.getBoundingClientRect();
      var s = e.touches ? e.touches[0] : e;
      return { x: (s.clientX - r.left) * (canvas.width / r.width), y: (s.clientY - r.top) * (canvas.height / r.height) };
    }

    function aplicarEstilo() {
      ctx.strokeStyle = getCor(); ctx.fillStyle = getCor();
      ctx.lineWidth = getTam(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }

    function desfazer() {
      if (!historico.length) return;
      ctx.putImageData(historico.pop(), 0, 0);
      totalMarcacoes = Math.max(0, totalMarcacoes - 1);
      atualizarContador();
    }
    btnDesfaz.addEventListener('click', desfazer);

    btnLimpar.addEventListener('click', function() {
      salvarHistorico();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      totalMarcacoes = 0; atualizarContador();
    });

    var tx = 0, ty = 0;
    function abrirTexto(x, y) {
      tx = x; ty = y;
      textInput.style.left = x + 'px'; textInput.style.top = (y - 22) + 'px';
      textInput.style.color = getCor(); textInput.style.fontSize = Math.max(14, getTam() * 4) + 'px';
      textInput.style.display = 'block'; textInput.value = ''; textInput.focus();
    }
    function fecharTexto() { textInput.style.display = 'none'; textInput.value = ''; }

    textInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var txt = textInput.value.trim();
        if (txt) {
          salvarHistorico();
          ctx.font = Math.max(14, getTam() * 4) + 'px monospace';
          ctx.fillStyle = getCor(); ctx.fillText(txt, tx, ty);
          totalMarcacoes++; atualizarContador();
        }
        fecharTexto();
      }
      if (e.key === 'Escape') fecharTexto();
    });

    function desenharForma(x, y) {
      ctx.putImageData(snapshot, 0, 0); aplicarEstilo();
      if (ferramenta === 'linha') {
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(x, y); ctx.stroke();
      } else if (ferramenta === 'seta') {
        var ang = Math.atan2(y - startY, x - startX), hl = Math.max(14, getTam() * 4);
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(x, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x - hl * Math.cos(ang - Math.PI/6), y - hl * Math.sin(ang - Math.PI/6));
        ctx.lineTo(x - hl * Math.cos(ang + Math.PI/6), y - hl * Math.sin(ang + Math.PI/6));
        ctx.closePath(); ctx.fill();
      } else if (ferramenta === 'retangulo') {
        ctx.strokeRect(startX, startY, x - startX, y - startY);
      } else if (ferramenta === 'circulo') {
        var rx = (x - startX) / 2, ry = (y - startY) / 2;
        ctx.beginPath(); ctx.ellipse(startX + rx, startY + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2); ctx.stroke();
      }
    }

    function aoIniciar(e) {
      e.preventDefault();
      var pos = getPos(e);
      if (ferramenta === 'texto') { abrirTexto(pos.x, pos.y); return; }
      desenhando = true; startX = pos.x; startY = pos.y;
      salvarHistorico(); aplicarEstilo();
      if (ferramenta === 'caneta' || ferramenta === 'borracha') { ctx.beginPath(); ctx.moveTo(pos.x, pos.y); }
      else snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function aoMover(e) {
      e.preventDefault();
      if (!desenhando) return;
      var pos = getPos(e); aplicarEstilo();
      if (ferramenta === 'caneta') { ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
      else if (ferramenta === 'borracha') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = getTam() * 5; ctx.lineTo(pos.x, pos.y); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else desenharForma(pos.x, pos.y);
    }

    function aoSoltar(e) {
      e.preventDefault();
      if (!desenhando) return;
      desenhando = false;
      if (ferramenta === 'borracha') ctx.globalCompositeOperation = 'source-over';
      if (ferramenta !== 'texto') { totalMarcacoes++; atualizarContador(); }
    }

    canvas.addEventListener('mousedown',  aoIniciar);
    canvas.addEventListener('mousemove',  aoMover);
    canvas.addEventListener('mouseup',    aoSoltar);
    canvas.addEventListener('mouseleave', aoSoltar);
    canvas.addEventListener('touchstart', aoIniciar, { passive: false });
    canvas.addEventListener('touchmove',  aoMover,   { passive: false });
    canvas.addEventListener('touchend',   aoSoltar,  { passive: false });

    document.addEventListener('keydown', function(e) {
      if (!aberto || document.activeElement === textInput) return;
      var mapa = { p:'caneta', l:'linha', a:'seta', r:'retangulo', c:'circulo', t:'texto', e:'borracha' };
      var tool = mapa[e.key.toLowerCase()];
      if (tool) { var el = toolbar.querySelector('[data-tool="' + tool + '"]'); if (el) el.click(); }
      if (e.key === 'Escape') fechar();
      if (e.key === 'Delete') btnLimpar.click();
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); desfazer(); }
    });

    new ResizeObserver(function() { if (aberto) resizeCanvas(); }).observe(target);
    atualizarContador();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();