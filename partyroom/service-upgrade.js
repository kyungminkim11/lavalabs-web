(()=>{
  if(window.__PARTYROOM_SERVICE_UPGRADE__)return;
  window.__PARTYROOM_SERVICE_UPGRADE__=true;

  const config=window.PARTYROOM_CONFIG||{};
  const address=config.address||"경기도 파주시 송학1길 67-21";
  const encodedAddress=encodeURIComponent(address);

  const styleLink=document.createElement("link");
  styleLink.rel="stylesheet";
  styleLink.href="/partyroom/service-upgrade.css?v=20260710-entry-left-v2";
  document.head.appendChild(styleLink);

  const floorplan=document.getElementById("floorplan");
  if(floorplan){
    floorplan.classList.add("floorplan-v2");
    floorplan.innerHTML=`<div class="floorplan-scroll-hint" aria-hidden="true">← 좌우로 밀어 전체 도면 확인 →</div>
    <div class="floorplan-canvas">
      <svg viewBox="0 0 960 600" role="img" aria-label="퓨처스페이스 게임파티룸 실제 배치 기반 도면. 출입문은 왼쪽 아래에 있습니다.">
        <rect class="wall" x="34" y="34" width="892" height="516" rx="18"/>
        <text class="room-hint" x="58" y="64">안쪽 벽면</text>

        <ellipse class="fixture" cx="150" cy="205" rx="92" ry="118" fill="#eee7ff"/>
        <text class="zone-label" x="150" y="210" text-anchor="middle">홀덤</text>
        <text class="zone-small" x="150" y="234" text-anchor="middle">포커 테이블</text>

        <rect class="fixture" x="270" y="122" width="86" height="180" rx="16" fill="#e7f4ff"/>
        <text class="zone-label" x="313" y="205" text-anchor="middle" transform="rotate(-90 313 205)">소파</text>

        <rect class="fixture" x="405" y="52" width="168" height="78" rx="13" fill="#fff1cc"/>
        <text class="zone-small" x="489" y="97" text-anchor="middle">전자레인지</text>

        <rect x="500" y="160" width="78" height="120" rx="11" fill="#202936"/>
        <text x="539" y="222" text-anchor="middle" font-size="25" font-weight="950" fill="#fff">TV</text>
        <text class="zone-small" x="539" y="302" text-anchor="middle">노래방 · PS5</text>

        <rect class="fixture" x="625" y="176" width="240" height="112" rx="15" fill="#e7f9dd"/>
        <text class="zone-label" x="745" y="237" text-anchor="middle">다인석 테이블</text>

        <rect class="fixture" x="642" y="52" width="98" height="66" rx="12" fill="#e6f4ff"/>
        <text class="zone-small" x="691" y="91" text-anchor="middle">싱크대</text>
        <rect class="fixture" x="755" y="52" width="86" height="92" rx="12" fill="#eef1f5"/>
        <text class="zone-small" x="798" y="104" text-anchor="middle">냉장고</text>
        <rect class="fixture" x="856" y="52" width="48" height="116" rx="11" fill="#e6f4ff"/>
        <text class="zone-small" x="880" y="113" text-anchor="middle" transform="rotate(-90 880 113)">에어컨</text>

        <rect class="fixture" x="858" y="198" width="46" height="180" rx="11" fill="#ffe9e9"/>
        <text class="zone-small" x="881" y="290" text-anchor="middle" transform="rotate(-90 881 290)">주방 수납</text>

        <rect class="fixture" x="430" y="430" width="190" height="82" rx="14" fill="#fff1cc"/>
        <text class="zone-label" x="525" y="478" text-anchor="middle">보드게임</text>
        <rect class="fixture" x="680" y="430" width="190" height="82" rx="14" fill="#e6f4ff"/>
        <text class="zone-label" x="775" y="478" text-anchor="middle">PC 게임존</text>

        <path class="door-gap" d="M70 550H220"/>
        <path class="door-line" d="M220 550V400"/>
        <path class="door-swing" d="M70 550A150 150 0 0 1 220 400"/>
        <text class="entry-label" x="145" y="535" text-anchor="middle">출입문</text>
      </svg>
      <button class="marker active" style="left:53%;top:59%" data-scene="overview" aria-label="전체 공간으로 이동">01</button>
      <button class="marker" style="left:37%;top:42%" data-scene="lounge" aria-label="TV 라운지로 이동">02</button>
      <button class="marker" style="left:73%;top:46%" data-scene="tablepc" aria-label="다인석 테이블로 이동">03</button>
      <button class="marker" style="left:80%;top:82%" data-scene="pc" aria-label="PC 게임존으로 이동">04</button>
      <button class="marker" style="left:89%;top:35%" data-scene="kitchen" aria-label="주방으로 이동">05</button>
    </div>`;
    floorplan.querySelectorAll(".marker").forEach(button=>button.addEventListener("click",()=>{
      if(typeof window.loadScene==="function")window.loadScene(button.dataset.scene);
      document.querySelectorAll("[data-scene]").forEach(el=>el.classList.toggle("active",el.dataset.scene===button.dataset.scene));
    }));
  }

  const facilities=document.getElementById("facilities");
  if(facilities&&!document.getElementById("games")){
    const section=document.createElement("section");
    section.className="section service-game-section";
    section.id="games";
    section.innerHTML=`<div class="shell">
      <header class="section-head">
        <p class="kicker">GAME LIBRARY</p>
        <h2>어떤 게임이 있는지<br>예약 전에 확인하세요.</h2>
        <p>현장 촬영일 기준으로 확인한 대표 보유 게임입니다. 콘솔 타이틀과 보드게임 구성은 운영 상황에 따라 추가·교체될 수 있습니다.</p>
      </header>
      <div class="game-showcase">
        <article class="game-card">
          <div class="game-card__media"><img src="/partyroom/assets/playstation-1800.webp?v=20260710-service" alt="플레이스테이션과 닌텐도 스위치 게임 타이틀" loading="lazy"></div>
          <div class="game-card__body">
            <p class="game-card__eyebrow">CONSOLE GAMES</p>
            <h3>PS5 · Nintendo Switch</h3>
            <p class="game-card__desc">격투, 스포츠, 가족·파티 게임까지 여러 명이 함께 즐기기 좋은 타이틀을 준비했습니다.</p>
            <ul class="game-tag-list" aria-label="대표 콘솔 게임 목록">
              <li>철권 8</li><li>EA SPORTS FC 25</li><li>MLB The Show 24</li><li>ASTRO BOT</li><li>Nintendo Switch Sports</li><li>Super Mario Party Jamboree</li>
            </ul>
          </div>
        </article>
        <article class="game-card">
          <div class="game-card__media game-card__media--contain"><img src="/partyroom/assets/boardgames-1400.webp?v=20260710-service" alt="보드게임 진열장" loading="lazy"></div>
          <div class="game-card__body">
            <p class="game-card__eyebrow">BOARD GAMES</p>
            <h3>파티·전략 보드게임</h3>
            <p class="game-card__desc">짧게 즐기는 파티게임부터 여러 명이 오래 즐기는 전략게임까지 대표 구성을 확인할 수 있습니다.</p>
            <ul class="game-tag-list" aria-label="대표 보드게임 목록">
              <li>UNO</li><li>스플렌더</li><li>티켓 투 라이드: 유럽</li><li>모노폴리</li><li>모두의마블</li><li>테트리스</li><li>딕싯</li><li>블로커스</li><li>푸에르토리코</li><li>아줄</li><li>석기시대</li><li>시타델</li><li>다빈치 코드</li>
            </ul>
          </div>
        </article>
      </div>
      <p class="inventory-note">게임 디스크·구성품은 이용 후 반드시 원래 위치에 정리해 주세요. 실제 이용 가능 여부는 예약 전 운영자에게 최종 확인하는 것이 가장 정확합니다.</p>
    </div>`;
    facilities.insertAdjacentElement("afterend",section);
  }

  const booking=document.getElementById("booking");
  if(booking&&!document.getElementById("location")){
    const naverUrl=`https://map.naver.com/p/search/${encodedAddress}`;
    const kakaoUrl=`https://map.kakao.com/?q=${encodedAddress}`;
    const googleUrl=`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const embedUrl=`https://www.google.com/maps?q=${encodedAddress}&output=embed`;
    const section=document.createElement("section");
    section.className="section location-section";
    section.id="location";
    section.innerHTML=`<div class="shell">
      <header class="section-head">
        <p class="kicker">LOCATION</p>
        <h2>주소와 지도를 확인하고<br>편하게 찾아오세요.</h2>
        <p>지도 앱에서 출발지를 설정하면 현재 위치 기준의 실시간 차량·대중교통 경로를 확인할 수 있습니다.</p>
      </header>
      <div class="location-layout">
        <article class="map-card"><div class="map-frame"><iframe title="퓨처스페이스 게임파티룸 위치 지도" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${embedUrl}"></iframe></div></article>
        <article class="location-info-card">
          <p class="location-label">ADDRESS</p>
          <h3>퓨처스페이스 게임파티룸</h3>
          <div class="address-box"><strong>${address}</strong><button class="copy-address" type="button">주소 복사</button></div>
          <div class="map-actions">
            <a class="primary-map" href="${naverUrl}" target="_blank" rel="noopener">네이버지도에서 길찾기</a>
            <a href="${kakaoUrl}" target="_blank" rel="noopener">카카오맵 열기</a>
            <a href="${googleUrl}" target="_blank" rel="noopener">Google 지도 열기</a>
          </div>
          <div class="route-grid">
            <div class="route-card"><b>자가용·택시</b><p>내비게이션에 ‘${address}’를 입력해 주세요. 골목 진입 후 건물 번호를 확인하면 됩니다.</p></div>
            <div class="route-card"><b>대중교통</b><p>출발지에 따라 이용 노선이 달라질 수 있으므로 위 길찾기 버튼에서 실시간 버스·도보 경로를 확인해 주세요.</p></div>
            <div class="route-card"><b>도착 전 확인</b><p>주차 위치, 출입 방법과 상세 입실 안내는 예약 확정 후 운영자 안내를 확인해 주세요.</p></div>
          </div>
          <p class="location-warning">주소는 실제 운영 정보로 반영했습니다. 주차 가능 대수와 상세 출입 동선은 사장님 확인 후 추가됩니다.</p>
        </article>
      </div>
    </div>`;
    booking.parentNode.insertBefore(section,booking);
    section.querySelector(".copy-address").addEventListener("click",async event=>{
      try{await navigator.clipboard.writeText(address);event.currentTarget.textContent="복사 완료";setTimeout(()=>event.currentTarget.textContent="주소 복사",1600)}catch(error){window.prompt("주소를 복사해 주세요.",address)}
    });
  }

  const nav=document.getElementById("primaryNav");
  if(nav){
    if(!nav.querySelector('a[href="#games"]')){const a=document.createElement("a");a.href="#games";a.textContent="게임 목록";nav.insertBefore(a,nav.querySelector('a[href="#guide"]')||null)}
    if(!nav.querySelector('a[href="#location"]')){const a=document.createElement("a");a.href="#location";a.textContent="오시는 길";nav.insertBefore(a,nav.querySelector('a[href="#booking"]')||null)}
  }

  document.querySelectorAll('[data-review-field="address"]').forEach(el=>el.textContent=address);
  document.querySelectorAll('[data-config-text="address"]').forEach(el=>el.textContent=address);

  const schemaScript=[...document.querySelectorAll('script[type="application/ld+json"]')].find(script=>script.textContent.includes('LocalBusiness'));
  if(schemaScript){
    try{const data=JSON.parse(schemaScript.textContent);data.address={"@type":"PostalAddress","streetAddress":"송학1길 67-21","addressLocality":"파주시","addressRegion":"경기도","addressCountry":"KR"};schemaScript.textContent=JSON.stringify(data)}catch(error){console.warn("LocalBusiness schema update skipped",error)}
  }
})();