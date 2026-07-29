/* ═══════════════════════════════════════════════════════════════════
   GRÁFICO DE VELAS — GOLS FT / HT  (TradingView Lightweight Charts)
   + Fibonacci e LTA/LTB desenháveis (canvas overlay próprio, já que o
   Lightweight Charts não tem sistema de desenho nativo como os plugins
   do Chart.js que você usava).
═══════════════════════════════════════════════════════════════════ */

const LS_HORAS   = 'velasgols:horas';
const LS_BASE    = 'velasgols:base';
const LS_MERCADO = 'velasgols:mercado';
const LS_ATUAL   = 'velasgols:linhaAtual';
const LS_ACORD   = 'velasgols:accordionOpen';
const LS_FIBS    = 'velasgols:fibs';   // + ':FT' ou ':HT'
const LS_TRENDS  = 'velasgols:trends'; // + ':FT' ou ':HT'

const MAX_FIBS    = 4;
const MAX_TRENDS  = 6;
const FIB_LEVELS  = [0, 23.6, 38.2, 50, 61.8, 100];
const FIB_COLORS  = ['#A78BFA','#FBBF24','#34D399','#F472B6','#60A5FA','#FB923C'];
const TREND_COLORS = { LTA:'#34D399', LTB:'#F87171' };
const HANDLE_R = 5, HIT_TOLERANCE = 7;

function _ls(k, fb){ try{ const v=localStorage.getItem(k); return v!==null?JSON.parse(v):fb; }catch{ return fb; } }
function _lsSet(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }

let numPoints     = _ls(LS_HORAS, 160);
let averagePoints = _ls(LS_BASE, 19);
let mercadoAtivo  = _ls(LS_MERCADO, 'FT');   // 'FT' | 'HT'
let linhaAtual    = _ls(LS_ATUAL, true);

/* ── ACORDEON ── */
function toggleAccordion(btn){
    const content = document.getElementById('accordionContent');
    content.classList.toggle('collapsed');
    _lsSet(LS_ACORD, !content.classList.contains('collapsed'));
}
if (_ls(LS_ACORD, true) === false) {
    document.getElementById('accordionContent').classList.add('collapsed');
}

/* ── HELPERS DE PARSING (idênticos ao grafico.js) ── */
function parseHtScoreTotal(htStr){
    if (!htStr) return 0;
    if (htStr === 'OUT') return 3;
    if (htStr.includes(' x ')) {
        const p = htStr.split(' x ').map(Number);
        if (p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])) return p[0] + p[1];
    }
    return 0;
}
function toAbsMin(m){ const d=new Date(m.data); return Math.floor(d.getTime()/86400000)*1440 + m.hora*60 + m.minuto; }
function toEpochSec(m){ const d=new Date(m.data); return Math.floor(d.getTime()/1000) + m.hora*3600 + m.minuto*60; }

/* ═══════════════════════════════════════════════════════════════════
   PROCESSAMENTO — janela deslizante (mesma regra do grafico.js)
═══════════════════════════════════════════════════════════════════ */
function processGolsData(data){
    const sorted = [...data].sort((a,b)=>{
        const dA=new Date(a.data), dB=new Date(b.data);
        if (dA.getTime()!==dB.getTime()) return dA-dB;
        if (a.hora!==b.hora) return a.hora-b.hora;
        return a.minuto-b.minuto;
    });
    const buffer = Math.ceil(averagePoints * 3.5);
    const sliced = sorted.slice(-numPoints - buffer);
    const janelaMin = averagePoints * 3;

    const pontos = [];
    for (let i=0; i<sliced.length; i++){
        const mAtual = sliced[i];
        const tsAtual = toAbsMin(mAtual);
        let golsFT=0, golsHT=0;
        for (let j=i; j>=0; j--){
            const mj = sliced[j];
            if (tsAtual - toAbsMin(mj) > janelaMin) break;
            let ft=[0,0];
            if (mj.ft?.includes(' x ')) ft = mj.ft.split(' x ').map(Number);
            golsFT += ft[0] + ft[1];
            golsHT += parseHtScoreTotal(mj.ht);
        }
        pontos.push({ time: toEpochSec(mAtual), golsFT, golsHT, ft: mAtual.ft || 'N/A', ht: mAtual.ht || 'N/A' });
    }
    return pontos.slice(-numPoints);
}

