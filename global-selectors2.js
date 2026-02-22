// ═══════════════════════════════════════════════════════
//  KIRON SAVE SELECT
//  Melhorias aplicadas:
//  1. restoreSelections sem dispatchEvent (silencioso)
//  2. Debounce nos input[type=number]
//  3. toggleAccordion via patch — não redeclara a função nativa
//  4. Validação de valor antes de aplicar no select
//  5. clearSavedData exposta globalmente (window)
//  6. beforeunload substituído por blur nos number inputs
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
    // "Ver Máximas" tem style="display:none" fixo — não incluído.
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

    function pageKey(id) {
        return `${currentPage}_${id}`;
    }

    // ─── MELHORIA 2: Debounce ────────────────────────────
    function debounce(fn, delay = 400) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
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

    function saveSelection(id) {
        if (!id || excludedSelectors.includes(id)) return;
        const el = document.getElementById(id);
        if (!el) return;
        localStorage.setItem(
            pageKey(id),
            el.type === "checkbox" ? el.checked : el.value
        );
    }

    // MELHORIA 1: restaura silenciosamente — sem dispatchEvent
    // Os gráficos são inicializados pelos seus próprios scripts
    // depois do DOMContentLoaded; não precisamos re-acionar change.
    // Exceção: selects fora de acordeon (ex: marketSelector do Ranking)
    // que precisam do change para renderizar a tabela inicial.
    function restoreSelections() {
        // selects
        document.querySelectorAll("select").forEach(sel => {
            if (!sel.id || excludedSelectors.includes(sel.id)) return;
            const saved = localStorage.getItem(pageKey(sel.id));
            if (saved === null) return;

            // MELHORIA 4: valida se o valor existe como option antes de aplicar
            const optionExists = Array.from(sel.options).some(o => o.value === saved);
            if (!optionExists) return;

            sel.value = saved;

            // Selects fora de acordeon precisam disparar change para
            // acionar renderizações iniciais (ex: ranking, agenda)
            const accordionBtn = getParentAccordionBtn(sel);
            if (!accordionBtn) {
                sel.dispatchEvent(new Event("change", { bubbles: true }));
                if (sel.onchange) sel.onchange();
            }
        });

        // checkboxes — restaura valor silenciosamente
        // (os toggles de gráfico são aplicados no init de cada chart)
        document.querySelectorAll("input[type='checkbox']").forEach(cb => {
            if (!cb.id || excludedSelectors.includes(cb.id)) return;
            const saved = localStorage.getItem(pageKey(cb.id));
            if (saved === null) return;
            cb.checked = saved === "true";
            // Dispara change para que o gráfico aplique o estado salvo
            cb.dispatchEvent(new Event("change", { bubbles: true }));
            if (cb.onchange) cb.onchange();
        });

        // number inputs — restaura valor silenciosamente
        document.querySelectorAll("input[type='number']").forEach(inp => {
            if (!inp.id || excludedSelectors.includes(inp.id)) return;
            const saved = localStorage.getItem(pageKey(inp.id));
            if (saved === null) return;
            inp.value = saved;
            // Não dispara change — o gráfico MACD lê os valores
            // diretamente dos inputs no momento do render
        });
    }

    // ─── MELHORIA 3: Patch no toggleAccordion ────────────
    // Em vez de redeclarar, envolve a função nativa existente
    // para adicionar o save sem conflito.
    function patchToggleAccordion() {
        const native = window.toggleAccordion;

        window.toggleAccordion = function(btn) {
            // Chama a implementação nativa que já existe no HTML
            if (typeof native === "function") native(btn);

            // Adiciona o save por cima, apenas para acordeons gerenciados
            if (!isTargetAccordion(btn)) return;

            saveAccordionState(btn);

            const content = btn.nextElementSibling;
            if (!content) return;
            content.querySelectorAll("select, input[type='checkbox'], input[type='number']")
                .forEach(el => { if (el.id && !excludedSelectors.includes(el.id)) saveSelection(el.id); });
        };
    }

    // ─── Setup — listeners automáticos ───────────────────
    function setupSelectors() {
        document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
            if (!el.id || excludedSelectors.includes(el.id)) return;

            const accordionBtn = getParentAccordionBtn(el);
            const inTarget     = accordionBtn && isTargetAccordion(accordionBtn);

            if (accordionBtn && !inTarget) return;

            // Selects com redirecionamento
            if (
                el.tagName === "SELECT" &&
                el.hasAttribute("onclick") &&
                el.getAttribute("onclick").includes("redirecionar")
            ) {
                const orig = el.getAttribute("onclick");
                el.setAttribute("onclick", `saveSelection('${el.id}'); ${orig}`);
                return;
            }

            // MELHORIA 6: number inputs usam blur + debounce
            // em vez de depender do beforeunload
            if (el.type === "number") {
                el.addEventListener("blur", () => saveSelection(el.id));
                el.addEventListener("change", debounce(() => {
                    saveSelection(el.id);
                    if (inTarget) saveAccordionState(accordionBtn);
                }, 400));
                return;
            }

            // Todos os outros (select, checkbox)
            el.addEventListener("change", () => {
                saveSelection(el.id);
                if (inTarget) saveAccordionState(accordionBtn);
            });
        });
    }

    // ─── MELHORIA 5: clearSavedData exposta globalmente ──
    window.clearKironSavedData = function() {
        document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
            if (el.id && !excludedSelectors.includes(el.id))
                localStorage.removeItem(pageKey(el.id));
        });
        Object.values(ACCORDION_KEYS).forEach(key =>
            localStorage.removeItem(pageKey(key))
        );
        console.log(`[kiron save] Dados de "${currentPage}" limpos do localStorage.`);
    };

    // ─── Init ─────────────────────────────────────────────
    window.addEventListener("DOMContentLoaded", () => {
        restoreAccordionState();

        // Patch feito após DOMContentLoaded para garantir que
        // a função nativa do HTML já foi declarada
        setTimeout(() => {
            patchToggleAccordion();
            restoreSelections();
            setupSelectors();
        }, 100);
    });

    // MELHORIA 6: beforeunload removido — cada controle salva
    // no próprio evento (change / blur). Não há mais risco de
    // perder dados ao fechar a aba.

} // fim do bloco condicional — só roda nas páginas kiron