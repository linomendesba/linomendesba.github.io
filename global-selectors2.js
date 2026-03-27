// ─── marcador.js ─────────────────────────────────────────────────────────────
// Salva e restaura:
//   1. Estado aberto/fechado de TODOS os acordeões
//   2. Valores de selects e checkboxes da página
//   3. Ignora elementos do MACD/RSI (gerenciados pelo histomacd.js)
// Ativo apenas nas páginas listadas em allowedPages
// ─────────────────────────────────────────────────────────────────────────────

const allowedPages = [
  "kironengland.html",
  "kironitaly.html",
  "kironspain.html"
];

const currentPage = window.location.pathname.split('/').pop();

if (allowedPages.includes(currentPage)) {

  const PREFIX = currentPage + '_';

  // IDs que NÃO devem ser salvos por este script
  const excludedSelectors = [
    "ligas",
    "avancado-betano",
    "ligas365",
    "avancado-bet365",
    "redes",
    // Elementos do MACD/RSI — gerenciados pelo histomacd.js
    "histomacdMarketSelector",
    "histomacdPointsSelector",
    "histomacdAverageSelector",
    "histomacdMacdFast",
    "histomacdMacdSlow",
    "histomacdMacdSignal",
    "histomacdRsiPeriod",
    "histomacdShowRSI"
  ];

  // ─── ACORDEÕES ──────────────────────────────────────────────────────────────

  function getAccordionKey(buttonEl) {
    const buttons = Array.from(document.querySelectorAll('.accordion-button'));
    const idx = buttons.indexOf(buttonEl);
    return PREFIX + 'accordion_' + idx;
  }

  function saveAccordionState(buttonEl) {
    const content = buttonEl.nextElementSibling;
    if (!content) return;
    const isOpen = content.style.display === 'block';
    localStorage.setItem(getAccordionKey(buttonEl), isOpen ? '1' : '0');
  }

  function restoreAccordionStates() {
    document.querySelectorAll('.accordion-button').forEach(btn => {
      const key = getAccordionKey(btn);
      const saved = localStorage.getItem(key);
      if (saved === null) return;

      const content = btn.nextElementSibling;
      if (!content) return;

      const isOpen = saved === '1';
      content.style.display = isOpen ? 'block' : 'none';

      if (isOpen) {
        btn.innerHTML = btn.innerHTML.replace(/▼/g, '▲');
      } else {
        btn.innerHTML = btn.innerHTML.replace(/▲/g, '▼');
      }
    });
  }

  // ─── TOGGLE ACORDEÃO ────────────────────────────────────────────────────────
  // Substitui todas as versões de toggleAccordion da página

  function toggleAccordion(buttonEl) {
    const content = buttonEl.nextElementSibling;
    if (!content) return;

    const isOpen = content.style.display === 'block';
    content.style.display = isOpen ? 'none' : 'block';

    if (isOpen) {
      buttonEl.innerHTML = buttonEl.innerHTML.replace(/▲/g, '▼');
    } else {
      buttonEl.innerHTML = buttonEl.innerHTML.replace(/▼/g, '▲');
    }

    saveAccordionState(buttonEl);
  }

  window.toggleAccordion = toggleAccordion;

  // ─── SELECTS E CHECKBOXES ───────────────────────────────────────────────────

  function saveElement(el) {
    if (!el || !el.id || excludedSelectors.includes(el.id)) return;
    const key = PREFIX + el.id;
    if (el.type === 'checkbox') {
      localStorage.setItem(key, el.checked ? '1' : '0');
    } else {
      localStorage.setItem(key, el.value);
    }
  }

  function restoreSelections() {
    document.querySelectorAll('select').forEach(sel => {
      if (!sel.id || excludedSelectors.includes(sel.id)) return;
      const saved = localStorage.getItem(PREFIX + sel.id);
      if (saved === null) return;
      const exists = Array.from(sel.options).some(o => o.value === saved);
      if (!exists) return;
      sel.value = saved;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (!cb.id || excludedSelectors.includes(cb.id)) return;
      const saved = localStorage.getItem(PREFIX + cb.id);
      if (saved === null) return;
      const shouldBeChecked = saved === '1';
      if (cb.checked !== shouldBeChecked) {
        cb.checked = shouldBeChecked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  function setupAutoSave() {
    document.querySelectorAll('select').forEach(sel => {
      if (!sel.id || excludedSelectors.includes(sel.id)) return;
      sel.addEventListener('change', () => saveElement(sel));
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (!cb.id || excludedSelectors.includes(cb.id)) return;
      cb.addEventListener('change', () => saveElement(cb));
    });
  }

  function saveAll() {
    document.querySelectorAll('select, input[type="checkbox"]').forEach(el => saveElement(el));
    document.querySelectorAll('.accordion-button').forEach(btn => saveAccordionState(btn));
  }

  // ─── INIT ───────────────────────────────────────────────────────────────────

  window.addEventListener('DOMContentLoaded', () => {
    restoreAccordionStates();
    setTimeout(() => {
      restoreSelections();
      setupAutoSave();
    }, 150);
  });

  window.addEventListener('beforeunload', saveAll);

} // fim do bloco condicional