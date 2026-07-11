(()=>{
  'use strict';
  window.__lava360b64='';
  const files=['assets/360-lite-p1.js?v=20260711i','assets/360-lite-p2.js?v=20260711i','assets/360-lite-p3.js?v=20260711i'];
  const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
  (async()=>{try{for(const file of files)await load(file);const bytes=Uint8Array.from(atob(window.__lava360b64),c=>c.charCodeAt(0));const code=new TextDecoder().decode(bytes);(0,eval)(code);}catch(error){console.error(error);const status=document.querySelector('#statusPill');if(status){status.textContent='편집기 로드 실패';status.classList.add('error');}}})();
})();
