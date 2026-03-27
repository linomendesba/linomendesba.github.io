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
  //    Salvar e imprimir: Ctrl+S, Ctrl+P
  // ============================================================
  document.addEventListener("keydown", function (e) {
    if (e.key === "F12")                                  { e.preventDefault(); }
    if (e.ctrlKey && e.shiftKey && e.key === "I")         { e.preventDefault(); }
    if (e.ctrlKey && e.shiftKey && e.key === "J")         { e.preventDefault(); }
    if (e.ctrlKey && e.shiftKey && e.key === "C")         { e.preventDefault(); }
    if (e.ctrlKey && e.key === "u")                       { e.preventDefault(); }
    if (e.ctrlKey && e.key === "s")                       { e.preventDefault(); }
    if (e.ctrlKey && e.key === "p")                       { e.preventDefault(); }
  });


  // ============================================================
  // 3. IMPEDE ARRASTAR ELEMENTOS
  // ============================================================
  document.addEventListener("dragstart", function (e) { e.preventDefault(); });


  // ============================================================
  // 4. DETECÇÃO DE DEVTOOLS POR TAMANHO DE JANELA (CORRIGIDA)
  //
  //  - Em mobile a detecção é desativada (barras nativas do SO
  //    causam falsos positivos inevitáveis).
  //  - Em desktop recalibra a base quando o zoom muda, evitando
  //    falsos positivos por Ctrl+/-.
  // ============================================================
  const DEVTOOLS_THRESHOLD = 200;
  let _baseW    = window.outerWidth  - window.innerWidth;
  let _baseH    = window.outerHeight - window.innerHeight;
  let _zoomBase = window.devicePixelRatio || 1;
  let _devtoolsAberto = false;
  let _bloqueado      = false; // única declaração — usada em todo o script
  const _isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  function _checarDevTools() {
    if (_isMobile) return; // mobile: desativa completamente

    const zoomAtual = window.devicePixelRatio || 1;
    if (Math.abs(zoomAtual - _zoomBase) > 0.05) {
      // Zoom mudou: recalibra a base e sai sem disparar bloqueio
      _baseW    = window.outerWidth  - window.innerWidth;
      _baseH    = window.outerHeight - window.innerHeight;
      _zoomBase = zoomAtual;
      return;
    }

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
  let _humanoResolve    = null;

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
  //  Limite de 300 req/min: usuário legítimo nunca atinge,
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
  // 8. INTERCEPTADOR ÚNICO DE FETCH
  //    Unifica: detecção humana + velocidade suspeita + rate limit.
  //    O fetch é sobrescrito UMA única vez — sem cadeia frágil.
  //    CDNs e requisições externas passam sem restrição.
  // ============================================================
  const _fetchOriginal = window.fetch.bind(window);

  // — Controle de velocidade suspeita —
  const _janelaSuspeita   = 2000; // ms
  const _maxRapidas       = 30;
  let   _requisicoesRapidas = [];

  function _checarVelocidade() {
    const agora = Date.now();
    _requisicoesRapidas = _requisicoesRapidas.filter(ts => agora - ts < _janelaSuspeita);
    _requisicoesRapidas.push(agora);

    if (_requisicoesRapidas.length > _maxRapidas) {
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
          <h2 style="margin:0;color:#fff;">Acesso bloqueado</h2>
          <p style="margin:0;color:#aaa;font-size:14px;">Comportamento suspeito detectado.</p>
        </div>`;
      throw new Error('Comportamento suspeito detectado.');
    }
  }

  // — Interceptador —
  window.fetch = async function (url, opcoes = {}) {
    const ehInterna = typeof url === 'string' && (
      url.includes('/api/') ||
      url.includes('betstat') ||
      url.startsWith('/')
    );

    if (!ehInterna) return _fetchOriginal(url, opcoes);

    // 1. Velocidade suspeita (síncrono — lança antes de qualquer await)
    _checarVelocidade();

    // 2. Confirmação humana (máx 8s)
    const confirmado = await Promise.race([
      _humanoPromise,
      new Promise(r => setTimeout(() => r(false), 8000))
    ]);

    if (!confirmado && !_humanoConfirmado) {
      console.warn('[BetStat] Fetch bloqueado: sem interação humana.');
      throw new Error('Interação humana necessária.');
    }

    // 3. Rate limit
    if (!_rateLimit.podeFazerRequisicao()) {
      throw new Error('Muitas requisições. Aguarde alguns segundos.');
    }

    return _fetchOriginal(url, opcoes);
  };


  // ============================================================
  // 9. BLOQUEIA CLIQUE DO MEIO DO MOUSE
  //    Impede abrir links em nova aba pelo botão do meio.
  // ============================================================
  document.addEventListener("auxclick", function (e) {
    if (e.button === 1) e.preventDefault();
  });


  // ============================================================
  // 10. EXPIRAÇÃO POR INATIVIDADE
  //     10 minutos sem interação → página limpa.
  //     Impede scrapers rodando em segundo plano.
  // ============================================================
  const INATIVIDADE_MS = 10 * 60 * 1000;
  let _timerInatividade = null;
  let _paginaExpirada   = false;

  function _resetarInatividade() {
    if (_paginaExpirada) return;
    clearTimeout(_timerInatividade);
    _timerInatividade = setTimeout(() => {
      _paginaExpirada = true;
      document.body.innerHTML = `
        <div style="
          display:flex;flex-direction:column;align-items:center;
          justify-content:center;height:100vh;background:#0a0f14;
          color:#1fac89;font-family:sans-serif;text-align:center;gap:16px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1fac89" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <h2 style="margin:0;color:#fff;">Sessão expirada</h2>
          <p style="margin:0;color:#aaa;font-size:14px;">Recarregue a página para continuar.</p>
          <button onclick="location.reload()" style="
            margin-top:8px;padding:10px 24px;background:#1fac89;color:#000;
            border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">
            Recarregar
          </button>
        </div>`;
    }, INATIVIDADE_MS);
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
    window.addEventListener(evt, _resetarInatividade, { passive: true });
  });

  _resetarInatividade(); // inicia o timer


  console.log('[BetStat] Proteções ativas ✓');

})();