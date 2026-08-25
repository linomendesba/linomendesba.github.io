/**
 * MARCADOR.JS — Ferramenta de anotação global para BetStat
 * Uso: <script src="marcador.js"></script>
 *
 * Canvas cobre TODA a página (position:fixed, full viewport).
 * Quando ativo, você desenha em qualquer lugar da tela.
 * O botão é injetado automaticamente na .seletor-container.
 *
 * v2 — paleta 1b7ca5 / 061319, botão "Sair" movido para dentro do painel,
 * + ferramentas: marca-texto, preenchimento, presets de cor, opacidade,
 * exportar PNG, e Shift para travar linha/quadrado/círculo perfeito.
 */
(function () {
  'use strict';

  const css = `
    :root {
      --mrc-accent: #1b7ca5;
      --mrc-accent-bright: #34a7dd;
      --mrc-accent-rgb: 27,124,165;
      --mrc-bg: #061319;
      --mrc-bg2: #0b2029;
      --mrc-bg3: #0e2731;
      --mrc-border: rgba(27,124,165,0.35);
    }

    #btnMarcador {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 5px 12px;
      border-radius: 8px;
      border: 1px solid rgba(var(--mrc-accent-rgb),0.35);
      background: rgba(var(--mrc-accent-rgb),0.12);
      color: var(--mrc-accent);
      font-size: 11px;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
      font-family: inherit;
      height: 30px;
    }
    #btnMarcador:hover {
      border-color: var(--mrc-accent);
      background: rgba(var(--mrc-accent-rgb),0.25);
      color: var(--mrc-accent-bright);
      box-shadow: 0 0 20px rgba(var(--mrc-accent-rgb),0.18);
    }
    #btnMarcador.mrc-active {
      background: rgba(var(--mrc-accent-rgb),0.22);
      border-color: var(--mrc-accent);
      color: #fff;
      box-shadow: 0 0 20px rgba(var(--mrc-accent-rgb),0.25);
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
      background: transparent !important;
    }
    body.mrc-is-active #mrcCanvas { display: block; }

    /* Painel lateral direito — agora inclui o botão de sair no topo */
    #mrcToolbar {
      position: fixed;
      right: 14px;
      top: 50%;
      transform: translateY(-50%) translateX(10px);
      width: 48px;
      max-height: 94vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: var(--mrc-bg2);
      border: 1px solid var(--mrc-border);
      border-radius: 16px;
      padding: 8px 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 24px rgba(var(--mrc-accent-rgb),0.15);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s, transform 0.22s;
      z-index: 99999;
      scrollbar-width: thin;
      scrollbar-color: var(--mrc-accent) transparent;
    }
    #mrcToolbar::-webkit-scrollbar { width: 4px; }
    #mrcToolbar::-webkit-scrollbar-thumb { background: rgba(var(--mrc-accent-rgb),0.5); border-radius: 4px; }
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
      background: rgba(var(--mrc-accent-rgb),0.12);
      color: var(--mrc-accent-bright);
      border-color: rgba(var(--mrc-accent-rgb),0.25);
    }
    .mrc-btn.mrc-sel {
      background: rgba(var(--mrc-accent-rgb),0.22);
      border-color: rgba(var(--mrc-accent-rgb),0.55);
      color: var(--mrc-accent-bright);
      box-shadow: 0 0 10px rgba(var(--mrc-accent-rgb),0.18);
    }
    .mrc-btn.mrc-danger:hover { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.3); }
    .mrc-btn.mrc-warn:hover   { background: rgba(251,191,36,0.1);  color: #fbbf24; border-color: rgba(251,191,36,0.3); }
    .mrc-btn.mrc-ok:hover     { background: rgba(52,211,153,0.1);  color: #34d399; border-color: rgba(52,211,153,0.3); }

    /* Botão sair — agora fixo no topo do próprio painel */
    #mrcBtnFechar {
      background: rgba(248,113,113,0.08);
      color: #f87171;
      border-color: rgba(248,113,113,0.25);
      margin-bottom: 4px;
    }
    #mrcBtnFechar:hover {
      background: rgba(248,113,113,0.18);
      border-color: rgba(248,113,113,0.5);
      color: #fca5a5;
    }

    /* Tooltip */
    .mrc-btn[data-tip]::after {
      content: attr(data-tip);
      position: absolute;
      right: calc(100% + 10px);
      top: 50%; transform: translateY(-50%);
      background: var(--mrc-bg3);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.85);
      font-size: 10px;
      font-family: monospace;
      padding: 4px 9px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: opacity 0.14s;
      z-index: 5;
    }
    .mrc-btn[data-tip]:hover::after { opacity: 1; }

    .mrc-sep { width: 28px; height: 1px; background: rgba(255,255,255,0.08); margin: 3px 0; flex-shrink: 0; }

    .mrc-color-wrap {
      width: 36px; height: 36px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; padding: 5px;
      transition: border-color 0.13s;
    }
    .mrc-color-wrap:hover { border-color: rgba(var(--mrc-accent-rgb),0.4); }
    #mrcColor {
      width: 100%; height: 100%;
      border: none; padding: 0;
      cursor: pointer; background: transparent; border-radius: 6px;
    }

    /* Presets de cor rápidos */
    .mrc-presets {
      display: flex; flex-wrap: wrap;
      width: 36px; gap: 4px;
      justify-content: center;
      padding: 3px 0 5px;
    }
    .mrc-preset {
      width: 12px; height: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.25);
      cursor: pointer;
      transition: transform 0.12s, border-color 0.12s;
      padding: 0;
    }
    .mrc-preset:hover { transform: scale(1.25); }
    .mrc-preset.mrc-preset-sel { border-color: #fff; box-shadow: 0 0 0 1px var(--mrc-accent); }

    .mrc-size-wrap { display: flex; align-items: center; justify-content: center; height: 58px; }
    #mrcSize {
      writing-mode: vertical-lr;
      direction: rtl;
      width: 24px; height: 50px;
      accent-color: var(--mrc-accent); cursor: pointer;
    }
    .mrc-opac-wrap { display: flex; align-items: center; justify-content: center; height: 46px; }
    #mrcOpacidade {
      writing-mode: vertical-lr;
      direction: rtl;
      width: 24px; height: 38px;
      accent-color: var(--mrc-accent-bright); cursor: pointer;
    }

    /* Badge topo centro */
    #mrcBadge {
      position: fixed;
      top: 12px; left: 50%;
      transform: translateX(-50%);
      background: var(--mrc-bg2);
      border: 1px solid rgba(var(--mrc-accent-rgb),0.4);
      border-radius: 20px;
      padding: 5px 18px;
      font-size: 11px;
      font-family: monospace;
      color: var(--mrc-accent);
      letter-spacing: 0.09em; text-transform: uppercase;
      white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: opacity 0.22s;
      box-shadow: 0 4px 20px rgba(var(--mrc-accent-rgb),0.12);
      display: flex; align-items: center; gap: 8px;
      z-index: 99999;
    }
    body.mrc-is-active #mrcBadge { opacity: 1; }
    .mrc-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--mrc-accent); flex-shrink: 0;
      animation: mrcPulse 2s ease-in-out infinite;
    }
    @keyframes mrcPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }

    /* Contador (canto inferior direito) */
    #mrcContador {
      position: fixed;
      bottom: 14px; right: 70px;
      background: var(--mrc-bg2);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 4px 11px;
      font-size: 10px; font-family: monospace;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.06em;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s;
      z-index: 99999;
    }
    body.mrc-is-active #mrcContador { opacity: 1; }

    /* Toast de exportação */
    #mrcToast {
      position: fixed;
      bottom: 14px; left: 50%;
      transform: translateX(-50%) translateY(10px);
      background: var(--mrc-bg2);
      border: 1px solid rgba(52,211,153,0.4);
      color: #34d399;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 11px; font-family: monospace;
      letter-spacing: 0.04em;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
      z-index: 100001;
    }
    #mrcToast.mrc-show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* Input de texto flutuante */
    #mrcTextInput {
      position: fixed;
      background: transparent; border: none;
      border-bottom: 1.5px solid var(--mrc-accent);
      color: #fff; outline: none;
      padding: 2px 6px; z-index: 100000; display: none;
      caret-color: var(--mrc-accent); font-family: monospace;
    }
  `;

  const svg = {
    pencil:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
    close:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    linha:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="19" x2="19" y2="5"/></svg>',
    seta:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="9,5 19,5 19,15"/></svg>',
    caneta:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    marcador: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l6-6 4 4-6 6"/><path d="M4 20l3-3h3l3 3-3 3H7z"/><path d="M12.5 8.5l3 3"/></svg>',
    rect:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
    circle:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/></svg>',
    texto:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="4,7 4,4 20,4 20,7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    borracha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H7L3 16l9-9 8 8-3 3z"/><path d="M6.5 17.5l5-5"/></svg>',
    balde:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11l-8-8-8.5 8.5a2 2 0 0 0 0 2.8L9 21l10-10z"/><path d="M4.5 12.5L14 3"/><path d="M17 15c1 1.5 2 2.6 2 4a2 2 0 1 1-4 0c0-1.4 1-2.5 2-4z"/></svg>',
    undo:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,14 4,19 4,14"/><path d="M20 9a4 4 0 0 0-4-4H4"/><path d="M4 19h8a8 8 0 0 0 8-8"/></svg>',
    lixeira:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  };

  const PRESETS = ['#1b7ca5', '#34a7dd', '#f87171', '#fbbf24', '#34d399', '#ffffff'];

  // Injetar CSS
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function init() {

    // ── Canvas GLOBAL (full viewport, fixed) ─────────────────────
    var canvas = document.createElement('canvas');
    canvas.id = 'mrcCanvas';
    document.body.appendChild(canvas);

    // ── Toolbar (inclui botão de sair no topo) ─────────────────────
    var toolbar = document.createElement('div');
    toolbar.id = 'mrcToolbar';
    toolbar.innerHTML =
      '<button class="mrc-btn" id="mrcBtnFechar" data-tip="Sair - Esc">' + svg.close + '</button>' +
      '<div class="mrc-sep"></div>' +
      '<button class="mrc-btn mrc-sel" data-tool="linha"     data-tip="Linha - L">'      + svg.linha    + '</button>' +
      '<button class="mrc-btn"         data-tool="seta"      data-tip="Seta - A">'        + svg.seta     + '</button>' +
      '<button class="mrc-btn"         data-tool="caneta"    data-tip="Caneta - P">'      + svg.caneta   + '</button>' +
      '<button class="mrc-btn"         data-tool="marcador"  data-tip="Marca-texto - H">' + svg.marcador + '</button>' +
      '<button class="mrc-btn"         data-tool="retangulo" data-tip="Retangulo - R">'   + svg.rect     + '</button>' +
      '<button class="mrc-btn"         data-tool="circulo"   data-tip="Circulo - C">'     + svg.circle   + '</button>' +
      '<button class="mrc-btn"         data-tool="texto"     data-tip="Texto - T">'       + svg.texto    + '</button>' +
      '<button class="mrc-btn"         data-tool="borracha"  data-tip="Borracha - E">'    + svg.borracha + '</button>' +
      '<div class="mrc-sep"></div>' +
      '<button class="mrc-btn" id="mrcFill" data-tip="Preencher forma - F">' + svg.balde + '</button>' +
      '<div class="mrc-color-wrap" title="Cor"><input id="mrcColor" type="color" value="#1b7ca5"></div>' +
      '<div class="mrc-presets" id="mrcPresets"></div>' +
      '<div class="mrc-size-wrap"><input id="mrcSize" type="range" min="1" max="40" value="3" title="Espessura"></div>' +
      '<div class="mrc-opac-wrap"><input id="mrcOpacidade" type="range" min="10" max="100" value="100" title="Opacidade"></div>' +
      '<div class="mrc-sep"></div>' +
      '<button class="mrc-btn mrc-warn"   id="mrcUndo"    data-tip="Desfazer - Ctrl+Z">' + svg.undo     + '</button>' +
      '<button class="mrc-btn mrc-danger" id="mrcLimpar"  data-tip="Apagar tudo - Del">' + svg.lixeira  + '</button>' +
      '<button class="mrc-btn mrc-ok"     id="mrcSalvar"  data-tip="Salvar PNG - Ctrl+S">' + svg.download + '</button>';
    document.body.appendChild(toolbar);

    // Presets de cor
    var presetsWrap = toolbar.querySelector('#mrcPresets');
    PRESETS.forEach(function (hex, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'mrc-preset' + (i === 0 ? ' mrc-preset-sel' : '');
      dot.style.background = hex;
      dot.dataset.color = hex;
      presetsWrap.appendChild(dot);
    });

    // ── Badge ─────────────────────────────────────────────────────
    var badge = document.createElement('div');
    badge.id = 'mrcBadge';
    badge.innerHTML = '<span class="mrc-dot"></span> modo marcacao';
    document.body.appendChild(badge);

    // ── Contador ──────────────────────────────────────────────────
    var contador = document.createElement('div');
    contador.id = 'mrcContador';
    contador.textContent = '0 marcacoes';
    document.body.appendChild(contador);

    // ── Toast (feedback de exportação) ──────────────────────────────
    var toast = document.createElement('div');
    toast.id = 'mrcToast';
    toast.textContent = 'imagem salva';
    document.body.appendChild(toast);
    var toastTimer = null;
    function mostrarToast(msg) {
      toast.textContent = msg;
      toast.classList.add('mrc-show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove('mrc-show'); }, 1800);
    }

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
    var ferramenta = 'linha', desenhando = false, preencher = false;
    var startX = 0, startY = 0, snapshot = null, shiftAtivo = false;
    var historico = [], aberto = false, totalMarcacoes = 0;

    // Canvas sempre do tamanho da viewport
    function resizeCanvas() {
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

    var btnFechar = toolbar.querySelector('#mrcBtnFechar');

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

    var colorEl    = document.getElementById('mrcColor');
    var sizeEl     = document.getElementById('mrcSize');
    var opacEl     = document.getElementById('mrcOpacidade');
    var btnDesfaz  = document.getElementById('mrcUndo');
    var btnLimpar  = document.getElementById('mrcLimpar');
    var btnSalvar  = document.getElementById('mrcSalvar');
    var btnFill    = document.getElementById('mrcFill');

    // Presets de cor
    presetsWrap.querySelectorAll('.mrc-preset').forEach(function (dot) {
      dot.addEventListener('click', function () {
        colorEl.value = dot.dataset.color;
        presetsWrap.querySelectorAll('.mrc-preset').forEach(function (d) { d.classList.remove('mrc-preset-sel'); });
        dot.classList.add('mrc-preset-sel');
      });
    });
    colorEl.addEventListener('input', function () {
      presetsWrap.querySelectorAll('.mrc-preset').forEach(function (d) { d.classList.remove('mrc-preset-sel'); });
    });

    // Preenchimento de formas
    btnFill.addEventListener('click', function () {
      preencher = !preencher;
      btnFill.classList.toggle('mrc-sel', preencher);
    });

    var getCor  = function() { return colorEl.value; };
    var getTam  = function() { return parseInt(sizeEl.value); };
    var getOpac = function() { return parseInt(opacEl.value) / 100; };

    function salvarHistorico() {
      historico.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (historico.length > 80) historico.shift();
    }

    // Posição do cursor já em coords de canvas (canvas = viewport, então é direto)
    function getPos(e) {
      var s = e.touches ? e.touches[0] : e;
      return { x: s.clientX, y: s.clientY };
    }

    // Trava linha/forma em ângulos de 45° e formas em quadrado/círculo perfeito quando Shift está ativo
    function aplicarShift(x, y) {
      if (!shiftAtivo) return { x: x, y: y };
      if (ferramenta === 'retangulo' || ferramenta === 'circulo') {
        var d = Math.max(Math.abs(x - startX), Math.abs(y - startY));
        return {
          x: startX + d * (x < startX ? -1 : 1),
          y: startY + d * (y < startY ? -1 : 1)
        };
      }
      var dx = x - startX, dy = y - startY;
      var ang = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
      var dist = Math.hypot(dx, dy);
      return { x: startX + dist * Math.cos(ang), y: startY + dist * Math.sin(ang) };
    }

    function aplicarEstilo() {
      var cor = getCor();
      ctx.strokeStyle = cor; ctx.fillStyle = cor;
      ctx.globalAlpha = getOpac();
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

    // Exportar marcação como PNG
    function salvarPNG() {
      var link = document.createElement('a');
      var stamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = 'betstat-marcacao-' + stamp + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      mostrarToast('imagem salva');
    }
    btnSalvar.addEventListener('click', salvarPNG);

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
          ctx.globalAlpha = getOpac();
          ctx.fillText(txt, tx, ty);
          ctx.globalAlpha = 1;
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
      var p = aplicarShift(x, y); x = p.x; y = p.y;
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
        ctx.beginPath(); ctx.rect(startX, startY, x - startX, y - startY);
        if (preencher) ctx.fill(); ctx.stroke();
      } else if (ferramenta === 'circulo') {
        var rx = (x - startX) / 2, ry = (y - startY) / 2;
        ctx.beginPath(); ctx.ellipse(startX + rx, startY + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
        if (preencher) ctx.fill(); ctx.stroke();
      }
    }

    canvas.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var pos = getPos(e);
      if (ferramenta === 'texto') { abrirTexto(pos.x, pos.y); return; }
      desenhando = true; startX = pos.x; startY = pos.y;
      salvarHistorico(); aplicarEstilo();
      if (ferramenta === 'caneta' || ferramenta === 'borracha' || ferramenta === 'marcador') {
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
      } else if (ferramenta === 'marcador') {
        ctx.globalAlpha = getOpac() * 0.4;
        ctx.lineWidth = getTam() * 4;
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
      } else if (ferramenta === 'borracha') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
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
      ctx.globalAlpha = 1;
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
      if (ferramenta === 'caneta' || ferramenta === 'borracha' || ferramenta === 'marcador') {
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
      else if (ferramenta === 'marcador') {
        ctx.globalAlpha = getOpac() * 0.4;
        ctx.lineWidth = getTam() * 4;
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
      }
      else if (ferramenta === 'borracha') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
        ctx.lineWidth = getTam() * 6; ctx.lineTo(pos.x, pos.y); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else { desenharForma(pos.x, pos.y); }
    }, { passive: false });
    canvas.addEventListener('touchend', pararDesenho, { passive: false });

    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Shift') shiftAtivo = true;
      if (!aberto || document.activeElement === textInput) return;
      if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); salvarPNG(); return; }
      var mapa = { p:'caneta', l:'linha', a:'seta', r:'retangulo', c:'circulo', t:'texto', e:'borracha', h:'marcador' };
      var tool = mapa[e.key.toLowerCase()];
      if (tool) {
        var btn = toolbar.querySelector('[data-tool="' + tool + '"]');
        if (btn) btn.click();
      }
      if (e.key.toLowerCase() === 'f') btnFill.click();
      if (e.key === 'Escape') fechar();
      if (e.key === 'Delete') btnLimpar.click();
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); desfazer(); }
    });
    document.addEventListener('keyup', function(e) { if (e.key === 'Shift') shiftAtivo = false; });

    atualizarContador();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();