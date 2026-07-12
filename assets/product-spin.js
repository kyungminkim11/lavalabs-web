(() => {
  const SERVICE_NAME = "360° 제품 스핀 제작";
  const CONTACT_EMAIL = "info@lavalabs.co.kr";
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const style = document.createElement("style");
  style.textContent = `
    .service-grid.product-spin-grid,
    .price-grid.product-spin-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
    .spin-contact-fields{display:none;grid-column:1/-1;padding:22px;border:1px solid #ffffff2c;border-radius:18px;background:#ffffff08}
    .spin-contact-fields.is-visible{display:block}
    .spin-contact-fields h3{margin:0 0 6px;color:#fff;font-size:18px}
    .spin-contact-fields>p{margin:0 0 18px;color:#aeb5be;font-size:12px}
    .spin-contact-fields .form-grid+.form-grid{margin-top:14px}
    .spin-demo-stage{touch-action:none;user-select:none}
    .spin-demo-stage.is-dragging{cursor:grabbing}
    @media(max-width:680px){
      .spin-contact-fields{padding:18px}
    }
  `;
  document.head.appendChild(style);

  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function addNavigationLinks() {
    const desktopMenu = q(".dropdown-menu");
    if (desktopMenu && !q('a[href="product-spin.html"]', desktopMenu)) {
      const link = document.createElement("a");
      link.href = "product-spin.html";
      link.innerHTML = '<span class="dropdown-icon">SPIN</span><span><strong>360° 제품 스핀</strong><small>상품 회전 촬영·웹 뷰어</small></span>';
      const spaceLink = q('a[href="space.html"]', desktopMenu);
      spaceLink?.insertAdjacentElement("afterend", link);
    }

    const mobileMenu = q(".mobile-menu");
    if (mobileMenu && !q('a[href="product-spin.html"]', mobileMenu)) {
      const link = document.createElement("a");
      link.className = "mobile-sub";
      link.href = "product-spin.html";
      link.textContent = "360° 제품 스핀";
      const spaceLink = q('a[href="space.html"]', mobileMenu);
      spaceLink?.insertAdjacentElement("afterend", link);
    }

    qa(".footer-links").forEach((box) => {
      const serviceLinks = qa("a", box);
      if (!serviceLinks.some((a) => a.getAttribute("href") === "space.html")) return;
      if (serviceLinks.some((a) => a.getAttribute("href") === "product-spin.html")) return;
      const link = document.createElement("a");
      link.href = "product-spin.html";
      link.textContent = "360° 제품 스핀 제작";
      const spaceLink = serviceLinks.find((a) => a.getAttribute("href") === "space.html");
      spaceLink?.insertAdjacentElement("afterend", link);
    });
  }

  function makeServiceCard() {
    const link = document.createElement("a");
    link.className = "service-card reveal";
    link.href = "product-spin.html";
    link.innerHTML = `
      <span class="service-no">PRODUCT · 360 SPIN</span>
      <h3>제품을 직접 돌려보는 상품 콘텐츠</h3>
      <p>제품을 일정 각도로 촬영해 마우스와 손가락으로 회전해 볼 수 있는 인터랙티브 상품 뷰어를 제작합니다.</p>
      <ul>
        <li>24·36·48·72컷 촬영</li>
        <li>WebP 이미지 세트</li>
        <li>웹 뷰어·사이트 삽입</li>
      </ul>
      <span class="service-link">제품 스핀 보기 →</span>
    `;
    return link;
  }

  function addServiceCards() {
    if (path === "index.html") {
      const grid = q("#services .service-grid");
      if (grid && !q('a[href="product-spin.html"]', grid)) {
        grid.classList.add("product-spin-grid");
        grid.appendChild(makeServiceCard());
      }
    }

    if (path === "services.html") {
      const grid = q(".section-muted .service-grid");
      if (grid && !q('a[href="product-spin.html"]', grid)) {
        grid.classList.add("product-spin-grid");
        grid.appendChild(makeServiceCard());
      }
    }

    if (path === "pricing.html") {
      const grid = q(".price-grid");
      if (grid && !q('[data-product-spin-price]', grid)) {
        grid.classList.add("product-spin-grid");
        const card = document.createElement("article");
        card.className = "price-card";
        card.dataset.productSpinPrice = "true";
        card.innerHTML = `
          <span class="badge">PRODUCT SPIN</span>
          <h3>360° 제품 스핀</h3>
          <div class="price" style="font-size:30px">별도<small> 견적</small></div>
          <ul>
            <li>제품 수·크기·재질 기준</li>
            <li>24~72컷 회전 촬영</li>
            <li>웹 뷰어·호스팅 선택</li>
          </ul>
          <a class="button button-dark" data-service="${SERVICE_NAME}" href="contact.html">상담하기</a>
        `;
        grid.appendChild(card);
      }
    }
  }

  function addContactOption() {
    const typeSelect = q("#type");
    if (!typeSelect) return;

    if (!qa("option", typeSelect).some((option) => option.value === SERVICE_NAME || option.textContent.trim() === SERVICE_NAME)) {
      const option = document.createElement("option");
      option.value = SERVICE_NAME;
      option.textContent = SERVICE_NAME;
      const spaceOption = qa("option", typeSelect).find((item) => item.textContent.includes("360 가상투어"));
      spaceOption?.insertAdjacentElement("afterend", option);
    }

    const saved = sessionStorage.getItem("service");
    if (saved === SERVICE_NAME) typeSelect.value = SERVICE_NAME;

    const form = q("#contact-form");
    if (!form || q("#spin-contact-fields", form)) return;

    const extra = document.createElement("div");
    extra.id = "spin-contact-fields";
    extra.className = "spin-contact-fields";
    extra.innerHTML = `
      <h3>360° 제품 스핀 상세 정보</h3>
      <p>아래 정보가 있으면 촬영 방식과 견적을 더 정확하게 안내할 수 있습니다.</p>
      <div class="form-grid">
        <label><span>제품 종류 *</span>
          <select name="spinProductType">
            <option value="">선택해 주세요</option>
            <option>홈·리빙 소품</option>
            <option>화장품·향수</option>
            <option>주얼리·액세서리</option>
            <option>전자기기·소형 가전</option>
            <option>식품·패키지</option>
            <option>의류·패션 소품</option>
            <option>생활용품·공예품</option>
            <option>기타</option>
          </select>
        </label>
        <label><span>제품명 / 모델명</span><input name="spinProductName" placeholder="예: 프리미엄 블렌드 티 기프트 세트"></label>
      </div>
      <div class="form-grid">
        <label><span>촬영 제품 수 *</span><input name="spinProductCount" type="number" min="1" inputmode="numeric" placeholder="예: 5"></label>
        <label><span>제품당 회전 컷수 *</span>
          <select name="spinFrames">
            <option value="">선택해 주세요</option>
            <option>24컷</option>
            <option>36컷</option>
            <option>48컷</option>
            <option>72컷</option>
            <option>상담 후 결정</option>
          </select>
        </label>
      </div>
      <div class="form-grid">
        <label><span>희망 마감일 *</span><input name="spinDeadline" type="date"></label>
        <label><span>납품 범위</span>
          <select name="spinDeliverable">
            <option>이미지 세트만</option>
            <option>인터랙티브 웹 뷰어 포함</option>
            <option>기존 홈페이지 삽입 포함</option>
            <option>별도 상품 페이지 제작 포함</option>
            <option>상담 후 결정</option>
          </select>
        </label>
      </div>
      <label><span>재질·크기·반사·투명 여부 등 기타 조건</span>
        <textarea name="spinConditions" rows="4" placeholder="예: 유광 패키지, 투명 용기, 높이 140mm, 흰 배경 희망, 택배 전달 예정"></textarea>
      </label>
    `;

    const messageLabel = q('textarea[name="message"]', form)?.closest("label");
    messageLabel?.insertAdjacentElement("beforebegin", extra);

    const requiredSelectors = [
      '[name="spinProductType"]',
      '[name="spinProductCount"]',
      '[name="spinFrames"]',
      '[name="spinDeadline"]'
    ];

    const sync = () => {
      const visible = typeSelect.value === SERVICE_NAME;
      extra.classList.toggle("is-visible", visible);
      requiredSelectors.forEach((selector) => {
        const field = q(selector, extra);
        if (field) field.required = visible;
      });
    };

    typeSelect.addEventListener("change", sync);
    sync();

    const buildBody = () => {
      const data = new FormData(form);
      const value = (name) => String(data.get(name) || "-").trim() || "-";
      return `LavaLabs 360° 제품 스핀 제작 문의

문의 유형: ${value("type")}
성함/담당자: ${value("name")}
업체/브랜드명: ${value("company")}
연락처: ${value("phone")}
이메일: ${value("email")}
예산: ${value("budget")}
희망 일정: ${value("schedule")}

[제품 스핀 정보]
제품 종류: ${value("spinProductType")}
제품명/모델명: ${value("spinProductName")}
촬영 제품 수: ${value("spinProductCount")}
제품당 회전 컷수: ${value("spinFrames")}
희망 마감일: ${value("spinDeadline")}
납품 범위: ${value("spinDeliverable")}
기타 조건: ${value("spinConditions")}

[요청 내용]
${value("message")}

※ 제품의 크기, 재질, 반사·투명 여부와 촬영 난이도에 따라 견적이 달라질 수 있습니다.
※ 사업자 거래 및 세금계산서 발행이 가능합니다.`;
    };

    form.addEventListener("submit", (event) => {
      if (typeSelect.value !== SERVICE_NAME) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const subject = encodeURIComponent(`[LavaLabs 문의] ${SERVICE_NAME}`);
      const body = encodeURIComponent(buildBody());
      location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      const status = q("#form-status");
      if (status) status.textContent = "이메일 앱을 여는 중입니다.";
    }, true);

    const copyButton = q("#copy-inquiry");
    copyButton?.addEventListener("click", async (event) => {
      if (typeSelect.value !== SERVICE_NAME) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const status = q("#form-status");
      try {
        await navigator.clipboard.writeText(buildBody());
        if (status) status.textContent = "360° 제품 스핀 문의 내용이 복사되었습니다.";
      } catch {
        if (status) status.textContent = "복사에 실패했습니다. 입력 내용을 직접 선택해 주세요.";
      }
    }, true);
  }

  function setupDedicatedForm() {
    const form = q("#product-spin-form");
    if (!form) return;

    const buildBody = () => {
      const data = new FormData(form);
      const value = (name) => String(data.get(name) || "-").trim() || "-";
      const values = (name) => data.getAll(name).map(String).filter(Boolean).join(", ") || "-";
      return `LavaLabs 360° 제품 스핀 제작 문의

[담당자 정보]
성함/담당자: ${value("name")}
업체/브랜드명: ${value("company")}
연락처: ${value("phone")}
이메일: ${value("email")}
예산: ${value("budget")}

[제품 정보]
제품 종류: ${value("productType")}
제품명/모델명: ${value("productName")}
촬영 제품 수: ${value("productCount")}
제품당 회전 컷수: ${value("frameCount")}
희망 마감일: ${value("deadline")}
제품 크기/무게: ${value("productSize")}
제품 재질: ${value("material")}
배경 스타일: ${value("background")}
제품 전달 방식: ${value("transfer")}

[활용 및 납품]
사용 채널: ${values("usage")}
필요한 납품 범위: ${values("deliverables")}
참고 링크: ${value("reference")}

[기타 조건]
${value("conditions")}

※ 제품의 크기, 재질, 반사·투명 여부와 촬영 난이도에 따라 견적이 달라질 수 있습니다.
※ 사업자 거래 및 세금계산서 발행이 가능합니다.`;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const company = new FormData(form).get("company");
      const subject = encodeURIComponent(`[LavaLabs 문의] ${SERVICE_NAME}${company ? ` - ${company}` : ""}`);
      location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(buildBody())}`;
      const status = q("#product-spin-status");
      if (status) status.textContent = "이메일 앱을 여는 중입니다.";
    });

    q("#product-spin-copy")?.addEventListener("click", async () => {
      if (!form.reportValidity()) return;
      const status = q("#product-spin-status");
      try {
        await navigator.clipboard.writeText(buildBody());
        if (status) status.textContent = "문의 내용이 복사되었습니다.";
      } catch {
        if (status) status.textContent = "복사에 실패했습니다. 입력 내용을 직접 선택해 주세요.";
      }
    });
  }

  function setupDemo() {
    const stage = q(".spin-demo-stage");
    const product = q(".spin-demo-product");
    const angleLabel = q(".spin-demo-angle");
    if (!stage || !product) return;

    let angle = 18;
    let dragging = false;
    let startX = 0;
    let startAngle = angle;

    const render = () => {
      product.style.setProperty("--spin-angle", `${angle}deg`);
      if (angleLabel) angleLabel.textContent = `${Math.round(((angle % 360) + 360) % 360)}°`;
    };

    const down = (event) => {
      dragging = true;
      startX = event.clientX;
      startAngle = angle;
      stage.classList.add("is-dragging");
      stage.setPointerCapture?.(event.pointerId);
    };

    const move = (event) => {
      if (!dragging) return;
      angle = startAngle + (event.clientX - startX) * 0.8;
      render();
    };

    const up = (event) => {
      dragging = false;
      stage.classList.remove("is-dragging");
      stage.releasePointerCapture?.(event.pointerId);
    };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    render();
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest('[data-service="360° 제품 스핀 제작"]');
    if (link) sessionStorage.setItem("service", SERVICE_NAME);
  });

  addNavigationLinks();
  addServiceCards();
  addContactOption();
  setupDedicatedForm();
  setupDemo();
})();