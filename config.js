// Arquivo: config.js

// 1) URL base da API
const API_BASE_URL = "https://betstat.site";
// const API_BASE_URL = "http://localhost:5001";

// 2) Ligas centralizadas
const LIGAS = {
  // === BETANO (exatamente como antes) ===
  GLORIA_ETERNA: "Taça Glória Eterna",
  COPA_AMERICA: "Copa América",
  EURO: "Euro",
  ITALIANO: "Campeonato Italiano",
  COPA_ESTRELAS: "Copa das Estrelas",
  BRASILEIRAO: "Brasileirão Betano",

  // === KIRON (mantido igual) ===
  KIRON_ENGLAND: "England",
  KIRON_ITALY: "Italy",
  KIRON_SPAIN: "Spain",

  // === ESTRELABET – 3 NOVAS LIGAS (2025) ===
  ESTRELA_COPA_MUNDO: "Copa do Mundo",
  ESTRELA_CHAMPIONS: "Ligas dos Campeões",
  ESTRELA_AMERICA_LATINA: "América Latina"
};

// 3) Mapeamento para URLs da Kiron (England, Italy, Spain)
const KIRON_URL_PARAMS = {
  [LIGAS.KIRON_ENGLAND]: "England",
  [LIGAS.KIRON_ITALY]: "Italy",
  [LIGAS.KIRON_SPAIN]: "Spain"
};

// 4) Mapeamento para URLs da EstrelaBet (as 3 novas ligas)
const ESTRELA_URL_PARAMS = {
  [LIGAS.ESTRELA_COPA_MUNDO]: "Copa%20do%20Mundo",
  [LIGAS.ESTRELA_CHAMPIONS]: "Ligas%20dos%20Campeões",
  [LIGAS.ESTRELA_AMERICA_LATINA]: "América%20Latina"
};

// 5) Rotas completas da API (Betsson removida)
const ROTAS_API = {
  resultados: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    const estrelaParam = ESTRELA_URL_PARAMS[nomeLiga];

    if (kironParam) {
      return `${API_BASE_URL}/resultados/kiron/${kironParam}`;
    }
    if (estrelaParam) {
      return `${API_BASE_URL}/resultados/estrela/${estrelaParam}`;
    }
    return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
  },

  proximosJogos: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    const estrelaParam = ESTRELA_URL_PARAMS[nomeLiga];

    if (kironParam) {
      return `${API_BASE_URL}/proximos/kiron/${kironParam}`;
    }
    if (estrelaParam) {
      return `${API_BASE_URL}/proximos/estrela/${estrelaParam}`;
    }
    return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
  },

  odds: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    const estrelaParam = ESTRELA_URL_PARAMS[nomeLiga];

    if (kironParam) {
      return `${API_BASE_URL}/odds/kiron/${kironParam}`;
    }
    if (estrelaParam) {
      return `${API_BASE_URL}/odds/estrela/${estrelaParam}`;
    }
    return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
  }
};

// 6) Detecta em qual página estamos
function detectarLigaAtual() {
  const caminho = (window.location.pathname || "").toLowerCase();

  // Betano
  if (caminho.includes("brasileirao.html")) return LIGAS.BRASILEIRAO;
  if (caminho.includes("campeonato_italiano.html")) return LIGAS.ITALIANO;
  if (caminho.includes("copa_america.html")) return LIGAS.COPA_AMERICA;
  if (caminho.includes("copa_das_estrelas.html")) return LIGAS.COPA_ESTRELAS;
  if (caminho.includes("euro.html")) return LIGAS.EURO;

  // Kiron
  if (caminho.includes("kironengland.html")) return LIGAS.KIRON_ENGLAND;
  if (caminho.includes("kironitaly.html")) return LIGAS.KIRON_ITALY;
  if (caminho.includes("kironspain.html")) return LIGAS.KIRON_SPAIN;

  // EstrelaBet - 3 novas ligas
  if (caminho.includes("estrelacopamundo.html")) return LIGAS.ESTRELA_COPA_MUNDO;
  if (caminho.includes("estrelachampions.html")) return LIGAS.ESTRELA_CHAMPIONS;
  if (caminho.includes("estrelaamericalatina.html")) return LIGAS.ESTRELA_AMERICA_LATINA;

  // Padrão (página principal)
  return LIGAS.GLORIA_ETERNA;
}

// 7) Liga atual detectada automaticamente
const LIGA_ATUAL = detectarLigaAtual();

export { LIGAS, ROTAS_API, LIGA_ATUAL };