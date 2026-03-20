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

/* ═══════════════════════════════════════════════════════════════
   TRADER STATE v2 — Liga 30 jogos
   Salva/restaura APENAS elementos dentro de [data-mtrader]
   Chave: traderState:v2_30 (isolada da liga de 30)
═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const KEY = 'traderState:v2_30';

    const SELECTS = [
        'traderNumJogosSelector',
        'traderLinhaFTSelector',
        'traderLinhaHTSelector',
        'traderCongestaoQtd',
        'traderMM1Period',
        'traderMM2Period',
        'traderMacdFast',
        'traderMacdSlow',
        'traderMacdSignal',
        'traderRsiPeriod',
        'traderAltPrincipal',
        'traderAltMacd',
    ];

    const CHECKS = [
        'traderModoFixoToggle',
        'traderLinhaAtualToggle',
        'traderMovingAveragesToggle',
        'traderShowRSI',
        'traderExibirPorcentoToggle',
        'traderTopoFundoToggle',
        'traderCongestaoToggle',
    ];

    function getRoot() {
        return document.querySelector('[data-mtrader]');
    }

    function salvar() {
        if (!getRoot()) return;
        const state = { selects: {}, checks: {}, legenda: null, acordeao: null };

        SELECTS.forEach(id => {
            const el = document.getElementById(id);
            if (el) state.selects[id] = el.value;
        });

        CHECKS.forEach(id => {
            const el = document.getElementById(id);
            if (el) state.checks[id] = el.checked;
        });

        const btnLeg = document.getElementById('traderBtnLegenda');
        if (btnLeg) state.legenda = btnLeg.textContent.trim();

        const root = getRoot();
        const content = root ? root.closest('.accordion-content') : null;
        if (content) {
            state.acordeao = content.style.display !== 'none'
                && content.style.maxHeight !== '0px'
                && content.style.maxHeight !== '';
        }

        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }

    function restaurar() {
        if (!getRoot()) return;
        let state;
        try { state = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
        if (!state) return;

        if (state.selects) {
            SELECTS.forEach(id => {
                const el = document.getElementById(id);
                if (el && state.selects[id] !== undefined) el.value = state.selects[id];
            });
        }

        if (state.checks) {
            CHECKS.forEach(id => {
                const el = document.getElementById(id);
                if (el && state.checks[id] !== undefined) el.checked = state.checks[id];
            });
        }

        if (state.legenda != null) {
            const btnLeg = document.getElementById('traderBtnLegenda');
            if (btnLeg) {
                const isOff = state.legenda === 'Legenda: OFF';
                btnLeg.textContent = state.legenda;
                btnLeg.classList.toggle('off', isOff);
                const box = document.getElementById('traderLegendaDinamica');
                if (box) box.classList.toggle('oculta', isOff);
            }
        }

        if (state.acordeao != null) {
            const root = getRoot();
            const content = root ? root.closest('.accordion-content') : null;
            const btn = content ? content.previousElementSibling : null;
            if (content && btn) {
                if (state.acordeao) {
                    content.style.display = 'block';
                    content.style.maxHeight = content.scrollHeight + 'px';
                    btn.classList.add('active');
                } else {
                    content.style.display = 'none';
                    content.style.maxHeight = '0px';
                    btn.classList.remove('active');
                }
            }
        }
    }

    function observar() {
        if (!getRoot()) return;

        SELECTS.forEach(id => {
            document.getElementById(id)?.addEventListener('change', salvar);
        });

        CHECKS.forEach(id => {
            document.getElementById(id)?.addEventListener('change', salvar);
        });

        document.getElementById('traderBtnLegenda')
            ?.addEventListener('click', () => setTimeout(salvar, 50));

        ['traderAltPrincipalMenos', 'traderAltPrincipalMais',
         'traderAltMacdMenos',      'traderAltMacdMais',
         'traderBtnResetConfig'].forEach(id => {
            document.getElementById(id)
                ?.addEventListener('click', () => setTimeout(salvar, 250));
        });

        const root    = getRoot();
        const content = root ? root.closest('.accordion-content') : null;
        const btnAcord = content ? content.previousElementSibling : null;
        if (btnAcord) btnAcord.addEventListener('click', () => setTimeout(salvar, 150));
    }

    function init() {
        if (!getRoot()) return;
        restaurar();
        observar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 400);
    }

})();