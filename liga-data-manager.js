const LigaDataManager = (() => {
  // Janela em que chamadas iguais (vários blocos da página pedindo o mesmo dado) reaproveitam a mesma requisição.
  const CACHE_TTL_MS = 2500;
  // Histórico padrão pedido ao servidor (em horas). Cobre Máximas (72h), Ranking (48h), gráficos e médias.
  // Antes o manager baixava o histórico COMPLETO a cada ciclo.
  const HORAS_RESULTADOS = 100;
  const HORAS_ODDS = 6;
  const TIMEOUT_MS = 15000;

  const cache = {};   // url -> { timestamp, promise }
  const memo = {};    // url -> { texto, json }  (mesmo texto = mesma referência de objeto)

  function comHoras(url, horas) {
    if (!Number.isFinite(horas) || horas <= 0) return url;
    return url + (url.includes("?") ? "&" : "?") + "horas=" + Math.ceil(horas);
  }

  async function fetchJson(url) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      // Sem "_ts" e sem "no-store": o navegador revalida e a Cloudflare pode servir a resposta em cache.
      const res = await fetch(url, { cache: "no-cache", signal: ctrl.signal });
      if (!res.ok) throw new Error(`Erro HTTP ${res.status} em ${url}`);
      const texto = await res.text();
      const m = memo[url];
      // Conteúdo idêntico ao da última vez: devolve o MESMO objeto.
      // Quem compara por referência (===) evita reprocessar e redesenhar tudo.
      if (m && m.texto === texto) return m.json;
      const json = JSON.parse(texto);
      memo[url] = { texto, json };
      return json;
    } finally {
      clearTimeout(t);
    }
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
    // horas é opcional; sem argumento usa HORAS_RESULTADOS. Passe Infinity para o histórico completo.
    getResultados: (horas = HORAS_RESULTADOS) => getCached(comHoras(ROTAS_API.resultados(LIGA_ATUAL), horas)),
    getProximosJogos: () => getCached(ROTAS_API.proximosJogos(LIGA_ATUAL)),
    getOdds: (horas = HORAS_ODDS) => getCached(comHoras(ROTAS_API.odds(LIGA_ATUAL), horas)),
    _debugCacheSnapshot: () => ({ ...cache }),
  };
})();

// Desvio fixo por aba (0 a 1,5s): evita que todos os usuários batam no servidor no mesmo milissegundo.
// Dentro da mesma aba todos os blocos usam o mesmo desvio, então continuam compartilhando a mesma requisição.
const _JITTER_ABA_MS = Math.floor(Math.random() * 1500);

function sincronizarIntervalo(fn, periodoMs) {
  const agora = Date.now();
  const atraso = periodoMs - (agora % periodoMs) + _JITTER_ABA_MS;

  // Aba em segundo plano não busca nada; ao voltar, o próximo ciclo retoma.
  const rodar = () => { if (!document.hidden) return fn(); };

  const handle = { timeoutId: null, intervalId: null };
  handle.timeoutId = setTimeout(() => {
    rodar();
    handle.intervalId = setInterval(rodar, periodoMs);
  }, atraso);

  return handle;
}

function pararIntervaloSincronizado(handle) {
  if (!handle) return;
  if (handle.timeoutId) clearTimeout(handle.timeoutId);
  if (handle.intervalId) clearInterval(handle.intervalId);
}
