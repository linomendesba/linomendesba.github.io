/* ══════════════════════════════════════════════════════════════════
   datajs.js — JS do template  jogos/hora
   Todos os <script> inline do body, na MESMA ordem em que apareciam.
   Carregado depois de: app.utils.min.js e toolsdev.js
   Carregado antes de:  accordion-reorder.js, marcador.js, global-selectors*.js
   ══════════════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────────────────────────────
   [1] Gráfico Quadrantes
   ────────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════════
   GRÁFICO QUADRANTES — LINHA ÚNICA (TOTAL DE GOLS POR QUADRANTE)
   COM SLIDERS MODERNOS, TOOLTIP ENRIQUECIDO E EIXO Y DINÂMICO

   O cliente define:
   - Quantos quadrantes quer ver no gráfico
   - Quantos jogos compõem cada quadrante
   - Qual a média de referência: pontos com total de gols ACIMA dessa
     média ficam verdes, ABAIXO ficam vermelhos.

   Cada ponto = soma exata dos gols (FT) dos últimos N jogos daquele
   quadrante (sem médias/percentual no cálculo do valor em si).
═══════════════════════════════════════════════════════════════════ */

const QD_ACCORDION_KEY        = 'qd:accordionOpen_v4';
const QD_NUM_QUADRANTES_KEY   = 'qd:numQuadrantes_v2';
const QD_JOGOS_QUADRANTE_KEY  = 'qd:jogosPorQuadrante_v2';
const QD_LIMIAR_MEDIA_KEY     = 'qd:limiarMedia_v2';

const COR_LINHA_QD  = '#4D96FF';
const COR_VERDE_QD  = '#2ecc71';
const COR_VERMELHO_QD = '#e74c3c';

let numQuadrantesQD      = 16;
let jogosPorQuadranteQD  = 5;
let limiarMediaQD        = 12;
let showFibonacciQD      = false;
let showLinhaAtualQD     = true;
let chartInstanceQD      = null;
let chartDataQD          = [];
let jogosPorPontoQD      = [];   // quantos jogos efetivamente compuseram cada quadrante exibido
let quadrantesInfoQD     = [];   // armazena quadrante, hora, etc

/* ── HELPERS DE STORAGE ── */
function _lsGetNum(key, fallback) {
    const v = parseFloat(localStorage.getItem(key));
    return isNaN(v) ? fallback : v;
}
function _lsSetNum(key, val) {
    try { localStorage.setItem(key, String(val)); } catch {}
}

function _lsAccordionQD() {
    const val = localStorage.getItem(QD_ACCORDION_KEY);
    return val !== '0';
}
function _saveAccordionQD(open) {
    localStorage.setItem(QD_ACCORDION_KEY, open ? '1' : '0');
}

/* ── QUADRANTES: DETECÇÃO AUTOMÁTICA POR LIGA ── */
let QUADRANTES_MINUTOS = [
    [1, 4, 7, 10, 13],
    [16, 19, 22, 25, 28],
    [31, 34, 37, 40, 43],
    [46, 49, 52, 55, 58]
];

/**
 * Detecta os minutos únicos do dataset e cria quadrantes automaticamente
 * Agrupa minutos em até 4 quadrantes balanceados
 */
function detectarQuadrantesAutomatico(dados) {
    if (!dados || dados.length === 0) return QUADRANTES_MINUTOS; // usa padrão se vazio

    // Coleta todos os minutos únicos presentes nos dados
    const minutosUnicos = [...new Set(dados.map(m => m.minuto))].sort((a, b) => a - b);

    // Se tem 20 ou mais minutos distintos, assume padrão de 4 quadrantes de 5
    if (minutosUnicos.length >= 20) {
        const q1 = minutosUnicos.slice(0, 5);
        const q2 = minutosUnicos.slice(5, 10);
        const q3 = minutosUnicos.slice(10, 15);
        const q4 = minutosUnicos.slice(15, 20);
        
        const quadrantesDetectados = [q1, q2, q3, q4].filter(q => q.length > 0);
        
        console.log('✓ Quadrantes detectados automaticamente:', quadrantesDetectados);
        return quadrantesDetectados;
    }

    // Se tem 4-19 minutos, divide em até 4 quadrantes
    if (minutosUnicos.length > 0) {
        const tamanhoQuadrante = Math.ceil(minutosUnicos.length / 4);
        const quadrantesDetectados = [];
        
        for (let i = 0; i < minutosUnicos.length; i += tamanhoQuadrante) {
            quadrantesDetectados.push(minutosUnicos.slice(i, i + tamanhoQuadrante));
        }
        
        console.log('✓ Quadrantes detectados (dinâmico):', quadrantesDetectados);
        return quadrantesDetectados;
    }

    // Fallback ao padrão se nenhum minuto for encontrado
    return QUADRANTES_MINUTOS;
}

/* ── DESCOBRE A QUE QUADRANTE UM MINUTO PERTENCE ── */
function getQuadranteIndex(minuto) {
    for (let q = 0; q < QUADRANTES_MINUTOS.length; q++) {
        if (QUADRANTES_MINUTOS[q].includes(minuto)) return q;
    }
    return -1;
}

/* ── PROCESSAR DADOS: AGRUPA JOGOS EM QUADRANTES E SOMA OS GOLS ── */
function processQuadrantesData(dados) {
    if (!dados || dados.length === 0) return { data: [], labels: [], jogosPorPonto: [], quadrantesInfo: [] };

    const sorted = [...dados].sort((a, b) => {
        const dA = new Date(a.data), dB = new Date(b.data);
        if (dA.getTime() !== dB.getTime()) return dA - dB;
        if (a.hora !== b.hora) return a.hora - b.hora;
        return a.minuto - b.minuto;
    });

    // Quantos quadrantes precisamos exibir
    const numQuadrantesExibir = Math.max(1, Math.round(numQuadrantesQD / 5));

    // Margem de segurança pra garantir dados suficientes
    const bufferJogos = numQuadrantesQD + 40;
    const sliced = sorted.slice(-bufferJogos);

    // Agrupa jogos que pertencem ao mesmo (data + hora + quadrante)
    const grupos = [];
    let atual = null;

    sliced.forEach(m => {
        const qIdx = getQuadranteIndex(m.minuto);
        if (qIdx === -1) return; // minuto fora dos quadrantes conhecidos

        const chave = `${m.data}_${m.hora}_${qIdx}`;

        if (!atual || atual.chave !== chave) {
            atual = { chave, hora: m.hora, qIdx, gols: 0, jogos: 0 };
            grupos.push(atual);
        }

        let ft = [0, 0];
        if (m.ft && m.ft.includes(' x ')) {
            ft = m.ft.split(' x ').map(Number).map(g => isNaN(g) ? 0 : g);
        }
        atual.gols += ft[0] + ft[1];
        atual.jogos += 1;
    });

    const visiveis = grupos.slice(-numQuadrantesExibir);

    const labels = visiveis.map(g => `Q${g.qIdx + 1} ${g.hora.toString().padStart(2, '0')}h`);
    const data = visiveis.map(g => g.gols);
    const jogosPorPonto = visiveis.map(g => g.jogos);
    const quadrantesInfo = visiveis.map(g => ({ 
        quadrante: g.qIdx + 1,
        hora: g.hora.toString().padStart(2, '0')
    }));

    return { data, labels, jogosPorPonto, quadrantesInfo };
}

/* ── CORES DOS PONTOS COM BASE NO LIMIAR DE MÉDIA ── */
function calcularCoresPontosQD(data) {
    return data.map(v => v >= limiarMediaQD ? COR_VERDE_QD : COR_VERMELHO_QD);
}

/* ── CALCULAR MIN/MAX DINÂMICO DO EIXO Y ── */
function calcularYAxisBounds(data) {
    if (!data || data.length === 0) {
        return { min: 0, max: 10 };
    }

    const values = data.filter(v => v !== null && v !== undefined && isFinite(v));
    if (values.length === 0) {
        return { min: 0, max: 10 };
    }

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const padding = (maxVal - minVal) * 0.1;

    return {
        min: Math.max(0, Math.floor(minVal - padding)),
        max: Math.ceil(maxVal + padding)
    };
}

