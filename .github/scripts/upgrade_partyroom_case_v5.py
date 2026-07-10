from pathlib import Path

root = Path('works/partyroom-360-tour')
html_path = root / 'index.html'
css_path = root / 'case.css'
js_path = root / 'case.js'

html = html_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
js = js_path.read_text(encoding='utf-8')

html = html.replace('20260711-case-v4', '20260711-case-v5')

old_nav = '''      <a href="#overview">프로젝트</a>
      <a href="#tour">360 투어</a>
      <a href="#photos">사진</a>
      <a href="#details">시설 디테일</a>
      <a href="#decisions">설계 포인트</a>
      <a href="#packages">제작 범위</a>
      <a href="#live-site">실제 사이트</a>
      <a href="#faq">FAQ</a>'''
new_nav = '''      <a href="#overview">프로젝트</a>
      <a href="#journey">정보 설계</a>
      <a href="#tour">360 투어</a>
      <a href="#photos">사진</a>
      <a href="#details">시설 디테일</a>
      <a href="#scope-builder">맞춤 범위</a>
      <a href="#live-site">실제 사이트</a>
      <a href="#faq">FAQ</a>'''
html = html.replace(old_nav, new_nav)

journey = '''
  <section class="section journey-section reveal-section" id="journey">
    <div class="container">
      <header class="section-head center">
        <p class="kicker">CUSTOMER QUESTIONS</p>
        <h2>예약 전에 떠올리는 질문을<br>콘텐츠 하나씩으로 해결했습니다.</h2>
        <p>콘텐츠를 많이 넣는 것이 아니라, 고객이 실제로 확인하려는 순서에 맞춰 역할을 나눴습니다.</p>
      </header>
      <div class="journey-grid">
        <article><span>01</span><h3>공간이 얼마나 넓나요?</h3><p>360° 화면과 전체 사진으로 시야와 공간감을 확인합니다.</p><b>360 TOUR</b></article>
        <article><span>02</span><h3>어디에 무엇이 있나요?</h3><p>실제 배치 기반 미니맵에서 구역과 현재 장면을 확인합니다.</p><b>INTERACTIVE MAP</b></article>
        <article><span>03</span><h3>무엇을 이용할 수 있나요?</h3><p>PC, PS5, 노래방, 홀덤, 보드게임과 주방 시설을 사진으로 확인합니다.</p><b>FACILITY PHOTOS</b></article>
        <article><span>04</span><h3>처음 가도 사용할 수 있나요?</h3><p>현장 안내책자를 모바일용 사용 가이드로 다시 구성했습니다.</p><b>MOBILE GUIDE</b></article>
        <article><span>05</span><h3>어디에 있고 어떻게 예약하나요?</h3><p>지도, 길찾기, 연락처와 예약 채널을 한 화면 흐름으로 연결합니다.</p><b>LOCATION & BOOKING</b></article>
      </div>
    </div>
  </section>

'''
if 'id="journey"' not in html:
    html = html.replace('  <section class="section dark reveal-section" id="tour">', journey + '  <section class="section dark reveal-section" id="tour">', 1)

