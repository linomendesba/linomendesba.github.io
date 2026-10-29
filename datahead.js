/* datahead.js — bootstrap do <head> (roda logo após config.js) */

// SEO automático por liga (definido no config.js)
aplicarSEOAutomatico();

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-4WT805FFHQ");
