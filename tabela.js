const minutosFixos = [
  1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58,
];

const MERCADO_THRESHOLD = {
  ambasMarcam:    Math.round((9  / 20) * 100),
  ambasNaoMarcam: Math.round((11 / 20) * 100),
  casaVence:      Math.round((8  / 20) * 100),
  foraVence:      Math.round((7  / 20) * 100),
  empate:         Math.round((5  / 20) * 100),
  viradinha:      Math.round((3  / 20) * 100),
  "over0.5":      Math.round((17 / 20) * 100),
  "over1.5":      Math.round((14 / 20) * 100),
  "over2.5":      Math.round((8  / 20) * 100),
  "over3.5":      Math.round((4  / 20) * 100),
  over5:          Math.round((2  / 20) * 100),
  "under0.5":     Math.round((3  / 20) * 100),
  "under1.5":     Math.round((6  / 20) * 100),
  "under2.5":     Math.round((12 / 20) * 100),
  "under3.5":     Math.round((16 / 20) * 100),
  exato0: 10, exato1: 20, exato2: 20, exato3: 15, exato4: 10,
  exato2t0: 30, exato2t1: 35, exato2t2: 20, exato2t3: 10, exato2t4: 5,
  casa0Gols: 25, casa1Gol: 35, casa2Gols: 25, casa3Gols: 10, casa4Gols: 5,
  fora0Gols: 30, fora1Gol: 35, fora2Gols: 20, fora3Gols: 10, fora4Gols: 5,
};

function getThreshold(mercado) { return MERCADO_THRESHOLD[mercado] ?? 50; }

// ─── Faixas de cor por porcentagem (usadas na coluna combinada "Dados") ──────
function getClassePct(pct) {
  if (pct >= 50) return "pct-verde";
  if (pct >= 30) return "pct-amarelo";
  return "pct-vermelho";
}

// ─── MERCADOS EXTRAS (odds extras + destaque de 2º mercado) ──────────────────
const LABEL_CURTO_MERCADO = {
  ambasMarcam: "BTS", ambasNaoMarcam: "NBTS",
  casaVence: "1", empate: "X", foraVence: "2",
  "over0.5": "O0.5", "over1.5": "O1.5", "over2.5": "O2.5", "over3.5": "O3.5", over5: "O5+",
  "under0.5": "U0.5", "under1.5": "U1.5", "under2.5": "U2.5", "under3.5": "U3.5",
  exato0: "=0", exato1: "=1", exato2: "=2", exato3: "=3", exato4: "=4",
  exato2t0: "2T=0", exato2t1: "2T=1", exato2t2: "2T=2", exato2t3: "2T=3", exato2t4: "2T=4",
  casa0Gols: "C0", casa1Gol: "C1", casa2Gols: "C2", casa3Gols: "C3", casa4Gols: "C4",
  fora0Gols: "F0", fora1Gol: "F1", fora2Gols: "F2", fora3Gols: "F3", fora4Gols: "F4",
};
const MERCADOS_EXTRAS_MAX = 5;

const COR_GREEN_PADRAO = "#007004";
const COR_RED_PADRAO   = "#980b01";

const CORES_PLACAR_FT = ["#A855F7","#F59E0B","#3B82F6","#EC4899","#06B6D4","#F97316"];
const CORES_PLACAR_HT = ["#C084FC","#FCD34D","#67E8F9","#F9A8D4","#A5B4FC","#6EE7B7"];
const CORES_TIME      = ["#FACC15","#818CF8","#34D399","#FB7185","#A78BFA","#22D3EE"];
const CORES_ODD       = ["#F472B6","#FDE68A","#93C5FD","#6EE7B7","#FCA5A1","#C4B5FD"];

const SVG_ICONS = {
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
  ball:  `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  trend: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/></svg>`,
  reset: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1,4 1,10 7,10"/><path d="M3.51,15a9,9,0,1,0,.49-3.63"/></svg>`,
  avg:   `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="14" width="3.5" height="7"/><rect x="10.25" y="8" width="3.5" height="13"/><rect x="17.5" y="4" width="3.5" height="17"/><line x1="2" y1="11" x2="22" y2="11" stroke-dasharray="2.5 2.5"/></svg>`,
};

// ─── HELPER: nome normalizado da liga atual ───────────────────────────────────
function getLigaKey() {
  const h4 = document.querySelector("h4.custom-color");
  if (h4 && h4.textContent.trim()) {
    return h4.textContent.trim().toLowerCase().replace(/\s+/g, "_");
  }
  return typeof LIGA_ATUAL !== "undefined" ? LIGA_ATUAL : "default";
}

// ─── ESTADO CENTRALIZADO ──────────────────────────────────────────────────────
const Estado = {
  placarFTSelecionados: [],
  placarHTSelecionados: [],
  timesSelecionados:    [],
  oddsSelecionadas:     [],
  mercadosExtras:       [], // [{mercado, mostrarOdd, destacar}]
  corDestaqueExtra:     "#93C5FD",
  selectedChaves:       [],
  colunasSelecionadas:  [],
  _ultimoHashDados:       null,
  _ultimoHashOdds:        null,
  _ultimoHashProximos:    null,
  _ultimaLigaRenderizada: null,
  corGreen: COR_GREEN_PADRAO,
  corRed:   COR_RED_PADRAO,

  // ── Chaves isoladas por liga ──────────────────────────────────────────────
  _placarFTKey()  { return `placarFTSelecionados_${getLigaKey()}`; },
  _placarHTKey()  { return `placarHTSelecionados_${getLigaKey()}`; },
  _timesKey()     { return `timesSelecionados_${getLigaKey()}`; },
  _oddsKey()      { return `oddsSelecionadas_${getLigaKey()}`; },
  _mercadosExtrasKey() { return `mercadosExtras_${getLigaKey()}`; },
  _chavesKey()    { return `selectedChaves_${getLigaKey()}`; },
  _colunasKey()   { return `colunasSelecionadas_${getLigaKey()}`; },
  _horasKey()     { return `seletorHoras_${getLigaKey()}`; },

  carregar() {
    const ligaKey = getLigaKey();
    // Placar FT — chave por liga, com fallback legado global
    const legFT = JSON.parse(localStorage.getItem("placarSelecionados")) || [];
    const legFTGlobal = JSON.parse(localStorage.getItem("placarFTSelecionados")) || legFT;
    this.placarFTSelecionados = JSON.parse(localStorage.getItem(this._placarFTKey())) || [];
    this.placarHTSelecionados = JSON.parse(localStorage.getItem(this._placarHTKey())) || [];
    this.timesSelecionados    = JSON.parse(localStorage.getItem(this._timesKey()))    || [];
    this.oddsSelecionadas     = JSON.parse(localStorage.getItem(this._oddsKey()))     || [];
    this.mercadosExtras       = JSON.parse(localStorage.getItem(this._mercadosExtrasKey())) || [];
    this.selectedChaves       = JSON.parse(localStorage.getItem(this._chavesKey()))   || [];
    this.colunasSelecionadas  = JSON.parse(localStorage.getItem(this._colunasKey()))  || [];
    this.corGreen = localStorage.getItem("corGreen") || COR_GREEN_PADRAO;
    this.corRed   = localStorage.getItem("corRed")   || COR_RED_PADRAO;
    this.corDestaqueExtra = localStorage.getItem("corDestaqueExtra") || this.corDestaqueExtra;
    this.placarHTSelecionados = this.placarHTSelecionados
      .map(v => v.replace(/^(__ht__|_ht_|ht:)/i, "").trim())
      .filter(v => v.length > 0);
    // Remove chaves legadas globais para não vazar entre ligas
    ["placarSelecionado","timeSelecionado","oddSelecionada"].forEach(k => localStorage.removeItem(k));
  },

  salvar() {
    localStorage.setItem(this._placarFTKey(), JSON.stringify(this.placarFTSelecionados));
    localStorage.setItem(this._placarHTKey(), JSON.stringify(this.placarHTSelecionados));
    localStorage.setItem(this._timesKey(),    JSON.stringify(this.timesSelecionados));
    localStorage.setItem(this._oddsKey(),     JSON.stringify(this.oddsSelecionadas));
    localStorage.setItem(this._mercadosExtrasKey(), JSON.stringify(this.mercadosExtras));
    localStorage.setItem(this._chavesKey(),   JSON.stringify(this.selectedChaves));
    localStorage.setItem(this._colunasKey(),  JSON.stringify(this.colunasSelecionadas));
    localStorage.setItem("corGreen", this.corGreen);
    localStorage.setItem("corRed",   this.corRed);
    localStorage.setItem("corDestaqueExtra", this.corDestaqueExtra);
    const elH = document.querySelector("#seletorHoras");
    if (elH) localStorage.setItem(this._horasKey(), elH.value);
  },

  recarregarChaves() {
    this.selectedChaves      = JSON.parse(localStorage.getItem(this._chavesKey()))  || [];
    this.colunasSelecionadas = JSON.parse(localStorage.getItem(this._colunasKey())) || [];
  },

  toggleSelecao(chave, valor) {
    const lista = this[chave];
    const idx = lista.indexOf(valor);
    if (idx !== -1) lista.splice(idx, 1);
    else { if (lista.length >= 6) lista.shift(); lista.push(valor); }
    this.salvar();
    atualizarIndicadorSelecao();
  },

  limparSelecoes(tipos) {
    tipos.forEach(t => { this[t].length = 0; });
    this.salvar();
    atualizarIndicadorSelecao();
  },

  getCorSelecao(lista, valor, tipo) {
    const idx = lista.indexOf(valor);
    if (idx === -1) return null;
    const paletas = { ft: CORES_PLACAR_FT, ht: CORES_PLACAR_HT, time: CORES_TIME, odd: CORES_ODD };
    const paleta = paletas[tipo] || CORES_PLACAR_FT;
    return { bg: paleta[idx % paleta.length] };
  },

  hashDados(dados) {
    if (!dados || dados.length === 0) return "vazio";
    const first = dados[0], last = dados[dados.length-1];
    const keyFn = d => d?.id || d?.match_id || d?.ft || JSON.stringify(d).length;
    return `${dados.length}_${keyFn(first)}_${keyFn(last)}`;
  },

  dadosMudaram(dados, odds, proximos) {
    const hD=this.hashDados(dados), hO=this.hashDados(odds), hP=this.hashDados(proximos);
    if (hD!==this._ultimoHashDados || hO!==this._ultimoHashOdds || hP!==this._ultimoHashProximos) {
      this._ultimoHashDados=hD; this._ultimoHashOdds=hO; this._ultimoHashProximos=hP; return true;
    }
    return false;
  },

  forcarRerender() { this._ultimoHashDados = null; },
};

Estado.carregar();

