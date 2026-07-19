/* ═══════════════════════════════════════════════════════════════════
   PATCH: ARRASTAR O GRÁFICO PARA OS LADOS (PAN)
   Cole este bloco inteiro no final do seu grafico.js (antes ou depois
   do window.onload, tanto faz — só não pode ficar DENTRO de outra função).
   100% aditivo: não altera nada do que já existe no arquivo.
═══════════════════════════════════════════════════════════════════ */

const CHART_PAN_EXTRA_PX = 340; // espaço em branco reservado de cada lado (px). Aumente/diminua à vontade.

function _initChartPan() {
    leagues.forEach(league => {
        const canvas = document.getElementById(league);
        if (!canvas || canvas.dataset.panReady) return;
        canvas.dataset.panReady = '1';

        const originalParent = canvas.parentElement;

        // viewport: ocupa o mesmo espaço visual de sempre e corta o que passar da borda
        const viewport = document.createElement('div');
        viewport.className = 'chart-pan-viewport';
        Object.assign(viewport.style, {
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100%'
        });

        // host: mais largo que o viewport — é ele que desliza pros lados
        const host = document.createElement('div');
        host.className = 'chart-pan-host';
        Object.assign(host.style, {
            position: 'relative',
            width: `calc(100% + ${CHART_PAN_EXTRA_PX * 2}px)`,
            height: '100%',
            left: `-${CHART_PAN_EXTRA_PX}px`,   // começa centralizado — visual idêntico ao original
            cursor: 'grab'
        });

        originalParent.insertBefore(viewport, canvas);
        viewport.appendChild(host);
        host.appendChild(canvas);

        let dragging = false, startX = 0, startLeft = -CHART_PAN_EXTRA_PX;
        const MIN_LEFT = -(CHART_PAN_EXTRA_PX * 2), MAX_LEFT = 0;
        const HIT_PX = 10;

        const chartOf = () => chartInstances[league];

        // Usa as mesmas regras de "perto de uma linha/fibonacci" que o resto do
        // arquivo já usa, só para decidir se deixa o pan começar ou se deixa as
        // outras ferramentas (linha/fibonacci) agirem normalmente.
        const nearInteractiveElement = (pxX, pxY) => {
            const chart = chartOf(); if (!chart || !chart.chartArea) return false;
            if (chart._fibDrawMode) return true; // desenhando fibonacci: não faz pan
            const yS = chart.scales?.y; if (!yS) return false;
            const { top, bottom } = chart.chartArea;

            if ((chart.dragLines || []).some(l => {
                const ly = yS.getPixelForValue(l.y);
                return ly >= top && ly <= bottom && Math.abs(ly - pxY) <= HIT_PX;
            })) return true;

            const xS = chart.scales?.x;
            if ((chart.fibDraws || []).some(f => {
                let x1 = chart.chartArea.left, x2 = chart.chartArea.right;
                if (f.x1Idx != null && f.x2Idx != null && xS) {
                    let p1 = xS.getPixelForValue(f.x1Idx), p2 = xS.getPixelForValue(f.x2Idx);
                    if (isFinite(p1) && isFinite(p2)) { if (p1 > p2) [p1, p2] = [p2, p1]; x1 = Math.max(x1, p1); x2 = Math.min(x2, p2); }
                }
                if (pxX < x1 - 2 || pxX > x2 + 2) return false;
                return FIB_RETR_LEVELS.some(lvl => {
                    const val = f.y1 + (lvl / 100) * (f.y2 - f.y1);
                    const ly = yS.getPixelForValue(val);
                    return ly >= top && ly <= bottom && Math.abs(ly - pxY) <= HIT_PX;
                });
            })) return true;

            return false;
        };

        const getX = evt => (evt.touches && evt.touches[0]?.clientX) ?? evt.clientX ?? 0;
        const getY = evt => (evt.touches && evt.touches[0]?.clientY) ?? evt.clientY ?? 0;

        const onDown = evt => {
            const r = canvas.getBoundingClientRect();
            const pxX = getX(evt) - r.left, pxY = getY(evt) - r.top;
            if (nearInteractiveElement(pxX, pxY)) return; // deixa as outras ferramentas agirem
            dragging = true;
            startX = getX(evt);
            startLeft = parseFloat(host.style.left) || -CHART_PAN_EXTRA_PX;
            host.style.cursor = 'grabbing';
        };
        const onMove = evt => {
            if (!dragging) return;
            if (evt.cancelable) evt.preventDefault();
            const delta = getX(evt) - startX;
            const novoLeft = Math.max(MIN_LEFT, Math.min(MAX_LEFT, startLeft + delta));
            host.style.left = novoLeft + 'px';
        };
        const onUp = () => { dragging = false; host.style.cursor = 'grab'; };

        canvas.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        canvas.addEventListener('touchstart', onDown, { passive: true });
        canvas.addEventListener('touchmove', onMove, { passive: false });
        canvas.addEventListener('touchend', onUp, { passive: true });
        canvas.addEventListener('touchcancel', onUp, { passive: true });

        // duplo clique / duplo toque recentraliza o gráfico
        canvas.addEventListener('dblclick', () => { host.style.left = `-${CHART_PAN_EXTRA_PX}px`; });
    });
}

// Chame isso de um botão seu, se quiser um jeito de "resetar" a posição
window.centralizarGrafico = () => {
    document.querySelectorAll('.chart-pan-host').forEach(h => h.style.left = `-${CHART_PAN_EXTRA_PX}px`);
};