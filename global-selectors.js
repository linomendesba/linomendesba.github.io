// =========================================================================
// NOVO: CONSTANTES PARA O GRÁFICO
// =========================================================================
const DEFAULT_CHART_LABELS = [
    'Gols FT', 'Casa Vence', 'Empate', 'Fora Vence', 'Ambas Sim', 'Ambas Não',
    'Over 1.5', 'Over 2.5', 'Over 3.5', 'Under 1.5', 'Under 2.5', 'Under 3.5',
    '0 Gol Exato', '1 Gol Exato', '2 Gols Exatos', '3 Gols Exatos', '4 Gols Exatos', '5 Gols Exatos'
];


// =========================================================================
// SEU CÓDIGO ORIGINAL (PRESERVADO)
// =========================================================================

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

// Restaura as seleções do LocalStorage, exceto para os seletores excluídos
function restoreSelections() {
  // Restaura selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      const savedValue = localStorage.getItem(selector.id);
      if (savedValue) {
        selector.value = savedValue;
        
        // Dispara o evento change para carregar os dados
        const changeEvent = new Event('change', { bubbles: true });
        selector.dispatchEvent(changeEvent);
        
        // Também tenta disparar eventos personalizados se existirem
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
      const savedValue = localStorage.getItem(checkbox.id);
      if (savedValue !== null) {
        checkbox.checked = savedValue === 'true';
        
        // Dispara o evento change para checkboxes também
        const changeEvent = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(changeEvent);
        
        if (checkbox.onchange) {
          checkbox.onchange();
        }
      }
    }
  });
}

// Adiciona eventos onchange para salvar automaticamente as alterações
function setupSelectors() {
  // Setup para selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    // Verifica se o seletor está dentro do acordeão específico
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    // Só adiciona eventos se estiver no acordeão específico ou não estiver em nenhum acordeão
    if (isInTargetAccordion || !accordionButton) {
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
          
          // Se estiver no acordeão específico, salva o estado do acordeão
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
    // Verifica se o checkbox está dentro do acordeão específico
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    // Só adiciona eventos se estiver no acordeão específico ou não estiver em nenhum acordeão
    if (isInTargetAccordion || !accordionButton) {
      checkbox.addEventListener("change", () => {
        saveSelection(checkbox.id);
        
        // Se estiver no acordeão específico, salva o estado do acordeão
        if (isInTargetAccordion) {
          saveAccordionState(accordionButton);
        }
      });
    }
  });
}

// Função auxiliar para usar no evento beforeunload
function saveAllSelections() {
  // Salva selects (apenas os que estão no acordeão específico)
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(selector.id) && (isInTargetAccordion || !accordionButton)) {
      saveSelection(selector.id);
    }
  });
  
  // Salva checkboxes (apenas os que estão no acordeão específico)
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(checkbox.id) && (isInTargetAccordion || !accordionButton)) {
      saveSelection(checkbox.id);
    }
  });
  
  // Salva apenas o estado do acordeão específico
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    if (isTargetAccordion(button)) {
      saveAccordionState(button);
    }
  });
}

// Função para limpar dados salvos (útil para debug/reset)
function clearSavedData() {
  // Remove selects salvos (apenas os do acordeão específico)
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(selector.id) && (isInTargetAccordion || !accordionButton)) {
      localStorage.removeItem(selector.id);
    }
  });
  
  // Remove checkboxes salvos (apenas os do acordeão específico)
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(checkbox.id) && (isInTargetAccordion || !accordionButton)) {
      localStorage.removeItem(checkbox.id);
    }
  });
  
  // Remove apenas o estado do acordeão específico
  localStorage.removeItem('accordion_tendencia_gols_mercados');

  // NOVO: Remove também os estados de visibilidade dos gráficos
  localStorage.removeItem('chart_visibility_golsplus');
  localStorage.removeItem('chart_visibility_Copa');

  console.log("Dados salvos foram limpos.");
}

// =========================================================================
// NOVO: FUNÇÕES PARA SALVAR E RESTAURAR O ESTADO DAS LINHAS DO GRÁFICO
// =========================================================================

/**
 * Salva o estado de visibilidade atual das linhas de um gráfico específico.
 * @param {string} chartId - O ID do elemento canvas do gráfico.
 */
function saveChartVisibilityState(chartId) {
    const chartInstance = Chart.getChart(chartId);
    if (!chartInstance) return;

    const visibilityState = {};
    chartInstance.data.datasets.forEach((dataset, index) => {
        visibilityState[dataset.label] = chartInstance.isDatasetVisible(index);
    });

    localStorage.setItem(`chart_visibility_${chartId}`, JSON.stringify(visibilityState));
}

/**
 * Restaura o estado de visibilidade das linhas de um gráfico.
 * @param {string} chartId - O ID do elemento canvas do gráfico.
 * @returns {object} - Um objeto com o estado de visibilidade para cada linha.
 */
function restoreChartVisibilityState(chartId) {
    const savedStateJSON = localStorage.getItem(`chart_visibility_${chartId}`);

    if (savedStateJSON) {
        try {
            return JSON.parse(savedStateJSON);
        } catch (e) {
            console.error("Erro ao restaurar o estado do gráfico:", e);
        }
    }

    const defaultState = {};
    DEFAULT_CHART_LABELS.forEach(label => {
        defaultState[label] = true;
    });
    return defaultState;
}

// =========================================================================
// MODIFICADO: FUNÇÃO DE CRIAÇÃO DO GRÁFICO
// =========================================================================

/**
 * Cria uma instância do gráfico, com lógica para salvar e restaurar o estado das linhas.
 * @param {CanvasRenderingContext2D} ctx - O contexto do canvas.
 * @param {string[]} labels - As etiquetas do eixo X.
 * @param {object} data - Os dados para os datasets.
 * @param {string} chartId - O ID do elemento canvas (ex: 'golsplus', 'Copa').
 */
