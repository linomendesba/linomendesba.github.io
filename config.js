// Arquivo: config.js (VERSÃO QUE FUNCIONA COM O SERVIDOR ATUAL)

const API_BASE_URL = "https://betstat.site";

// Ligas (mantive seu padrão exato, inclusive o kironbrazil que você usa)
const LIGAS = {
  GLORIA_ETERNA: "Taça Glória Eterna",
  COPA_AMERICA: "Copa América",
  EURO: "Euro",
  ITALIANO: "Campeonato Italiano",
  COPA_ESTRELAS: "Copa das Estrelas",
  BRASILEIRAO: "Brasileirão Betano",

  KIRON_BRAZIL: "Kiron Liga Brasil",
  KIRON_ENGLAND: "Kiron Liga Inglaterra",
  KIRON_ITALY: "Kiron Liga Itália",
  KIRON_AMERICA: "Kiron Liga América Latina",
  KIRON_SPAIN: "Kiron Liga Espanha",

  // AS 3 NOVAS LIGAS ESTRELABET – nomes EXATOS que o servidor espera
  ESTRELA_COPA_MUNDO: "Copa do Mundo",
  ESTRELA_CHAMPIONS: "Ligas dos Campeoes",
  ESTRELA_AMERICA_LATINA: "America Latina"
};

// Kiron (exatamente como você sempre teve)
const KIRON_URL_PARAMS = {
  [LIGAS.KIRON_BRAZIL]: "Brazil",
  [LIGAS.KIRON_ENGLAND]: "England",
  [LIGAS.KIRON_ITALY]: "Italy",
  [LIGAS.KIRON_AMERICA]: "America%20Latina",
  [LIGAS.KIRON_SPAIN]: "Spain"
};

// ESTRELA – nomes EXATOS que você usa no servidor (sem ç, õ, é)
const ESTRELA_URL_PARAMS = {
  [LIGAS.ESTRELA_COPA_MUNDO]: "Copa%20do%20Mundo",
  [LIGAS.ESTRELA_CHAMPIONS]: "Ligas%20dos%20Campeoes",
  [LIGAS.ESTRELA_AMERICA_LATINA]: "America%20Latina"
};

// Rotas (Betsson removida)
const ROTAS_API = {
  resultados: (nomeLiga) => {
    const kiron = KIRON_URL_PARAMS[nomeLiga];
    const estrela = ESTRELA_URL_PARAMS[nomeLiga];
    if (kiron) return `${API_BASE_URL}/resultados/kiron/${kiron}`;
    if (estrela) return `${API_BASE_URL}/resultados/estrela/${estrela}`;
    return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
  },
  proximosJogos: (nomeLiga) => {
    const kiron = KIRON_URL_PARAMS[nomeLiga];
    const estrela = ESTRELA_URL_PARAMS[nomeLiga];
    if (kiron) return `${API_BASE_URL}/proximos/kiron/${kiron}`;
    if (estrela) return `${API_BASE_URL}/proximos/estrela/${estrela}`;
    return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
  },
  odds: (nomeLiga) => {
    const kiron = KIRON_URL_PARAMS[nomeLiga];
    const estrela = ESTRELA_URL_PARAMS[nomeLiga];
    if (kiron) return `${API_BASE_URL}/odds/kiron/${kiron}`;
    if (estrela) return `${API_BASE_URL}/odds/estrela/${estrela}`;
    return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
  }
};

// Detectar página (mantive seu padrão)
function detectarLigaAtual() {
  const caminho = (window.location.pathname || "").toLowerCase();

  if (caminho.includes("brasileirao.html")) return LIGAS.BRASILEIRAO;
  if (caminho.includes("campeonato_italiano.html")) return LIGAS.ITALIANO;
  if (caminho.includes("copa_america.html")) return LIGAS.COPA_AMERICA;
  if (caminho.includes("copa_das_estrelas.html")) return LIGAS.COPA_ESTRELAS;
  if (caminho.includes("euro.html")) return LIGAS.EURO;

  if (caminho.includes("kironbrazil.html")) return LIGAS.KIRON_BRAZIL;
  if (caminho.includes("kironengland.html")) return LIGAS.KIRON_ENGLAND;
  if (caminho.includes("kironitaly.html")) return LIGAS.KIRON_ITALY;
  if (caminho.includes("kironamerica.html")) return LIGAS.KIRON_AMERICA;
  if (caminho.includes("kironspain.html")) return LIGAS.KIRON_SPAIN;

  // 3 novas páginas EstrelaBet
  if (caminho.includes("estrelacopamundo.html")) return LIGAS.ESTRELA_COPA_MUNDO;
  if (caminho.includes("estrelachampions.html")) return LIGAS.ESTRELA_CHAMPIONS;
  if (caminho.includes("estrelaamericalatina.html")) return LIGAS.ESTRELA_AMERICA_LATINA;

  return LIGAS.GLORIA_ETERNA;
}

const LIGA_ATUAL = detectarLigaAtual();