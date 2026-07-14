(() => {
  'use strict';

  const status = (message, isError = false) => {
    const pill = document.querySelector('#statusPill');
    if (!pill) return;
    pill.textContent = message;
    pill.classList.toggle('error', isError);
  };

  const loadScript = (src, optional = false) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = () => {
      if (optional) resolve(null);
      else reject(new Error(`${src} 로드 실패`));
    };
    document.head.appendChild(script);
  });

  (async () => {
    try {
      await loadScript('assets/360-editor-view-export.js?v=20260714-view-export1', true);
      await loadScript('assets/360-editor-pro-loader.js?v=20260713-pro1');
      await loadScript('assets/360-editor-gpano-fix.js?v=20260713-naver360-1', true);
    } catch (error) {
      console.error(error);
      status('편집기 로드 실패', true);
    }
  })();
})();
