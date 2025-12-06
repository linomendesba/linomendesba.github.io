// config.js – VERSÃO SIMPLES E DIRETA

const API_BASE_URL = "https://betstat.site";

// Ligas
const LIGAS = {
  GLORIA_ETERNA: "Taça Glória Eterna",
  COPA_AMERICA: "Copa América",
  EURO: "Euro",
  ITALIANO: "Campeonato Italiano",
  COPA_ESTRELAS: "Copa das Estrelas",
  BRASILEIRAO: "Brasileirão Betano",

  // BET365 - Nomes únicos
  BET365_COPA: "Bet365 Copa",
  BET365_EURO: "Bet365 Euro",
  BET365_SUPER: "Bet365 Super",
  BET365_PREMIER: "Bet365 Premier",

  KIRON_BRAZIL: "Kiron Liga Brasil",
  KIRON_ENGLAND: "Kiron Liga Inglaterra",
  KIRON_ITALY: "Kiron Liga Itália",
  KIRON_AMERICA: "Kiron Liga América Latina",
  KIRON_SPAIN: "Kiron Liga Espanha",

  ESTRELA_COPA_MUNDO: "Copa do Mundo",
  ESTRELA_CHAMPIONS: "Ligas dos Campeões",
  ESTRELA_AMERICA_LATINA: "América Latina"
};

