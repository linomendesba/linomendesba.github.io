/* ═══════════════════════════════════════════════════════════════════
   GRÁFICO MERCADOS 
═══════════════════════════════════════════════════════════════════ */
 
const SETUPS_KEY            = 'mgraf:setups_v4';
const ACTIVE_SETUP_KEY      = 'mgraf:activeSetup_v4';
const VISIBLE_DS_KEY        = 'mgraf:visibleDatasets_v4';
const DRAG_LINES_KEY        = 'mgraf:draglines';
const ACCORDION_KEY         = 'mgraf:accordionOpen';
const SETUP_LINE_TOGGLE_KEY = 'mgraf:lineToggles_v4';
 
const MAX_SETUPS    = 10;
const MAX_DRAG_LINES = 6;
 
/* ───────────────────────────────────────────
   VARIÁVEIS GLOBAIS DE ESTADO
─────────────────────────────────────────── */
let numPoints          = 20;
let averagePoints      = 19;
let showFibonacciLines = false;
let showMovingAverages = false;
let showLabels         = false;   // rótulos acima dos pontos
const leagues          = ['Copa'];
const chartInstances   = {};
let chartData          = {};
 
let _tabVisible = !document.hidden;
document.addEventListener('visibilitychange', () => {
    _tabVisible = !document.hidden;
    if (_tabVisible) updateCharts();
});
 
/* ───────────────────────────────────────────
   MAPA LABEL → CHAVE
─────────────────────────────────────────── */
const labelToKey = {
    'Gols FT':'golsFT','Gols HT':'golsHT','Gols Individual':'golsInd',
    'Casa Vence':'casaVence','Empate':'empate','Fora Vence':'foraVence',
    'Ambas Sim':'ambasSim','Ambas Não':'ambasNao',
    'Over 0.5':'over05','Over 1.5':'over15','Over 2.5':'over25',
    'Over 3.5':'over35','Over 5+':'over5',
    'Under 0.5':'under05','Under 1.5':'under15',
    'Under 2.5':'under25','Under 3.5':'under35',
    '0 Gol Exato':'gol0','1 Gol Exato':'gol1','2 Gols Exatos':'gol2',
    '3 Gols Exatos':'gol3','4 Gols Exatos':'gol4','5 Gols Exatos':'gol5',
    '0 Gol 2T':'gol2t0','1 Gol 2T':'gol2t1','2 Gols 2T':'gol2t2',
    '3 Gols 2T':'gol2t3','4 Gols 2T':'gol2t4',
    'Casa 0 Gols':'casa0','Casa 1 Gol':'casa1','Casa 2 Gols':'casa2',
    'Casa 3 Gols':'casa3','Casa 4 Gols':'casa4',
    'Fora 0 Gols':'fora0','Fora 1 Gol':'fora1','Fora 2 Gols':'fora2',
    'Fora 3 Gols':'fora3','Fora 4 Gols':'fora4',
    '0x0':'placar0x0','1x0':'placar1x0','2x0':'placar2x0','3x0':'placar3x0',
    '2x1':'placar2x1','3x1':'placar3x1','3x2':'placar3x2',
    '4x0':'placar4x0','4x1':'placar4x1',
    '0x1':'placar0x1','0x2':'placar0x2','1x2':'placar1x2',
    '0x3':'placar0x3','1x3':'placar1x3','2x3':'placar2x3',
    '0x4':'placar0x4','1x4':'placar1x4',
    '0x0 HT':'placarHT0x0','0x1 HT':'placarHT0x1','1x0 HT':'placarHT1x0',
    '1x1 HT':'placarHT1x1','0x2 HT':'placarHT0x2','2x0 HT':'placarHT2x0',
    'OUT HT':'placarHTOut',
    'OverHT':'overHT','UnderHT':'underHT',
    'Casa HT':'casaHT','Empate HT':'empateHT','Fora HT':'foraHT',
    'Viradinha':'viradinha',
    'Par':'par','Ímpar':'impar',
    'Margem 1':'margem1','Margem 2':'margem2','Margem 3':'margem3',
    'Empate Com Gols':'empateGols',
    'Gols FT Casa':'golsFTCasa','Gols FT Fora':'golsFTFora'
};
 
const DATASET_COLORS = {
    'Gols FT':'#FFFF00','Gols HT':'#26A69A','Gols Individual':'#FF5A36',
    'Ambas Sim':'#B0BEC5','Ambas Não':'#F44336',
    'Casa Vence':'#AB47BC','Empate':'#78909C','Fora Vence':'#2196F3',
    'Over 0.5':'#80DEEA','Over 1.5':'#26C6DA','Over 2.5':'#FFEB3B',
    'Over 3.5':'#00BCD4','Over 5+':'#FF7043',
    'Under 0.5':'#A5D6A7','Under 1.5':'#388E3C',
    'Under 2.5':'#FF9800','Under 3.5':'#F06292',
    '0 Gol Exato':'#D81B60','1 Gol Exato':'#8E24AA','2 Gols Exatos':'#A0522D',
    '3 Gols Exatos':'#546E7A','4 Gols Exatos':'#FFB300','5 Gols Exatos':'#00897B',
    '0 Gol 2T':'#CE93D8','1 Gol 2T':'#BA68C8','2 Gols 2T':'#9C27B0',
    '3 Gols 2T':'#7B1FA2','4 Gols 2T':'#4A148C',
    'Casa 0 Gols':'#FFCCBC','Casa 1 Gol':'#FF8A65','Casa 2 Gols':'#FF5722',
    'Casa 3 Gols':'#E64A19','Casa 4 Gols':'#BF360C',
    'Fora 0 Gols':'#B3E5FC','Fora 1 Gol':'#4FC3F7','Fora 2 Gols':'#0288D1',
    'Fora 3 Gols':'#01579B','Fora 4 Gols':'#002F6C',
    '0x0':'#E91E63','1x0':'#9C27B0','2x0':'#673AB7','3x0':'#3F51B5',
    '2x1':'#009688','3x1':'#4CAF50','3x2':'#8BC34A',
    '4x0':'#CDDC39','4x1':'#FFC107',
    '0x1':'#FF6090','0x2':'#D81B60','1x2':'#43A047',
    '0x3':'#F4511E','1x3':'#8E24AA','2x3':'#FDD835',
    '0x4':'#546E7A','1x4':'#00897B',
    '0x0 HT':'#FF6090','0x1 HT':'#D81B60','1x0 HT':'#43A047',
    '1x1 HT':'#F4511E','0x2 HT':'#8E24AA','2x0 HT':'#FDD835',
    'OUT HT':'#546E7A',
    'OverHT':'#A0522D','UnderHT':'#00897B',
    'Casa HT':'#3949AB','Empate HT':'#FF6F00','Fora HT':'#C2185B',
    'Viradinha':'#FF4081',
    'Par':'#76FF03','Ímpar':'#D500F9',
    'Margem 1':'#FFD600','Margem 2':'#FF9100','Margem 3':'#FF1744',
    'Empate Com Gols':'#00BFA5',
    'Gols FT Casa':'#00E5FF','Gols FT Fora':'#FF6E40'
};
 
const MARKET_GROUPS = [
    { title:'Geral',       labels:['Gols FT','Gols HT','Gols Individual'] },
    { title:'Resultado',   labels:['Casa Vence','Empate','Fora Vence'] },
    { title:'Ambas',       labels:['Ambas Sim','Ambas Não'] },
    { title:'Over',        labels:['Over 0.5','Over 1.5','Over 2.5','Over 3.5','Over 5+'] },
    { title:'Under',       labels:['Under 0.5','Under 1.5','Under 2.5','Under 3.5'] },
    { title:'Gols Exatos', labels:['0 Gol Exato','1 Gol Exato','2 Gols Exatos','3 Gols Exatos','4 Gols Exatos','5 Gols Exatos'] },
    { title:'Gols 2T',     labels:['0 Gol 2T','1 Gol 2T','2 Gols 2T','3 Gols 2T','4 Gols 2T'] },
    { title:'Casa',        labels:['Casa 0 Gols','Casa 1 Gol','Casa 2 Gols','Casa 3 Gols','Casa 4 Gols'] },
    { title:'Fora',        labels:['Fora 0 Gols','Fora 1 Gol','Fora 2 Gols','Fora 3 Gols','Fora 4 Gols'] },
    { title:'Placares FT', labels:['0x0','1x0','2x0','3x0','2x1','3x1','3x2','4x0','4x1','0x1','0x2','1x2','0x3','1x3','2x3','0x4','1x4'] },
    { title:'Placar HT',   labels:['0x0 HT','0x1 HT','1x0 HT','1x1 HT','0x2 HT','2x0 HT','OUT HT'] },
    { title:'Resultado HT',labels:['Casa HT','Empate HT','Fora HT'] },
    { title:'Over/Under HT',labels:['OverHT','UnderHT'] },
    { title:'Viradinha',    labels:['Viradinha'] },
    { title:'Par / Ímpar',     labels:['Par','Ímpar'] },
    { title:'Margem de Gols',  labels:['Margem 1','Margem 2','Margem 3'] },
    { title:'Empate com Gols',labels:['Empate Com Gols'] },
    { title:'Gols FT por Time',labels:['Gols FT Casa','Gols FT Fora'] }
];
 
/* ═══════════════════════════════════════════════════════════════════
   HELPERS DE STORAGE
═══════════════════════════════════════════════════════════════════ */
function _ls(key, fallback) {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
}
function _lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
 
/* ═══════════════════════════════════════════════════════════════════
   ESTADO POR SETUP
   Cada setup guarda: markets, colors, horas, base,
   fibonacci, mediasMoveis, linhaAtual, dragLines, labels
═══════════════════════════════════════════════════════════════════ */
const SETUP_PADRAO = {
    id: '__padrao__',
    name: 'Padrão',
    markets: [],
    colors: {},
    horas: 160, base: 19,
    fibonacci: false, mediasMoveis: false,
    linhaAtual: true, labels: false,
    dragLines: []
};
 
function _loadCustomSetups()    { return _ls(SETUPS_KEY, []); }
function _saveCustomSetups(arr) { _lsSet(SETUPS_KEY, arr); }
function _loadActiveId()        { return _ls(ACTIVE_SETUP_KEY, '__padrao__'); }
function _saveActiveId(id)      { _lsSet(ACTIVE_SETUP_KEY, id); }
function _getAllSetups()         { return [SETUP_PADRAO, ..._loadCustomSetups()]; }
function _getActiveSetup()      {
    const id = _loadActiveId();
    return _getAllSetups().find(s => s.id === id) || SETUP_PADRAO;
}
function _marketColor(setup, label) {
    return (setup.colors && setup.colors[label]) || DATASET_COLORS[label] || '#888';
}
 
/* ── TOGGLES DE LINHA POR SETUP ── */
function _getLineToggles(setupId) {
    const all = _ls(SETUP_LINE_TOGGLE_KEY, {});
    return all[setupId] || {};
}
function _saveLineToggles(setupId, toggles) {
    const all = _ls(SETUP_LINE_TOGGLE_KEY, {});
    all[setupId] = toggles;
    _lsSet(SETUP_LINE_TOGGLE_KEY, all);
}
function _isLineActive(setupId, label) {
    const t = _getLineToggles(setupId);
    return t[label] !== undefined ? t[label] : true;
}
function _setLineActive(setupId, label, active) {
    const t = _getLineToggles(setupId);
    t[label] = active;
    _saveLineToggles(setupId, t);
}
 
/* ── SALVA O ESTADO ATUAL DOS CONTROLES NO SETUP ── */
function _captureControlsToSetup(setup) {
    if (!setup || setup.id === '__padrao__') return;
    const arr = _loadCustomSetups();
    const idx = arr.findIndex(s => s.id === setup.id);
    if (idx === -1) return;
 
    const pSel = document.getElementById('pointsSelector');
    const aSel = document.getElementById('averageSelector');
    const fib  = document.getElementById('fibonacciToggle');
    const med  = document.getElementById('movingAveragesToggle');
    const lat  = document.getElementById('linhaAtualToggle');
    const lbl  = document.getElementById('labelsToggle');
 
    arr[idx].horas        = pSel ? parseInt(pSel.value,10) : setup.horas;
    arr[idx].base         = aSel ? parseInt(aSel.value,10) : setup.base;
    arr[idx].fibonacci    = fib  ? fib.checked  : setup.fibonacci;
    arr[idx].mediasMoveis = med  ? med.checked  : setup.mediasMoveis;
    arr[idx].linhaAtual   = lat  ? lat.checked  : setup.linhaAtual;
    arr[idx].labels       = lbl  ? lbl.checked  : setup.labels;
 
    // Drag lines
    const ci = chartInstances['Copa'] || Object.values(chartInstances)[0];
    if (ci && ci.dragLines) {
        arr[idx].dragLines = ci.dragLines.map(l => ({ y: l.y, color: l.color || '#1fcc59' }));
    }
    _saveCustomSetups(arr);
}
 
