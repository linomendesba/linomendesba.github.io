// config.js – VERSÃO REFATORADA E LIMPA

const API_BASE_URL = "https://datavirtual.com.br";

// Ligas (Mantido o catálogo global)
const LIGAS = {




  ONEWIN_INGLATERRA: "1win Inglaterra",
  ONEWIN_ESPANHA:    "1win Espanha",
  ONEWIN_ITALIA:     "1win Itália",

  BETGREEN_PREMIER:    "BetGreen Premier League",
  BETGREEN_LALIGA:     "BetGreen La Liga",
  BETGREEN_WORLDCUP:   "BetGreen World Cup",
  BETGREEN_CHILE:      "BetGreen Primera Division",
  BETGREEN_CHAMPIONS:  "BetGreen Champions League",

  KIRON_BRAZIL:  "Kiron Liga Brasil",
  KIRON_ENGLAND: "Kiron Liga Inglaterra",
  KIRON_ITALY:   "Kiron Liga Itália",
  KIRON_AMERICA: "Kiron Liga América Latina",
  KIRON_SPAIN:   "Kiron Liga Espanha",


  ESTRELA_COPA_MUNDO:     "Copa do Mundo",
  ESTRELA_CHAMPIONS:      "Ligas dos Campeões",
  ESTRELA_AMERICA_LATINA: "América Latina",
  ESTRELA_PREMIER:        "Premier League",

  VAVA_MUNDIAL:   "Vavada Mundial",
  VAVA_BRASIL:    "Vavada Brasil",
  VAVA_INGLATERRA:"Vavada Inglaterra",
  VAVA_ITALIA:    "Vavada Itália",
  VAVA_AMERICA:   "Vavada América Latina",
  VAVA_ESPANHA:   "Vavada Espanha",
  VAVA_PREMIER:   "Vavada Premier League",

  STRIVO_ITALIA:         "Strivo Itália",
  STRIVO_INGLATERRA:     "Strivo Inglaterra",
  STRIVO_ESPANHA:        "Strivo Espanha",
  STRIVO_CHAMPIONS:      "Strivo Champions",
  STRIVO_COPA_MUNDO:     "Strivo Copa do Mundo",
  STRIVO_AMERICA:        "Strivo América",
  STRIVO_BRASIL:         "Strivo Brasil",
  STRIVO_AMERICA_LATINA: "Strivo América Latina"
};

