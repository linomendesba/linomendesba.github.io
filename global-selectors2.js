// ═══════════════════════════════════════════════════════
//  KIRON SAVE SELECT
//  Salva e restaura por página isoladamente.
// ═══════════════════════════════════════════════════════

const allowedPages = [
    "kironengland.html", "kironitaly.html", "kironspain.html"
];

const currentPage = window.location.pathname.split('/').pop();

if (allowedPages.includes(currentPage)) {

    const excludedSelectors = [
        "ligas", "avancado-betano", "ligas365", "avancado-bet365", "redes"
    ];

    const ACCORDION_KEYS = {
        "Ranking Speed":    "accordion_ranking_speed",
        "Ver Confrontos":   "accordion_ver_confrontos",
        "Gráfico Gols":     "accordion_grafico_gols",
        "Gráfico MACD/RSI": "accordion_grafico_macd",
        "Gráfico Mercados": "accordion_grafico_mercados"
    };

    // Selects que controlam fetch — tratados separadamente após window.load
    const CHART_SELECTORS = [
        "pointsSelector", "averageSelector",
        "pointsSelectorGolsPlus", "averageSelectorGolsPlus",
        "histomacdMarketSelector", "histomacdPointsSelector"
    ];

    const CHART_CANVASES = ["Copa", "golsplus"];

    // ─── helpers ──────────────────────────────────────────
    function pageKey(id) { return `${currentPage}_${id}`; }

    function getAccordionKey(btn) {
        const text = btn.textContent || "";
        for (const [label, key] of Object.entries(ACCORDION_KEYS)) {
            if (text.includes(label)) return key;
        }
        return null;
    }
    function isTargetAccordion(btn)    { return getAccordionKey(btn) !== null; }
    function getParentAccordionBtn(el) { return el.closest(".accordion-content")?.previousElementSibling ?? null; }

    function getChartByCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === "undefined") return null;
        return Chart.getChart(canvas) ?? null;
    }

    function debounce(fn, delay = 400) {
        let timer;
        return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
    }

    // ─── toggleAccordion ──────────────────────────────────
    function patchToggleAccordion() {
        const native = window.toggleAccordion;
        window.toggleAccordion = function(btn) {
            const content = btn.nextElementSibling;
            if (!content) return;
            if (btn.classList.contains("tabelas-maximas-button")) {
                if (typeof native === "function") native(btn);
                return;
            }
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
                .forEach(el => { if (el.id && !excludedSelectors.includes(el.id)) saveSelection(el.id); });
        };
    }

    // ─── acordeons ────────────────────────────────────────
    function saveAccordionState(btn) {
        const key = getAccordionKey(btn);
        if (!key) return;
        localStorage.setItem(pageKey(key), btn.nextElementSibling?.style.display !== "none");
    }

    function restoreAccordionState() {
        document.querySelectorAll(".accordion-button").forEach(btn => {
            if (btn.classList.contains("tabelas-maximas-button")) return;
            const key = getAccordionKey(btn);
            if (!key) return;
            const saved = localStorage.getItem(pageKey(key));
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

    // ─── controles ────────────────────────────────────────
    function saveSelection(id) {
        if (!id || excludedSelectors.includes(id)) return;
        const el = document.getElementById(id);
        if (!el) return;
        localStorage.setItem(pageKey(id), el.type === "checkbox" ? el.checked : el.value);
    }

    function restoreSelections() {
        // selects — NÃO toca nos chart selectors (tratados depois)
        document.querySelectorAll("select").forEach(sel => {
            if (!sel.id || excludedSelectors.includes(sel.id)) return;
            if (CHART_SELECTORS.includes(sel.id)) return; // <-- deixa para depois
            const saved = localStorage.getItem(pageKey(sel.id));
            if (saved === null) return;
            const optionExists = Array.from(sel.options).some(o => o.value === saved);
            if (!optionExists) return;
            sel.value = saved;
            sel.dispatchEvent(new Event("change", { bubbles: true }));
            if (sel.onchange) sel.onchange();
        });

        // checkboxes
        document.querySelectorAll("input[type='checkbox']").forEach(cb => {
            if (!cb.id || excludedSelectors.includes(cb.id)) return;
            const saved = localStorage.getItem(pageKey(cb.id));
            if (saved === null) return;
            cb.checked = saved === "true";
            cb.dispatchEvent(new Event("change", { bubbles: true }));
            if (cb.onchange) cb.onchange();
        });

        // number inputs
        document.querySelectorAll("input[type='number']").forEach(inp => {
            if (!inp.id || excludedSelectors.includes(inp.id)) return;
            const saved = localStorage.getItem(pageKey(inp.id));
            if (saved === null) return;
            inp.value = saved;
            inp.dispatchEvent(new Event("change", { bubbles: true }));
            if (inp.onchange) inp.onchange();
        });
    }

    // Chamado após window.load — dispara change nos chart selectors
    function restoreChartSelectors() {
        CHART_SELECTORS.forEach(id => {
            const saved = localStorage.getItem(pageKey(id));
            if (saved === null) return;
            const sel = document.getElementById(id);
            if (!sel) return;
            const optionExists = Array.from(sel.options).some(o => o.value === saved);
            if (!optionExists) return;
            sel.value = saved;
            sel.dispatchEvent(new Event("change", { bubbles: true })); // sempre dispara
        });
    }

    // ─── linhas da legenda ────────────────────────────────
    function saveDatasetVisibility(canvasId) {
        const chart = getChartByCanvas(canvasId);
        if (!chart) return;
        const state = {};
        chart.data.datasets.forEach((ds, i) => {
            state[ds.label] = !chart.getDatasetMeta(i).hidden;
        });
        try { localStorage.setItem(pageKey(`datasets_${canvasId}`), JSON.stringify(state)); } catch {}
    }

    function restoreDatasetVisibility(canvasId) {
        const saved = localStorage.getItem(pageKey(`datasets_${canvasId}`));
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

    // ─── setup listeners ──────────────────────────────────
    function setupSelectors() {
        document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
            if (!el.id || excludedSelectors.includes(el.id)) return;
            const accordionBtn = getParentAccordionBtn(el);
            const inTarget     = accordionBtn && isTargetAccordion(accordionBtn);
            if (accordionBtn && !inTarget) return;
            if (el.tagName === "SELECT" && el.hasAttribute("onclick") &&
                el.getAttribute("onclick").includes("redirecionar")) {
                const orig = el.getAttribute("onclick");
                el.setAttribute("onclick", `saveSelection('${el.id}'); ${orig}`);
                return;
            }
            if (el.type === "number") {
                el.addEventListener("blur", () => saveSelection(el.id));
                el.addEventListener("change", debounce(() => {
                    saveSelection(el.id);
                    if (inTarget) saveAccordionState(accordionBtn);
                }, 400));
                return;
            }
            el.addEventListener("change", () => {
                saveSelection(el.id);
                if (inTarget) saveAccordionState(accordionBtn);
            });
        });
    }

    // ─── save all / clear ─────────────────────────────────
    window.clearKironSavedData = function() {
        document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
            if (el.id && !excludedSelectors.includes(el.id)) localStorage.removeItem(pageKey(el.id));
        });
        Object.values(ACCORDION_KEYS).forEach(key => localStorage.removeItem(pageKey(key)));
        CHART_CANVASES.forEach(id => localStorage.removeItem(pageKey(`datasets_${id}`)));
        console.log(`[kiron save] Dados de "${currentPage}" limpos.`);
    };

    // ─── init ─────────────────────────────────────────────
    window.addEventListener("DOMContentLoaded", () => {
        restoreAccordionState();
        setTimeout(() => {
            patchToggleAccordion();
            restoreSelections();
            setupSelectors();
        }, 100);
    });

    window.addEventListener("load", () => {
        // Horas/base: dispara change depois do fetch inicial completar
        setTimeout(() => restoreChartSelectors(), 300);

        // Linhas: aplica visibilidade salva depois dos charts existirem
        setTimeout(() => CHART_CANVASES.forEach(restoreDatasetVisibility), 800);

        // Patch do onClick para salvar a cada clique na legenda
        CHART_CANVASES.forEach(patchLegendSave);
    });

} // fim do bloco condicional