// ─── RESTAURAR HORAS POR LIGA ─────────────────────────────────────────────────
let _ultimaLigaHorasRestauradas = null;
function restaurarHorasSeletor() {
  const key = Estado._horasKey();
  if (_ultimaLigaHorasRestauradas === key) return;
  _ultimaLigaHorasRestauradas = key;
  const salvo = localStorage.getItem(key);
  if (!salvo) return;
  const el = document.querySelector("#seletorHoras");
  if (el && el.value !== salvo) { el.value = salvo; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUADRANTES — lógica integrada
// ═══════════════════════════════════════════════════════════════════════════════

const blocosDeMinutos = [
  [1, 4, 7, 10, 13],
  [16, 19, 22, 25, 28],
  [31, 34, 37, 40, 43],
  [46, 49, 52, 55, 58]
];

const counterMarketMap = {
  'ambasMarcam':    'ambasNaoMarcam',
  'ambasNaoMarcam': 'ambasMarcam',
  'casaVence':      'empateOuFora',
  'foraVence':      'empateOuCasa',
  'empate':         'casaOuFora',
  'viradinha':      null,
  'over0.5':        'under0.5',
  'under0.5':       'over0.5',
  'over1.5':        'under1.5',
  'under1.5':       'over1.5',
  'over2.5':        'under2.5',
  'under2.5':       'over2.5',
  'over3.5':        'under3.5',
  'under3.5':       'over3.5',
  'over5':          null,
  'exato0': null, 'exato1': null, 'exato2': null, 'exato3': null, 'exato4': null,
  'exato2t0': null, 'exato2t1': null, 'exato2t2': null, 'exato2t3': null, 'exato2t4': null,
  'casa0Gols': null, 'casa1Gol': null, 'casa2Gols': null, 'casa3Gols': null, 'casa4Gols': null,
  'fora0Gols': null, 'fora1Gol': null, 'fora2Gols': null, 'fora3Gols': null, 'fora4Gols': null,
};

// ─── MERCADOS EXTRAS — lógica de estado ──────────────────────────────────────
function mercadoPrincipalAtual() {
  return document.querySelector("#seletorResultado")?.value || "";
}
function mercadoEhContrarioDoPrincipal(mercado) {
  const principal = mercadoPrincipalAtual();
  return counterMarketMap[principal] === mercado || counterMarketMap[mercado] === principal;
}
function mercadosExtrasAdicionar(mercado) {
  if (!mercado) return;
  if (Estado.mercadosExtras.some(m => m.mercado === mercado)) return;
  if (Estado.mercadosExtras.length >= MERCADOS_EXTRAS_MAX) return;
  Estado.mercadosExtras.push({ mercado, mostrarOdd: true, destacar: false });
  Estado.salvar();
  renderizarPainelMercadosExtras();
  renderizarRapido();
}
function mercadosExtrasRemover(mercado) {
  Estado.mercadosExtras = Estado.mercadosExtras.filter(m => m.mercado !== mercado);
  Estado.salvar();
  renderizarPainelMercadosExtras();
  renderizarRapido();
}
function mercadosExtrasToggleFlag(mercado, flag) {
  const item = Estado.mercadosExtras.find(m => m.mercado === mercado);
  if (!item) return;
  if (flag === "destacar") {
    // Apenas 1 mercado extra pode ficar em destaque por vez (além do mercado principal)
    const novoValor = !item.destacar;
    Estado.mercadosExtras.forEach(m => { m.destacar = false; });
    item.destacar = novoValor;
  } else {
    item[flag] = !item[flag];
  }
  Estado.salvar();
  renderizarPainelMercadosExtras();
  renderizarRapido();
}
function corMercadoExtra(mercado) {
  const idx = Estado.mercadosExtras.findIndex(m => m.mercado === mercado);
  return CORES_ODD[idx % CORES_ODD.length] || CORES_ODD[0];
}

// ─── MERCADOS EXTRAS — renderização do painel (popover na barra) ─────────────
function renderizarPainelMercadosExtras() {
  const btn = document.getElementById("btnMercadosExtras");
  const countEl = document.getElementById("mercadosExtrasCount");
  const select = document.getElementById("selectNovoMercadoExtra");
  const lista = document.getElementById("listaMercadosExtras");
  if (!btn || !select || !lista) return;

  // Contador no botão
  if (Estado.mercadosExtras.length > 0) {
    countEl.textContent = `(${Estado.mercadosExtras.length})`;
    countEl.style.display = "inline";
  } else {
    countEl.style.display = "none";
  }

  // Popula o select de "adicionar" clonando as opções do seletor principal
  const origem = document.querySelector("#seletorResultado");
  select.innerHTML = '<option value="">+ Adicionar mercado…</option>';
  if (origem) {
    const principal = mercadoPrincipalAtual();
    const jaAdicionados = new Set(Estado.mercadosExtras.map(m => m.mercado));
    Array.from(origem.querySelectorAll("optgroup")).forEach(og => {
      const novoGroup = document.createElement("optgroup");
      novoGroup.label = og.label;
      let temOpcaoValida = false;
      Array.from(og.querySelectorAll("option")).forEach(opt => {
        const val = opt.value;
        if (!val || val === principal || jaAdicionados.has(val)) return;
        const novoOpt = document.createElement("option");
        novoOpt.value = val;
        novoOpt.textContent = opt.textContent;
        if (mercadoEhContrarioDoPrincipal(val)) {
          novoOpt.disabled = true;
          novoOpt.textContent += " (oposto ao mercado atual)";
        }
        novoGroup.appendChild(novoOpt);
        temOpcaoValida = true;
      });
      if (temOpcaoValida) select.appendChild(novoGroup);
    });
  }
  select.disabled = Estado.mercadosExtras.length >= MERCADOS_EXTRAS_MAX;

  // Lista de tags já adicionadas
  lista.innerHTML = "";
  Estado.mercadosExtras.forEach(item => {
    const cor = corMercadoExtra(item.mercado);
    const label = LABEL_CURTO_MERCADO[item.mercado] || item.mercado;
    const contrario = mercadoEhContrarioDoPrincipal(item.mercado);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;background:#1a2030;border:1px solid "+cor+";border-radius:6px;padding:4px 6px;font-size:0.8em;";
    row.innerHTML = `
      <span style="width:8px;height:8px;border-radius:50%;background:${cor};flex-shrink:0;"></span>
      <span style="color:#e5e7eb;flex:1;" title="${contrario?'Atenção: oposto ao mercado principal atual':''}">${label}${contrario?" ⚠":""}</span>
      <button type="button" data-acao="odd" data-mercado="${item.mercado}"
        title="Mostrar odd na tabela" style="cursor:pointer;background:none;border:none;opacity:${item.mostrarOdd?1:0.35};font-size:1em;">💰</button>
      <button type="button" data-acao="destaque" data-mercado="${item.mercado}"
        title="Destacar sobreposição na tabela" style="cursor:pointer;background:none;border:none;opacity:${item.destacar?1:0.35};font-size:1em;">✨</button>
      <button type="button" data-acao="remover" data-mercado="${item.mercado}"
        title="Remover" style="cursor:pointer;background:none;border:none;color:#f87171;font-size:1em;">✕</button>
    `;
    lista.appendChild(row);
  });
}

// ─── MERCADOS EXTRAS — badges de odd na célula ───────────────────────────────
function renderizarBadgesMercadosExtras(placarEl, oddsObj) {
 try {
  if (!Estado.mercadosExtras.length) return;
  Estado.mercadosExtras.forEach(item => {
    if (!item.mostrarOdd) return;
    const val = getOddValue(oddsObj, item.mercado);
    if (!val || val === "N/A") return;
    const b = document.createElement("div");
    b.className = "odd-extra-badge";
    b.style.cssText = `font-size:0.68em;line-height:1;margin-top:1px;padding:1px 3px;border-radius:3px;
      background:rgba(255,255,255,0.08);color:#ffffff;white-space:nowrap;`;
    b.textContent = `${LABEL_CURTO_MERCADO[item.mercado] || item.mercado} @${val}`;
    placarEl.appendChild(b);
  });
 } catch (e) { console.error("Erro badges mercados extras:", e); }
}

// ─── MERCADOS EXTRAS — destaque de 2º mercado na célula ──────────────────────
function aplicarDestaquesMercadosExtras(cel, rA, rB, htA, htB) {
 try {
  const ativos = Estado.mercadosExtras.filter(m => m.destacar);
  cel.classList.remove("destaque-extra");
  cel.querySelectorAll(".destaque-extra-dot").forEach(d => d.remove());
  if (!ativos.length) return;
  let algumBateu = false;
  ativos.forEach(item => {
    if (verificarAcerto(item.mercado, rA, rB, htA, htB)) {
      algumBateu = true;
      const dot = document.createElement("span");
      dot.className = "destaque-extra-dot";
      dot.title = LABEL_CURTO_MERCADO[item.mercado] || item.mercado;
      dot.style.cssText = `position:absolute;top:2px;right:2px;width:6px;height:6px;border-radius:50%;
        background:var(--destaque-extra-color, #93C5FD);box-shadow:0 0 3px var(--destaque-extra-color, #93C5FD);`;
      cel.style.position = "relative";
      cel.appendChild(dot);
    }
  });
  if (algumBateu) cel.classList.add("destaque-extra");
 } catch (e) { console.error("Erro destaque mercados extras:", e); }
}

// ─── MERCADOS EXTRAS — aplica a cor de destaque globalmente (sem re-render) ──
function aplicarCorDestaqueExtraGlobal() {
  document.documentElement.style.setProperty("--destaque-extra-color", Estado.corDestaqueExtra || "#93C5FD");
}

// ─── MERCADOS EXTRAS — odds extras no tooltip ────────────────────────────────
function tooltipMercadosExtrasHTML(oddsObj) {
  if (!Estado.mercadosExtras.length) return "";
  return Estado.mercadosExtras.filter(m => m.mostrarOdd).map(item => {
    const val = getOddValue(oddsObj, item.mercado);
    if (!val || val === "N/A") return "";
    const label = LABEL_CURTO_MERCADO[item.mercado] || item.mercado;
    return `<span class="odd-tooltip odd-tooltip-extra">${label} @${val}</span>`;
  }).join("");
}

let qdNumPreviousHours = 1;
let qdDadosCache = null; // cache de dados para não buscar duas vezes
let _ultimaFreqOdds = new Map(); // cache das odds contadas no último render (mercado selecionado)

// ─── Obtém hora e data do registro mais recente nos dados ─────────────────────
function qdGetHoraAtual(resultados) {
  if (resultados && resultados.length > 0) {
    // Ordena pelo timestamp mais recente
    const sorted = [...resultados].sort((a, b) => {
      const tA = new Date(`${a.data.split('T')[0]}T${a.hora.toString().padStart(2,'0')}:${(a.minuto||0).toString().padStart(2,'00')}:00`).getTime();
      const tB = new Date(`${b.data.split('T')[0]}T${b.hora.toString().padStart(2,'0')}:${(b.minuto||0).toString().padStart(2,'00')}:00`).getTime();
      return tB - tA;
    });
    const rec = sorted[0];
    const dateStr = rec.data.includes('T') ? rec.data.split('T')[0] : rec.data.split('/').reverse().join('-');
    return { hora: rec.hora, dateStr };
  }
  // Fallback para hora do sistema
  const now = new Date();
  return { hora: now.getHours(), dateStr: now.toISOString().split('T')[0] };
}

// ─── KEY DO CHECKBOX DOS QUADRANTES ──────────────────────────────────────────
const QD_CHECKBOX_KEY = "quadrantesAtivos";

function qdCheckboxAtivo() {
  // Se nunca foi salvo, padrão é DESATIVADO (não pisca na primeira carga)
  const val = localStorage.getItem(QD_CHECKBOX_KEY);
  return val === "1";
}

function qdSalvarCheckbox(ativo) {
  localStorage.setItem(QD_CHECKBOX_KEY, ativo ? "1" : "0");
}

// ─── checkMarket para quadrantes ─────────────────────────────────────────────
function qdCheckMarket(ftScore, htScore, market) {
  if (!ftScore || !ftScore.includes('x')) return false;
  const [golsCasa, golsFora] = ftScore.split(' x ').map(Number).map(g => isNaN(g) ? 0 : g);
  const totalGols = golsCasa + golsFora;
  let golsCasaHT = 0, golsForaHT = 0, golsCasa2T = 0, golsFora2T = 0;
  if (htScore && htScore.includes('x')) {
    const [htCasa, htFora] = htScore.split(' x ').map(Number).map(g => isNaN(g) ? 0 : g);
    golsCasaHT = htCasa; golsForaHT = htFora;
    golsCasa2T = Math.max(0, golsCasa - htCasa);
    golsFora2T = Math.max(0, golsFora - htFora);
  }
  const total2T = golsCasa2T + golsFora2T;
  switch (market) {
    case 'ambasMarcam':    return golsCasa > 0 && golsFora > 0;
    case 'ambasNaoMarcam': return golsCasa === 0 || golsFora === 0;
    case 'casaVence':      return golsCasa > golsFora;
    case 'foraVence':      return golsFora > golsCasa;
    case 'empate':         return golsCasa === golsFora;
    case 'viradinha':      {
      // Viradinha: quem venceu no HT perde no FT
      // Casa venceu HT mas perdeu FT, OU Fora venceu HT mas perdeu FT
      const casaVenceuHT = golsCasaHT > golsForaHT;
      const foraVenceuHT = golsForaHT > golsCasaHT;
      const casaPerdeuFT = golsCasa < golsFora;
      const foraPerdeuFT = golsFora < golsCasa;
      return (casaVenceuHT && casaPerdeuFT) || (foraVenceuHT && foraPerdeuFT);
    }
    case 'empateOuFora':   return golsCasa <= golsFora;
    case 'empateOuCasa':   return golsCasa >= golsFora;
    case 'casaOuFora':     return golsCasa !== golsFora;
    case 'over0.5':  return totalGols > 0.5;
    case 'over1.5':  return totalGols > 1.5;
    case 'over2.5':  return totalGols > 2.5;
    case 'over3.5':  return totalGols > 3.5;
    case 'over5':    return totalGols >= 5;
    case 'under0.5': return totalGols < 0.5;
    case 'under1.5': return totalGols < 1.5;
    case 'under2.5': return totalGols < 2.5;
    case 'under3.5': return totalGols < 3.5;
    case 'exato0':   return totalGols === 0;
    case 'exato1':   return totalGols === 1;
    case 'exato2':   return totalGols === 2;
    case 'exato3':   return totalGols === 3;
    case 'exato4':   return totalGols === 4;
    case 'exato2t0': return total2T === 0;
    case 'exato2t1': return total2T === 1;
    case 'exato2t2': return total2T === 2;
    case 'exato2t3': return total2T === 3;
    case 'exato2t4': return total2T === 4;
    case 'casa0Gols': return golsCasa === 0;
    case 'casa1Gol':  return golsCasa === 1;
    case 'casa2Gols': return golsCasa === 2;
    case 'casa3Gols': return golsCasa === 3;
    case 'casa4Gols': return golsCasa === 4;
    case 'fora0Gols': return golsFora === 0;
    case 'fora1Gol':  return golsFora === 1;
    case 'fora2Gols': return golsFora === 2;
    case 'fora3Gols': return golsFora === 3;
    case 'fora4Gols': return golsFora === 4;
    default: return false;
  }
}

function qdCalcStats(jogos, minutosDoBloco, selectedMarket, counterMarket) {
  const stats = { totalGols: 0, marketHits: 0, counterMarketHits: 0 };
  const jogosDoBloco = jogos.filter(j => minutosDoBloco.includes(j.minuto));
  for (const jogo of jogosDoBloco) {
    const [golsCasa, golsFora] = jogo.ft.split(' x ').map(Number).map(g => isNaN(g) ? 0 : g);
    stats.totalGols += golsCasa + golsFora;
    if (qdCheckMarket(jogo.ft, jogo.ht, selectedMarket)) stats.marketHits++;
    if (counterMarket && qdCheckMarket(jogo.ft, jogo.ht, counterMarket)) stats.counterMarketHits++;
  }
  return stats;
}

function qdCreateBlocoThs(index, timeSlots) {
  const qIdx        = index % 4;
  const isFirstBloco = index === 0;
  let innerHtml = '';
  timeSlots.forEach((slot, slotIdx) => {
    const isCurrent       = slotIdx === 0;
    const labelColor      = isCurrent ? '#e5e7eb' : '#9ca3af';
    const labelWeight     = isCurrent ? '600' : '400';
    const labelSize       = isCurrent ? '11px' : '10px';
    const mtStyle         = slotIdx > 0 ? 'margin-top:0.25rem;' : '';
    const golsBorderColor = isCurrent ? 'rgba(75,85,99,0.6)' : 'rgba(55,65,81,0.6)';
    const golsBgColor     = isCurrent ? 'rgba(75,85,99,0.1)' : 'rgba(55,65,81,0.1)';
    const golsTextColor   = isCurrent ? '#e5e7eb' : '#d1d5db';
    const hitBorderColor  = isCurrent ? '#3a3f4b' : 'rgba(4,120,87,0.6)';
    const hitBgColor      = isCurrent ? 'rgba(1,139,6,0.1)' : 'rgb(41,45,54)';
    const hitTextColor    = isCurrent ? '#018b06' : '#6ee7b7';
    const counterBgColor  = isCurrent ? 'rgba(190,14,2,0.1)' : 'rgba(190,18,60,0.1)';
    const counterTextColor= isCurrent ? '#be0e02' : '#fda4af';
    const labelTxt        = isCurrent
      ? `H.Atual: ${slot.hour.toString().padStart(2,'0')}`
      : `H.Ant.${slotIdx}: ${slot.hour.toString().padStart(2,'0')}`;

    innerHtml += `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;${mtStyle}white-space:nowrap;">
        <span id="qd-label-${index}-${slotIdx}" style="color:${labelColor};font-weight:${labelWeight};font-size:${labelSize};">${labelTxt}</span>
        <div style="display:flex;align-items:center;gap:0.25rem;">
<span style="display:inline-flex;align-items:center;gap:0.15rem;" title="Gols">
  <span style="font-size:10px;line-height:1;">⚽</span>
  <strong id="qd-gols-${index}-${slotIdx}" style="font-size:11px;line-height:1;">0</strong>
</span>

<span style="display:inline-flex;align-items:center;gap:0.15rem;" title="Acertos">
  <span style="font-size:10px;line-height:1;">✅</span>
  <strong id="qd-hits-${index}-${slotIdx}" style="font-size:11px;line-height:1;">0</strong>
</span>

<span style="display:inline-flex;align-items:center;gap:0.15rem;" title="Erros">
  <span style="font-size:10px;line-height:1;">❌</span>
  <strong id="qd-counter-${index}-${slotIdx}" style="font-size:11px;line-height:1;">0</strong>
</span>
        </div>
      </div>`;
  });
  return `<th colspan="5" class="qd-bloco-th qd-${qIdx}" style="padding:0.4rem 0.5rem;text-align:left;font-size:12px;line-height:1.2;${isFirstBloco ? '' : 'border-left:3px solid rgba(255,255,255,0.35);'}">${innerHtml}</th>`;
}

// ─── Calcula qual bloco está ao vivo agora ────────────────────────────────────
function qdBlocoAtual() {
  const minAtual = new Date().getMinutes();
  for (let i = 0; i < blocosDeMinutos.length; i++) {
    const mins = blocosDeMinutos[i];
    if (minAtual >= mins[0] && minAtual <= mins[mins.length - 1] + 2) return i;
  }
  // Entre blocos — retorna o próximo
  for (let i = 0; i < blocosDeMinutos.length; i++) {
    if (minAtual < blocosDeMinutos[i][0]) return i;
  }
  return 0; // volta ao início (minuto 58+ → bloco 0 da próxima hora)
}

function qdNomeBlocoLabel(blocoIdx) {
  const mins = blocosDeMinutos[blocoIdx];
  return `Q${blocoIdx + 1} (${mins[0]}-${mins[mins.length - 1]})`;
}

// Atualiza apenas o indicador "AO VIVO" nas células do bloco ativo
function qdAtualizarIndicadorAoVivo() {
  const blocoAtivo = qdBlocoAtual();
  document.querySelectorAll(".qd-bloco-th").forEach((th, i) => {
    const badge = th.querySelector(".qd-live-badge");
    const wasAtivo = th.classList.contains("qd-bloco-ativo");
    const isAtivo  = (i === blocoAtivo);

    th.classList.toggle("qd-bloco-ativo", isAtivo);

    if (isAtivo && !badge) {
      const b = document.createElement("span");
      b.className = "qd-live-badge";
      b.innerHTML = `<span class="qd-live-dot"></span>Q${i+1}`;
      // Insere antes da primeira div de conteúdo, dentro da primeira linha
      const firstDiv = th.querySelector("div");
      if (firstDiv) firstDiv.insertBefore(b, firstDiv.firstChild);
      else th.insertBefore(b, th.firstChild);
    } else if (!isAtivo && badge) {
      badge.remove();
    }
  });
}

// Atualiza só os números e labels de hora sem recriar a estrutura
function qdRenderTabelaValores(resultados) {
  if (!qdCheckboxAtivo()) return;
  if (!document.querySelector("#trQuadrantes")) return;

  const { hora: horaAtualNumero, dateStr: dataAtualStr } = qdGetHoraAtual(resultados);
  let timeSlots = [];
  let currentDate = new Date(dataAtualStr + 'T12:00:00');
  let currentHour = horaAtualNumero;
  for (let i = 0; i <= qdNumPreviousHours; i++) {
    timeSlots.push({ date: currentDate.toISOString().split('T')[0], hour: currentHour });
    currentHour--;
    if (currentHour < 0) { currentHour = 23; currentDate.setDate(currentDate.getDate() - 1); }
  }
  const jogosPorSlot = timeSlots.map(slot =>
    (resultados||[]).filter(jogo => jogo.data.split('T')[0] === slot.date && jogo.hora === slot.hour).slice(0, 20)
  );
  // Atualiza labels de hora
  timeSlots.forEach((slot, slotIdx) => {
    for (let i = 0; i < blocosDeMinutos.length; i++) {
      const labelEl = document.getElementById(`qd-label-${i}-${slotIdx}`);
      if (labelEl) {
        labelEl.textContent = slotIdx === 0
          ? `H.Atual: ${slot.hour.toString().padStart(2,'0')}`
          : `H.Ant.${slotIdx}: ${slot.hour.toString().padStart(2,'00')}`;
      }
    }
  });
  const selectedMarket = document.querySelector('#seletorResultado')?.value || 'over2.5';
  const counterMarket  = counterMarketMap[selectedMarket];
  blocosDeMinutos.forEach((minutosDoBloco, index) => {
    timeSlots.forEach((slot, slotIdx) => {
      const stats = qdCalcStats(jogosPorSlot[slotIdx], minutosDoBloco, selectedMarket, counterMarket);
      const golsEl    = document.getElementById(`qd-gols-${index}-${slotIdx}`);
      const hitsEl    = document.getElementById(`qd-hits-${index}-${slotIdx}`);
      const counterEl = document.getElementById(`qd-counter-${index}-${slotIdx}`);
      if (golsEl)    golsEl.innerText    = stats.totalGols;
      if (hitsEl)    hitsEl.innerText    = stats.marketHits;
      if (counterEl) counterEl.innerText = stats.counterMarketHits;
    });
  });
  // Sempre re-aplica o destaque do bloco ativo após atualizar valores
  qdAtualizarIndicadorAoVivo();
}

function qdRenderTabela(resultados) {
  if (!qdCheckboxAtivo()) return;

  const thead = document.querySelector("#tabelaResultados thead");
  if (!thead) return;

  const { hora: horaAtualNumero, dateStr: dataAtualStr } = qdGetHoraAtual(resultados);
  let timeSlots = [];
  let currentDate = new Date(dataAtualStr + 'T12:00:00');
  let currentHour = horaAtualNumero;
  for (let i = 0; i <= qdNumPreviousHours; i++) {
    timeSlots.push({ date: currentDate.toISOString().split('T')[0], hour: currentHour });
    currentHour--;
    if (currentHour < 0) { currentHour = 23; currentDate.setDate(currentDate.getDate() - 1); }
  }

  const jogosPorSlot = timeSlots.map(slot =>
    (resultados||[]).filter(jogo => jogo.data.split('T')[0] === slot.date && jogo.hora === slot.hour).slice(0, 20)
  );

  // Só recria a estrutura quando qdNumPreviousHours muda (não a cada hora)
  const structKey = `${qdNumPreviousHours}`;

  let trQD = thead.querySelector("#trQuadrantes");
  if (!trQD || trQD.dataset.structKey !== structKey) {
    if (trQD) trQD.remove();
    trQD = document.createElement("tr");
    trQD.id = "trQuadrantes";
    trQD.dataset.structKey = structKey;

    let trHtml = "";
    trHtml += `<th style="position:sticky;left:0;z-index:10;background-color:#292d36;width:36px;min-width:36px;text-align:center;color:#d1d5db;font-weight:700;font-size:11px;padding:4px 3px;white-space:nowrap;">QDT<br><div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-top:3px;"><button id="qd-decrease" class="blocos-button" style="line-height:1;padding:1px 5px;">-</button><span id="qd-num-prev" style="color:white;font-size:11px;">${qdNumPreviousHours}</span><button id="qd-increase" class="blocos-button" style="line-height:1;padding:1px 5px;">+</button></div></th>`;
    for (let i = 0; i < blocosDeMinutos.length; i++) {
      trHtml += qdCreateBlocoThs(i, timeSlots);
    }
    trHtml += `<th style="background-color:#292d36;"></th><th style="background-color:#292d36;"></th>`;
    trQD.innerHTML = trHtml;

    thead.insertBefore(trQD, thead.firstChild);

    trQD.querySelector("#qd-decrease")?.addEventListener("click", () => {
      if (qdNumPreviousHours > 0) { qdNumPreviousHours--; qdAtualizarComCache(); }
    });
    trQD.querySelector("#qd-increase")?.addEventListener("click", () => {
      qdNumPreviousHours++; qdAtualizarComCache();
    });
  }

  // Sempre atualiza labels de hora (sem recriar a estrutura)
  timeSlots.forEach((slot, slotIdx) => {
    for (let i = 0; i < blocosDeMinutos.length; i++) {
      const labelEl = document.getElementById(`qd-label-${i}-${slotIdx}`);
      if (labelEl) {
        labelEl.textContent = slotIdx === 0
          ? `H.Atual: ${slot.hour.toString().padStart(2,'0')}`
          : `H.Ant.${slotIdx}: ${slot.hour.toString().padStart(2,'0')}`;
      }
    }
  });

  // Atualiza valores numéricos
  const selectedMarket = document.querySelector('#seletorResultado')?.value || 'over2.5';
  const counterMarket  = counterMarketMap[selectedMarket];
  blocosDeMinutos.forEach((minutosDoBloco, index) => {
    timeSlots.forEach((slot, slotIdx) => {
      const stats = qdCalcStats(jogosPorSlot[slotIdx], minutosDoBloco, selectedMarket, counterMarket);
      const golsEl    = document.getElementById(`qd-gols-${index}-${slotIdx}`);
      const hitsEl    = document.getElementById(`qd-hits-${index}-${slotIdx}`);
      const counterEl = document.getElementById(`qd-counter-${index}-${slotIdx}`);
      if (golsEl)    golsEl.innerText    = stats.totalGols;
      if (hitsEl)    hitsEl.innerText    = stats.marketHits;
      if (counterEl) counterEl.innerText = stats.counterMarketHits;
    });
  });

  // Sempre re-aplica o destaque do bloco ativo após renderizar
  qdAtualizarIndicadorAoVivo();
}

function qdAtualizarComCache() {
  // Remove o tr para forçar recriação (numPreviousHours mudou — estrutura precisa mudar)
  const trQD = document.querySelector("#trQuadrantes");
  if (trQD) trQD.remove();
  qdRenderTabela(qdDadosCache);
}

// Sem wrapper externo — os quadrantes ficam no thead da tabela principal.
// Esta função só garante que não existe o wrapper antigo caso o código tenha sido atualizado.
function garantirQuadrantesWrapper() {
  const old = document.getElementById("quadrantes-wrapper");
  if (old) old.remove();
}

// ─── TOGGLE VISIBILIDADE DOS QUADRANTES ───────────────────────────────────────
function qdToggle(ativo) {
  qdSalvarCheckbox(ativo);
  const trQD = document.querySelector("#trQuadrantes");
  if (ativo) {
    // Ativo: mostra se existe, senão renderiza
    if (trQD) {
      trQD.style.display = "";
      qdAtualizarIndicadorAoVivo();
    } else if (qdDadosCache) {
      qdRenderTabela(qdDadosCache);
    }
  } else {
    // Desativado: REMOVE o trQD completamente para não reaparecer ao trocar liga
    if (trQD) trQD.remove();
  }
  qdAplicarSeparadorTabela(ativo);
}

// Aplica/remove a classe quadrant-border nas células da tabela principal
function qdAplicarSeparadorTabela(ativo) {
  if (ativo) {
    document.querySelectorAll(".minute-header").forEach((th, i) => {
      th.classList.toggle("quadrant-border", i > 0 && i % 5 === 0);
    });
    document.querySelectorAll("#tabelaResultados tbody tr").forEach(row => {
      Array.from(row.cells).forEach((cell, i) => {
        if (i < 1 || i >= 1 + minutosFixos.length) return;
        cell.classList.toggle("quadrant-border", (i - 1) > 0 && (i - 1) % 5 === 0);
      });
    });
  } else {
    document.querySelectorAll(".quadrant-border").forEach(el => el.classList.remove("quadrant-border"));
  }
}

// ─── CHECKBOX DOS QUADRANTES ──────────────────────────────────────────────────
function garantirCheckboxQuadrantes() {
  if (document.getElementById("lbl-quadrantes-toggle")) return;

  const painel = document.getElementById("painel-cores");
  if (!painel) return; // painel ainda não criado, será chamado novamente

  const lbl = document.createElement("label");
  lbl.id = "lbl-quadrantes-toggle";
  lbl.className = "alerta-toggle-label";
  lbl.style.cssText = "margin-left:6px;";
  lbl.innerHTML = `<input type="checkbox" id="cb-quadrantes-toggle"> Quadrantes`;

  const cb = lbl.querySelector("#cb-quadrantes-toggle");
  cb.checked = qdCheckboxAtivo();
  if (cb.checked) lbl.classList.add("alerta-ativo");

  cb.addEventListener("change", function () {
    lbl.classList.toggle("alerta-ativo", this.checked);
    qdToggle(this.checked);
  });

  painel.appendChild(lbl);
}

// ─── INJEÇÃO DE ESTILOS ───────────────────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById("multi-select-styles")) return;
  const style = document.createElement("style");
  style.id = "multi-select-styles";
  style.textContent = `
    .odd-selecionada {
      border: 3px solid var(--sel-color, #A855F7) !important;
      outline: none !important; color: var(--sel-color, #A855F7) !important;
    }
    .time-nome-selecionado {
      background-color: var(--sel-color, #A855F7) !important;
      color: #000 !important; border-radius: 3px; padding: 0 2px; font-weight: bold;
    }
    .placar-score-ft-sel {
      background-color: var(--sel-color-ft, #A855F7) !important;
      color: #000 !important; border-radius: 3px; padding: 0 3px; font-weight: bold;
    }
    .placar-score-ht-sel {
      background-color: var(--sel-color-ht, #10B981) !important;
      color: #000 !important; border-radius: 3px; padding: 0 3px; font-weight: bold;
    }
    .ht-span { cursor: pointer; opacity: 0.85; transition: opacity 0.15s; }
    .ht-span:hover { opacity: 1; text-decoration: underline dotted rgba(255,255,255,0.4); }
    .placar-futuro-odd { font-size:0.9em; opacity:0.85; margin-top:1px; color:#dfdfdf; font-weight:bold; cursor:pointer; }
    .placar-futuro .placar-texto { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0; line-height:1.1; }

    .minute-header { cursor:pointer; user-select:none; font-size:0.82em; font-weight:700; }
    .minute-header:hover { filter: brightness(1.6) !important; }

    .qd-0 { background-color: #1c2133 !important; box-shadow: inset 0 -2px 0 0 #374060; }
    .qd-1 { background-color: #232b3e !important; box-shadow: inset 0 -2px 0 0 #455070; }
    .qd-2 { background-color: #1a1f30 !important; box-shadow: inset 0 -2px 0 0 #303858; }
    .qd-3 { background-color: #20283b !important; box-shadow: inset 0 -2px 0 0 #3d4868; }

    .qd-cell-0 { background-color: rgba(55,64,96,0.10) !important; }
    .qd-cell-1 { background-color: rgba(69,80,112,0.16) !important; }
    .qd-cell-2 { background-color: rgba(48,56,88,0.10) !important; }
    .qd-cell-3 { background-color: rgba(61,72,104,0.16) !important; }
    td[data-resultado="acerto"] { background-color: var(--cor-green, #018b06) !important; }
    td[data-resultado="erro"]   { background-color: var(--cor-red,   #be0e02) !important; }

    #tabelaResultados.tem-coluna-selecionada td:not(.coluna-selecionada)             { filter: brightness(0.45); }
    #tabelaResultados.tem-coluna-selecionada th.minute-header:not(.coluna-selecionada) { filter: brightness(0.45); }
    #tabelaResultados.tem-coluna-selecionada td.coluna-selecionada                   { filter: none; }
    #tabelaResultados.tem-coluna-selecionada th.coluna-selecionada                   { filter: none; background: rgba(255,255,255,0.2) !important; }
    #tabelaResultados.tem-coluna-selecionada td:first-child,
    #tabelaResultados.tem-coluna-selecionada td:nth-last-child(1),
    #tabelaResultados.tem-coluna-selecionada td:nth-last-child(2),
    #tabelaResultados.tem-coluna-selecionada td:nth-last-child(3),
    #tabelaResultados.tem-coluna-selecionada td:nth-last-child(4) { filter: none; }

    td.quadrant-border, th.quadrant-border { border-left: 3px solid rgba(255,255,255,0.35) !important; }

    /* Linha dos quadrantes no thead da tabela principal */
    .qd-bloco-th { vertical-align: top; }
    .qd-bloco-th.qd-0 { background-color: #1c2133 !important; }
    .qd-bloco-th.qd-1 { background-color: #232b3e !important; }
    .qd-bloco-th.qd-2 { background-color: #1a1f30 !important; }
    .qd-bloco-th.qd-3 { background-color: #20283b !important; }

    /* Bloco ao vivo — destaque na linha de quadrantes */
    .qd-bloco-th.qd-bloco-ativo {
      background-color: rgba(31,172,137,0.18) !important;
      box-shadow: inset 0 0 0 2px rgba(31,172,137,0.55);
    }
    .qd-live-badge {
      display: inline-flex; align-items: center; gap: 3px;
      background: rgba(31,172,137,0.22); color: #1fac89;
      border: 1px solid rgba(31,172,137,0.5); border-radius: 4px;
      font-size: 9px; font-weight: 700; padding: 1px 4px;
      margin-right: 4px; white-space: nowrap; vertical-align: middle;
    }
    .qd-live-dot {
      display: inline-block; width: 7px; height: 7px; border-radius: 50%;
      background: #1fac89;
      animation: qdLivePulse 1.2s ease-in-out infinite;
    }
    @keyframes qdLivePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }

    #coluna-stats { display:flex; flex-wrap:wrap; gap:5px; padding:5px 8px; margin-bottom:4px; }
    #coluna-stats:empty { display:none; }

    #melhores-odds-bar { display:none; align-items:center; flex-wrap:wrap; gap:8px; padding:6px 8px; margin-bottom:6px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:8px; }
    .mo-title { display:inline-flex; align-items:center; gap:5px; font-size:0.75em; font-weight:700; color:#8b94a3; text-transform:uppercase; letter-spacing:0.4px; white-space:nowrap; }
    .mo-vazio { font-size:0.78em; color:#6b7280; }
    .mo-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:3px 9px; font-size:0.78em; }
    .mo-odd { font-weight:700; color:#f0c040; }
    .mo-bar { width:40px; height:4px; border-radius:3px; background:rgba(255,255,255,0.1); overflow:hidden; }
    .mo-bar-fill { display:block; height:100%; background:#4ade80; border-radius:3px; }
    .mo-count { color:#9ca3af; font-weight:600; }
    .col-stat-tag { display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,0.08); border-radius:8px; padding:3px 10px; font-size:0.76em; white-space:nowrap; color:#fff; }
    .col-stat-tag .col-min { font-weight:bold; color:#ccc; }
    .col-stat-tag .col-g { color:#4cff55; font-weight:bold; }
    .col-stat-tag .col-r { color:#ff5555; font-weight:bold; }
    .col-stat-tag .col-pct { padding:1px 6px; border-radius:8px; font-weight:bold; color:#fff; margin-left:2px; }
    .col-stat-verde  { background:#018b06; }
    .col-stat-branca { background:#555; }
    .col-stat-tag .col-remove { cursor:pointer; opacity:0.6; margin-left:2px; }
    .col-stat-tag .col-remove:hover { opacity:1; }
    .odd-tooltip { color:#f0c040; font-weight:bold; margin-top:3px; display:block; }
    /* Tooltip: nomes dos times em amarelo igual à odd */
    .tooltip .times { color:#f0c040 !important; font-weight:bold; }
    /* Hover nos nomes dos times nas células normais */
    .placar .time-casa:hover,
    .placar .time-fora:hover { color:#f0c040 !important; opacity:1 !important; }

    #selecao-indicator { display:flex; flex-wrap:wrap; gap:6px; padding:6px 8px; margin-bottom:6px; }
    #selecao-indicator:empty { display:none; }
    .sel-tag { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:12px; font-size:0.75em; font-weight:bold; color:#fff; border:2px solid rgba(255,255,255,0.25); white-space:nowrap; }
    .sel-tag .sel-remove { cursor:pointer; opacity:0.8; padding:0 1px; }
    .sel-tag .sel-remove:hover { opacity:1; }

    #toast-container { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:9999; pointer-events:none; display:flex; flex-direction:column; align-items:center; gap:6px; }
    .toast { background:#333; color:#fff; padding:8px 18px; border-radius:20px; font-size:0.82em; opacity:0; animation: toastIn 0.25s ease forwards, toastOut 0.3s ease 1.8s forwards; }
    @keyframes toastIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes toastOut { from{opacity:1} to{opacity:0} }

    #painel-selecao { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:6px; flex-wrap:wrap; }
    #selecao-indicator { margin-bottom:0; flex:1; min-width:0; }
    #stats-selecao { display:flex; flex-direction:row; flex-wrap:wrap; gap:4px; flex-shrink:0; justify-content:flex-end; align-items:flex-start; }
    .stat-row { display:flex; align-items:center; gap:5px; background:rgba(255,255,255,0.06); border-radius:8px; padding:3px 10px; font-size:0.76em; white-space:nowrap; }
    .stat-color-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
    .stat-label { font-weight:bold; color:#fff; max-width:160px; overflow:hidden; text-overflow:ellipsis; }
    .stat-sep { color:rgba(255,255,255,0.25); margin:0 1px; }
    .stat-total { color:#ccc; font-weight:bold; }
    .stat-count-green { color:#4cff55; font-weight:bold; }
    .stat-count-red   { color:#ff5555; font-weight:bold; }
    .stat-pct { margin-left:3px; padding:1px 7px; border-radius:10px; font-weight:bold; color:#fff; font-size:0.9em; }
    .stat-pct-verde  { background:#018b06; }
    .stat-pct-branca { background:#555; }

    .th-icon { display:inline-flex; align-items:center; justify-content:center; vertical-align:middle; }
    .th-icon svg { display:block; }

    /* ── Painel "Cores das Células" — no mesmo padrão visual dos seletores do topo ── */
    #painel-cores {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 6px 2px; margin-top: -20px;
    }
    /* Base compartilhada por todos os "controles" do painel — mesma altura,
       mesmo raio e mesma paleta neutra usada nos <select> do topo da página */
    #painel-cores label,
    .btn-reset-cores {
      display:inline-flex; align-items:center; gap:6px;
      height:30px; padding:0 11px; box-sizing:border-box;
      background:#1c212f; border:1px solid rgba(255,255,255,0.09);
      border-radius:7px; font-size:0.76em; font-weight:600; color:#9ca3af;
      cursor:pointer; white-space:nowrap;
      transition:background 0.15s, border-color 0.15s, color 0.15s;
    }
    #painel-cores label:hover,
    .btn-reset-cores:hover { background:#242b3d; border-color:rgba(255,255,255,0.18); color:#d1d5db; }
    #painel-cores input[type="color"] {
      width:18px; height:18px; border:1px solid rgba(255,255,255,0.18);
      border-radius:5px; cursor:pointer; padding:0; background:none;
    }

    @keyframes streakPulse {
      0%   { box-shadow: 0 0 0 0px rgba(255,220,0,0),   inset 0 0 0 0px rgba(255,220,0,0); }
      25%  { box-shadow: 0 0 0 3px rgba(255,220,0,0.3), inset 0 0 0 3px rgba(255,220,0,1); }
      50%  { box-shadow: 0 0 0 0px rgba(255,220,0,0),   inset 0 0 0 3px rgba(255,220,0,1); }
      100% { box-shadow: 0 0 0 0px rgba(255,220,0,0),   inset 0 0 0 0px rgba(255,220,0,0); }
    }
    .streak-alerta {
      animation: streakPulse 1.8s ease-in-out infinite;
      z-index: 2; position: relative;
      outline: 2px solid rgba(255,220,0,0.6);
      outline-offset: -2px;
    }
    .alerta-toggle-label {
      display: inline-flex; align-items: center; gap: 6px;
      height:30px; padding: 0 11px; box-sizing:border-box;
      cursor: pointer; color: #9ca3af; font-size: 0.76em; font-weight: 600; user-select: none;
      border-radius: 7px; border: 1px solid rgba(255,255,255,0.09); background:#1c212f;
      transition: border-color 0.2s, color 0.2s, background 0.2s; letter-spacing: 0.2px; white-space: nowrap;
    }
    .alerta-toggle-label:hover { border-color: rgba(255,220,0,0.3); color: #d4af37; background: rgba(255,220,0,0.08); }
    .alerta-toggle-label input[type="checkbox"] { width: 12px; height: 12px; cursor: pointer; accent-color: #d4af37; flex-shrink: 0; }
    .alerta-ativo { color: #d4af37 !important; font-weight: 700; border-color: rgba(212,175,55,0.45) !important; background: rgba(212,175,55,0.08) !important; }

    /* Botão primário — preenchimento sólido, se destaca claramente como ação de confirmação */
    .btn-aplicar-cores {
      display:inline-flex; align-items:center; gap:5px;
      height:30px; padding:0 13px; box-sizing:border-box;
      background: #20283b;
      /* border: 1px solid #16a34a; */
      border-radius: 7px;
      cursor: pointer;
      color: #8ba3af;
      font-size:0.76em; font-weight:700;
      transition:background 0.15s, border-color 0.15s, box-shadow 0.15s; white-space:nowrap;
    }
    .btn-aplicar-cores:hover {
      background:#262f45;
      box-shadow:0 0 0 1px rgba(255,255,255,0.08);
    }
    .btn-aplicar-cores:active { transform:translateY(1px); }
    .btn-aplicar-cores svg { flex-shrink:0; }

    /* Top5: bolinha + brilho ciano no span do nome (funciona com e sem Ver Times) */
    .placar-futuro .time-casa.rk-top5-nome,
    .placar-futuro .time-fora.rk-top5-nome {
      font-weight: 800 !important;
      text-shadow: 0 0 6px #22D3EE, 0 0 10px #22D3EE !important;
    }
    .placar-futuro .time-casa.rk-top5-nome::before,
    .placar-futuro .time-fora.rk-top5-nome::before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #22D3EE;
      box-shadow: 0 0 4px #22D3EE, 0 0 8px #22D3EE;
      margin-right: 2px;
      vertical-align: middle;
      flex-shrink: 0;
    }

    /* Odd e time clicáveis nos próximos confrontos */
    .placar-futuro .time-casa,
    .placar-futuro .time-fora {
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .placar-futuro .time-casa:hover,
    .placar-futuro .time-fora:hover { opacity: 0.75; }
    .placar-futuro .placar-futuro-odd {
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .placar-futuro .placar-futuro-odd:hover { opacity: 0.7; }

    /* Colunas direitas combinadas: "Gols" (total + média) e "Dados" (% + quantidade) */
    .col-combo { width:24px !important; min-width:24px !important; max-width:28px !important; padding:1px 0 !important; text-align:center; }
    .col-combo .valor-principal { display:block; font-size:0.72em; font-weight:700; line-height:1.1; white-space:nowrap; }
    .col-combo .valor-sub       { display:block; font-size:0.58em; opacity:0.8; line-height:1.05; margin-top:1px; color:#93c5fd; white-space:nowrap; }
    .col-combo-th { font-size:0.65em !important; padding:2px 0 !important; }
    /* Faixas de cor do % — cor no TEXTO, sem preencher o fundo da célula: 0–29 vermelho / 30–49 amarelo / 50–100 verde */
    .pct-vermelho .valor-principal { color:#ff5c5c; }
    .pct-amarelo  .valor-principal { color:#f5c518; }
    .pct-verde    .valor-principal { color:#4ade80; }
    .pct-vermelho .valor-sub { color:#ff5c5c; opacity:0.75; }
    .pct-amarelo  .valor-sub { color:#f5c518; opacity:0.75; }
    .pct-verde    .valor-sub { color:#4ade80; opacity:0.75; }
    /* Tom azul para células com jogos ainda não realizados (próximos) */
    .cel-proximo-jogo { background-color:rgba(37,99,235,0.24) !important; box-shadow:inset 0 0 0 1px rgba(96,165,250,0.4); }
    /* Header rows das stats combinadas (Gols / Dados por coluna) mais baixos */
    #linhaGolsColuna th, #linhaDadosColuna th { font-size:0.72em !important; padding:1px 2px !important; line-height:1.1; }
    /* ── ZONA GREEN: Intensidade por coluna ── */
    td[data-resultado="acerto"].zg-low  { filter: brightness(0.55) saturate(0.7); }
    td[data-resultado="acerto"].zg-mid  { filter: brightness(0.8) saturate(0.9); }
    td[data-resultado="acerto"].zg-high { filter: brightness(1.0) saturate(1.1); }
    td[data-resultado="acerto"].zg-hot  { filter: brightness(1.15) saturate(1.3); box-shadow: inset 0 0 6px rgba(0,255,60,0.3); }
    td[data-resultado="erro"].zg-low    { filter: brightness(0.55) saturate(0.7); }
    td[data-resultado="erro"].zg-mid    { filter: brightness(0.8) saturate(0.9); }
    td[data-resultado="erro"].zg-high   { filter: brightness(1.0) saturate(1.1); }
    td[data-resultado="erro"].zg-hot    { filter: brightness(1.15) saturate(1.3); }

    /* Ocultar colunas direitas quando checkbox desativado */
    .stats-laterais-ocultas .col-combo,
    .stats-laterais-ocultas #th-gols-linha,
    .stats-laterais-ocultas #th-dados-linha,
    .stats-laterais-ocultas #th-foot-gols,
    .stats-laterais-ocultas #th-foot-dados,
    .stats-laterais-ocultas #linhaGolsColuna,
    .stats-laterais-ocultas #linhaDadosColuna,
    .stats-laterais-ocultas #trQuadrantes th:nth-last-child(1),
    .stats-laterais-ocultas #trQuadrantes th:nth-last-child(2) { display:none !important; }
  `;
  document.head.appendChild(style);

  document.documentElement.style.setProperty("--cor-green", Estado.corGreen);
  document.documentElement.style.setProperty("--cor-red",   Estado.corRed);

  const tc = document.createElement("div"); tc.id = "toast-container";
  document.body.appendChild(tc);
})();

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const c = document.getElementById("toast-container"); if (!c) return;
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  c.appendChild(t); setTimeout(() => t.remove(), 2200);
}

