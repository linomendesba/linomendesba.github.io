// ═══════════════════════════════════════════════════════
//  SELETORES EXCLUÍDOS DO SAVE
// ═══════════════════════════════════════════════════════
const excludedSelectors = [
    "ligas",
    "avancado-betano",
    "ligas365",
    "avancado-bet365",
    "redes"
];

// ═══════════════════════════════════════════════════════
//  ACORDEONS GERENCIADOS
// ═══════════════════════════════════════════════════════
const ACCORDION_KEYS = {
    "Gráfico Gols":     "accordion_grafico_gols",
    "Gráfico MACD/RSI": "accordion_grafico_macd",
    "Gráfico Mercados": "accordion_grafico_mercados"
};

// ─── Selects que controlam fetch — disparar change após window.load
// (numPoints/averagePoints são "let" no script inline, não ficam em window)
const CHART_SELECTORS = [
    "pointsSelector",
    "averageSelector",
    "pointsSelectorGolsPlus",
    "averageSelectorGolsPlus",
    "histomacdMarketSelector",
    "histomacdPointsSelector"
];

// ─── Canvas dos gráficos com legenda ──────────────────
const CHART_CANVASES = ["Copa", "golsplus"];

// ─── helpers ──────────────────────────────────────────
function getAccordionKey(btn) {
    const text = btn.textContent || "";
    for (const [label, key] of Object.entries(ACCORDION_KEYS)) {
        if (text.includes(label)) return key;
    }
    return null;
}

function isTargetAccordion(btn) {
    return getAccordionKey(btn) !== null;
}

function getParentAccordionBtn(el) {
    return el.closest(".accordion-content")?.previousElementSibling ?? null;
}

function getChartByCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;
    return Chart.getChart(canvas) ?? null;
}

// ═══════════════════════════════════════════════════════
//  TOGGLE — abre/fecha e persiste estado
// ═══════════════════════════════════════════════════════
function toggleAccordion(btn) {
    const content = btn.nextElementSibling;

    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
        btn.textContent = btn.textContent.replace("▼", "▲");
    } else {
        content.style.display = "none";
        btn.textContent = btn.textContent.replace("▲", "▼");
    }

    if (!isTargetAccordion(btn)) return;

    saveAccordionState(btn);
    content.querySelectorAll("select, input[type='checkbox'], input[type='number']")
        .forEach(el => { if (!excludedSelectors.includes(el.id)) saveSelection(el.id); });
}

// ═══════════════════════════════════════════════════════
//  SAVE / RESTORE — estado aberto/fechado dos acordeons
// ═══════════════════════════════════════════════════════
function saveAccordionState(btn) {
    const key = getAccordionKey(btn);
    if (!key) return;
    const isOpen = btn.nextElementSibling?.style.display !== "none";
    localStorage.setItem(key, isOpen);
}

function restoreAccordionState() {
    document.querySelectorAll(".accordion-button").forEach(btn => {
        const key = getAccordionKey(btn);
        if (!key) return;

        const saved = localStorage.getItem(key);
        if (saved === null) return;

        const content = btn.nextElementSibling;
        if (!content) return;

        if (saved === "true") {
            content.style.display = "block";
            btn.textContent = btn.textContent.replace("▼", "▲");
        } else {
            content.style.display = "none";
            btn.textContent = btn.textContent.replace("▲", "▼");
        }
    });
}

// ═══════════════════════════════════════════════════════
//  SAVE / RESTORE — valores de controles individuais
// ═══════════════════════════════════════════════════════
function saveSelection(id) {
    const el = document.getElementById(id);
    if (!el || excludedSelectors.includes(id) || !id) return;
    localStorage.setItem(id, el.type === "checkbox" ? el.checked : el.value);
}

function restoreSelections() {
    // selects — restaura valor visual
    // Chart selectors (horas/base) são tratados em restoreChartSelectors()
    // para não competir com o fetch inicial do window.onload
    document.querySelectorAll("select").forEach(sel => {
        if (excludedSelectors.includes(sel.id) || !sel.id) return;
        const saved = localStorage.getItem(sel.id);
        if (saved === null) return;
        // Valida se a option existe antes de aplicar
        const optionExists = Array.from(sel.options).some(o => o.value === saved);
        if (!optionExists) return;
        sel.value = saved;
        // Dispara change apenas para selects que não controlam fetch do gráfico
        if (!CHART_SELECTORS.includes(sel.id)) {
            sel.dispatchEvent(new Event("change", { bubbles: true }));
            if (sel.onchange) sel.onchange();
        }
    });

    // checkboxes
    document.querySelectorAll("input[type='checkbox']").forEach(cb => {
        if (excludedSelectors.includes(cb.id)) return;
        const saved = localStorage.getItem(cb.id);
        if (saved === null) return;
        cb.checked = saved === "true";
        cb.dispatchEvent(new Event("change", { bubbles: true }));
        if (cb.onchange) cb.onchange();
    });

    // number inputs (MACD, RSI, etc.)
    document.querySelectorAll("input[type='number']").forEach(inp => {
        if (excludedSelectors.includes(inp.id)) return;
        const saved = localStorage.getItem(inp.id);
        if (saved === null) return;
        inp.value = saved;
        inp.dispatchEvent(new Event("change", { bubbles: true }));
        if (inp.onchange) inp.onchange();
    });
}

