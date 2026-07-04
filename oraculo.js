(function initSugestaoEntrada() {


  (function injetarEstilos() {
    if (document.getElementById('sg-styles')) return;
    const s = document.createElement('style');
    s.id = 'sg-styles';
    s.textContent = `
      #sg-btn {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: none;
        border: none;
        padding: 0 2px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: normal;
        text-transform: none;
        color: #177b8e;
        transition: color 0.15s;
      }
      #sg-btn:hover { color: #1fa8c7; }
      #sg-btn .sg-arrow {
        font-size: 0.72em;
        opacity: 0.75;
        transition: transform 0.2s;
        margin-left: 1px;
      }
      #sg-btn.aberto .sg-arrow { transform: rotate(180deg); }

      #sg-corpo {
        overflow: hidden;
        border-top: 1px solid rgba(23,123,142,0.18);
        background: linear-gradient(180deg, rgba(23,123,142,0.06) 0%, transparent 100%);
        padding: 0;
        transition: max-height 0.3s ease, opacity 0.25s ease;
      }
      #sg-corpo.fechado {
        max-height: 0;
        opacity: 0;
        pointer-events: none;
      }
      #sg-corpo.aberto {
        max-height: 160px;
        opacity: 1;
      }

      .sg-inner {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 6px 12px 8px;
      }
      .sg-label-mercado {
        font-size: 0.78em;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #94a3b8;
      }
      .sg-hora {
        font-size: 0.75em;
        color: rgba(23,123,142,0.7);
        font-weight: 600;
        letter-spacing: 0.03em;
      }
      .sg-sep {
        width: 1px;
        height: 14px;
        background: rgba(23,123,142,0.25);
        display: inline-block;
      }
      .sg-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 24px;
        padding: 0 8px;
        background: rgba(23,123,142,0.12);
        border: 1px solid rgba(23,123,142,0.35);
        border-radius: 4px;
        color: #1fa8c7;
        font-weight: 700;
        font-size: 0.8em;
        letter-spacing: 0.03em;
        transition: background 0.15s, border-color 0.15s;
      }
      .sg-pill:hover {
        background: rgba(23,123,142,0.22);
        border-color: rgba(23,123,142,0.6);
      }
      .sg-pill-prefix {
        font-size: 0.7em;
        margin-right: 2px;
        opacity: 0.65;
      }
      .sg-vazio {
        font-size: 0.78em;
        color: #475569;
        font-style: italic;
        padding: 6px 12px 8px;
      }

      .sg-hist-row {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
        padding: 0 12px 8px;
        border-top: 1px dashed rgba(23,123,142,0.15);
        margin-top: 2px;
        padding-top: 6px;
      }
      .sg-hist-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 26px;
        height: 20px;
        padding: 0 5px;
        border-radius: 3px;
        font-size: 0.7em;
        font-weight: 700;
        letter-spacing: 0.02em;
        cursor: default;
      }
      .sg-hist-item.sg-green {
        background: rgba(34,197,94,0.15);
        border: 1px solid rgba(34,197,94,0.5);
        color: #22c55e;
      }
      .sg-hist-item.sg-red {
        background: rgba(239,68,68,0.15);
        border: 1px solid rgba(239,68,68,0.5);
        color: #ef4444;
      }
    `;
    document.head.appendChild(s);
  })();

  let _sgHoraAtualCache = null;
  let _sgPendente = null;


  function sgHistKey()   { return `sg_hist_${getLigaKey()}`; }
  function sgExpandKey() { return `sg_expand_${getLigaKey()}`; }
  function sgCarregarHist() { return JSON.parse(localStorage.getItem(sgHistKey()) || '[]'); }
  function sgSalvarHist(h)  { localStorage.setItem(sgHistKey(), JSON.stringify(h.slice(0, 60))); }


  function nomeMercado(m) {
    const n = {
      ambasMarcam:'Ambas Sim', ambasNaoMarcam:'Ambas Não',
      'over0.5':'Over 0.5','over1.5':'Over 1.5','over2.5':'Over 2.5','over3.5':'Over 3.5',over5:'Over 5',
      'under0.5':'Under 0.5','under1.5':'Under 1.5','under2.5':'Under 2.5','under3.5':'Under 3.5',
      casaVence:'Casa Vence',foraVence:'Fora Vence',empate:'Empate',viradinha:'Viradinha',
    };
    return n[m] || m;
  }


  function contarOcorrencias(resultados, mercado, dataStr, hora) {
    return resultados
      .filter(j => j.data.split('T')[0] === dataStr && j.hora === hora)
      .filter(j => qdCheckMarket(j.ft, j.ht, mercado)).length;
  }


  function horaAnterior(dataStr, hora) {
    let h = hora - 1, d = dataStr;
    if (h < 0) {
      h = 23;
      const dt = new Date(dataStr + 'T12:00:00');
      dt.setDate(dt.getDate() - 1);
      d = dt.toISOString().split('T')[0];
    }
    return { dataStr: d, hora: h };
  }


  function sgChecarResultadoAuto(resultados) {
    if (!_sgPendente) return;
    const { mercado, sugeridos, horaRef, dataRef } = _sgPendente;
    const { hora: horaAtualAgora, dateStr: dataAgora } = qdGetHoraAtual(resultados);
    if (horaAtualAgora === horaRef && dataAgora === dataRef) return;

    const jogos = resultados.filter(j => j.data.split('T')[0] === dataRef && j.hora === horaRef);
    const temDados = sugeridos.some(minuto => jogos.find(j => j.minuto === minuto));
    if (!temDados) return;

    // Percorre os 3 minutos sugeridos e marca green no primeiro que bater o mercado.
    // Se nenhum bater, fica red.
    let minutoGreen = null;
    const acertou = sugeridos.some(minuto => {
      const jogo = jogos.find(j => j.minuto === minuto);
      if (jogo && qdCheckMarket(jogo.ft, jogo.ht, mercado)) {
        minutoGreen = minuto;
        return true;
      }
      return false;
    });

    const status = acertou ? 'green' : 'red';
    const hist = sgCarregarHist();
    hist.unshift({ ..._sgPendente, status, minutoGreen });
    sgSalvarHist(hist);
    _sgPendente = null;

    sgRenderCorpo();
    sgAutoGerar(resultados);
  }


  function sgAutoGerar(resultados) {
    if (_sgPendente) return;
    const { hora: horaAtual, dateStr: dataAtual } = qdGetHoraAtual(resultados);
    const cacheKey = `${dataAtual}-${horaAtual}`;
    if (_sgHoraAtualCache === cacheKey) return;
    _sgHoraAtualCache = cacheKey;

    const mercado = document.querySelector('#seletorResultado')?.value || 'over2.5';
    const ant = horaAnterior(dataAtual, horaAtual);
    const qtd = contarOcorrencias(resultados, mercado, ant.dataStr, ant.hora);
    const sugeridos = minutosFixos.slice(qtd, qtd + 3);
    if (!sugeridos.length) return;

    _sgPendente = { mercado, qtd, sugeridos, horaRef: horaAtual, dataRef: dataAtual, status: 'pendente' };
    sgRenderCorpo();
  }


  function sgHistBadge(h) {
    if (h.status === 'green') {
      return `<span class="sg-hist-item sg-green" title="${nomeMercado(h.mercado)} • green no minuto ${h.minutoGreen}'">${h.minutoGreen}'</span>`;
    }
    return `<span class="sg-hist-item sg-red" title="${nomeMercado(h.mercado)} • red (nenhuma das 3 entradas bateu)">✕</span>`;
  }


  function sgRenderCorpo() {
    const corpo = document.getElementById('sg-corpo');
    if (!corpo) return;

    const hist = sgCarregarHist().slice(0, 10);
    const histHtml = hist.length
      ? `<div class="sg-hist-row">${hist.map(sgHistBadge).join('')}</div>`
      : '';

    if (_sgPendente) {
      const { mercado, sugeridos, horaRef } = _sgPendente;
      const horaLabel = String(horaRef).padStart(2, '0') + 'h';
      const pills = sugeridos.map(m =>
        `<span class="sg-pill"><span class="sg-pill-prefix">▸</span>${m}</span>`
      ).join('');

      corpo.innerHTML = `
        <div class="sg-inner">
          <span class="sg-label-mercado">${nomeMercado(mercado)}</span>
          <span class="sg-sep"></span>
          <span class="sg-hora">${horaLabel}</span>
          <span class="sg-sep"></span>
          ${pills}
        </div>
        ${histHtml}
      `;
    } else {
      corpo.innerHTML = `
        <div class="sg-vazio">Aguardando dados da próxima hora…</div>
        ${histHtml}
      `;
    }
  }


  window.sgToggle = function () {
    const corpo = document.getElementById('sg-corpo');
    const btn   = document.getElementById('sg-btn');
    if (!corpo || !btn) return;
    const aberto = corpo.classList.contains('aberto');

    corpo.classList.toggle('aberto', !aberto);
    corpo.classList.toggle('fechado', aberto);
    btn.classList.toggle('aberto', !aberto);

    localStorage.setItem(sgExpandKey(), aberto ? '0' : '1');
  };


  function injetarPainel() {
    if (document.getElementById('sg-btn')) return;

    const expandido = localStorage.getItem(sgExpandKey()) === '1';


    const wrapper = document.createElement('label');
    wrapper.className = 'alerta-toggle-label';
    wrapper.style.cssText = 'margin-left:6px;cursor:pointer;';
    wrapper.innerHTML = `
      <button id="sg-btn" onclick="sgToggle()" class="${expandido ? 'aberto' : ''}" title="Oráculo de Entradas">
        Oráculo
        <span class="sg-arrow">▾</span>
      </button>
    `;


    const corpo = document.createElement('div');
    corpo.id = 'sg-corpo';
    corpo.className = expandido ? 'aberto' : 'fechado';

    function tentarInjetar() {
      const painelCores = document.getElementById('painel-cores');
      if (!painelCores) { setTimeout(tentarInjetar, 300); return; }
      if (document.getElementById('sg-btn')) return;

      painelCores.appendChild(wrapper);
      painelCores.parentNode.insertBefore(corpo, painelCores.nextSibling);

      sgRenderCorpo();
    }

    tentarInjetar();
  }

  const _buscarDadosOriginal = buscarDados;
  window.buscarDados = async function () {
    await _buscarDadosOriginal();
    try {
      const r = await fetch(ROTAS_API.resultados(LIGA_ATUAL));
      if (!r.ok) return;
      const resultados = await r.json();
      if (!resultados.length) return;
      sgChecarResultadoAuto(resultados);
      if (!_sgPendente) sgAutoGerar(resultados);
    } catch(e) { console.error('oraculo:', e); }
  };


  document.querySelector('#seletorResultado')?.addEventListener('change', async () => {
    _sgPendente = null;
    _sgHoraAtualCache = null;
    try {
      const r = await fetch(ROTAS_API.resultados(LIGA_ATUAL));
      if (r.ok) sgAutoGerar(await r.json());
    } catch(e) {}
  });


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injetarPainel);
  } else {
    injetarPainel();
  }

})();