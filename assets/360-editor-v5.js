(()=>{
  'use strict';
  const status=document.querySelector('#statusPill');
  const device=document.querySelector('#deviceHint');
  if(status){status.textContent='새 편집기 시작 중';status.classList.add('busy');}
  if(device)device.textContent='RUNTIME V9 · PRIVACY';
  window.__lava360b64='';
  const files=[
    'assets/360-logo-editor.js?v=20260711p',
    'assets/360-logo-editor-pro.js?v=20260711p',
    'assets/360-logo-editor-pro-refresh.js?v=20260711p',
    'assets/360-editor-privacy.js?v=20260711p',
    'assets/360-lite-p1.js?v=20260711p',
    'assets/360-lite-p2.js?v=20260711p',
    'assets/360-lite-p3.js?v=20260711p'
  ];
  const load=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=()=>reject(new Error(`${src} 로드 실패`));
    document.head.appendChild(script);
  });
  (async()=>{
    try{
      for(const file of files)await load(file);
      const bytes=Uint8Array.from(atob(window.__lava360b64),character=>character.charCodeAt(0));
      const code=new TextDecoder().decode(bytes);
      (0,eval)(code);
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