/* ── PLUGIN FIBONACCI ── */
const fibonacciPluginQD = {
    id: 'fibonacciQD',
    afterDraw(chart) {
        if (!showFibonacciQD) return;
        const ctx = chart.ctx, yAxis = chart.scales.y;
        if (!yAxis) return;

        const fibLevels = [0, 23.6, 38.2, 50, 61.8, 100];
        const { left, right } = chart.chartArea, range = yAxis.max - yAxis.min;

        ctx.save();
        fibLevels.forEach((lvl, i) => {
            const y = yAxis.getPixelForValue(yAxis.min + (lvl / 100) * range);
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(0, 255, 0, 0.85)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${fibLevels[i]}%`, right + 52, y - (i === 0 ? -8 : 0));
        });
        ctx.restore();
    }
};

/* ── PLUGIN LINHA ATUAL ── */
const linhaAtualPluginQD = {
    id: 'linhaAtualQD',
    afterDraw(chart) {
        if (!showLinhaAtualQD) return;
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.y) return;

        const { left, right, top, bottom } = chartArea, padX = 5, BAD_H = 18;
        const entries = [];

        chart.data.datasets.forEach((d, i) => {
            if (!d.label || !chart.isDatasetVisible(i)) return;
            const arr = d.data;
            if (!arr || !arr.length) return;

            let yVal = null, yIdx = -1;
            for (let j = arr.length - 1; j >= 0; j--) {
                if (arr[j] !== null && arr[j] !== undefined && isFinite(arr[j])) {
                    yVal = arr[j]; yIdx = j;
                    break;
                }
            }
            if (yVal === null) return;

            const yPx = scales.y.getPixelForValue(yVal);
            if (!isFinite(yPx) || yPx < top || yPx > bottom) return;

            const color = (d.pointBackgroundColor && d.pointBackgroundColor[yIdx]) || d.borderColor || '#fff';
            entries.push({ yVal, yPx, label: d.label, color });
        });

        if (!entries.length) return;
        entries.sort((a, b) => a.yPx - b.yPx);

        for (let i = 1; i < entries.length; i++) {
            const prev = entries[i - 1], curr = entries[i];
            curr.badgeY = (curr.yPx - (prev.badgeY ?? prev.yPx) < BAD_H + 2)
                ? (prev.badgeY ?? prev.yPx) + BAD_H + 2 : curr.yPx;
            if (i === 1) prev.badgeY = prev.badgeY ?? prev.yPx;
        }
        if (entries.length === 1) entries[0].badgeY = entries[0].yPx;

        entries.forEach(({ yVal, yPx, badgeY, label, color }) => {
            ctx.save();
            ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(left, yPx); ctx.lineTo(right, yPx); ctx.stroke(); ctx.setLineDash([]);

            const text = `${Math.round(yVal)} gols`;
            ctx.font = 'bold 10px Arial,sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
            const bw = Math.ceil(ctx.measureText(text).width) + padX * 2;
            const bx = right + 4, by = badgeY - BAD_H / 2;

            ctx.fillStyle = 'rgba(10,12,20,0.95)'; ctx.strokeStyle = color; ctx.lineWidth = 1.2;
            ctx.fillRect(bx, by, bw, BAD_H); ctx.strokeRect(bx, by, bw, BAD_H);

            ctx.fillStyle = color;
            ctx.fillText(text, bx + padX, badgeY);
            ctx.restore();
        });
    }
};

/* ── CRIAR GRÁFICO ── */
function createChartQD() {
    const canvas = document.getElementById('CanvasQuadrantes');
    if (!canvas) return;

    const processado = processQuadrantesData(chartDataQD);
    const { data, labels, jogosPorPonto, quadrantesInfo } = processado;
    jogosPorPontoQD = jogosPorPonto;
    quadrantesInfoQD = quadrantesInfo;

    const cores = calcularCoresPontosQD(data);
    const yBounds = calcularYAxisBounds(data);

    const dataset = {
        label: 'Gols por Quadrante',
        data: data,
        borderColor: COR_LINHA_QD,
        backgroundColor: COR_LINHA_QD,
        pointBackgroundColor: cores,
        pointBorderColor: 'rgba(0,0,0,0.4)',
        pointBorderWidth: 1,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false
    };

    if (chartInstanceQD) {
        chartInstanceQD.destroy();
    }

    const ctx = canvas.getContext('2d');
    chartInstanceQD = new Chart(ctx, {
        type: 'line',
        data: { labels: labels, datasets: [dataset] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            layout: { padding: { top: 30, right: 80 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    titleColor: '#4D96FF',
                    bodyColor: '#e0e0e0',
                    borderColor: '#4D96FF',
                    borderWidth: 1.5,
                    padding: 12,
                    callbacks: {
                        title: items => {
                            const idx = items[0]?.dataIndex;
                            if (idx === undefined || idx === null) return '';
                            const info = quadrantesInfoQD[idx];
                            return info ? `Q${info.quadrante} HORA ${info.hora}` : '';
                        },
                        label: ctx => `Gols: ${ctx.parsed.y}`,
                        afterLabel: items => {
                            const idx = items[0]?.dataIndex;
                            if (idx === undefined || idx === null) return '';
                            const j = jogosPorPontoQD[idx];
                            const acima = items[0].parsed.y >= limiarMediaQD;
                            return [
                                j !== undefined ? `${j}/${jogosPorQuadranteQD} jogos` : '',
                                `${acima ? '▲' : '▼'} ${limiarMediaQD}`
                            ].filter(Boolean).join(' | ');
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { display: false }, grid: { display: false } },
                y: {
                    min: yBounds.min,
                    max: yBounds.max,
                    beginAtZero: false,
                    ticks: { color: '#b0b0b0', stepSize: Math.max(1, Math.floor((yBounds.max - yBounds.min) / 6)), precision: 0 },
                    grid: { color: 'rgba(255,255,255,0.3)', lineWidth: 0.5 }
                }
            }
        },
        plugins: [fibonacciPluginQD, linhaAtualPluginQD]
    });
}

/* ── FETCH E UPDATE ── */
async function updateChartQD() {
    try {
        // Tenta usar ROTAS_API se existir
        if (typeof ROTAS_API !== 'undefined' && typeof LIGA_ATUAL !== 'undefined') {
            chartDataQD = await LigaDataManager.getResultados();
        }
        
        // Detecta automaticamente os quadrantes da liga atual
        QUADRANTES_MINUTOS = detectarQuadrantesAutomatico(chartDataQD);
        
        createChartQD();
    } catch (e) {
        console.error('Erro ao buscar dados:', e);
        chartDataQD = [];
        createChartQD();
    }
}

/* ── EVENT LISTENERS ── */
document.addEventListener('DOMContentLoaded', () => {
    // Acordeão
    const btnAccordion = document.getElementById('btnAccordionQD');
    const contentAccordion = document.getElementById('accordeonQD');

    if (btnAccordion && contentAccordion) {
        const accordionOpen = _lsAccordionQD();
        if (!accordionOpen) {
            contentAccordion.style.display = 'none';
        }

        btnAccordion.addEventListener('click', function() {
            const isOpen = contentAccordion.style.display !== 'none';
            contentAccordion.style.display = isOpen ? 'none' : 'block';
            _saveAccordionQD(!isOpen);
        });
    }

    // Restaura configurações salvas
    numQuadrantesQD     = _lsGetNum(QD_NUM_QUADRANTES_KEY, 16);
    jogosPorQuadranteQD = _lsGetNum(QD_JOGOS_QUADRANTE_KEY, 5);
    limiarMediaQD       = _lsGetNum(QD_LIMIAR_MEDIA_KEY, 12);

    const inputQuadrantes = document.getElementById('numQuadrantesInputQD');
    const inputJogos      = document.getElementById('jogosPorQuadranteInputQD');
    const inputLimiar     = document.getElementById('limiarMediaInputQD');
    const displayQuadrantes = document.getElementById('displayQuadrantesQD');
    const displayJogos = document.getElementById('displayJogosQD');
    const displayLimiar = document.getElementById('displayLimiarQD');

    if (inputQuadrantes) inputQuadrantes.value = numQuadrantesQD;
    if (inputJogos)      inputJogos.value      = jogosPorQuadranteQD;
    if (inputLimiar)     inputLimiar.value     = limiarMediaQD;
    if (displayQuadrantes) displayQuadrantes.textContent = numQuadrantesQD;
    if (displayJogos) displayJogos.textContent = jogosPorQuadranteQD;
    if (displayLimiar) displayLimiar.textContent = limiarMediaQD.toFixed(1);

    inputQuadrantes?.addEventListener('input', e => {
        const v = Math.max(1, Math.min(300, parseInt(e.target.value, 10) || 16));
        numQuadrantesQD = v;
        e.target.value = v;
        if (displayQuadrantes) displayQuadrantes.textContent = v;
        _lsSetNum(QD_NUM_QUADRANTES_KEY, v);
        updateChartQD();
    });

    inputJogos?.addEventListener('input', e => {
        const v = Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 5));
        jogosPorQuadranteQD = v;
        e.target.value = v;
        if (displayJogos) displayJogos.textContent = v;
        _lsSetNum(QD_JOGOS_QUADRANTE_KEY, v);
        updateChartQD();
    });

    inputLimiar?.addEventListener('input', e => {
        const v = Math.max(0, parseFloat(e.target.value));
        limiarMediaQD = isNaN(v) ? 12 : v;
        e.target.value = limiarMediaQD;
        if (displayLimiar) displayLimiar.textContent = limiarMediaQD.toFixed(1);
        _lsSetNum(QD_LIMIAR_MEDIA_KEY, limiarMediaQD);
        // limiar não muda o agrupamento, só recolore os pontos já calculados
        if (chartInstanceQD) {
            const cores = calcularCoresPontosQD(chartInstanceQD.data.datasets[0].data);
            chartInstanceQD.data.datasets[0].pointBackgroundColor = cores;
            chartInstanceQD.update();
        }
    });

    // Checkboxes
    document.getElementById('fibonacciToggleQD')?.addEventListener('change', function() {
        showFibonacciQD = this.checked;
        if (chartInstanceQD) chartInstanceQD.update();
    });

    document.getElementById('linhaAtualToggleQD')?.addEventListener('change', function() {
        showLinhaAtualQD = this.checked;
        if (chartInstanceQD) chartInstanceQD.update();
    });

    // Inicializa
    updateChartQD();
    sincronizarIntervalo(updateChartQD, 10000);
});


/* ──────────────────────────────────────────────────────────────────
   [2] Comparador / Filtros (cfr_)
   ────────────────────────────────────────────────────────────────── */

(function () {

  const UID = "cfr_";

  

  


  const HOURS_OPTIONS = [
    { label:"6h",  games:120  },
    { label:"12h", games:240  },
    { label:"24h", games:480  },
    { label:"48h", games:960  },
  ];

  let isComparisonMode   = false;
  let autoUpdateInterval = null;
  let lastGamesKey       = "";
  let currentOddsData    = null;
  let currentResultados  = [];
  let currentTeamA       = null;
  let currentTeamB       = null;
  let currentGameTime    = null;
  let hoursWrap          = null;

  /* ─── Persistência localStorage ─── */
  const STORE_KEY = UID + "prefs";
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch(e) { return {}; }
  }
  function savePrefs(obj) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...loadPrefs(), ...obj })); } catch(e) {}
  }
  const _prefs = loadPrefs();

  let nGamesAtual = _prefs.nGames || 240;

  let modoTimeA = _prefs.modoA || "ambos"; 
  let modoTimeB = _prefs.modoB || "ambos";

  /* ─── filterByCount ─── */
  function filterByCount(games, n) {
    if (!games.length) return games;
    return [...games].reverse().slice(0, n);
  }

  function calcStats(matches, teamName, modo) {
    modo = modo || "ambos";
    let w=0,d=0,l=0,gf=0,ga=0,cs=0,fts=0,forma=[];
    matches.forEach(m => {
      const isHome = m.time_a === teamName;
      const isAway = m.time_b === teamName;
      if (!isHome && !isAway) return;
      if (modo === "casa" && !isHome) return;
      if (modo === "fora" && !isAway) return;
      if (!m.ft || !m.ft.includes(" x ")) return;
      const [a,b] = m.ft.split(" x ").map(Number);
      if (isNaN(a) || isNaN(b)) return;
      const scored   = isHome ? a : b;
      const conceded = isHome ? b : a;
      gf += scored; ga += conceded;
      if (conceded === 0) cs++;
      if (scored === 0)   fts++;
      const r = scored > conceded ? "V" : scored < conceded ? "D" : "E";
      if (r === "V") w++;
      else if (r === "D") l++;
      else d++;

      if (forma.length < 5) forma.push(r);
    });
    const total = w + d + l;
    return {
      w, d, l, gf, ga, cs, fts,
      forma,   
      total,
      idxOf: total ? ((gf+ga)/total).toFixed(2) : "0.00"
    };
  }

  function calcH2H(matches, teamA, teamB) {
    const c = matches.filter(m =>
      (m.time_a===teamA&&m.time_b===teamB)||(m.time_a===teamB&&m.time_b===teamA)
    );
    let wA=0,wB=0,dr=0,ambasSim=0,o15=0,o25=0,o35=0,o5=0,totG=0,casa=0,fora=0;
    c.forEach(m => {
      if (!m.ft||!m.ft.includes(" x ")) return;
      const [a,b]=m.ft.split(" x ").map(Number), tot=a+b;
      totG+=tot;
      if (a>b)      { casa++; m.time_a===teamA?wA++:wB++; }
      else if (a<b) { fora++; m.time_a===teamA?wB++:wA++; }
      else          { dr++; }
      if (a>0&&b>0) ambasSim++;
      if (tot>1.5) o15++;
      if (tot>2.5) o25++;
      if (tot>3.5) o35++;
      if (tot>=5)  o5++;
    });
    const n=c.length||1;
    return {
      wA,wB,dr,
      ambasSim, ambasNao:c.length-ambasSim,
      o15,u15:c.length-o15,
      o25,u25:c.length-o25,
      o35,u35:c.length-o35,
      o5, u5: c.length-o5,
      mediaGols:(totG/n).toFixed(2),
      total:c.length, casa, fora
    };
  }

  function pct(a,t){ return t?Math.round((a/t)*100):0; }

  function chip(a,b,la,lb){
    const hiA=a>=b;
    return `<span class="${UID}chip ${hiA?UID+"chi":UID+"clo"}">${la} ${a}</span>
            <span class="${UID}chip ${!hiA?UID+"chi":UID+"clo"}">${lb} ${b}</span>`;
  }


  function renderTeam(title, matches, teamName, modoInicial, modoKey) {
    const modos = [
      {val:"ambos", lbl:"Casa/Fora"},
      {val:"casa",  lbl:"🏠 Casa"},
      {val:"fora",  lbl:"✈ Fora"}
    ];

    function buildHTML(modo) {
      const s   = calcStats(filterByCount(matches, nGamesAtual), teamName, modo);
      const apr = s.total?((s.w/s.total)*100).toFixed(1):"0.0";
      const mx  = Math.max(s.w,s.d,s.l)||1;
      const formaHTML = s.forma.map(r=>`<span class="${UID}fp ${UID}f${r}">${r}</span>`).join("");
      const modoLabel = modo==="casa"?"🏠 Casa":modo==="fora"?"✈ Fora":"Casa/Fora";

      const tabsHTML = modos.map(m=>
        `<button class="${UID}mtab${m.val===modo?" "+UID+"mton":""}"
           data-modo="${m.val}" data-modokey="${modoKey}">${m.lbl}</button>`
      ).join("");

      return `
      <div class="${UID}ctitle">${title}</div>
      <div class="${UID}modotabs">${tabsHTML}</div>
      <div class="${UID}apr">${apr}%</div>
      <div class="${UID}aprlbl">aproveitamento · ${s.total} jogos (${modoLabel})</div>
      <div class="${UID}prow">
        <span class="${UID}plbl" style="color:#22c55e">V</span>
        <div class="${UID}ptrack"><div class="${UID}pfill" style="width:${pct(s.w,mx)}%;background:#22c55e"></div></div>
        <span class="${UID}pval">${s.w}</span>
      </div>
      <div class="${UID}prow">
        <span class="${UID}plbl" style="color:#f59e0b">E</span>
        <div class="${UID}ptrack"><div class="${UID}pfill" style="width:${pct(s.d,mx)}%;background:#f59e0b"></div></div>
        <span class="${UID}pval">${s.d}</span>
      </div>
      <div class="${UID}prow">
        <span class="${UID}plbl" style="color:#ef4444">D</span>
        <div class="${UID}ptrack"><div class="${UID}pfill" style="width:${pct(s.l,mx)}%;background:#ef4444"></div></div>
        <span class="${UID}pval">${s.l}</span>
      </div>
      <div class="${UID}mgrid">
        <div class="${UID}ms"><div class="${UID}msl">Gols Pró</div><div class="${UID}msv">${s.gf}</div></div>
        <div class="${UID}ms"><div class="${UID}msl">Gols Sofridos</div><div class="${UID}msv">${s.ga}</div></div>
        <div class="${UID}ms"><div class="${UID}msl">Clean Sheets</div><div class="${UID}msv">${s.cs}</div></div>
        <div class="${UID}ms"><div class="${UID}msl">Sem Marcar</div><div class="${UID}msv">${s.fts}</div></div>
        <div class="${UID}ms" style="grid-column:1/-1">
          <div class="${UID}msl">Índice Ofensivo</div>
          <div class="${UID}msv" style="color:#a78bfa">${s.idxOf}</div>
        </div>
      </div>
      <div class="${UID}forma">${formaHTML}</div>`;
    }

    const cardId = UID+"card_"+modoKey;
    const html = `<div class="${UID}card" id="${cardId}">${buildHTML(modoInicial)}</div>`;


    setTimeout(()=>{
      const card = document.getElementById(cardId);
      if (!card) return;
      card.addEventListener("click", e=>{
        const btn = e.target.closest(`.${UID}mtab`);
        if (!btn) return;
        const novoModo = btn.dataset.modo;
        const key      = btn.dataset.modokey;
        if (key==="A") { modoTimeA=novoModo; savePrefs({modoA:novoModo}); }
        else           { modoTimeB=novoModo; savePrefs({modoB:novoModo}); }
        card.innerHTML = buildHTML(novoModo);

        const analiseEl = document.getElementById(UID+"analise_block");
        if (analiseEl && currentTeamA) {
          analiseEl.outerHTML = renderAnalise(
            currentResultados, currentTeamA, currentTeamB,
            currentOddsData, currentGameTime
          );
        }
      });
    }, 0);

    return html;
  }

  function renderH2H(matches, teamA, teamB) {
    const h = calcH2H(filterByCount(matches, nGamesAtual), teamA, teamB);
    return `
    <div class="${UID}card">
      <div class="${UID}ctitle">H2H · ${h.total} jogos</div>
      <div class="${UID}triolbls">
        <div class="${UID}tlbl"><b>${h.wA}</b> ${teamA}</div>
        <div class="${UID}tlbl" style="text-align:center"><b>${h.dr}</b> Emp.</div>
        <div class="${UID}tlbl" style="text-align:right"><b>${h.wB}</b> ${teamB}</div>
      </div>
      <div class="${UID}triobar">
        <div class="${UID}tseg" style="flex:${h.wA||.1};background:#3b82f6"></div>
        <div class="${UID}tseg" style="flex:${h.dr||.1};background:#f59e0b"></div>
        <div class="${UID}tseg" style="flex:${h.wB||.1};background:#ef4444"></div>
      </div>
      <div class="${UID}avg">
        <div class="${UID}avgn">${h.mediaGols}</div>
        <div class="${UID}avgl">média de gols/jogo</div>
      </div>
      <div class="${UID}div"></div>
      <div class="${UID}mrow"><span class="${UID}mlbl">Ambas marcam</span>
        <div class="${UID}mchips">${chip(h.ambasSim,h.ambasNao,"Sim","Não")}</div></div>
      <div class="${UID}mrow"><span class="${UID}mlbl">Over / Under 1.5</span>
        <div class="${UID}mchips">${chip(h.o15,h.u15,"O","U")}</div></div>
      <div class="${UID}mrow"><span class="${UID}mlbl">Over / Under 2.5</span>
        <div class="${UID}mchips">${chip(h.o25,h.u25,"O","U")}</div></div>
      <div class="${UID}mrow"><span class="${UID}mlbl">Over / Under 3.5</span>
        <div class="${UID}mchips">${chip(h.o35,h.u35,"O","U")}</div></div>
      <div class="${UID}mrow"><span class="${UID}mlbl">Over 5+</span>
        <div class="${UID}mchips">${chip(h.o5,h.u5,"O","U")}</div></div>
      <div class="${UID}div"></div>
      <div class="${UID}mrow"><span class="${UID}mlbl">Casa vence</span>
        <div class="${UID}mchips"><span class="${UID}chip ${h.casa>=h.fora?UID+"chi":UID+"clo"}">${h.casa}</span></div></div>
      <div class="${UID}mrow"><span class="${UID}mlbl">Fora vence</span>
        <div class="${UID}mchips"><span class="${UID}chip ${h.fora>h.casa?UID+"chi":UID+"clo"}">${h.fora}</span></div></div>
    </div>`;
  }


  function renderAnalise(results, teamA, teamB, odds, gameTime) {
    const filt = filterByCount(results, nGamesAtual);


    const sA_geral = calcStats(filt, teamA, "ambos");
    const sB_geral = calcStats(filt, teamB, "ambos");
    const sA_ctx   = calcStats(filt, teamA, modoTimeA); 
    const sB_ctx   = calcStats(filt, teamB, modoTimeB); 
    const h        = calcH2H(filt, teamA, teamB);


    const avgGFA = sA_ctx.total?(sA_ctx.gf/sA_ctx.total):0;
    const avgGAA = sA_ctx.total?(sA_ctx.ga/sA_ctx.total):0;
    const avgGFB = sB_ctx.total?(sB_ctx.gf/sB_ctx.total):0;
    const avgGAB = sB_ctx.total?(sB_ctx.ga/sB_ctx.total):0;
    const xgA   = ((avgGFA+avgGAB)/2).toFixed(2);
    const xgB   = ((avgGFB+avgGAA)/2).toFixed(2);
    const xgTot = (parseFloat(xgA)+parseFloat(xgB)).toFixed(2);

    const idxA = parseFloat(sA_geral.idxOf);
    const idxB = parseFloat(sB_geral.idxOf);
    const aprA = sA_geral.total?((sA_geral.w/sA_geral.total)*100):0;
    const aprB = sB_geral.total?((sB_geral.w/sB_geral.total)*100):0;


    const h2h_total = h.total || 1;
    const pctCasaH2H   = (h.wA / h2h_total) * 100;
    const pctEmpH2H    = (h.dr / h2h_total) * 100;
    const pctForaH2H   = (h.wB / h2h_total) * 100;


    const rawCasa = aprA * 0.6 + pctCasaH2H * 0.4;
    const rawEmp  = ((100-aprA-aprA*0.3) + (100-aprB-aprB*0.3)) / 2 * 0.4 + pctEmpH2H * 0.6;
    const rawFora = aprB * 0.6 + pctForaH2H * 0.4;
    const rawSum  = rawCasa + rawEmp + rawFora || 1;
    const pCasa = Math.round((rawCasa/rawSum)*100);
    const pEmp  = Math.round((rawEmp /rawSum)*100);
    const pFora = Math.round((rawFora/rawSum)*100);


    const n_h2h = h.total || 1;
    const pO15 = Math.round((h.o15/n_h2h)*100);
    const pU15 = 100 - pO15;
    const pO25 = Math.round((h.o25/n_h2h)*100);
    const pU25 = 100 - pO25;
    const pO35 = Math.round((h.o35/n_h2h)*100);
    const pU35 = 100 - pO35;
    const pO5  = Math.round((h.o5 /n_h2h)*100);


    const pctH2HAmb  = h.total?((h.ambasSim/h.total)*100):0;
    const pctAMarca  = sA_geral.total?(((sA_geral.total-sA_geral.fts)/sA_geral.total)*100):0;
    const pctBMarca  = sB_geral.total?(((sB_geral.total-sB_geral.fts)/sB_geral.total)*100):0;
    const pAmbasSim  = Math.round((pctH2HAmb + pctAMarca + pctBMarca) / 3);
    const pAmbasNao  = 100 - pAmbasSim;
    const pCombo_Amb_O25 = Math.round((pAmbasSim/100)*(pO25/100)*100);
    const pCombo_Amb_O35 = Math.round((pAmbasSim/100)*(pO35/100)*100);
    const pCombo_Casa_U35 = Math.round((pCasa/100)*(pU35/100)*100);

    function perfil(idx, apr){
      if (idx>=3.5)           return "explosivo";
      if (idx>=2.5&&apr>=55)  return "forte";
      if (idx<1.8&&apr<=40)   return "fraco";
      if (idx<1.8)            return "travado";
      return "medio";
    }
    const pA=perfil(idxA,aprA), pB=perfil(idxB,aprB); // eslint-disable-line no-unused-vars

    let favTxt="";
    if (odds){
      const oc=parseFloat(odds.odds_casa_vence||99);
      const of=parseFloat(odds.odds_visitante_vence||99);
      const oe=parseFloat(odds.odds_empate||99);
      if      (oc<of&&oc<oe) favTxt=`📊 Favoritismo da <strong>casa</strong> (@${oc.toFixed(2)})`;
      else if (of<oc&&of<oe) favTxt=`📊 Leve favoritismo <strong>visitante</strong> (@${of.toFixed(2)})`;
      else                   favTxt=`📊 Confronto <strong>equilibrado</strong>`;
    }

    /* ── Helpers de cor por probabilidade ── */
    function clsSug(p){ return p>=60?"sug-hi":p>=40?"sug-med":"sug-lo"; }
    function clsPct(p){ return p>=60?"sugpct-hi":p>=40?"sugpct-med":"sugpct-lo"; }

    function sugItem(lbl, p){
      return `<div class="${UID}sugitem ${UID}${clsSug(p)}">
        <span class="${UID}suglbl">${lbl}</span>
        <span class="${UID}sugpct ${UID}${clsPct(p)}">${p}%</span>
      </div>`;
    }

    function comboItem(lbl, p){
      return `<div class="${UID}sugcombo">
        <span class="${UID}sugcombolbl">⚡ ${lbl}</span>
        <span class="${UID}sugcombopct">${p}%</span>
      </div>`;
    }

    return `
    <div class="${UID}analise" id="${UID}analise_block">

      <!-- Topo: título + nome + horário + odds + favoritismo -->
      <div class="${UID}atoprow">
        <div>
          <div class="${UID}atitle">👉 Leitura do Confronto</div>
          <div class="${UID}aheader">${teamA} x ${teamB}</div>
          ${gameTime?`<div class="${UID}atime">${gameTime}</div>`:""}
        </div>
        ${odds?`
        <div class="${UID}aodds">
          <div class="${UID}aodd"><span class="${UID}aol">Casa</span><span class="${UID}aov">${parseFloat(odds.odds_casa_vence||99).toFixed(2)}</span></div>
          <div class="${UID}aodd"><span class="${UID}aol">Empate</span><span class="${UID}aov">${parseFloat(odds.odds_empate||99).toFixed(2)}</span></div>
          <div class="${UID}aodd"><span class="${UID}aol">Fora</span><span class="${UID}aov">${parseFloat(odds.odds_visitante_vence||99).toFixed(2)}</span></div>
        </div>
        <span class="${UID}afav">${favTxt}</span>
        `:""}
      </div>

      <!-- Previsão de Mercado -->
      <div class="${UID}sugtitle">📈 Previsão de Mercado</div>
      <div class="${UID}sugrid">
        ${sugItem("🏠 Casa vence ("+teamA+")", pCasa)}
        ${sugItem("🤝 Empate", pEmp)}
        ${sugItem("✈ Fora vence ("+teamB+")", pFora)}
        <div style="grid-column:1/-1;height:1px;background:rgba(255,255,255,.06);margin:2px 0;"></div>
        ${sugItem("Over 1.5", pO15)}
        ${sugItem("Under 1.5", pU15)}
        ${sugItem("Over 2.5", pO25)}
        ${sugItem("Under 2.5", pU25)}
        ${sugItem("Over 3.5", pO35)}
        ${sugItem("Under 3.5", pU35)}
        ${sugItem("Over 5+", pO5)}
        <div style="grid-column:1/-1;height:1px;background:rgba(255,255,255,.06);margin:2px 0;"></div>
        ${sugItem("Ambas marcam (Sim)", pAmbasSim)}
        ${sugItem("Ambas marcam (Não)", pAmbasNao)}
        ${pCombo_Amb_O25>=35?comboItem("Ambas Sim + Over 2.5", pCombo_Amb_O25):""}
        ${pCombo_Amb_O35>=25?comboItem("Ambas Sim + Over 3.5", pCombo_Amb_O35):""}
        ${pCombo_Casa_U35>=35?comboItem(teamA+" vence + Under 3.5", pCombo_Casa_U35):""}
      </div>

    </div>`;
  }

  function renderPanel(results, teamA, teamB, odds, gameTime) {
    document.getElementById("mainContainer").innerHTML = `
      <div class="${UID}panel">
        ${renderTeam(teamA+" — geral", results, teamA, modoTimeA, "A")}
        ${renderH2H(results, teamA, teamB)}
        ${renderTeam(teamB+" — geral", results, teamB, modoTimeB, "B")}
        ${renderAnalise(results, teamA, teamB, odds, gameTime)}
      </div>`;
  }

  function buildHoursBar() {
    const bar=document.createElement("div");
    bar.className=UID+"topbar";
    const lbl=document.createElement("span");
    lbl.className=UID+"hlbl";
    lbl.textContent="Período:";
    bar.appendChild(lbl);
    const wrap=document.createElement("div");
    wrap.style.cssText="display:inline-flex;gap:4px;flex-wrap:wrap;";
    hoursWrap=wrap;
    HOURS_OPTIONS.forEach(({label,games},i)=>{
      const btn=document.createElement("button");
      btn.textContent=label;
      btn.dataset.games=games;
      btn.className=UID+"hbtn";
      if(games===nGamesAtual) btn.classList.add(UID+"hon");
      else if(nGamesAtual===240&&i===1&&!HOURS_OPTIONS.some(o=>o.games===nGamesAtual)) btn.classList.add(UID+"hon");
      btn.addEventListener("click",()=>{
        wrap.querySelectorAll("button").forEach(b=>b.classList.remove(UID+"hon"));
        btn.classList.add(UID+"hon");
        nGamesAtual=games;
        savePrefs({nGames:games});
        if(isComparisonMode&&currentTeamA&&currentResultados.length)
          renderPanel(currentResultados,currentTeamA,currentTeamB,currentOddsData,currentGameTime);
      });
      wrap.appendChild(btn);
    });
    bar.appendChild(wrap);
    return bar;
  }

  async function loadNextGames() {
    try {
      const games=await LigaDataManager.getProximosJogos();
      const slice=games.slice(0,6);
      const newKey=JSON.stringify(slice.map(g=>g.match_id||(g.team_home+g.team_visit+g.time)));
      if(newKey===lastGamesKey) return;
      lastGamesKey=newKey;
      const container=document.getElementById("nextGamesContainer");
      const selHome  =container.querySelector(`.${UID}gc.${UID}sel`)?.dataset.home ||null;
      const selVisit =container.querySelector(`.${UID}gc.${UID}sel`)?.dataset.visit||null;
      container.innerHTML=`<div class="${UID}games">`+
        slice.map(g=>{
          const sel=g.team_home===selHome&&g.team_visit===selVisit;
          return `<div class="${UID}gc${sel?" "+UID+"sel":""}"
                    data-home="${g.team_home}" data-visit="${g.team_visit}" data-time="${g.time||""}">
            <div class="${UID}gtime">${g.time||""}</div>
            <div class="${UID}gteams">
              <span>${g.team_home}</span><span class="${UID}vs">vs</span><span>${g.team_visit}</span>
            </div>
          </div>`;
        }).join("")+`</div>`;
      container.addEventListener("click",e=>{
        const card=e.target.closest(`.${UID}gc`);
        if(!card) return;
        container.querySelectorAll(`.${UID}gc`).forEach(c=>c.classList.remove(UID+"sel"));
        card.classList.add(UID+"sel");
        modoTimeA="ambos"; modoTimeB="ambos";
        obterResultados(card.dataset.home,card.dataset.visit,card.dataset.time);
      });
    } catch(err){ console.error("Erro próximos jogos:",err); }
  }

  async function obterResultados(teamA, teamB, gameTime) {
    try {
      const [resR,oddsR]=await Promise.allSettled([
        LigaDataManager.getResultados(),
        LigaDataManager.getOdds()
      ]);
      const results=resR.status==="fulfilled"?resR.value:[];
      let oddsData=null;
      if(oddsR.status==="fulfilled"){
        const arr=oddsR.value;
        oddsData=arr.find(o=>
          (o.time_casa===teamA&&o.time_visitante===teamB)||
          (o.time_casa===teamB&&o.time_visitante===teamA)
        )||null;
      }
      currentResultados=results; currentTeamA=teamA; currentTeamB=teamB;
      currentOddsData=oddsData;  currentGameTime=gameTime;
      renderPanel(results,teamA,teamB,oddsData,gameTime);
      isComparisonMode=true;
      pararIntervaloSincronizado(autoUpdateInterval);
    } catch(err){ console.error("Erro resultados:",err); }
  }

  async function fetchAndUpdateResults() {
    if(isComparisonMode) return;
    try {
      const newResults=await LigaDataManager.getResultados();
      if(JSON.stringify(newResults)!==JSON.stringify(currentResultados)){
        currentResultados=newResults;
        const sorted=[...newResults].sort((a,b)=>{
          const da=new Date(a.data),db=new Date(b.data);
          return db-da||b.hora-a.hora||b.minuto-a.minuto;
        });
        const latest=sorted[0];
        renderPanel(sorted,latest.time_a,latest.time_b,null,null);
      }
    } catch(err){ console.error("Erro auto-update:",err); }
  }

  async function updateAll(){
    await loadNextGames();
    await fetchAndUpdateResults();
  }

  (function init(){
    const ng=document.getElementById("nextGamesContainer");
    if(ng){ ng.parentNode.insertBefore(buildHoursBar(),ng); }
    updateAll();
    autoUpdateInterval=sincronizarIntervalo(updateAll,10000);
  })();

})();


/* ──────────────────────────────────────────────────────────────────
   [3] Máximas Futebol Virtual (mfv) + acordeões
   ────────────────────────────────────────────────────────────────── */

    // ─────────────────────────────────────────────
//  STYLES — scoped to .mfv (maximasfutebolvirtual)
//  Obs: NÃO mexe em .accordion-* (isso é de outro lugar).
//  Aqui só existem classes das tabelas de máximas.
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────
function updateTimestamp(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── ÚNICA função de acordeão da página ─────────────────────────────────────
// Antes existiam DUAS: esta (que usa style.display) e outra dentro de um IIFE
// mais abaixo (que só alternava a classe 'active') e sobrescrevia esta via
// window.toggleAccordion. Resultado: "Ver Máximas" (display:none inline) e o
// "Modo Trader" (display inline restaurado do localStorage) nunca abriam,
// porque o estilo inline vence a classe. Agora esta função trata os dois casos.
function toggleAccordion(button) {
    const content = button.nextElementSibling;
    if (!content) return;

    // Acordeão com estilo inline (Máximas / Trader): o estado vem do inline.
    // Acordeão só de classe: o estado vem da classe 'active'.
    const temInline = content.style.display !== '';
    const wasOpen = temInline
        ? content.style.display !== 'none'
        : content.classList.contains('active');
    const isOpen = wasOpen;

    content.classList.toggle('active', !isOpen);
    button.classList.toggle('active', !isOpen);
    if (temInline) content.style.display = isOpen ? 'none' : 'block';

    const title = button.getAttribute('data-title');
    const icons = button.querySelectorAll('.accordion-icon');
    icons.forEach(icon => { icon.textContent = isOpen ? '▼' : '▲'; });

    if (button.classList.contains('tabelas-maximas-button')) {
        button.innerHTML = `<span class="accordion-icon">${icons[0].textContent}</span> ${title} <span class="accordion-icon">${icons[1].textContent}</span>`;
    }
}

// ─────────────────────────────────────────────
//  ORDENAÇÃO CRONOLÓGICA — roda ANTES de qualquer cálculo
// ─────────────────────────────────────────────
// Algumas ligas retornam a rota com o jogo mais recente em data[0],
// outras retornam com o mais recente em data[data.length - 1]. Além
// disso, o Bet365 passou por uma unificação de duas fontes de captura
// distintas (bet365_unificado.js), então não dá pra confiar só nas
// DUAS PONTAS do array pra decidir "inverte ou não" — pode ter
// desordem no MEIO do array também. Por isso, em vez de checar
// pontas, o array inteiro é reordenado por data+hora+minuto reais.
//
// Todo o resto do código (slice, contagem de sequências etc.) assume
// que o ÚLTIMO item do array é sempre o jogo mais recente.
//
// Schema real da rota (igual pra todas as ligas):
// { id, liga, event_id, data, hora, minuto, time_a, time_b, ft, ht }
//
// IMPORTANTE: "data"+"hora"+"minuto" já são internamente consistentes
// entre si SEM precisar de nenhuma conversão de fuso — é exatamente
// assim que qdGetHoraAtual() (função já usada em produção nessa
// mesma página pra achar a hora atual do Bet365) monta o timestamp:
// `${data.split("T")[0]}T${hora}:${minuto}:00`, sem offset nenhum.
// "id" NÃO é usado aqui: por causa da unificação de fontes, o
// autoincremento reflete ordem de INSERÇÃO no banco, não
// necessariamente a ordem real dos jogos.
function valorOrdenacao(jogo) {
    if (!jogo || !jogo.data) return null;

    const diaStr = String(jogo.data).includes('T') ? String(jogo.data).split('T')[0] : String(jogo.data);
    const hora = String(Number(jogo.hora) || 0).padStart(2, '0');
    const minuto = String(Number(jogo.minuto) || 0).padStart(2, '0');

    const t = new Date(`${diaStr}T${hora}:${minuto}:00`).getTime();
    return isNaN(t) ? null : t;
}

function normalizarOrdemCronologica(data) {
    if (!Array.isArray(data) || data.length < 2) return data;

    const comChave = data.map((jogo, i) => ({ jogo, i, v: valorOrdenacao(jogo) }));

    if (comChave.some(x => x.v === null)) {
        console.warn('[Máximas] Não foi possível calcular data+hora de algum jogo. Mantendo ordem original da rota.');
        return data;
    }

    // Ordem ascendente (mais antigo -> mais recente); desempate estável
    // pelo índice original quando dois jogos caem no mesmo minuto exato.
    comChave.sort((a, b) => a.v - b.v || a.i - b.i);

    return comChave.map(x => x.jogo);
}

// ─────────────────────────────────────────────
//  DETECÇÃO AUTOMÁTICA DE JOGOS/HORA
// ─────────────────────────────────────────────
// Cada liga roda num ritmo diferente (20 jogos/hora, 30 jogos/hora...).
// Em vez de fixar esse número, agrupamos os jogos (já em ordem
// cronológica, garantida por data+hora+minuto via normalizarOrdemCronologica) pelo
// campo "hora" real (0-23), e contamos quantos jogos caem em cada hora
// cheia. Como o array já está em ordem, não precisa combinar com "dia"
// pra saber se um grupo de mesma hora é o mesmo bloco — e não combinar
// evita descasamento de fuso (ex: Bet365, cujo "hora" vem em horário da
// Inglaterra enquanto "data" reflete o dia em horário do Brasil). A
// média dos grupos "fechados" (ignorando o primeiro e o último, que
// podem estar cortados no meio) é o ritmo real da liga.
function detectarJogosPorHora(data) {
    const FALLBACK = 20;
    if (!Array.isArray(data) || data.length < 10) return FALLBACK;

    const grupos = [];
    let chaveAtual = null;
    let contagemAtual = 0;

    data.forEach(jogo => {
        // Agrupa só pela "hora" (sem combinar com "dia"): o array já vem
        // cronologicamente ordenado por "id" (via normalizarOrdemCronologica),
        // então jogos consecutivos com a mesma hora já são, por definição, o
        // mesmo bloco contínuo. Combinar com "dia" quebrava no Bet365, cujo
        // campo "hora" fica em horário da Inglaterra enquanto "data" reflete
        // o dia de inserção em horário do Brasil — descasando os dois campos
        // bem na janela entre as duas viradas de dia.
        const hora = jogo ? jogo.hora : '?';
        const chave = String(hora);

        if (chave === chaveAtual) {
            contagemAtual++;
        } else {
            if (chaveAtual !== null) grupos.push(contagemAtual);
            chaveAtual = chave;
            contagemAtual = 1;
        }
    });
    if (contagemAtual > 0) grupos.push(contagemAtual);

    if (grupos.length < 3) {
        const soma = grupos.reduce((a, b) => a + b, 0);
        return grupos.length ? Math.max(1, Math.round(soma / grupos.length)) : FALLBACK;
    }

    // descarta o primeiro e o último grupo (podem vir incompletos)
    const gruposCompletos = grupos.slice(1, -1);
    const soma = gruposCompletos.reduce((a, b) => a + b, 0);
    const media = soma / gruposCompletos.length;

    return Math.max(1, Math.round(media));
}

// ─────────────────────────────────────────────
//  JOGOS/HORA — fonte primária: ligas-config.js
// ─────────────────────────────────────────────
// O ligas-config.js já define, por liga, o array fixo "minutos" (os
// minutos exatos em que os jogos acontecem dentro de cada hora). Isso
// é um dado ESTÁTICO e conhecido — não precisa ser detectado em
// runtime, e não depende do campo "hora" (que no Bet365 vem em
// horário da Inglaterra). Usamos LIGAS_INFO[LIGA_ATUAL].minutos.length
// como fonte da verdade; a detecção heurística (detectarJogosPorHora)
// vira só um fallback pra liga que porventura não esteja cadastrada.
function obterJogosPorHora(data) {
    if (typeof LIGA_ATUAL !== 'undefined' && typeof LIGAS_INFO !== 'undefined') {
        const liga = LIGAS_INFO[LIGA_ATUAL];
        if (liga && Array.isArray(liga.minutos) && liga.minutos.length > 0) {
            return liga.minutos.length;
        }
    }
    return detectarJogosPorHora(data);
}


// Valor do seletor = quantidade de HORAS (não de jogos).
// A quantidade real de jogos usada em cada tabela é calculada como
// horasSelecionadas * jogosPorHoraDetectado, recalculado a cada fetch.
let horasSelecionadas = 24;

(function initSeletorPeriodo() {
    const select = document.getElementById('mfv-periodo-select');
    if (!select) return;

    horasSelecionadas = parseInt(select.value, 10) || 24;

    select.addEventListener('change', () => {
        horasSelecionadas = parseInt(select.value, 10) || 24;

        // força recálculo imediato, ignorando o cache de hash
        previousDataHashMaximaplacar = '';
        previousDataHashPlacarRepet = '';

        fetchMaximaplacar();
        fetchMaximamercado();
        fetchPlacarRepet();
        fetchMediahoramercado();
    });
})();

// ─────────────────────────────────────────────
//  TABELA 1 — Máximas de Placares
// ─────────────────────────────────────────────
let previousDataHashMaximaplacar = '';

async function fetchMaximaplacar() {
    try {
        let data = await LigaDataManager.getResultados();
        data = normalizarOrdemCronologica(data);

        const jogosPorHora = obterJogosPorHora(data);
        const totalJogosPeriodo = horasSelecionadas * jogosPorHora;
        const recentData = data.slice(-totalJogosPeriodo);

        const dataHash = JSON.stringify(recentData);
        if (dataHash === previousDataHashMaximaplacar) return;
        previousDataHashMaximaplacar = dataHash;

        const placaresFixos = [
            '2 x 0','2 x 1','0 x 0','0 x 2','1 x 2','0 x 1','1 x 0','1 x 1',
            '2 x 2','3 x 1','4 x 0'
        ];

        const headerRow = document.getElementById('maximaplacar-header');
        if (headerRow.children.length === 0) {
            placaresFixos.forEach(placar => {
                const th = document.createElement('th');
                th.textContent = placar;
                th.classList.add('maximaplacar-th');
                th.setAttribute('title', `Placar: ${placar}`);
                headerRow.appendChild(th);
            });
        }

        let placares = {};
        placaresFixos.forEach(p => { placares[p] = { max: 0, atual: 0, lastIndex: -1 }; });

        recentData.forEach((jogo, i) => {
            const placar = jogo.ft;
            if (placares[placar]) {
                if (placares[placar].lastIndex !== -1) {
                    const diff = i - placares[placar].lastIndex - 1;
                    placares[placar].max = Math.max(placares[placar].max, diff);
                }
                placares[placar].lastIndex = i;
                placares[placar].atual = 0;
            }
            for (let p in placares) { if (placar !== p) placares[p].atual++; }
        });

        const tableBody = document.getElementById('maximaplacar-resultados');
        let row = tableBody.querySelector('tr');
        if (!row) { row = document.createElement('tr'); tableBody.appendChild(row); }
        else row.innerHTML = '';

        placaresFixos.forEach(placar => {
            const r = placares[placar];
            const td = document.createElement('td');
            td.innerHTML = `${r.max} <span style="color:#3a4f5c;font-size:11px;">/</span> ${r.atual}`;
            td.classList.add('maximaplacar-td');
            td.setAttribute('title', `Máxima: ${r.max} jogos  |  Atual: ${r.atual} jogos`);
            if (r.atual >= r.max) td.classList.add('mfv-alerta');
            else if (r.atual >= r.max - 2) td.classList.add('maximaplacar-proximidade');
            row.appendChild(td);
        });

        updateTimestamp('maximaplacar-update');
    } catch (e) { console.error('Máximas de Placares:', e); }
}

sincronizarIntervalo(fetchMaximaplacar, 10000);
fetchMaximaplacar();

// ─────────────────────────────────────────────
//  TABELA 2 — Placares Mais Repetidos
// ─────────────────────────────────────────────
let previousDataHashPlacarRepet = '';

async function fetchPlacarRepet() {
    try {
        let data = await LigaDataManager.getResultados();
        data = normalizarOrdemCronologica(data);

        const jogosPorHora = obterJogosPorHora(data);
        const totalJogosPeriodo = horasSelecionadas * jogosPorHora;
        const recentData = data.slice(-totalJogosPeriodo);

        const dataHash = JSON.stringify(recentData);
        if (dataHash === previousDataHashPlacarRepet) return;
        previousDataHashPlacarRepet = dataHash;

        const placarCounts = {};
        recentData.forEach(jogo => {
            const p = jogo.ft;
            placarCounts[p] = (placarCounts[p] || 0) + 1;
        });

        const sorted = Object.entries(placarCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);

        const headerRow = document.getElementById('placarrepet-header');
        headerRow.innerHTML = '';
        sorted.forEach(([placar]) => {
            const th = document.createElement('th');
            th.textContent = placar;
            th.classList.add('placarrepet-th');
            th.setAttribute('title', `Placar: ${placar}`);
            headerRow.appendChild(th);
        });

        const tableBody = document.getElementById('placarrepet-resultados');
        let row = tableBody.querySelector('tr');
        if (!row) { row = document.createElement('tr'); tableBody.appendChild(row); }
        else row.innerHTML = '';

        sorted.forEach(([placar, count]) => {
            const td = document.createElement('td');
            td.textContent = count;
            td.classList.add('placarrepet-td');
            td.setAttribute('title', `${placar}: ${count} vezes`);
            if (count >= 40) td.classList.add('placarrepet-highlight-high');
            row.appendChild(td);
        });

        updateTimestamp('placarrepet-update');
    } catch (e) { console.error('Placares Mais Repetidos:', e); }
}

sincronizarIntervalo(fetchPlacarRepet, 10000);
fetchPlacarRepet();

// ─────────────────────────────────────────────
//  TABELA 3 — Máximas de Mercados
// ─────────────────────────────────────────────
async function fetchMaximamercado() {
    try {
        let data = await LigaDataManager.getResultados();
        data = normalizarOrdemCronologica(data);

        const jogosPorHora = obterJogosPorHora(data);
        const totalJogosPeriodo = horasSelecionadas * jogosPorHora;
        const recentData = data.slice(-totalJogosPeriodo);

        const mercadosFixos = [
            'Ambas Sim','Ambas Não','Casa Vence','Fora Vence','Empate',
            'Over 1.5','Under 1.5','Over 2.5','Under 2.5','Over 3.5','Under 3.5','5 ou Mais Gols'
        ];

        const headerRow = document.getElementById('maximamercado-header');
        if (headerRow.children.length === 0) {
            mercadosFixos.forEach(mercado => {
                const th = document.createElement('th');
                th.textContent = mercado;
                th.classList.add('maximamercado-th');
                th.setAttribute('title', `Mercado: ${mercado}`);
                headerRow.appendChild(th);
            });
        }

        let mercados = {};
        mercadosFixos.forEach(m => { mercados[m] = { max: 0, atual: 0, lastIndex: -1 }; });

        for (let i = 0; i < recentData.length; i++) {
            const [gC, gF] = recentData[i].ft.split(' x ').map(Number);
            const cond = {
                'Ambas Sim': gC > 0 && gF > 0,
                'Ambas Não': gC === 0 || gF === 0,
                'Casa Vence': gC > gF,
                'Fora Vence': gF > gC,
                'Empate': gC === gF,
                'Over 1.5': gC + gF > 1.5,
                'Under 1.5': gC + gF <= 1.5,
                'Over 2.5': gC + gF > 2.5,
                'Under 2.5': gC + gF <= 2.5,
                'Over 3.5': gC + gF > 3.5,
                'Under 3.5': gC + gF <= 3.5,
                '5 ou Mais Gols': gC + gF >= 5,
            };
            for (let m in cond) {
                if (cond[m]) {
                    if (mercados[m].lastIndex !== -1) {
                        const diff = i - mercados[m].lastIndex - 1;
                        mercados[m].max = Math.max(mercados[m].max, diff);
                    }
                    mercados[m].lastIndex = i;
                    mercados[m].atual = 0;
                } else {
                    mercados[m].atual++;
                }
            }
        }

        const tableBody = document.getElementById('maximamercado-resultados');
        let row = tableBody.querySelector('tr');
        if (!row) { row = document.createElement('tr'); tableBody.appendChild(row); }
        else row.innerHTML = '';

        mercadosFixos.forEach(mercado => {
            const r = mercados[mercado];
            const td = document.createElement('td');
            td.innerHTML = `${r.max} <span style="color:#3a4f5c;font-size:11px;">/</span> ${r.atual}`;
            td.classList.add('maximamercado-td');
            td.setAttribute('title', `Máxima: ${r.max} jogos  |  Atual: ${r.atual} jogos`);
            if (r.atual >= r.max) td.classList.add('mfv-alerta');
            else if (r.atual >= r.max - 2) td.classList.add('maximamercado-proximidade');
            row.appendChild(td);
        });

        updateTimestamp('maximamercado-update');
    } catch (e) { console.error('Máximas de Mercados:', e); }
}

sincronizarIntervalo(fetchMaximamercado, 10000);
fetchMaximamercado();

// ─────────────────────────────────────────────
//  TABELA 4 — Média de Mercados por Hora
// ─────────────────────────────────────────────
async function fetchMediahoramercado() {
    try {
        let data = await LigaDataManager.getResultados();
        data = normalizarOrdemCronologica(data);

        const jogosPorHora = obterJogosPorHora(data);
        const totalJogosPeriodo = horasSelecionadas * jogosPorHora;
        const recentData = data.slice(-totalJogosPeriodo);
        const numHoras = Math.max(1, Math.floor(recentData.length / jogosPorHora));

        const mercadosFixos = [
            'Ambas Sim','Ambas Não','Casa Vence','Fora Vence','Empate',
            'Over 1.5','Under 1.5','Over 2.5','Under 2.5','Over 3.5','Under 3.5','5 ou Mais Gols'
        ];

        const headerRow = document.getElementById('mediahoramercado-header');
        if (headerRow.children.length === 0) {
            mercadosFixos.forEach(mercado => {
                const th = document.createElement('th');
                th.textContent = mercado;
                th.classList.add('mediahoramercado-th');
                th.setAttribute('title', `Mercado: ${mercado}`);
                headerRow.appendChild(th);
            });
        }

        let total = {};
        mercadosFixos.forEach(m => { total[m] = 0; });

        for (let hora = 0; hora < numHoras; hora++) {
            const jogos = recentData.slice(hora * jogosPorHora, (hora + 1) * jogosPorHora);
            let res = { casaVence: 0, foraVence: 0, empate: 0 };

            jogos.forEach(jogo => {
                const [gC, gF] = jogo.ft.split(' x ').map(Number);
                if (gC > gF) res.casaVence++;
                else if (gF > gC) res.foraVence++;
                else res.empate++;

                const cond = {
                    'Ambas Sim': gC > 0 && gF > 0,
                    'Ambas Não': gC === 0 || gF === 0,
                    'Over 1.5': (gC + gF) > 1.5,
                    'Under 1.5': (gC + gF) <= 1.5,
                    'Over 2.5': (gC + gF) > 2.5,
                    'Under 2.5': (gC + gF) <= 2.5,
                    'Over 3.5': (gC + gF) > 3.5,
                    'Under 3.5': (gC + gF) <= 3.5,
                    '5 ou Mais Gols': (gC + gF) >= 5
                };
                for (let m in cond) { if (cond[m]) total[m]++; }
            });

            const t = res.casaVence + res.foraVence + res.empate;
            if (t > jogosPorHora) {
                const f = jogosPorHora / t;
                res.casaVence = Math.round(res.casaVence * f);
                res.foraVence = Math.round(res.foraVence * f);
                res.empate = jogosPorHora - res.casaVence - res.foraVence;
            }
            total['Casa Vence'] += res.casaVence;
            total['Fora Vence'] += res.foraVence;
            total['Empate'] += res.empate;
        }

        const tableBody = document.getElementById('mediahoramercado-resultados');
        let row = tableBody.querySelector('tr');
        if (!row) { row = document.createElement('tr'); tableBody.appendChild(row); }
        else row.innerHTML = '';

        mercadosFixos.forEach(mercado => {
            const media = Math.round(total[mercado] / numHoras);
            const td = document.createElement('td');
            td.textContent = media;
            td.classList.add('mediahoramercado-td');
            td.setAttribute('title', `Média de ${mercado} por hora: ${media} (${jogosPorHora} jogos/hora detectados)`);
            if (media >= Math.round(jogosPorHora * 0.75)) td.classList.add('mediahoramercado-highlight-high');
            row.appendChild(td);
        });

        updateTimestamp('mediahoramercado-update');
    } catch (e) { console.error('Média de Mercados por Hora:', e); }
}

sincronizarIntervalo(fetchMediahoramercado, 10000);
fetchMediahoramercado();


/* ──────────────────────────────────────────────────────────────────
   [4] Seleção de times / jogos por minuto (+ atualização periódica)
   ────────────────────────────────────────────────────────────────── */

let selectedTeam1 = null;
let selectedTeam2 = null;
let selectedTeamHomeDisplay = null;
let selectedTeamVisitDisplay = null;

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function carregarJogos() {
    try {
        const jogos = await LigaDataManager.getResultados();
        console.log("Jogos carregados da API_URL:", jogos);
        return jogos;
    } catch (error) {
        console.error("Erro ao carregar dados da API_URL:", error);
        return [];
    }
}

async function loadNextGamesForMinutes() {
    console.log("Iniciando atualização dos próximos jogos...");
    try {
        const data = await LigaDataManager.getProximosJogos();
        console.log("Resposta completa da NEXT_GAMES_API:", data);

        // Verifica a estrutura da resposta e extrai os jogos
        const games = Array.isArray(data.data) ? data.data.slice(0, 6) : 
                      Array.isArray(data) ? data.slice(0, 6) : [];
        console.log("Jogos processados para exibição:", games);

        const container = document.getElementById("nextGamesMinutesContainer");

        // Salva os times selecionados antes de recarregar os cards
        const previouslySelectedTeam1 = selectedTeam1;
        const previouslySelectedTeam2 = selectedTeam2;

        // Recria os cards, preservando acentos nos nomes exibidos
        if (games.length > 0) {
            container.innerHTML = games.map(game => `
                <div class="game-card" data-home="${removeAccents(game.team_home)}" data-visit="${removeAccents(game.team_visit)}" onclick="selectGameForMinutes(this, '${removeAccents(game.team_home)}', '${removeAccents(game.team_visit)}', '${game.team_home}', '${game.team_visit}')">
                    <div class="game-time">${game.time || 'Hora não informada'}</div>
                    <div class="game-teams">
                        <span class="team-home">${game.team_home || 'Time A'}</span>
                        <span class="vs">vs</span>
                        <span class="team-visit">${game.team_visit || 'Time B'}</span>
                    </div>
                </div>
            `).join("");
        } else {
            container.innerHTML = `<div class="game-card">Nenhum jogo disponível no momento</div>`;
            console.warn("Nenhum jogo disponível na resposta da API.");
        }

        // Restaura a seleção com base nos times previamente selecionados
        const cards = container.querySelectorAll('.game-card');
        let cardToSelect = null;

        if (previouslySelectedTeam1 && previouslySelectedTeam2) {
            cards.forEach(card => {
                const home = card.getAttribute('data-home');
                const visit = card.getAttribute('data-visit');
                if (home === previouslySelectedTeam1 && visit === previouslySelectedTeam2) {
                    cardToSelect = card;
                }
            });
        }

        // Aplica a classe 'selected' ao card correspondente
        if (cardToSelect) {
            cardToSelect.classList.add('selected');
            selectedTeam1 = cardToSelect.getAttribute('data-home');
            selectedTeam2 = cardToSelect.getAttribute('data-visit');
            if (!selectedTeamHomeDisplay || !selectedTeamVisitDisplay) {
                selectedTeamHomeDisplay = cardToSelect.querySelector('.team-home').innerText;
                selectedTeamVisitDisplay = cardToSelect.querySelector('.team-visit').innerText;
                document.getElementById("team1Title").innerText = selectedTeamHomeDisplay;
                document.getElementById("team2Title").innerText = selectedTeamVisitDisplay;
            }
        } else if (previouslySelectedTeam1 && previouslySelectedTeam2) {
            // Mantém a seleção anterior se o jogo não estiver na lista
            selectedTeam1 = previouslySelectedTeam1;
            selectedTeam2 = previouslySelectedTeam2;
        } else if (cards.length > 0 && cards[0].getAttribute('data-home')) {
            // Seleciona o primeiro card se não houver seleção anterior
            cardToSelect = cards[0];
            cardToSelect.classList.add('selected');
            selectedTeam1 = cardToSelect.getAttribute('data-home');
            selectedTeam2 = cardToSelect.getAttribute('data-visit');
            selectedTeamHomeDisplay = cardToSelect.querySelector('.team-home').innerText;
            selectedTeamVisitDisplay = cardToSelect.querySelector('.team-visit').innerText;
            document.getElementById("team1Title").innerText = selectedTeamHomeDisplay;
            document.getElementById("team2Title").innerText = selectedTeamVisitDisplay;
        }

        // Atualiza as tabelas se houver times selecionados
        if (selectedTeam1 && selectedTeam2) {
            console.log("Atualizando tabelas para:", selectedTeam1, selectedTeam2);
            await analisar();
        } else {
            console.log("Nenhum time selecionado para atualizar tabelas");
        }
    } catch (error) {
        console.error("Erro ao carregar próximos jogos para minutos:", error);
        const container = document.getElementById("nextGamesMinutesContainer");
        container.innerHTML = `<div class="game-card">Erro ao carregar jogos: ${error.message}</div>`;
        // Mantém as tabelas com a última seleção válida
        if (selectedTeam1 && selectedTeam2) {
            console.log("Mantendo tabelas com seleção anterior:", selectedTeam1, selectedTeam2);
            await analisar();
        }
    }
}

window.selectGameForMinutes = function(card, teamHome, teamVisit, teamHomeDisplay, teamVisitDisplay) {
    document.querySelectorAll('#nextGamesMinutesContainer .game-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedTeam1 = teamHome;
    selectedTeam2 = teamVisit;
    selectedTeamHomeDisplay = teamHomeDisplay;
    selectedTeamVisitDisplay = teamVisitDisplay;
    document.getElementById("team1Title").innerText = teamHomeDisplay;
    document.getElementById("team2Title").innerText = teamVisitDisplay;
    console.log("Jogo selecionado:", teamHome, teamVisit);
    analisar();
};

function analisarMercados(jogos, timeSelecionado) {
    const analise = {};

    jogos.forEach((jogo) => {
        const timeA = removeAccents(jogo.time_a);
        const timeB = removeAccents(jogo.time_b);
        if (timeA === timeSelecionado || timeB === timeSelecionado) {
            const minuto = jogo.minuto;
            const ftGols = jogo.ft ? jogo.ft.split(" x ").map(Number) : [0, 0];
            const timeAGols = ftGols[0];
            const timeBGols = ftGols[1];
            const totalGols = timeAGols + timeBGols;

            if (!analise[minuto]) {
                analise[minuto] = {
                    ambasMarcamSim: 0,
                    ambasMarcamNao: 0,
                    over15: 0,
                    under15: 0,
                    over25: 0,
                    under25: 0,
                    over35: 0,
                    under35: 0,
                    casa: 0,
                    fora: 0,
                    empate: 0,
                    total: 0,
                };
            }

            analise[minuto].total += 1;

            if (timeAGols > 0 && timeBGols > 0) analise[minuto].ambasMarcamSim += 1;
            if (timeAGols === 0 || timeBGols === 0) analise[minuto].ambasMarcamNao += 1;

            if (totalGols > 1.5) analise[minuto].over15 += 1;
            if (totalGols <= 1.5) analise[minuto].under15 += 1;

            if (totalGols > 2.5) analise[minuto].over25 += 1;
            if (totalGols <= 2.5) analise[minuto].under25 += 1;

            if (totalGols > 3.5) analise[minuto].over35 += 1;
            if (totalGols <= 3.5) analise[minuto].under35 += 1;

            if (timeAGols > timeBGols) analise[minuto].casa += 1;
            if (timeBGols > timeAGols) analise[minuto].fora += 1;
            if (timeAGols === timeBGols) analise[minuto].empate += 1;
        }
    });

    return analise;
}

function gerarTabela(analise, tableId, teamName) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector("tbody");
    const thead = table.querySelector("thead tr");

    tbody.innerHTML = "";
    thead.innerHTML = "<th>Mercado</th>";

    const minutos = Object.keys(analise).sort((a, b) => Number(a) - Number(b));
    minutos.forEach((minuto) => {
        const th = document.createElement("th");
        th.innerText = minuto;
        thead.appendChild(th);
    });

    const mercados = [
        { class: "mercado-ambas-marcam", label: "Ambas", yes: "ambasMarcamSim", no: "ambasMarcamNao" },
        { class: "mercado-over15", label: "1.5", over: "over15", under: "under15" },
        { class: "mercado-over25", label: "2.5", over: "over25", under: "under25" },
        { class: "mercado-over35", label: "3.5", over: "over35", under: "under35" },
        { class: "mercado-resultado", label: "C/F/E", casa: "casa", fora: "fora", empate: "empate" },
    ];

    mercados.forEach((mercado) => {
        const tr = document.createElement("tr");
        tr.classList.add(mercado.class);

        const td = document.createElement("td");
        td.classList.add("mercado-header");
        td.innerText = mercado.label;
        tr.appendChild(td);

        minutos.forEach((minuto) => {
            const td = document.createElement("td");
            const dados = analise[minuto] || { total: 0 };
            let texto = "";

            if (mercado.yes && mercado.no) {
                const simPercent = dados[mercado.yes] && dados.total ? (dados[mercado.yes] / dados.total) * 100 : 0;
                const naoPercent = dados[mercado.no] && dados.total ? (dados[mercado.no] / dados.total) * 100 : 0;
                texto = `S:${simPercent.toFixed(0)}%\nN:${naoPercent.toFixed(0)}%`;
            }

            if (mercado.over && mercado.under) {
                const overPercent = dados[mercado.over] && dados.total ? (dados[mercado.over] / dados.total) * 100 : 0;
                const underPercent = dados[mercado.under] && dados.total ? (dados[mercado.under] / dados.total) * 100 : 0;
                texto = `O:${overPercent.toFixed(0)}%\nU:${underPercent.toFixed(0)}%`;
            }

            if (mercado.casa && mercado.fora && mercado.empate) {
                const casaPercent = dados[mercado.casa] && dados.total ? (dados[mercado.casa] / dados.total) * 100 : 0;
                const foraPercent = dados[mercado.fora] && dados.total ? (dados[mercado.fora] / dados.total) * 100 : 0;
                const empatePercent = dados[mercado.empate] && dados.total ? (dados[mercado.empate] / dados.total) * 100 : 0;
                texto = `C:${casaPercent.toFixed(0)}%\nF:${foraPercent.toFixed(0)}%\nE:${empatePercent.toFixed(0)}%`;
            }

            td.innerHTML = texto.replace(/\n/g, "<br>");
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

async function analisar() {
    if (!selectedTeam1 || !selectedTeam2) {
        console.log("Nenhum time selecionado, pulando análise");
        return;
    }

    const jogos = await carregarJogos();

    // Analisa os dados para o Time 1
    const analiseTeam1 = analisarMercados(jogos, selectedTeam1);
    gerarTabela(analiseTeam1, "team1-tabela-resultados", selectedTeam1);

    // Analisa os dados para o Time 2
    const analiseTeam2 = analisarMercados(jogos, selectedTeam2);
    gerarTabela(analiseTeam2, "team2-tabela-resultados", selectedTeam2);
    console.log("Tabelas atualizadas para:", selectedTeam1, selectedTeam2);
}

// Inicialização
loadNextGamesForMinutes();
// Atualização periódica dos jogos
const updateInterval = sincronizarIntervalo(async () => {
    console.log("Executando atualização periódica dos jogos...");
    await loadNextGamesForMinutes();
}, 10000);


/* ──────────────────────────────────────────────────────────────────
   [5] Acordeões e utilidades
   ────────────────────────────────────────────────────────────────── */

(function () {

// (toggleAccordion removido daqui: a versão global acima é a única — esta
// sobrescrevia window.toggleAccordion e quebrava Ver Máximas e Modo Trader.)

document.addEventListener('DOMContentLoaded', async () => {

    const marketSelector   = document.getElementById('marketSelector');
    const rankingContainer = document.getElementById('rankingContainer');
    const minGamesSlider   = document.getElementById('minGamesSlider');
    const minGamesValue    = document.getElementById('minGamesValue');
    const topNSelector     = document.getElementById('topNSelector');
    const sortSelector     = document.getElementById('sortSelector');
    const topBar           = document.getElementById('rkTopBar');

    const STORAGE_KEY     = 'rankingConfig';
    const HOURS_OPTIONS   = [
        { label: '6h',  games: 120 },
        { label: '12h', games: 240 },
        { label: '24h', games: 480 },
        { label: '48h', games: 960 },
    ];
    const AUTO_REFRESH_MS = 3 * 60 * 1000; // 3 minutos
    let allGames          = [];
    let debounceTimer     = null;
    let autoRefreshTimer  = null;
    let modoAtual         = 'ambos';
    let lastTableData     = null;

    // ── [FIX 1] CSS injetado UMA VEZ no <head> — nunca duplicado no DOM ─────
    
    

    // ── Topbar: período (visual) + abas ────────────────────────────────────
    const hoursWrapper = document.createElement('div');
    hoursWrapper.style.cssText = 'display:inline-flex;align-items:center;gap:4px;';
    const hoursLabel = document.createElement('span');
    hoursLabel.textContent = 'Período:';
    hoursLabel.style.cssText = 'font-size:10px;font-weight:600;color:#7a9e8a;text-transform:uppercase;letter-spacing:.6px;margin-right:4px;';
    hoursWrapper.appendChild(hoursLabel);

    HOURS_OPTIONS.forEach(({ label, games }) => {
        const btn = document.createElement('button');
        btn.textContent   = label;
        btn.dataset.games = games;
        btn.style.cssText = 'padding:3px 9px;font-size:10px;font-weight:600;border-radius:3px;border:1px solid #2a3d30;background:transparent;color:#7a9e8a;cursor:pointer;transition:all .15s;letter-spacing:.3px;';
        btn.addEventListener('mouseenter', () => { if (!btn.classList.contains('rk-h-on')) { btn.style.background='rgba(255,255,255,.05)'; btn.style.color='#aacfbc'; }});
        btn.addEventListener('mouseleave', () => { if (!btn.classList.contains('rk-h-on')) { btn.style.background='transparent'; btn.style.color='#7a9e8a'; btn.style.borderColor='#2a3d30'; }});
        btn.addEventListener('click', () => { setActiveGames(games); scheduleUpdate(); });
        hoursWrapper.appendChild(btn);
    });

    const abasWrapper = document.createElement('div');
    abasWrapper.style.cssText = 'display:inline-flex;align-items:center;gap:4px;';
    [['ambos','Casa/Fora'],['casa','🏠 Casa'],['fora','✈ Fora']].forEach(([val, label]) => {
        const btn = document.createElement('button');
        btn.textContent  = label;
        btn.dataset.modo = val;
        btn.style.cssText = 'padding:3px 10px;font-size:10px;font-weight:600;border-radius:3px;border:1px solid #2a3d30;background:transparent;color:#7a9e8a;cursor:pointer;transition:all .15s;letter-spacing:.3px;';
        btn.addEventListener('click', () => { setActiveModo(val); scheduleUpdate(); });
        abasWrapper.appendChild(btn);
    });

    topBar.appendChild(hoursWrapper);
    topBar.appendChild(abasWrapper);

    // ── Helpers ─────────────────────────────────────────────────────────────
    function setActiveGames(n) {
        hoursWrapper.querySelectorAll('button').forEach(b => {
            const on = parseInt(b.dataset.games) === n;
            b.classList.toggle('rk-h-on', on);
            b.style.background  = on ? 'rgba(31,172,137,.15)' : 'transparent';
            b.style.color       = on ? '#3ecfa3' : '#7a9e8a';
            b.style.borderColor = on ? '#2d9e76' : '#2a3d30';
        });
    }
    function getActiveGames() {
        const a = hoursWrapper.querySelector('.rk-h-on');
        return a ? parseInt(a.dataset.games) : 240;
    }
    function setActiveModo(modo) {
        modoAtual = modo;
        abasWrapper.querySelectorAll('button').forEach(b => {
            const on = b.dataset.modo === modo;
            b.style.background  = on ? 'rgba(79,114,255,.18)' : 'transparent';
            b.style.color       = on ? '#72b0ff' : '#7a9e8a';
            b.style.borderColor = on ? '#4f72ff' : '#2a3d30';
        });
    }

    // ── Persistência ────────────────────────────────────────────────────────
    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            market: marketSelector.value, minGames: minGamesSlider.value,
            topN: topNSelector.value, sortBy: sortSelector.value,
            games: getActiveGames(), modo: modoAtual
        }));
    }
    function loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) { setActiveGames(240); setActiveModo('ambos'); return; }
            const c = JSON.parse(saved);
            if (c.market)   marketSelector.value = c.market;
            if (c.minGames) { minGamesSlider.value = c.minGames; minGamesValue.textContent = c.minGames; }
            if (c.topN)     topNSelector.value = c.topN;
            if (c.sortBy)   sortSelector.value = c.sortBy;
            const validGames = HOURS_OPTIONS.map(o => o.games);
            setActiveGames(validGames.includes(Number(c.games)) ? Number(c.games) : 240);
            setActiveModo(c.modo || 'ambos');
        } catch(e) { localStorage.removeItem(STORAGE_KEY); setActiveGames(240); setActiveModo('ambos'); }
    }

    function scheduleUpdate() {
        saveConfig();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateRanking, 120);
    }

    minGamesSlider.addEventListener('input',  () => { minGamesValue.textContent = minGamesSlider.value; scheduleUpdate(); });
    marketSelector.addEventListener('change', scheduleUpdate);
    topNSelector.addEventListener('change',   scheduleUpdate);
    sortSelector.addEventListener('change',   scheduleUpdate);

    loadConfig();

    // ── Fetch dados ──────────────────────────────────────────────────────────
    async function fetchData() {
        allGames = await LigaDataManager.getResultados();
    }

    // Carga inicial
    try {
        await fetchData();
    } catch (error) {
        rankingContainer.innerHTML = `<p style="color:#e05c5c;text-align:center;padding:16px;font-size:13px;">Falha: ${error.message}</p>`;
        return;
    }

    // ── [FIX 6] Auto-refresh: pausa com aba oculta, retoma ao voltar ─────────
    async function autoRefresh() {
        try {
            await fetchData();
            updateRanking(/* silent= */ true);
        } catch(_) { /* falha silenciosa */ }
        autoRefreshTimer = setTimeout(autoRefresh, AUTO_REFRESH_MS);
    }
    autoRefreshTimer = setTimeout(autoRefresh, AUTO_REFRESH_MS);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearTimeout(autoRefreshTimer);
            autoRefreshTimer = null;
        } else {
            // Aba voltou ao foco: atualiza imediatamente e reagenda
            if (!autoRefreshTimer) autoRefreshTimer = setTimeout(autoRefresh, 0);
        }
    });

    // ── [FIX 3] slice(-n): pega os N mais recentes sem copiar o array todo ───
    // A API retorna do mais antigo pro mais recente — slice(-n) é suficiente.
    function filterByCount(games, n) {
        if (!games.length) return games;
        return games.slice(-n);
    }

    // ── Status RELATIVO: distribui Elite/Médio/Fraco por quartis ────────────
    function calcStatusRelativo(arr) {
        if (!arr.length) return;
        const maxPct = Math.max(...arr.map(t => t.pct), 1);
        // [FIX 4] idxOf já é número — sem parseFloat
        const maxIdx = Math.max(...arr.map(t => t.idxOf), 1);

        arr.forEach(t => {
            t._score = (t.pct / maxPct) * 0.6 + (t.idxOf / maxIdx) * 0.4;
        });

        const sorted = [...arr].sort((a, b) => b._score - a._score);
        const q1 = sorted[Math.max(0, Math.ceil(sorted.length * 0.25) - 1)]._score;
        const q3 = sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.75) - 1)]._score;

        arr.forEach(t => {
            if      (t._score >= q1) { t.status = '🚀 Elite'; t.statusCls = 'elite'; }
            else if (t._score >= q3) { t.status = '⚠ Médio';  t.statusCls = 'medio'; }
            else                     { t.status = '❌ Fraco';  t.statusCls = 'fraco'; }
        });
    }

    // ── [FIX 2] initTeam definida fora do updateRanking — não recriada a cada chamada ──
    function initTeam(ts, name) {
        if (!ts[name]) ts[name] = {
            name,
            totalGames:0, casaGames:0, foraGames:0,
            marketCount:0, casaMarket:0, foraMarket:0,
            gpTotal:0, gcTotal:0, gpCasa:0, gcCasa:0, gpFora:0, gcFora:0,
            vitorias:0, empates:0, derrotas:0,
            vitCasa:0, empCasa:0, derCasa:0,
            vitFora:0, empFora:0, derFora:0,
            forma: []
        };
    }

    // ── Helpers de integração com a Tabela ──────────────────────────────────
    function getRkLigaKey() {
        const h4 = document.querySelector('h4.custom-color');
        if (h4 && h4.textContent.trim()) {
            return h4.textContent.trim().toLowerCase().replace(/\s+/g, '_');
        }
        return typeof LIGA_ATUAL !== 'undefined' ? LIGA_ATUAL : 'default';
    }

    function getTimesSelecionados() {
        try {
            return JSON.parse(localStorage.getItem(`timesSelecionados_${getRkLigaKey()}`)) || [];
        } catch(e) { return []; }
    }

    function setTimesSelecionados(lista) {
        localStorage.setItem(`timesSelecionados_${getRkLigaKey()}`, JSON.stringify(lista));
    }

    function toggleTimeSelecionado(nome) {
        const lista = getTimesSelecionados();
        const idx = lista.indexOf(nome);
        if (idx !== -1) lista.splice(idx, 1);
        else { if (lista.length >= 6) lista.shift(); lista.push(nome); }
        setTimesSelecionados(lista);

        if (typeof Estado !== 'undefined' && typeof buscarDados === 'function') {
            Estado.timesSelecionados = lista.slice();
            Estado.forcarRerender();
            buscarDados();
        }
        atualizarIconesOlho();
    }

    function atualizarIconesOlho() {
        const selecionados = getTimesSelecionados();
        rankingContainer.querySelectorAll('.rk-eye-btn').forEach(btn => {
            const ativo = selecionados.includes(btn.dataset.time);
            const svg   = btn.querySelector('svg');
            if (svg) {
                svg.setAttribute('stroke', ativo ? '#3ecfa3' : '#6a7d90');
                svg.style.opacity = ativo ? '1' : '0.5';
            }
            btn.style.background  = ativo ? 'rgba(62,207,163,.1)' : 'none';
            btn.style.borderColor = ativo ? 'rgba(62,207,163,.4)' : 'transparent';
            btn.dataset.tip       = ativo ? 'Desmarcar na tabela' : 'Filtrar na tabela';
        });
    }

    // ── Processar Ranking ───────────────────────────────────────────────────
    function updateRanking(silent = false) {
        const selectedMarket = marketSelector.value;
        const minGames = parseInt(minGamesSlider.value, 10);
        const topN     = parseInt(topNSelector.value, 10);
        const sortBy   = sortSelector.value;
        const nGames   = getActiveGames();
        const games    = filterByCount(allGames, nGames);

        if (!silent) {
            rankingContainer.innerHTML = `
                <div style="padding:8px 0;">${[...Array(5)].map(() =>
                    `<div style="height:36px;margin-bottom:4px;border-radius:4px;background:rgba(255,255,255,.06);animation:rkSk 1.2s ease-in-out infinite alternate;"></div>`
                ).join('')}</div>`;
        }

        try {
            const ts = {};

            games.forEach(game => {
                const { time_a, time_b, ft, ht } = game;
                if (!ft || !ft.includes(' x ')) return;
                const [gA, gB] = ft.split(' x ').map(Number);
                if (isNaN(gA) || isNaN(gB)) return;
                const tot = gA + gB;

                // [FIX 2] initTeam definida fora do loop
                initTeam(ts, time_a); initTeam(ts, time_b);

                // Gols
                ts[time_a].gpTotal+=gA; ts[time_a].gcTotal+=gB; ts[time_a].gpCasa+=gA; ts[time_a].gcCasa+=gB;
                ts[time_b].gpTotal+=gB; ts[time_b].gcTotal+=gA; ts[time_b].gpFora+=gB; ts[time_b].gcFora+=gA;

                // Jogos
                ts[time_a].totalGames++; ts[time_a].casaGames++;
                ts[time_b].totalGames++; ts[time_b].foraGames++;

                // Pontos
                if (gA > gB) {
                    ts[time_a].vitorias++;  ts[time_a].vitCasa++;
                    ts[time_b].derrotas++;  ts[time_b].derFora++;
                } else if (gA === gB) {
                    ts[time_a].empates++;   ts[time_a].empCasa++;
                    ts[time_b].empates++;   ts[time_b].empFora++;
                } else {
                    ts[time_a].derrotas++;  ts[time_a].derCasa++;
                    ts[time_b].vitorias++;  ts[time_b].vitFora++;
                }

                // [FIX 2b] Forma: push + shift — garante sempre os ÚLTIMOS 5 jogos
                const rA = gA>gB ? 'V' : gA===gB ? 'E' : 'D';
                const rB = gB>gA ? 'V' : gA===gB ? 'E' : 'D';
                ts[time_a].forma.push(rA); if (ts[time_a].forma.length > 5) ts[time_a].forma.shift();
                ts[time_b].forma.push(rB); if (ts[time_b].forma.length > 5) ts[time_b].forma.shift();

                // 2º tempo
                let gA2 = 0, gB2 = 0;
                if (ht && ht.includes(' x ')) {
                    const [htA, htB] = ht.split(' x ').map(Number).map(n => isNaN(n) ? 0 : n);
                    gA2 = Math.max(0, gA-htA); gB2 = Math.max(0, gB-htB);
                }
                const t2T = gA2 + gB2;

                // Mercados onde só 1 time conta
                if (selectedMarket==='casaVence' && gA>gB) { ts[time_a].marketCount++; ts[time_a].casaMarket++; return; }
                if (selectedMarket==='foraVence' && gB>gA) { ts[time_b].marketCount++; ts[time_b].foraMarket++; return; }

                let ok = false;
                switch (selectedMarket) {
                    case 'ambasMarcam':    ok=gA>0&&gB>0;     break;
                    case 'ambasNaoMarcam': ok=gA===0||gB===0; break;
                    case 'empate':         ok=gA===gB;        break;
                    case 'over0.5':        ok=tot>0.5;        break;
                    case 'over1.5':        ok=tot>1.5;        break;
                    case 'over2.5':        ok=tot>2.5;        break;
                    case 'over3.5':        ok=tot>3.5;        break;
                    case 'over5':          ok=tot>=5;         break;
                    case 'under0.5':       ok=tot<0.5;        break;
                    case 'under1.5':       ok=tot<1.5;        break;
                    case 'under2.5':       ok=tot<2.5;        break;
                    case 'under3.5':       ok=tot<3.5;        break;
                    case 'exato0':         ok=tot===0;        break;
                    case 'exato1':         ok=tot===1;        break;
                    case 'exato2':         ok=tot===2;        break;
                    case 'exato3':         ok=tot===3;        break;
                    case 'exato4':         ok=tot===4;        break;
                    case 'exato2t0':       ok=t2T===0;        break;
                    case 'exato2t1':       ok=t2T===1;        break;
                    case 'exato2t2':       ok=t2T===2;        break;
                    case 'exato2t3':       ok=t2T===3;        break;
                    case 'exato2t4':       ok=t2T===4;        break;
                    case 'casa0Gols':      ok=gA===0;         break;
                    case 'casa1Gol':       ok=gA===1;         break;
                    case 'casa2Gols':      ok=gA===2;         break;
                    case 'casa3Gols':      ok=gA===3;         break;
                    case 'casa4Gols':      ok=gA===4;         break;
                    case 'fora0Gols':      ok=gB===0;         break;
                    case 'fora1Gol':       ok=gB===1;         break;
                    case 'fora2Gols':      ok=gB===2;         break;
                    case 'fora3Gols':      ok=gB===3;         break;
                    case 'fora4Gols':      ok=gB===4;         break;
                }
                if (ok) { ts[time_a].marketCount++; ts[time_a].casaMarket++; ts[time_b].marketCount++; ts[time_b].foraMarket++; }
            });

            // ── Montar array com métricas por modo ──────────────────────────
            let arr = Object.values(ts).map(t => {
                let jogos, ocorr, gp, gc, gCtx, pontos;

                if (modoAtual === 'casa') {
                    jogos  = t.casaGames;  ocorr  = t.casaMarket;
                    gp     = t.gpCasa;     gc     = t.gcCasa;
                    gCtx   = t.gpCasa + t.gcCasa;
                    pontos = t.vitCasa * 3 + t.empCasa;
                } else if (modoAtual === 'fora') {
                    jogos  = t.foraGames;  ocorr  = t.foraMarket;
                    gp     = t.gpFora;     gc     = t.gcFora;
                    gCtx   = t.gpFora + t.gcFora;
                    pontos = t.vitFora * 3 + t.empFora;
                } else {
                    jogos  = t.totalGames; ocorr  = t.marketCount;
                    gp     = t.gpTotal;    gc     = t.gcTotal;
                    gCtx   = t.gpTotal + t.gcTotal;
                    pontos = t.vitorias * 3 + t.empates;
                }

                const sg = gp - gc;
                // [FIX 4] idxOf armazenado como número — toFixed só na exibição
                const idxOf = jogos > 0 ? parseFloat((gCtx / jogos).toFixed(2)) : 0;
                const pct   = jogos > 0 ? parseFloat(((ocorr / jogos) * 100).toFixed(1)) : 0;

                return { name: t.name, pontos, jogos, ocorr, pct, gp, gc, sg, idxOf, forma: t.forma };
            }).filter(t => t.jogos >= minGames);

            if (!arr.length) {
                rankingContainer.innerHTML = `<p style="color:#888;text-align:center;padding:20px;font-size:13px;">Nenhum time com jogos suficientes nos últimos ${nGames} jogos.</p>`;
                return;
            }

            calcStatusRelativo(arr);

            // [FIX 4] idxOf é número — sem parseFloat no sort
            if      (sortBy === 'percentual')    arr.sort((a,b) => b.pct-a.pct || b.ocorr-a.ocorr);
            else if (sortBy === 'indiceOfensivo') arr.sort((a,b) => b.idxOf-a.idxOf || b.pct-a.pct);
            else                                 arr.sort((a,b) => b.ocorr-a.ocorr || b.pct-a.pct);

            const sliced = arr.slice(0, topN);

            // Anti-piscar: só re-renderiza se dados mudaram
            const newKey = JSON.stringify(sliced.map(t => [t.name,t.pontos,t.jogos,t.gp,t.gc,t.ocorr,t.pct,t.idxOf,t.status,t.forma.join('')]));
            if (silent && newKey === lastTableData) return;
            lastTableData = newKey;

            renderTable(sliced);

        } catch(err) {
            if (!silent) {
                rankingContainer.innerHTML = `<p style="color:#e05c5c;text-align:center;padding:16px;font-size:13px;">Erro: ${err.message}</p>`;
            }
            console.error(err);
        }
    }

    // ── Renderizar Tabela ───────────────────────────────────────────────────
    function renderTable(data) {
        if (!data.length) {
            rankingContainer.innerHTML = '<p style="color:#888;text-align:center;padding:20px;font-size:13px;">Nenhum dado encontrado.</p>';
            return;
        }

        const maxPct    = Math.max(...data.map(t => t.pct), 1);
        const posColors = ['#b8962e','#7a7a7a','#7a5230'];
        const modoLabel = modoAtual==='casa' ? '🏠 Casa' : modoAtual==='fora' ? '✈ Fora' : 'Casa/Fora';
        const selecionados = getTimesSelecionados();

        // [FIX 1] sem <style> aqui — CSS já está no <head>
        let html = `
        <div class="rk3-wrap"><table class="rk3-tbl">
        <thead><tr>
            <th style="width:32px;">#</th>
            <th style="text-align:left;">Equipe</th>
            <th title="Pontos acumulados no período (V=3, E=1, D=0)">P</th>
            <th title="Jogos no modo selecionado">J (${modoLabel})</th>
            <th title="Gols marcados pelo time (total absoluto)">GP</th>
            <th title="Gols concedidos pelo time (total absoluto)">GC</th>
            <th title="Saldo de gols (GP − GC)">SG</th>
            <th title="Ocorrências do mercado">Ocorr.</th>
            <th title="Percentual de ocorrência do mercado">% Merc.</th>
            <th title="Índice Ofensivo: (GP+GC)/J no contexto">Índice Ofensivo</th>
            <th>Forma</th>
            <th>Status</th>
        </tr></thead>
        <tbody>`;

        data.forEach((t, i) => {
            const posColor = posColors[i] || '#4a5260';
            const barW     = ((t.pct / maxPct) * 100).toFixed(1);
            const barColor = t.pct >= maxPct*0.75 ? '#1c8f60'
                           : t.pct >= maxPct*0.50 ? '#2d9e76'
                           : t.pct >= maxPct*0.25 ? '#a07c2a' : '#7a3535';

            const formaHtml = (t.forma||[]).map(r => `<span class="f${r}">${r}</span>`).join('');
            const sgColor   = t.sg > 0 ? '#1ec97f' : t.sg < 0 ? '#ef5b5b' : '#9fb0c5';
            const sgText    = t.sg > 0 ? `+${t.sg}` : `${t.sg}`;

            const ativo     = selecionados.includes(t.name);
            const eyeStroke = ativo ? '#3ecfa3' : '#6a7d90';
            const eyeOp     = ativo ? '1' : '0.5';
            const eyeBorder = ativo ? 'rgba(62,207,163,.4)' : 'transparent';
            const eyeBg     = ativo ? 'rgba(62,207,163,.1)' : 'none';
            const eyeTip    = ativo ? 'Desmarcar na tabela' : 'Filtrar na tabela';
            const safeName  = t.name.replace(/"/g, '&quot;');
            const eyeSvg    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${eyeStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:${eyeOp};transition:stroke .15s,opacity .15s;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

            // [FIX 4] idxOf.toFixed(2) só na exibição — internamente é número
            html += `
            <tr>
                <td><span style="font-weight:700;font-size:13px;color:${posColor};">${i+1}º</span></td>
                <td class="rk3-team">
                    <span class="rk-name-wrap">
                        <span>${t.name}</span>
                        <button class="rk-eye-btn" data-time="${safeName}" data-tip="${eyeTip}" style="background:${eyeBg};border-color:${eyeBorder};">${eyeSvg}</button>
                    </span>
                </td>
                <td style="color:#e9eef5;font-weight:700;">${t.pontos}</td>
                <td style="color:#9fb0c5;">${t.jogos}</td>
                <td style="color:#72b0ff;font-weight:600;">${t.gp}</td>
                <td style="color:#ef5b5b;font-weight:600;">${t.gc}</td>
                <td style="color:${sgColor};font-weight:600;">${sgText}</td>
                <td style="color:#3ecfa3;font-weight:700;font-size:13px;">${t.ocorr}</td>
                <td>
                    <div class="rk3-bar"><div class="rk3-fill" style="width:${barW}%;background:${barColor};"></div></div>
                    <span style="font-size:12px;font-weight:700;color:#c0c4cc;">${t.pct}%</span>
                </td>
                <td style="color:#b8a0ff;font-weight:700;">${t.idxOf.toFixed(2)}</td>
                <td class="rk3-forma">${formaHtml}</td>
                <td><span class="rk3-badge rk3-${t.statusCls}">${t.status}</span></td>
            </tr>`;
        });

        html += `</tbody></table></div>`;
        rankingContainer.innerHTML = html;
    }

    // ── Listener permanente de delegação para os botões olho ────────────────
    rankingContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('.rk-eye-btn');
        if (!btn) return;
        e.stopPropagation();
        toggleTimeSelecionado(btn.dataset.time);
    });

    updateRanking();
});

})();


/* ──────────────────────────────────────────────────────────────────
   [6] Painel Analítico / Kiron (injeção de CSS removida)
   ────────────────────────────────────────────────────────────────── */

/* ── CSS INLINE ── */

/* ═══════════════════════════════════════════════════════════════════
   PAINEL ANALÍTICO v1
═══════════════════════════════════════════════════════════════════ */
 
const ANAL_PADRAO = {
    linhasRange:2,periodoMA1:9,periodoMA2:21,rsiPeriodo:14,
    macdRapida:9,macdLenta:21,macdSinal:8,alturaPrincipalPx:270,alturaMACDPx:135,
    tooltipFontSize:11,
    bollPeriodo:20,bollDesvio:2,stochK:14,stochD:3,atrPeriodo:14,regLinPeriodo:20
};
 
const ANAL_CORES = {
    'over05':'#FF073A','over15':'#00FF7F','over25':'#FFD700','over35':'#FF5F1F',
    'under05':'#DA00FF','under15':'#FF69B4','under25':'#39FF14','under35':'#00FFFF',
    'Total Gols (FT)':'#00FFAA','Gols Casa (FT)':'#FFB300','Gols Fora (FT)':'#9B59B6',
    'Total Gols (HT)':'#22D3EE',
    'ambas sim':'#7FFF00','ambas nao':'#FF00FF',
    'casa marca':'#1E90FF','fora marca':'#FF4500',
    'casa nao marca':'#22D3EE','fora nao marca':'#FBBF24',
    'casa ft':'#00E5FF','empate ft':'#FF1493','fora ft':'#ADFF2F',
    'casa ht':'#00E5FF','empate ht':'#FF3131','fora ht':'#FFFF33',
    '0 gol':'#39FF14','1 gol':'#FF073A','2 gols':'#00BFFF',
    '3 gols':'#FFD700','4 gols':'#FF6EC7','5+ gols':'#20F6E8',
    'casa_fora_ambas_sim':'#00FFCC',
    'casa ft ambas sim':'#9400FF','casa ft ambas nao':'#FF5F1F',
    'fora ft ambas sim':'#32FF32','fora ft ambas nao':'#AAAAAA',
    'empate ambas sim':'#FF1493','empate ambas nao':'#00CED1',
    'ht 1x0':'#FF3131','ht 0x0':'#BBBBBB','ht 0x1':'#339CFF',
    'ht 2x0':'#7FFF00','ht 1x1':'#FFD700','ht 0x2':'#00FFFF','ht out':'#C0C0C0',
    'casa 0':'#AAAAAA','casa 1':'#ADFF2F','casa 2':'#1E90FF','casa 3':'#FF8C00','casa 4':'#FF00FF',
    'fora 0':'#CCCCCC','fora 1':'#00CED1','fora 2':'#FFD700','fora 3':'#FF1493','fora 4':'#39FF14',
    'ht 0 gol':'#BBBBBB','ht 1 gol':'#ADFF2F','ht 2 gols':'#FF073A','ht 3+ gols':'#FF5F1F',
    'ht under':'#00E5FF','ht over':'#FF1493',
    'st 0 gol':'#FF3131','st 1 gol':'#FF5F1F','st 2 gols':'#FFD700',
    'st 3 gols':'#00FFFF','st 4 gols':'#9400FF',
};
 
const ANAL_GRUPOS = {
    'Overs':['over05','over15','over25','over35'],
    'Unders':['under05','under15','under25','under35'],
    'Indicadores':['Total Gols (FT)','Total Gols (HT)','Gols Casa (FT)','Gols Fora (FT)'],
    'Ambas Marcam':['ambas sim','ambas nao','casa marca','casa nao marca','fora marca','fora nao marca'],
    'Gols Exatos HT':['ht 0 gol','ht 1 gol','ht 2 gols','ht 3+ gols','ht under','ht over'],
    'Gols Exatos 2\u00ba Tempo':['st 0 gol','st 1 gol','st 2 gols','st 3 gols','st 4 gols'],
    'Gols Exatos FT':['0 gol','1 gol','2 gols','3 gols','4 gols','5+ gols'],
    'Resultados':['casa ft','empate ft','fora ft','casa ht','empate ht','fora ht'],
    'HT (Intervalo)':['ht 1x0','ht 0x0','ht 0x1','ht 2x0','ht 1x1','ht 0x2','ht out'],
    'Resultado/Ambos Marcam':['casa_fora_ambas_sim','casa ft ambas sim','casa ft ambas nao','fora ft ambas sim','fora ft ambas nao','empate ambas sim','empate ambas nao'],
    'Gols (Casa)':['casa 0','casa 1','casa 2','casa 3','casa 4'],
    'Gols (Fora)':['fora 0','fora 1','fora 2','fora 3','fora 4'],
};
 
const ANAL_SEL_TO_TIPO = {
    'over0.5':'over05','over1.5':'over15','over2.5':'over25','over3.5':'over35','over5':'5+ gols',
    'under0.5':'under05','under1.5':'under15','under2.5':'under25','under3.5':'under35',
    'ambasMarcam':'ambas sim','ambasNaoMarcam':'ambas nao',
    'casaVence':'casa ft','empate':'empate ft','foraVence':'fora ft',
    'golsFT':'Total Gols (FT)',
    'golsFTCasa':'Gols Casa (FT)',
    'golsFTFora':'Gols Fora (FT)',
    'exato0':'0 gol','exato1':'1 gol','exato2':'2 gols','exato3':'3 gols','exato4':'4 gols',
    'exato2t0':'st 0 gol','exato2t1':'st 1 gol','exato2t2':'st 2 gols','exato2t3':'st 3 gols','exato2t4':'st 4 gols',
    'casa0Gols':'casa 0','casa1Gol':'casa 1','casa2Gols':'casa 2','casa3Gols':'casa 3','casa4Gols':'casa 4',
    'fora0Gols':'fora 0','fora1Gol':'fora 1','fora2Gols':'fora 2','fora3Gols':'fora 3','fora4Gols':'fora 4',
    'casaHT':'casa ht','empateHT':'empate ht','foraHT':'fora ht',
    'golsHT':'Total Gols (HT)',
    'ht0Gol':'ht 0 gol','ht1Gol':'ht 1 gol','ht2Gols':'ht 2 gols','ht3Gols':'ht 3+ gols',
    'placarHT0x0':'ht 0x0','placarHT1x0':'ht 1x0','placarHT0x1':'ht 0x1',
    'placarHT1x1':'ht 1x1','placarHT2x0':'ht 2x0','placarHT0x2':'ht 0x2',
};
 
let ANAL_RESULTADOS = [];
let ANAL_CHART = null;
let ANAL_MACD_CHART = null;
let analVisibilidade = {};
const ANAL_VIS_KEY = 'analVis:v1';
const ANAL_CFG_KEY = 'analCfg:v1';
const ANAL_UI_KEY  = 'analUI:v1';
 
function _analDefaultVis(){const v={};Object.keys(ANAL_CORES).forEach(t=>v[t]=false);v['over25']=true;return v;}
function analLoadVis(){try{const raw=sessionStorage.getItem(ANAL_VIS_KEY);const saved=raw?JSON.parse(raw):{};analVisibilidade=Object.assign(_analDefaultVis(),saved);}catch{analVisibilidade=_analDefaultVis();}}
function analSaveVis(){try{sessionStorage.setItem(ANAL_VIS_KEY,JSON.stringify(analVisibilidade));}catch{}}
 
function _analLoadUI(){
    try{
        const raw=localStorage.getItem(ANAL_UI_KEY);
        if(!raw)return;
        const s=JSON.parse(raw);
        if(s.legendaOculta!==undefined){
            const box=document.getElementById('analLegendaDinamica');
            const btn=document.getElementById('analBtnLegenda');
            if(box){
                if(s.legendaOculta){box.classList.add('oculta');if(btn){btn.textContent='Legenda: OFF';btn.classList.add('off');}}
                else{box.classList.remove('oculta');if(btn){btn.textContent='Legenda: ON';btn.classList.remove('off');}}
            }
        }
        if(s.acordeaoAberto!==undefined){
            const panEl=document.querySelector('[data-panalitico]');
            if(panEl){
                const content=panEl.closest('.accordion-content');
                const item=content?.closest('.accordion-item');
                if(content&&item){
                    if(s.acordeaoAberto){content.style.display='block';const btn=item.querySelector('.accordion-button');if(btn)btn.classList.add('active');}
                    else{content.style.display='none';const btn=item.querySelector('.accordion-button');if(btn)btn.classList.remove('active');}
                }
            }
        }
    }catch{}
}
 
function _analSaveUI(){
    try{
        const box=document.getElementById('analLegendaDinamica');
        const legendaOculta=box?box.classList.contains('oculta'):false;
        const panEl=document.querySelector('[data-panalitico]');
        const content=panEl?.closest('.accordion-content');
        const acordeaoAberto=content?getComputedStyle(content).display!=='none':true;
        localStorage.setItem(ANAL_UI_KEY,JSON.stringify({legendaOculta,acordeaoAberto}));
    }catch{}
}
 
function analLoadCfg(){
    try{
        const raw=localStorage.getItem(ANAL_CFG_KEY);if(!raw)return;const s=JSON.parse(raw);
        const _s=(id,v)=>{const e=document.getElementById(id);if(e&&v!==undefined)e.value=v;};
        const _c=(id,v)=>{const e=document.getElementById(id);if(e&&v!==undefined)e.checked=v;};
        _s('analNumBlocos',s.qtd);_s('analMercadoFT',s.ft);_s('analMercadoHT',s.ht);
        _s('analRangeQtd',s.rang);_s('analMA1Period',s.ma1);_s('analMA2Period',s.ma2);
        _s('analMacdFast',s.macdR);_s('analMacdSlow',s.macdL);_s('analMacdSignal',s.macdS);
        _s('analRsiPeriod',s.rsi);_s('analAltPrincipal',s.hPrin);_s('analAltMacd',s.hMacd);
        _s('analTooltipFontSize',s.ttFs);
        _s('analBollPeriod',s.bollP);_s('analBollDesvio',s.bollD);
        _s('analStochK',s.stochK);_s('analStochD',s.stochD);
        _s('analAtrPeriod',s.atrP);_s('analRegLinPeriod',s.regLinP);
        _c('analModoFixoToggle',s.fixo!==undefined?s.fixo:true);
        _c('analMediasToggle',s.mm!==undefined?s.mm:true);
        _c('analTopoFundoToggle',s.topo!==undefined?s.topo:true);
        _c('analRangeToggle',s.rng!==undefined?s.rng:true);
        _c('analShowRSI',s.showRsi!==undefined?s.showRsi:false);
        _c('analExibirValorToggle',s.pct!==undefined?s.pct:true);
        _c('analLinhaAtualToggle',s.la!==undefined?s.la:true);
        _c('analShowBollinger',s.showBoll!==undefined?s.showBoll:false);
        _c('analShowStoch',s.showStoch!==undefined?s.showStoch:false);
        _c('analShowATR',s.showATR!==undefined?s.showATR:false);
        _c('analShowDiv',s.showDiv!==undefined?s.showDiv:false);
        _c('analShowRegLin',s.showRegLin!==undefined?s.showRegLin:false);
        _analSetAlturas();
    }catch{}
}
 
function analSaveCfg(){
    try{
        const _g=id=>{const e=document.getElementById(id);return e?e.value:undefined;};
        const _gc=id=>{const e=document.getElementById(id);return e?e.checked:undefined;};
        localStorage.setItem(ANAL_CFG_KEY,JSON.stringify({
            qtd:_g('analNumBlocos'),ft:_g('analMercadoFT'),ht:_g('analMercadoHT'),
            rang:_g('analRangeQtd'),ma1:_g('analMA1Period'),ma2:_g('analMA2Period'),
            macdR:_g('analMacdFast'),macdL:_g('analMacdSlow'),macdS:_g('analMacdSignal'),
            rsi:_g('analRsiPeriod'),hPrin:_g('analAltPrincipal'),hMacd:_g('analAltMacd'),
            ttFs:_g('analTooltipFontSize'),
            bollP:_g('analBollPeriod'),bollD:_g('analBollDesvio'),
            stochK:_g('analStochK'),stochD:_g('analStochD'),
            atrP:_g('analAtrPeriod'),regLinP:_g('analRegLinPeriod'),
            fixo:_gc('analModoFixoToggle'),mm:_gc('analMediasToggle'),
            topo:_gc('analTopoFundoToggle'),rng:_gc('analRangeToggle'),
            showRsi:_gc('analShowRSI'),pct:_gc('analExibirValorToggle'),la:_gc('analLinhaAtualToggle'),
            showBoll:_gc('analShowBollinger'),showStoch:_gc('analShowStoch'),
            showATR:_gc('analShowATR'),showDiv:_gc('analShowDiv'),showRegLin:_gc('analShowRegLin'),
        }));
    }catch{}
}
 
function _analParsePlacar(str){
    if(!str||typeof str!=='string')return null;
    const m=str.match(/(\d+)\+?\s*[x\-]\s*(\d+)\+?/i);
    return m?[parseInt(m[1]),parseInt(m[2])]:null;
}
 
function analVerificarCondicao(jogo,tipo){
    const total=jogo.casa+jogo.fora,ambos=jogo.casa>0&&jogo.fora>0;
    switch(tipo){
        case 'over05':return total>0.5;case 'over15':return total>1.5;case 'over25':return total>2.5;case 'over35':return total>3.5;
        case 'under05':return total<0.5;case 'under15':return total<1.5;case 'under25':return total<2.5;case 'under35':return total<3.5;
        case 'ambas sim':return ambos;case 'ambas nao':return!ambos;
        case 'casa marca':return jogo.casa>0;case 'fora marca':return jogo.fora>0;
        case 'casa nao marca':return jogo.casa===0;case 'fora nao marca':return jogo.fora===0;
        case 'casa ft':return jogo.casa>jogo.fora;case 'empate ft':return jogo.casa===jogo.fora;case 'fora ft':return jogo.fora>jogo.casa;
        case 'casa ht':return jogo.casa_ht!=null?jogo.casa_ht>jogo.fora_ht:jogo.casa>jogo.fora;
        case 'empate ht':return jogo.casa_ht!=null?jogo.casa_ht===jogo.fora_ht:jogo.casa===jogo.fora;
        case 'fora ht':return jogo.casa_ht!=null?jogo.fora_ht>jogo.casa_ht:jogo.fora>jogo.casa;
        case '0 gol':return total===0;case '1 gol':return total===1;case '2 gols':return total===2;
        case '3 gols':return total===3;case '4 gols':return total===4;case '5+ gols':return total>=5;
        case 'casa_fora_ambas_sim':return jogo.casa!==jogo.fora&&ambos;
        case 'casa ft ambas sim':return jogo.casa>jogo.fora&&ambos;case 'casa ft ambas nao':return jogo.casa>jogo.fora&&!ambos;
        case 'fora ft ambas sim':return jogo.fora>jogo.casa&&ambos;case 'fora ft ambas nao':return jogo.fora>jogo.casa&&!ambos;
        case 'empate ambas sim':return jogo.casa===jogo.fora&&ambos;case 'empate ambas nao':return jogo.casa===jogo.fora&&!ambos;
        case 'ht 0 gol':return jogo.casa_ht!=null?jogo.casa_ht+jogo.fora_ht===0:false;
        case 'ht 1 gol':return jogo.casa_ht!=null?jogo.casa_ht+jogo.fora_ht===1:false;
        case 'ht 2 gols':return jogo.casa_ht!=null?jogo.casa_ht+jogo.fora_ht===2:false;
        case 'ht 3+ gols':return jogo.casa_ht!=null?jogo.casa_ht+jogo.fora_ht>=3:false;
        case 'ht under':{const ht=`${jogo.casa_ht}x${jogo.fora_ht}`;return['0x0','1x0','0x1'].includes(ht);}
        case 'ht over':{if(jogo.casa_ht==null)return true;const ht=`${jogo.casa_ht}x${jogo.fora_ht}`;return!['0x0','1x0','0x1'].includes(ht);}
        case 'ht 1x0':return jogo.casa_ht===1&&jogo.fora_ht===0;case 'ht 0x0':return jogo.casa_ht===0&&jogo.fora_ht===0;
        case 'ht 0x1':return jogo.casa_ht===0&&jogo.fora_ht===1;case 'ht 2x0':return jogo.casa_ht===2&&jogo.fora_ht===0;
        case 'ht 1x1':return jogo.casa_ht===1&&jogo.fora_ht===1;case 'ht 0x2':return jogo.casa_ht===0&&jogo.fora_ht===2;
        case 'ht out':{const ht=`${jogo.casa_ht}x${jogo.fora_ht}`;return!['1x0','0x0','0x1','2x0','1x1','0x2'].includes(ht);}
        case 'casa 0':return jogo.casa===0;case 'casa 1':return jogo.casa===1;case 'casa 2':return jogo.casa===2;case 'casa 3':return jogo.casa===3;case 'casa 4':return jogo.casa===4;
        case 'fora 0':return jogo.fora===0;case 'fora 1':return jogo.fora===1;case 'fora 2':return jogo.fora===2;case 'fora 3':return jogo.fora===3;case 'fora 4':return jogo.fora===4;
        case 'st 0 gol':return jogo.st_total===0;case 'st 1 gol':return jogo.st_total===1;case 'st 2 gols':return jogo.st_total===2;case 'st 3 gols':return jogo.st_total===3;case 'st 4 gols':return jogo.st_total===4;
        default:return false;
    }
}
 
function analCalcMA(pts,p){return pts.map((_,i)=>{const s=pts.slice(Math.max(0,i-p+1),i+1);return s.reduce((a,b)=>a+b,0)/s.length;});}
function analCalcRSI(pts,per=14){const g=[],p=[];for(let i=1;i<pts.length;i++){const d=pts[i]-pts[i-1];g.push(d>0?d:0);p.push(d<0?Math.abs(d):0);}const r=[];for(let i=per;i<g.length;i++){const mg=g.slice(i-per,i).reduce((a,b)=>a+b,0)/per,mp=p.slice(i-per,i).reduce((a,b)=>a+b,0)/per;r.push(100-100/(1+mg/(mp||1)));}return Array(per).fill(null).concat(r);}
function analCalcEMA(d,p){const k=2/(p+1),e=[d[0]];for(let i=1;i<d.length;i++)e.push(d[i]*k+e[i-1]*(1-k));return e;}
function analCalcMACD(d,r,l,s){const er=analCalcEMA(d,r),el=analCalcEMA(d,l),macd=er.map((v,i)=>v-el[i]),sig=analCalcEMA(macd,s);return{macd,sig,hist:macd.map((v,i)=>v-sig[i])};}
function _analAlpha(c,a){if(!c||typeof c!=='string')return c;if(c.startsWith('#')){const h=c.replace('#','');const n=parseInt(h.length===3?h.split('').map(x=>x+x).join(''):h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}return c;}

/* ── BOLLINGER BANDS ── */
function analCalcBollinger(pts,period=20,mult=2){
    const upper=[],lower=[],mid=[];
    for(let i=0;i<pts.length;i++){
        if(i<period-1){upper.push(null);lower.push(null);mid.push(null);continue;}
        const slice=pts.slice(i-period+1,i+1);
        const mean=slice.reduce((a,b)=>a+b,0)/period;
        const std=Math.sqrt(slice.reduce((s,v)=>s+(v-mean)**2,0)/period);
        mid.push(mean);upper.push(mean+mult*std);lower.push(mean-mult*std);
    }
    return{upper,lower,mid};
}

/* ── STOCHASTIC ── */
function analCalcStoch(pts,kPer=14,dPer=3){
    const k=[];
    for(let i=0;i<pts.length;i++){
        if(i<kPer-1){k.push(null);continue;}
        const slice=pts.slice(i-kPer+1,i+1);
        const lo=Math.min(...slice),hi=Math.max(...slice);
        k.push(hi===lo?50:(pts[i]-lo)/(hi-lo)*100);
    }
    const d=k.map((_,i)=>{
        const valid=k.slice(Math.max(0,i-dPer+1),i+1).filter(v=>v!==null);
        return valid.length===dPer?valid.reduce((a,b)=>a+b,0)/dPer:null;
    });
    return{k,d};
}

/* ── ATR (simulado via variação absoluta) ── */
function analCalcATR(pts,period=14){
    const tr=pts.map((v,i)=>i===0?0:Math.abs(v-pts[i-1]));
    return tr.map((_,i)=>{
        if(i<period)return null;
        return tr.slice(i-period+1,i+1).reduce((a,b)=>a+b,0)/period;
    });
}

/* ── REGRESSÃO LINEAR ── */
function analCalcRegLin(pts,period=20){
    const result=new Array(pts.length).fill(null);
    for(let i=period-1;i<pts.length;i++){
        const slice=pts.slice(i-period+1,i+1);
        const n=slice.length;
        const xs=[...Array(n).keys()];
        const mx=xs.reduce((a,b)=>a+b,0)/n,my=slice.reduce((a,b)=>a+b,0)/n;
        const num=xs.reduce((s,x,j)=>s+(x-mx)*(slice[j]-my),0);
        const den=xs.reduce((s,x)=>s+(x-mx)**2,0);
        const slope=den?num/den:0,intercept=my-slope*mx;
        result[i]=slope*(n-1)+intercept;
    }
    return result;
}

/* ── DETECTAR DIVERGÊNCIAS RSI/MACD ── */
function analDetectDivergencias(pts,rsi,macd){
    const divs=[];const win=5;
    for(let i=win;i<pts.length-1;i++){
        const pSlice=pts.slice(i-win,i+1),rSlice=rsi.slice(i-win,i+1),mSlice=macd.slice(i-win,i+1);
        if(pSlice.some(v=>v===null)||rSlice.some(v=>v===null)||mSlice.some(v=>v===null))continue;
        const pUp=pSlice[win]>pSlice[0],rUp=rSlice[win]>rSlice[0],mUp=mSlice[win]>mSlice[0];
        if(pUp&&!rUp)divs.push({idx:i,type:'bearish_rsi',label:'⚠ Div Bearish RSI'});
        else if(!pUp&&rUp)divs.push({idx:i,type:'bullish_rsi',label:'⚡ Div Bullish RSI'});
        else if(pUp&&!mUp)divs.push({idx:i,type:'bearish_macd',label:'⚠ Div Bearish MACD'});
        else if(!pUp&&mUp)divs.push({idx:i,type:'bullish_macd',label:'⚡ Div Bullish MACD'});
    }
    return divs;
}
 
/* Função auxiliar: converte hora+minuto em minuto absoluto para sincronismo seguro */
function _analToAbsMin(jogo){return(jogo.hora||0)*60+(jogo.minuto||0);}

async function analCarregarDados(){
    const json=await LigaDataManager.getResultados();
    ANAL_RESULTADOS=[];
    const sorted=[...json].sort((a,b)=>{const dA=new Date(a.data),dB=new Date(b.data);if(dA-dB!==0)return dB-dA;if(a.hora!==b.hora)return b.hora-a.hora;return b.minuto-a.minuto;});
    for(const item of sorted){
        if(ANAL_RESULTADOS.length>=480)break;
        const ft=_analParsePlacar(item.ft);if(!ft)continue;
        const ht=_analParsePlacar(item.ht);
        const[casa,fora]=ft;
        const casa_ht=ht?ht[0]:null,fora_ht=ht?ht[1]:null;
        const casa_st=ht?Math.max(0,casa-ht[0]):null,fora_st=ht?Math.max(0,fora-ht[1]):null;
        const st_total=casa_st!==null&&fora_st!==null?casa_st+fora_st:3;
        const absMin=_analToAbsMin({hora:item.hora,minuto:item.minuto});
        ANAL_RESULTADOS.push({casa,fora,casa_ht,fora_ht,st_total,hora:item.hora,minuto:item.minuto,absMin,ft_str:item.ft,ht_raw:item.ht,jogo_str:(item.time_a&&item.time_b)?`${item.time_a} x ${item.time_b}`:''});
    }
}
 
function analCriarLegenda(){
    const box=document.getElementById('analLegendaDinamica');if(!box)return;
    box.innerHTML='';
    Object.entries(ANAL_GRUPOS).forEach(([nome,tipos])=>{
        const bloco=document.createElement('div');bloco.className='pa-leg-bloco';
        const titulo=document.createElement('div');titulo.className='pa-leg-titulo';titulo.textContent=nome;bloco.appendChild(titulo);
        const itens=document.createElement('div');itens.className='pa-leg-itens';
        tipos.forEach(tipo=>{
            if(!ANAL_CORES[tipo])return;
            const item=document.createElement('div');
            item.className='pa-leg-item'+(analVisibilidade[tipo]?' ativo':'');
            item.dataset.tipo=tipo;
            const circ=document.createElement('span');circ.className='pa-leg-circulo';circ.style.background=ANAL_CORES[tipo];
            const txt=document.createElement('span');txt.textContent=tipo.replace(/_/g,' ').toUpperCase();
            item.appendChild(circ);item.appendChild(txt);
            item.addEventListener('click',()=>{analVisibilidade[tipo]=!analVisibilidade[tipo];item.classList.toggle('ativo',analVisibilidade[tipo]);analSaveVis();analAtualizarGrafico();});
            item.addEventListener('mouseenter',()=>{if(analVisibilidade[tipo])analSetHighlight(tipo);});
            item.addEventListener('mouseleave',()=>analSetHighlight(null));
            itens.appendChild(item);
        });
        bloco.appendChild(itens);box.appendChild(bloco);
    });
}
 
function analSetHighlight(tipo=null){
    if(!ANAL_CHART)return;
    ANAL_CHART.data.datasets.forEach(ds=>{
        if(!ds._orig)ds._orig={borderColor:ds.borderColor,borderWidth:ds.borderWidth,pointRadius:ds.pointRadius,order:ds.order??1};
        const isAlvo=tipo&&ds._tipo===tipo;
        if(tipo&&!isAlvo){ds.borderColor=_analAlpha(ds._orig.borderColor,0.1);ds.pointRadius=0;ds.borderWidth=1;ds.order=2;}
        else{ds.borderColor=ds._orig.borderColor;ds.pointRadius=ds._orig.pointRadius;ds.borderWidth=ds._orig.borderWidth;ds.order=ds._orig.order;if(isAlvo){ds.borderWidth=Math.max((ds._orig.borderWidth||1.5)+1.2,2.5);ds.order=0;}}
    });
    ANAL_CHART.update('none');
}
 
function _analJogoHoraAnterior(jogosSeq,idx){
    const ref=jogosSeq[idx];if(!ref)return null;
    const alvo={hora:ref.hora-1,minuto:ref.minuto};
    for(let k=0;k<jogosSeq.length;k++){const j=jogosSeq[k];if(j&&j.hora===alvo.hora&&j.minuto===alvo.minuto)return j;}
    return null;
}
 
function analAtualizarGrafico(){
    if(!ANAL_RESULTADOS.length)return;
    analSaveCfg();
    const qtd=parseInt(document.getElementById('analNumBlocos')?.value||'100');
    const linhasRange=parseInt(document.getElementById('analRangeQtd')?.value||'2');
    const periodoMA1=parseInt(document.getElementById('analMA1Period')?.value||'9');
    const periodoMA2=parseInt(document.getElementById('analMA2Period')?.value||'21');
    const mostrarMM=document.getElementById('analMediasToggle')?.checked??true;
    const mostrarTopoFundo=document.getElementById('analTopoFundoToggle')?.checked??true;
    const mostrarRange=document.getElementById('analRangeToggle')?.checked??true;
    const mostrarNumeros=document.getElementById('analExibirValorToggle')?.checked??true;
    const mostrarLinhaAtual=document.getElementById('analLinhaAtualToggle')?.checked??true;
    const modoFixo=document.getElementById('analModoFixoToggle')?.checked??true;
    const mostrarRSI=document.getElementById('analShowRSI')?.checked??false;
    const mostrarBollinger=document.getElementById('analShowBollinger')?.checked??false;
    const mostrarStoch=document.getElementById('analShowStoch')?.checked??false;
    const mostrarATR=document.getElementById('analShowATR')?.checked??false;
    const mostrarDiv=document.getElementById('analShowDiv')?.checked??false;
    const mostrarRegLin=document.getElementById('analShowRegLin')?.checked??false;
    const tooltipFontSize=parseInt(document.getElementById('analTooltipFontSize')?.value||String(ANAL_PADRAO.tooltipFontSize));
    const selFTVal=document.getElementById('analMercadoFT')?.value||'';
    const selHTVal=document.getElementById('analMercadoHT')?.value||'';
    const tipoFT=ANAL_SEL_TO_TIPO[selFTVal]||'';
    const tipoHT=ANAL_SEL_TO_TIPO[selHTVal]||'';
    const tipoLinha=tipoFT||tipoHT||'over25';
 
    if(!modoFixo&&!analVisibilidade[tipoLinha]){
        if(document.getElementById('analMediasToggle'))document.getElementById('analMediasToggle').checked=false;
        if(document.getElementById('analTopoFundoToggle'))document.getElementById('analTopoFundoToggle').checked=false;
        if(document.getElementById('analRangeToggle'))document.getElementById('analRangeToggle').checked=false;
    }
 
    const usados=ANAL_RESULTADOS.slice(0,qtd);
    const blocos=[],totalBlocos=Math.floor(usados.length/20);
    for(let i=0;i<totalBlocos;i++)blocos.push(usados.slice(i*20,i*20+20));
    if(!blocos.length)return;
 
    const datasets=[];
    let ma1=[],ma2=[],maxValor=0,minValor=0,contagem={},maisFrequentes=[];
 
    const tiposParaRenderizar=modoFixo?[tipoLinha]:Object.keys(ANAL_CORES).filter(t=>analVisibilidade[t]);
 
    function calcPtsIndicador(blocos,totalBlocos,getFn){
        const blocoMaisRecente=blocos[blocos.length-1];
        const med=blocoMaisRecente.reduce((s,j)=>s+getFn(j),0)/blocoMaisRecente.length;
        const pts=[med*20];
        for(let b=totalBlocos-2;b>=0;b--){
            for(let i=19;i>=0;i--){
                const atual=blocos[b][i];
                const ref=blocos[b+1][i];
                if(!atual||!ref)continue;
                const d=getFn(atual)-getFn(ref);
                pts.push(pts[pts.length-1]+d);
            }
        }
        return pts;
    }
 
    const TIPOS_GOLS=['Total Gols (FT)','Total Gols (HT)','Gols Casa (FT)','Gols Fora (FT)'];
 
    for(const tipo of tiposParaRenderizar){
        const bR=blocos[blocos.length-1];
        let pts;
        const isIndicador=TIPOS_GOLS.includes(tipo);
        if(tipo==='Total Gols (FT)'){pts=calcPtsIndicador(blocos,totalBlocos,j=>j.casa+j.fora);}
        else if(tipo==='Total Gols (HT)'){pts=calcPtsIndicador(blocos,totalBlocos,j=>(j.casa_ht??0)+(j.fora_ht??0));}
        else if(tipo==='Gols Casa (FT)'){pts=calcPtsIndicador(blocos,totalBlocos,j=>j.casa);}
        else if(tipo==='Gols Fora (FT)'){pts=calcPtsIndicador(blocos,totalBlocos,j=>j.fora);}
        else{
            const blocoMaisRecente=blocos[blocos.length-1];
            const totalCond=blocoMaisRecente.filter(j=>analVerificarCondicao(j,tipo)).length;
            pts=[totalCond/blocoMaisRecente.length*100];
            for(let b=totalBlocos-2;b>=0;b--){
                for(let i=19;i>=0;i--){
                    const atual=blocos[b][i];
                    const ref=blocos[b+1][i];
                    if(!atual||!ref)continue;
                    const a=analVerificarCondicao(atual,tipo);
                    const r=analVerificarCondicao(ref,tipo);
                    let delta=0;
                    if(a&&!r)delta=5;
                    else if(!a&&r)delta=-5;
                    pts.push(pts[pts.length-1]+delta);
                }
            }
        }
        if(tipo===tipoLinha&&(modoFixo||analVisibilidade[tipoLinha])){
            let pontosSelecionado_tmp=pts;
            /* guardado abaixo via referência — ver bloco pontosSelecionado */
            if(typeof window.__analPtsSel==='undefined')window.__analPtsSel=null;
            window.__analPtsSel=pontosSelecionado_tmp;
        } else {
            let cor=ANAL_CORES[tipo]||'#888';
            if(cor.toLowerCase()==='#ffff00')cor='#C6B74E';
            if(isIndicador){
                datasets.push({label:tipo.replace(/_/g,' ').toUpperCase(),data:pts,borderColor:cor,borderWidth:1.8,pointRadius:2,pointHoverRadius:4,pointBackgroundColor:'#1e1e1e',pointBorderColor:cor,fill:false,tension:0.1,order:1,_tipo:tipo,_isGols:true,_showPointLabels:mostrarNumeros});
            } else {
                datasets.push({label:tipo.replace(/_/g,' ').toUpperCase(),data:pts,borderColor:cor,borderWidth:1.5,pointRadius:2,pointHoverRadius:4,pointBackgroundColor:'#1e1e1e',pointBorderColor:cor,fill:false,tension:0.1,order:1,_tipo:tipo,_showPointLabels:mostrarNumeros});
            }
        }
    }
 
    /* Recupera pontos da linha selecionada */
    let pontosSelecionado=window.__analPtsSel||[];
    window.__analPtsSel=null;
 
    /* Recalcula pontosSelecionado direto (necessário para modoFixo) */
    if(modoFixo||analVisibilidade[tipoLinha]){
        const bR2=blocos[blocos.length-1];
        const isIndicadorSel=TIPOS_GOLS.includes(tipoLinha);
        if(isIndicadorSel){
            if(tipoLinha==='Total Gols (FT)')pontosSelecionado=calcPtsIndicador(blocos,totalBlocos,j=>j.casa+j.fora);
            else if(tipoLinha==='Total Gols (HT)')pontosSelecionado=calcPtsIndicador(blocos,totalBlocos,j=>(j.casa_ht??0)+(j.fora_ht??0));
            else if(tipoLinha==='Gols Casa (FT)')pontosSelecionado=calcPtsIndicador(blocos,totalBlocos,j=>j.casa);
            else if(tipoLinha==='Gols Fora (FT)')pontosSelecionado=calcPtsIndicador(blocos,totalBlocos,j=>j.fora);
        } else {
            const blocoMaisRecente=blocos[blocos.length-1];
            const totalCond2=blocoMaisRecente.filter(j=>analVerificarCondicao(j,tipoLinha)).length;
            pontosSelecionado=[totalCond2/blocoMaisRecente.length*100];
            for(let b=totalBlocos-2;b>=0;b--){
                for(let i=19;i>=0;i--){
                    const atual=blocos[b][i];
                    const ref=blocos[b+1][i];
                    if(!atual||!ref)continue;
                    const a=analVerificarCondicao(atual,tipoLinha);
                    const r=analVerificarCondicao(ref,tipoLinha);
                    let delta=0;
                    if(a&&!r)delta=5;
                    else if(!a&&r)delta=-5;
                    pontosSelecionado.push(pontosSelecionado[pontosSelecionado.length-1]+delta);
                }
            }
        }
    }
 
    if(pontosSelecionado.length>0){
        const isIndicadorSel=TIPOS_GOLS.includes(tipoLinha);
        if(isIndicadorSel){
            const ptBg=new Array(pontosSelecionado.length).fill('#1e1e1e');
            const ptBd=new Array(pontosSelecionado.length).fill('rgb(204,204,204)');
            datasets.push({label:tipoLinha.replace(/_/g,' ').toUpperCase(),data:pontosSelecionado,borderColor:'#fff',borderWidth:2.3,pointRadius:2,pointHoverRadius:4,pointBackgroundColor:ptBg,pointBorderColor:ptBd,fill:false,tension:0.1,order:0,_tipo:tipoLinha,_isGols:true,_showPointLabels:mostrarNumeros});
        } else {
            const pointBg=[],pointBorder=[];
            for(let b=totalBlocos-2;b>=0;b--){const mapa=new Map(blocos[b+1].map(j=>[j.minuto,j]));for(let i=blocos[b].length-1;i>=0;i--){const jA=blocos[b][i];if(!jA)continue;const jR=mapa.get(jA.minuto);if(!jR)continue;const a=analVerificarCondicao(jA,tipoLinha),r=analVerificarCondicao(jR,tipoLinha);if(a&&r){pointBg.push('#4CAF50');pointBorder.push('#4CAF50');}else if(!a&&!r){pointBg.push('#FF3B30');pointBorder.push('#FF3B30');}else{pointBg.push('#1e1e1e');pointBorder.push('rgb(204,204,204)');}}}
            pointBg.unshift('#1e1e1e');pointBorder.unshift('rgb(204,204,204)');
            datasets.push({label:tipoLinha.replace(/_/g,' ').toUpperCase(),data:pontosSelecionado,borderColor:'#fff',borderWidth:2.3,pointRadius:2.3,pointHoverRadius:2,pointBackgroundColor:pointBg,pointBorderColor:pointBorder,fill:false,tension:0.1,order:0,_tipo:tipoLinha,_showPointLabels:mostrarNumeros});
        }
        ma1=analCalcMA(pontosSelecionado,periodoMA1);
        ma2=analCalcMA(pontosSelecionado,periodoMA2);
        maxValor=Math.max(...pontosSelecionado);
        minValor=Math.min(...pontosSelecionado);
        pontosSelecionado.forEach(v=>{const a=Math.round(v);contagem[a]=(contagem[a]||0)+1;});
        maisFrequentes=Object.entries(contagem).sort((a,b)=>b[1]-a[1]).slice(0,linhasRange).map(e=>parseFloat(e[0]));
    }
 
    if(mostrarRSI&&pontosSelecionado.length>0){
        const rsiP=parseInt(document.getElementById('analRsiPeriod')?.value||'14');
        /* RSI na escala direita (position:'right') */
        datasets.push({label:`RSI(${rsiP})`,data:analCalcRSI(pontosSelecionado,rsiP),borderColor:'#facc15',borderWidth:0.9,pointRadius:0,fill:false,tension:0.1,yAxisID:'rsi',_tipo:'rsi'});
    }

    if(mostrarBollinger&&pontosSelecionado.length>0){
        const bP=parseInt(document.getElementById('analBollPeriod')?.value||'20');
        const bD=parseFloat(document.getElementById('analBollDesvio')?.value||'2');
        const{upper,lower,mid}=analCalcBollinger(pontosSelecionado,bP,bD);
        datasets.push({label:`BB Upper(${bP})`,data:upper,borderColor:'rgba(100,180,255,0.7)',borderWidth:1,borderDash:[4,3],pointRadius:0,fill:false,tension:0.1,_tipo:'boll'});
        datasets.push({label:`BB Mid(${bP})`,data:mid,borderColor:'rgba(100,180,255,0.4)',borderWidth:0.8,borderDash:[2,4],pointRadius:0,fill:false,tension:0.1,_tipo:'boll'});
        datasets.push({label:`BB Lower(${bP})`,data:lower,borderColor:'rgba(100,180,255,0.7)',borderWidth:1,borderDash:[4,3],pointRadius:0,fill:false,tension:0.1,_tipo:'boll'});
    }

    if(mostrarRegLin&&pontosSelecionado.length>0){
        const rlP=parseInt(document.getElementById('analRegLinPeriod')?.value||'20');
        datasets.push({label:`RegLin(${rlP})`,data:analCalcRegLin(pontosSelecionado,rlP),borderColor:'#a78bfa',borderWidth:1.5,borderDash:[6,3],pointRadius:0,fill:false,tension:0,_tipo:'reglin'});
    }
 
    if(mostrarMM&&pontosSelecionado.length>0){
        datasets.push({label:`MA(${periodoMA1})`,data:ma1,borderColor:'#00FF00',borderWidth:1.5,pointRadius:0,fill:false,tension:0.1,_tipo:'mm'});
        datasets.push({label:`MA(${periodoMA2})`,data:ma2,borderColor:'#FF0000',borderWidth:1.3,pointRadius:0,fill:false,tension:0.1,_tipo:'mm'});
    }
 
    /* Labels do eixo X: índice numérico simples (sem hora/minuto) */
    const labelsSeq=[];const jogosSeq=[];
    if(blocos.length>0){
        const bR=blocos[blocos.length-1],last=bR[bR.length-1];
        labelsSeq.push('');jogosSeq.push(last||null);
        for(let b=totalBlocos-2;b>=0;b--)for(let i=blocos[b].length-1;i>=0;i--){labelsSeq.push('');jogosSeq.push(blocos[b][i]||null);}
    }
    window.__analJogosSeq=jogosSeq;
 
    const scales={
        x:{
            ticks:{color:'#aaa',maxRotation:0,autoSkip:true,maxTicksLimit:30,display:false},
            grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5}
        },
        y:{ticks:{color:'#aaa',stepSize:5,padding:10},grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5},beginAtZero:false,afterFit(scale){scale.width=50;}},
        /* RSI: eixo direito com 0–100 em amarelo */
        rsi:{position:'right',min:0,max:100,grid:{drawOnChartArea:false},ticks:{color:'#facc15',mirror:false,stepSize:10,padding:20},weight:0,afterFit(scale){scale.width=48;}}
    };
 
    const picoValePlugin={id:'aPV',afterDraw(chart){
        if(!mostrarTopoFundo||pontosSelecionado.length===0)return;
        const{ctx,chartArea,scales}=chart;if(!chartArea||!scales.y)return;
        const yS=scales.y,{left,right}=chartArea;
        [[maxValor,'rgba(76,175,80,0.7)','',-14],[minValor,'rgba(229,115,115,0.7)','',14]].forEach(([val,cor,label,yAdj])=>{
            const yPx=yS.getPixelForValue(val);
            if(!isFinite(yPx)||yPx<chartArea.top||yPx>chartArea.bottom)return;
            ctx.save();
            ctx.beginPath();ctx.setLineDash([6,6]);ctx.lineWidth=1;ctx.strokeStyle=cor;
            ctx.moveTo(left,yPx);ctx.lineTo(right,yPx);ctx.stroke();ctx.setLineDash([]);
            ctx.font='bold 11px JetBrains Mono,monospace';ctx.fillStyle=cor;
            ctx.textBaseline='middle';ctx.textAlign='left';
            ctx.fillText(label,right+4,yPx+yAdj);
            ctx.restore();
        });
    }};
 
    const rangePlugin={id:'aRng',afterDraw(chart){
        if(!mostrarRange||maisFrequentes.length===0)return;
        const{ctx,chartArea,scales}=chart;if(!chartArea||!scales.y)return;
        const yS=scales.y,{left,right}=chartArea;
        maisFrequentes.forEach(nivel=>{
            const yPx=yS.getPixelForValue(nivel);
            if(!isFinite(yPx)||yPx<chartArea.top||yPx>chartArea.bottom)return;
            ctx.save();
            ctx.beginPath();ctx.setLineDash([4,4]);ctx.lineWidth=1;ctx.strokeStyle='rgba(255,215,0,0.9)';
            ctx.moveTo(left,yPx);ctx.lineTo(right,yPx);ctx.stroke();ctx.setLineDash([]);
            const txt=nivel.toFixed(0)+'%';
            ctx.font='bold 9px JetBrains Mono,monospace';
            const bw=ctx.measureText(txt).width+8;
            ctx.fillStyle='rgba(255,215,0,0.15)';ctx.fillRect(right+2,yPx-7,bw,14);
            ctx.strokeStyle='rgba(255,215,0,0.5)';ctx.lineWidth=1;ctx.strokeRect(right+2,yPx-7,bw,14);
            ctx.fillStyle='rgba(255,215,0,0.9)';ctx.textBaseline='middle';ctx.textAlign='left';
            ctx.fillText(txt,right+6,yPx);
            ctx.restore();
        });
    }};
 
    const rotulosPlugin={id:'aRot',afterDatasetsDraw(chart){if(!mostrarNumeros)return;chart.data.datasets.forEach((ds,i)=>{if(!ds._showPointLabels||ds._tipo==='mm'||ds._tipo==='rsi'||!chart.isDatasetVisible(i))return;const meta=chart.getDatasetMeta(i);const{ctx,chartArea}=chart;if(!chartArea)return;meta.data.forEach((pt,j)=>{const val=ds.data[j];if(val===null||val===undefined)return;ctx.save();ctx.font='bold 9px JetBrains Mono,monospace';ctx.fillStyle=typeof ds.borderColor==='string'?ds.borderColor:'#fff';ctx.textAlign='center';ctx.textBaseline='bottom';const txt=String(Math.round(val));ctx.fillText(txt,pt.x,pt.y-4);ctx.restore();});});}};
 
    const referenciaPlugin={id:'aLA',afterDraw(chart){if(!mostrarLinhaAtual)return;const{ctx,chartArea,scales}=chart;if(!chartArea||!scales.y)return;const yS=scales.y,{left,right,top,bottom}=chartArea,PAD=5,H=16;const entries=[];chart.data.datasets.forEach((ds,i)=>{if(ds._tipo==='mm'||ds._tipo==='rsi'||!chart.isDatasetVisible(i))return;const arr=ds.data;if(!arr?.length)return;let last=null;for(let k=arr.length-1;k>=0;k--){if(arr[k]!==null&&arr[k]!==undefined&&isFinite(arr[k])){last=arr[k];break;}}if(last===null)return;const yPx=yS.getPixelForValue(last);if(!isFinite(yPx)||yPx<top||yPx>bottom)return;entries.push({y:yPx,val:last,color:typeof ds.borderColor==='string'?ds.borderColor:'#fff',isGols:!!ds._isGols});});entries.sort((a,b)=>a.y-b.y);const placed=[];ctx.save();entries.forEach(({y,val,color,isGols})=>{ctx.beginPath();ctx.setLineDash([4,4]);ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.strokeStyle=color;ctx.lineWidth=0.7;ctx.globalAlpha=0.5;ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;let ly=y;if(placed.some(py=>Math.abs(py-ly)<H+PAD)){const cl=placed.reduce((best,py)=>Math.abs(py-y)<Math.abs(best-y)?py:best,placed[0]||y);ly=cl+(H+PAD);}placed.push(ly);const txt=String(Math.round(val));const tw=ctx.measureText?ctx.measureText(txt).width:24;const bx=right+2,bw=tw+8;ctx.fillStyle='rgba(8,9,15,0.9)';ctx.fillRect(bx,ly-H/2,bw,H);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeRect(bx,ly-H/2,bw,H);ctx.fillStyle=color;ctx.font='bold 9px JetBrains Mono,monospace';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText(txt,bx+4,ly);});ctx.restore();}};
 
    const crosshairPlugin={id:'aCH',afterDraw(chart){if(window._analCHIdx==null)return;const{ctx,chartArea,scales}=chart;if(!chartArea||!scales.x)return;const x=scales.x.getPixelForValue(window._analCHIdx);if(!isFinite(x)||x<chartArea.left||x>chartArea.right)return;ctx.save();ctx.beginPath();ctx.moveTo(x,chartArea.top);ctx.lineTo(x,chartArea.bottom);ctx.strokeStyle='rgba(255,255,255,0.18)';ctx.lineWidth=1;ctx.stroke();ctx.restore();}};
 
    /* Plugin de Divergências */
    const divergenciasPlugin={id:'aDiv',afterDatasetsDraw(chart){
        if(!mostrarDiv||pontosSelecionado.length<10)return;
        const rsiP=parseInt(document.getElementById('analRsiPeriod')?.value||'14');
        const macdR=parseInt(document.getElementById('analMacdFast')?.value||'9');
        const macdL=parseInt(document.getElementById('analMacdSlow')?.value||'21');
        const macdS=parseInt(document.getElementById('analMacdSignal')?.value||'8');
        const rsiVals=analCalcRSI(pontosSelecionado,rsiP);
        const{macd}=analCalcMACD(pontosSelecionado,macdR,macdL,macdS);
        const divs=analDetectDivergencias(pontosSelecionado,rsiVals,macd);
        const{ctx,chartArea,scales}=chart;if(!chartArea||!scales.x||!scales.y)return;
        divs.forEach(div=>{
            const x=scales.x.getPixelForValue(div.idx);
            if(!isFinite(x)||x<chartArea.left||x>chartArea.right)return;
            const isBull=div.type.startsWith('bullish');
            const yPx=isBull?chartArea.bottom-8:chartArea.top+8;
            ctx.save();
            ctx.font='bold 9px monospace';
            ctx.fillStyle=isBull?'rgba(74,222,128,0.9)':'rgba(248,113,113,0.9)';
            ctx.textAlign='center';ctx.textBaseline=isBull?'bottom':'top';
            ctx.fillText(isBull?'▲':'▼',x,yPx);
            ctx.restore();
        });
    }};

    if(ANAL_CHART)ANAL_CHART.destroy();
    const canvasMkt=document.getElementById('analMercadosCanvas');if(!canvasMkt)return;
 
    Chart.Tooltip.positioners.analSeguir=function(els){
        if(!els||!els.length)return false;
        const chart=this.chart;const area=chart?.chartArea;if(!chart||!area)return false;
        const el=els[0].element;const baseX=el.x;const baseY=el.y;
        const ttW=this.width||200;const ttH=this.height||100;const DX=35;const pad=12;
        let x,al;
        if(baseX-DX-ttW>=area.left+pad){x=baseX-DX-ttW;al='right';}else{x=baseX+DX;al='left';}
        x=Math.max(area.left+pad,Math.min(x,area.right-ttW-pad));
        let y=baseY;y=Math.max(area.top+pad,Math.min(y,area.bottom-ttH-pad));
        try{chart.options.plugins.tooltip.xAlign=al;chart.options.plugins.tooltip.yAlign='top';}catch{}
        return{x,y};
    };
 
    ANAL_CHART=new Chart(canvasMkt.getContext('2d'),{
        type:'line',
        data:{labels:labelsSeq,datasets},
        options:{
            responsive:true,maintainAspectRatio:false,animation:false,
            interaction:{mode:'index',intersect:false},
            layout:{padding:{left:0,right:36}},
            plugins:{
                legend:{display:false},
                tooltip:{
                    enabled:true,mode:'index',intersect:false,
                    position:'analSeguir',
                    xAlign:'left',yAlign:'top',
                    backgroundColor:'rgba(15,15,15,0.97)',
                    titleColor:'#e5e7eb',bodyColor:'#c8cdd8',
                    borderColor:'rgba(180,180,180,0.15)',borderWidth:1,
                    padding:{x:10,y:8},cornerRadius:7,
                    caretPadding:0,caretSize:0,displayColors:false,
                    titleFont:{size:tooltipFontSize,weight:'700',family:"'Roboto Mono','Courier New',monospace"},
                    bodyFont:{size:tooltipFontSize-1,weight:'500',family:"'Roboto Mono','Courier New',monospace"},
                    callbacks:{
                        title:items=>{
                            const it=items?.[0];
                            const idx=it?.dataIndex??null;
                            const j=Number.isInteger(idx)?window.__analJogosSeq?.[idx]:null;
                            const linhas=[];
                            const jogo=(j?.jogo_str||'').trim();
                            if(jogo){
                                const h=j?.hora!=null?String(j.hora).padStart(2,'0'):null;
                                const m=j?.minuto!=null?String(j.minuto).padStart(2,'0'):null;
                                if(h&&m)linhas.push(`\u23F0 ${h}:${m}`);
                                linhas.push(jogo);
                            }
                            const ft=j?.ft_str?`FT: ${j.ft_str}`:'';
                            const ht=j?.ht_raw?`HT: ${j.ht_raw}`:'';
                            const placar=[ft,ht].filter(Boolean).join('  |  ');
                            if(placar)linhas.push(placar);
                            if(Number.isInteger(idx)&&window.__analJogosSeq){
                                const jAntes=_analJogoHoraAnterior(window.__analJogosSeq,idx);
                                if(jAntes){
                                    const ftA=jAntes.ft_str?`FT: ${jAntes.ft_str}`:'';
                                    const htA=jAntes.ht_raw?`HT: ${jAntes.ht_raw}`:'';
                                    const placarA=[ftA,htA].filter(Boolean).join(' | ');
                                    if(placarA)linhas.push(`\u2190 ${placarA}`);
                                }
                            }
                            return linhas.length?linhas:'';
                        }
                    }
                },
                aRot:{},aLA:{},aCH:{}
            },
            scales
        },
        plugins:[rotulosPlugin,referenciaPlugin,crosshairPlugin,_analDraggablePlugin,picoValePlugin,rangePlugin,divergenciasPlugin]
    });
 
    _analSetAlturas();
    window.analChart=ANAL_CHART;
    _analInitDrag(ANAL_CHART);
    analAtualizarMACD(pontosSelecionado,labelsSeq,tooltipFontSize);
    analAtualizarStoch(pontosSelecionado,labelsSeq,tooltipFontSize,mostrarStoch);
    analAtualizarATRChart(pontosSelecionado,labelsSeq,tooltipFontSize,mostrarATR);
    _analWireCrosshair();
}
 
/* ── DRAG LINES ── */
const ANAL_DRAG_KEY_BASE='analDrag:v1';
let _analDragLines=[];
 
function _analGetDragKey(){
    try{
        const el=document.querySelector('[data-panalitico]');
        let node=el?.parentElement;
        while(node&&node!==document.body){
            const h4=node.querySelector('h4.custom-color');
            if(h4){const name=h4.textContent.trim().replace(/\s+/g,'_').toLowerCase();if(name)return `${ANAL_DRAG_KEY_BASE}:${name}`;}
            node=node.parentElement;
        }
        const allH4=[...document.querySelectorAll('h4.custom-color')];
        const panEl=document.querySelector('[data-panalitico]');
        if(panEl&&allH4.length){
            let best=null;
            for(const h of allH4){if(h.compareDocumentPosition(panEl)&Node.DOCUMENT_POSITION_FOLLOWING)best=h;}
            if(best){const name=best.textContent.trim().replace(/\s+/g,'_').toLowerCase();if(name)return `${ANAL_DRAG_KEY_BASE}:${name}`;}
        }
    }catch{}
    return ANAL_DRAG_KEY_BASE;
}
 
function _analLoadDrag(){try{const key=_analGetDragKey();const a=JSON.parse(localStorage.getItem(key)||'[]');_analDragLines=Array.isArray(a)?a.map(l=>({y:Number(l.y),color:l.color||'#3b82f6',dragging:false})):[];}catch{_analDragLines=[];}}
function _analSaveDrag(){try{localStorage.setItem(_analGetDragKey(),JSON.stringify(_analDragLines.map(l=>({y:l.y,color:l.color}))));}catch{}}
function _analUpdateDragCounter(){const el=document.getElementById('analContadorLinhas');if(el)el.textContent=`${_analDragLines.length} / 6 níveis`;}
 
const _analDraggablePlugin={
    id:'analDrag',
    afterDatasetsDraw(chart){
        const yS=chart.scales.y;
        if(!yS||!_analDragLines.length||!chart.chartArea)return;
        const{ctx,chartArea}=chart;const{left,right}=chartArea;
        _analDragLines.forEach((l,idx)=>{
            const yPx=yS.getPixelForValue(l.y);if(!Number.isFinite(yPx))return;
            ctx.save();
            const isSel=idx===chart._analSelectedLine;
            ctx.beginPath();ctx.setLineDash(isSel?[4,2]:[]);ctx.lineWidth=isSel?1.2:0.6;
            ctx.strokeStyle=l.color||'#3b82f6';ctx.moveTo(left,yPx);ctx.lineTo(right,yPx);ctx.stroke();ctx.setLineDash([]);
            const label=String(Math.round(l.y));
            ctx.font='10px JetBrains Mono,monospace';ctx.textBaseline='middle';
            const padX=4,textW=ctx.measureText(label).width,boxW=textW+padX*2,boxH=14;
            const bx=right+8,by=yPx-boxH/2;
            ctx.fillStyle='rgba(15,23,42,0.95)';ctx.fillRect(bx,by,boxW,boxH);
            ctx.strokeStyle=l.color||'#3b82f6';ctx.lineWidth=1;ctx.strokeRect(bx,by,boxW,boxH);
            ctx.fillStyle=l.color||'#3b82f6';ctx.fillText(label,bx+padX,yPx);
            ctx.restore();
        });
    }
};
 
function _analInitDrag(chart){
    const canvas=chart.canvas;
    if(canvas.__adDown)canvas.removeEventListener('mousedown',canvas.__adDown);
    if(canvas.__adMove)canvas.removeEventListener('mousemove',canvas.__adMove);
    if(canvas.__adUp)canvas.removeEventListener('mouseup',canvas.__adUp);
    if(canvas.__adLeave)canvas.removeEventListener('mouseleave',canvas.__adLeave);
    const HIT=8;let draggingIndex=-1;chart._analSelectedLine=-1;
    const getY=(e)=>{const r=canvas.getBoundingClientRect();return e.clientY-r.top;};
    const nearestIdx=(pxY)=>{const yS=chart.scales.y;if(!yS||!chart.chartArea)return -1;const{top,bottom}=chart.chartArea;let best=-1,bestD=Infinity;_analDragLines.forEach((l,i)=>{const ly=yS.getPixelForValue(l.y);if(ly<top||ly>bottom)return;const d=Math.abs(ly-pxY);if(d<bestD&&d<=HIT){bestD=d;best=i;}});return best;};
    canvas.__adDown=function(e){const pxY=getY(e);const idx=nearestIdx(pxY);if(idx>=0){if(e.cancelable)e.preventDefault();draggingIndex=idx;_analDragLines[idx].dragging=true;chart._analSelectedLine=idx;chart.update('none');}else{chart._analSelectedLine=-1;chart.update('none');}};
    canvas.__adMove=function(e){if(draggingIndex<0)return;if(e.cancelable)e.preventDefault();const yS=chart.scales.y;if(!yS)return;let newVal=yS.getValueForPixel(getY(e));if(Number.isFinite(yS.min)&&Number.isFinite(yS.max))newVal=Math.max(yS.min,Math.min(yS.max,newVal));_analDragLines[draggingIndex].y=newVal;chart.update('none');};
    const stop=function(){if(draggingIndex>=0&&_analDragLines[draggingIndex]){_analDragLines[draggingIndex].dragging=false;_analSaveDrag();}draggingIndex=-1;};
    canvas.__adUp=stop;canvas.__adLeave=stop;
    canvas.addEventListener('mousedown',canvas.__adDown);canvas.addEventListener('mousemove',canvas.__adMove);
    window.addEventListener('mouseup',stop);canvas.addEventListener('mouseleave',canvas.__adLeave);
}
 
window.analAdicionarLinha=function(){
    if(_analDragLines.length>=6)return;
    const color=document.getElementById('analLineColorPicker')?.value||'#3b82f6';
    if(!ANAL_CHART)return;
    const yS=ANAL_CHART.scales.y;const mid=yS?Math.round((yS.min+yS.max)/2):50;
    _analDragLines.push({y:mid,color,dragging:false});
    ANAL_CHART._analSelectedLine=_analDragLines.length-1;
    _analSaveDrag();_analUpdateDragCounter();ANAL_CHART.update('none');
};
window.analDeletarLinha=function(){
    if(!ANAL_CHART)return;const sel=ANAL_CHART._analSelectedLine;
    if(sel<0||sel>=_analDragLines.length)return;
    _analDragLines.splice(sel,1);ANAL_CHART._analSelectedLine=-1;
    _analSaveDrag();_analUpdateDragCounter();ANAL_CHART.update('none');
};
window.analLimparLinhas=function(){
    _analDragLines=[];if(ANAL_CHART)ANAL_CHART._analSelectedLine=-1;
    _analSaveDrag();_analUpdateDragCounter();ANAL_CHART?.update('none');
};
 
/* ── MACD: histograma + linha MACD (azul) + linha Sinal (laranja, sem tracejado) ── */
function analAtualizarMACD(pontos,labels,tooltipFontSize=11){
    const canvasMacd=document.getElementById('analMacdCanvas');if(!canvasMacd)return;
    if(!pontos||!pontos.length)return;
    const r=parseInt(document.getElementById('analMacdFast')?.value||'9');
    const l=parseInt(document.getElementById('analMacdSlow')?.value||'21');
    const s=parseInt(document.getElementById('analMacdSignal')?.value||'8');
    const{macd,sig,hist}=analCalcMACD(pontos,r,l,s);
    const hc=hist.map((v,i)=>{const p=i>0?hist[i-1]:0;if(v>=0)return v>=p?'rgba(0,229,160,0.9)':'rgba(0,229,160,0.4)';return v<=p?'rgba(255,63,91,0.9)':'rgba(255,63,91,0.4)';});
    const datasets=[
        {label:'Histograma',data:hist,type:'bar',backgroundColor:hc,barThickness:4,borderSkipped:false,order:3},
        /* linha MACD: azul */
        {label:'MACD',data:macd,type:'line',borderColor:'#ffffff',borderWidth:1.8,pointRadius:0,tension:0.15,fill:false,order:2},
        /* linha Sinal: laranja, SEM tracejado */
        {label:'Sinal',data:sig,type:'line',borderColor:'#facc15',borderDash:[],borderWidth:1.5,pointRadius:0,tension:0.15,fill:false,order:1}
    ];
    const ch2={id:'aCH2',afterDraw(chart){if(window._analCHIdx==null)return;const{ctx,chartArea,scales}=chart;if(!chartArea||!scales.x)return;const x=scales.x.getPixelForValue(window._analCHIdx);if(!isFinite(x)||x<chartArea.left||x>chartArea.right)return;ctx.save();ctx.beginPath();ctx.moveTo(x,chartArea.top);ctx.lineTo(x,chartArea.bottom);ctx.strokeStyle='rgba(255,255,255,0.18)';ctx.lineWidth=1;ctx.stroke();ctx.restore();}};
    if(ANAL_MACD_CHART)ANAL_MACD_CHART.destroy();
    ANAL_MACD_CHART=new Chart(canvasMacd.getContext('2d'),{
        type:'bar',data:{labels,datasets},
        options:{
            responsive:true,maintainAspectRatio:false,animation:false,
            interaction:{mode:'index',intersect:false},
            layout:{padding:{left:0,right:36,top:0,bottom:0}},
            plugins:{
                legend:{display:false},
                tooltip:{
                    enabled:true,mode:'index',intersect:false,
                    position:'analSeguir',
                    xAlign:'left',yAlign:'top',
                    backgroundColor:'rgba(15,15,15,0.97)',
                    titleColor:'#e5e7eb',bodyColor:'#c8cdd8',
                    borderColor:'rgba(180,180,180,0.15)',borderWidth:1,
                    padding:{x:10,y:8},cornerRadius:7,
                    caretPadding:0,caretSize:0,displayColors:true,
                    titleFont:{size:tooltipFontSize,weight:'700',family:"'Roboto Mono','Courier New',monospace"},
                    bodyFont:{size:tooltipFontSize-1,weight:'500',family:"'Roboto Mono','Courier New',monospace"},
                    callbacks:{
                        title:items=>{
                            const it=items?.[0];const idx=it?.dataIndex??null;
                            const j=Number.isInteger(idx)?window.__analJogosSeq?.[idx]:null;
                            const linhas=[];
                            const jogo=(j?.jogo_str||'').trim();
                            if(jogo){
                                const h=j?.hora!=null?String(j.hora).padStart(2,'0'):null;
                                const m=j?.minuto!=null?String(j.minuto).padStart(2,'0'):null;
                                if(h&&m)linhas.push(`\u23F0 ${h}:${m}`);
                                linhas.push(jogo);
                            }
                            const ft=j?.ft_str?`FT: ${j.ft_str}`:'';const ht=j?.ht_raw?`HT: ${j.ht_raw}`:'';
                            const placar=[ft,ht].filter(Boolean).join('  |  ');if(placar)linhas.push(placar);
                            if(Number.isInteger(idx)&&window.__analJogosSeq){
                                const jAntes=_analJogoHoraAnterior(window.__analJogosSeq,idx);
                                if(jAntes){const ftA=jAntes.ft_str?`FT: ${jAntes.ft_str}`:'';const htA=jAntes.ht_raw?`HT: ${jAntes.ht_raw}`:'';const placarA=[ftA,htA].filter(Boolean).join(' | ');if(placarA)linhas.push(`\u2190 ${placarA}`);}
                            }
                            return linhas.length?linhas:'';
                        },
                        label:c=>{const v=c.parsed.y;if(v==null)return'';return`■ ${c.dataset.label}: ${v.toFixed(3)}`;},labelColor:c=>{const col=typeof c.dataset.borderColor==='string'?c.dataset.borderColor:'#aaa';return{borderColor:col,backgroundColor:col,borderWidth:0};}
                    }
                },
                aCH2:{}
            },
            scales:{
                y:{ticks:{color:'#aaa'},grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5},afterFit(scale){scale.width=50;}},
                x:{min:0,ticks:{color:'#aaa',display:false},grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5}}
            }
        },
        plugins:[ch2,_analVerticalHoverPlugin]
    });
}
 
/* ── ESTOCÁSTICO ── */
let ANAL_STOCH_CHART=null;
function analAtualizarStoch(pontos,labels,tooltipFontSize=11,ativo=false){
    const wrap=document.getElementById('analStochWrap');
    if(!wrap)return;
    if(!ativo||!pontos||!pontos.length){
        wrap.style.display='none';wrap.style.height='0';
        if(ANAL_STOCH_CHART){ANAL_STOCH_CHART.destroy();ANAL_STOCH_CHART=null;}
        return;
    }
    wrap.style.display='block';wrap.style.height='110px';
    const kP=parseInt(document.getElementById('analStochK')?.value||'14');
    const dP=parseInt(document.getElementById('analStochD')?.value||'3');
    const{k,d}=analCalcStoch(pontos,kP,dP);
    const canv=document.getElementById('analStochCanvas');if(!canv)return;
    if(ANAL_STOCH_CHART)ANAL_STOCH_CHART.destroy();
    ANAL_STOCH_CHART=new Chart(canv.getContext('2d'),{
        type:'line',data:{labels,datasets:[
            {label:`%K(${kP})`,data:k,borderColor:'#34d399',borderWidth:1.5,pointRadius:0,fill:false,tension:0.15},
            {label:`%D(${dP})`,data:d,borderColor:'#f97316',borderWidth:1.2,pointRadius:0,fill:false,tension:0.15}
        ]},
        options:{
            responsive:true,maintainAspectRatio:false,animation:false,
            interaction:{mode:'index',intersect:false},
            layout:{padding:{left:0,right:36,top:4,bottom:0}},
            plugins:{
                legend:{display:false},
                tooltip:{enabled:true,mode:'index',intersect:false,backgroundColor:'rgba(15,15,15,0.97)',titleColor:'#e5e7eb',bodyColor:'#c8cdd8',borderColor:'rgba(180,180,180,0.15)',borderWidth:1,padding:{x:8,y:6},cornerRadius:6,caretSize:0,
                    titleFont:{size:tooltipFontSize,weight:'700',family:"'Roboto Mono','Courier New',monospace"},
                    bodyFont:{size:tooltipFontSize-1,weight:'500',family:"'Roboto Mono','Courier New',monospace"},
                    callbacks:{label:c=>`■ ${c.dataset.label}: ${(c.parsed.y??0).toFixed(1)}`,labelColor:c=>({borderColor:c.dataset.borderColor,backgroundColor:c.dataset.borderColor,borderWidth:0})}
                },
                annotation:{},
            },
            scales:{
                x:{min:0,ticks:{display:false},grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5}},
                y:{min:0,max:100,ticks:{color:'#aaa',stepSize:20},grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5},afterFit(s){s.width=50;}}
            }
        },
        plugins:[{id:'stochZones',afterDraw(chart){
            const{ctx,chartArea,scales}=chart;if(!chartArea||!scales.y)return;
            const yS=scales.y,{left,right}=chartArea;
            [[80,'rgba(248,113,113,0.07)'],[20,'rgba(74,222,128,0.07)']].forEach(([lvl,color])=>{
                const yPx=yS.getPixelForValue(lvl);ctx.save();
                ctx.beginPath();ctx.setLineDash([4,4]);ctx.lineWidth=0.8;ctx.strokeStyle=lvl===80?'rgba(248,113,113,0.5)':'rgba(74,222,128,0.5)';
                ctx.moveTo(left,yPx);ctx.lineTo(right,yPx);ctx.stroke();ctx.setLineDash([]);ctx.restore();
            });
        }}]
    });
}

/* ── ATR ── */
let ANAL_ATR_CHART=null;
function analAtualizarATRChart(pontos,labels,tooltipFontSize=11,ativo=false){
    const wrap=document.getElementById('analAtrWrap');
    if(!wrap)return;
    if(!ativo||!pontos||!pontos.length){
        wrap.style.display='none';wrap.style.height='0';
        if(ANAL_ATR_CHART){ANAL_ATR_CHART.destroy();ANAL_ATR_CHART=null;}
        return;
    }
    wrap.style.display='block';wrap.style.height='90px';
    const atrP=parseInt(document.getElementById('analAtrPeriod')?.value||'14');
    const atr=analCalcATR(pontos,atrP);
    const canv=document.getElementById('analAtrCanvas');if(!canv)return;
    const colors=atr.map((v,i)=>{if(v===null)return'rgba(251,191,36,0.3)';const prev=atr.slice(0,i).filter(x=>x!==null).pop()??v;return v>prev?'rgba(248,113,113,0.8)':'rgba(74,222,128,0.8)';});
    if(ANAL_ATR_CHART)ANAL_ATR_CHART.destroy();
    ANAL_ATR_CHART=new Chart(canv.getContext('2d'),{
        type:'bar',data:{labels,datasets:[{label:`ATR(${atrP})`,data:atr,backgroundColor:colors,barThickness:3,borderSkipped:false}]},
        options:{
            responsive:true,maintainAspectRatio:false,animation:false,
            interaction:{mode:'index',intersect:false},
            layout:{padding:{left:0,right:36,top:4,bottom:0}},
            plugins:{
                legend:{display:false},
                tooltip:{enabled:true,mode:'index',intersect:false,backgroundColor:'rgba(15,15,15,0.97)',titleColor:'#e5e7eb',bodyColor:'#c8cdd8',borderColor:'rgba(180,180,180,0.15)',borderWidth:1,padding:{x:8,y:6},cornerRadius:6,caretSize:0,
                    titleFont:{size:tooltipFontSize,weight:'700',family:"'Roboto Mono','Courier New',monospace"},
                    bodyFont:{size:tooltipFontSize-1,weight:'500',family:"'Roboto Mono','Courier New',monospace"},
                    callbacks:{label:c=>`■ ATR(${atrP}): ${(c.parsed.y??0).toFixed(2)}`}
                }
            },
            scales:{
                x:{min:0,ticks:{display:false},grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5}},
                y:{ticks:{color:'#aaa'},grid:{color:'rgba(255,255,255,0.04)',lineWidth:0.5},afterFit(s){s.width=50;}}
            }
        }
    });
}

const _analVerticalHoverPlugin={id:'aVHO',afterDraw(chart){if(!chart.tooltip||!chart.tooltip._active||chart.tooltip._active.length===0)return;const ctx=chart.ctx;const active=chart.tooltip._active[0];const x=active.element.x;const{top,bottom}=chart.chartArea;ctx.save();ctx.beginPath();ctx.rect(x-5,top,10,bottom-top);ctx.fillStyle='rgba(255,255,255,0.07)';ctx.fill();ctx.restore();}};
Chart.register(_analVerticalHoverPlugin);
 
window._analCHIdx=null;
function _analWireCrosshair(){
    if(!ANAL_CHART||!ANAL_MACD_CHART)return;
    const allCharts=()=>[ANAL_CHART,ANAL_MACD_CHART,ANAL_STOCH_CHART,ANAL_ATR_CHART].filter(Boolean);
    let syncing=false;
    function getIdx(chart,e){const pts=chart.getElementsAtEventForMode(e,'index',{intersect:false},true);return pts?.[0]?.index??null;}
    function activate(chart,idx){if(idx==null)return;const active=[];for(let di=0;di<chart.data.datasets.length;di++){const meta=chart.getDatasetMeta(di);if(!meta||meta.hidden)continue;if(meta.data[idx])active.push({datasetIndex:di,index:idx});}chart.setActiveElements(active);const x=chart.scales.x?.getPixelForValue(idx)||0;chart.tooltip?.setActiveElements(active,{x,y:chart.chartArea?.top||0});window._analCHIdx=idx;chart.update('none');}
    function clearAll(){allCharts().forEach(c=>{c.setActiveElements([]);c.tooltip?.setActiveElements([],{x:0,y:0});c.update('none');});window._analCHIdx=null;}
    allCharts().forEach(src=>{
        const c=src.canvas;
        if(c.__amMv)c.removeEventListener('mousemove',c.__amMv);
        if(c.__amLv)c.removeEventListener('mouseleave',c.__amLv);
        c.__amMv=e=>{if(syncing)return;syncing=true;try{const idx=getIdx(src,e);if(idx===null)clearAll();else allCharts().forEach(dst=>activate(dst,idx));}finally{syncing=false;}};
        c.__amLv=()=>clearAll();
        c.addEventListener('mousemove',c.__amMv,{passive:true});
        c.addEventListener('mouseleave',c.__amLv,{passive:true});
    });
}
 
function _analSetAlturas(){const hP=parseInt(document.getElementById('analAltPrincipal')?.value||'270',10);const hM=parseInt(document.getElementById('analAltMacd')?.value||'135',10);const wP=document.getElementById('analMercadosWrap');const wM=document.getElementById('analMacdWrap');if(wP)wP.style.height=hP+'px';if(wM)wM.style.height=hM+'px';ANAL_CHART?.resize();ANAL_MACD_CHART?.resize();}
 
function _analTogglePanel(id,e){
    e.stopPropagation();
    const p=document.getElementById(id);if(!p)return;
    document.querySelectorAll('.pa-fp.on,.pa-cfg.on').forEach(x=>{if(x.id!==id)x.classList.remove('on');});
    const wasOn=p.classList.contains('on');
    p.classList.toggle('on');
    if(!wasOn){
        const btn=e.currentTarget;const br=btn.getBoundingClientRect();
        p.style.top=(br.bottom+5)+'px';
        const pw=p.offsetWidth||250;let left=br.right-pw;
        if(left<8)left=8;if(left+pw>window.innerWidth-8)left=window.innerWidth-pw-8;
        p.style.left=left+'px';p.style.right='';
    }
}
 
let _analLastHash=null;
let _analUpdateCiclo=0;
async function analUpdate(){
    try{
        await analCarregarDados();
        const hash=`${ANAL_RESULTADOS.length}-${ANAL_RESULTADOS[0]?.hora}-${ANAL_RESULTADOS[0]?.minuto}-${ANAL_RESULTADOS[0]?.casa}-${ANAL_RESULTADOS[0]?.fora}`;
        _analUpdateCiclo++;
        const forcar=(_analUpdateCiclo%10===0);
        if(hash===_analLastHash&&ANAL_CHART&&!forcar)return;
        _analLastHash=hash;
        analAtualizarGrafico();
    }
    catch(e){console.error('[Analítico]',e);_analLastHash=null;}
}
 
document.addEventListener('DOMContentLoaded',()=>{
    analLoadVis();analLoadCfg();_analLoadDrag();_analUpdateDragCounter();
    _analLoadUI();
 
    const triggerUpdate=()=>{analSaveCfg();analAtualizarGrafico();};
    document.getElementById('analNumBlocos')?.addEventListener('change',()=>{_analLastHash=null;analUpdate();});
    document.getElementById('analMercadoFT')?.addEventListener('change',()=>{const ht=document.getElementById('analMercadoHT');if(document.getElementById('analMercadoFT').value&&ht)ht.value='';triggerUpdate();});
    document.getElementById('analMercadoHT')?.addEventListener('change',()=>{const ft=document.getElementById('analMercadoFT');if(document.getElementById('analMercadoHT').value&&ft)ft.value='';triggerUpdate();});
    ['analModoFixoToggle','analMediasToggle','analTopoFundoToggle','analRangeToggle','analShowRSI','analExibirValorToggle','analLinhaAtualToggle','analShowBollinger','analShowStoch','analShowATR','analShowDiv','analShowRegLin'].forEach(id=>document.getElementById(id)?.addEventListener('change',triggerUpdate));
    ['analRangeQtd','analMA1Period','analMA2Period','analMacdFast','analMacdSlow','analMacdSignal','analRsiPeriod','analTooltipFontSize','analBollPeriod','analBollDesvio','analStochK','analStochD','analAtrPeriod','analRegLinPeriod'].forEach(id=>document.getElementById(id)?.addEventListener('change',triggerUpdate));
    document.getElementById('analAltPrincipalMenos')?.addEventListener('click',()=>{const el=document.getElementById('analAltPrincipal');if(el){el.value=Math.max(200,parseInt(el.value)-10);_analSetAlturas();analSaveCfg();}});
    document.getElementById('analAltPrincipalMais')?.addEventListener('click',()=>{const el=document.getElementById('analAltPrincipal');if(el){el.value=Math.min(600,parseInt(el.value)+10);_analSetAlturas();analSaveCfg();}});
    document.getElementById('analAltMacdMenos')?.addEventListener('click',()=>{const el=document.getElementById('analAltMacd');if(el){el.value=Math.max(80,parseInt(el.value)-10);_analSetAlturas();analSaveCfg();}});
    document.getElementById('analAltMacdMais')?.addEventListener('click',()=>{const el=document.getElementById('analAltMacd');if(el){el.value=Math.min(400,parseInt(el.value)+10);_analSetAlturas();analSaveCfg();}});
    document.getElementById('analAltPrincipal')?.addEventListener('change',()=>{_analSetAlturas();analSaveCfg();});
    document.getElementById('analAltMacd')?.addEventListener('change',()=>{_analSetAlturas();analSaveCfg();});
    document.getElementById('analTooltipFontMenos')?.addEventListener('click',()=>{const el=document.getElementById('analTooltipFontSize');if(el){el.value=Math.max(8,parseInt(el.value)-1);analSaveCfg();analAtualizarGrafico();}});
    document.getElementById('analTooltipFontMais')?.addEventListener('click',()=>{const el=document.getElementById('analTooltipFontSize');if(el){el.value=Math.min(20,parseInt(el.value)+1);analSaveCfg();analAtualizarGrafico();}});
 
    document.getElementById('analBtnLegenda')?.addEventListener('click',function(){
        const box=document.getElementById('analLegendaDinamica');if(!box)return;
        const oculta=box.classList.toggle('oculta');
        this.textContent=oculta?'Legenda: OFF':'Legenda: ON';
        this.classList.toggle('off',oculta);
        _analSaveUI();
    });
 
    document.getElementById('analBtnLinhaTools')?.addEventListener('click',e=>_analTogglePanel('paLinhaPainel',e));
    document.getElementById('analBtnConfig')?.addEventListener('click',e=>_analTogglePanel('paConfigPainel',e));
    document.getElementById('analBtnParams')?.addEventListener('click',e=>_analTogglePanel('paParamsPainel',e));
    document.addEventListener('click',e=>{[['paLinhaPainel','analBtnLinhaTools'],['paConfigPainel','analBtnConfig'],['paParamsPainel','analBtnParams']].forEach(([pid,bid])=>{const p=document.getElementById(pid);if(p&&!p.contains(e.target)&&e.target.id!==bid)p.classList.remove('on');});});
    window.addEventListener('scroll',()=>{document.querySelectorAll('.pa-fp.on,.pa-cfg.on').forEach(p=>p.classList.remove('on'));},{passive:true});
    ['paLinhaPainel','paConfigPainel','paParamsPainel'].forEach(id=>document.getElementById(id)?.addEventListener('click',e=>e.stopPropagation()));
    window.addEventListener('keydown',e=>{if((e.key==='Delete'||e.key==='Backspace')&&document.activeElement===document.body)window.analDeletarLinha?.();});
 
    document.getElementById('analBtnResetConfig')?.addEventListener('click',()=>{
        const _s=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v;};
        const _c=(id,v)=>{const e=document.getElementById(id);if(e)e.checked=v;};
        _s('analRangeQtd',ANAL_PADRAO.linhasRange);_s('analMA1Period',ANAL_PADRAO.periodoMA1);_s('analMA2Period',ANAL_PADRAO.periodoMA2);
        _s('analRsiPeriod',ANAL_PADRAO.rsiPeriodo);_s('analMacdFast',ANAL_PADRAO.macdRapida);_s('analMacdSlow',ANAL_PADRAO.macdLenta);_s('analMacdSignal',ANAL_PADRAO.macdSinal);
        _s('analAltPrincipal',ANAL_PADRAO.alturaPrincipalPx);_s('analAltMacd',ANAL_PADRAO.alturaMACDPx);
        _s('analTooltipFontSize',ANAL_PADRAO.tooltipFontSize);
        _s('analBollPeriod',ANAL_PADRAO.bollPeriodo);_s('analBollDesvio',ANAL_PADRAO.bollDesvio);
        _s('analStochK',ANAL_PADRAO.stochK);_s('analStochD',ANAL_PADRAO.stochD);
        _s('analAtrPeriod',ANAL_PADRAO.atrPeriodo);_s('analRegLinPeriod',ANAL_PADRAO.regLinPeriodo);
        _c('analModoFixoToggle',true);_c('analMediasToggle',true);_c('analTopoFundoToggle',true);_c('analRangeToggle',true);
        _c('analShowRSI',false);_c('analExibirValorToggle',true);_c('analLinhaAtualToggle',true);
        _c('analShowBollinger',false);_c('analShowStoch',false);_c('analShowATR',false);_c('analShowDiv',false);_c('analShowRegLin',false);
        _analSetAlturas();analSaveCfg();analAtualizarGrafico();
    });
 
    const panEl=document.querySelector('[data-panalitico]');
    if(panEl){
        const accordionBtn=panEl.closest('.accordion-content')?.closest('.accordion-item')?.querySelector('.accordion-button');
        if(accordionBtn){
            const origOnclick=accordionBtn.onclick;
            accordionBtn.onclick=function(e){if(origOnclick)origOnclick.call(this,e);setTimeout(_analSaveUI,50);};
        }
    }
 
    analCriarLegenda();analUpdate();
});
 
sincronizarIntervalo(analUpdate,10000);


/* ──────────────────────────────────────────────────────────────────
   [7] Scroll das ligas
   ────────────────────────────────────────────────────────────────── */

  const scrollKey = 'scroll_ligas';

  // Salva a posição em tempo real enquanto rola
  window.addEventListener('scroll', () => {
    sessionStorage.setItem(scrollKey, window.scrollY);
  });

  // Restaura a posição ao carregar
  window.addEventListener('load', () => {
    const saved = sessionStorage.getItem(scrollKey);
    if (saved) window.scrollTo(0, parseInt(saved));
  });


/* ──────────────────────────────────────────────────────────────────
   [8] Liga ativa nos cards
   ────────────────────────────────────────────────────────────────── */

  function marcarLigaAtiva() {
    const h4 = document.querySelector('h4.custom-color');
    const cards = document.querySelectorAll('.cardsligasbetano-card');

    if (!h4 || cards.length === 0) {
      setTimeout(marcarLigaAtiva, 100); // tenta de novo em 100ms
      return;
    }

    const nomeLiga = h4.textContent.trim();
    cards.forEach(function (card) {
      const h3 = card.querySelector('h3');
      if (h3 && h3.textContent.trim() === nomeLiga) {
        card.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', marcarLigaAtiva);


/* ──────────────────────────────────────────────────────────────────
   [9] Resultados / mercados
   ────────────────────────────────────────────────────────────────── */

    // ====================== CÁLCULO GREEN / RED COM SELETOR DE HORAS ======================

// Função que busca todos os resultados
async function fetchResults() {
    return await LigaDataManager.getResultados();  // retorna todos os jogos (sem slice aqui)
}

// Quantos jogos de defasagem usar pra calcular a TENDÊNCIA da seta
// (o número da porcentagem continua usando todos os jogos do período normalmente)
// Valor é ajustável pelo seletor injetado abaixo, e fica salvo no navegador.
let JOGOS_TENDENCIA = parseInt(localStorage.getItem("jogosTendencia")) || 5;

// Conta greens/reds de uma lista de jogos pra um mercado específico
function contarGreensReds(jogos, market) {
    let greens = 0;
    let reds = 0;

    jogos.forEach((game) => {
        const [scoreA, scoreB] = game.ft.split(" x ").map(Number).map(g => isNaN(g) ? 0 : g);
        const totalGols = scoreA + scoreB;

        // Gols do 2º tempo (precisa do placar do HT)
        let scoreA2T = 0, scoreB2T = 0;
        if (game.ht && game.ht.includes("x")) {
            const [htA, htB] = game.ht.split(" x ").map(Number).map(g => isNaN(g) ? 0 : g);
            scoreA2T = Math.max(0, scoreA - htA);
            scoreB2T = Math.max(0, scoreB - htB);
        }
        const total2T = scoreA2T + scoreB2T;

        let isGreen;

        switch (market) {
            case "ambasMarcam":
                isGreen = (scoreA > 0 && scoreB > 0);
                break;
            case "ambasNaoMarcam":
                isGreen = (scoreA === 0 || scoreB === 0);
                break;
            case "casaVence":
                isGreen = (scoreA > scoreB);
                break;
            case "foraVence":
                isGreen = (scoreA < scoreB);
                break;
            case "empate":
                isGreen = (scoreA === scoreB);
                break;

            case "over0.5":
                isGreen = (totalGols > 0.5);
                break;
            case "over1.5":
                isGreen = (totalGols > 1.5);
                break;
            case "over2.5":
                isGreen = (totalGols > 2.5);
                break;
            case "over3.5":
                isGreen = (totalGols > 3.5);
                break;
            case "over5":
                isGreen = (totalGols >= 5);
                break;

            case "under0.5":
                isGreen = (totalGols < 0.5);
                break;
            case "under1.5":
                isGreen = (totalGols < 1.5);
                break;
            case "under2.5":
                isGreen = (totalGols < 2.5);
                break;
            case "under3.5":
                isGreen = (totalGols < 3.5);
                break;

            case "exato0":
                isGreen = (totalGols === 0);
                break;
            case "exato1":
                isGreen = (totalGols === 1);
                break;
            case "exato2":
                isGreen = (totalGols === 2);
                break;
            case "exato3":
                isGreen = (totalGols === 3);
                break;
            case "exato4":
                isGreen = (totalGols === 4);
                break;

            case "exato2t0":
                isGreen = (total2T === 0);
                break;
            case "exato2t1":
                isGreen = (total2T === 1);
                break;
            case "exato2t2":
                isGreen = (total2T === 2);
                break;
            case "exato2t3":
                isGreen = (total2T === 3);
                break;
            case "exato2t4":
                isGreen = (total2T === 4);
                break;

            case "casa0Gols":
                isGreen = (scoreA === 0);
                break;
            case "casa1Gol":
                isGreen = (scoreA === 1);
                break;
            case "casa2Gols":
                isGreen = (scoreA === 2);
                break;
            case "casa3Gols":
                isGreen = (scoreA === 3);
                break;
            case "casa4Gols":
                isGreen = (scoreA === 4);
                break;

            case "fora0Gols":
                isGreen = (scoreB === 0);
                break;
            case "fora1Gol":
                isGreen = (scoreB === 1);
                break;
            case "fora2Gols":
                isGreen = (scoreB === 2);
                break;
            case "fora3Gols":
                isGreen = (scoreB === 3);
                break;
            case "fora4Gols":
                isGreen = (scoreB === 4);
                break;

            default:
                isGreen = false;
                break;
        }

        isGreen ? greens++ : reds++;
    });

    const total = greens + reds || 1; // evita divisão por zero

    return {
        greens: ((greens / total) * 100).toFixed(1),
        reds:   ((reds   / total) * 100).toFixed(1)
    };
}

// Função principal que calcula Green e Red (número exibido) + a base pra tendência (seta)
function calculatePercentage(data, market, horas) {
    // Cada hora = 20 jogos
    const quantidadeJogos = horas * 20;

    // Janela atual: usada pro NÚMERO exibido na tela (normal, igual sempre foi) — é a MÉDIA do período
    const jogosFiltrados = data.slice(-quantidadeJogos);
    const resultadoAtual = contarGreensReds(jogosFiltrados, market);

    // Últimos JOGOS_TENDENCIA jogos (só isso, direto): usados pra comparar com a média
    // e decidir a SETA. Ex: se os últimos 5 jogos têm taxa de green MAIOR que a média
    // do período, a seta sobe. Se for MENOR, a seta desce.
    const jogosRecentes = data.slice(-JOGOS_TENDENCIA);
    const resultadoRecente = jogosRecentes.length > 0
        ? contarGreensReds(jogosRecentes, market)
        : resultadoAtual; // sem dados suficientes ainda, empata com a média

    return {
        greens: resultadoAtual.greens,
        reds:   resultadoAtual.reds,
        greensRecente: resultadoRecente.greens, // taxa de green só dos últimos N jogos
        redsRecente:   resultadoRecente.reds,   // taxa de red só dos últimos N jogos
        totalJogos: jogosFiltrados.length
    };
}

// ====================== CONTROLE DE TENDÊNCIA (SETAS) ======================

// Guarda a última seta de cada mercado/horas, só pra manter a direção quando empatar
const _ultimaSeta = {};

function getSeta(chave, valorRecente, valorMedia) {
    const diferenca = valorRecente - valorMedia;

    let seta;
    if (valorRecente > valorMedia) {
        seta = "▲"; // os últimos jogos estão acima da média do período (esquentando)
    } else if (valorRecente < valorMedia) {
        seta = "▼"; // os últimos jogos estão abaixo da média do período (esfriando)
    } else {
        seta = _ultimaSeta[chave] || "▲"; // empatou: mantém a última direção conhecida
    }
    _ultimaSeta[chave] = seta;

    // Monta o texto com sinal (+ ou -) e uma casa decimal
    const sinal = diferenca > 0 ? "+" : diferenca < 0 ? "-" : (seta === "▲" ? "+" : "-");
    const valorAbs = Math.abs(diferenca).toFixed(1);

    return `${seta} ${sinal}${valorAbs}%`;
}

// ====================== SELETOR DE SENSIBILIDADE DA TENDÊNCIA (INJETADO VIA JS) ======================
// Cria o <select> na tela sem precisar mexer no HTML, e insere depois do card G/R.
(function criarSeletorTendencia() {
    const referencia = document.getElementById("greenPercentage")?.parentElement; // div#resultDisplay que envolve G/R
    if (!referencia) return;

    const wrapper = document.createElement("div");
    wrapper.className = "seletor-tendencia";
    wrapper.style.marginLeft = "0.5rem";

    const select = document.createElement("select");
    select.id = "seletorTendencia";

    [5, 10, 20, 30, 40, 50].forEach((valor) => {
        const opt = document.createElement("option");
        opt.value = valor;
        opt.textContent = valor; // só o número, sem prefixo
        if (valor === JOGOS_TENDENCIA) opt.selected = true;
        select.appendChild(opt);
    });

    select.addEventListener("change", async () => {
        JOGOS_TENDENCIA = parseInt(select.value);
        localStorage.setItem("jogosTendencia", JOGOS_TENDENCIA);
        await atualizarPercentuais();
    });

    wrapper.appendChild(select);
    referencia.parentElement.insertBefore(wrapper, referencia.nextSibling); // logo depois do G/R
})();

// ====================== ATUALIZAR AO MUDAR OS SELETORES ======================

document.getElementById("seletorHoras").addEventListener("change", async () => {
    await atualizarPercentuais();
});

document.getElementById("seletorResultado").addEventListener("change", async () => {
    await atualizarPercentuais();
});

// Função que atualiza os textos na tela
async function atualizarPercentuais() {
    const market = document.getElementById("seletorResultado").value;
    const horas  = parseInt(document.getElementById("seletorHoras").value);

    const todosJogos = await fetchResults();
    const resultado  = calculatePercentage(todosJogos, market, horas);

    const chave = `${market}_${horas}`; // seta separada por mercado + horas

    const setaGreen = getSeta(chave + "_g", parseFloat(resultado.greensRecente), parseFloat(resultado.greens));
    const setaRed   = getSeta(chave + "_r", parseFloat(resultado.redsRecente),   parseFloat(resultado.reds));

    const elGreen = document.getElementById("greenPercentage");
    const elRed   = document.getElementById("redPercentage");

    elGreen.innerHTML = `G: ${resultado.greens}% <span style="color:${setaGreen.includes('▲') ? '#1fcc59' : '#f87171'}">${setaGreen}</span>`;
    elRed.innerHTML   = `R: ${resultado.reds}% <span style="color:${setaRed.includes('▲') ? '#1fcc59' : '#f87171'}">${setaRed}</span>`;

    // Opcional: mostrar quantos jogos foram usados
    // console.log(`Calculado com base em ${resultado.totalJogos} jogos (${horas} horas)`);
}

// ====================== ATUALIZAÇÃO AUTOMÁTICA ======================
// A cada 30s recalcula o número e reavalia a seta contra o bloco de JOGOS_TENDENCIA jogos atrás.
sincronizarIntervalo(async () => {
    await atualizarPercentuais();
}, 10000);

// ====================== CARREGAR AO ABRIR A PÁGINA ======================

window.addEventListener("load", async () => {
    await atualizarPercentuais();
});


/* ──────────────────────────────────────────────────────────────────
   [10] Renko de Mercados (rk)
   ────────────────────────────────────────────────────────────────── */

    /* ════════════════════════════════════════════════════════
   RENKO DE MERCADOS — renko.js
════════════════════════════════════════════════════════ */



/* ════════════════════════════════════════════════════════
   MERCADOS
════════════════════════════════════════════════════════ */
const RK_MERCADOS = {
    over25:    { label: 'Over 2.5',    test: (tg,c,f) => tg >= 3,        cor: '#1fcc59', corN: '#ef4444' },
    over15:    { label: 'Over 1.5',    test: (tg,c,f) => tg >= 2,        cor: '#1fcc59', corN: '#ef4444' },
    over35:    { label: 'Over 3.5',    test: (tg,c,f) => tg >= 4,        cor: '#1fcc59', corN: '#ef4444' },
    over05:    { label: 'Over 0.5',    test: (tg,c,f) => tg >= 1,        cor: '#1fcc59', corN: '#ef4444' },
    ambas:     { label: 'Ambas Sim',   test: (tg,c,f) => c > 0 && f > 0, cor: '#1fcc59', corN: '#ef4444' },
    casaVence: { label: 'Casa Vence',  test: (tg,c,f) => c > f,          cor: '#1fcc59', corN: '#ef4444' },
    foraVence: { label: 'Fora Vence',  test: (tg,c,f) => f > c,          cor: '#1fcc59', corN: '#ef4444' },
    empate:    { label: 'Empate',      test: (tg,c,f) => c === f,        cor: '#1fcc59', corN: '#ef4444' },
    under25:   { label: 'Under 2.5',   test: (tg,c,f) => tg <= 2,        cor: '#1fcc59', corN: '#ef4444' },
};

/* ════════════════════════════════════════════════════════
   PERSISTÊNCIA
════════════════════════════════════════════════════════ */
const RK_LS_KEY = 'renko_prefs';

function rkSavePrefs() {
    try {
        localStorage.setItem(RK_LS_KEY, JSON.stringify({
            mercado:     rkMercado,
            janela:      rkJanela,
            altura:      rkAltura,
            linhaAtual:  rkLinhaAtual,
        }));
    } catch(e) {}
}

function rkLoadPrefs() {
    try {
        const raw = localStorage.getItem(RK_LS_KEY);
        if (!raw) return;
        const p = JSON.parse(raw);
        if (p.mercado    !== undefined) rkMercado    = p.mercado;
        if (p.janela     !== undefined) rkJanela     = p.janela;
        if (p.altura     !== undefined) rkAltura     = p.altura;
        if (p.linhaAtual !== undefined) rkLinhaAtual = p.linhaAtual;
    } catch(e) {}
}

let rkMercado    = 'over25';
let rkJanela     = 100;
let rkAltura     = 220;
let rkLinhaAtual = true;

rkLoadPrefs();

let _rkChart         = null;
let _rkData          = null;
let _rkInicioVis     = Infinity; // será ajustado para maxInicio no primeiro render
let _rkLastMaxInicio = Infinity; // rastreia se usuário está no fim da barra
let _rkTabVis        = !document.hidden;

document.addEventListener('visibilitychange', () => { _rkTabVis = !document.hidden; });

/* ════════════════════════════════════════════════════════
   PLUGIN — LINHA ATUAL (portado do Gráfico de Mercados)
════════════════════════════════════════════════════════ */
const rkLinhaAtualPlugin = {
    id: 'rkLinhaAtual',
    afterDraw(chart, args, opts) {
        const cfg = (opts?.enabled !== undefined) ? opts : (chart.options?.plugins?.rkLinhaAtual ?? {});
        if (cfg.enabled === false) return;
        const {ctx, chartArea, scales} = chart;
        if (!chartArea || !scales.y) return;
        const {left, right, top, bottom} = chartArea;
        const padX = 5, BAD_H = 18;

        // coleta o último valor visível do dataset
        const entries = [];
        chart.data.datasets.forEach((d, i) => {
            if (!d.label || !chart.isDatasetVisible(i)) return;
            const arr = d.data;
            if (!arr?.length) return;
            let yVal = null;
            for (let j = arr.length - 1; j >= 0; j--) {
                const v = arr[j];
                if (v !== null && v !== undefined && isFinite(v)) { yVal = v; break; }
            }
            if (yVal === null) return;
            const yAxis = scales.y;
            const yPx = yAxis.getPixelForValue(yVal);
            if (!isFinite(yPx) || yPx < top || yPx > bottom) return;
            entries.push({ yVal, yPx, label: d.label, color: d.borderColor || '#fff' });
        });

        if (!entries.length) return;
        entries.sort((a, b) => a.yPx - b.yPx);

        // evita sobreposição de badges
        for (let i = 1; i < entries.length; i++) {
            const prev = entries[i - 1], curr = entries[i];
            curr.badgeY = (curr.yPx - (prev.badgeY ?? prev.yPx) < BAD_H + 2)
                ? (prev.badgeY ?? prev.yPx) + BAD_H + 2 : curr.yPx;
            if (i === 1) prev.badgeY = prev.badgeY ?? prev.yPx;
        }
        if (entries.length === 1) entries[0].badgeY = entries[0].yPx;

        // usa a cor atual do mercado selecionado
        const mk = RK_MERCADOS[rkMercado] || RK_MERCADOS.over25;

        entries.forEach(({yVal, yPx, badgeY, label, color}) => {
            const lineColor = mk.cor; // sempre usa a cor do mercado ativo
            ctx.save();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth   = 1.2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(left, yPx);
            ctx.lineTo(right, yPx);
            ctx.stroke();
            ctx.setLineDash([]);

            const text = String(Math.round(yVal));
            ctx.font = 'bold 10px monospace';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            const bw = Math.ceil(ctx.measureText(text).width) + padX * 2;
            const bx = right + 4, by = badgeY - BAD_H / 2;
            ctx.fillStyle = 'rgba(9,11,18,0.95)';
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1.2;
            ctx.fillRect(bx, by, bw, BAD_H);
            ctx.strokeRect(bx, by, bw, BAD_H);
            ctx.fillStyle = lineColor;
            ctx.fillText(text, bx + padX, badgeY);
            ctx.restore();
        });
    }
};

/* ════════════════════════════════════════════════════════
   ACORDEÃO
════════════════════════════════════════════════════════ */
function toggleRenkoAccordion(btn) {
    const content = btn.nextElementSibling;
    const isOpen  = content.style.display !== 'none';
    content.style.display = isOpen ? 'none' : 'block';
    try { localStorage.setItem('renko_acordeao', isOpen ? '0' : '1'); } catch(e) {}
    // ao abrir: aguarda o browser pintar o layout e força resize do chart
    if (!isOpen && _rkChart) {
        requestAnimationFrame(() => requestAnimationFrame(() => { rkFitCanvas(); }));
    }
}

/* ════════════════════════════════════════════════════════
   SYNC UI
════════════════════════════════════════════════════════ */
function rkSyncUI() {
    const selJ = document.getElementById('rkSelJanela');
    if (selJ) selJ.value = String(rkJanela);

    const inp = document.getElementById('rkAlturaInput');
    if (inp) inp.value = String(rkAltura);
    rkAplicarAltura();

    document.querySelectorAll('.rk-mkt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mkt === rkMercado);
    });

    // Sincroniza toggle da linha atual
    const togLA = document.getElementById('rkLinhaAtualToggle');
    if (togLA) togLA.checked = rkLinhaAtual;

    rkAtualizarIdentidade();
}

function rkAtualizarIdentidade() {
    const mk    = RK_MERCADOS[rkMercado] || RK_MERCADOS.over25;
    const badge = document.getElementById('rkBadgeMercado');
    const bar   = document.getElementById('rkChartBar');

    if (badge) {
        badge.textContent       = mk.label;
        badge.style.color       = mk.cor;
        badge.style.borderColor = mk.cor + '55';
        badge.style.background  = mk.cor + '18';
    }
    if (bar) bar.style.background = mk.cor + 'aa';
}

/* ════════════════════════════════════════════════════════
   PROCESSAMENTO
════════════════════════════════════════════════════════ */
function rkProcessData(jogos) {
    const mk = RK_MERCADOS[rkMercado] || RK_MERCADOS.over25;

    const sorted = [...jogos].sort((a, b) => {
        const da = new Date(a.data), db = new Date(b.data);
        if (da - db !== 0) return da - db;
        if (a.hora !== b.hora) return a.hora - b.hora;
        return a.minuto - b.minuto;
    });

    const pontos   = [];
    const direcoes = [];
    const placares = [];
    const labels   = [];
    let acumulado  = 0;
    let wins = 0, total = 0;

    sorted.forEach((jogo, idx) => {
        let ft = [0, 0];
        if (jogo.ft?.includes(' x ')) ft = jogo.ft.split(' x ').map(Number);
        const casa = ft[0], fora = ft[1];
        const tg   = casa + fora;

        const hit     = mk.test(tg, casa, fora);
        const direcao = hit ? 1 : -1;
        acumulado    += direcao;
        if (hit) wins++;
        total++;

        pontos.push(acumulado);
        direcoes.push(direcao);
        placares.push(`${casa} x ${fora}`);
        labels.push(`${jogo.hora}:${String(jogo.minuto).padStart(2,'0')}`);
    });

    return { pontos, direcoes, placares, labels, wins, total };
}

/* ════════════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════════════ */
function rkRender() {
    const canvas = document.getElementById('rkCanvas');
    const scroll = document.getElementById('rkScroll');
    const info   = document.getElementById('rkInfo');
    if (!canvas) return;

    if (!_rkData || !_rkData.length) {
        if (info) info.textContent = 'Aguardando dados...';
        return;
    }

    const { pontos, direcoes, placares, labels, wins, total } = rkProcessData(_rkData);
    if (!pontos.length) {
        if (info) info.textContent = 'Sem jogos para exibir.';
        return;
    }

    const mk        = RK_MERCADOS[rkMercado] || RK_MERCADOS.over25;
    const nTotal    = pontos.length;
    const maxInicio = Math.max(0, nTotal - rkJanela);
    // auto-scroll: se _rkInicioVis === Infinity (primeiro render) ou
    // se o usuário não mexeu na barra (estava no fim), acompanha os novos dados
    if (_rkInicioVis === Infinity || _rkInicioVis >= _rkLastMaxInicio) {
        _rkInicioVis = maxInicio;
    }
    _rkInicioVis      = Math.min(Math.max(0, _rkInicioVis), maxInicio);
    _rkLastMaxInicio  = maxInicio;

    if (scroll) {
        scroll.min      = '0';
        scroll.max      = String(maxInicio);
        scroll.value    = String(_rkInicioVis);
        scroll.disabled = maxInicio <= 0;
    }

    const xMin = _rkInicioVis;
    const xMax = Math.min(nTotal - 1, xMin + rkJanela - 1);

    if (info) info.textContent = `Exibindo ${xMin + 1}–${xMax + 1} de ${nTotal} jogos`;

    const ptColors = direcoes.map(d => d > 0 ? mk.cor : mk.corN);
    const segColor = ctx => ctx.p1.parsed.y >= ctx.p0.parsed.y ? mk.cor : mk.corN;

    if (_rkChart) {
        const ds = _rkChart.data.datasets[0];
        _rkChart.data.labels    = labels;
        ds.data                 = pontos;
        ds._direcoes            = direcoes;
        ds._placares            = placares;
        ds.pointBackgroundColor = ptColors;
        ds.segment.borderColor  = segColor;
        _rkChart.options.scales.x.min = xMin;
        _rkChart.options.scales.x.max = xMax;
        // atualiza estado do plugin linha atual
        _rkChart.options.plugins.rkLinhaAtual.enabled = rkLinhaAtual;
        _rkChart.update('none');
        _rkBuildSummary(wins, total, mk, pontos);
        _rkBuildAcumBadge(pontos, mk);
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('[Renko] Chart.js não encontrado.');
        return;
    }

    // positioner que vira o tooltip para não cobrir as bordas
    Chart.Tooltip.positioners.rkSmart = function(elements, eventPos) {
        if (!elements.length) return false;
        const chart = this.chart;
        const cw    = chart.width;
        const ch    = chart.height;
        const x     = eventPos.x;
        const y     = eventPos.y;
        const GAP   = 20;
        // decide lado horizontal
        const goLeft = x > cw * 0.6;
        const tx = goLeft ? x - GAP : x + GAP;
        // decide lado vertical
        const goUp = y > ch * 0.55;
        const ty = goUp ? y - GAP : y + GAP;
        return {
            x: tx,
            y: ty,
            xAlign: goLeft ? 'right' : 'left',
            yAlign: goUp   ? 'bottom' : 'top',
        };
    };

    _rkChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        plugins: [rkLinhaAtualPlugin],
        data: {
            labels,
            datasets: [{
                label: mk.label,
                data: pontos,
                _direcoes: direcoes,
                _placares: placares,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBorderWidth: 1,
                pointBorderColor: '#090b12',
                pointBackgroundColor: ptColors,
                tension: 0,
                fill: false,
                segment: { borderColor: segColor }
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            layout: { padding: { left: 0, right: 36, top: 6, bottom: 0 } },
            plugins: {
                legend: { display: false },
                rkLinhaAtual: { enabled: rkLinhaAtual },
                tooltip: {
                    mode: 'nearest',
                    intersect: false,
                    position: 'rkSmart',
                    caretSize: 4,
                    caretPadding: 12,
                    backgroundColor: 'rgba(5,7,14,.97)',
                    borderColor: '#151d30',
                    borderWidth: 1,
                    titleColor: '#e0e8f0',
                    bodyColor: '#7a8a9a',
                    titleFont: { family: 'monospace', size: 10 },
                    bodyFont:  { family: 'monospace', size: 10 },
                    padding: 10,
                    boxWidth: 10,
                    boxHeight: 10,
                    callbacks: {
                        label: ctx => {
                            const ds     = ctx.dataset;
                            const dir    = ds._direcoes?.[ctx.dataIndex];
                            const placar = ds._placares?.[ctx.dataIndex] || '';
                            const icon   = dir > 0 ? '✔' : '✖';
                            const nome   = dir > 0 ? mk.label : `Não ${mk.label}`;
                            const sinal  = ctx.parsed.y > 0 ? '+' : '';
                            return [
                                `${icon} ${nome}`,
                                `Acum ${sinal}${ctx.parsed.y}`,
                                `Placar ${placar}`,
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: xMin,
                    max: xMax,
                    ticks: {
                        color: '#2e3f52', maxRotation: 0, autoSkip: true,
                        font: { size: 8, family: 'monospace' }
                    },
                    grid: { color: 'rgba(255,255,255,.06)' },
                    border: { color: 'transparent' }
                },
                y: {
                    ticks: {
                        color: '#2e3f52', stepSize: 1,
                        font: { size: 8, family: 'monospace' }
                    },
                    grid: { color: 'rgba(255,255,255,.06)' },
                    border: { color: 'transparent' }
                }
            }
        }
    });

    window._rkChart = _rkChart;
    _rkBuildSummary(wins, total, mk, pontos);
    _rkBuildAcumBadge(pontos, mk);
}

/* ════════════════════════════════════════════════════════
   BADGE ACUMULADO
════════════════════════════════════════════════════════ */
function _rkBuildAcumBadge(pontos, mk) {
    const div = document.getElementById('rkAcumBadge');
    if (!div || !pontos.length) return;
    const acum  = pontos[pontos.length - 1];
    const cor   = acum >= 0 ? mk.cor : mk.corN;
    const sinal = acum > 0 ? '+' : '';
    div.innerHTML = `<span class="rk-acum-badge" style="color:${cor};border-color:${cor}44;background:${cor}14">${sinal}${acum}</span>`;
}

/* ════════════════════════════════════════════════════════
   PILLS DE RESUMO
════════════════════════════════════════════════════════ */
function _rkBuildSummary(wins, total, mk, pontos) {
    const div = document.getElementById('rkSummary');
    if (!div) return;

    const losses = total - wins;
    const pct    = total ? ((wins / total) * 100).toFixed(1) : '0.0';
    const streak = _rkCalcStreak(pontos);

    div.innerHTML = `
        <span class="rk-pill" style="color:#1fcc59;border-color:#1fcc5935;background:#1fcc5912">✔ ${wins}</span>
        <span class="rk-pill" style="color:#ef4444;border-color:#ef444435;background:#ef444412">✖ ${losses}</span>
        <span class="rk-pill" style="color:#ffc83c;border-color:#ffc83c35;background:#ffc83c12">${pct}%</span>
        <span class="rk-pill" style="color:${mk.cor};border-color:${mk.cor}35;background:${mk.cor}0f">${total} jogos</span>
        ${streak.txt
            ? `<span class="rk-pill" style="color:${streak.cor};border-color:${streak.cor}35;background:${streak.cor}12">${streak.txt}</span>`
            : ''}
    `;
}

/* sequência atual */
function _rkCalcStreak(pontos) {
    if (pontos.length < 2) return { txt: '', cor: '' };
    const last = pontos[pontos.length - 1] > pontos[pontos.length - 2] ? 1 : -1;
    let count = 1;
    for (let i = pontos.length - 2; i > 0; i--) {
        const dir = pontos[i] > pontos[i - 1] ? 1 : -1;
        if (dir === last) count++;
        else break;
    }
    if (count < 2) return { txt: '', cor: '' };
    const cor = last > 0 ? '#1fcc59' : '#ef4444';
    const txt = last > 0 ? `↑ Seq ${count}` : `↓ Seq ${count}`;
    return { txt, cor };
}

/* ════════════════════════════════════════════════════════
   ALTURA
════════════════════════════════════════════════════════ */
function rkAplicarAltura() {
    const wrap = document.getElementById('rkCanvasWrap');
    const inp  = document.getElementById('rkAlturaInput');
    if (!wrap || !inp) return;
    const h = Math.min(600, Math.max(120, parseInt(inp.value || '220', 10)));
    inp.value         = String(h);
    rkAltura          = h;
    wrap.style.height = `${h}px`;
    rkSavePrefs();
    if (_rkChart?.resize) _rkChart.resize();
}

/* ════════════════════════════════════════════════════════
   TROCA DE MERCADO
════════════════════════════════════════════════════════ */
function _rkDestroyChart() {
    if (_rkChart) {
        _rkChart.destroy();
        _rkChart = null;
        window._rkChart = null;
        _rkLastW = 0;
        _rkLastH = 0;
        // limpa o canvas manualmente para não sobrar resíduo visual
        const canvas = document.getElementById('rkCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

function rkTrocarMercado(novoMkt) {
    if (!RK_MERCADOS[novoMkt]) return;
    rkMercado = novoMkt;
    _rkDestroyChart();
    document.querySelectorAll('.rk-mkt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mkt === novoMkt);
    });
    rkAtualizarIdentidade();
    rkSavePrefs();
    rkRender();
}

/* ════════════════════════════════════════════════════════
   FIT CANVAS — sincroniza canvas com o wrap manualmente
   (necessário porque responsive:false não auto-redimensiona)
════════════════════════════════════════════════════════ */
let _rkLastW = 0, _rkLastH = 0;

function rkFitCanvas() {
    const wrap = document.getElementById('rkCanvasWrap');
    if (!wrap || !_rkChart) return;

    const content = document.getElementById('renkoAccordionContent');
    // não faz nada se o acordeão está fechado
    if (content && content.style.display === 'none') return;

    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;

    // só redimensiona se o tamanho do wrap realmente mudou
    if (w === _rkLastW && h === _rkLastH) return;

    _rkLastW = w;
    _rkLastH = h;
    _rkChart.resize(w, h);
}


async function rkFetch() {
    if (!_rkTabVis) return;
    try {
        _rkData = await LigaDataManager.getResultados();
        rkRender();
    } catch(e) {
        console.error('[Renko]', e);
    }
}

/* ════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    // restaura estado do acordeão
    try {
        const aberto = localStorage.getItem('renko_acordeao') !== '0';
        const content = document.getElementById('renkoAccordionContent');
        if (content) content.style.display = aberto ? 'block' : 'none';
    } catch(e) {}

    rkSyncUI();

    document.getElementById('rkMktGroup')?.addEventListener('click', e => {
        const btn = e.target.closest('.rk-mkt-btn');
        if (btn?.dataset.mkt) rkTrocarMercado(btn.dataset.mkt);
    });

    document.getElementById('rkSelJanela')?.addEventListener('change', e => {
        rkJanela = +e.target.value; rkSavePrefs(); rkRender();
    });

    document.getElementById('rkAlturaInput')?.addEventListener('change', rkAplicarAltura);
    document.getElementById('rkAlturaInput')?.addEventListener('input',  rkAplicarAltura);

    document.getElementById('rkAlturaMenos')?.addEventListener('click', () => {
        const inp = document.getElementById('rkAlturaInput');
        if (!inp) return;
        inp.value = String(Math.max(120, (parseInt(inp.value || '220', 10) || 220) - 10));
        rkAplicarAltura();
    });
    document.getElementById('rkAlturaMais')?.addEventListener('click', () => {
        const inp = document.getElementById('rkAlturaInput');
        if (!inp) return;
        inp.value = String(Math.min(600, (parseInt(inp.value || '220', 10) || 220) + 10));
        rkAplicarAltura();
    });

    document.getElementById('rkScroll')?.addEventListener('input', e => {
        _rkInicioVis = parseInt(e.target.value || '0', 10);
        rkRender();
    });

    // Toggle Linha Atual
    document.getElementById('rkLinhaAtualToggle')?.addEventListener('change', e => {
        rkLinhaAtual = e.target.checked;
        if (_rkChart) {
            _rkChart.options.plugins.rkLinhaAtual.enabled = rkLinhaAtual;
            _rkChart.update('active');
        }
        rkSavePrefs();
    });

    window.addEventListener('resize', rkFitCanvas);

    // ao voltar à aba após inatividade o chart pode ter sumido — força resize + re-render
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && _rkChart) {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                rkFitCanvas();
                rkRender();
            }));
        }
    });

    
    // watchdog: verifica a cada 2s se o canvas ainda tem as dimensões certas
    setInterval(rkFitCanvas, 2000);

    rkFetch();
    sincronizarIntervalo(rkFetch, 10000);
});


/* ──────────────────────────────────────────────────────────────────
   [11] Esconder loading
   ────────────────────────────────────────────────────────────────── */

    // Adicione um delay para simular carregamento lento (remova depois)
    setTimeout(function() {
      document.getElementById('loading').classList.add('hidden');
    }, 1000); // 2 segundos de delay para teste