/* ── APLICA SETUP ── */
function _applySetup(setup) {
    // Salva estado do setup anterior antes de trocar
    const prevSetup = _getActiveSetup();
    if (prevSetup.id !== setup.id) {
        _captureControlsToSetup(prevSetup);
    }
 
    _saveActiveId(setup.id);
 
    // Visibilidade dos datasets
    Object.keys(labelToKey).forEach(label => {
        const inSetup = setup.markets.includes(label);
        const toggled = _isLineActive(setup.id, label);
        statsChartVisibleDatasets[label] = inSetup && toggled;
    });
    _saveVisibleDatasets(statsChartVisibleDatasets);
 
    // Restaura controles do setup
    const pSel = document.getElementById('pointsSelector');
    const aSel = document.getElementById('averageSelector');
    const fib  = document.getElementById('fibonacciToggle');
    const med  = document.getElementById('movingAveragesToggle');
    const lat  = document.getElementById('linhaAtualToggle');
    const lbl  = document.getElementById('labelsToggle');
 
    const h = setup.horas        ?? 160;
    const b = setup.base         ?? 19;
    const f = setup.fibonacci    ?? false;
    const m = setup.mediasMoveis ?? false;
    const l = setup.linhaAtual   ?? true;
    const lb = setup.labels      ?? false;
 
    if (pSel) pSel.value = String(h);
    if (aSel) aSel.value = String(b);
    if (fib)  fib.checked  = f;
    if (med)  med.checked  = m;
    if (lat)  lat.checked  = l;
    if (lbl)  lbl.checked  = lb;
 
    numPoints      = h;
    averagePoints  = b;
    showFibonacciLines  = f;
    showMovingAverages  = m;
    showLabels          = lb;
 
    // Aplica drag lines do setup
    const ci = chartInstances['Copa'] || Object.values(chartInstances)[0];
    if (ci) {
        ci.dragLines = (setup.dragLines || []).map(dl => ({
            y: Number(dl.y), color: dl.color || '#1fcc59', dragging: false
        }));
        ci._selectedDragLine = -1;
        _saveDragLines(ci.dragLines);
        _atualizarContador(ci.dragLines);
 
        // Linha atual
        ci.options.plugins.linhaAtual.enabled = l;
 
        // Aplica cores + visibilidade
        ci.data.datasets.forEach((ds, idx) => {
            const mainLabel = ds.label.includes(' - ') ? ds.label.split(' - ')[0] : ds.label;
            const vis = statsChartVisibleDatasets[mainLabel];
            ci.getDatasetMeta(idx).hidden = ds.label.includes(' - ')
                ? !m || !vis : !vis;
            if (!ds.label.includes(' - ') && setup.colors && setup.colors[mainLabel]) {
                ds.borderColor     = setup.colors[mainLabel];
                ds.backgroundColor = setup.colors[mainLabel];
            } else if (!ds.label.includes(' - ')) {
                ds.borderColor     = DATASET_COLORS[mainLabel] || '#888';
                ds.backgroundColor = DATASET_COLORS[mainLabel] || '#888';
            }
        });
        ci.update();
    }
 
    _renderSetupBar();
    _renderLinesPanel(setup);
    _updateSetupCounter();
    updateCharts(); // re-fetch com novos numPoints/averagePoints
}
 
/* ── VALOR ATUAL DE UM DATASET (último ponto visível) ── */
function _getDatasetCurrentValue(label) {
    const ci = chartInstances['Copa'] || Object.values(chartInstances)[0];
    if (!ci) return null;
    const ds = ci.data.datasets.find(d => d.label === label);
    if (!ds || !ds.data) return null;
    for (let j = ds.data.length - 1; j >= 0; j--) {
        const v = ds.data[j];
        if (v !== null && v !== undefined && isFinite(v)) return v;
    }
    return null;
}
 
/* ── RENDERIZA BARRA DE CHIPS ── */
function _renderSetupBar() {
    const bar = document.getElementById('setupBar');
    if (!bar) return;
    bar.innerHTML = '';
    const activeId = _loadActiveId();
 
    _getAllSetups().forEach(setup => {
        if (setup.id === '__padrao__') return; // chip "Padrão" não é mais exibido na barra
 
        const item = document.createElement('div');
        item.className = 'setup-item' + (setup.id === activeId ? ' active' : '');
 
        const btn = document.createElement('button');
        btn.className = 'setup-btn';
 
        const nameSpan = document.createElement('span');
        nameSpan.textContent = setup.name;
 
        const editHint = document.createElement('span');
        editHint.className = 'setup-edit-hint';
        editHint.textContent = '✏';
        editHint.title = 'Duplo clique para editar';
 
        btn.appendChild(nameSpan);
        if (setup.id !== '__padrao__') btn.appendChild(editHint);
 
        btn.title = setup.id === '__padrao__'
            ? setup.markets.join(' · ')
            : `${setup.markets.join(' · ')}\nDuplo clique para editar`;
 
        btn.addEventListener('click', () => _applySetup(setup));
        btn.addEventListener('dblclick', e => {
            e.stopPropagation();
            if (setup.id === '__padrao__') {
                alert('O setup "Padrão" não pode ser editado.');
                return;
            }
            _openSetupModal(setup);
        });
 
        item.appendChild(btn);
 
        if (setup.id !== '__padrao__') {
            // Botão duplicar
            const dup = document.createElement('button');
            dup.className = 'setup-dup';
            dup.textContent = '⧉';
            dup.title = 'Duplicar setup';
            dup.addEventListener('click', e => {
                e.stopPropagation();
                _duplicateSetup(setup);
            });
            item.appendChild(dup);
 
            // Botão deletar
            const del = document.createElement('button');
            del.className = 'setup-del';
            del.textContent = '✕';
            del.title = 'Remover setup';
            del.addEventListener('click', e => {
                e.stopPropagation();
                if (!confirm(`Remover o setup "${setup.name}"?`)) return;
                const arr = _loadCustomSetups().filter(s => s.id !== setup.id);
                _saveCustomSetups(arr);
                if (_loadActiveId() === setup.id) _applySetup(SETUP_PADRAO);
                else { _renderSetupBar(); _updateSetupCounter(); }
            });
            item.appendChild(del);
        }
 
        bar.appendChild(item);
    });
}
 
/* ── DUPLICAR SETUP ── */
function _duplicateSetup(setup) {
    const arr = _loadCustomSetups();
    if (arr.length >= MAX_SETUPS) {
        alert(`Limite de ${MAX_SETUPS} setups atingido. Remova um antes de duplicar.`);
        return;
    }
    const dup = JSON.parse(JSON.stringify(setup));
    dup.id   = 'setup_' + Date.now();
    dup.name = setup.name + ' (cópia)';
    arr.push(dup);
    _saveCustomSetups(arr);
    _renderSetupBar();
    _updateSetupCounter();
}
 
/* ── PRÉVIA NO HOVER (mostra a linha temporariamente sem ativar de verdade) ── */
function _setPreviewLine(label, show) {
    leagues.forEach(l => {
        const ci = chartInstances[l]; if (!ci) return;
        let changed = false;
        ci.data.datasets.forEach((ds, idx) => {
            const ml = ds.label.includes(' - ') ? ds.label.split(' - ')[0] : ds.label;
            if (ml !== label) return;
            const isMA = ds.label.includes(' - ');
            const newHidden = show ? (isMA ? !showMovingAverages : false) : true;
            const meta = ci.getDatasetMeta(idx);
            if (meta.hidden !== newHidden) { meta.hidden = newHidden; changed = true; }
        });
        if (changed) ci.update('none');
    });
}
 
/* ── RENDERIZA PAINEL DE TOGGLES (ordenado pela ordem do setup) ── */
function _renderLinesPanel(setup) {
    const panel = document.getElementById('setupLinesPanel');
    if (!panel) return;
    panel.innerHTML = '';
    if (!setup || !setup.markets || setup.markets.length === 0) return;
 
    // Ordenado pela ordem do setup.markets
    setup.markets.forEach(label => {
        const active = _isLineActive(setup.id, label);
        const color  = _marketColor(setup, label);
        const val    = _getDatasetCurrentValue(label);
 
        let tooltipText = label;
        if (val !== null) {
            const isGols = label === 'Gols FT' || label === 'Gols HT' || label === 'Gols FT Casa' || label === 'Gols FT Fora';
            tooltipText += ' — ' + (isGols ? Math.round(val) + ' gols' : val.toFixed(1));
        }
 
        const toggle = document.createElement('div');
        toggle.className = 'market-toggle' + (active ? ' active' : ' inactive');
        toggle.title = tooltipText;
        toggle.style.setProperty('--mcolor', color);
 
        const dot = document.createElement('span');
        dot.className = 'market-toggle-dot';
        dot.style.background = color;
 
        const txt = document.createElement('span');
        txt.textContent = label;
 
        // Valor atual inline
        if (val !== null) {
            const valSpan = document.createElement('span');
            valSpan.className = 'market-toggle-val';
            const isGols = label === 'Gols FT' || label === 'Gols HT' || label === 'Gols FT Casa' || label === 'Gols FT Fora';
            valSpan.textContent = isGols ? Math.round(val) : val.toFixed(1);
            valSpan.style.color = color;
            toggle.appendChild(dot);
            toggle.appendChild(txt);
            toggle.appendChild(valSpan);
        } else {
            toggle.appendChild(dot);
            toggle.appendChild(txt);
        }
 
        toggle.addEventListener('click', () => {
            toggle.style.outline = ''; // limpa eventual contorno de prévia
            const nowActive = !_isLineActive(setup.id, label);
            _setLineActive(setup.id, label, nowActive);
            statsChartVisibleDatasets[label] = setup.markets.includes(label) && nowActive;
            _saveVisibleDatasets(statsChartVisibleDatasets);
 
            leagues.forEach(l => {
                const ci = chartInstances[l]; if (!ci) return;
                ci.data.datasets.forEach((ds, idx) => {
                    const ml = ds.label.includes(' - ') ? ds.label.split(' - ')[0] : ds.label;
                    if (ml !== label) return;
                    const vis = statsChartVisibleDatasets[ml];
                    ci.getDatasetMeta(idx).hidden = ds.label.includes(' - ')
                        ? !showMovingAverages || !vis : !vis;
                });
                ci.update();
            });
            _renderLinesPanel(_getActiveSetup());
        });
 
        // dataset.label/color sempre presentes (usados também pela
        // atualização leve de valores em _updateLinesPanelValues, que
        // roda a cada 3s sem recriar os elementos)
        toggle.dataset.label = label;
        toggle.dataset.color = color;

        // Prévia ao passar o mouse: só faz sentido para mercados desativados
        if (!active) {
            toggle.addEventListener('mouseenter', () => {
                toggle.style.outline = `2px dashed ${color}`;
                toggle.style.outlineOffset = '2px';
                _setPreviewLine(label, true);
            });
            toggle.addEventListener('mouseleave', () => {
                toggle.style.outline = '';
                // só esconde de novo se o mercado continuar desativado
                // (evita conflito caso o usuário tenha clicado durante o hover)
                if (!_isLineActive(setup.id, label)) _setPreviewLine(label, false);
            });
        }
 
        panel.appendChild(toggle);
    });
 
    // Reconcilia a prévia com a posição real do mouse: o painel é
    // recriado a cada atualização automática (3s), então re-sincroniza
    // aqui pra prévia não "grudar" ligada nem perder o hover em andamento.
    panel.querySelectorAll('.market-toggle.inactive').forEach(el => {
        const lbl = el.dataset.label;
        if (!lbl) return;
        if (el.matches(':hover')) {
            el.style.outline = `2px dashed ${el.dataset.color}`;
            el.style.outlineOffset = '2px';
            _setPreviewLine(lbl, true);
        } else {
            _setPreviewLine(lbl, false);
        }
    });
}

