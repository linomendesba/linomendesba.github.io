// Arquivo: config.js

// 1) URL base da API
const API_BASE_URL = "https://betstat.site";
//const API_BASE_URL = "http://localhost:5001";

// 2) Ligas centralizadas
const LIGAS = {
  GLORIA_ETERNA: "Taça Glória Eterna",
  COPA_AMERICA: "Copa América",
  EURO: "Euro",
  ITALIANO: "Campeonato Italiano",
  COPA_ESTRELAS: "Copa das Estrelas",
  BRASILEIRAO: "Brasileirão Betano"
};

// 3) Rotas completas da API
const ROTAS_API = {
  resultados: (nomeLiga) => `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`,
  proximosJogos: (nomeLiga) => `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`,
  odds: (nomeLiga) => `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`
};

// 4) Detecta em qual página estamos
function detectarLigaAtual() {
  const caminho = (window.location.pathname || "").toLowerCase();

  if (caminho.includes("brasileirao.html")) return LIGAS.BRASILEIRAO;
  if (caminho.includes("campeonato_italiano.html")) return LIGAS.ITALIANO;
  if (caminho.includes("copa_america.html")) return LIGAS.COPA_AMERICA;
  if (caminho.includes("copa_das_estrelas.html")) return LIGAS.COPA_ESTRELAS;
  if (caminho.includes("euro.html")) return LIGAS.EURO;

  // Se não bater com nada, assume que é a página principal (index.html)
  return LIGAS.GLORIA_ETERNA;
}

// 5) Liga detectada automaticamente
const LIGA_ATUAL = detectarLigaAtual();