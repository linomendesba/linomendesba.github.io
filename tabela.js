// Adiciona o grupo "Viradinha" no seletor de mercado de todas as ligas
(function adicionarGrupoViradinha() {
  const inserir = () => {
    const sel = document.querySelector("#seletorResultado");
    if (!sel) return false;
    if (sel.querySelector('option[value="viradinha"]')) return true; // já existe, não duplica

    const og = document.createElement("optgroup");
    og.label = "── Viradinha ──";

    const opt = document.createElement("option");
    opt.value = "viradinha";
    opt.textContent = "Viradinha";

    og.appendChild(opt);
    sel.appendChild(og);
    return true;
  };

  if (!inserir()) document.addEventListener("DOMContentLoaded", inserir);
})();

const MINUTOS_POR_LIGA = {

  // Estrelabet
  "Copa do Mundo":       [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  "Ligas dos Campeões":  [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  "América Latina":      [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  "Premier League":      [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],

  // 1win: 20 jogos/hora (de 3 em 3 minutos)
  "1win Inglaterra":     [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  "1win Espanha":        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  "1win Itália":         [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],

  // BetGreen: 12 jogos/hora (de 5 em 5 minutos)
  "BetGreen Premier League":    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  "BetGreen La Liga":           [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  "BetGreen World Cup":         [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  "BetGreen Primera Division":  [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  "BetGreen Champions League":  [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58],

  // Kiron
  "Kiron Liga Inglaterra": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58],
  "Kiron Liga Itália":     [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59],
  "Kiron Liga Espanha":    [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59],
  "Kiron Liga Brasil":          [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  "Kiron Liga América Latina":  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  "Kiron Liga Mundial":    [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58],
};


const MINUTOS_FIXOS_PADRAO = [
  1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58,
];

let minutosFixos = (typeof LIGA_ATUAL !== "undefined" && MINUTOS_POR_LIGA[LIGA_ATUAL])
  ? MINUTOS_POR_LIGA[LIGA_ATUAL]
  : MINUTOS_FIXOS_PADRAO;

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


function getClassePct(pct) {
  if (pct >= 50) return "pct-verde";
  if (pct >= 30) return "pct-amarelo";
  return "pct-vermelho";
}


const LABEL_CURTO_MERCADO = {
  ambasMarcam: "BTS", ambasNaoMarcam: "NBTS",
  casaVence: "1", empate: "X", foraVence: "2", viradinha: "VIRA",
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


function getLigaKey() {
  if (typeof LIGA_ATUAL !== "undefined" && LIGA_ATUAL) {
    return String(LIGA_ATUAL).trim().toLowerCase().replace(/\s+/g, "_");
  }
  const h4 = document.querySelector("h4.custom-color");
  if (h4 && h4.textContent.trim()) {
    return h4.textContent.trim().toLowerCase().replace(/\s+/g, "_");
  }
  return "default";
}


const Estado = {
  placarFTSelecionados: [],
  placarHTSelecionados: [],
  timesSelecionados:    [],
  oddsSelecionadas:     [],
  mercadosExtras:       [], 
  corDestaqueExtra:     "#93C5FD",
  selectedChaves:       [],
  colunasSelecionadas:  [],
  _ultimoHashDados:       null,
  _ultimoHashOdds:        null,
  _ultimoHashProximos:    null,
  _ultimaLigaRenderizada: null,
  corGreen: COR_GREEN_PADRAO,
  corRed:   COR_RED_PADRAO,


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

    return dados.length + "_" + dados.map(d => {
      const id = d?.id ?? d?.match_id ?? "";
      return `${id}:${d?.ft ?? ""}:${d?.ht ?? ""}`;
    }).join("|");
  },

  dadosMudaram(dados, odds, proximos) {
    const hD=this.hashDados(dados), hO=this.hashDados(odds), hP=this.hashDados(proximos);
    if (hD!==this._ultimoHashDados || hO!==this._ultimoHashOdds || hP!==this._ultimoHashProximos) {
      this._ultimoHashDados=hD; this._ultimoHashOdds=hO; this._ultimoHashProximos=hP; return true;
    }
    return false;
  },

  forcarRerender() { this._ultimoHashDados = null; _ultimaAssinaturaRender = null; },
};

Estado.carregar();


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


// Tamanho do quadrante (nº de jogos por bloco) conforme a quantidade de jogos por hora da liga.
// 12 jogos/hora (BetGreen) => 4 quadrantes de 3 jogos. Demais ligas: blocos de 5.
const QD_TAMANHO_BLOCO_POR_QTD = { 12: 3 };
const QD_TAMANHO_BLOCO_FIXO = QD_TAMANHO_BLOCO_POR_QTD[minutosFixos.length] ?? 5;
function gerarBlocosDeMinutos(seq) {
  const tamanho = QD_TAMANHO_BLOCO_FIXO;
  const blocos = [];
  for (let i = 0; i < seq.length; i += tamanho) blocos.push(seq.slice(i, i + tamanho));
  return blocos;
}

let blocosDeMinutos = gerarBlocosDeMinutos(minutosFixos);


function _tamanhoBlocoQD() {
  return QD_TAMANHO_BLOCO_FIXO;
}

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


function renderizarPainelMercadosExtras() {
  const btn = document.getElementById("btnMercadosExtras");
  const countEl = document.getElementById("mercadosExtrasCount");
  const select = document.getElementById("selectNovoMercadoExtra");
  const lista = document.getElementById("listaMercadosExtras");
  if (!btn || !select || !lista) return;


  if (Estado.mercadosExtras.length > 0) {
    countEl.textContent = `(${Estado.mercadosExtras.length})`;
    countEl.style.display = "inline";
  } else {
    countEl.style.display = "none";
  }


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


  lista.innerHTML = "";
  Estado.mercadosExtras.forEach(item => {
    const cor = corMercadoExtra(item.mercado);
    const label = LABEL_CURTO_MERCADO[item.mercado] || item.mercado;
    const contrario = mercadoEhContrarioDoPrincipal(item.mercado);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;background:#1b1c20;border:1px solid "+cor+";border-radius:6px;padding:4px 6px;font-size:0.8em;";
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


function renderizarBadgesMercadosExtras(placarEl, oddsObj) {
 try {
  if (!Estado.mercadosExtras.length) return;
  Estado.mercadosExtras.forEach(item => {
    if (!item.mostrarOdd) return;
    const val = getOddValue(oddsObj, item.mercado);
    if (!val || val === "N/A") return;
    const b = document.createElement("div");
    b.className = "odd-extra-badge";
    b.style.cssText = `font-size:9px;line-height:1;margin-top:1px;padding:1px 2px;border-radius:3px;
      background:none;color:#ffffff;white-space:nowrap;`;
    b.textContent = `${LABEL_CURTO_MERCADO[item.mercado] || item.mercado} @${val}`;
    placarEl.appendChild(b);
  });
 } catch (e) { console.error("Erro badges mercados extras:", e); }
}


function aplicarDestaquesMercadosExtras(cel, rA, rB, htA, htB) {
 try {
  const ativos = Estado.mercadosExtras.filter(m => m.destacar);

  if (!ativos.length) {
    if (cel.classList.contains("destaque-extra")) {
      cel.classList.remove("destaque-extra");
      cel.querySelectorAll(".destaque-extra-dot").forEach(d => d.remove());
    }
    return;
  }
  cel.classList.remove("destaque-extra");
  cel.querySelectorAll(".destaque-extra-dot").forEach(d => d.remove());
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


function aplicarCorDestaqueExtraGlobal() {
  document.documentElement.style.setProperty("--destaque-extra-color", Estado.corDestaqueExtra || "#93C5FD");
}


function tooltipMercadosExtrasHTML(oddsObj) {
  if (!Estado.mercadosExtras.length) return "";
  return Estado.mercadosExtras.filter(m => m.mostrarOdd).map(item => {
    const val = getOddValue(oddsObj, item.mercado);
    if (!val || val === "N/A") return "";
    const label = LABEL_CURTO_MERCADO[item.mercado] || item.mercado;
    return `<span class="odd-tooltip odd-tooltip-extra">${label} @${val}</span>`;
  }).join("");
}



// Timestamp de cada jogo, calculado uma única vez por objeto
const _tsJogoMemo = new WeakMap();
function tsJogo(j) {
  let t = _tsJogoMemo.get(j);
  if (t === undefined) {
    t = new Date(`${getDateStr(j.data)}T${j.hora.toString().padStart(2,"0")}:${j.minuto.toString().padStart(2,"0")}:00`).getTime();
    _tsJogoMemo.set(j, t);
  }
  return t;
}

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
    .placar:not(.placar-futuro) .time-casa,
    .placar:not(.placar-futuro) .time-fora { font-size: min(11px, 0.8em); line-height: 1.15; letter-spacing: 0.01em; }
    .placar-futuro-odd { font-size:0.9em; opacity:0.85; margin-top:1px; color:#dfdfdf; font-weight:bold; cursor:pointer; }
    .placar-futuro .placar-texto { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0; line-height:1.1; }

    .minute-header { cursor:pointer; user-select:none; font-size:0.82em; font-weight:700; }
    .minute-header .jogo-num { font-size:0.95em; font-weight:700; opacity:1; margin-left:3px; color:rgba(255,255,255,0.55); }
    .minute-header:hover { filter: brightness(1.6) !important; }

    .qd-0 { background-color: #1a1b1f !important; box-shadow: inset 0 -2px 0 0 #363940; }
    .qd-1 { background-color: #25272c !important; box-shadow: inset 0 -2px 0 0 #454850; }
    .qd-2 { background-color: #17181c !important; box-shadow: inset 0 -2px 0 0 #2d3036; }
    .qd-3 { background-color: #202227 !important; box-shadow: inset 0 -2px 0 0 #3e4148; }

    .qd-cell-0 { background-color: rgba(255,255,255,0.03) !important; }
    .qd-cell-1 { background-color: rgba(255,255,255,0.05) !important; }
    .qd-cell-2 { background-color: rgba(255,255,255,0.03) !important; }
    .qd-cell-3 { background-color: rgba(255,255,255,0.05) !important; }
    td[data-resultado="acerto"] { background-color: var(--cor-green, #018b06) !important; }
    td[data-resultado="erro"]   { background-color: var(--cor-red,   #be0e02) !important; }

    #tabelaResultados.tem-coluna-selecionada td:not(.coluna-selecionada)             { filter: brightness(0.45); }
    #tabelaResultados.tem-coluna-selecionada th.minute-header:not(.coluna-selecionada) { filter: brightness(0.45); }
    #tabelaResultados.tem-coluna-selecionada td.coluna-selecionada                   { filter: none; }
    #tabelaResultados.tem-coluna-selecionada th.coluna-selecionada                   { filter: none; background: rgba(255,255,255,0.2) !important; }
    #tabelaResultados.tem-coluna-selecionada td:first-child,
    #tabelaResultados.tem-coluna-selecionada td:nth-last-child(1),
    #tabelaResultados.tem-coluna-selecionada td:nth-last-child(2) { filter: none; }

    td.quadrant-border, th.quadrant-border { border-left: 3px solid rgba(255,255,255,0.35) !important; }

    /* Linha dos quadrantes no thead da tabela principal */
    .qd-bloco-th { vertical-align: top; }
    .qd-bloco-th.qd-0 { background-color: #1a1b1f !important; }
    .qd-bloco-th.qd-1 { background-color: #25272c !important; }
    .qd-bloco-th.qd-2 { background-color: #17181c !important; }
    .qd-bloco-th.qd-3 { background-color: #202227 !important; }

    /* Bloco ao vivo — destaque na linha de quadrantes */
    .qd-bloco-th.qd-bloco-ativo {
      background-color: rgba(21,127,147,0.18) !important;
      box-shadow: inset 0 0 0 2px rgba(21,127,147,0.55);
    }
    .qd-live-badge {
      display: inline-flex; align-items: center; gap: 3px;
      background: rgba(21,127,147,0.22); color: #5cc3d6;
      border: 1px solid rgba(21,127,147,0.5); border-radius: 4px;
      font-size: 9px; font-weight: 700; padding: 1px 4px;
      margin-right: 4px; white-space: nowrap; vertical-align: middle;
    }
    .qd-live-dot {
      display: inline-block; width: 7px; height: 7px; border-radius: 50%;
      background: #5cc3d6;
      animation: qdLivePulse 1.2s ease-in-out infinite;
    }
    @keyframes qdLivePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }

    /* ── Linha dos quadrantes (H.Atual / H.Ant): mesma família do header azul, sem blocos cinza pesados ── */
    th.qd-bloco-th.qd-0, th.qd-bloco-th.qd-2 {
      background-color:#141821 !important;
      background-image:linear-gradient(135deg, rgba(63,90,154,0.16), rgba(63,90,154,0.05)) !important;
      box-shadow:inset 0 0 0 1px rgba(63,90,154,0.28) !important;
    }
    th.qd-bloco-th.qd-1, th.qd-bloco-th.qd-3 {
      background-color:#171c27 !important;
      background-image:linear-gradient(135deg, rgba(63,90,154,0.24), rgba(63,90,154,0.08)) !important;
      box-shadow:inset 0 0 0 1px rgba(63,90,154,0.34) !important;
    }
    /* Quadrante ao vivo: mesma estética do botão Aplicar */
    th.qd-bloco-th.qd-bloco-ativo {
      background-color:#1a1b1f !important;
      background-image:linear-gradient(135deg, rgba(21,127,147,0.24), rgba(21,127,147,0.08)) !important;
      box-shadow:inset 0 0 0 1px rgba(21,127,147,0.65) !important;
    }
    /* Divisória entre quadrantes: fina e azulada em vez da faixa branca grossa */
    th.qd-bloco-th[style*="border-left"] { border-left-width:2px !important; border-left-color:rgba(92,130,200,0.5) !important; }
    td.quadrant-border, th.quadrant-border { border-left:2px solid rgba(92,130,200,0.5) !important; }
    /* Contadores (gols / acertos / erros) como pílulas legíveis */
    .qd-bloco-th span[title="Gols"], .qd-bloco-th span[title="Acertos"], .qd-bloco-th span[title="Erros"] {
      padding:1px 7px; border-radius:999px; border:1px solid transparent;
    }
    .qd-bloco-th span[title="Gols"]    { color:#e5e7eb !important; background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.14); }
    .qd-bloco-th span[title="Acertos"] { color:#4ade80 !important; background:rgba(74,222,128,0.10); border-color:rgba(74,222,128,0.35); }
    .qd-bloco-th span[title="Erros"]   { color:#ff6b6b !important; background:rgba(255,92,92,0.10);  border-color:rgba(255,92,92,0.35); }

    #coluna-stats { display:flex; flex-wrap:wrap; gap:5px; padding:5px 8px; margin-bottom:4px; }
    #coluna-stats:empty { display:none; }

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
      display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
      padding: 4px 2px; margin-top: -20px;
    }
    /* Base compartilhada por todos os "controles" do painel — mesma altura,
       mesmo raio e mesma paleta neutra usada nos <select> do topo da página */
    #painel-cores label,
    .btn-reset-cores {
      display:inline-flex; align-items:center; gap:4px;
      height:26px; padding:0 9px; box-sizing:border-box;
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
      border-radius:8px; font-size:0.72em; font-weight:600; color:rgba(255,255,255,0.7);
      cursor:pointer; white-space:nowrap;
      transition:background 0.15s, border-color 0.15s, color 0.15s;
    }
    #painel-cores label:hover,
    .btn-reset-cores:hover { background:rgba(255,255,255,0.08); border-color:rgba(21,127,147,0.55); color:#fff; }
    #painel-cores input[type="color"] {
      width:14px; height:14px; border:1px solid rgba(255,255,255,0.18);
      border-radius:4px; cursor:pointer; padding:0; background:none;
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
      display: inline-flex; align-items: center; gap: 4px;
      height:26px; padding: 0 9px; box-sizing:border-box;
      cursor: pointer; color: rgba(255,255,255,0.7); font-size: 0.72em; font-weight: 600; user-select: none;
      border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04);
      transition: border-color 0.2s, color 0.2s, background 0.2s; letter-spacing: 0.1px; white-space: nowrap;
    }
    .alerta-toggle-label:hover { border-color: rgba(21,127,147,0.55); color: #fff; background: rgba(255,255,255,0.08); }
    .alerta-toggle-label input[type="checkbox"] { width: 10px; height: 10px; cursor: pointer; accent-color: #157f93; flex-shrink: 0; }
    .alerta-ativo { color: #5cc3d6 !important; font-weight: 700; border-color: rgba(21,127,147,0.6) !important; background: rgba(21,127,147,0.12) !important; }

    /* Botão primário — preenchimento sólido, se destaca claramente como ação de confirmação */
    .btn-aplicar-cores {
      display:inline-flex; align-items:center; gap:4px;
      height:26px; padding:0 11px; box-sizing:border-box;
      background: linear-gradient(135deg, rgba(21,127,147,0.16), rgba(21,127,147,0.06));
      border: 1px solid rgba(21,127,147,0.5);
      border-radius: 8px;
      cursor: pointer;
      color: #5cc3d6;
      font-size:0.72em; font-weight:700;
      transition:background 0.15s, border-color 0.15s, box-shadow 0.15s; white-space:nowrap;
    }
    .btn-aplicar-cores:hover {
      background: linear-gradient(135deg, rgba(21,127,147,0.3), rgba(21,127,147,0.14));
      border-color: rgba(21,127,147,0.85);
      color: #fff;
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
    /* Colunas da DIREITA (Gols / Dados de cada linha de horário): estreitas, um valor em cima do outro — mesmo tamanho de fonte da linha do topo */
    .col-combo { width:34px !important; min-width:34px !important; max-width:38px !important; padding:1px 1px !important; text-align:center; }
    .col-combo .valor-principal { display:block; font-size:0.85em; font-weight:700; line-height:1.15; white-space:nowrap; }
    .col-combo .valor-sub       { display:block; font-size:0.78em; font-weight:700; opacity:0.85; line-height:1.1; margin-top:1px; color:#93c5fd; white-space:nowrap; }
    .col-combo-th { font-size:0.65em !important; padding:2px 0 !important; }
    /* Linhas do TOPO (Gols por coluna / Dados por coluna): duas linhas separadas, e dentro de cada uma o texto do mesmo grupo (principal + sub) lado a lado — forçado com !important para não ser sobrescrito por outro CSS da página */
    .col-combo-top { padding:3px 2px !important; text-align:center !important; white-space:nowrap !important; height:18px !important; box-sizing:border-box !important; }
    .col-combo-top .valor-principal { display:inline-block !important; font-size:0.85em !important; font-weight:700 !important; white-space:nowrap !important; vertical-align:middle !important; }
    .col-combo-top .valor-sub       { display:inline-block !important; font-size:0.78em !important; opacity:0.85 !important; margin-left:3px !important; color:#93c5fd; white-space:nowrap !important; vertical-align:middle !important; }
    /* Separação visual clara entre a linha de Gols (de cima) e a linha de Dados (de baixo) */
    #linhaGolsColuna { background:rgba(255,255,255,0.02) !important; }
    #linhaGolsColuna td.col-combo-top,
    #linhaGolsColuna th { border-bottom:1px solid rgba(255,255,255,0.10) !important; }
    #linhaDadosColuna td.col-combo-top,
    #linhaDadosColuna th { padding-top:3px !important; }
    /* Faixas de cor do % — cor no TEXTO, sem preencher o fundo da célula: 0–29 vermelho / 30–49 amarelo / 50–100 verde */
    .pct-vermelho .valor-principal { color:#ff5c5c; }
    .pct-amarelo  .valor-principal { color:#f5c518; }
    .pct-verde    .valor-principal { color:#4ade80; }
    .pct-vermelho .valor-sub { color:#ff5c5c; opacity:0.75; }
    .pct-amarelo  .valor-sub { color:#f5c518; opacity:0.75; }
    .pct-verde    .valor-sub { color:#4ade80; opacity:0.75; }
    /* Células com jogos ainda não realizados (próximos): accent vivo do tema */
    .cel-proximo-jogo {
      background-color:#1a1b1f !important;
      background-image:linear-gradient(135deg, rgba(21,127,147,0.16), rgba(21,127,147,0.06)) !important;
      box-shadow:inset 0 0 0 1px rgba(21,127,147,0.5);
      border-radius:8px;
      transition:background-image 0.15s, box-shadow 0.15s;
    }
    .cel-proximo-jogo:hover {
      background-image:linear-gradient(135deg, rgba(21,127,147,0.3), rgba(21,127,147,0.14)) !important;
      box-shadow:inset 0 0 0 1px rgba(21,127,147,0.85);
    }
    /* Odds dos mercados extras (+mercado) nos próximos: ciano em vez de branco */
    .cel-proximo-jogo .odd-extra-badge { color:#5cc3d6 !important; font-weight:700; opacity:0.85; }

    /* Tooltip no mesmo estilo dos próximos jogos (fundo escuro + degradê ciano, borda ciano, textos ciano) */
    .tooltip {
      background:linear-gradient(135deg, rgba(21,127,147,0.28), rgba(21,127,147,0.12)), #1a1b1f !important;
      border:1px solid rgba(21,127,147,0.6) !important;
      border-radius:8px !important;
      box-shadow:0 6px 18px rgba(0,0,0,0.55), 0 0 0 1px rgba(92,195,214,0.12) !important;
    }
    .tooltip .times { color:#5cc3d6 !important; font-weight:800; }
    .tooltip .odd-tooltip { color:#5cc3d6 !important; font-weight:800; }
    .tooltip .odd-tooltip-extra { color:#8fd3e0 !important; font-weight:600; }

    /* Header dos minutos (topo e rodapé): azul-marinho pra diferenciar do fundo preto e do ciano dos próximos */
    #tabelaResultados th.minute-header:not(.coluna-selecionada) { color:#cbd5e1; }
    #tabelaResultados th.minute-header.qd-0:not(.coluna-selecionada) { background-color:#151b2b !important; box-shadow:inset 0 -1px 0 0 rgba(63,90,154,0.4); }
    #tabelaResultados th.minute-header.qd-1:not(.coluna-selecionada) { background-color:#192236 !important; box-shadow:inset 0 -1px 0 0 rgba(63,90,154,0.45); }
    #tabelaResultados th.minute-header.qd-2:not(.coluna-selecionada) { background-color:#131825 !important; box-shadow:inset 0 -1px 0 0 rgba(63,90,154,0.35); }
    #tabelaResultados th.minute-header.qd-3:not(.coluna-selecionada) { background-color:#171f31 !important; box-shadow:inset 0 -1px 0 0 rgba(63,90,154,0.42); }
    #tabelaResultados th.minute-header:not(.coluna-selecionada) .jogo-num { color:#6b7fa8; }
    /* Checkbox de seleção de linha (coluna de horas): discreto, no tema */
    #tabelaResultados input.row-selector {
      appearance: none; -webkit-appearance: none;
      border: 1px solid rgba(255,255,255,0.3); border-radius: 3px;
      background-color: transparent; background-repeat: no-repeat; background-position: center; background-size: 9px;
      transition: background-color .15s, border-color .15s;
    }
    #tabelaResultados input.row-selector:hover { border-color: rgba(92,195,214,0.85); }
    #tabelaResultados input.row-selector:checked {
      background-color: #157f93; border-color: #5cc3d6;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><path d='M2 5.2 4.2 7.4 8 2.8' fill='none' stroke='white' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
    }
    #tabelaResultados input.row-selector:focus-visible { outline: 2px solid rgba(21,127,147,0.8); outline-offset: 1px; }
    /* Texto ciano nos próximos jogos (mesma estética do botão Aplicar) */
    .cel-proximo-jogo .placar-futuro,
    .cel-proximo-jogo .placar-futuro .time-casa,
    .cel-proximo-jogo .placar-futuro .time-fora,
    .cel-proximo-jogo .placar-futuro .placar-futuro-odd:not(.odd-selecionada) { color:#5cc3d6 !important; }
    .cel-proximo-jogo .placar-futuro .time-casa,
    .cel-proximo-jogo .placar-futuro .time-fora { font-weight:800; }
    .cel-proximo-jogo .placar-futuro .placar-futuro-odd:not(.odd-selecionada) { opacity:0.9; font-weight:800; }
    .cel-proximo-jogo .placar .time-casa:hover,
    .cel-proximo-jogo .placar .time-fora:hover { color:#fff !important; text-decoration:underline; }
    /* ── ORÁCULO: marca direto na célula os minutos sugeridos da hora atual ── */
    .oraculo-marcado { position:relative; box-shadow:inset 0 0 0 2px rgba(3,16,20,0.9) !important; }
    .oraculo-marcado::after {
      content: attr(data-oraculo-label);
      position:absolute;
      top:2px; right:2px;
      width:18px; height:18px;
      border-radius:50%;
      background:#f5c518;
      color:#111;
      font-size:9px;
      font-weight:800;
      letter-spacing:-0.2px;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 0 4px rgba(245,197,24,0.8), 0 0 0 1px rgba(0,0,0,0.45);
      pointer-events:none;
      z-index:3;
      line-height:1;
    }
    /* ── BUSCADOR: marca SG / G1 / G2 nos próximos confrontos validados pela sequência ── */
    .buscador-marcado { position:relative; box-shadow:inset 0 0 0 1.5px rgba(139,77,232,0.9) !important; }
    .buscador-marcado::before {
      content: attr(data-buscador-label);
      position:absolute;
      top:2px; left:2px;
      width:18px; height:18px;
      border-radius:50%;
      background:#8b4de8;
      color:#fff;
      font-size:9px;
      font-weight:800;
      letter-spacing:-0.2px;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 0 4px rgba(139,77,232,0.85), 0 0 0 1px rgba(0,0,0,0.45);
      pointer-events:none;
      z-index:3;
      line-height:1;
    }
    #painelBuscador { margin-bottom:6px; }
    .buscador-box {
      display:flex; align-items:center; flex-wrap:wrap; gap:7px;
      background:rgba(139,77,232,0.08); border:1px solid rgba(139,77,232,0.35);
      border-radius:8px; padding:6px 10px; font-size:0.76em; color:#e5e7eb;
    }
    .buscador-box-muted { border-color:rgba(255,255,255,0.1); color:#9ca3af; background:rgba(255,255,255,0.03); }
    .buscador-box-hit { border-color:rgba(139,77,232,0.7); box-shadow:0 0 10px rgba(139,77,232,0.25); }
    .buscador-chip { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:4px; font-size:9px; font-weight:800; color:#fff; }
    .buscador-chip-v { background:#20d66b; }
    .buscador-chip-x { background:#ff3b30; }
    .buscador-status { color:#9ca3af; font-weight:600; }
    .buscador-status-hit { color:#c9a6ff; font-weight:800; }
    @keyframes buscadorPulse {
      0%   { box-shadow: 0 0 0 0 rgba(139,77,232,0.6); }
      50%  { box-shadow: 0 0 18px 4px rgba(139,77,232,0.6); }
      100% { box-shadow: 0 0 0 0 rgba(139,77,232,0); }
    }
    .buscador-pulse { animation: buscadorPulse 1s ease-in-out 2; }
    .buscador-chip-placar { width:auto; min-width:34px; padding:0 5px; background:#25272c; border:1px solid rgba(212,175,55,0.4); color:#d4af37; }
    .btn-buscador-config {
      display:inline-flex; align-items:center; justify-content:center;
      width:22px; height:22px; margin-left:4px;
      background:rgba(21,127,147,0.08); border:1px solid rgba(21,127,147,0.45);
      border-radius:8px; color:#5cc3d6; font-size:13px; line-height:1;
      cursor:pointer; transition:border-color .2s, background-color .2s;
    }
    .btn-buscador-config:hover { border-color:rgba(21,127,147,0.75); background-color:rgba(21,127,147,0.16); }
    .buscador-modal-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,0.6);
      display:flex; align-items:center; justify-content:center;
      z-index:9999;
    }
    .buscador-modal-overlay[hidden] { display:none; }
    .buscador-modal {
      background:#1b1c20; border:1px solid rgba(255,255,255,0.12);
      border-radius:10px; padding:18px 20px; width:280px; max-width:90vw;
      box-shadow:0 8px 30px rgba(0,0,0,0.5);
      display:flex; flex-direction:column; gap:12px;
      color:#e5e7eb; font-size:13px;
    }
    .buscador-modal h4 { margin:0 0 4px; font-size:14px; color:#5cc3d6; }
    .buscador-modal h4 span { color:#9ca3af; font-weight:600; font-size:12px; }
    .buscador-modal label { display:flex; flex-direction:column; gap:4px; font-weight:600; }
    .buscador-modal .buscador-select {
      appearance:none; -webkit-appearance:none; -moz-appearance:none;
      color-scheme:dark; box-sizing:border-box; height:30px; padding:0 22px 0 10px;
      background-color:rgba(21,127,147,0.08);
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><path d='M1 1.2 5 4.8 9 1.2' fill='none' stroke='%235cc3d6' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
      background-repeat:no-repeat; background-position:right 8px center; background-size:8px 5px;
      border:1px solid rgba(21,127,147,0.45); border-radius:6px; color:#5cc3d6;
      font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; outline:none;
    }
    .buscador-modal .buscador-select option { background:#0a1114; color:#e5e7eb; }
    .buscador-modal-actions { display:flex; gap:8px; margin-top:4px; }
    .buscador-modal-actions button {
      flex:1; height:32px; border-radius:6px; font-weight:800; font-size:12px;
      cursor:pointer; border:1px solid rgba(21,127,147,0.45);
    }
    #btnSalvarBuscadorConfig { background:#157f93; color:#fff; }
    #btnCancelarBuscadorConfig { background:transparent; color:#5cc3d6; }
    #lbl-buscador-ocorrencias {
      display:inline-flex; align-items:center;
      height:22px; padding:0 !important;
      border:none !important; background:transparent !important;
    }
    .buscador-ocorrencias-select {
      appearance:none; -webkit-appearance:none; -moz-appearance:none;
      color-scheme:dark;
      box-sizing:border-box;
      height:22px;
      padding:0 19px 0 8px;
      background-color:rgba(21,127,147,0.08);
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><path d='M1 1.2 5 4.8 9 1.2' fill='none' stroke='%235cc3d6' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
      background-repeat:no-repeat;
      background-position:right 5px center;
      background-size:8px 5px;
      border:1px solid rgba(21,127,147,0.45);
      border-radius:6px;
      color:#5cc3d6;
      font-family:inherit;
      font-size:12px; font-weight:800; letter-spacing:0.3px;
      line-height:20px; white-space:nowrap;
      cursor:pointer; outline:none;
      transition:border-color .2s, background-color .2s, color .2s;
    }
    .buscador-ocorrencias-select:hover {
      border-color:rgba(21,127,147,0.75);
      background-color:rgba(21,127,147,0.16);
    }
    .buscador-ocorrencias-select:focus-visible {
      border-color:#5cc3d6;
      box-shadow:0 0 0 2px rgba(21,127,147,0.25);
    }
    .buscador-ocorrencias-select option {
      background:#0a1114; color:#e5e7eb;
      font-size:13px; font-weight:700;
    }
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


function showToast(msg, ms) {
  const c = document.getElementById("toast-container"); if (!c) return;
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  c.appendChild(t); setTimeout(() => t.remove(), ms || 2200);
}


function aplicarCoresCelulas() {
  document.querySelectorAll("td[data-resultado]").forEach(cel => {
    const tipo = cel.getAttribute("data-resultado");
    if (tipo === "acerto") cel.style.setProperty("background-color", Estado.corGreen, "important");
    else if (tipo === "erro") cel.style.setProperty("background-color", Estado.corRed, "important");
  });
}


function garantirPainelCores() {
  if (document.getElementById("painel-cores")) return;
  const el = document.createElement("div"); el.id = "painel-cores";
  el.innerHTML = `
    <label>Cor Green<input type="color" id="input-cor-green" value="${Estado.corGreen}"></label>
    <label>Cor Red<input type="color" id="input-cor-red" value="${Estado.corRed}"></label>
    <button class="btn-aplicar-cores" id="btn-aplicar-cores">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
      Aplicar
    </button>
    <button class="btn-reset-cores" id="btn-reset-cores">${SVG_ICONS.reset} Resetar padrão</button>
  `;
  el.querySelector("#input-cor-green").addEventListener("input", e => { Estado.corGreen = e.target.value; Estado.salvar(); });
  el.querySelector("#input-cor-red").addEventListener("input", e => { Estado.corRed = e.target.value; Estado.salvar(); });
  el.querySelector("#btn-aplicar-cores").addEventListener("click", () => { aplicarCoresCelulas(); showToast("Cores aplicadas!"); });
  el.querySelector("#btn-reset-cores").addEventListener("click", () => {
    Estado.corGreen = COR_GREEN_PADRAO; Estado.corRed = COR_RED_PADRAO; Estado.salvar();
    el.querySelector("#input-cor-green").value = COR_GREEN_PADRAO;
    el.querySelector("#input-cor-red").value   = COR_RED_PADRAO;
    aplicarCoresCelulas(); showToast("Cores resetadas para o padrão");
  });
  const tabela = document.getElementById("tabelaResultados");
  if (tabela && tabela.parentNode) tabela.parentNode.insertBefore(el, tabela.nextSibling);
  else document.body.appendChild(el);
}

function sincronizarPainelCores() {
  const ig = document.getElementById("input-cor-green");
  const ir = document.getElementById("input-cor-red");
  if (ig) ig.value = Estado.corGreen;
  if (ir) ir.value = Estado.corRed;
  aplicarCoresCelulas();
}

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
    });
  });
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


  const colOrd=[...Estado.colunasSelecionadas].sort((a,b)=>minutosFixos.indexOf(a)-minutosFixos.indexOf(b));
  let gT=0, rT=0;
  document.querySelectorAll("#tabelaResultados tbody tr").forEach(row=>{
    let temGreen=false, temRed=false, todasComResultado=true;
    colOrd.forEach(min=>{
      const colIdx=minutosFixos.indexOf(min); if(colIdx===-1) return;
      const cell=row.cells[1+colIdx]; if(!cell) { todasComResultado=false; return; }

      const placarReal=cell.querySelector(".placar:not(.placar-futuro)");
      if(!placarReal) { todasComResultado=false; return; }
      const tipo=cell.getAttribute("data-resultado");
      if(tipo==="acerto") temGreen=true;
      else if(tipo==="erro") temRed=true;
    });

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


function showErrorMessage(m){const e=document.getElementById("errorMessage");if(!e)return;e.textContent=m;e.style.display="block";}
function hideErrorMessage(){const e=document.getElementById("errorMessage");if(!e)return;e.textContent="";e.style.display="none";}
function normalizeString(s){if(!s)return"";return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function formatDateToDDMMYYYY(d){if(d.includes("T")){const dt=new Date(d);return`${dt.getUTCDate().toString().padStart(2,"0")}/${(dt.getUTCMonth()+1).toString().padStart(2,"0")}/${dt.getUTCFullYear()}`;}const[dd,mm,yy]=d.split("/");return`${dd.padStart(2,"0")}/${mm.padStart(2,"0")}/${yy}`;}
const _dateStrCache = new Map();
function getDateStr(d){
  let r = _dateStrCache.get(d);
  if (r !== undefined) return r;
  if (d.includes("T")) r = new Date(d).toISOString().split("T")[0];
  else { const [dd,mm,yy] = d.split("/"); r = `${yy}-${mm}-${dd}`; }
  if (_dateStrCache.size > 20000) _dateStrCache.clear();
  _dateStrCache.set(d, r);
  return r;
}
function normalizarHorario(h,m){const c=minutosFixos.reduce((p,x)=>Math.abs(x-m)<Math.abs(p-m)?x:p);return`${h.toString().padStart(2,"0")}:${c.toString().padStart(2,"0")}`;}
function normalizarHorarioStr(h){if(!h)return h;const[hr,mn]=h.split(":").map(Number);return normalizarHorario(hr,mn);}
function abbreviateTeamName(n){if(!n)return"";const w=n.trim().split(" ");if(w.length>1)return w.map(x=>x.charAt(0).toUpperCase()).join("")+w[w.length-1].slice(0,3).toLowerCase();return n.length>5?n.slice(0,5).toUpperCase():n.toUpperCase();}


// Só reconstrói o índice quando o array de odds realmente mudou (mesma referência = mesmo índice)
let _oddsIdxMemo = { src: null, idx: null };
function indexarOddsMemo(oddsData) {
  if (_oddsIdxMemo.idx && _oddsIdxMemo.src === oddsData) return _oddsIdxMemo.idx;
  const idx = indexarOdds(oddsData || []);
  _oddsIdxMemo = { src: oddsData, idx };
  return idx;
}

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



const FETCH_TIMEOUT_MS = 8000;
const FETCH_TIMEOUT_ODDS_MS = 20000; // odds rodam em segundo plano: podem demorar mais sem travar a tabela

// Guarda o último texto recebido de cada recurso. Se o servidor devolver exatamente o mesmo conteúdo,
// reaproveita o JSON já interpretado (mesma referência) e evita parse, hash, índice de odds e re-render.
const _memoFetch = Object.create(null);

async function fetchJsonComTimeout(url, nome, ms = FETCH_TIMEOUT_MS, usarMemo = true) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error(`Erro HTTP ${res.status} em ${nome}`);
    const texto = await res.text();
    const m = usarMemo ? _memoFetch[nome] : null;
    if (m && m.texto === texto) return m.json;
    const json = JSON.parse(texto);
    if (usarMemo) _memoFetch[nome] = { texto, json };
    return json;
  } catch (e) {
    if (e && e.name === "AbortError") throw new Error(`Tempo esgotado (${ms / 1000}s) em ${nome}`);
    throw e;
  } finally {
    clearTimeout(t);
  }
}

// Quantidade de horas que o servidor precisa devolver (Infinity = histórico completo, sem parâmetro)
function _qsHoras(horas) {
  return (Number.isFinite(horas) && horas > 0) ? `&horas=${Math.ceil(horas)}` : "";
}

// O nome do memo inclui a liga: assim ligas diferentes nunca se misturam nem "brigam" pelo mesmo cache.
// `liga` e `usarMemo` existem para o pré-carregamento das outras ligas (usarMemo=false não guarda texto na memória).
async function fetchResultados(horas, liga = LIGA_ATUAL, usarMemo = true) {
  return fetchJsonComTimeout(ROTAS_API.resultados(liga) + `?timestamp=${Date.now()}` + _qsHoras(horas), "resultados:" + liga, FETCH_TIMEOUT_MS, usarMemo);
}

async function fetchOdds(horas, liga = LIGA_ATUAL, usarMemo = true) {
  try {
    return await fetchJsonComTimeout(ROTAS_API.odds(liga) + `?timestamp=${Date.now()}` + _qsHoras(horas), "odds:" + liga, FETCH_TIMEOUT_ODDS_MS, usarMemo);
  } catch(e) {
    console.error("Erro odds:", e);
    return null;
  }
}

const _proxMemo = new Map();
async function fetchProximosJogos(liga = LIGA_ATUAL, usarMemo = true) {
  try {
    const j = await fetchJsonComTimeout(ROTAS_API.proximosJogos(liga) + `?timestamp=${Date.now()}`, "proximosJogos:" + liga, FETCH_TIMEOUT_MS, usarMemo);
    const m = usarMemo ? _proxMemo.get(liga) : null;
    if (m && m.src === j) return m.out;
    const out = j.slice().sort((a,b) => new Date(a.start_time) - new Date(b.start_time)).slice(0, 10);
    if (usarMemo) _proxMemo.set(liga, { src: j, out });
    return out;
  } catch(e) {
    console.error("Erro próximos:", e);
    return null;
  }
}


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


function createIconTh(svgKey, title) {
  const th = document.createElement("th"); th.title = title||"";
  const wrap = document.createElement("span"); wrap.className = "th-icon";
  wrap.innerHTML = SVG_ICONS[svgKey]||""; th.appendChild(wrap); return th;
}


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

      if (typeof htA !== "number" || typeof htB !== "number") return false;

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


function criarTabela(dados, oddsData, proximosJogos) {
  criarOuObterPainel();



  const tabela = document.getElementById("tabelaResultados");
  const tabelaBody = tabela.querySelector("tbody");
  let thead = tabela.querySelector("thead");
  if (!thead) { thead = document.createElement("thead"); tabela.insertBefore(thead, tabelaBody); }


  thead.innerHTML = "";

  const trGolsColuna = document.createElement("tr"); trGolsColuna.id="linhaGolsColuna";
  trGolsColuna.appendChild(createIconTh("ball","Gols por coluna (total / média)"));

  const trDadosColuna = document.createElement("tr"); trDadosColuna.id="linhaDadosColuna";
  trDadosColuna.appendChild(createIconTh("chart","Dados por coluna (% acerto / quantidade)"));

  thead.append(trGolsColuna, trDadosColuna);

  const trMinutos = document.createElement("tr");

  const thHora = document.createElement("th"); thHora.title="Hora";
  const wrapH = document.createElement("span"); wrapH.className="th-icon"; wrapH.innerHTML=SVG_ICONS["clock"]||"";
  thHora.appendChild(wrapH); thHora.style.cssText="width:26px;min-width:26px;";
  trMinutos.appendChild(thHora);

  const tamanhoBlocoHeader = _tamanhoBlocoQD();
  minutosFixos.forEach((m, i) => {
    const th = document.createElement("th"); th.className="minute-header";
    th.innerHTML = `${m}<span class="jogo-num">&nbsp;·${String(i+1).padStart(2,"0")}</span>`;
    const qIdx = Math.floor(i/tamanhoBlocoHeader) % 4;
    th.classList.add(`qd-${qIdx}`);
    if (Estado.colunasSelecionadas.includes(m)) th.classList.add("coluna-selecionada");
    th.addEventListener("click", ()=>toggleColuna(m));
    trMinutos.appendChild(th);
  });

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
  const oddsIndex    = indexarOddsMemo(oddsData);

  dados.sort((a,b)=>tsJogo(b)-tsJogo(a));

  const proximosComHoras = proximosJogos.map(j=>{
    const[h,mn]=j.time.split(":").map(Number);
    const closest=minutosFixos.reduce((p,c)=>Math.abs(c-mn)<Math.abs(p-mn)?c:p);
    return{...j,date:new Date(j.start_time),hora:h,minuto:closest,team_visitante:j.team_visit};
  }).sort((a,b)=>new Date(b.start_time)-new Date(a.start_time));


  const horasFuturasSet=new Set();
  proximosComHoras.forEach(j=>{
    const ds=j.captured_date?j.captured_date.split("/").reverse().join("-"):j.date.toISOString().split("T")[0];
    horasFuturasSet.add(JSON.stringify({hora:j.hora,timestamp:new Date(`${ds}T${j.hora.toString().padStart(2,"0")}:00:00`).getTime(),data:ds}));
  });

  const horasDadosMap=new Map();
  dados.forEach(d=>{
    const ds=getDateStr(d.data), k=ds+"-"+d.hora;
    if(horasDadosMap.has(k)) return;
    horasDadosMap.set(k,{hora:d.hora,timestamp:new Date(`${ds}T${d.hora.toString().padStart(2,"0")}:00:00`).getTime(),data:ds});
  });
  const horasDadosLimitadas=Array.from(horasDadosMap.values()).sort((a,b)=>b.timestamp-a.timestamp).slice(0,horasSel);

  const chavesDados=new Set(horasDadosLimitadas.map(h=>`${h.data}-${h.hora}`));
  const horasFuturasFiltradas=Array.from(horasFuturasSet).map(s=>JSON.parse(s)).filter(h=>!chavesDados.has(`${h.data}-${h.hora}`));
  const horasUnicas=[...horasFuturasFiltradas,...horasDadosLimitadas].sort((a,b)=>b.timestamp-a.timestamp);
  const mapeamentoChaveLinha={};

  horasUnicas.forEach(item=>{
    const chave=`${item.data}-${item.hora}`;
    const tr=document.createElement("tr"); tr.setAttribute("data-chave",chave);
    const tdHora=document.createElement("td"); tdHora.style.cssText="text-align:center;white-space:nowrap;padding:2px 1px;";
    const cb=document.createElement("input"); cb.type="checkbox"; cb.className="row-selector"; cb.checked=Estado.selectedChaves.includes(chave);
    cb.style.cssText="display:block;margin:0 auto 1px auto;width:11px;height:11px;cursor:pointer;accent-color:#157f93;";
    cb.addEventListener("change",function(){
      if(this.checked){if(!Estado.selectedChaves.includes(chave))Estado.selectedChaves.push(chave);}
      else{Estado.selectedChaves=Estado.selectedChaves.filter(c=>c!==chave);}
      Estado.salvar();updateSelectedRows();
    });
    const horaSpan=document.createElement("span"); horaSpan.textContent=item.hora.toString().padStart(2,"0"); horaSpan.style.cssText="font-size:0.78em;font-weight:700;color:#e5e7eb;";
    tdHora.appendChild(cb); tdHora.appendChild(horaSpan);
    tr.appendChild(tdHora);
    minutosFixos.forEach((m,i)=>{
      const td=document.createElement("td");
      const qIdx=Math.floor(i/tamanhoBlocoHeader) % 4;
      td.classList.add(`qd-cell-${qIdx}`);
      if(Estado.colunasSelecionadas.includes(m)) td.classList.add("coluna-selecionada");
      tr.appendChild(td);
    });
    const tdGols = Object.assign(document.createElement("td"),{textContent:"0",className:"col-combo"});
    const tdDados = Object.assign(document.createElement("td"),{textContent:"0",className:"col-combo"});
    tr.appendChild(tdGols); tr.appendChild(tdDados);
    tabelaBody.appendChild(tr);
    mapeamentoChaveLinha[chave]=tr;
  });


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


  const totalGolsPorColuna    = Array(minutosFixos.length).fill(0);
  const totalAcertosPorColuna = Array(minutosFixos.length).fill(0);
  const processedMatches      = new Set();


  const resPorColuna = minutosFixos.map(() => []);
  const tsPorChave = {};
  horasUnicas.forEach(h => { tsPorChave[`${h.data}-${h.hora}`] = h.timestamp; });

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
    if(mostrarHT) html+=`<span class="ht-span">${secondary}</span>`;
    if(mostrarTimes) html+=`<span class="time-fora" style="cursor:pointer" data-full-time="${dado.time_b}">${abbreviateTeamName(dado.time_b)}</span>`;
    placarTexto.innerHTML=html;
    placar.appendChild(placarTexto);

    const oddsMatch=findOddsNoIndex(oddsIndex,dado);
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

    const oddNum = parseFloat(String(oddTip).replace(",", "."));
    resPorColuna[idx].push({ chave, ts: tsPorChave[chave] || 0, acerto: !!acerto, odd: (isFinite(oddNum) && oddNum > 1) ? oddNum : null });

    cel.setAttribute("data-resultado", acerto ? "acerto" : "erro");
    cel.style.setProperty("background-color", acerto ? Estado.corGreen : Estado.corRed, "important");
    aplicarDestaquesMercadosExtras(cel, rA, rB, htA, htB);

    if(acerto){linha.children[linha.children.length-1].textContent=parseInt(linha.children[linha.children.length-1].textContent)+1;totalAcertosPorColuna[idx]++;}
    linha.children[linha.children.length-2].textContent=parseInt(linha.children[linha.children.length-2].textContent)+tg;
    totalGolsPorColuna[idx]+=tg;
  });


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


  const todasLinhasFooter=Array.from(tabelaBody.querySelectorAll("tr"));
  const totMercadoCol=Array(minutosFixos.length).fill(0);
  todasLinhasFooter.forEach(row=>{Array.from(row.cells).slice(1,-2).forEach((c,i)=>{if(c.querySelector(".placar")&&!c.querySelector(".placar-futuro"))totMercadoCol[i]++;});});


  totalGolsPorColuna.forEach((t,i)=>{
    const tot=totMercadoCol[i];
    const media=tot>0?(t/tot).toFixed(1):"0.0";
    const cell=document.createElement("td"); cell.className="col-combo-top";
    cell.innerHTML=`<span class="valor-principal">${t}</span><span class="valor-sub">${media}</span>`;
    trGolsColuna.appendChild(cell);
  });

  totMercadoCol.forEach((tot,i)=>{
    const acertosCol=totalAcertosPorColuna[i];
    const pct=tot>0?Math.floor((acertosCol/tot)*100):0;
    const cell=document.createElement("td"); cell.className=`col-combo-top ${getClassePct(pct)}`;
    cell.innerHTML=`<span class="valor-principal">${pct}%</span><span class="valor-sub">${acertosCol}</span>`;
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
    tdDadosRow.innerHTML=`<span class="valor-principal">${pct}%</span><span class="valor-sub">${acertos}</span>`;
  });

  criarOuObterPainel(); aplicarHighlights(); updateSelectedRows(); aplicarColunaHighlights(); atualizarColunaStats();
  garantirPainelCores(); sincronizarPainelCores();


  let tfoot = tabela.querySelector("tfoot");
  if (!tfoot) { tfoot = document.createElement("tfoot"); tabela.appendChild(tfoot); }
  tfoot.innerHTML = "";
  const trFootMinutos = document.createElement("tr");
  const thFootHora = document.createElement("th"); thFootHora.style.cssText="width:26px;min-width:26px;text-align:center;font-size:0.7em;color:#9ca3af;padding:2px;";
  thFootHora.innerHTML=SVG_ICONS["clock"]||""; trFootMinutos.appendChild(thFootHora);
  const tamanhoBlocoFooter=_tamanhoBlocoQD();
  minutosFixos.forEach((m,i)=>{
    const th=document.createElement("th"); th.className="minute-header";
    th.innerHTML = `${m}<span class="jogo-num">&nbsp;·${String(i+1).padStart(2,"0")}</span>`;
    const qIdx=Math.floor(i/tamanhoBlocoFooter) % 4; th.classList.add(`qd-${qIdx}`);
    if(Estado.colunasSelecionadas.includes(m)) th.classList.add("coluna-selecionada");
    th.addEventListener("click",()=>toggleColuna(m));
    trFootMinutos.appendChild(th);
  });
  const thFG=document.createElement("th"); thFG.id="th-foot-gols"; thFG.classList.add("col-combo"); thFG.innerHTML=SVG_ICONS["ball"]||""; trFootMinutos.appendChild(thFG);
  const thFD=document.createElement("th"); thFD.id="th-foot-dados"; thFD.classList.add("col-combo"); thFD.innerHTML=SVG_ICONS["chart"]||""; trFootMinutos.appendChild(thFD);
  tfoot.appendChild(trFootMinutos);










}


let _cacheOddsData = [];
let _cacheProximosJogos = [];
let _cacheResultados = [];
let _renderizandoRapido = false; 

let _versaoBusca = 0;
let _falhasResultadosSeguidas = 0;
const FALHAS_ATE_AVISAR = 5; 


var _ultimaAssinaturaRender = null;
let _ultimoRenderEm = 0;
const RENDER_FORCA_A_CADA_MS = 60000; 

const _CHAVES_RENDER_RE = /^(corGreen|corRed|corDestaqueExtra|placarSelecionados)$|^(placarFTSelecionados|placarHTSelecionados|timesSelecionados|oddsSelecionadas|mercadosExtras|selectedChaves|colunasSelecionadas|seletorHoras)/;

function _fnvNum(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const _hashMemo = new WeakMap();
function _hashLista(arr) {
  if (!arr || !arr.length) return "0";
  const m = _hashMemo.get(arr);
  if (m && m.len === arr.length) return m.h;
  const h = _hashListaCalc(arr);
  _hashMemo.set(arr, { len: arr.length, h });
  return h;
}
function _hashListaCalc(arr) {
  if (!arr || !arr.length) return "0";
  try {
    let soma = 0, mistura = 0;
    for (let i = 0; i < arr.length; i++) {
      const h = _fnvNum(JSON.stringify(arr[i]));
      soma = (soma + h) >>> 0;
      mistura = (mistura ^ Math.imul(h, 2654435761)) >>> 0;
    }
    return arr.length + "_" + soma.toString(36) + "_" + mistura.toString(36);
  } catch (e) { return "x" + Date.now(); }
}
function _assinaturaUI() {
  let sels = "";
  document.querySelectorAll("select").forEach(el => { sels += (el.id || el.name || "") + "=" + el.value + ","; });
  let ls = "";
  try {
    const ks = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (_CHAVES_RENDER_RE.test(k)) ks.push(k);
    }
    ks.sort();
    ls = ks.map(k => k + "=" + String(localStorage.getItem(k)).slice(0, 2000)).join("|");
  } catch (e) { ls = "x" + Date.now(); }
  const est = JSON.stringify([
    Estado.placarFTSelecionados, Estado.placarHTSelecionados, Estado.timesSelecionados,
    Estado.oddsSelecionadas, Estado.mercadosExtras, Estado.colunasSelecionadas, Estado.selectedChaves,
    Estado.corGreen, Estado.corRed, Estado.corDestaqueExtra
  ]);
  const d = new Date();
  const agora = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
  return [getLigaKey(), sels, ls, est, minutosFixos.join(","), agora].join("§");
}

function renderizarTabelaSeMudou(dados, odds, proximos, forcar) {
  const sig = _hashLista(dados) + "§" + _hashLista(odds) + "§" + _hashLista(proximos) + "§" + _assinaturaUI();
  const temConteudo = !!document.querySelector("#tabelaResultados tbody tr");
  const vencido = (Date.now() - _ultimoRenderEm) > RENDER_FORCA_A_CADA_MS;
  if (!forcar && temConteudo && !vencido && sig === _ultimaAssinaturaRender) return false;
  criarTabela(dados, odds, proximos);
  _ultimaAssinaturaRender = sig;
  _ultimoRenderEm = Date.now();
  return true;
}

// ── Quantas horas de histórico a tela realmente precisa ──
function horasNecessarias() {
  const sel = parseInt(document.querySelector("#seletorHoras")?.value, 10) || 12;
  return sel + 2; // margem: hora atual e jogos futuros
}

let _cacheHoras = 0;      // horas cobertas pelos resultados em cache
let _cacheHorasOdds = 0;  // horas cobertas pelas odds em cache
let _oddsUltimaBusca = 0;
let _oddsEmVoo = false;
let _proxEmVoo = false;
let _pProxAtual = Promise.resolve();
let _renderTimer = null;
const ODDS_INTERVALO_MS = 6000; // odds mudam pouco: não precisam ser baixadas a cada 3s

// ── Cache local por liga ──
// Resultados, odds e próximos jogos são guardados SEPARADOS (localStorage), cada um assim que chega.
// Antes era um único pacote gravado no máximo a cada 20s, geralmente no primeiro render (ainda sem odds/próximos),
// por isso ao voltar numa liga a tabela vinha sem odds e sem próximos confrontos.
const CACHE_LOCAL_PREFIXO = "dvcache2_";
const CACHE_LOCAL_VALIDADE_MS = 30 * 60 * 1000;
const CACHE_LOCAL_MAX_CHARS = 2500000;

function ligaKeyDe(nome) { return String(nome).trim().toLowerCase().replace(/\s+/g, "_"); }
function _cacheChave(lk, tipo) { return `${CACHE_LOCAL_PREFIXO}${lk}|${tipo}`; }

function limparCacheLocal(manter) {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_LOCAL_PREFIXO) && k !== manter)
      .forEach(k => localStorage.removeItem(k));
  } catch (e) {}
}

function cacheGravar(lk, tipo, dados, horas) {
  try {
    if (!Array.isArray(dados) || !dados.length) return;
    const chave = _cacheChave(lk, tipo);
    const txt = JSON.stringify({ t: Date.now(), h: Number.isFinite(horas) ? horas : -1, d: dados });
    if (txt.length > CACHE_LOCAL_MAX_CHARS) { localStorage.removeItem(chave); return; }
    try { localStorage.setItem(chave, txt); }
    catch (e) { limparCacheLocal(chave); try { localStorage.setItem(chave, txt); } catch (e2) {} }
  } catch (e) {}
}

// Só regrava quando o array é outro (o servidor devolvendo o mesmo texto reaproveita a mesma referência)
const _cacheGravadoRef = Object.create(null);
function cacheGravarSeMudou(lk, tipo, dados, horas) {
  if (!Array.isArray(dados) || !dados.length) return;
  const k = lk + "|" + tipo;
  if (_cacheGravadoRef[k] === dados) return;
  _cacheGravadoRef[k] = dados;
  setTimeout(() => cacheGravar(lk, tipo, dados, horas), 0);
}

function cacheLer(lk, tipo) {
  try {
    const raw = localStorage.getItem(_cacheChave(lk, tipo));
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || !Array.isArray(c.d) || (Date.now() - c.t) > CACHE_LOCAL_VALIDADE_MS) return null;
    return { dados: c.d, horas: c.h === -1 ? Infinity : (c.h || 0) };
  } catch (e) { return null; }
}

// Jogos futuros que já passaram do horário não podem aparecer como "próximo confronto"
function _proxAindaValidos(lista) {
  const limite = Date.now() - 60000;
  return (lista || []).filter(j => !(new Date(j.start_time).getTime() < limite));
}

// Memória da sessão: trocar de liga e voltar (sem recarregar a página) é instantâneo
const _ligaStore = new Map();
function guardarLigaNoStore(lk) {
  if (!lk || !_cacheResultados.length) return;
  _ligaStore.set(lk, {
    res: _cacheResultados, odds: _cacheOddsData, prox: _cacheProximosJogos,
    horas: _cacheHoras, horasOdds: _cacheHorasOdds
  });
}

// Preenche as variáveis _cache* da liga a partir da memória ou do localStorage. Não renderiza.
function carregarDadosDaLiga(lk) {
  const s = _ligaStore.get(lk);
  if (s) {
    _cacheResultados = s.res; _cacheOddsData = s.odds; _cacheProximosJogos = _proxAindaValidos(s.prox);
    _cacheHoras = s.horas; _cacheHorasOdds = s.horasOdds;
    _oddsUltimaBusca = 0;
    return _cacheResultados.length > 0;
  }
  const r = cacheLer(lk, "res");
  if (!r) return false;
  const o = cacheLer(lk, "odds"), p = cacheLer(lk, "prox");
  _cacheResultados = r.dados; _cacheHoras = r.horas;
  _cacheOddsData = o ? o.dados : []; _cacheHorasOdds = o ? o.horas : 0;
  _cacheProximosJogos = p ? _proxAindaValidos(p.dados) : [];
  _oddsUltimaBusca = 0;
  return true;
}

function hidratarDoCacheLocal() {
  try {
    const lk = getLigaKey();
    if (!carregarDadosDaLiga(lk)) return false;
    Estado._ultimaLigaRenderizada = lk;
    restaurarHorasSeletor();
    renderizarTabelaSeMudou(_cacheResultados, _cacheOddsData, _cacheProximosJogos, true);
    return true;
  } catch (e) {
    console.warn("Cache local ignorado:", e);
    return false;
  }
}

// ── Pré-carregamento das outras ligas da mesma casa ──
// Em segundo plano, baixa resultados + odds + próximos das ligas "irmãs" e grava no cache.
// Quando o usuário troca de liga, a tabela já abre completa (com odds e próximos) e só atualiza depois.
// Se os nomes aceitos pela API forem outros, defina window.PRELOAD_LIGAS = ["nome1","nome2"] antes deste script.
const PRELOAD_INTERVALO_MS = 8 * 60 * 1000; // cada liga é renovada no máximo a cada 8 min
const PRELOAD_HORAS_MAX = 48;
let _preloadEmAndamento = false;

function _casaDaLiga(nome) {
  if (typeof LIGAS_INFO !== "undefined" && LIGAS_INFO[nome]) return LIGAS_INFO[nome].casa;
  const p = String(nome).split(" ")[0];
  return ["1win", "BetGreen", "Kiron"].includes(p) ? p : "Estrelabet";
}

function ligasParaPrecarregar() {
  if (typeof LIGA_ATUAL === "undefined" || !LIGA_ATUAL) return [];
  if (Array.isArray(window.PRELOAD_LIGAS)) return window.PRELOAD_LIGAS.filter(n => n !== LIGA_ATUAL);
  const casa = _casaDaLiga(LIGA_ATUAL);
  return Object.keys(MINUTOS_POR_LIGA).filter(n => n !== LIGA_ATUAL && _casaDaLiga(n) === casa);
}

// A troca de liga é uma navegação de página: o "quando foi pré-carregada" precisa sobreviver entre páginas.
function _preloadQuando(lk) { return parseInt(localStorage.getItem("dvpreload_" + lk), 10) || 0; }
function _preloadMarcar(lk) { try { localStorage.setItem("dvpreload_" + lk, String(Date.now())); } catch (e) {} }

// Uma liga por chamada (a mais "velha" primeiro): custo constante no servidor, mesmo com 9 ligas irmãs.
// Dentro do split.html (?res=...) cada liga irmã já é um iframe com seus próprios dados:
// pré-carregar as irmãs em cada iframe só duplica requisições e gravações no localStorage.
function _modoSplit() {
  try { return !!window.frameElement && /[?&]res=/.test(location.search); } catch (e) { return false; }
}

async function precarregarLigasIrmas() {
  if (_modoSplit()) return;
  if (_preloadEmAndamento || !_tabVisibleTabela || !_cacheResultados.length) return;
  const agora = Date.now();
  const liga = ligasParaPrecarregar()
    .filter(n => {
      const lk = ligaKeyDe(n);
      return (agora - _preloadQuando(lk)) >= PRELOAD_INTERVALO_MS || localStorage.getItem(_cacheChave(lk, "res")) === null;
    })
    .sort((a, b) => _preloadQuando(ligaKeyDe(a)) - _preloadQuando(ligaKeyDe(b)))[0];
  if (!liga) return;

  _preloadEmAndamento = true;
  try {
    const lk = ligaKeyDe(liga);
    _preloadMarcar(lk);
    const horasPedido = Math.min(horasNecessarias(), PRELOAD_HORAS_MAX);
    const [d, o, p] = await Promise.all([
      fetchResultados(horasPedido, liga, false).catch(() => null),
      fetchOdds(horasPedido, liga, false),
      fetchProximosJogos(liga, false)
    ]);
    if (Array.isArray(d) && d.length) {
      cacheGravar(lk, "res", d, horasPedido);
      if (Array.isArray(o) && o.length) cacheGravar(lk, "odds", o, horasPedido);
      if (Array.isArray(p) && p.length) cacheGravar(lk, "prox", p, 0);
    }
  } catch (e) {
    console.warn("Pré-carregamento falhou:", e);
  } finally {
    _preloadEmAndamento = false;
  }
}

// Junta num único render as respostas que chegam quase juntas (resultados, odds, próximos)
function agendarRender() {
  if (_renderTimer) return;
  _renderTimer = setTimeout(() => {
    _renderTimer = null;
    if (_cacheResultados.length === 0 && _cacheProximosJogos.length === 0) return;
    try {
      renderizarTabelaSeMudou(_cacheResultados, _cacheOddsData, _cacheProximosJogos, false);
    } catch (e) { console.error("Erro ao renderizar tabela:", e); }
  }, 30);
}

async function buscarDados() {
  const minhaVersao = ++_versaoBusca;
  hideErrorMessage();
  restaurarHorasSeletor();
  const ligaAtual = getLigaKey();
  Estado.recarregarChaves();
  if (Estado._ultimaLigaRenderizada !== ligaAtual) {
    guardarLigaNoStore(Estado._ultimaLigaRenderizada); // memória da liga que está saindo
    Estado.forcarRerender();
    Estado._ultimaLigaRenderizada = ligaAtual;
    _ultimaLigaHorasRestauradas = null;

    _cacheResultados = []; _cacheOddsData = []; _cacheProximosJogos = [];
    _cacheHoras = 0; _cacheHorasOdds = 0; _oddsUltimaBusca = 0;
    Estado.carregar();


    // Liga que já foi vista (ou pré-carregada): pinta na hora com resultados + odds + próximos
    if (carregarDadosDaLiga(ligaAtual)) {
      try {
        restaurarHorasSeletor();
        renderizarTabelaSeMudou(_cacheResultados, _cacheOddsData, _cacheProximosJogos, true);
      } catch (e) { console.error("Erro ao pintar liga do cache:", e); }
    }
  }

  const horas = horasNecessarias();

  // Troca de mercado/seletor: redesenha com o que já está em memória (sem esperar rede)
  if (_renderizandoRapido && _cacheResultados.length > 0) {
    _renderizandoRapido = false;
    renderizarTabelaSeMudou(_cacheResultados, _cacheOddsData, _cacheProximosJogos, true);
    if (horas <= _cacheHoras) return; // o cache já cobre o que foi pedido
  }
  _renderizandoRapido = false;

  const ligaNaoMudou = () => Estado._ultimaLigaRenderizada === ligaAtual;
  const agora = Date.now();

  // Os três pedidos saem juntos e cada um atualiza a tela assim que chega,
  // sem um esperar o outro (antes as odds só apareciam depois de odds E próximos).
  const pRes = fetchResultados(horas).then(d => {
    if (!ligaNaoMudou()) return;
    _falhasResultadosSeguidas = 0;
    if (d.length > 0) { _cacheResultados = d; _cacheHoras = horas; cacheGravarSeMudou(ligaAtual, "res", d, horas); }
    agendarRender();
  }).catch(e => {
    _falhasResultadosSeguidas++;
    console.warn("Falha ao buscar resultados (tentando de novo):", e.message);
    if (_cacheResultados.length === 0 || _falhasResultadosSeguidas >= FALHAS_ATE_AVISAR) {
      showErrorMessage(`Erro ao carregar resultados: ${e.message}`);
    }
  });

  if (!_proxEmVoo) {
    _proxEmVoo = true;
    _pProxAtual = fetchProximosJogos().then(p => {
      if (p !== null && ligaNaoMudou()) { _cacheProximosJogos = p; cacheGravarSeMudou(ligaAtual, "prox", p, 0); }
    }).finally(() => { _proxEmVoo = false; agendarRender(); });
  }

  const precisaOdds = _cacheOddsData.length === 0 || horas > _cacheHorasOdds || (agora - _oddsUltimaBusca) >= ODDS_INTERVALO_MS;
  if (!_oddsEmVoo && precisaOdds) {
    _oddsEmVoo = true;
    _oddsUltimaBusca = agora;
    fetchOdds(horas).then(o => {
      if (o !== null && ligaNaoMudou()) { _cacheOddsData = o; _cacheHorasOdds = horas; cacheGravarSeMudou(ligaAtual, "odds", o, horas); }
    }).finally(() => { _oddsEmVoo = false; agendarRender(); });
  }

  // O ciclo só espera os resultados; odds e próximos continuam em segundo plano
  await pRes;
  if (minhaVersao !== _versaoBusca) return;

  if (_cacheResultados.length === 0 && _cacheProximosJogos.length === 0) {
    await _pProxAtual;
    if (minhaVersao !== _versaoBusca) return;
    if (_cacheResultados.length === 0 && _cacheProximosJogos.length === 0) showErrorMessage("Nenhum dado disponível.");
  }
}


let _tabVisibleTabela = !document.hidden;
let _buscando = false;
let _buscandoDesde = 0;
const BUSCA_TRAVA_MAX_MS = 15000; 
async function _buscarDadosSeguro() {
  if (!_tabVisibleTabela) return;
  if (_buscando && (Date.now() - _buscandoDesde) < BUSCA_TRAVA_MAX_MS) return;
  _buscando = true;
  _buscandoDesde = Date.now();
  try { await buscarDados(); }
  catch (e) { console.error("Erro no ciclo de busca:", e); }
  finally { _buscando = false; }
}
let _naTelaTabela = true;
document.addEventListener('visibilitychange', () => {
  _tabVisibleTabela = !document.hidden && _naTelaTabela;
  if (_tabVisibleTabela) _buscarDadosSeguro();
});

// No split.html há várias ligas empilhadas: as que estão fora da tela param de buscar dados
// a cada 3s e voltam a atualizar assim que entram (de novo) na área visível.
if (_modoSplit() && "IntersectionObserver" in window) {
  new IntersectionObserver((entradas) => {
    const visivel = entradas[entradas.length - 1].isIntersecting;
    if (visivel === _naTelaTabela) return;
    _naTelaTabela = visivel;
    _tabVisibleTabela = !document.hidden && visivel;
    if (_tabVisibleTabela) _buscarDadosSeguro();
  }, { rootMargin: "300px 0px" }).observe(document.body);
}

hidratarDoCacheLocal();
buscarDados();
setTimeout(precarregarLigasIrmas, 4000);
setInterval(precarregarLigasIrmas, 15000);
setInterval(_buscarDadosSeguro, 3000);


const _sh=document.querySelector("#seletorHoras");
const _sr=document.querySelector("#seletorResultado");
const _stp=document.querySelector("#seletorTipoPlacar");
const _mt=document.querySelector("#mostrarTimes");
const _mht=document.querySelector("#mostrarHT");
const _mo=document.querySelector("#mostrarOdds");


if(_sh)  _sh.addEventListener("change", ()=>{ 
  localStorage.setItem(Estado._horasKey(), _sh.value); 
  renderizarRapido(); 
});

if(_sr)  _sr.addEventListener("change", ()=>{ 
  renderizarRapido();

});

if(_stp) _stp.addEventListener("change",()=>{ 
  renderizarRapido(); 
});


function renderizarRapido() {
  if (_cacheResultados.length > 0) {
    _renderizandoRapido = true; 
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


function sincronizarEstiloBtnMercadosExtras() {
  const btn = document.getElementById("btnMercadosExtras");

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

    corInput.addEventListener("input", () => {
      Estado.corDestaqueExtra = corInput.value;
      aplicarCorDestaqueExtraGlobal();
    });

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