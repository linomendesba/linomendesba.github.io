const LigaDataManager = {
  async _get(url) {
    const urlSemCache = url + (url.includes("?") ? "&" : "?") + `_ts=${Date.now()}`;
    const res = await fetch(urlSemCache, { cache: "no-store" });
    if (!res.ok) throw new Error(`Erro HTTP ${res.status} em ${url}`);
    return res.json();
  },

  getResultados:    () => LigaDataManager._get(ROTAS_API.resultados(LIGA_ATUAL)),
  getProximosJogos: () => LigaDataManager._get(ROTAS_API.proximosJogos(LIGA_ATUAL)),
  getOdds:          () => LigaDataManager._get(ROTAS_API.odds(LIGA_ATUAL)),

  // mantido só para não quebrar quem chama; não existe mais cache
  _debugCacheSnapshot: () => ({}),
};

// Intervalo normal, sem alinhar ao relógio
function iniciarIntervalo(fn, periodoMs) {
  return setInterval(fn, periodoMs);
}

function pararIntervalo(id) {
  if (id) clearInterval(id);
}