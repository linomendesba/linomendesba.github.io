// api-dominio.js
// Redireciona automaticamente chamadas de API do domínio antigo (betstat.site)
// para o domínio atual do site. Carregue ANTES dos scripts da página.
//
// Se o backend ficar num endereço diferente do site, troque NOVA_BASE,
// ex.: var NOVA_BASE = "https://www.datavirtual.com.br";
(function () {
  if (window.__apiDominioShim) return;
  window.__apiDominioShim = true;

  var ANTIGO = /^https?:\/\/(www\.)?betstat\.site(?=\/|$)/i;
  var NOVA_BASE = window.location.origin;

  function reescrever(u) {
    return typeof u === "string" ? u.replace(ANTIGO, NOVA_BASE) : u;
  }

  if (window.fetch) {
    var fetchOriginal = window.fetch;
    window.fetch = function (input, init) {
      try {
        if (typeof input === "string") {
          input = reescrever(input);
        } else if (typeof URL !== "undefined" && input instanceof URL) {
          input = new URL(reescrever(input.href));
        } else if (input && input.url && ANTIGO.test(input.url)) {
          input = new Request(reescrever(input.url), input);
        }
      } catch (e) {}
      return fetchOriginal.call(this, input, init);
    };
  }

  if (window.XMLHttpRequest) {
    var openOriginal = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      var args = Array.prototype.slice.call(arguments);
      args[1] = reescrever(String(url));
      return openOriginal.apply(this, args);
    };
  }
})();
