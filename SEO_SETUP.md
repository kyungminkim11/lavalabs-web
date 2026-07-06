# LavaLabs 검색엔진 등록 체크리스트

## 현재 적용된 항목

- 페이지별 고유 title·description·canonical
- Open Graph·Twitter 공유 메타
- Organization·WebSite·WebPage·Service·Breadcrumb 구조화 데이터
- LavaSpin SoftwareApplication 구조화 데이터
- FAQ·Article 구조화 데이터
- robots.txt 및 XML sitemap
- 페이지별 이동 경로와 관련 서비스 내부 링크
- 404 페이지 noindex
- 검색 유입용 인사이트 허브 및 실무 가이드

## 제출할 주소

- 사이트: `https://space.lavalabs.co.kr/`
- 사이트맵: `https://space.lavalabs.co.kr/sitemap.xml`
- robots: `https://space.lavalabs.co.kr/robots.txt`

## Google Search Console

1. Search Console에서 `space.lavalabs.co.kr` 또는 도메인 속성을 추가합니다.
2. 안내되는 DNS TXT 레코드로 소유권을 인증합니다.
3. Sitemaps 메뉴에서 `sitemap.xml`을 제출합니다.
4. URL 검사에서 아래 페이지를 우선 색인 요청합니다.
   - `/`
   - `/services.html`
   - `/web.html`
   - `/space.html`
   - `/product-spin.html`
   - `/lavaspin.html`
   - `/insights.html`
5. 색인 생성, 페이지 경험과 검색 실적 보고서를 주기적으로 확인합니다.

## 네이버 서치어드바이저

1. 웹마스터 도구에 `https://space.lavalabs.co.kr/`을 등록합니다.
2. HTML 메타 태그 또는 파일 방식으로 소유권을 인증합니다.
3. 요청 > 사이트맵 제출에서 `/sitemap.xml`을 등록합니다.
4. 검증 > robots.txt에서 접근 가능 여부를 확인합니다.
5. 요청 > 웹 페이지 수집에서 홈과 주요 서비스·가이드 페이지를 우선 요청합니다.

## 등록 후 점검

- 검색 결과 제목이 페이지별로 다르게 나타나는지 확인
- 잘못된 canonical 또는 중복 페이지 경고 확인
- 모바일 사용성 및 Core Web Vitals 확인
- 구조화 데이터 오류 확인
- 검색어별 노출·클릭·클릭률 기록
- 1~2개월 단위로 실제 검색어에 맞춰 제목과 본문 보완

## 콘텐츠 운영 권장

검색 유입은 초기 설정만으로 고정되지 않습니다. 고객이 실제로 검색하는 질문을 기준으로 월 1~2개의 실무 가이드를 추가하고, 각 글에서 관련 서비스 페이지로 자연스럽게 연결합니다.
