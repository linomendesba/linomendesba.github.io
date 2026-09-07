// config.js – VERSÃO REFATORADA E LIMPA

const API_BASE_URL = "https://betstat.site";

// Ligas (Mantido o catálogo global)
const LIGAS = {
  GLORIA_ETERNA: "Taça Glória Eterna",
  COPA_AMERICA: "Copa América",
  EURO: "Euro",
  ITALIANO: "Campeonato Italiano",
  COPA_ESTRELAS: "Copa das Estrelas",
  BRASILEIRAO: "Brasileirão Betano",
  MUNDIAL: "Mundial",

  BET365_COPA:    "Bet365 Copa",
  BET365_EURO:    "Bet365 Euro",
  BET365_SUPER:   "Bet365 Super",
  BET365_PREMIER: "Bet365 Premier",

  BETSSON_ESPANHA:    "Betsson Espanha",
  BETSSON_INGLATERRA: "Betsson Inglaterra",
  BETSSON_BRASIL:     "Betsson Brasil",

  KIRON_BRAZIL:  "Kiron Liga Brasil",
  KIRON_ENGLAND: "Kiron Liga Inglaterra",
  KIRON_ITALY:   "Kiron Liga Itália",
  KIRON_AMERICA: "Kiron Liga América Latina",
  KIRON_SPAIN:   "Kiron Liga Espanha",

  ESTRELA_COPA_MUNDO:     "Copa do Mundo",
  ESTRELA_CHAMPIONS:      "Ligas dos Campeões",
  ESTRELA_AMERICA_LATINA: "América Latina"
};

// 1. Dicionário de Mapeamento de Rotas para Ligas Especiais
// Evita dezenas de 'if/else' nas chamadas de API
const MAPEAMENTO_ROTAS_ESPECIAIS = {
  [LIGAS.BET365_COPA]:    "bet365/Copa",
  [LIGAS.BET365_EURO]:    "bet365/Euro",
  [LIGAS.BET365_SUPER]:   "bet365/Super",
  [LIGAS.BET365_PREMIER]: "bet365/Premier",

  [LIGAS.BETSSON_ESPANHA]:    "betsson/Espanha",
  [LIGAS.BETSSON_INGLATERRA]: "betsson/Inglaterra",
  [LIGAS.BETSSON_BRASIL]:     "betsson/Brasil",

  [LIGAS.KIRON_BRAZIL]:  "kiron/Brazil",
  [LIGAS.KIRON_ENGLAND]: "kiron/England",
  [LIGAS.KIRON_ITALY]:   "kiron/Italy",
  [LIGAS.KIRON_AMERICA]: "kiron/America%20Latina",
  [LIGAS.KIRON_SPAIN]:   "kiron/Spain",

  [LIGAS.ESTRELA_COPA_MUNDO]:     "estrela/Copa%20do%20Mundo",
  [LIGAS.ESTRELA_CHAMPIONS]:      "estrela/Ligas%20dos%20Campe%C3%B5es",
  [LIGAS.ESTRELA_AMERICA_LATINA]: "estrela/Am%C3%A9rica%20Latina",
};

// Gerador genérico de endpoint para eliminar duplicação de funções
function gerarUrlApi(recurso, nomeLiga) {
  const subCaminho = MAPEAMENTO_ROTAS_ESPECIAIS[nomeLiga] || encodeURIComponent(nomeLiga);
  return `${API_BASE_URL}/${recurso}/${subCaminho}`;
}

const ROTAS_API = {
  resultados: (nomeLiga) => gerarUrlApi("resultados", nomeLiga),
  proximosJogos: (nomeLiga) => gerarUrlApi("proximos", nomeLiga),
  odds: (nomeLiga) => gerarUrlApi("odds", nomeLiga),
};