/* ── ATUALIZAÇÃO LEVE DOS VALORES DO PAINEL (sem recriar DOM) ──
   Chamada a cada updateCharts() (3s). Diferente de _renderLinesPanel,
   esta função NUNCA destrói/recria os elementos .market-toggle — apenas
   atualiza o texto do valor e o tooltip. Isso evita que o hover/prévia
   em andamento seja interrompido e o mercado pisque enquanto o usuário
   está analisando o gráfico. Use _renderLinesPanel apenas quando a
   ESTRUTURA realmente muda (troca de setup, ativar/desativar mercado). */
function _updateLinesPanelValues() {
    const panel = document.getElementById('setupLinesPanel');
    if (!panel) return;
    panel.querySelectorAll('.market-toggle').forEach(toggle => {
        const label = toggle.dataset.label;
        if (!label) return;
        const val = _getDatasetCurrentValue(label);
        const isGols = label === 'Gols FT' || label === 'Gols HT' || label === 'Gols FT Casa' || label === 'Gols FT Fora';

        let tooltipText = label;
        if (val !== null) tooltipText += ' — ' + (isGols ? Math.round(val) + ' gols' : val.toFixed(1));
        toggle.title = tooltipText;

        let valSpan = toggle.querySelector('.market-toggle-val');
        if (val !== null) {
            const text = isGols ? Math.round(val) : val.toFixed(1);
            if (!valSpan) {
                valSpan = document.createElement('span');
                valSpan.className = 'market-toggle-val';
                valSpan.style.color = toggle.dataset.color || '#888';
                toggle.appendChild(valSpan);
            }
            valSpan.textContent = text;
        } else if (valSpan) {
            valSpan.remove();
        }
    });
}
 
/* ── CONTADOR ── */
function _updateSetupCounter() {
    const customs = _loadCustomSetups().length;
    const counter = document.getElementById('setupCounter');
    const addBtn  = document.getElementById('btnAddSetup');
    if (counter) {
        counter.textContent = `${customs} / ${MAX_SETUPS}`;
        counter.className = 'setup-counter' + (customs >= MAX_SETUPS ? ' at-limit' : '');
    }
    if (addBtn) {
        addBtn.disabled = customs >= MAX_SETUPS;
        addBtn.title = customs >= MAX_SETUPS ? 'Limite de 10 setups atingido' : 'Criar novo setup';
    }
}
 
/* ═══════════════════════════════════════════════════════════════════
   MODAL CRIAR / EDITAR
═══════════════════════════════════════════════════════════════════ */
let _editingSetupId = null;
 
function _openSetupModal(setupParaEditar) {
    const modal   = document.getElementById('setupModal');
    const warning = document.getElementById('setupLimitWarning');
    if (!modal) return;
 
    const customs = _loadCustomSetups().length;
 
    if (setupParaEditar) {
        _editingSetupId = setupParaEditar.id;
        document.getElementById('setupModalTitle').textContent = 'Editar Setup';
        document.getElementById('setupModalSaveBtn').textContent = '✔ Atualizar Setup';
        document.getElementById('setupModalName').value = setupParaEditar.name;
        if (warning) warning.style.display = 'none';
    } else {
        _editingSetupId = null;
        document.getElementById('setupModalTitle').textContent = 'Criar Setup';
        document.getElementById('setupModalSaveBtn').textContent = '✔ Salvar Setup';
        document.getElementById('setupModalName').value = '';
        if (warning) warning.style.display = customs >= MAX_SETUPS ? 'block' : 'none';
    }
 
    const container = document.getElementById('setupModalMarkets');
    container.innerHTML = '';
 
    // Pré-seleciona mercados do setup ativo ao criar novo
    const refSetup = setupParaEditar || _getActiveSetup();
    const checkedMarkets = refSetup.markets || [];
    const currentColors  = (setupParaEditar ? setupParaEditar.colors : null) || {};
 
    MARKET_GROUPS.forEach(group => {
        const title = document.createElement('div');
        title.className = 'setup-modal-group-title';
        title.textContent = group.title;
        container.appendChild(title);
 
        group.labels.forEach(label => {
            const isChecked = checkedMarkets.includes(label);
            const row = document.createElement('label');
            row.className = 'setup-modal-row' + (isChecked ? ' checked' : '');
 
            const cb = document.createElement('input');
            cb.type    = 'checkbox';
            cb.value   = label;
            cb.checked = isChecked;
            cb.addEventListener('change', () => {
                row.className = 'setup-modal-row' + (cb.checked ? ' checked' : '');
            });
 
            const dot = document.createElement('span');
            dot.className = 'setup-modal-dot';
            const currentColor = currentColors[label] || DATASET_COLORS[label] || '#888';
            dot.style.background = currentColor;
 
            const txt = document.createElement('span');
            txt.textContent = label;
            txt.style.flex  = '1';
 
            const colorPick = document.createElement('input');
            colorPick.type      = 'color';
            colorPick.value     = currentColor;
            colorPick.className = 'market-color-picker';
            colorPick.title     = 'Personalizar cor';
            colorPick.addEventListener('input', () => { dot.style.background = colorPick.value; });
 
            row.appendChild(cb);
            row.appendChild(dot);
            row.appendChild(txt);
            row.appendChild(colorPick);
            container.appendChild(row);
        });
    });
 
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('setupModalName')?.focus(), 60);
}
 
function _closeSetupModal() {
    const modal = document.getElementById('setupModal');
    if (modal) modal.style.display = 'none';
    _editingSetupId = null;
}
 
function _saveSetupModal() {
    const name = document.getElementById('setupModalName').value.trim();
    if (!name) { alert('Digite um nome para o setup.'); return; }
 
    const markets = [], colors = {};
    document.querySelectorAll('#setupModalMarkets .setup-modal-row').forEach(row => {
        const cb = row.querySelector('input[type=checkbox]');
        const cp = row.querySelector('.market-color-picker');
        if (cb && cb.checked) {
            markets.push(cb.value);
            const def = DATASET_COLORS[cb.value] || '#888';
            if (cp && cp.value.toLowerCase() !== def.toLowerCase()) colors[cb.value] = cp.value;
        }
    });
    if (markets.length === 0) { alert('Selecione pelo menos um mercado.'); return; }
 
    const arr = _loadCustomSetups();
 
    if (_editingSetupId) {
        const idx = arr.findIndex(s => s.id === _editingSetupId);
        if (idx !== -1) {
            arr[idx].name    = name;
            arr[idx].markets = markets;
            arr[idx].colors  = colors;
            _saveCustomSetups(arr);
            _closeSetupModal();
            if (_loadActiveId() === _editingSetupId) _applySetup(arr[idx]);
            else { _renderSetupBar(); _updateSetupCounter(); }
        }
    } else {
        if (arr.length >= MAX_SETUPS) {
            alert(`Limite de ${MAX_SETUPS} setups atingido.`);
            return;
        }
        // Herda configurações do setup ativo para o novo
        const active = _getActiveSetup();
        const newSetup = {
            id: 'setup_' + Date.now(), name, markets, colors,
            horas:        active.horas        ?? 160,
            base:         active.base         ?? 19,
            fibonacci:    active.fibonacci    ?? false,
            mediasMoveis: active.mediasMoveis ?? false,
            linhaAtual:   active.linhaAtual   ?? true,
            labels:       active.labels       ?? false,
            dragLines:    []
        };
        arr.push(newSetup);
        _saveCustomSetups(arr);
        _closeSetupModal();
        _applySetup(newSetup);
    }
    _updateSetupCounter();
}
 
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('setupModal')?.addEventListener('click', function(e) {
        if (e.target === this) _closeSetupModal();
    });
 
    // Restaura estado do acordeão
    const accordionOpen = _ls(ACCORDION_KEY, true);
    const content = document.querySelector('.accordion-content');
    if (content && !accordionOpen) content.style.display = 'none';
 
    _renderSetupBar();
    _renderLinesPanel(_getActiveSetup());
    _updateSetupCounter();
});
 
/* ═══════════════════════════════════════════════════════════════════
   ACORDEÃO — persiste aberto/fechado
═══════════════════════════════════════════════════════════════════ */
function toggleAccordion(btn) {
    const content = btn.nextElementSibling;
    const isOpen  = content.style.display !== 'none';
    content.style.display = isOpen ? 'none' : 'block';
    _lsSet(ACCORDION_KEY, !isOpen);
}
 
/* ═══════════════════════════════════════════════════════════════════
   PERSISTÊNCIA DATASETS VISÍVEIS
═══════════════════════════════════════════════════════════════════ */
const defaultStatsChartVisibleDatasets = (() => {
    const d = {};
    Object.keys(labelToKey).forEach(k => d[k] = false);
    return d;
})();
 
function _loadVisibleDatasets() {
    const raw = _ls(VISIBLE_DS_KEY, null);
    if (!raw) return { ...defaultStatsChartVisibleDatasets };
    return Object.assign({}, defaultStatsChartVisibleDatasets, raw);
}
function _saveVisibleDatasets(obj) { _lsSet(VISIBLE_DS_KEY, obj); }
let statsChartVisibleDatasets = _loadVisibleDatasets();
 
/* ═══════════════════════════════════════════════════════════════════
   UTILITÁRIOS
═══════════════════════════════════════════════════════════════════ */
function getKeyFromLabel(label) {
    if (label.includes(' - ')) {
        const [mainLabel, maPart] = label.split(' - ');
        return labelToKey[mainLabel] + maPart.split(' ')[0];
    }
    return labelToKey[label];
}
function computeMA(dataArray, period) {
    return dataArray.map((_, i) => {
        let sum = 0, count = 0;
        for (let j = Math.max(0, i - period + 1); j <= i; j++) {
            if (dataArray[j] !== null) { sum += dataArray[j]; count++; }
        }
        return count > 0 ? sum / count : null;
    });
}
function parseHtScoreTotal(htStr) {
    if (!htStr) return 0;
    if (htStr === 'OUT') return 3;
    if (htStr.includes(' x ')) {
        const p = htStr.split(' x ').map(Number);
        if (p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])) return p[0] + p[1];
    }
    return 0;
}
function parseHtParts(htStr) {
    if (!htStr || htStr === 'OUT') return null;
    if (htStr.includes(' x ')) {
        const p = htStr.split(' x ').map(Number);
        if (p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])) return p;
    }
    return null;
}
 
/* ═══════════════════════════════════════════════════════════════════
   PLUGIN — RÓTULOS ACIMA DOS PONTOS
   Exibe só o número (sem %) acima de cada ponto visível.
   Ativo apenas quando showLabels === true.
═══════════════════════════════════════════════════════════════════ */
const rotulosPlugin = {
    id: 'rotulos',
    afterDatasetsDraw(chart) {
        if (!showLabels) return;
        const {ctx, chartArea, scales} = chart;
        if (!chartArea || !scales.y) return;
 
        chart.data.datasets.forEach((ds, dsIdx) => {
            if (ds.label.includes(' MA')) return;           // ignora MAs
            if (!chart.isDatasetVisible(dsIdx)) return;     // ignora invisíveis
            const meta = chart.getDatasetMeta(dsIdx);
            if (!meta || !meta.data) return;
 
            const color = ds.borderColor || '#fff';
            ctx.save();
            ctx.font = 'bold 9px Arial,sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = color;
 
            meta.data.forEach((point, i) => {
                const v = ds.data[i];
                if (v === null || v === undefined || !isFinite(v)) return;
                // Só desenha se o ponto estiver dentro da área do gráfico
                if (point.x < chartArea.left || point.x > chartArea.right) return;
                if (point.y < chartArea.top  || point.y > chartArea.bottom) return;
 
                const isGols = ds.label === 'Gols FT' || ds.label === 'Gols HT';
                const text   = isGols ? String(Math.round(v)) : String(Math.round(v));
                // "Math.round" para inteiro limpo — sem % e sem casas decimais
 
                ctx.fillText(text, point.x, point.y - 4);
            });
            ctx.restore();
        });
    }
};
 
