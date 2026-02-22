// ═══════════════════════════════════════════════════════
//  KIRON SAVE SELECT — salva estado de acordeons e
//  controles isolado por página
//  Páginas: kironengland.html | kironitaly.html | kironspain.html
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
        "ligas",
        "avancado-betano",
        "ligas365",
        "avancado-bet365",
        "redes"
    ];

    // ─── Acordeons gerenciados ───────────────────────────
    // "Ver Máximas" tem style="display:none" fixo no HTML —
    // não incluído propositalmente para não sobrescrever.
    const ACCORDION_KEYS = {
        "Ranking Speed":    "accordion_ranking_speed",
        "Ver Confrontos":   "accordion_ver_confrontos",
        "Gráfico Gols":     "accordion_grafico_gols",
        "Gráfico MACD/RSI": "accordion_grafico_macd",
        "Gráfico Mercados": "accordion_grafico_mercados"
    };

    // ─── Helpers ─────────────────────────────────────────
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

    // Chave única por página + elemento
    function pageKey(id) {
        return `${currentPage}_${id}`;
    }

    // ─── Toggle ──────────────────────────────────────────
    // Substitui o toggleAccordion global para os botões
    // simples (▼/▲). O tabelas-maximas-button continua
    // sendo tratado pela função original que já existe no HTML.
    function toggleAccordion(btn) {
        const content = btn.nextElementSibling;

        // tabelas-maximas-button tem lógica própria de ícone
        if (btn.classList.contains("tabelas-maximas-button")) {
            const isOpen = content.style.display === "block";
            content.style.display = isOpen ? "none" : "block";
            const icons = btn.querySelectorAll(".accordion-icon");
            icons.forEach(icon => { icon.textContent = isOpen ? "▼" : "▲"; });
            const title = btn.getAttribute("data-title");
            btn.innerHTML = `<span class="accordion-icon">${isOpen ? "▼" : "▲"}</span> ${title} <span class="accordion-icon">${isOpen ? "▼" : "▲"}</span>`;
            // "Ver Máximas" não entra no save — sem chave definida
            return;
        }

        // Botões normais com ▼/▲ no texto
        if (content.style.display === "none" || content.style.display === "") {
            content.style.display = "block";
            btn.textContent = btn.textContent.replace("▼", "▲");
        } else {
            content.style.display = "none";
            btn.textContent = btn.textContent.replace("▲", "▼");
        }

        if (!isTargetAccordion(btn)) return;

        saveAccordionState(btn);

        // Salva os controles do acordeon junto com o toggle
        content.querySelectorAll("select, input[type='checkbox'], input[type='number']")
            .forEach(el => { if (!excludedSelectors.includes(el.id) && el.id) saveSelection(el.id); });
    }

    // ─── Save / Restore — estado aberto/fechado ──────────
    function saveAccordionState(btn) {
        const key = getAccordionKey(btn);
        if (!key) return;
        const isOpen = btn.nextElementSibling?.style.display !== "none";
        localStorage.setItem(pageKey(key), isOpen);
    }

    function restoreAccordionState() {
        document.querySelectorAll(".accordion-button").forEach(btn => {
            // tabelas-maximas-button fica com o default do HTML
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

    // ─── Save / Restore — valores dos controles ──────────
    // Cobre: select | checkbox | input[type=number]
    // Todos os IDs encontrados nos 3 arquivos kiron:
    //
    // SELECTS (todas as páginas):
    //   marketSelector, pointsSelector, averageSelector,
    //   pointsSelectorGolsPlus, averageSelectorGolsPlus,
    //   histomacdMarketSelector, histomacdPointsSelector
    // SELECTS (italy + spain apenas):
    //   mostrarTimes, mostrarHT, mostrarOdds,
    //   seletorHoras, seletorResultado, seletorTipoPlacar
    // CHECKBOXES (todas):
    //   fibonacciToggle, fibonacciToggleGolsPlus,
    //   movingAveragesToggle, linhaAtualToggle,
    //   linhaAtualToggleGolsPlus, rotulosToggleGolsPlus,
    //   histomacdShowRSI
    // NUMBER INPUTS (todas):
    //   histomacdAverageSelector, histomacdMacdFast,
    //   histomacdMacdSlow, histomacdMacdSignal,
    //   histomacdRsiPeriod

    function saveSelection(id) {
        if (!id || excludedSelectors.includes(id)) return;
        const el = document.getElementById(id);
        if (!el) return;
        localStorage.setItem(
            pageKey(id),
            el.type === "checkbox" ? el.checked : el.value
        );
    }

    function restoreSelections() {
        // selects
        document.querySelectorAll("select").forEach(sel => {
            if (!sel.id || excludedSelectors.includes(sel.id)) return;
            const saved = localStorage.getItem(pageKey(sel.id));
            if (saved === null) return;
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

        // number inputs (MACD, RSI, médias)
        document.querySelectorAll("input[type='number']").forEach(inp => {
            if (!inp.id || excludedSelectors.includes(inp.id)) return;
            const saved = localStorage.getItem(pageKey(inp.id));
            if (saved === null) return;
            inp.value = saved;
            inp.dispatchEvent(new Event("change", { bubbles: true }));
            if (inp.onchange) inp.onchange();
        });
    }

    // ─── Setup — listeners automáticos ───────────────────
    function setupSelectors() {
        const allControls = document.querySelectorAll(
            "select, input[type='checkbox'], input[type='number']"
        );

        allControls.forEach(el => {
            if (!el.id || excludedSelectors.includes(el.id)) return;

            const accordionBtn = getParentAccordionBtn(el);
            const inTarget     = accordionBtn && isTargetAccordion(accordionBtn);

            // Ignora controles em acordeons não gerenciados
            if (accordionBtn && !inTarget) return;

            // Selects com redirecionamento: salva antes de navegar
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

    // ─── Save All — snapshot antes de fechar a aba ───────
    function saveAllSelections() {
        document.querySelectorAll(
            "select, input[type='checkbox'], input[type='number']"
        ).forEach(el => {
            if (!el.id || excludedSelectors.includes(el.id)) return;
            const btn      = getParentAccordionBtn(el);
            const inTarget = !btn || isTargetAccordion(btn);
            if (inTarget) saveSelection(el.id);
        });

        document.querySelectorAll(".accordion-button").forEach(btn => {
            saveAccordionState(btn);
        });
    }

    // ─── Clear — limpa localStorage (debug / reset) ──────
    function clearSavedData() {
        document.querySelectorAll(
            "select, input[type='checkbox'], input[type='number']"
        ).forEach(el => {
            if (el.id && !excludedSelectors.includes(el.id))
                localStorage.removeItem(pageKey(el.id));
        });
        Object.values(ACCORDION_KEYS).forEach(key =>
            localStorage.removeItem(pageKey(key))
        );
    }

    // ─── Init ─────────────────────────────────────────────
    window.addEventListener("DOMContentLoaded", () => {
        restoreAccordionState();
        setTimeout(() => {
            restoreSelections();
            setupSelectors();
        }, 100);
    });

    window.addEventListener("beforeunload", saveAllSelections);

} // fim do bloco condicional — só roda nas páginas kiron