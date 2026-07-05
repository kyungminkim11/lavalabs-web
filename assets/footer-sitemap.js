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
      ['매장·공간 사진','photography.html'],['POV·길 안내 영상','pov-video.html'],
      ['QR 메뉴판·매장 솔루션','store.html'],['매장 지도·QR 안내','map.html'],
      ['바코드·재고 시스템','operations.html'],['직원 교육·디지털 책자','education-guide.html'],
      ['Excel·업무 자동화','automation.html'],['맞춤형 앱·시스템','custom-development.html'],
      ['매장 디지털 패키지','packages.html']
    ]],
    ['SPACE BY INDUSTRY',[
      ['업종별 활용 전체','space.html#industries','primary'],
      ['공유오피스·파티룸','space-rental.html'],
      ['의류 브랜드·팝업','space-fashion-popup.html'],
      ['촬영 장비 안내','equipment.html']
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
  style.textContent='.compact-footer-main{grid-template-columns:minmax(230px,.65fr) minmax(560px,1.9fr) minmax(210px,.6fr)!important;gap:34px!important}.compact-sitemap-grid{display:grid;grid-template-columns:1.35fr .9fr .95fr .95fr;gap:28px}.compact-sitemap-group{min-width:0}.compact-sitemap-group h4{margin:0 0 13px;color:#c9ff48;font-size:9px;font-weight:900;letter-spacing:.14em}.compact-sitemap-group nav{display:grid;gap:8px}.compact-sitemap-group a{color:#cbd1d7;font-size:10.5px;line-height:1.45}.compact-sitemap-group a:hover{color:#c9ff48}.compact-sitemap-group .primary-link{color:#fff;font-weight:850}.compact-sitemap-group .accent-link{color:#c9ff48;font-weight:900}@media(max-width:1120px){.compact-footer-main{grid-template-columns:1fr 2fr!important}.compact-footer-contact{grid-column:1/-1}.compact-sitemap-grid{grid-template-columns:1fr 1fr}}@media(max-width:680px){.compact-footer-main{grid-template-columns:1fr!important}.compact-footer-contact{grid-column:auto}.compact-sitemap-grid{grid-template-columns:1fr 1fr;gap:24px 18px;padding:2px 0 18px}.compact-sitemap-group a{font-size:10px}}@media(max-width:430px){.compact-sitemap-grid{grid-template-columns:1fr}.compact-sitemap-group nav{grid-template-columns:1fr 1fr;column-gap:16px}}';
  document.head.appendChild(style);
})();
