(() => {
  const SITE_URL = "https://space.lavalabs.co.kr";
  const page = (location.pathname.split("/").pop() || "").toLowerCase();
  const contentPages = {
    "insights.html": "인사이트·가이드",
    "guide-360-product-photography.html": "360도 제품 촬영 가이드",
    "guide-360-virtual-tour.html": "360 가상투어 제작 가이드",
    "guide-small-business-website.html": "소상공인 홈페이지 제작 가이드"
  };
  if (!contentPages[page]) return;

  document.querySelector('script[data-seo-schema]')?.remove();
  document.querySelector(".seo-breadcrumb")?.remove();
  document.querySelector(".seo-related")?.remove();

  const main = document.querySelector("main");
  if (!main) return;

  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "seo-breadcrumb";
  breadcrumb.setAttribute("aria-label", "현재 위치");
  const isHub = page === "insights.html";
  breadcrumb.innerHTML = `<div class="container"><a href="/">홈</a><i>›</i>${isHub ? `<span aria-current="page">인사이트</span>` : `<a href="insights.html">인사이트</a><i>›</i><span aria-current="page">${contentPages[page]}</span>`}</div>`;
  main.insertAdjacentElement("afterbegin", breadcrumb);

  if (!isHub) {
    const guides = [
      ["guide-360-product-photography.html", "PRODUCT · 360", "360도 제품 촬영 방법과 적정 컷수"],
      ["guide-360-virtual-tour.html", "SPACE · 360", "360 가상투어 제작 전 준비사항"],
      ["guide-small-business-website.html", "WEB · START", "소상공인 홈페이지 제작 체크리스트"]
    ].filter(([filename]) => filename !== page);
    const related = document.createElement("section");
    related.className = "seo-related";
    related.innerHTML = `<div class="container"><div class="seo-related-head"><div><span class="eyebrow">MORE GUIDES</span><h2>함께 읽어볼 가이드</h2></div><p>다른 제작 방식과 준비사항도 함께 확인할 수 있습니다.</p></div><div class="seo-related-grid">${guides.map(([filename, category, title]) => `<a class="seo-related-card" href="${filename}"><small>${category}</small><strong>${title}</strong><span>가이드 읽기 →</span></a>`).join("")}<a class="seo-related-card" href="insights.html"><small>ALL CONTENT</small><strong>전체 인사이트 보기</strong><span>목록 보기 →</span></a></div></div>`;
    main.appendChild(related);
  }

  const details = [...document.querySelectorAll(".insight-faq details")];
  if (details.length) {
    document.querySelector('script[data-insight-faq]')?.remove();
    const questions = details.map((detail) => ({
      "@type": "Question",
      name: detail.querySelector("summary")?.textContent.trim() || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: detail.querySelector("p")?.textContent.trim() || ""
      }
    })).filter((item) => item.name && item.acceptedAnswer.text);
    if (questions.length) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.insightFaq = "true";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        url: `${SITE_URL}/${page}`,
        mainEntity: questions
      });
      document.head.appendChild(script);
    }
  }
})();