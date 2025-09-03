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

  // Novas Ligas Kiron adicionadas
  KIRON_BRAZIL: "Kiron Liga Brasil",
  KIRON_ENGLAND: "Kiron Liga Inglaterra",
  KIRON_ITALY: "Kiron Liga Itália",
  KIRON_AMERICA: "Kiron Liga América Latina",
  KIRON_SPAIN: "Kiron Liga Espanha"
};

// 3) Mapeamento para URLs específicas da Kiron
//    Isso ajuda a converter o nome da liga no parâmetro correto da URL da API.
const KIRON_URL_PARAMS = {
  [LIGAS.KIRON_BRAZIL]: "Brazil",
  [LIGAS.KIRON_ENGLAND]: "England",
  [LIGAS.KIRON_ITALY]: "Italy",
  [LIGAS.KIRON_AMERICA]: "America%20Latina",
  [LIGAS.KIRON_SPAIN]: "Spain"
};

// 4) Rotas completas da API
//    A lógica foi atualizada para diferenciar as ligas normais das ligas Kiron.
const ROTAS_API = {
  resultados: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    if (kironParam) {
      return `${API_BASE_URL}/resultados/kiron/${kironParam}`;
    }
    return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
  },
  proximosJogos: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    if (kironParam) {
      return `${API_BASE_URL}/proximos/kiron/${kironParam}`;
    }
    return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
  },
  odds: (nomeLiga) => {
    const kironParam = KIRON_URL_PARAMS[nomeLiga];
    if (kironParam) {
      return `${API_BASE_URL}/odds/kiron/${kironParam}`;
    }
    return `${API_BASE_URL}/odds/kiron/${encodeURIComponent(nomeLiga)}`;
  }
};

// 5) Detecta em qual página estamos
function detectarLigaAtual() {
  const caminho = (window.location.pathname || "").toLowerCase();

  // Ligas existentes
  if (caminho.includes("brasileirao.html")) return LIGAS.BRASILEIRAO;
  if (caminho.includes("campeonato_italiano.html")) return LIGAS.ITALIANO;
  if (caminho.includes("copa_america.html")) return LIGAS.COPA_AMERICA;
  if (caminho.includes("copa_das_estrelas.html")) return LIGAS.COPA_ESTRELAS;
  if (caminho.includes("euro.html")) return LIGAS.EURO;

  // Novas Ligas Kiron baseadas no nome do arquivo HTML
  if (caminho.includes("kironbrazil.html")) return LIGAS.KIRON_BRAZIL;
  if (caminho.includes("kironengland.html")) return LIGAS.KIRON_ENGLAND;
  if (caminho.includes("kironitaly.html")) return LIGAS.KIRON_ITALY;
  if (caminho.includes("kironamerica.html")) return LIGAS.KIRON_AMERICA;
  if (caminho.includes("kironspain.html")) return LIGAS.KIRON_SPAIN;

  // Se não bater com nada, assume que é a página principal (index.html)
  return LIGAS.GLORIA_ETERNA;
}

// 6) Liga detectada automaticamente
const LIGA_ATUAL = detectarLigaAtual();