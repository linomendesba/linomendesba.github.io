// ========================================================================
// SCRIPT 2: FILTROS E ACORDEÃO (Versão Completa e Corrigida)
// ========================================================================

// Lista de seletores que não devem ser salvos
const excludedSelectors = [
  "ligas",
  "avancado-betano",
  "ligas365",
  "avancado-bet365",
  "redes"
];

// Verifica se é o acordeão específico que deve ser salvo
function isTargetAccordion(buttonElement) {
  return buttonElement.textContent.includes("Tendência Gols / Mercados");
}

// Salva o estado do acordeão (apenas para o acordeão específico)
function saveAccordionState(buttonElement) {
  if (!isTargetAccordion(buttonElement)) return;

  const accordionContent = buttonElement.nextElementSibling;
  const isOpen = accordionContent && accordionContent.style.display !== "none";

  localStorage.setItem('accordion_tendencia_gols_mercados', isOpen);
}

// Restaura o estado do acordeão (apenas para o acordeão específico)
function restoreAccordionState() {
  const accordionButtons = document.querySelectorAll('.accordion-button');

  accordionButtons.forEach(button => {
    if (isTargetAccordion(button)) {
      const savedState = localStorage.getItem('accordion_tendencia_gols_mercados');

      if (savedState !== null) {
        const isOpen = savedState === 'true';
        const accordionContent = button.nextElementSibling;

        if (accordionContent) {
          if (isOpen) {
            accordionContent.style.display = "block";
            button.textContent = button.textContent.replace('▼', '▲');
          } else {
            accordionContent.style.display = "none";
            button.textContent = button.textContent.replace('▲', '▼');
          }
        }
      }
    }
  });
}

// Função melhorada para toggle do acordeão que salva o estado (apenas para o acordeão específico)
function toggleAccordion(buttonElement) {
  const accordionContent = buttonElement.nextElementSibling;

  if (accordionContent.style.display === "none" || accordionContent.style.display === "") {
    accordionContent.style.display = "block";
    buttonElement.textContent = buttonElement.textContent.replace('▼', '▲');
  } else {
    accordionContent.style.display = "none";
    buttonElement.textContent = buttonElement.textContent.replace('▲', '▼');
  }

  // Salva o estado apenas se for o acordeão específico
  if (isTargetAccordion(buttonElement)) {
    saveAccordionState(buttonElement);

    // Salva também os seletores dentro do acordeão específico
    const selectorsInAccordion = accordionContent.querySelectorAll('select, input[type="checkbox"]');
    selectorsInAccordion.forEach(element => {
      if (!excludedSelectors.includes(element.id)) {
        saveSelection(element.id);
      }
    });
  }
}

// Salva a seleção no LocalStorage, exceto para os seletores excluídos
function saveSelection(elementId) {
  const element = document.getElementById(elementId);
  if (element && !excludedSelectors.includes(elementId)) {
    if (element.type === 'checkbox') {
      localStorage.setItem(elementId, element.checked);
    } else {
      localStorage.setItem(elementId, element.value);
    }
  }
}

// **MUDANÇA APLICADA AQUI**
// Restaura as seleções do LocalStorage, mas sem disparar o evento 'change' para não causar o conflito.
function restoreSelections() {
  // Restaura selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      const savedValue = localStorage.getItem(selector.id);
      if (savedValue) {
        selector.value = savedValue;
        
        // As linhas abaixo que disparavam o evento 'change' foram removidas para evitar o conflito.
      }
    }
  });

  // Restaura checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (!excludedSelectors.includes(checkbox.id)) {
      const savedValue = localStorage.getItem(checkbox.id);
      if (savedValue !== null) {
        checkbox.checked = savedValue === 'true';
        
        // As linhas abaixo que disparavam o evento 'change' foram removidas para evitar o conflito.
      }
    }
  });
}

// Adiciona eventos onchange para salvar automaticamente as alterações
function setupSelectors() {
  // Setup para selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);

    if (isInTargetAccordion || !accordionButton) {
      const hasRedirectHandler = selector.hasAttribute("onclick") &&
        selector.getAttribute("onclick").includes("redirecionar");

      if (hasRedirectHandler) {
        const originalOnclick = selector.getAttribute("onclick");
        selector.setAttribute("onclick", `saveSelection('${selector.id}'); ${originalOnclick}`);
      } else {
        selector.addEventListener("change", () => {
          saveSelection(selector.id);
          if (isInTargetAccordion) {
            saveAccordionState(accordionButton);
          }
        });
      }
    }
  });

  // Setup para checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);

    if (isInTargetAccordion || !accordionButton) {
      checkbox.addEventListener("change", () => {
        saveSelection(checkbox.id);
        if (isInTargetAccordion) {
          saveAccordionState(accordionButton);
        }
      });
    }
  });
}

// Função auxiliar para usar no evento beforeunload
function saveAllSelections() {
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    if (!excludedSelectors.includes(selector.id) && (isInTargetAccordion || !accordionButton)) {
      saveSelection(selector.id);
    }
  });

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    if (!excludedSelectors.includes(checkbox.id) && (isInTargetAccordion || !accordionButton)) {
      saveSelection(checkbox.id);
    }
  });

  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    if (isTargetAccordion(button)) {
      saveAccordionState(button);
    }
  });
}

// Função para limpar dados salvos
function clearSavedData() {
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    if (!excludedSelectors.includes(selector.id) && (isInTargetAccordion || !accordionButton)) {
      localStorage.removeItem(selector.id);
    }
  });

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    if (!excludedSelectors.includes(checkbox.id) && (isInTargetAccordion || !accordionButton)) {
      localStorage.removeItem(checkbox.id);
    }
  });

  localStorage.removeItem('accordion_tendencia_gols_mercados');
}

// **MUDANÇA APLICADA AQUI**
// Inicializa o script ao carregar a página de forma controlada.
window.addEventListener("DOMContentLoaded", () => {
  restoreAccordionState();

  // Pequeno delay para garantir que todos os elementos estejam prontos
  setTimeout(() => {
    // 1. Restaura os valores dos filtros sem disparar eventos
    restoreSelections();

    // 2. Adiciona os listeners para salvar futuras alterações nos filtros
    setupSelectors();

    // 3. Avisa ao script da tabela que a inicialização acabou
    // (A variável 'isInitializing' deve existir no script da tabela)
    if (typeof isInitializing !== 'undefined') {
        isInitializing = false;
    }

    // 4. Manda o script da tabela carregar os dados pela primeira vez
    if (typeof buscarDados === 'function') {
        buscarDados();
        setInterval(buscarDados, 5000); // Inicia o auto-refresh aqui
    }

  }, 100);
});

// Tentativa adicional de salvar seleções antes de redirecionar
window.addEventListener("beforeunload", () => {
  saveAllSelections();
});