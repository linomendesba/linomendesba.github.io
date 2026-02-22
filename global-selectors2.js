// ═══════════════════════════════════════════════════════
//  KIRON SAVE SELECT
//  Salva e restaura por página:
//  - Estado aberto/fechado dos 5 acordeons
//  - Todos os selects, checkboxes e number inputs
//  - Seletores de horas (dispara change após window.load)
//  - Visibilidade das linhas nos gráficos (via Chart.getChart)
// ═══════════════════════════════════════════════════════

const allowedPages = [
    "kironengland.html",
    "kironitaly.html",
    "kironspain.html"
];

const currentPage = window.location.pathname.split('/').pop();

if (allowedPages.includes(currentPage)) {

    // ─── IDs excluídos do save ───────────────────────────
    const excludedSelectors = [
        "ligas", "avancado-betano", "ligas365", "avancado-bet365", "redes"
    ];

    // ─── Acordeons gerenciados ───────────────────────────
    const ACCORDION_KEYS = {
        "Ranking Speed":    "accordion_ranking_speed",
        "Ver Confrontos":   "accordion_ver_confrontos",
        "Gráfico Gols":     "accordion_grafico_gols",
        "Gráfico MACD/RSI": "accordion_grafico_macd",
        "Gráfico Mercados": "accordion_grafico_mercados"
    };

    // ─── Selects que controlam fetch — precisam de change ─
    // numPoints/averagePoints são "let" no script inline,
    // inacessíveis via window. Único jeito de sincronizá-los
    // é disparar change no elemento após o window.load.
    const CHART_SELECTORS = [
        "pointsSelector",
        "averageSelector",
        "pointsSelectorGolsPlus",
        "averageSelectorGolsPlus",
        "histomacdMarketSelector",
        "histomacdPointsSelector"
    ];

    // ─── Canvas IDs dos gráficos com legenda ─────────────
    const CHART_CANVASES = {
        mercados: "Copa",
        gols:     "golsplus"
    };

    // ─── Helpers ─────────────────────────────────────────
    function pageKey(id)  { return `${currentPage}_${id}`; }
    function getSaved(id) { return localStorage.getItem(pageKey(id)); }

    function getAccordionKey(btn) {
        const text = btn.textContent || "";
        for (const [label, key] of Object.entries(ACCORDION_KEYS)) {
            if (text.includes(label)) return key;
        }
        return null;
    }

    function isTargetAccordion(btn)    { return getAccordionKey(btn) !== null; }
    function getParentAccordionBtn(el) { return el.closest(".accordion-content")?.previousElementSibling ?? null; }

    function debounce(fn, delay = 400) {
        let timer;
        return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
    }

    // Acessa chart pelo canvas ID usando Chart.js v3 API
    function getChartByCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        return Chart.getChart(canvas) ?? null;
    }

    // ─── Save ─────────────────────────────────────────────
    function saveSelection(id) {
        if (!id || excludedSelectors.includes(id)) return;
        const el = document.getElementById(id);
        if (!el) return;
        localStorage.setItem(pageKey(id), el.type === "checkbox" ? el.checked : el.value);
    }

    function saveAccordionState(btn) {
        const key = getAccordionKey(btn);
        if (!key) return;
        const isOpen = btn.nextElementSibling?.style.display !== "none";
        localStorage.setItem(pageKey(key), isOpen);
    }

    // Salva quais datasets estão visíveis no chart
    function saveDatasetVisibility(canvasId) {
        const chart = getChartByCanvas(canvasId);
        if (!chart) return;
        const state = {};
        chart.data.datasets.forEach((ds, i) => {
            state[ds.label] = !chart.getDatasetMeta(i).hidden;
        });
        try { localStorage.setItem(pageKey(`datasets_${canvasId}`), JSON.stringify(state)); } catch {}
    }

    // ─── Restore — acordeons ──────────────────────────────
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

    // ─── Restore — valores visuais dos controles ─────────
    function restoreSelections() {
        // selects
        document.querySelectorAll("select").forEach(sel => {
            if (!sel.id || excludedSelectors.includes(sel.id)) return;
            const saved = getSaved(sel.id);
            if (saved === null) return;
            const optionExists = Array.from(sel.options).some(o => o.value === saved);
            if (!optionExists) return;
            sel.value = saved;
            // Selects fora de acordeon (Ranking etc) precisam do change para renderizar
            // Chart selectors são tratados separadamente em restoreChartSelectors()
            const outsideAccordion = !getParentAccordionBtn(sel);
            const isChartSel = CHART_SELECTORS.includes(sel.id);
            if (outsideAccordion && !isChartSel) {
                sel.dispatchEvent(new Event("change", { bubbles: true }));
                if (sel.onchange) sel.onchange();
            }
        });

        // checkboxes
        document.querySelectorAll("input[type='checkbox']").forEach(cb => {
            if (!cb.id || excludedSelectors.includes(cb.id)) return;
            const saved = getSaved(cb.id);
            if (saved === null) return;
            cb.checked = saved === "true";
            cb.dispatchEvent(new Event("change", { bubbles: true }));
            if (cb.onchange) cb.onchange();
        });

        // number inputs (MACD — lidos direto no render)
        document.querySelectorAll("input[type='number']").forEach(inp => {
            if (!inp.id || excludedSelectors.includes(inp.id)) return;
            const saved = getSaved(inp.id);
            if (saved === null) return;
            inp.value = saved;
        });
    }

    // ─── Restore — seletores de horas/base dos gráficos ──
    // Disparado APÓS window.load (charts já criados).
    // Atualiza o valor visual E dispara change para que
    // numPoints/averagePoints sejam sincronizados e o
    // fetch seja refeito com o período correto.
    function restoreChartSelectors() {
        CHART_SELECTORS.forEach(id => {
            const saved = getSaved(id);
            if (saved === null) return;
            const sel = document.getElementById(id);
            if (!sel) return;
            const optionExists = Array.from(sel.options).some(o => o.value === saved);
            if (!optionExists) return;
            if (sel.value === saved) return; // já está correto, não refaz fetch
            sel.value = saved;
            sel.dispatchEvent(new Event("change", { bubbles: true }));
        });
    }

    // ─── Restore — visibilidade dos datasets ─────────────
    // Após charts criados: aplica hidden/visible em cada dataset
    // usando Chart.getChart() (Chart.js v3 API).
    function restoreDatasetVisibility(canvasId) {
        const saved = getSaved(`datasets_${canvasId}`);
        if (!saved) return;
        let state;
        try { state = JSON.parse(saved); } catch { return; }

        const chart = getChartByCanvas(canvasId);
        if (!chart) return;

        let changed = false;
        chart.data.datasets.forEach((ds, i) => {
            if (!(ds.label in state)) return;
            const meta    = chart.getDatasetMeta(i);
            const visible = state[ds.label];
            if (meta.hidden === !visible) return; // já correto
            meta.hidden = !visible;
            changed = true;
        });
        if (changed) chart.update("none");
    }

    // ─── Patch toggleAccordion ────────────────────────────
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

    // ─── Patch legenda dos gráficos ───────────────────────
    // Aguarda o chart aparecer via Chart.getChart() e envolve
    // o onClick original para salvar após cada clique na legenda.
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
                // Salva após o clique processar (próximo tick)
                setTimeout(() => saveDatasetVisibility(canvasId), 0);
            };
        }, 300);
    }

    // ─── Setup listeners ──────────────────────────────────
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
                el.addEventListener("blur",   () => saveSelection(el.id));
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

    // ─── Expõe reset global ───────────────────────────────
    window.clearKironSavedData = function() {
        document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
            if (el.id && !excludedSelectors.includes(el.id)) localStorage.removeItem(pageKey(el.id));
        });
        Object.values(ACCORDION_KEYS).forEach(key => localStorage.removeItem(pageKey(key)));
        Object.values(CHART_CANVASES).forEach(id => localStorage.removeItem(pageKey(`datasets_${id}`)));
        console.log(`[kiron save] Dados de "${currentPage}" limpos.`);
    };

    // ─── Init ─────────────────────────────────────────────
    window.addEventListener("DOMContentLoaded", () => {
        // 1. Acordeons — antes de qualquer render
        restoreAccordionState();

        setTimeout(() => {
            // 2. Patch toggleAccordion (após função nativa declarada)
            patchToggleAccordion();
            // 3. Valores visuais + checkboxes
            restoreSelections();
            // 4. Listeners de save
            setupSelectors();
        }, 100);
    });

    window.addEventListener("load", () => {
        // 5. Chart selectors (horas/base): dispara change para sincronizar
        //    numPoints/averagePoints e refazer fetch com período correto.
        //    Delay para garantir que os listeners do HTML estão registrados
        //    e o fetch inicial do window.onload já começou.
        setTimeout(() => restoreChartSelectors(), 200);

        // 6. Visibilidade dos datasets: aplica hidden/visible nos charts criados
        setTimeout(() => {
            Object.values(CHART_CANVASES).forEach(restoreDatasetVisibility);
        }, 600);

        // 7. Patch das legendas para salvar após cada clique
        Object.values(CHART_CANVASES).forEach(patchLegendSave);
    });

} // fim do bloco condicional