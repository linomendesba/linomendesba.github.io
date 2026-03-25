/**
 * accordion-reorder.js
 * ─────────────────────────────────────────────────────────────
 * Script INDEPENDENTE — não mexe nos seus acordeons existentes.
 * Adiciona botões ▲ ▼ em cada accordion-item para o usuário
 * reordenar livremente. A ordem fica salva no localStorage
 * e é restaurada automaticamente a cada visita.
 *
 * COMO USAR:
 *   Adicione no final do <body>, antes de </body>:
 *   <script src="accordion-reorder.js"></script>
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

const STORAGE_KEY = 'betstat_accordion_order_global';

  const COR_BOTAO        = '#1fac89';
  const COR_BOTAO_HV     = '#17876c';
  const COR_DESABILITADO = '#2a3a40';

  /* ── Estilos ───────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #acc-reorder-container {
      display: contents;
    }
    #acc-reorder-container.acc-pending {
      visibility: hidden;
      pointer-events: none;
    }
    #acc-reorder-container.acc-ready {
      visibility: visible;
      animation: accFadeIn 0.15s ease;
    }
    @keyframes accFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .acc-reorder-wrap {
      position: relative;
    }
    .acc-reorder-controls {
      display: flex;
      gap: 4px;
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 10;
    }
    .acc-reorder-btn {
      background: #1fac89;
      color: #fff;
      border: none;
      border-radius: 4px;
      width: 26px;
      height: 26px;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, opacity 0.15s;
      padding: 0;
      flex-shrink: 0;
    }
    .acc-reorder-btn:hover:not(:disabled) {
      background: #17876c;
    }
    .acc-reorder-btn:disabled {
      background: #2a3a40;
      cursor: not-allowed;
      opacity: 0.5;
    }
    .acc-reorder-moving {
      transition: transform 0.18s ease;
      transform: scale(1.01);
      box-shadow: 0 0 0 2px #1fac89;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    const items = Array.from(document.querySelectorAll('.accordion-item'));
    if (items.length < 2) return;

    /*
     * SOLUÇÃO DO BUG:
     * Os accordion-item ficam direto no <body> (sem wrapper).
     * Usar appendChild no body joga tudo pro final, depois do rodapé.
     * A correção: criamos um <div id="acc-reorder-container"> com
     * display:contents (totalmente transparente pro layout) e
     * movemos todos os accordion-item pra dentro dele, no lugar certo.
     * Agora o insertBefore/appendChild opera só dentro do wrapper,
     * nunca saindo da posição original na página.
     */
    const wrapper = document.createElement('div');
    wrapper.id = 'acc-reorder-container';

    // Insere o wrapper no lugar exato do primeiro accordion-item
    items[0].parentNode.insertBefore(wrapper, items[0]);

    // Move todos os accordion-item para dentro do wrapper
    items.forEach(item => wrapper.appendChild(item));

    // Se tem ordem salva, esconde pra não piscar durante a reordenação
    const temOrdemSalva = !!localStorage.getItem(STORAGE_KEY);
    if (temOrdemSalva) wrapper.classList.add('acc-pending');

    // Atribui IDs estáveis baseados no texto do botão
    items.forEach((item, i) => {
      if (!item.dataset.reorderId) {
        const btn = item.querySelector('.accordion-button');
        const label = btn
          ? btn.textContent.trim().replace(/[^a-zA-Z0-9\u00C0-\u00FF]/g, '_').substring(0, 40)
          : 'item_' + i;
        item.dataset.reorderId = label || 'item_' + i;
      }
      item.classList.add('acc-reorder-wrap');
      adicionarControles(item, wrapper);
    });

    // Restaura a ordem salva
    restaurarOrdem(wrapper);

    // Atualiza estado dos botões
    atualizarEstadoBotoes(wrapper);

    // Revela com fade suave
    wrapper.classList.remove('acc-pending');
    wrapper.classList.add('acc-ready');
  }

  /* ── Botões ▲ ▼ ────────────────────────────────────────── */
  function adicionarControles(item, wrapper) {
    const wrap = document.createElement('div');
    wrap.className = 'acc-reorder-controls';

    const btnUp = document.createElement('button');
    btnUp.className = 'acc-reorder-btn acc-btn-up';
    btnUp.title = 'Mover para cima';
    btnUp.innerHTML = '&#9650;';
    btnUp.addEventListener('click', function(e) {
      e.stopPropagation();
      moverItem(item, wrapper, -1);
    });

    const btnDown = document.createElement('button');
    btnDown.className = 'acc-reorder-btn acc-btn-down';
    btnDown.title = 'Mover para baixo';
    btnDown.innerHTML = '&#9660;';
    btnDown.addEventListener('click', function(e) {
      e.stopPropagation();
      moverItem(item, wrapper, +1);
    });

    wrap.appendChild(btnUp);
    wrap.appendChild(btnDown);
    item.appendChild(wrap);
  }

  /* ── Mover ─────────────────────────────────────────────── */
  function moverItem(item, wrapper, direcao) {
    const items = Array.from(wrapper.querySelectorAll(':scope > .accordion-item'));
    const idx = items.indexOf(item);
    const novoIdx = idx + direcao;
    if (novoIdx < 0 || novoIdx >= items.length) return;

    item.classList.add('acc-reorder-moving');
    setTimeout(function() { item.classList.remove('acc-reorder-moving'); }, 200);

    if (direcao === -1) {
      wrapper.insertBefore(item, items[novoIdx]);
    } else {
      wrapper.insertBefore(item, items[novoIdx].nextSibling);
    }

    salvarOrdem(wrapper);
    atualizarEstadoBotoes(wrapper);
  }

  /* ── Salvar ────────────────────────────────────────────── */
  function salvarOrdem(wrapper) {
    const items = Array.from(wrapper.querySelectorAll(':scope > .accordion-item'));
    const ordem = items.map(function(item) { return item.dataset.reorderId; });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ordem));
    } catch (e) {
      console.warn('[accordion-reorder] localStorage indisponível.', e);
    }
  }

  /* ── Restaurar ─────────────────────────────────────────── */
  function restaurarOrdem(wrapper) {
    var ordemSalva;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      ordemSalva = JSON.parse(raw);
    } catch (e) { return; }

    if (!Array.isArray(ordemSalva) || ordemSalva.length === 0) return;

    var items = Array.from(wrapper.querySelectorAll(':scope > .accordion-item'));
    var mapa = {};
    items.forEach(function(item) { mapa[item.dataset.reorderId] = item; });

    var extras = items.filter(function(item) {
      return !ordemSalva.includes(item.dataset.reorderId);
    });

    ordemSalva.forEach(function(id) {
      if (mapa[id]) wrapper.appendChild(mapa[id]);
    });
    extras.forEach(function(item) { wrapper.appendChild(item); });
  }

  /* ── Estado dos botões ─────────────────────────────────── */
  function atualizarEstadoBotoes(wrapper) {
    var items = Array.from(wrapper.querySelectorAll(':scope > .accordion-item'));
    items.forEach(function(item, i) {
      var up   = item.querySelector('.acc-btn-up');
      var down = item.querySelector('.acc-btn-down');
      if (up)   up.disabled   = (i === 0);
      if (down) down.disabled = (i === items.length - 1);
    });
  }

  /* ── Aguarda DOM ───────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();