explorer = '''
  <section class="section explorer-section reveal-section" id="explorer">
    <div class="container">
      <header class="section-head center">
        <p class="kicker">DELIVERABLE EXPLORER</p>
        <h2>같은 공간도 결과물마다<br>담당하는 역할이 다릅니다.</h2>
        <p>탭을 눌러 각 결과물이 고객의 어떤 질문을 해결하는지 확인해 보세요.</p>
      </header>
      <div class="explorer">
        <div class="explorer-tabs" role="tablist" aria-label="결과물 종류">
          <button role="tab" aria-selected="true" aria-controls="deliverable-panel" data-deliverable="photo">공간 사진</button>
          <button role="tab" aria-selected="false" aria-controls="deliverable-panel" data-deliverable="tour">360 투어</button>
          <button role="tab" aria-selected="false" aria-controls="deliverable-panel" data-deliverable="map">미니맵</button>
          <button role="tab" aria-selected="false" aria-controls="deliverable-panel" data-deliverable="site">고객용 사이트</button>
        </div>
        <article class="explorer-panel" id="deliverable-panel" role="tabpanel" tabindex="0" aria-live="polite">
          <div class="explorer-media"><img id="explorerImage" src="/partyroom/assets/lounge-1800.webp?v=20260711-case-v5" alt="TV와 소파가 있는 파티룸 공간 사진"></div>
          <div class="explorer-copy">
            <p id="explorerEyebrow">HIGH-RES PHOTOGRAPHY</p>
            <h3 id="explorerTitle">공간 사진</h3>
            <p id="explorerDescription">대표 이미지와 시설 디테일을 선명하게 보여주고 웹, 플레이스, SNS와 예약 페이지에서 재사용합니다.</p>
            <ul id="explorerList"><li>공간 분위기와 시설 디테일 전달</li><li>가로·세로 원본 비율 보존</li><li>다양한 채널에 재사용 가능</li></ul>
            <a id="explorerLink" class="text-link" href="#photos">사진 결과 보기</a>
          </div>
        </article>
      </div>
    </div>
  </section>

'''
if 'id="explorer"' not in html:
    html = html.replace('  <section class="section decisions reveal-section" id="decisions">', explorer + '  <section class="section decisions reveal-section" id="decisions">', 1)

scope = '''
  <section class="section scope-section reveal-section" id="scope-builder">
    <div class="container">
      <header class="section-head center">
        <p class="kicker">SCOPE BUILDER</p>
        <h2>필요한 항목을 고르면<br>적합한 제작 범위를 추천합니다.</h2>
        <p>정확한 견적이 아니라, 상담 전에 필요한 범위를 빠르게 정리하는 도구입니다.</p>
      </header>
      <div class="scope-layout">
        <form class="scope-form" id="scopeForm">
          <fieldset>
            <legend>내 공간에 필요한 결과물</legend>
            <label><input type="checkbox" name="scope" value="photo" checked><span><b>공간 사진</b><small>대표·구역별 사진과 웹용 이미지</small></span></label>
            <label><input type="checkbox" name="scope" value="tour"><span><b>360° 가상투어</b><small>장면 이동과 공간 동선 확인</small></span></label>
            <label><input type="checkbox" name="scope" value="map"><span><b>도면·미니맵</b><small>현재 위치와 공간 구역 표시</small></span></label>
            <label><input type="checkbox" name="scope" value="site"><span><b>고객용 웹사이트</b><small>공간 소개와 예약 전환 구조</small></span></label>
            <label><input type="checkbox" name="scope" value="guide"><span><b>시설·이용 안내</b><small>게임 목록, 사용법과 운영 정보</small></span></label>
          </fieldset>
        </form>
        <aside class="scope-result" aria-live="polite">
          <p class="scope-label">RECOMMENDED SCOPE</p>
          <h3 id="scopeTitle">공간 사진 촬영형</h3>
          <p id="scopeDescription">대표 이미지와 구역별 사진이 필요한 공간에 적합합니다.</p>
          <ul id="scopeSummary"><li>고해상도 공간 사진</li><li>웹·플레이스용 이미지</li></ul>
          <a id="scopeContact" class="button primary contact-link" href="/contact.html?service=space-photo&package=photo" data-track="contact_scope_builder">선택한 범위로 문의하기</a>
          <small>실제 범위와 금액은 공간 규모, 촬영 지점과 기존 사이트 유무에 따라 달라집니다.</small>
        </aside>
      </div>
    </div>
  </section>

'''
if 'id="scope-builder"' not in html:
    html = html.replace('  <section class="section packages reveal-section" id="packages">', scope + '  <section class="section packages reveal-section" id="packages">', 1)

