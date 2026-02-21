// ─── Páginas onde o script deve funcionar ───────────────
const allowedPages = [
    "kironengland.html",
    "kironitaly.html",
    "kironspain.html"
];

const currentPage = window.location.pathname.split('/').pop();

if (allowedPages.includes(currentPage)) {

    // ─── Seletores excluídos do save ────────────────────
    const excludedSelectors = [
        "ligas",
        "avancado-betano",
        "ligas365",
        "avancado-bet365",
        "redes"
    ];

    // ─── Acordeons gerenciados ───────────────────────────
    // Ajuste os nomes aqui se renomear algum botão
    const ACCORDION_KEYS = {
        "Gráfico Gols":      "accordion_grafico_gols",
        "Gráfico MACD/RSI":  "accordion_grafico_macd",
        "Gráfico Mercardos": "accordion_grafico_mercados"
    };

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

    // ─── Chave com prefixo de página ────────────────────
    function pageKey(id) {
        return `${currentPage}_${id}`;
    }

    // ─── Toggle ─────────────────────────────────────────
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

    // ─── Save / Restore — estado aberto/fechado ─────────
    function saveAccordionState(btn) {
        const key = getAccordionKey(btn);
        if (!key) return;
        const isOpen = btn.nextElementSibling?.style.display !== "none";
        localStorage.setItem(`${currentPage}_${key}`, isOpen);
    }

    function restoreAccordionState() {
        document.querySelectorAll(".accordion-button").forEach(btn => {
            const key = getAccordionKey(btn);
            if (!key) return;

            const saved = localStorage.getItem(`${currentPage}_${key}`);
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

    // ─── Save / Restore — valores de controles ──────────
    // Suporta: select | checkbox | input[type=number]
    function saveSelection(id) {
        const el = document.getElementById(id);
        if (!el || excludedSelectors.includes(id) || !id) return;
        localStorage.setItem(
            pageKey(id),
            el.type === "checkbox" ? el.checked : el.value
        );
    }

    function restoreSelections() {
        // selects
        document.querySelectorAll("select").forEach(sel => {
            if (excludedSelectors.includes(sel.id)) return;
            const saved = localStorage.getItem(pageKey(sel.id));
            if (saved === null) return;
            sel.value = saved;
            sel.dispatchEvent(new Event("change", { bubbles: true }));
            if (sel.onchange) sel.onchange();
        });

        // checkboxes
        document.querySelectorAll("input[type='checkbox']").forEach(cb => {
            if (excludedSelectors.includes(cb.id)) return;
            const saved = localStorage.getItem(pageKey(cb.id));
            if (saved === null) return;
            cb.checked = saved === "true";
            cb.dispatchEvent(new Event("change", { bubbles: true }));
            if (cb.onchange) cb.onchange();
        });

        // number inputs (MACD, RSI, etc.)
        document.querySelectorAll("input[type='number']").forEach(inp => {
            if (excludedSelectors.includes(inp.id)) return;
            const saved = localStorage.getItem(pageKey(inp.id));
            if (saved === null) return;
            inp.value = saved;
            inp.dispatchEvent(new Event("change", { bubbles: true }));
            if (inp.onchange) inp.onchange();
        });
    }

    // ─── Setup — listeners automáticos ──────────────────
    function setupSelectors() {
        const selector = "select, input[type='checkbox'], input[type='number']";

        document.querySelectorAll(selector).forEach(el => {
            if (excludedSelectors.includes(el.id)) return;

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

    // ─── Save All — snapshot antes de fechar ────────────
    function saveAllSelections() {
        const selector = "select, input[type='checkbox'], input[type='number']";

        document.querySelectorAll(selector).forEach(el => {
            if (excludedSelectors.includes(el.id) || !el.id) return;
            const btn      = getParentAccordionBtn(el);
            const inTarget = !btn || isTargetAccordion(btn);
            if (inTarget) saveSelection(el.id);
        });

        document.querySelectorAll(".accordion-button").forEach(btn => {
            saveAccordionState(btn);
        });
    }

    // ─── Init ────────────────────────────────────────────
    window.addEventListener("DOMContentLoaded", () => {
        restoreAccordionState();
        setTimeout(() => {
            restoreSelections();
            setupSelectors();
        }, 100);
    });

    window.addEventListener("beforeunload", saveAllSelections);

} // fim do bloco condicional