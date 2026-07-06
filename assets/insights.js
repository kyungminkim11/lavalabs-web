(() => {
  const SITE_URL = "https://space.lavalabs.co.kr";
  const IMAGE = `${SITE_URL}/assets/lavalabs-social-preview.png`;
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const contentPages = {
    "insights.html": {
      title: "소상공인 웹·360 촬영·자동화 가이드 | LavaLabs",
      description: "홈페이지 제작, 360 가상투어, 제품 스핀 촬영과 매장 업무 자동화를 준비하는 소상공인과 브랜드를 위한 실무 가이드입니다.",
      name: "인사이트·가이드",
      type: "CollectionPage"
    },
    "guide-360-product-photography.html": {
      title: "360도 제품 촬영 방법과 적정 컷수 가이드 | LavaLabs",
      description: "회전판과 스마트폰으로 360도 제품 사진을 촬영하는 방법, 24·36·48·72컷 차이, 조명·중심 정렬과 웹 뷰어 제작 과정을 설명합니다.",
      name: "360도 제품 촬영 가이드",
      type: "Article"
    },
    "guide-360-virtual-tour.html": {
      title: "360 가상투어 제작 전 준비사항과 활용법 | LavaLabs",
      description: "매장, 사무실, 파티룸과 팝업스토어의 360 가상투어를 제작하기 전에 준비할 공간 정리, 촬영 지점, 핫스팟과 활용 채널을 안내합니다.",
      name: "360 가상투어 제작 가이드",
      type: "Article"
    },
    "guide-small-business-website.html": {
      title: "소상공인 홈페이지 제작 전 준비 체크리스트 | LavaLabs",
      description: "소상공인과 매장이 홈페이지를 만들기 전에 정해야 할 목표, 페이지 구성, 사진, 문의 방식, 도메인, 유지관리와 예산 범위를 정리했습니다.",
      name: "소상공인 홈페이지 제작 가이드",
      type: "Article"
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    .insight-home{padding:95px 0;background:#11161d;color:#fff}
    .insight-home-head{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:30px}
    .insight-home-head h2{margin:11px 0 0;font-size:clamp(34px,5vw,58px);line-height:1.07;letter-spacing:-.055em}
    .insight-home-head p{max-width:520px;margin:0;color:#bbc4cd;font-size:12px}
    .insight-home-grid,.guide-link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    .insight-home-card{display:flex;flex-direction:column;min-height:270px;padding:25px;border:1px solid #ffffff18;border-radius:23px;background:#ffffff08;transition:.22s}
    .insight-home-card:hover{transform:translateY(-4px);border-color:#c9ff48}
    .insight-home-card small{color:#c9ff48;font-size:9px;font-weight:900;letter-spacing:.12em}
    .insight-home-card h3{margin:58px 0 10px;font-size:23px;line-height:1.25}
    .insight-home-card p{margin:0;color:#bbc4cd;font-size:11px}
    .insight-home-card span{margin-top:auto;padding-top:18px;color:#c9ff48;font-size:11px;font-weight:900}
    .guide-service-link{padding:65px 0;background:#f4f4ef}
    .guide-service-panel{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;padding:28px 30px;border:1px solid #dfe1db;border-radius:23px;background:#fff}
    .guide-service-panel small{color:#718100;font-size:9px;font-weight:900;letter-spacing:.12em}
    .guide-service-panel h2{margin:8px 0 6px;font-size:27px;letter-spacing:-.04em}
    .guide-service-panel p{margin:0;color:#66707c;font-size:12px}
    @media(max-width:780px){.insight-home{padding:72px 0}.insight-home-head{display:block}.insight-home-head p{margin-top:14px}.insight-home-grid,.guide-link-grid{grid-template-columns:1fr}.insight-home-card{min-height:220px}.guide-service-panel{grid-template-columns:1fr}.guide-service-panel .button{width:100%}}
  `;
  document.head.appendChild(style);

  function addNavigation() {
    const desktop = q(".desktop-nav");
    if (desktop && !q('a[href="insights.html"]', desktop)) {
      const link = document.createElement("a");
      link.href = "insights.html";
      link.textContent = "인사이트";
      const portfolio = q('a[href="portfolio.html"]', desktop);
      portfolio?.insertAdjacentElement("beforebegin", link);
    }

    const mobile = q(".mobile-menu");
    if (mobile && !q('a[href="insights.html"]', mobile)) {
      const link = document.createElement("a");
      link.href = "insights.html";
      link.textContent = "인사이트·가이드";
      const portfolio = q('a[href="portfolio.html"]', mobile);
      portfolio?.insertAdjacentElement("beforebegin", link);
    }

    qa(".footer-links").forEach((box) => {
      const links = qa("a", box);
      if (!links.some((link) => link.getAttribute("href") === "web.html")) return;
      if (links.some((link) => link.getAttribute("href") === "insights.html")) return;
      const link = document.createElement("a");
      link.href = "insights.html";
      link.textContent = "인사이트·실무 가이드";
      box.appendChild(link);
    });
  }

  function addHomeSection() {
    if (page !== "index.html" || q(".insight-home")) return;
    const anchor = q(".lavaspin-callout") || q("#services");
    if (!anchor) return;
    const section = document.createElement("section");
    section.className = "insight-home";
    section.innerHTML = `
      <div class="container">
        <div class="insight-home-head">
          <div><span class="eyebrow">PRACTICAL GUIDES</span><h2>제작 전에 읽어보는<br>실무 가이드</h2></div>
          <p>서비스 홍보 문구보다 실제로 준비해야 하는 내용과 선택 기준을 먼저 설명합니다.</p>
        </div>
        <div class="insight-home-grid">
          <a class="insight-home-card" href="guide-360-product-photography.html"><small>PRODUCT · 360</small><h3>360도 제품 촬영 방법과 적정 컷수</h3><p>회전판, 조명, 스마트폰 촬영과 24~72컷의 차이를 정리했습니다.</p><span>가이드 읽기 →</span></a>
          <a class="insight-home-card" href="guide-360-virtual-tour.html"><small>SPACE · 360</small><h3>360 가상투어 제작 전 준비사항</h3><p>촬영 지점, 공간 정리, 개인정보와 핫스팟 구성을 안내합니다.</p><span>가이드 읽기 →</span></a>
          <a class="insight-home-card" href="guide-small-business-website.html"><small>WEB · START</small><h3>소상공인 홈페이지 제작 체크리스트</h3><p>목표, 메뉴, 사진, 문의 방식과 유지관리를 제작 전에 정리합니다.</p><span>가이드 읽기 →</span></a>
        </div>
      </div>`;
    anchor.insertAdjacentElement("afterend", section);
  }

  function addSitemapLink() {
    if (page !== "sitemap.html") return;
    const links = qa("a");
    if (links.some((link) => link.getAttribute("href") === "insights.html")) return;
    const anchor = links.find((link) => link.getAttribute("href") === "portfolio.html");
    if (!anchor) return;
    const link = anchor.cloneNode(true);
    link.href = "insights.html";
    const label = q("span", link);
    if (label) label.textContent = "인사이트·실무 가이드";
    anchor.insertAdjacentElement("beforebegin", link);
  }

  const serviceGuideMap = {
    "web.html": ["guide-small-business-website.html", "홈페이지를 만들기 전에 먼저 정리할 내용"],
    "commerce.html": ["guide-360-product-photography.html", "상품 페이지에서 제품을 더 자세히 보여주는 방법"],
    "space.html": ["guide-360-virtual-tour.html", "360 가상투어 촬영 전에 준비할 내용"],
    "space-rental.html": ["guide-360-virtual-tour.html", "대관 공간의 가상투어 준비 체크리스트"],
    "space-fashion-popup.html": ["guide-360-virtual-tour.html", "팝업스토어 촬영과 온라인 활용 방법"],
    "product-spin.html": ["guide-360-product-photography.html", "360도 제품 촬영 방법과 적정 컷수"],
    "lavaspin.html": ["guide-360-product-photography.html", "LavaSpin용 사진과 영상을 촬영하는 방법"]
  };

  function addServiceGuide() {
    const target = serviceGuideMap[page];
    if (!target || q(".guide-service-link")) return;
    const main = q("main");
    const related = q(".seo-related", main);
    if (!main) return;
    const section = document.createElement("section");
    section.className = "guide-service-link";
    section.innerHTML = `<div class="container"><div class="guide-service-panel"><div><small>BEFORE YOU START</small><h2>${target[1]}</h2><p>촬영과 제작을 의뢰하기 전 직접 확인할 수 있는 기준과 준비사항을 정리했습니다.</p></div><a class="button button-dark" href="${target[0]}">가이드 읽기</a></div></div>`;
    if (related) related.insertAdjacentElement("beforebegin", section);
    else main.appendChild(section);
  }

  function setMeta(name, content, property = false) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(property ? "property" : "name", name);
      document.head.appendChild(element);
    }
    element.content = content;
  }

  function optimizeContentPage() {
    const meta = contentPages[page];
    if (!meta) return;
    const url = `${SITE_URL}/${page}`;
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("robots", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta("og:type", meta.type === "Article" ? "article" : "website", true);
    setMeta("og:locale", "ko_KR", true);
    setMeta("og:site_name", "LavaLabs", true);
    setMeta("og:title", meta.title, true);
    setMeta("og:description", meta.description, true);
    setMeta("og:url", url, true);
    setMeta("og:image", IMAGE, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", meta.title);
    setMeta("twitter:description", meta.description);
    setMeta("twitter:image", IMAGE);
    let canonical = q('link[rel="canonical"]', document.head);
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    q('script[data-insight-schema]')?.remove();
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.insightSchema = "true";
    const graph = [
      {
        "@type": meta.type,
        "@id": `${url}#content`,
        headline: meta.name,
        name: meta.name,
        description: meta.description,
        url,
        inLanguage: "ko-KR",
        datePublished: "2026-07-06",
        dateModified: "2026-07-06",
        image: IMAGE,
        author: { "@type": "Organization", name: "LavaLabs", url: `${SITE_URL}/` },
        publisher: { "@type": "Organization", name: "LavaLabs", url: `${SITE_URL}/`, logo: { "@type": "ImageObject", url: IMAGE } }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "인사이트", item: `${SITE_URL}/insights.html` },
          ...(page === "insights.html" ? [] : [{ "@type": "ListItem", position: 3, name: meta.name, item: url }])
        ]
      }
    ];
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(schema);
  }

  addNavigation();
  addHomeSection();
  addSitemapLink();
  addServiceGuide();
  optimizeContentPage();
})();