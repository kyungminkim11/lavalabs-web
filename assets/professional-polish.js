(() => {
  const root = document.documentElement;
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("lavalabs-theme");

  if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;

  function effectiveTheme() {
    return root.dataset.theme || (mq.matches ? "dark" : "light");
  }

  function syncThemeState() {
    const dark = effectiveTheme() === "dark";
    root.classList.toggle("lavalabs-auto-dark", !root.dataset.theme && mq.matches);
    root.style.colorScheme = dark ? "dark" : "light";
    $$(".theme-toggle").forEach((button) => {
      button.classList.toggle("is-dark", dark);
      button.setAttribute("aria-label", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
      button.title = dark ? "라이트 모드" : "다크 모드";
    });
  }

  const style = document.createElement("style");
  style.textContent = `
:root{
  --ll-surface:#fff;
  --ll-surface-2:#f8f9f3;
  --ll-card:#fff;
  --ll-ink:#11151b;
  --ll-muted:#4f5a65;
  --ll-soft:#e9eae4;
  --ll-border:#d9dcd4;
  --ll-acid:#c9ff48;
  --ll-acid-strong:#4f6500;
  --ll-deep:#0d1117;
}
html[data-theme="dark"],html.lavalabs-auto-dark{
  --bg:#0f141a;
  --paper:#151b23;
  --ink:#f4f7fb;
  --muted:#b7c1cc;
  --line:#2c3540;
  --dark:#080b10;
  --dark-2:#111821;
  --accent:#c9ff48;
  --ll-surface:#151b23;
  --ll-surface-2:#10161d;
  --ll-card:#171e27;
  --ll-ink:#f4f7fb;
  --ll-muted:#b7c1cc;
  --ll-soft:#111821;
  --ll-border:#2c3540;
  --ll-acid-strong:#c9ff48;
  --shadow:0 28px 70px rgba(0,0,0,.32);
}
html[data-theme="dark"] body,html.lavalabs-auto-dark body{
  background:
    radial-gradient(circle at 50% -10%, rgba(201,255,72,.08), transparent 34rem),
    var(--bg);
  color:var(--ink);
}
body{overflow-x:hidden;text-rendering:optimizeLegibility}
.site-header{transition:background-color .2s,border-color .2s}
.nav{gap:16px}.desktop-nav{gap:18px}
.theme-toggle{
  width:44px;height:44px;display:grid;place-items:center;flex:0 0 auto;
  border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.72);
  color:#11151b;box-shadow:0 10px 28px rgba(17,21,27,.08);cursor:pointer;transition:.2s;
}
.theme-toggle:hover{transform:translateY(-1px);border-color:#a7c43b}
.theme-toggle svg{grid-area:1/1;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:.2s}
.theme-toggle .moon-disc{fill:currentColor;stroke:none}
.theme-toggle .moon-cutout{fill:#fff;stroke:none}
.theme-toggle .moon{opacity:1;transform:scale(1)}
.theme-toggle .sun{opacity:0;transform:scale(.72) rotate(-30deg)}
.theme-toggle.is-dark .moon{opacity:0;transform:scale(.72) rotate(30deg)}
.theme-toggle.is-dark .sun{opacity:1;transform:scale(1) rotate(0)}
html[data-theme="dark"] .site-header,html.lavalabs-auto-dark .site-header{
  background:rgba(13,17,23,.86);border-color:#ffffff14;
}
html[data-theme="dark"] .brand-copy strong,html.lavalabs-auto-dark .brand-copy strong,
html[data-theme="dark"] .desktop-nav>a:hover,html.lavalabs-auto-dark .desktop-nav>a:hover,
html[data-theme="dark"] .desktop-nav>a.active,html.lavalabs-auto-dark .desktop-nav>a.active,
html[data-theme="dark"] .nav-dropdown>button:hover,html.lavalabs-auto-dark .nav-dropdown>button:hover{color:#fff}
html[data-theme="dark"] .desktop-nav>a,html.lavalabs-auto-dark .desktop-nav>a,
html[data-theme="dark"] .nav-dropdown>button,html.lavalabs-auto-dark .nav-dropdown>button{color:#c4ccd5}
html[data-theme="dark"] .theme-toggle,html.lavalabs-auto-dark .theme-toggle,
html[data-theme="dark"] .menu-toggle,html.lavalabs-auto-dark .menu-toggle{
  background:#151b23;color:#f7fbff;border-color:#2c3540;
}
html[data-theme="dark"] .theme-toggle .moon-cutout,html.lavalabs-auto-dark .theme-toggle .moon-cutout{fill:#151b23}
html[data-theme="dark"] .menu-toggle span,html.lavalabs-auto-dark .menu-toggle span{background:#f7fbff}
html[data-theme="dark"] .mobile-menu,html.lavalabs-auto-dark .mobile-menu{
  background:#0f141a;border-color:#2c3540;box-shadow:0 18px 45px rgba(0,0,0,.35);
}
html[data-theme="dark"] .mobile-menu .mobile-sub,html.lavalabs-auto-dark .mobile-menu .mobile-sub{color:#c3ccd6}
.hero{
  position:relative;isolation:isolate;padding-top:96px;
  background:
    linear-gradient(115deg, rgba(255,255,255,.52), transparent 52%),
    radial-gradient(circle at 82% 18%, rgba(201,255,72,.20), transparent 24rem);
}
.hero:before{
  content:"";position:absolute;inset:auto 0 0;height:1px;
  background:linear-gradient(90deg,transparent,var(--line),transparent);z-index:-1;
}
.hero-grid{grid-template-columns:minmax(0,1fr) minmax(390px,.92fr);gap:64px}
.hero h1{max-width:720px;letter-spacing:-.052em}
.hero h1 span{color:#5f6873}
.hero-lead{color:#4f5964;font-size:18px;line-height:1.85}
.hero-proof-list{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:24px;max-width:680px;
}
.hero-proof-list span{
  min-height:58px;display:flex;align-items:center;padding:12px 14px;border:1px solid var(--line);
  border-radius:16px;background:rgba(255,255,255,.62);color:#28313a;font-size:12px;font-weight:850;line-height:1.45;
}
.hero-proof-list span:before{
  content:"";width:8px;height:8px;flex:0 0 auto;margin-right:9px;border-radius:50%;background:var(--acid);
  box-shadow:0 0 0 4px rgba(201,255,72,.18);
}
.hero-actions{margin-top:28px}.hero-metrics{margin-top:34px}
.hero-metrics strong{font-size:16px}.hero-metrics span{font-size:11px;color:#59636f}
.stage-window{border:1px solid rgba(255,255,255,.12);box-shadow:0 34px 90px rgba(13,17,23,.24)}
.stage-content{
  background:
    linear-gradient(145deg,rgba(255,255,255,.72),rgba(231,229,219,.72)),
    linear-gradient(145deg,#e9e7df,#c8c2b7);
}
.stage-card{border-radius:16px}.stage-card.web h3{letter-spacing:-.04em}
.ll-home-flow{padding:40px 0;border-block:1px solid var(--line);background:rgba(255,255,255,.35)}
.ll-home-flow-grid{display:grid;grid-template-columns:.8fr repeat(4,1fr);gap:12px;align-items:stretch}
.ll-home-flow-title{display:flex;flex-direction:column;justify-content:center}
.ll-home-flow-title small{font-size:10px;font-weight:900;letter-spacing:.12em;color:var(--accent);text-transform:uppercase}
.ll-home-flow-title strong{margin-top:6px;font-size:20px;line-height:1.22;letter-spacing:-.04em}
.ll-home-flow-step{padding:18px;border-left:1px solid var(--line)}
.ll-home-flow-step b{display:block;color:#657a00;font-size:11px;letter-spacing:.08em}
.ll-home-flow-step strong{display:block;margin-top:8px;font-size:15px}
.ll-home-flow-step span{display:block;margin-top:6px;color:var(--muted);font-size:11px;line-height:1.6}
.service-card,.price-card,.case-card,.problem-card,.feature-row,.commerce-platform,.system-card,.checklist-card{box-shadow:0 12px 36px rgba(17,21,27,.05)}
.service-card:hover,.price-card:hover,.case-card:hover{box-shadow:0 24px 58px rgba(17,21,27,.12)}
.button{white-space:nowrap}.button-primary{box-shadow:0 12px 28px rgba(138,178,18,.20)}
.button-light{box-shadow:0 10px 25px rgba(17,21,27,.06)}
.section-head p{font-size:15px;line-height:1.85}.service-card p,.price-card p,.case-copy p{line-height:1.75}
html[data-theme="dark"] .hero,html.lavalabs-auto-dark .hero{
  background:
    linear-gradient(115deg, rgba(255,255,255,.03), transparent 52%),
    radial-gradient(circle at 82% 18%, rgba(201,255,72,.11), transparent 24rem);
}
html[data-theme="dark"] .hero h1 span,html.lavalabs-auto-dark .hero h1 span{color:#c7d0db}
html[data-theme="dark"] .hero-lead,html.lavalabs-auto-dark .hero-lead,
html[data-theme="dark"] .hero-metrics span,html.lavalabs-auto-dark .hero-metrics span{color:#c0cad4}
html[data-theme="dark"] .hero-proof-list span,html.lavalabs-auto-dark .hero-proof-list span{
  background:rgba(255,255,255,.06);border-color:#ffffff18;color:#edf2f7;
}
html[data-theme="dark"] .stage-content,html.lavalabs-auto-dark .stage-content{
  background:linear-gradient(145deg,#242b31,#151b23);
}
html[data-theme="dark"] .stage-card:not(.auto),html.lavalabs-auto-dark .stage-card:not(.auto){
  background:rgba(255,255,255,.92);color:#11151b;
}
html[data-theme="dark"] .ll-home-flow,html.lavalabs-auto-dark .ll-home-flow{
  background:#111821;border-color:#2c3540;
}
html[data-theme="dark"] .section-muted,html.lavalabs-auto-dark .section-muted,
html[data-theme="dark"] .budget-section.light,html.lavalabs-auto-dark .budget-section.light{background:#111821;color:#f4f7fb}
html[data-theme="dark"] .button-light,html.lavalabs-auto-dark .button-light,
html[data-theme="dark"] .dropdown-menu,html.lavalabs-auto-dark .dropdown-menu,
html[data-theme="dark"] .service-card:not(.dark),html.lavalabs-auto-dark .service-card:not(.dark),
html[data-theme="dark"] .price-card:not(.featured),html.lavalabs-auto-dark .price-card:not(.featured),
html[data-theme="dark"] .problem-card.before,html.lavalabs-auto-dark .problem-card.before,
html[data-theme="dark"] .case-card,html.lavalabs-auto-dark .case-card,
html[data-theme="dark"] .feature-row,html.lavalabs-auto-dark .feature-row,
html[data-theme="dark"] .contact-meta div,html.lavalabs-auto-dark .contact-meta div,
html[data-theme="dark"] .legal-box,html.lavalabs-auto-dark .legal-box,
html[data-theme="dark"] .commerce-platform:not(.dark),html.lavalabs-auto-dark .commerce-platform:not(.dark),
html[data-theme="dark"] .budget-section.light .budget-form,html.lavalabs-auto-dark .budget-section.light .budget-form{
  background:#171e27;color:#f4f7fb;border-color:#2c3540;
}
html[data-theme="dark"] .button-light,html.lavalabs-auto-dark .button-light{color:#f4f7fb!important}
html[data-theme="dark"] .case-copy,html.lavalabs-auto-dark .case-copy{background:#171e27;color:#f4f7fb}
html[data-theme="dark"] .dropdown-menu a:hover,html.lavalabs-auto-dark .dropdown-menu a:hover{background:#222b36}
html[data-theme="dark"] .problem-card.after,html.lavalabs-auto-dark .problem-card.after,
html[data-theme="dark"] .commerce-highlight,html.lavalabs-auto-dark .commerce-highlight,
html[data-theme="dark"] .budget-teaser,html.lavalabs-auto-dark .budget-teaser{
  background:#c9ff48;color:#11151b;
}
html[data-theme="dark"] .section-head p,html.lavalabs-auto-dark .section-head p,
html[data-theme="dark"] .service-card p,html.lavalabs-auto-dark .service-card p,
html[data-theme="dark"] .price-card p,html.lavalabs-auto-dark .price-card p,
html[data-theme="dark"] .case-copy p,html.lavalabs-auto-dark .case-copy p,
html[data-theme="dark"] .feature-row p,html.lavalabs-auto-dark .feature-row p,
html[data-theme="dark"] .faq-list details p,html.lavalabs-auto-dark .faq-list details p{
  color:#c0cad4;
}
html[data-theme="dark"] .section-dark .section-head p,html.lavalabs-auto-dark .section-dark .section-head p,
html[data-theme="dark"] .section-dark .cta-panel p,html.lavalabs-auto-dark .section-dark .cta-panel p{color:#c5ced8}
html[data-theme="dark"] .service-link,html.lavalabs-auto-dark .service-link,
html[data-theme="dark"] .case-copy a,html.lavalabs-auto-dark .case-copy a{color:#d4ff67}
html[data-theme="dark"] .case-visual.light,html.lavalabs-auto-dark .case-visual.light{background:linear-gradient(145deg,#252d36,#161d26);color:#f4f7fb}
html[data-theme="dark"] .subnav a,html.lavalabs-auto-dark .subnav a{
  background:#171e27;color:#f4f7fb;border-color:#2c3540;
}
html[data-theme="dark"] .floating-contact,html.lavalabs-auto-dark .floating-contact,
html[data-theme="dark"] .back-top-main,html.lavalabs-auto-dark .back-top-main{box-shadow:0 15px 36px rgba(0,0,0,.34)}
@media(max-width:1020px){
  .theme-toggle:not(.mobile-theme-toggle){margin-left:auto}
  .nav .theme-toggle + .menu-toggle{margin-left:0}
  .hero-grid{grid-template-columns:1fr}
  .ll-home-flow-grid{grid-template-columns:1fr 1fr}
  .ll-home-flow-title{grid-column:1/-1}
}
@media(max-width:680px){
  .container{width:min(calc(100% - 28px),var(--max))}
  .nav{height:74px}.brand-mark{width:38px;height:38px}.theme-toggle{width:42px;height:42px}
  .hero{padding:62px 0 58px}
  .hero h1{font-size:clamp(38px,12vw,50px);line-height:1.08;letter-spacing:-.045em}
  .hero-lead{font-size:15px;line-height:1.85}
  .hero-proof-list{grid-template-columns:1fr;gap:8px;margin-top:20px}
  .hero-proof-list span{min-height:48px}
  .hero-actions{gap:9px;margin-top:24px}
  .stage-window{border-radius:22px}.stage-content{min-height:360px;padding:16px}
  .stage-card.web{inset:16px 16px auto;padding:18px}.stage-card.web h3{font-size:22px}
  .stage-card.store{left:16px;bottom:16px;width:48%;padding:15px}
  .stage-card.auto{right:16px;bottom:16px;width:46%;padding:15px}
  .ll-home-flow{padding:30px 0}.ll-home-flow-grid{grid-template-columns:1fr;gap:0}
  .ll-home-flow-step{border-left:0;border-top:1px solid var(--line);padding:16px 0}
  .service-card,.price-card,.problem-card{border-radius:20px}
  .service-card h3{margin-top:42px}
  .floating-contact{bottom:84px}
}
`;
  document.head.appendChild(style);

  function themeButton(extraClass = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `theme-toggle ${extraClass}`.trim();
    button.innerHTML = `
      <svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><circle class="moon-disc" cx="11.5" cy="12" r="7.4"/><circle class="moon-cutout" cx="14.8" cy="9.5" r="7.4"/></svg>
      <svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
    button.addEventListener("click", () => {
      const next = effectiveTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      root.classList.remove("lavalabs-auto-dark");
      localStorage.setItem("lavalabs-theme", next);
      syncThemeState();
    });
    return button;
  }

  function mountThemeControls() {
    const nav = $(".nav");
    if (nav && !$(".nav > .theme-toggle", nav)) {
      const toggle = themeButton();
      const cta = $(".nav-cta", nav);
      const menu = $(".menu-toggle", nav);
      nav.insertBefore(toggle, cta || menu || null);
    }
    syncThemeState();
  }

  function enhanceHome() {
    if (!["", "index.html"].includes(path)) return;
    const lead = $(".hero-lead");
    if (lead && !$(".hero-proof-list")) {
      lead.insertAdjacentHTML(
        "afterend",
        `<div class="hero-proof-list" aria-label="라바랩스 작업 원칙">
          <span>상담 후 필요한 범위만 제안</span>
          <span>촬영·웹·자동화를 한 흐름으로 연결</span>
          <span>모바일 화면과 실제 운영을 우선 검수</span>
        </div>`
      );
    }
    const trust = $(".trust-strip");
    if (trust && !$("#ll-home-flow")) {
      trust.insertAdjacentHTML(
        "afterend",
        `<section class="ll-home-flow" id="ll-home-flow">
          <div class="container ll-home-flow-grid">
            <div class="ll-home-flow-title"><small>PROJECT FLOW</small><strong>작게 시작해<br>운영까지 이어집니다.</strong></div>
            <div class="ll-home-flow-step"><b>01</b><strong>현황 진단</strong><span>매장, 상품, 운영 업무에서 가장 급한 문제를 먼저 정리합니다.</span></div>
            <div class="ll-home-flow-step"><b>02</b><strong>범위 설계</strong><span>예산 안에서 웹, 촬영, QR, 자동화 중 우선순위를 정합니다.</span></div>
            <div class="ll-home-flow-step"><b>03</b><strong>제작·검수</strong><span>모바일 화면과 실제 업무 흐름을 기준으로 결과물을 점검합니다.</span></div>
            <div class="ll-home-flow-step"><b>04</b><strong>운영 개선</strong><span>오픈 이후 필요한 수정과 다음 확장 방향을 함께 봅니다.</span></div>
          </div>
        </section>`
      );
    }
  }

  mq.addEventListener?.("change", syncThemeState);
  mountThemeControls();
  enhanceHome();
})();
