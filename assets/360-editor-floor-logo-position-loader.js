(() => {
  'use strict';
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`${src} 로드 실패`));
    document.head.appendChild(script);
  });
  (async () => {
    try {
      await load('assets/360-editor-floor-logo-position-p1.js?v=20260714-floorlogo2');
      const code = window.__lava360FloorLogoCode || '';
      delete window.__lava360FloorLogoCode;
      if (!code) throw new Error('바닥 로고 편집기 코드를 구성하지 못했습니다.');
      (0, eval)(code);
    } catch (error) {
      console.error(error);
      const pill = document.querySelector('#statusPill');
      if (pill) {
        pill.textContent = '바닥 로고 편집 모듈 로드 실패';
        pill.classList.add('error');
      }
    }
  })();
})();
