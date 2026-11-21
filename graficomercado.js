/* ═══════════════════════════════════════════════════════════════════
   GRÁFICO DE MERCADOS (graficomercado.js)
   ═══════════════════════════════════════════════════════════════════

   ÍNDICE (na ordem em que as partes aparecem no arquivo)
     1. Configuração e variáveis globais ... jogos/hora, chaves do localStorage, estado
     2. Mercados .......................... labelToKey, cores e grupos
     3. Setups ............................ salvar, aplicar, barra de chips, painel de linhas, modal
     4. Utilitários ....................... médias móveis, leitura do placar HT
     5. Plugins do Chart.js ............... rótulos, Fibonacci, linha atual, linhas/Fibonacci/tendências arrastáveis
     6. Gráfico ........................... createStatsChart, processApiData, updateCharts
     7. Controles e funções globais ....... selects, toggles, botões do HTML
     8. Inicialização ..................... window.onload e atualização a cada 3 s

   COMO FAZER AS MUDANÇAS MAIS COMUNS

   • Mudar jogos por hora / tamanho do bloco
       Defina BS_JOGOS_POR_HORA, BS_QD_BLOCO e BS_KEY_SUFIXO no HTML antes de carregar este arquivo.
       Sem elas o padrão é 20 jogos/hora (ver _JPH, _QBLOC, _KSUF no topo).

   • Adicionar um novo mercado (ex.: "Over 6+")
       1. labelToKey ......... "Over 6+": "over6"
       2. DATASET_COLORS ..... cor da linha
       3. MARKET_GROUPS ...... inclua o label no grupo certo (aparece no modal de setup)
       4. MARKET_DEFS ........ over6: g => g.tg > 5.5   (a regra do mercado; g tem f0, f1, tg, hp, htTotal, g2t, margem)
       (a média móvel curta/longa é gerada sozinha a partir de labelToKey)

   • Mudar a cor de um mercado ............ DATASET_COLORS (ou a cor escolhida dentro do setup)
   • Mudar limites de linhas desenhadas ... MAX_DRAG_LINES, MAX_DRAG_FIBS, MAX_DRAG_TRENDS
   • Mudar níveis do Fibonacci ............ FIB_RETR_LEVELS e FIB_COLORS
   • Mudar o intervalo de atualização ..... setInterval(updateCharts, 3000) no fim do arquivo

   OBSERVAÇÕES
   • Linhas manuais, Fibonacci livre e tendências são salvos por liga (_ligaKey).
   • Desempenho: só os mercados do setup ativo são calculados e viram linhas no gráfico; se a API
     devolver os mesmos dados e as configurações não mudaram, nada é recalculado nem redesenhado.
     Arrastar linhas/Fibonacci/tendências só redesenha (_redraw), sem recalcular o gráfico.
   ═══════════════════════════════════════════════════════════════════ */

// ── BetGreen (12 jogos/hora) ─────────────────────────────────────────────
// BS_JOGOS_POR_HORA / BS_QD_BLOCO / BS_KEY_SUFIXO vêm do template HTML (index.html da BetGreen).
// Em páginas que não definem essas constantes, tudo cai no padrão de 20 jogos/hora (sem mudança).
const _JPH = typeof BS_JOGOS_POR_HORA !== "undefined" ? BS_JOGOS_POR_HORA : 20; // jogos por hora
const _QBLOC = typeof BS_QD_BLOCO !== "undefined" ? BS_QD_BLOCO : 5; // jogos por quadrante
const _KSUF = typeof BS_KEY_SUFIXO !== "undefined" ? BS_KEY_SUFIXO : "";
const _MIN_POR_JOGO = 60 / _JPH; // 3 min (20 jogos/h) | 5 min (12 jogos/h)
const SETUPS_KEY = "mgraf:setups_v4" + _KSUF;
const ACTIVE_SETUP_KEY = "mgraf:activeSetup_v4" + _KSUF;
const VISIBLE_DS_KEY = "mgraf:visibleDatasets_v4";
const DRAG_LINES_KEY = "mgraf:draglines";
const DRAG_FIBS_KEY = "mgraf:dragfibs";
const DRAG_TRENDS_KEY = "mgraf:dragtrends";
const ACCORDION_KEY = "mgraf:accordionOpen";
const SETUP_LINE_TOGGLE_KEY = "mgraf:lineToggles_v4";
const Y_AXIS_POS_KEY = "mgraf:yAxisPosition";
const MAX_SETUPS = 10;
const MAX_DRAG_LINES = 6;
const MAX_DRAG_FIBS = 4;
const MAX_DRAG_TRENDS = 6;
const FIB_RETR_LEVELS = [0, 23.6, 38.2, 50, 61.8, 100];
const FIB_COLORS = ["#A78BFA", "#FBBF24", "#34D399", "#F472B6", "#60A5FA", "#FB923C"];

/* LTA = Linha de Tendência de Alta (suporte, ascendente) — verde
   LTB = Linha de Tendência de Baixa (resistência, descendente) — vermelho */
const TREND_COLORS = {
  LTA: "#34D399",
  LTB: "#F87171"
};

/* ───────────────────────────────────────────
   VARIÁVEIS GLOBAIS DE ESTADO
─────────────────────────────────────────── */
let numPoints = _JPH; // 1 hora
let averagePoints = _JPH - 1; // base = 1 hora (índice)
let showFibonacciLines = false;
let showMovingAverages = false;
let showLabels = false;
let yAxisPosition = _ls(Y_AXIS_POS_KEY, "left");
const leagues = ["Copa"];
const chartInstances = {};
let chartData = {};

/* Nome da liga atual — lido do elemento <h4 class="custom-color"> dentro de
   #resultDisplay, que toda página de liga possui com o nome da própria liga
   (ex: "Clássicos"). Não usamos a const `leagues` porque este mesmo arquivo
   grafico.js é compartilhado por todas as páginas, então `leagues[0]` não
   diferencia uma liga da outra — o h4 é o único identificador realmente
   único por página. */
function _ligaAtual() {
  if (typeof window.getLigaKey === "function") {
    try {
      const ligaKey = window.getLigaKey();

      if (ligaKey) {
        return ligaKey;
      }
    } catch {}
  }

  const h4 = document.querySelector("#resultDisplay h4.custom-color") || document.querySelector("h4.custom-color");
  const nome = h4 && h4.textContent ? h4.textContent.trim() : "";

  if (nome) {
    return nome.toLowerCase().replace(/\s+/g, "_");
  }

  if (leagues && leagues[0]) {
    return leagues[0];
  } else {
    return "default";
  }
}

/* Chave de armazenamento específica da liga atual — garante que linhas manuais,
   fibonacci livre e linhas de tendência (LTA/LTB) desenhadas em uma liga NÃO
   apareçam em outra ao trocar de liga. */
function _ligaKey(baseKey) {
  return baseKey + ":" + _ligaAtual();
}

let _tabVisible = !document.hidden;

document.addEventListener("visibilitychange", () => {
  _tabVisible = !document.hidden;

  if (_tabVisible) {
    updateCharts();
  }
});

/* ───────────────────────────────────────────
   MAPA LABEL → CHAVE
─────────────────────────────────────────── */
const labelToKey = {
  "Gols FT": "golsFT",
  "Gols HT": "golsHT",
  "Gols Individual": "golsInd",
  "Casa Vence": "casaVence",
  Empate: "empate",
  "Fora Vence": "foraVence",
  "Ambas Sim": "ambasSim",
  "Ambas Não": "ambasNao",
  "Over 0.5": "over05",
  "Over 1.5": "over15",
  "Over 2.5": "over25",
  "Over 3.5": "over35",
  "Over 5+": "over5",
  "Under 0.5": "under05",
  "Under 1.5": "under15",
  "Under 2.5": "under25",
  "Under 3.5": "under35",
  "0 Gol Exato": "gol0",
  "1 Gol Exato": "gol1",
  "2 Gols Exatos": "gol2",
  "3 Gols Exatos": "gol3",
  "4 Gols Exatos": "gol4",
  "5 Gols Exatos": "gol5",
  "0 Gol 2T": "gol2t0",
  "1 Gol 2T": "gol2t1",
  "2 Gols 2T": "gol2t2",
  "3 Gols 2T": "gol2t3",
  "4 Gols 2T": "gol2t4",
  "Casa 0 Gols": "casa0",
  "Casa 1 Gol": "casa1",
  "Casa 2 Gols": "casa2",
  "Casa 3 Gols": "casa3",
  "Casa 4 Gols": "casa4",
  "Fora 0 Gols": "fora0",
  "Fora 1 Gol": "fora1",
  "Fora 2 Gols": "fora2",
  "Fora 3 Gols": "fora3",
  "Fora 4 Gols": "fora4",
  "0x0": "placar0x0",
  "1x0": "placar1x0",
  "2x0": "placar2x0",
  "3x0": "placar3x0",
  "2x1": "placar2x1",
  "3x1": "placar3x1",
  "3x2": "placar3x2",
  "4x0": "placar4x0",
  "4x1": "placar4x1",
  "0x1": "placar0x1",
  "0x2": "placar0x2",
  "1x2": "placar1x2",
  "0x3": "placar0x3",
  "1x3": "placar1x3",
  "2x3": "placar2x3",
  "0x4": "placar0x4",
  "1x4": "placar1x4",
  "0x0 HT": "placarHT0x0",
  "0x1 HT": "placarHT0x1",
  "1x0 HT": "placarHT1x0",
  "1x1 HT": "placarHT1x1",
  "0x2 HT": "placarHT0x2",
  "2x0 HT": "placarHT2x0",
  "OUT HT": "placarHTOut",
  OverHT: "overHT",
  UnderHT: "underHT",
  "Casa HT": "casaHT",
  "Empate HT": "empateHT",
  "Fora HT": "foraHT",
  Viradinha: "viradinha",
  Par: "par",
  Ímpar: "impar",
  "Margem 1": "margem1",
  "Margem 2": "margem2",
  "Margem 3": "margem3",
  "Empate Com Gols": "empateGols",
  "Gols FT Casa": "golsFTCasa",
  "Gols FT Fora": "golsFTFora"
};

/* ═══════════════════════════════════════════════════════════════════
   CORES E GRUPOS DE MERCADOS
   DATASET_COLORS: cor de cada linha do gráfico (por label).
   MARKET_GROUPS: agrupamento dos mercados no modal de criar/editar setup.
═══════════════════════════════════════════════════════════════════ */

const DATASET_COLORS = {
  "Gols FT": "#FFFF00",
  "Gols HT": "#26A69A",
  "Gols Individual": "#FF5A36",
  "Ambas Sim": "#B0BEC5",
  "Ambas Não": "#F44336",
  "Casa Vence": "#AB47BC",
  Empate: "#78909C",
  "Fora Vence": "#2196F3",
  "Over 0.5": "#80DEEA",
  "Over 1.5": "#26C6DA",
  "Over 2.5": "#FFEB3B",
  "Over 3.5": "#00BCD4",
  "Over 5+": "#FF7043",
  "Under 0.5": "#A5D6A7",
  "Under 1.5": "#388E3C",
  "Under 2.5": "#FF9800",
  "Under 3.5": "#F06292",
  "0 Gol Exato": "#D81B60",
  "1 Gol Exato": "#8E24AA",
  "2 Gols Exatos": "#A0522D",
  "3 Gols Exatos": "#546E7A",
  "4 Gols Exatos": "#FFB300",
  "5 Gols Exatos": "#00897B",
  "0 Gol 2T": "#CE93D8",
  "1 Gol 2T": "#BA68C8",
  "2 Gols 2T": "#9C27B0",
  "3 Gols 2T": "#7B1FA2",
  "4 Gols 2T": "#4A148C",
  "Casa 0 Gols": "#FFCCBC",
  "Casa 1 Gol": "#FF8A65",
  "Casa 2 Gols": "#FF5722",
  "Casa 3 Gols": "#E64A19",
  "Casa 4 Gols": "#BF360C",
  "Fora 0 Gols": "#B3E5FC",
  "Fora 1 Gol": "#4FC3F7",
  "Fora 2 Gols": "#0288D1",
  "Fora 3 Gols": "#01579B",
  "Fora 4 Gols": "#002F6C",
  "0x0": "#E91E63",
  "1x0": "#9C27B0",
  "2x0": "#673AB7",
  "3x0": "#3F51B5",
  "2x1": "#009688",
  "3x1": "#4CAF50",
  "3x2": "#8BC34A",
  "4x0": "#CDDC39",
  "4x1": "#FFC107",
  "0x1": "#FF6090",
  "0x2": "#D81B60",
  "1x2": "#43A047",
  "0x3": "#F4511E",
  "1x3": "#8E24AA",
  "2x3": "#FDD835",
  "0x4": "#546E7A",
  "1x4": "#00897B",
  "0x0 HT": "#FF6090",
  "0x1 HT": "#D81B60",
  "1x0 HT": "#43A047",
  "1x1 HT": "#F4511E",
  "0x2 HT": "#8E24AA",
  "2x0 HT": "#FDD835",
  "OUT HT": "#546E7A",
  OverHT: "#A0522D",
  UnderHT: "#00897B",
  "Casa HT": "#3949AB",
  "Empate HT": "#FF6F00",
  "Fora HT": "#C2185B",
  Viradinha: "#FF4081",
  Par: "#76FF03",
  Ímpar: "#D500F9",
  "Margem 1": "#FFD600",
  "Margem 2": "#FF9100",
  "Margem 3": "#FF1744",
  "Empate Com Gols": "#00BFA5",
  "Gols FT Casa": "#00E5FF",
  "Gols FT Fora": "#FF6E40"
};

