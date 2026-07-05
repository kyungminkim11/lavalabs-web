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
  "assets/header-controls-fix.js",
].reduce((promise, src) => promise.then(() => loadScript(src)), Promise.resolve());
