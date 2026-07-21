const header=`
<header class="site-header">
  <div class="container nav">
    <a class="brand" href="index.html">
      <span class="brand-mark"><svg viewBox="0 0 40 40"><path d="M20 3 34.5 11.5v17L20 37 5.5 28.5v-17L20 3Z"/><path d="m13 23 7-12 7 12h-5v6h-4v-6h-5Z"/></svg></span>
      <span class="brand-copy"><strong>LavaLabs</strong><small>Digital Studio</small></span>
    </a>
    <nav class="desktop-nav">
      <div class="nav-dropdown">
        <button type="button">서비스 ▾</button>
        <div class="dropdown-menu">
          <a href="web.html"><span class="dropdown-icon">WEB</span><span><strong>웹 제작</strong><small>랜딩·홈페이지·맞춤형 웹</small></span></a>
          <a href="space.html"><span class="dropdown-icon">360</span><span><strong>공간 콘텐츠</strong><small>360 가상투어·매장 사진</small></span></a>
          <a href="360-editor.html"><span class="dropdown-icon">EDIT</span><span><strong>360 이미지 편집기</strong><small>미리보기·간편 보정·바닥 로고</small></span></a>
          <a href="store.html"><span class="dropdown-icon">QR</span><span><strong>매장 솔루션</strong><small>QR 메뉴판·주문·안내 웹</small></span></a>
          <a href="automation.html"><span class="dropdown-icon">AUTO</span><span><strong>업무 자동화</strong><small>엑셀·파이썬·데이터 도구</small></span></a>
        </div>
      </div>
      <a href="/works/">포트폴리오</a><a href="pricing.html">가격 안내</a><a href="partnership.html">파트너십</a><a href="about.html">라바랩스 소개</a>
    </nav>
    <a class="button button-dark button-small nav-cta" href="contact.html">프로젝트 문의</a>
    <button class="menu-toggle" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span></button>
  </div>
  <nav class="mobile-menu">
    <a href="index.html">홈</a><a class="mobile-sub" href="web.html">웹 제작</a><a class="mobile-sub" href="space.html">공간 콘텐츠</a><a class="mobile-sub" href="360-editor.html">360 이미지 편집기</a><a class="mobile-sub" href="store.html">매장 솔루션</a><a class="mobile-sub" href="automation.html">업무 자동화</a><a href="/works/">포트폴리오</a><a href="pricing.html">가격 안내</a><a href="partnership.html">파트너십</a><a href="about.html">라바랩스 소개</a><a class="button button-primary" href="contact.html">프로젝트 문의</a>
  </nav>
</header>`;

const footer=`
<style>
  .footer-main.footer-main-expanded{grid-template-columns:1.25fr .75fr .85fr .85fr}
  @media(max-width:1020px){.footer-main.footer-main-expanded{grid-template-columns:1fr 1fr}}
  @media(max-width:680px){.footer-main.footer-main-expanded{grid-template-columns:1fr}}
</style>
<footer class="site-footer">
  <div class="container footer-main footer-main-expanded">
    <div>
      <a class="brand" href="index.html"><span class="brand-mark"><svg viewBox="0 0 40 40"><path d="M20 3 34.5 11.5v17L20 37 5.5 28.5v-17L20 3Z"/><path d="m13 23 7-12 7 12h-5v6h-4v-6h-5Z"/></svg></span><span class="brand-copy"><strong>LavaLabs</strong><small>Digital Studio</small></span></a>
      <p>작은 매장을 위한 웹·공간·자동화 스튜디오.<br>공간을 보여주고, 운영을 단순하게 만듭니다.</p>
    </div>
    <div>
      <h4>SERVICES</h4>
      <div class="footer-links"><a href="web.html">웹 제작</a><a href="space.html">360 가상투어·공간 촬영</a><a href="360-editor.html">360 이미지 미리보기·보정</a><a href="store.html">QR 메뉴판·매장 솔루션</a><a href="automation.html">엑셀·파이썬 자동화</a></div>
    </div>
    <div>
      <h4>SITE MAP</h4>
      <div class="footer-links"><a href="/works/">포트폴리오·라이브 데모</a><a href="sitemap.html">전체 사이트맵</a><a href="space.html#industries">공간 업종별 활용</a><a href="space.html#audiences">고객 유형별 활용</a><a href="pricing.html">가격 안내</a></div>
    </div>
    <div>
      <h4>CONTACT</h4>
      <div class="footer-links"><a href="mailto:space@lavalabs.co.kr">space@lavalabs.co.kr</a><a href="tel:050713623970">0507-1362-3970</a><a href="tel:01079143970">010-7914-3970</a><a href="contact.html">견적 문의</a><a href="partnership.html">협업 제안</a></div>
    </div>
  </div>
  <div class="container business-info">
    <div><span>상호</span><strong>라바랩스(LavaLabs)</strong></div><div><span>대표자</span><strong>김경민</strong></div><div><span>사업자등록번호</span><strong>455-23-01867</strong></div><div><span>통신판매업 신고번호</span><strong>2025-고양일산서-1352</strong></div><div class="business-wide"><span>사업장 소재지</span><strong>경기도 고양시 일산서구 일현로 47, 2층 204호 1308호실(탄현동, 예일 큰프라자)</strong></div><div><span>고객센터</span><a href="tel:050713623970">0507-1362-3970</a></div><div><span>업무용 휴대전화</span><a href="tel:01079143970">010-7914-3970</a></div><div><span>이메일</span><a href="mailto:space@lavalabs.co.kr">space@lavalabs.co.kr</a></div><div><span>거래 안내</span><strong>사업자 거래·세금계산서 발행 가능</strong></div>
  </div>
  <div class="container footer-bottom"><span>© <span id="year"></span> LavaLabs. All rights reserved.</span><div><a href="/works/">포트폴리오</a><a href="sitemap.html">전체 사이트맵</a><a href="about.html">사업자 정보</a><a href="contact.html">문의</a></div></div>
</footer>
<a class="floating-contact" href="contact.html">문의 ↗</a>`;

document.getElementById('site-header')?.insertAdjacentHTML('afterbegin',header);
document.getElementById('site-footer')?.insertAdjacentHTML('afterbegin',footer);

if(location.pathname.toLowerCase().endsWith('automation-pos-live.html')){
  const contrast=document.createElement('link');
  contrast.rel='stylesheet';
  contrast.href='assets/automation-pos-contrast-fix.css?v=20260712a';
  document.head.append(contrast);

  const script=document.createElement('script');
  script.src='assets/automation-upload-template-addon-v3.js?v=20260712e';
  script.defer=true;
  document.head.append(script);
}

if(location.pathname.toLowerCase().endsWith('demo-store-guide.html')){
  const script=document.createElement('script');
  script.src='assets/demo-store-guide-grid-fix.js?v=20260712a';
  script.defer=true;
  document.head.append(script);
}

const exampleScript=document.createElement('script');
exampleScript.src='assets/service-examples.js?v=20260712b';
exampleScript.defer=true;
document.head.appendChild(exampleScript);

if(!document.querySelector('script[data-lava-contrast-guard]')){
  const contrastGuard=document.createElement('script');
  contrastGuard.src='/assets/site-contrast-guard.js?v=20260714a';
  contrastGuard.defer=true;
  contrastGuard.dataset.lavaContrastGuard='true';
  document.head.appendChild(contrastGuard);
}