// liga-data-manager.js
// ────────────────────────────────────────────────────────────────
// Centraliza o fetch de resultados/próximos jogos/odds da liga atual.
// Objetivo: várias funções da página pedem os mesmos dados em
// intervalos parecidos (1s, 3s, 5s, 60s) — sem isso, cada uma delas
// disparava sua própria requisição de rede pro mesmo endpoint.
//
// Com esse gerenciador, todas passam a chamar LigaDataManager.getX(),
// e só existe UMA requisição de rede real por tipo de dado a cada
// CACHE_TTL_MS milissegundos, não importa quantas funções peçam.
//
// Requer que config.js (ROTAS_API, LIGA_ATUAL) já tenha sido carregado.
// ────────────────────────────────────────────────────────────────

const LigaDataManager = (() => {
  // Tempo mínimo entre duas requisições reais pro mesmo endpoint.
  // 1000ms cobre o menor intervalo usado hoje nas páginas (ex: 'atualizar').
  // Ajuste aqui, num lugar só, se precisar de mais ou menos frequência.
  const CACHE_TTL_MS = 1000;

  // cache[url] = { timestamp: <quando foi buscado>, promise: <promise dos dados já parseados> }
  const cache = {};

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro HTTP ${res.status} em ${url}`);
    return res.json();
  }

  // Busca com cache: se já tem uma busca "fresca" (dentro do TTL) pra essa
  // URL, devolve ela em vez de criar uma requisição nova.
  // Isso também deduplica corretamente requisições concorrentes: se 5
  // funções chamarem isso no mesmo milissegundo, elas compartilham a
  // MESMA promise, então só sai 1 requisição de rede.
  function getCached(url) {
    const now = Date.now();
    const entry = cache[url];

    if (entry && (now - entry.timestamp) < CACHE_TTL_MS) {
      return entry.promise;
    }

    const newEntry = { timestamp: now, promise: null };
    const promise = fetchJson(url).catch(err => {
      // Em caso de erro, limpa o cache pra próxima chamada tentar de novo
      // (em vez de ficar propagando o mesmo erro até o TTL expirar).
      if (cache[url] === newEntry) delete cache[url];
      throw err;
    });
    newEntry.promise = promise;
    cache[url] = newEntry;
    return promise;
  }

  return {
    // Cada chamada usa ROTAS_API/LIGA_ATUAL no MOMENTO da chamada,
    // então continua funcionando normalmente com o config.js de cada página.
    getResultados: () => getCached(ROTAS_API.resultados(LIGA_ATUAL)),
    getProximosJogos: () => getCached(ROTAS_API.proximosJogos(LIGA_ATUAL)),
    getOdds: () => getCached(ROTAS_API.odds(LIGA_ATUAL)),

    // Utilitário caso precise ajustar o TTL em runtime/debug
    _debugCacheSnapshot: () => ({ ...cache }),
  };
})();
