(()=>{
  "use strict";
  if(window.__PARTYROOM_FINAL_QA__) return;
  window.__PARTYROOM_FINAL_QA__=true;

  const nav=document.getElementById("primaryNav");
  const toggle=document.querySelector(".menu-toggle");
  const links=[...(nav?.querySelectorAll('a[href^="#"]')||[])];
  const sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);

  const closeMenu=()=>{
    if(!nav||!toggle)return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
    document.body.classList.remove("menu-open");
  };

  document.addEventListener("click",event=>{
    if(nav&&toggle&&nav.classList.contains("open")&&!nav.contains(event.target)&&!toggle.contains(event.target))closeMenu();
  });

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape")closeMenu();
  });

  if("IntersectionObserver" in window&&sections.length){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      links.forEach(link=>{
        const active=link.getAttribute("href")===`#${visible.target.id}`;
        if(active)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current");
      });
    },{rootMargin:"-30% 0px -58%",threshold:[0,.12,.3]});
    sections.forEach(section=>observer.observe(section));
  }

  document.querySelectorAll(".copy-address").forEach(button=>button.addEventListener("click",async()=>{
    const address=button.dataset.address||window.PARTYROOM_CONFIG?.address||"경기도 파주시 송학1길 67-21, 1층";
    const original=button.textContent;
    try{
      if(navigator.clipboard)await navigator.clipboard.writeText(address);
      else window.prompt("주소를 복사해 주세요.",address);
      button.textContent="복사 완료";
      window.setTimeout(()=>button.textContent=original,1600);
    }catch(error){window.prompt("주소를 복사해 주세요.",address)}
  }));

  document.querySelectorAll('a[target="_blank"]').forEach(link=>{
    if(!link.rel.includes("noopener"))link.rel=`${link.rel} noopener`.trim();
  });

  if(!document.querySelector('script[data-lava-contrast-guard]')){
    const contrastGuard=document.createElement('script');
    contrastGuard.src='/assets/site-contrast-guard.js?v=20260714a';
    contrastGuard.dataset.lavaContrastGuard='true';
    document.head.appendChild(contrastGuard);
  }
})();