/* ═══════════════════════════════════════════════════════════════════
   PLUGINS — Fibonacci, Linha Atual, Drag Lines
═══════════════════════════════════════════════════════════════════ */
const fibonacciLinesPlugin = {
    id: 'fibonacciLines',
    afterDraw(chart) {
        if (!showFibonacciLines) return;
        const ctx = chart.ctx, yAxis = chart.scales.y; if (!yAxis) return;
        const fibLevels = [0,23.6,38.2,50,61.8,100];
        const {left,right} = chart.chartArea, range = yAxis.max - yAxis.min;
        ctx.save();
        fibLevels.forEach((lvl,i) => {
            const y = yAxis.getPixelForValue(yAxis.min + (lvl/100)*range);
            ctx.beginPath(); ctx.setLineDash([5,5]); ctx.moveTo(left,y); ctx.lineTo(right,y);
            ctx.strokeStyle = 'rgba(0,255,0,0.5)'; ctx.lineWidth = 1;
            ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(0,255,0,0.85)'; ctx.font = '10px Arial';
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(`${fibLevels[i]}%`, right+52, y-(i===0?-8:0));
        });
        ctx.restore();
    }
};
 
const linhaAtualPlugin = {
    id: 'linhaAtual',
    afterDraw(chart, args, opts) {
        const cfg = (opts?.enabled !== undefined) ? opts : (chart.options?.plugins?.linhaAtual ?? {});
        if (cfg.enabled === false) return;
        const {ctx,chartArea,scales} = chart; if (!chartArea || !scales.y) return;
        const {left,right,top,bottom} = chartArea, padX = 5, BAD_H = 18;
        const entries = [];
        chart.data.datasets.forEach((d,i) => {
            if (!d.label || d.label.includes(' MA') || !chart.isDatasetVisible(i)) return;
            const arr = d.data; if (!arr?.length) return;
            let yVal = null;
            for (let j = arr.length-1; j >= 0; j--) {
                const v = arr[j];
                if (v !== null && v !== undefined && isFinite(v)) { yVal = v; break; }
            }
            if (yVal === null) return;
            const axisId = d.yAxisID || 'y';
            const yAxis = scales[axisId] || scales.y;
            const yPx = yAxis.getPixelForValue(yVal);
            if (!isFinite(yPx) || yPx < top || yPx > bottom) return;
            entries.push({yVal, yPx, label:d.label, color:d.borderColor||'#fff'});
        });
        if (!entries.length) return;
        entries.sort((a,b) => a.yPx - b.yPx);
        for (let i = 1; i < entries.length; i++) {
            const prev = entries[i-1], curr = entries[i];
            curr.badgeY = (curr.yPx - (prev.badgeY??prev.yPx) < BAD_H+2)
                ? (prev.badgeY??prev.yPx)+BAD_H+2 : curr.yPx;
            if (i===1) prev.badgeY = prev.badgeY??prev.yPx;
        }
        if (entries.length===1) entries[0].badgeY = entries[0].yPx;
        entries.forEach(({yVal,yPx,badgeY,label,color}) => {
            ctx.save();
            ctx.strokeStyle=color; ctx.lineWidth=1.2; ctx.setLineDash([6,4]);
            ctx.beginPath(); ctx.moveTo(left,yPx); ctx.lineTo(right,yPx);
            ctx.stroke(); ctx.setLineDash([]);
            const isGols = label==='Gols FT'||label==='Gols HT'||label==='Gols Individual'||label==='Gols FT Casa'||label==='Gols FT Fora';
            const text = isGols ? String(Math.round(yVal)) : yVal.toFixed(1);
            ctx.font = 'bold 10px Arial,sans-serif';
            ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
            const bw = Math.ceil(ctx.measureText(text).width)+padX*2;
            const bx = right+4, by = badgeY-BAD_H/2;
            ctx.fillStyle = 'rgba(10,12,20,0.95)';
            ctx.strokeStyle = color; ctx.lineWidth = 1.2;
            ctx.fillRect(bx,by,bw,BAD_H); ctx.strokeRect(bx,by,bw,BAD_H);
            ctx.fillStyle = color;
            ctx.fillText(text, bx+padX, badgeY);
            ctx.restore();
        });
    }
};
 
/* ── DRAG LINES ── */
function _loadDragLines() {
    try {
        const a = JSON.parse(localStorage.getItem(DRAG_LINES_KEY)||'[]');
        return Array.isArray(a)
            ? a.map(l => ({y:Number(l.y),color:l.color||'#1fcc59',dragging:false}))
            : [];
    } catch { return []; }
}
function _saveDragLines(l) {
    try { localStorage.setItem(DRAG_LINES_KEY, JSON.stringify(l.map(x=>({y:x.y,color:x.color||'#1fcc59'})))); } catch {}
}
function _atualizarContador(l) {
    const el = document.getElementById('contadorLinhas');
    if (el) el.textContent = `${(l||[]).length} / ${MAX_DRAG_LINES} linhas`;
}
 
const linhaDraggablePlugin = {
    id: 'linhaDraggable',
    afterInit(chart) {
        const canvas = chart.canvas;
        chart.dragLines = _loadDragLines(); chart._selectedDragLine = -1;
        const HIT_PX = 8; let draggingIdx = -1;
        const getYS    = () => chart.scales.y;
        const getEvtY  = evt => { const r=canvas.getBoundingClientRect(); return ((evt.touches&&evt.touches[0]?.clientY)??evt.clientY??0)-r.top; };
        const nearestLine = pxY => {
            const yS=getYS(); if(!yS||!chart.chartArea) return -1;
            const {top,bottom}=chart.chartArea; let best=-1,bestDist=Infinity;
            (chart.dragLines||[]).forEach((l,i)=>{
                const ly=yS.getPixelForValue(l.y);
                if(ly<top||ly>bottom) return;
                const d=Math.abs(ly-pxY);
                if(d<bestDist&&d<=HIT_PX){bestDist=d;best=i;}
            });
            return best;
        };
        chart.addDragLine = (color='#1fcc59') => {
            if((chart.dragLines||[]).length>=MAX_DRAG_LINES){alert(`Máximo de ${MAX_DRAG_LINES} linhas!`);return;}
            const yS=getYS(); if(!yS)return;
            chart.dragLines.push({y:Math.round((yS.min+yS.max)/2),color,dragging:false});
            chart._selectedDragLine=chart.dragLines.length-1;
            _saveDragLines(chart.dragLines); _atualizarContador(chart.dragLines);
            chart.update();
            // persiste no setup ativo
            _captureControlsToSetup(_getActiveSetup());
        };
        chart.deleteDragLine = () => {
            const idx=chart._selectedDragLine;
            if(idx>=0&&idx<(chart.dragLines||[]).length){
                chart.dragLines.splice(idx,1);
                chart._selectedDragLine=-1;
                _saveDragLines(chart.dragLines); _atualizarContador(chart.dragLines);
                chart.update();
                _captureControlsToSetup(_getActiveSetup());
            }
        };
        chart.clearDragLines = () => {
            chart.dragLines=[];chart._selectedDragLine=-1;
            _saveDragLines(chart.dragLines); _atualizarContador(chart.dragLines);
            chart.update();
            _captureControlsToSetup(_getActiveSetup());
        };
        const startDrag = evt => {
            const pxY=getEvtY(evt),idx=nearestLine(pxY);
            if(idx>=0){if(evt.cancelable)evt.preventDefault();draggingIdx=idx;chart.dragLines[idx].dragging=true;chart._selectedDragLine=idx;}
            else{chart._selectedDragLine=-1;}
            chart.update();
        };
        const moveDrag = evt => {
            if(draggingIdx<0)return;if(evt.cancelable)evt.preventDefault();
            const yS=getYS();if(!yS)return;
            let v=yS.getValueForPixel(getEvtY(evt));
            v=Math.max(yS.min,Math.min(yS.max,Math.round(v*10)/10));
            chart.dragLines[draggingIdx].y=v;chart.update('none');
        };
        const stopDrag = () => {
            if(draggingIdx>=0){
                if(chart.dragLines[draggingIdx])chart.dragLines[draggingIdx].dragging=false;
                _saveDragLines(chart.dragLines);
                _captureControlsToSetup(_getActiveSetup());
            }
            draggingIdx=-1;
        };
        canvas.addEventListener('mousedown',startDrag);
        canvas.addEventListener('mousemove',moveDrag);
        canvas.addEventListener('mouseleave',stopDrag);
        window.addEventListener('mouseup',stopDrag);
        canvas.addEventListener('touchstart',startDrag,{passive:false});
        canvas.addEventListener('touchmove',moveDrag,{passive:false});
        canvas.addEventListener('touchend',stopDrag,{passive:true});
        canvas.addEventListener('touchcancel',stopDrag,{passive:true});
        window.addEventListener('keydown',e=>{
            if(e.key==='Delete'||e.key==='Backspace'){
                const c=chartInstances['Copa']||Object.values(chartInstances)[0];
                if(c)c.deleteDragLine();
            }
        });
        _atualizarContador(chart.dragLines);
    },
    afterDatasetsDraw(chart) {
        const yS=chart.scales.y,lines=chart.dragLines||[];
        if(!lines.length||!chart.chartArea)return;
        const ctx=chart.ctx,{left,right,top,bottom}=chart.chartArea,PAD=5,BH=16;
        lines.forEach((l,i)=>{
            const yPx=yS.getPixelForValue(l.y);
            if(!isFinite(yPx)||yPx<top||yPx>bottom)return;
            const isSel=i===chart._selectedDragLine;
            ctx.save();
            ctx.strokeStyle=l.color||'#1fcc59'; ctx.lineWidth=isSel?2:1.5;
            if(!isSel)ctx.setLineDash([8,4]);
            ctx.beginPath();ctx.moveTo(left,yPx);ctx.lineTo(right,yPx);ctx.stroke();ctx.setLineDash([]);
            // Badge sem %
            const text = l.y.toFixed(1);
            ctx.font='bold 10px Arial,sans-serif';ctx.textBaseline='middle';ctx.textAlign='left';
            const bw=Math.ceil(ctx.measureText(text).width)+PAD*2,bx=right+4,by=yPx-BH/2;
            ctx.fillStyle='rgba(10,12,20,0.95)';ctx.fillRect(bx,by,bw,BH);
            ctx.strokeStyle=l.color||'#1fcc59';ctx.lineWidth=isSel?1.5:1;ctx.strokeRect(bx,by,bw,BH);
            ctx.fillStyle=l.color||'#1fcc59';ctx.fillText(text,bx+PAD,yPx);
            ctx.restore();
        });
    }
};
 
/* ═══════════════════════════════════════════════════════════════════
   CRIAÇÃO DO GRÁFICO
═══════════════════════════════════════════════════════════════════ */
Chart.defaults.animation.duration = 0;
 
function createStatsChart(ctx, labels, data, league) {
    const activeSetup = _getActiveSetup();
    const datasets = [];
    const shortColor = '#00FF00', longColor = '#FF0000';
 
    Object.entries(labelToKey).forEach(([label]) => {
        const key   = labelToKey[label];
        const color = _marketColor(activeSetup, label);
        const isGolsInd = label === 'Gols Individual';
        datasets.push({
            label, data:data[key],
            borderColor:color, backgroundColor:color,
            pointBackgroundColor:data[key+'Colors'],
            pointBorderColor:'rgba(0,0,0,0)', pointBorderWidth:0,
            borderWidth:2, pointRadius:3, pointHoverRadius:4,
            fill:false,
            yAxisID: isGolsInd ? 'y2' : 'y',
            hidden:!statsChartVisibleDatasets[label]
        });
        datasets.push({label:label+' - Short MA',data:data[key+'Short'],borderColor:shortColor,backgroundColor:'transparent',tension:0,borderWidth:2,pointRadius:0,fill:false,yAxisID:isGolsInd?'y2':'y',hidden:!showMovingAverages||!statsChartVisibleDatasets[label]});
        datasets.push({label:label+' - Long MA', data:data[key+'Long'], borderColor:longColor, backgroundColor:'transparent',tension:0,borderWidth:2,pointRadius:0,fill:false,yAxisID:isGolsInd?'y2':'y',hidden:!showMovingAverages||!statsChartVisibleDatasets[label]});
    });
 
    return new Chart(ctx, {
        type:'line', data:{labels,datasets},
        options:{
            responsive:true, maintainAspectRatio:false, animation:{duration:0},
            layout:{padding:{top:30,right:80}},
            plugins:{
                legend:{display:false},
                tooltip:{
                    enabled:true, backgroundColor:'rgba(0,0,0,0.8)',
                    titleColor:'#1fad8b', bodyColor:'#e0e0e0',
                    borderColor:'#1fad8b', borderWidth:1,
                    caretPadding:26, padding:10,
                    callbacks:{
                        title:items=>{const sd=chartData[league];const m=sd[Math.max(0,sd.length-numPoints)+items[0].dataIndex];return m?`${m.hora}:${m.minuto.toString().padStart(2,'0')}`:'';},
                        label:ctx=>{const v=ctx.parsed.y;if(v===null)return '';const isGols=ctx.dataset.label==='Gols FT'||ctx.dataset.label==='Gols HT'||ctx.dataset.label==='Gols Individual'||ctx.dataset.label==='Gols FT Casa'||ctx.dataset.label==='Gols FT Fora';return isGols?`${ctx.dataset.label}: ${v} gols`:`${ctx.dataset.label}: ${v.toFixed(2)}%`;},
                        afterBody:items=>{const sd=chartData[league];const m=sd[Math.max(0,sd.length-numPoints)+items[0].dataIndex];return m?`FT: ${m.ft||'N/A'}  HT: ${m.ht||'N/A'}`:'';},
                    }
                },
                linhaAtual:{enabled:activeSetup.linhaAtual ?? true}
            },
            scales:{
                x:{ticks:{display:false},grid:{display:false}},
                y:{beginAtZero:false,ticks:{color:'#b0b0b0',stepSize:5},grid:{color:'rgba(255,255,255,0.3)',lineWidth:0.5},afterFit:s=>{s.paddingTop=20;}},
                y2:{position:'right',beginAtZero:true,min:0,max:10,ticks:{color:'rgba(255,255,255,0.35)',stepSize:1,precision:0},grid:{display:false},afterFit:s=>{s.width=0;}}
            }
        },
        plugins:[fibonacciLinesPlugin,linhaAtualPlugin,linhaDraggablePlugin,rotulosPlugin]
    });
}
 