css_append = r'''

/* v5: customer journey, deliverable explorer and scope builder */
.journey-section{background:linear-gradient(180deg,#f7fafc,#edf2f7)}
.journey-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.journey-grid article{min-height:255px;padding:24px;border:1px solid var(--line);border-radius:24px;background:#fff;display:flex;flex-direction:column;box-shadow:0 15px 45px rgba(10,24,40,.05)}
.journey-grid span{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:var(--dark);color:var(--acid);font-size:12px;font-weight:950}
.journey-grid h3{margin:22px 0 10px;font-size:20px;line-height:1.35;letter-spacing:-.03em}
.journey-grid p{margin:0;color:var(--muted);font-size:14px;line-height:1.72}
.journey-grid b{margin-top:auto;padding-top:22px;color:#64788d;font-size:10px;letter-spacing:.13em}
.explorer-section{background:#fff}
.explorer{border:1px solid var(--line);border-radius:30px;background:#f8fafc;box-shadow:var(--shadow);overflow:hidden}
.explorer-tabs{display:flex;gap:8px;padding:12px;border-bottom:1px solid var(--line);overflow-x:auto;background:#fff}
.explorer-tabs button{flex:1 0 auto;min-height:46px;padding:0 18px;border:1px solid transparent;border-radius:14px;background:transparent;color:#5f6e7e;font-weight:900;cursor:pointer}
.explorer-tabs button[aria-selected="true"]{background:var(--dark);color:#fff}
.explorer-panel{display:grid;grid-template-columns:1.2fr .8fr;min-height:470px;outline:none}
.explorer-media{min-height:470px;overflow:hidden;background:#dce4eb}
.explorer-media img{width:100%;height:100%;display:block;object-fit:cover}
.explorer-copy{padding:44px;display:flex;flex-direction:column;justify-content:center}
.explorer-copy>p:first-child{margin:0;color:#65798e;font-size:10px;font-weight:950;letter-spacing:.15em}
.explorer-copy h3{margin:12px 0 14px;font-size:38px;letter-spacing:-.045em}
.explorer-copy>p:nth-of-type(2){margin:0;color:var(--muted);font-size:15px;line-height:1.8}
.explorer-copy ul{display:grid;gap:10px;margin:24px 0;padding:0;list-style:none}
.explorer-copy li{position:relative;padding-left:20px;color:#33465a;font-size:14px;line-height:1.55}
.explorer-copy li:before{content:"";position:absolute;left:0;top:.55em;width:8px;height:8px;border-radius:50%;background:var(--acid);box-shadow:0 0 0 4px rgba(201,255,72,.2)}
.scope-section{background:radial-gradient(circle at 85% 15%,rgba(99,240,255,.14),transparent 31%),var(--dark);color:#fff}
.scope-section .section-head .kicker{color:var(--acid)}
.scope-section .section-head>p:last-child{color:#b8c5d1}
.scope-layout{display:grid;grid-template-columns:1.15fr .85fr;gap:22px;align-items:start}
.scope-form,.scope-result{border:1px solid rgba(255,255,255,.12);border-radius:28px;background:rgba(255,255,255,.055);backdrop-filter:blur(16px)}
.scope-form{padding:26px}
.scope-form fieldset{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0;padding:0;border:0}
.scope-form legend{grid-column:1/-1;margin-bottom:8px;font-size:19px;font-weight:950}
.scope-form label{position:relative;display:flex;gap:13px;min-height:92px;padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(255,255,255,.04);cursor:pointer;transition:.2s}
.scope-form label:has(input:checked){border-color:var(--acid);background:rgba(201,255,72,.1);box-shadow:0 0 0 3px rgba(201,255,72,.1)}
.scope-form input{width:20px;height:20px;margin:2px 0 0;accent-color:var(--acid)}
.scope-form span{display:grid;gap:5px}
.scope-form b{font-size:15px}
.scope-form small{color:#adbac7;font-size:12px;line-height:1.5}
.scope-result{position:sticky;top:150px;padding:30px}
.scope-label{margin:0;color:var(--acid);font-size:10px;font-weight:950;letter-spacing:.15em}
.scope-result h3{margin:13px 0 10px;font-size:34px;letter-spacing:-.045em}
.scope-result>p:nth-of-type(2){margin:0;color:#bac6d2;line-height:1.75}
.scope-result ul{display:grid;gap:9px;margin:24px 0;padding:0;list-style:none}
.scope-result li{padding:11px 13px;border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(255,255,255,.045);font-size:13px}
.scope-result .button{width:100%}
.scope-result>small{display:block;margin-top:14px;color:#91a1b2;font-size:11px;line-height:1.6}
@media(max-width:1080px){.journey-grid{grid-template-columns:repeat(3,1fr)}.journey-grid article:nth-child(n+4){min-height:220px}.explorer-panel{grid-template-columns:1fr}.explorer-media{min-height:390px}.scope-layout{grid-template-columns:1fr}.scope-result{position:static}}
@media(max-width:720px){.journey-grid{grid-template-columns:1fr}.journey-grid article{min-height:auto}.explorer{border-radius:22px}.explorer-tabs{padding:8px}.explorer-tabs button{min-height:42px;padding:0 14px;font-size:12px}.explorer-media{min-height:260px}.explorer-copy{padding:24px}.explorer-copy h3{font-size:30px}.scope-form,.scope-result{border-radius:22px}.scope-form{padding:18px}.scope-form fieldset{grid-template-columns:1fr}.scope-form label{min-height:82px}.scope-result{padding:23px}.scope-result h3{font-size:29px}}
'''
if 'v5: customer journey' not in css:
    css += css_append

