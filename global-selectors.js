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
//  Chave localStorage ← trecho do texto do botão
//  Ajuste aqui se renomear algum acordeon
// ═══════════════════════════════════════════════════════
const ACCORDION_KEYS = {
    "Gráfico Gols":      "accordion_grafico_gols",
    "Gráfico MACD/RSI":  "accordion_grafico_macd",
    "Gráfico Mercados": "accordion_grafico_mercados"
};

// ─── helpers ───────────────────────────────────────────
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

// Retorna o botão-acordeon pai de um elemento (ou null)
function getParentAccordionBtn(el) {
    return el.closest(".accordion-content")?.previousElementSibling ?? null;
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

    // Persiste todos os controles do acordeon ao abrir/fechar
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
//  Suporta: select | checkbox | number input
// ═══════════════════════════════════════════════════════
function saveSelection(id) {
    const el = document.getElementById(id);
    if (!el || excludedSelectors.includes(id) || !id) return;

    if (el.type === "checkbox") {
        localStorage.setItem(id, el.checked);
    } else {
        // select e input[type=number] tratados igual
        localStorage.setItem(id, el.value);
    }
}

function restoreSelections() {
    // selects
    document.querySelectorAll("select").forEach(sel => {
        if (excludedSelectors.includes(sel.id)) return;
        const saved = localStorage.getItem(sel.id);
        if (saved === null) return;
        sel.value = saved;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        if (sel.onchange) sel.onchange();
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

// ═══════════════════════════════════════════════════════
//  SETUP — listeners automáticos em todos os controles
//  dos 3 acordeons alvo
// ═══════════════════════════════════════════════════════
function setupSelectors() {
    const selector = "select, input[type='checkbox'], input[type='number']";

    document.querySelectorAll(selector).forEach(el => {
        if (excludedSelectors.includes(el.id)) return;

        const accordionBtn = getParentAccordionBtn(el);
        const inTarget     = accordionBtn && isTargetAccordion(accordionBtn);

        // Ignora controles que estão em acordeons NÃO gerenciados
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

        // Evento padrão para todos os outros controles
        el.addEventListener("change", () => {
            saveSelection(el.id);
            if (inTarget) saveAccordionState(accordionBtn);
        });
    });
}

// ═══════════════════════════════════════════════════════
//  SAVE ALL — snapshot completo antes de fechar a aba
// ═══════════════════════════════════════════════════════
function saveAllSelections() {
    const selector = "select, input[type='checkbox'], input[type='number']";

    document.querySelectorAll(selector).forEach(el => {
        if (excludedSelectors.includes(el.id) || !el.id) return;
        const btn      = getParentAccordionBtn(el);
        const inTarget = !btn || isTargetAccordion(btn);
        if (inTarget) saveSelection(el.id);
    });

    document.querySelectorAll(".accordion-button").forEach(btn => {
        saveAccordionState(btn); // salva apenas os que têm chave definida
    });
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

window.addEventListener("beforeunload", saveAllSelections);