// ─── Restaura seletores de horas/base ─────────────────
// Chamado após window.load para garantir que os listeners
// do HTML estão registrados e dispara change para que
// numPoints/averagePoints sejam sincronizados.
function restoreChartSelectors() {
    CHART_SELECTORS.forEach(id => {
        const saved = localStorage.getItem(id);
        if (saved === null) return;
        const sel = document.getElementById(id);
        if (!sel) return;
        const optionExists = Array.from(sel.options).some(o => o.value === saved);
        if (!optionExists) return;
        if (sel.value === saved) return; // já correto, não refaz fetch
        sel.value = saved;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
    });
}

// ═══════════════════════════════════════════════════════
//  VISIBILIDADE DAS LINHAS (legenda dos gráficos)
// ═══════════════════════════════════════════════════════

// Salva quais datasets estão visíveis no chart
function saveDatasetVisibility(canvasId) {
    const chart = getChartByCanvas(canvasId);
    if (!chart) return;
    const state = {};
    chart.data.datasets.forEach((ds, i) => {
        state[ds.label] = !chart.getDatasetMeta(i).hidden;
    });
    try { localStorage.setItem(`datasets_${canvasId}`, JSON.stringify(state)); } catch {}
}

// Aplica o estado salvo de visibilidade no chart
function restoreDatasetVisibility(canvasId) {
    const saved = localStorage.getItem(`datasets_${canvasId}`);
    if (!saved) return;
    let state;
    try { state = JSON.parse(saved); } catch { return; }
    const chart = getChartByCanvas(canvasId);
    if (!chart) return;
    let changed = false;
    chart.data.datasets.forEach((ds, i) => {
        if (!(ds.label in state)) return;
        const meta = chart.getDatasetMeta(i);
        const shouldBeHidden = !state[ds.label];
        if (meta.hidden === shouldBeHidden) return;
        meta.hidden = shouldBeHidden;
        changed = true;
    });
    if (changed) chart.update("none");
}

// Aguarda o chart aparecer e faz patch no onClick da legenda
// para salvar após cada clique
function patchLegendSave(canvasId, maxTries = 30) {
    let tries = 0;
    const interval = setInterval(() => {
        const chart = getChartByCanvas(canvasId);
        if (!chart) {
            if (++tries >= maxTries) clearInterval(interval);
            return;
        }
        clearInterval(interval);
        const original = chart.options.plugins.legend.onClick;
        chart.options.plugins.legend.onClick = function(e, legendItem, legend) {
            if (typeof original === "function") original.call(this, e, legendItem, legend);
            setTimeout(() => saveDatasetVisibility(canvasId), 0);
        };
    }, 300);
}

// ═══════════════════════════════════════════════════════
//  SETUP — listeners automáticos
// ═══════════════════════════════════════════════════════
function setupSelectors() {
    const selector = "select, input[type='checkbox'], input[type='number']";

    document.querySelectorAll(selector).forEach(el => {
        if (excludedSelectors.includes(el.id)) return;

        const accordionBtn = getParentAccordionBtn(el);
        const inTarget     = accordionBtn && isTargetAccordion(accordionBtn);

        if (accordionBtn && !inTarget) return;

        if (
            el.tagName === "SELECT" &&
            el.hasAttribute("onclick") &&
            el.getAttribute("onclick").includes("redirecionar")
        ) {
            const orig = el.getAttribute("onclick");
            el.setAttribute("onclick", `saveSelection('${el.id}'); ${orig}`);
            return;
        }

        el.addEventListener("change", () => {
            saveSelection(el.id);
            if (inTarget) saveAccordionState(accordionBtn);
        });
    });
}

// ═══════════════════════════════════════════════════════
//  SAVE ALL — snapshot antes de fechar
// ═══════════════════════════════════════════════════════
function saveAllSelections() {
    const selector = "select, input[type='checkbox'], input[type='number']";
    document.querySelectorAll(selector).forEach(el => {
        if (excludedSelectors.includes(el.id) || !el.id) return;
        const btn      = getParentAccordionBtn(el);
        const inTarget = !btn || isTargetAccordion(btn);
        if (inTarget) saveSelection(el.id);
    });
    document.querySelectorAll(".accordion-button").forEach(btn => saveAccordionState(btn));
}

// ═══════════════════════════════════════════════════════
//  CLEAR — limpa localStorage (debug / reset)
// ═══════════════════════════════════════════════════════
function clearSavedData() {
    const selector = "select, input[type='checkbox'], input[type='number']";
    document.querySelectorAll(selector).forEach(el => {
        if (!excludedSelectors.includes(el.id) && el.id) localStorage.removeItem(el.id);
    });
    Object.values(ACCORDION_KEYS).forEach(key => localStorage.removeItem(key));
    CHART_CANVASES.forEach(id => localStorage.removeItem(`datasets_${id}`));
}

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
window.addEventListener("DOMContentLoaded", () => {
    restoreAccordionState();
    setTimeout(() => {
        restoreSelections();
        setupSelectors();
    }, 100);
});

window.addEventListener("load", () => {
    // Horas/base: dispara change para sincronizar numPoints com o valor salvo
    setTimeout(() => restoreChartSelectors(), 200);

    // Linhas da legenda: aplica visibilidade salva nos charts já criados
    setTimeout(() => CHART_CANVASES.forEach(restoreDatasetVisibility), 600);

    // Patch das legendas para salvar após cada clique
    CHART_CANVASES.forEach(patchLegendSave);
});

window.addEventListener("beforeunload", saveAllSelections);