// ─── ALERTA DE MÁXIMO CONSECUTIVO ────────────────────────────────────────────
function calcularStreakMaximo() {
  const tbody = document.querySelector("#tabelaResultados tbody");
  if (!tbody) return;

  document.querySelectorAll(".streak-alerta").forEach(el => el.classList.remove("streak-alerta"));

  const alertaAtivo = localStorage.getItem("alertaStreakAtivo") === "1";
  if (!alertaAtivo) return;

  const rows = Array.from(tbody.querySelectorAll("tr"));
  const numCols = minutosFixos.length;
  const jogos = [];

  for (let r = rows.length - 1; r >= 0; r--) {
    const row = rows[r];
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const cel = row.cells[1 + colIdx];
      if (!cel) continue;
      const tipo = cel.getAttribute("data-resultado");
      if (tipo === "acerto" || tipo === "erro") { jogos.push({ tipo, cel }); }
    }
  }

  if (jogos.length < 2) return;

  let atualLen = 0;
  for (let i = jogos.length - 1; i >= 0; i--) {
    if (jogos[i].tipo === "erro") atualLen++;
    else break;
  }

  let maxLen = 0, bestStart = -1, bestEnd = -1;
  let curLen = 0, curStart = -1;

  for (let i = 0; i < jogos.length; i++) {
    if (jogos[i].tipo === "erro") {
      if (curLen === 0) curStart = i;
      curLen++;
      if (curLen >= maxLen) { maxLen = curLen; bestStart = curStart; bestEnd = i; }
    } else { curLen = 0; curStart = -1; }
  }

  if (maxLen < 3) { atualizarBadgeStreak(0, atualLen); return; }

  for (let i = bestStart; i <= bestEnd; i++) { jogos[i].cel.classList.add("streak-alerta"); }
  atualizarBadgeStreak(maxLen, atualLen);
}