// 2. Mapeamento declarativo de Arquivo -> Liga
// Substitui a lista de 'if (caminho.includes(...))' por uma tabela de busca rápida
const MAPA_ARQUIVO_PARA_LIGA = {
  "brasileirao.html":         LIGAS.BRASILEIRAO,
  "campeonato_italiano.html": LIGAS.ITALIANO,
  "copa_america.html":        LIGAS.COPA_AMERICA,
  "copa_das_estrelas.html":   LIGAS.COPA_ESTRELAS,
  "mundial.html":             LIGAS.MUNDIAL,
  "bet365copa.html":          LIGAS.BET365_COPA,
  "bet365euro.html":          LIGAS.BET365_EURO,
  "bet365super.html":         LIGAS.BET365_SUPER,
  "bet365premier.html":       LIGAS.BET365_PREMIER,
  "betssonespanha.html":      LIGAS.BETSSON_ESPANHA,
  "betssoningland.html":      LIGAS.BETSSON_INGLATERRA,
  "betssonbrasil.html":       LIGAS.BETSSON_BRASIL,
  "kironbrazil.html":         LIGAS.KIRON_BRAZIL,
  "kironengland.html":        LIGAS.KIRON_ENGLAND,
  "kironitaly.html":          LIGAS.KIRON_ITALY,
  "kironamerica.html":        LIGAS.KIRON_AMERICA,
  "kironspain.html":          LIGAS.KIRON_SPAIN,
  "estrelacopamundo.html":    LIGAS.ESTRELA_COPA_MUNDO,
  "estrelachampions.html":    LIGAS.ESTRELA_CHAMPIONS,
  "estrelaamericalatina.html":LIGAS.ESTRELA_AMERICA_LATINA,
};

function detectarLigaAtual() {
  const caminho = (window.location.pathname || "").toLowerCase();

  // Tratamento da exceção da Euro (evitando conflito com bet365/betsson)
  if (caminho.includes("euro.html") && !caminho.includes("bet365") && !caminho.includes("betsson")) {
    return LIGAS.EURO;
  }

  // Busca direta no Mapa
  for (const [arquivo, liga] of Object.entries(MAPA_ARQUIVO_PARA_LIGA)) {
    if (caminho.includes(arquivo)) return liga;
  }

  return LIGAS.GLORIA_ETERNA; // Fallback padrão
}

const LIGA_ATUAL = detectarLigaAtual();

// ────────────────────────────────────────────────────────────────
// SEO AUTOMÁTICO (Inalterado)
// ────────────────────────────────────────────────────────────────
const BASE_URL_SITE = "https://www.betstat.site";

function aplicarSEOAutomatico() {
  const caminho = window.location.pathname || "";
  const ehHome = caminho === "/" || caminho === "" || /\/index\.html$/i.test(caminho);

  const liga = LIGA_ATUAL;
  const urlAtual = BASE_URL_SITE + caminho;

  const dados = ehHome
    ? {
        titulo: "BetStat | Análise",
        descricao: "BetStat - plataforma de análise para futebol virtual Bet365, Betano, Kiron, Estrelabet e Betsson, além de BacBo Live, Speedway e Futebol Real. Mais de 80 ferramentas com estatísticas em tempo real, gráficos de tendência e sinais automáticos.",
        keywords: "BetStat, futebol virtual, apostas esportivas, Bet365, Betano, Kiron, Estrelabet, Betsson, BacBo Live, Speedway, estatísticas ao vivo, análise de apostas, Taça Glória Eterna",
        ogTitulo: "BetStat | Plataforma de Análise para Futebol Virtual e Apostas Esportivas",
        ogDescricao: "Mais de 80 ferramentas de análise em tempo real para Bet365, Betano, Kiron, Estrelabet e Betsson. Estatísticas, gráficos de tendência e sinais automáticos via Telegram.",
      }
    : {
        titulo: `BetStat | ${liga} - Análise ao Vivo`,
        descricao: `Análise da ${liga} na BetStat: resultados, próximos jogos, odds e estatísticas em tempo real. Parte de uma plataforma com mais de 80 ferramentas para futebol virtual Bet365, Betano, Kiron, Estrelabet e Betsson.`,
        keywords: `${liga}, futebol virtual, BetStat, estatísticas, resultados ao vivo, análise de apostas`,
        ogTitulo: `BetStat | ${liga} - Análise ao Vivo`,
        ogDescricao: `Resultados, próximos jogos, odds e estatísticas em tempo real da ${liga} na plataforma BetStat.`,
      };

  document.title = dados.titulo;

  function upsertTag(seletor, tag, atributos) {
    let el = document.head.querySelector(seletor);
    if (!el) {
      el = document.createElement(tag);
      document.head.appendChild(el);
    }
    Object.keys(atributos).forEach((attr) => el.setAttribute(attr, atributos[attr]));
  }

  upsertTag('meta[name="description"]', "meta", { name: "description", content: dados.descricao });
  upsertTag('meta[name="keywords"]', "meta", { name: "keywords", content: dados.keywords });
  upsertTag('meta[property="og:title"]', "meta", { property: "og:title", content: dados.ogTitulo });
  upsertTag('meta[property="og:description"]', "meta", { property: "og:description", content: dados.ogDescricao });
  upsertTag('meta[property="og:url"]', "meta", { property: "og:url", content: urlAtual });
  upsertTag('link[rel="canonical"]', "link", { rel: "canonical", href: urlAtual });
}