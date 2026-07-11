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
    if(!nav||!toggle||!nav.classList.contains("open"))return;
    if(nav.contains(event.target)||toggle.contains(event.target))return;
    closeMenu();
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

  document.querySelectorAll('a[target="_blank"]').forEach(link=>{
    if(!link.rel.includes("noopener"))link.rel=`${link.rel} noopener`.trim();
  });
})();