function atualizarBadgeStreak(n, atual = 0) {
  const anterior = document.getElementById("badge-streak-max");
  if (anterior) anterior.remove();
  const alertaAtivo = localStorage.getItem("alertaStreakAtivo") === "1";
  if (!alertaAtivo || n < 3) return;
  const indicator = document.getElementById("selecao-indicator");
  if (!indicator) return;
  const badge = document.createElement("span");
  badge.id = "badge-streak-max"; badge.className = "sel-tag";
  badge.style.cssText = "background:#92400e;border-color:#f59e0b;color:#fef3c7;gap:5px;";
  const corAtual = atual === 0 ? '#4ade80' : (atual >= n ? '#f87171' : '#fbbf24');
  const atualTxt = ` <span style="color:rgba(255,255,255,0.35);margin:0 3px">|</span> Atual: <strong style="color:${corAtual}">${atual} jogo${atual !== 1 ? 's' : ''}</strong>`;
  badge.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>
    Máx: <strong style="color:#fbbf24">${n} jogos</strong>${atualTxt}
  `;
  indicator.style.display = "flex";
  indicator.appendChild(badge);
}

function atualizarCheckboxStreak() {
  const cb  = document.getElementById("cb-streak-alerta");
  const lbl = document.getElementById("lbl-streak-alerta");
  if (!cb || !lbl) return;
  const ativo = localStorage.getItem("alertaStreakAtivo") === "1";
  cb.checked = ativo;
  lbl.classList.toggle("alerta-ativo", ativo);
}

// ─── APLICA CORES NAS CÉLULAS ─────────────────────────────────────────────────
function aplicarCoresCelulas() {
  document.querySelectorAll("td[data-resultado]").forEach(cel => {
    const tipo = cel.getAttribute("data-resultado");
    if (tipo === "acerto") cel.style.setProperty("background-color", Estado.corGreen, "important");
    else if (tipo === "erro") cel.style.setProperty("background-color", Estado.corRed, "important");
  });
}

// ─── PAINEL DE CORES ──────────────────────────────────────────────────────────
function garantirPainelCores() {
  if (document.getElementById("painel-cores")) {
    garantirCheckboxQuadrantes();
    return;
  }
  const el = document.createElement("div"); el.id = "painel-cores";
  el.innerHTML = `
    <label>Cor Green<input type="color" id="input-cor-green" value="${Estado.corGreen}"></label>
    <label>Cor Red<input type="color" id="input-cor-red" value="${Estado.corRed}"></label>
    <button class="btn-aplicar-cores" id="btn-aplicar-cores">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
      Aplicar
    </button>
    <button class="btn-reset-cores" id="btn-reset-cores">${SVG_ICONS.reset} Resetar padrão</button>
    <label class="alerta-toggle-label" id="lbl-streak-alerta">
      <input type="checkbox" id="cb-streak-alerta">
      Máx. consecutiva
    </label>
    <label class="alerta-toggle-label" id="lbl-stats-laterais">
      <input type="checkbox" id="cb-stats-laterais" checked>
      Gols/Acertos/%
    </label>
    <label class="alerta-toggle-label" id="lbl-ranking-top5">
      <input type="checkbox" id="cb-ranking-top5">
      Ranking Top 5
    </label>
    <label class="alerta-toggle-label" id="lbl-zona-green-toggle">
      <input type="checkbox" id="cb-zona-green-toggle">
      Zona Green
    </label>
    <label class="alerta-toggle-label" id="lbl-melhores-odds">
      <input type="checkbox" id="cb-melhores-odds">
      Melhores Odds
    </label>
  `;
  el.querySelector("#input-cor-green").addEventListener("input", e => { Estado.corGreen = e.target.value; Estado.salvar(); });
  el.querySelector("#input-cor-red").addEventListener("input", e => { Estado.corRed = e.target.value; Estado.salvar(); });
  el.querySelector("#btn-aplicar-cores").addEventListener("click", () => { aplicarCoresCelulas(); showToast("Cores aplicadas!"); });
  el.querySelector("#cb-streak-alerta").addEventListener("change", function() {
    localStorage.setItem("alertaStreakAtivo", this.checked ? "1" : "0");
    atualizarCheckboxStreak(); calcularStreakMaximo();
    if (!this.checked) atualizarBadgeStreak(0, 0);
  });
  el.querySelector("#cb-stats-laterais").addEventListener("change", function() {
    localStorage.setItem("statsLateraisOcultas", this.checked ? "0" : "1");
    aplicarEstadoStatsLaterais();
  });
  // Restaura estado salvo do checkbox de stats
  const statsOcultas = localStorage.getItem("statsLateraisOcultas") === "1";
  el.querySelector("#cb-stats-laterais").checked = !statsOcultas;

  // Checkbox Ranking Top 5
  const rkCb = el.querySelector("#cb-ranking-top5");
  if (rkCb) {
    const rkOn = localStorage.getItem("rankingTop5Ativo") === "1";
    rkCb.checked = rkOn;
    if (rkOn) rkAplicarDestaque();
    rkCb.addEventListener("change", function() {
      localStorage.setItem("rankingTop5Ativo", this.checked ? "1" : "0");
      if (this.checked) rkAplicarDestaque(); else rkLimparDestaque();
    });
  }
  // Checkbox Zona Green
  const zgCb = el.querySelector("#cb-zona-green-toggle");
  const zgLbl = el.querySelector("#lbl-zona-green-toggle");
  if (zgCb) {
    const zgOn = localStorage.getItem("zonaGreenAtivo") === "1"; // padrão OFF
    zgCb.checked = zgOn;
    zgLbl?.classList.toggle("alerta-ativo", zgOn);
    zgCb.addEventListener("change", function() {
      localStorage.setItem("zonaGreenAtivo", this.checked ? "1" : "0");
      zgLbl?.classList.toggle("alerta-ativo", this.checked);
      if (this.checked) aplicarZonaGreen();
      else document.querySelectorAll(".zg-low,.zg-mid,.zg-high,.zg-hot").forEach(el => el.classList.remove("zg-low","zg-mid","zg-high","zg-hot"));
    });
  }

  // Checkbox Melhores Odds
  const moCb = el.querySelector("#cb-melhores-odds");
  const moLbl = el.querySelector("#lbl-melhores-odds");
  if (moCb) {
    const moOn = localStorage.getItem("melhoresOddsAtivo") === "1"; // padrão OFF
    moCb.checked = moOn;
    moLbl?.classList.toggle("alerta-ativo", moOn);
    atualizarMelhoresOdds(_ultimaFreqOdds);
    moCb.addEventListener("change", function() {
      localStorage.setItem("melhoresOddsAtivo", this.checked ? "1" : "0");
      moLbl?.classList.toggle("alerta-ativo", this.checked);
      atualizarMelhoresOdds(_ultimaFreqOdds);
    });
  }

  el.querySelector("#btn-reset-cores").addEventListener("click", () => {
    Estado.corGreen = COR_GREEN_PADRAO; Estado.corRed = COR_RED_PADRAO; Estado.salvar();
    el.querySelector("#input-cor-green").value = COR_GREEN_PADRAO;
    el.querySelector("#input-cor-red").value   = COR_RED_PADRAO;
    aplicarCoresCelulas(); showToast("Cores resetadas para o padrão");
  });
  const tabela = document.getElementById("tabelaResultados");
  if (tabela && tabela.parentNode) tabela.parentNode.insertBefore(el, tabela.nextSibling);
  else document.body.appendChild(el);

  // Adiciona o checkbox dos quadrantes ao painel de cores
  garantirCheckboxQuadrantes();
}

function sincronizarPainelCores() {
  const ig = document.getElementById("input-cor-green");
  const ir = document.getElementById("input-cor-red");
  if (ig) ig.value = Estado.corGreen;
  if (ir) ir.value = Estado.corRed;
  aplicarCoresCelulas();
  aplicarEstadoStatsLaterais();
  // Sincroniza Zona Green
  const zgCb  = document.getElementById("cb-zona-green-toggle");
  const zgLbl = document.getElementById("lbl-zona-green-toggle");
  if (zgCb) { const on = localStorage.getItem("zonaGreenAtivo") === "1"; zgCb.checked = on; zgLbl?.classList.toggle("alerta-ativo", on); }
}

// ─── PAINEL DE SELEÇÕES ───────────────────────────────────────────────────────
function criarOuObterPainel() {
  let painel = document.getElementById("painel-selecao");
  if (!painel) {
    painel = document.createElement("div"); painel.id = "painel-selecao";
    const indicator = document.createElement("div"); indicator.id = "selecao-indicator";
    const stats = document.createElement("div"); stats.id = "stats-selecao";
    painel.appendChild(indicator); painel.appendChild(stats);
    const tabela = document.getElementById("tabelaResultados");
    if (tabela) {
      const selCont = document.getElementById("selectedRowsContainer");
      const anchor = selCont || tabela;
      anchor.parentNode.insertBefore(painel, anchor);
    }
  }
  return painel;
}
function criarOuObterIndicador() { criarOuObterPainel(); return document.getElementById("selecao-indicator"); }
function criarOuObterStats()     { criarOuObterPainel(); return document.getElementById("stats-selecao"); }

function atualizarStatsSelecao(statsMap) {
  const el = criarOuObterStats(); if (!el) return;
  el.innerHTML = "";
  const temItems = statsMap && [...statsMap.values()].some(v => (v.green+v.red)>0);
  el.style.display = temItems ? "flex" : "none";
  if (!temItems) return;
  statsMap.forEach(({green,red,cor,label,tipo}, valor) => {
    const total = green+red; if (total===0) return;
    const row = document.createElement("div"); row.className = "stat-row";
    const dot = document.createElement("span"); dot.className="stat-color-dot"; dot.style.background=cor;
    const valorDisplay = valor.replace(/^[★✦⊕]ht[★✦⊕]/, "");
    const lbl = document.createElement("span"); lbl.className="stat-label"; lbl.title=valorDisplay; lbl.textContent=`${label}: ${valorDisplay}`;
    const sep0 = document.createElement("span"); sep0.className="stat-sep"; sep0.textContent="·";
    if (tipo==="ft"||tipo==="ht") {
      const tot=document.createElement("span"); tot.className="stat-total"; tot.textContent=`${total}×`;
      const inf=document.createElement("span"); inf.style.cssText="color:#aaa;font-size:0.85em"; inf.textContent="ocorrências";
      row.append(dot,lbl,sep0,tot,inf);
    } else {
      const pct=Math.round((green/total)*100);
      const tot=document.createElement("span"); tot.className="stat-total"; tot.textContent=`${total}×`;
      const s1=document.createElement("span"); s1.className="stat-sep"; s1.textContent="/";
      const g=document.createElement("span"); g.className="stat-count-green"; g.textContent=`${green}✔`;
      const s2=document.createElement("span"); s2.className="stat-sep"; s2.textContent="/";
      const r=document.createElement("span"); r.className="stat-count-red"; r.textContent=`${red}✘`;
      const p=document.createElement("span");
      const _t=getThreshold(document.querySelector("#seletorResultado")?.value||"");
      p.className=`stat-pct ${pct>=_t?"stat-pct-verde":"stat-pct-branca"}`; p.textContent=`${pct}%`;
      row.append(dot,lbl,sep0,tot,s1,g,s2,r,p);
    }
    el.appendChild(row);
  });
}

function atualizarIndicadorSelecao() {
  const indicator = criarOuObterIndicador(); if (!indicator) return;
  indicator.innerHTML = "";
  const grupos = [
    { lista: Estado.placarFTSelecionados, tipo: "ft",   label: "FT",   paleta: CORES_PLACAR_FT },
    { lista: Estado.placarHTSelecionados, tipo: "ht",   label: "HT",   paleta: CORES_PLACAR_HT },
    { lista: Estado.timesSelecionados,    tipo: "time", label: "Time", paleta: CORES_TIME },
    { lista: Estado.oddsSelecionadas,     tipo: "odd",  label: "Odd",  paleta: CORES_ODD },
  ];
  grupos.forEach(({ lista, tipo, label, paleta }) => {
    lista.forEach((val, i) => {
      const cor = paleta[i % paleta.length];
      const tag = document.createElement("span"); tag.className = "sel-tag";
      tag.style.cssText = `background:${cor};border-color:${cor};color:#000;`;
      const displayVal = val.replace(/^[★✦⊕]ht[★✦⊕]/, "");
      tag.innerHTML = `<span>${label}: ${displayVal}</span><span class="sel-remove" title="Remover">✕</span>`;
      tag.querySelector(".sel-remove").addEventListener("click", () => {
        Estado.toggleSelecao(
          tipo==="ft"?"placarFTSelecionados":tipo==="ht"?"placarHTSelecionados":tipo==="time"?"timesSelecionados":"oddsSelecionadas",
          val
        );
        aplicarHighlights();
      });
      indicator.appendChild(tag);
    });
  });
}