// 1. Dicionário de Mapeamento de Rotas para Ligas Especiais
// Evita dezenas de 'if/else' nas chamadas de API
const MAPEAMENTO_ROTAS_ESPECIAIS = {



  // 1win: o nome da liga na URL é o mesmo salvo no banco pelo 1win.js
  [LIGAS.ONEWIN_INGLATERRA]: "onewin/Inglaterra",
  [LIGAS.ONEWIN_ESPANHA]:    "onewin/Espanha",
  [LIGAS.ONEWIN_ITALIA]:     "onewin/It%C3%A1lia",

  // BetGreen: o nome da liga na URL é o mesmo salvo no banco pelo betgreen.js
  [LIGAS.BETGREEN_PREMIER]:   "betgreen/England.%20Premier%20League",
  [LIGAS.BETGREEN_LALIGA]:    "betgreen/Spain.%20La%20Liga",
  [LIGAS.BETGREEN_WORLDCUP]:  "betgreen/World%20Cup.%20Play-offs",
  [LIGAS.BETGREEN_CHILE]:     "betgreen/Chile.%20Primera%20Division",
  [LIGAS.BETGREEN_CHAMPIONS]: "betgreen/Champions%20League",

  [LIGAS.KIRON_BRAZIL]:  "kiron/Brasil",
  [LIGAS.KIRON_ENGLAND]: "kiron/England",
  [LIGAS.KIRON_ITALY]:   "kiron/Italy",
  [LIGAS.KIRON_AMERICA]: "kiron/Am%C3%A9rica%20Latina",
  [LIGAS.KIRON_SPAIN]:   "kiron/Spain",

  [LIGAS.ESTRELA_COPA_MUNDO]:     "estrela/Copa%20do%20Mundo",
  [LIGAS.ESTRELA_CHAMPIONS]:      "estrela/Ligas%20dos%20Campe%C3%B5es",
  [LIGAS.ESTRELA_AMERICA_LATINA]: "estrela/Am%C3%A9rica%20Latina",
  [LIGAS.ESTRELA_PREMIER]:        "estrela/Premier%20League",

  // Vavada: o nome da liga na URL é o mesmo salvo no banco pelo vava.js
  [LIGAS.VAVA_MUNDIAL]:    "vava/V-Mundial",
  [LIGAS.VAVA_BRASIL]:     "vava/V-Brasil",
  [LIGAS.VAVA_INGLATERRA]: "vava/V-Inglaterra",
  [LIGAS.VAVA_ITALIA]:     "vava/V-It%C3%A1lia",
  [LIGAS.VAVA_AMERICA]:    "vava/V-Am%C3%A9rica%20Latina",
  [LIGAS.VAVA_ESPANHA]:    "vava/V-Espanha",
  [LIGAS.VAVA_PREMIER]:    "vava/V-Premier%20League",

  // Strivo: o nome da liga na URL é o mesmo salvo no banco pelo strivo.js
  [LIGAS.STRIVO_ITALIA]:         "strivo/It%C3%A1lia",
  [LIGAS.STRIVO_INGLATERRA]:     "strivo/Inglaterra",
  [LIGAS.STRIVO_ESPANHA]:        "strivo/Espanha",
  [LIGAS.STRIVO_CHAMPIONS]:      "strivo/Champions",
  [LIGAS.STRIVO_COPA_MUNDO]:     "strivo/Copa%20do%20Mundo",
  [LIGAS.STRIVO_AMERICA]:        "strivo/Am%C3%A9rica",
  [LIGAS.STRIVO_BRASIL]:         "strivo/Brasil",
  [LIGAS.STRIVO_AMERICA_LATINA]: "strivo/Am%C3%A9rica%20Latina",
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
  "vavamundial.html":         LIGAS.VAVA_MUNDIAL,
  "onewininglaterra.html":    LIGAS.ONEWIN_INGLATERRA,
  "onewinespanha.html":       LIGAS.ONEWIN_ESPANHA,
  "onewinitalia.html":        LIGAS.ONEWIN_ITALIA,
  "betgreenpremier.html":     LIGAS.BETGREEN_PREMIER,
  "betgreenlaliga.html":      LIGAS.BETGREEN_LALIGA,
  "betgreenworldcup.html":    LIGAS.BETGREEN_WORLDCUP,
  "betgreenchile.html":       LIGAS.BETGREEN_CHILE,
  "betgreenchampions.html":   LIGAS.BETGREEN_CHAMPIONS,
  "kironbrazil.html":         LIGAS.KIRON_BRAZIL,
  "kironengland.html":        LIGAS.KIRON_ENGLAND,
  "kironitaly.html":          LIGAS.KIRON_ITALY,
  "kironamerica.html":        LIGAS.KIRON_AMERICA,
  "kironspain.html":          LIGAS.KIRON_SPAIN,
  "estrelacopamundo.html":    LIGAS.ESTRELA_COPA_MUNDO,
  "estrelachampions.html":    LIGAS.ESTRELA_CHAMPIONS,
  "estrelaamericalatina.html":LIGAS.ESTRELA_AMERICA_LATINA,
  "estrelapremier.html":      LIGAS.ESTRELA_PREMIER,
  "vavabrasil.html":          LIGAS.VAVA_BRASIL,
  "vavainglaterra.html":      LIGAS.VAVA_INGLATERRA,
  "vavaitalia.html":          LIGAS.VAVA_ITALIA,
  "vavaamerica.html":         LIGAS.VAVA_AMERICA,
  "vavaespanha.html":         LIGAS.VAVA_ESPANHA,
  "vavapremier.html":         LIGAS.VAVA_PREMIER,
  "strivoitalia.html":        LIGAS.STRIVO_ITALIA,
  "strivoinglaterra.html":    LIGAS.STRIVO_INGLATERRA,
  "strivoespanha.html":       LIGAS.STRIVO_ESPANHA,
  "strivochampions.html":     LIGAS.STRIVO_CHAMPIONS,
  "strivocopamundo.html":     LIGAS.STRIVO_COPA_MUNDO,
  "strivoamericalatina.html": LIGAS.STRIVO_AMERICA_LATINA,
  "strivoamerica.html":       LIGAS.STRIVO_AMERICA,
  "strivobrasil.html":        LIGAS.STRIVO_BRASIL,
};

