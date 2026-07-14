(()=>{
  "use strict";
  if(window.__PARTYROOM_CASE_FINAL_QA__) return;
  window.__PARTYROOM_CASE_FINAL_QA__=true;
  document.documentElement.classList.add("reveal-ready");

  const allowedUtm=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
  const currentParams=new URLSearchParams(location.search);

  const enhanceLiveLink=link=>{
    if(!link)return;
    try{
      const url=new URL(link.getAttribute("href"),location.origin);
      allowedUtm.forEach(key=>{
        if(currentParams.has(key)&&!url.searchParams.has(key))url.searchParams.set(key,currentParams.get(key));
      });
      if(!url.searchParams.has("utm_source"))url.searchParams.set("utm_source","lavalabs");
      if(!url.searchParams.has("utm_medium"))url.searchParams.set("utm_medium","case-study");
      if(!url.searchParams.has("utm_campaign"))url.searchParams.set("utm_campaign","partyroom-360");
      link.href=url.pathname+url.search+url.hash;
    }catch(error){console.warn("final live-link enhancement skipped",error)}
  };

  document.querySelectorAll("[data-live-site]").forEach(enhanceLiveLink);

  const explorerButtons=[...document.querySelectorAll("[data-deliverable]")];
  const syncTabs=()=>{
    explorerButtons.forEach(button=>{
      const selected=button.getAttribute("aria-selected")==="true";
      button.tabIndex=selected?0:-1;
    });
    const link=document.getElementById("explorerLink");
    if(link&&link.getAttribute("href")?.startsWith("/partyroom/"))enhanceLiveLink(link);
  };
  explorerButtons.forEach(button=>button.addEventListener("click",()=>setTimeout(syncTabs,0)));
  syncTabs();

  const nav=document.getElementById("primaryNav");
  const toggle=document.querySelector(".menu-toggle");
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
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});

  if(typeof window.loadScene!=="function"){
    window.setTimeout(()=>{
      document.querySelectorAll(".reveal-section:not(.is-visible)").forEach(section=>section.classList.add("is-visible"));
    },1200);
  }

  if(!document.querySelector('script[data-lava-contrast-guard]')){
    const contrastGuard=document.createElement('script');
    contrastGuard.src='/assets/site-contrast-guard.js?v=20260714a';
    contrastGuard.dataset.lavaContrastGuard='true';
    document.head.appendChild(contrastGuard);
  }
})();