function computeStatsFromDOM() {
  const mostrarOdds = document.querySelector("#mostrarOdds")?.value==="sim";
  const statsFT   = new Map(Estado.placarFTSelecionados.map(v=>[v,{green:0,red:0,cor:Estado.getCorSelecao(Estado.placarFTSelecionados,v,"ft")?.bg||"#fff",label:"FT",tipo:"ft"}]));
  const statsHT   = new Map(Estado.placarHTSelecionados.map(v=>[v,{green:0,red:0,cor:Estado.getCorSelecao(Estado.placarHTSelecionados,v,"ht")?.bg||"#fff",label:"HT",tipo:"ht"}]));
  const statsTime = new Map(Estado.timesSelecionados.map(v=>[v,{green:0,red:0,cor:Estado.getCorSelecao(Estado.timesSelecionados,v,"time")?.bg||"#fff",label:"Time",tipo:"time"}]));
  const statsOdd  = new Map(Estado.oddsSelecionadas.map(v=>[v,{green:0,red:0,cor:Estado.getCorSelecao(Estado.oddsSelecionadas,v,"odd")?.bg||"#fff",label:"Odd",tipo:"odd"}]));
  document.querySelectorAll(".placar").forEach(placarEl=>{
    if (placarEl.classList.contains("placar-futuro")) return;
    const cel=placarEl.closest("td"); if(!cel) return;
    const tipo=cel.getAttribute("data-resultado"); if(tipo!=="acerto"&&tipo!=="erro") return;
    const acerto=tipo==="acerto";
    const ft=placarEl.getAttribute("data-score-ft")||"";
    const ht=placarEl.getAttribute("data-score-ht")||"";
    const oddEl=placarEl.querySelector(".odds");
    const oddTxt=oddEl?oddEl.textContent.trim().replace(/^@/,""):"";
    const timeSpans=Array.from(placarEl.querySelectorAll(".time-casa,.time-fora")).map(s=>s.getAttribute("data-full-time")).filter(Boolean);
    for(const v of Estado.placarFTSelecionados) if(ft===v){const s=statsFT.get(v);if(s){acerto?s.green++:s.red++;}break;}
    for(const v of Estado.placarHTSelecionados) if(ht===v){const s=statsHT.get(v);if(s){acerto?s.green++:s.red++;}break;}
    for(const v of Estado.timesSelecionados)    if(timeSpans.includes(v)){const s=statsTime.get(v);if(s){acerto?s.green++:s.red++;}break;}
    if(mostrarOdds&&oddTxt) for(const v of Estado.oddsSelecionadas) if(oddTxt===v){const s=statsOdd.get(v);if(s){acerto?s.green++:s.red++;}break;}
  });
  const unif=new Map();
  statsFT.forEach((v,k)=>unif.set(k,v));
  statsHT.forEach((v,k)=>unif.set(`★ht★${k}`,v));
  statsTime.forEach((v,k)=>unif.set(k,v));
  statsOdd.forEach((v,k)=>unif.set(k,v));
  criarOuObterPainel(); atualizarStatsSelecao(unif);
}

// ─── HIGHLIGHTS ───────────────────────────────────────────────────────────────
function aplicarHighlights() {
  const mostrarOdds = document.querySelector("#mostrarOdds")?.value==="sim";
  document.querySelectorAll(".placar").forEach(placar => {
    const ft = placar.getAttribute("data-score-ft")||"";
    const ht = placar.getAttribute("data-score-ht")||"";
    placar.querySelectorAll(".placar-score-ft-sel").forEach(e=>{e.classList.remove("placar-score-ft-sel");e.style.removeProperty("--sel-color-ft");});
    placar.querySelectorAll(".placar-score-ht-sel").forEach(e=>{e.classList.remove("placar-score-ht-sel");e.style.removeProperty("--sel-color-ht");});
    placar.querySelectorAll(".time-nome-selecionado").forEach(e=>{e.classList.remove("time-nome-selecionado");e.style.removeProperty("--sel-color");});
    const oddEl=placar.querySelector(".odds,.placar-futuro-odd");
    if(oddEl){oddEl.classList.remove("odd-selecionada");oddEl.style.removeProperty("--sel-color");}
    for(const val of Estado.placarFTSelecionados) {
      if(ft===val) {
        const cor=Estado.getCorSelecao(Estado.placarFTSelecionados,val,"ft");
        const ftSpan=placar.querySelector(".ft-span");
        if(ftSpan){ftSpan.style.setProperty("--sel-color-ft",cor.bg);ftSpan.classList.add("placar-score-ft-sel");}
        break;
      }
    }
    for(const val of Estado.placarHTSelecionados) {
      if(ht===val) {
        const cor=Estado.getCorSelecao(Estado.placarHTSelecionados,val,"ht");
        const htSpan=placar.querySelector(".ht-span");
        if(htSpan){htSpan.style.setProperty("--sel-color-ht",cor.bg);htSpan.classList.add("placar-score-ht-sel");}
        break;
      }
    }
    if(Estado.timesSelecionados.length>0){
      [".time-casa",".time-fora"].forEach(sel=>{
        const span=placar.querySelector(sel); if(!span) return;
        const ft2=span.getAttribute("data-full-time");
        for(const val of Estado.timesSelecionados){
          if(ft2===val){const cor=Estado.getCorSelecao(Estado.timesSelecionados,val,"time");span.style.setProperty("--sel-color",cor.bg);span.classList.add("time-nome-selecionado");break;}
        }
      });
    }
    if(oddEl){
      const rawTxt  = oddEl.textContent.trim();
      const oddTxt  = rawTxt.startsWith("@") ? rawTxt.slice(1) : rawTxt;
      for(const val of Estado.oddsSelecionadas){
        if(oddTxt===val){
          const cor=Estado.getCorSelecao(Estado.oddsSelecionadas,val,"odd");
          oddEl.style.setProperty("--sel-color",cor.bg);
          oddEl.classList.add("odd-selecionada");
          break;
        }
      }
    }
  });
  atualizarIndicadorSelecao();
  computeStatsFromDOM();
}

// ─── SELEÇÃO DE COLUNAS ───────────────────────────────────────────────────────
function toggleColuna(minuto) {
  const lista=Estado.colunasSelecionadas, idx=lista.indexOf(minuto);
  if(idx!==-1) lista.splice(idx,1); else lista.push(minuto);
  Estado.salvar(); aplicarColunaHighlights(); atualizarColunaStats();
}
function aplicarColunaHighlights() {
  const tabela=document.getElementById("tabelaResultados");
  const temSel=Estado.colunasSelecionadas.length>0;
  if(tabela) tabela.classList.toggle("tem-coluna-selecionada",temSel);
  document.querySelectorAll(".minute-header").forEach(th=>{
    const min=parseInt(th.textContent.trim());
    th.classList.toggle("coluna-selecionada",Estado.colunasSelecionadas.includes(min));
  });
  document.querySelectorAll("#tabelaResultados tbody tr").forEach(row=>{
    Array.from(row.cells).forEach((cell,i)=>{
      if(i<1||i>=1+minutosFixos.length) return;
      const colIdx=i-1;
      cell.classList.toggle("coluna-selecionada",Estado.colunasSelecionadas.includes(minutosFixos[colIdx]));
      if (qdCheckboxAtivo()) cell.classList.toggle("quadrant-border",colIdx>0&&colIdx%5===0);
    });
  });
  if (qdCheckboxAtivo()) {
    document.querySelectorAll(".minute-header").forEach((th,i)=>{th.classList.toggle("quadrant-border",i>0&&i%5===0);});
  }
}
function atualizarColunaStats() {
  let el=document.getElementById("coluna-stats");
  if(!el){
    el=document.createElement("div"); el.id="coluna-stats";
    const painel=document.getElementById("painel-selecao");
    if(painel) painel.insertAdjacentElement("afterend",el);
    else{const t=document.getElementById("tabelaResultados");if(t)t.parentNode.insertBefore(el,t);}
  }
  el.innerHTML=""; if(Estado.colunasSelecionadas.length===0) return;

  // Lógica por SEQUÊNCIA: só conta linhas onde TODAS as colunas selecionadas têm resultado real
  const colOrd=[...Estado.colunasSelecionadas].sort((a,b)=>minutosFixos.indexOf(a)-minutosFixos.indexOf(b));
  let gT=0, rT=0;
  document.querySelectorAll("#tabelaResultados tbody tr").forEach(row=>{
    let temGreen=false, temRed=false, todasComResultado=true;
    colOrd.forEach(min=>{
      const colIdx=minutosFixos.indexOf(min); if(colIdx===-1) return;
      const cell=row.cells[1+colIdx]; if(!cell) { todasComResultado=false; return; }
      // Só conta células com placar real (não futuro)
      const placarReal=cell.querySelector(".placar:not(.placar-futuro)");
      if(!placarReal) { todasComResultado=false; return; }
      const tipo=cell.getAttribute("data-resultado");
      if(tipo==="acerto") temGreen=true;
      else if(tipo==="erro") temRed=true;
    });
    // Ignora linhas onde alguma coluna selecionada ainda não tem resultado
    if(!todasComResultado) return;
    if(temGreen) gT++;
    else if(temRed) rT++;
  });

  const total=gT+rT; if(total===0) return;
  const pct=Math.round((gT/total)*100);
  const thresh=getThreshold(document.querySelector("#seletorResultado")?.value||"");
  const tag=document.createElement("div"); tag.className="col-stat-tag";
  tag.innerHTML=`<span class="col-min">min ${colOrd.join(", ")}</span><span style="color:#aaa;font-size:0.85em">${total}×</span><span class="col-g">${gT}✔</span><span class="col-r">${rT}✘</span><span class="col-pct ${pct>=thresh?"col-stat-verde":"col-stat-branca"}">${pct}%</span><span class="col-remove" title="Limpar">✕</span>`;
  tag.querySelector(".col-remove").addEventListener("click",()=>{Estado.colunasSelecionadas.length=0;Estado.salvar();aplicarColunaHighlights();atualizarColunaStats();});
  el.appendChild(tag);
}

