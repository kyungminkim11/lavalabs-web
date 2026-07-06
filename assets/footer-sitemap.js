(()=>{
  const footer=document.querySelector('.site-footer');
  if(!footer)return;
  const details=footer.querySelector('.compact-service-details');
  if(!details)return;

  details.classList.add('compact-sitemap-details');
  const summary=details.querySelector('summary');
  if(summary)summary.textContent='전체 사이트맵';

  const host=details.querySelector(':scope > div');
  if(!host)return;
  host.replaceChildren();

  const groups=[
    ['SERVICES',[
      ['전체 서비스','services.html','primary'],
      ['웹·홈페이지 제작','web.html'],['쇼핑몰 제작','commerce.html'],['360 가상투어','space.html'],
      ['360° 제품 스핀 제작','product-spin.html'],['매장·공간 사진','photography.html'],
      ['POV·길 안내 영상','pov-video.html'],['QR 메뉴판·매장 솔루션','store.html'],
      ['매장 지도·QR 안내','map.html'],['바코드·재고 시스템','operations.html'],
      ['직원 교육·디지털 책자','education-guide.html'],['Excel·업무 자동화','automation.html'],
      ['맞춤형 앱·시스템','custom-development.html'],['매장 디지털 패키지','packages.html']
    ]],
    ['SPACE BY INDUSTRY',[
      ['업종별 활용 전체','space.html#industries','primary'],
      ['공유오피스·파티룸','space-rental.html'],
      ['의류 브랜드·팝업','space-fashion-popup.html'],
      ['소매매장·쇼룸','space-retail.html'],
      ['카페·레스토랑','space-food-cafe.html'],
      ['스튜디오·뷰티·교육공간','space-studio-class.html'],
      ['전시·문화공간·숙박','space-culture-stay.html'],
      ['크리에이터·개인 스튜디오','space-creator.html'],
      ['부동산·인테리어','space-real-estate.html'],
      ['피트니스·스포츠','space-fitness.html'],
      ['웨딩·행사·대관공간','space-event.html'],
      ['촬영 장비 안내','equipment.html']
    ]],
    ['WHO IT IS FOR',[
      ['고객 유형별 활용 전체','space.html#audiences','primary'],
      ['프리랜서·1인 창작자','space-for-freelancer.html'],
      ['소상공인·1인 사업자','space-for-small-business.html'],
      ['스타트업·소규모 팀','space-for-startup.html']
    ]],
    ['PROJECT GUIDE',[
      ['제작 사례','portfolio.html','primary'],['가격 안내','pricing.html'],
      ['프로젝트 준비','start.html'],['유지관리 안내','maintenance.html'],
      ['자주 묻는 질문','faq.html'],['파트너십·협업','partnership.html'],
      ['프로젝트 문의 →','contact.html','accent']
    ]],
    ['COMPANY',[
      ['홈','index.html','primary'],['라바랩스 소개','about.html'],
      ['한눈에 보는 사이트맵','sitemap.html','accent'],
      ['개인정보 처리방침','privacy.html'],['서비스 이용 안내','terms.html'],
      ['검색엔진용 XML','sitemap.xml']
    ]]
  ];

  const grid=document.createElement('div');
  grid.className='compact-sitemap-grid';
  groups.forEach(([title,links])=>{
    const section=document.createElement('section');
    section.className='compact-sitemap-group';
    const heading=document.createElement('h4');
    heading.textContent=title;
    const nav=document.createElement('nav');
    nav.setAttribute('aria-label',title);
    links.forEach(([label,href,kind])=>{
      const a=document.createElement('a');
      a.textContent=label;
      a.href=href;
      if(kind==='primary')a.className='primary-link';
      if(kind==='accent')a.className='accent-link';
      nav.appendChild(a);
    });
    section.append(heading,nav);
    grid.appendChild(section);
  });
  host.appendChild(grid);

  const style=document.createElement('style');
  style.textContent='.compact-footer-main{grid-template-columns:minmax(230px,.58fr) minmax(700px,2.25fr) minmax(210px,.55fr)!important;gap:30px!important}.compact-sitemap-grid{display:grid;grid-template-columns:1.15fr 1.15fr .9fr .9fr .8fr;gap:24px}.compact-sitemap-group{min-width:0}.compact-sitemap-group h4{margin:0 0 13px;color:#c9ff48;font-size:9px;font-weight:900;letter-spacing:.14em}.compact-sitemap-group nav{display:grid;gap:8px}.compact-sitemap-group a{color:#cbd1d7;font-size:10.5px;line-height:1.45}.compact-sitemap-group a:hover{color:#c9ff48}.compact-sitemap-group .primary-link{color:#fff;font-weight:850}.compact-sitemap-group .accent-link{color:#c9ff48;font-weight:900}@media(max-width:1280px){.compact-footer-main{grid-template-columns:1fr 2.4fr!important}.compact-footer-contact{grid-column:1/-1}.compact-sitemap-grid{grid-template-columns:1.2fr 1.2fr 1fr}.compact-sitemap-group:nth-child(4),.compact-sitemap-group:nth-child(5){margin-top:12px}}@media(max-width:900px){.compact-sitemap-grid{grid-template-columns:1fr 1fr}.compact-sitemap-group:nth-child(4),.compact-sitemap-group:nth-child(5){margin-top:0}}@media(max-width:680px){.compact-footer-main{grid-template-columns:1fr!important}.compact-footer-contact{grid-column:auto}.compact-sitemap-grid{grid-template-columns:1fr 1fr;gap:24px 18px;padding:2px 0 18px}.compact-sitemap-group a{font-size:10px}}@media(max-width:430px){.compact-sitemap-grid{grid-template-columns:1fr}.compact-sitemap-group nav{grid-template-columns:1fr 1fr;column-gap:16px}}';
  document.head.appendChild(style);
})();