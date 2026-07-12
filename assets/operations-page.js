(()=>{
  const $=(selector,root=document)=>root.querySelector(selector);
  const path=(location.pathname.split('/').pop()||'').toLowerCase();
  if(path!=='operations.html')return;

  document.title='매장 운영 시스템 | LavaLabs';
  $('#main').innerHTML=`
    <section class="page-hero">
      <div class="container inner">
        <span class="eyebrow">STORE OPERATIONS SYSTEM</span>
        <h1>상품을 찾고, 재고를 세고,<br>판매 데이터를 연결합니다.</h1>
        <p>바코드 상품 검색, 위치·수량 관리, 모바일 재고 조사와 POS·쇼핑몰 데이터를 매장의 실제 업무 흐름에 맞게 연결합니다.</p>
        <div class="subnav">
          <a href="#functions">기능 보기</a>
          <a href="#scope">연동 범위</a>
          <a href="#process">진행 절차</a>
          <a href="contact.html">도입 상담</a>
        </div>
      </div>
    </section>

    <section class="system-section alt" id="functions">
      <div class="container">
        <div class="system-head">
          <span class="eyebrow">CORE FUNCTIONS</span>
          <h2>현장에서 반복되는<br>네 가지 업무부터.</h2>
          <p>처음부터 거대한 ERP를 만들지 않습니다. 현재 가장 오래 걸리는 업무 한두 가지부터 작게 구축하고 실제 사용 후 확장합니다.</p>
        </div>
        <div class="system-grid">
          <article class="system-card">
            <span class="system-label">BARCODE & SEARCH</span>
            <h3>바코드·상품 검색</h3>
            <p>스마트폰 카메라나 일반 바코드 스캐너로 상품을 찾고 필요한 정보를 바로 확인합니다.</p>
            <ul class="system-list">
              <li>카메라·USB·블루투스 스캔</li>
              <li>상품명·브랜드·유사 키워드 검색</li>
              <li>가격·옵션·카테고리 필터</li>
              <li>상품 이미지·상세·재고 위치 표시</li>
              <li>Excel·CSV 상품 일괄 등록</li>
            </ul>
          </article>
          <article class="system-card dark">
            <span class="system-label">INVENTORY LOCATION</span>
            <h3>재고·위치 관리</h3>
            <p>어떤 상품이 어느 층, 진열대, 창고와 서랍에 몇 개 있는지 관리합니다.</p>
            <ul class="system-list">
              <li>한 상품의 여러 보관 위치</li>
              <li>입고·출고·이동·재고 조정</li>
              <li>파손·샘플·전시품 구분</li>
              <li>저재고·품절·재주문 표시</li>
              <li>담당자별 변경 기록</li>
            </ul>
          </article>
          <article class="system-card dark">
            <span class="system-label">STOCK COUNT</span>
            <h3>모바일 재고 조사</h3>
            <p>종이나 별도 엑셀 대신 구역별로 바코드를 스캔하고 실제 수량을 입력합니다.</p>
            <ul class="system-list">
              <li>연속 스캔·수량 자동 증가</li>
              <li>구역·담당자별 조사</li>
              <li>중간 저장·이어하기</li>
              <li>장부 대비 차이·미조사 표시</li>
              <li>사유·사진·최종 보고서</li>
            </ul>
          </article>
          <article class="system-card">
            <span class="system-label">DATA & DASHBOARD</span>
            <h3>판매·재고 대시보드</h3>
            <p>판매, 입출고와 조사 결과를 매장에서 확인하기 쉬운 화면과 보고서로 정리합니다.</p>
            <ul class="system-list">
              <li>오늘 판매·현재 재고 요약</li>
              <li>인기·부진·저재고 상품</li>
              <li>최근 입고·출고 기록</li>
              <li>직원별 작업·조사 진행률</li>
              <li>Excel·CSV 보고서 출력</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="system-section dark">
      <div class="container">
        <div class="system-head">
          <span class="eyebrow">SCREEN EXAMPLE</span>
          <h2>직원이 바로 이해하는<br>정보 구조로 만듭니다.</h2>
        </div>
        <div class="sample-screen">
          <h3>상품 상세 예시</h3>
          <div class="sample-product">
            <small>바코드 8801234XXXXXX</small>
            <strong>프리미엄 블렌드 티 기프트 세트</strong>
            <div class="sample-stock">
              <div><span>총 재고</span><b>6개</b></div>
              <div><span>1층 진열장 A-03</span><b>2개</b></div>
              <div><span>2층 창고 B-12</span><b>4개</b></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="system-section" id="scope">
      <div class="container">
        <div class="system-head">
          <span class="eyebrow">INTEGRATION SCOPE</span>
          <h2>연동 가능 여부를<br>세 단계로 구분합니다.</h2>
        </div>
        <div class="scope-grid">
          <article class="scope-card good">
            <span>AVAILABLE</span><h3>바로 제공 가능한 범위</h3>
            <ul><li>Excel·CSV 상품·판매 데이터</li><li>바코드·상품 검색</li><li>재고·위치·재고 조사</li><li>판매·재고 보고서</li><li>모바일·태블릿·PC 웹앱</li></ul>
          </article>
          <article class="scope-card conditional">
            <span>REVIEW REQUIRED</span><h3>확인 후 가능한 연동</h3>
            <ul><li>공식 API가 있는 POS</li><li>카페24·Shopify 상품·재고</li><li>실시간·주기적 데이터 동기화</li><li>라벨 프린터·알림 서비스</li><li>여러 지점 통합 관리</li></ul>
          </article>
          <article class="scope-card limit">
            <span>NOT A STANDARD OFFER</span><h3>대표 상품으로 약속하지 않는 범위</h3>
            <ul><li>모든 POS·단말기 직접 제어</li><li>결제 승인·취소 시스템 자체 구축</li><li>대기업용 ERP·WMS 전체 구축</li><li>RFID·CCTV 자동 재고 인식</li><li>24시간 무중단 장애 대응</li></ul>
          </article>
        </div>
        <div class="system-notice">
          <i>API</i>
          <div><strong>POS API 연동은 사용 중인 서비스 확인이 먼저입니다.</strong><p>공식 API, 인증키, 웹훅 또는 Excel·CSV 내보내기가 제공되어야 합니다. 공개 API가 없거나 계약상 접근이 제한된 서비스는 실시간 연동을 보장하지 않습니다.</p></div>
        </div>
      </div>
    </section>

    <section class="system-section dark" id="process">
      <div class="container">
        <div class="system-head">
          <span class="eyebrow">PROJECT PROCESS</span>
          <h2>현재 재고 업무를 본 뒤<br>작은 버전부터 적용합니다.</h2>
        </div>
        <div class="system-process">
          <article class="system-step"><span>01 · OBSERVE</span><h3>업무 확인</h3><p>상품 등록, 입출고, 판매와 조사 과정을 확인합니다.</p></article>
          <article class="system-step"><span>02 · DATA</span><h3>데이터 점검</h3><p>바코드, 상품 코드와 POS·Excel 형식을 비교합니다.</p></article>
          <article class="system-step"><span>03 · SCOPE</span><h3>기능 결정</h3><p>검색, 위치, 조사와 연동 중 우선 기능을 정합니다.</p></article>
          <article class="system-step"><span>04 · PROTOTYPE</span><h3>시제품 제작</h3><p>실제 상품 일부로 모바일 화면과 흐름을 검증합니다.</p></article>
          <article class="system-step"><span>05 · BUILD</span><h3>개발·등록</h3><p>데이터 구조, 화면, 권한과 보고서를 구성합니다.</p></article>
          <article class="system-step"><span>06 · TEST</span><h3>현장 테스트</h3><p>스캔 속도, 중복과 수량 차이를 실제 매장에서 확인합니다.</p></article>
          <article class="system-step"><span>07 · TRAIN</span><h3>사용 안내</h3><p>직원별 역할과 재고 조사 방법을 안내합니다.</p></article>
          <article class="system-step"><span>08 · IMPROVE</span><h3>운영 후 개선</h3><p>실제 사용 결과에 따라 연동과 기능을 확장합니다.</p></article>
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <div class="cta-panel">
          <div><h3>현재 사용하는 상품 파일과 재고 조사 방식을 보여주세요.</h3><p>POS 종류, 상품 수, 위치 구조와 가장 불편한 업무를 확인해 첫 구축 범위를 제안합니다.</p></div>
          <a class="button button-primary" data-service="매장 운영 시스템" href="contact.html">도입 상담하기</a>
        </div>
      </div>
    </section>`;

  document.querySelectorAll('[data-service]').forEach(anchor=>anchor.addEventListener('click',()=>sessionStorage.setItem('service',anchor.dataset.service)));
})();
