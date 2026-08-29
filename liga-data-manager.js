

const LigaDataManager = (() => {

  const CACHE_TTL_MS = 1000;


  const cache = {};

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro HTTP ${res.status} em ${url}`);
    return res.json();
  }


  function getCached(url) {
    const now = Date.now();
    const entry = cache[url];

    if (entry && (now - entry.timestamp) < CACHE_TTL_MS) {
      return entry.promise;
    }

    const newEntry = { timestamp: now, promise: null };
    const promise = fetchJson(url).catch(err => {

      if (cache[url] === newEntry) delete cache[url];
      throw err;
    });
    newEntry.promise = promise;
    cache[url] = newEntry;
    return promise;
  }

  return {

    getResultados: () => getCached(ROTAS_API.resultados(LIGA_ATUAL)),
    getProximosJogos: () => getCached(ROTAS_API.proximosJogos(LIGA_ATUAL)),
    getOdds: () => getCached(ROTAS_API.odds(LIGA_ATUAL)),


    _debugCacheSnapshot: () => ({ ...cache }),
  };
})();

function sincronizarIntervalo(fn, periodoMs) {
  const agora = Date.now();
  const atraso = periodoMs - (agora % periodoMs);

  const handle = { timeoutId: null, intervalId: null };
  handle.timeoutId = setTimeout(() => {
    fn();
    handle.intervalId = setInterval(fn, periodoMs);
  }, atraso);

  return handle;
}

function pararIntervaloSincronizado(handle) {
  if (!handle) return;
  if (handle.timeoutId) clearTimeout(handle.timeoutId);
  if (handle.intervalId) clearInterval(handle.intervalId);
}
