(() => {
  const PAGE = "lavaspin.html";
  const CONTACT_EMAIL = "space@lavalabs.co.kr";
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const style = document.createElement("style");
  style.textContent = `
    .lavaspin-callout{padding:0 0 110px;background:#e9eae4}
    .lavaspin-callout-panel{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;padding:34px;border-radius:26px;background:#11161d;color:#fff;box-shadow:0 24px 60px rgba(13,17,23,.14)}
    .lavaspin-callout-panel small{color:#c9ff48;font-size:10px;font-weight:900;letter-spacing:.12em}
    .lavaspin-callout-panel h2{margin:10px 0 8px;font-size:clamp(28px,4vw,45px);line-height:1.1;letter-spacing:-.045em}
    .lavaspin-callout-panel p{max-width:720px;margin:0;color:#bdc5ce;font-size:12px}
    .lavaspin-beta-card{position:relative;overflow:hidden}
    .lavaspin-beta-card:after{content:"BETA";position:absolute;right:18px;top:18px;padding:5px 8px;border-radius:999px;background:#c9ff48;color:#111;font-size:8px;font-weight:900}
    .lavaspin-product-banner{padding:0 0 80px;background:linear-gradient(180deg,#e8eae2,#f4f4ef)}
    .lavaspin-product-banner .inner{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;padding:28px 30px;border:1px solid #d7ddd0;border-radius:23px;background:#fff}
    .lavaspin-product-banner small{color:#718100;font-size:9px;font-weight:900;letter-spacing:.12em}
    .lavaspin-product-banner h2{margin:8px 0 6px;font-size:27px;letter-spacing:-.04em}
    .lavaspin-product-banner p{margin:0;color:#66707c;font-size:12px}
    @media(max-width:760px){
      .lavaspin-callout{padding-bottom:80px}
      .lavaspin-callout-panel,.lavaspin-product-banner .inner{grid-template-columns:1fr}
      .lavaspin-callout-panel .button,.lavaspin-product-banner .button{width:100%}
    }
  `;
  document.head.appendChild(style);

  function createNavLink({ mobile = false } = {}) {
    const link = document.createElement("a");
    link.href = PAGE;
    if (mobile) {
      link.className = "mobile-sub";
      link.textContent = "LavaSpin 베타";
    } else {
      link.innerHTML = '<span class="dropdown-icon">BETA</span><span><strong>LavaSpin 베타</strong><small>사진·영상으로 360° 자동 생성</small></span>';
    }
    return link;
  }

  function addNavigation() {
    const desktop = q(".dropdown-menu");
    if (desktop && !q(`a[href="${PAGE}"]`, desktop)) {
      const anchor = q('a[href="product-spin.html"]', desktop) || q('a[href="space.html"]', desktop);
      anchor?.insertAdjacentElement("afterend", createNavLink());
    }

    const mobile = q(".mobile-menu");
    if (mobile && !q(`a[href="${PAGE}"]`, mobile)) {
      const anchor = q('a[href="product-spin.html"]', mobile) || q('a[href="space.html"]', mobile);
      anchor?.insertAdjacentElement("afterend", createNavLink({ mobile: true }));
    }

    qa(".footer-links").forEach((box) => {
      const links = qa("a", box);
      if (!links.some((link) => ["product-spin.html", "space.html"].includes(link.getAttribute("href")))) return;
      if (links.some((link) => link.getAttribute("href") === PAGE)) return;
      const link = document.createElement("a");
      link.href = PAGE;
      link.textContent = "LavaSpin 360° 자동 생성 베타";
      const anchor = links.find((item) => item.getAttribute("href") === "product-spin.html") || links.find((item) => item.getAttribute("href") === "space.html");
      anchor?.insertAdjacentElement("afterend", link);
    });
  }

  function addHomeCallout() {
    if (path !== "index.html") return;
    const services = q("#services");
    if (!services || q(".lavaspin-callout")) return;
    const section = document.createElement("section");
    section.className = "lavaspin-callout";
    section.innerHTML = `
      <div class="container">
        <div class="lavaspin-callout-panel">
          <div>
            <small>NEW · LAVASPIN BETA</small>
            <h2>사진이나 영상을 올리면<br>360° 상품 뷰로.</h2>
            <p>직접 촬영한 사진 묶음이나 회전 영상을 업로드해 상품용 360° 뷰를 만드는 구독형 서비스와 전용 회전판을 준비하고 있습니다.</p>
          </div>
          <a class="button button-primary" href="${PAGE}">베타 서비스 보기</a>
        </div>
      </div>`;
    services.insertAdjacentElement("afterend", section);
  }

  function createServiceCard() {
    const card = document.createElement("a");
    card.className = "service-card dark lavaspin-beta-card";
    card.href = PAGE;
    card.innerHTML = `
      <span class="service-no">SAAS · LAVASPIN</span>
      <h3>360° 상품 뷰 자동 생성</h3>
      <p>제품 사진 여러 장 또는 회전 영상을 올리면 자동 정렬·최적화해 공유 링크와 삽입 코드를 만드는 구독형 서비스입니다.</p>
      <ul>
        <li>사진·영상 업로드</li>
        <li>자동 정렬·WebP 최적화</li>
        <li>회전판 별도 판매 예정</li>
      </ul>
      <span class="service-link">베타 알아보기 →</span>`;
    return card;
  }

  function addServicesCard() {
    if (path !== "services.html") return;
    const grid = q(".section-muted .service-grid");
    if (!grid || q(`a[href="${PAGE}"]`, grid)) return;
    grid.classList.add("product-spin-grid");
    grid.appendChild(createServiceCard());
  }

  function addPricingCard() {
    if (path !== "pricing.html") return;
    const grid = q(".price-grid");
    if (!grid || q("[data-lavaspin-price]", grid)) return;
    grid.classList.add("product-spin-grid");
    const card = document.createElement("article");
    card.className = "price-card";
    card.dataset.lavaspinPrice = "true";
    card.innerHTML = `
      <span class="badge">LAVASPIN BETA</span>
      <h3>360° 자동 생성 구독</h3>
      <div class="price" style="font-size:30px">9,900<small>원 / 월 예상</small></div>
      <p>사진·영상 업로드로 상품용 360° 뷰를 직접 만드는 서비스입니다.</p>
      <ul>
        <li>Starter 예상 요금</li>
        <li>활성 상품 20개 기준안</li>
        <li>정식 출시 시 변경 가능</li>
      </ul>
      <a class="button button-dark" href="${PAGE}#beta">베타 관심 등록</a>`;
    grid.appendChild(card);
  }

  function addProductSpinBanner() {
    if (path !== "product-spin.html" || q(".lavaspin-product-banner")) return;
    const hero = q(".spin-hero");
    if (!hero) return;
    const section = document.createElement("section");
    section.className = "lavaspin-product-banner";
    section.innerHTML = `
      <div class="container">
        <div class="inner">
          <div><small>직접 반복 촬영할 계획인가요?</small><h2>LavaSpin 자동 생성 베타</h2><p>제품 사진이나 회전 영상을 직접 올려 360° 뷰를 만드는 구독형 서비스와 회전판을 준비하고 있습니다.</p></div>
          <a class="button button-dark" href="${PAGE}">베타 알아보기</a>
        </div>
      </div>`;
    hero.insertAdjacentElement("afterend", section);
  }

  function addSitemapLink() {
    if (path !== "sitemap.html") return;
    const allLinks = qa("a");
    if (allLinks.some((link) => link.getAttribute("href") === PAGE)) return;
    const anchor = allLinks.find((link) => link.getAttribute("href") === "product-spin.html") || allLinks.find((link) => link.getAttribute("href") === "space.html");
    if (!anchor) return;
    const link = anchor.cloneNode(true);
    link.href = PAGE;
    const first = q("span", link);
    if (first) first.textContent = "LavaSpin 360° 자동 생성 베타";
    anchor.insertAdjacentElement("afterend", link);
  }

  function setupBetaForm() {
    const form = q("#lavaspin-form");
    if (!form) return;
    const status = q("#lavaspin-status");
    const featureInputs = qa('input[name="features"]', form);

    const validateFeatures = () => {
      const valid = featureInputs.some((input) => input.checked);
      featureInputs[0]?.setCustomValidity(valid ? "" : "관심 기능을 하나 이상 선택해 주세요.");
      return valid;
    };
    featureInputs.forEach((input) => input.addEventListener("change", validateFeatures));

    const buildBody = () => {
      const data = new FormData(form);
      const value = (name) => String(data.get(name) || "-").trim() || "-";
      const values = (name) => data.getAll(name).map(String).filter(Boolean).join(", ") || "-";
      return `LavaSpin 베타 관심 등록\n\n[기본 정보]\n성함/담당자: ${value("name")}\n업체/브랜드명: ${value("company")}\n이메일: ${value("email")}\n연락처: ${value("phone")}\n\n[상품 운영]\n업종/제품 종류: ${value("category")}\n한 달 등록 제품 수: ${value("monthlyProducts")}\n선호 업로드 방식: ${value("uploadType")}\n관심 구독 플랜: ${value("plan")}\n\n[관심 기능]\n${values("features")}\n\n회전판 관심도: ${value("turntable")}\n\n[불편한 점 또는 기대 기능]\n${value("message")}\n\n※ 베타 관심 등록은 구매 또는 유료 구독 계약이 아닙니다.\n※ 출시 일정과 최종 요금은 확정 후 별도로 안내합니다.`;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      validateFeatures();
      if (!form.reportValidity()) return;
      const company = new FormData(form).get("company");
      const subject = encodeURIComponent(`[LavaSpin 베타] 관심 등록${company ? ` - ${company}` : ""}`);
      location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(buildBody())}`;
      if (status) status.textContent = "이메일 앱을 여는 중입니다.";
    });

    q("#lavaspin-copy")?.addEventListener("click", async () => {
      validateFeatures();
      if (!form.reportValidity()) return;
      try {
        await navigator.clipboard.writeText(buildBody());
        if (status) status.textContent = "베타 신청 내용이 복사되었습니다.";
      } catch {
        if (status) status.textContent = "복사에 실패했습니다. 입력 내용을 직접 선택해 주세요.";
      }
    });
  }

  addNavigation();
  addHomeCallout();
  addServicesCard();
  addPricingCard();
  addProductSpinBanner();
  addSitemapLink();
  setupBetaForm();
})();