const MARKET_GROUPS = [{
  title: "Geral",
  labels: ["Gols FT", "Gols HT", "Gols Individual"]
}, {
  title: "Resultado",
  labels: ["Casa Vence", "Empate", "Fora Vence"]
}, {
  title: "Ambas",
  labels: ["Ambas Sim", "Ambas Não"]
}, {
  title: "Over",
  labels: ["Over 0.5", "Over 1.5", "Over 2.5", "Over 3.5", "Over 5+"]
}, {
  title: "Under",
  labels: ["Under 0.5", "Under 1.5", "Under 2.5", "Under 3.5"]
}, {
  title: "Gols Exatos",
  labels: ["0 Gol Exato", "1 Gol Exato", "2 Gols Exatos", "3 Gols Exatos", "4 Gols Exatos", "5 Gols Exatos"]
}, {
  title: "Gols 2T",
  labels: ["0 Gol 2T", "1 Gol 2T", "2 Gols 2T", "3 Gols 2T", "4 Gols 2T"]
}, {
  title: "Casa",
  labels: ["Casa 0 Gols", "Casa 1 Gol", "Casa 2 Gols", "Casa 3 Gols", "Casa 4 Gols"]
}, {
  title: "Fora",
  labels: ["Fora 0 Gols", "Fora 1 Gol", "Fora 2 Gols", "Fora 3 Gols", "Fora 4 Gols"]
}, {
  title: "Placares FT",
  labels: ["0x0", "1x0", "2x0", "3x0", "2x1", "3x1", "3x2", "4x0", "4x1", "0x1", "0x2", "1x2", "0x3", "1x3", "2x3", "0x4", "1x4"]
}, {
  title: "Placar HT",
  labels: ["0x0 HT", "0x1 HT", "1x0 HT", "1x1 HT", "0x2 HT", "2x0 HT", "OUT HT"]
}, {
  title: "Resultado HT",
  labels: ["Casa HT", "Empate HT", "Fora HT"]
}, {
  title: "Over/Under HT",
  labels: ["OverHT", "UnderHT"]
}, {
  title: "Viradinha",
  labels: ["Viradinha"]
}, {
  title: "Par / Ímpar",
  labels: ["Par", "Ímpar"]
}, {
  title: "Margem de Gols",
  labels: ["Margem 1", "Margem 2", "Margem 3"]
}, {
  title: "Empate com Gols",
  labels: ["Empate Com Gols"]
}, {
  title: "Gols FT por Time",
  labels: ["Gols FT Casa", "Gols FT Fora"]
}];

/* ═══════════════════════════════════════════════════════════════════
   HELPERS DE STORAGE
═══════════════════════════════════════════════════════════════════ */
function _ls(key, fallback) {
  try {
    const v = localStorage.getItem(key);

    if (v !== null) {
      return JSON.parse(v);
    } else {
      return fallback;
    }
  } catch {
    return fallback;
  }
}

function _lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════════
   ESTADO POR SETUP
   Cada setup guarda: markets, colors, horas, base,
   fibonacci, mediasMoveis, linhaAtual, dragLines, labels
═══════════════════════════════════════════════════════════════════ */
const SETUP_PADRAO = {
  id: "__padrao__",
  name: "Padrão",
  markets: [],
  colors: {},
  horas: 8 * _JPH,
  // 8 horas
  base: _JPH - 1,
  fibonacci: false,
  mediasMoveis: false,
  linhaAtual: true,
  labels: false,
  dragLines: [],
  fibDraws: [],
  trendLines: []
};

/* ═══════════════════════════════════════════════════════════════════
   SETUPS: LEITURA E GRAVAÇÃO (localStorage)
   Setup = conjunto de mercados + configurações do gráfico escolhidos pelo usuário.
   O setup "__padrao__" (SETUP_PADRAO) é fixo e não pode ser editado.
═══════════════════════════════════════════════════════════════════ */

// Lê os setups criados pelo usuário.
function _loadCustomSetups() {
  return _ls(SETUPS_KEY, []);
}

// Grava a lista de setups do usuário.
function _saveCustomSetups(setups) {
  _lsSet(SETUPS_KEY, setups);
}

// Lê o id do setup ativo ("__padrao__" se nenhum).
function _loadActiveId() {
  return _ls(ACTIVE_SETUP_KEY, "__padrao__");
}

// Grava o id do setup ativo.
function _saveActiveId(id) {
  _lsSet(ACTIVE_SETUP_KEY, id);
}

// Setup padrão + setups do usuário.
function _getAllSetups() {
  return [SETUP_PADRAO, ..._loadCustomSetups()];
}

// Setup que está selecionado agora.
function _getActiveSetup() {
  const id = _loadActiveId();
  return _getAllSetups().find(s => s.id === id) || SETUP_PADRAO;
}

// Cor de um mercado: a do setup, senão DATASET_COLORS, senão cinza.
function _marketColor(setup, label) {
  return setup.colors && setup.colors[label] || DATASET_COLORS[label] || "#888";
}

/* ── TOGGLES DE LINHA POR SETUP ── */
function _getLineToggles(setupId) {
  const all = _ls(SETUP_LINE_TOGGLE_KEY, {});
  return all[setupId] || {};
}

// Grava quais linhas estão ligadas/desligadas em um setup.
function _saveLineToggles(setupId, toggles) {
  const lsResult = _ls(SETUP_LINE_TOGGLE_KEY, {});
  lsResult[setupId] = toggles;
  _lsSet(SETUP_LINE_TOGGLE_KEY, lsResult);
}

// Diz se a linha (mercado) está ligada no setup. Padrão: ligada.
function _isLineActive(setupId, label) {
  const getLineTogglesResult = _getLineToggles(setupId);

  if (getLineTogglesResult[label] !== undefined) {
    return getLineTogglesResult[label];
  } else {
    return true;
  }
}

// Liga/desliga uma linha (mercado) em um setup e grava.
function _setLineActive(setupId, label, active) {
  const setupToggles = _getLineToggles(setupId);
  setupToggles[label] = active;
  _saveLineToggles(setupId, setupToggles);
}

/* ── SALVA O ESTADO ATUAL DOS CONTROLES NO SETUP ── */
function _captureControlsToSetup(setup) {
  if (!setup || setup.id === "__padrao__") {
    return;
  }

  const arr = _loadCustomSetups();
  const idx = arr.findIndex(s => s.id === setup.id);

  if (idx === -1) {
    return;
  }

  const pSel = document.getElementById("pointsSelector");
  const aSel = document.getElementById("averageSelector");
  const fib = document.getElementById("fibonacciToggle");
  const med = document.getElementById("movingAveragesToggle");
  const lat = document.getElementById("linhaAtualToggle");
  const lbl = document.getElementById("labelsToggle");
  arr[idx].horas = pSel ? parseInt(pSel.value, 10) : setup.horas;
  arr[idx].base = aSel ? parseInt(aSel.value, 10) : setup.base;
  arr[idx].fibonacci = fib ? fib.checked : setup.fibonacci;
  arr[idx].mediasMoveis = med ? med.checked : setup.mediasMoveis;
  arr[idx].linhaAtual = lat ? lat.checked : setup.linhaAtual;
  arr[idx].labels = lbl ? lbl.checked : setup.labels;
  _saveCustomSetups(arr);
}

/* ── APLICA SETUP ── */
function _applySetup(setup) {
  const prevSetup = _getActiveSetup();

  if (prevSetup.id !== setup.id) {
    _captureControlsToSetup(prevSetup);
  }

  _saveActiveId(setup.id);

  Object.keys(labelToKey).forEach(label => {
    const inSetup = setup.markets.includes(label);
    const toggled = _isLineActive(setup.id, label);
    statsChartVisibleDatasets[label] = inSetup && toggled;
  });

  _saveVisibleDatasets(statsChartVisibleDatasets);
  const pSel = document.getElementById("pointsSelector");
  const aSel = document.getElementById("averageSelector");
  const fibToggleEl = document.getElementById("fibonacciToggle");
  const mediasToggleEl = document.getElementById("movingAveragesToggle");
  const linhaAtualToggleEl = document.getElementById("linhaAtualToggle");
  const labelsToggleEl = document.getElementById("labelsToggle");
  const horas = setup.horas ?? 8 * _JPH;
  const base = setup.base ?? _JPH - 1;
  const fibonacciOn = setup.fibonacci ?? false;
  const mediasMoveisOn = setup.mediasMoveis ?? false;
  const linhaAtualOn = setup.linhaAtual ?? true;
  const labelsOn = setup.labels ?? false;

  if (pSel) {
    pSel.value = String(horas);
  }

  if (aSel) {
    aSel.value = String(base);
  }

  if (fibToggleEl) {
    fibToggleEl.checked = fibonacciOn;
  }

  if (mediasToggleEl) {
    mediasToggleEl.checked = mediasMoveisOn;
  }

  if (linhaAtualToggleEl) {
    linhaAtualToggleEl.checked = linhaAtualOn;
  }

  if (labelsToggleEl) {
    labelsToggleEl.checked = labelsOn;
  }

  numPoints = horas;
  averagePoints = base;
  showFibonacciLines = fibonacciOn;
  showMovingAverages = mediasMoveisOn;
  showLabels = labelsOn;
  const ci = chartInstances.Copa || Object.values(chartInstances)[0];

  if (ci) {
    ci.dragLines = _loadDragLines();
    ci._selectedDragLine = -1;
    _atualizarContador(ci.dragLines);
    ci.fibDraws = _loadDragFibs();
    ci._selectedFib = -1;
    _atualizarContadorFibs(ci.fibDraws);
    ci.trendLines = _loadDragTrends();
    ci._selectedTrend = -1;
    _atualizarContadorTrends(ci.trendLines);
    ci.options.plugins.linhaAtual.enabled = linhaAtualOn;

    ci.data.datasets.forEach((ds, idx) => {
      const mainLabel = ds.label.includes(" - ") ? ds.label.split(" - ")[0] : ds.label;
      const vis = statsChartVisibleDatasets[mainLabel];
      ci.getDatasetMeta(idx).hidden = ds.label.includes(" - ") ? !mediasMoveisOn || !vis : !vis;

      if (!ds.label.includes(" - ") && setup.colors && setup.colors[mainLabel]) {
        ds.borderColor = setup.colors[mainLabel];
        ds.backgroundColor = setup.colors[mainLabel];
      } else if (!ds.label.includes(" - ")) {
        ds.borderColor = DATASET_COLORS[mainLabel] || "#888";
        ds.backgroundColor = DATASET_COLORS[mainLabel] || "#888";
      }
    });

  }

  // Recalcula só com os mercados do novo setup (usa os dados já baixados, sem esperar a API).
  if (!_refreshFromCache() && ci) {
    ci.update();
  }

  _renderSetupBar();
  _renderLinesPanel(setup);
  _updateSetupCounter();
  updateCharts();
}

/* ── VALOR ATUAL DE UM DATASET (último ponto visível) ── */
function _getDatasetCurrentValue(label) {
  const ci = chartInstances.Copa || Object.values(chartInstances)[0];

  if (!ci) {
    return null;
  }

  const ds = ci.data.datasets.find(d => d.label === label);

  if (!ds || !ds.data) {
    return null;
  }

  for (let j = ds.data.length - 1; j >= 0; j--) {
    const value = ds.data[j];

    if (value !== null && value !== undefined && isFinite(value)) {
      return value;
    }
  }

  return null;
}

/* ── RENDERIZA BARRA DE CHIPS ── */
function _renderSetupBar() {
  const bar = document.getElementById("setupBar");

  if (!bar) {
    return;
  }

  bar.innerHTML = "";
  const activeId = _loadActiveId();

  _getAllSetups().forEach(setup => {
    if (setup.id === "__padrao__") {
      return;
    }

    const item = document.createElement("div");
    item.className = "setup-item" + (setup.id === activeId ? " active" : "");
    const btn = document.createElement("button");
    btn.className = "setup-btn";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = setup.name;
    const editHint = document.createElement("span");
    editHint.className = "setup-edit-hint";
    editHint.textContent = "✏";
    editHint.title = "Duplo clique para editar";
    btn.appendChild(nameSpan);

    if (setup.id !== "__padrao__") {
      btn.appendChild(editHint);
    }

    btn.title = setup.id === "__padrao__" ? setup.markets.join(" · ") : setup.markets.join(" · ") + "\nDuplo clique para editar";
    btn.addEventListener("click", () => _applySetup(setup));

    btn.addEventListener("dblclick", e => {
      e.stopPropagation();

      if (setup.id === "__padrao__") {
        alert("O setup \"Padrão\" não pode ser editado.");
        return;
      }

      _openSetupModal(setup);
    });

    item.appendChild(btn);

    if (setup.id !== "__padrao__") {
      const dup = document.createElement("button");
      dup.className = "setup-dup";
      dup.textContent = "⧉";
      dup.title = "Duplicar setup";

      dup.addEventListener("click", e => {
        e.stopPropagation();
        _duplicateSetup(setup);
      });

      item.appendChild(dup);
      const del = document.createElement("button");
      del.className = "setup-del";
      del.textContent = "✕";
      del.title = "Remover setup";

      del.addEventListener("click", e => {
        e.stopPropagation();

        if (!confirm("Remover o setup \"" + setup.name + "\"?")) {
          return;
        }

        const arr = _loadCustomSetups().filter(s => s.id !== setup.id);
        _saveCustomSetups(arr);

        if (_loadActiveId() === setup.id) {
          _applySetup(SETUP_PADRAO);
        } else {
          _renderSetupBar();
          _updateSetupCounter();
        }
      });

      item.appendChild(del);
    }

    bar.appendChild(item);
  });
}

