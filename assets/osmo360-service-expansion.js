(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(!['pov-video.html','store.html','web.html','services.html'].includes(path))return;

  const style=document.createElement('style');
  style.id='osmo360-service-expansion-style';
  style.textContent=`
    .capture-methods{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
    .capture-methods span{padding:9px 12px;border:1px solid #a9c64a;border-radius:999px;background:#f0f8d4;color:#344500;font-size:10px;font-weight:850;line-height:1.45}
    .os360-service-section{padding:100px 0;background:#0d1117;color:#fff}
    .os360-service-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.72fr);gap:44px;align-items:end;margin-bottom:30px}
    .os360-service-head h2{margin:13px 0 0;font-size:clamp(34px,4.6vw,56px);line-height:1.08;letter-spacing:-.05em}
    .os360-service-head p{margin:0;color:#c3cad2;font-size:13px;line-height:1.8}
    .os360-method-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
    .os360-method-card{min-height:275px;padding:25px;border:1px solid #ffffff18;border-radius:22px;background:#171c24}
    .os360-method-card.accent{background:#c9ff48;color:#11151b;border-color:#c9ff48}
    .os360-method-card .method-label{font-size:10px;font-weight:900;letter-spacing:.11em;color:#c9ff48}
    .os360-method-card.accent .method-label{color:#405000}
    .os360-method-card h3{margin:44px 0 9px;font-size:24px;line-height:1.2}
    .os360-method-card p{margin:0;color:#c3cad2;font-size:12px;line-height:1.75}
    .os360-method-card.accent p{color:#334000}
    .os360-method-card ul{display:grid;gap:8px;margin:18px 0 0;padding:17px 0 0;border-top:1px solid #ffffff1c;list-style:none}
    .os360-method-card.accent ul{border-color:#11151b24}
    .os360-method-card li{font-size:12px}
    .os360-method-card li:before{content:'✓';margin-right:8px;color:#c9ff48;font-weight:900}
    .os360-method-card.accent li:before{color:#405000}
    .os360-connect{padding:96px 0;background:#e9eae4}
    .os360-connect-grid{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);gap:45px;align-items:start}
    .os360-connect-copy h2{margin:13px 0 14px;font-size:clamp(32px,4.2vw,50px);line-height:1.08;letter-spacing:-.05em}
    .os360-connect-copy p{margin:0;color:#56616d;font-size:13px;line-height:1.8}
    .os360-connect-list{display:grid;gap:12px}
    .os360-connect-item{padding:22px;border:1px solid #dfe1db;border-radius:19px;background:#fff}
    .os360-connect-item span{color:#647600;font-size:9px;font-weight:900;letter-spacing:.12em}
    .os360-connect-item h3{margin:25px 0 7px;font-size:19px}
    .os360-connect-item p{margin:0;color:#56616d;font-size:12px;line-height:1.7}
    .os360-overview-callout{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;margin-top:18px;padding:24px;border:1px solid #a9c64a;border-radius:20px;background:#f0f8d4;color:#263300}
    .os360-overview-callout h3{margin:0 0 6px;font-size:20px}
    .os360-overview-callout p{margin:0;color:#4b5d1a;font-size:12px;line-height:1.7}
    @media(max-width:820px){.os360-service-head,.os360-connect-grid{grid-template-columns:1fr}.os360-method-grid{grid-template-columns:1fr}.os360-overview-callout{grid-template-columns:1fr}}
    @media(max-width:620px){.os360-service-section,.os360-connect{padding:74px 0}.os360-service-head{gap:18px}.os360-method-card{min-height:240px}.capture-methods{margin-top:17px}}
  `;
  document.head.appendChild(style);

  function setMeta(name,content){const el=$(name);if(el)el.setAttribute('content',content)}

  function enhancePov(){
    const hero=$('.page-hero .inner');
    const heroText=$('.page-hero p');
    if(heroText)heroText.textContent='Insta360 GO Ultra의 자연스러운 1인칭 시점과 DJI Osmo 360의 전체 방향 촬영을 활용해 매장 브이로그, 길 안내, 고객 동선과 작업 과정을 제작합니다.';
    if(hero&&!$('.capture-methods',hero)){
      const methods=document.createElement('div');
      methods.className='capture-methods';
      methods.innerHTML='<span>Insta360 GO Ultra · 자연스러운 1인칭 POV</span><span>DJI Osmo 360 · 360° 전체 방향 촬영·시점 재구성</span>';
      const subnav=$('.subnav',hero);
      if(subnav)subnav.insertAdjacentElement('beforebegin',methods);else hero.appendChild(methods);
    }

    const wayfinding=$$('.pov-card').find(card=>$('.pov-card > span',card)?.textContent.trim()==='WAYFINDING');
    if(wayfinding){
      const desc=$('p',wayfinding);
      if(desc)desc.textContent='헷갈리는 출구, 골목, 건물 입구와 층을 1인칭 또는 360° 동선 영상으로 안내합니다.';
      const list=$('ul',wayfinding);
      if(list&&!$$('li',list).some(li=>li.textContent.includes('360°'))){const li=document.createElement('li');li.textContent='360° 전체 방향 기록·시점 재구성';list.appendChild(li)}
    }

    const shootStep=$$('.pov-step').find(step=>$('span',step)?.textContent.includes('03'));
    if(shootStep){const p=$('p',shootStep);if(p)p.textContent='GO Ultra의 1인칭 POV와 Osmo 360 촬영을 목적과 동선에 맞춰 함께 운용합니다.'}

    const pricing=$('#pricing');
    if(pricing&&!$('#pov-camera-methods')){
      const section=document.createElement('section');
      section.id='pov-camera-methods';
      section.className='os360-service-section';
      section.innerHTML=`<div class="container"><div class="os360-service-head"><div><span class="eyebrow">TWO CAPTURE MODES</span><h2>1인칭의 몰입감과<br>360도의 자유로운 시점.</h2></div><p>두 카메라는 경쟁 관계가 아니라 역할이 다릅니다. 자연스러운 눈높이와 손동작은 GO Ultra로, 놓치기 쉬운 갈림길과 넓은 공간은 Osmo 360으로 기록해 최종 영상에서 가장 이해하기 쉬운 시점을 선택합니다.</p></div><div class="os360-method-grid"><article class="os360-method-card"><span class="method-label">INSTA360 GO ULTRA · POV</span><h3>직원이 직접 걷는 듯한<br>자연스러운 1인칭 영상</h3><p>가슴·모자·클립 시점으로 손을 자유롭게 사용하면서 실제 이동과 작업 과정을 보여줍니다.</p><ul><li>매장까지 걷는 길 안내</li><li>포장·진열·작업 과정</li><li>직원·고객 시점 브이로그</li></ul></article><article class="os360-method-card accent"><span class="method-label">DJI OSMO 360 · REFRAIMABLE</span><h3>모든 방향을 기록하고<br>나중에 시점을 선택</h3><p>촬영 후 앞·뒤·좌·우 시점을 다시 구성할 수 있어 복잡한 갈림길, 넓은 매장과 이동 동선을 빠뜨리지 않고 전달합니다.</p><ul><li>360° 길 안내와 공간 동선</li><li>일반 세로 숏폼으로 재구성</li><li>가상투어·공간 안내로 확장</li></ul></article></div></div>`;
      pricing.insertAdjacentElement('beforebegin',section);
    }

    setMeta('meta[name="description"]','Insta360 GO Ultra 1인칭 POV와 DJI Osmo 360을 활용한 매장 길 안내, 브이로그, 고객 동선 및 숏폼 콘텐츠 제작 서비스');
  }

  function addStore360(){
    if($('#store-360-connect'))return;
    const first=$('#main .section.section-muted');
    if(!first)return;
    const section=document.createElement('section');
    section.id='store-360-connect';
    section.className='os360-connect';
    section.innerHTML=`<div class="container"><div class="os360-connect-grid"><div class="os360-connect-copy"><span class="eyebrow">360 STORE GUIDE</span><h2>QR 안내에<br>공간 경험까지 연결합니다.</h2><p>DJI Osmo 360으로 촬영한 매장 내부를 모바일 안내 웹과 연결할 수 있습니다. 고객은 QR을 스캔한 뒤 메뉴만 보는 데서 끝나지 않고 좌석, 층별 구역, 시설과 상품 위치를 직접 둘러볼 수 있습니다.</p><div class="capture-methods"><span>DJI Osmo 360 실제 보유</span><span>모바일·PC 360 뷰어</span><span>정보 핫스팟·예약 링크</span></div></div><div class="os360-connect-list"><article class="os360-connect-item"><span>01 · SPACE PREVIEW</span><h3>매장·좌석·시설 미리보기</h3><p>입구, 좌석, 룸, 화장실, 엘리베이터와 층별 구역을 방문 전에 확인하게 합니다.</p></article><article class="os360-connect-item"><span>02 · QR ENTRY</span><h3>QR에서 360 안내 바로 열기</h3><p>테이블, 입구, 전단과 명함의 QR을 스캔하면 해당 공간이나 안내 지점부터 바로 시작합니다.</p></article><article class="os360-connect-item"><span>03 · HOTSPOT & LINK</span><h3>상품·메뉴·예약 연결</h3><p>공간 안의 핫스팟에서 메뉴 설명, 상품 페이지, 예약, 전화와 길찾기로 연결합니다.</p></article></div></div></div>`;
    first.insertAdjacentElement('afterend',section);
    setMeta('meta[name="description"]','QR 메뉴판, 모바일 매장 안내, 예약·문의 연결과 DJI Osmo 360 기반 공간 안내를 결합한 매장 디지털 솔루션');
  }

  function addWeb360(){
    if($('#web-360-connect'))return;
    const sections=$$('#main > section');
    const target=sections.find(section=>section.classList.contains('section')&&!section.classList.contains('section-muted')&&!section.classList.contains('section-dark'));
    if(!target)return;
    const section=document.createElement('section');
    section.id='web-360-connect';
    section.className='os360-connect';
    section.innerHTML=`<div class="container"><div class="os360-connect-grid"><div class="os360-connect-copy"><span class="eyebrow">360 WEB INTEGRATION</span><h2>웹사이트 안에서<br>공간을 직접 둘러보게.</h2><p>DJI Osmo 360으로 촬영한 가상투어를 홈페이지와 랜딩페이지에 삽입할 수 있습니다. 별도 링크로 이탈시키지 않고 공간 확인부터 상품·예약·문의까지 한 흐름으로 연결합니다.</p></div><div class="os360-connect-list"><article class="os360-connect-item"><span>EMBED</span><h3>360 뷰어 삽입</h3><p>모바일과 PC에서 드래그·터치로 둘러보는 공간 뷰어를 페이지 안에 구성합니다.</p></article><article class="os360-connect-item"><span>CONVERSION</span><h3>핫스팟과 행동 버튼</h3><p>공간 속 제품, 시설과 좌석에 설명·온라인몰·예약·문의 버튼을 연결합니다.</p></article></div></div></div>`;
    target.insertAdjacentElement('afterend',section);
  }

  function enhanceOverview(){
    const storeCard=$('a.service-card[href="store.html"]');
    if(storeCard){const list=$('ul',storeCard);if(list&&!$$('li',list).some(li=>li.textContent.includes('360'))){const li=document.createElement('li');li.textContent='360 매장 안내 연동';list.appendChild(li)}}
    const grid=$('.service-grid');
    if(grid&&!$('#services-pov-360-callout')){
      const callout=document.createElement('div');
      callout.id='services-pov-360-callout';
      callout.className='os360-overview-callout';
      callout.innerHTML='<div><h3>POV 길 안내도 360°로 확장됩니다.</h3><p>Insta360 GO Ultra의 자연스러운 1인칭 영상과 DJI Osmo 360의 전체 방향 촬영을 결합해 길 안내, 매장 동선과 숏폼 콘텐츠를 제작합니다.</p></div><a class="button button-dark" href="pov-video.html">POV·360 길 안내 보기</a>';
      grid.insertAdjacentElement('afterend',callout);
    }
  }

  if(path==='pov-video.html')enhancePov();
  if(path==='store.html')addStore360();
  if(path==='web.html')addWeb360();
  if(path==='services.html')enhanceOverview();
})();
