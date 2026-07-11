/* ===========================================================
   BetStat — Gráfico Velas — núcleo (multi-painel)
   Permite abrir N gráficos ao mesmo tempo (uma casa/liga por painel)
=========================================================== */
window.GraficoVelas = (function(){
    "use strict";

    // ---------- CATÁLOGO DE CASAS/LIGAS ----------
    const LIGAS_DB = {
        bet365: {
            nome: 'Bet365',
            ligas: [
                { nome: 'Copa',    url: 'https://betstat.site/resultados/bet365/Copa' },
                { nome: 'Euro',    url: 'https://betstat.site/resultados/bet365/Euro' },
                { nome: 'Super',   url: 'https://betstat.site/resultados/bet365/Super' },
                { nome: 'Premier', url: 'https://betstat.site/resultados/bet365/Premier' }
            ]
        },
        betano: {
            nome: 'Betano',
            ligas: [
                { nome: 'World',                                        url: 'https://betstat.site/resultados/Mundial' },
                { nome: 'Copa América',                                 url: 'https://betstat.site/resultados/Copa%20Am%C3%A9rica' },
                { nome: 'Clássicos da América (Taça Glória Eterna)',    url: 'https://betstat.site/resultados/Ta%C3%A7a%20Gl%C3%B3ria%20eterna' },
                { nome: 'Euro',                                         url: 'https://betstat.site/resultados/Euro' },
                { nome: 'Campeonato Italiano',                          url: 'https://betstat.site/resultados/Campeonato%20Italiano' },
                { nome: 'Copa das Estrelas',                            url: 'https://betstat.site/resultados/Copa%20das%20estrelas' },
                { nome: 'Brasileirão Betano',                           url: 'https://betstat.site/resultados/Brasileir%C3%A3o%20Betano' }
            ]
        },
        kiron: {
            nome: 'Kiron',
            ligas: [
                { nome: 'England', url: 'https://betstat.site/resultados/kiron/England' },
                { nome: 'Italy',   url: 'https://betstat.site/resultados/kiron/Italy' },
                { nome: 'Spain',   url: 'https://betstat.site/resultados/kiron/Spain' }
            ]
        },
        estrela: {
            nome: 'EstrelaBet',
            ligas: [
                { nome: 'Copa do Mundo',       url: 'https://betstat.site/resultados/estrela/Copa%20do%20Mundo' },
                { nome: 'Ligas dos Campeões',  url: 'https://betstat.site/resultados/estrela/Ligas%20dos%20Campe%C3%B5es' },
                { nome: 'América Latina',      url: 'https://betstat.site/resultados/estrela/Am%C3%A9rica%20Latina' }
            ]
        }
    };

    function parseHtParts(htStr){
        if (!htStr || htStr === 'OUT') return null;
        if (htStr.includes(' x ')){
            const p = htStr.split(' x ').map(Number);
            if (p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])) return p;
        }
        return null;
    }

    function bateMercado(m, key){
        let ft = [0, 0];
        if (m.ft && m.ft.includes(' x ')) ft = m.ft.split(' x ').map(Number);
        const htParts = parseHtParts(m.ht);
        switch (key){
            case 'over25':   return (ft[0] + ft[1]) > 2.5;
            case 'under25':  return (ft[0] + ft[1]) < 2.5;
            case 'ambasS':   return ft[0] > 0 && ft[1] > 0;
            case 'ambasN':   return !(ft[0] > 0 && ft[1] > 0);
            case 'empateHT': return !!(htParts && htParts[0] === htParts[1]);
            default: return false;
        }
    }

    function novosMercados(){
        return {
            over25:    { nome: 'Over 2.5',       cor: '#3fa9ff', ativo: false },
            under25:   { nome: 'Under 2.5',      cor: '#ef4444', ativo: false },
            ambasS:    { nome: 'Ambas S',        cor: '#22d3c8', ativo: false },
            ambasN:    { nome: 'Ambas N',        cor: '#f59e0b', ativo: false },
            empateHT:  { nome: 'Empate HT',      cor: '#c084fc', ativo: false },
            totalGols: { nome: 'Total Gols (FT)',cor: '#ffffff', ativo: true }
        };
    }

    function buildPanelDOM(casaNome, ligaNome){
        const el = document.createElement('section');
        el.className = 'grafico-trading-panel';
        el.innerHTML = `
            <div class="grafico-trading-top">
                <div class="grafico-trading-left">
                    <div class="grafico-trading-title">🕯️ ${casaNome} — ${ligaNome}</div>
                    <div class="grafico-trading-sub" data-role="sub">Comparação por blocos de 20 jogos</div>
                </div>
                <div class="grafico-trading-legendas" data-role="legendas">
                    <button type="button" data-gt-market="over25" class="gt-legend">Over 2.5</button>
                    <button type="button" data-gt-market="under25" class="gt-legend">Under 2.5</button>
                    <button type="button" data-gt-market="ambasS" class="gt-legend">Ambas S</button>
                    <button type="button" data-gt-market="ambasN" class="gt-legend">Ambas N</button>
                    <button type="button" data-gt-market="empateHT" class="gt-legend">Empate HT</button>
                    <button type="button" data-gt-market="totalGols" class="gt-legend selected">Total Gols (FT)</button>
                </div>
                <div class="grafico-trading-actions">
                    <select data-role="pointsSelector">
                        <option value="20">20 jogos</option>
                        <option value="40">40 jogos</option>
                        <option value="60" selected>60 jogos</option>
                        <option value="100">100 jogos</option>
                        <option value="150">150 jogos</option>
                        <option value="9999">Tudo</option>
                    </select>
                    <button type="button" data-role="btnDots">Bolinha</button>
                    <button type="button" data-role="btnCandle" class="active">Candlestick</button>
                    <button type="button" data-role="btnZoomIn">+</button>
                    <button type="button" data-role="btnZoomOut">−</button>
                    <button type="button" data-role="btnClose" class="gt-close" title="Fechar gráfico">✕</button>
                </div>
            </div>
            <div class="grafico-trading-body">
                <div class="grafico-trading-tools" data-role="tools">
                    <button type="button" data-gt-tool="select" class="gt-tool active" title="Selecionar">↖</button>
                    <button type="button" data-gt-tool="trend" class="gt-tool" title="Linha de tendência">╱</button>
                    <button type="button" data-gt-tool="vertical" class="gt-tool" title="Linha vertical">│</button>
                    <button type="button" data-gt-tool="zone" class="gt-tool" title="Zona">▭</button>
                    <button type="button" data-gt-tool="text" class="gt-tool" title="Texto">T</button>
                    <button type="button" data-gt-tool="line" class="gt-tool" title="Linha horizontal">─</button>
                    <button type="button" data-role="btnCurrentLine" class="gt-tool" title="Linha atual">•</button>
                    <button type="button" data-role="btnDelete" data-gt-tool="delete" class="gt-tool" title="Apagar">🗑</button>
                </div>
                <div class="grafico-trading-container" data-role="container"></div>
            </div>
            <div class="grafico-trading-status" data-role="status"></div>
        `;
        return el;
    }

    // ---------- FÁBRICA DE PAINEL ----------
    // opts: { casaKey, casaNome, ligaNome, url, mountEl, onClose }
    function createPanel(opts){
        const { casaKey, casaNome, ligaNome, url, mountEl, onClose } = opts;

        const root = buildPanelDOM(casaNome, ligaNome);
        mountEl.appendChild(root);

        const $ = (sel) => root.querySelector(sel);
        const statusEl = $('[data-role="status"]');
        const log = (msg, show) => {
            statusEl.innerHTML = msg || '';
            statusEl.classList.toggle('gv-hidden', !show);
            if (msg) console.log('[velas][' + casaNome + '/' + ligaNome + ']', msg);
        };

        const STATE_KEY = 'betstat:velas:estado:v2:' + casaKey + ':' + ligaNome;

        const mercados = novosMercados();

        let chart = null;
        let visibleRange = null;
        let dotsMode = false;
        let candleMode = true;

        const series = {};
        const candleSeries = {};

        let velasNumPoints = 60;
        let pontosAtuais = {};
        let dataPorMercado = {};
        let candlePorMercado = {};
        let ultimoValorPorMercado = {};
        let rawDataCache = null;
        let pollTimer = null;
        let destroyed = false;

        function saveState(){
            try {
                const range = chart?.timeScale?.().getVisibleLogicalRange?.() || visibleRange;
                localStorage.setItem(STATE_KEY, JSON.stringify({
                    range, dotsMode, candleMode, velasNumPoints,
                    mercados: Object.fromEntries(Object.entries(mercados).map(([k, v]) => [k, !!v.ativo]))
                }));
            } catch {}
        }

        function loadState(){
            try {
                const raw = localStorage.getItem(STATE_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch { return null; }
        }

        function applySavedState(){
            const st = loadState();
            if (!st) return;
            dotsMode = !!st.dotsMode;
            candleMode = st.candleMode !== false;
            if (st.velasNumPoints) velasNumPoints = st.velasNumPoints;
            if (st.mercados) Object.keys(mercados).forEach(k => { if (k in st.mercados) mercados[k].ativo = !!st.mercados[k]; });
            if (st.range && Number.isFinite(st.range.from) && Number.isFinite(st.range.to)) visibleRange = st.range;

            $('[data-role="btnDots"]')?.classList.toggle('active', dotsMode);
            $('[data-role="btnCandle"]')?.classList.toggle('active', candleMode);
            $('[data-role="pointsSelector"]').value = String(velasNumPoints);
        }

        function buildSeriesData(rawData){
            const sorted = [...rawData].sort((a, b) => {
                const dA = new Date(a.data), dB = new Date(b.data);
                if (dA.getTime() !== dB.getTime()) return dA - dB;
                if (a.hora !== b.hora) return a.hora - b.hora;
                return a.minuto - b.minuto;
            });
            const sliced = sorted.slice(-velasNumPoints);
            const usadosDesc = sliced.slice().reverse();

            const data = {}, candles = {};
            Object.keys(mercados).forEach(k => { data[k] = []; candles[k] = []; ultimoValorPorMercado[k] = 0; });
            pontosAtuais = {};

            const BLOCO = 20;
            const totalBlocos = Math.floor(usadosDesc.length / BLOCO);

            if (totalBlocos < 2){
                dataPorMercado = data;
                candlePorMercado = candles;
                log(`⚠️ selecione pelo menos 40 jogos (compara blocos de ${BLOCO} jogos, precisa de no mínimo 2 blocos).`, true);
                return;
            }

            const blocos = [];
            for (let i = 0; i < totalBlocos; i++) blocos.push(usadosDesc.slice(i * BLOCO, i * BLOCO + BLOCO));

            const blocoBase = blocos[blocos.length - 1];

            const refs = [blocoBase[BLOCO - 1] || blocoBase[blocoBase.length - 1] || null];
            for (let b = totalBlocos - 2; b >= 0; b--) {
                for (let i = BLOCO - 1; i >= 0; i--) refs.push(blocos[b][i] || null);
            }

            function totalGolsFt(m){
                let ft = [0, 0];
                if (m?.ft && m.ft.includes(' x ')) ft = m.ft.split(' x ').map(Number);
                return (Number.isFinite(ft[0]) && Number.isFinite(ft[1])) ? (ft[0] + ft[1]) : 0;
            }

            Object.keys(mercados).forEach(key => {
                let pontos, cores;

                if (key === 'totalGols') {
                    const mediaGolsFt = blocoBase.length
                        ? blocoBase.reduce((s, m) => s + totalGolsFt(m), 0) / blocoBase.length
                        : 0;
                    pontos = [mediaGolsFt * 20];
                    cores = ['flat'];

                    for (let b = totalBlocos - 2; b >= 0; b--) {
                        for (let i = BLOCO - 1; i >= 0; i--) {
                            const atual = blocos[b][i];
                            const ref   = blocos[b + 1][i];
                            if (!atual || !ref) { pontos.push(pontos[pontos.length - 1]); cores.push('flat'); continue; }
                            const deltaGols = totalGolsFt(atual) - totalGolsFt(ref);
                            pontos.push(pontos[pontos.length - 1] + deltaGols);
                            cores.push(deltaGols > 0 ? '#4CAF50' : deltaGols < 0 ? '#FF3B30' : 'flat');
                        }
                    }
                } else {
                    const totalCond = blocoBase.filter(m => bateMercado(m, key)).length;
                    const pctInicial = blocoBase.length ? (totalCond / blocoBase.length) * 100 : 0;

                    pontos = [pctInicial];
                    cores = ['flat'];

                    for (let b = totalBlocos - 2; b >= 0; b--) {
                        for (let i = BLOCO - 1; i >= 0; i--) {
                            const atual = blocos[b][i];
                            const ref   = blocos[b + 1][i];
                            if (!atual || !ref) { pontos.push(pontos[pontos.length - 1]); cores.push('flat'); continue; }
                            const a = bateMercado(atual, key);
                            const r = bateMercado(ref, key);
                            let delta = 0;
                            if (a && !r) delta = 5;
                            else if (!a && r) delta = -5;
                            pontos.push(pontos[pontos.length - 1] + delta);
                            if (a && r) cores.push('#4CAF50');
                            else if (!a && !r) cores.push('#FF3B30');
                            else cores.push('flat');
                        }
                    }
                }

                pontos.forEach((close, idx) => {
                    const time = idx + 1;
                    const open = idx > 0 ? pontos[idx - 1] : close;
                    const corpo = close - open;
                    const pavio = Math.max(0.35, Math.abs(corpo) * 0.35);

                    data[key].push({ time, value: close });

                    const item = {
                        time, open, close,
                        high: Math.max(open, close) + pavio,
                        low:  Math.min(open, close) - pavio
                    };
                    const cor = cores[idx];
                    if (cor && cor !== 'flat') { item.color = cor; item.borderColor = cor; item.wickColor = cor; }
                    candles[key].push(item);
                });

                ultimoValorPorMercado[key] = pontos[pontos.length - 1] ?? 0;
            });

            refs.forEach((m, idx) => {
                if (!m) return;
                pontosAtuais[idx + 1] = {
                    labelTempo: `${String(m.hora).padStart(2, '0')}:${String(m.minuto).padStart(2, '0')}`,
                    jogo: `${m.time_a || ''} x ${m.time_b || ''}`,
                    ft: m.ft || '-',
                    ht: m.ht || '-'
                };
            });

            dataPorMercado = data;
            candlePorMercado = candles;
        }

        function addLineSeries(key, cfg){
            const options = {
                color: cfg.cor,
                lineWidth: key === 'over25' ? 2 : 1.8,
                priceLineVisible: false,
                lastValueVisible: false,
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 4,
                pointMarkersVisible: true
            };
            if (chart.addSeries && window.LightweightCharts.LineSeries){
                return chart.addSeries(window.LightweightCharts.LineSeries, options);
            }
            return chart.addLineSeries(options);
        }

        function addCandleSeriesFn(key, cfg){
            const options = {
                upColor: cfg.cor, downColor: '#ef4444',
                borderUpColor: cfg.cor, borderDownColor: '#ef4444',
                wickUpColor: cfg.cor, wickDownColor: '#ef4444',
                priceLineVisible: false, lastValueVisible: false
            };
            if (chart.addSeries && window.LightweightCharts.CandlestickSeries){
                return chart.addSeries(window.LightweightCharts.CandlestickSeries, options);
            }
            return chart.addCandlestickSeries(options);
        }

        function createChart(){
            const el = $('[data-role="container"]');
            if (!el || !window.LightweightCharts) return false;
            if (chart) return true;

            chart = window.LightweightCharts.createChart(el, {
                layout: { background: { color: 'transparent' }, textColor: '#d7dce6' },
                localization: { timeFormatter: t => pontosAtuais[t]?.labelTempo || String(t) },
                grid: {
                    vertLines: { color: 'rgba(255,255,255,.045)' },
                    horzLines: { color: 'rgba(255,255,255,.045)' }
                },
                rightPriceScale: { borderVisible: false },
                timeScale: {
                    borderColor: 'rgba(63,169,255,.25)',
                    timeVisible: false,
                    secondsVisible: false,
                    rightOffset: 1,
                    barSpacing: 22,
                    rightBarStaysOnScroll: true,
                    tickMarkFormatter: t => pontosAtuais[t]?.labelTempo || ''
                },
                crosshair: { mode: window.LightweightCharts.CrosshairMode.Normal },
                handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
                handleScale:  { axisPressedMouseMove: true, mouseWheel: true, pinch: true }
            });

            Object.entries(mercados).forEach(([key, cfg]) => {
                series[key] = addLineSeries(key, cfg);
                candleSeries[key] = addCandleSeriesFn(key, cfg);
            });

            chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
                if (range) { visibleRange = range; saveState(); }
                tools?.redraw?.();
            });

            chart.subscribeCrosshairMove(renderTooltip);
            return true;
        }

        function renderSeries(){
            Object.keys(mercados).forEach(key => {
                const ativo = !!mercados[key].ativo;
                if (candleMode){
                    series[key]?.setData([]);
                    candleSeries[key]?.setData(ativo ? (candlePorMercado[key] || []) : []);
                } else {
                    candleSeries[key]?.setData([]);
                    series[key]?.setData(ativo ? (dataPorMercado[key] || []) : []);
                }
                series[key]?.applyOptions({
                    color: dotsMode && !candleMode ? 'rgba(63,169,255,0.08)' : mercados[key].cor,
                    lineWidth: dotsMode && !candleMode ? 1 : (key === 'over25' ? 2 : 1.8),
                    crosshairMarkerVisible: true,
                    crosshairMarkerRadius: dotsMode ? 5 : 4
                });
            });
        }

        function resizeChart(){
            const el = $('[data-role="container"]');
            if (!chart || !el) return;
            const rect = el.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) return;
            chart.applyOptions({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
            tools?.resize?.();
            tools?.redraw?.();
        }

        function zoomGrafico(factor){
            if (!chart) return;
            const timeScale = chart.timeScale();
            const range = timeScale.getVisibleLogicalRange();
            if (!range) return;
            const center = (range.from + range.to) / 2;
            const width = (range.to - range.from) * factor;
            timeScale.setVisibleLogicalRange({ from: center - width / 2, to: center + width / 2 });
            tools?.redraw?.();
        }

        function getTooltipEl(){
            let el = root.querySelector('.gt-tooltip');
            if (!el){
                el = document.createElement('div');
                el.className = 'gt-tooltip';
                $('[data-role="container"]')?.appendChild(el);
            }
            return el;
        }

        function renderTooltip(param){
            const el = getTooltipEl();
            const container = $('[data-role="container"]');
            if (!param || !param.point || !container || param.time == null){
                el.style.display = 'none';
                return;
            }
            const info = pontosAtuais[param.time];
            if (!info){ el.style.display = 'none'; return; }

            el.innerHTML = `
                <div class="gt-tooltip-title">${info.jogo}</div>
                <div class="gt-tooltip-sub">HT: ${info.ht}</div>
                <div class="gt-tooltip-odd">FT: ${info.ft}</div>
                <div class="gt-tooltip-time">${info.labelTempo}</div>
            `;

            const rect = container.getBoundingClientRect();
            const tooltipW = 230, tooltipH = 92;
            let left = param.point.x + 14, top = param.point.y + 14;
            if (left + tooltipW > rect.width) left = param.point.x - tooltipW - 14;
            if (top + tooltipH > rect.height) top = param.point.y - tooltipH - 14;
            el.style.left = `${Math.max(8, left)}px`;
            el.style.top  = `${Math.max(8, top)}px`;
            el.style.display = 'block';
        }

        function render(){
            if (!rawDataCache || destroyed) return;
            if (!createChart()) return;

            const beforeRange = chart.timeScale().getVisibleLogicalRange();
            buildSeriesData(rawDataCache);
            renderSeries();

            if (beforeRange) chart.timeScale().setVisibleLogicalRange(beforeRange);
            else if (visibleRange) chart.timeScale().setVisibleLogicalRange(visibleRange);
            else chart.timeScale().scrollToRealTime();

            saveState();
            log('', false); // sem texto fixo no topo — status só aparece em erro/loading

            requestAnimationFrame(() => {
                resizeChart();
                tools?.redraw?.();
            });
        }

        function syncLegendUI(){
            root.querySelectorAll('[data-gt-market]').forEach(btn => {
                const key = btn.dataset.gtMarket;
                btn.classList.toggle('selected', !!mercados[key]?.ativo);
            });
        }

        // ---------- EVENTOS ----------
        root.querySelectorAll('[data-gt-market]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.gtMarket;
                if (!mercados[key]) return;
                mercados[key].ativo = !mercados[key].ativo;
                syncLegendUI();
                saveState();
                render();
            });
        });

        $('[data-role="btnDots"]').addEventListener('click', () => {
            dotsMode = !dotsMode;
            if (dotsMode) candleMode = false;
            $('[data-role="btnDots"]').classList.toggle('active', dotsMode);
            $('[data-role="btnCandle"]').classList.toggle('active', candleMode);
            saveState();
            render();
        });

        $('[data-role="btnCandle"]').addEventListener('click', () => {
            candleMode = !candleMode;
            if (candleMode) dotsMode = false;
            $('[data-role="btnCandle"]').classList.toggle('active', candleMode);
            $('[data-role="btnDots"]').classList.toggle('active', dotsMode);
            saveState();
            render();
        });

        $('[data-role="btnZoomIn"]').addEventListener('click', () => zoomGrafico(0.78));
        $('[data-role="btnZoomOut"]').addEventListener('click', () => zoomGrafico(1.28));

        $('[data-role="pointsSelector"]').addEventListener('change', e => {
            velasNumPoints = parseInt(e.target.value, 10);
            saveState();
            render();
        });

        root.querySelectorAll('[data-gt-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                root.querySelectorAll('[data-gt-tool]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                tools?.setTool?.(btn.dataset.gtTool || 'select');
            });
        });

        $('[data-role="btnCurrentLine"]').addEventListener('click', () => {
            tools?.addCurrentLine?.();
        });

        $('[data-role="btnClose"]').addEventListener('click', () => {
            destroy();
            onClose?.();
        });

        if (window.ResizeObserver){
            const ro = new ResizeObserver(() => resizeChart());
            ro.observe($('[data-role="container"]'));
            root._gvResizeObserver = ro;
        }
        window.addEventListener('resize', resizeChart);

        // ---------- API pública desse painel (usada pelas ferramentas de desenho) ----------
        const coreApi = {
            getChart: () => chart,
            getSeries: () => series,
            getCandleSeries: () => candleSeries,
            getActiveMarket: () => Object.keys(mercados).find(k => mercados[k].ativo) || 'totalGols',
            getMarketColor: (key) => mercados[key]?.cor || '#60a5fa',
            getLastValue: (key) => ultimoValorPorMercado[key || (Object.keys(mercados).find(k => mercados[k].ativo) || 'totalGols')] ?? 0
        };

        const toolsStorageKey = 'betstat:velas:tools:v2:' + casaKey + ':' + ligaNome;
        const tools = window.GraficoTradingTools.createInstance(root, () => coreApi, toolsStorageKey);

        function destroy(){
            destroyed = true;
            if (pollTimer) clearInterval(pollTimer);
            window.removeEventListener('resize', resizeChart);
            root._gvResizeObserver?.disconnect?.();
            tools?.destroy?.();
            chart?.remove?.();
            root.remove();
        }

        // ---------- BOOT ----------
        applySavedState();
        syncLegendUI();

        log('buscando dados de ' + ligaNome + '...', true);

        function fetchData(first){
            fetch(url + '?timestamp=' + Date.now())
                .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .then(data => {
                    if (destroyed) return;
                    rawDataCache = Array.isArray(data) ? data : (data.rows || data.resultados || []);
                    if (!rawDataCache.length){
                        log('⚠️ resposta chegou mas veio vazia.', true);
                        return;
                    }
                    render();
                    if (first) requestAnimationFrame(() => tools?.onOpen?.());
                })
                .catch(err => {
                    if (destroyed) return;
                    log('❌ erro buscando dados: ' + err.message, true);
                    console.error('[velas]', err);
                });
        }

        fetchData(true);
        pollTimer = setInterval(() => fetchData(false), 5000);

        return { root, destroy, casaKey, ligaNome };
    }

    return { LIGAS_DB, createPanel };
})();
