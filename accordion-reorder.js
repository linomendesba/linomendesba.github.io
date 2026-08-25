(function () {
  'use strict';

const STORAGE_KEY = 'betstat_accordion_order_global';

  const COR_BOTAO        = '#1a7ba2';
  const COR_BOTAO_HV     = '#145f7d';
  const COR_DESABILITADO = '#2a3a40';
  const COR_ICONE        = '#eaf1f9';
  const COR_ICONE_DESAB  = 'rgba(234,241,249,0.35)';
  const COR_BORDA        = '#0f2833';


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
      background: ${COR_BOTAO};
      color: ${COR_ICONE};
      border: 1px solid ${COR_BORDA};
      border-radius: 4px;
      width: 25px;
      height: 18px;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, opacity 0.15s, border-color 0.15s;
      padding: 0;
      flex-shrink: 0;
    }
    .acc-reorder-btn:hover:not(:disabled) {
      background: ${COR_BOTAO_HV};
      border-color: ${COR_BOTAO};
    }
    .acc-reorder-btn:disabled {
      background: ${COR_DESABILITADO};
      color: ${COR_ICONE_DESAB};
      border-color: ${COR_DESABILITADO};
      cursor: not-allowed;
      opacity: 0.6;
    }
    .acc-reorder-moving {
      transition: transform 0.18s ease;
      transform: scale(1.01);
      box-shadow: 0 0 0 2px ${COR_BOTAO};
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);


  function init() {
    const items = Array.from(document.querySelectorAll('.accordion-item'));
    if (items.length < 2) return;


    const wrapper = document.createElement('div');
    wrapper.id = 'acc-reorder-container';


    items[0].parentNode.insertBefore(wrapper, items[0]);


    items.forEach(item => wrapper.appendChild(item));


    const temOrdemSalva = !!localStorage.getItem(STORAGE_KEY);
    if (temOrdemSalva) wrapper.classList.add('acc-pending');


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


    restaurarOrdem(wrapper);


    atualizarEstadoBotoes(wrapper);


    wrapper.classList.remove('acc-pending');
    wrapper.classList.add('acc-ready');
  }


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


  function salvarOrdem(wrapper) {
    const items = Array.from(wrapper.querySelectorAll(':scope > .accordion-item'));
    const ordem = items.map(function(item) { return item.dataset.reorderId; });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ordem));
    } catch (e) {
      console.warn('[accordion-reorder] localStorage indisponível.', e);
    }
  }


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


  function atualizarEstadoBotoes(wrapper) {
    var items = Array.from(wrapper.querySelectorAll(':scope > .accordion-item'));
    items.forEach(function(item, i) {
      var up   = item.querySelector('.acc-btn-up');
      var down = item.querySelector('.acc-btn-down');
      if (up)   up.disabled   = (i === 0);
      if (down) down.disabled = (i === items.length - 1);
    });
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();