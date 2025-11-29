// config.js – VERSÃO COM BET365 ADICIONADA

const API_BASE_URL = "https://betstat.site";

// Ligas (mantive seu padrão + bet365)
const LIGAS = {
  GLORIA_ETERNA: "Taça Glória Eterna",
  COPA_AMERICA: "Copa América",
  EURO: "Euro",
  ITALIANO: "Campeonato Italiano",
  COPA_ESTRELAS: "Copa das Estrelas",
  BRASILEIRAO: "Brasileirão Betano",

  // BET365 - 4 ligas
  BET365_COPA: "Copa",
  BET365_EUROCUP: "Euro",  // ← EuroCup pra não conflitar com EURO da Betano
  BET365_SUPER: "Super",
  BET365_PREMIER: "Premier",

  KIRON_BRAZIL: "Kiron Liga Brasil",
  KIRON_ENGLAND: "Kiron Liga Inglaterra",
  KIRON_ITALY: "Kiron Liga Itália",
  KIRON_AMERICA: "Kiron Liga América Latina",
  KIRON_SPAIN: "Kiron Liga Espanha",

  // AS 3 NOVAS DA ESTRELABET
  ESTRELA_COPA_MUNDO: "Copa do Mundo",
  ESTRELA_CHAMPIONS: "Ligas dos Campeões",
  ESTRELA_AMERICA_LATINA: "América Latina"
};

// Kiron (exato como você sempre usou)
const KIRON_URL_PARAMS = {
  [LIGAS.KIRON_BRAZIL]: "Brazil",
  [LIGAS.KIRON_ENGLAND]: "England",
  [LIGAS.KIRON_ITALY]: "Italy",
  [LIGAS.KIRON_AMERICA]: "America%20Latina",
  [LIGAS.KIRON_SPAIN]: "Spain"
};

// BET365 - URLs compatíveis com seu servidor
const BET365_URL_PARAMS = {
  [LIGAS.BET365_COPA]: "Copa",
  [LIGAS.BET365_EUROCUP]: "Euro",  // ← No servidor é "Euro", mas aqui usamos EUROCUP pra diferenciar
  [LIGAS.BET365_SUPER]: "Super",
  [LIGAS.BET365_PREMIER]: "Premier"
};

// ESTRELA – URLs 100% compatíveis com seu servidor
const ESTRELA_URL_PARAMS = {
  [LIGAS.ESTRELA_COPA_MUNDO]: "Copa%20do%20Mundo",
  [LIGAS.ESTRELA_CHAMPIONS]: "Ligas%20dos%20Campe%C3%B5es",
  [LIGAS.ESTRELA_AMERICA_LATINA]: "Am%C3%A9rica%20Latina"
};

// Rotas (com Bet365 integrada)
const ROTAS_API = {
  resultados: (nomeLiga) => {
    const kiron = KIRON_URL_PARAMS[nomeLiga];
    const bet365 = BET365_URL_PARAMS[nomeLiga];
    const estrela = ESTRELA_URL_PARAMS[nomeLiga];
    
    if (kiron) return `${API_BASE_URL}/resultados/kiron/${kiron}`;
    if (bet365) return `${API_BASE_URL}/resultados/bet365/${bet365}`;
    if (estrela) return `${API_BASE_URL}/resultados/estrela/${estrela}`;
    return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
  },
  proximosJogos: (nomeLiga) => {
    const kiron = KIRON_URL_PARAMS[nomeLiga];
    const bet365 = BET365_URL_PARAMS[nomeLiga];
    const estrela = ESTRELA_URL_PARAMS[nomeLiga];
    
    if (kiron) return `${API_BASE_URL}/proximos/kiron/${kiron}`;
    if (bet365) return `${API_BASE_URL}/proximos/bet365/${bet365}`;
    if (estrela) return `${API_BASE_URL}/proximos/estrela/${estrela}`;
    return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
  },
  odds: (nomeLiga) => {
    const kiron = KIRON_URL_PARAMS[nomeLiga];
    const bet365 = BET365_URL_PARAMS[nomeLiga];
    const estrela = ESTRELA_URL_PARAMS[nomeLiga];
    
    if (kiron) return `${API_BASE_URL}/odds/kiron/${kiron}`;
    if (bet365) return `${API_BASE_URL}/odds/bet365/${bet365}`;
    if (estrela) return `${API_BASE_URL}/odds/estrela/${estrela}`;
    return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
  }
};

// Detectar página
function detectarLigaAtual() {
  const caminho = (window.location.pathname || "").toLowerCase();

  // BETANO
  if (caminho.includes("brasileirao.html")) return LIGAS.BRASILEIRAO;
  if (caminho.includes("campeonato_italiano.html")) return LIGAS.ITALIANO;
  if (caminho.includes("copa_america.html")) return LIGAS.COPA_AMERICA;
  if (caminho.includes("copa_das_estrelas.html")) return LIGAS.COPA_ESTRELAS;
  if (caminho.includes("euro.html")) return LIGAS.EURO;

  // BET365 (use nomes como bet365copa.html, bet365eurocup.html, etc)
  if (caminho.includes("bet365copa.html")) return LIGAS.BET365_COPA;
  if (caminho.includes("bet365eurocup.html")) return LIGAS.BET365_EUROCUP;
  if (caminho.includes("bet365super.html")) return LIGAS.BET365_SUPER;
  if (caminho.includes("bet365premier.html")) return LIGAS.BET365_PREMIER;

  // KIRON
  if (caminho.includes("kironbrazil.html")) return LIGAS.KIRON_BRAZIL;
  if (caminho.includes("kironengland.html")) return LIGAS.KIRON_ENGLAND;
  if (caminho.includes("kironitaly.html")) return LIGAS.KIRON_ITALY;
  if (caminho.includes("kironamerica.html")) return LIGAS.KIRON_AMERICA;
  if (caminho.includes("kironspain.html")) return LIGAS.KIRON_SPAIN;

  // ESTRELABET
  if (caminho.includes("estrelacopamundo.html")) return LIGAS.ESTRELA_COPA_MUNDO;
  if (caminho.includes("estrelachampions.html")) return LIGAS.ESTRELA_CHAMPIONS;
  if (caminho.includes("estrelaamericalatina.html")) return LIGAS.ESTRELA_AMERICA_LATINA;

  return LIGAS.GLORIA_ETERNA;
}

const LIGA_ATUAL = detectarLigaAtual();