/* ── DUPLICAR SETUP ── */
function _duplicateSetup(setup) {
  const arr = _loadCustomSetups();

  if (arr.length >= MAX_SETUPS) {
    alert("Limite de " + MAX_SETUPS + " setups atingido. Remova um antes de duplicar.");
    return;
  }

  const dup = JSON.parse(JSON.stringify(setup));
  dup.id = "setup_" + Date.now();
  dup.name = setup.name + " (cópia)";
  arr.push(dup);
  _saveCustomSetups(arr);
  _renderSetupBar();
  _updateSetupCounter();
}

/* ── PRÉVIA NO HOVER (mostra a linha temporariamente sem ativar de verdade) ── */
function _setPreviewLine(label, visible) {
  leagues.forEach(l => {
    const ci = chartInstances[l];

    if (!ci) {
      return;
    }

    let changed = false;

    ci.data.datasets.forEach((ds, idx) => {
      const ml = ds.label.includes(" - ") ? ds.label.split(" - ")[0] : ds.label;

      if (ml !== label) {
        return;
      }

      const isMA = ds.label.includes(" - ");
      const newHidden = visible ? isMA ? !showMovingAverages : false : true;
      const meta = ci.getDatasetMeta(idx);

      if (meta.hidden !== newHidden) {
        meta.hidden = newHidden;
        changed = true;
      }
    });

    if (changed) {
      ci.update("none");
    }
  });
}

/* ── RENDERIZA PAINEL DE TOGGLES (ordenado pela ordem do setup) ── */
function _renderLinesPanel(setup) {
  const panel = document.getElementById("setupLinesPanel");

  if (!panel) {
    return;
  }

  panel.innerHTML = "";

  if (!setup || !setup.markets || setup.markets.length === 0) {
    return;
  }

  setup.markets.forEach(label => {
    const active = _isLineActive(setup.id, label);
    const color = _marketColor(setup, label);
    const currentValue = _getDatasetCurrentValue(label);
    let tooltipText = label;

    if (currentValue !== null) {
      const isGols = label === "Gols FT" || label === "Gols HT" || label === "Gols FT Casa" || label === "Gols FT Fora";
      tooltipText += " — " + (isGols ? Math.round(currentValue) + " gols" : currentValue.toFixed(1));
    }

    const toggle = document.createElement("div");
    toggle.className = "market-toggle" + (active ? " active" : " inactive");
    toggle.title = tooltipText;
    toggle.style.setProperty("--mcolor", color);
    const dot = document.createElement("span");
    dot.className = "market-toggle-dot";
    dot.style.background = color;
    const txt = document.createElement("span");
    txt.textContent = label;

    if (currentValue !== null) {
      const valSpan = document.createElement("span");
      valSpan.className = "market-toggle-val";
      const isGols = label === "Gols FT" || label === "Gols HT" || label === "Gols FT Casa" || label === "Gols FT Fora";
      valSpan.textContent = isGols ? Math.round(currentValue) : currentValue.toFixed(1);
      valSpan.style.color = color;
      toggle.appendChild(dot);
      toggle.appendChild(txt);
      toggle.appendChild(valSpan);
    } else {
      toggle.appendChild(dot);
      toggle.appendChild(txt);
    }

    toggle.addEventListener("click", () => {
      toggle.style.outline = "";
      const nowActive = !_isLineActive(setup.id, label);
      _setLineActive(setup.id, label, nowActive);
      statsChartVisibleDatasets[label] = setup.markets.includes(label) && nowActive;
      _saveVisibleDatasets(statsChartVisibleDatasets);

      leagues.forEach(l => {
        const ci = chartInstances[l];

        if (!ci) {
          return;
        }

        ci.data.datasets.forEach((ds, idx) => {
          const ml = ds.label.includes(" - ") ? ds.label.split(" - ")[0] : ds.label;

          if (ml !== label) {
            return;
          }

          const vis = statsChartVisibleDatasets[ml];
          ci.getDatasetMeta(idx).hidden = ds.label.includes(" - ") ? !showMovingAverages || !vis : !vis;
        });

        ci.update();
      });

      _renderLinesPanel(_getActiveSetup());
    });

    toggle.dataset.label = label;
    toggle.dataset.color = color;

    if (!active) {
      toggle.addEventListener("mouseenter", () => {
        toggle.style.outline = "2px dashed " + color;
        toggle.style.outlineOffset = "2px";
        _setPreviewLine(label, true);
      });

      toggle.addEventListener("mouseleave", () => {
        toggle.style.outline = "";

        if (!_isLineActive(setup.id, label)) {
          _setPreviewLine(label, false);
        }
      });
    }

    panel.appendChild(toggle);
  });

  panel.querySelectorAll(".market-toggle.inactive").forEach(el => {
    const lbl = el.dataset.label;

    if (!lbl) {
      return;
    }

    if (el.matches(":hover")) {
      el.style.outline = "2px dashed " + el.dataset.color;
      el.style.outlineOffset = "2px";
      _setPreviewLine(lbl, true);
    } else {
      _setPreviewLine(lbl, false);
    }
  });
}

/* ── ATUALIZAÇÃO LEVE DOS VALORES DO PAINEL (sem recriar DOM) ──
   Chamada a cada updateCharts() (3s). Diferente de _renderLinesPanel,
   esta função NUNCA destrói/recria os elementos .market-toggle — apenas
   atualiza o texto do valor e o tooltip. Isso evita que o hover/prévia
   em andamento seja interrompido e o mercado pisque enquanto o usuário
   está analisando o gráfico. Use _renderLinesPanel apenas quando a
   ESTRUTURA realmente muda (troca de setup, ativar/desativar mercado). */
function _updateLinesPanelValues() {
  const panel = document.getElementById("setupLinesPanel");

  if (!panel) {
    return;
  }

  panel.querySelectorAll(".market-toggle").forEach(toggle => {
    const label = toggle.dataset.label;

    if (!label) {
      return;
    }

    const currentValue = _getDatasetCurrentValue(label);
    const isGols = label === "Gols FT" || label === "Gols HT" || label === "Gols FT Casa" || label === "Gols FT Fora";
    let tooltipText = label;

    if (currentValue !== null) {
      tooltipText += " — " + (isGols ? Math.round(currentValue) + " gols" : currentValue.toFixed(1));
    }

    toggle.title = tooltipText;
    let valSpan = toggle.querySelector(".market-toggle-val");

    if (currentValue !== null) {
      const text = isGols ? Math.round(currentValue) : currentValue.toFixed(1);

      if (!valSpan) {
        valSpan = document.createElement("span");
        valSpan.className = "market-toggle-val";
        valSpan.style.color = toggle.dataset.color || "#888";
        toggle.appendChild(valSpan);
      }

      valSpan.textContent = text;
    } else if (valSpan) {
      valSpan.remove();
    }
  });
}

/* ── CONTADOR ── */
function _updateSetupCounter() {
  const customs = _loadCustomSetups().length;
  const counter = document.getElementById("setupCounter");
  const addBtn = document.getElementById("btnAddSetup");

  if (counter) {
    counter.textContent = customs + " / " + MAX_SETUPS;
    counter.className = "setup-counter" + (customs >= MAX_SETUPS ? " at-limit" : "");
  }

  if (addBtn) {
    addBtn.disabled = customs >= MAX_SETUPS;
    addBtn.title = customs >= MAX_SETUPS ? "Limite de 10 setups atingido" : "Criar novo setup";
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MODAL CRIAR / EDITAR
═══════════════════════════════════════════════════════════════════ */
let _editingSetupId = null;

// Abre o modal de criar setup (ou editar, se receber um setup).
function _openSetupModal(setupParaEditar) {
  const modal = document.getElementById("setupModal");
  const warning = document.getElementById("setupLimitWarning");

  if (!modal) {
    return;
  }

  const customs = _loadCustomSetups().length;

  if (setupParaEditar) {
    _editingSetupId = setupParaEditar.id;
    document.getElementById("setupModalTitle").textContent = "Editar Setup";
    document.getElementById("setupModalSaveBtn").textContent = "✔ Atualizar Setup";
    document.getElementById("setupModalName").value = setupParaEditar.name;

    if (warning) {
      warning.style.display = "none";
    }
  } else {
    _editingSetupId = null;
    document.getElementById("setupModalTitle").textContent = "Criar Setup";
    document.getElementById("setupModalSaveBtn").textContent = "✔ Salvar Setup";
    document.getElementById("setupModalName").value = "";

    if (warning) {
      warning.style.display = customs >= MAX_SETUPS ? "block" : "none";
    }
  }

  const container = document.getElementById("setupModalMarkets");
  container.innerHTML = "";
  const refSetup = setupParaEditar || _getActiveSetup();
  const checkedMarkets = refSetup.markets || [];
  const currentColors = (setupParaEditar ? setupParaEditar.colors : null) || {};

  MARKET_GROUPS.forEach(group => {
    const title = document.createElement("div");
    title.className = "setup-modal-group-title";
    title.textContent = group.title;
    container.appendChild(title);

    group.labels.forEach(label => {
      const isChecked = checkedMarkets.includes(label);
      const row = document.createElement("label");
      row.className = "setup-modal-row" + (isChecked ? " checked" : "");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = label;
      cb.checked = isChecked;

      cb.addEventListener("change", () => {
        row.className = "setup-modal-row" + (cb.checked ? " checked" : "");
      });

      const dot = document.createElement("span");
      dot.className = "setup-modal-dot";
      const currentColor = currentColors[label] || DATASET_COLORS[label] || "#888";
      dot.style.background = currentColor;
      const txt = document.createElement("span");
      txt.textContent = label;
      txt.style.flex = "1";
      const colorPick = document.createElement("input");
      colorPick.type = "color";
      colorPick.value = currentColor;
      colorPick.className = "market-color-picker";
      colorPick.title = "Personalizar cor";

      colorPick.addEventListener("input", () => {
        dot.style.background = colorPick.value;
      });

      row.appendChild(cb);
      row.appendChild(dot);
      row.appendChild(txt);
      row.appendChild(colorPick);
      container.appendChild(row);
    });
  });

  modal.style.display = "flex";
  setTimeout(() => document.getElementById("setupModalName")?.focus(), 60);
}

// Fecha o modal de setup.
function _closeSetupModal() {
  const modal = document.getElementById("setupModal");

  if (modal) {
    modal.style.display = "none";
  }

  _editingSetupId = null;
}

// Valida e salva o setup digitado no modal.
function _saveSetupModal() {
  const name = document.getElementById("setupModalName").value.trim();

  if (!name) {
    alert("Digite um nome para o setup.");
    return;
  }

  const markets = [];
  const colors = {};

  document.querySelectorAll("#setupModalMarkets .setup-modal-row").forEach(row => {
    const cb = row.querySelector("input[type=checkbox]");
    const cp = row.querySelector(".market-color-picker");

    if (cb && cb.checked) {
      markets.push(cb.value);
      const def = DATASET_COLORS[cb.value] || "#888";

      if (cp && cp.value.toLowerCase() !== def.toLowerCase()) {
        colors[cb.value] = cp.value;
      }
    }
  });

  if (markets.length === 0) {
    alert("Selecione pelo menos um mercado.");
    return;
  }

  const arr = _loadCustomSetups();

  if (_editingSetupId) {
    const idx = arr.findIndex(s => s.id === _editingSetupId);

    if (idx !== -1) {
      arr[idx].name = name;
      arr[idx].markets = markets;
      arr[idx].colors = colors;
      _saveCustomSetups(arr);
      _closeSetupModal();

      if (_loadActiveId() === _editingSetupId) {
        _applySetup(arr[idx]);
      } else {
        _renderSetupBar();
        _updateSetupCounter();
      }
    }
  } else {
    if (arr.length >= MAX_SETUPS) {
      alert("Limite de " + MAX_SETUPS + " setups atingido.");
      return;
    }

    const active = _getActiveSetup();

    const newSetup = {
      id: "setup_" + Date.now(),
      name,
      markets,
      colors,
      horas: active.horas ?? 8 * _JPH,
      base: active.base ?? _JPH - 1,
      fibonacci: active.fibonacci ?? false,
      mediasMoveis: active.mediasMoveis ?? false,
      linhaAtual: active.linhaAtual ?? true,
      labels: active.labels ?? false,
      dragLines: []
    };

    arr.push(newSetup);
    _saveCustomSetups(arr);
    _closeSetupModal();
    _applySetup(newSetup);
  }

  _updateSetupCounter();
}

// Ao carregar a página: clicar fora do modal de setup fecha o modal.
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("setupModal")?.addEventListener("click", function (e) {
    if (e.target === this) {
      _closeSetupModal();
    }
  });

  const accordionOpen = _ls(ACCORDION_KEY, true);
  const content = document.querySelector(".accordion-content");

  if (content && !accordionOpen) {
    content.style.display = "none";
  }

  _renderSetupBar();
  _renderLinesPanel(_getActiveSetup());
  _updateSetupCounter();
});

/* ═══════════════════════════════════════════════════════════════════
   ACORDEÃO — persiste aberto/fechado
═══════════════════════════════════════════════════════════════════ */
function toggleAccordion(btn) {
  const content = btn.nextElementSibling;
  const isOpen = content.style.display !== "none";
  content.style.display = isOpen ? "none" : "block";
  _lsSet(ACCORDION_KEY, !isOpen);
}