function updateStatsChart(chart, newData) {
    if (!chart) return;
    chart.data.labels = newData.labels;
    chart.data.datasets.forEach(ds => {
        ds.data = newData[getKeyFromLabel(ds.label)];
        if (!ds.label.includes(' MA'))
            ds.pointBackgroundColor = newData[getKeyFromLabel(ds.label)+'Colors'];
    });
    chart.update();
    // Atualiza valores no painel de toggles (sem recriar DOM, evita
    // o "piscar" da prévia ao passar o mouse durante o auto-update de 3s)
    _updateLinesPanelValues();
}
 
/* ═══════════════════════════════════════════════════════════════════
   PROCESSAMENTO DE DADOS
═══════════════════════════════════════════════════════════════════ */
function processApiData(data, league) {
    const sortedData = [...data].sort((a,b)=>{
        const dA=new Date(a.data),dB=new Date(b.data);
        if(dA.getTime()!==dB.getTime())return dA-dB;
        if(a.hora!==b.hora)return a.hora-b.hora;
        return a.minuto-b.minuto;
    });
    // Pega jogos suficientes: numPoints exibidos + janela de média em minutos reais (averagePoints * 3 min + folga)
    const slicedData=sortedData.slice(-numPoints - Math.ceil(averagePoints * 3.5));
    chartData[league]=slicedData;
 
    // Converte jogo em timestamp de minutos absolutos (considera data + hora + minuto)
    function toAbsMin(m){
        const d=new Date(m.data);
        // usa apenas a data (dia), combinada com hora e minuto locais da liga
        return Math.floor(d.getTime()/86400000)*1440 + m.hora*60 + m.minuto;
    }
 
    let labels=[],golsFT=[],golsHT=[],golsInd=[],casaVence=[],empate=[],foraVence=[],ambasSim=[],ambasNao=[];
    let over05=[],over15=[],over25=[],over35=[],over5=[];
    let under05=[],under15=[],under25=[],under35=[];
    let gol0=[],gol1=[],gol2=[],gol3=[],gol4=[],gol5=[];
    let gol2t0=[],gol2t1=[],gol2t2=[],gol2t3=[],gol2t4=[];
    let casa0=[],casa1=[],casa2=[],casa3=[],casa4=[];
    let fora0=[],fora1=[],fora2=[],fora3=[],fora4=[];
    let placar0x0=[],placar1x0=[],placar2x0=[],placar3x0=[];
    let placar2x1=[],placar3x1=[],placar3x2=[],placar4x0=[],placar4x1=[];
    let placar0x1=[],placar0x2=[],placar1x2=[],placar0x3=[],placar1x3=[],placar2x3=[],placar0x4=[],placar1x4=[];
    let placarHT0x0=[];
    let placarHT0x1=[],placarHT1x0=[],placarHT1x1=[],placarHT0x2=[],placarHT2x0=[],placarHTOut=[];
    let overHT=[],underHT=[],casaHT=[],empateHT=[],foraHT=[];
    let viradinha=[];
    let par=[],impar=[],margem1=[],margem2=[],margem3=[],empateGols=[],golsFTCasa=[],golsFTFora=[];
    let golsFTColors=[],golsHTColors=[],golsIndColors=[],casaVenceColors=[],empateColors=[],foraVenceColors=[],ambasSimColors=[],ambasNaoColors=[];
    let over05Colors=[],over15Colors=[],over25Colors=[],over35Colors=[],over5Colors=[];
    let under05Colors=[],under15Colors=[],under25Colors=[],under35Colors=[];
    let gol0Colors=[],gol1Colors=[],gol2Colors=[],gol3Colors=[],gol4Colors=[],gol5Colors=[];
    let gol2t0Colors=[],gol2t1Colors=[],gol2t2Colors=[],gol2t3Colors=[],gol2t4Colors=[];
    let casa0Colors=[],casa1Colors=[],casa2Colors=[],casa3Colors=[],casa4Colors=[];
    let fora0Colors=[],fora1Colors=[],fora2Colors=[],fora3Colors=[],fora4Colors=[];
    let placar0x0Colors=[],placar1x0Colors=[],placar2x0Colors=[],placar3x0Colors=[];
    let placar2x1Colors=[],placar3x1Colors=[],placar3x2Colors=[],placar4x0Colors=[],placar4x1Colors=[];
    let placar0x1Colors=[],placar0x2Colors=[],placar1x2Colors=[],placar0x3Colors=[],placar1x3Colors=[],placar2x3Colors=[],placar0x4Colors=[],placar1x4Colors=[];
    let placarHT0x0Colors=[];
    let placarHT0x1Colors=[],placarHT1x0Colors=[],placarHT1x1Colors=[],placarHT0x2Colors=[],placarHT2x0Colors=[],placarHTOutColors=[];
    let overHTColors=[],underHTColors=[],casaHTColors=[],empateHTColors=[],foraHTColors=[];
    let viradinhaColors=[];
    let parColors=[],imparColors=[],margem1Colors=[],margem2Colors=[],margem3Colors=[],empateGolsColors=[],golsFTCasaColors=[],golsFTForaColors=[];
 
    const allData=[golsFT,golsHT,casaVence,empate,foraVence,ambasSim,ambasNao,over05,over15,over25,over35,over5,under05,under15,under25,under35,gol0,gol1,gol2,gol3,gol4,gol5,gol2t0,gol2t1,gol2t2,gol2t3,gol2t4,casa0,casa1,casa2,casa3,casa4,fora0,fora1,fora2,fora3,fora4,placar0x0,placar1x0,placar2x0,placar3x0,placar2x1,placar3x1,placar3x2,placar4x0,placar4x1,placar0x1,placar0x2,placar1x2,placar0x3,placar1x3,placar2x3,placar0x4,placar1x4,placarHT0x0,placarHT0x1,placarHT1x0,placarHT1x1,placarHT0x2,placarHT2x0,placarHTOut,overHT,underHT,casaHT,empateHT,foraHT,viradinha,par,impar,margem1,margem2,margem3,empateGols];
    const allColors=[golsFTColors,golsHTColors,casaVenceColors,empateColors,foraVenceColors,ambasSimColors,ambasNaoColors,over05Colors,over15Colors,over25Colors,over35Colors,over5Colors,under05Colors,under15Colors,under25Colors,under35Colors,gol0Colors,gol1Colors,gol2Colors,gol3Colors,gol4Colors,gol5Colors,gol2t0Colors,gol2t1Colors,gol2t2Colors,gol2t3Colors,gol2t4Colors,casa0Colors,casa1Colors,casa2Colors,casa3Colors,casa4Colors,fora0Colors,fora1Colors,fora2Colors,fora3Colors,fora4Colors,placar0x0Colors,placar1x0Colors,placar2x0Colors,placar3x0Colors,placar2x1Colors,placar3x1Colors,placar3x2Colors,placar4x0Colors,placar4x1Colors,placar0x1Colors,placar0x2Colors,placar1x2Colors,placar0x3Colors,placar1x3Colors,placar2x3Colors,placar0x4Colors,placar1x4Colors,placarHT0x0Colors,placarHT0x1Colors,placarHT1x0Colors,placarHT1x1Colors,placarHT0x2Colors,placarHT2x0Colors,placarHTOutColors,overHTColors,underHTColors,casaHTColors,empateHTColors,foraHTColors,viradinhaColors,parColors,imparColors,margem1Colors,margem2Colors,margem3Colors,empateGolsColors];
 
    const green='#00FF00',red='#FF0000';
    // janela em minutos reais: averagePoints jogos * 3 min por jogo
    const janelaMin = averagePoints * 3;
    // só exibe os últimos numPoints jogos
    const startExibir = Math.max(0, slicedData.length - numPoints);
 
    for(let i=0;i<slicedData.length;i++){
        const mAtual = slicedData[i];
        const tsAtual = toAbsMin(mAtual);
 
        let s={golsFT:0,golsHT:0,casaVence:0,empate:0,foraVence:0,ambasSim:0,ambasNao:0,over05:0,over15:0,over25:0,over35:0,over5:0,under05:0,under15:0,under25:0,under35:0,gol0:0,gol1:0,gol2:0,gol3:0,gol4:0,gol5:0,gol2t0:0,gol2t1:0,gol2t2:0,gol2t3:0,gol2t4:0,casa0:0,casa1:0,casa2:0,casa3:0,casa4:0,fora0:0,fora1:0,fora2:0,fora3:0,fora4:0,p0x0:0,p1x0:0,p2x0:0,p3x0:0,p2x1:0,p3x1:0,p3x2:0,p4x0:0,p4x1:0,p0x1:0,p0x2:0,p1x2:0,p0x3:0,p1x3:0,p2x3:0,p0x4:0,p1x4:0,ht0x0:0,ht0x1:0,ht1x0:0,ht1x1:0,ht0x2:0,ht2x0:0,htOut:0,overHT:0,underHT:0,casaHT:0,empateHT:0,foraHT:0,viradinha:0,golsFTCasa:0,golsFTFora:0,par:0,impar:0,margem1:0,margem2:0,margem3:0,empateGols:0,valid:0};
 
        for(let j=i;j>=0;j--){
            const mj=slicedData[j];
            const tsJ=toAbsMin(mj);
            if(tsAtual - tsJ > janelaMin) break; // fora da janela de tempo
            const m=mj;
            let ft=[0,0];if(m.ft?.includes(' x '))ft=m.ft.split(' x ').map(Number);
            const htTotal=parseHtScoreTotal(m.ht),htParts=parseHtParts(m.ht);
            const tg=ft[0]+ft[1],tg2t=Math.max(0,tg-htTotal);
            s.golsFT+=tg;s.golsHT+=htTotal;
            s.golsFTCasa+=ft[0];s.golsFTFora+=ft[1];
            s.par+=tg%2===0?1:0;s.impar+=tg%2!==0?1:0;
            const margemAtualJ=Math.abs(ft[0]-ft[1]);
            s.margem1+=margemAtualJ===1?1:0;s.margem2+=margemAtualJ===2?1:0;s.margem3+=margemAtualJ===3?1:0;
            s.empateGols+=(ft[0]===ft[1]&&tg>0)?1:0;
            s.casaVence+=ft[0]>ft[1]?1:0;s.empate+=ft[0]===ft[1]?1:0;s.foraVence+=ft[0]<ft[1]?1:0;
            s.ambasSim+=ft[0]>0&&ft[1]>0?1:0;s.ambasNao+=ft[0]===0||ft[1]===0?1:0;
            s.over05+=tg>0.5?1:0;s.over15+=tg>1.5?1:0;s.over25+=tg>2.5?1:0;s.over35+=tg>3.5?1:0;s.over5+=tg>=5?1:0;
            s.under05+=tg<=0.5?1:0;s.under15+=tg<1.5?1:0;s.under25+=tg<2.5?1:0;s.under35+=tg<3.5?1:0;
            s.gol0+=tg===0?1:0;s.gol1+=tg===1?1:0;s.gol2+=tg===2?1:0;s.gol3+=tg===3?1:0;s.gol4+=tg===4?1:0;s.gol5+=tg===5?1:0;
            s.gol2t0+=tg2t===0?1:0;s.gol2t1+=tg2t===1?1:0;s.gol2t2+=tg2t===2?1:0;s.gol2t3+=tg2t===3?1:0;s.gol2t4+=tg2t===4?1:0;
            s.casa0+=ft[0]===0?1:0;s.casa1+=ft[0]===1?1:0;s.casa2+=ft[0]===2?1:0;s.casa3+=ft[0]===3?1:0;s.casa4+=ft[0]===4?1:0;
            s.fora0+=ft[1]===0?1:0;s.fora1+=ft[1]===1?1:0;s.fora2+=ft[1]===2?1:0;s.fora3+=ft[1]===3?1:0;s.fora4+=ft[1]===4?1:0;
            s.p0x0+=ft[0]===0&&ft[1]===0?1:0;s.p1x0+=ft[0]===1&&ft[1]===0?1:0;s.p2x0+=ft[0]===2&&ft[1]===0?1:0;
            s.p3x0+=ft[0]===3&&ft[1]===0?1:0;s.p2x1+=ft[0]===2&&ft[1]===1?1:0;s.p3x1+=ft[0]===3&&ft[1]===1?1:0;
            s.p3x2+=ft[0]===3&&ft[1]===2?1:0;s.p4x0+=ft[0]===4&&ft[1]===0?1:0;s.p4x1+=ft[0]===4&&ft[1]===1?1:0;
            s.p0x1+=ft[0]===0&&ft[1]===1?1:0;s.p0x2+=ft[0]===0&&ft[1]===2?1:0;s.p1x2+=ft[0]===1&&ft[1]===2?1:0;
            s.p0x3+=ft[0]===0&&ft[1]===3?1:0;s.p1x3+=ft[0]===1&&ft[1]===3?1:0;s.p2x3+=ft[0]===2&&ft[1]===3?1:0;
            s.p0x4+=ft[0]===0&&ft[1]===4?1:0;s.p1x4+=ft[0]===1&&ft[1]===4?1:0;
            s.ht0x0+=(htParts&&htParts[0]===0&&htParts[1]===0)?1:0;
            s.ht0x1+=(htParts&&htParts[0]===0&&htParts[1]===1)?1:0;
            s.ht1x0+=(htParts&&htParts[0]===1&&htParts[1]===0)?1:0;
            s.ht1x1+=(htParts&&htParts[0]===1&&htParts[1]===1)?1:0;
            s.ht0x2+=(htParts&&htParts[0]===0&&htParts[1]===2)?1:0;
            s.ht2x0+=(htParts&&htParts[0]===2&&htParts[1]===0)?1:0;
            s.htOut+=(m.ht==='OUT')?1:0;
            if(htTotal>=2)s.overHT++;else s.underHT++;
            if(htParts){if(htParts[0]>htParts[1])s.casaHT++;else if(htParts[0]<htParts[1])s.foraHT++;else s.empateHT++;}
            // Viradinha: casa venceu HT mas perdeu FT, OU fora venceu HT mas perdeu FT
            if(htParts){
                const casaVenceHT=htParts[0]>htParts[1], foraVenceHT=htParts[0]<htParts[1];
                let ftParts=[0,0];if(m.ft?.includes(' x '))ftParts=m.ft.split(' x ').map(Number);
                const casaPerdeFT=ftParts[0]<ftParts[1], foraPerdeFT=ftParts[0]>ftParts[1];
                if((casaVenceHT&&casaPerdeFT)||(foraVenceHT&&foraPerdeFT))s.viradinha++;
            }
            s.valid++;
        }
        if(i < startExibir) continue; // ainda no período de aquecimento, não exibe
        const m=slicedData[i];
        labels.push(`${m.hora}:${m.minuto.toString().padStart(2,'0')}`);
        let ft=[0,0];if(m.ft?.includes(' x '))ft=m.ft.split(' x ').map(Number);
        const htTotal=parseHtScoreTotal(m.ht),htParts=parseHtParts(m.ht);
        const tg=ft[0]+ft[1],tg2t=Math.max(0,tg-htTotal),avg=s.valid||1;
        golsFT.push(s.golsFT);golsFTColors.push('#FFFF00');
        golsHT.push(s.golsHT);golsHTColors.push('#26A69A');
        const golsIndVal=tg; const golsIndColor=golsIndVal>=5?'#2ecc71':golsIndVal>=3?'#3498db':golsIndVal===2?'#f1c40f':golsIndVal===1?'#e67e22':'#e74c3c';
        golsInd.push(golsIndVal);golsIndColors.push(golsIndColor);
        golsFTCasa.push(s.golsFTCasa);golsFTCasaColors.push('#00E5FF');
        golsFTFora.push(s.golsFTFora);golsFTForaColors.push('#FF6E40');
        par.push(s.par/avg*100);parColors.push(tg%2===0?green:red);
        impar.push(s.impar/avg*100);imparColors.push(tg%2!==0?green:red);
        const margemAtual=Math.abs(ft[0]-ft[1]);
        margem1.push(s.margem1/avg*100);margem1Colors.push(margemAtual===1?green:red);
        margem2.push(s.margem2/avg*100);margem2Colors.push(margemAtual===2?green:red);
        margem3.push(s.margem3/avg*100);margem3Colors.push(margemAtual===3?green:red);
        empateGols.push(s.empateGols/avg*100);empateGolsColors.push((ft[0]===ft[1]&&tg>0)?green:red);
        casaVence.push(s.casaVence/avg*100);casaVenceColors.push(ft[0]>ft[1]?green:red);
        empate.push(s.empate/avg*100);empateColors.push(ft[0]===ft[1]?green:red);
        foraVence.push(s.foraVence/avg*100);foraVenceColors.push(ft[0]<ft[1]?green:red);
        ambasSim.push(s.ambasSim/avg*100);ambasSimColors.push(ft[0]>0&&ft[1]>0?green:red);
        ambasNao.push(s.ambasNao/avg*100);ambasNaoColors.push(ft[0]===0||ft[1]===0?green:red);
        over05.push(s.over05/avg*100);over05Colors.push(tg>0.5?green:red);
        over15.push(s.over15/avg*100);over15Colors.push(tg>1.5?green:red);
        over25.push(s.over25/avg*100);over25Colors.push(tg>2.5?green:red);
        over35.push(s.over35/avg*100);over35Colors.push(tg>3.5?green:red);
        over5.push(s.over5/avg*100);over5Colors.push(tg>=5?green:red);
        under05.push(s.under05/avg*100);under05Colors.push(tg<=0.5?green:red);
        under15.push(s.under15/avg*100);under15Colors.push(tg<1.5?green:red);
        under25.push(s.under25/avg*100);under25Colors.push(tg<2.5?green:red);
        under35.push(s.under35/avg*100);under35Colors.push(tg<3.5?green:red);
        gol0.push(s.gol0/avg*100);gol0Colors.push(tg===0?green:red);
        gol1.push(s.gol1/avg*100);gol1Colors.push(tg===1?green:red);
        gol2.push(s.gol2/avg*100);gol2Colors.push(tg===2?green:red);
        gol3.push(s.gol3/avg*100);gol3Colors.push(tg===3?green:red);
        gol4.push(s.gol4/avg*100);gol4Colors.push(tg===4?green:red);
        gol5.push(s.gol5/avg*100);gol5Colors.push(tg===5?green:red);
        gol2t0.push(s.gol2t0/avg*100);gol2t0Colors.push(tg2t===0?green:red);
        gol2t1.push(s.gol2t1/avg*100);gol2t1Colors.push(tg2t===1?green:red);
        gol2t2.push(s.gol2t2/avg*100);gol2t2Colors.push(tg2t===2?green:red);
        gol2t3.push(s.gol2t3/avg*100);gol2t3Colors.push(tg2t===3?green:red);
        gol2t4.push(s.gol2t4/avg*100);gol2t4Colors.push(tg2t===4?green:red);
        casa0.push(s.casa0/avg*100);casa0Colors.push(ft[0]===0?green:red);
        casa1.push(s.casa1/avg*100);casa1Colors.push(ft[0]===1?green:red);
        casa2.push(s.casa2/avg*100);casa2Colors.push(ft[0]===2?green:red);
        casa3.push(s.casa3/avg*100);casa3Colors.push(ft[0]===3?green:red);
        casa4.push(s.casa4/avg*100);casa4Colors.push(ft[0]===4?green:red);
        fora0.push(s.fora0/avg*100);fora0Colors.push(ft[1]===0?green:red);
        fora1.push(s.fora1/avg*100);fora1Colors.push(ft[1]===1?green:red);
        fora2.push(s.fora2/avg*100);fora2Colors.push(ft[1]===2?green:red);
        fora3.push(s.fora3/avg*100);fora3Colors.push(ft[1]===3?green:red);
        fora4.push(s.fora4/avg*100);fora4Colors.push(ft[1]===4?green:red);
        placar0x0.push(s.p0x0/avg*100);placar0x0Colors.push(ft[0]===0&&ft[1]===0?green:red);
        placar1x0.push(s.p1x0/avg*100);placar1x0Colors.push(ft[0]===1&&ft[1]===0?green:red);
        placar2x0.push(s.p2x0/avg*100);placar2x0Colors.push(ft[0]===2&&ft[1]===0?green:red);
        placar3x0.push(s.p3x0/avg*100);placar3x0Colors.push(ft[0]===3&&ft[1]===0?green:red);
        placar2x1.push(s.p2x1/avg*100);placar2x1Colors.push(ft[0]===2&&ft[1]===1?green:red);
        placar3x1.push(s.p3x1/avg*100);placar3x1Colors.push(ft[0]===3&&ft[1]===1?green:red);
        placar3x2.push(s.p3x2/avg*100);placar3x2Colors.push(ft[0]===3&&ft[1]===2?green:red);
        placar4x0.push(s.p4x0/avg*100);placar4x0Colors.push(ft[0]===4&&ft[1]===0?green:red);
        placar4x1.push(s.p4x1/avg*100);placar4x1Colors.push(ft[0]===4&&ft[1]===1?green:red);
        placar0x1.push(s.p0x1/avg*100);placar0x1Colors.push(ft[0]===0&&ft[1]===1?green:red);
        placar0x2.push(s.p0x2/avg*100);placar0x2Colors.push(ft[0]===0&&ft[1]===2?green:red);
        placar1x2.push(s.p1x2/avg*100);placar1x2Colors.push(ft[0]===1&&ft[1]===2?green:red);
        placar0x3.push(s.p0x3/avg*100);placar0x3Colors.push(ft[0]===0&&ft[1]===3?green:red);
        placar1x3.push(s.p1x3/avg*100);placar1x3Colors.push(ft[0]===1&&ft[1]===3?green:red);
        placar2x3.push(s.p2x3/avg*100);placar2x3Colors.push(ft[0]===2&&ft[1]===3?green:red);
        placar0x4.push(s.p0x4/avg*100);placar0x4Colors.push(ft[0]===0&&ft[1]===4?green:red);
        placar1x4.push(s.p1x4/avg*100);placar1x4Colors.push(ft[0]===1&&ft[1]===4?green:red);
        placarHT0x0.push(s.ht0x0/avg*100);
        placarHT0x0Colors.push((htParts&&htParts[0]===0&&htParts[1]===0)?green:red);
        placarHT0x1.push(s.ht0x1/avg*100);
        placarHT0x1Colors.push((htParts&&htParts[0]===0&&htParts[1]===1)?green:red);
        placarHT1x0.push(s.ht1x0/avg*100);
        placarHT1x0Colors.push((htParts&&htParts[0]===1&&htParts[1]===0)?green:red);
        placarHT1x1.push(s.ht1x1/avg*100);
        placarHT1x1Colors.push((htParts&&htParts[0]===1&&htParts[1]===1)?green:red);
        placarHT0x2.push(s.ht0x2/avg*100);
        placarHT0x2Colors.push((htParts&&htParts[0]===0&&htParts[1]===2)?green:red);
        placarHT2x0.push(s.ht2x0/avg*100);
        placarHT2x0Colors.push((htParts&&htParts[0]===2&&htParts[1]===0)?green:red);
        placarHTOut.push(s.htOut/avg*100);
        placarHTOutColors.push(m.ht==='OUT'?green:red);
        overHT.push(s.overHT/avg*100);
        overHTColors.push(htTotal>=2?green:red);
        underHT.push(s.underHT/avg*100);
        underHTColors.push(htTotal<2?green:red);
        casaHT.push(s.casaHT/avg*100);
        casaHTColors.push((htParts&&htParts[0]>htParts[1])?green:red);
        empateHT.push(s.empateHT/avg*100);
        empateHTColors.push((htParts&&htParts[0]===htParts[1])?green:red);
        foraHT.push(s.foraHT/avg*100);
        foraHTColors.push((htParts&&htParts[0]<htParts[1])?green:red);
        // Viradinha
        const casaVenceHTcur=htParts&&htParts[0]>htParts[1], foraVenceHTcur=htParts&&htParts[0]<htParts[1];
        const casaPerdeFTcur=ft[0]<ft[1], foraPerdeFTcur=ft[0]>ft[1];
        const viradinhaOcorreu=htParts&&((casaVenceHTcur&&casaPerdeFTcur)||(foraVenceHTcur&&foraPerdeFTcur));
        viradinha.push(s.viradinha/avg*100);
        viradinhaColors.push(viradinhaOcorreu?green:red);
    }
    const result={
        labels,golsFT,golsHT,golsInd,casaVence,empate,foraVence,ambasSim,ambasNao,
        over05,over15,over25,over35,over5,under05,under15,under25,under35,
        gol0,gol1,gol2,gol3,gol4,gol5,gol2t0,gol2t1,gol2t2,gol2t3,gol2t4,
        casa0,casa1,casa2,casa3,casa4,fora0,fora1,fora2,fora3,fora4,
        placar0x0,placar1x0,placar2x0,placar3x0,placar2x1,placar3x1,placar3x2,placar4x0,placar4x1,
        placar0x1,placar0x2,placar1x2,placar0x3,placar1x3,placar2x3,placar0x4,placar1x4,
        placarHT0x0,placarHT0x1,placarHT1x0,placarHT1x1,placarHT0x2,placarHT2x0,placarHTOut,
        overHT,underHT,casaHT,empateHT,foraHT,viradinha,
        golsFTCasa,golsFTFora,par,impar,margem1,margem2,margem3,empateGols,
        golsFTColors,golsHTColors,golsIndColors,casaVenceColors,empateColors,foraVenceColors,ambasSimColors,ambasNaoColors,
        over05Colors,over15Colors,over25Colors,over35Colors,over5Colors,under05Colors,under15Colors,under25Colors,under35Colors,
        gol0Colors,gol1Colors,gol2Colors,gol3Colors,gol4Colors,gol5Colors,gol2t0Colors,gol2t1Colors,gol2t2Colors,gol2t3Colors,gol2t4Colors,
        casa0Colors,casa1Colors,casa2Colors,casa3Colors,casa4Colors,fora0Colors,fora1Colors,fora2Colors,fora3Colors,fora4Colors,
        placar0x0Colors,placar1x0Colors,placar2x0Colors,placar3x0Colors,placar2x1Colors,placar3x1Colors,placar3x2Colors,placar4x0Colors,placar4x1Colors,
        placar0x1Colors,placar0x2Colors,placar1x2Colors,placar0x3Colors,placar1x3Colors,placar2x3Colors,placar0x4Colors,placar1x4Colors,
        placarHT0x0Colors,placarHT0x1Colors,placarHT1x0Colors,placarHT1x1Colors,placarHT0x2Colors,placarHT2x0Colors,placarHTOutColors,
        overHTColors,underHTColors,casaHTColors,empateHTColors,foraHTColors,viradinhaColors,
        golsFTCasaColors,golsFTForaColors,parColors,imparColors,margem1Colors,margem2Colors,margem3Colors,empateGolsColors
    };
    const shortPeriod=5,longPeriod=20;
    Object.keys(labelToKey).forEach(label=>{
        const key=labelToKey[label];
        result[key+'Short']=computeMA(result[key],shortPeriod);
        result[key+'Long'] =computeMA(result[key],longPeriod);
    });
    return result;
}
 
