// ═══════════════════════════════════════════════════════
//  SELETORES EXCLUÍDOS DO SAVE
// ═══════════════════════════════════════════════════════
const excludedSelectors = ["ligas", "avancado-betano", "ligas365", "avancado-bet365", "redes"];

// ═══════════════════════════════════════════════════════
//  CONTROLO DO GRÁFICO (LABELS) - PERSISTÊNCIA
// ═══════════════════════════════════════════════════════
// Esta variável deve ser global para o seu script de gráfico ler
window.statsChartVisibleDatasets = JSON.parse(localStorage.getItem("chart_labels_state")) || {
    'Gols FT': false, 'Casa Vence': false, 'Empate': false, 'Fora Vence': false,
    'Ambas Sim': true, 'Ambas Não': false, 'Over 1.5': false, 'Over 2.5': false,
    'Over 3.5': false, 'Under 1.5': false, 'Under 2.5': false, 'Under 3.5': false,
    '0 Gol Exato': false, '1 Gol Exato': false, '2 Gols Exatos': false,
    '3 Gols Exatos': false, '4 Gols Exatos': false, '5 Gols Exatos': false,
    '0x0': false, '1x0': false, '2x0': false, '3x0': false,
    '2x1': false, '3x1': false, '3x2': false, '4x0': false, '4x1': false
};

// Função para salvar o estado toda vez que um label for clicado
function saveChartLabels() {
    localStorage.setItem("chart_labels_state", JSON.stringify(window.statsChartVisibleDatasets));
}

// ═══════════════════════════════════════════════════════
//  ACORDEONS GERENCIADOS
// ═══════════════════════════════════════════════════════
const ACCORDION_KEYS = {
    "Gráfico Gols":      "accordion_grafico_gols",
    "Gráfico MACD/RSI":  "accordion_grafico_macd",
    "Gráfico Mercados": "accordion_grafico_mercados",
    "Tendência Gols":   "accordion_tendencia_gols" // Adicionei este baseada no seu print
};

function getAccordionKey(btn) {
    const text = btn.textContent || "";
    for (const [label, key] of Object.entries(ACCORDION_KEYS)) {
        if (text.includes(label)) return key;
    }
    return null;
}

function isTargetAccordion(btn) { return getAccordionKey(btn) !== null; }
function getParentAccordionBtn(el) { return el.closest(".accordion-content")?.previousElementSibling ?? null; }

// ═══════════════════════════════════════════════════════
//  TOGGLE / SAVE / RESTORE
// ═══════════════════════════════════════════════════════

function toggleAccordion(btn) {
    const content = btn.nextElementSibling;
    const isHidden = content.style.display === "none" || content.style.display === "";
    
    content.style.display = isHidden ? "block" : "none";
    btn.textContent = isHidden ? btn.textContent.replace("▼", "▲") : btn.textContent.replace("▲", "▼");

    if (isTargetAccordion(btn)) saveAccordionState(btn);
}

function saveAccordionState(btn) {
    const key = getAccordionKey(btn);
    if (key) localStorage.setItem(key, btn.nextElementSibling?.style.display !== "none");
}

function restoreAccordionState() {
    document.querySelectorAll(".accordion-button").forEach(btn => {
        const key = getAccordionKey(btn);
        const saved = localStorage.getItem(key);
        if (key && saved !== null) {
            const content = btn.nextElementSibling;
            const isOpen = saved === "true";
            content.style.display = isOpen ? "block" : "none";
            btn.textContent = isOpen ? btn.textContent.replace("▼", "▲") : btn.textContent.replace("▲", "▼");
        }
    });
}

function saveSelection(id) {
    const el = document.getElementById(id);
    if (!el || excludedSelectors.includes(id)) return;
    localStorage.setItem(id, el.type === "checkbox" ? el.checked : el.value);
}

function restoreSelections() {
    const elements = document.querySelectorAll("select, input[type='checkbox'], input[type='number']");
    elements.forEach(el => {
        if (excludedSelectors.includes(el.id)) return;
        const saved = localStorage.getItem(el.id);
        if (saved !== null) {
            if (el.type === "checkbox") el.checked = saved === "true";
            else el.value = saved;
            el.dispatchEvent(new Event("change", { bubbles: true }));
        }
    });
}

// ═══════════════════════════════════════════════════════
//  SETUP & INIT
// ═══════════════════════════════════════════════════════
function setupSelectors() {
    document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
        if (excludedSelectors.includes(el.id)) return;
        
        el.addEventListener("change", () => {
            saveSelection(el.id);
            const btn = getParentAccordionBtn(el);
            if (btn && isTargetAccordion(btn)) saveAccordionState(btn);
        });
    });
}

window.addEventListener("DOMContentLoaded", () => {
    restoreAccordionState();
    setTimeout(() => {
        restoreSelections();
        setupSelectors();
    }, 100);
});

// IMPORTANTE: Salva tudo ao sair
window.addEventListener("beforeunload", () => {
    // Salva estados dos acordeões
    document.querySelectorAll(".accordion-button").forEach(btn => {
        if (isTargetAccordion(btn)) saveAccordionState(btn);
    });
    // Salva o estado atual dos labels do gráfico
    saveChartLabels();
});