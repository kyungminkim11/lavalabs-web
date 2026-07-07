(()=>{
const footer=document.querySelector('.site-footer');
if(!footer)return;
const style=document.createElement('style');
style.textContent=`
.compact-footer{padding:0!important;background:#0d1117;color:#fff}.compact-footer .brand-copy small{color:#9ca5ae}.compact-footer-main{display:grid;grid-template-columns:minmax(250px,.8fr) minmax(420px,1.45fr) minmax(230px,.7fr);gap:38px;align-items:start;padding:48px 0 32px!important}.compact-footer-brand p{max-width:310px;margin:16px 0 0;color:#aeb6bf;font-size:11px;line-height:1.65}.compact-footer h4{margin:0 0 13px;color:#c9ff48;font-size:9px;font-weight:900;letter-spacing:.14em}.compact-service-details{border:0}.compact-service-details summary{display:none;cursor:pointer;font-size:12px;font-weight:900}.compact-service-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 18px}.compact-service-grid a{color:#cbd1d7;font-size:11px;line-height:1.45}.compact-service-grid a:hover{color:#c9ff48}.compact-service-grid .all-services{color:#c9ff48;font-weight:900}.compact-contact{display:grid;gap:7px}.compact-contact-link{display:grid;grid-template-columns:80px minmax(0,1fr);gap:10px;align-items:center;padding:3px 0}.compact-contact-link span{color:#89939e;font-size:9px;font-weight:800;line-height:1.4}.compact-contact-link strong{color:#dbe0e5;font-size:11px;font-weight:700;line-height:1.45;word-break:break-word}.compact-contact-link:hover strong{color:#c9ff48}.compact-contact .button{margin-top:7px;min-height:42px;padding:0 14px;font-size:11px}.compact-footer-meta{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;padding:16px 0!important;border-top:1px solid #ffffff14}.compact-business{margin:0}.compact-business summary{width:max-content;cursor:pointer;color:#cbd1d7;font-size:10px;font-weight:850}.compact-business summary:hover{color:#c9ff48}.compact-business-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px 18px;margin-top:14px;padding:16px;border:1px solid #ffffff14;border-radius:15px;background:#ffffff06}.compact-business-grid div{min-width:0}.compact-business-grid span,.compact-business-grid strong,.compact-business-grid a{display:block}.compact-business-grid span{color:#89939e;font-size:8px;font-weight:800}.compact-business-grid strong,.compact-business-grid a{margin-top:3px;color:#d7dde3;font-size:9px;line-height:1.5;word-break:keep-all}.compact-business-grid .wide{grid-column:span 2}.business-verify-actions{display:flex!important;flex-wrap:wrap;gap:6px;margin-top:8px}.business-verify-actions button,.business-verify-actions a{display:inline-flex!important;align-items:center;justify-content:center;min-height:28px;margin:0!important;padding:0 9px;border:1px solid #ffffff20;border-radius:9px;background:#ffffff08;color:#dbe1e7!important;font-size:8px!important;font-weight:850;cursor:pointer}.business-verify-actions button:hover,.business-verify-actions a:hover{border-color:#c9ff48;color:#c9ff48!important}.business-verify-note{display:block;margin-top:6px;color:#89939e;font-size:8px;line-height:1.5}.business-copy-status{display:block;min-height:13px;margin-top:4px;color:#c9ff48;font-size:8px}.compact-legal{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:7px 15px}.compact-legal a{color:#aeb6bf;font-size:9px}.compact-legal a:hover{color:#fff}.compact-footer-bottom{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:14px 0 20px!important;border-top:1px solid #ffffff0d;color:#7f8994;font-size:9px}.compact-footer-bottom strong{color:#aeb6bf;font-weight:700}.compact-footer .brand-mark{background:#171c24}
@media(max-width:1000px){.compact-footer-main{grid-template-columns:1fr 1fr}.compact-footer-brand{grid-column:1/-1}.compact-footer-contact{align-self:start}.compact-service-grid{grid-template-columns:1fr 1fr}.compact-business-grid{grid-template-columns:1fr 1fr}}
@media(max-width:680px){.compact-footer-main{grid-template-columns:1fr;gap:23px;padding:34px 0 22px!important}.compact-footer-brand{grid-column:auto}.compact-footer-brand p{margin-top:12px}.compact-service-details{border-top:1px solid #ffffff14;border-bottom:1px solid #ffffff14}.compact-service-details summary{display:flex;align-items:center;justify-content:space-between;padding:14px 0;list-style:none}.compact-service-details summary::-webkit-details-marker{display:none}.compact-service-details summary:after{content:'+';color:#c9ff48;font-size:16px}.compact-service-details[open] summary:after{content:'−'}.compact-service-grid{grid-template-columns:1fr 1fr;padding:0 0 15px}.compact-contact h4{margin-bottom:8px}.compact-contact-link{grid-template-columns:96px minmax(0,1fr);padding:5px 0}.compact-contact-link span{font-size:9px}.compact-contact-link strong{font-size:12px}.compact-contact .button{width:100%}.compact-footer-meta{grid-template-columns:1fr;gap:12px;padding:13px 0!important}.compact-business summary{width:100%;padding:3px 0}.compact-business-grid{grid-template-columns:1fr;margin-top:11px;padding:14px}.compact-business-grid .wide{grid-column:auto}.compact-legal{justify-content:flex-start;gap:8px 14px}.compact-footer-bottom{align-items:flex-start;flex-direction:column;gap:5px;padding:12px 0 82px!important}}
`;
document.head.appendChild(style);
footer.classList.add('compact-footer');
footer.innerHTML=`
<div class="container compact-footer-main">
  <div class="compact-footer-brand">
    <a class="brand" href="index.html">
      <span class="brand-mark"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 34.5 11.5v17L20 37 5.5 28.5v-17L20 3Z"/><path d="m13 23 7-12 7 12h-5v6h-4v-6h-5Z"/></svg></span>
      <span class="brand-copy"><strong>LavaLabs</strong><small>Digital Studio</small></span>
    </a>
    <p>작은 매장을 위한 웹·공간·운영 시스템 스튜디오.<br>공간을 보여주고, 운영을 단순하게 만듭니다.</p>
  </div>
  <details class="compact-service-details" open>
    <summary>서비스 보기</summary>
    <div>
      <h4>SERVICES</h4>
      <nav class="compact-service-grid" aria-label="푸터 서비스">
        <a href="web.html">웹·홈페이지 제작</a>
        <a href="commerce.html">쇼핑몰 제작</a>
        <a href="space.html">360 가상투어</a>
        <a href="photography.html">매장·공간 사진</a>
        <a href="pov-video.html">POV·길 안내 영상</a>
        <a href="map.html">매장 지도·QR 안내</a>
        <a href="operations.html">바코드·재고 시스템</a>
        <a href="education-guide.html">직원 교육·디지털 책자</a>
        <a href="custom-development.html">맞춤형 앱·시스템</a>
        <a href="automation.html">Excel·업무 자동화</a>
        <a href="packages.html">매장 디지털 패키지</a>
        <a class="all-services" href="services.html">전체 서비스 →</a>
      </nav>
    </div>
  </details>
  <div class="compact-contact">
    <h4>CONTACT</h4>
    <a class="compact-contact-link" href="tel:050713623970" aria-label="고객센터 0507-1362-3970"><span>고객센터</span><strong>0507-1362-3970</strong></a>
    <a class="compact-contact-link" href="tel:01079143970" aria-label="업무용 휴대전화 010-7914-3970"><span>업무용 휴대전화</span><strong>010-7914-3970</strong></a>
    <a class="compact-contact-link" href="mailto:info@lavalabs.co.kr" aria-label="이메일 문의 info@lavalabs.co.kr"><span>이메일 문의</span><strong>info@lavalabs.co.kr</strong></a>
    <a class="button button-primary" href="contact.html">프로젝트 문의</a>
  </div>
</div>
<div class="container compact-footer-meta">
  <details class="compact-business">
    <summary>사업자 정보 보기</summary>
    <div class="compact-business-grid">
      <div><span>상호·대표</span><strong>라바랩스(LavaLabs) · 김경민</strong></div>
      <div>
        <span>사업자등록번호</span>
        <strong id="footer-business-number">455-23-01867</strong>
        <div class="business-verify-actions">
          <button type="button" data-copy-business>번호 복사</button>
          <a href="https://teht.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/ab/a/a/UTEABAAA13.xml" target="_blank" rel="noopener noreferrer">국세청 사업자 상태 조회 ↗</a>
        </div>
        <small class="business-verify-note">홈택스 조회 화면에서 사업자등록번호를 입력해 상태를 확인할 수 있습니다.</small>
        <span class="business-copy-status" aria-live="polite"></span>
      </div>
      <div><span>통신판매업 신고번호</span><strong>2025-고양일산서-1352</strong></div>
      <div class="wide"><span>사업장 소재지</span><strong>경기도 고양시 일산서구 일현로 47, 2층 204호 1308호실</strong></div>
      <div><span>거래 안내</span><strong>사업자 거래·세금계산서 발행 가능</strong></div>
    </div>
  </details>
  <nav class="compact-legal" aria-label="정책 및 안내">
    <a href="about.html">회사 소개</a>
    <a href="start.html">프로젝트 준비</a>
    <a href="privacy.html">개인정보 처리방침</a>
    <a href="terms.html">서비스 이용 안내</a>
  </nav>
</div>
<div class="container compact-footer-bottom">
  <span>© <span id="year"></span> LavaLabs. All rights reserved.</span>
  <strong>견적서·거래명세서·세금계산서 발행 가능</strong>
</div>`;
const serviceDetails=footer.querySelector('.compact-service-details');
const mobile=window.matchMedia('(max-width:680px)');
const sync=()=>{if(serviceDetails)serviceDetails.open=!mobile.matches};
sync();
mobile.addEventListener?.('change',sync);
const year=footer.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const copyButton=footer.querySelector('[data-copy-business]');
const copyStatus=footer.querySelector('.business-copy-status');
copyButton?.addEventListener('click',async()=>{
  const number='455-23-01867';
  try{
    await navigator.clipboard.writeText(number);
  }catch{
    const input=document.createElement('textarea');input.value=number;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();
  }
  copyButton.textContent='복사됨';
  if(copyStatus)copyStatus.textContent='사업자등록번호가 복사되었습니다.';
  setTimeout(()=>{copyButton.textContent='번호 복사';if(copyStatus)copyStatus.textContent=''},1800);
});
})();