function detectarLigaAtual() {
  // Páginas multi-ligas (iframe mult-liga-tabela.html): a liga vem em ?res=
  try {
    let res = new URLSearchParams(window.location.search).get("res");
    if (res) {
      const validas = Object.values(LIGAS);
      if (!validas.includes(res)) {
        try { res = decodeURIComponent(res); } catch (e) {}
      }
      if (validas.includes(res)) return res;
    }
  } catch (e) {}

  const caminho = (window.location.pathname || "").toLowerCase();

  // Busca direta no Mapa
  for (const [arquivo, liga] of Object.entries(MAPA_ARQUIVO_PARA_LIGA)) {
    if (caminho.includes(arquivo)) return liga;
  }

  return LIGAS.KIRON_ENGLAND; // Fallback padrão
}

const LIGA_ATUAL = detectarLigaAtual();

// ────────────────────────────────────────────────────────────────
// SEO AUTOMÁTICO (Inalterado)
// ────────────────────────────────────────────────────────────────
const BASE_URL_SITE = "https://www.datavirtual.com.br";

function aplicarSEOAutomatico() {
  const caminho = window.location.pathname || "";
  const ehHome = caminho === "/" || caminho === "" || /\/index\.html$/i.test(caminho);

  const liga = LIGA_ATUAL;
  const urlAtual = BASE_URL_SITE + caminho;

  const dados = ehHome
    ? {
        titulo: "DataVirtual | Análise",
        descricao: "DataVirtual - plataforma de análise para futebol virtual Kiron, Estrelabet, Vavada e StrivoBet, além de BacBo Live, Speedway e Futebol Real. Mais de 80 ferramentas com estatísticas em tempo real, gráficos de tendência e sinais automáticos.",
        keywords: "DataVirtual, futebol virtual, apostas esportivas, Kiron, Estrelabet, Vavada, StrivoBet, BacBo Live, Speedway, estatísticas ao vivo, análise de apostas",
        ogTitulo: "DataVirtual | Plataforma de Análise para Futebol Virtual e Apostas Esportivas",
        ogDescricao: "Mais de 80 ferramentas de análise em tempo real para Kiron, Estrelabet, Vavada e StrivoBet. Estatísticas, gráficos de tendência e sinais automáticos via Telegram.",
      }
    : {
        titulo: `DataVirtual | ${liga} - Análise ao Vivo`,
        descricao: `Análise da ${liga} na plataforma DataVirtual: resultados, próximos jogos, odds e estatísticas em tempo real. Parte de uma plataforma com mais de 80 ferramentas para futebol virtual Kiron, Estrelabet, Vavada e StrivoBet.`,
        keywords: `${liga}, futebol virtual, DataVirtual, estatísticas, resultados ao vivo, análise de apostas`,
        ogTitulo: `DataVirtual | ${liga} - Análise ao Vivo`,
        ogDescricao: `Resultados, próximos jogos, odds e estatísticas em tempo real da ${liga} na plataforma DataVirtual.`,
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