// ============================================================
//  BETSTAT — PROTEÇÃO COMPLETA (Anti-Scraping + DevTools)
//  Adicione no final do <body>, antes de </body>:
//  <script src="protecao.js"></script>
// ============================================================

(function () {

  // ============================================================
  // 1. BLOQUEIA CLIQUE DIREITO
  // ============================================================
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });


  // ============================================================
  // 2. BLOQUEIA ATALHOS DE TECLADO
  //    DevTools: F12, Ctrl+Shift+I/J/C, Ctrl+U
  //    Cópia: Ctrl+C
  // ============================================================
  document.addEventListener("keydown", function (e) {
    // Abre DevTools
    if (e.key === "F12")                                  { e.preventDefault(); }
    if (e.ctrlKey && e.shiftKey && e.key === "I")         { e.preventDefault(); }
    if (e.ctrlKey && e.shiftKey && e.key === "J")         { e.preventDefault(); }
    if (e.ctrlKey && e.shiftKey && e.key === "C")         { e.preventDefault(); }
    if (e.ctrlKey && e.key === "u")                       { e.preventDefault(); }
    // Salvar e imprimir
    if (e.ctrlKey && e.key === "s")                       { e.preventDefault(); }
    if (e.ctrlKey && e.key === "p")                       { e.preventDefault(); }
  });


  // ============================================================
  // 3. IMPEDE ARRASTAR ELEMENTOS
  // ============================================================
  document.addEventListener("dragstart",   function (e) { e.preventDefault(); });


  // ============================================================
  // 4. DETECÇÃO DE DEVTOOLS POR TAMANHO DE JANELA
  //
  //  Mede a diferença outer/inner no carregamento como base.
  //  Só dispara se a diferença CRESCER além de 200px — zoom
  //  não causa esse crescimento, abrir DevTools na lateral sim.
  // ============================================================
  const _baseW = window.outerWidth  - window.innerWidth;
  const _baseH = window.outerHeight - window.innerHeight;
  const DEVTOOLS_THRESHOLD = 200;

  let _devtoolsAberto = false;
  let _bloqueado = false;

  function _checarDevTools() {
    const diffW = (window.outerWidth  - window.innerWidth)  - _baseW;
    const diffH = (window.outerHeight - window.innerHeight) - _baseH;
    _devtoolsAberto = diffW > DEVTOOLS_THRESHOLD || diffH > DEVTOOLS_THRESHOLD;
  }

  window.addEventListener('resize', _checarDevTools, { passive: true });
  setInterval(_checarDevTools, 500);


  // ============================================================
  // 5. AÇÃO QUANDO DEVTOOLS É DETECTADO
  // ============================================================
  setInterval(function () {
    if (_devtoolsAberto && !_bloqueado) {
      _bloqueado = true;
      document.body.innerHTML = `
        <div style="
          display:flex;flex-direction:column;align-items:center;
          justify-content:center;height:100vh;background:#0a0f14;
          color:#1fac89;font-family:sans-serif;text-align:center;gap:16px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1fac89" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2 style="margin:0;color:#fff;">Acesso restrito</h2>
          <p style="margin:0;color:#aaa;font-size:14px;">As ferramentas de desenvolvedor estão bloqueadas nesta página.</p>
        </div>`;
    }
  }, 1000);


  // ============================================================
  // 6. DETECÇÃO DE COMPORTAMENTO HUMANO
  //    Fetch bloqueado até haver interação real na página.
  //    Scrapers headless não geram eventos naturais.
  // ============================================================
  let _humanoConfirmado = false;
  let _humanoResolve = null;

  const _humanoPromise = new Promise((resolve) => { _humanoResolve = resolve; });

  function _confirmarHumano() {
    if (!_humanoConfirmado) {
      _humanoConfirmado = true;
      _humanoResolve(true);
    }
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
    window.addEventListener(evt, _confirmarHumano, { once: true, passive: true });
  });


  // ============================================================
  // 7. RATE LIMITING NO FRONTEND
  //
  //  Seu app faz ~200 requisições/min em uso normal
  //  (9 setIntervals + 19 pontos de fetch).
  //  Limite de 300/min: usuário legítimo nunca atinge,
  //  script em loop abusivo é barrado rapidamente.
  // ============================================================
  const _rateLimit = {
    janela: 60 * 1000,
    maxRequisicoes: 300,
    historico: [],

    podeFazerRequisicao() {
      const agora = Date.now();
      this.historico = this.historico.filter(ts => agora - ts < this.janela);
      if (this.historico.length >= this.maxRequisicoes) {
        console.warn('[BetStat] Rate limit atingido.');
        return false;
      }
      this.historico.push(agora);
      return true;
    }
  };


  // ============================================================
  // 8. INTERCEPTADOR DE FETCH
  //    Aplica detecção humana + rate limit em toda requisição
  //    interna automaticamente. CDNs e externos passam livre.
  // ============================================================
  const _fetchOriginal = window.fetch.bind(window);

  window.fetch = async function (url, opcoes = {}) {

    const ehInterna = typeof url === 'string' && (
      url.includes('/api/') ||
      url.includes('betstat') ||
      url.startsWith('/')
    );

    if (!ehInterna) return _fetchOriginal(url, opcoes);

    // Aguarda interação humana (máx 8s)
    const confirmado = await Promise.race([
      _humanoPromise,
      new Promise(r => setTimeout(() => r(false), 8000))
    ]);

    if (!confirmado && !_humanoConfirmado) {
      console.warn('[BetStat] Fetch bloqueado: sem interação humana.');
      throw new Error('Interação humana necessária.');
    }

    if (!_rateLimit.podeFazerRequisicao()) {
      throw new Error('Muitas requisições. Aguarde alguns segundos.');
    }

    return _fetchOriginal(url, opcoes);
  };


  console.log('[BetStat] Proteções ativas ✓');

})();