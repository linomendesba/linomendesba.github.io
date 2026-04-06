(function () {

  /* ── DETECTA CASA ATUAL ──────────────────────────────────────── */
  function detectarCasa() {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_COMMENT);
    let node;
    while ((node = walker.nextNode())) {
      const txt = node.nodeValue.trim().toLowerCase();
      if (txt.includes('header-bet365'))     return 'bet365';
      if (txt.includes('header-betano'))     return 'betano';
      if (txt.includes('header-estrelabet')) return 'estrelabet';
      if (txt.includes('header-kiron'))      return 'kiron';
    }

    const ligas = document.querySelector('header .nav-seletor select option:first-child');
    if (ligas) {
      const t = ligas.textContent.toLowerCase();
      if (t.includes('bet365'))     return 'bet365';
      if (t.includes('betano'))     return 'betano';
      if (t.includes('estrelabet')) return 'estrelabet';
      if (t.includes('kiron'))      return 'kiron';
    }

    const url = window.location.href.toLowerCase();
    if (url.includes('bet365') || url.includes('365')) return 'bet365';
    if (url.includes('betano'))                         return 'betano';
    if (url.includes('estrela'))                        return 'estrelabet';
    if (url.includes('kiron'))                          return 'kiron';

    return 'global';
  }

  const CASA_ATUAL = detectarCasa();
  const LS_KEY     = `bsFavToolsV5_${CASA_ATUAL}`;

  /* ── CATÁLOGO COMPLETO ───────────────────────────────────────── */
  const CATALOGO = [
    {
      group: "Bet365",
      tools: [
        { label: "Pré Live",        url: "https://www.betstat.site/bet365pre.html" },
        { label: "Fluxo",           url: "https://www.betstat.site/365fluxo.html" },
        { label: "Máximas",         url: "https://www.betstat.site/365maximas.html" },
        { label: "GolsPró",         url: "https://www.betstat.site/365gols.html" },
        { label: "Hora Fixa",       url: "https://www.betstat.site/365fixo.html" },
        { label: "LigaStat",        url: "https://www.betstat.site/365stat.html" },
        { label: "MultiLiga",       url: "https://www.betstat.site/mult365.html" },
        { label: "LocalizAI",       url: "https://www.betstat.site/365localizAI.html" },
        { label: "Projeções",       url: "https://www.betstat.site/365projecoes.html" },
        { label: "Quadrantes",      url: "https://www.betstat.site/365qua.html" },
        { label: "Porcentagem",     url: "https://www.betstat.site/365porcent.html" },
        { label: "Classificação",   url: "https://www.betstat.site/bet365clasificacao.html" },
        { label: "Gráfico Macro",   url: "https://www.betstat.site/365macro.html" },
        { label: "Radar Gráfico",   url: "https://www.betstat.site/365radar.html" },
        { label: "Buscador Odds",   url: "https://www.betstat.site/365odds.html" },
        { label: "Buscador Time",   url: "https://www.betstat.site/365buscatime.html" },
        { label: "Buscador Placar", url: "https://www.betstat.site/365placar.html" },
        { label: "Buscador Duelo",  url: "https://www.betstat.site/365confronto.html" },
      ]
    },
    {
      group: "Betano",
      tools: [
        { label: "Pré Live",        url: "https://www.betstat.site/betanopre.html" },
        { label: "Fluxo",           url: "https://www.betstat.site/fluxo.html" },
        { label: "Máximas",         url: "https://www.betstat.site/maximabetano.html" },
        { label: "GolsPró",         url: "https://www.betstat.site/gols.html" },
        { label: "Hora Fixa",       url: "https://www.betstat.site/betanofixo.html" },
        { label: "LigaStat",        url: "https://www.betstat.site/LigaStat.html" },
        { label: "MultiLiga",       url: "https://www.betstat.site/multbetano.html" },
        { label: "LocalizAI",       url: "https://www.betstat.site/localizAI.html" },
        { label: "Projeções",       url: "https://www.betstat.site/betanotips.html" },
        { label: "Quadrantes",      url: "https://www.betstat.site/quadrantesgols.html" },
        { label: "Porcentagem",     url: "https://www.betstat.site/porcentagembetano.html" },
        { label: "Classificação",   url: "https://www.betstat.site/classificacao.html" },
        { label: "Gráfico Macro",   url: "https://www.betstat.site/macrobetano.html" },
        { label: "Radar Gráfico",   url: "https://www.betstat.site/betanoradar.html" },
        { label: "Buscador Odds",   url: "https://www.betstat.site/buscadorodd.html" },
        { label: "Buscador Time",   url: "https://www.betstat.site/buscadortime.html" },
        { label: "Buscador Placar", url: "https://www.betstat.site/betanobuscador.html" },
        { label: "Buscador Duelo",  url: "https://www.betstat.site/buscaconfronto.html" },
      ]
    },
    {
      group: "EstrelaBet",
      tools: [
        { label: "Pré Live",        url: "https://www.betstat.site/estrelapre.html" },
        { label: "Fluxo",           url: "https://www.betstat.site/estrelafluxo.html" },
        { label: "Máximas",         url: "https://www.betstat.site/maximaestrela.html" },
        { label: "GolsPró",         url: "https://www.betstat.site/golsestrela.html" },
        { label: "Hora Fixa",       url: "https://www.betstat.site/estrelafixo.html" },
        { label: "LigaStat",        url: "https://www.betstat.site/estrelastat.html" },
        { label: "MultiLiga",       url: "https://www.betstat.site/estrelamult.html" },
        { label: "LocalizAI",       url: "https://www.betstat.site/localizAIstar.html" },
        { label: "Projeções",       url: "https://www.betstat.site/estrelaprojecoes.html" },
        { label: "Quadrantes",      url: "https://www.betstat.site/estrelaquadrante.html" },
        { label: "Porcentagem",     url: "https://www.betstat.site/porcentagemstar.html" },
        { label: "Classificação",   url: "https://www.betstat.site/estrelaclassificacao.html" },
        { label: "Gráfico Macro",   url: "https://www.betstat.site/estrelamacro.html" },
        { label: "Radar Gráfico",   url: "https://www.betstat.site/estrelaradar.html" },
        { label: "Buscador Odds",   url: "https://www.betstat.site/buscadoroddstar.html" },
        { label: "Buscador Time",   url: "https://www.betstat.site/buscadortimestar.html" },
        { label: "Buscador Placar", url: "https://www.betstat.site/estrelabuscador.html" },
        { label: "Buscador Duelo",  url: "https://www.betstat.site/estreladuelo.html" },
      ]
    },
    {
      group: "Kiron",
      tools: [
        { label: "Pré Live",        url: "https://www.betstat.site/kironpre.html" },
        { label: "Fluxo",           url: "https://www.betstat.site/kironfluxo.html" },
        { label: "Máximas",         url: "https://www.betstat.site/maximaskiron.html" },
        { label: "GolsPró",         url: "https://www.betstat.site/golskiron.html" },
        { label: "Hora Fixa",       url: "https://www.betstat.site/fixokiron.html" },
        { label: "LigaStat",        url: "https://www.betstat.site/LigaStatkiron.html" },
        { label: "MultiLiga",       url: "https://www.betstat.site/multkiron.html" },
        { label: "LocalizAI",       url: "https://www.betstat.site/localizAIkiron.html" },
        { label: "Projeções",       url: "https://www.betstat.site/kironprojecao.html" },
        { label: "Quadrantes",      url: "https://www.betstat.site/kironquadrantes.html" },
        { label: "Porcentagem",     url: "https://www.betstat.site/porcentagemkiron.html" },
        { label: "Classificação",   url: "https://www.betstat.site/classificacaokiron.html" },
        { label: "Gráfico Macro",   url: "https://www.betstat.site/kironmacro.html" },
        { label: "Radar Gráfico",   url: "https://www.betstat.site/kironradar.html" },
        { label: "Buscador Odds",   url: "https://www.betstat.site/buscadoroddkiron.html" },
        { label: "Buscador Time",   url: "https://www.betstat.site/buscadortimekiron.html" },
        { label: "Buscador Placar", url: "https://www.betstat.site/kironbuscador.html" },
        { label: "Buscador Duelo",  url: "https://www.betstat.site/kironduelo.html" },
      ]
    },
    {
      group: "🛠️ Extras",
      tools: [
        { label: "Guias",           url: "https://www.betstat.site/guias.html" },
        { label: "Ao Vivo",         url: "https://www.betstat.site/live.html" },
        { label: "Calc Dutch",      url: "https://www.betstat.site/calculadora.html" },
        { label: "Morpheus IA",     url: "https://www.betstat.site/morfeus" },
        { label: "Gerador Tip",     url: "https://www.betstat.site/central/" },
        { label: "Gestão Banca",    url: "gestao.html" },
      ]
    }
  ];

  const MAX_SLOTS = 5;

  /* ── localStorage ────────────────────────────────────────────── */
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY));
      if (s && Array.isArray(s.slots)) return s;
    } catch {}
    return { slots: [] };
  }
  function saveState(s) { localStorage.setItem(LS_KEY, JSON.stringify(s)); }

  /* ── Label pelo URL ──────────────────────────────────────────── */
  function labelByUrl(url) {
    for (const cat of CATALOGO) {
      const t = cat.tools.find(t => t.url === url);
      if (t) return `${cat.group} › ${t.label}`;
    }
    return '⭐ Nova Ferramenta';
  }

  /* ── CSS ─────────────────────────────────────────────────────── */
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap');

    #bsFavWrapper    { margin-bottom: 10px; font-family: 'Roboto', Arial, sans-serif; }
    #bsFavAddWrapper { margin-bottom: 6px; }

    /* ── Botão Adicionar — idêntico ao .accordion-button da página ── */
    .bsfav-add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 10px 16px;
      background: linear-gradient(90deg, #292d36 0%, #2a2c34 100%);
      border: none;
      border-bottom: 1px solid transparent;
      color: #7a8494;
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 0;
      transition: color .2s, background .2s, border-color .2s;
      box-sizing: border-box;
    }
    .bsfav-add-btn:hover {
      color: #b0bec5;
      background: linear-gradient(90deg, #2e3240 0%, #2f3140 100%);
      border-bottom-color: rgba(255,255,255,.06);
    }
    .bsfav-add-btn:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    /* ── Item wrapper ── */
    .bsfav-item { margin-bottom: 6px; }

    /* ── Botão do acordeão favorito — idêntico ao .accordion-button ── */
    .bsfav-item-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 16px;
      background: linear-gradient(90deg, #292d36 0%, #2a2c34 100%);
      border: none;
      border-bottom: 1px solid transparent;
      border-left: 3px solid rgba(74,222,128,.45);
      color: #7a8494;
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      cursor: pointer;
      text-align: left;
      border-radius: 0;
      transition: color .2s, background .2s, border-color .2s;
      box-sizing: border-box;
    }
    .bsfav-item-btn:hover {
      color: #b0bec5;
      background: linear-gradient(90deg, #2e3240 0%, #2f3140 100%);
      border-bottom-color: rgba(255,255,255,.06);
    }
    .bsfav-item-btn.is-open {
      color: #c8cdd8;
      background: linear-gradient(90deg, #2e3240 0%, #2f3140 100%);
      border-bottom-color: rgba(255,255,255,.06);
      border-left-color: rgba(74,222,128,.8);
    }

    .bsfav-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .bsfav-chevron {
      font-size: 9px;
      color: #7a8494;
      flex-shrink: 0;
      transition: transform .2s;
    }
    .bsfav-item-btn.is-open .bsfav-chevron { transform: rotate(180deg); }

    /* ── Botão remover ── */
    .bsfav-remove-btn {
      padding: 2px 8px;
      line-height: 1.5;
      background: rgba(239,68,68,.08);
      color: #f87171;
      border: 1px solid rgba(239,68,68,.3);
      border-radius: 3px;
      font-size: 10px;
      font-family: 'Roboto', Arial, sans-serif;
      font-weight: 700;
      letter-spacing: .5px;
      text-transform: uppercase;
      cursor: pointer;
      flex-shrink: 0;
      transition: all .2s;
    }
    .bsfav-remove-btn:hover {
      background: rgba(239,68,68,.2);
      border-color: rgba(239,68,68,.6);
    }

    /* ── Conteúdo expandido ── */
    .bsfav-content {
      display: none;
      overflow: hidden;
      background: #1e2128;
      border-bottom: 1px solid rgba(255,255,255,.05);
      margin-bottom: 2px;
    }
    .bsfav-content.open { display: block; }

    /* ── Toolbar interna ── */
    .bsfav-toolbar {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 6px 10px;
      background: #1a1d24;
      border-bottom: 1px solid rgba(255,255,255,.05);
      flex-wrap: wrap;
    }
    .bsfav-toolbar select {
      flex: 1;
      background: #2a2d35;
      color: #c8cdd8;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 3px;
      padding: 4px 9px;
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 11px;
      cursor: pointer;
      min-width: 120px;
    }
    .bsfav-toolbar select:focus   { outline: none; border-color: rgba(255,255,255,.3); }
    .bsfav-toolbar select:disabled { opacity: .4; cursor: not-allowed; }

    .bsfav-apply-btn {
      padding: 4px 14px;
      background: #2a2d35;
      color: #c8cdd8;
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 3px;
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      white-space: nowrap;
      transition: all .2s;
    }
    .bsfav-apply-btn:hover {
      background: #32363f;
      border-color: rgba(255,255,255,.3);
      color: #e2e8f0;
    }
    .bsfav-apply-btn:disabled { opacity: .35; cursor: not-allowed; }

    /* ── iframe ── */
    .bsfav-frame {
      width: 100%;
      min-height: 620px;
      border: none;
      display: block;
      background: #1a1d24;
    }
  `;

  /* ── Cria selects de casa e ferramenta ───────────────────────── */
  function buildCasaSelect(selectedGroup) {
    const sel = document.createElement('select');
    sel.className = 'bsfav-casa-select';

    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Escolha a casa…';
    ph.disabled = true;
    if (!selectedGroup) ph.selected = true;
    sel.appendChild(ph);

    CATALOGO.forEach(cat => {
      const o = document.createElement('option');
      o.value = cat.group;
      o.textContent = cat.group;
      if (cat.group === selectedGroup) o.selected = true;
      sel.appendChild(o);
    });

    return sel;
  }

  function buildToolSelect(casaGroup, selectedUrl) {
    const sel = document.createElement('select');
    sel.className = 'bsfav-tool-select';

    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = casaGroup ? 'Escolha a ferramenta…' : 'Primeiro escolha a casa…';
    ph.disabled = true;
    if (!selectedUrl) ph.selected = true;
    sel.appendChild(ph);

    if (casaGroup) {
      const casa = CATALOGO.find(c => c.group === casaGroup);
      if (casa) {
        casa.tools.forEach(t => {
          const o = document.createElement('option');
          o.value = t.url;
          o.textContent = t.label;
          if (t.url === selectedUrl) o.selected = true;
          sel.appendChild(o);
        });
      }
    }

    sel.disabled = !casaGroup;
    return sel;
  }

  /* ── Cria um acordeão favorito ───────────────────────────────── */
  function createToolAccordion(idx, slotData) {
    const { url, open } = slotData;

    let selectedCasa    = '';
    let selectedToolUrl = url || '';

    if (url) {
      for (const cat of CATALOGO) {
        if (cat.tools.find(t => t.url === url)) {
          selectedCasa = cat.group;
          break;
        }
      }
    }

    const item = document.createElement('div');
    item.className = 'bsfav-item';

    /* header */
    const btn = document.createElement('button');
    btn.className = 'bsfav-item-btn' + (open ? ' is-open' : '');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'bsfav-title';
    titleSpan.textContent = url ? labelByUrl(url) : '⭐ Nova Ferramenta';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'bsfav-remove-btn';
    removeBtn.textContent = '✕ Remover';
    removeBtn.addEventListener('click', e => {
      e.stopPropagation();
      const st = loadState();
      st.slots.splice(idx, 1);
      saveState(st);
      rebuildSlots();
    });

    const chevron = document.createElement('span');
    chevron.className = 'bsfav-chevron';
    chevron.textContent = '▼';

    btn.append(titleSpan, removeBtn, chevron);

    /* conteúdo */
    const content = document.createElement('div');
    content.className = 'bsfav-content' + (open ? ' open' : '');

    const toolbar = document.createElement('div');
    toolbar.className = 'bsfav-toolbar';

    const casaSel  = buildCasaSelect(selectedCasa);
    const toolSel  = buildToolSelect(selectedCasa, selectedToolUrl);
    const applyBtn = document.createElement('button');
    applyBtn.className   = 'bsfav-apply-btn';
    applyBtn.textContent = 'Carregar';
    applyBtn.disabled    = !selectedToolUrl;

    casaSel.addEventListener('change', () => {
      const novoToolSel = buildToolSelect(casaSel.value, '');
      toolSel.innerHTML = novoToolSel.innerHTML;
      toolSel.disabled  = !casaSel.value;
      applyBtn.disabled = true;
    });

    toolSel.addEventListener('change', () => {
      applyBtn.disabled = !toolSel.value;
    });

    const hideHeader = (fr) => {
      try {
        const doc = fr.contentDocument || fr.contentWindow.document;
        const h   = doc.querySelector('#header');
        if (h) { h.style.cssText = 'display:none!important;height:0;overflow:hidden'; }
      } catch {
        fr.contentWindow.postMessage({ action: 'hideHeader' }, '*');
      }
    };

    applyBtn.addEventListener('click', () => {
      const chosen = toolSel.value;
      if (!chosen) return;
      const st = loadState();
      st.slots[idx].url = chosen;
      saveState(st);
      titleSpan.textContent = labelByUrl(chosen);
      frame.src    = chosen;
      frame.onload = () => hideHeader(frame);
    });

    toolbar.append(casaSel, toolSel, applyBtn);

    const frame = document.createElement('iframe');
    frame.className = 'bsfav-frame';
    frame.src       = (open && url) ? url : 'about:blank';
    frame.setAttribute('allowfullscreen', '');
    if (open && url) frame.onload = () => hideHeader(frame);

    content.append(toolbar, frame);

    /* toggle */
    btn.addEventListener('click', e => {
      if (e.target.closest('.bsfav-remove-btn')) return;
      const isOpen = content.classList.toggle('open');
      btn.classList.toggle('is-open', isOpen);

      if (isOpen) {
        const st  = loadState();
        const cur = st.slots[idx]?.url;
        const blank = frame.src === 'about:blank' || frame.src === window.location.href;
        if (cur && blank) {
          frame.src    = cur;
          frame.onload = () => hideHeader(frame);
        }
      }

      const st = loadState();
      if (st.slots[idx]) { st.slots[idx].open = isOpen; saveState(st); }
    });

    item.append(btn, content);
    return item;
  }

  /* ── Referência ao container de slots ───────────────────────── */
  function getSlotsContainer() {
    return document.getElementById('bsFavSlotsContainer');
  }

  /* ── Reconstrói apenas os slots favoritos ────────────────────── */
  function rebuildSlots() {
    const container = getSlotsContainer();
    if (!container) return;

    container.innerHTML = '';

    const state = loadState();
    state.slots.forEach((slot, i) => {
      container.appendChild(createToolAccordion(i, slot));
    });

    const addBtn = document.querySelector('.bsfav-add-btn');
    if (addBtn) {
      const atMax = state.slots.length >= MAX_SLOTS;
      addBtn.disabled    = atMax;
      addBtn.textContent = atMax
        ? `✦ Máximo de ${MAX_SLOTS} ferramentas atingido`
        : '＋ Adicionar Ferramenta';
    }
  }

  /* ── Init ────────────────────────────────────────────────────── */
  function init() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const firstFixed = document.querySelector('.accordion-item');
    if (!firstFixed) {
      console.warn('[BsFav] Nenhum .accordion-item encontrado.');
      return;
    }

    const parent = firstFixed.parentNode;

    const addWrapper = document.createElement('div');
    addWrapper.id = 'bsFavAddWrapper';

    const addBtn = document.createElement('button');
    addBtn.className   = 'bsfav-add-btn';
    addBtn.textContent = '＋ Adicionar Ferramenta';
    addBtn.addEventListener('click', () => {
      const st = loadState();
      if (st.slots.length >= MAX_SLOTS) return;
      st.slots.push({ url: '', open: true });
      saveState(st);
      rebuildSlots();
    });

    addWrapper.appendChild(addBtn);

    const slotsContainer = document.createElement('div');
    slotsContainer.id = 'bsFavSlotsContainer';

    parent.insertBefore(addWrapper,     firstFixed);
    parent.insertBefore(slotsContainer, firstFixed);

    rebuildSlots();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();