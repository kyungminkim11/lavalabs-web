(()=>{
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const ready=()=>{
    if(path==='services.html')return Boolean(document.querySelector('#taxonomy-services'));
    if(['photography.html','space.html','pov-video.html','web.html','map.html','store.html'].includes(path))return Boolean(document.querySelector('#service-tools'));
    return true;
  };
  let attempts=0;
  const load=()=>{
    if(document.querySelector('script[data-service-journeys]'))return;
    const script=document.createElement('script');
    script.src='assets/service-journeys.js?v=20260706';
    script.dataset.serviceJourneys='1';
    document.body.appendChild(script);
  };
  const wait=()=>{
    if(ready()||attempts>=80){load();return}
    attempts+=1;
    setTimeout(wait,100);
  };
  wait();
})();