function toCandles(pontos, campo){
    return pontos.map((p, i) => {
        const close = p[campo];
        const open  = i === 0 ? close : pontos[i-1][campo];
        const prev  = open;
        const next  = i === pontos.length - 1 ? close : pontos[i+1][campo];
        return { time: p.time, open, close, high: Math.max(prev,open,close,next), low: Math.min(prev,open,close,next) };
    });
}

/* ═══════════════════════════════════════════════════════════════════
   BUSCA DE DADOS — lê direto da rota real do BetStat.
   Ajuste LIGA_NOME se for usar essa página pra outra liga (o valor vai
   codificado na URL via encodeURIComponent, então acentos/espaços são
   tratados automaticamente).
═══════════════════════════════════════════════════════════════════ */
const LIGA_NOME = 'Taça Glória eterna';
const RESULTADOS_URL = `https://betstat.site/resultados/${encodeURIComponent(LIGA_NOME)}`;

async function fetchGolsData(){
    const r = await fetch(`${RESULTADOS_URL}?timestamp=${Date.now()}`, { credentials: 'include' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

/* ═══════════════════════════════════════════════════════════════════
   LIGHTWEIGHT CHARTS — SETUP
═══════════════════════════════════════════════════════════════════ */
const chartEl = document.getElementById('chartVelas');
const chart = LightweightCharts.createChart(chartEl, {
    layout: { background: { color: 'transparent' }, textColor: '#8B92A8' },
    grid: { vertLines: { color: 'rgba(148,163,184,0.06)' }, horzLines: { color: 'rgba(148,163,184,0.09)' } },
    timeScale: { timeVisible: true, secondsVisible: false, borderColor: 'rgba(148,163,184,.15)' },
    rightPriceScale: { borderColor: 'rgba(148,163,184,.15)' },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal }
});
const seriesFT = chart.addCandlestickSeries({
    upColor: '#26A69A', downColor: '#EF5350', borderVisible: false,
    wickUpColor: '#26A69A', wickDownColor: '#EF5350',
    priceFormat: { type: 'price', precision: 0, minMove: 1 }
});
const seriesHT = chart.addCandlestickSeries({
    upColor: '#42A5F5', downColor: '#FF7043', borderVisible: false,
    wickUpColor: '#42A5F5', wickDownColor: '#FF7043',
    priceFormat: { type: 'price', precision: 0, minMove: 1 }
});
function serieAtiva(){ return mercadoAtivo === 'FT' ? seriesFT : seriesHT; }

let dadosProcessados = [];
let priceLine = null;

function setMercado(m){
    // salva desenhos do mercado anterior antes de trocar
    mercadoAtivo = m;
    _lsSet(LS_MERCADO, m);
    document.getElementById('btnFT').classList.toggle('active', m==='FT');
    document.getElementById('btnHT').classList.toggle('active', m==='HT');
    document.getElementById('valorAtualTag').textContent = m;
    document.getElementById('valorAtualTag').className = 'tag ' + m.toLowerCase();
    seriesFT.applyOptions({ visible: m==='FT' });
    seriesHT.applyOptions({ visible: m==='HT' });
    carregarDesenhos();
    atualizarLinhaAtual();
    redrawOverlay();
}

function atualizarLinhaAtual(){
    const serie = serieAtiva();
    if (priceLine) { serie.removePriceLine(priceLine); priceLine = null; }
    if (!dadosProcessados.length) return;
    const ultimo = dadosProcessados[dadosProcessados.length - 1];
    const val = mercadoAtivo === 'FT' ? ultimo.golsFT : ultimo.golsHT;
    document.getElementById('valorAtualDisplay').textContent = val;
    if (linhaAtual) {
        priceLine = serie.createPriceLine({
            price: val, color: '#7DE3D6', lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed, axisLabelVisible: true, title: 'atual'
        });
    }
}

async function updateChart(){
    try {
        const raw = await fetchGolsData();
        dadosProcessados = processGolsData(raw);
        seriesFT.setData(toCandles(dadosProcessados, 'golsFT'));
        seriesHT.setData(toCandles(dadosProcessados, 'golsHT'));
        atualizarLinhaAtual();
        redrawOverlay();
    } catch (e) {
        console.error('Erro ao buscar/atualizar dados de', RESULTADOS_URL, ':', e);
        document.getElementById('valorAtualDisplay').textContent = 'erro (ver console)';
    }
}

document.getElementById('pointsSelector').value = String(numPoints);
document.getElementById('averageSelector').value = String(averagePoints);
document.getElementById('linhaAtualToggle').checked = linhaAtual;
/* setMercado(mercadoAtivo) só é chamado lá embaixo, depois que fibsPorMercado/
   trendsPorMercado (declaradas mais adiante) já existem — chamar aqui antes
   causava "Cannot access 'fibsPorMercado' before initialization" */

document.getElementById('pointsSelector').addEventListener('change', e=>{ numPoints=parseInt(e.target.value,10); _lsSet(LS_HORAS,numPoints); updateChart(); });
document.getElementById('averageSelector').addEventListener('change', e=>{ averagePoints=parseInt(e.target.value,10); _lsSet(LS_BASE,averagePoints); updateChart(); });
document.getElementById('linhaAtualToggle').addEventListener('change', function(){ linhaAtual=this.checked; _lsSet(LS_ATUAL,linhaAtual); atualizarLinhaAtual(); });

/* ═══════════════════════════════════════════════════════════════════
   OVERLAY — FIBONACCI + LTA/LTB
   Canvas transparente por cima do gráfico (pointer-events:none por
   padrão, pra não travar o pan/zoom nativo do Lightweight Charts).
   Interação via chart.subscribeClick / subscribeCrosshairMove, e
   arraste das pontas via mousedown no container (capturado só quando
   o clique cai em cima de uma alça de um desenho já selecionado).
═══════════════════════════════════════════════════════════════════ */
const overlay = document.getElementById('drawOverlay');
const octx = overlay.getContext('2d');

let fibsPorMercado   = { FT: [], HT: [] };
let trendsPorMercado = { FT: [], HT: [] };
let selectedFib   = -1;
let selectedTrend = -1;
let drawMode      = null;     // null | 'fib' | 'LTA' | 'LTB'
let pendingPoint  = null;     // {time, price} — primeiro clique do traçado
let previewXY     = null;     // {x,y} — posição atual do mouse durante o traçado

function fibs()   { return fibsPorMercado[mercadoAtivo]; }
function trends() { return trendsPorMercado[mercadoAtivo]; }

function carregarDesenhos(){
    fibsPorMercado[mercadoAtivo]   = _ls(`${LS_FIBS}:${mercadoAtivo}`, []);
    trendsPorMercado[mercadoAtivo] = _ls(`${LS_TRENDS}:${mercadoAtivo}`, []);
    selectedFib = -1; selectedTrend = -1;
    atualizarContadores();
}
function salvarFibs()   { _lsSet(`${LS_FIBS}:${mercadoAtivo}`, fibs()); }
function salvarTrends() { _lsSet(`${LS_TRENDS}:${mercadoAtivo}`, trends()); }
function atualizarContadores(){
    document.getElementById('contadorFibs').textContent = `${fibs().length} / ${MAX_FIBS} fibonacci`;
    document.getElementById('contadorTendencias').textContent = `${trends().length} / ${MAX_TRENDS} tendências`;
}

/* ── dropdowns Fib+ / LTA-LTB ── */
(function(){
    const btnFib = document.getElementById('btnFibTools'), pFib = document.getElementById('fibToolsPanel');
    const btnTrend = document.getElementById('btnTrendTools'), pTrend = document.getElementById('trendToolsPanel');
    btnFib.addEventListener('click', e=>{ e.stopPropagation(); pFib.style.display = pFib.style.display==='none'?'block':'none'; });
    btnTrend.addEventListener('click', e=>{ e.stopPropagation(); pTrend.style.display = pTrend.style.display==='none'?'block':'none'; });
    pFib.addEventListener('click', e=>e.stopPropagation());
    pTrend.addEventListener('click', e=>e.stopPropagation());
    document.addEventListener('click', ()=>{ pFib.style.display='none'; pTrend.style.display='none'; });
})();

function setDrawMode(mode){
    drawMode = mode;
    pendingPoint = null;
    overlay.style.cursor = 'crosshair';
    document.getElementById('btnFibTools').classList.toggle('tool-active', mode==='fib');
    document.getElementById('btnTrendTools').classList.toggle('tool-active', mode==='LTA'||mode==='LTB');
}
function ativarDesenhoFibonacci(){
    if (fibs().length >= MAX_FIBS) { alert(`Limite de ${MAX_FIBS} fibonacci atingido. Remova um antes de traçar outro.`); return; }
    setDrawMode('fib');
}
function ativarDesenhoLTA(){
    if (trends().length >= MAX_TRENDS) { alert(`Limite de ${MAX_TRENDS} tendências atingido. Remova uma antes de traçar outra.`); return; }
    setDrawMode('LTA');
}
function ativarDesenhoLTB(){
    if (trends().length >= MAX_TRENDS) { alert(`Limite de ${MAX_TRENDS} tendências atingido. Remova uma antes de traçar outra.`); return; }
    setDrawMode('LTB');
}
function deletarFibonacciSelecionado(){
    if (selectedFib < 0) { alert('Nenhum fibonacci selecionado. Clique em um pra selecionar.'); return; }
    fibs().splice(selectedFib, 1); selectedFib = -1; salvarFibs(); atualizarContadores(); redrawOverlay();
}
function limparFibonacciLivre(){
    fibsPorMercado[mercadoAtivo] = []; selectedFib = -1; salvarFibs(); atualizarContadores(); redrawOverlay();
}
function deletarTendenciaSelecionada(){
    if (selectedTrend < 0) { alert('Nenhuma tendência selecionada. Clique em uma pra selecionar.'); return; }
    trends().splice(selectedTrend, 1); selectedTrend = -1; salvarTrends(); atualizarContadores(); redrawOverlay();
}
function limparTendencias(){
    trendsPorMercado[mercadoAtivo] = []; selectedTrend = -1; salvarTrends(); atualizarContadores(); redrawOverlay();
}

/* ── conversões de coordenada ── */
function timeToX(t){ return chart.timeScale().timeToCoordinate(t); }
function priceToY(p){ return serieAtiva().priceToCoordinate(p); }
function xToTime(x){ return chart.timeScale().coordinateToTime(x); }
function yToPrice(y){ return serieAtiva().coordinateToPrice(y); }

/* ── clique no chart: definir pontos do traçado OU selecionar desenho existente ── */
chart.subscribeClick(param=>{
    if (!param.point) return;
    if (drawMode){
        const price = yToPrice(param.point.y);
        const time  = param.time;
        if (price===null || time===undefined) return;
        if (!pendingPoint){
            pendingPoint = { time, price };
        } else {
            commitDrawing(pendingPoint, { time, price });
            pendingPoint = null;
            drawMode = null;
            document.getElementById('btnFibTools').classList.remove('tool-active');
            document.getElementById('btnTrendTools').classList.remove('tool-active');
            overlay.style.cursor = 'default';
        }
        redrawOverlay();
        return;
    }
    handleSelectionClick(param.point);
});
chart.subscribeCrosshairMove(param=>{
    if (drawMode && pendingPoint && param.point){
        previewXY = { x: param.point.x, y: param.point.y };
        redrawOverlay();
    }
});

function commitDrawing(a, b){
    if (drawMode === 'fib'){
        fibs().push({ t1:a.time, p1:a.price, t2:b.time, p2:b.price });
        salvarFibs();
    } else {
        trends().push({ type: drawMode, t1:a.time, p1:a.price, t2:b.time, p2:b.price });
        salvarTrends();
    }
    atualizarContadores();
}

/* ── seleção por clique (hit test) ── */
function distPointSeg(px,py, x1,y1,x2,y2){
    const dx=x2-x1, dy=y2-y1;
    const len2 = dx*dx+dy*dy;
    let t = len2 ? ((px-x1)*dx+(py-y1)*dy)/len2 : 0;
    t = Math.max(0, Math.min(1, t));
    const cx = x1+t*dx, cy = y1+t*dy;
    return Math.hypot(px-cx, py-cy);
}
function handleSelectionClick(point){
    let novoFib = -1, novoTrend = -1;

    fibs().forEach((f, idx) => {
        const x1 = timeToX(f.t1), x2 = timeToX(f.t2);
        if (x1===null || x2===null) return;
        FIB_LEVELS.forEach(lv => {
            const price = f.p1 + (f.p2-f.p1) * (lv/100);
            const y = priceToY(price);
            if (y===null) return;
            const xEnd = overlay.width / (window.devicePixelRatio||1);
            if (point.x >= Math.min(x1,x2) - HIT_TOLERANCE && distPointSeg(point.x,point.y, x1,y, xEnd,y) < HIT_TOLERANCE) novoFib = idx;
        });
    });
    trends().forEach((t, idx) => {
        const x1=timeToX(t.t1), y1=priceToY(t.p1), x2=timeToX(t.t2), y2=priceToY(t.p2);
        if ([x1,y1,x2,y2].some(v=>v===null)) return;
        // estende a reta até a borda direita, igual ao desenho
        const xEnd = overlay.width / (window.devicePixelRatio||1);
        const slope = (y2-y1)/((x2-x1)||1);
        const yEnd = y2 + slope*(xEnd-x2);
        if (distPointSeg(point.x,point.y, x1,y1, xEnd,yEnd) < HIT_TOLERANCE) novoTrend = idx;
    });

    selectedFib = novoFib;
    selectedTrend = (novoFib === -1) ? novoTrend : -1;
    redrawOverlay();
}

/* ── arraste das pontas (só do item selecionado) ── */
let dragging = null; // {kind:'fib'|'trend', idx, anchor:'1'|'2'}
chartEl.addEventListener('mousedown', e=>{
    const rect = overlay.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const hit = hitTestHandle(x,y);
    if (hit){
        dragging = hit;
        e.preventDefault(); e.stopPropagation();
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
    }
}, true);

function hitTestHandle(x,y){
    if (selectedFib >= 0){
        const f = fibs()[selectedFib];
        const x1=timeToX(f.t1), y1=priceToY(f.p1), x2=timeToX(f.t2), y2=priceToY(f.p2);
        if (x1!==null && y1!==null && Math.hypot(x-x1,y-y1) < HANDLE_R*2.5) return { kind:'fib', idx:selectedFib, anchor:'1' };
        if (x2!==null && y2!==null && Math.hypot(x-x2,y-y2) < HANDLE_R*2.5) return { kind:'fib', idx:selectedFib, anchor:'2' };
    }
    if (selectedTrend >= 0){
        const t = trends()[selectedTrend];
        const x1=timeToX(t.t1), y1=priceToY(t.p1), x2=timeToX(t.t2), y2=priceToY(t.p2);
        if (x1!==null && y1!==null && Math.hypot(x-x1,y-y1) < HANDLE_R*2.5) return { kind:'trend', idx:selectedTrend, anchor:'1' };
        if (x2!==null && y2!==null && Math.hypot(x-x2,y-y2) < HANDLE_R*2.5) return { kind:'trend', idx:selectedTrend, anchor:'2' };
    }
    return null;
}
function onDragMove(e){
    if (!dragging) return;
    const rect = overlay.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const time = xToTime(x), price = yToPrice(y);
    if (time===undefined || price===null) return;
    const arr = dragging.kind === 'fib' ? fibs() : trends();
    const item = arr[dragging.idx];
    if (!item) return;
    if (dragging.anchor === '1'){ item.t1 = time; item.p1 = price; } else { item.t2 = time; item.p2 = price; }
    redrawOverlay();
}
function onDragEnd(){
    if (dragging){
        if (dragging.kind === 'fib') salvarFibs(); else salvarTrends();
    }
    dragging = null;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
}

/* ── desenho ── */
function resizeOverlay(){
    const dpr = window.devicePixelRatio || 1;
    const rect = chartEl.getBoundingClientRect();
    overlay.width  = rect.width * dpr;
    overlay.height = rect.height * dpr;
    overlay.style.width  = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    octx.setTransform(dpr,0,0,dpr,0,0);
    redrawOverlay();
}

function redrawOverlay(){
    const w = overlay.width / (window.devicePixelRatio||1);
    const h = overlay.height / (window.devicePixelRatio||1);
    octx.clearRect(0,0,w,h);

    fibs().forEach((f, idx) => drawFib(f, idx===selectedFib, w));
    trends().forEach((t, idx) => drawTrend(t, idx===selectedTrend, w));

    if (drawMode && pendingPoint && previewXY){
        const x1 = timeToX(pendingPoint.time), y1 = priceToY(pendingPoint.price);
        if (x1!==null && y1!==null){
            octx.save();
            octx.strokeStyle = drawMode==='fib' ? '#A78BFA' : TREND_COLORS[drawMode];
            octx.setLineDash([4,3]); octx.lineWidth = 1.5;
            octx.beginPath(); octx.moveTo(x1,y1); octx.lineTo(previewXY.x, previewXY.y); octx.stroke();
            octx.restore();
        }
    }
}

function drawFib(f, selected, w){
    const x1 = timeToX(f.t1), x2 = timeToX(f.t2);
    if (x1===null || x2===null) return;
    octx.save();
    octx.font = '11px Segoe UI, Arial'; octx.textBaseline = 'middle';
    FIB_LEVELS.forEach((lv, i) => {
        const price = f.p1 + (f.p2-f.p1) * (lv/100);
        const y = priceToY(price);
        if (y===null) return;
        octx.strokeStyle = FIB_COLORS[i];
        octx.globalAlpha = selected ? 1 : 0.65;
        octx.lineWidth = selected ? 2 : 1.3;
        octx.setLineDash([5,4]);
        octx.beginPath(); octx.moveTo(Math.min(x1,x2), y); octx.lineTo(w, y); octx.stroke();
        octx.fillStyle = FIB_COLORS[i];
        octx.fillText(`${lv}% · ${price.toFixed(1)}`, w - 92, y - 8);
    });
    octx.restore();
    if (selected) drawHandles(x1, priceToY(f.p1), x2, priceToY(f.p2));
}

function drawTrend(t, selected, w){
    const x1=timeToX(t.t1), y1=priceToY(t.p1), x2=timeToX(t.t2), y2=priceToY(t.p2);
    if ([x1,y1,x2,y2].some(v=>v===null)) return;
    const slope = (y2-y1)/((x2-x1)||1);
    const yEnd = y2 + slope*(w-x2);
    octx.save();
    octx.strokeStyle = TREND_COLORS[t.type];
    octx.globalAlpha = selected ? 1 : 0.75;
    octx.lineWidth = selected ? 2.5 : 1.75;
    octx.beginPath(); octx.moveTo(x1,y1); octx.lineTo(w, yEnd); octx.stroke();
    octx.restore();
    if (selected) drawHandles(x1,y1,x2,y2);
}

function drawHandles(x1,y1,x2,y2){
    [[x1,y1],[x2,y2]].forEach(([x,y]) => {
        if (x===null || y===null) return;
        octx.beginPath(); octx.arc(x,y,HANDLE_R,0,Math.PI*2);
        octx.fillStyle = '#0b0e17'; octx.fill();
        octx.lineWidth = 2; octx.strokeStyle = '#7DE3D6'; octx.stroke();
    });
}

chart.timeScale().subscribeVisibleTimeRangeChange(redrawOverlay);
new ResizeObserver(entries=>{
    for (const entry of entries) chart.applyOptions({ width: entry.contentRect.width, height: entry.contentRect.height });
    resizeOverlay();
}).observe(chartEl);

setMercado(mercadoAtivo); // agora sim: fibsPorMercado/trendsPorMercado já existem
resizeOverlay();
updateChart();
setInterval(updateChart, 3000);