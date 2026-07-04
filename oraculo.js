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
        max-height: 120px;
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
        transition: background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s;
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

      /* Pill que bateu o mercado (green) */
      .sg-pill.sg-pill-hit {
        background: rgba(34,197,94,0.18);
        border-color: rgba(34,197,94,0.6);
        color: #22c55e;
      }
      /* Pills que não bateram, mas o grupo teve green em outro minuto */
      .sg-pill.sg-pill-miss {
        background: rgba(148,163,184,0.08);
        border-color: rgba(148,163,184,0.25);
        color: #64748b;
        opacity: 0.6;
      }
      /* Nenhuma das 3 bateu -> todas ficam vermelhas */
      .sg-pill.sg-pill-red {
        background: rgba(239,68,68,0.15);
        border-color: rgba(239,68,68,0.55);
        color: #ef4444;
      }

      .sg-status-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.72em;
        font-weight: 800;
        letter-spacing: 0.05em;
      }
      .sg-status-badge.sg-status-green {
        background: rgba(34,197,94,0.15);
        border: 1px solid rgba(34,197,94,0.5);
        color: #22c55e;
      }
      .sg-status-badge.sg-status-red {
        background: rgba(239,68,68,0.15);
        border: 1px solid rgba(239,68,68,0.5);
        color: #ef4444;
      }
    `;
    document.head.appendChild(s);
  })();

  let _sgHoraAtualCache = null;
  let _sgPendente = null;
  let _sgUltimoResultado = null; // último grupo de 3 minutos já conferido (green/red), fica na tela até a próxima sugestão ser gerada


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

    // Confere os 3 minutos sugeridos: assim que um bater o mercado, marca esse minuto como o green.
    // Se nenhum bater, o grupo inteiro fica red.
    let minutoGreen = null;
    const acertou = sugeridos.some(minuto => {
      const jogo = jogos.find(j => j.minuto === minuto);
      if (jogo && qdCheckMarket(jogo.ft, jogo.ht, mercado)) {
        minutoGreen = minuto;
        return true;
      }
      return false;
    });

    _sgUltimoResultado = {
      mercado, sugeridos, horaRef, dataRef,
      status: acertou ? 'green' : 'red',
      minutoGreen,
    };
    _sgPendente = null;

    sgRenderCorpo();
    // Não gera a próxima sugestão aqui: o resultado (green/red) fica visível até
    // o próximo ciclo de busca, quando o buscarDados chama sgAutoGerar naturalmente.
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
    _sgUltimoResultado = null;
    sgRenderCorpo();
  }


  function sgRenderCorpo() {
    const corpo = document.getElementById('sg-corpo');
    if (!corpo) return;

    // 1) Sugestão em andamento (hora ainda não fechou)
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
      `;
      return;
    }

    // 2) Última sugestão já conferida: mostra green/red na própria sugestão
    if (_sgUltimoResultado) {
      const { mercado, sugeridos, horaRef, status, minutoGreen } = _sgUltimoResultado;
      const horaLabel = String(horaRef).padStart(2, '0') + 'h';

      const pills = sugeridos.map(m => {
        let cls = 'sg-pill';
        if (status === 'green') {
          cls += (m === minutoGreen) ? ' sg-pill-hit' : ' sg-pill-miss';
        } else {
          cls += ' sg-pill-red';
        }
        return `<span class="${cls}"><span class="sg-pill-prefix">▸</span>${m}</span>`;
      }).join('');

      const badge = status === 'green'
        ? `<span class="sg-status-badge sg-status-green">GREEN</span>`
        : `<span class="sg-status-badge sg-status-red">RED</span>`;

      corpo.innerHTML = `
        <div class="sg-inner">
          <span class="sg-label-mercado">${nomeMercado(mercado)}</span>
          <span class="sg-sep"></span>
          <span class="sg-hora">${horaLabel}</span>
          <span class="sg-sep"></span>
          ${pills}
          <span class="sg-sep"></span>
          ${badge}
        </div>
      `;
      return;
    }

    // 3) Nada ainda
    corpo.innerHTML = `<div class="sg-vazio">Aguardando dados da próxima hora…</div>`;
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

  function sgExpandKey() { return `sg_expand_${getLigaKey()}`; }


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
    _sgUltimoResultado = null;
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