/* ═══════════════════════════════════════════════════════════════════
   PERSISTÊNCIA DATASETS VISÍVEIS
═══════════════════════════════════════════════════════════════════ */
const defaultStatsChartVisibleDatasets = (() => {
  const visible = {};
  Object.keys(labelToKey).forEach(label => visible[label] = false);
  return visible;
})();

// Lê quais mercados estão visíveis (mescla com o padrão).
function _loadVisibleDatasets() {
  const saved = _ls(VISIBLE_DS_KEY, null);

  const defaults = {
    ...defaultStatsChartVisibleDatasets
  };

  if (!saved) {
    return defaults;
  }

  return Object.assign({}, defaultStatsChartVisibleDatasets, saved);
}

// Grava quais mercados estão visíveis.
function _saveVisibleDatasets(a) {
  _lsSet(VISIBLE_DS_KEY, a);
}

let statsChartVisibleDatasets = _loadVisibleDatasets();

/* ═══════════════════════════════════════════════════════════════════
   UTILITÁRIOS
═══════════════════════════════════════════════════════════════════ */
function getKeyFromLabel(label) {
  if (label.includes(" - ")) {
    const [mainLabel, maPart] = label.split(" - ");
    return labelToKey[mainLabel] + maPart.split(" ")[0];
  }

  return labelToKey[label];
}

// Média móvel simples de dataArray com a janela "period" (ignora null).
function computeMA(dataArray, period) {
  return dataArray.map((_, i) => {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - period + 1); j <= i; j++) {
      if (dataArray[j] !== null) {
        sum += dataArray[j];
        count++;
      }
    }

    if (count > 0) {
      return sum / count;
    } else {
      return null;
    }
  });
}

// Total de gols do 1º tempo a partir do texto do HT (ex.: "1 x 0"; "OUT" vale 3).
function parseHtScoreTotal(htStr) {
  if (!htStr) {
    return 0;
  }

  if (htStr === "OUT") {
    return 3;
  }

  if (htStr.includes(" x ")) {
    const parts = htStr.split(" x ").map(Number);

    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] + parts[1];
    }
  }

  return 0;
}

// Separa o placar do HT em [casa, fora].
function parseHtParts(htStr) {
  if (!htStr || htStr === "OUT") {
    return null;
  }

  if (htStr.includes(" x ")) {
    const parts = htStr.split(" x ").map(Number);

    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts;
    }
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   PLUGIN — RÓTULOS ACIMA DOS PONTOS
   Exibe só o número (sem %) acima de cada ponto visível.
   Ativo apenas quando showLabels === true.
═══════════════════════════════════════════════════════════════════ */
const rotulosPlugin = {
  id: "rotulos",
  afterDatasetsDraw(chart) {
    if (!showLabels) {
      return;
    }

    const {
      ctx,
      chartArea,
      scales
    } = chart;

    if (!chartArea || !scales.y) {
      return;
    }

    chart.data.datasets.forEach((ds, dsIdx) => {
      if (ds.label.includes(" MA")) {
        return;
      }

      if (!chart.isDatasetVisible(dsIdx)) {
        return;
      }

      const meta = chart.getDatasetMeta(dsIdx);

      if (!meta || !meta.data) {
        return;
      }

      const color = ds.borderColor || "#fff";
      ctx.save();
      ctx.font = "600 9.5px 'Inter',Arial,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = color;

      meta.data.forEach((point, i) => {
        const value = ds.data[i];

        if (value === null || value === undefined || !isFinite(value)) {
          return;
        }

        if (point.x < chartArea.left || point.x > chartArea.right) {
          return;
        }

        if (point.y < chartArea.top || point.y > chartArea.bottom) {
          return;
        }

        const isGols = ds.label === "Gols FT" || ds.label === "Gols HT";
        const text = isGols ? String(Math.round(value)) : String(Math.round(value));
        ctx.fillText(text, point.x, point.y - 4);
      });

      ctx.restore();
    });
  }
};

/* ═══════════════════════════════════════════════════════════════════
   PLUGINS — Fibonacci, Linha Atual, Drag Lines
═══════════════════════════════════════════════════════════════════ */
const fibonacciLinesPlugin = {
  id: "fibonacciLines",
  afterDraw(chart) {
    if (!showFibonacciLines) {
      return;
    }

    const ctx = chart.ctx;
    const yAxis = chart.scales.y;

    if (!yAxis) {
      return;
    }

    const fibLevels = [0, 23.6, 38.2, 50, 61.8, 100];
    const fibColor = "rgba(167,139,250,0.55)";
    const fibText = "rgba(196,181,253,0.9)";

    const {
      left,
      right
    } = chart.chartArea;

    const range = yAxis.max - yAxis.min;
    const axisRight = yAxis.position === "right";
    ctx.save();

    fibLevels.forEach((lvl, i) => {
      const y = yAxis.getPixelForValue(yAxis.min + lvl / 100 * range);
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.strokeStyle = fibColor;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = fibText;
      ctx.font = "10px 'Inter',Arial,sans-serif";
      ctx.textBaseline = "middle";

      if (axisRight) {
        ctx.textAlign = "right";
        ctx.fillText(fibLevels[i] + "%", left - 8, y - (i === 0 ? -8 : 0));
      } else {
        ctx.textAlign = "left";
        ctx.fillText(fibLevels[i] + "%", right + 52, y - (i === 0 ? -8 : 0));
      }
    });

    ctx.restore();
  }
};

/* ═══════════════════════════════════════════════════════════════════
   PLUGIN: LINHA ATUAL
   Desenha uma linha tracejada no último valor de cada mercado visível,
   com uma etiqueta (badge) na borda do gráfico. Liga/desliga em #linhaAtualToggle.
═══════════════════════════════════════════════════════════════════ */

const linhaAtualPlugin = {
  id: "linhaAtual",
  afterDraw(chart, args, opts) {
    const cfg = opts?.enabled !== undefined ? opts : chart.options?.plugins?.linhaAtual ?? {};

    if (cfg.enabled === false) {
      return;
    }

    const {
      ctx,
      chartArea,
      scales
    } = chart;

    if (!chartArea || !scales.y) {
      return;
    }

    const {
      left,
      right,
      top,
      bottom
    } = chartArea;

    const padX = 5;
    const BAD_H = 18;
    const entries = [];

    chart.data.datasets.forEach((d, i) => {
      if (!d.label || d.label.includes(" MA") || !chart.isDatasetVisible(i)) {
        return;
      }

      const arr = d.data;

      if (!arr?.length) {
        return;
      }

      let yVal = null;

      for (let j = arr.length - 1; j >= 0; j--) {
        const v = arr[j];

        if (v !== null && v !== undefined && isFinite(v)) {
          yVal = v;
          break;
        }
      }

      if (yVal === null) {
        return;
      }

      const axisId = d.yAxisID || "y";
      const yAxis = scales[axisId] || scales.y;
      const yPx = yAxis.getPixelForValue(yVal);

      if (!isFinite(yPx) || yPx < top || yPx > bottom) {
        return;
      }

      const entry = {
        yVal,
        yPx,
        label: d.label,
        color: d.borderColor || "#fff"
      };

      entries.push(entry);
    });

    if (!entries.length) {
      return;
    }

    entries.sort((a, b) => a.yPx - b.yPx);

    for (let i = 1; i < entries.length; i++) {
      const prev = entries[i - 1];
      const curr = entries[i];
      curr.badgeY = curr.yPx - (prev.badgeY ?? prev.yPx) < BAD_H + 2 ? (prev.badgeY ?? prev.yPx) + BAD_H + 2 : curr.yPx;

      if (i === 1) {
        prev.badgeY = prev.badgeY ?? prev.yPx;
      }
    }

    if (entries.length === 1) {
      entries[0].badgeY = entries[0].yPx;
    }

    entries.forEach(({
      yVal,
      yPx,
      badgeY,
      label,
      color
    }) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(left, yPx);
      ctx.lineTo(right, yPx);
      ctx.stroke();
      ctx.setLineDash([]);
      const isGols = label === "Gols FT" || label === "Gols HT" || label === "Gols Individual" || label === "Gols FT Casa" || label === "Gols FT Fora";
      const text = isGols ? String(Math.round(yVal)) : yVal.toFixed(1);
      ctx.font = "600 10.5px 'Inter',Arial,sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      const bw = Math.ceil(ctx.measureText(text).width) + padX * 2;
      const axisRight = scales.y.position === "right";
      const bx = axisRight ? left - 4 - bw : right + 4;
      const by = badgeY - BAD_H / 2;
      const br = 4;
      ctx.fillStyle = "rgba(13,16,26,0.96)";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, BAD_H, br);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillText(text, bx + padX, badgeY);
      ctx.restore();
    });
  }
};

