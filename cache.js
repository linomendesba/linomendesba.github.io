(function () {
    const TTL = 30000; // 30 segundos
    const PREFIX = 'bscache_';
    const originalFetch = window.fetch;

    window.fetch = async function (url, options) {
        // Só cacheia requisições GET sem body
        if (options && options.method && options.method.toUpperCase() !== 'GET') {
            return originalFetch(url, options);
        }

        // Não cacheia Firebase, Google, analytics
        const urlStr = url.toString();
        if (
            urlStr.includes('firebaseapp.com') ||
            urlStr.includes('googleapis.com') ||
            urlStr.includes('googletagmanager') ||
            urlStr.includes('google-analytics')
        ) {
            return originalFetch(url, options);
        }

        const chave = PREFIX + urlStr;
        const agora = Date.now();

        try {
            const salvo = localStorage.getItem(chave);
            if (salvo) {
                const { data, timestamp } = JSON.parse(salvo);
                if (agora - timestamp < TTL) {
                    return new Response(JSON.stringify(data), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }
        } catch (e) {
            localStorage.removeItem(PREFIX + urlStr);
        }

        // Busca normalmente e salva no cache
        const response = await originalFetch(url, options);
        const clone = response.clone();

        clone.json().then(data => {
            try {
                localStorage.setItem(chave, JSON.stringify({ data, timestamp: agora }));
            } catch (e) {
                // localStorage cheio — limpa cache antigo e tenta de novo
                Object.keys(localStorage)
                    .filter(k => k.startsWith(PREFIX))
                    .forEach(k => localStorage.removeItem(k));
            }
        }).catch(() => {});

        return response;
    };
})();