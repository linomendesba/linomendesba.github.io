// config.js – VERSÃO REFATORADA E LIMPA

const API_BASE_URL = "https://datavirtual.com.br";

// Abre a conexão (DNS + TLS) com a API enquanto o resto da página ainda carrega.
// A API está em outro domínio (sem www), então esse handshake antes ficava no caminho do primeiro fetch.
(function preconectarAPI() {
  try {
    if (typeof document === "undefined" || !document.head) return;
    if (document.head.querySelector('link[data-dv-preconnect]')) return;
    const l = document.createElement("link");
    l.rel = "preconnect";
    l.href = API_BASE_URL;
    l.crossOrigin = "anonymous";
    l.setAttribute("data-dv-preconnect", "1");
    document.head.appendChild(l);
  } catch (e) {}
})();

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
  KIRON_MUNDIAL: "Kiron Liga Mundial",


  ESTRELA_COPA_MUNDO:     "Copa do Mundo",
  ESTRELA_CHAMPIONS:      "Ligas dos Campeões",
  ESTRELA_AMERICA_LATINA: "América Latina",
  ESTRELA_PREMIER:        "Premier League",


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
  [LIGAS.KIRON_MUNDIAL]: "kiron/Mundial",

  [LIGAS.ESTRELA_COPA_MUNDO]:     "estrela/Copa%20do%20Mundo",
  [LIGAS.ESTRELA_CHAMPIONS]:      "estrela/Ligas%20dos%20Campe%C3%B5es",
  [LIGAS.ESTRELA_AMERICA_LATINA]: "estrela/Am%C3%A9rica%20Latina",
  [LIGAS.ESTRELA_PREMIER]:        "estrela/Premier%20League",


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
  "kironmundial.html":        LIGAS.KIRON_MUNDIAL,
  "estrelacopamundo.html":    LIGAS.ESTRELA_COPA_MUNDO,
  "estrelachampions.html":    LIGAS.ESTRELA_CHAMPIONS,
  "estrelaamericalatina.html":LIGAS.ESTRELA_AMERICA_LATINA,
  "estrelapremier.html":      LIGAS.ESTRELA_PREMIER,
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
        descricao: "DataVirtual - plataforma de análise para futebol virtual Kiron e Estrelabet, além de BacBo Live, Speedway e Futebol Real. Mais de 80 ferramentas com estatísticas em tempo real, gráficos de tendência e sinais automáticos.",
        keywords: "DataVirtual, futebol virtual, apostas esportivas, Kiron, Estrelabet, BacBo Live, Speedway, estatísticas ao vivo, análise de apostas",
        ogTitulo: "DataVirtual | Plataforma de Análise para Futebol Virtual e Apostas Esportivas",
        ogDescricao: "Mais de 80 ferramentas de análise em tempo real para Kiron e Estrelabet. Estatísticas, gráficos de tendência e sinais automáticos via Telegram.",
      }
    : {
        titulo: `DataVirtual | ${liga} - Análise ao Vivo`,
        descricao: `Análise da ${liga} na plataforma DataVirtual: resultados, próximos jogos, odds e estatísticas em tempo real. Parte de uma plataforma com mais de 80 ferramentas para futebol virtual Kiron e Estrelabet.`,
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