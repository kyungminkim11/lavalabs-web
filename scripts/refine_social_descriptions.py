from __future__ import annotations

import re
from build_social_previews import ROOT

DESCRIPTIONS = {
    "index": "홈페이지, 360° 가상투어, 공간 촬영, QR 매장 안내와 업무 자동화까지. 작은 매장과 브랜드를 위한 디지털 스튜디오입니다.",
    "services": "웹 제작, 쇼핑몰, 360 가상투어, 제품 스핀, QR 매장 솔루션과 업무 자동화 서비스를 한눈에 확인하세요.",
    "insights": "홈페이지 제작, 360 촬영과 매장 디지털 운영을 준비하는 소상공인과 브랜드를 위한 실무 가이드입니다.",
    "guide-360-product-photography": "회전판과 스마트폰으로 360도 제품을 촬영하는 방법, 적정 컷수, 조명과 중심 정렬 방법을 정리했습니다.",
    "guide-360-virtual-tour": "매장, 쇼룸, 파티룸과 사무실의 360 가상투어 촬영 전 준비사항과 공개 후 활용 방법을 안내합니다.",
    "guide-small-business-website": "소상공인 홈페이지 제작 전 정해야 할 목표, 페이지, 사진, 문의 방식, 도메인과 유지관리 기준을 확인하세요.",
    "web": "소상공인, 매장과 개인 브랜드를 위한 모바일 반응형 홈페이지와 랜딩페이지를 제작합니다.",
    "commerce": "브랜드와 소상공인을 위한 소규모 쇼핑몰, 상품 소개 페이지와 모바일 구매 흐름을 제작합니다.",
    "space": "매장, 쇼룸, 사무실과 대관 공간을 방문 전에 둘러볼 수 있는 360 가상투어와 공간 사진을 제작합니다.",
    "product-spin": "제품을 24~72컷으로 촬영해 마우스와 손가락으로 직접 돌려보는 360도 상품 스핀 뷰어를 제작합니다.",
    "lavaspin": "제품 사진 여러 장이나 회전 영상을 올리면 360도 상품 뷰, 공유 링크와 삽입 코드를 만드는 LavaSpin 베타입니다.",
    "space-rental": "공유오피스, 스터디룸, 파티룸과 대관 공간의 규모, 동선과 시설을 보여주는 360 가상투어입니다.",
    "space-fashion-popup": "의류 매장, 브랜드 쇼룸과 팝업스토어의 공간, 진열과 동선을 온라인으로 보여주는 360 가상투어입니다.",
    "photography": "홈페이지, 네이버 플레이스, SNS와 홍보물에 활용할 매장, 쇼룸과 사무실 공간 사진을 촬영합니다.",
    "pov-video": "지하철역과 주차장부터 매장 입구까지 고객 시점으로 보여주는 POV 길 안내 영상을 제작합니다.",
    "equipment": "라바랩스가 360 가상투어, 공간 사진과 POV 영상 제작에 사용하는 촬영 장비와 활용 방식을 소개합니다.",
    "store": "카페, 음식점과 오프라인 매장을 위한 QR 메뉴판, 다국어 모바일 안내와 예약·문의 연결 페이지를 제작합니다.",
    "map": "층별 안내, 구역별 정보와 시설 위치를 모바일에서 확인하는 인터랙티브 매장 지도와 QR 안내 웹을 제작합니다.",
    "operations": "바코드 스캔, 상품 검색, 가격·옵션 필터와 재고 확인을 빠르게 처리하는 매장 운영 시스템을 제작합니다.",
    "education-guide": "신입 직원 교육, 매장 운영 절차, 상품 설명과 응대 기준을 모바일에서 확인하는 디지털 매뉴얼입니다.",
    "automation": "반복 입력, 데이터 정리, 매출·재고 보고서와 상품 검색 업무를 엑셀과 파이썬으로 자동화합니다.",
    "custom-development": "검색, 관리자, 예약과 데이터 연동 등 현장 업무에 필요한 맞춤형 웹앱과 내부 시스템을 개발합니다.",
    "packages": "홈페이지, QR 안내, 매장 사진, 360 가상투어와 업무 자동화를 매장 상황에 맞춰 묶어 제공합니다.",
    "maintenance": "홈페이지 문구·이미지 교체, 모바일 오류, 기능 수정과 운영 중 필요한 유지관리 범위를 안내합니다.",
    "start": "웹사이트, 360 촬영과 업무 시스템을 의뢰하기 전에 준비할 목표, 자료, 일정과 예산을 확인하세요.",
    "portfolio": "라바랩스가 제작한 360 가상투어, 매장 상품 검색, 리포트 자동화와 모바일 웹 프로젝트를 소개합니다.",
    "pricing": "랜딩페이지, 홈페이지, QR 메뉴판, 공간 촬영, 360 가상투어와 자동화의 기본 시작 가격을 확인하세요.",
    "partnership": "인테리어, 마케팅, 부동산, 사진, 영상과 개발 분야의 소개 파트너와 공동 제작 협업을 제안받습니다.",
    "about": "라바랩스는 작은 매장과 브랜드의 웹사이트, 공간 콘텐츠, 제품 촬영과 반복 업무 자동화를 만드는 디지털 스튜디오입니다.",
    "contact": "홈페이지, 360 가상투어, 제품 스핀, QR 매장 안내와 업무 자동화 제작 범위와 견적을 문의하세요.",
    "faq": "제작 기간, 수정 범위, 도메인·호스팅, 결제, 소스 코드와 유지관리에 관한 자주 묻는 질문입니다.",
    "sitemap": "라바랩스의 전체 서비스, 제작 사례, 가격, 실무 가이드와 회사 안내 페이지를 한눈에 확인하세요.",
    "privacy": "라바랩스 웹사이트와 프로젝트 문의 과정에서 처리하는 개인정보의 항목, 목적과 이용자 권리를 안내합니다.",
    "terms": "라바랩스 웹 제작, 촬영, 자동화와 유지관리 서비스의 상담, 견적, 계약, 수정과 납품 기준을 안내합니다.",
}


def replace_meta(html: str, key: str, value: str, content: str) -> str:
    pattern = rf'(<meta\s+[^>]*{key}=["\']{re.escape(value)}["\'][^>]*content=["\'])[^"\']*(["\'][^>]*>)'
    if re.search(pattern, html, flags=re.IGNORECASE):
        return re.sub(pattern, rf'\1{content}\2', html, count=1, flags=re.IGNORECASE)

    reverse_pattern = rf'(<meta\s+[^>]*content=["\'])[^"\']*(["\'][^>]*{key}=["\']{re.escape(value)}["\'][^>]*>)'
    if re.search(reverse_pattern, html, flags=re.IGNORECASE):
        return re.sub(reverse_pattern, rf'\1{content}\2', html, count=1, flags=re.IGNORECASE)
    return html


def update_page(slug: str, description: str) -> None:
    filename = "index.html" if slug == "index" else f"{slug}.html"
    path = ROOT / filename
    if not path.exists():
        return
    html = path.read_text(encoding="utf-8")
    html = replace_meta(html, "property", "og:description", description)
    html = replace_meta(html, "name", "twitter:description", description)
    path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    for page_slug, page_description in DESCRIPTIONS.items():
        update_page(page_slug, page_description)
    print(f"Refined social descriptions for {len(DESCRIPTIONS)} pages")
