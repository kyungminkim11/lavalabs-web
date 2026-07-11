(()=>{
  'use strict';
  const script=document.createElement('script');
  script.src='assets/360-editor-v5.js?v=20260711e';
  script.async=false;
  script.onerror=()=>{
    const status=document.querySelector('#statusPill');
    if(status){status.textContent='편집기 로드 실패';status.classList.add('error');}
  };
  document.body.appendChild(script);
})();