// Mapeamento direto e explícito de cada liga
const ROTAS_API = {
  resultados: (nomeLiga) => {
    // BETANO - rotas diretas
    if (nomeLiga === LIGAS.GLORIA_ETERNA) return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.COPA_AMERICA) return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.EURO) return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.ITALIANO) return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.COPA_ESTRELAS) return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.BRASILEIRAO) return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
    
    // BET365 - rotas específicas
    if (nomeLiga === LIGAS.BET365_COPA) return `${API_BASE_URL}/resultados/bet365/Copa`;
    if (nomeLiga === LIGAS.BET365_EURO) return `${API_BASE_URL}/resultados/bet365/Euro`;
    if (nomeLiga === LIGAS.BET365_SUPER) return `${API_BASE_URL}/resultados/bet365/Super`;
    if (nomeLiga === LIGAS.BET365_PREMIER) return `${API_BASE_URL}/resultados/bet365/Premier`;
    
    // KIRON
    if (nomeLiga === LIGAS.KIRON_BRAZIL) return `${API_BASE_URL}/resultados/kiron/Brazil`;
    if (nomeLiga === LIGAS.KIRON_ENGLAND) return `${API_BASE_URL}/resultados/kiron/England`;
    if (nomeLiga === LIGAS.KIRON_ITALY) return `${API_BASE_URL}/resultados/kiron/Italy`;
    if (nomeLiga === LIGAS.KIRON_AMERICA) return `${API_BASE_URL}/resultados/kiron/America%20Latina`;
    if (nomeLiga === LIGAS.KIRON_SPAIN) return `${API_BASE_URL}/resultados/kiron/Spain`;
    
    // ESTRELA
    if (nomeLiga === LIGAS.ESTRELA_COPA_MUNDO) return `${API_BASE_URL}/resultados/estrela/Copa%20do%20Mundo`;
    if (nomeLiga === LIGAS.ESTRELA_CHAMPIONS) return `${API_BASE_URL}/resultados/estrela/Ligas%20dos%20Campe%C3%B5es`;
    if (nomeLiga === LIGAS.ESTRELA_AMERICA_LATINA) return `${API_BASE_URL}/resultados/estrela/Am%C3%A9rica%20Latina`;
    
    return `${API_BASE_URL}/resultados/${encodeURIComponent(nomeLiga)}`;
  },
  
  proximosJogos: (nomeLiga) => {
    // BETANO
    if (nomeLiga === LIGAS.GLORIA_ETERNA) return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.COPA_AMERICA) return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.EURO) return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.ITALIANO) return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.COPA_ESTRELAS) return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.BRASILEIRAO) return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
    
    // BET365
    if (nomeLiga === LIGAS.BET365_COPA) return `${API_BASE_URL}/proximos/bet365/Copa`;
    if (nomeLiga === LIGAS.BET365_EURO) return `${API_BASE_URL}/proximos/bet365/Euro`;
    if (nomeLiga === LIGAS.BET365_SUPER) return `${API_BASE_URL}/proximos/bet365/Super`;
    if (nomeLiga === LIGAS.BET365_PREMIER) return `${API_BASE_URL}/proximos/bet365/Premier`;
    
    // KIRON
    if (nomeLiga === LIGAS.KIRON_BRAZIL) return `${API_BASE_URL}/proximos/kiron/Brazil`;
    if (nomeLiga === LIGAS.KIRON_ENGLAND) return `${API_BASE_URL}/proximos/kiron/England`;
    if (nomeLiga === LIGAS.KIRON_ITALY) return `${API_BASE_URL}/proximos/kiron/Italy`;
    if (nomeLiga === LIGAS.KIRON_AMERICA) return `${API_BASE_URL}/proximos/kiron/America%20Latina`;
    if (nomeLiga === LIGAS.KIRON_SPAIN) return `${API_BASE_URL}/proximos/kiron/Spain`;
    
    // ESTRELA
    if (nomeLiga === LIGAS.ESTRELA_COPA_MUNDO) return `${API_BASE_URL}/proximos/estrela/Copa%20do%20Mundo`;
    if (nomeLiga === LIGAS.ESTRELA_CHAMPIONS) return `${API_BASE_URL}/proximos/estrela/Ligas%20dos%20Campe%C3%B5es`;
    if (nomeLiga === LIGAS.ESTRELA_AMERICA_LATINA) return `${API_BASE_URL}/proximos/estrela/Am%C3%A9rica%20Latina`;
    
    return `${API_BASE_URL}/proximos/${encodeURIComponent(nomeLiga)}`;
  },
  
  odds: (nomeLiga) => {
    // BETANO
    if (nomeLiga === LIGAS.GLORIA_ETERNA) return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.COPA_AMERICA) return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.EURO) return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.ITALIANO) return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.COPA_ESTRELAS) return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
    if (nomeLiga === LIGAS.BRASILEIRAO) return `${API_BASE_URL}/odds/${encodeURIComponent(nomeLiga)}`;
    
    // BET365
    if (nomeLiga === LIGAS.BET365_COPA) return `${API_BASE_URL}/odds/bet365/Copa`;
    if (nomeLiga === LIGAS.BET365_EURO) return `${API_BASE_URL}/odds/bet365/Euro`;
    if (nomeLiga === LIGAS.BET365_SUPER) return `${API_BASE_URL}/odds/bet365/Super`;
    if (nomeLiga === LIGAS.BET365_PREMIER) return `${API_BASE_URL}/odds/bet365/Premier`;
    
    // KIRON
    if (nomeLiga === LIGAS.KIRON_BRAZIL) return `${API_BASE_URL}/odds/kiron/Brazil`;
    if (nomeLiga === LIGAS.KIRON_ENGLAND) return `${API_BASE_URL}/odds/kiron/England`;
    if (nomeLiga === LIGAS.KIRON_ITALY) return `${API_BASE_URL}/odds/kiron/Italy`;
    if (nomeLiga === LIGAS.KIRON_AMERICA) return `${API_BASE_URL}/odds/kiron/America%20Latina`;
    if (nomeLiga === LIGAS.KIRON_SPAIN) return `${API_BASE_URL}/odds/kiron/Spain`;
    
    // ESTRELA
    if (nomeLiga === LIGAS.ESTRELA_COPA_MUNDO) return `${API_BASE_URL}/odds/estrela/Copa%20do%20Mundo`;
    if (nomeLiga === LIGAS.ESTRELA_CHAMPIONS) return `${API_BASE_URL}/odds/estrela/Ligas%20dos%20Campe%C3%B5es`;
    if (nomeLiga === LIGAS.ESTRELA_AMERICA_LATINA) return `${API_BASE_URL}/odds/estrela/Am%C3%A9rica%20Latina`;
    
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
  if (caminho.includes("euro.html") && !caminho.includes("bet365")) return LIGAS.EURO;

  // BET365
  if (caminho.includes("bet365copa.html")) return LIGAS.BET365_COPA;
  if (caminho.includes("bet365euro.html")) return LIGAS.BET365_EURO;
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