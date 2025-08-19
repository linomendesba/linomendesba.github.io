// Lista de seletores que não devem ser salvos
const excludedSelectors = [
  "ligas",
  "avancado-betano",
  "ligas365",
  "avancado-bet365",
  "redes"
];

// Salva o estado do acordeão
function saveAccordionState(buttonElement) {
  const accordionContent = buttonElement.nextElementSibling;
  const isOpen = accordionContent && accordionContent.style.display !== "none";
  
  // Criamos um ID único para o acordeão baseado no texto do botão
  const accordionId = buttonElement.textContent.trim().replace(/[▼▲\s]/g, '').toLowerCase();
  localStorage.setItem(`accordion_${accordionId}`, isOpen);
}

// Restaura o estado do acordeão
function restoreAccordionState() {
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    const accordionId = button.textContent.trim().replace(/[▼▲\s]/g, '').toLowerCase();
    const savedState = localStorage.getItem(`accordion_${accordionId}`);
    
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
  });
}

// Função melhorada para toggle do acordeão que salva o estado
function toggleAccordion(buttonElement) {
  const accordionContent = buttonElement.nextElementSibling;
  
  if (accordionContent.style.display === "none" || accordionContent.style.display === "") {
    accordionContent.style.display = "block";
    buttonElement.textContent = buttonElement.textContent.replace('▼', '▲');
  } else {
    accordionContent.style.display = "none";
    buttonElement.textContent = buttonElement.textContent.replace('▲', '▼');
  }
  
  // Salva o estado após a mudança
  saveAccordionState(buttonElement);
  
  // Salva também os seletores dentro do acordeão
  const selectorsInAccordion = accordionContent.querySelectorAll('select, input[type="checkbox"]');
  selectorsInAccordion.forEach(element => {
    if (!excludedSelectors.includes(element.id)) {
      saveSelection(element.id);
    }
  });
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

// Restaura as seleções do LocalStorage, exceto para os seletores excluídos
function restoreSelections() {
  // Restaura selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      const savedValue = localStorage.getItem(selector.id);
      if (savedValue) {
        selector.value = savedValue;
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
      }
    }
  });
}

// Adiciona eventos onchange para salvar automaticamente as alterações
function setupSelectors() {
  // Setup para selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    // Verificamos se o seletor já tem um manipulador onclick que poderia redirecionar
    const hasRedirectHandler = selector.hasAttribute("onclick") &&
                               selector.getAttribute("onclick").includes("redirecionar");
        
    if (hasRedirectHandler) {
      // Para seletores com redirecionamento, adicionamos um evento que salva antes do redirecionamento
      const originalOnclick = selector.getAttribute("onclick");
            
      // Substituímos o manipulador onclick para primeiro salvar e depois redirecionar
      selector.setAttribute("onclick", `saveSelection('${selector.id}'); ${originalOnclick}`);
    } else {
      // Para seletores sem redirecionamento, adicionamos o evento change normal
      selector.addEventListener("change", () => {
        saveSelection(selector.id);
        
        // Se o seletor estiver dentro de um acordeão, também salva o estado do acordeão
        const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
        if (accordionButton && accordionButton.classList.contains('accordion-button')) {
          saveAccordionState(accordionButton);
        }
      });
    }
  });
  
  // Setup para checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      saveSelection(checkbox.id);
      
      // Se o checkbox estiver dentro de um acordeão, também salva o estado do acordeão
      const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
      if (accordionButton && accordionButton.classList.contains('accordion-button')) {
        saveAccordionState(accordionButton);
      }
    });
  });
}

// Função auxiliar para usar no evento beforeunload
function saveAllSelections() {
  // Salva selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      saveSelection(selector.id);
    }
  });
  
  // Salva checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (!excludedSelectors.includes(checkbox.id)) {
      saveSelection(checkbox.id);
    }
  });
  
  // Salva também todos os estados dos acordeões
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    saveAccordionState(button);
  });
}

// Função para limpar dados salvos (útil para debug/reset)
function clearSavedData() {
  // Remove selects salvos
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      localStorage.removeItem(selector.id);
    }
  });
  
  // Remove checkboxes salvos
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (!excludedSelectors.includes(checkbox.id)) {
      localStorage.removeItem(checkbox.id);
    }
  });
  
  // Remove estados de acordeões salvos
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    const accordionId = button.textContent.trim().replace(/[▼▲\s]/g, '').toLowerCase();
    localStorage.removeItem(`accordion_${accordionId}`);
  });
}

// Inicializa o script ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  restoreSelections();
  restoreAccordionState();
  setupSelectors();
});

// Tentativa adicional de salvar seleções antes de redirecionar
window.addEventListener("beforeunload", () => {
  saveAllSelections();
});