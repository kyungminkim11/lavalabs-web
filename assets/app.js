(() => {
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width:1020px){
      .nav{gap:10px}
      .nav > .theme-toggle:not(.mobile-theme-toggle){margin-left:auto!important}
      .nav > .menu-toggle{margin-left:0!important}
    }
    @media (max-width:680px){.nav{gap:8px}}
  `;
  document.head.appendChild(style);
})();

const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = resolve;
    document.body.appendChild(script);
  });

[
  "assets/core.js",
  "assets/commerce.js",
  "assets/commerce-details.js",
  "assets/service-details.js",
  "assets/engagement.js",
  "assets/trust.js",
  "assets/portfolio-quality.js",
  "assets/conversion.js",
  "assets/business-style.js",
  "assets/operations-page.js",
  "assets/custom-development-page.js",
  "assets/business-nav.js",
  "assets/pov-content.js",
  "assets/pov-nav.js",
  "assets/equipment-page.js",
  "assets/osmo360-update.js",
  "assets/education-guide.js",
  "assets/footer-compact.js",
  "assets/footer-sitemap.js",
  "assets/service-taxonomy.js",
  "assets/budget-recommender.js",
  "assets/professional-polish.js",
  "assets/product-spin.js",
  "assets/lavaspin.js",
  "assets/seo-helpers.js",
  "assets/seo.js",
  "assets/insights.js",
].reduce((promise, src) => promise.then(() => loadScript(src)), Promise.resolve());