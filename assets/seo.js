(() => {
  const SITE_URL = "https://space.lavalabs.co.kr";
  const SITE_NAME = "LavaLabs";
  const SOCIAL_IMAGE = `${SITE_URL}/assets/lavalabs-social-preview.png`;
  const ORG_ID = `${SITE_URL}/#organization`;
  const WEBSITE_ID = `${SITE_URL}/#website`;

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const canonicalPath = page === "index.html" ? "/" : `/${page}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  const pages = {
    "index.html": {
      title: "소상공인 웹사이트·360 가상투어·업무 자동화 | LavaLabs",
      description: "라바랩스는 소상공인과 브랜드를 위한 홈페이지 제작, 360 가상투어, 제품 촬영, QR 매장 안내와 엑셀·파이썬 업무 자동화를 제공합니다.",
      type: "WebPage",
      section: "홈",
      related: ["services.html", "portfolio.html", "pricing.html"]
    },
    "services.html": {
      title: "웹·360 가상투어·매장 자동화 서비스 | LavaLabs",
      description: "홈페이지, 쇼핑몰, 360 가상투어, 제품 스핀 촬영, QR 메뉴판, 바코드·재고 시스템과 업무 자동화 서비스를 한눈에 확인하세요.",
      type: "CollectionPage",
      section: "서비스",
      related: ["web.html", "space.html", "automation.html"]
    },
    "web.html": {
      title: "소상공인 홈페이지·랜딩페이지 제작 | LavaLabs",
      description: "소상공인, 매장, 개인 브랜드를 위한 모바일 반응형 홈페이지와 랜딩페이지를 제작합니다. 서비스 소개부터 문의·예약 전환까지 설계합니다.",
      serviceType: "소상공인 홈페이지 및 랜딩페이지 제작",
      section: "웹 제작",
      parent: "services.html",
      related: ["commerce.html", "pricing.html", "contact.html"]
    },
    "commerce.html": {
      title: "소규모 쇼핑몰·상품 페이지 제작 | LavaLabs",
      description: "브랜드와 소상공인을 위한 소규모 쇼핑몰, 상품 소개 페이지, 결제·문의 연결과 모바일 구매 흐름을 제작합니다.",
      serviceType: "쇼핑몰 및 상품 페이지 제작",
      section: "쇼핑몰 제작",
      parent: "services.html",
      related: ["web.html", "product-spin.html", "pricing.html"]
    },
    "space.html": {
      title: "360 가상투어·매장 공간 촬영 제작 | LavaLabs",
      description: "매장, 쇼룸, 사무실, 파티룸과 팝업스토어를 온라인에서 둘러볼 수 있는 360 가상투어와 공간 사진을 제작합니다.",
      serviceType: "360 가상투어 및 공간 촬영",
      section: "공간 콘텐츠",
      parent: "services.html",
      related: ["space-rental.html", "space-fashion-popup.html", "photography.html"]
    },
    "product-spin.html": {
      title: "360도 제품 촬영·상품 스핀 뷰어 제작 | LavaLabs",
      description: "제품을 24~72컷으로 촬영해 마우스와 손가락으로 돌려보는 360도 상품 스핀 이미지와 인터랙티브 웹 뷰어를 제작합니다.",
      serviceType: "360도 제품 촬영 및 상품 스핀 뷰어 제작",
      section: "제품 콘텐츠",
      parent: "services.html",
      related: ["lavaspin.html", "commerce.html", "photography.html"]
    },
    "lavaspin.html": {
      title: "사진·영상으로 360도 상품 뷰 자동 생성 | LavaSpin",
      description: "제품 사진 여러 장이나 회전 영상을 업로드하면 자동 정렬·최적화해 360도 상품 뷰, 공유 링크와 웹 삽입 코드를 만드는 LavaSpin 베타입니다.",
      type: "SoftwareApplication",
      section: "LavaSpin",
      parent: "services.html",
      related: ["product-spin.html", "commerce.html", "contact.html"]
    },
    "space-rental.html": {
      title: "공유오피스·파티룸 360 가상투어 제작 | LavaLabs",
      description: "공유오피스, 스터디룸, 파티룸과 대관 공간의 구조·동선·시설을 방문 전에 확인할 수 있는 360 가상투어를 제작합니다.",
      serviceType: "공유오피스 및 대관 공간 360 가상투어",
      section: "업종별 360 가상투어",
      parent: "space.html",
      related: ["space.html", "photography.html", "pricing.html"]
    },
    "space-fashion-popup.html": {
      title: "의류 브랜드·팝업스토어 360 가상투어 | LavaLabs",
      description: "의류 매장, 브랜드 쇼룸과 팝업스토어의 공간·진열·동선을 온라인으로 보여주는 360 가상투어와 사진 콘텐츠를 제작합니다.",
      serviceType: "패션 매장 및 팝업스토어 360 가상투어",
      section: "업종별 360 가상투어",
      parent: "space.html",
      related: ["space.html", "photography.html", "pov-video.html"]
    },
    "photography.html": {
      title: "매장·공간 사진 촬영 서비스 | LavaLabs",
      description: "홈페이지, 네이버 플레이스, SNS와 홍보물에 활용할 매장·쇼룸·사무실 공간 사진을 촬영하고 기본 색보정을 제공합니다.",
      serviceType: "매장 및 공간 사진 촬영",
      section: "사진 촬영",
      parent: "services.html",
      related: ["space.html", "product-spin.html", "pov-video.html"]
    },
    "pov-video.html": {
      title: "POV 길 안내·매장 방문 동선 영상 제작 | LavaLabs",
      description: "지하철역과 주차장부터 매장 입구까지 고객 시점으로 보여주는 POV 길 안내 영상과 방문 동선 콘텐츠를 제작합니다.",
      serviceType: "POV 길 안내 및 매장 동선 영상 제작",
      section: "영상 제작",
      parent: "services.html",
      related: ["map.html", "photography.html", "space.html"]
    },
    "equipment.html": {
      title: "360 가상투어·공간 촬영 장비 안내 | LavaLabs",
      description: "라바랩스가 360 가상투어, 공간 사진과 POV 영상 제작에 사용하는 촬영 장비와 활용 방식을 확인하세요.",
      type: "WebPage",
      section: "촬영 장비",
      parent: "space.html",
      related: ["space.html", "photography.html", "pov-video.html"]
    },
    "store.html": {
      title: "QR 메뉴판·모바일 매장 안내 제작 | LavaLabs",
      description: "카페, 음식점과 오프라인 매장을 위한 QR 메뉴판, 다국어 모바일 안내, 예약·문의·주문 연결 페이지를 제작합니다.",
      serviceType: "QR 메뉴판 및 모바일 매장 안내 제작",
      section: "매장 솔루션",
      parent: "services.html",
      related: ["map.html", "packages.html", "contact.html"]
    },
    "map.html": {
      title: "매장 안내도·QR 지도 웹 제작 | LavaLabs",
      description: "층별 안내, 구역별 정보, 시설 위치와 상품 진열 구역을 모바일에서 확인하는 인터랙티브 매장 지도와 QR 안내 웹을 제작합니다.",
      serviceType: "매장 안내도 및 QR 지도 웹 제작",
      section: "매장 솔루션",
      parent: "services.html",
      related: ["store.html", "education-guide.html", "operations.html"]
    },
    "operations.html": {
      title: "바코드 상품검색·재고 관리 시스템 제작 | LavaLabs",
      description: "바코드 스캔, 상품명 검색, 가격·옵션 필터와 재고 확인을 빠르게 처리하는 매장용 상품 검색·운영 시스템을 제작합니다.",
      serviceType: "바코드 상품검색 및 재고 관리 시스템",
      section: "매장 운영",
      parent: "services.html",
      related: ["automation.html", "custom-development.html", "education-guide.html"]
    },
    "education-guide.html": {
      title: "직원 교육용 디지털 매뉴얼·안내서 제작 | LavaLabs",
      description: "신입 직원 교육, 매장 운영 절차, 상품 설명과 응대 기준을 모바일에서 확인하는 디지털 매뉴얼과 교육용 웹을 제작합니다.",
      serviceType: "직원 교육용 디지털 매뉴얼 제작",
      section: "매장 운영",
      parent: "services.html",
      related: ["operations.html", "map.html", "custom-development.html"]
    },
    "automation.html": {
      title: "엑셀·파이썬 업무 자동화 제작 | LavaLabs",
      description: "반복 입력, 데이터 정리, 파일 변환, 매출·재고 보고서와 상품 검색 업무를 엑셀과 파이썬 도구로 자동화합니다.",
      serviceType: "엑셀 및 파이썬 업무 자동화",
      section: "업무 자동화",
      parent: "services.html",
      related: ["operations.html", "custom-development.html", "pricing.html"]
    },
    "custom-development.html": {
      title: "맞춤형 웹앱·업무 시스템 개발 | LavaLabs",
      description: "검색, 필터, 관리자, 예약, 데이터 연동과 현장 업무에 필요한 기능을 분석해 맞춤형 웹앱과 내부 시스템을 개발합니다.",
      serviceType: "맞춤형 웹앱 및 업무 시스템 개발",
      section: "맞춤 개발",
      parent: "services.html",
      related: ["web.html", "automation.html", "operations.html"]
    },
    "packages.html": {
      title: "소상공인 매장 디지털 전환 패키지 | LavaLabs",
      description: "홈페이지, QR 안내, 매장 사진, 360 가상투어와 업무 자동화를 매장 상황에 맞춰 묶는 소상공인 디지털 전환 패키지입니다.",
      serviceType: "소상공인 매장 디지털 전환 패키지",
      section: "서비스 패키지",
      parent: "services.html",
      related: ["services.html", "pricing.html", "contact.html"]
    },
    "maintenance.html": {
      title: "홈페이지 유지관리·수정 서비스 | LavaLabs",
      description: "홈페이지 문구·이미지 교체, 모바일 오류, 기능 수정, 보안·호스팅 점검과 운영 중 필요한 유지관리 범위를 안내합니다.",
      serviceType: "홈페이지 유지관리 및 수정",
      section: "프로젝트 안내",
      parent: "services.html",
      related: ["web.html", "start.html", "contact.html"]
    },
    "start.html": {
      title: "홈페이지·디지털 프로젝트 준비 체크리스트 | LavaLabs",
      description: "홈페이지, 360 촬영과 업무 시스템을 의뢰하기 전에 준비할 목표, 자료, 일정, 예산과 참고 사례를 단계별로 확인하세요.",
      type: "WebPage",
      section: "프로젝트 준비",
      related: ["services.html", "pricing.html", "contact.html"]
    },
    "portfolio.html": {
      title: "웹·360 가상투어·자동화 제작 사례 | LavaLabs",
      description: "라바랩스가 제작한 360 가상투어, 매장 상품 검색, POS 리포트, 사진 포트폴리오와 모바일 안내 웹 프로젝트를 소개합니다.",
      type: "CollectionPage",
      section: "제작 사례",
      related: ["services.html", "pricing.html", "contact.html"]
    },
    "pricing.html": {
      title: "홈페이지·360 촬영·자동화 제작 가격 | LavaLabs",
      description: "랜딩페이지, 홈페이지, QR 메뉴판, 매장 사진, 360 가상투어, 제품 스핀과 업무 자동화의 기본 시작 가격을 확인하세요.",
      type: "CollectionPage",
      section: "가격 안내",
      related: ["services.html", "start.html", "contact.html"]
    },
    "partnership.html": {
      title: "웹·사진·영상·공간 콘텐츠 협업 | LavaLabs",
      description: "인테리어, 마케팅, 부동산, 사진, 영상과 개발 분야의 소개 파트너, 공동 패키지, 화이트라벨과 지역 협업을 제안받습니다.",
      type: "WebPage",
      section: "파트너십",
      related: ["about.html", "portfolio.html", "contact.html"]
    },
    "about.html": {
      title: "라바랩스 소개 | 소상공인 디지털 스튜디오",
      description: "라바랩스는 작은 매장과 브랜드의 웹사이트, 공간 콘텐츠, 제품 촬영과 반복 업무 자동화를 만드는 현장 중심 디지털 스튜디오입니다.",
      type: "AboutPage",
      section: "회사 소개",
      related: ["services.html", "portfolio.html", "contact.html"]
    },
    "contact.html": {
      title: "웹사이트·360 촬영·자동화 프로젝트 문의 | LavaLabs",
      description: "홈페이지, 360 가상투어, 제품 스핀 촬영, QR 매장 안내, 바코드 시스템과 업무 자동화 제작 범위와 견적을 문의하세요.",
      type: "ContactPage",
      section: "프로젝트 문의",
      related: ["services.html", "pricing.html", "start.html"]
    },
    "faq.html": {
      title: "홈페이지·360 가상투어 제작 자주 묻는 질문 | LavaLabs",
      description: "제작 기간, 수정 범위, 도메인·호스팅, 결제, 소스 코드, QR 주문과 업무 자동화 유지보수에 관한 자주 묻는 질문입니다.",
      type: "FAQPage",
      section: "자주 묻는 질문",
      related: ["pricing.html", "maintenance.html", "contact.html"]
    },
    "sitemap.html": {
      title: "라바랩스 전체 페이지 안내 | 사이트맵",
      description: "라바랩스의 웹 제작, 360 가상투어, 제품 촬영, 매장 솔루션, 자동화, 가격, 사례와 회사 안내 페이지를 확인하세요.",
      type: "CollectionPage",
      section: "사이트맵"
    },
    "privacy.html": {
      title: "개인정보 처리방침 | LavaLabs",
      description: "라바랩스 웹사이트와 프로젝트 문의 과정에서 처리하는 개인정보의 항목, 목적, 보관과 이용자 권리를 안내합니다.",
      type: "WebPage",
      section: "정책"
    },
    "terms.html": {
      title: "서비스 이용 안내 | LavaLabs",
      description: "라바랩스의 웹 제작, 촬영, 자동화와 유지관리 서비스의 상담, 견적, 계약, 수정과 납품 기본 안내입니다.",
      type: "WebPage",
      section: "정책"
    },
    "404.html": {
      title: "페이지를 찾을 수 없습니다 | LavaLabs",
      description: "요청한 페이지가 없거나 주소가 변경되었습니다. 라바랩스 홈 또는 전체 서비스 페이지에서 필요한 내용을 찾아보세요.",
      type: "WebPage",
      section: "오류",
      noindex: true
    }
  };

  const meta = pages[page] || pages["index.html"];

  function setMeta(name, content, property = false) {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(property ? "property" : "name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  }

  function setLink(rel, href) {
    let element = document.head.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement("link");
      element.rel = rel;
      document.head.appendChild(element);
    }
    element.href = href;
  }

  document.documentElement.lang = "ko";
  document.title = meta.title;
  setMeta("description", meta.description);
  setMeta("robots", meta.noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
  setMeta("author", SITE_NAME);
  setMeta("format-detection", "telephone=no");
  setLink("canonical", canonicalUrl);

  setMeta("og:type", "website", true);
  setMeta("og:locale", "ko_KR", true);
  setMeta("og:site_name", SITE_NAME, true);
  setMeta("og:title", meta.title, true);
  setMeta("og:description", meta.description, true);
  setMeta("og:url", canonicalUrl, true);
  setMeta("og:image", SOCIAL_IMAGE, true);
  setMeta("og:image:secure_url", SOCIAL_IMAGE, true);
  setMeta("og:image:type", "image/png", true);
  setMeta("og:image:width", "1200", true);
  setMeta("og:image:height", "630", true);
  setMeta("og:image:alt", `${meta.section || SITE_NAME} | ${SITE_NAME}`, true);

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", meta.title);
  setMeta("twitter:description", meta.description);
  setMeta("twitter:image", SOCIAL_IMAGE);
  setMeta("twitter:image:alt", `${meta.section || SITE_NAME} | ${SITE_NAME}`);

  function pageLabel(filename) {
    return pages[filename]?.section || pages[filename]?.title?.split("|")[0]?.trim() || filename;
  }

  function buildBreadcrumbItems() {
    const items = [{ name: "홈", url: `${SITE_URL}/` }];
    if (page === "index.html") return items;
    if (meta.parent && meta.parent !== "index.html") {
      items.push({ name: pageLabel(meta.parent), url: `${SITE_URL}/${meta.parent}` });
    } else if (meta.serviceType && page !== "services.html") {
      items.push({ name: "전체 서비스", url: `${SITE_URL}/services.html` });
    }
    items.push({ name: meta.section || pageLabel(page), url: canonicalUrl });
    return items.filter((item, index, array) => index === 0 || item.url !== array[index - 1].url);
  }

  const breadcrumbItems = buildBreadcrumbItems();

  const graph = [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      legalName: "라바랩스(LavaLabs)",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630
      },
      image: SOCIAL_IMAGE,
      email: "info@lavalabs.co.kr",
      telephone: "+82-507-1362-3970",
      address: {
        "@type": "PostalAddress",
        streetAddress: "일현로 47, 2층 204호 1308호실",
        addressLocality: "고양시 일산서구",
        addressRegion: "경기도",
        addressCountry: "KR"
      },
      areaServed: [
        { "@type": "Country", name: "대한민국" },
        { "@type": "AdministrativeArea", name: "서울특별시" },
        { "@type": "AdministrativeArea", name: "경기도" }
      ],
      knowsAbout: [
        "소상공인 홈페이지 제작",
        "360 가상투어",
        "제품 촬영",
        "QR 매장 안내",
        "업무 자동화",
        "맞춤형 웹앱 개발"
      ]
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: "라바랩스",
      inLanguage: "ko-KR",
      publisher: { "@id": ORG_ID }
    },
    {
      "@type": meta.type && meta.type !== "SoftwareApplication" ? meta.type : "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: meta.title,
      description: meta.description,
      inLanguage: "ko-KR",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630
      },
      breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  ];

  if (meta.serviceType) {
    graph.push({
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: meta.section,
      serviceType: meta.serviceType,
      description: meta.description,
      url: canonicalUrl,
      provider: { "@id": ORG_ID },
      areaServed: ["서울특별시", "경기도", "대한민국"],
      audience: {
        "@type": "Audience",
        audienceType: "소상공인, 오프라인 매장, 브랜드 및 중소기업"
      }
    });
  }

  if (page === "lavaspin.html") {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${canonicalUrl}#software`,
      name: "LavaSpin",
      alternateName: "라바스핀",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      softwareVersion: "Beta",
      description: meta.description,
      url: canonicalUrl,
      inLanguage: "ko-KR",
      publisher: { "@id": ORG_ID }
    });
  }

  function addFaqSchema() {
    const details = qa(".faq-list details, .ls-faq-list details");
    const questions = details.map((detail) => {
      const question = detail.querySelector("summary")?.textContent.replace(/\+\s*$/, "").trim();
      const answer = detail.querySelector("p")?.textContent.trim();
      if (!question || !answer) return null;
      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      };
    }).filter(Boolean);
    if (questions.length) graph.push({ "@type": "FAQPage", mainEntity: questions });
  }
  addFaqSchema();

  document.head.querySelectorAll("script[data-seo-schema]").forEach((script) => script.remove());
  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.dataset.seoSchema = "true";
  schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  document.head.appendChild(schema);

  const style = document.createElement("style");
  style.textContent = `
    .seo-breadcrumb{border-bottom:1px solid rgba(17,21,27,.07);background:#f4f4ef}
    .seo-breadcrumb .container{display:flex;align-items:center;gap:8px;min-height:44px;overflow-x:auto;white-space:nowrap;color:#6b7480;font-size:10px;font-weight:800}
    .seo-breadcrumb a:hover{color:#11151b}
    .seo-breadcrumb i{color:#a0a7af;font-style:normal}
    .seo-related{padding:76px 0;background:#eef0e9;border-top:1px solid #dfe1db}
    .seo-related-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:24px}
    .seo-related-head h2{margin:8px 0 0;font-size:clamp(26px,4vw,42px);line-height:1.1;letter-spacing:-.045em}
    .seo-related-head p{max-width:470px;margin:0;color:#66707c;font-size:12px}
    .seo-related-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .seo-related-card{display:flex;flex-direction:column;min-height:170px;padding:22px;border:1px solid #dfe1db;border-radius:20px;background:#fff;transition:.2s}
    .seo-related-card:hover{transform:translateY(-3px);border-color:#afc95b;box-shadow:0 18px 40px rgba(13,17,23,.08)}
    .seo-related-card small{color:#718100;font-size:9px;font-weight:900;letter-spacing:.1em}
    .seo-related-card strong{margin-top:auto;font-size:18px;line-height:1.25}
    .seo-related-card span{margin-top:8px;color:#5c6614;font-size:11px;font-weight:900}
    @media(max-width:760px){.seo-related{padding:58px 0}.seo-related-head{display:block}.seo-related-head p{margin-top:10px}.seo-related-grid{grid-template-columns:1fr}.seo-related-card{min-height:135px}}
  `;
  document.head.appendChild(style);

  function addVisibleBreadcrumb() {
    if (page === "index.html" || page === "404.html" || document.querySelector(".seo-breadcrumb")) return;
    const main = document.querySelector("main");
    if (!main) return;
    const nav = document.createElement("nav");
    nav.className = "seo-breadcrumb";
    nav.setAttribute("aria-label", "현재 위치");
    nav.innerHTML = `<div class="container">${breadcrumbItems.map((item, index) => {
      const content = index === breadcrumbItems.length - 1 ? `<span aria-current="page">${item.name}</span>` : `<a href="${item.url.replace(SITE_URL, "") || "/"}">${item.name}</a>`;
      return `${index ? "<i>›</i>" : ""}${content}`;
    }).join("")}</div>`;
    main.insertAdjacentElement("afterbegin", nav);
  }

  function addRelatedLinks() {
    if (!meta.related?.length || page === "index.html" || document.querySelector(".seo-related")) return;
    const main = document.querySelector("main");
    if (!main) return;
    const section = document.createElement("section");
    section.className = "seo-related";
    section.innerHTML = `
      <div class="container">
        <div class="seo-related-head">
          <div><span class="eyebrow">RELATED SERVICES</span><h2>함께 살펴볼 페이지</h2></div>
          <p>현재 필요한 범위와 연결되는 서비스, 가격과 준비 정보를 확인할 수 있습니다.</p>
        </div>
        <div class="seo-related-grid">
          ${meta.related.map((filename) => {
            const target = pages[filename];
            if (!target) return "";
            return `<a class="seo-related-card" href="${filename}"><small>${target.section || SITE_NAME}</small><strong>${target.title.split("|")[0].trim()}</strong><span>자세히 보기 →</span></a>`;
          }).join("")}
        </div>
      </div>`;
    main.appendChild(section);
  }

  function improveImages() {
    qa("img").forEach((image) => {
      if (!image.hasAttribute("loading") && !image.closest(".page-hero,.hero,.spin-hero,.ls-hero")) image.loading = "lazy";
      if (!image.hasAttribute("decoding")) image.decoding = "async";
      if (!image.hasAttribute("alt")) image.alt = "";
    });
  }

  addVisibleBreadcrumb();
  addRelatedLinks();
  improveImages();
})();