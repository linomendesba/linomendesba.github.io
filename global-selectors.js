// ---> NOVO: Lista de páginas onde o script deve funcionar
const allowedPages = [
  "kironengland.html",
  "kironitaly.html",
  "kironspain.html"
];

// ---> NOVO: Pega o nome do arquivo da URL atual
const currentPage = window.location.pathname.split('/').pop();

// ---> NOVO: Executa todo o código somente se a página atual estiver na lista de permitidas
if (allowedPages.includes(currentPage)) {

  // ==========================================
  // INÍCIO DA LÓGICA DO GRÁFICO (NOVO)
  // ==========================================
  
  // Objeto global de controle do gráfico
  window.statsChartVisibleDatasets = {
    'Gols FT': false, 'Casa Vence': false, 'Empate': false, 'Fora Vence': false,
    'Ambas Sim': true, 'Ambas Não': false, 'Over 1.5': false, 'Over 2.5': false,
    'Over 3.5': false, 'Under 1.5': false, 'Under 2.5': false, 'Under 3.5': false,
    '0 Gol Exato': false, '1 Gol Exato': false, '2 Gols Exatos': false,
    '3 Gols Exatos': false, '4 Gols Exatos': false, '5 Gols Exatos': false,
    '0x0': false, '1x0': false, '2x0': false, '3x0': false,
    '2x1': false, '3x1': false, '3x2': false, '4x0': false, '4x1': false
  };

  const labelToKey = {
    'Gols FT': 'golsFT', 'Casa Vence': 'casaVence', 'Empate': 'empate',
    'Fora Vence': 'foraVence', 'Ambas Sim': 'ambasSim', 'Ambas Não': 'ambasNao',
    'Over 1.5': 'over15', 'Over 2.5': 'over25', 'Over 3.5': 'over35',
    'Under 1.5': 'under15', 'Under 2.5': 'under25', 'Under 3.5': 'under35',
    '0 Gol Exato': 'gol0', '1 Gol Exato': 'gol1', '2 Gols Exatos': 'gol2',
    '3 Gols Exatos': 'gol3', '4 Gols Exatos': 'gol4', '5 Gols Exatos': 'gol5',
    '0x0': 'placar0x0', '1x0': 'placar1x0', '2x0': 'placar2x0',
    '3x0': 'placar3x0', '2x1': 'placar2x1', '3x1': 'placar3x1',
    '3x2': 'placar3x2', '4x0': 'placar4x0', '4x1': 'placar4x1'
  };

  // Salva o estado atual do gráfico no localStorage isolado por página
  function saveChartDatasetsState() {
    const key = `chart_datasets_${currentPage}`;
    localStorage.setItem(key, JSON.stringify(window.statsChartVisibleDatasets));
  }

  // Restaura o estado salvo do gráfico
  function restoreChartDatasetsState() {
    const key = `chart_datasets_${currentPage}`;
    const savedState = localStorage.getItem(key);
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Mescla o estado salvo com o padrão (evita quebrar se novas opções forem adicionadas no futuro)
        window.statsChartVisibleDatasets = { ...window.statsChartVisibleDatasets, ...parsedState };
      } catch (e) {
        console.error("Erro ao restaurar os filtros do gráfico:", e);
      }
    }
  }

  // ==========================================
  // FIM DA LÓGICA DO GRÁFICO
  // ==========================================


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

  // ---> MODIFICADO: Salva o estado do acordeão com um prefixo de página
  function saveAccordionState(buttonElement) {
    if (!isTargetAccordion(buttonElement)) return;
    const accordionContent = buttonElement.nextElementSibling;
    const isOpen = accordionContent && accordionContent.style.display !== "none";
    // Prefixo com o nome da página para isolar o dado
    localStorage.setItem(`accordion_state_${currentPage}`, isOpen);
  }

  // ---> MODIFICADO: Restaura o estado do acordeão com o prefixo de página
  function restoreAccordionState() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
      if (isTargetAccordion(button)) {
        // Busca o dado isolado da página atual
        const savedState = localStorage.getItem(`accordion_state_${currentPage}`);

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

  // Função melhorada para toggle do acordeão
  function toggleAccordion(buttonElement) {
    const accordionContent = buttonElement.nextElementSibling;
    if (accordionContent.style.display === "none" || accordionContent.style.display === "") {
      accordionContent.style.display = "block";
      buttonElement.textContent = buttonElement.textContent.replace('▼', '▲');
    } else {
      accordionContent.style.display = "none";
      buttonElement.textContent = buttonElement.textContent.replace('▲', '▼');
    }

    if (isTargetAccordion(buttonElement)) {
      saveAccordionState(buttonElement);

      const selectorsInAccordion = accordionContent.querySelectorAll('select, input[type="checkbox"]');
      selectorsInAccordion.forEach(element => {
        if (!excludedSelectors.includes(element.id)) {
          saveSelection(element.id);
        }
      });
    }
  }

  // ---> MODIFICADO: Salva a seleção com um prefixo de página
  function saveSelection(elementId) {
    const element = document.getElementById(elementId);
    if (element && !excludedSelectors.includes(elementId)) {
      const key = `${currentPage}_${elementId}`;
      // Cria chave única: "kironengland.html_meu-seletor"
      if (element.type === 'checkbox') {
        localStorage.setItem(key, element.checked);
      } else {
        localStorage.setItem(key, element.value);
      }
    }
  }

  // ---> MODIFICADO: Restaura as seleções com o prefixo de página
  function restoreSelections() {
    // Restaura selects
    const selectors = document.querySelectorAll("select");
    selectors.forEach(selector => {
      if (!excludedSelectors.includes(selector.id)) {
        const key = `${currentPage}_${selector.id}`;
        const savedValue = localStorage.getItem(key);
        if (savedValue) {
          selector.value = savedValue;
          const changeEvent = new Event('change', { bubbles: true });
          selector.dispatchEvent(changeEvent);
          if (selector.onchange) {
            selector.onchange();
          }
        }
      }
    });
    
    // Restaura checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (!excludedSelectors.includes(checkbox.id)) {
        const key = `${currentPage}_${checkbox.id}`;
        const savedValue = localStorage.getItem(key);
        if (savedValue !== null) {
          checkbox.checked = savedValue === 'true';
          const changeEvent = new Event('change', { bubbles: true });
          checkbox.dispatchEvent(changeEvent);
          if (checkbox.onchange) {
            checkbox.onchange();
          }
        }
      }
    });
  }

  // Adiciona eventos onchange para salvar automaticamente as alterações (lógica interna inalterada)
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
  
  // Função auxiliar para usar no evento beforeunload (lógica interna inalterada)
  function saveAllSelections() {
    const allElements = document.querySelectorAll("select, input[type='checkbox']");
    allElements.forEach(element => {
      const accordionButton = element.closest('.accordion-content')?.previousElementSibling;
      const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
      if (!excludedSelectors.includes(element.id) && (isInTargetAccordion || !accordionButton)) {
        saveSelection(element.id);
      }
    });
    
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
      if (isTargetAccordion(button)) {
        saveAccordionState(button);
      }
    });
    
    // Salva o gráfico ao sair
    saveChartDatasetsState();
  }

  // Inicializa o script ao carregar a página
  window.addEventListener("DOMContentLoaded", () => {
    restoreChartDatasetsState(); // Restaura o gráfico primeiro
    restoreAccordionState();
    setTimeout(() => {
      restoreSelections();
      setupSelectors();
    }, 100);
  });
  
  // Salva seleções antes de redirecionar
  window.addEventListener("beforeunload", () => {
    saveAllSelections();
  });
} // ---> NOVO: Fim do bloco condicional