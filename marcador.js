/**
 * MARCADOR.JS — Ferramenta de anotação global para BetStat
 * Uso: <script src="marcador.js"></script>
 *
 * Canvas cobre TODA a página (position:fixed, full viewport).
 * Quando ativo, você desenha em qualquer lugar da tela.
 * O botão é injetado automaticamente na .seletor-container.
 */
(function () {
  'use strict';

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
    }
    #btnMarcador:hover {
      border-color: #1fac89;
      background: rgba(31,172,137,0.25);
      color: #26d4a7;
      box-shadow: 0 0 20px rgba(31,172,137,0.18);
    }
    #btnMarcador.mrc-active {
      background: rgba(31,172,137,0.22);
      border-color: #1fac89;
      color: #fff;
      box-shadow: 0 0 20px rgba(31,172,137,0.25);
    }
    #btnMarcador svg { width: 12px; height: 12px; flex-shrink: 0; }

    /* Canvas global — cobre toda a viewport */
    #mrcCanvas {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 99998;
      display: none;
      cursor: crosshair;
      touch-action: none;
      background: transparent !important; /* CORREÇÃO AQUI: Força o fundo a ser transparente */
    }
    body.mrc-is-active #mrcCanvas { display: block; } /* CORREÇÃO AQUI: Mudança de classe para evitar conflitos */

    /* Toolbar lateral direita */
    #mrcToolbar {
      position: fixed;
      right: 14px;
      top: 50%;
      transform: translateY(-50%) translateX(10px);
      width: 48px;
      background: #1e2229;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 8px 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 24px rgba(31,172,137,0.15);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s, transform 0.22s;
      z-index: 99999;
    }
    body.mrc-is-active #mrcToolbar {
      opacity: 1;
      pointer-events: all;
      transform: translateY(-50%) translateX(0);
    }

    .mrc-btn {
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid transparent;
      background: transparent;
      color: rgba(255,255,255,0.3);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.13s;
      flex-shrink: 0;
      position: relative;
      padding: 0;
    }
    .mrc-btn svg { width: 15px; height: 15px; }
    .mrc-btn:hover {
      background: rgba(31,172,137,0.12);
      color: #26d4a7;
      border-color: rgba(31,172,137,0.25);
    }
    .mrc-btn.mrc-sel {
      background: rgba(31,172,137,0.22);
      border-color: rgba(31,172,137,0.55);
      color: #26d4a7;
      box-shadow: 0 0 10px rgba(31,172,137,0.18);
    }
    .mrc-btn.mrc-danger:hover { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.3); }
    .mrc-btn.mrc-warn:hover   { background: rgba(251,191,36,0.1);  color: #fbbf24; border-color: rgba(251,191,36,0.3); }

    /* Tooltip */
    .mrc-btn[data-tip]::after {
      content: attr(data-tip);
      position: absolute;
      right: calc(100% + 10px);
      top: 50%; transform: translateY(-50%);
      background: #2a2f3a;
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.85);
      font-size: 10px;
      font-family: monospace;
      padding: 4px 9px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: opacity 0.14s;
    }
    .mrc-btn[data-tip]:hover::after { opacity: 1; }

    .mrc-sep { width: 28px; height: 1px; background: rgba(255,255,255,0.06); margin: 3px 0; flex-shrink: 0; }

    .mrc-color-wrap {
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; padding: 5px;
      transition: border-color 0.13s;
    }
    .mrc-color-wrap:hover { border-color: rgba(31,172,137,0.4); }
    #mrcColor {
      width: 100%; height: 100%;
      border: none; padding: 0;
      cursor: pointer; background: transparent; border-radius: 6px;
    }

    .mrc-size-wrap { display: flex; align-items: center; justify-content: center; height: 68px; }
    #mrcSize {
      writing-mode: vertical-lr;
      direction: rtl;
      width: 24px; height: 58px;
      accent-color: #1fac89; cursor: pointer;
    }

    /* Badge topo centro */
    #mrcBadge {
      position: fixed;
      top: 12px; left: 50%;
      transform: translateX(-50%);
      background: #1e2229;
      border: 1px solid rgba(31,172,137,0.4);
      border-radius: 20px;
      padding: 5px 18px;
      font-size: 11px;
      font-family: monospace;
      color: #1fac89;
      letter-spacing: 0.09em; text-transform: uppercase;
      white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: opacity 0.22s;
      box-shadow: 0 4px 20px rgba(31,172,137,0.12);
      display: flex; align-items: center; gap: 8px;
      z-index: 99999;
    }
    body.mrc-is-active #mrcBadge { opacity: 1; }
    .mrc-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #1fac89; flex-shrink: 0;
      animation: mrcPulse 2s ease-in-out infinite;
    }
    @keyframes mrcPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }

    /* Botão fechar (canto superior esquerdo) */
    #mrcBtnFechar {
      position: fixed;
      top: 12px; left: 14px;
      height: 32px; padding: 0 13px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.1);
      background: #1e2229;
      color: rgba(255,255,255,0.35);
      cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; font-family: monospace;
      letter-spacing: 0.05em;
      transition: all 0.13s;
      opacity: 0;
      pointer-events: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.45);
      z-index: 99999;
    }
    body.mrc-is-active #mrcBtnFechar { opacity: 1; pointer-events: all; }
    #mrcBtnFechar:hover { border-color: rgba(248,113,113,0.45); color: #f87171; background: rgba(248,113,113,0.07); }
    #mrcBtnFechar svg { width: 12px; height: 12px; }

    /* Contador (canto inferior direito) */
    #mrcContador {
      position: fixed;
      bottom: 14px; right: 70px;
      background: #1e2229;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 4px 11px;
      font-size: 10px; font-family: monospace;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.06em;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s;
      z-index: 99999;
    }
    body.mrc-is-active #mrcContador { opacity: 1; }

    /* Input de texto flutuante */
    #mrcTextInput {
      position: fixed;
      background: transparent; border: none;
      border-bottom: 1.5px solid #1fac89;
      color: #fff; outline: none;
      padding: 2px 6px; z-index: 100000; display: none;
      caret-color: #1fac89; font-family: monospace;
    }
  `;

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

  // Injetar CSS
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function init() {

    // ── Canvas GLOBAL (full viewport, fixed) ─────────────────────
    var canvas = document.createElement('canvas');
    canvas.id = 'mrcCanvas';
    document.body.appendChild(canvas);

    // ── Toolbar ──────────────────────────────────────────────────
    var toolbar = document.createElement('div');
    toolbar.id = 'mrcToolbar';
    toolbar.innerHTML =
      '<button class="mrc-btn mrc-sel" data-tool="linha"     data-tip="Linha - L">'     + svg.linha    + '</button>' +
      '<button class="mrc-btn"         data-tool="seta"      data-tip="Seta - A">'       + svg.seta     + '</button>' +
      '<button class="mrc-btn"         data-tool="caneta"    data-tip="Caneta - P">'     + svg.caneta   + '</button>' +
      '<button class="mrc-btn"         data-tool="retangulo" data-tip="Retangulo - R">'  + svg.rect     + '</button>' +
      '<button class="mrc-btn"         data-tool="circulo"   data-tip="Circulo - C">'    + svg.circle   + '</button>' +
      '<button class="mrc-btn"         data-tool="texto"     data-tip="Texto - T">'      + svg.texto    + '</button>' +
      '<button class="mrc-btn"         data-tool="borracha"  data-tip="Borracha - E">'   + svg.borracha + '</button>' +
      '<div class="mrc-sep"></div>' +
      '<div class="mrc-color-wrap" title="Cor"><input id="mrcColor" type="color" value="#1fac89"></div>' +
      '<div class="mrc-size-wrap"><input id="mrcSize" type="range" min="1" max="40" value="3" title="Espessura"></div>' +
      '<div class="mrc-sep"></div>' +
      '<button class="mrc-btn mrc-warn"   id="mrcUndo"   data-tip="Desfazer - Ctrl+Z">' + svg.undo    + '</button>' +
      '<button class="mrc-btn mrc-danger" id="mrcLimpar" data-tip="Apagar tudo - Del">' + svg.lixeira + '</button>';
    document.body.appendChild(toolbar);

    // ── Badge ─────────────────────────────────────────────────────
    var badge = document.createElement('div');
    badge.id = 'mrcBadge';
    badge.innerHTML = '<span class="mrc-dot"></span> modo marcacao';
    document.body.appendChild(badge);

    // ── Botão fechar ──────────────────────────────────────────────
    var btnFechar = document.createElement('button');
    btnFechar.id = 'mrcBtnFechar';
    btnFechar.innerHTML = svg.close + ' sair';
    document.body.appendChild(btnFechar);

    // ── Contador ──────────────────────────────────────────────────
    var contador = document.createElement('div');
    contador.id = 'mrcContador';
    contador.textContent = '0 marcacoes';
    document.body.appendChild(contador);

    // ── Input de texto flutuante ─────────────────────────────────
    var textInput = document.createElement('input');
    textInput.id = 'mrcTextInput';
    textInput.type = 'text';
    textInput.placeholder = 'escreva... Enter pra confirmar';
    document.body.appendChild(textInput);

    // ── Botão Marcar (injetado na .seletor-container) ─────────────
    var btnAbrir = document.createElement('button');
    btnAbrir.id = 'btnMarcador';
    btnAbrir.innerHTML = svg.pencil + ' Marcar';
    var parentSel = window.MARCADOR_PARENT || '.seletor-container';
    var btnParent = document.querySelector(parentSel);
    if (btnParent) {
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:inline-flex;align-items:center;margin-left:4px;';
      wrap.appendChild(btnAbrir);
      btnParent.appendChild(wrap);
    } else {
      document.body.appendChild(btnAbrir);
    }

    // ── Contexto e estado ─────────────────────────────────────────
    var ctx = canvas.getContext('2d');
    var ferramenta = 'linha', desenhando = false;
    var startX = 0, startY = 0, snapshot = null;
    var historico = [], aberto = false, totalMarcacoes = 0;

    // Canvas sempre do tamanho da viewport
    function resizeCanvas() {
      // Salva desenho atual
      var img = (canvas.width > 0 && canvas.height > 0)
        ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      if (img) ctx.putImageData(img, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', function() { if (aberto) resizeCanvas(); });

    function atualizarContador() {
      contador.textContent = totalMarcacoes + (totalMarcacoes === 1 ? ' marcacao' : ' marcacoes');
    }

    function abrir() {
      if (!aberto) resizeCanvas();
      document.body.classList.add('mrc-is-active');
      btnAbrir.classList.add('mrc-active');
      btnAbrir.innerHTML = svg.pencil + ' Sair';
      aberto = true;
    }

    function fechar() {
      document.body.classList.remove('mrc-is-active');
      btnAbrir.classList.remove('mrc-active');
      btnAbrir.innerHTML = svg.pencil + ' Marcar';
      fecharTexto();
      aberto = false;
    }

    btnAbrir.addEventListener('click', function() { aberto ? fechar() : abrir(); });
    btnFechar.addEventListener('click', fechar);

    // Selecionar ferramenta
    toolbar.querySelectorAll('[data-tool]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        ferramenta = btn.dataset.tool;
        toolbar.querySelectorAll('[data-tool]').forEach(function(b) { b.classList.remove('mrc-sel'); });
        btn.classList.add('mrc-sel');
        canvas.style.cursor = ferramenta === 'borracha' ? 'cell' : 'crosshair';
      });
    });

    var colorEl   = document.getElementById('mrcColor');
    var sizeEl    = document.getElementById('mrcSize');
    var btnDesfaz = document.getElementById('mrcUndo');
    var btnLimpar = document.getElementById('mrcLimpar');

    var getCor = function() { return colorEl.value; };
    var getTam = function() { return parseInt(sizeEl.value); };

    function salvarHistorico() {
      historico.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (historico.length > 80) historico.shift();
    }

    // Posição do cursor já em coords de canvas (canvas = viewport, então é direto)
    function getPos(e) {
      var s = e.touches ? e.touches[0] : e;
      return { x: s.clientX, y: s.clientY };
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

    // Texto flutuante
    var tx = 0, ty = 0;
    function abrirTexto(x, y) {
      tx = x; ty = y;
      textInput.style.left = x + 'px';
      textInput.style.top  = (y - 24) + 'px';
      textInput.style.color     = getCor();
      textInput.style.fontSize  = Math.max(14, getTam() * 4) + 'px';
      textInput.style.display   = 'block';
      textInput.value = ''; textInput.focus();
    }
    function fecharTexto() { textInput.style.display = 'none'; textInput.value = ''; }

    textInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var txt = textInput.value.trim();
        if (txt) {
          salvarHistorico();
          ctx.font = Math.max(14, getTam() * 4) + 'px monospace';
          ctx.fillStyle = getCor();
          ctx.fillText(txt, tx, ty);
          totalMarcacoes++; 
          atualizarContador();
        }
        fecharTexto();
      }
      if (e.key === 'Escape') fecharTexto();
    });

    // Desenhar formas
    function desenharForma(x, y) {
      ctx.putImageData(snapshot, 0, 0); aplicarEstilo();
      if (ferramenta === 'linha') {
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(x, y); ctx.stroke();
      } else if (ferramenta === 'seta') {
        var ang = Math.atan2(y - startY, x - startX);
        var hl  = Math.max(14, getTam() * 5);
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

    canvas.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var pos = getPos(e);
      if (ferramenta === 'texto') { abrirTexto(pos.x, pos.y); return; }
      desenhando = true; startX = pos.x; startY = pos.y;
      salvarHistorico(); aplicarEstilo();
      if (ferramenta === 'caneta' || ferramenta === 'borracha') {
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
      } else {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
    });

    canvas.addEventListener('mousemove', function(e) {
      e.preventDefault();
      if (!desenhando) return;
      var pos = getPos(e); aplicarEstilo();
      if (ferramenta === 'caneta') {
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
      } else if (ferramenta === 'borracha') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = getTam() * 6; ctx.lineTo(pos.x, pos.y); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } 
      else {
        desenharForma(pos.x, pos.y);
      }
    });

    function pararDesenho(e) {
      if (e) e.preventDefault();
      if (!desenhando) return;
      desenhando = false;
      if (ferramenta === 'borracha') ctx.globalCompositeOperation = 'source-over';
      if (ferramenta !== 'texto') { totalMarcacoes++; atualizarContador(); }
    }

    canvas.addEventListener('mouseup',    pararDesenho);
    canvas.addEventListener('mouseleave', pararDesenho);

    canvas.addEventListener('touchstart', function(e) {
      e.preventDefault();
      var pos = getPos(e);
      if (ferramenta === 'texto') { abrirTexto(pos.x, pos.y); return; }
      desenhando = true; startX = pos.x; startY = pos.y;
      salvarHistorico(); aplicarEstilo();
      if (ferramenta === 'caneta' || ferramenta === 'borracha') {
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
      } else {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', function(e) {
      e.preventDefault();
      if (!desenhando) return;
      var pos = getPos(e); aplicarEstilo();
      if (ferramenta === 'caneta') { ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
      else if (ferramenta === 'borracha') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = getTam() * 6; ctx.lineTo(pos.x, pos.y); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else { desenharForma(pos.x, pos.y); }
    }, { passive: false });
    canvas.addEventListener('touchend', pararDesenho, { passive: false });

    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
      if (!aberto || document.activeElement === textInput) return;
      var mapa = { p:'caneta', l:'linha', a:'seta', r:'retangulo', c:'circulo', t:'texto', e:'borracha' };
      var tool = mapa[e.key.toLowerCase()];
      if (tool) {
        var btn = toolbar.querySelector('[data-tool="' + tool + '"]');
        if (btn) btn.click();
      }
      if (e.key === 'Escape') fechar();
      if (e.key === 'Delete') btnLimpar.click();
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); desfazer(); }
    });

    atualizarContador();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();