function createStatsChart(ctx, labels, data, chartId) {
    const initialVisibilityState = restoreChartVisibilityState(chartId);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Gols FT', data: data.golsFT, borderColor: '#1E88E5', backgroundColor: '#1E88E5', pointBackgroundColor: data.golsFTColors, hidden: !initialVisibilityState['Gols FT'] },
                { label: 'Casa Vence', data: data.casaVence, borderColor: '#AB47BC', backgroundColor: '#AB47BC', pointBackgroundColor: data.casaVenceColors, hidden: !initialVisibilityState['Casa Vence'] },
                { label: 'Empate', data: data.empate, borderColor: '#78909C', backgroundColor: '#78909C', pointBackgroundColor: data.empateColors, hidden: !initialVisibilityState['Empate'] },
                { label: 'Fora Vence', data: data.foraVence, borderColor: '#2196F3', backgroundColor: '#2196F3', pointBackgroundColor: data.foraVenceColors, hidden: !initialVisibilityState['Fora Vence'] },
                { label: 'Ambas Sim', data: data.ambasSim, borderColor: '#B0BEC5', backgroundColor: '#B0BEC5', pointBackgroundColor: data.ambasSimColors, hidden: !initialVisibilityState['Ambas Sim'] },
                { label: 'Ambas Não', data: data.ambasNao, borderColor: '#F44336', backgroundColor: '#F44336', pointBackgroundColor: data.ambasNaoColors, hidden: !initialVisibilityState['Ambas Não'] },
                { label: 'Over 1.5', data: data.over15, borderColor: '#26A69A', backgroundColor: '#26A69A', pointBackgroundColor: data.over15Colors, hidden: !initialVisibilityState['Over 1.5'] },
                { label: 'Over 2.5', data: data.over25, borderColor: '#FFEB3B', backgroundColor: '#FFEB3B', pointBackgroundColor: data.over25Colors, hidden: !initialVisibilityState['Over 2.5'] },
                { label: 'Over 3.5', data: data.over35, borderColor: '#00BCD4', backgroundColor: '#00BCD4', pointBackgroundColor: data.over35Colors, hidden: !initialVisibilityState['Over 3.5'] },
                { label: 'Under 1.5', data: data.under15, borderColor: '#388E3C', backgroundColor: '#388E3C', pointBackgroundColor: data.under15Colors, hidden: !initialVisibilityState['Under 1.5'] },
                { label: 'Under 2.5', data: data.under25, borderColor: '#FF9800', backgroundColor: '#FF9800', pointBackgroundColor: data.under25Colors, hidden: !initialVisibilityState['Under 2.5'] },
                { label: 'Under 3.5', data: data.under35, borderColor: '#F06292', backgroundColor: '#F06292', pointBackgroundColor: data.under35Colors, hidden: !initialVisibilityState['Under 3.5'] },
                { label: '0 Gol Exato', data: data.gol0, borderColor: '#D81B60', backgroundColor: '#D81B60', pointBackgroundColor: data.gol0Colors, hidden: !initialVisibilityState['0 Gol Exato'] },
                { label: '1 Gol Exato', data: data.gol1, borderColor: '#8E24AA', backgroundColor: '#8E24AA', pointBackgroundColor: data.gol1Colors, hidden: !initialVisibilityState['1 Gol Exato'] },
                { label: '2 Gols Exatos', data: data.gol2, borderColor: '#A0522D', backgroundColor: '#A0522D', pointBackgroundColor: data.gol2Colors, hidden: !initialVisibilityState['2 Gols Exatos'] },
                { label: '3 Gols Exatos', data: data.gol3, borderColor: '#546E7A', backgroundColor: '#546E7A', pointBackgroundColor: data.gol3Colors, hidden: !initialVisibilityState['3 Gols Exatos'] },
                { label: '4 Gols Exatos', data: data.gol4, borderColor: '#FFB300', backgroundColor: '#FFB300', pointBackgroundColor: data.gol4Colors, hidden: !initialVisibilityState['4 Gols Exatos'] },
                { label: '5 Gols Exatos', data: data.gol5, borderColor: '#00897B', backgroundColor: '#00897B', pointBackgroundColor: data.gol5Colors, hidden: !initialVisibilityState['5 Gols Exatos'] }
            ].map(dataset => ({
                ...dataset,
                borderWidth: 2,
                pointRadius: 4,
                fill: false
            }))
        },
        options: {
            plugins: {
                legend: {
                    onClick: (e, legendItem, legend) => {
                        Chart.defaults.plugins.legend.onClick(e, legendItem, legend);
                        saveChartVisibilityState(chartId);
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


// =========================================================================
// INICIALIZAÇÃO DA PÁGINA
// =========================================================================

// Inicializa o script ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  restoreAccordionState();
  
  // Pequeno delay para garantir que todos os elementos estejam prontos
  setTimeout(() => {
    restoreSelections();
    setupSelectors();

    // ====================================================================
    // Chame a função para criar os gráficos AQUI!
    // ====================================================================
    // Exemplo:
    // try {
    //   const ctxGolsPlus = document.getElementById('golsplus').getContext('2d');
    //   createStatsChart(ctxGolsPlus, labelsGolsPlus, dataGolsPlus, 'golsplus');
    //   const ctxCopa = document.getElementById('Copa').getContext('2d');
    //   createStatsChart(ctxCopa, labelsCopa, dataCopa, 'Copa');
    // } catch(e) { console.error("Erro ao inicializar gráficos:", e); }

  }, 100);
});

// Tentativa adicional de salvar seleções antes de redirecionar
window.addEventListener("beforeunload", () => {
  saveAllSelections();
});