/* ═══════════════════════════════════════════════════════════════════
   UPDATE / EVENT LISTENERS
═══════════════════════════════════════════════════════════════════ */
function updateCharts() {
    if (!_tabVisible) return;
    const ts = new Date().getTime();
    leagues.forEach(league => {
        fetch(ROTAS_API.resultados(LIGA_ATUAL)+`?timestamp=${ts}`)
            .then(r=>{if(!r.ok)throw new Error(r.status);return r.json();})
            .then(data=>{
                const pd = processApiData(data, league);
                const canvas = document.getElementById(league); if (!canvas) return;
                if (!chartInstances[league]) {
                    chartInstances[league] = createStatsChart(canvas.getContext('2d'), pd.labels, pd, league);
                    _applySetup(_getActiveSetup());
                } else {
                    updateStatsChart(chartInstances[league], pd);
                }
            })
            .catch(e=>console.error(`Erro ${league}:`,e));
    });
}
 
function toggleFibonacciLines() {
    showFibonacciLines = document.getElementById('fibonacciToggle').checked;
    leagues.forEach(l=>{if(chartInstances[l])chartInstances[l].update();});
    _captureControlsToSetup(_getActiveSetup());
}
function toggleMovingAverages() {
    showMovingAverages = document.getElementById('movingAveragesToggle').checked;
    leagues.forEach(l=>{
        const ci=chartInstances[l];if(!ci)return;
        ci.data.datasets.forEach((ds,idx)=>{
            if(ds.label.includes(' - ')){
                const main=ds.label.split(' - ')[0];
                ci.getDatasetMeta(idx).hidden=!showMovingAverages||!statsChartVisibleDatasets[main];
            }
        });
        ci.update();
    });
    _captureControlsToSetup(_getActiveSetup());
}
 