js_insert = r'''

  const deliverables={
    photo:{eyebrow:"HIGH-RES PHOTOGRAPHY",title:"공간 사진",description:"대표 이미지와 시설 디테일을 선명하게 보여주고 웹, 플레이스, SNS와 예약 페이지에서 재사용합니다.",image:"/partyroom/assets/lounge-1800.webp?v=20260711-case-v5",alt:"TV와 소파가 있는 파티룸 공간 사진",items:["공간 분위기와 시설 디테일 전달","가로·세로 원본 비율 보존","다양한 채널에 재사용 가능"],href:"#photos",link:"사진 결과 보기"},
    tour:{eyebrow:"INTERACTIVE 360 TOUR",title:"연결형 360° 투어",description:"여러 촬영 지점을 이동하며 공간 크기, 시야와 실제 동선을 직접 확인하게 합니다.",image:"/works/partyroom-360-tour/assets/scene-overview.png?v=20260710hq",alt:"파티룸 전체 공간 360 파노라마",items:["5개 장면 이동","화살표·목록·도면 연동","모바일 드래그와 확대 지원"],href:"#tour",link:"360 투어 체험하기"},
    map:{eyebrow:"INTERACTIVE FLOORPLAN",title:"실제 배치 기반 미니맵",description:"현장 도면을 디지털 안내도로 정리하고 현재 보고 있는 360 장면과 위치를 함께 표시합니다.",image:"/partyroom/assets/dining-1800.webp?v=20260711-case-v5",alt:"다인석 테이블과 공간 배치",items:["가구와 시설 위치 표시","촬영 지점 번호 연동","출입문과 이동 방향 확인"],href:"#tour",link:"미니맵 확인하기"},
    site:{eyebrow:"LIVE CUSTOMER SITE",title:"고객용 운영 사이트",description:"사진과 투어뿐 아니라 시설, 게임 목록, 사용법, 지도와 예약 흐름까지 실제 방문자 기준으로 구성합니다.",image:"/partyroom/assets/hero-2200.webp?v=20260711-case-v5",alt:"퓨처스페이스 고객용 사이트 대표 이미지",items:["모바일 우선 정보 구조","시설·사용법·위치 안내","예약·문의 채널 연결"],href:"/partyroom/",link:"실제 사이트 보기 ↗"}
  };
  const explorerButtons=[...document.querySelectorAll("[data-deliverable]")];
  function renderDeliverable(key){
    const data=deliverables[key];if(!data)return;
    explorerButtons.forEach(button=>button.setAttribute("aria-selected",String(button.dataset.deliverable===key)));
    const image=document.getElementById("explorerImage");if(image){image.src=data.image;image.alt=data.alt}
    const eyebrow=document.getElementById("explorerEyebrow");if(eyebrow)eyebrow.textContent=data.eyebrow;
    const title=document.getElementById("explorerTitle");if(title)title.textContent=data.title;
    const description=document.getElementById("explorerDescription");if(description)description.textContent=data.description;
    const list=document.getElementById("explorerList");if(list)list.innerHTML=data.items.map(item=>`<li>${item}</li>`).join("");
    const link=document.getElementById("explorerLink");if(link){link.href=data.href;link.textContent=data.link;if(key==="site"){link.target="_blank";link.rel="noopener"}else{link.removeAttribute("target");link.removeAttribute("rel")}}
    track("case_deliverable_select",{deliverable:key});
  }
  explorerButtons.forEach((button,index)=>{
    button.addEventListener("click",()=>renderDeliverable(button.dataset.deliverable));
    button.addEventListener("keydown",event=>{
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
      event.preventDefault();let next=index;
      if(event.key==="ArrowLeft")next=(index-1+explorerButtons.length)%explorerButtons.length;
      if(event.key==="ArrowRight")next=(index+1)%explorerButtons.length;
      if(event.key==="Home")next=0;if(event.key==="End")next=explorerButtons.length-1;
      explorerButtons[next].focus();renderDeliverable(explorerButtons[next].dataset.deliverable);
    });
  });

  const scopeForm=document.getElementById("scopeForm");
  function renderScope(){
    if(!scopeForm)return;
    const selected=[...scopeForm.querySelectorAll('input[name="scope"]:checked')].map(input=>input.value);
    if(!selected.length){const photo=scopeForm.querySelector('input[value="photo"]');if(photo){photo.checked=true;selected.push("photo")}}
    let packageKey="photo";if(selected.includes("site")||selected.includes("guide"))packageKey="full";else if(selected.includes("tour")||selected.includes("map"))packageKey="tour";
    const packages={
      photo:{title:"공간 사진 촬영형",description:"대표 이미지와 구역별 사진이 필요한 공간에 적합합니다.",items:["고해상도 공간 사진","웹·플레이스용 이미지"],service:"space-photo"},
      tour:{title:"사진·360 투어형",description:"사진과 함께 공간 크기와 동선을 직접 보여주고 싶은 경우에 적합합니다.",items:["고해상도 공간 사진","연결형 360° 장면","도면·장면 선택 UI"],service:"partyroom-360-tour"},
      full:{title:"통합 웹 구축형",description:"공간 소개부터 시설 안내, 지도와 예약 연결까지 한 페이지에서 운영하려는 경우에 적합합니다.",items:["사진·360° 투어·미니맵","시설·게임·이용 안내","지도·예약·문의 동선"],service:"partyroom-360-tour"}
    };
    const data=packages[packageKey];
    const title=document.getElementById("scopeTitle");if(title)title.textContent=data.title;
    const description=document.getElementById("scopeDescription");if(description)description.textContent=data.description;
    const summary=document.getElementById("scopeSummary");if(summary)summary.innerHTML=data.items.map(item=>`<li>${item}</li>`).join("");
    const contact=document.getElementById("scopeContact");if(contact){const url=new URL("/contact.html",location.origin);url.searchParams.set("service",data.service);url.searchParams.set("package",packageKey);url.searchParams.set("scope",selected.join(","));allowedUtm.forEach(key=>{if(currentParams.has(key))url.searchParams.set(key,currentParams.get(key))});url.searchParams.set("utm_content","scope_builder");contact.href=url.pathname+url.search}
  }
  scopeForm?.addEventListener("change",()=>{renderScope();track("case_scope_change",{scope:[...scopeForm.querySelectorAll('input[name="scope"]:checked')].map(input=>input.value).join(",")})});
  renderScope();
'''
marker = '  track("case_view",{path:location.pathname,referrer:document.referrer||"direct"});'
if 'const deliverables={' not in js:
    js = js.replace(marker, js_insert + '\n' + marker, 1)

html_path.write_text(html, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
js_path.write_text(js, encoding='utf-8')