// ─── UTILITÁRIOS ──────────────────────────────────────────────────────────────
function showErrorMessage(m){const e=document.getElementById("errorMessage");if(!e)return;e.textContent=m;e.style.display="block";}
function hideErrorMessage(){const e=document.getElementById("errorMessage");if(!e)return;e.textContent="";e.style.display="none";}
function normalizeString(s){if(!s)return"";return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function formatDateToDDMMYYYY(d){if(d.includes("T")){const dt=new Date(d);return`${dt.getUTCDate().toString().padStart(2,"0")}/${(dt.getUTCMonth()+1).toString().padStart(2,"0")}/${dt.getUTCFullYear()}`;}const[dd,mm,yy]=d.split("/");return`${dd.padStart(2,"0")}/${mm.padStart(2,"0")}/${yy}`;}
function getDateStr(d){if(d.includes("T"))return new Date(d).toISOString().split("T")[0];const[dd,mm,yy]=d.split("/");return`${yy}-${mm}-${dd}`;}
function normalizarHorario(h,m){const c=minutosFixos.reduce((p,x)=>Math.abs(x-m)<Math.abs(p-m)?x:p);return`${h.toString().padStart(2,"0")}:${c.toString().padStart(2,"0")}`;}
function normalizarHorarioStr(h){if(!h)return h;const[hr,mn]=h.split(":").map(Number);return normalizarHorario(hr,mn);}
function abbreviateTeamName(n){if(!n)return"";const w=n.trim().split(" ");if(w.length>1)return w.map(x=>x.charAt(0).toUpperCase()).join("")+w[w.length-1].slice(0,3).toLowerCase();return n.length>5?n.slice(0,5).toUpperCase():n.toUpperCase();}
function calculateGoalStats(linhas){const tot=linhas.reduce((a,r)=>a+parseInt(r.children[r.children.length-2].textContent||0),0);return{totalGols:tot,mediaGolsHora:linhas.length>0?(tot/linhas.length).toFixed(2):0};}

// ─── INDEX DE ODDS ────────────────────────────────────────────────────────────
function indexarOdds(oddsData) {
  const tm = {"peixe": "boca"};
  const map = new Map();
  oddsData.forEach(odd => {
    const casa = normalizeString(tm[odd.time_casa?.toLowerCase()] || odd.time_casa);
    const vis  = normalizeString(tm[odd.time_visitante?.toLowerCase()] || odd.time_visitante);
    const [hStr, mnStr] = (odd.horario || "").split(":");
    const h  = parseInt(hStr) || 0;
    const mn = parseInt(mnStr) || 0;
    const minNorm = minutosFixos.reduce((p, c) => Math.abs(c - mn) < Math.abs(p - mn) ? c : p);
    const hor = `${h.toString().padStart(2,"0")}:${minNorm.toString().padStart(2,"0")}`;
    const set = k => { if (!map.has(k)) map.set(k, odd); };
    set(`${odd.data_captura}|${hor}|${casa}|${vis}`);
    set(`${hor}|${casa}|${vis}`);
    set(`${hor}|${casa}`);
    set(`${hor}|${vis}`);
  });
  return map;
}
function findOddsNoIndex(idx,{data,hora,minuto,time_a,time_b}){
  const tm={"peixe":"boca"};
  const tA=normalizeString(tm[time_a?.toLowerCase()]||time_a), tB=normalizeString(tm[time_b?.toLowerCase()]||time_b);
  const dt=formatDateToDDMMYYYY(data), hor=normalizarHorario(hora,minuto);
  return idx.get(`${dt}|${hor}|${tA}|${tB}`)||idx.get(`${hor}|${tA}|${tB}`)||idx.get(`${hor}|${tA}`)||idx.get(`${hor}|${tB}`)||null;
}
function findOddsProximoNoIndex(idx, {time, team_home, team_visit}) {
  const tm = {"peixe": "boca"};
  const tA = normalizeString(tm[team_home?.toLowerCase()] || team_home);
  const tB = normalizeString(tm[team_visit?.toLowerCase()] || team_visit);
  const parts = (time || "").split(":");
  const h  = parseInt(parts[0]) || 0;
  const mn = parseInt(parts[1]) || 0;
  const minNorm = minutosFixos.reduce((p, c) => Math.abs(c - mn) < Math.abs(p - mn) ? c : p);
  for (const delta of [0, -1, 1]) {
    const hAjust = ((h + delta) + 24) % 24;
    const hor = `${hAjust.toString().padStart(2,"0")}:${minNorm.toString().padStart(2,"0")}`;
    const found = idx.get(`${hor}|${tA}|${tB}`) || idx.get(`${hor}|${tA}`) || idx.get(`${hor}|${tB}`);
    if (found) return found;
  }
  return null;
}

// ─── MAP DE ODDS POR MERCADO ──────────────────────────────────────────────────
function getOddValue(odds, res) {
  const m = {
    ambasMarcam:    "odds_ambas_marcam_sim",
    ambasNaoMarcam: "odds_ambas_marcam_nao",
    casaVence:      "odds_casa_vence",
    foraVence:      "odds_visitante_vence",
    empate:         "odds_empate",
    viradinha:      null,
    "over0.5":      "odds_mais_0_5",
    "over1.5":      "odds_mais_1_5",
    "over2.5":      "odds_mais_2_5",
    "over3.5":      "odds_mais_3_5",
    over5:          "odds_mais_5_gols",
    "under0.5":     "odds_menos_0_5",
    "under1.5":     "odds_menos_1_5",
    "under2.5":     "odds_menos_2_5",
    "under3.5":     "odds_menos_3_5",
    exato0:         "odds_exato_0_gols",
    exato1:         "odds_exato_1_gol",
    exato2:         "odds_exato_2_gols",
    exato3:         "odds_exato_3_gols",
    exato4:         "odds_exato_4_gols",
    exato2t0:       "odds_2t_0_gols",
    exato2t1:       "odds_2t_1_gol",
    exato2t2:       "odds_2t_2_gols",
    exato2t3:       "odds_2t_3_gols",
    exato2t4:       "odds_2t_4_gols",
    casa0Gols:      "odds_casa_0_gols",
    casa1Gol:       "odds_casa_1_gol",
    casa2Gols:      "odds_casa_2_gols",
    casa3Gols:      "odds_casa_3_gols",
    casa4Gols:      "odds_casa_4_gols",
    fora0Gols:      "odds_fora_0_gols",
    fora1Gol:       "odds_fora_1_gol",
    fora2Gols:      "odds_fora_2_gols",
    fora3Gols:      "odds_fora_3_gols",
    fora4Gols:      "odds_fora_4_gols",
  };
  if (!m[res]) return "N/A";
  return odds ? odds[m[res]] || "N/A" : "N/A";
}

// ─── FETCH ────────────────────────────────────────────────────────────────────
async function fetchOdds() {
  try {
    const r = await fetch(ROTAS_API.odds(LIGA_ATUAL));
    if (!r.ok) throw new Error();
    return await r.json();
  } catch(e) {
    console.error("Erro odds:", e);
    return [];
  }
}

async function fetchProximosJogos() {
  try {
    const r = await fetch(ROTAS_API.proximosJogos(LIGA_ATUAL));
    if (!r.ok) throw new Error();
    const j = await r.json();
    return j.sort((a,b) => new Date(a.start_time) - new Date(b.start_time)).slice(0, 10);
  } catch(e) {
    console.error("Erro próximos:", e);
    return [];
  }
}

// ─── SELECTED ROWS ────────────────────────────────────────────────────────────
function updateSelectedRows(){
  let sel=document.getElementById("selectedRowsContainer");
  const mainTable=document.getElementById("tabelaResultados");
  if(!sel&&mainTable){
    sel=document.createElement("table"); sel.id="selectedRowsContainer"; sel.className=mainTable.className; sel.style.cssText="width:100%;margin-bottom:10px";
    const thead=mainTable.querySelector("thead").cloneNode(true);
    // Remove linha de quadrantes do clone se existir
    thead.querySelector("#trQuadrantes")?.remove();
    sel.appendChild(thead); sel.appendChild(document.createElement("tbody"));
    mainTable.parentNode.insertBefore(sel,mainTable);
  }
  if(!sel) return;
  if(Estado.selectedChaves.length===0){sel.style.display="none";return;}
  sel.style.display="";
  const tbody=sel.querySelector("tbody"); tbody.innerHTML="";
  const ord=[...Estado.selectedChaves].sort((a,b)=>{
    const pA=a.split("-"),pB=b.split("-");
    const hA=parseInt(pA[pA.length-1]),hB=parseInt(pB[pB.length-1]);
    const dA=pA.slice(0,-1).join("-"),dB=pB.slice(0,-1).join("-");
    return new Date(`${dB}T${hB.toString().padStart(2,"00")}:00:00`)-new Date(`${dA}T${hA.toString().padStart(2,"00")}:00:00`);
  });
  ord.forEach(chave=>{
    const row=document.querySelector(`#tabelaResultados tbody tr[data-chave="${chave}"]`); if(!row) return;
    const clone=row.cloneNode(true);
    tbody.appendChild(clone);
  });
}

// ─── HELPER: cria th com SVG ──────────────────────────────────────────────────
function createIconTh(svgKey, title) {
  const th = document.createElement("th"); th.title = title||"";
  const wrap = document.createElement("span"); wrap.className = "th-icon";
  wrap.innerHTML = SVG_ICONS[svgKey]||""; th.appendChild(wrap); return th;
}

// ─── LÓGICA DE ACERTO POR MERCADO ────────────────────────────────────────────
function verificarAcerto(selRes, rA, rB, htA, htB) {
  const tg  = rA + rB;
  const tg2 = (typeof htA === "number" && typeof htB === "number") ? (rA - htA) + (rB - htB) : null;
  switch (selRes) {
    case "ambasMarcam":    return rA > 0 && rB > 0;
    case "ambasNaoMarcam": return rA === 0 || rB === 0;
    case "casaVence": return rA > rB;
    case "foraVence": return rB > rA;
    case "empate":    return rA === rB;
    case "viradinha": {
      // Requer dados de HT
      if (typeof htA !== "number" || typeof htB !== "number") return false;
      // Quem venceu no HT perde no FT
      const casaVenceuHT = htA > htB;
      const foraVenceuHT = htB > htA;
      const casaPerdeuFT = rA < rB;
      const foraPerdeuFT = rB < rA;
      return (casaVenceuHT && casaPerdeuFT) || (foraVenceuHT && foraPerdeuFT);
    }
    case "over0.5": return tg > 0.5;
    case "over1.5": return tg > 1.5;
    case "over2.5": return tg > 2.5;
    case "over3.5": return tg > 3.5;
    case "over5":   return tg >= 5;
    case "under0.5": return tg <= 0.5;
    case "under1.5": return tg <= 1.5;
    case "under2.5": return tg <= 2.5;
    case "under3.5": return tg <= 3.5;
    case "exato0": return tg === 0;
    case "exato1": return tg === 1;
    case "exato2": return tg === 2;
    case "exato3": return tg === 3;
    case "exato4": return tg === 4;
    case "exato2t0": return tg2 !== null && tg2 === 0;
    case "exato2t1": return tg2 !== null && tg2 === 1;
    case "exato2t2": return tg2 !== null && tg2 === 2;
    case "exato2t3": return tg2 !== null && tg2 === 3;
    case "exato2t4": return tg2 !== null && tg2 === 4;
    case "casa0Gols": return rA === 0;
    case "casa1Gol":  return rA === 1;
    case "casa2Gols": return rA === 2;
    case "casa3Gols": return rA === 3;
    case "casa4Gols": return rA === 4;
    case "fora0Gols": return rB === 0;
    case "fora1Gol":  return rB === 1;
    case "fora2Gols": return rB === 2;
    case "fora3Gols": return rB === 3;
    case "fora4Gols": return rB === 4;
    default: return false;
  }
}

// ─── CRIAÇÃO DA TABELA ────────────────────────────────────────────────────────
function criarTabela(dados, oddsData, proximosJogos) {
  criarOuObterPainel();

  // Garante wrapper dos quadrantes antes da tabela principal
  garantirQuadrantesWrapper();

  const tabela = document.getElementById("tabelaResultados");
  const tabelaBody = tabela.querySelector("tbody");
  let thead = tabela.querySelector("thead");
  if (!thead) { thead = document.createElement("thead"); tabela.insertBefore(thead, tabelaBody); }

  // ── Limpa o thead e insere trQD IMEDIATAMENTE como 1ª linha ──
  thead.innerHTML = "";
  if (qdCheckboxAtivo()) {
    qdRenderTabela(dados);
  }

  const trGolsColuna = document.createElement("tr"); trGolsColuna.id="linhaGolsColuna";
  trGolsColuna.appendChild(createIconTh("ball","Gols por coluna (total / média)"));

  const trDadosColuna = document.createElement("tr"); trDadosColuna.id="linhaDadosColuna";
  trDadosColuna.appendChild(createIconTh("chart","Dados por coluna (% acerto / quantidade)"));

  thead.append(trGolsColuna, trDadosColuna);

  const trMinutos = document.createElement("tr");
  // Coluna única de hora (sem th separado de seleção)
  const thHora = document.createElement("th"); thHora.title="Hora";
  const wrapH = document.createElement("span"); wrapH.className="th-icon"; wrapH.innerHTML=SVG_ICONS["clock"]||"";
  thHora.appendChild(wrapH); thHora.style.cssText="width:36px;min-width:36px;";
  trMinutos.appendChild(thHora);

  minutosFixos.forEach((m, i) => {
    const th = document.createElement("th"); th.className="minute-header"; th.textContent=m;
    const qIdx = Math.floor(i/5)%4;
    th.classList.add(`qd-${qIdx}`);
    if (qdCheckboxAtivo() && i>0 && i%5===0) th.classList.add("quadrant-border");
    if (Estado.colunasSelecionadas.includes(m)) th.classList.add("coluna-selecionada");
    th.addEventListener("click", ()=>toggleColuna(m));
    trMinutos.appendChild(th);
  });
  // Colunas direitas: gols, acertos, % — com IDs para ocultar/mostrar
  const thGolsLinha = createIconTh("ball","Gols (total / média)"); thGolsLinha.id="th-gols-linha"; thGolsLinha.classList.add("col-combo","col-combo-th");
  const thDadosLinha = createIconTh("chart","Dados (% acerto / quantidade)"); thDadosLinha.id="th-dados-linha"; thDadosLinha.classList.add("col-combo","col-combo-th");
  [thGolsLinha,thDadosLinha].forEach(th=>trMinutos.appendChild(th));
  thead.appendChild(trMinutos);
  tabelaBody.innerHTML = "";

  const seletorHoras      = document.querySelector("#seletorHoras");
  const seletorResultado  = document.querySelector("#seletorResultado");
  const seletorTipoPlacar = document.querySelector("#seletorTipoPlacar");
  const mostrarTimesEl    = document.querySelector("#mostrarTimes");
  const mostrarHTEl       = document.querySelector("#mostrarHT");
  const mostrarOddsEl     = document.querySelector("#mostrarOdds");
  if (!seletorHoras||!seletorResultado||!seletorTipoPlacar||!mostrarTimesEl||!mostrarHTEl||!mostrarOddsEl) {
    showErrorMessage("Erro interno: Seletores não encontrados."); return;
  }
  const mostrarTimes = mostrarTimesEl.value==="sim";
  const mostrarOdds  = mostrarOddsEl.value==="sim";
  const mostrarHT    = mostrarHTEl.value==="sim";
  const horasSel     = parseInt(seletorHoras.value)||12;
  const selRes       = seletorResultado.value;
  const tipoPlacar   = seletorTipoPlacar.value;
  const oddsIndex    = indexarOdds(oddsData);

  dados.sort((a,b)=>{
    const tA=new Date(`${getDateStr(a.data)}T${a.hora.toString().padStart(2,"0")}:${a.minuto.toString().padStart(2,"0")}:00`).getTime();
    const tB=new Date(`${getDateStr(b.data)}T${b.hora.toString().padStart(2,"0")}:${b.minuto.toString().padStart(2,"0")}:00`).getTime();
    return tB-tA;
  });

  const proximosComHoras = proximosJogos.map(j=>{
    const[h,mn]=j.time.split(":").map(Number);
    const closest=minutosFixos.reduce((p,c)=>Math.abs(c-mn)<Math.abs(p-mn)?c:p);
    return{...j,date:new Date(j.start_time),hora:h,minuto:closest,team_visitante:j.team_visit};
  }).sort((a,b)=>new Date(b.start_time)-new Date(a.start_time));

  // Horas dos próximos jogos (futuras) — entram sempre, fora do limite do seletor
  const horasFuturasSet=new Set();
  proximosComHoras.forEach(j=>{
    const ds=j.captured_date?j.captured_date.split("/").reverse().join("-"):j.date.toISOString().split("T")[0];
    horasFuturasSet.add(JSON.stringify({hora:j.hora,timestamp:new Date(`${ds}T${j.hora.toString().padStart(2,"0")}:00:00`).getTime(),data:ds}));
  });
  // Horas com dados reais — respeitam o limite do seletor
  const horasDadosSet=new Set();
  dados.forEach(d=>{
    const ds=getDateStr(d.data);
    horasDadosSet.add(JSON.stringify({hora:d.hora,timestamp:new Date(`${ds}T${d.hora.toString().padStart(2,"0")}:00:00`).getTime(),data:ds}));
  });
  const horasDadosLimitadas=Array.from(horasDadosSet).map(s=>JSON.parse(s)).sort((a,b)=>b.timestamp-a.timestamp).slice(0,horasSel);
  // Merge: futuras que não conflitem com dados já presentes + dados limitados
  const chavesDados=new Set(horasDadosLimitadas.map(h=>`${h.data}-${h.hora}`));
  const horasFuturasFiltradas=Array.from(horasFuturasSet).map(s=>JSON.parse(s)).filter(h=>!chavesDados.has(`${h.data}-${h.hora}`));
  const horasUnicas=[...horasFuturasFiltradas,...horasDadosLimitadas].sort((a,b)=>b.timestamp-a.timestamp);
  const mapeamentoChaveLinha={};

  horasUnicas.forEach(item=>{
    const chave=`${item.data}-${item.hora}`;
    const tr=document.createElement("tr"); tr.setAttribute("data-chave",chave);
    // Checkbox embutido na célula de hora
    const tdHora=document.createElement("td"); tdHora.style.cssText="text-align:center;white-space:nowrap;padding:2px 4px;";
    const cb=document.createElement("input"); cb.type="checkbox"; cb.className="row-selector"; cb.checked=Estado.selectedChaves.includes(chave);
    cb.style.cssText="display:block;margin:0 auto 1px auto;width:12px;height:12px;cursor:pointer;accent-color:#4ade80;";
    cb.addEventListener("change",function(){
      if(this.checked){if(!Estado.selectedChaves.includes(chave))Estado.selectedChaves.push(chave);}
      else{Estado.selectedChaves=Estado.selectedChaves.filter(c=>c!==chave);}
      Estado.salvar();updateSelectedRows();
    });
    const horaSpan=document.createElement("span"); horaSpan.textContent=item.hora.toString().padStart(2,"0"); horaSpan.style.cssText="font-size:0.85em;font-weight:700;color:#e5e7eb;";
    tdHora.appendChild(cb); tdHora.appendChild(horaSpan);
    tr.appendChild(tdHora);
    minutosFixos.forEach((m,i)=>{
      const td=document.createElement("td");
      const qIdx=Math.floor(i/5)%4;
      td.classList.add(`qd-cell-${qIdx}`);
      if(qdCheckboxAtivo() && i>0 && i%5===0) td.classList.add("quadrant-border");
      if(Estado.colunasSelecionadas.includes(m)) td.classList.add("coluna-selecionada");
      tr.appendChild(td);
    });
    // Acumuladores brutos (número simples); o texto combinado é montado no fechamento da tabela
    const tdGols = Object.assign(document.createElement("td"),{textContent:"0",className:"col-combo"});
    const tdDados = Object.assign(document.createElement("td"),{textContent:"0",className:"col-combo"});
    tr.appendChild(tdGols); tr.appendChild(tdDados);
    tabelaBody.appendChild(tr);
    mapeamentoChaveLinha[chave]=tr;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleFTClick(e) {
    if(e.target.classList.contains("time-casa")||e.target.classList.contains("time-fora")) return;
    if(e.target.classList.contains("ht-span")||e.target.closest(".ht-span")) return;
    const placarEl=e.currentTarget; if(placarEl.classList.contains("placar-futuro")) return;
    const val=placarEl.getAttribute("data-score-ft"); if(!val) return;
    Estado.toggleSelecao("placarFTSelecionados",val); aplicarHighlights();
  }
  function handleHTClick(e) {
    e.stopPropagation();
    const htSpan=e.currentTarget;
    const placarEl=htSpan.closest(".placar"); if(!placarEl||placarEl.classList.contains("placar-futuro")) return;
    const val=placarEl.getAttribute("data-score-ht"); if(!val) return;
    Estado.toggleSelecao("placarHTSelecionados",val); aplicarHighlights();
  }
  function handleTimeClick(e) {
    if(!mostrarTimes) return; const val=e.target.getAttribute("data-full-time"); if(!val) return;
    Estado.toggleSelecao("timesSelecionados",val); aplicarHighlights();
  }
  function handleOddClick(e) {
    e.stopPropagation();
    const txt = e.currentTarget.textContent.trim().replace(/^@/, "");
    if (!txt || txt === "N/A") return;
    Estado.toggleSelecao("oddsSelecionadas", txt); aplicarHighlights();
  }
  function handleTimeClickFuturo(e) {
    e.stopPropagation();
    const val = e.currentTarget.getAttribute("data-full-time"); if(!val) return;
    Estado.toggleSelecao("timesSelecionados", val); aplicarHighlights();
  }
  function handleOddClickFuturo(e) {
    e.stopPropagation();
    const txt = e.currentTarget.textContent.trim().replace(/^@/, "");
    if (!txt || txt === "N/A") return;
    Estado.toggleSelecao("oddsSelecionadas", txt); aplicarHighlights();
  }

  // ── Processa dados ─────────────────────────────────────────────────────────
  const totalGolsPorColuna    = Array(minutosFixos.length).fill(0);
  const totalAcertosPorColuna = Array(minutosFixos.length).fill(0);
  const processedMatches      = new Set();
  const freqOddsMercado       = new Map(); // contagem de odds do mercado selecionado (para "Melhores Odds")

  dados.forEach(dado => {
    const ds=getDateStr(dado.data), chave=`${ds}-${dado.hora}`, linha=mapeamentoChaveLinha[chave];
    const minNorm=minutosFixos.reduce((p,c)=>Math.abs(c-dado.minuto)<Math.abs(p-dado.minuto)?c:p);
    const mk=`${dado.time_a}|${dado.time_b}|${chave}|${minNorm}`;
    if(!linha||processedMatches.has(mk)) return;
    const idx=minutosFixos.indexOf(minNorm); if(idx===-1) return;
    const cel=linha.children[1+idx]; if(cel.querySelector(".placar")) return;

    const placarFT=dado.ft, placarHT=dado.ht;
    const primary=tipoPlacar==="ft"?placarFT:placarHT;
    const secondary=tipoPlacar==="ft"?placarHT:placarFT;

    const placar=document.createElement("div"); placar.className="placar";
    placar.setAttribute("data-time-a",dado.time_a);
    placar.setAttribute("data-time-b",dado.time_b);
    placar.setAttribute("data-score-ft",placarFT);
    placar.setAttribute("data-score-ht",placarHT);

    const placarTexto=document.createElement("div"); placarTexto.className="placar-texto";
    let html="";
    if(mostrarTimes) html+=`<span class="time-casa" style="cursor:pointer" data-full-time="${dado.time_a}">${abbreviateTeamName(dado.time_a)}</span>`;
    html+=`<span class="ft-span">${primary}</span>`;
    if(mostrarHT) html+=`<span class="ht-span">(${secondary})</span>`;
    if(mostrarTimes) html+=`<span class="time-fora" style="cursor:pointer" data-full-time="${dado.time_b}">${abbreviateTeamName(dado.time_b)}</span>`;
    placarTexto.innerHTML=html;
    placar.appendChild(placarTexto);

    const oddsMatch=findOddsNoIndex(oddsIndex,dado);
    const ovMercado=getOddValue(oddsMatch,selRes);
    if(mostrarOdds){
      const ov=getOddValue(oddsMatch,selRes);
      const oel=document.createElement("div"); oel.className="odds"; oel.textContent=`@${ov}`;
      oel.addEventListener("click",handleOddClick); placar.appendChild(oel);
    }
    renderizarBadgesMercadosExtras(placar, oddsMatch);

    placar.addEventListener("click",handleFTClick);
    if(mostrarHT) { const hs=placarTexto.querySelector(".ht-span"); if(hs) hs.addEventListener("click",handleHTClick); }
    if(mostrarTimes){
      placar.querySelector(".time-casa")?.addEventListener("click",handleTimeClick);
      placar.querySelector(".time-fora")?.addEventListener("click",handleTimeClick);
    }

    const oddTip=getOddValue(oddsMatch,selRes);
    const tooltip=document.createElement("span"); tooltip.className="tooltip";
    tooltip.innerHTML=`<span class="times">${dado.time_a} vs ${dado.time_b}</span><span class="placares">${placarFT} <span class="placarHT">(${placarHT})</span></span>${oddTip&&oddTip!=="N/A"?`<span class="odd-tooltip">@${oddTip}</span>`:""}${tooltipMercadosExtrasHTML(oddsMatch)}`;
    placar.appendChild(tooltip);
    cel.appendChild(placar);
    processedMatches.add(mk);

    // Highlights iniciais
    if(Estado.placarFTSelecionados.includes(placarFT)){
      const cor=Estado.getCorSelecao(Estado.placarFTSelecionados,placarFT,"ft");
      const ftSpan=placarTexto.querySelector(".ft-span");
      if(ftSpan){ftSpan.style.setProperty("--sel-color-ft",cor.bg);ftSpan.classList.add("placar-score-ft-sel");}
    }
    if(mostrarHT&&Estado.placarHTSelecionados.includes(placarHT)){
      const cor=Estado.getCorSelecao(Estado.placarHTSelecionados,placarHT,"ht");
      const htSpan=placarTexto.querySelector(".ht-span");
      if(htSpan){htSpan.style.setProperty("--sel-color-ht",cor.bg);htSpan.classList.add("placar-score-ht-sel");}
    }
    if(mostrarTimes){
      [".time-casa",".time-fora"].forEach(sel=>{
        const span=placar.querySelector(sel); if(!span) return;
        const ft2=span.getAttribute("data-full-time");
        if(Estado.timesSelecionados.includes(ft2)){const cor=Estado.getCorSelecao(Estado.timesSelecionados,ft2,"time");span.style.setProperty("--sel-color",cor.bg);span.classList.add("time-nome-selecionado");}
      });
    }
    if(mostrarOdds){
      const oel=placar.querySelector(".odds");
      if(oel){
        const oddNorm=oel.textContent.trim().replace(/^@/,"");
        if(Estado.oddsSelecionadas.includes(oddNorm)){
          const cor=Estado.getCorSelecao(Estado.oddsSelecionadas,oddNorm,"odd");
          oel.style.setProperty("--sel-color",cor.bg); oel.classList.add("odd-selecionada");
        }
      }
    }

    const placarAtual = tipoPlacar==="ft" ? placarFT : placarHT;
    const [rA, rB] = placarAtual.split(" x ").map(n => parseInt(n) || 0);
    const tg = rA + rB;

    let htA = null, htB = null;
    if (placarHT && placarFT) {
      const htParts = placarHT.split(" x ").map(n => parseInt(n) || 0);
      htA = htParts[0]; htB = htParts[1];
    }

    const acerto = verificarAcerto(selRes, rA, rB, htA, htB);

    // "Melhores Odds" deve contar apenas quando o mercado principal REALMENTE aconteceu (acerto),
    // não toda vez que a odd apareceu na tabela (acerto + erro).
    if (acerto && ovMercado && ovMercado !== "N/A") {
      freqOddsMercado.set(ovMercado, (freqOddsMercado.get(ovMercado) || 0) + 1);
    }

    cel.setAttribute("data-resultado", acerto ? "acerto" : "erro");
    cel.style.setProperty("background-color", acerto ? Estado.corGreen : Estado.corRed, "important");
    aplicarDestaquesMercadosExtras(cel, rA, rB, htA, htB);

    if(acerto){linha.children[linha.children.length-1].textContent=parseInt(linha.children[linha.children.length-1].textContent)+1;totalAcertosPorColuna[idx]++;}
    linha.children[linha.children.length-2].textContent=parseInt(linha.children[linha.children.length-2].textContent)+tg;
    totalGolsPorColuna[idx]+=tg;
  });

  // ── Próximos jogos ─────────────────────────────────────────────────────────
  proximosComHoras.forEach(jogo=>{
    const dataStr=jogo.captured_date?jogo.captured_date.split("/").reverse().join("-"):jogo.date.toISOString().split("T")[0];
    const chave=`${dataStr}-${jogo.hora}`, linha=mapeamentoChaveLinha[chave];
    const mk=`${jogo.team_home}|${jogo.team_visit}|${chave}|${jogo.minuto}`;
    if(!linha||jogo.minuto===null||processedMatches.has(mk)) return;
    const jaTemRes=dados.some(d=>{const dd=getDateStr(d.data);return normalizeString(d.time_a)===normalizeString(jogo.team_home)&&normalizeString(d.time_b)===normalizeString(jogo.team_visit)&&dd===dataStr&&d.hora===jogo.hora&&d.minuto===jogo.minuto;});
    if(jaTemRes) return;
    const idx=minutosFixos.indexOf(jogo.minuto); if(idx===-1) return;
    const cel=linha.children[1+idx]; if(cel.querySelector(".placar")) return;
    cel.classList.add("cel-proximo-jogo");

    const placar=document.createElement("div"); placar.className="placar placar-futuro";
    placar.setAttribute("data-time-a",jogo.team_home); placar.setAttribute("data-time-b",jogo.team_visit);

    const placarTexto=document.createElement("div"); placarTexto.className="placar-texto";
    if(mostrarTimes) {
      placarTexto.innerHTML=`<span class="time-casa" style="cursor:pointer" data-full-time="${jogo.team_home}">${abbreviateTeamName(jogo.team_home)}</span><span class="time-fora" style="cursor:pointer" data-full-time="${jogo.team_visit}">${abbreviateTeamName(jogo.team_visit)}</span>`;
    } else {
      // Spans individuais com data-full-time para o Top5 destacar só o nome certo
      placarTexto.innerHTML=`<span class="time-casa" data-full-time="${jogo.team_home}">${abbreviateTeamName(jogo.team_home)}</span><span class="time-fora" data-full-time="${jogo.team_visit}">${abbreviateTeamName(jogo.team_visit)}</span>`;
    }
    placar.appendChild(placarTexto);

    const oddsP=findOddsProximoNoIndex(oddsIndex,jogo);
    const oddVal=getOddValue(oddsP,selRes);

    if(mostrarOdds && oddVal && oddVal!=="N/A") {
      const oddDiv=Object.assign(document.createElement("div"),{className:"placar-futuro-odd",textContent:`@${oddVal}`});
      oddDiv.addEventListener("click", handleOddClickFuturo);
      if(Estado.oddsSelecionadas.includes(oddVal)) {
        const cor=Estado.getCorSelecao(Estado.oddsSelecionadas,oddVal,"odd");
        oddDiv.style.setProperty("--sel-color",cor.bg);
        oddDiv.classList.add("odd-selecionada");
      }
      placar.appendChild(oddDiv);
    }
    renderizarBadgesMercadosExtras(placar, oddsP);

    if(mostrarTimes){
      const timeCasa = placar.querySelector(".time-casa");
      const timeFora = placar.querySelector(".time-fora");
      timeCasa?.addEventListener("click", handleTimeClickFuturo);
      timeFora?.addEventListener("click", handleTimeClickFuturo);
      [timeCasa, timeFora].forEach(span => {
        if (!span) return;
        const ft2 = span.getAttribute("data-full-time");
        if(Estado.timesSelecionados.includes(ft2)){
          const cor=Estado.getCorSelecao(Estado.timesSelecionados,ft2,"time");
          span.style.setProperty("--sel-color",cor.bg);
          span.classList.add("time-nome-selecionado");
        }
      });
    }

    const tooltip=document.createElement("span"); tooltip.className="tooltip";
    tooltip.innerHTML=`<span class="times">${jogo.team_home} vs ${jogo.team_visit}</span>${mostrarOdds&&oddVal&&oddVal!=="N/A"?`<span class="odd-tooltip">@${oddVal}</span>`:""}${tooltipMercadosExtrasHTML(oddsP)}`;
    placar.appendChild(tooltip);
    cel.appendChild(placar);
    processedMatches.add(mk);
  });

  // ── Footer totais ──────────────────────────────────────────────────────────
  // Quantidade real de jogos (não-futuros) por coluna, usada nas duas linhas combinadas
  const todasLinhasFooter=Array.from(tabelaBody.querySelectorAll("tr"));
  const totMercadoCol=Array(minutosFixos.length).fill(0);
  todasLinhasFooter.forEach(row=>{Array.from(row.cells).slice(1,-2).forEach((c,i)=>{if(c.querySelector(".placar")&&!c.querySelector(".placar-futuro"))totMercadoCol[i]++;});});

  // Linha "Gols por coluna": total em cima, média embaixo (mesma célula)
  totalGolsPorColuna.forEach((t,i)=>{
    const tot=totMercadoCol[i];
    const media=tot>0?(t/tot).toFixed(1):"0.0";
    const cell=document.createElement("td"); cell.className="col-combo";
    cell.innerHTML=`<span class="valor-principal">${t}</span><span class="valor-sub">${media}</span>`;
    trGolsColuna.appendChild(cell);
  });
  // Linha "Dados por coluna": % em cima, (quantidade de acertos) embaixo — colorido por faixa
  totMercadoCol.forEach((tot,i)=>{
    const acertosCol=totalAcertosPorColuna[i];
    const pct=tot>0?Math.floor((acertosCol/tot)*100):0;
    const cell=document.createElement("td"); cell.className=`col-combo ${getClassePct(pct)}`;
    cell.innerHTML=`<span class="valor-principal">${pct}%</span><span class="valor-sub">(${acertosCol})</span>`;
    trDadosColuna.appendChild(cell);
  });
  trGolsColuna.appendChild(document.createElement("td")); trGolsColuna.appendChild(document.createElement("td"));
  trDadosColuna.appendChild(document.createElement("td")); trDadosColuna.appendChild(document.createElement("td"));

  const todasLinhas=todasLinhasFooter;
  todasLinhas.forEach(row=>{
    const total=Array.from(row.cells).slice(1,-2).filter(c=>c.querySelector(".placar")&&!c.querySelector(".placar-futuro")).length;
    const tdGolsRow=row.children[row.children.length-2];
    const totalGolsRow=parseInt(tdGolsRow.textContent)||0;
    const media = total>0 ? (totalGolsRow/total).toFixed(1) : "0.0";
    tdGolsRow.className="col-combo";
    tdGolsRow.innerHTML=`<span class="valor-principal">${totalGolsRow}</span><span class="valor-sub">${media}</span>`;

    const tdDadosRow=row.children[row.children.length-1];
    const acertos=parseInt(tdDadosRow.textContent)||0;
    const pct=total>0?Math.floor((acertos/total)*100):0;
    tdDadosRow.className=`col-combo ${getClassePct(pct)}`;
    tdDadosRow.innerHTML=`<span class="valor-principal">${pct}%</span><span class="valor-sub">(${acertos})</span>`;
  });

  const statsEl=calculateGoalStats(todasLinhas);
  document.getElementById("totalGols").textContent=`Gols: ${statsEl.totalGols}`;
  document.getElementById("mediaGolsHora").textContent=`Médias: ${statsEl.mediaGolsHora}`;

  criarOuObterPainel(); aplicarHighlights(); updateSelectedRows(); aplicarColunaHighlights(); atualizarColunaStats();
  _ultimaFreqOdds = freqOddsMercado;
  atualizarMelhoresOdds(freqOddsMercado);
  garantirPainelCores(); sincronizarPainelCores();
  atualizarCheckboxStreak(); calcularStreakMaximo();
  iniciarObserverStreak();

  // ── Linha de minutos no rodapé (repete os minutos embaixo da tabela) ────────
  let tfoot = tabela.querySelector("tfoot");
  if (!tfoot) { tfoot = document.createElement("tfoot"); tabela.appendChild(tfoot); }
  tfoot.innerHTML = "";
  const trFootMinutos = document.createElement("tr");
  const thFootHora = document.createElement("th"); thFootHora.style.cssText="width:36px;min-width:36px;text-align:center;font-size:0.7em;color:#9ca3af;padding:2px;";
  thFootHora.innerHTML=SVG_ICONS["clock"]||""; trFootMinutos.appendChild(thFootHora);
  minutosFixos.forEach((m,i)=>{
    const th=document.createElement("th"); th.className="minute-header"; th.textContent=m;
    const qIdx=Math.floor(i/5)%4; th.classList.add(`qd-${qIdx}`);
    if(qdCheckboxAtivo()&&i>0&&i%5===0) th.classList.add("quadrant-border");
    if(Estado.colunasSelecionadas.includes(m)) th.classList.add("coluna-selecionada");
    th.addEventListener("click",()=>toggleColuna(m));
    trFootMinutos.appendChild(th);
  });
  const thFG=document.createElement("th"); thFG.id="th-foot-gols"; thFG.classList.add("col-combo"); thFG.innerHTML=SVG_ICONS["ball"]||""; trFootMinutos.appendChild(thFG);
  const thFD=document.createElement("th"); thFD.id="th-foot-dados"; thFD.classList.add("col-combo"); thFD.innerHTML=SVG_ICONS["chart"]||""; trFootMinutos.appendChild(thFD);
  tfoot.appendChild(trFootMinutos);

  aplicarEstadoStatsLaterais();

  // Quadrantes — atualiza dados (estrutura já foi inserida no início, só atualiza valores)
  qdDadosCache = dados;
  if (qdCheckboxAtivo()) qdRenderTabelaValores(dados);

  // Ranking top5 — destaca nome dos times nos próximos confrontos
  rkSincronizar();

  // Zona Green — aplica intensidade por coluna
  setTimeout(aplicarZonaGreen, 80);
}

// ─── TOGGLE STATS LATERAIS ────────────────────────────────────────────────────
function aplicarEstadoStatsLaterais() {
  const ocultas = localStorage.getItem("statsLateraisOcultas") === "1";
  const tabela = document.getElementById("tabelaResultados");
  if (tabela) tabela.classList.toggle("stats-laterais-ocultas", ocultas);
  const selRows = document.getElementById("selectedRowsContainer");
  if (selRows) selRows.classList.toggle("stats-laterais-ocultas", ocultas);
  // Atualiza checkbox se o painel já existir
  const cb = document.getElementById("cb-stats-laterais");
  if (cb) cb.checked = !ocultas;
}

// ─── OBSERVER: re-aplica streak automaticamente ───────────────────────────────
let _streakDebounceTimer = null;
function iniciarObserverStreak() {
  const tabela = document.getElementById("tabelaResultados");
  if (!tabela || tabela._streakObserver) return;
  const observer = new MutationObserver(() => {
    clearTimeout(_streakDebounceTimer);
    _streakDebounceTimer = setTimeout(() => { calcularStreakMaximo(); }, 120);
  });
  observer.observe(tabela, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-resultado"] });
  tabela._streakObserver = observer;
}

// ─── BUSCA COM DIFF ───────────────────────────────────────────────────────────
// Cache global para evitar re-fetches desnecessários ao trocar Times/HT/Odds
let _cacheOddsData = [];
let _cacheProximosJogos = [];
let _cacheResultados = [];
let _renderizandoRapido = false; // flag: true quando ativado por toggle visual

async function buscarDados() {
  hideErrorMessage();
  restaurarHorasSeletor();
  const ligaAtual = getLigaKey();
  Estado.recarregarChaves();
  if (Estado._ultimaLigaRenderizada !== ligaAtual) {
    Estado.forcarRerender();
    Estado._ultimaLigaRenderizada = ligaAtual;
    _ultimaLigaHorasRestauradas = null;
    // Troca de liga: limpa caches e recarrega seleções
    _cacheResultados = []; _cacheOddsData = []; _cacheProximosJogos = [];
    Estado.carregar();
    const trQDantigo = document.querySelector("#trQuadrantes");
    if (trQDantigo) trQDantigo.remove();
  }
  let dados=[],oddsData=[],proximosJogos=[];

  // Se é re-render visual (toggle de Times/HT/Odds) e temos cache, reutiliza sem fetch
  if (_renderizandoRapido && _cacheResultados.length > 0) {
    _renderizandoRapido = false;
    dados = _cacheResultados;
    oddsData = _cacheOddsData;
    proximosJogos = _cacheProximosJogos;
  } else {
    _renderizandoRapido = false;
    try{const r=await fetch(ROTAS_API.resultados(LIGA_ATUAL));if(!r.ok)throw new Error(`${r.status}`);dados=await r.json();}
    catch(e){console.error("Erro resultados:",e);showErrorMessage(`Erro ao carregar resultados: ${e.message}`);}
    try{oddsData=await fetchOdds();}catch(e){showErrorMessage(`Erro odds: ${e.message}`);}
    try{proximosJogos=await fetchProximosJogos();}catch(e){showErrorMessage(`Erro próximos: ${e.message}`);}
    // Atualiza caches
    if(dados.length>0) _cacheResultados=dados;
    _cacheOddsData=oddsData; _cacheProximosJogos=proximosJogos;
  }

  if(dados.length===0&&proximosJogos.length===0){showErrorMessage("Nenhum dado disponível.");return;}

  // Salva cache dos dados para os quadrantes e re-render rápido
  qdDadosCache = dados;

  if(!Estado.dadosMudaram(dados,oddsData,proximosJogos)){
    console.log("Dados inalterados."); computeStatsFromDOM(); updateSelectedRows(); aplicarColunaHighlights(); atualizarColunaStats();
    garantirPainelCores(); sincronizarPainelCores();
    atualizarCheckboxStreak(); calcularStreakMaximo();
    iniciarObserverStreak();
    if (qdCheckboxAtivo()) qdRenderTabela(dados);
    else qdAtualizarIndicadorAoVivo();
    aplicarEstadoStatsLaterais();
    rkSincronizar();
    return;
  }
  criarTabela(dados,oddsData,proximosJogos);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONA GREEN — Intensidade por coluna
// ═══════════════════════════════════════════════════════════════════════════════
function aplicarZonaGreen() {
  // Respeita checkbox — se desativado, limpa e sai
  if (localStorage.getItem("zonaGreenAtivo") !== "1") {
    document.querySelectorAll(".zg-low,.zg-mid,.zg-high,.zg-hot").forEach(el => el.classList.remove("zg-low","zg-mid","zg-high","zg-hot"));
    return;
  }
  const linhas = Array.from(document.querySelectorAll("#tabelaResultados tbody tr"));

  minutosFixos.forEach((m, colIdx) => {
    let acertos = 0, total = 0;
    linhas.forEach(row => {
      const cel = row.cells[1 + colIdx]; if (!cel) return;
      const tipo = cel.getAttribute("data-resultado");
      if (tipo === "acerto") { acertos++; total++; }
      else if (tipo === "erro") { total++; }
    });

    const pct = total > 0 ? (acertos / total) * 100 : 0;
    let zgClass;
    if (pct < 30)      zgClass = "zg-low";
    else if (pct < 50) zgClass = "zg-mid";
    else if (pct < 70) zgClass = "zg-high";
    else               zgClass = "zg-hot";

    linhas.forEach(row => {
      const cel = row.cells[1 + colIdx]; if (!cel) return;
      cel.classList.remove("zg-low","zg-mid","zg-high","zg-hot");
      if (cel.getAttribute("data-resultado")) cel.classList.add(zgClass);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MELHORES ODDS — Top 5 odds mais frequentes no mercado selecionado
// ═══════════════════════════════════════════════════════════════════════════════
function garantirMelhoresOddsBar() {
  let el = document.getElementById("melhores-odds-bar");
  if (el) return el;
  el = document.createElement("div");
  el.id = "melhores-odds-bar";
  const tabela = document.getElementById("tabelaResultados");
  if (tabela && tabela.parentNode) tabela.parentNode.insertBefore(el, tabela);
  else document.body.appendChild(el);
  return el;
}

function atualizarMelhoresOdds(freqMap) {
  const el = garantirMelhoresOddsBar();
  const ativo = localStorage.getItem("melhoresOddsAtivo") === "1";
  if (!ativo) { el.style.display = "none"; el.innerHTML = ""; return; }

  const entradas = Array.from((freqMap || new Map()).entries())
    .sort((a, b) => b[1] - a[1] || parseFloat(a[0]) - parseFloat(b[0]))
    .slice(0, 5);

  el.style.display = "flex";
  if (entradas.length === 0) {
    el.innerHTML = `<span class="mo-title">${SVG_ICONS.trend || ""} Melhores Odds</span><span class="mo-vazio">Sem dados para este mercado</span>`;
    return;
  }
  const maiorContagem = entradas[0][1];
  const tagsHtml = entradas.map(([odd, count]) => {
    const pct = maiorContagem > 0 ? Math.round((count / maiorContagem) * 100) : 0;
    return `<span class="mo-tag"><span class="mo-odd">@${odd}</span><span class="mo-bar"><span class="mo-bar-fill" style="width:${pct}%"></span></span><span class="mo-count">${count}×</span></span>`;
  }).join("");
  el.innerHTML = `<span class="mo-title">${SVG_ICONS.trend || ""} Melhores Odds</span>${tagsHtml}`;
}

// ─── RANKING TOP5 INTERNO ─────────────────────────────────────────────────────
// Calcula ranking por pontos com os dados carregados e destaca APENAS o nome
// do time (span.time-casa / span.time-fora) nos próximos confrontos (.placar-futuro)

function rkCalcularTop5(dados, nJogos) {
  const ts = {};
  dados.slice(0, nJogos).forEach(d => {
    const { time_a, time_b, ft } = d;
    if (!ft || !ft.includes(" x ")) return;
    const [gA, gB] = ft.split(" x ").map(Number);
    if (isNaN(gA) || isNaN(gB)) return;
    [time_a, time_b].forEach(n => { if (!ts[n]) ts[n] = { pts:0, gp:0, gc:0 }; });
    ts[time_a].gp += gA; ts[time_a].gc += gB;
    ts[time_b].gp += gB; ts[time_b].gc += gA;
    if      (gA > gB) { ts[time_a].pts += 3; }
    else if (gA === gB) { ts[time_a].pts += 1; ts[time_b].pts += 1; }
    else                { ts[time_b].pts += 3; }
  });
  return new Set(
    Object.entries(ts)
      .sort(([,a],[,b]) => b.pts - a.pts || (b.gp - b.gc) - (a.gp - a.gc) || b.gp - a.gp)
      .slice(0, 5)
      .map(([nome]) => nome)
  );
}

function rkLerTop5DoDOM() {
  const nomes = new Set();
  document.querySelectorAll("#rankingContainer .rk3-tbl tbody tr").forEach((tr, i) => {
    if (i >= 5) return;
    const span = tr.querySelector(".rk3-team .rk-name-wrap span:first-child");
    if (span && span.textContent.trim()) nomes.add(span.textContent.trim());
  });
  return nomes;
}

function rkAplicarDestaque() {
  rkLimparDestaque();
  const top5 = rkLerTop5DoDOM();
  if (!top5.size) return;
  document.querySelectorAll(".placar-futuro").forEach(placar => {
    [".time-casa", ".time-fora"].forEach(sel => {
      const span = placar.querySelector(sel);
      if (!span) return;
      const nome = span.getAttribute("data-full-time");
      if (nome && top5.has(nome)) span.classList.add("rk-top5-nome");
    });
  });
}

function rkLimparDestaque() {
  document.querySelectorAll(".rk-top5-nome").forEach(el => el.classList.remove("rk-top5-nome"));
}

function rkSincronizar() {
  if (localStorage.getItem("rankingTop5Ativo") === "1") {
    setTimeout(rkAplicarDestaque, 120);
  }
}

buscarDados();
setTimeout(iniciarObserverStreak, 1000);
let _buscando=false;
setInterval(async()=>{if(_buscando)return;_buscando=true;try{await buscarDados();}finally{_buscando=false;}},5000);

// ─── LISTENERS ────────────────────────────────────────────────────────────────
const _sh=document.querySelector("#seletorHoras");
const _sr=document.querySelector("#seletorResultado");
const _stp=document.querySelector("#seletorTipoPlacar");
const _mt=document.querySelector("#mostrarTimes");
const _mht=document.querySelector("#mostrarHT");
const _mo=document.querySelector("#mostrarOdds");

if(_sh)  _sh.addEventListener("change", ()=>{ 
  localStorage.setItem(Estado._horasKey(), _sh.value); 
  Estado.forcarRerender();
  buscarDados(); 
});

if(_sr)  _sr.addEventListener("change", ()=>{ 
  Estado.forcarRerender();
  buscarDados();
  // Atualiza quadrantes ao trocar mercado (só valores, sem recriar estrutura)
  if(qdCheckboxAtivo()) qdRenderTabelaValores(qdDadosCache);
});

if(_stp) _stp.addEventListener("change",()=>{ 
  Estado.forcarRerender();
  buscarDados(); 
});

// ─── RENDERIZAÇÃO RÁPIDA (sem fetch) ──────────────────────────────────────────
// Usa dados em cache para re-renderizar sem buscar novamente da API
function renderizarRapido() {
  if (_cacheResultados.length > 0) {
    _renderizandoRapido = true; // sinaliza para buscarDados reutilizar cache
  }
  Estado.forcarRerender();
  buscarDados();
}

if(_mt){
  _mt.addEventListener("change",()=>{
    if(_mt.value!=="sim"){
      Estado.limparSelecoes(["timesSelecionados"]);
    }
    renderizarRapido();
  });
}

if(_mht){
  _mht.addEventListener("change",()=>{
    if(_mht.value!=="sim"){
      Estado.limparSelecoes(["placarHTSelecionados"]);
    }
    renderizarRapido();
  });
}

if(_mo){
  _mo.addEventListener("change",()=>{
    if(_mo.value!=="sim"){
      Estado.limparSelecoes(["oddsSelecionadas"]);
    }
    renderizarRapido();
  });
}

// ─── Sincroniza o botão "+ Mercados" com o estilo padrão dos outros seletores ─
function sincronizarEstiloBtnMercadosExtras() {
  const btn = document.getElementById("btnMercadosExtras");
  // usa o <select> de Horas como referência de "padrão da página"
  const ref = document.querySelector("#seletorHoras") || document.querySelector(".seletor-container select");
  if (!btn || !ref) return;
  const cs = getComputedStyle(ref);
  const props = [
    "height", "minHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "fontSize", "fontFamily", "fontWeight", "color", "backgroundColor",
    "border", "borderRadius", "boxSizing", "lineHeight"
  ];
  props.forEach(p => { btn.style[p] = cs[p]; });
  btn.style.display = "inline-flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.verticalAlign = "middle";
}

// ─── MERCADOS EXTRAS — inicialização da UI (popover) ─────────────────────────
(function initMercadosExtrasUI() {
 try {
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    .destaque-extra { box-shadow: inset 0 0 0 2px var(--destaque-extra-color, rgba(255,255,255,0.55)); }
    /* Quando a célula também está em streak-alerta, o pulso (animação) deve vencer o destaque estático */
    .streak-alerta.destaque-extra { animation: streakPulse 1.8s ease-in-out infinite; }
    #painelMercadosExtras select { width:100%; }
    .odd-tooltip-extra { color:#cbd5e1 !important; font-weight:600; }
  `;
  document.head.appendChild(styleTag);

  const btn      = document.getElementById("btnMercadosExtras");
  const painel   = document.getElementById("painelMercadosExtras");
  const select   = document.getElementById("selectNovoMercadoExtra");
  const lista    = document.getElementById("listaMercadosExtras");
  const seletorResultado = document.getElementById("seletorResultado");
  const corInput = document.getElementById("corDestaqueExtraInput");
  if (!btn || !painel || !select || !lista) return;

  if (corInput) {
    corInput.value = Estado.corDestaqueExtra || "#93C5FD";
    // Enquanto arrasta no seletor: só atualiza a variável CSS (instantâneo, sem re-render)
    corInput.addEventListener("input", () => {
      Estado.corDestaqueExtra = corInput.value;
      aplicarCorDestaqueExtraGlobal();
    });
    // Ao soltar/fechar o seletor: persiste e garante que tudo esteja sincronizado
    corInput.addEventListener("change", () => {
      Estado.corDestaqueExtra = corInput.value;
      aplicarCorDestaqueExtraGlobal();
      Estado.salvar();
    });
  }

  sincronizarEstiloBtnMercadosExtras();
  aplicarCorDestaqueExtraGlobal();
  window.addEventListener("resize", sincronizarEstiloBtnMercadosExtras);

  renderizarPainelMercadosExtras();

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const aberto = painel.style.display !== "none";
    painel.style.display = aberto ? "none" : "block";
    if (!aberto) renderizarPainelMercadosExtras();
  });

  document.addEventListener("click", (e) => {
    if (painel.style.display !== "none" && !painel.contains(e.target) && e.target !== btn) {
      painel.style.display = "none";
    }
  });

  select.addEventListener("change", () => {
    if (select.value) mercadosExtrasAdicionar(select.value);
  });

  lista.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-acao]");
    if (!b) return;
    const { acao, mercado } = b.dataset;
    if (acao === "remover") mercadosExtrasRemover(mercado);
    else if (acao === "odd") mercadosExtrasToggleFlag(mercado, "mostrarOdd");
    else if (acao === "destaque") mercadosExtrasToggleFlag(mercado, "destacar");
  });

  if (seletorResultado) {
    seletorResultado.addEventListener("change", renderizarPainelMercadosExtras);
  }
 } catch (e) {
   console.error("Erro ao iniciar popover de mercados extras:", e);
 }
})();