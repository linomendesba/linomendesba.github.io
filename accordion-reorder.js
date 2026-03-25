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
 *
 *   Se quiser uma chave diferente por página (para não misturar
 *   a ordem entre páginas diferentes), altere STORAGE_KEY abaixo.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Configurações ─────────────────────────────────────── */

  // Chave no localStorage — use uma por página se necessário,
  // ex: 'betstat_order_euro', 'betstat_order_brasileirao', etc.
  const STORAGE_KEY = 'betstat_accordion_order_' + location.pathname;

  // Cor dos botões (combina com o verde do BetStat)
  const COR_BOTAO     = '#1fac89';
  const COR_BOTAO_HV  = '#17876c';
  const COR_DESABILITADO = '#2a3a40';

  /* ── Estilos injetados ─────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
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
      background: ${COR_BOTAO};
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
      background: ${COR_BOTAO_HV};
    }
    .acc-reorder-btn:disabled {
      background: ${COR_DESABILITADO};
      cursor: not-allowed;
      opacity: 0.5;
    }
    /* Pequena animação ao mover */
    .acc-reorder-moving {
      transition: transform 0.18s ease;
      transform: scale(1.01);
      box-shadow: 0 0 0 2px ${COR_BOTAO};
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);

  /* ── Inicialização (aguarda DOM) ───────────────────────── */
  function init() {
    const container = encontrarContainer();
    if (!container) return;

    // Envolve cada item para facilitar o posicionamento dos botões
    const items = Array.from(container.querySelectorAll(':scope > .accordion-item'));
    if (items.length < 2) return; // nada a reordenar

    // Garante IDs estáveis baseados no texto do botão
    items.forEach((item, i) => {
      if (!item.dataset.reorderId) {
        const btn = item.querySelector('.accordion-button');
        const label = btn ? btn.textContent.trim().replace(/[^a-zA-Z0-9À-ú]/g, '_').substring(0, 40) : 'item_' + i;
        item.dataset.reorderId = label || 'item_' + i;
      }
      item.classList.add('acc-reorder-wrap');
    });

    // Insere os controles ▲ ▼ em cada item
    items.forEach(item => adicionarControles(item, container));

    // Restaura a ordem salva
    restaurarOrdem(container);

    // Atualiza estado dos botões (primeiro/último não podem subir/descer)
    atualizarEstadoBotoes(container);
  }

  /* ── Encontra o container pai dos accordion-items ──────── */
  function encontrarContainer() {
    // Pega o primeiro accordion-item e usa o pai como container
    const primeiro = document.querySelector('.accordion-item');
    return primeiro ? primeiro.parentElement : null;
  }

  /* ── Adiciona botões ▲ ▼ ao item ──────────────────────── */
  function adicionarControles(item, container) {
    const wrap = document.createElement('div');
    wrap.className = 'acc-reorder-controls';

    const btnUp = document.createElement('button');
    btnUp.className = 'acc-reorder-btn acc-btn-up';
    btnUp.title = 'Mover para cima';
    btnUp.innerHTML = '▲';
    btnUp.addEventListener('click', function (e) {
      e.stopPropagation();
      moverItem(item, container, -1);
    });

    const btnDown = document.createElement('button');
    btnDown.className = 'acc-reorder-btn acc-btn-down';
    btnDown.title = 'Mover para baixo';
    btnDown.innerHTML = '▼';
    btnDown.addEventListener('click', function (e) {
      e.stopPropagation();
      moverItem(item, container, +1);
    });

    wrap.appendChild(btnUp);
    wrap.appendChild(btnDown);
    item.appendChild(wrap);
  }

  /* ── Move o item -1 (cima) ou +1 (baixo) ──────────────── */
  function moverItem(item, container, direcao) {
    const items = Array.from(container.querySelectorAll(':scope > .accordion-item'));
    const idx = items.indexOf(item);
    const novoIdx = idx + direcao;

    if (novoIdx < 0 || novoIdx >= items.length) return;

    // Animação rápida
    item.classList.add('acc-reorder-moving');
    setTimeout(() => item.classList.remove('acc-reorder-moving'), 200);

    if (direcao === -1) {
      // Mover para cima: insere antes do anterior
      container.insertBefore(item, items[novoIdx]);
    } else {
      // Mover para baixo: insere depois do próximo
      const ref = items[novoIdx].nextSibling;
      container.insertBefore(item, ref);
    }

    salvarOrdem(container);
    atualizarEstadoBotoes(container);
  }

  /* ── Salva a ordem atual no localStorage ──────────────── */
  function salvarOrdem(container) {
    const items = Array.from(container.querySelectorAll(':scope > .accordion-item'));
    const ordem = items.map(item => item.dataset.reorderId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ordem));
    } catch (e) {
      // localStorage pode estar bloqueado em alguns navegadores
      console.warn('[accordion-reorder] Não foi possível salvar no localStorage.', e);
    }
  }

  /* ── Restaura a ordem salva ────────────────────────────── */
  function restaurarOrdem(container) {
    let ordemSalva;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      ordemSalva = JSON.parse(raw);
    } catch (e) {
      return;
    }

    if (!Array.isArray(ordemSalva) || ordemSalva.length === 0) return;

    const items = Array.from(container.querySelectorAll(':scope > .accordion-item'));
    const mapa = {};
    items.forEach(item => { mapa[item.dataset.reorderId] = item; });

    // Reinsere na ordem salva; itens novos (não na lista salva) ficam no final
    const novosOuExtras = items.filter(item => !ordemSalva.includes(item.dataset.reorderId));

    ordemSalva.forEach(id => {
      if (mapa[id]) container.appendChild(mapa[id]);
    });
    novosOuExtras.forEach(item => container.appendChild(item));
  }

  /* ── Desabilita botões no topo e na base ───────────────── */
  function atualizarEstadoBotoes(container) {
    const items = Array.from(container.querySelectorAll(':scope > .accordion-item'));
    items.forEach((item, i) => {
      const btnUp   = item.querySelector('.acc-btn-up');
      const btnDown = item.querySelector('.acc-btn-down');
      if (btnUp)   btnUp.disabled   = (i === 0);
      if (btnDown) btnDown.disabled = (i === items.length - 1);
    });
  }

  /* ── Aguarda o DOM estar pronto ────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM já pronto (script carregado no final do body)
    init();
  }

})();