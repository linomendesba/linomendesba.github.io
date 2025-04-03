// Salva a seleção no LocalStorage
function saveSelection(selectorId) {
    const selector = document.getElementById(selectorId);
    if (selector) {
        const selectedValue = selector.value;
        localStorage.setItem(selectorId, selectedValue);
    }
}

// Restaura as seleções do LocalStorage
function restoreSelections() {
    const selectors = document.querySelectorAll("select");
    selectors.forEach(selector => {
        const savedValue = localStorage.getItem(selector.id);
        if (savedValue) {
            selector.value = savedValue;
        }
    });
}

// Adiciona eventos onchange para salvar automaticamente as alterações
function setupSelectors() {
    const selectors = document.querySelectorAll("select");
    selectors.forEach(selector => {
        selector.addEventListener("change", () => saveSelection(selector.id));
    });
}

// Inicializa o script ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
    restoreSelections();
    setupSelectors();
});