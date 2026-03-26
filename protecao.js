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
// 4. DETECÇÃO MELHORADA DE DEVTOOLS (menos falsos positivos)
// ============================================================
let _devtoolsAberto = false;
let _bloqueado = false;

const DEVTOOLS_THRESHOLD = 250; // aumentei um pouco para mais segurança
let _baseDiffW = 0;
let _baseDiffH = 0;
let _zoomBase = window.devicePixelRatio || 1;

function _calcularBase() {
  _baseDiffW = window.outerWidth - window.innerWidth;
  _baseDiffH = window.outerHeight - window.innerHeight;
  _zoomBase = window.devicePixelRatio || 1;
}

// Calcula a base só depois do carregamento completo (melhor momento)
window.addEventListener('load', _calcularBase, { once: true });

// Também recalcula após um pequeno delay (ajuda com layouts que mudam)
setTimeout(_calcularBase, 800);

function _checarDevTools() {
  const zoomAtual = window.devicePixelRatio || 1;
  
  // Ignora se zoom mudou significativamente
  if (Math.abs(zoomAtual - _zoomBase) > 0.1) {
    _calcularBase(); // recalcula base com novo zoom
    return;
  }

  const diffW = (window.outerWidth - window.innerWidth) - _baseDiffW;
  const diffH = (window.outerHeight - window.innerHeight) - _baseDiffH;

  // Mais tolerante: exige diferença em AMBAS direções ou valor bem alto
  _devtoolsAberto = (diffW > DEVTOOLS_THRESHOLD || diffH > DEVTOOLS_THRESHOLD) &&
                    (Math.abs(diffW) > 80 && Math.abs(diffH) > 30); // evita falsos em apenas uma direção
}

window.addEventListener('resize', _checarDevTools, { passive: true });
setInterval(_checarDevTools, 600); // um pouco mais espaçado


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


  // ============================================================
  // 9. BLOQUEIA CLIQUE DO MEIO DO MOUSE
  //    Impede abrir links em nova aba pelo botão do meio,
  //    contornando proteções de navegação.
  // ============================================================
  document.addEventListener("auxclick", function (e) {
    if (e.button === 1) e.preventDefault();
  });


  // ============================================================
  // 10. EXPIRAÇÃO POR INATIVIDADE
  //     Se o usuário ficar 10 minutos sem nenhuma interação,
  //     a página é limpa — impede scrapers rodando em segundo plano.
  // ============================================================
  const INATIVIDADE_MS = 10 * 60 * 1000; // 10 minutos
  let _timerInatividade = null;
  let _paginaExpirada = false;

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


  // ============================================================
  // 11. DETECÇÃO DE VELOCIDADE SUSPEITA DE REQUISIÇÕES
  //     Mais de 10 fetches em menos de 2 segundos é padrão
  //     de script, não de humano. Bloqueia e limpa a página.
  // ============================================================
  const _janelaSuspeita = 2000; // 2 segundos
  const _maxRapidas     = 30;
  let _requisicoesRapidas = [];

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

  // Integra a verificação de velocidade no interceptador de fetch existente
  const _fetchComVelocidade = window.fetch.bind(window);
  window.fetch = async function (url, opcoes = {}) {
    const ehInterna = typeof url === 'string' && (
      url.includes('/api/') ||
      url.includes('betstat') ||
      url.startsWith('/')
    );
    if (ehInterna) _checarVelocidade();
    return _fetchComVelocidade(url, opcoes);
  };


  console.log('[BetStat] Proteções ativas ✓');

})();