document.getElementById('pointsSelector').addEventListener('change',e=>{
    numPoints=parseInt(e.target.value,10);
    updateCharts();
    _captureControlsToSetup(_getActiveSetup());
});
document.getElementById('averageSelector').addEventListener('change',e=>{
    averagePoints=parseInt(e.target.value,10);
    updateCharts();
    _captureControlsToSetup(_getActiveSetup());
});
document.getElementById('fibonacciToggle').addEventListener('change',toggleFibonacciLines);
document.getElementById('movingAveragesToggle').addEventListener('change',toggleMovingAverages);
document.getElementById('linhaAtualToggle').addEventListener('change',function(){
    leagues.forEach(l=>{
        const ci=chartInstances[l];if(!ci)return;
        ci.options.plugins.linhaAtual.enabled=this.checked;
        ci.update('active');
    });
    _captureControlsToSetup(_getActiveSetup());
});
document.getElementById('labelsToggle').addEventListener('change',function(){
    showLabels=this.checked;
    leagues.forEach(l=>{if(chartInstances[l])chartInstances[l].update();});
    _captureControlsToSetup(_getActiveSetup());
});
document.getElementById('btnLinhaTools').addEventListener('click',e=>{
    e.stopPropagation();
    const p=document.getElementById('linhaToolsPanel');
    p.style.display=p.style.display==='none'?'block':'none';
});
document.addEventListener('click',()=>{const p=document.getElementById('linhaToolsPanel');if(p)p.style.display='none';});
document.getElementById('linhaToolsPanel').addEventListener('click',e=>e.stopPropagation());
 
window.adicionarLinhaDraggable=()=>{const c=chartInstances['Copa']||Object.values(chartInstances)[0];if(c)c.addDragLine(document.getElementById('lineColorPicker')?.value||'#1fcc59');};
window.deletarLinhaSelecionada=()=>{const c=chartInstances['Copa']||Object.values(chartInstances)[0];if(c)c.deleteDragLine();};
window.limparTodasLinhas=()=>{const c=chartInstances['Copa']||Object.values(chartInstances)[0];if(c)c.clearDragLines();};
 
window.onload=()=>{
    updateCharts();
    _renderSetupBar();
    _renderLinesPanel(_getActiveSetup());
    _updateSetupCounter();
};

/* ═══════════════════════════════════════════════════════════════════
   BETSTAT — ANÁLISE AVANÇADA v3
   5 FEATURES: Zona de Calor · Tendência · Alertas · Spark · Zoom
   Cole este bloco ANTES de: setInterval(updateCharts, 3000);
═══════════════════════════════════════════════════════════════════ */

/* ─── FEATURE 1: ZONA DE CALOR (plugin global Chart.js) ─────────── */
let showZonaCalor = _ls('mgraf:zonaCalor', true);

const zonaCalorPlugin = {
    id: 'zonaCalor',
    beforeDatasetsDraw(chart) {
        if (!showZonaCalor) return;
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.y) return;
        const { left, right, top, bottom } = chartArea;
        const yAxis = scales.y;

        const valores = [];
        chart.data.datasets.forEach((ds, idx) => {
            if (ds.label && ds.label.includes(' MA')) return;
            if (!chart.isDatasetVisible(idx)) return;
            if (ds.yAxisID === 'y2') return;
            ds.data.forEach(v => { if (v !== null && isFinite(v)) valores.push(v); });
        });
        if (valores.length < 4) return;

        const media = valores.reduce((a, b) => a + b, 0) / valores.length;
        const sigma = Math.sqrt(valores.reduce((a, b) => a + (b - media) ** 2, 0) / valores.length);

        const clamp = px => Math.min(bottom, Math.max(top, px));
        const pxMax    = clamp(yAxis.getPixelForValue(yAxis.max));
        const pxQuente = clamp(yAxis.getPixelForValue(media + sigma));
        const pxMedia  = clamp(yAxis.getPixelForValue(media));
        const pxFrio   = clamp(yAxis.getPixelForValue(media - sigma));
        const pxMin    = clamp(yAxis.getPixelForValue(yAxis.min));
        const w = right - left;

        ctx.save();
        ctx.fillStyle = 'rgba(0,200,80,0.07)';
        ctx.fillRect(left, pxMax, w, pxQuente - pxMax);
        ctx.fillStyle = 'rgba(255,220,0,0.06)';
        ctx.fillRect(left, pxQuente, w, pxFrio - pxQuente);
        ctx.fillStyle = 'rgba(220,50,50,0.08)';
        ctx.fillRect(left, pxFrio, w, pxMin - pxFrio);

        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
        ctx.beginPath(); ctx.moveTo(left, pxMedia); ctx.lineTo(right, pxMedia); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('μ ' + media.toFixed(1), left + 4, pxMedia - 7);
        ctx.restore();
    }
};

// Registra globalmente — afeta qualquer chart criado depois
Chart.register(zonaCalorPlugin);

/* ─── FEATURE 3: ALERTAS VISUAIS (plugin global) ────────────────── */
const ALERTA_THRESHOLD = 1.25;
let _alertaPulse = 0;

const alertasPlugin = {
    id: 'alertas',
    afterDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const lines = chart.dragLines || [];
        _alertaPulse = (_alertaPulse + 1) % 60;
        const pulseR = 6 + Math.sin(_alertaPulse / 60 * Math.PI * 2) * 2.5;

        chart.data.datasets.forEach((ds, dsIdx) => {
            if (!ds.label || ds.label.includes(' MA')) return;
            if (!chart.isDatasetVisible(dsIdx)) return;
            if (ds.yAxisID === 'y2') return;
            const meta = chart.getDatasetMeta(dsIdx);
            if (!meta || !meta.data || meta.hidden) return;
            const vals = ds.data;
            if (!vals || vals.length < 2) return;

            let lastIdx = -1;
            for (let j = vals.length - 1; j >= 0; j--) {
                if (vals[j] !== null && isFinite(vals[j])) { lastIdx = j; break; }
            }
            if (lastIdx < 0) return;
            const lastVal = vals[lastIdx];
            const point = meta.data[lastIdx];
            if (!point) return;

            const nonNull = vals.filter(v => v !== null && isFinite(v));
            if (nonNull.length < 3) return;
            const avg = nonNull.reduce((a, b) => a + b, 0) / nonNull.length;

            let cruzou = false;
            if (lastIdx >= 1 && lines.length > 0) {
                const prev = vals[lastIdx - 1];
                if (prev !== null && isFinite(prev)) {
                    lines.forEach(l => {
                        if ((prev < l.y && lastVal >= l.y) || (prev > l.y && lastVal <= l.y)) cruzou = true;
                    });
                }
            }
            const isPico = lastVal > avg * ALERTA_THRESHOLD;
            if (!cruzou && !isPico) return;

            const ac = cruzou ? '#FFD600' : '#00e5ff';
            ctx.save();
            ctx.beginPath(); ctx.arc(point.x, point.y, pulseR, 0, Math.PI * 2);
            ctx.strokeStyle = ac; ctx.lineWidth = 2;
            ctx.globalAlpha = 0.7 + Math.sin(_alertaPulse / 60 * Math.PI * 2) * 0.3;
            ctx.stroke();
            ctx.globalAlpha = 0.9;
            ctx.font = 'bold 9px Arial'; ctx.fillStyle = ac;
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(cruzou ? '⚡' : '▲', point.x, point.y - pulseR - 2);
            ctx.restore();
        });
    }
};

