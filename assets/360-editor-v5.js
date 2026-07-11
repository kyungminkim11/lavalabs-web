(()=>{
  'use strict';
  const status=document.querySelector('#statusPill');
  const device=document.querySelector('#deviceHint');
  if(status){status.textContent='새 편집기 시작 중';status.classList.add('busy');}
  if(device)device.textContent='RUNTIME V11 · SHAPES 3D';
  window.__lava360b64='';

  const preFiles=[
    'assets/360-logo-editor.js?v=20260711s',
    'assets/360-logo-editor-pro.js?v=20260711s',
    'assets/360-logo-editor-pro-refresh.js?v=20260711s',
    'assets/360-logo-aspect-v2.js?v=20260711s',
    'assets/360-lite-p1.js?v=20260711s',
    'assets/360-lite-p2.js?v=20260711s',
    'assets/360-lite-p3.js?v=20260711s'
  ];
  const postFiles=[
    'assets/360-editor-privacy-v3.js?v=20260711s'
  ];

  const load=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=()=>reject(new Error(`${src} 로드 실패`));
    document.head.appendChild(script);
  });

  const ensurePrivacyBaseStyle=()=>{
    if(document.querySelector('link[data-privacy-base-style]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/360-editor-privacy.css?v=20260711s';
    link.dataset.privacyBaseStyle='true';
    document.head.appendChild(link);
  };

  (async()=>{
    try{
      for(const file of preFiles)await load(file);
      const bytes=Uint8Array.from(atob(window.__lava360b64),character=>character.charCodeAt(0));
      const code=new TextDecoder().decode(bytes);
      (0,eval)(code);
      ensurePrivacyBaseStyle();
      for(const file of postFiles)await load(file);
      if(device)device.textContent='RUNTIME V11 · SHAPES 3D';
    }catch(error){
      console.error(error);
      if(status){
        status.textContent=`편집기 로드 실패 · ${error.message}`;
        status.classList.remove('busy');
        status.classList.add('error');
      }
    }
  })();
})();