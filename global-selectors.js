// 1. Identificação da Página Atual
const currentPage = window.location.pathname.split('/').pop() || "index.html";

// 2. Configuração dos Labels do Gráfico (Estado Inicial)
window.statsChartVisibleDatasets = JSON.parse(localStorage.getItem(`chart_labels_${currentPage}`)) || {
    'Gols FT': false, 'Casa Vence': false, 'Empate': false, 'Fora Vence': false,
    'Ambas Sim': true, 'Ambas Não': false, 'Over 1.5': false, 'Over 2.5': false,
    'Over 3.5': false, 'Under 1.5': false, 'Under 2.5': false, 'Under 3.5': false,
    '0 Gol Exato': false, '1 Gol Exato': false, '2 Gols Exatos': false,
    '3 Gols Exatos': false, '4 Gols Exatos': false, '5 Gols Exatos': false,
    '0x0': false, '1x0': false, '2x0': false, '3x0': false,
    '2x1': false, '3x1': false, '3x2': false, '4x0': false, '4x1': false
};

// 3. Seletores que NÃO devem ser salvos (conforme sua lista)
const excludedSelectors = ["ligas", "avancado-betano", "ligas365", "avancado-bet365", "redes"];

// 4. Mapeamento dos Acordeões (conforme os IDs e textos do seu HTML)
const ACCORDION_KEYS = {
    "Gráfico Gols": "accordion_gols",
    "MACD/RSI": "accordion_macd",
    "Tendência Gols": "accordion_tendencia",
    "Mercados": "accordion_mercados"
};

// --- Funções de Apoio ---

function getAccordionKey(btn) {
    const text = btn.textContent || "";
    for (const [label, key] of Object.entries(ACCORDION_KEYS)) {
        if (text.includes(label)) return `${currentPage}_${key}`;
    }
    return null;
}

function saveSelection(id) {
    const el = document.getElementById(id);
    if (!el || excludedSelectors.includes(id)) return;
    const val = el.type === "checkbox" ? el.checked : el.value;
    localStorage.setItem(`${currentPage}_${id}`, val);
}

// --- Funções Principais ---

function toggleAccordion(btn) {
    const content = btn.nextElementSibling;
    const isOpening = content.style.display === "none" || content.style.display === "";
    
    content.style.display = isOpening ? "block" : "none";
    btn.textContent = isOpening ? btn.textContent.replace("▼", "▲") : btn.textContent.replace("▲", "▼");

    const key = getAccordionKey(btn);
    if (key) localStorage.setItem(key, isOpening);
}

function restoreAll() {
    // Restaurar Acordeões
    document.querySelectorAll(".accordion-button").forEach(btn => {
        const key = getAccordionKey(btn);
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            const isOpen = saved === "true";
            btn.nextElementSibling.style.display = isOpen ? "block" : "none";
            btn.textContent = isOpen ? btn.textContent.replace("▼", "▲") : btn.textContent.replace("▲", "▼");
        }
    });

    // Restaurar Selects, Checkboxes e Numbers
    document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
        if (excludedSelectors.includes(el.id)) return;
        const saved = localStorage.getItem(`${currentPage}_${el.id}`);
        if (saved !== null) {
            if (el.type === "checkbox") el.checked = saved === "true";
            else el.value = saved;
            el.dispatchEvent(new Event('change')); // Avisa o gráfico para atualizar
        }
    });
}

// Função para o seu código de gráfico chamar quando clicar num Label
window.saveChartLabelsState = function() {
    localStorage.setItem(`chart_labels_${currentPage}`, JSON.stringify(window.statsChartVisibleDatasets));
};

// --- Inicialização ---

window.addEventListener("DOMContentLoaded", () => {
    restoreAll();
    
    // Configurar ouvintes para salvar automaticamente
    document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
        if (excludedSelectors.includes(el.id)) return;
        el.addEventListener("change", () => saveSelection(el.id));
    });
});

// Salvar tudo ao sair da página
window.addEventListener("beforeunload", () => {
    window.saveChartLabelsState();
});