Chart.register(alertasPlugin);

/* ─── FEATURE 2: TENDÊNCIA NO PAINEL ────────────────────────────── */
const TREND_N = 5;

function _getTrend(label) {
    const ci = chartInstances['Copa'] || Object.values(chartInstances)[0];
    if (!ci) return 0;
    const ds = ci.data.datasets.find(d => d.label === label);
    if (!ds || !ds.data) return 0;
    const vals = ds.data.filter(v => v !== null && isFinite(v));
    if (vals.length < 3) return 0;
    const rec = vals.slice(-TREND_N);
    const n = rec.length;
    const sX  = rec.reduce((a, _, i) => a + i, 0);
    const sY  = rec.reduce((a, v)    => a + v, 0);
    const sXY = rec.reduce((a, v, i) => a + i * v, 0);
    const sX2 = rec.reduce((a, _, i) => a + i * i, 0);
    const d = n * sX2 - sX * sX;
    if (d === 0) return 0;
    const slope = (n * sXY - sX * sY) / d;
    if (Math.abs(slope) < 0.15) return 0;
    return slope > 0 ? 1 : -1;
}

function _updateTrendIndicators() {
    const panel = document.getElementById('setupLinesPanel');
    if (!panel) return;
    panel.querySelectorAll('.market-toggle').forEach(toggle => {
        const label = toggle.dataset.label;
        if (!label) return;
        const trend = _getTrend(label);
        let el = toggle.querySelector('.market-toggle-trend');
        if (!el) {
            el = document.createElement('span');
            el.className = 'market-toggle-trend';
            el.style.cssText = 'font-size:10px;margin-left:3px;font-weight:bold;transition:color 0.3s';
            toggle.appendChild(el);
        }
        el.textContent = trend > 0 ? '▲' : trend < 0 ? '▼' : '→';
        el.style.color  = trend > 0 ? '#00e676' : trend < 0 ? '#ff5252' : 'rgba(255,255,255,0.35)';
    });
}

/* ─── FEATURE 4: SPARK NO TOOLTIP ───────────────────────────────── */
function _sparkAscii(values) {
    const B = ['▁','▂','▃','▄','▅','▆','▇','█'];
    const v = values.filter(x => x !== null && isFinite(x));
    if (v.length < 2) return '';
    const mn = Math.min(...v), mx = Math.max(...v), r = mx - mn || 1;
    return v.map(x => B[Math.round(((x - mn) / r) * (B.length - 1))]).join('');
}

function _patchTooltipSpark(chart) {
    const cb = chart.options.plugins.tooltip.callbacks;
    if (cb._sparkPatched) return;
    const orig = cb.afterBody;
    cb.afterBody = (items) => {
        const base = orig ? orig(items) : '';
        if (!items.length) return base;
        const lbl = items[0].dataset.label;
        if (!lbl || lbl.includes(' MA')) return base;
        const ds = chart.data.datasets.find(d => d.label === lbl);
        if (!ds) return base;
        const spark = _sparkAscii(ds.data.slice(-6));
        const t = _getTrend(lbl);
        const dir = t > 0 ? '▲' : t < 0 ? '▼' : '→';
        return [base, spark + ' ' + dir].filter(Boolean);
    };
    cb._sparkPatched = true;
}

/* ─── FEATURE 5: ZOOM DE PERÍODO ────────────────────────────────── */
let _zoomStart = 0, _zoomEnd = 100, _zoomActive = false;

function _applyZoom() {
    leagues.forEach(l => {
        const ci = chartInstances[l]; if (!ci) return;
        const total = ci.data.labels.length; if (total < 2) return;
        ci.options.scales.x.min = Math.floor((_zoomStart / 100) * total);
        ci.options.scales.x.max = Math.max(ci.options.scales.x.min + 1, Math.ceil((_zoomEnd / 100) * total) - 1);
        ci.update('none');
    });
}
function _resetZoom() {
    leagues.forEach(l => {
        const ci = chartInstances[l]; if (!ci) return;
        delete ci.options.scales.x.min; delete ci.options.scales.x.max;
        ci.update('none');
    });
}

function _buildZoomUI() {
    if (document.getElementById('_bsZoomPanel')) return;
    const refs = { s: null, sL: null, e: null, eL: null };

    const btn = document.createElement('button');
    btn.id = '_bsZoomBtn'; btn.innerHTML = '🔍';
    btn.title = 'Zoom de Período (tecla Z)';
    btn.style.cssText = 'position:fixed;bottom:18px;right:18px;z-index:9999;width:38px;height:38px;border-radius:50%;background:rgba(15,18,30,0.92);border:1.5px solid #1fad8b;color:#1fad8b;font-size:16px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.5)';

    const panel = document.createElement('div');
    panel.id = '_bsZoomPanel';
    panel.style.cssText = 'position:fixed;bottom:66px;right:14px;z-index:9998;background:rgba(12,15,26,0.95);border:1px solid #1fad8b;border-radius:8px;padding:10px 14px 8px;display:none;flex-direction:column;gap:6px;min-width:200px;box-shadow:0 4px 16px rgba(0,0,0,0.6);font-family:Arial,sans-serif';

    const ttl = document.createElement('div');
    ttl.textContent = '🔍 Zoom de Período';
    ttl.style.cssText = 'color:#1fad8b;font-size:11px;font-weight:bold;margin-bottom:4px';
    panel.appendChild(ttl);

    const mk = (txt, mn, mx, init, onCh, rS, rL) => {
        const w = document.createElement('div');
        w.style.cssText = 'display:flex;align-items:center;gap:8px';
        const l = document.createElement('span');
        l.style.cssText = 'color:#aaa;font-size:10px;width:36px;text-align:right';
        l.textContent = txt;
        const inp = document.createElement('input');
        inp.type = 'range'; inp.min = mn; inp.max = mx; inp.value = init;
        inp.style.cssText = 'flex:1;accent-color:#1fad8b;cursor:pointer';
        const vl = document.createElement('span');
        vl.style.cssText = 'color:#e0e0e0;font-size:10px;width:32px';
        vl.textContent = init + '%';
        refs[rS] = inp; refs[rL] = vl;
        inp.addEventListener('input', () => { vl.textContent = inp.value + '%'; onCh(parseInt(inp.value)); });
        w.appendChild(l); w.appendChild(inp); w.appendChild(vl);
        panel.appendChild(w);
    };

    mk('Início', 0, 90, 0, v => {
        _zoomStart = Math.min(v, _zoomEnd - 5);
        refs.s.value = _zoomStart; refs.sL.textContent = _zoomStart + '%'; _applyZoom();
    }, 's', 'sL');
    mk('Fim', 10, 100, 100, v => {
        _zoomEnd = Math.max(v, _zoomStart + 5);
        refs.e.value = _zoomEnd; refs.eL.textContent = _zoomEnd + '%'; _applyZoom();
    }, 'e', 'eL');

    const rb = document.createElement('button');
    rb.textContent = '↺ Reset';
    rb.style.cssText = 'margin-top:4px;padding:3px 0;background:transparent;border:1px solid #555;border-radius:4px;color:#aaa;font-size:10px;cursor:pointer;width:100%';
    rb.addEventListener('click', () => {
        _zoomStart = 0; _zoomEnd = 100;
        refs.s.value = 0; refs.sL.textContent = '0%';
        refs.e.value = 100; refs.eL.textContent = '100%';
        _resetZoom();
    });
    panel.appendChild(rb);

    btn.addEventListener('click', () => {
        _zoomActive = !_zoomActive;
        panel.style.display = _zoomActive ? 'flex' : 'none';
        btn.style.background = _zoomActive ? '#1fad8b' : 'rgba(15,18,30,0.92)';
        btn.style.color = _zoomActive ? '#000' : '#1fad8b';
        if (!_zoomActive) _resetZoom();
    });
    document.body.appendChild(panel);
    document.body.appendChild(btn);
}

/* ─── TOGGLE ZONA DE CALOR ──────────────────────────────────────── */
function _injectZonaCalorToggle() {
    if (document.getElementById('_bsZonaCalorWrap')) return;
    const anchor = document.getElementById('linhaToolsPanel')
                || document.getElementById('setupLinesPanel')
                || document.getElementById('setupBar');
    if (!anchor) return;
    const wrap = document.createElement('div');
    wrap.id = '_bsZonaCalorWrap';
    wrap.style.cssText = 'display:flex;align-items:center;gap:7px;margin-top:6px;padding:4px 6px';
    const chk = document.createElement('input');
    chk.type = 'checkbox'; chk.id = '_bsZonaCalorChk'; chk.checked = showZonaCalor;
    chk.style.cssText = 'accent-color:#1fad8b;cursor:pointer';
    chk.addEventListener('change', () => {
        showZonaCalor = chk.checked;
        _lsSet('mgraf:zonaCalor', showZonaCalor);
        leagues.forEach(l => { if (chartInstances[l]) chartInstances[l].update(); });
    });
    const lbl = document.createElement('label');
    lbl.htmlFor = '_bsZonaCalorChk'; lbl.textContent = 'Zona de Calor';
    lbl.style.cssText = 'color:#b0b0b0;font-size:12px;cursor:pointer;user-select:none';
    wrap.appendChild(chk); wrap.appendChild(lbl);
    anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
}

/* ─── HOOK: aplica patches APÓS chart ser criado ────────────────── */
// Roda depois que updateCharts() termina e o chart já existe
const _bs_origUpdateCharts = updateCharts;
updateCharts = function() {
    _bs_origUpdateCharts.apply(this, arguments);
    // Aguarda fetch + render completar
    setTimeout(() => {
        leagues.forEach(l => {
            const ci = chartInstances[l]; if (!ci) return;
            _patchTooltipSpark(ci);
        });
        _updateTrendIndicators();
    }, 600);
};

/* ─── PATCH _updateLinesPanelValues ─────────────────────────────── */
const _bs_origPanelVals = _updateLinesPanelValues;
_updateLinesPanelValues = function() {
    _bs_origPanelVals.apply(this, arguments);
    _updateTrendIndicators();
};

/* ─── RAF ANIMAÇÃO ALERTAS ──────────────────────────────────────── */
let _bsRafId = null;
function _startAlertRaf() {
    if (_bsRafId) return;
    const tick = () => {
        if (!_tabVisible) { _bsRafId = null; return; }
        const ci = chartInstances['Copa'] || Object.values(chartInstances)[0];
        if (!ci) { _bsRafId = null; return; }
        if (!ci.data.datasets.some((ds, i) => !ds.label.includes(' MA') && ci.isDatasetVisible(i))) {
            _bsRafId = null; return;
        }
        ci.update('none');
        _bsRafId = requestAnimationFrame(tick);
    };
    _bsRafId = requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { _bsRafId = null; setTimeout(_startAlertRaf, 500); }
});
setTimeout(_startAlertRaf, 1500);

/* ─── TECLA Z ───────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
    if ((e.key === 'z' || e.key === 'Z') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const b = document.getElementById('_bsZoomBtn'); if (b) b.click();
    }
});

/* ─── INIT ──────────────────────────────────────────────────────── */
const _bsInit = () => { _buildZoomUI(); _injectZonaCalorToggle(); };
document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', _bsInit)
    : _bsInit();

setInterval(updateCharts, 3000);