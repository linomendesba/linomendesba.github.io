// Arquivo: config.js

// 1) URL base da API
const API_BASE_URL = "https://betstat.site";
//const API_BASE_URL = "http://localhost:5001";

// 2) Ligas centralizadas
const LIGAS = {
  // Ligas existentes
  GLORIA_ETERNA: "Taça Glória Eterna",
  COPA_AMERICA: "Copa América",
  EURO: "Euro",
  ITALIANO: "Campeonato Italiano",
  COPA_ESTRELAS: "Copa das Estrelas",
  BRASILEIRAO: "Brasileirão Betano",

  // Ligas Kiron
  KIRON_BRAZIL: "Kiron Liga Brasil",
  KIRON_ENGLAND: "Kiron Liga Inglaterra",
  KIRON_ITALY: "Kiron Liga Itália",
  KIRON_AMERICA: "Kiron Liga América Latina",
  KIRON_SPAIN: "Kiron Liga Espanha",

  // Nova liga Estrela
  ESTRELA: "estrela",

  // Ligas Betsson
  BETSSON_ESPANHA: "Espanha",
  BETSSON_INGLATERRA: "Inglaterra",
  BETSSON_BRASIL: "Brasil",

  // Ligas bet365
  BET365_COPA: "Copa",
  BET365_EURO: "Euro",
  BET365_SUPER: "Super",
  BET365_PREMIER: "Premier"
};

// 3) Mapeamento para URLs específicas da Kiron
const KIRON_URL_PARAMS = {
  [LIGAS.KIRON_BRAZIL]: "Brazil",
  [LIGAS.KIRON_ENGLAND]: "England",
  [LIGAS.KIRON_ITALY]: "Italy",
  [LIGAS.KIRON_AMERICA]: "America%20Latina",
  [LIGAS.KIRON_SPAIN]: "Spain"
};

// 4) Mapeamento para URLs específicas da Estrela
const ESTRELA_URL_PARAMS = {
  [LIGAS.ESTRELA]: "estrela"
};

// 5) Mapeamento para URLs específicas da Betsson
const BETSSON_URL_PARAMS = {
  [LIGAS.BETSSON_ESPANHA]: "Espanha",
  [LIGAS.BETSSON_INGLATERRA]: "Inglaterra",
  [LIGAS.BETSSON_BRASIL]: "Brasil"
};

// 6) Mapeamento para URLs específicas da bet365
const BET365_URL_PARAMS = {
  [LIGAS.BET365_COPA]: "Copa",
  [LIGAS.BET365_EURO]: "Euro",
  [LIGAS.BET365_SUPER]: "Super",
  [LIGAS.BET365_PREMIER]: "Premier"
};

// 7) Rotas completas da API
const ROTAS_API = {
  resultados: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    const estrelaParam = ESTRELA_URL_PARAMS[nomeLiga];
    const betssonParam = BETSSON_URL_PARAMS[nomeLiga];
    const bet365Param = BET365_URL_PARAMS[nomeLiga];
    if (kironParam) {
      return `${API_BASE_URL}/resultados/kiron/${kironParam}`;
    }
    if (estrelaParam) {
      return `${API_BASE_URL}/resultados/estrela/${estrelaParam}`;
    }
    if (betssonParam) {
      return `${API_BASE_URL}/resultados/betsson/${betssonParam}`;
    }
    if (bet365Param) {
      return `${API_BASE_URL}/resultados/bet365/${bet365Param}`;
    }
    return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
  },
  proximosJogos: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    const estrelaParam = ESTRELA_URL_PARAMS[nomeLiga];
    const betssonParam = BETSSON_URL_PARAMS[nomeLiga];
    const bet365Param = BET365_URL_PARAMS[nomeLiga];
    if (kironParam) {
      return `${API_BASE_URL}/proximos/kiron/${kironParam}`;
    }
    if (estrelaParam) {
      return `${API_BASE_URL}/proximos/estrela/${estrelaParam}`;
    }
    if (betssonParam) {
      return `${API_BASE_URL}/proximos/betsson/${betssonParam}`;
    }
    if (bet365Param) {
      return `${API_BASE_URL}/proximos/bet365/${bet365Param}`;
    }
    return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
  },
  odds: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    const estrelaParam = ESTRELA_URL_PARAMS[nomeLiga];
    const betssonParam = BETSSON_URL_PARAMS[nomeLiga];
    const bet365Param = BET365_URL_PARAMS[nomeLiga];
    if (kironParam) {
      return `${API_BASE_URL}/odds/kiron/${kironParam}`;
    }
    if (estrelaParam) {
      return `${API_BASE_URL}/odds/estrela/${estrelaParam}`;
    }
    if (betssonParam) {
      return `${API_BASE_URL}/odds/betsson/${betssonParam}`;
    }
    if (bet365Param) {
      return `${API_BASE_URL}/odds/bet365/${bet365Param}`;
    }
    return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
  }
};

// 8) Detecta em qual página estamos
function detectarLigaAtual() {
  const caminho = (window.location.pathname || "").toLowerCase();

  // Ligas existentes
  if (caminho.includes("brasileirao.html")) return LIGAS.BRASILEIRAO;
  if (caminho.includes("campeonato_italiano.html")) return LIGAS.ITALIANO;
  if (caminho.includes("copa_america.html")) return LIGAS.COPA_AMERICA;
  if (caminho.includes("copa_das_estrelas.html")) return LIGAS.COPA_ESTRELAS;
  if (caminho.includes("euro.html")) return LIGAS.EURO;

  // Ligas Kiron
  if (caminho.includes("kironbrazil.html")) return LIGAS.KIRON_BRAZIL;
  if (caminho.includes("kironengland.html")) return LIGAS.KIRON_ENGLAND;
  if (caminho.includes("kironitaly.html")) return LIGAS.KIRON_ITALY;
  if (caminho.includes("kironamerica.html")) return LIGAS.KIRON_AMERICA;
  if (caminho.includes("kironspain.html")) return LIGAS.KIRON_SPAIN;

  // Nova liga Estrela
  if (caminho.includes("estrela.html")) return LIGAS.ESTRELA;

  // Ligas Betsson
  if (caminho.includes("betsespanha.html")) return LIGAS.BETSSON_ESPANHA;
  if (caminho.includes("betsbrasil.html")) return LIGAS.BETSSON_BRASIL;
  if (caminho.includes("betsinglaterra.html")) return LIGAS.BETSSON_INGLATERRA;

  // Ligas bet365
  if (caminho.includes("copa.html")) return LIGAS.BET365_COPA;
  if (caminho.includes("eurob.html")) return LIGAS.BET365_EURO;
  if (caminho.includes("super.html")) return LIGAS.BET365_SUPER;
  if (caminho.includes("premier.html")) return LIGAS.BET365_PREMIER;

  // Se não bater com nada, assume que é a página principal (index.html)
  return LIGAS.GLORIA_ETERNA;
}

// 9) Liga detectada automaticamente
const LIGA_ATUAL = detectarLigaAtual();