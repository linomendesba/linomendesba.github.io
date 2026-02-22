// 1. Configuração inicial dos Labels (O que você quer que salve)
// Ele tenta buscar do navegador, se não existir, usa esse padrão abaixo
window.statsChartVisibleDatasets = JSON.parse(localStorage.getItem('meus_labels_grafico')) || {
    'Gols FT': false, 'Casa Vence': false, 'Empate': false, 'Fora Vence': false,
    'Ambas Sim': true, 'Ambas Não': false, 'Over 1.5': false, 'Over 2.5': false,
    'Over 3.5': false, 'Under 1.5': false, 'Under 2.5': false, 'Under 3.5': false,
    '0 Gol Exato': false, '1 Gol Exato': false, '2 Gols Exatos': false,
    '3 Gols Exatos': false, '4 Gols Exatos': false, '5 Gols Exatos': false,
    '0x0': false, '1x0': false, '2x0': false, '3x0': false,
    '2x1': false, '3x1': false, '3x2': false, '4x0': false, '4x1': false
};

// 2. Seletores que não salvam
const excludedSelectors = ["ligas", "avancado-betano", "ligas365", "avancado-bet365", "redes"];

// --- FUNÇÃO SIMPLES DE SALVAR ---
function salvarTudo() {
    // Salva os Labels do Gráfico
    localStorage.setItem('meus_labels_grafico', JSON.stringify(window.statsChartVisibleDatasets));

    // Salva todos os Selects e Checkboxes pelo ID
    document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
        if (el.id && !excludedSelectors.includes(el.id)) {
            const valor = el.type === 'checkbox' ? el.checked : el.value;
            localStorage.setItem('save_' + el.id, valor);
        }
    });

    // Salva quais acordeões estão abertos
    document.querySelectorAll(".accordion-button").forEach((btn, index) => {
        const isOpen = btn.nextElementSibling.style.display === "block";
        localStorage.setItem('acc_' + index, isOpen);
    });
}

// --- FUNÇÃO SIMPLES DE CARREGAR ---
function carregarTudo() {
    // Restaurar Acordeões pelo índice (posição deles na tela)
    document.querySelectorAll(".accordion-button").forEach((btn, index) => {
        const saved = localStorage.getItem('acc_' + index);
        if (saved !== null) {
            const isOpen = saved === "true";
            btn.nextElementSibling.style.display = isOpen ? "block" : "none";
            btn.textContent = isOpen ? btn.textContent.replace("▼", "▲") : btn.textContent.replace("▲", "▼");
        }
    });

    // Restaurar Selects e Checkboxes
    document.querySelectorAll("select, input[type='checkbox'], input[type='number']").forEach(el => {
        const saved = localStorage.getItem('save_' + el.id);
        if (saved !== null && !excludedSelectors.includes(el.id)) {
            if (el.type === 'checkbox') el.checked = saved === "true";
            else el.value = saved;
            
            // Força o gráfico a entender que o valor mudou
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

// --- EVENTOS ---

// Quando clicar em qualquer coisa, salva
document.addEventListener('change', (e) => {
    if (e.target.closest('select, input')) salvarTudo();
});

// Quando clicar no botão do acordeão, salva
document.querySelectorAll('.accordion-button').forEach(btn => {
    btn.addEventListener('click', () => {
        // Pequeno delay para esperar a animação do seu toggle original
        setTimeout(salvarTudo, 100);
    });
});

// Inicia ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
    carregarTudo();
});

// Salva ao fechar ou mudar de página
window.addEventListener("beforeunload", salvarTudo);