/* ── DRAG LINES ── */
function _loadDragLines() {
  try {
    const saved = JSON.parse(localStorage.getItem(_ligaKey(DRAG_LINES_KEY)) || "[]");

    if (Array.isArray(saved)) {
      return saved.map(line => ({
        y: Number(line.y),
        color: line.color || "#1fcc59",
        dragging: false
      }));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

// Grava as linhas horizontais manuais da liga atual.
function _saveDragLines(lines) {
  try {
    localStorage.setItem(_ligaKey(DRAG_LINES_KEY), JSON.stringify(lines.map(line => ({
      y: line.y,
      color: line.color || "#1fcc59"
    }))));
  } catch {}
}

// Atualiza o texto "x / máx linhas" na tela.
function _atualizarContador(lines) {
  const el = document.getElementById("contadorLinhas");

  if (el) {
    el.textContent = (lines || []).length + " / " + MAX_DRAG_LINES + " linhas";
  }
}

/* ── FIBONACCI LIVRE (ARRASTÁVEL) ── */
function _loadDragFibs() {
  try {
    const saved = JSON.parse(localStorage.getItem(_ligaKey(DRAG_FIBS_KEY)) || "[]");

    if (Array.isArray(saved)) {
      return saved.map(fib => ({
        y1: Number(fib.y1),
        y2: Number(fib.y2),
        x1Idx: fib.x1Idx == null ? null : Number(fib.x1Idx),
        x2Idx: fib.x2Idx == null ? null : Number(fib.x2Idx),
        color: fib.color || "#A78BFA"
      }));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

// Grava os Fibonacci livres da liga atual.
function _saveDragFibs(arr) {
  try {
    localStorage.setItem(_ligaKey(DRAG_FIBS_KEY), JSON.stringify((arr || []).map(fib => ({
      y1: fib.y1,
      y2: fib.y2,
      x1Idx: fib.x1Idx ?? null,
      x2Idx: fib.x2Idx ?? null,
      color: fib.color || "#A78BFA"
    }))));
  } catch {}
}

// Atualiza o contador de Fibonacci na tela.
function _atualizarContadorFibs(arr) {
  const el = document.getElementById("contadorFibs");

  if (el) {
    el.textContent = (arr || []).length + " / " + MAX_DRAG_FIBS + " fibonacci";
  }
}

/* ── LINHAS DE TENDÊNCIA LIVRES (LTA / LTB, ARRASTÁVEIS) ── */
function _loadDragTrends() {
  try {
    const saved = JSON.parse(localStorage.getItem(_ligaKey(DRAG_TRENDS_KEY)) || "[]");

    if (Array.isArray(saved)) {
      return saved.map(trend => ({
        x1Idx: Number(trend.x1Idx),
        y1: Number(trend.y1),
        x2Idx: Number(trend.x2Idx),
        y2: Number(trend.y2),
        color: trend.color || "#34D399",
        tipo: trend.tipo || "LTA"
      }));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

// Grava as linhas de tendência (LTA/LTB) da liga atual.
function _saveDragTrends(arr) {
  try {
    localStorage.setItem(_ligaKey(DRAG_TRENDS_KEY), JSON.stringify((arr || []).map(trend => ({
      x1Idx: trend.x1Idx,
      y1: trend.y1,
      x2Idx: trend.x2Idx,
      y2: trend.y2,
      color: trend.color || "#34D399",
      tipo: trend.tipo || "LTA"
    }))));
  } catch {}
}

// Atualiza o contador de linhas de tendência na tela.
function _atualizarContadorTrends(arr) {
  const el = document.getElementById("contadorTendencias");

  if (el) {
    el.textContent = (arr || []).length + " / " + MAX_DRAG_TRENDS + " tendências";
  }
}

/* Distância de um ponto (px,py) até o segmento (x1,y1)-(x2,y2), em pixels */
function _distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;

  if (len2 === 0) {
    return Math.hypot(px - x1, py - y1);
  }

  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/* ═══════════════════════════════════════════════════════════════════
   PLUGIN: LINHAS HORIZONTAIS ARRASTÁVEIS
   Linhas manuais que o usuário adiciona, arrasta e apaga. Salvas por liga (DRAG_LINES_KEY).
═══════════════════════════════════════════════════════════════════ */

const linhaDraggablePlugin = {
  id: "linhaDraggable",
  afterInit(chart) {
    const canvas = chart.canvas;
    chart.dragLines = _loadDragLines();
    chart._selectedDragLine = -1;
    const HIT_PX = 8;
    let draggingIdx = -1;
    const getYS = () => chart.scales.y;

    const getEvtY = evt => {
      const r = canvas.getBoundingClientRect();
      return ((evt.touches && evt.touches[0]?.clientY) ?? evt.clientY ?? 0) - r.top;
    };

    const nearestLine = pxY => {
      const yS = getYS();

      if (!yS || !chart.chartArea) {
        return -1;
      }

      const {
        top,
        bottom
      } = chart.chartArea;

      let best = -1;
      let bestDist = Infinity;

      (chart.dragLines || []).forEach((line, i) => {
        const ly = yS.getPixelForValue(line.y);

        if (ly < top || ly > bottom) {
          return;
        }

        const dist = Math.abs(ly - pxY);

        if (dist < bestDist && dist <= HIT_PX) {
          bestDist = dist;
          best = i;
        }
      });

      return best;
    };

    chart.addDragLine = (color = "#1fcc59") => {
      if ((chart.dragLines || []).length >= MAX_DRAG_LINES) {
        alert("Máximo de " + MAX_DRAG_LINES + " linhas!");
        return;
      }

      const yS = getYS();

      if (!yS) {
        return;
      }

      chart.dragLines.push({
        y: Math.round((yS.min + yS.max) / 2),
        color,
        dragging: false
      });

      chart._selectedDragLine = chart.dragLines.length - 1;
      _saveDragLines(chart.dragLines);
      _atualizarContador(chart.dragLines);
      chart.update();
      _captureControlsToSetup(_getActiveSetup());
    };

    chart.deleteDragLine = () => {
      const idx = chart._selectedDragLine;

      if (idx >= 0 && idx < (chart.dragLines || []).length) {
        chart.dragLines.splice(idx, 1);
        chart._selectedDragLine = -1;
        _saveDragLines(chart.dragLines);
        _atualizarContador(chart.dragLines);
        chart.update();
        _captureControlsToSetup(_getActiveSetup());
      }
    };

    chart.clearDragLines = () => {
      chart.dragLines = [];
      chart._selectedDragLine = -1;
      _saveDragLines(chart.dragLines);
      _atualizarContador(chart.dragLines);
      chart.update();
      _captureControlsToSetup(_getActiveSetup());
    };

    const startDrag = evt => {
      const pxY = getEvtY(evt);
      const idx = nearestLine(pxY);

      if (idx >= 0) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        draggingIdx = idx;
        chart.dragLines[idx].dragging = true;
        chart._selectedDragLine = idx;
      } else {
        chart._selectedDragLine = -1;
      }

      _redraw(chart);
    };

    const moveDrag = evt => {
      if (draggingIdx < 0) {
        return;
      }

      if (evt.cancelable) {
        evt.preventDefault();
      }

      const yS = getYS();

      if (!yS) {
        return;
      }

      let v = yS.getValueForPixel(getEvtY(evt));
      v = Math.max(yS.min, Math.min(yS.max, Math.round(v * 10) / 10));
      chart.dragLines[draggingIdx].y = v;
      _redraw(chart);
    };

    const stopDrag = () => {
      if (draggingIdx >= 0) {
        if (chart.dragLines[draggingIdx]) {
          chart.dragLines[draggingIdx].dragging = false;
        }

        _saveDragLines(chart.dragLines);
        _captureControlsToSetup(_getActiveSetup());
      }

      draggingIdx = -1;
    };

    canvas.addEventListener("mousedown", startDrag);
    canvas.addEventListener("mousemove", moveDrag);
    canvas.addEventListener("mouseleave", stopDrag);
    window.addEventListener("mouseup", stopDrag);

    canvas.addEventListener("touchstart", startDrag, {
      passive: false
    });

    canvas.addEventListener("touchmove", moveDrag, {
      passive: false
    });

    canvas.addEventListener("touchend", stopDrag, {
      passive: true
    });

    canvas.addEventListener("touchcancel", stopDrag, {
      passive: true
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const chart = chartInstances.Copa || Object.values(chartInstances)[0];

        if (chart) {
          chart.deleteDragLine();
        }
      }
    });

    _atualizarContador(chart.dragLines);
  },
  afterDatasetsDraw(chart) {
    const yS = chart.scales.y;
    const lines = chart.dragLines || [];

    if (!lines.length || !chart.chartArea) {
      return;
    }

    const ctx = chart.ctx;

    const {
      left,
      right,
      top,
      bottom
    } = chart.chartArea;

    const PAD = 5;
    const BH = 16;

    lines.forEach((l, i) => {
      const yPx = yS.getPixelForValue(l.y);

      if (!isFinite(yPx) || yPx < top || yPx > bottom) {
        return;
      }

      const isSel = i === chart._selectedDragLine;
      ctx.save();
      ctx.strokeStyle = l.color || "#1fcc59";
      ctx.lineWidth = isSel ? 2 : 1.5;

      if (!isSel) {
        ctx.setLineDash([8, 4]);
      }

      ctx.beginPath();
      ctx.moveTo(left, yPx);
      ctx.lineTo(right, yPx);
      ctx.stroke();
      ctx.setLineDash([]);
      const text = l.y.toFixed(1);
      ctx.font = "600 10.5px 'Inter',Arial,sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      const bw = Math.ceil(ctx.measureText(text).width) + PAD * 2;
      const axisRight = yS.position === "right";
      const bx = axisRight ? left - 4 - bw : right + 4;
      const by = yPx - BH / 2;
      const br = 4;
      ctx.fillStyle = "rgba(13,16,26,0.96)";
      ctx.strokeStyle = l.color || "#1fcc59";
      ctx.lineWidth = isSel ? 1.5 : 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, BH, br);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = l.color || "#1fcc59";
      ctx.fillText(text, bx + PAD, yPx);
      ctx.restore();
    });
  }
};

/* ═══════════════════════════════════════════════════════════════════
   PLUGIN: FIBONACCI LIVRE (ARRASTÁVEL)
   Fibonacci desenhado manualmente entre dois pontos. Salvo por liga (DRAG_FIBS_KEY).
═══════════════════════════════════════════════════════════════════ */

const fibDraggablePlugin = {
  id: "fibDraggable",
  afterInit(chart) {
    const canvas = chart.canvas;
    chart.fibDraws = _loadDragFibs();
    chart._selectedFib = -1;
    chart._fibDrawMode = false;
    let creating = null;
    let draggingIdx = -1;
    let dragStartVal = 0;
    let dragOrigY1 = 0;
    let dragOrigY2 = 0;
    let dragStartXVal = 0;
    let dragOrigX1Frac = null;
    let dragOrigX2Frac = null;
    const HIT_PX = 8;
    const MIN_DRAG_PX = 12;
    const getYS = () => chart.scales.y;
    const getXS = () => chart.scales.x;

    const getEvtY = evt => {
      const r = canvas.getBoundingClientRect();
      return ((evt.touches && evt.touches[0]?.clientY) ?? evt.clientY ?? 0) - r.top;
    };

    const getEvtX = evt => {
      const r = canvas.getBoundingClientRect();
      return ((evt.touches && evt.touches[0]?.clientX) ?? evt.clientX ?? 0) - r.left;
    };

    const spanPx = f => {
      const {
        left,
        right
      } = chart.chartArea;

      const xS = getXS();

      const left2 = {
        x1: left,
        x2: right,
        anchored: false
      };

      if (f.x1Idx == null || f.x2Idx == null || !xS) {
        return left2;
      }

      let p1 = xS.getPixelForValue(f.x1Idx);
      let p2 = xS.getPixelForValue(f.x2Idx);

      const p12 = {
        x1: left,
        x2: right,
        anchored: false
      };

      if (!isFinite(p1) || !isFinite(p2)) {
        return p12;
      }

      if (p1 > p2) {
        [p1, p2] = [p2, p1];
      }

      return {
        x1: Math.max(left, p1),
        x2: Math.min(right, p2),
        anchored: true
      };
    };

    chart.setFibDrawMode = on => {
      chart._fibDrawMode = !!on;
      canvas.style.cursor = on ? "crosshair" : "";
    };

    chart.deleteFibSelected = () => {
      const idx = chart._selectedFib;

      if (idx >= 0 && idx < chart.fibDraws.length) {
        chart.fibDraws.splice(idx, 1);
        chart._selectedFib = -1;
        _saveDragFibs(chart.fibDraws);
        _atualizarContadorFibs(chart.fibDraws);
        chart.update();
        _captureControlsToSetup(_getActiveSetup());
      }
    };

    chart.clearFibDraws = () => {
      chart.fibDraws = [];
      chart._selectedFib = -1;
      _saveDragFibs(chart.fibDraws);
      _atualizarContadorFibs(chart.fibDraws);
      chart.update();
      _captureControlsToSetup(_getActiveSetup());
    };

    const nearestFib = (pxX, pxY) => {
      const yS = getYS();

      if (!yS || !chart.chartArea) {
        return -1;
      }

      const {
        top,
        bottom
      } = chart.chartArea;

      let best = -1;
      let bestDist = Infinity;

      (chart.fibDraws || []).forEach((f, i) => {
        const {
          x1,
          x2
        } = spanPx(f);

        if (pxX < x1 - 2 || pxX > x2 + 2) {
          return;
        }

        FIB_RETR_LEVELS.forEach(lvl => {
          const val = f.y1 + lvl / 100 * (f.y2 - f.y1);
          const ly = yS.getPixelForValue(val);

          if (ly < top || ly > bottom) {
            return;
          }

          const d = Math.abs(ly - pxY);

          if (d < bestDist && d <= HIT_PX) {
            bestDist = d;
            best = i;
          }
        });
      });

      return best;
    };

    const startEvt = evt => {
      const yS = getYS();

      if (!yS) {
        return;
      }

      const pxY = getEvtY(evt);
      const pxX = getEvtX(evt);

      if (chart._fibDrawMode) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        let v = yS.getValueForPixel(pxY);
        v = Math.max(yS.min, Math.min(yS.max, Math.round(v * 10) / 10));

        const creating2 = {
          y1: v,
          y2: v,
          x1Px: pxX,
          x2Px: pxX
        };

        creating = creating2;
        chart._selectedFib = -1;
        _redraw(chart);
        return;
      }

      const idx = nearestFib(pxX, pxY);

      if (idx >= 0) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        const xS = getXS();
        draggingIdx = idx;
        chart._selectedFib = idx;
        dragStartVal = yS.getValueForPixel(pxY);
        dragOrigY1 = chart.fibDraws[idx].y1;
        dragOrigY2 = chart.fibDraws[idx].y2;
        dragStartXVal = xS ? xS.getValueForPixel(pxX) : 0;
        dragOrigX1Frac = chart.fibDraws[idx].x1Idx ?? null;
        dragOrigX2Frac = chart.fibDraws[idx].x2Idx ?? null;
      } else {
        chart._selectedFib = -1;
      }

      _redraw(chart);
    };

    const moveEvt = evt => {
      const yS = getYS();

      if (!yS) {
        return;
      }

      const pxY = getEvtY(evt);
      const pxX = getEvtX(evt);

      if (creating) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        let v = yS.getValueForPixel(pxY);
        v = Math.max(yS.min, Math.min(yS.max, Math.round(v * 10) / 10));
        creating.y2 = v;
        creating.x2Px = pxX;
        _redraw(chart);
        return;
      }

      if (draggingIdx >= 0) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        const v = yS.getValueForPixel(pxY);
        const delta = v - dragStartVal;
        chart.fibDraws[draggingIdx].y1 = Math.round((dragOrigY1 + delta) * 10) / 10;
        chart.fibDraws[draggingIdx].y2 = Math.round((dragOrigY2 + delta) * 10) / 10;

        if (dragOrigX1Frac != null && dragOrigX2Frac != null) {
          const xS = getXS();

          if (xS) {
            const xv = xS.getValueForPixel(pxX);
            const deltaX = Math.round(xv - dragStartXVal);
            let nx1 = dragOrigX1Frac + deltaX;
            let nx2 = dragOrigX2Frac + deltaX;
            const labelsLen = (chart.data.labels || []).length;

            if (labelsLen > 0) {
              const lo = Math.min(nx1, nx2);
              const hi = Math.max(nx1, nx2);

              if (lo < 0) {
                nx1 -= lo;
                nx2 -= lo;
              }

              const hi2 = Math.max(nx1, nx2);

              if (hi2 > labelsLen - 1) {
                const over = hi2 - (labelsLen - 1);
                nx1 -= over;
                nx2 -= over;
              }
            }

            chart.fibDraws[draggingIdx].x1Idx = nx1;
            chart.fibDraws[draggingIdx].x2Idx = nx2;
          }
        }

        _redraw(chart);
      }
    };

    const endEvt = () => {
      if (creating) {
        const distY = Math.abs(creating.y2 - creating.y1);
        const distX = Math.abs(creating.x2Px - creating.x1Px);

        if (distY > 0) {
          if (chart.fibDraws.length >= MAX_DRAG_FIBS) {
            alert("Máximo de " + MAX_DRAG_FIBS + " fibonacci!");
          } else {
            const color = FIB_COLORS[chart.fibDraws.length % FIB_COLORS.length];
            let x1Frac = null;
            let x2Frac = null;

            if (distX >= MIN_DRAG_PX) {
              const xS = getXS();

              if (xS) {
                x1Frac = xS.getValueForPixel(creating.x1Px);
                x2Frac = xS.getValueForPixel(creating.x2Px);
              }
            }

            const chart2 = {
              y1: creating.y1,
              y2: creating.y2,
              x1Idx: x1Frac,
              x2Idx: x2Frac,
              color
            };

            chart.fibDraws.push(chart2);
            chart._selectedFib = chart.fibDraws.length - 1;
            _saveDragFibs(chart.fibDraws);
            _atualizarContadorFibs(chart.fibDraws);
            _captureControlsToSetup(_getActiveSetup());
          }
        }

        creating = null;
        chart.setFibDrawMode(false);
        chart.update();
      }

      if (draggingIdx >= 0) {
        _saveDragFibs(chart.fibDraws);
        _captureControlsToSetup(_getActiveSetup());
        draggingIdx = -1;
      }
    };

    canvas.addEventListener("mousedown", startEvt);
    canvas.addEventListener("mousemove", moveEvt);
    canvas.addEventListener("mouseleave", endEvt);
    window.addEventListener("mouseup", endEvt);

    canvas.addEventListener("touchstart", startEvt, {
      passive: false
    });

    canvas.addEventListener("touchmove", moveEvt, {
      passive: false
    });

    canvas.addEventListener("touchend", endEvt, {
      passive: true
    });

    canvas.addEventListener("touchcancel", endEvt, {
      passive: true
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const c = chartInstances.Copa || Object.values(chartInstances)[0];

        if (c) {
          c.deleteFibSelected();
        }
      }
    });

    chart._fibCreatingRef = () => creating;
    _atualizarContadorFibs(chart.fibDraws);
  },
  afterDatasetsDraw(chart) {
    const yS = chart.scales.y;

    if (!yS || !chart.chartArea) {
      return;
    }

    const ctx = chart.ctx;

    const {
      top,
      bottom
    } = chart.chartArea;

    const draw = (f, isSel, isPreview, span) => {
      const {
        x1: xa,
        x2: xb,
        anchored
      } = span;

      FIB_RETR_LEVELS.forEach(lvl => {
        const val = f.y1 + lvl / 100 * (f.y2 - f.y1);
        const yPx = yS.getPixelForValue(val);

        if (!isFinite(yPx) || yPx < top - 1 || yPx > bottom + 1) {
          return;
        }

        ctx.save();
        ctx.strokeStyle = f.color;
        ctx.lineWidth = isSel ? 1.8 : 1;
        ctx.globalAlpha = isPreview ? 0.55 : lvl === 0 || lvl === 100 ? 0.9 : 0.7;

        if (!isSel) {
          ctx.setLineDash([5, 4]);
        }

        ctx.beginPath();
        ctx.moveTo(xa, yPx);
        ctx.lineTo(xb, yPx);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = f.color;
        ctx.font = "600 9.5px 'Inter',Arial,sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(lvl + "%  " + val.toFixed(1), xa + 6, yPx - 7);
        ctx.restore();
      });

      const ax = anchored ? xa : xa + 16;
      const bx = anchored ? xb : xb - 16;

      [[f.y1, ax], [f.y2, bx]].forEach(([v, px]) => {
        const yPx = yS.getPixelForValue(v);

        if (!isFinite(yPx) || yPx < top || yPx > bottom) {
          return;
        }

        ctx.save();
        ctx.fillStyle = f.color;
        ctx.strokeStyle = "rgba(8,11,20,0.9)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px, yPx, isSel ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    };

    const spanPxSaved = f => {
      const {
        left,
        right
      } = chart.chartArea;

      const xS = chart.scales.x;

      const left2 = {
        x1: left,
        x2: right,
        anchored: false
      };

      if (f.x1Idx == null || f.x2Idx == null || !xS) {
        return left2;
      }

      let p1 = xS.getPixelForValue(f.x1Idx);
      let p2 = xS.getPixelForValue(f.x2Idx);

      const p12 = {
        x1: left,
        x2: right,
        anchored: false
      };

      if (!isFinite(p1) || !isFinite(p2)) {
        return p12;
      }

      if (p1 > p2) {
        [p1, p2] = [p2, p1];
      }

      return {
        x1: Math.max(left, p1),
        x2: Math.min(right, p2),
        anchored: true
      };
    };

    (chart.fibDraws || []).forEach((f, i) => draw(f, i === chart._selectedFib, false, spanPxSaved(f)));
    const creating = chart._fibCreatingRef ? chart._fibCreatingRef() : null;

    if (creating) {
      const {
        left,
        right
      } = chart.chartArea;

      const distX = Math.abs(creating.x2Px - creating.x1Px);
      const useSpan = distX >= 12;
      const xa = useSpan ? Math.min(creating.x1Px, creating.x2Px) : left;
      const xb = useSpan ? Math.max(creating.x1Px, creating.x2Px) : right;

      const draw2 = {
        y1: creating.y1,
        y2: creating.y2,
        color: "#E5E7EB"
      };

      const obj = {
        x1: xa,
        x2: xb,
        anchored: useSpan
      };

      draw(draw2, true, true, obj);
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════
   PLUGIN — LINHAS DE TENDÊNCIA LIVRES (LTA / LTB)
   O usuário clica em um ponto (ex.: um fundo) e arrasta até outro ponto
   (ex.: outro fundo mais recente) para traçar a linha. Ela fica fixa,
   com âncoras nas duas pontas — que podem ser arrastadas individualmente
   para ajuste fino — e uma projeção pontilhada que estende a linha até
   a borda direita do gráfico, exatamente como uma LTA/LTB é usada para
   ler a direção do preço. A linha inteira também pode ser arrastada
   segurando qualquer ponto do traço (fora das âncoras).
═══════════════════════════════════════════════════════════════════ */
const trendLinePlugin = {
  id: "trendLine",
  afterInit(chart) {
    const canvas = chart.canvas;
    chart.trendLines = _loadDragTrends();
    chart._selectedTrend = -1;
    chart._trendDrawMode = false;
    chart._trendPendingTipo = "LTA";
    let creating = null;
    let draggingIdx = -1;
    let draggingHandle = null;
    let dragStartXVal = 0;
    let dragStartYVal = 0;
    let dragOrig = null;
    const HIT_PX = 9;
    const getXS = () => chart.scales.x;
    const getYS = () => chart.scales.y;

    const getEvtY = evt => {
      const r = canvas.getBoundingClientRect();
      return ((evt.touches && evt.touches[0]?.clientY) ?? evt.clientY ?? 0) - r.top;
    };

    const getEvtX = evt => {
      const r = canvas.getBoundingClientRect();
      return ((evt.touches && evt.touches[0]?.clientX) ?? evt.clientX ?? 0) - r.left;
    };

    const pointPx = t => {
      const xS = getXS();
      const yS = getYS();

      if (!xS || !yS) {
        return null;
      }

      return {
        x1: xS.getPixelForValue(t.x1Idx),
        y1: yS.getPixelForValue(t.y1),
        x2: xS.getPixelForValue(t.x2Idx),
        y2: yS.getPixelForValue(t.y2)
      };
    };

    chart.setTrendDrawMode = (on, tipo) => {
      chart._trendDrawMode = !!on;

      if (tipo) {
        chart._trendPendingTipo = tipo;
      }

      canvas.style.cursor = on ? "crosshair" : "";
    };

    chart.deleteTrendSelected = () => {
      const idx = chart._selectedTrend;

      if (idx >= 0 && idx < chart.trendLines.length) {
        chart.trendLines.splice(idx, 1);
        chart._selectedTrend = -1;
        _saveDragTrends(chart.trendLines);
        _atualizarContadorTrends(chart.trendLines);
        chart.update();
        _captureControlsToSetup(_getActiveSetup());
      }
    };

    chart.clearTrendDraws = () => {
      chart.trendLines = [];
      chart._selectedTrend = -1;
      _saveDragTrends(chart.trendLines);
      _atualizarContadorTrends(chart.trendLines);
      chart.update();
      _captureControlsToSetup(_getActiveSetup());
    };

    const nearestTrend = (pxX, pxY) => {
      const chart2 = {
        idx: -1,
        handle: null
      };

      if (!chart.chartArea) {
        return chart2;
      }

      let best = -1;
      let bestDist = Infinity;
      let bestHandle = null;

      (chart.trendLines || []).forEach((t, i) => {
        const p = pointPx(t);

        if (!p) {
          return;
        }

        const dP1 = Math.hypot(p.x1 - pxX, p.y1 - pxY);
        const dP2 = Math.hypot(p.x2 - pxX, p.y2 - pxY);
        const dLine = _distToSegment(pxX, pxY, p.x1, p.y1, p.x2, p.y2);

        if (dP1 <= HIT_PX && dP1 < bestDist) {
          bestDist = dP1;
          best = i;
          bestHandle = "p1";
        }

        if (dP2 <= HIT_PX && dP2 < bestDist) {
          bestDist = dP2;
          best = i;
          bestHandle = "p2";
        }

        if (dLine <= HIT_PX && dLine < bestDist) {
          bestDist = dLine;
          best = i;
          bestHandle = "body";
        }
      });

      const bestHandle2 = {
        idx: best,
        handle: bestHandle
      };

      return bestHandle2;
    };

    const startEvt = evt => {
      const xS = getXS();
      const yS = getYS();

      if (!xS || !yS) {
        return;
      }

      const pxY = getEvtY(evt);
      const pxX = getEvtX(evt);

      if (chart._trendDrawMode) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        let v = yS.getValueForPixel(pxY);
        v = Math.round(v * 10) / 10;

        const creating2 = {
          x1Px: pxX,
          y1: v,
          x2Px: pxX,
          y2: v
        };

        creating = creating2;
        chart._selectedTrend = -1;
        _redraw(chart);
        return;
      }

      const {
        idx,
        handle
      } = nearestTrend(pxX, pxY);

      if (idx >= 0) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        draggingIdx = idx;
        draggingHandle = handle;
        chart._selectedTrend = idx;
        dragStartXVal = xS.getValueForPixel(pxX);
        dragStartYVal = yS.getValueForPixel(pxY);

        const dragOrig2 = {
          ...chart.trendLines[idx]
        };

        dragOrig = dragOrig2;
      } else {
        chart._selectedTrend = -1;
      }

      _redraw(chart);
    };

    const moveEvt = evt => {
      const xS = getXS();
      const yS = getYS();

      if (!xS || !yS) {
        return;
      }

      const pxY = getEvtY(evt);
      const pxX = getEvtX(evt);

      if (creating) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        let v = yS.getValueForPixel(pxY);
        creating.y2 = Math.round(v * 10) / 10;
        creating.x2Px = pxX;
        _redraw(chart);
        return;
      }

      if (draggingIdx >= 0) {
        if (evt.cancelable) {
          evt.preventDefault();
        }

        const t = chart.trendLines[draggingIdx];

        if (draggingHandle === "p1") {
          t.x1Idx = Math.round(xS.getValueForPixel(pxX));
          t.y1 = Math.round(yS.getValueForPixel(pxY) * 10) / 10;
        } else if (draggingHandle === "p2") {
          t.x2Idx = Math.round(xS.getValueForPixel(pxX));
          t.y2 = Math.round(yS.getValueForPixel(pxY) * 10) / 10;
        } else {
          const dxVal = xS.getValueForPixel(pxX) - dragStartXVal;
          const dyVal = yS.getValueForPixel(pxY) - dragStartYVal;
          t.x1Idx = Math.round(dragOrig.x1Idx + dxVal);
          t.x2Idx = Math.round(dragOrig.x2Idx + dxVal);
          t.y1 = Math.round((dragOrig.y1 + dyVal) * 10) / 10;
          t.y2 = Math.round((dragOrig.y2 + dyVal) * 10) / 10;
        }

        _redraw(chart);
      }
    };

    const endEvt = () => {
      if (creating) {
        const distPx = Math.abs(creating.x2Px - creating.x1Px);

        if (distPx > 4) {
          if (chart.trendLines.length >= MAX_DRAG_TRENDS) {
            alert("Máximo de " + MAX_DRAG_TRENDS + " linhas de tendência!");
          } else {
            const xS = getXS();
            const x1Idx = Math.round(xS.getValueForPixel(creating.x1Px));
            const x2Idx = Math.round(xS.getValueForPixel(creating.x2Px));
            const tipo = chart._trendPendingTipo || "LTA";
            const color = TREND_COLORS[tipo] || "#34D399";

            const chart2 = {
              x1Idx,
              y1: creating.y1,
              x2Idx,
              y2: creating.y2,
              color,
              tipo
            };

            chart.trendLines.push(chart2);
            chart._selectedTrend = chart.trendLines.length - 1;
            _saveDragTrends(chart.trendLines);
            _atualizarContadorTrends(chart.trendLines);
            _captureControlsToSetup(_getActiveSetup());
          }
        }

        creating = null;
        chart.setTrendDrawMode(false);
        chart.update();
      }

      if (draggingIdx >= 0) {
        _saveDragTrends(chart.trendLines);
        _captureControlsToSetup(_getActiveSetup());
      }

      draggingIdx = -1;
      draggingHandle = null;
    };

    canvas.addEventListener("mousedown", startEvt);
    canvas.addEventListener("mousemove", moveEvt);
    canvas.addEventListener("mouseleave", endEvt);
    window.addEventListener("mouseup", endEvt);

    canvas.addEventListener("touchstart", startEvt, {
      passive: false
    });

    canvas.addEventListener("touchmove", moveEvt, {
      passive: false
    });

    canvas.addEventListener("touchend", endEvt, {
      passive: true
    });

    canvas.addEventListener("touchcancel", endEvt, {
      passive: true
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const c = chartInstances.Copa || Object.values(chartInstances)[0];

        if (c) {
          c.deleteTrendSelected();
        }
      }
    });

    chart._trendCreatingRef = () => creating;
    _atualizarContadorTrends(chart.trendLines);
  },
  afterDatasetsDraw(chart) {
    const xS = chart.scales.x;
    const yS = chart.scales.y;

    if (!xS || !yS || !chart.chartArea) {
      return;
    }

    const ctx = chart.ctx;

    const {
      right
    } = chart.chartArea;

    const drawLine = (x1Idx, y1, x2Idx, y2, color, isSel, isPreview, tipo) => {
      const p1x = xS.getPixelForValue(x1Idx);
      const p1y = yS.getPixelForValue(y1);
      const p2x = xS.getPixelForValue(x2Idx);
      const p2y = yS.getPixelForValue(y2);

      if (![p1x, p1y, p2x, p2y].every(isFinite)) {
        return;
      }

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = isSel ? 2.2 : 1.6;
      ctx.globalAlpha = isPreview ? 0.6 : 1;
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();

      if (p2x !== p1x) {
        const slope = (p2y - p1y) / (p2x - p1x);
        const extY = p2y + slope * (right - p2x);
        ctx.setLineDash([6, 5]);
        ctx.globalAlpha = isPreview ? 0.4 : 0.65;
        ctx.beginPath();
        ctx.moveTo(p2x, p2y);
        ctx.lineTo(right, extY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.globalAlpha = 1;

      if (!isPreview) {
        [[p1x, p1y], [p2x, p2y]].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.strokeStyle = "rgba(8,11,20,0.9)";
          ctx.lineWidth = 1.2;
          ctx.arc(px, py, isSel ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });

        if (tipo) {
          ctx.font = "600 9.5px 'Inter',Arial,sans-serif";
          ctx.fillStyle = color;
          ctx.textAlign = "left";
          ctx.textBaseline = "bottom";
          ctx.fillText(tipo, p2x + 6, p2y - 4);
        }
      }

      ctx.restore();
    };

    (chart.trendLines || []).forEach((t, i) => {
      drawLine(t.x1Idx, t.y1, t.x2Idx, t.y2, t.color, i === chart._selectedTrend, false, t.tipo);
    });

    const creating = chart._trendCreatingRef ? chart._trendCreatingRef() : null;

    if (creating) {
      const x1Idx = xS.getValueForPixel(creating.x1Px);
      const x2Idx = xS.getValueForPixel(creating.x2Px);
      const previewColor = TREND_COLORS[chart._trendPendingTipo] || "#E5E7EB";
      drawLine(x1Idx, creating.y1, x2Idx, creating.y2, previewColor, true, true, null);
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════
   CRIAÇÃO E ATUALIZAÇÃO DO GRÁFICO
   createStatsChart monta o Chart.js (datasets, plugins, tooltip).
   updateStatsChart só troca os dados de um gráfico que já existe.
═══════════════════════════════════════════════════════════════════ */

Chart.defaults.animation.duration = 0;
Chart.defaults.font.family = "'Inter','Segoe UI',system-ui,-apple-system,Arial,sans-serif";

// Linha principal de um mercado.
function _newMainDataset(label, data, setup) {
  const key = labelToKey[label];
  const color = _marketColor(setup, label);

  return {
    label,
    data: data[key],
    borderColor: color,
    backgroundColor: color,
    pointBackgroundColor: data[key + "Colors"],
    pointBorderColor: "rgba(8,11,20,0.9)",
    pointBorderWidth: 1.5,
    borderWidth: 2.5,
    pointRadius: 3.5,
    pointHoverRadius: 6,
    pointHoverBorderWidth: 2,
    tension: 0.3,
    cubicInterpolationMode: "monotone",
    borderCapStyle: "round",
    borderJoinStyle: "round",
    fill: false,
    yAxisID: label === "Gols Individual" ? "y2" : "y",
    hidden: !statsChartVisibleDatasets[label]
  };
}

// Média móvel (curta ou longa) de um mercado.
function _newMaDataset(label, kind, data) {
  const key = labelToKey[label];
  const isShort = kind === "Short";

  return {
    label: label + (isShort ? " - Short MA" : " - Long MA"),
    data: data[key + kind],
    borderColor: isShort ? "#38BDF8" : "#F59E0B",
    backgroundColor: "transparent",
    tension: 0.3,
    cubicInterpolationMode: "monotone",
    borderWidth: 1.75,
    borderDash: isShort ? [4, 3] : [2, 3],
    pointRadius: 0,
    fill: false,
    yAxisID: label === "Gols Individual" ? "y2" : "y",
    hidden: !showMovingAverages || !statsChartVisibleDatasets[label]
  };
}

// Monta a lista de datasets só com os mercados do setup (reaproveita os que já existem).
function _buildDatasetList(data, setup, existing) {
  const wanted = _wantedLabels();
  const byLabel = new Map((existing || []).map(d => [d.label, d]));
  const list = [];

  Object.keys(labelToKey).forEach(label => {
    if (!wanted.has(label)) {
      return;
    }

    list.push(byLabel.get(label) || _newMainDataset(label, data, setup));

    if (showMovingAverages) {
      list.push(byLabel.get(label + " - Short MA") || _newMaDataset(label, "Short", data));
      list.push(byLabel.get(label + " - Long MA") || _newMaDataset(label, "Long", data));
    }
  });

  return list;
}

// Ajusta os datasets do gráfico ao setup ativo. Devolve true se a lista mudou.
function _syncChartDatasets(chart, data) {
  const list = _buildDatasetList(data, _getActiveSetup(), chart.data.datasets);
  const cur = chart.data.datasets;
  const same = list.length === cur.length && list.every((d, i) => d === cur[i]);

  if (same) {
    return false;
  }

  chart.data.datasets = list;

  chart.data.datasets.forEach((ds, idx) => {
    const isMA = ds.label.includes(" - ");
    const main = isMA ? ds.label.split(" - ")[0] : ds.label;
    const vis = statsChartVisibleDatasets[main];
    chart.getDatasetMeta(idx).hidden = isMA ? !showMovingAverages || !vis : !vis;
  });

  return true;
}

// Redesenha o gráfico SEM recalcular nada (usado ao arrastar linhas/Fibonacci/tendências).
function _redraw(chart) {
  if (chart._rafDraw) {
    return;
  }

  chart._rafDraw = requestAnimationFrame(() => {
    chart._rafDraw = 0;
    chart.draw();
  });
}

// Cria o gráfico Chart.js de uma liga (datasets, escalas, plugins e tooltip).
function createStatsChart(ctx, labels, data, league) {
  const activeSetup = _getActiveSetup();
  const datasets = _buildDatasetList(data, activeSetup, []);

  const obj = {
    labels,
    datasets
  };

  const layout = {
    padding: yAxisPosition === "right" ? {
      top: 30,
      left: 80
    } : {
      top: 30,
      right: 80
    }
  };

  const linhaAtualOpts = {
    enabled: activeSetup.linhaAtual ?? true
  };

  return new Chart(ctx, {
    type: "line",
    data: obj,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      layout: layout,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(15,18,28,0.92)",
          titleColor: "#7DE3D6",
          titleFont: {
            weight: "600",
            size: 12
          },
          bodyColor: "#E5E7EB",
          bodyFont: {
            size: 11.5
          },
          borderColor: "rgba(125,227,214,0.35)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          caretPadding: 26,
          padding: 12,
          callbacks: {
            title: items => {
              const sd = chartData[league];
              const jogo = sd[Math.max(0, sd.length - numPoints) + items[0].dataIndex];

              if (jogo) {
                return jogo.hora + ":" + jogo.minuto.toString().padStart(2, "0");
              } else {
                return "";
              }
            },
            label: tooltipCtx => {
              const value = tooltipCtx.parsed.y;

              if (value === null) {
                return "";
              }

              const isGols = tooltipCtx.dataset.label === "Gols FT" || tooltipCtx.dataset.label === "Gols HT" || tooltipCtx.dataset.label === "Gols Individual" || tooltipCtx.dataset.label === "Gols FT Casa" || tooltipCtx.dataset.label === "Gols FT Fora";

              if (isGols) {
                return tooltipCtx.dataset.label + ": " + value + " gols";
              } else {
                return tooltipCtx.dataset.label + ": " + value.toFixed(2) + "%";
              }
            },
            afterBody: items => {
              const sd = chartData[league];
              const m = sd[Math.max(0, sd.length - numPoints) + items[0].dataIndex];

              if (m) {
                return "FT: " + (m.ft || "N/A") + "  HT: " + (m.ht || "N/A");
              } else {
                return "";
              }
            }
          }
        },
        linhaAtual: linhaAtualOpts
      },
      scales: {
        x: {
          ticks: {
            display: false
          },
          grid: {
            display: false
          }
        },
        y: {
          position: yAxisPosition,
          beginAtZero: false,
          ticks: {
            color: "#8B92A8",
            font: {
              size: 11
            },
            stepSize: 5,
            padding: 8
          },
          grid: {
            color: "rgba(148,163,184,0.09)",
            lineWidth: 1,
            drawTicks: false
          },
          border: {
            display: false
          },
          afterFit: s => {
            s.paddingTop = 20;
          }
        },
        y2: {
          position: "right",
          beginAtZero: true,
          min: 0,
          max: 10,
          ticks: {
            color: "rgba(148,163,184,0.35)",
            stepSize: 1,
            precision: 0
          },
          grid: {
            display: false
          },
          border: {
            display: false
          },
          afterFit: s => {
            s.width = 0;
          }
        }
      }
    },
    plugins: [fibonacciLinesPlugin, fibDraggablePlugin, linhaAtualPlugin, linhaDraggablePlugin, trendLinePlugin, rotulosPlugin]
  });
}

// Troca os dados do gráfico existente e atualiza o painel de valores.
function updateStatsChart(chart, newData) {
  if (!chart) {
    return;
  }

  _syncChartDatasets(chart, newData);
  chart.data.labels = newData.labels;

  chart.data.datasets.forEach(ds => {
    ds.data = newData[getKeyFromLabel(ds.label)];

    if (!ds.label.includes(" MA")) {
      ds.pointBackgroundColor = newData[getKeyFromLabel(ds.label) + "Colors"];
    }
  });

  chart.update();
  _updateLinesPanelValues();
}

/* ═══════════════════════════════════════════════════════════════════
   PROCESSAMENTO DE DADOS
═══════════════════════════════════════════════════════════════════ */
// Regras de cada mercado: dado um jogo já lido (g), diz se ele "conta" no mercado.
// A mesma regra pinta o ponto de verde/vermelho (jogo atual) e alimenta o % da janela.
// Para ADICIONAR um mercado novo basta incluir a chave aqui (e em labelToKey/DATASET_COLORS/MARKET_GROUPS).
const MARKET_DEFS = {
  casaVence: g => g.f0 > g.f1,
  empate: g => g.f0 === g.f1,
  foraVence: g => g.f0 < g.f1,
  ambasSim: g => g.f0 > 0 && g.f1 > 0,
  ambasNao: g => g.f0 === 0 || g.f1 === 0,
  over05: g => g.tg > 0.5,
  over15: g => g.tg > 1.5,
  over25: g => g.tg > 2.5,
  over35: g => g.tg > 3.5,
  over5: g => g.tg >= 5,
  under05: g => g.tg <= 0.5,
  under15: g => g.tg < 1.5,
  under25: g => g.tg < 2.5,
  under35: g => g.tg < 3.5,
  placarHTOut: g => g.htStr === "OUT",
  overHT: g => g.htTotal >= 2,
  // underHT: conta quando NÃO é overHT; a cor usa htTotal < 2 (igual ao comportamento original)
  underHT: {
    c: g => !(g.htTotal >= 2),
    k: g => g.htTotal < 2
  },
  casaHT: g => !!g.hp && g.hp[0] > g.hp[1],
  empateHT: g => !!g.hp && g.hp[0] === g.hp[1],
  foraHT: g => !!g.hp && g.hp[0] < g.hp[1],
  viradinha: g => !!g.hp && (g.hp[0] > g.hp[1] && g.f0 < g.f1 || g.hp[0] < g.hp[1] && g.f0 > g.f1),
  par: g => g.tg % 2 === 0,
  impar: g => g.tg % 2 !== 0,
  margem1: g => g.margem === 1,
  margem2: g => g.margem === 2,
  margem3: g => g.margem === 3,
  empateGols: g => g.f0 === g.f1 && g.tg > 0
};

for (let n = 0; n <= 5; n++) {
  MARKET_DEFS["gol" + n] = g => g.tg === n;
}

for (let n = 0; n <= 4; n++) {
  MARKET_DEFS["gol2t" + n] = g => g.g2t === n;
  MARKET_DEFS["casa" + n] = g => g.f0 === n;
  MARKET_DEFS["fora" + n] = g => g.f1 === n;
}

[[0, 0], [1, 0], [2, 0], [3, 0], [2, 1], [3, 1], [3, 2], [4, 0], [4, 1], [0, 1], [0, 2], [1, 2], [0, 3], [1, 3], [2, 3], [0, 4], [1, 4]].forEach(([a, b]) => {
  MARKET_DEFS["placar" + a + "x" + b] = g => g.f0 === a && g.f1 === b;
});

[[0, 0], [0, 1], [1, 0], [1, 1], [0, 2], [2, 0]].forEach(([a, b]) => {
  MARKET_DEFS["placarHT" + a + "x" + b] = g => !!g.hp && g.hp[0] === a && g.hp[1] === b;
});

// Mercados que SOMAM valores na janela (não são porcentagem) e têm cor fixa.
const MARKET_SUMS = {
  golsFT: {
    v: g => g.tg,
    color: "#FFFF00"
  },
  golsHT: {
    v: g => g.htTotal,
    color: "#26A69A"
  },
  golsFTCasa: {
    v: g => g.f0,
    color: "#00E5FF"
  },
  golsFTFora: {
    v: g => g.f1,
    color: "#FF6E40"
  }
};

function _golsIndColor(tg) {
  return tg >= 5 ? "#2ecc71" : tg >= 3 ? "#3498db" : tg === 2 ? "#f1c40f" : tg === 1 ? "#e67e22" : "#e74c3c";
}

// Mercados (labels) do setup ativo — só estes são calculados e desenhados.
function _wantedLabels() {
  const setup = _getActiveSetup();
  return new Set((setup.markets || []).filter(label => labelToKey[label]));
}

function processApiData(data, league) {
  // Ordena uma vez só (a data é lida 1x por jogo, não a cada comparação).
  const withT = data.map(m => ({
    m,
    t: new Date(m.data).getTime()
  }));

  withT.sort((a, b) => {
    if (a.t !== b.t) {
      return a.t - b.t;
    }

    if (a.m.hora !== b.m.hora) {
      return a.m.hora - b.m.hora;
    }

    return a.m.minuto - b.m.minuto;
  });

  const sliced = withT.slice(-numPoints - Math.ceil(averagePoints * 3.5));
  chartData[league] = sliced.map(x => x.m);
  const n = sliced.length;

  // Lê cada jogo uma única vez (placar FT, HT, gols...).
  const games = new Array(n);
  const ts = new Array(n);

  for (let i = 0; i < n; i++) {
    const m = sliced[i].m;
    ts[i] = Math.floor(sliced[i].t / 86400000) * 1440 + m.hora * 60 + m.minuto;
    let f0 = 0;
    let f1 = 0;

    if (m.ft?.includes(" x ")) {
      const p = m.ft.split(" x ").map(Number);
      f0 = p[0];
      f1 = p[1];
    }

    const htTotal = parseHtScoreTotal(m.ht);
    const tg = f0 + f1;

    games[i] = {
      f0,
      f1,
      tg,
      htStr: m.ht,
      htTotal,
      hp: parseHtParts(m.ht),
      g2t: Math.max(0, tg - htTotal),
      margem: Math.abs(f0 - f1)
    };
  }

  // Só os mercados do setup ativo.
  const wanted = _wantedLabels();
  const keys = [];

  Object.keys(labelToKey).forEach(label => {
    if (wanted.has(label)) {
      keys.push(labelToKey[label]);
    }
  });

  // Somas acumuladas: o valor de qualquer janela vira uma subtração (rápido).
  const pre = {};

  keys.forEach(key => {
    if (key === "golsInd") {
      return;
    }

    const sum = MARKET_SUMS[key];
    const def = MARKET_DEFS[key];

    if (!sum && !def) {
      return;
    }

    const count = sum ? sum.v : typeof def === "function" ? def : def.c;
    const arr = new Float64Array(n + 1);

    for (let i = 0; i < n; i++) {
      arr[i + 1] = arr[i] + (sum ? count(games[i]) : count(games[i]) ? 1 : 0);
    }

    pre[key] = arr;
  });

  const green = "#2DD4BF";
  const red = "#FB7185";
  const janelaMin = averagePoints * _MIN_POR_JOGO;
  const startExibir = Math.max(0, n - numPoints);
  const labels = [];
  const output = {
    labels
  };

  keys.forEach(key => {
    output[key] = [];
    output[key + "Colors"] = [];
  });

  for (let i = startExibir; i < n; i++) {
    const m = sliced[i].m;
    const g = games[i];
    labels.push(m.hora + ":" + m.minuto.toString().padStart(2, "0"));

    // Início da janela: jogos dentro de janelaMin minutos antes deste.
    let lo = i;

    while (lo > 0 && !(ts[i] - ts[lo - 1] > janelaMin)) {
      lo--;
    }

    const valid = i - lo + 1;

    keys.forEach(key => {
      if (key === "golsInd") {
        output.golsInd.push(g.tg);
        output.golsIndColors.push(_golsIndColor(g.tg));
        return;
      }

      const p = pre[key];

      if (!p) {
        return;
      }

      const total = p[i + 1] - p[lo];
      const sum = MARKET_SUMS[key];

      if (sum) {
        output[key].push(total);
        output[key + "Colors"].push(sum.color);
        return;
      }

      const def = MARKET_DEFS[key];
      const colorFn = typeof def === "function" ? def : def.k;
      output[key].push(total / valid * 100);
      output[key + "Colors"].push(colorFn(g) ? green : red);
    });
  }

  // Médias móveis: só quando estão ligadas, e só para os mercados do setup.
  if (showMovingAverages) {
    keys.forEach(key => {
      output[key + "Short"] = computeMA(output[key], _QBLOC);
      output[key + "Long"] = computeMA(output[key], _JPH);
    });
  }

  return output;
}

/* ═══════════════════════════════════════════════════════════════════
   UPDATE / EVENT LISTENERS
═══════════════════════════════════════════════════════════════════ */
// Último texto recebido da API, dados lidos e configuração usada, por liga.
const _lastText = {};
const _lastRaw = {};
const _lastSig = {};

// Resumo das configurações que mudam os cálculos (se mudar, reprocessa).
function _settingsSig() {
  return [numPoints, averagePoints, showMovingAverages, [..._wantedLabels()].join(",")].join("|");
}

// Processa os dados e cria/atualiza o gráfico da liga.
function _renderLeague(league, data) {
  const pd = processApiData(data, league);
  const canvas = document.getElementById(league);

  if (!canvas) {
    return;
  }

  if (!chartInstances[league]) {
    chartInstances[league] = createStatsChart(canvas.getContext("2d"), pd.labels, pd, league);
    _applySetup(_getActiveSetup());
  } else {
    updateStatsChart(chartInstances[league], pd);
  }
}

// Refaz o gráfico com os últimos dados já baixados (sem nova requisição). Devolve false se não há dados.
function _refreshFromCache() {
  let did = false;

  leagues.forEach(league => {
    if (!_lastRaw[league]) {
      return;
    }

    _lastSig[league] = _settingsSig();
    _renderLeague(league, _lastRaw[league]);
    did = true;
  });

  return did;
}

function updateCharts() {
  if (!_tabVisible) {
    return;
  }

  const ts = new Date().getTime();

  leagues.forEach(league => {
    fetch(ROTAS_API.resultados(LIGA_ATUAL) + ("?timestamp=" + ts)).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.text();
    }).then(text => {
      const sig = _settingsSig();

      // Mesmos dados e mesmas configurações: nada a recalcular nem redesenhar.
      if (chartInstances[league] && _lastText[league] === text && _lastSig[league] === sig) {
        return;
      }

      const data = JSON.parse(text);
      _lastText[league] = text;
      _lastRaw[league] = data;
      _lastSig[league] = sig;
      _renderLeague(league, data);
    }).catch(e => console.error("Erro " + league + ":", e));
  });
}

// Liga/desliga as linhas de Fibonacci automáticas.
function toggleFibonacciLines() {
  showFibonacciLines = document.getElementById("fibonacciToggle").checked;

  leagues.forEach(league => {
    if (chartInstances[league]) {
      chartInstances[league].update();
    }
  });

  _captureControlsToSetup(_getActiveSetup());
}

// Liga/desliga as médias móveis (curta e longa).
function toggleMovingAverages() {
  showMovingAverages = document.getElementById("movingAveragesToggle").checked;

  if (!_refreshFromCache()) {
    updateCharts();
  }

  _captureControlsToSetup(_getActiveSetup());
}

/* ── POSIÇÃO DO EIXO (%): preferência do usuário, esquerda ou direita ── */
function setYAxisPosition(position) {
  yAxisPosition = position === "right" ? "right" : "left";
  _lsSet(Y_AXIS_POS_KEY, yAxisPosition);

  leagues.forEach(league => {
    const ci = chartInstances[league];

    if (!ci) {
      return;
    }

    ci.options.scales.y.position = yAxisPosition;

    ci.options.layout.padding = yAxisPosition === "right" ? {
      top: 30,
      left: 80
    } : {
      top: 30,
      right: 80
    };

    ci.update();
  });
}

/* ═══════════════════════════════════════════════════════════════════
   CONTROLES DA PÁGINA (selects e toggles do HTML)
   Cada controle abaixo altera uma variável global e chama updateCharts().
═══════════════════════════════════════════════════════════════════ */

document.getElementById("pointsSelector").addEventListener("change", e => {
  numPoints = parseInt(e.target.value, 10);

  if (!_refreshFromCache()) {
    updateCharts();
  }

  _captureControlsToSetup(_getActiveSetup());
});

document.getElementById("averageSelector").addEventListener("change", e => {
  averagePoints = parseInt(e.target.value, 10);

  if (!_refreshFromCache()) {
    updateCharts();
  }

  _captureControlsToSetup(_getActiveSetup());
});

document.getElementById("fibonacciToggle").addEventListener("change", toggleFibonacciLines);
document.getElementById("movingAveragesToggle").addEventListener("change", toggleMovingAverages);
const yAxisSel = document.getElementById("yAxisPositionSelector");

if (yAxisSel) {
  yAxisSel.value = yAxisPosition;
  yAxisSel.addEventListener("change", e => setYAxisPosition(e.target.value));
}

document.getElementById("linhaAtualToggle").addEventListener("change", function () {
  leagues.forEach(l => {
    const ci = chartInstances[l];

    if (!ci) {
      return;
    }

    ci.options.plugins.linhaAtual.enabled = this.checked;
    ci.update("active");
  });

  _captureControlsToSetup(_getActiveSetup());
});

document.getElementById("labelsToggle").addEventListener("change", function () {
  showLabels = this.checked;

  leagues.forEach(l => {
    if (chartInstances[l]) {
      chartInstances[l].update();
    }
  });

  _captureControlsToSetup(_getActiveSetup());
});

/* ═══════════════════════════════════════════════════════════════════
   PAINÉIS DE FERRAMENTAS (linhas, Fibonacci, tendências)
   Abre/fecha os painéis dos botões #btnLinhaTools, #btnFibTools e #btnTrendTools.
   Clicar fora fecha todos.
═══════════════════════════════════════════════════════════════════ */

(function () {
  const btnLinha = document.getElementById("btnLinhaTools");
  const pLinha = document.getElementById("linhaToolsPanel");
  const btnFib = document.getElementById("btnFibTools");
  const pFib = document.getElementById("fibToolsPanel");
  const btnTrend = document.getElementById("btnTrendTools");
  const pTrend = document.getElementById("trendToolsPanel");

  if (!btnLinha) {
    console.error("[grafico] elemento #btnLinhaTools não encontrado no HTML");
  }

  if (!pLinha) {
    console.error("[grafico] elemento #linhaToolsPanel não encontrado no HTML");
  }

  if (!btnFib) {
    console.error("[grafico] elemento #btnFibTools não encontrado no HTML");
  }

  if (!pFib) {
    console.error("[grafico] elemento #fibToolsPanel não encontrado no HTML");
  }

  if (!btnTrend) {
    console.error("[grafico] elemento #btnTrendTools não encontrado no HTML");
  }

  if (!pTrend) {
    console.error("[grafico] elemento #trendToolsPanel não encontrado no HTML");
  }

  if (btnLinha && pLinha) {
    btnLinha.addEventListener("click", e => {
      e.stopPropagation();
      pLinha.style.display = pLinha.style.display === "none" ? "block" : "none";
    });

    pLinha.addEventListener("click", e => e.stopPropagation());
  }

  if (btnFib && pFib) {
    btnFib.addEventListener("click", e => {
      e.stopPropagation();
      pFib.style.display = pFib.style.display === "none" ? "block" : "none";
    });

    pFib.addEventListener("click", e => e.stopPropagation());
  }

  if (btnTrend && pTrend) {
    btnTrend.addEventListener("click", e => {
      e.stopPropagation();
      pTrend.style.display = pTrend.style.display === "none" ? "block" : "none";
    });

    pTrend.addEventListener("click", e => e.stopPropagation());
  }

  document.addEventListener("click", () => {
    if (pLinha) {
      pLinha.style.display = "none";
    }

    if (pFib) {
      pFib.style.display = "none";
    }

    if (pTrend) {
      pTrend.style.display = "none";
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   FUNÇÕES GLOBAIS (chamadas pelos botões do HTML)
   Cada uma pega o gráfico atual e repassa o comando para o plugin correspondente.
═══════════════════════════════════════════════════════════════════ */

window.adicionarLinhaDraggable = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.addDragLine(document.getElementById("lineColorPicker")?.value || "#1fcc59");
  }
};

window.deletarLinhaSelecionada = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.deleteDragLine();
  }
};

window.limparTodasLinhas = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.clearDragLines();
  }
};

window.ativarDesenhoFibonacci = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.setFibDrawMode(true);
  }
};

window.deletarFibonacciSelecionado = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.deleteFibSelected();
  }
};

window.limparFibonacciLivre = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.clearFibDraws();
  }
};

window.ativarDesenhoLTA = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.setTrendDrawMode(true, "LTA");
  }
};

window.ativarDesenhoLTB = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.setTrendDrawMode(true, "LTB");
  }
};

window.deletarTendenciaSelecionada = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.deleteTrendSelected();
  }
};

window.limparTendencias = () => {
  const c = chartInstances.Copa || Object.values(chartInstances)[0];

  if (c) {
    c.clearTrendDraws();
  }
};

/* ═══════════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
═══════════════════════════════════════════════════════════════════ */

window.onload = () => {
  updateCharts();
  _renderSetupBar();
  _renderLinesPanel(_getActiveSetup());
  _updateSetupCounter();
};

setInterval(updateCharts, 3000);