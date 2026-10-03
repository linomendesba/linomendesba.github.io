// ── BetGreen (12 jogos/hora) ─────────────────────────────────────────────
// BS_JOGOS_POR_HORA / BS_QD_BLOCO / BS_KEY_SUFIXO vêm do template HTML (index.html da BetGreen).
// Em páginas que não definem essas constantes, tudo cai no padrão de 20 jogos/hora (sem mudança).
const _JPH   = (typeof BS_JOGOS_POR_HORA !== "undefined") ? BS_JOGOS_POR_HORA : 20; // jogos por hora
const _QBLOC = (typeof BS_QD_BLOCO       !== "undefined") ? BS_QD_BLOCO       : 5;  // jogos por quadrante
const _KSUF  = (typeof BS_KEY_SUFIXO     !== "undefined") ? BS_KEY_SUFIXO     : "";
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
const TREND_COLORS = {
  LTA: "#34D399",
  LTB: "#F87171"
};
let numPoints = _JPH;            // 1 hora
let averagePoints = _JPH - 1;   // base = 1 hora (índice)
let showFibonacciLines = false;
let showMovingAverages = false;
let showLabels = false;
let yAxisPosition = _ls(Y_AXIS_POS_KEY, "left");
const leagues = ["Copa"];
const chartInstances = {};
let chartData = {};
function _ligaAtual() {
  if (typeof window.getLigaKey === "function") {
    try {
      const _0x2b7292 = window.getLigaKey();
      if (_0x2b7292) {
        return _0x2b7292;
      }
    } catch {}
  }
  const _0x587a8d = document.querySelector("#resultDisplay h4.custom-color") || document.querySelector("h4.custom-color");
  const _0x48f27f = _0x587a8d && _0x587a8d.textContent ? _0x587a8d.textContent.trim() : "";
  if (_0x48f27f) {
    return _0x48f27f.toLowerCase().replace(/\s+/g, "_");
  }
  if (leagues && leagues[0]) {
    return leagues[0];
  } else {
    return "default";
  }
}
function _ligaKey(_0x295a10) {
  return _0x295a10 + ":" + _ligaAtual();
}
let _tabVisible = !document.hidden;
document.addEventListener("visibilitychange", () => {
  _tabVisible = !document.hidden;
  if (_tabVisible) {
    updateCharts();
  }
});
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
function _ls(_0x119e56, _0x4f4e67) {
  try {
    const _0x5a013e = localStorage.getItem(_0x119e56);
    if (_0x5a013e !== null) {
      return JSON.parse(_0x5a013e);
    } else {
      return _0x4f4e67;
    }
  } catch {
    return _0x4f4e67;
  }
}
function _lsSet(_0x5384a1, _0x937023) {
  try {
    localStorage.setItem(_0x5384a1, JSON.stringify(_0x937023));
  } catch {}
}
const SETUP_PADRAO = {
  id: "__padrao__",
  name: "Padrão",
  markets: [],
  colors: {},
  horas: 8 * _JPH,   // 8 horas
  base: _JPH - 1,
  fibonacci: false,
  mediasMoveis: false,
  linhaAtual: true,
  labels: false,
  dragLines: [],
  fibDraws: [],
  trendLines: []
};
function _loadCustomSetups() {
  return _ls(SETUPS_KEY, []);
}
function _saveCustomSetups(_0x50d34e) {
  _lsSet(SETUPS_KEY, _0x50d34e);
}
function _loadActiveId() {
  return _ls(ACTIVE_SETUP_KEY, "__padrao__");
}
function _saveActiveId(_0x43d6ca) {
  _lsSet(ACTIVE_SETUP_KEY, _0x43d6ca);
}
function _getAllSetups() {
  return [SETUP_PADRAO, ..._loadCustomSetups()];
}
function _getActiveSetup() {
  const _0x2c633b = _loadActiveId();
  return _getAllSetups().find(_0x593709 => _0x593709.id === _0x2c633b) || SETUP_PADRAO;
}
function _marketColor(_0x13e8b2, _0x2062ef) {
  return _0x13e8b2.colors && _0x13e8b2.colors[_0x2062ef] || DATASET_COLORS[_0x2062ef] || "#888";
}
function _getLineToggles(_0x536f89) {
  const _0x21c4ca = _ls(SETUP_LINE_TOGGLE_KEY, {});
  return _0x21c4ca[_0x536f89] || {};
}
function _saveLineToggles(_0x49701f, _0xe2919c) {
  const _0x20fd7b = _ls(SETUP_LINE_TOGGLE_KEY, {});
  _0x20fd7b[_0x49701f] = _0xe2919c;
  _lsSet(SETUP_LINE_TOGGLE_KEY, _0x20fd7b);
}
function _isLineActive(_0x26c060, _0x3cc538) {
  const _0xd85fb3 = _getLineToggles(_0x26c060);
  if (_0xd85fb3[_0x3cc538] !== undefined) {
    return _0xd85fb3[_0x3cc538];
  } else {
    return true;
  }
}
function _setLineActive(_0x578ad7, _0x58ae4f, _0x4f01c3) {
  const _0x1b374d = _getLineToggles(_0x578ad7);
  _0x1b374d[_0x58ae4f] = _0x4f01c3;
  _saveLineToggles(_0x578ad7, _0x1b374d);
}
function _captureControlsToSetup(_0x522252) {
  if (!_0x522252 || _0x522252.id === "__padrao__") {
    return;
  }
  const _0x3cc66c = _loadCustomSetups();
  const _0x1fbaac = _0x3cc66c.findIndex(_0x211c4e => _0x211c4e.id === _0x522252.id);
  if (_0x1fbaac === -1) {
    return;
  }
  const _0x544492 = document.getElementById("pointsSelector");
  const _0x1566d2 = document.getElementById("averageSelector");
  const _0x364815 = document.getElementById("fibonacciToggle");
  const _0x529f67 = document.getElementById("movingAveragesToggle");
  const _0x4c889a = document.getElementById("linhaAtualToggle");
  const _0x24edd2 = document.getElementById("labelsToggle");
  _0x3cc66c[_0x1fbaac].horas = _0x544492 ? parseInt(_0x544492.value, 10) : _0x522252.horas;
  _0x3cc66c[_0x1fbaac].base = _0x1566d2 ? parseInt(_0x1566d2.value, 10) : _0x522252.base;
  _0x3cc66c[_0x1fbaac].fibonacci = _0x364815 ? _0x364815.checked : _0x522252.fibonacci;
  _0x3cc66c[_0x1fbaac].mediasMoveis = _0x529f67 ? _0x529f67.checked : _0x522252.mediasMoveis;
  _0x3cc66c[_0x1fbaac].linhaAtual = _0x4c889a ? _0x4c889a.checked : _0x522252.linhaAtual;
  _0x3cc66c[_0x1fbaac].labels = _0x24edd2 ? _0x24edd2.checked : _0x522252.labels;
  _saveCustomSetups(_0x3cc66c);
}
function _applySetup(_0x5bc664) {
  const _0x18639e = _getActiveSetup();
  if (_0x18639e.id !== _0x5bc664.id) {
    _captureControlsToSetup(_0x18639e);
  }
  _saveActiveId(_0x5bc664.id);
  Object.keys(labelToKey).forEach(_0x443f51 => {
    const _0x37d852 = _0x5bc664.markets.includes(_0x443f51);
    const _0x51ea4c = _isLineActive(_0x5bc664.id, _0x443f51);
    statsChartVisibleDatasets[_0x443f51] = _0x37d852 && _0x51ea4c;
  });
  _saveVisibleDatasets(statsChartVisibleDatasets);
  const _0x17a977 = document.getElementById("pointsSelector");
  const _0x454895 = document.getElementById("averageSelector");
  const _0x47c3bb = document.getElementById("fibonacciToggle");
  const _0x1a427c = document.getElementById("movingAveragesToggle");
  const _0x2a10fa = document.getElementById("linhaAtualToggle");
  const _0x24b243 = document.getElementById("labelsToggle");
  const _0x2916ef = _0x5bc664.horas ?? 8 * _JPH;
  const _0x15ee90 = _0x5bc664.base ?? _JPH - 1;
  const _0x2d6797 = _0x5bc664.fibonacci ?? false;
  const _0x36b294 = _0x5bc664.mediasMoveis ?? false;
  const _0x1e3d86 = _0x5bc664.linhaAtual ?? true;
  const _0x4ea248 = _0x5bc664.labels ?? false;
  if (_0x17a977) {
    _0x17a977.value = String(_0x2916ef);
  }
  if (_0x454895) {
    _0x454895.value = String(_0x15ee90);
  }
  if (_0x47c3bb) {
    _0x47c3bb.checked = _0x2d6797;
  }
  if (_0x1a427c) {
    _0x1a427c.checked = _0x36b294;
  }
  if (_0x2a10fa) {
    _0x2a10fa.checked = _0x1e3d86;
  }
  if (_0x24b243) {
    _0x24b243.checked = _0x4ea248;
  }
  numPoints = _0x2916ef;
  averagePoints = _0x15ee90;
  showFibonacciLines = _0x2d6797;
  showMovingAverages = _0x36b294;
  showLabels = _0x4ea248;
  const _0x1fde52 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x1fde52) {
    _0x1fde52.dragLines = _loadDragLines();
    _0x1fde52._selectedDragLine = -1;
    _atualizarContador(_0x1fde52.dragLines);
    _0x1fde52.fibDraws = _loadDragFibs();
    _0x1fde52._selectedFib = -1;
    _atualizarContadorFibs(_0x1fde52.fibDraws);
    _0x1fde52.trendLines = _loadDragTrends();
    _0x1fde52._selectedTrend = -1;
    _atualizarContadorTrends(_0x1fde52.trendLines);
    _0x1fde52.options.plugins.linhaAtual.enabled = _0x1e3d86;
    _0x1fde52.data.datasets.forEach((_0x35e20d, _0x36f53c) => {
      const _0x2cc7fa = _0x35e20d.label.includes(" - ") ? _0x35e20d.label.split(" - ")[0] : _0x35e20d.label;
      const _0x8203f4 = statsChartVisibleDatasets[_0x2cc7fa];
      _0x1fde52.getDatasetMeta(_0x36f53c).hidden = _0x35e20d.label.includes(" - ") ? !_0x36b294 || !_0x8203f4 : !_0x8203f4;
      if (!_0x35e20d.label.includes(" - ") && _0x5bc664.colors && _0x5bc664.colors[_0x2cc7fa]) {
        _0x35e20d.borderColor = _0x5bc664.colors[_0x2cc7fa];
        _0x35e20d.backgroundColor = _0x5bc664.colors[_0x2cc7fa];
      } else if (!_0x35e20d.label.includes(" - ")) {
        _0x35e20d.borderColor = DATASET_COLORS[_0x2cc7fa] || "#888";
        _0x35e20d.backgroundColor = DATASET_COLORS[_0x2cc7fa] || "#888";
      }
    });
    _0x1fde52.update();
  }
  _renderSetupBar();
  _renderLinesPanel(_0x5bc664);
  _updateSetupCounter();
  updateCharts();
}
function _getDatasetCurrentValue(_0x470cd2) {
  const _0x41e867 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (!_0x41e867) {
    return null;
  }
  const _0x1c9843 = _0x41e867.data.datasets.find(_0x1d6112 => _0x1d6112.label === _0x470cd2);
  if (!_0x1c9843 || !_0x1c9843.data) {
    return null;
  }
  for (let _0x42ffec = _0x1c9843.data.length - 1; _0x42ffec >= 0; _0x42ffec--) {
    const _0xb41cec = _0x1c9843.data[_0x42ffec];
    if (_0xb41cec !== null && _0xb41cec !== undefined && isFinite(_0xb41cec)) {
      return _0xb41cec;
    }
  }
  return null;
}
function _renderSetupBar() {
  const _0x4422fd = document.getElementById("setupBar");
  if (!_0x4422fd) {
    return;
  }
  _0x4422fd.innerHTML = "";
  const _0xbd2bf0 = _loadActiveId();
  _getAllSetups().forEach(_0x57c8d0 => {
    if (_0x57c8d0.id === "__padrao__") {
      return;
    }
    const _0x30d320 = document.createElement("div");
    _0x30d320.className = "setup-item" + (_0x57c8d0.id === _0xbd2bf0 ? " active" : "");
    const _0x2b5aa4 = document.createElement("button");
    _0x2b5aa4.className = "setup-btn";
    const _0x441993 = document.createElement("span");
    _0x441993.textContent = _0x57c8d0.name;
    const _0x2a7dcb = document.createElement("span");
    _0x2a7dcb.className = "setup-edit-hint";
    _0x2a7dcb.textContent = "✏";
    _0x2a7dcb.title = "Duplo clique para editar";
    _0x2b5aa4.appendChild(_0x441993);
    if (_0x57c8d0.id !== "__padrao__") {
      _0x2b5aa4.appendChild(_0x2a7dcb);
    }
    _0x2b5aa4.title = _0x57c8d0.id === "__padrao__" ? _0x57c8d0.markets.join(" · ") : _0x57c8d0.markets.join(" · ") + "\nDuplo clique para editar";
    _0x2b5aa4.addEventListener("click", () => _applySetup(_0x57c8d0));
    _0x2b5aa4.addEventListener("dblclick", _0x9d5486 => {
      _0x9d5486.stopPropagation();
      if (_0x57c8d0.id === "__padrao__") {
        alert("O setup \"Padrão\" não pode ser editado.");
        return;
      }
      _openSetupModal(_0x57c8d0);
    });
    _0x30d320.appendChild(_0x2b5aa4);
    if (_0x57c8d0.id !== "__padrao__") {
      const _0x13981f = document.createElement("button");
      _0x13981f.className = "setup-dup";
      _0x13981f.textContent = "⧉";
      _0x13981f.title = "Duplicar setup";
      _0x13981f.addEventListener("click", _0x7ef674 => {
        _0x7ef674.stopPropagation();
        _duplicateSetup(_0x57c8d0);
      });
      _0x30d320.appendChild(_0x13981f);
      const _0x1d1fa9 = document.createElement("button");
      _0x1d1fa9.className = "setup-del";
      _0x1d1fa9.textContent = "✕";
      _0x1d1fa9.title = "Remover setup";
      _0x1d1fa9.addEventListener("click", _0x5bbfd0 => {
        _0x5bbfd0.stopPropagation();
        if (!confirm("Remover o setup \"" + _0x57c8d0.name + "\"?")) {
          return;
        }
        const _0x1cf6d7 = _loadCustomSetups().filter(_0x17b529 => _0x17b529.id !== _0x57c8d0.id);
        _saveCustomSetups(_0x1cf6d7);
        if (_loadActiveId() === _0x57c8d0.id) {
          _applySetup(SETUP_PADRAO);
        } else {
          _renderSetupBar();
          _updateSetupCounter();
        }
      });
      _0x30d320.appendChild(_0x1d1fa9);
    }
    _0x4422fd.appendChild(_0x30d320);
  });
}
function _duplicateSetup(_0x5ab6ed) {
  const _0x41af10 = _loadCustomSetups();
  if (_0x41af10.length >= MAX_SETUPS) {
    alert("Limite de " + MAX_SETUPS + " setups atingido. Remova um antes de duplicar.");
    return;
  }
  const _0x2e6c7d = JSON.parse(JSON.stringify(_0x5ab6ed));
  _0x2e6c7d.id = "setup_" + Date.now();
  _0x2e6c7d.name = _0x5ab6ed.name + " (cópia)";
  _0x41af10.push(_0x2e6c7d);
  _saveCustomSetups(_0x41af10);
  _renderSetupBar();
  _updateSetupCounter();
}
function _setPreviewLine(_0xb940a4, _0x5ad4d8) {
  leagues.forEach(_0x3ab2cf => {
    const _0x39eab6 = chartInstances[_0x3ab2cf];
    if (!_0x39eab6) {
      return;
    }
    let _0x9c3709 = false;
    _0x39eab6.data.datasets.forEach((_0x55efe7, _0x1d4bd7) => {
      const _0x12d89f = _0x55efe7.label.includes(" - ") ? _0x55efe7.label.split(" - ")[0] : _0x55efe7.label;
      if (_0x12d89f !== _0xb940a4) {
        return;
      }
      const _0x54264d = _0x55efe7.label.includes(" - ");
      const _0xe39c92 = _0x5ad4d8 ? _0x54264d ? !showMovingAverages : false : true;
      const _0x37d617 = _0x39eab6.getDatasetMeta(_0x1d4bd7);
      if (_0x37d617.hidden !== _0xe39c92) {
        _0x37d617.hidden = _0xe39c92;
        _0x9c3709 = true;
      }
    });
    if (_0x9c3709) {
      _0x39eab6.update("none");
    }
  });
}
function _renderLinesPanel(_0x1a4dc3) {
  const _0x426bf5 = document.getElementById("setupLinesPanel");
  if (!_0x426bf5) {
    return;
  }
  _0x426bf5.innerHTML = "";
  if (!_0x1a4dc3 || !_0x1a4dc3.markets || _0x1a4dc3.markets.length === 0) {
    return;
  }
  _0x1a4dc3.markets.forEach(_0xd0569e => {
    const _0x1d74a3 = _isLineActive(_0x1a4dc3.id, _0xd0569e);
    const _0x18d443 = _marketColor(_0x1a4dc3, _0xd0569e);
    const _0x2d03a8 = _getDatasetCurrentValue(_0xd0569e);
    let _0x230201 = _0xd0569e;
    if (_0x2d03a8 !== null) {
      const _0x21e302 = _0xd0569e === "Gols FT" || _0xd0569e === "Gols HT" || _0xd0569e === "Gols FT Casa" || _0xd0569e === "Gols FT Fora";
      _0x230201 += " — " + (_0x21e302 ? Math.round(_0x2d03a8) + " gols" : _0x2d03a8.toFixed(1));
    }
    const _0x19aecd = document.createElement("div");
    _0x19aecd.className = "market-toggle" + (_0x1d74a3 ? " active" : " inactive");
    _0x19aecd.title = _0x230201;
    _0x19aecd.style.setProperty("--mcolor", _0x18d443);
    const _0xdc9e1b = document.createElement("span");
    _0xdc9e1b.className = "market-toggle-dot";
    _0xdc9e1b.style.background = _0x18d443;
    const _0x4f698c = document.createElement("span");
    _0x4f698c.textContent = _0xd0569e;
    if (_0x2d03a8 !== null) {
      const _0x171e4a = document.createElement("span");
      _0x171e4a.className = "market-toggle-val";
      const _0xdec20f = _0xd0569e === "Gols FT" || _0xd0569e === "Gols HT" || _0xd0569e === "Gols FT Casa" || _0xd0569e === "Gols FT Fora";
      _0x171e4a.textContent = _0xdec20f ? Math.round(_0x2d03a8) : _0x2d03a8.toFixed(1);
      _0x171e4a.style.color = _0x18d443;
      _0x19aecd.appendChild(_0xdc9e1b);
      _0x19aecd.appendChild(_0x4f698c);
      _0x19aecd.appendChild(_0x171e4a);
    } else {
      _0x19aecd.appendChild(_0xdc9e1b);
      _0x19aecd.appendChild(_0x4f698c);
    }
    _0x19aecd.addEventListener("click", () => {
      _0x19aecd.style.outline = "";
      const _0x541e3f = !_isLineActive(_0x1a4dc3.id, _0xd0569e);
      _setLineActive(_0x1a4dc3.id, _0xd0569e, _0x541e3f);
      statsChartVisibleDatasets[_0xd0569e] = _0x1a4dc3.markets.includes(_0xd0569e) && _0x541e3f;
      _saveVisibleDatasets(statsChartVisibleDatasets);
      leagues.forEach(_0x3817a0 => {
        const _0x10552d = chartInstances[_0x3817a0];
        if (!_0x10552d) {
          return;
        }
        _0x10552d.data.datasets.forEach((_0x539923, _0x2cda71) => {
          const _0x532604 = _0x539923.label.includes(" - ") ? _0x539923.label.split(" - ")[0] : _0x539923.label;
          if (_0x532604 !== _0xd0569e) {
            return;
          }
          const _0x122d1e = statsChartVisibleDatasets[_0x532604];
          _0x10552d.getDatasetMeta(_0x2cda71).hidden = _0x539923.label.includes(" - ") ? !showMovingAverages || !_0x122d1e : !_0x122d1e;
        });
        _0x10552d.update();
      });
      _renderLinesPanel(_getActiveSetup());
    });
    _0x19aecd.dataset.label = _0xd0569e;
    _0x19aecd.dataset.color = _0x18d443;
    if (!_0x1d74a3) {
      _0x19aecd.addEventListener("mouseenter", () => {
        _0x19aecd.style.outline = "2px dashed " + _0x18d443;
        _0x19aecd.style.outlineOffset = "2px";
        _setPreviewLine(_0xd0569e, true);
      });
      _0x19aecd.addEventListener("mouseleave", () => {
        _0x19aecd.style.outline = "";
        if (!_isLineActive(_0x1a4dc3.id, _0xd0569e)) {
          _setPreviewLine(_0xd0569e, false);
        }
      });
    }
    _0x426bf5.appendChild(_0x19aecd);
  });
  _0x426bf5.querySelectorAll(".market-toggle.inactive").forEach(_0x44ad14 => {
    const _0x1df456 = _0x44ad14.dataset.label;
    if (!_0x1df456) {
      return;
    }
    if (_0x44ad14.matches(":hover")) {
      _0x44ad14.style.outline = "2px dashed " + _0x44ad14.dataset.color;
      _0x44ad14.style.outlineOffset = "2px";
      _setPreviewLine(_0x1df456, true);
    } else {
      _setPreviewLine(_0x1df456, false);
    }
  });
}
function _updateLinesPanelValues() {
  const _0x1722d3 = document.getElementById("setupLinesPanel");
  if (!_0x1722d3) {
    return;
  }
  _0x1722d3.querySelectorAll(".market-toggle").forEach(_0x4af886 => {
    const _0x4d1aac = _0x4af886.dataset.label;
    if (!_0x4d1aac) {
      return;
    }
    const _0x2379c6 = _getDatasetCurrentValue(_0x4d1aac);
    const _0x4b01d4 = _0x4d1aac === "Gols FT" || _0x4d1aac === "Gols HT" || _0x4d1aac === "Gols FT Casa" || _0x4d1aac === "Gols FT Fora";
    let _0x506599 = _0x4d1aac;
    if (_0x2379c6 !== null) {
      _0x506599 += " — " + (_0x4b01d4 ? Math.round(_0x2379c6) + " gols" : _0x2379c6.toFixed(1));
    }
    _0x4af886.title = _0x506599;
    let _0xff2dc7 = _0x4af886.querySelector(".market-toggle-val");
    if (_0x2379c6 !== null) {
      const _0x49c5dd = _0x4b01d4 ? Math.round(_0x2379c6) : _0x2379c6.toFixed(1);
      if (!_0xff2dc7) {
        _0xff2dc7 = document.createElement("span");
        _0xff2dc7.className = "market-toggle-val";
        _0xff2dc7.style.color = _0x4af886.dataset.color || "#888";
        _0x4af886.appendChild(_0xff2dc7);
      }
      _0xff2dc7.textContent = _0x49c5dd;
    } else if (_0xff2dc7) {
      _0xff2dc7.remove();
    }
  });
}
function _updateSetupCounter() {
  const _0x4d346a = _loadCustomSetups().length;
  const _0x12a180 = document.getElementById("setupCounter");
  const _0x193269 = document.getElementById("btnAddSetup");
  if (_0x12a180) {
    _0x12a180.textContent = _0x4d346a + " / " + MAX_SETUPS;
    _0x12a180.className = "setup-counter" + (_0x4d346a >= MAX_SETUPS ? " at-limit" : "");
  }
  if (_0x193269) {
    _0x193269.disabled = _0x4d346a >= MAX_SETUPS;
    _0x193269.title = _0x4d346a >= MAX_SETUPS ? "Limite de 10 setups atingido" : "Criar novo setup";
  }
}
let _editingSetupId = null;
function _openSetupModal(_0x3d9498) {
  const _0x3659b9 = document.getElementById("setupModal");
  const _0x622df9 = document.getElementById("setupLimitWarning");
  if (!_0x3659b9) {
    return;
  }
  const _0x210be8 = _loadCustomSetups().length;
  if (_0x3d9498) {
    _editingSetupId = _0x3d9498.id;
    document.getElementById("setupModalTitle").textContent = "Editar Setup";
    document.getElementById("setupModalSaveBtn").textContent = "✔ Atualizar Setup";
    document.getElementById("setupModalName").value = _0x3d9498.name;
    if (_0x622df9) {
      _0x622df9.style.display = "none";
    }
  } else {
    _editingSetupId = null;
    document.getElementById("setupModalTitle").textContent = "Criar Setup";
    document.getElementById("setupModalSaveBtn").textContent = "✔ Salvar Setup";
    document.getElementById("setupModalName").value = "";
    if (_0x622df9) {
      _0x622df9.style.display = _0x210be8 >= MAX_SETUPS ? "block" : "none";
    }
  }
  const _0x5324ba = document.getElementById("setupModalMarkets");
  _0x5324ba.innerHTML = "";
  const _0x25a45e = _0x3d9498 || _getActiveSetup();
  const _0x5aca44 = _0x25a45e.markets || [];
  const _0x35b341 = (_0x3d9498 ? _0x3d9498.colors : null) || {};
  MARKET_GROUPS.forEach(_0x3c7060 => {
    const _0x59bf60 = document.createElement("div");
    _0x59bf60.className = "setup-modal-group-title";
    _0x59bf60.textContent = _0x3c7060.title;
    _0x5324ba.appendChild(_0x59bf60);
    _0x3c7060.labels.forEach(_0x2fb351 => {
      const _0x37ddbf = _0x5aca44.includes(_0x2fb351);
      const _0x1f8dd2 = document.createElement("label");
      _0x1f8dd2.className = "setup-modal-row" + (_0x37ddbf ? " checked" : "");
      const _0xba56cc = document.createElement("input");
      _0xba56cc.type = "checkbox";
      _0xba56cc.value = _0x2fb351;
      _0xba56cc.checked = _0x37ddbf;
      _0xba56cc.addEventListener("change", () => {
        _0x1f8dd2.className = "setup-modal-row" + (_0xba56cc.checked ? " checked" : "");
      });
      const _0x322cd2 = document.createElement("span");
      _0x322cd2.className = "setup-modal-dot";
      const _0x1cbf2a = _0x35b341[_0x2fb351] || DATASET_COLORS[_0x2fb351] || "#888";
      _0x322cd2.style.background = _0x1cbf2a;
      const _0xa28cc0 = document.createElement("span");
      _0xa28cc0.textContent = _0x2fb351;
      _0xa28cc0.style.flex = "1";
      const _0x3037db = document.createElement("input");
      _0x3037db.type = "color";
      _0x3037db.value = _0x1cbf2a;
      _0x3037db.className = "market-color-picker";
      _0x3037db.title = "Personalizar cor";
      _0x3037db.addEventListener("input", () => {
        _0x322cd2.style.background = _0x3037db.value;
      });
      _0x1f8dd2.appendChild(_0xba56cc);
      _0x1f8dd2.appendChild(_0x322cd2);
      _0x1f8dd2.appendChild(_0xa28cc0);
      _0x1f8dd2.appendChild(_0x3037db);
      _0x5324ba.appendChild(_0x1f8dd2);
    });
  });
  _0x3659b9.style.display = "flex";
  setTimeout(() => document.getElementById("setupModalName")?.focus(), 60);
}
function _closeSetupModal() {
  const _0x3a1875 = document.getElementById("setupModal");
  if (_0x3a1875) {
    _0x3a1875.style.display = "none";
  }
  _editingSetupId = null;
}
function _saveSetupModal() {
  const _0x3c6a91 = document.getElementById("setupModalName").value.trim();
  if (!_0x3c6a91) {
    alert("Digite um nome para o setup.");
    return;
  }
  const _0x355a3a = [];
  const _0x5a6aa5 = {};
  document.querySelectorAll("#setupModalMarkets .setup-modal-row").forEach(_0x50aea7 => {
    const _0xeb4921 = _0x50aea7.querySelector("input[type=checkbox]");
    const _0x4c9a4f = _0x50aea7.querySelector(".market-color-picker");
    if (_0xeb4921 && _0xeb4921.checked) {
      _0x355a3a.push(_0xeb4921.value);
      const _0xc29988 = DATASET_COLORS[_0xeb4921.value] || "#888";
      if (_0x4c9a4f && _0x4c9a4f.value.toLowerCase() !== _0xc29988.toLowerCase()) {
        _0x5a6aa5[_0xeb4921.value] = _0x4c9a4f.value;
      }
    }
  });
  if (_0x355a3a.length === 0) {
    alert("Selecione pelo menos um mercado.");
    return;
  }
  const _0x4ca3ae = _loadCustomSetups();
  if (_editingSetupId) {
    const _0x1eb195 = _0x4ca3ae.findIndex(_0x434153 => _0x434153.id === _editingSetupId);
    if (_0x1eb195 !== -1) {
      _0x4ca3ae[_0x1eb195].name = _0x3c6a91;
      _0x4ca3ae[_0x1eb195].markets = _0x355a3a;
      _0x4ca3ae[_0x1eb195].colors = _0x5a6aa5;
      _saveCustomSetups(_0x4ca3ae);
      _closeSetupModal();
      if (_loadActiveId() === _editingSetupId) {
        _applySetup(_0x4ca3ae[_0x1eb195]);
      } else {
        _renderSetupBar();
        _updateSetupCounter();
      }
    }
  } else {
    if (_0x4ca3ae.length >= MAX_SETUPS) {
      alert("Limite de " + MAX_SETUPS + " setups atingido.");
      return;
    }
    const _0x2b151d = _getActiveSetup();
    const _0x551161 = {
      id: "setup_" + Date.now(),
      name: _0x3c6a91,
      markets: _0x355a3a,
      colors: _0x5a6aa5,
      horas: _0x2b151d.horas ?? 8 * _JPH,
      base: _0x2b151d.base ?? _JPH - 1,
      fibonacci: _0x2b151d.fibonacci ?? false,
      mediasMoveis: _0x2b151d.mediasMoveis ?? false,
      linhaAtual: _0x2b151d.linhaAtual ?? true,
      labels: _0x2b151d.labels ?? false,
      dragLines: []
    };
    _0x4ca3ae.push(_0x551161);
    _saveCustomSetups(_0x4ca3ae);
    _closeSetupModal();
    _applySetup(_0x551161);
  }
  _updateSetupCounter();
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("setupModal")?.addEventListener("click", function (_0x423db2) {
    if (_0x423db2.target === this) {
      _closeSetupModal();
    }
  });
  const _0x4ee1fa = _ls(ACCORDION_KEY, true);
  const _0x286f27 = document.querySelector(".accordion-content");
  if (_0x286f27 && !_0x4ee1fa) {
    _0x286f27.style.display = "none";
  }
  _renderSetupBar();
  _renderLinesPanel(_getActiveSetup());
  _updateSetupCounter();
});
function toggleAccordion(_0x5b7dcd) {
  const _0x4d8003 = _0x5b7dcd.nextElementSibling;
  const _0x33cc1c = _0x4d8003.style.display !== "none";
  _0x4d8003.style.display = _0x33cc1c ? "none" : "block";
  _lsSet(ACCORDION_KEY, !_0x33cc1c);
}
const defaultStatsChartVisibleDatasets = (() => {
  const _0x1dde83 = {};
  Object.keys(labelToKey).forEach(_0x1d3bfb => _0x1dde83[_0x1d3bfb] = false);
  return _0x1dde83;
})();
function _loadVisibleDatasets() {
  const _0x26a613 = _ls(VISIBLE_DS_KEY, null);
  const _0x5661d4 = {
    ...defaultStatsChartVisibleDatasets
  };
  if (!_0x26a613) {
    return _0x5661d4;
  }
  return Object.assign({}, defaultStatsChartVisibleDatasets, _0x26a613);
}
function _saveVisibleDatasets(_0x531c63) {
  _lsSet(VISIBLE_DS_KEY, _0x531c63);
}
let statsChartVisibleDatasets = _loadVisibleDatasets();
function getKeyFromLabel(_0x527e4c) {
  if (_0x527e4c.includes(" - ")) {
    const [_0x19fe2e, _0x33c023] = _0x527e4c.split(" - ");
    return labelToKey[_0x19fe2e] + _0x33c023.split(" ")[0];
  }
  return labelToKey[_0x527e4c];
}
function computeMA(_0x5a476c, _0x536ad5) {
  return _0x5a476c.map((_0x43bd46, _0x42510a) => {
    let _0x382f54 = 0;
    let _0x402fb2 = 0;
    for (let _0x500245 = Math.max(0, _0x42510a - _0x536ad5 + 1); _0x500245 <= _0x42510a; _0x500245++) {
      if (_0x5a476c[_0x500245] !== null) {
        _0x382f54 += _0x5a476c[_0x500245];
        _0x402fb2++;
      }
    }
    if (_0x402fb2 > 0) {
      return _0x382f54 / _0x402fb2;
    } else {
      return null;
    }
  });
}
function parseHtScoreTotal(_0x372bf8) {
  if (!_0x372bf8) {
    return 0;
  }
  if (_0x372bf8 === "OUT") {
    return 3;
  }
  if (_0x372bf8.includes(" x ")) {
    const _0x33ef0b = _0x372bf8.split(" x ").map(Number);
    if (_0x33ef0b.length === 2 && !isNaN(_0x33ef0b[0]) && !isNaN(_0x33ef0b[1])) {
      return _0x33ef0b[0] + _0x33ef0b[1];
    }
  }
  return 0;
}
function parseHtParts(_0x457948) {
  if (!_0x457948 || _0x457948 === "OUT") {
    return null;
  }
  if (_0x457948.includes(" x ")) {
    const _0x240dc7 = _0x457948.split(" x ").map(Number);
    if (_0x240dc7.length === 2 && !isNaN(_0x240dc7[0]) && !isNaN(_0x240dc7[1])) {
      return _0x240dc7;
    }
  }
  return null;
}
const rotulosPlugin = {
  id: "rotulos",
  afterDatasetsDraw(_0xce40ae) {
    if (!showLabels) {
      return;
    }
    const {
      ctx: _0x5e7d00,
      chartArea: _0x51011b,
      scales: _0x5628c2
    } = _0xce40ae;
    if (!_0x51011b || !_0x5628c2.y) {
      return;
    }
    _0xce40ae.data.datasets.forEach((_0x295767, _0x100041) => {
      if (_0x295767.label.includes(" MA")) {
        return;
      }
      if (!_0xce40ae.isDatasetVisible(_0x100041)) {
        return;
      }
      const _0xfdb9ad = _0xce40ae.getDatasetMeta(_0x100041);
      if (!_0xfdb9ad || !_0xfdb9ad.data) {
        return;
      }
      const _0x5417d8 = _0x295767.borderColor || "#fff";
      _0x5e7d00.save();
      _0x5e7d00.font = "600 9.5px 'Inter',Arial,sans-serif";
      _0x5e7d00.textAlign = "center";
      _0x5e7d00.textBaseline = "bottom";
      _0x5e7d00.fillStyle = _0x5417d8;
      _0xfdb9ad.data.forEach((_0x42b922, _0x48b879) => {
        const _0x52822 = _0x295767.data[_0x48b879];
        if (_0x52822 === null || _0x52822 === undefined || !isFinite(_0x52822)) {
          return;
        }
        if (_0x42b922.x < _0x51011b.left || _0x42b922.x > _0x51011b.right) {
          return;
        }
        if (_0x42b922.y < _0x51011b.top || _0x42b922.y > _0x51011b.bottom) {
          return;
        }
        const _0x1b8e21 = _0x295767.label === "Gols FT" || _0x295767.label === "Gols HT";
        const _0x39abd4 = _0x1b8e21 ? String(Math.round(_0x52822)) : String(Math.round(_0x52822));
        _0x5e7d00.fillText(_0x39abd4, _0x42b922.x, _0x42b922.y - 4);
      });
      _0x5e7d00.restore();
    });
  }
};
const fibonacciLinesPlugin = {
  id: "fibonacciLines",
  afterDraw(_0x306fd5) {
    if (!showFibonacciLines) {
      return;
    }
    const _0x4f0daa = _0x306fd5.ctx;
    const _0x223f8c = _0x306fd5.scales.y;
    if (!_0x223f8c) {
      return;
    }
    const _0x1041bd = [0, 23.6, 38.2, 50, 61.8, 100];
    const _0xa608b6 = "rgba(167,139,250,0.55)";
    const _0x9a3a1e = "rgba(196,181,253,0.9)";
    const {
      left: _0x1393cb,
      right: _0xcdd5b7
    } = _0x306fd5.chartArea;
    const _0x308690 = _0x223f8c.max - _0x223f8c.min;
    const _0x2df647 = _0x223f8c.position === "right";
    _0x4f0daa.save();
    _0x1041bd.forEach((_0x49762b, _0x55a5f5) => {
      const _0x6f76ff = _0x223f8c.getPixelForValue(_0x223f8c.min + _0x49762b / 100 * _0x308690);
      _0x4f0daa.beginPath();
      _0x4f0daa.setLineDash([6, 4]);
      _0x4f0daa.moveTo(_0x1393cb, _0x6f76ff);
      _0x4f0daa.lineTo(_0xcdd5b7, _0x6f76ff);
      _0x4f0daa.strokeStyle = _0xa608b6;
      _0x4f0daa.lineWidth = 1;
      _0x4f0daa.stroke();
      _0x4f0daa.setLineDash([]);
      _0x4f0daa.fillStyle = _0x9a3a1e;
      _0x4f0daa.font = "10px 'Inter',Arial,sans-serif";
      _0x4f0daa.textBaseline = "middle";
      if (_0x2df647) {
        _0x4f0daa.textAlign = "right";
        _0x4f0daa.fillText(_0x1041bd[_0x55a5f5] + "%", _0x1393cb - 8, _0x6f76ff - (_0x55a5f5 === 0 ? -8 : 0));
      } else {
        _0x4f0daa.textAlign = "left";
        _0x4f0daa.fillText(_0x1041bd[_0x55a5f5] + "%", _0xcdd5b7 + 52, _0x6f76ff - (_0x55a5f5 === 0 ? -8 : 0));
      }
    });
    _0x4f0daa.restore();
  }
};
const linhaAtualPlugin = {
  id: "linhaAtual",
  afterDraw(_0x5001a2, _0xaf8aba, _0x4b434e) {
    const _0x2b3cd2 = _0x4b434e?.enabled !== undefined ? _0x4b434e : _0x5001a2.options?.plugins?.linhaAtual ?? {};
    if (_0x2b3cd2.enabled === false) {
      return;
    }
    const {
      ctx: _0x2fa810,
      chartArea: _0xc958bd,
      scales: _0x15d6b3
    } = _0x5001a2;
    if (!_0xc958bd || !_0x15d6b3.y) {
      return;
    }
    const {
      left: _0x3e2f50,
      right: _0x293109,
      top: _0x26e4c6,
      bottom: _0x33a3a1
    } = _0xc958bd;
    const _0x1f2abf = 5;
    const _0x77a4c1 = 18;
    const _0x4e2549 = [];
    _0x5001a2.data.datasets.forEach((_0x472e92, _0x2a236c) => {
      if (!_0x472e92.label || _0x472e92.label.includes(" MA") || !_0x5001a2.isDatasetVisible(_0x2a236c)) {
        return;
      }
      const _0x3d6c32 = _0x472e92.data;
      if (!_0x3d6c32?.length) {
        return;
      }
      let _0x255bb9 = null;
      for (let _0x229c89 = _0x3d6c32.length - 1; _0x229c89 >= 0; _0x229c89--) {
        const _0x5bcdec = _0x3d6c32[_0x229c89];
        if (_0x5bcdec !== null && _0x5bcdec !== undefined && isFinite(_0x5bcdec)) {
          _0x255bb9 = _0x5bcdec;
          break;
        }
      }
      if (_0x255bb9 === null) {
        return;
      }
      const _0x2b0c23 = _0x472e92.yAxisID || "y";
      const _0x40844b = _0x15d6b3[_0x2b0c23] || _0x15d6b3.y;
      const _0x1c434e = _0x40844b.getPixelForValue(_0x255bb9);
      if (!isFinite(_0x1c434e) || _0x1c434e < _0x26e4c6 || _0x1c434e > _0x33a3a1) {
        return;
      }
      const _0x399038 = {
        yVal: _0x255bb9,
        yPx: _0x1c434e,
        label: _0x472e92.label,
        color: _0x472e92.borderColor || "#fff"
      };
      _0x4e2549.push(_0x399038);
    });
    if (!_0x4e2549.length) {
      return;
    }
    _0x4e2549.sort((_0x280cbb, _0x2d3815) => _0x280cbb.yPx - _0x2d3815.yPx);
    for (let _0x5d623c = 1; _0x5d623c < _0x4e2549.length; _0x5d623c++) {
      const _0x17b454 = _0x4e2549[_0x5d623c - 1];
      const _0x3513f4 = _0x4e2549[_0x5d623c];
      _0x3513f4.badgeY = _0x3513f4.yPx - (_0x17b454.badgeY ?? _0x17b454.yPx) < _0x77a4c1 + 2 ? (_0x17b454.badgeY ?? _0x17b454.yPx) + _0x77a4c1 + 2 : _0x3513f4.yPx;
      if (_0x5d623c === 1) {
        _0x17b454.badgeY = _0x17b454.badgeY ?? _0x17b454.yPx;
      }
    }
    if (_0x4e2549.length === 1) {
      _0x4e2549[0].badgeY = _0x4e2549[0].yPx;
    }
    _0x4e2549.forEach(({
      yVal: _0xc841d2,
      yPx: _0x3ff9bd,
      badgeY: _0x7fd67,
      label: _0x1ab1ab,
      color: _0x23920a
    }) => {
      _0x2fa810.save();
      _0x2fa810.strokeStyle = _0x23920a;
      _0x2fa810.lineWidth = 1.2;
      _0x2fa810.setLineDash([6, 4]);
      _0x2fa810.beginPath();
      _0x2fa810.moveTo(_0x3e2f50, _0x3ff9bd);
      _0x2fa810.lineTo(_0x293109, _0x3ff9bd);
      _0x2fa810.stroke();
      _0x2fa810.setLineDash([]);
      const _0x1a58fc = _0x1ab1ab === "Gols FT" || _0x1ab1ab === "Gols HT" || _0x1ab1ab === "Gols Individual" || _0x1ab1ab === "Gols FT Casa" || _0x1ab1ab === "Gols FT Fora";
      const _0x4d8870 = _0x1a58fc ? String(Math.round(_0xc841d2)) : _0xc841d2.toFixed(1);
      _0x2fa810.font = "600 10.5px 'Inter',Arial,sans-serif";
      _0x2fa810.textBaseline = "middle";
      _0x2fa810.textAlign = "left";
      const _0x544bbb = Math.ceil(_0x2fa810.measureText(_0x4d8870).width) + _0x1f2abf * 2;
      const _0x2cc941 = _0x15d6b3.y.position === "right";
      const _0x79b6d6 = _0x2cc941 ? _0x3e2f50 - 4 - _0x544bbb : _0x293109 + 4;
      const _0x4d0165 = _0x7fd67 - _0x77a4c1 / 2;
      const _0x44d952 = 4;
      _0x2fa810.fillStyle = "rgba(13,16,26,0.96)";
      _0x2fa810.strokeStyle = _0x23920a;
      _0x2fa810.lineWidth = 1.2;
      _0x2fa810.beginPath();
      _0x2fa810.roundRect(_0x79b6d6, _0x4d0165, _0x544bbb, _0x77a4c1, _0x44d952);
      _0x2fa810.fill();
      _0x2fa810.stroke();
      _0x2fa810.fillStyle = _0x23920a;
      _0x2fa810.fillText(_0x4d8870, _0x79b6d6 + _0x1f2abf, _0x7fd67);
      _0x2fa810.restore();
    });
  }
};
function _loadDragLines() {
  try {
    const _0x4959b6 = JSON.parse(localStorage.getItem(_ligaKey(DRAG_LINES_KEY)) || "[]");
    if (Array.isArray(_0x4959b6)) {
      return _0x4959b6.map(_0x4f7d7e => ({
        y: Number(_0x4f7d7e.y),
        color: _0x4f7d7e.color || "#1fcc59",
        dragging: false
      }));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}
function _saveDragLines(_0x4fa99) {
  try {
    localStorage.setItem(_ligaKey(DRAG_LINES_KEY), JSON.stringify(_0x4fa99.map(_0x50d3dd => ({
      y: _0x50d3dd.y,
      color: _0x50d3dd.color || "#1fcc59"
    }))));
  } catch {}
}
function _atualizarContador(_0x16553f) {
  const _0x219c25 = document.getElementById("contadorLinhas");
  if (_0x219c25) {
    _0x219c25.textContent = (_0x16553f || []).length + " / " + MAX_DRAG_LINES + " linhas";
  }
}
function _loadDragFibs() {
  try {
    const _0x19e68c = JSON.parse(localStorage.getItem(_ligaKey(DRAG_FIBS_KEY)) || "[]");
    if (Array.isArray(_0x19e68c)) {
      return _0x19e68c.map(_0x323882 => ({
        y1: Number(_0x323882.y1),
        y2: Number(_0x323882.y2),
        x1Idx: _0x323882.x1Idx == null ? null : Number(_0x323882.x1Idx),
        x2Idx: _0x323882.x2Idx == null ? null : Number(_0x323882.x2Idx),
        color: _0x323882.color || "#A78BFA"
      }));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}
function _saveDragFibs(_0x3c48a2) {
  try {
    localStorage.setItem(_ligaKey(DRAG_FIBS_KEY), JSON.stringify((_0x3c48a2 || []).map(_0x43d8b9 => ({
      y1: _0x43d8b9.y1,
      y2: _0x43d8b9.y2,
      x1Idx: _0x43d8b9.x1Idx ?? null,
      x2Idx: _0x43d8b9.x2Idx ?? null,
      color: _0x43d8b9.color || "#A78BFA"
    }))));
  } catch {}
}
function _atualizarContadorFibs(_0x58aa14) {
  const _0x62c983 = document.getElementById("contadorFibs");
  if (_0x62c983) {
    _0x62c983.textContent = (_0x58aa14 || []).length + " / " + MAX_DRAG_FIBS + " fibonacci";
  }
}
function _loadDragTrends() {
  try {
    const _0x186c6d = JSON.parse(localStorage.getItem(_ligaKey(DRAG_TRENDS_KEY)) || "[]");
    if (Array.isArray(_0x186c6d)) {
      return _0x186c6d.map(_0xed03a5 => ({
        x1Idx: Number(_0xed03a5.x1Idx),
        y1: Number(_0xed03a5.y1),
        x2Idx: Number(_0xed03a5.x2Idx),
        y2: Number(_0xed03a5.y2),
        color: _0xed03a5.color || "#34D399",
        tipo: _0xed03a5.tipo || "LTA"
      }));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}
function _saveDragTrends(_0x33f251) {
  try {
    localStorage.setItem(_ligaKey(DRAG_TRENDS_KEY), JSON.stringify((_0x33f251 || []).map(_0x166776 => ({
      x1Idx: _0x166776.x1Idx,
      y1: _0x166776.y1,
      x2Idx: _0x166776.x2Idx,
      y2: _0x166776.y2,
      color: _0x166776.color || "#34D399",
      tipo: _0x166776.tipo || "LTA"
    }))));
  } catch {}
}
function _atualizarContadorTrends(_0x3cb4c1) {
  const _0x191828 = document.getElementById("contadorTendencias");
  if (_0x191828) {
    _0x191828.textContent = (_0x3cb4c1 || []).length + " / " + MAX_DRAG_TRENDS + " tendências";
  }
}
function _distToSegment(_0x43ea95, _0xf78104, _0x5d9b2e, _0x4ba91b, _0x5e12f7, _0x1db6c7) {
  const _0x514b8a = _0x5e12f7 - _0x5d9b2e;
  const _0x5baccc = _0x1db6c7 - _0x4ba91b;
  const _0x4c2eda = _0x514b8a * _0x514b8a + _0x5baccc * _0x5baccc;
  if (_0x4c2eda === 0) {
    return Math.hypot(_0x43ea95 - _0x5d9b2e, _0xf78104 - _0x4ba91b);
  }
  let _0x280a31 = ((_0x43ea95 - _0x5d9b2e) * _0x514b8a + (_0xf78104 - _0x4ba91b) * _0x5baccc) / _0x4c2eda;
  _0x280a31 = Math.max(0, Math.min(1, _0x280a31));
  return Math.hypot(_0x43ea95 - (_0x5d9b2e + _0x280a31 * _0x514b8a), _0xf78104 - (_0x4ba91b + _0x280a31 * _0x5baccc));
}
const linhaDraggablePlugin = {
  id: "linhaDraggable",
  afterInit(_0x86e893) {
    const _0xd54fa2 = _0x86e893.canvas;
    _0x86e893.dragLines = _loadDragLines();
    _0x86e893._selectedDragLine = -1;
    const _0x454d45 = 8;
    let _0x2d8728 = -1;
    const _0xf50bab = () => _0x86e893.scales.y;
    const _0x202ac8 = _0x5732a3 => {
      const _0x4fd681 = _0xd54fa2.getBoundingClientRect();
      return ((_0x5732a3.touches && _0x5732a3.touches[0]?.clientY) ?? _0x5732a3.clientY ?? 0) - _0x4fd681.top;
    };
    const _0x449ba8 = _0x14004f => {
      const _0x3218b2 = _0xf50bab();
      if (!_0x3218b2 || !_0x86e893.chartArea) {
        return -1;
      }
      const {
        top: _0xc5e9e,
        bottom: _0x918dc2
      } = _0x86e893.chartArea;
      let _0x43ace2 = -1;
      let _0x410a4d = Infinity;
      (_0x86e893.dragLines || []).forEach((_0x525e44, _0x162e0b) => {
        const _0x567d74 = _0x3218b2.getPixelForValue(_0x525e44.y);
        if (_0x567d74 < _0xc5e9e || _0x567d74 > _0x918dc2) {
          return;
        }
        const _0x37c9e6 = Math.abs(_0x567d74 - _0x14004f);
        if (_0x37c9e6 < _0x410a4d && _0x37c9e6 <= _0x454d45) {
          _0x410a4d = _0x37c9e6;
          _0x43ace2 = _0x162e0b;
        }
      });
      return _0x43ace2;
    };
    _0x86e893.addDragLine = (_0xfb225c = "#1fcc59") => {
      if ((_0x86e893.dragLines || []).length >= MAX_DRAG_LINES) {
        alert("Máximo de " + MAX_DRAG_LINES + " linhas!");
        return;
      }
      const _0x5033a3 = _0xf50bab();
      if (!_0x5033a3) {
        return;
      }
      _0x86e893.dragLines.push({
        y: Math.round((_0x5033a3.min + _0x5033a3.max) / 2),
        color: _0xfb225c,
        dragging: false
      });
      _0x86e893._selectedDragLine = _0x86e893.dragLines.length - 1;
      _saveDragLines(_0x86e893.dragLines);
      _atualizarContador(_0x86e893.dragLines);
      _0x86e893.update();
      _captureControlsToSetup(_getActiveSetup());
    };
    _0x86e893.deleteDragLine = () => {
      const _0x56f38b = _0x86e893._selectedDragLine;
      if (_0x56f38b >= 0 && _0x56f38b < (_0x86e893.dragLines || []).length) {
        _0x86e893.dragLines.splice(_0x56f38b, 1);
        _0x86e893._selectedDragLine = -1;
        _saveDragLines(_0x86e893.dragLines);
        _atualizarContador(_0x86e893.dragLines);
        _0x86e893.update();
        _captureControlsToSetup(_getActiveSetup());
      }
    };
    _0x86e893.clearDragLines = () => {
      _0x86e893.dragLines = [];
      _0x86e893._selectedDragLine = -1;
      _saveDragLines(_0x86e893.dragLines);
      _atualizarContador(_0x86e893.dragLines);
      _0x86e893.update();
      _captureControlsToSetup(_getActiveSetup());
    };
    const _0x5cad41 = _0x431e26 => {
      const _0x393d65 = _0x202ac8(_0x431e26);
      const _0x2328b9 = _0x449ba8(_0x393d65);
      if (_0x2328b9 >= 0) {
        if (_0x431e26.cancelable) {
          _0x431e26.preventDefault();
        }
        _0x2d8728 = _0x2328b9;
        _0x86e893.dragLines[_0x2328b9].dragging = true;
        _0x86e893._selectedDragLine = _0x2328b9;
      } else {
        _0x86e893._selectedDragLine = -1;
      }
      _0x86e893.update();
    };
    const _0x5951a6 = _0x46882c => {
      if (_0x2d8728 < 0) {
        return;
      }
      if (_0x46882c.cancelable) {
        _0x46882c.preventDefault();
      }
      const _0x31f329 = _0xf50bab();
      if (!_0x31f329) {
        return;
      }
      let _0x446e11 = _0x31f329.getValueForPixel(_0x202ac8(_0x46882c));
      _0x446e11 = Math.max(_0x31f329.min, Math.min(_0x31f329.max, Math.round(_0x446e11 * 10) / 10));
      _0x86e893.dragLines[_0x2d8728].y = _0x446e11;
      _0x86e893.update("none");
    };
    const _0x4b2bf1 = () => {
      if (_0x2d8728 >= 0) {
        if (_0x86e893.dragLines[_0x2d8728]) {
          _0x86e893.dragLines[_0x2d8728].dragging = false;
        }
        _saveDragLines(_0x86e893.dragLines);
        _captureControlsToSetup(_getActiveSetup());
      }
      _0x2d8728 = -1;
    };
    _0xd54fa2.addEventListener("mousedown", _0x5cad41);
    _0xd54fa2.addEventListener("mousemove", _0x5951a6);
    _0xd54fa2.addEventListener("mouseleave", _0x4b2bf1);
    window.addEventListener("mouseup", _0x4b2bf1);
    _0xd54fa2.addEventListener("touchstart", _0x5cad41, {
      passive: false
    });
    _0xd54fa2.addEventListener("touchmove", _0x5951a6, {
      passive: false
    });
    _0xd54fa2.addEventListener("touchend", _0x4b2bf1, {
      passive: true
    });
    _0xd54fa2.addEventListener("touchcancel", _0x4b2bf1, {
      passive: true
    });
    window.addEventListener("keydown", _0x40883a => {
      if (_0x40883a.key === "Delete" || _0x40883a.key === "Backspace") {
        const _0x610466 = chartInstances.Copa || Object.values(chartInstances)[0];
        if (_0x610466) {
          _0x610466.deleteDragLine();
        }
      }
    });
    _atualizarContador(_0x86e893.dragLines);
  },
  afterDatasetsDraw(_0x4b3e9b) {
    const _0x2595cb = _0x4b3e9b.scales.y;
    const _0xef33db = _0x4b3e9b.dragLines || [];
    if (!_0xef33db.length || !_0x4b3e9b.chartArea) {
      return;
    }
    const _0xd65e90 = _0x4b3e9b.ctx;
    const {
      left: _0xffb211,
      right: _0x22927d,
      top: _0x429a42,
      bottom: _0x5979fc
    } = _0x4b3e9b.chartArea;
    const _0x4ed1c5 = 5;
    const _0x37a7c0 = 16;
    _0xef33db.forEach((_0x46dc2a, _0x192971) => {
      const _0x57a0ee = _0x2595cb.getPixelForValue(_0x46dc2a.y);
      if (!isFinite(_0x57a0ee) || _0x57a0ee < _0x429a42 || _0x57a0ee > _0x5979fc) {
        return;
      }
      const _0x3245cb = _0x192971 === _0x4b3e9b._selectedDragLine;
      _0xd65e90.save();
      _0xd65e90.strokeStyle = _0x46dc2a.color || "#1fcc59";
      _0xd65e90.lineWidth = _0x3245cb ? 2 : 1.5;
      if (!_0x3245cb) {
        _0xd65e90.setLineDash([8, 4]);
      }
      _0xd65e90.beginPath();
      _0xd65e90.moveTo(_0xffb211, _0x57a0ee);
      _0xd65e90.lineTo(_0x22927d, _0x57a0ee);
      _0xd65e90.stroke();
      _0xd65e90.setLineDash([]);
      const _0xa624e1 = _0x46dc2a.y.toFixed(1);
      _0xd65e90.font = "600 10.5px 'Inter',Arial,sans-serif";
      _0xd65e90.textBaseline = "middle";
      _0xd65e90.textAlign = "left";
      const _0x377ef0 = Math.ceil(_0xd65e90.measureText(_0xa624e1).width) + _0x4ed1c5 * 2;
      const _0x842ca = _0x2595cb.position === "right";
      const _0x235413 = _0x842ca ? _0xffb211 - 4 - _0x377ef0 : _0x22927d + 4;
      const _0xf431e1 = _0x57a0ee - _0x37a7c0 / 2;
      const _0x4d3e6a = 4;
      _0xd65e90.fillStyle = "rgba(13,16,26,0.96)";
      _0xd65e90.strokeStyle = _0x46dc2a.color || "#1fcc59";
      _0xd65e90.lineWidth = _0x3245cb ? 1.5 : 1;
      _0xd65e90.beginPath();
      _0xd65e90.roundRect(_0x235413, _0xf431e1, _0x377ef0, _0x37a7c0, _0x4d3e6a);
      _0xd65e90.fill();
      _0xd65e90.stroke();
      _0xd65e90.fillStyle = _0x46dc2a.color || "#1fcc59";
      _0xd65e90.fillText(_0xa624e1, _0x235413 + _0x4ed1c5, _0x57a0ee);
      _0xd65e90.restore();
    });
  }
};
const fibDraggablePlugin = {
  id: "fibDraggable",
  afterInit(_0x210358) {
    const _0x16934b = _0x210358.canvas;
    _0x210358.fibDraws = _loadDragFibs();
    _0x210358._selectedFib = -1;
    _0x210358._fibDrawMode = false;
    let _0x59cdb3 = null;
    let _0x3d0796 = -1;
    let _0x208f33 = 0;
    let _0x3b1d63 = 0;
    let _0x1a7f88 = 0;
    let _0x2a3e7a = 0;
    let _0x2c93d9 = null;
    let _0x49e831 = null;
    const _0x2154fe = 8;
    const _0xc9ea28 = 12;
    const _0x20c61f = () => _0x210358.scales.y;
    const _0x742541 = () => _0x210358.scales.x;
    const _0x59e545 = _0x485a7d => {
      const _0x2b10cf = _0x16934b.getBoundingClientRect();
      return ((_0x485a7d.touches && _0x485a7d.touches[0]?.clientY) ?? _0x485a7d.clientY ?? 0) - _0x2b10cf.top;
    };
    const _0x37ff28 = _0x21f9aa => {
      const _0x23ff4d = _0x16934b.getBoundingClientRect();
      return ((_0x21f9aa.touches && _0x21f9aa.touches[0]?.clientX) ?? _0x21f9aa.clientX ?? 0) - _0x23ff4d.left;
    };
    const _0x301602 = _0x4a6b60 => {
      const {
        left: _0x514fb6,
        right: _0x139c25
      } = _0x210358.chartArea;
      const _0x17922c = _0x742541();
      const _0x1da424 = {
        x1: _0x514fb6,
        x2: _0x139c25,
        anchored: false
      };
      if (_0x4a6b60.x1Idx == null || _0x4a6b60.x2Idx == null || !_0x17922c) {
        return _0x1da424;
      }
      let _0x441633 = _0x17922c.getPixelForValue(_0x4a6b60.x1Idx);
      let _0x92c786 = _0x17922c.getPixelForValue(_0x4a6b60.x2Idx);
      const _0x3c9545 = {
        x1: _0x514fb6,
        x2: _0x139c25,
        anchored: false
      };
      if (!isFinite(_0x441633) || !isFinite(_0x92c786)) {
        return _0x3c9545;
      }
      if (_0x441633 > _0x92c786) {
        [_0x441633, _0x92c786] = [_0x92c786, _0x441633];
      }
      return {
        x1: Math.max(_0x514fb6, _0x441633),
        x2: Math.min(_0x139c25, _0x92c786),
        anchored: true
      };
    };
    _0x210358.setFibDrawMode = _0x5649e9 => {
      _0x210358._fibDrawMode = !!_0x5649e9;
      _0x16934b.style.cursor = _0x5649e9 ? "crosshair" : "";
    };
    _0x210358.deleteFibSelected = () => {
      const _0x49e139 = _0x210358._selectedFib;
      if (_0x49e139 >= 0 && _0x49e139 < _0x210358.fibDraws.length) {
        _0x210358.fibDraws.splice(_0x49e139, 1);
        _0x210358._selectedFib = -1;
        _saveDragFibs(_0x210358.fibDraws);
        _atualizarContadorFibs(_0x210358.fibDraws);
        _0x210358.update();
        _captureControlsToSetup(_getActiveSetup());
      }
    };
    _0x210358.clearFibDraws = () => {
      _0x210358.fibDraws = [];
      _0x210358._selectedFib = -1;
      _saveDragFibs(_0x210358.fibDraws);
      _atualizarContadorFibs(_0x210358.fibDraws);
      _0x210358.update();
      _captureControlsToSetup(_getActiveSetup());
    };
    const _0x2e5b66 = (_0x19d0a6, _0x1a1c78) => {
      const _0x5db088 = _0x20c61f();
      if (!_0x5db088 || !_0x210358.chartArea) {
        return -1;
      }
      const {
        top: _0x590452,
        bottom: _0x203a61
      } = _0x210358.chartArea;
      let _0xf6efa2 = -1;
      let _0x46ddcd = Infinity;
      (_0x210358.fibDraws || []).forEach((_0x585738, _0x11aa84) => {
        const {
          x1: _0x1fb30f,
          x2: _0xc408e9
        } = _0x301602(_0x585738);
        if (_0x19d0a6 < _0x1fb30f - 2 || _0x19d0a6 > _0xc408e9 + 2) {
          return;
        }
        FIB_RETR_LEVELS.forEach(_0x10005c => {
          const _0x163c0c = _0x585738.y1 + _0x10005c / 100 * (_0x585738.y2 - _0x585738.y1);
          const _0x518f04 = _0x5db088.getPixelForValue(_0x163c0c);
          if (_0x518f04 < _0x590452 || _0x518f04 > _0x203a61) {
            return;
          }
          const _0x3d6e3f = Math.abs(_0x518f04 - _0x1a1c78);
          if (_0x3d6e3f < _0x46ddcd && _0x3d6e3f <= _0x2154fe) {
            _0x46ddcd = _0x3d6e3f;
            _0xf6efa2 = _0x11aa84;
          }
        });
      });
      return _0xf6efa2;
    };
    const _0x2ebb46 = _0x15d1ac => {
      const _0x479092 = _0x20c61f();
      if (!_0x479092) {
        return;
      }
      const _0x23ea34 = _0x59e545(_0x15d1ac);
      const _0x4fb1c2 = _0x37ff28(_0x15d1ac);
      if (_0x210358._fibDrawMode) {
        if (_0x15d1ac.cancelable) {
          _0x15d1ac.preventDefault();
        }
        let _0x3682e7 = _0x479092.getValueForPixel(_0x23ea34);
        _0x3682e7 = Math.max(_0x479092.min, Math.min(_0x479092.max, Math.round(_0x3682e7 * 10) / 10));
        const _0x220827 = {
          y1: _0x3682e7,
          y2: _0x3682e7,
          x1Px: _0x4fb1c2,
          x2Px: _0x4fb1c2
        };
        _0x59cdb3 = _0x220827;
        _0x210358._selectedFib = -1;
        _0x210358.update("none");
        return;
      }
      const _0x1c4717 = _0x2e5b66(_0x4fb1c2, _0x23ea34);
      if (_0x1c4717 >= 0) {
        if (_0x15d1ac.cancelable) {
          _0x15d1ac.preventDefault();
        }
        const _0x1ffa34 = _0x742541();
        _0x3d0796 = _0x1c4717;
        _0x210358._selectedFib = _0x1c4717;
        _0x208f33 = _0x479092.getValueForPixel(_0x23ea34);
        _0x3b1d63 = _0x210358.fibDraws[_0x1c4717].y1;
        _0x1a7f88 = _0x210358.fibDraws[_0x1c4717].y2;
        _0x2a3e7a = _0x1ffa34 ? _0x1ffa34.getValueForPixel(_0x4fb1c2) : 0;
        _0x2c93d9 = _0x210358.fibDraws[_0x1c4717].x1Idx ?? null;
        _0x49e831 = _0x210358.fibDraws[_0x1c4717].x2Idx ?? null;
      } else {
        _0x210358._selectedFib = -1;
      }
      _0x210358.update();
    };
    const _0x23c290 = _0x3e7ecd => {
      const _0x34baf9 = _0x20c61f();
      if (!_0x34baf9) {
        return;
      }
      const _0x373373 = _0x59e545(_0x3e7ecd);
      const _0x4a39b0 = _0x37ff28(_0x3e7ecd);
      if (_0x59cdb3) {
        if (_0x3e7ecd.cancelable) {
          _0x3e7ecd.preventDefault();
        }
        let _0x269cb2 = _0x34baf9.getValueForPixel(_0x373373);
        _0x269cb2 = Math.max(_0x34baf9.min, Math.min(_0x34baf9.max, Math.round(_0x269cb2 * 10) / 10));
        _0x59cdb3.y2 = _0x269cb2;
        _0x59cdb3.x2Px = _0x4a39b0;
        _0x210358.update("none");
        return;
      }
      if (_0x3d0796 >= 0) {
        if (_0x3e7ecd.cancelable) {
          _0x3e7ecd.preventDefault();
        }
        const _0x9df03 = _0x34baf9.getValueForPixel(_0x373373);
        const _0xce32ef = _0x9df03 - _0x208f33;
        _0x210358.fibDraws[_0x3d0796].y1 = Math.round((_0x3b1d63 + _0xce32ef) * 10) / 10;
        _0x210358.fibDraws[_0x3d0796].y2 = Math.round((_0x1a7f88 + _0xce32ef) * 10) / 10;
        if (_0x2c93d9 != null && _0x49e831 != null) {
          const _0x83a53a = _0x742541();
          if (_0x83a53a) {
            const _0x1ac47a = _0x83a53a.getValueForPixel(_0x4a39b0);
            const _0x4f3ab9 = Math.round(_0x1ac47a - _0x2a3e7a);
            let _0x2ae374 = _0x2c93d9 + _0x4f3ab9;
            let _0x2f0741 = _0x49e831 + _0x4f3ab9;
            const _0x380382 = (_0x210358.data.labels || []).length;
            if (_0x380382 > 0) {
              const _0x514dba = Math.min(_0x2ae374, _0x2f0741);
              const _0x160b3c = Math.max(_0x2ae374, _0x2f0741);
              if (_0x514dba < 0) {
                _0x2ae374 -= _0x514dba;
                _0x2f0741 -= _0x514dba;
              }
              const _0x24c8a4 = Math.max(_0x2ae374, _0x2f0741);
              if (_0x24c8a4 > _0x380382 - 1) {
                const _0x4a6c6e = _0x24c8a4 - (_0x380382 - 1);
                _0x2ae374 -= _0x4a6c6e;
                _0x2f0741 -= _0x4a6c6e;
              }
            }
            _0x210358.fibDraws[_0x3d0796].x1Idx = _0x2ae374;
            _0x210358.fibDraws[_0x3d0796].x2Idx = _0x2f0741;
          }
        }
        _0x210358.update("none");
      }
    };
    const _0x1c14e9 = () => {
      if (_0x59cdb3) {
        const _0x3dbbda = Math.abs(_0x59cdb3.y2 - _0x59cdb3.y1);
        const _0x3b9cd4 = Math.abs(_0x59cdb3.x2Px - _0x59cdb3.x1Px);
        if (_0x3dbbda > 0) {
          if (_0x210358.fibDraws.length >= MAX_DRAG_FIBS) {
            alert("Máximo de " + MAX_DRAG_FIBS + " fibonacci!");
          } else {
            const _0x40b1e2 = FIB_COLORS[_0x210358.fibDraws.length % FIB_COLORS.length];
            let _0x46f9df = null;
            let _0x5b4391 = null;
            if (_0x3b9cd4 >= _0xc9ea28) {
              const _0x1f9e92 = _0x742541();
              if (_0x1f9e92) {
                _0x46f9df = _0x1f9e92.getValueForPixel(_0x59cdb3.x1Px);
                _0x5b4391 = _0x1f9e92.getValueForPixel(_0x59cdb3.x2Px);
              }
            }
            const _0x4948a9 = {
              y1: _0x59cdb3.y1,
              y2: _0x59cdb3.y2,
              x1Idx: _0x46f9df,
              x2Idx: _0x5b4391,
              color: _0x40b1e2
            };
            _0x210358.fibDraws.push(_0x4948a9);
            _0x210358._selectedFib = _0x210358.fibDraws.length - 1;
            _saveDragFibs(_0x210358.fibDraws);
            _atualizarContadorFibs(_0x210358.fibDraws);
            _captureControlsToSetup(_getActiveSetup());
          }
        }
        _0x59cdb3 = null;
        _0x210358.setFibDrawMode(false);
        _0x210358.update();
      }
      if (_0x3d0796 >= 0) {
        _saveDragFibs(_0x210358.fibDraws);
        _captureControlsToSetup(_getActiveSetup());
        _0x3d0796 = -1;
      }
    };
    _0x16934b.addEventListener("mousedown", _0x2ebb46);
    _0x16934b.addEventListener("mousemove", _0x23c290);
    _0x16934b.addEventListener("mouseleave", _0x1c14e9);
    window.addEventListener("mouseup", _0x1c14e9);
    _0x16934b.addEventListener("touchstart", _0x2ebb46, {
      passive: false
    });
    _0x16934b.addEventListener("touchmove", _0x23c290, {
      passive: false
    });
    _0x16934b.addEventListener("touchend", _0x1c14e9, {
      passive: true
    });
    _0x16934b.addEventListener("touchcancel", _0x1c14e9, {
      passive: true
    });
    window.addEventListener("keydown", _0x59b911 => {
      if (_0x59b911.key === "Delete" || _0x59b911.key === "Backspace") {
        const _0x1b104e = chartInstances.Copa || Object.values(chartInstances)[0];
        if (_0x1b104e) {
          _0x1b104e.deleteFibSelected();
        }
      }
    });
    _0x210358._fibCreatingRef = () => _0x59cdb3;
    _atualizarContadorFibs(_0x210358.fibDraws);
  },
  afterDatasetsDraw(_0x49f073) {
    const _0x2d91cf = _0x49f073.scales.y;
    if (!_0x2d91cf || !_0x49f073.chartArea) {
      return;
    }
    const _0x2a1e00 = _0x49f073.ctx;
    const {
      top: _0x46ecb8,
      bottom: _0x5d5c62
    } = _0x49f073.chartArea;
    const _0xb0d9be = (_0x52a4cd, _0x1bd4fb, _0x5ec508, _0x1e8436) => {
      const {
        x1: _0x24492c,
        x2: _0x4ae5e9,
        anchored: _0x24e392
      } = _0x1e8436;
      FIB_RETR_LEVELS.forEach(_0x4a4935 => {
        const _0x320276 = _0x52a4cd.y1 + _0x4a4935 / 100 * (_0x52a4cd.y2 - _0x52a4cd.y1);
        const _0x1653e1 = _0x2d91cf.getPixelForValue(_0x320276);
        if (!isFinite(_0x1653e1) || _0x1653e1 < _0x46ecb8 - 1 || _0x1653e1 > _0x5d5c62 + 1) {
          return;
        }
        _0x2a1e00.save();
        _0x2a1e00.strokeStyle = _0x52a4cd.color;
        _0x2a1e00.lineWidth = _0x1bd4fb ? 1.8 : 1;
        _0x2a1e00.globalAlpha = _0x5ec508 ? 0.55 : _0x4a4935 === 0 || _0x4a4935 === 100 ? 0.9 : 0.7;
        if (!_0x1bd4fb) {
          _0x2a1e00.setLineDash([5, 4]);
        }
        _0x2a1e00.beginPath();
        _0x2a1e00.moveTo(_0x24492c, _0x1653e1);
        _0x2a1e00.lineTo(_0x4ae5e9, _0x1653e1);
        _0x2a1e00.stroke();
        _0x2a1e00.setLineDash([]);
        _0x2a1e00.globalAlpha = 1;
        _0x2a1e00.fillStyle = _0x52a4cd.color;
        _0x2a1e00.font = "600 9.5px 'Inter',Arial,sans-serif";
        _0x2a1e00.textAlign = "left";
        _0x2a1e00.textBaseline = "middle";
        _0x2a1e00.fillText(_0x4a4935 + "%  " + _0x320276.toFixed(1), _0x24492c + 6, _0x1653e1 - 7);
        _0x2a1e00.restore();
      });
      const _0x570c14 = _0x24e392 ? _0x24492c : _0x24492c + 16;
      const _0x23b37f = _0x24e392 ? _0x4ae5e9 : _0x4ae5e9 - 16;
      [[_0x52a4cd.y1, _0x570c14], [_0x52a4cd.y2, _0x23b37f]].forEach(([_0x4abb32, _0x18fc42]) => {
        const _0x525716 = _0x2d91cf.getPixelForValue(_0x4abb32);
        if (!isFinite(_0x525716) || _0x525716 < _0x46ecb8 || _0x525716 > _0x5d5c62) {
          return;
        }
        _0x2a1e00.save();
        _0x2a1e00.fillStyle = _0x52a4cd.color;
        _0x2a1e00.strokeStyle = "rgba(8,11,20,0.9)";
        _0x2a1e00.lineWidth = 1.2;
        _0x2a1e00.beginPath();
        _0x2a1e00.arc(_0x18fc42, _0x525716, _0x1bd4fb ? 4.5 : 3.5, 0, Math.PI * 2);
        _0x2a1e00.fill();
        _0x2a1e00.stroke();
        _0x2a1e00.restore();
      });
    };
    const _0x5f5822 = _0x3e497a => {
      const {
        left: _0x2b4395,
        right: _0x4db3ea
      } = _0x49f073.chartArea;
      const _0x4c2aa5 = _0x49f073.scales.x;
      const _0x235a20 = {
        x1: _0x2b4395,
        x2: _0x4db3ea,
        anchored: false
      };
      if (_0x3e497a.x1Idx == null || _0x3e497a.x2Idx == null || !_0x4c2aa5) {
        return _0x235a20;
      }
      let _0x5133e7 = _0x4c2aa5.getPixelForValue(_0x3e497a.x1Idx);
      let _0x5b0b08 = _0x4c2aa5.getPixelForValue(_0x3e497a.x2Idx);
      const _0x282110 = {
        x1: _0x2b4395,
        x2: _0x4db3ea,
        anchored: false
      };
      if (!isFinite(_0x5133e7) || !isFinite(_0x5b0b08)) {
        return _0x282110;
      }
      if (_0x5133e7 > _0x5b0b08) {
        [_0x5133e7, _0x5b0b08] = [_0x5b0b08, _0x5133e7];
      }
      return {
        x1: Math.max(_0x2b4395, _0x5133e7),
        x2: Math.min(_0x4db3ea, _0x5b0b08),
        anchored: true
      };
    };
    (_0x49f073.fibDraws || []).forEach((_0x105980, _0x4026af) => _0xb0d9be(_0x105980, _0x4026af === _0x49f073._selectedFib, false, _0x5f5822(_0x105980)));
    const _0x3b55ba = _0x49f073._fibCreatingRef ? _0x49f073._fibCreatingRef() : null;
    if (_0x3b55ba) {
      const {
        left: _0x42b414,
        right: _0x4c3839
      } = _0x49f073.chartArea;
      const _0x523791 = Math.abs(_0x3b55ba.x2Px - _0x3b55ba.x1Px);
      const _0xe0959 = _0x523791 >= 12;
      const _0x1e422e = _0xe0959 ? Math.min(_0x3b55ba.x1Px, _0x3b55ba.x2Px) : _0x42b414;
      const _0x438edf = _0xe0959 ? Math.max(_0x3b55ba.x1Px, _0x3b55ba.x2Px) : _0x4c3839;
      const _0x31291c = {
        y1: _0x3b55ba.y1,
        y2: _0x3b55ba.y2,
        color: "#E5E7EB"
      };
      const _0x32762c = {
        x1: _0x1e422e,
        x2: _0x438edf,
        anchored: _0xe0959
      };
      _0xb0d9be(_0x31291c, true, true, _0x32762c);
    }
  }
};
const trendLinePlugin = {
  id: "trendLine",
  afterInit(_0x1b36ef) {
    const _0x530bb4 = _0x1b36ef.canvas;
    _0x1b36ef.trendLines = _loadDragTrends();
    _0x1b36ef._selectedTrend = -1;
    _0x1b36ef._trendDrawMode = false;
    _0x1b36ef._trendPendingTipo = "LTA";
    let _0x21b525 = null;
    let _0x41b9f2 = -1;
    let _0x4a884e = null;
    let _0x56fa7c = 0;
    let _0x57571e = 0;
    let _0x12af78 = null;
    const _0x30ea41 = 9;
    const _0x5f2343 = () => _0x1b36ef.scales.x;
    const _0x2c6d95 = () => _0x1b36ef.scales.y;
    const _0x590a52 = _0x2843f2 => {
      const _0x3742df = _0x530bb4.getBoundingClientRect();
      return ((_0x2843f2.touches && _0x2843f2.touches[0]?.clientY) ?? _0x2843f2.clientY ?? 0) - _0x3742df.top;
    };
    const _0x4f9252 = _0x184b39 => {
      const _0x126d46 = _0x530bb4.getBoundingClientRect();
      return ((_0x184b39.touches && _0x184b39.touches[0]?.clientX) ?? _0x184b39.clientX ?? 0) - _0x126d46.left;
    };
    const _0x3abab6 = _0x2c55a5 => {
      const _0x12c39c = _0x5f2343();
      const _0x556e71 = _0x2c6d95();
      if (!_0x12c39c || !_0x556e71) {
        return null;
      }
      return {
        x1: _0x12c39c.getPixelForValue(_0x2c55a5.x1Idx),
        y1: _0x556e71.getPixelForValue(_0x2c55a5.y1),
        x2: _0x12c39c.getPixelForValue(_0x2c55a5.x2Idx),
        y2: _0x556e71.getPixelForValue(_0x2c55a5.y2)
      };
    };
    _0x1b36ef.setTrendDrawMode = (_0x326bc1, _0x2eb016) => {
      _0x1b36ef._trendDrawMode = !!_0x326bc1;
      if (_0x2eb016) {
        _0x1b36ef._trendPendingTipo = _0x2eb016;
      }
      _0x530bb4.style.cursor = _0x326bc1 ? "crosshair" : "";
    };
    _0x1b36ef.deleteTrendSelected = () => {
      const _0x34f268 = _0x1b36ef._selectedTrend;
      if (_0x34f268 >= 0 && _0x34f268 < _0x1b36ef.trendLines.length) {
        _0x1b36ef.trendLines.splice(_0x34f268, 1);
        _0x1b36ef._selectedTrend = -1;
        _saveDragTrends(_0x1b36ef.trendLines);
        _atualizarContadorTrends(_0x1b36ef.trendLines);
        _0x1b36ef.update();
        _captureControlsToSetup(_getActiveSetup());
      }
    };
    _0x1b36ef.clearTrendDraws = () => {
      _0x1b36ef.trendLines = [];
      _0x1b36ef._selectedTrend = -1;
      _saveDragTrends(_0x1b36ef.trendLines);
      _atualizarContadorTrends(_0x1b36ef.trendLines);
      _0x1b36ef.update();
      _captureControlsToSetup(_getActiveSetup());
    };
    const _0x256956 = (_0x2bd8d1, _0x5e1f3f) => {
      const _0x361abf = {
        idx: -1,
        handle: null
      };
      if (!_0x1b36ef.chartArea) {
        return _0x361abf;
      }
      let _0x1bbb6c = -1;
      let _0x3c216f = Infinity;
      let _0xdc414d = null;
      (_0x1b36ef.trendLines || []).forEach((_0x8eb43a, _0x3c47b4) => {
        const _0x56e436 = _0x3abab6(_0x8eb43a);
        if (!_0x56e436) {
          return;
        }
        const _0xa2c9bb = Math.hypot(_0x56e436.x1 - _0x2bd8d1, _0x56e436.y1 - _0x5e1f3f);
        const _0x41ae27 = Math.hypot(_0x56e436.x2 - _0x2bd8d1, _0x56e436.y2 - _0x5e1f3f);
        const _0xb4ba70 = _distToSegment(_0x2bd8d1, _0x5e1f3f, _0x56e436.x1, _0x56e436.y1, _0x56e436.x2, _0x56e436.y2);
        if (_0xa2c9bb <= _0x30ea41 && _0xa2c9bb < _0x3c216f) {
          _0x3c216f = _0xa2c9bb;
          _0x1bbb6c = _0x3c47b4;
          _0xdc414d = "p1";
        }
        if (_0x41ae27 <= _0x30ea41 && _0x41ae27 < _0x3c216f) {
          _0x3c216f = _0x41ae27;
          _0x1bbb6c = _0x3c47b4;
          _0xdc414d = "p2";
        }
        if (_0xb4ba70 <= _0x30ea41 && _0xb4ba70 < _0x3c216f) {
          _0x3c216f = _0xb4ba70;
          _0x1bbb6c = _0x3c47b4;
          _0xdc414d = "body";
        }
      });
      const _0x1ca61e = {
        idx: _0x1bbb6c,
        handle: _0xdc414d
      };
      return _0x1ca61e;
    };
    const _0x44611b = _0x81ca96 => {
      const _0x44da88 = _0x5f2343();
      const _0x3fbb38 = _0x2c6d95();
      if (!_0x44da88 || !_0x3fbb38) {
        return;
      }
      const _0x15a96e = _0x590a52(_0x81ca96);
      const _0x47abff = _0x4f9252(_0x81ca96);
      if (_0x1b36ef._trendDrawMode) {
        if (_0x81ca96.cancelable) {
          _0x81ca96.preventDefault();
        }
        let _0x236b80 = _0x3fbb38.getValueForPixel(_0x15a96e);
        _0x236b80 = Math.round(_0x236b80 * 10) / 10;
        const _0x307038 = {
          x1Px: _0x47abff,
          y1: _0x236b80,
          x2Px: _0x47abff,
          y2: _0x236b80
        };
        _0x21b525 = _0x307038;
        _0x1b36ef._selectedTrend = -1;
        _0x1b36ef.update("none");
        return;
      }
      const {
        idx: _0x2875d4,
        handle: _0x1bab8d
      } = _0x256956(_0x47abff, _0x15a96e);
      if (_0x2875d4 >= 0) {
        if (_0x81ca96.cancelable) {
          _0x81ca96.preventDefault();
        }
        _0x41b9f2 = _0x2875d4;
        _0x4a884e = _0x1bab8d;
        _0x1b36ef._selectedTrend = _0x2875d4;
        _0x56fa7c = _0x44da88.getValueForPixel(_0x47abff);
        _0x57571e = _0x3fbb38.getValueForPixel(_0x15a96e);
        const _0x366121 = {
          ..._0x1b36ef.trendLines[_0x2875d4]
        };
        _0x12af78 = _0x366121;
      } else {
        _0x1b36ef._selectedTrend = -1;
      }
      _0x1b36ef.update();
    };
    const _0xfbed0c = _0x5ef517 => {
      const _0x1e7d8e = _0x5f2343();
      const _0x13c26e = _0x2c6d95();
      if (!_0x1e7d8e || !_0x13c26e) {
        return;
      }
      const _0x46f7b5 = _0x590a52(_0x5ef517);
      const _0x4b38a9 = _0x4f9252(_0x5ef517);
      if (_0x21b525) {
        if (_0x5ef517.cancelable) {
          _0x5ef517.preventDefault();
        }
        let _0x38917c = _0x13c26e.getValueForPixel(_0x46f7b5);
        _0x21b525.y2 = Math.round(_0x38917c * 10) / 10;
        _0x21b525.x2Px = _0x4b38a9;
        _0x1b36ef.update("none");
        return;
      }
      if (_0x41b9f2 >= 0) {
        if (_0x5ef517.cancelable) {
          _0x5ef517.preventDefault();
        }
        const _0x55a012 = _0x1b36ef.trendLines[_0x41b9f2];
        if (_0x4a884e === "p1") {
          _0x55a012.x1Idx = Math.round(_0x1e7d8e.getValueForPixel(_0x4b38a9));
          _0x55a012.y1 = Math.round(_0x13c26e.getValueForPixel(_0x46f7b5) * 10) / 10;
        } else if (_0x4a884e === "p2") {
          _0x55a012.x2Idx = Math.round(_0x1e7d8e.getValueForPixel(_0x4b38a9));
          _0x55a012.y2 = Math.round(_0x13c26e.getValueForPixel(_0x46f7b5) * 10) / 10;
        } else {
          const _0x236a5a = _0x1e7d8e.getValueForPixel(_0x4b38a9) - _0x56fa7c;
          const _0x1972f3 = _0x13c26e.getValueForPixel(_0x46f7b5) - _0x57571e;
          _0x55a012.x1Idx = Math.round(_0x12af78.x1Idx + _0x236a5a);
          _0x55a012.x2Idx = Math.round(_0x12af78.x2Idx + _0x236a5a);
          _0x55a012.y1 = Math.round((_0x12af78.y1 + _0x1972f3) * 10) / 10;
          _0x55a012.y2 = Math.round((_0x12af78.y2 + _0x1972f3) * 10) / 10;
        }
        _0x1b36ef.update("none");
      }
    };
    const _0x17ae1b = () => {
      if (_0x21b525) {
        const _0x3679cb = Math.abs(_0x21b525.x2Px - _0x21b525.x1Px);
        if (_0x3679cb > 4) {
          if (_0x1b36ef.trendLines.length >= MAX_DRAG_TRENDS) {
            alert("Máximo de " + MAX_DRAG_TRENDS + " linhas de tendência!");
          } else {
            const _0x29d8c4 = _0x5f2343();
            const _0x323f6e = Math.round(_0x29d8c4.getValueForPixel(_0x21b525.x1Px));
            const _0x151ab2 = Math.round(_0x29d8c4.getValueForPixel(_0x21b525.x2Px));
            const _0x1538a1 = _0x1b36ef._trendPendingTipo || "LTA";
            const _0x166ba3 = TREND_COLORS[_0x1538a1] || "#34D399";
            const _0x57585a = {
              x1Idx: _0x323f6e,
              y1: _0x21b525.y1,
              x2Idx: _0x151ab2,
              y2: _0x21b525.y2,
              color: _0x166ba3,
              tipo: _0x1538a1
            };
            _0x1b36ef.trendLines.push(_0x57585a);
            _0x1b36ef._selectedTrend = _0x1b36ef.trendLines.length - 1;
            _saveDragTrends(_0x1b36ef.trendLines);
            _atualizarContadorTrends(_0x1b36ef.trendLines);
            _captureControlsToSetup(_getActiveSetup());
          }
        }
        _0x21b525 = null;
        _0x1b36ef.setTrendDrawMode(false);
        _0x1b36ef.update();
      }
      if (_0x41b9f2 >= 0) {
        _saveDragTrends(_0x1b36ef.trendLines);
        _captureControlsToSetup(_getActiveSetup());
      }
      _0x41b9f2 = -1;
      _0x4a884e = null;
    };
    _0x530bb4.addEventListener("mousedown", _0x44611b);
    _0x530bb4.addEventListener("mousemove", _0xfbed0c);
    _0x530bb4.addEventListener("mouseleave", _0x17ae1b);
    window.addEventListener("mouseup", _0x17ae1b);
    _0x530bb4.addEventListener("touchstart", _0x44611b, {
      passive: false
    });
    _0x530bb4.addEventListener("touchmove", _0xfbed0c, {
      passive: false
    });
    _0x530bb4.addEventListener("touchend", _0x17ae1b, {
      passive: true
    });
    _0x530bb4.addEventListener("touchcancel", _0x17ae1b, {
      passive: true
    });
    window.addEventListener("keydown", _0xdae736 => {
      if (_0xdae736.key === "Delete" || _0xdae736.key === "Backspace") {
        const _0x28e3c1 = chartInstances.Copa || Object.values(chartInstances)[0];
        if (_0x28e3c1) {
          _0x28e3c1.deleteTrendSelected();
        }
      }
    });
    _0x1b36ef._trendCreatingRef = () => _0x21b525;
    _atualizarContadorTrends(_0x1b36ef.trendLines);
  },
  afterDatasetsDraw(_0x2633cb) {
    const _0x4d26c2 = _0x2633cb.scales.x;
    const _0x3ca2bd = _0x2633cb.scales.y;
    if (!_0x4d26c2 || !_0x3ca2bd || !_0x2633cb.chartArea) {
      return;
    }
    const _0x53dbb5 = _0x2633cb.ctx;
    const {
      right: _0x37e910
    } = _0x2633cb.chartArea;
    const _0xf807b9 = (_0x1e9d36, _0x5680fe, _0x5806c9, _0x459613, _0x437c52, _0x4219ea, _0xba3543, _0x4c57d2) => {
      const _0x431f8f = _0x4d26c2.getPixelForValue(_0x1e9d36);
      const _0x2140b0 = _0x3ca2bd.getPixelForValue(_0x5680fe);
      const _0x144c06 = _0x4d26c2.getPixelForValue(_0x5806c9);
      const _0x781fc2 = _0x3ca2bd.getPixelForValue(_0x459613);
      if (![_0x431f8f, _0x2140b0, _0x144c06, _0x781fc2].every(isFinite)) {
        return;
      }
      _0x53dbb5.save();
      _0x53dbb5.strokeStyle = _0x437c52;
      _0x53dbb5.lineWidth = _0x4219ea ? 2.2 : 1.6;
      _0x53dbb5.globalAlpha = _0xba3543 ? 0.6 : 1;
      _0x53dbb5.beginPath();
      _0x53dbb5.moveTo(_0x431f8f, _0x2140b0);
      _0x53dbb5.lineTo(_0x144c06, _0x781fc2);
      _0x53dbb5.stroke();
      if (_0x144c06 !== _0x431f8f) {
        const _0x55bad2 = (_0x781fc2 - _0x2140b0) / (_0x144c06 - _0x431f8f);
        const _0x2ba225 = _0x781fc2 + _0x55bad2 * (_0x37e910 - _0x144c06);
        _0x53dbb5.setLineDash([6, 5]);
        _0x53dbb5.globalAlpha = _0xba3543 ? 0.4 : 0.65;
        _0x53dbb5.beginPath();
        _0x53dbb5.moveTo(_0x144c06, _0x781fc2);
        _0x53dbb5.lineTo(_0x37e910, _0x2ba225);
        _0x53dbb5.stroke();
        _0x53dbb5.setLineDash([]);
      }
      _0x53dbb5.globalAlpha = 1;
      if (!_0xba3543) {
        [[_0x431f8f, _0x2140b0], [_0x144c06, _0x781fc2]].forEach(([_0x4cfde2, _0x22c336]) => {
          _0x53dbb5.beginPath();
          _0x53dbb5.fillStyle = _0x437c52;
          _0x53dbb5.strokeStyle = "rgba(8,11,20,0.9)";
          _0x53dbb5.lineWidth = 1.2;
          _0x53dbb5.arc(_0x4cfde2, _0x22c336, _0x4219ea ? 4.5 : 3.5, 0, Math.PI * 2);
          _0x53dbb5.fill();
          _0x53dbb5.stroke();
        });
        if (_0x4c57d2) {
          _0x53dbb5.font = "600 9.5px 'Inter',Arial,sans-serif";
          _0x53dbb5.fillStyle = _0x437c52;
          _0x53dbb5.textAlign = "left";
          _0x53dbb5.textBaseline = "bottom";
          _0x53dbb5.fillText(_0x4c57d2, _0x144c06 + 6, _0x781fc2 - 4);
        }
      }
      _0x53dbb5.restore();
    };
    (_0x2633cb.trendLines || []).forEach((_0x158bd1, _0x3f2b23) => {
      _0xf807b9(_0x158bd1.x1Idx, _0x158bd1.y1, _0x158bd1.x2Idx, _0x158bd1.y2, _0x158bd1.color, _0x3f2b23 === _0x2633cb._selectedTrend, false, _0x158bd1.tipo);
    });
    const _0xcd498f = _0x2633cb._trendCreatingRef ? _0x2633cb._trendCreatingRef() : null;
    if (_0xcd498f) {
      const _0xd2574e = _0x4d26c2.getValueForPixel(_0xcd498f.x1Px);
      const _0x2f872d = _0x4d26c2.getValueForPixel(_0xcd498f.x2Px);
      const _0x14b841 = TREND_COLORS[_0x2633cb._trendPendingTipo] || "#E5E7EB";
      _0xf807b9(_0xd2574e, _0xcd498f.y1, _0x2f872d, _0xcd498f.y2, _0x14b841, true, true, null);
    }
  }
};
Chart.defaults.animation.duration = 0;
Chart.defaults.font.family = "'Inter','Segoe UI',system-ui,-apple-system,Arial,sans-serif";
function createStatsChart(_0x50c1c6, _0x470939, _0x2d629e, _0x5189b7) {
  const _0x3976c3 = _getActiveSetup();
  const _0xac04a6 = [];
  const _0x34ec67 = "#38BDF8";
  const _0x5d8f5f = "#F59E0B";
  Object.entries(labelToKey).forEach(([_0x34af01]) => {
    const _0x172b85 = labelToKey[_0x34af01];
    const _0x28c490 = _marketColor(_0x3976c3, _0x34af01);
    const _0x40a2e9 = _0x34af01 === "Gols Individual";
    const _0xec2eda = {
      label: _0x34af01,
      data: _0x2d629e[_0x172b85],
      borderColor: _0x28c490,
      backgroundColor: _0x28c490,
      pointBackgroundColor: _0x2d629e[_0x172b85 + "Colors"],
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
      yAxisID: _0x40a2e9 ? "y2" : "y",
      hidden: !statsChartVisibleDatasets[_0x34af01]
    };
    _0xac04a6.push(_0xec2eda);
    const _0x5b11c6 = {
      label: _0x34af01 + " - Short MA",
      data: _0x2d629e[_0x172b85 + "Short"],
      borderColor: _0x34ec67,
      backgroundColor: "transparent",
      tension: 0.3,
      cubicInterpolationMode: "monotone",
      borderWidth: 1.75,
      borderDash: [4, 3],
      pointRadius: 0,
      fill: false,
      yAxisID: _0x40a2e9 ? "y2" : "y",
      hidden: !showMovingAverages || !statsChartVisibleDatasets[_0x34af01]
    };
    _0xac04a6.push(_0x5b11c6);
    const _0x496cf2 = {
      label: _0x34af01 + " - Long MA",
      data: _0x2d629e[_0x172b85 + "Long"],
      borderColor: _0x5d8f5f,
      backgroundColor: "transparent",
      tension: 0.3,
      cubicInterpolationMode: "monotone",
      borderWidth: 1.75,
      borderDash: [2, 3],
      pointRadius: 0,
      fill: false,
      yAxisID: _0x40a2e9 ? "y2" : "y",
      hidden: !showMovingAverages || !statsChartVisibleDatasets[_0x34af01]
    };
    _0xac04a6.push(_0x496cf2);
  });
  const _0x5a0a01 = {
    labels: _0x470939,
    datasets: _0xac04a6
  };
  const _0x54fe40 = {
    padding: yAxisPosition === "right" ? {
      top: 30,
      left: 80
    } : {
      top: 30,
      right: 80
    }
  };
  const _0x3a9f86 = {
    enabled: _0x3976c3.linhaAtual ?? true
  };
  return new Chart(_0x50c1c6, {
    type: "line",
    data: _0x5a0a01,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      layout: _0x54fe40,
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
            title: _0x2f67c7 => {
              const _0x414125 = chartData[_0x5189b7];
              const _0x326381 = _0x414125[Math.max(0, _0x414125.length - numPoints) + _0x2f67c7[0].dataIndex];
              if (_0x326381) {
                return _0x326381.hora + ":" + _0x326381.minuto.toString().padStart(2, "0");
              } else {
                return "";
              }
            },
            label: _0x3327d9 => {
              const _0x16363e = _0x3327d9.parsed.y;
              if (_0x16363e === null) {
                return "";
              }
              const _0x2607aa = _0x3327d9.dataset.label === "Gols FT" || _0x3327d9.dataset.label === "Gols HT" || _0x3327d9.dataset.label === "Gols Individual" || _0x3327d9.dataset.label === "Gols FT Casa" || _0x3327d9.dataset.label === "Gols FT Fora";
              if (_0x2607aa) {
                return _0x3327d9.dataset.label + ": " + _0x16363e + " gols";
              } else {
                return _0x3327d9.dataset.label + ": " + _0x16363e.toFixed(2) + "%";
              }
            },
            afterBody: _0x3e08e5 => {
              const _0x18ca9f = chartData[_0x5189b7];
              const _0x30c3e2 = _0x18ca9f[Math.max(0, _0x18ca9f.length - numPoints) + _0x3e08e5[0].dataIndex];
              if (_0x30c3e2) {
                return "FT: " + (_0x30c3e2.ft || "N/A") + "  HT: " + (_0x30c3e2.ht || "N/A");
              } else {
                return "";
              }
            }
          }
        },
        linhaAtual: _0x3a9f86
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
          afterFit: _0x48abff => {
            _0x48abff.paddingTop = 20;
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
          afterFit: _0x202f32 => {
            _0x202f32.width = 0;
          }
        }
      }
    },
    plugins: [fibonacciLinesPlugin, fibDraggablePlugin, linhaAtualPlugin, linhaDraggablePlugin, trendLinePlugin, rotulosPlugin]
  });
}
function updateStatsChart(_0xf33629, _0x1b4f44) {
  if (!_0xf33629) {
    return;
  }
  _0xf33629.data.labels = _0x1b4f44.labels;
  _0xf33629.data.datasets.forEach(_0x47e9c5 => {
    _0x47e9c5.data = _0x1b4f44[getKeyFromLabel(_0x47e9c5.label)];
    if (!_0x47e9c5.label.includes(" MA")) {
      _0x47e9c5.pointBackgroundColor = _0x1b4f44[getKeyFromLabel(_0x47e9c5.label) + "Colors"];
    }
  });
  _0xf33629.update();
  _updateLinesPanelValues();
}
function processApiData(_0x3ae1c0, _0x8ae59d) {
  const _0x55758d = [..._0x3ae1c0].sort((_0x59510d, _0x3ed616) => {
    const _0x5af263 = new Date(_0x59510d.data);
    const _0x2daf41 = new Date(_0x3ed616.data);
    if (_0x5af263.getTime() !== _0x2daf41.getTime()) {
      return _0x5af263 - _0x2daf41;
    }
    if (_0x59510d.hora !== _0x3ed616.hora) {
      return _0x59510d.hora - _0x3ed616.hora;
    }
    return _0x59510d.minuto - _0x3ed616.minuto;
  });
  const _0x5f5372 = _0x55758d.slice(-numPoints - Math.ceil(averagePoints * 3.5));
  chartData[_0x8ae59d] = _0x5f5372;
  function _0x4c5ae1(_0x3b729e) {
    const _0x3078aa = new Date(_0x3b729e.data);
    return Math.floor(_0x3078aa.getTime() / 86400000) * 1440 + _0x3b729e.hora * 60 + _0x3b729e.minuto;
  }
  let _0x2a455c = [];
  let _0x79406a = [];
  let _0x36a086 = [];
  let _0x4c9aed = [];
  let _0xa973ab = [];
  let _0x4c2483 = [];
  let _0x238cdc = [];
  let _0x44aec2 = [];
  let _0x57bf50 = [];
  let _0x961a29 = [];
  let _0x32bed0 = [];
  let _0x54bd82 = [];
  let _0x42ceff = [];
  let _0x2b7431 = [];
  let _0x5ec9dd = [];
  let _0x118ce4 = [];
  let _0x298f1f = [];
  let _0x871047 = [];
  let _0x19a14c = [];
  let _0x1b5614 = [];
  let _0x1c24ae = [];
  let _0x5ef63e = [];
  let _0x16bfb7 = [];
  let _0x2b826b = [];
  let _0x12441f = [];
  let _0x5c3ac1 = [];
  let _0x4a6b39 = [];
  let _0x5457bc = [];
  let _0x53be5a = [];
  let _0xa0a671 = [];
  let _0x5f1304 = [];
  let _0x4680b7 = [];
  let _0x4c92b3 = [];
  let _0x4b2ad1 = [];
  let _0x1bbe72 = [];
  let _0x490262 = [];
  let _0x233313 = [];
  let _0x241130 = [];
  let _0x6c90fc = [];
  let _0x374007 = [];
  let _0x298826 = [];
  let _0x356c8a = [];
  let _0x31dacc = [];
  let _0x576e5c = [];
  let _0x267262 = [];
  let _0x396664 = [];
  let _0x3ad61f = [];
  let _0x1078d7 = [];
  let _0x4e3946 = [];
  let _0x3c88ed = [];
  let _0x32e31c = [];
  let _0x4a2a6a = [];
  let _0x42be3b = [];
  let _0x3b4c11 = [];
  let _0x580ea3 = [];
  let _0xf055c8 = [];
  let _0x2bd5a6 = [];
  let _0x4b7103 = [];
  let _0x1de422 = [];
  let _0x78bad6 = [];
  let _0xcfb21e = [];
  let _0xfb1500 = [];
  let _0x292622 = [];
  let _0x2f4611 = [];
  let _0x5d2a9d = [];
  let _0x3fedb7 = [];
  let _0x3db7f8 = [];
  let _0x439b42 = [];
  let _0x309ef5 = [];
  let _0x2937da = [];
  let _0x2e2dc4 = [];
  let _0x494829 = [];
  let _0x57f21d = [];
  let _0x5da5ff = [];
  let _0x115534 = [];
  let _0x1fd193 = [];
  let _0x577e8c = [];
  let _0x29164f = [];
  let _0x383cef = [];
  let _0x1411aa = [];
  let _0x26bc21 = [];
  let _0x2f752d = [];
  let _0x2a505f = [];
  let _0x2d2af0 = [];
  let _0x125b43 = [];
  let _0x41851b = [];
  let _0x1e59b0 = [];
  let _0x59b53a = [];
  let _0xbd18da = [];
  let _0x5b740a = [];
  let _0x4a00e0 = [];
  let _0x2d683b = [];
  let _0x462787 = [];
  let _0x10681f = [];
  let _0x3a7cc1 = [];
  let _0x3ca9f2 = [];
  let _0x2e78ee = [];
  let _0x5d2c42 = [];
  let _0x220843 = [];
  let _0x5c834f = [];
  let _0x13aa88 = [];
  let _0x3bb7bf = [];
  let _0x4e7c61 = [];
  let _0x2b9585 = [];
  let _0x1eb193 = [];
  let _0x2b69a6 = [];
  let _0xc30986 = [];
  let _0x1a372f = [];
  let _0x92f603 = [];
  let _0x164e8d = [];
  let _0x7f9f9d = [];
  let _0x817af1 = [];
  let _0x59d1a8 = [];
  let _0x26f98c = [];
  let _0x877b4d = [];
  let _0x50ed8d = [];
  let _0x1125e5 = [];
  let _0x3c2f22 = [];
  let _0x242b3c = [];
  let _0x423394 = [];
  let _0x130d6c = [];
  let _0x5123ed = [];
  let _0x3c4c76 = [];
  let _0x9b56f3 = [];
  let _0x1d183c = [];
  let _0x1ddaef = [];
  let _0x7b8b2e = [];
  let _0x42e965 = [];
  let _0x2d59d2 = [];
  let _0x16bb1d = [];
  let _0x200c64 = [];
  let _0x1e3eb9 = [];
  let _0x46ed25 = [];
  let _0x5a1897 = [];
  let _0x44cd9a = [];
  let _0x4c3fb4 = [];
  let _0x170215 = [];
  let _0x1fae6c = [];
  let _0x8b1636 = [];
  let _0x17f8ee = [];
  let _0x59f64c = [];
  let _0x2c00ea = [];
  let _0x385d98 = [];
  let _0x4728a5 = [];
  let _0x539e04 = [];
  let _0x3c4229 = [];
  let _0x1bb734 = [];
  let _0x1a05a1 = [];
  let _0x34d42f = [];
  let _0x19608b = [];
  let _0x1c5eee = [];
  let _0x21fd6e = [];
  let _0x5ae753 = [];
  const _0x840e70 = [_0x79406a, _0x36a086, _0xa973ab, _0x4c2483, _0x238cdc, _0x44aec2, _0x57bf50, _0x961a29, _0x32bed0, _0x54bd82, _0x42ceff, _0x2b7431, _0x5ec9dd, _0x118ce4, _0x298f1f, _0x871047, _0x19a14c, _0x1b5614, _0x1c24ae, _0x5ef63e, _0x16bfb7, _0x2b826b, _0x12441f, _0x5c3ac1, _0x4a6b39, _0x5457bc, _0x53be5a, _0xa0a671, _0x5f1304, _0x4680b7, _0x4c92b3, _0x4b2ad1, _0x1bbe72, _0x490262, _0x233313, _0x241130, _0x6c90fc, _0x374007, _0x298826, _0x356c8a, _0x31dacc, _0x576e5c, _0x267262, _0x396664, _0x3ad61f, _0x1078d7, _0x4e3946, _0x3c88ed, _0x32e31c, _0x4a2a6a, _0x42be3b, _0x3b4c11, _0x580ea3, _0xf055c8, _0x2bd5a6, _0x4b7103, _0x1de422, _0x78bad6, _0xcfb21e, _0xfb1500, _0x292622, _0x2f4611, _0x5d2a9d, _0x3fedb7, _0x3db7f8, _0x439b42, _0x309ef5, _0x2937da, _0x2e2dc4, _0x494829, _0x57f21d, _0x5da5ff, _0x115534];
  const _0x2a3500 = [_0x29164f, _0x383cef, _0x26bc21, _0x2f752d, _0x2a505f, _0x2d2af0, _0x125b43, _0x41851b, _0x1e59b0, _0x59b53a, _0xbd18da, _0x5b740a, _0x4a00e0, _0x2d683b, _0x462787, _0x10681f, _0x3a7cc1, _0x3ca9f2, _0x2e78ee, _0x5d2c42, _0x220843, _0x5c834f, _0x13aa88, _0x3bb7bf, _0x4e7c61, _0x2b9585, _0x1eb193, _0x2b69a6, _0xc30986, _0x1a372f, _0x92f603, _0x164e8d, _0x7f9f9d, _0x817af1, _0x59d1a8, _0x26f98c, _0x877b4d, _0x50ed8d, _0x1125e5, _0x3c2f22, _0x242b3c, _0x423394, _0x130d6c, _0x5123ed, _0x3c4c76, _0x9b56f3, _0x1d183c, _0x1ddaef, _0x7b8b2e, _0x42e965, _0x2d59d2, _0x16bb1d, _0x200c64, _0x1e3eb9, _0x46ed25, _0x5a1897, _0x44cd9a, _0x4c3fb4, _0x170215, _0x1fae6c, _0x8b1636, _0x17f8ee, _0x59f64c, _0x2c00ea, _0x385d98, _0x4728a5, _0x539e04, _0x3c4229, _0x1bb734, _0x1a05a1, _0x34d42f, _0x19608b, _0x1c5eee];
  const _0x38e9ba = "#2DD4BF";
  const _0x45576f = "#FB7185";
  const _0x26d767 = averagePoints * _MIN_POR_JOGO;
  const _0x248ac9 = Math.max(0, _0x5f5372.length - numPoints);
  for (let _0x57acf6 = 0; _0x57acf6 < _0x5f5372.length; _0x57acf6++) {
    const _0x3dc032 = _0x5f5372[_0x57acf6];
    const _0x4b0df2 = _0x4c5ae1(_0x3dc032);
    let _0x22291d = {
      golsFT: 0,
      golsHT: 0,
      casaVence: 0,
      empate: 0,
      foraVence: 0,
      ambasSim: 0,
      ambasNao: 0,
      over05: 0,
      over15: 0,
      over25: 0,
      over35: 0,
      over5: 0,
      under05: 0,
      under15: 0,
      under25: 0,
      under35: 0,
      gol0: 0,
      gol1: 0,
      gol2: 0,
      gol3: 0,
      gol4: 0,
      gol5: 0,
      gol2t0: 0,
      gol2t1: 0,
      gol2t2: 0,
      gol2t3: 0,
      gol2t4: 0,
      casa0: 0,
      casa1: 0,
      casa2: 0,
      casa3: 0,
      casa4: 0,
      fora0: 0,
      fora1: 0,
      fora2: 0,
      fora3: 0,
      fora4: 0,
      p0x0: 0,
      p1x0: 0,
      p2x0: 0,
      p3x0: 0,
      p2x1: 0,
      p3x1: 0,
      p3x2: 0,
      p4x0: 0,
      p4x1: 0,
      p0x1: 0,
      p0x2: 0,
      p1x2: 0,
      p0x3: 0,
      p1x3: 0,
      p2x3: 0,
      p0x4: 0,
      p1x4: 0,
      ht0x0: 0,
      ht0x1: 0,
      ht1x0: 0,
      ht1x1: 0,
      ht0x2: 0,
      ht2x0: 0,
      htOut: 0,
      overHT: 0,
      underHT: 0,
      casaHT: 0,
      empateHT: 0,
      foraHT: 0,
      viradinha: 0,
      golsFTCasa: 0,
      golsFTFora: 0,
      par: 0,
      impar: 0,
      margem1: 0,
      margem2: 0,
      margem3: 0,
      empateGols: 0,
      valid: 0
    };
    for (let _0x4aab6c = _0x57acf6; _0x4aab6c >= 0; _0x4aab6c--) {
      const _0x23146f = _0x5f5372[_0x4aab6c];
      const _0x2eb580 = _0x4c5ae1(_0x23146f);
      if (_0x4b0df2 - _0x2eb580 > _0x26d767) {
        break;
      }
      const _0x47336a = _0x23146f;
      let _0x7d23b1 = [0, 0];
      if (_0x47336a.ft?.includes(" x ")) {
        _0x7d23b1 = _0x47336a.ft.split(" x ").map(Number);
      }
      const _0x273f82 = parseHtScoreTotal(_0x47336a.ht);
      const _0x2baf4a = parseHtParts(_0x47336a.ht);
      const _0x2c9ae1 = _0x7d23b1[0] + _0x7d23b1[1];
      const _0xd04e6e = Math.max(0, _0x2c9ae1 - _0x273f82);
      _0x22291d.golsFT += _0x2c9ae1;
      _0x22291d.golsHT += _0x273f82;
      _0x22291d.golsFTCasa += _0x7d23b1[0];
      _0x22291d.golsFTFora += _0x7d23b1[1];
      _0x22291d.par += _0x2c9ae1 % 2 === 0 ? 1 : 0;
      _0x22291d.impar += _0x2c9ae1 % 2 !== 0 ? 1 : 0;
      const _0x42add0 = Math.abs(_0x7d23b1[0] - _0x7d23b1[1]);
      _0x22291d.margem1 += _0x42add0 === 1 ? 1 : 0;
      _0x22291d.margem2 += _0x42add0 === 2 ? 1 : 0;
      _0x22291d.margem3 += _0x42add0 === 3 ? 1 : 0;
      _0x22291d.empateGols += _0x7d23b1[0] === _0x7d23b1[1] && _0x2c9ae1 > 0 ? 1 : 0;
      _0x22291d.casaVence += _0x7d23b1[0] > _0x7d23b1[1] ? 1 : 0;
      _0x22291d.empate += _0x7d23b1[0] === _0x7d23b1[1] ? 1 : 0;
      _0x22291d.foraVence += _0x7d23b1[0] < _0x7d23b1[1] ? 1 : 0;
      _0x22291d.ambasSim += _0x7d23b1[0] > 0 && _0x7d23b1[1] > 0 ? 1 : 0;
      _0x22291d.ambasNao += _0x7d23b1[0] === 0 || _0x7d23b1[1] === 0 ? 1 : 0;
      _0x22291d.over05 += _0x2c9ae1 > 0.5 ? 1 : 0;
      _0x22291d.over15 += _0x2c9ae1 > 1.5 ? 1 : 0;
      _0x22291d.over25 += _0x2c9ae1 > 2.5 ? 1 : 0;
      _0x22291d.over35 += _0x2c9ae1 > 3.5 ? 1 : 0;
      _0x22291d.over5 += _0x2c9ae1 >= 5 ? 1 : 0;
      _0x22291d.under05 += _0x2c9ae1 <= 0.5 ? 1 : 0;
      _0x22291d.under15 += _0x2c9ae1 < 1.5 ? 1 : 0;
      _0x22291d.under25 += _0x2c9ae1 < 2.5 ? 1 : 0;
      _0x22291d.under35 += _0x2c9ae1 < 3.5 ? 1 : 0;
      _0x22291d.gol0 += _0x2c9ae1 === 0 ? 1 : 0;
      _0x22291d.gol1 += _0x2c9ae1 === 1 ? 1 : 0;
      _0x22291d.gol2 += _0x2c9ae1 === 2 ? 1 : 0;
      _0x22291d.gol3 += _0x2c9ae1 === 3 ? 1 : 0;
      _0x22291d.gol4 += _0x2c9ae1 === 4 ? 1 : 0;
      _0x22291d.gol5 += _0x2c9ae1 === 5 ? 1 : 0;
      _0x22291d.gol2t0 += _0xd04e6e === 0 ? 1 : 0;
      _0x22291d.gol2t1 += _0xd04e6e === 1 ? 1 : 0;
      _0x22291d.gol2t2 += _0xd04e6e === 2 ? 1 : 0;
      _0x22291d.gol2t3 += _0xd04e6e === 3 ? 1 : 0;
      _0x22291d.gol2t4 += _0xd04e6e === 4 ? 1 : 0;
      _0x22291d.casa0 += _0x7d23b1[0] === 0 ? 1 : 0;
      _0x22291d.casa1 += _0x7d23b1[0] === 1 ? 1 : 0;
      _0x22291d.casa2 += _0x7d23b1[0] === 2 ? 1 : 0;
      _0x22291d.casa3 += _0x7d23b1[0] === 3 ? 1 : 0;
      _0x22291d.casa4 += _0x7d23b1[0] === 4 ? 1 : 0;
      _0x22291d.fora0 += _0x7d23b1[1] === 0 ? 1 : 0;
      _0x22291d.fora1 += _0x7d23b1[1] === 1 ? 1 : 0;
      _0x22291d.fora2 += _0x7d23b1[1] === 2 ? 1 : 0;
      _0x22291d.fora3 += _0x7d23b1[1] === 3 ? 1 : 0;
      _0x22291d.fora4 += _0x7d23b1[1] === 4 ? 1 : 0;
      _0x22291d.p0x0 += _0x7d23b1[0] === 0 && _0x7d23b1[1] === 0 ? 1 : 0;
      _0x22291d.p1x0 += _0x7d23b1[0] === 1 && _0x7d23b1[1] === 0 ? 1 : 0;
      _0x22291d.p2x0 += _0x7d23b1[0] === 2 && _0x7d23b1[1] === 0 ? 1 : 0;
      _0x22291d.p3x0 += _0x7d23b1[0] === 3 && _0x7d23b1[1] === 0 ? 1 : 0;
      _0x22291d.p2x1 += _0x7d23b1[0] === 2 && _0x7d23b1[1] === 1 ? 1 : 0;
      _0x22291d.p3x1 += _0x7d23b1[0] === 3 && _0x7d23b1[1] === 1 ? 1 : 0;
      _0x22291d.p3x2 += _0x7d23b1[0] === 3 && _0x7d23b1[1] === 2 ? 1 : 0;
      _0x22291d.p4x0 += _0x7d23b1[0] === 4 && _0x7d23b1[1] === 0 ? 1 : 0;
      _0x22291d.p4x1 += _0x7d23b1[0] === 4 && _0x7d23b1[1] === 1 ? 1 : 0;
      _0x22291d.p0x1 += _0x7d23b1[0] === 0 && _0x7d23b1[1] === 1 ? 1 : 0;
      _0x22291d.p0x2 += _0x7d23b1[0] === 0 && _0x7d23b1[1] === 2 ? 1 : 0;
      _0x22291d.p1x2 += _0x7d23b1[0] === 1 && _0x7d23b1[1] === 2 ? 1 : 0;
      _0x22291d.p0x3 += _0x7d23b1[0] === 0 && _0x7d23b1[1] === 3 ? 1 : 0;
      _0x22291d.p1x3 += _0x7d23b1[0] === 1 && _0x7d23b1[1] === 3 ? 1 : 0;
      _0x22291d.p2x3 += _0x7d23b1[0] === 2 && _0x7d23b1[1] === 3 ? 1 : 0;
      _0x22291d.p0x4 += _0x7d23b1[0] === 0 && _0x7d23b1[1] === 4 ? 1 : 0;
      _0x22291d.p1x4 += _0x7d23b1[0] === 1 && _0x7d23b1[1] === 4 ? 1 : 0;
      _0x22291d.ht0x0 += _0x2baf4a && _0x2baf4a[0] === 0 && _0x2baf4a[1] === 0 ? 1 : 0;
      _0x22291d.ht0x1 += _0x2baf4a && _0x2baf4a[0] === 0 && _0x2baf4a[1] === 1 ? 1 : 0;
      _0x22291d.ht1x0 += _0x2baf4a && _0x2baf4a[0] === 1 && _0x2baf4a[1] === 0 ? 1 : 0;
      _0x22291d.ht1x1 += _0x2baf4a && _0x2baf4a[0] === 1 && _0x2baf4a[1] === 1 ? 1 : 0;
      _0x22291d.ht0x2 += _0x2baf4a && _0x2baf4a[0] === 0 && _0x2baf4a[1] === 2 ? 1 : 0;
      _0x22291d.ht2x0 += _0x2baf4a && _0x2baf4a[0] === 2 && _0x2baf4a[1] === 0 ? 1 : 0;
      _0x22291d.htOut += _0x47336a.ht === "OUT" ? 1 : 0;
      if (_0x273f82 >= 2) {
        _0x22291d.overHT++;
      } else {
        _0x22291d.underHT++;
      }
      if (_0x2baf4a) {
        if (_0x2baf4a[0] > _0x2baf4a[1]) {
          _0x22291d.casaHT++;
        } else if (_0x2baf4a[0] < _0x2baf4a[1]) {
          _0x22291d.foraHT++;
        } else {
          _0x22291d.empateHT++;
        }
      }
      if (_0x2baf4a) {
        const _0x2de944 = _0x2baf4a[0] > _0x2baf4a[1];
        const _0xd03bec = _0x2baf4a[0] < _0x2baf4a[1];
        let _0x2e7c2a = [0, 0];
        if (_0x47336a.ft?.includes(" x ")) {
          _0x2e7c2a = _0x47336a.ft.split(" x ").map(Number);
        }
        const _0x1dd0e5 = _0x2e7c2a[0] < _0x2e7c2a[1];
        const _0xad0e40 = _0x2e7c2a[0] > _0x2e7c2a[1];
        if (_0x2de944 && _0x1dd0e5 || _0xd03bec && _0xad0e40) {
          _0x22291d.viradinha++;
        }
      }
      _0x22291d.valid++;
    }
    if (_0x57acf6 < _0x248ac9) {
      continue;
    }
    const _0x3dac32 = _0x5f5372[_0x57acf6];
    _0x2a455c.push(_0x3dac32.hora + ":" + _0x3dac32.minuto.toString().padStart(2, "0"));
    let _0x55b0ea = [0, 0];
    if (_0x3dac32.ft?.includes(" x ")) {
      _0x55b0ea = _0x3dac32.ft.split(" x ").map(Number);
    }
    const _0x597c23 = parseHtScoreTotal(_0x3dac32.ht);
    const _0x9dff98 = parseHtParts(_0x3dac32.ht);
    const _0x2a1ee0 = _0x55b0ea[0] + _0x55b0ea[1];
    const _0x35b3be = Math.max(0, _0x2a1ee0 - _0x597c23);
    const _0x4eba0d = _0x22291d.valid || 1;
    _0x79406a.push(_0x22291d.golsFT);
    _0x29164f.push("#FFFF00");
    _0x36a086.push(_0x22291d.golsHT);
    _0x383cef.push("#26A69A");
    const _0x10b3bd = _0x2a1ee0;
    const _0x1e10a8 = _0x10b3bd >= 5 ? "#2ecc71" : _0x10b3bd >= 3 ? "#3498db" : _0x10b3bd === 2 ? "#f1c40f" : _0x10b3bd === 1 ? "#e67e22" : "#e74c3c";
    _0x4c9aed.push(_0x10b3bd);
    _0x1411aa.push(_0x1e10a8);
    _0x1fd193.push(_0x22291d.golsFTCasa);
    _0x21fd6e.push("#00E5FF");
    _0x577e8c.push(_0x22291d.golsFTFora);
    _0x5ae753.push("#FF6E40");
    _0x2937da.push(_0x22291d.par / _0x4eba0d * 100);
    _0x3c4229.push(_0x2a1ee0 % 2 === 0 ? _0x38e9ba : _0x45576f);
    _0x2e2dc4.push(_0x22291d.impar / _0x4eba0d * 100);
    _0x1bb734.push(_0x2a1ee0 % 2 !== 0 ? _0x38e9ba : _0x45576f);
    const _0x178d8f = Math.abs(_0x55b0ea[0] - _0x55b0ea[1]);
    _0x494829.push(_0x22291d.margem1 / _0x4eba0d * 100);
    _0x1a05a1.push(_0x178d8f === 1 ? _0x38e9ba : _0x45576f);
    _0x57f21d.push(_0x22291d.margem2 / _0x4eba0d * 100);
    _0x34d42f.push(_0x178d8f === 2 ? _0x38e9ba : _0x45576f);
    _0x5da5ff.push(_0x22291d.margem3 / _0x4eba0d * 100);
    _0x19608b.push(_0x178d8f === 3 ? _0x38e9ba : _0x45576f);
    _0x115534.push(_0x22291d.empateGols / _0x4eba0d * 100);
    _0x1c5eee.push(_0x55b0ea[0] === _0x55b0ea[1] && _0x2a1ee0 > 0 ? _0x38e9ba : _0x45576f);
    _0xa973ab.push(_0x22291d.casaVence / _0x4eba0d * 100);
    _0x26bc21.push(_0x55b0ea[0] > _0x55b0ea[1] ? _0x38e9ba : _0x45576f);
    _0x4c2483.push(_0x22291d.empate / _0x4eba0d * 100);
    _0x2f752d.push(_0x55b0ea[0] === _0x55b0ea[1] ? _0x38e9ba : _0x45576f);
    _0x238cdc.push(_0x22291d.foraVence / _0x4eba0d * 100);
    _0x2a505f.push(_0x55b0ea[0] < _0x55b0ea[1] ? _0x38e9ba : _0x45576f);
    _0x44aec2.push(_0x22291d.ambasSim / _0x4eba0d * 100);
    _0x2d2af0.push(_0x55b0ea[0] > 0 && _0x55b0ea[1] > 0 ? _0x38e9ba : _0x45576f);
    _0x57bf50.push(_0x22291d.ambasNao / _0x4eba0d * 100);
    _0x125b43.push(_0x55b0ea[0] === 0 || _0x55b0ea[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x961a29.push(_0x22291d.over05 / _0x4eba0d * 100);
    _0x41851b.push(_0x2a1ee0 > 0.5 ? _0x38e9ba : _0x45576f);
    _0x32bed0.push(_0x22291d.over15 / _0x4eba0d * 100);
    _0x1e59b0.push(_0x2a1ee0 > 1.5 ? _0x38e9ba : _0x45576f);
    _0x54bd82.push(_0x22291d.over25 / _0x4eba0d * 100);
    _0x59b53a.push(_0x2a1ee0 > 2.5 ? _0x38e9ba : _0x45576f);
    _0x42ceff.push(_0x22291d.over35 / _0x4eba0d * 100);
    _0xbd18da.push(_0x2a1ee0 > 3.5 ? _0x38e9ba : _0x45576f);
    _0x2b7431.push(_0x22291d.over5 / _0x4eba0d * 100);
    _0x5b740a.push(_0x2a1ee0 >= 5 ? _0x38e9ba : _0x45576f);
    _0x5ec9dd.push(_0x22291d.under05 / _0x4eba0d * 100);
    _0x4a00e0.push(_0x2a1ee0 <= 0.5 ? _0x38e9ba : _0x45576f);
    _0x118ce4.push(_0x22291d.under15 / _0x4eba0d * 100);
    _0x2d683b.push(_0x2a1ee0 < 1.5 ? _0x38e9ba : _0x45576f);
    _0x298f1f.push(_0x22291d.under25 / _0x4eba0d * 100);
    _0x462787.push(_0x2a1ee0 < 2.5 ? _0x38e9ba : _0x45576f);
    _0x871047.push(_0x22291d.under35 / _0x4eba0d * 100);
    _0x10681f.push(_0x2a1ee0 < 3.5 ? _0x38e9ba : _0x45576f);
    _0x19a14c.push(_0x22291d.gol0 / _0x4eba0d * 100);
    _0x3a7cc1.push(_0x2a1ee0 === 0 ? _0x38e9ba : _0x45576f);
    _0x1b5614.push(_0x22291d.gol1 / _0x4eba0d * 100);
    _0x3ca9f2.push(_0x2a1ee0 === 1 ? _0x38e9ba : _0x45576f);
    _0x1c24ae.push(_0x22291d.gol2 / _0x4eba0d * 100);
    _0x2e78ee.push(_0x2a1ee0 === 2 ? _0x38e9ba : _0x45576f);
    _0x5ef63e.push(_0x22291d.gol3 / _0x4eba0d * 100);
    _0x5d2c42.push(_0x2a1ee0 === 3 ? _0x38e9ba : _0x45576f);
    _0x16bfb7.push(_0x22291d.gol4 / _0x4eba0d * 100);
    _0x220843.push(_0x2a1ee0 === 4 ? _0x38e9ba : _0x45576f);
    _0x2b826b.push(_0x22291d.gol5 / _0x4eba0d * 100);
    _0x5c834f.push(_0x2a1ee0 === 5 ? _0x38e9ba : _0x45576f);
    _0x12441f.push(_0x22291d.gol2t0 / _0x4eba0d * 100);
    _0x13aa88.push(_0x35b3be === 0 ? _0x38e9ba : _0x45576f);
    _0x5c3ac1.push(_0x22291d.gol2t1 / _0x4eba0d * 100);
    _0x3bb7bf.push(_0x35b3be === 1 ? _0x38e9ba : _0x45576f);
    _0x4a6b39.push(_0x22291d.gol2t2 / _0x4eba0d * 100);
    _0x4e7c61.push(_0x35b3be === 2 ? _0x38e9ba : _0x45576f);
    _0x5457bc.push(_0x22291d.gol2t3 / _0x4eba0d * 100);
    _0x2b9585.push(_0x35b3be === 3 ? _0x38e9ba : _0x45576f);
    _0x53be5a.push(_0x22291d.gol2t4 / _0x4eba0d * 100);
    _0x1eb193.push(_0x35b3be === 4 ? _0x38e9ba : _0x45576f);
    _0xa0a671.push(_0x22291d.casa0 / _0x4eba0d * 100);
    _0x2b69a6.push(_0x55b0ea[0] === 0 ? _0x38e9ba : _0x45576f);
    _0x5f1304.push(_0x22291d.casa1 / _0x4eba0d * 100);
    _0xc30986.push(_0x55b0ea[0] === 1 ? _0x38e9ba : _0x45576f);
    _0x4680b7.push(_0x22291d.casa2 / _0x4eba0d * 100);
    _0x1a372f.push(_0x55b0ea[0] === 2 ? _0x38e9ba : _0x45576f);
    _0x4c92b3.push(_0x22291d.casa3 / _0x4eba0d * 100);
    _0x92f603.push(_0x55b0ea[0] === 3 ? _0x38e9ba : _0x45576f);
    _0x4b2ad1.push(_0x22291d.casa4 / _0x4eba0d * 100);
    _0x164e8d.push(_0x55b0ea[0] === 4 ? _0x38e9ba : _0x45576f);
    _0x1bbe72.push(_0x22291d.fora0 / _0x4eba0d * 100);
    _0x7f9f9d.push(_0x55b0ea[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x490262.push(_0x22291d.fora1 / _0x4eba0d * 100);
    _0x817af1.push(_0x55b0ea[1] === 1 ? _0x38e9ba : _0x45576f);
    _0x233313.push(_0x22291d.fora2 / _0x4eba0d * 100);
    _0x59d1a8.push(_0x55b0ea[1] === 2 ? _0x38e9ba : _0x45576f);
    _0x241130.push(_0x22291d.fora3 / _0x4eba0d * 100);
    _0x26f98c.push(_0x55b0ea[1] === 3 ? _0x38e9ba : _0x45576f);
    _0x6c90fc.push(_0x22291d.fora4 / _0x4eba0d * 100);
    _0x877b4d.push(_0x55b0ea[1] === 4 ? _0x38e9ba : _0x45576f);
    _0x374007.push(_0x22291d.p0x0 / _0x4eba0d * 100);
    _0x50ed8d.push(_0x55b0ea[0] === 0 && _0x55b0ea[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x298826.push(_0x22291d.p1x0 / _0x4eba0d * 100);
    _0x1125e5.push(_0x55b0ea[0] === 1 && _0x55b0ea[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x356c8a.push(_0x22291d.p2x0 / _0x4eba0d * 100);
    _0x3c2f22.push(_0x55b0ea[0] === 2 && _0x55b0ea[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x31dacc.push(_0x22291d.p3x0 / _0x4eba0d * 100);
    _0x242b3c.push(_0x55b0ea[0] === 3 && _0x55b0ea[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x576e5c.push(_0x22291d.p2x1 / _0x4eba0d * 100);
    _0x423394.push(_0x55b0ea[0] === 2 && _0x55b0ea[1] === 1 ? _0x38e9ba : _0x45576f);
    _0x267262.push(_0x22291d.p3x1 / _0x4eba0d * 100);
    _0x130d6c.push(_0x55b0ea[0] === 3 && _0x55b0ea[1] === 1 ? _0x38e9ba : _0x45576f);
    _0x396664.push(_0x22291d.p3x2 / _0x4eba0d * 100);
    _0x5123ed.push(_0x55b0ea[0] === 3 && _0x55b0ea[1] === 2 ? _0x38e9ba : _0x45576f);
    _0x3ad61f.push(_0x22291d.p4x0 / _0x4eba0d * 100);
    _0x3c4c76.push(_0x55b0ea[0] === 4 && _0x55b0ea[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x1078d7.push(_0x22291d.p4x1 / _0x4eba0d * 100);
    _0x9b56f3.push(_0x55b0ea[0] === 4 && _0x55b0ea[1] === 1 ? _0x38e9ba : _0x45576f);
    _0x4e3946.push(_0x22291d.p0x1 / _0x4eba0d * 100);
    _0x1d183c.push(_0x55b0ea[0] === 0 && _0x55b0ea[1] === 1 ? _0x38e9ba : _0x45576f);
    _0x3c88ed.push(_0x22291d.p0x2 / _0x4eba0d * 100);
    _0x1ddaef.push(_0x55b0ea[0] === 0 && _0x55b0ea[1] === 2 ? _0x38e9ba : _0x45576f);
    _0x32e31c.push(_0x22291d.p1x2 / _0x4eba0d * 100);
    _0x7b8b2e.push(_0x55b0ea[0] === 1 && _0x55b0ea[1] === 2 ? _0x38e9ba : _0x45576f);
    _0x4a2a6a.push(_0x22291d.p0x3 / _0x4eba0d * 100);
    _0x42e965.push(_0x55b0ea[0] === 0 && _0x55b0ea[1] === 3 ? _0x38e9ba : _0x45576f);
    _0x42be3b.push(_0x22291d.p1x3 / _0x4eba0d * 100);
    _0x2d59d2.push(_0x55b0ea[0] === 1 && _0x55b0ea[1] === 3 ? _0x38e9ba : _0x45576f);
    _0x3b4c11.push(_0x22291d.p2x3 / _0x4eba0d * 100);
    _0x16bb1d.push(_0x55b0ea[0] === 2 && _0x55b0ea[1] === 3 ? _0x38e9ba : _0x45576f);
    _0x580ea3.push(_0x22291d.p0x4 / _0x4eba0d * 100);
    _0x200c64.push(_0x55b0ea[0] === 0 && _0x55b0ea[1] === 4 ? _0x38e9ba : _0x45576f);
    _0xf055c8.push(_0x22291d.p1x4 / _0x4eba0d * 100);
    _0x1e3eb9.push(_0x55b0ea[0] === 1 && _0x55b0ea[1] === 4 ? _0x38e9ba : _0x45576f);
    _0x2bd5a6.push(_0x22291d.ht0x0 / _0x4eba0d * 100);
    _0x46ed25.push(_0x9dff98 && _0x9dff98[0] === 0 && _0x9dff98[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x4b7103.push(_0x22291d.ht0x1 / _0x4eba0d * 100);
    _0x5a1897.push(_0x9dff98 && _0x9dff98[0] === 0 && _0x9dff98[1] === 1 ? _0x38e9ba : _0x45576f);
    _0x1de422.push(_0x22291d.ht1x0 / _0x4eba0d * 100);
    _0x44cd9a.push(_0x9dff98 && _0x9dff98[0] === 1 && _0x9dff98[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x78bad6.push(_0x22291d.ht1x1 / _0x4eba0d * 100);
    _0x4c3fb4.push(_0x9dff98 && _0x9dff98[0] === 1 && _0x9dff98[1] === 1 ? _0x38e9ba : _0x45576f);
    _0xcfb21e.push(_0x22291d.ht0x2 / _0x4eba0d * 100);
    _0x170215.push(_0x9dff98 && _0x9dff98[0] === 0 && _0x9dff98[1] === 2 ? _0x38e9ba : _0x45576f);
    _0xfb1500.push(_0x22291d.ht2x0 / _0x4eba0d * 100);
    _0x1fae6c.push(_0x9dff98 && _0x9dff98[0] === 2 && _0x9dff98[1] === 0 ? _0x38e9ba : _0x45576f);
    _0x292622.push(_0x22291d.htOut / _0x4eba0d * 100);
    _0x8b1636.push(_0x3dac32.ht === "OUT" ? _0x38e9ba : _0x45576f);
    _0x2f4611.push(_0x22291d.overHT / _0x4eba0d * 100);
    _0x17f8ee.push(_0x597c23 >= 2 ? _0x38e9ba : _0x45576f);
    _0x5d2a9d.push(_0x22291d.underHT / _0x4eba0d * 100);
    _0x59f64c.push(_0x597c23 < 2 ? _0x38e9ba : _0x45576f);
    _0x3fedb7.push(_0x22291d.casaHT / _0x4eba0d * 100);
    _0x2c00ea.push(_0x9dff98 && _0x9dff98[0] > _0x9dff98[1] ? _0x38e9ba : _0x45576f);
    _0x3db7f8.push(_0x22291d.empateHT / _0x4eba0d * 100);
    _0x385d98.push(_0x9dff98 && _0x9dff98[0] === _0x9dff98[1] ? _0x38e9ba : _0x45576f);
    _0x439b42.push(_0x22291d.foraHT / _0x4eba0d * 100);
    _0x4728a5.push(_0x9dff98 && _0x9dff98[0] < _0x9dff98[1] ? _0x38e9ba : _0x45576f);
    const _0x4a7828 = _0x9dff98 && _0x9dff98[0] > _0x9dff98[1];
    const _0x403422 = _0x9dff98 && _0x9dff98[0] < _0x9dff98[1];
    const _0x2d3f6a = _0x55b0ea[0] < _0x55b0ea[1];
    const _0x54341f = _0x55b0ea[0] > _0x55b0ea[1];
    const _0xd42f20 = _0x9dff98 && (_0x4a7828 && _0x2d3f6a || _0x403422 && _0x54341f);
    _0x309ef5.push(_0x22291d.viradinha / _0x4eba0d * 100);
    _0x539e04.push(_0xd42f20 ? _0x38e9ba : _0x45576f);
  }
  const _0x156cbd = {
    labels: _0x2a455c,
    golsFT: _0x79406a,
    golsHT: _0x36a086,
    golsInd: _0x4c9aed,
    casaVence: _0xa973ab,
    empate: _0x4c2483,
    foraVence: _0x238cdc,
    ambasSim: _0x44aec2,
    ambasNao: _0x57bf50,
    over05: _0x961a29,
    over15: _0x32bed0,
    over25: _0x54bd82,
    over35: _0x42ceff,
    over5: _0x2b7431,
    under05: _0x5ec9dd,
    under15: _0x118ce4,
    under25: _0x298f1f,
    under35: _0x871047,
    gol0: _0x19a14c,
    gol1: _0x1b5614,
    gol2: _0x1c24ae,
    gol3: _0x5ef63e,
    gol4: _0x16bfb7,
    gol5: _0x2b826b,
    gol2t0: _0x12441f,
    gol2t1: _0x5c3ac1,
    gol2t2: _0x4a6b39,
    gol2t3: _0x5457bc,
    gol2t4: _0x53be5a,
    casa0: _0xa0a671,
    casa1: _0x5f1304,
    casa2: _0x4680b7,
    casa3: _0x4c92b3,
    casa4: _0x4b2ad1,
    fora0: _0x1bbe72,
    fora1: _0x490262,
    fora2: _0x233313,
    fora3: _0x241130,
    fora4: _0x6c90fc,
    placar0x0: _0x374007,
    placar1x0: _0x298826,
    placar2x0: _0x356c8a,
    placar3x0: _0x31dacc,
    placar2x1: _0x576e5c,
    placar3x1: _0x267262,
    placar3x2: _0x396664,
    placar4x0: _0x3ad61f,
    placar4x1: _0x1078d7,
    placar0x1: _0x4e3946,
    placar0x2: _0x3c88ed,
    placar1x2: _0x32e31c,
    placar0x3: _0x4a2a6a,
    placar1x3: _0x42be3b,
    placar2x3: _0x3b4c11,
    placar0x4: _0x580ea3,
    placar1x4: _0xf055c8,
    placarHT0x0: _0x2bd5a6,
    placarHT0x1: _0x4b7103,
    placarHT1x0: _0x1de422,
    placarHT1x1: _0x78bad6,
    placarHT0x2: _0xcfb21e,
    placarHT2x0: _0xfb1500,
    placarHTOut: _0x292622,
    overHT: _0x2f4611,
    underHT: _0x5d2a9d,
    casaHT: _0x3fedb7,
    empateHT: _0x3db7f8,
    foraHT: _0x439b42,
    viradinha: _0x309ef5,
    golsFTCasa: _0x1fd193,
    golsFTFora: _0x577e8c,
    par: _0x2937da,
    impar: _0x2e2dc4,
    margem1: _0x494829,
    margem2: _0x57f21d,
    margem3: _0x5da5ff,
    empateGols: _0x115534,
    golsFTColors: _0x29164f,
    golsHTColors: _0x383cef,
    golsIndColors: _0x1411aa,
    casaVenceColors: _0x26bc21,
    empateColors: _0x2f752d,
    foraVenceColors: _0x2a505f,
    ambasSimColors: _0x2d2af0,
    ambasNaoColors: _0x125b43,
    over05Colors: _0x41851b,
    over15Colors: _0x1e59b0,
    over25Colors: _0x59b53a,
    over35Colors: _0xbd18da,
    over5Colors: _0x5b740a,
    under05Colors: _0x4a00e0,
    under15Colors: _0x2d683b,
    under25Colors: _0x462787,
    under35Colors: _0x10681f,
    gol0Colors: _0x3a7cc1,
    gol1Colors: _0x3ca9f2,
    gol2Colors: _0x2e78ee,
    gol3Colors: _0x5d2c42,
    gol4Colors: _0x220843,
    gol5Colors: _0x5c834f,
    gol2t0Colors: _0x13aa88,
    gol2t1Colors: _0x3bb7bf,
    gol2t2Colors: _0x4e7c61,
    gol2t3Colors: _0x2b9585,
    gol2t4Colors: _0x1eb193,
    casa0Colors: _0x2b69a6,
    casa1Colors: _0xc30986,
    casa2Colors: _0x1a372f,
    casa3Colors: _0x92f603,
    casa4Colors: _0x164e8d,
    fora0Colors: _0x7f9f9d,
    fora1Colors: _0x817af1,
    fora2Colors: _0x59d1a8,
    fora3Colors: _0x26f98c,
    fora4Colors: _0x877b4d,
    placar0x0Colors: _0x50ed8d,
    placar1x0Colors: _0x1125e5,
    placar2x0Colors: _0x3c2f22,
    placar3x0Colors: _0x242b3c,
    placar2x1Colors: _0x423394,
    placar3x1Colors: _0x130d6c,
    placar3x2Colors: _0x5123ed,
    placar4x0Colors: _0x3c4c76,
    placar4x1Colors: _0x9b56f3,
    placar0x1Colors: _0x1d183c,
    placar0x2Colors: _0x1ddaef,
    placar1x2Colors: _0x7b8b2e,
    placar0x3Colors: _0x42e965,
    placar1x3Colors: _0x2d59d2,
    placar2x3Colors: _0x16bb1d,
    placar0x4Colors: _0x200c64,
    placar1x4Colors: _0x1e3eb9,
    placarHT0x0Colors: _0x46ed25,
    placarHT0x1Colors: _0x5a1897,
    placarHT1x0Colors: _0x44cd9a,
    placarHT1x1Colors: _0x4c3fb4,
    placarHT0x2Colors: _0x170215,
    placarHT2x0Colors: _0x1fae6c,
    placarHTOutColors: _0x8b1636,
    overHTColors: _0x17f8ee,
    underHTColors: _0x59f64c,
    casaHTColors: _0x2c00ea,
    empateHTColors: _0x385d98,
    foraHTColors: _0x4728a5,
    viradinhaColors: _0x539e04,
    golsFTCasaColors: _0x21fd6e,
    golsFTForaColors: _0x5ae753,
    parColors: _0x3c4229,
    imparColors: _0x1bb734,
    margem1Colors: _0x1a05a1,
    margem2Colors: _0x34d42f,
    margem3Colors: _0x19608b,
    empateGolsColors: _0x1c5eee
  };
  const _0x39be0a = _0x156cbd;
  const _0x2efa95 = _QBLOC;
  const _0x20cea4 = _JPH;
  Object.keys(labelToKey).forEach(_0x46d5f8 => {
    const _0x48bbb7 = labelToKey[_0x46d5f8];
    _0x39be0a[_0x48bbb7 + "Short"] = computeMA(_0x39be0a[_0x48bbb7], _0x2efa95);
    _0x39be0a[_0x48bbb7 + "Long"] = computeMA(_0x39be0a[_0x48bbb7], _0x20cea4);
  });
  return _0x39be0a;
}
function updateCharts() {
  if (!_tabVisible) {
    return;
  }
  const _0x3b0216 = new Date().getTime();
  leagues.forEach(_0x3ad8e0 => {
    fetch(ROTAS_API.resultados(LIGA_ATUAL) + ("?timestamp=" + _0x3b0216)).then(_0x4d71c0 => {
      if (!_0x4d71c0.ok) {
        throw new Error(_0x4d71c0.status);
      }
      return _0x4d71c0.json();
    }).then(_0x40437e => {
      const _0x28e74c = processApiData(_0x40437e, _0x3ad8e0);
      const _0x1d867d = document.getElementById(_0x3ad8e0);
      if (!_0x1d867d) {
        return;
      }
      if (!chartInstances[_0x3ad8e0]) {
        chartInstances[_0x3ad8e0] = createStatsChart(_0x1d867d.getContext("2d"), _0x28e74c.labels, _0x28e74c, _0x3ad8e0);
        _applySetup(_getActiveSetup());
      } else {
        updateStatsChart(chartInstances[_0x3ad8e0], _0x28e74c);
      }
    }).catch(_0x324053 => console.error("Erro " + _0x3ad8e0 + ":", _0x324053));
  });
}
function toggleFibonacciLines() {
  showFibonacciLines = document.getElementById("fibonacciToggle").checked;
  leagues.forEach(_0x12fe6b => {
    if (chartInstances[_0x12fe6b]) {
      chartInstances[_0x12fe6b].update();
    }
  });
  _captureControlsToSetup(_getActiveSetup());
}
function toggleMovingAverages() {
  showMovingAverages = document.getElementById("movingAveragesToggle").checked;
  leagues.forEach(_0x1a8833 => {
    const _0x558afe = chartInstances[_0x1a8833];
    if (!_0x558afe) {
      return;
    }
    _0x558afe.data.datasets.forEach((_0xd98ebe, _0x34d778) => {
      if (_0xd98ebe.label.includes(" - ")) {
        const _0x4cad2a = _0xd98ebe.label.split(" - ")[0];
        _0x558afe.getDatasetMeta(_0x34d778).hidden = !showMovingAverages || !statsChartVisibleDatasets[_0x4cad2a];
      }
    });
    _0x558afe.update();
  });
  _captureControlsToSetup(_getActiveSetup());
}
function setYAxisPosition(_0x27eda1) {
  yAxisPosition = _0x27eda1 === "right" ? "right" : "left";
  _lsSet(Y_AXIS_POS_KEY, yAxisPosition);
  leagues.forEach(_0x3dbf4e => {
    const _0x3e0227 = chartInstances[_0x3dbf4e];
    if (!_0x3e0227) {
      return;
    }
    _0x3e0227.options.scales.y.position = yAxisPosition;
    _0x3e0227.options.layout.padding = yAxisPosition === "right" ? {
      top: 30,
      left: 80
    } : {
      top: 30,
      right: 80
    };
    _0x3e0227.update();
  });
}
document.getElementById("pointsSelector").addEventListener("change", _0x25230e => {
  numPoints = parseInt(_0x25230e.target.value, 10);
  updateCharts();
  _captureControlsToSetup(_getActiveSetup());
});
document.getElementById("averageSelector").addEventListener("change", _0x394ab2 => {
  averagePoints = parseInt(_0x394ab2.target.value, 10);
  updateCharts();
  _captureControlsToSetup(_getActiveSetup());
});
document.getElementById("fibonacciToggle").addEventListener("change", toggleFibonacciLines);
document.getElementById("movingAveragesToggle").addEventListener("change", toggleMovingAverages);
const yAxisSel = document.getElementById("yAxisPositionSelector");
if (yAxisSel) {
  yAxisSel.value = yAxisPosition;
  yAxisSel.addEventListener("change", _0x2b5bd2 => setYAxisPosition(_0x2b5bd2.target.value));
}
document.getElementById("linhaAtualToggle").addEventListener("change", function () {
  leagues.forEach(_0x213b9a => {
    const _0xc1f8a1 = chartInstances[_0x213b9a];
    if (!_0xc1f8a1) {
      return;
    }
    _0xc1f8a1.options.plugins.linhaAtual.enabled = this.checked;
    _0xc1f8a1.update("active");
  });
  _captureControlsToSetup(_getActiveSetup());
});
document.getElementById("labelsToggle").addEventListener("change", function () {
  showLabels = this.checked;
  leagues.forEach(_0x247a41 => {
    if (chartInstances[_0x247a41]) {
      chartInstances[_0x247a41].update();
    }
  });
  _captureControlsToSetup(_getActiveSetup());
});
(function () {
  const _0x4a7a37 = document.getElementById("btnLinhaTools");
  const _0x2f5e79 = document.getElementById("linhaToolsPanel");
  const _0x434bc5 = document.getElementById("btnFibTools");
  const _0x4825ff = document.getElementById("fibToolsPanel");
  const _0x1c4ec9 = document.getElementById("btnTrendTools");
  const _0x2183eb = document.getElementById("trendToolsPanel");
  if (!_0x4a7a37) {
    console.error("[grafico] elemento #btnLinhaTools não encontrado no HTML");
  }
  if (!_0x2f5e79) {
    console.error("[grafico] elemento #linhaToolsPanel não encontrado no HTML");
  }
  if (!_0x434bc5) {
    console.error("[grafico] elemento #btnFibTools não encontrado no HTML");
  }
  if (!_0x4825ff) {
    console.error("[grafico] elemento #fibToolsPanel não encontrado no HTML");
  }
  if (!_0x1c4ec9) {
    console.error("[grafico] elemento #btnTrendTools não encontrado no HTML");
  }
  if (!_0x2183eb) {
    console.error("[grafico] elemento #trendToolsPanel não encontrado no HTML");
  }
  if (_0x4a7a37 && _0x2f5e79) {
    _0x4a7a37.addEventListener("click", _0x10de7d => {
      _0x10de7d.stopPropagation();
      _0x2f5e79.style.display = _0x2f5e79.style.display === "none" ? "block" : "none";
    });
    _0x2f5e79.addEventListener("click", _0x220914 => _0x220914.stopPropagation());
  }
  if (_0x434bc5 && _0x4825ff) {
    _0x434bc5.addEventListener("click", _0xf806ba => {
      _0xf806ba.stopPropagation();
      _0x4825ff.style.display = _0x4825ff.style.display === "none" ? "block" : "none";
    });
    _0x4825ff.addEventListener("click", _0x28ba9d => _0x28ba9d.stopPropagation());
  }
  if (_0x1c4ec9 && _0x2183eb) {
    _0x1c4ec9.addEventListener("click", _0x33fee6 => {
      _0x33fee6.stopPropagation();
      _0x2183eb.style.display = _0x2183eb.style.display === "none" ? "block" : "none";
    });
    _0x2183eb.addEventListener("click", _0x2a2356 => _0x2a2356.stopPropagation());
  }
  document.addEventListener("click", () => {
    if (_0x2f5e79) {
      _0x2f5e79.style.display = "none";
    }
    if (_0x4825ff) {
      _0x4825ff.style.display = "none";
    }
    if (_0x2183eb) {
      _0x2183eb.style.display = "none";
    }
  });
})();
window.adicionarLinhaDraggable = () => {
  const _0x27ca60 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x27ca60) {
    _0x27ca60.addDragLine(document.getElementById("lineColorPicker")?.value || "#1fcc59");
  }
};
window.deletarLinhaSelecionada = () => {
  const _0x116247 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x116247) {
    _0x116247.deleteDragLine();
  }
};
window.limparTodasLinhas = () => {
  const _0x1df564 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x1df564) {
    _0x1df564.clearDragLines();
  }
};
window.ativarDesenhoFibonacci = () => {
  const _0x594d46 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x594d46) {
    _0x594d46.setFibDrawMode(true);
  }
};
window.deletarFibonacciSelecionado = () => {
  const _0x27eb5d = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x27eb5d) {
    _0x27eb5d.deleteFibSelected();
  }
};
window.limparFibonacciLivre = () => {
  const _0x9465dd = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x9465dd) {
    _0x9465dd.clearFibDraws();
  }
};
window.ativarDesenhoLTA = () => {
  const _0x2a3b65 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x2a3b65) {
    _0x2a3b65.setTrendDrawMode(true, "LTA");
  }
};
window.ativarDesenhoLTB = () => {
  const _0x4514d3 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x4514d3) {
    _0x4514d3.setTrendDrawMode(true, "LTB");
  }
};
window.deletarTendenciaSelecionada = () => {
  const _0x506abf = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0x506abf) {
    _0x506abf.deleteTrendSelected();
  }
};
window.limparTendencias = () => {
  const _0xd48ce0 = chartInstances.Copa || Object.values(chartInstances)[0];
  if (_0xd48ce0) {
    _0xd48ce0.clearTrendDraws();
  }
};
window.onload = () => {
  updateCharts();
  _renderSetupBar();
  _renderLinesPanel(_getActiveSetup());
  _updateSetupCounter();
};
setInterval(updateCharts, 3000);