(function () {
    const content = document.getElementById('accordeonVidBetanoClassicos');
    const iframe  = document.getElementById('iframeVidBetanoClassicos');
    let carregado = false;
    let popup = null;

    function criarPopup() {
        if (popup) return;

        popup = document.createElement('div');
        popup.id = 'popupExtensaoVidBetano';
        popup.innerHTML = `
            <button id="fecharPopupExtensaoVidBetano" aria-label="Fechar">&times;</button>
            <p>Para assistir aos vídeos, instale a extensão <strong>Ignore X-Frame headers</strong> no seu navegador.</p>
        `;

        Object.assign(popup.style, {
            position: 'absolute',
            top: '0',
            left: '100%',
            marginLeft: '12px',
            width: '220px',
            background: '#1b1f2a',
            color: '#e5e7eb',
            border: '1px solid #333a4d',
            borderRadius: '8px',
            padding: '14px 16px',
            fontSize: '13px',
            lineHeight: '1.4',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            zIndex: '9999'
        });

        // garante que o container pai tenha posicionamento relativo
        const parent = content.parentElement;
        if (parent && getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        const btnFechar = popup.querySelector('#fecharPopupExtensaoVidBetano');
        Object.assign(btnFechar.style, {
            position: 'absolute',
            top: '6px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '16px',
            cursor: 'pointer',
            lineHeight: '1'
        });
        btnFechar.addEventListener('click', removerPopup);

        (parent || content).appendChild(popup);
    }

    function removerPopup() {
        if (popup) {
            popup.remove();
            popup = null;
        }
    }

    function estaAberto() {
        return window.getComputedStyle(content).display !== 'none';
    }

    function sincronizar() {
        const aberto = estaAberto();

        if (aberto && !carregado) {
            iframe.src = iframe.dataset.src;
            carregado = true;
            criarPopup();
        } else if (!aberto && carregado) {
            iframe.removeAttribute('src');
            carregado = false;
            removerPopup();
        }
    }

    new MutationObserver(sincronizar).observe(content, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    sincronizar();
})();