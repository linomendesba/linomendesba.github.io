// ═══════════════════════════════════════════════════════
//  KIRON SAVE SELECT
//  Salva e restaura por página:
//  - Estado aberto/fechado dos 5 acordeons
//  - Todos os selects, checkboxes e number inputs
//  - Seletores de horas/base (sincroniza variáveis JS)
//  - Visibilidade das linhas nos gráficos (legenda)
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

    // ─── Selects que controlam fetch dos gráficos ────────
    // Além de restaurar o valor visual, precisam sincronizar
    // a variável JS correspondente antes dos charts serem criados.
    const CHART_SELECTOR_VARS = {
        "pointsSelector":         () => { window.numPoints        = parseInt(getSaved("pointsSelector"),        10) || 30; },
        "averageSelector":        () => { window.averagePoints     = parseInt(getSaved("averageSelector"),        10) || 29; },
        "pointsSelectorGolsPlus": () => { window.numPointsGolsPlus = parseInt(getSaved("pointsSelectorGolsPlus"), 10) || 20; },
        "averageSelectorGolsPlus":() => { window.averagePointsGolsPlus = parseInt(getSaved("averageSelectorGolsPlus"), 10) || 19; }
    };

    // ─── Helpers ─────────────────────────────────────────
    function pageKey(id)    { return `${currentPage}_${id}`; }
    function getSaved(id)   { return localStorage.getItem(pageKey(id)); }

    function getAccordionKey(btn) {
        const text = btn.textContent || "";
        for (const [label, key] of Object.entries(ACCORDION_KEYS)) {
            if (text.includes(label)) return key;
        }
        return null;
    }

    function isTargetAccordion(btn)   { return getAccordionKey(btn) !== null; }
    function getParentAccordionBtn(el){ return el.closest(".accordion-content")?.previousElementSibling ?? null; }

    function debounce(fn, delay = 400) {
        let timer;
        return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
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

    // ─── Restore — variáveis JS dos gráficos ─────────────
    // Chamado o mais cedo possível — antes de window.onload
    // criar os charts. Ajusta numPoints etc. direto na variável
    // global para que o primeiro fetch já use o valor correto.
    function restoreChartVars() {
        Object.entries(CHART_SELECTOR_VARS).forEach(([id, applyFn]) => {
            if (getSaved(id) !== null) applyFn();
        });
    }

    // ─── Restore — valores visuais dos controles ─────────
    function restoreSelections() {
        // selects — restaura valor visual + dispara change onde necessário
        document.querySelectorAll("select").forEach(sel => {
            if (!sel.id || excludedSelectors.includes(sel.id)) return;
            const saved = getSaved(sel.id);
            if (saved === null) return;
            const optionExists = Array.from(sel.options).some(o => o.value === saved);
            if (!optionExists) return;
            sel.value = saved;
            // Selects fora de acordeon precisam do change (ex: marketSelector do Ranking)
            // Chart selectors NÃO disparam change aqui — a variável JS já foi
            // sincronizada em restoreChartVars(), e o fetch acontece no window.onload
            const outsideAccordion = !getParentAccordionBtn(sel);
            const isChartSelector  = sel.id in CHART_SELECTOR_VARS;
            if (outsideAccordion && !isChartSelector) {
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

        // number inputs (MACD — lidos direto no render, sem change)
        document.querySelectorAll("input[type='number']").forEach(inp => {
            if (!inp.id || excludedSelectors.includes(inp.id)) return;
            const saved = getSaved(inp.id);
            if (saved === null) return;
            inp.value = saved;
        });
    }

    // ─── Patch toggleAccordion ────────────────────────────
    function patchToggleAccordion() {
        const native = window.toggleAccordion;
        window.toggleAccordion = function(btn) {
            const content = btn.nextElementSibling;
            if (!content) return;
            // tabelas-maximas-button: lógica especial de ícone
            if (btn.classList.contains("tabelas-maximas-button")) {
                if (typeof native === "function") native(btn);
                return;
            }
            // Botões normais
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

    // ─── Visibilidade dos datasets (linhas da legenda) ────
    const DS_KEY_MERCADOS = pageKey("datasets_mercados");
    const DS_KEY_GOLS     = pageKey("datasets_gols");

    function saveDatasetVisibility(key, obj) {
        try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
    }

    // Sobrescreve os objetos globais ANTES dos charts serem criados
    function restoreDatasetVisibility() {
        try {
            const saved = localStorage.getItem(DS_KEY_MERCADOS);
            if (saved && window.statsChartVisibleDatasets)
                Object.assign(window.statsChartVisibleDatasets, JSON.parse(saved));
        } catch {}
        try {
            const saved = localStorage.getItem(DS_KEY_GOLS);
            if (saved && window.statsChartVisibleDatasetsGolsPlus)
                Object.assign(window.statsChartVisibleDatasetsGolsPlus, JSON.parse(saved));
        } catch {}
    }

    // Aguarda o chart estar disponível e faz patch no onClick da legenda
    function patchChartLegendSave(chartGetter, dsObj, storageKey, maxTries = 20) {
        let tries = 0;
        const interval = setInterval(() => {
            const chart = chartGetter();
            if (!chart) {
                if (++tries >= maxTries) clearInterval(interval);
                return;
            }
            clearInterval(interval);
            const original = chart.options.plugins.legend.onClick;
            chart.options.plugins.legend.onClick = function(e, legendItem, legend) {
                if (typeof original === "function") original.call(this, e, legendItem, legend);
                saveDatasetVisibility(storageKey, dsObj);
            };
            chart.update("none");
        }, 300);
    }

    // ─── Expõe reset global ───────────────────────────────
    window.clearKironSavedData = function() {
        document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
            if (el.id && !excludedSelectors.includes(el.id)) localStorage.removeItem(pageKey(el.id));
        });
        Object.values(ACCORDION_KEYS).forEach(key => localStorage.removeItem(pageKey(key)));
        localStorage.removeItem(DS_KEY_MERCADOS);
        localStorage.removeItem(DS_KEY_GOLS);
        console.log(`[kiron save] Dados de "${currentPage}" limpos.`);
    };

    // ─── Init ─────────────────────────────────────────────
    window.addEventListener("DOMContentLoaded", () => {
        // 1. Acordeons: restaura antes de qualquer render
        restoreAccordionState();

        // 2. Variáveis JS dos charts: restaura antes do window.onload criar os charts
        //    Feito logo aqui para garantir que numPoints/averagePoints estão corretos
        //    quando updateCharts() rodar no window.onload
        restoreChartVars();

        setTimeout(() => {
            // 3. Patch do toggleAccordion (após função nativa ser declarada)
            patchToggleAccordion();

            // 4. Valores visuais + checkboxes
            restoreSelections();

            // 5. Visibilidade dos datasets (antes do window.onload criar os charts)
            restoreDatasetVisibility();

            // 6. Listeners de save
            setupSelectors();
        }, 100);
    });

    // 7. Patch das legendas (após charts criados pelo window.onload)
    window.addEventListener("load", () => {
        patchChartLegendSave(
            () => window.chartInstances?.["Copa"],
            window.statsChartVisibleDatasets,
            DS_KEY_MERCADOS
        );
        patchChartLegendSave(
            () => window.golsPlusChart,
            window.statsChartVisibleDatasetsGolsPlus,
            DS_KEY_GOLS
        );
    });

} // fim do bloco condicional