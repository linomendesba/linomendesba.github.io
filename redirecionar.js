// redirecionar.js
function redirecionar(select) {
    const url = select.value;
  
    if (
        url === "https://t.me/betstatsite" ||
        url === "https://t.me/ProPlayerFut" ||
        url === "blog.html" ||
        url === "gestao.html" ||
        url === "https://www.betstat.site/tv/" ||
        url === "https://youtu.be/oRqi3RvH8zE" ||
        url === "https://www.betstat.site/central/" ||
        url === "https://www.betstat.site/sequencia.html" ||
        url === "https://www.betstat.site/porcentagem365.html" ||
        url === "https://www.betstat.site/365buscadortime.html" ||
        url === "https://www.betstat.site/maxima365.html" ||
        url === "https://www.betstat.site/365macro.html" ||
        url === "https://www.betstat.site/mult365.html" ||
        url === "https://www.betstat.site/365fixo.html" ||
        url === "https://www.betstat.site/multbetano.html" ||
        url === "https://www.betstat.site/maximabetano.html" ||
        url === "https://www.betstat.site/porcentagembetano.html" ||
        url === "https://www.betstat.site/macrobetano.html" ||
        url === "https://www.betstat.site/betanofixo.html" ||
        url === "https://www.betstat.site/365fiboht.html" ||
        url === "https://www.betstat.site/365tips.html" ||
        url === "https://www.betstat.site/365fiboexato.html" || // Novo
        url === "https://www.betstat.site/geradorbet365/" || // Novo
        url === "https://www.betstat.site/365tips.html" || // Novo
        url === "https://www.betstat.site/betanofiboht.html" || // Novo
        url === "https://www.betstat.site/betanobuscador.html" || // Novo
        url === "https://www.betstat.site/365buscador.html" || // Novo
        url === "https://www.betstat.site/365gols.html" || // Novo
        url === "https://www.betstat.site/betanotips.html" || // Novo
        url === "https://www.betstat.site/betanofiboexato.html"  // Novo
    ) {
      window.open(url, "_blank");
    } else if (url) {
      window.location.href = url;
    }
  }