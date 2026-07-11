(()=>{
  "use strict";
  if(window.__PARTYROOM_LIVE_UPGRADE__) return;
  window.__PARTYROOM_LIVE_UPGRADE__=true;

  const config=window.PARTYROOM_CONFIG||{};
  const $=(selector,root=document)=>root.querySelector(selector);

  document.querySelector(".review-banner")?.remove();
  document.getElementById("owner-review")?.remove();
  document.querySelector('a[href="#owner-review"]')?.remove();

  document.title="야당역 파티룸 | 퓨처스페이스 게임파티룸";

  const heroCopy=$(".hero-copy");
  if(heroCopy) heroCopy.textContent="야당역에서 도보 약 1분. 30평대 넓은 공간에 고사양 PC 5대, 75인치 UHD TV, PS5와 Switch 2, TJ 노래방, 10인 홀덤 테이블을 갖춘 프라이빗 게임파티룸입니다.";

  const heroPoints=$(".hero-points");
  if(heroPoints) heroPoints.innerHTML="<li>고사양 PC 5대</li><li>PS5 · Switch 2</li><li>TJ 노래방</li><li>10인 홀덤</li><li>최대 20인</li><li>무료주차 2대</li>";

  const summary=$(".summary-grid");
  if(summary) summary.innerHTML="<article><strong>30평대</strong><span>단체 모임을 위한 넓은 프라이빗 공간</span></article><article><strong>20명</strong><span>예약 상품 기준 최대 이용 인원</span></article><article><strong>PC 5대</strong><span>27인치 200Hz 모니터와 고사양 구성</span></article><article><strong>24H</strong><span>낮·밤·올데이·밤샘 선택 가능</span></article>";

  const features=[...document.querySelectorAll(".feature-card .feature-copy")];
  if(features[0]) features[0].innerHTML="<span>01 · MAIN LOUNGE</span><h3>75인치 UHD TV · TJ 노래방 · PS5</h3><p>JBL 마이크로 노래를 즐기고 PS5와 Switch 2 콘솔 게임을 함께 이용하는 메인 라운지입니다.</p>";
  if(features[1]) features[1].innerHTML="<span>02 · PC ZONE</span><h3>고사양 PC 5대</h3><p>CPU 5600X급 이상, 그래픽카드 4060급 구성의 PC와 27인치 200Hz 모니터가 준비되어 있습니다. 세부 사양은 PC별로 다를 수 있습니다.</p>";
  if(features[2]) features[2].innerHTML="<span>03 · HOLDEM</span><h3>10인 홀덤 테이블</h3><p>단체 게임을 위한 전용 테이블과 칩·카드가 준비되어 있습니다.</p>";

  const amenities=$(".amenity-grid");
  if(amenities) amenities.innerHTML="<article><b>75</b><h3>75인치 UHD TV</h3><p>TJ 노래방 기기, JBL 마이크와 PS5를 대형 화면으로 이용할 수 있습니다.</p></article><article><b>PC</b><h3>고사양 PC 5대</h3><p>27인치 200Hz 모니터와 CPU 5600X급 이상·그래픽카드 4060급 구성을 제공합니다.</p></article><article><b>♠</b><h3>10인 홀덤 테이블</h3><p>홀덤 칩과 카드, 여러 종류의 보드게임을 함께 이용할 수 있습니다.</p></article><article><b>GAME</b><h3>PS5 · Switch 2</h3><p>스포츠, 격투와 파티게임 등 여러 명이 함께 즐기기 좋은 타이틀이 준비되어 있습니다.</p></article><article><b>WiFi</b><h3>KT 인터넷 · CCTV</h3><p>무선 인터넷을 제공하며 안전을 위해 실내 CCTV가 녹화 운영됩니다.</p></article><article><b>＋</b><h3>간단 취사 · 화장실</h3><p>인덕션으로 라면 등 간단 조리가 가능하며 건물 공용 화장실을 파티룸 전용으로 이용합니다.</p></article>";

  const bookingHead=$("#booking .section-head");
  if(bookingHead) bookingHead.innerHTML="<p class=\"kicker\">BOOKING & VISIT</p><h2>이용 시간과 요금을<br>한눈에 비교하세요.</h2><p>낮·밤·올데이 상품의 시간과 평일·주말 요금을 비교한 뒤 원하는 예약 채널을 선택할 수 있습니다.</p>";

  const bookingTitle=$(".booking-main h3");
  if(bookingTitle) bookingTitle.innerHTML="현재 예약과 이용은<br>퓨처스페이스 1호 기준입니다.";

  const legacyFacts=$(".booking-facts");
  if(legacyFacts){
    const pricing=document.createElement("div");
    pricing.className="booking-pricing";
    pricing.setAttribute("aria-label","퓨처스페이스 이용 요금과 운영 기준");
    pricing.innerHTML=`
      <div class="rate-card-grid">
        <article class="rate-card">
          <div class="rate-card__head"><span>DAY</span><b>6시간</b></div>
          <h4>낮 타임</h4>
          <p class="rate-time"><strong>11:00</strong><i>→</i><strong>17:00</strong></p>
          <dl class="rate-prices">
            <div><dt>평일 · 월~금</dt><dd>100,000원</dd></div>
            <div><dt>주말 · 공휴일</dt><dd>180,000원</dd></div>
          </dl>
        </article>
        <article class="rate-card rate-card--accent">
          <div class="rate-card__head"><span>NIGHT</span><b>6시간 30분</b></div>
          <h4>밤 타임</h4>
          <p class="rate-time"><strong>18:30</strong><i>→</i><strong>01:00</strong></p>
          <dl class="rate-prices">
            <div><dt>평일 · 월~금</dt><dd>129,000원</dd></div>
            <div><dt>주말 · 공휴일</dt><dd>209,000원</dd></div>
          </dl>
          <p class="rate-option">밤샘 추가 가능</p>
        </article>
        <article class="rate-card">
          <div class="rate-card__head"><span>ALL DAY</span><b>14시간</b></div>
          <h4>올데이</h4>
          <p class="rate-time"><strong>11:00</strong><i>→</i><strong>01:00</strong></p>
          <dl class="rate-prices">
            <div><dt>평일 · 월~금</dt><dd>159,000원</dd></div>
            <div><dt>주말 · 공휴일</dt><dd>239,000원</dd></div>
          </dl>
          <p class="rate-option">밤샘 추가 가능</p>
        </article>
      </div>
      <div class="booking-essentials" aria-label="인원과 추가요금">
        <article><span>기준 인원</span><strong>6인</strong></article>
        <article><span>최대 인원</span><strong>20인</strong></article>
        <article><span>인원 추가</span><strong>1인당 10,000원</strong><small>6인 초과 시</small></article>
        <article><span>밤샘 추가</span><strong>30,000원</strong><small>다음 날 09:00 퇴실</small></article>
      </div>
      <div class="booking-notices">
        <p><b>보증금</b><span>시설·청소 보증금 100,000원 별도 · 퇴실 점검 후 1~3일 내 환급</span></p>
        <p><b>군인 할인</b><span>군인 신분 인증 시 최종 이용요금 10% 할인</span></p>
      </div>`;
    legacyFacts.replaceWith(pricing);
  }

  const primary=document.getElementById("bookingPrimary");
  if(primary){
    primary.href=config.bookingUrl||"https://naver.me/FdqhKL45";
    primary.textContent="네이버 예약하기";
    primary.target="_blank";
    primary.rel="noopener";
    primary.removeAttribute("aria-disabled");
    let actions=primary.closest(".booking-actions");
    if(!actions){
      actions=document.createElement("div");
      actions.className="booking-actions";
      primary.before(actions);
      actions.append(primary);
    }
    if(!document.getElementById("bookingSecondary")){
      const secondary=document.createElement("a");
      secondary.id="bookingSecondary";
      secondary.className="button booking-secondary";
      secondary.href=config.spacecloudUrl||"https://www.spacecloud.kr/space/77835";
      secondary.target="_blank";
      secondary.rel="noopener";
      secondary.textContent="스페이스클라우드 예약";
      actions.append(secondary);
    }
  }

  const bookingNote=$(".booking-note");
  if(bookingNote) bookingNote.textContent="예약 날짜와 상품에 따라 실제 결제 금액이 달라질 수 있으므로 예약 화면에서 최종 금액을 확인해 주세요.";

  const contactCard=$(".visit-grid article:nth-child(3)");
  if(contactCard){
    const p=$("p",contactCard);
    if(p) p.textContent="네이버 톡톡, 문자 또는 전화로 문의할 수 있습니다.";
  }
  const beforeCard=$(".visit-grid article:nth-child(4) p");
  if(beforeCard) beforeCard.textContent="시설·청소 보증금 10만원이 별도이며 퇴실 점검 후 1~3일 내 환급됩니다. 당일 취소는 환불되지 않습니다.";

  const faq=$(".faq-list");
  if(faq) faq.innerHTML="<details><summary>이용 시간은 어떻게 나뉘나요?</summary><p>낮 타임은 11:00~17:00, 밤 타임은 18:30~01:00, 올데이는 11:00~01:00입니다. 밤 타임 또는 올데이에 밤샘 옵션을 추가하면 다음 날 09:00에 퇴실합니다.</p></details><details><summary>기준 인원과 추가 요금은 얼마인가요?</summary><p>기준 인원은 6인, 예약 상품 기준 최대 20인입니다. 6인 초과 시 1인당 1만원의 추가 요금이 발생합니다.</p></details><details><summary>주차는 가능한가요?</summary><p>건물 주차장에 차량 2대까지 무료로 주차할 수 있으며 별도의 시간 제한은 없습니다.</p></details><details><summary>미성년자도 이용할 수 있나요?</summary><p>미성년자와 2006년생은 22시까지 이용할 수 있으며 초등학생은 보호자 동반이 필요합니다. 주류 반입은 성인만 가능합니다.</p></details><details><summary>취사와 음식 반입이 가능한가요?</summary><p>배달과 포장음식 반입이 가능하며 인덕션으로 라면 등 간단한 조리를 할 수 있습니다. 이용 후 원위치 정리와 쓰레기 정리를 부탁드립니다.</p></details><details><summary>보증금과 환불 규정은 어떻게 되나요?</summary><p>시설·청소 보증금 10만원이 별도이며 퇴실 점검 후 1~3일 내 환급됩니다. 파손, 과도한 오염, 실내 흡연, 정리 미흡 또는 절도 발생 시 차감되거나 환급되지 않을 수 있으며 당일 취소는 환불되지 않습니다.</p></details>";

  const footerText=$(".site-footer .footer-inner div:first-child p");
  if(footerText) footerText.textContent="경기도 파주시 송학1길 67-21, 1층 · 야당역 도보 약 1분 · 0507-1400-7266";

  const mobileBooking=$(".mobile-actions a:last-child");
  if(mobileBooking){mobileBooking.href=config.bookingUrl||"https://naver.me/FdqhKL45";mobileBooking.textContent="네이버 예약";mobileBooking.target="_blank";mobileBooking.rel="noopener";}

  const updateGames=()=>{
    const games=document.getElementById("games");
    if(!games) return false;
    const title=$(".game-card:first-child h3",games);
    if(title) title.textContent="PS5 · Nintendo Switch 2";
    const image=$(".game-card:first-child img",games);
    if(image) image.alt="플레이스테이션 5와 닌텐도 스위치 2 게임 타이틀";
    const lists=games.querySelectorAll(".game-tag-list");
    if(lists[0]) lists[0].innerHTML="<li>EA SPORTS FC 25</li><li>MLB The Show 24</li><li>UFC 5</li><li>Overcooked</li><li>Tekken 8</li><li>Mario Kart World</li><li>Mario Party</li><li>Nintendo Switch Sports</li>";
    if(lists[1]) lists[1].innerHTML="<li>홀덤</li><li>루미큐브</li><li>할리갈리</li><li>UNO</li><li>스플렌더</li><li>티켓 투 라이드: 유럽</li><li>모노폴리</li><li>딕싯</li><li>블로커스</li><li>아줄</li><li>다빈치 코드</li>";
    return true;
  };
  if(!updateGames()){
    const observer=new MutationObserver(()=>{if(updateGames()) observer.disconnect();});
    observer.observe(document.body,{childList:true,subtree:true});
  }

  const updateLocation=()=>{
    const location=document.getElementById("location");
    if(!location) return false;
    const naver=$(".primary-map",location);
    if(naver) naver.href=config.mapUrl||"https://naver.me/FdqhKL45";
    const routes=location.querySelectorAll(".route-card p");
    if(routes[0]) routes[0].textContent="내비게이션에 주소를 입력한 뒤 건물 1층 가운데 문으로 들어오세요. 왼쪽 Room 1이 퓨처스페이스 1호입니다.";
    if(routes[1]) routes[1].textContent="야당역 3번 출구에서 도보 약 1분 거리입니다. 정확한 경로는 네이버지도 길찾기에서 확인해 주세요.";
    const warning=$(".location-warning",location);
    if(warning) warning.textContent="현재 예약과 이용은 퓨처스페이스 1호 기준이며 건물 주차장에 차량 2대까지 무료주차할 수 있습니다.";
    return true;
  };
  if(!updateLocation()){
    const observer=new MutationObserver(()=>{if(updateLocation()) observer.disconnect();});
    observer.observe(document.body,{childList:true,subtree:true});
  }
})();