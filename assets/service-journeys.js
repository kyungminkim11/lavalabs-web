(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  const style=document.createElement('style');
  style.id='service-journeys-style';
  style.textContent=`
    .journey-section{padding:104px 0;background:#f4f5f0}
    .journey-section.dark{background:#0d1117;color:#fff}
    .journey-head{display:grid;grid-template-columns:minmax(0,.82fr) minmax(280px,.58fr);gap:42px;align-items:end;margin-bottom:30px}
    .journey-head h2{margin:13px 0 0;font-size:clamp(34px,4.7vw,56px);line-height:1.08;letter-spacing:-.05em}
    .journey-head p{margin:0;color:#5d6873;font-size:13px;line-height:1.8}
    .journey-section.dark .journey-head p{color:#c3cad2}
    .journey-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
    .journey-card{display:flex;min-height:300px;flex-direction:column;padding:23px;border:1px solid #dfe1db;border-radius:21px;background:#fff;color:#11151b;transition:transform .2s,border-color .2s,box-shadow .2s}
    .journey-card:hover{transform:translateY(-4px);border-color:#a9c64a;box-shadow:0 18px 42px rgba(13,17,23,.1)}
    .journey-card.accent{background:#c9ff48;border-color:#c9ff48}
    .journey-card.dark-card{background:#171c24;border-color:#ffffff18;color:#fff}
    .journey-card .journey-step{font-size:9px;font-weight:900;letter-spacing:.12em;color:#647600}
    .journey-card.dark-card .journey-step{color:#c9ff48}
    .journey-card h3{margin:47px 0 8px;font-size:20px;line-height:1.25}
    .journey-card p{margin:0;color:#5d6873;font-size:12px;line-height:1.72}
    .journey-card.dark-card p{color:#c3cad2}
    .journey-card strong{margin-top:auto;padding-top:22px;font-size:11px;color:#273000}
    .journey-card.dark-card strong{color:#c9ff48}
    .journey-bundle{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;margin-top:15px;padding:24px;border:1px solid #a9c64a;border-radius:20px;background:#eef8cd;color:#263300}
    .journey-bundle h3{margin:0 0 6px;font-size:20px}
    .journey-bundle p{margin:0;color:#4b5d1a;font-size:12px;line-height:1.7}
    .journey-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
    .journey-actions a{white-space:nowrap}
    .inline-service-link{display:inline-flex;margin-top:12px;color:#607300;font-size:11px;font-weight:900}
    .photo360-section{padding:104px 0;background:#0d1117;color:#fff}
    .photo360-intro{display:grid;grid-template-columns:minmax(0,.85fr) minmax(300px,.55fr);gap:44px;align-items:end;margin-bottom:30px}
    .photo360-intro h2{margin:13px 0 0;font-size:clamp(34px,4.7vw,56px);line-height:1.08;letter-spacing:-.05em}
    .photo360-intro p{margin:0;color:#c3cad2;font-size:13px;line-height:1.8}
    .photo360-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .photo360-card{display:flex;min-height:330px;flex-direction:column;padding:25px;border:1px solid #ffffff18;border-radius:22px;background:#171c24;color:#fff}
    .photo360-card.accent{background:#c9ff48;border-color:#c9ff48;color:#11151b}
    .photo360-card span{font-size:9px;font-weight:900;letter-spacing:.12em;color:#c9ff48}
    .photo360-card.accent span{color:#405000}
    .photo360-card h3{margin:48px 0 9px;font-size:22px;line-height:1.25}
    .photo360-card p{margin:0;color:#c3cad2;font-size:12px;line-height:1.72}
    .photo360-card.accent p{color:#334000}
    .photo360-card ul{display:grid;gap:8px;margin:18px 0 0;padding:17px 0 0;border-top:1px solid #ffffff1c;list-style:none}
    .photo360-card.accent ul{border-color:#11151b24}
    .photo360-card li{font-size:12px}
    .photo360-card li:before{content:'✓';margin-right:8px;color:#c9ff48;font-weight:900}
    .photo360-card.accent li:before{color:#405000}
    .photo360-card a{margin-top:auto;padding-top:22px;color:#c9ff48;font-size:11px;font-weight:900}
    .photo360-card.accent a{color:#273000}
    .route-section{padding:104px 0;background:#e9eae4}
    .route-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .route-card{padding:24px;border:1px solid #d9dcd4;border-radius:21px;background:#fff}
    .route-card span{font-size:9px;font-weight:900;letter-spacing:.11em;color:#607300}
    .route-card h3{margin:34px 0 9px;font-size:21px}
    .route-card p{margin:0;color:#5d6873;font-size:12px;line-height:1.72}
    .route-links{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}
    .route-links a{padding:7px 9px;border-radius:999px;background:#11151b;color:#fff;font-size:10px;font-weight:850}
    .route-links a:last-child{background:#c9ff48;color:#263300}
    @media(max-width:980px){.journey-grid{grid-template-columns:1fr 1fr}.photo360-grid,.route-grid{grid-template-columns:1fr}.photo360-card{min-height:270px}}
    @media(max-width:760px){.journey-head,.photo360-intro{grid-template-columns:1fr;gap:16px}.journey-grid{grid-template-columns:1fr}.journey-bundle{grid-template-columns:1fr}.journey-actions{justify-content:flex-start}.journey-section,.photo360-section,.route-section{padding:76px 0}.journey-card{min-height:235px}}
  `;
  document.head.appendChild(style);

  const journeys={
    'web.html':[
      ['01 · VISUAL','photography.html','사진으로 첫인상 만들기','메인 비주얼과 공간·상품 이미지를 먼저 준비합니다.'],
      ['02 · EXPERIENCE','space.html','360으로 공간 체험시키기','방문 전에도 매장 구조와 분위기를 직접 둘러보게 합니다.'],
      ['03 · GUIDE','map.html','지도·QR로 현장 연결하기','웹에서 본 정보를 실제 방문과 매장 동선으로 이어줍니다.'],
      ['04 · CONVERT','store.html','예약·문의·주문 연결하기','관심이 생긴 순간 바로 행동할 수 있는 버튼과 안내를 만듭니다.']
    ],
    'space.html':[
      ['01 · ATTRACT','photography.html','사진으로 먼저 시선을 끌기','플레이스·SNS·검색 결과에서는 한 장의 대표 사진이 입구가 됩니다.'],
      ['02 · EXPLORE','space.html','360으로 직접 둘러보기','고객이 공간 크기, 분위기와 이동 경로를 스스로 확인합니다.'],
      ['03 · MOVE','pov-video.html','POV로 실제 동선 보여주기','역·주차장부터 입구, 층과 이용 순서를 영상으로 설명합니다.'],
      ['04 · ACT','web.html','웹에서 예약·문의로 연결','사진과 360을 홈페이지 안에 넣고 행동 버튼까지 한 흐름으로 구성합니다.']
    ],
    'photography.html':[
      ['01 · PHOTO','photography.html','사진으로 핵심 장면 전달','대표 이미지와 디테일 컷으로 빠르게 분위기를 이해시킵니다.'],
      ['02 · 360 TOUR','space.html','360으로 공간 전체 경험','사진 밖의 구조와 동선을 고객이 직접 둘러보게 합니다.'],
      ['03 · POV','pov-video.html','영상으로 이동과 사용법 안내','길 찾기, 입장, 체험과 작업 과정을 실제 시점으로 보여줍니다.'],
      ['04 · WEB & MAP','web.html','웹·지도에서 한 번에 연결','촬영 결과를 홈페이지, 지도, QR과 예약·문의에 재사용합니다.']
    ],
    'pov-video.html':[
      ['01 · KEY VISUAL','photography.html','사진으로 대표 장면 확보','썸네일, 플레이스와 홈페이지에 쓸 정지 이미지를 함께 준비합니다.'],
      ['02 · ROUTE','pov-video.html','POV로 길과 행동 설명','사람이 실제로 걷고 사용하는 흐름을 짧고 자연스럽게 전달합니다.'],
      ['03 · SPACE','space.html','360으로 놓친 방향 보완','넓은 공간과 갈림길은 전체 방향 기록으로 더 정확하게 보여줍니다.'],
      ['04 · ON-SITE','map.html','지도·QR에서 바로 재생','층별 지도와 안내 지점에 영상·360 링크를 연결합니다.']
    ],
    'map.html':[
      ['01 · LOCATION','map.html','지도에서 위치 찾기','브랜드, 시설과 층별 위치를 검색해 빠르게 목적지를 찾습니다.'],
      ['02 · PREVIEW','photography.html','사진으로 장소 확인','도착 전에 입구와 주변 모습을 확인해 잘못 찾아가는 일을 줄입니다.'],
      ['03 · WALKTHROUGH','pov-video.html','POV로 실제 길 안내','출입구부터 매장까지 헷갈리는 구간을 영상으로 설명합니다.'],
      ['04 · EXPLORE','space.html','360으로 내부 둘러보기','도착 후 이용할 공간과 시설까지 미리 확인하게 합니다.']
    ],
    'store.html':[
      ['01 · GUIDE','store.html','QR로 필요한 정보 열기','메뉴, 시설, 이용 방법과 예약 정보를 모바일에서 바로 확인합니다.'],
      ['02 · MAP','map.html','층·구역과 상품 위치 찾기','고객이 직원에게 묻기 전에 스스로 위치를 찾게 합니다.'],
      ['03 · SPACE','space.html','360으로 매장 미리보기','좌석, 룸, 진열과 편의시설을 방문 전에 둘러보게 합니다.'],
      ['04 · CONTENT','photography.html','사진으로 홍보까지 확장','플레이스·SNS·홈페이지에 쓸 사진을 같은 현장에서 함께 제작합니다.']
    ]
  };

  function setServiceClick(root=document){
    $$('[data-service]',root).forEach(a=>{
      if(a.dataset.journeyBound)return;
      a.dataset.journeyBound='1';
      a.addEventListener('click',()=>sessionStorage.setItem('service',a.dataset.service));
    });
  }

  function linkCard(item,index){
    const [step,href,title,desc]=item;
    const current=href===path;
    return `<a class="journey-card ${index===1?'accent':''} ${index===2?'dark-card':''}" href="${href}"><span class="journey-step">${step}${current?' · CURRENT':''}</span><h3>${title}</h3><p>${desc}</p><strong>${current?'현재 서비스':'자세히 보기 →'}</strong></a>`;
  }

  function insertJourney(){
    const items=journeys[path];
    if(!items||$('#service-journey'))return;
    const main=$('#main');
    if(!main)return;
    const finalCta=$$('#main > section').reverse().find(section=>section.classList.contains('section-dark')&&$('.cta-panel',section));
    const section=document.createElement('section');
    section.id='service-journey';
    section.className='journey-section';
    section.innerHTML=`<div class="container"><div class="journey-head"><div><span class="eyebrow">CONNECTED SERVICE JOURNEY</span><h2>한 가지 결과물보다<br>고객의 다음 행동까지.</h2></div><p>각 서비스는 따로 이용할 수 있습니다. 다만 사진, 360, 영상, 지도와 웹을 목적에 맞게 연결하면 같은 촬영과 정보를 여러 고객 접점에서 더 오래 활용할 수 있습니다.</p></div><div class="journey-grid">${items.map(linkCard).join('')}</div><div class="journey-bundle"><div><h3>처음부터 전부 선택할 필요는 없습니다.</h3><p>현재 가장 급한 서비스부터 시작하고, 촬영 원본과 콘텐츠 구조를 다음 단계에서 재사용할 수 있도록 설계합니다.</p></div><div class="journey-actions"><a class="button button-dark" href="services.html">전체 서비스 보기</a><a class="button button-primary" data-service="통합 서비스 구성 상담" href="contact.html">통합 구성 문의</a></div></div></div>`;
    if(finalCta)finalCta.insertAdjacentElement('beforebegin',section);else main.appendChild(section);
    setServiceClick(section);
  }

  function enhancePhotography(){
    if(path!=='photography.html')return;
    const heroText=$('.page-hero p');
    if(heroText&&!heroText.textContent.includes('360'))heroText.textContent+=' 일반 사진과 360 공간 촬영을 한 번에 구성할 수 있습니다.';
    const gear=$('.photo-gear');
    if(gear&&!$$('span',gear).some(x=>x.textContent.includes('Osmo 360')))gear.insertAdjacentHTML('beforeend','<span>DJI Osmo 360</span>');
    const subnav=$('.page-hero .subnav');
    if(subnav&&!$('a[href="#photo-360"]',subnav))subnav.insertAdjacentHTML('afterbegin','<a href="#photo-360">사진+360 연계</a>');

    const packageCards=$$('#photo-packages .price-card');
    const packageCard=packageCards[2];
    if(packageCard){
      $('.badge',packageCard).textContent='PHOTO + 360';
      $('h3',packageCard).textContent='사진·360 공간 패키지';
      const list=$('ul',packageCard);
      if(list)list.innerHTML='<li>매장 사진 + 360 촬영</li><li>가상투어·핫스팟 연동</li><li>홈페이지·지도·QR 연결</li>';
      const button=$('a.button',packageCard);
      if(button){button.href='space.html';button.textContent='360 서비스 보기';button.removeAttribute('data-service')}
    }

    const packages=$('#photo-packages');
    if(packages&&!$('#photo-360')){
      const section=document.createElement('section');
      section.id='photo-360';
      section.className='photo360-section';
      section.innerHTML=`<div class="container"><div class="photo360-intro"><div><span class="eyebrow">PHOTO + 360 + POV</span><h2>한 번의 현장 방문을<br>여러 콘텐츠로 확장합니다.</h2></div><p>사진은 첫인상과 디테일을 빠르게 전달하고, 360은 사진 밖의 공간 구조를 직접 탐색하게 하며, POV 영상은 길과 이용 순서를 실제 움직임으로 설명합니다.</p></div><div class="photo360-grid"><article class="photo360-card"><span>STILL PHOTOGRAPHY</span><h3>플레이스·홈페이지용<br>대표 사진과 디테일</h3><p>외관, 입구, 내부, 진열과 상품을 정돈된 이미지로 촬영해 검색·SNS·홍보물에서 빠르게 이해시킵니다.</p><ul><li>고해상도·웹 최적화 파일</li><li>가로·세로 비율 협의</li><li>대표 썸네일·배너 활용</li></ul><a href="#photo-packages">사진 촬영 구성 보기 ↑</a></article><article class="photo360-card accent"><span>360 SPACE EXPERIENCE</span><h3>고객이 직접 둘러보는<br>360 가상투어</h3><p>공간 전체를 모든 방향으로 기록하고 장면 이동, 제품·시설 설명과 예약·문의 링크를 연결합니다.</p><ul><li>DJI Osmo 360 촬영</li><li>장면 이동·정보 핫스팟</li><li>모바일·PC·QR 공유</li></ul><a href="space.html">360 서비스 자세히 →</a></article><article class="photo360-card"><span>POV & WAYFINDING</span><h3>매장까지의 길과<br>이용 흐름을 영상으로</h3><p>역·주차장부터 입구, 층별 이동과 체험·결제 순서를 1인칭 또는 360 재구성 영상으로 안내합니다.</p><ul><li>길 안내·매장 브이로그</li><li>릴스·쇼츠 세로 영상</li><li>지도·홈페이지 연결</li></ul><a href="pov-video.html">POV 영상 보기 →</a></article></div></div>`;
      packages.insertAdjacentElement('afterend',section);
    }
  }

  function enhanceSpace(){
    if(path!=='space.html')return;
    const subnav=$('.page-hero .subnav');
    if(subnav&&!$('a[href="#space-photo"]',subnav))subnav.insertAdjacentHTML('beforeend','<a href="#space-photo">사진 촬영 연계 ↓</a>');

    const photoFeature=$$('.feature-row').find(row=>$('h3',row)?.textContent.includes('매장·공간 사진'));
    if(photoFeature&&!$('.inline-service-link',photoFeature)){
      const copy=$('div',photoFeature);
      copy?.insertAdjacentHTML('beforeend','<a class="inline-service-link" href="photography.html">매장 사진 촬영 자세히 →</a>');
    }

    const solutionSection=$$('.detail-grid').map(x=>x.closest('section')).find(Boolean);
    if(solutionSection&&!$('#space-photo')){
      const section=document.createElement('section');
      section.id='space-photo';
      section.className='photo360-section';
      section.innerHTML=`<div class="container"><div class="photo360-intro"><div><span class="eyebrow">360 + STORE PHOTOGRAPHY</span><h2>360으로 이해시키고,<br>사진으로 선택하게.</h2></div><p>360 가상투어는 공간 전체와 동선을 설명하는 데 강하고, 일반 사진은 검색 결과·플레이스·SNS에서 고객의 첫 클릭을 만드는 데 강합니다. 두 결과물을 같은 현장에서 함께 제작할 수 있습니다.</p></div><div class="photo360-grid"><article class="photo360-card accent"><span>360 TOUR</span><h3>공간 구조와 이동을<br>직접 탐색</h3><p>입구부터 주요 공간까지 이동하며 크기, 좌석, 시설과 진열 구역을 실제처럼 확인합니다.</p><ul><li>장면 이동·핫스팟</li><li>예약·상품·문의 링크</li><li>홈페이지 삽입·QR 공유</li></ul><a href="#service-tools">360 제작 방식 보기 ↓</a></article><article class="photo360-card"><span>STORE PHOTOGRAPHY</span><h3>대표 이미지와 분위기를<br>한눈에 전달</h3><p>외관, 입구, 전체 공간과 디테일을 정돈된 사진으로 촬영해 플레이스·SNS·홍보물에 활용합니다.</p><ul><li>고해상도·웹용 JPG</li><li>수평·원근·색감 보정</li><li>대표 썸네일·배너 활용</li></ul><a href="photography.html">매장 사진 서비스 보기 →</a></article><article class="photo360-card"><span>POV VIDEO</span><h3>찾아오는 길과 이용법을<br>움직임으로 설명</h3><p>역·주차장부터 건물 입구, 층과 이용 순서를 1인칭·360 동선 영상으로 제작합니다.</p><ul><li>길 안내 숏폼</li><li>고객 시점 이용 안내</li><li>지도·QR·SNS 연결</li></ul><a href="pov-video.html">POV 영상 서비스 보기 →</a></article></div></div>`;
      solutionSection.insertAdjacentElement('afterend',section);
    }
  }

  function enhancePov(){
    if(path!=='pov-video.html')return;
    const subnav=$('.page-hero .subnav');
    if(subnav&&!$('a[href="#service-journey"]',subnav))subnav.insertAdjacentHTML('beforeend','<a href="#service-journey">연계 서비스</a>');
  }

  function enhanceServicesOverview(){
    if(path!=='services.html'||$('#recommended-routes'))return;
    const host=$('#taxonomy-services')||$('.service-grid')?.parentElement;
    if(!host)return;
    const section=document.createElement('section');
    section.id='recommended-routes';
    section.className='route-section';
    section.innerHTML=`<div class="container"><div class="journey-head"><div><span class="eyebrow">RECOMMENDED START ROUTES</span><h2>서비스 이름보다<br>하고 싶은 일에서 시작하세요.</h2></div><p>한 서비스만 골라도 괜찮습니다. 아래 경로는 자주 함께 필요한 작업을 고객의 실제 목적 순서로 묶은 예시입니다.</p></div><div class="route-grid"><article class="route-card"><span>STORE OPENING & RENEWAL</span><h3>매장을 더 잘 보여주기</h3><p>검색에서 발견되고, 공간을 이해하고, 실제 방문까지 이어지는 흐름입니다.</p><div class="route-links"><a href="photography.html">사진</a><a href="space.html">360</a><a href="pov-video.html">길 안내</a><a href="map.html">지도</a></div></article><article class="route-card"><span>ONLINE SALES</span><h3>상품을 온라인에서 판매하기</h3><p>상품 이미지와 설명을 준비하고 쇼핑몰·추천·주문 경험으로 연결합니다.</p><div class="route-links"><a href="photography.html">상품 촬영</a><a href="commerce.html">쇼핑몰</a><a href="education-guide.html#core">상품 추천</a><a href="packages.html">패키지</a></div></article><article class="route-card"><span>STORE OPERATIONS</span><h3>매장 운영을 더 단순하게</h3><p>고객 안내와 직원 업무를 데이터·검색·자동화 구조로 정리합니다.</p><div class="route-links"><a href="store.html">QR 안내</a><a href="operations.html">재고 시스템</a><a href="automation.html">자동화</a><a href="custom-development.html">맞춤 개발</a></div></article></div></div>`;
    const firstSection=$('#main > section');
    if(firstSection)firstSection.insertAdjacentElement('afterend',section);else host.prepend(section);
  }

  enhancePhotography();
  enhanceSpace();
  enhancePov();
  enhanceServicesOverview();
  insertJourney();
  setServiceClick();
})();
