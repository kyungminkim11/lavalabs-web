(()=>{
  'use strict';
  if(window.__lavaContrastGuardLoaded)return;
  window.__lavaContrastGuardLoaded=true;

  const STYLE_ID='lava-site-contrast-guard-style';
  const FIX_ATTR='data-lava-contrast-fixed';
  const MIN_NORMAL=4.5;
  const MIN_LARGE=3;

  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      :root{
        --muted:#505c68;
        --accent:#667b00;
        --lava-text-secondary:#505c68;
        --lava-text-tertiary:#5b6671;
        --lava-dark-secondary:#c5ced6;
        --lava-dark-tertiary:#b7c1ca;
      }
      body{color:#11151b}
      .hero-lead,
      .page-hero:not(.section-dark) p,
      .section:not(.section-dark) .section-head p,
      .section-muted .section-head p,
      .sticky-copy p,
      .feature-row p,
      .case-copy p,
      .service-card:not(.dark) p,
      .price-card:not(.featured) p,
      .faq-list details p,
      .legal-box p,
      .editor-step p,
      .price-note,
      .contact-meta span,
      .hero-metrics span,
      .stage-card:not(.auto) small,
      .dropdown-menu small,
      .brand-copy small,
      .trust>span,
      .trust-list{
        color:var(--lava-text-secondary)!important;
        opacity:1!important;
      }
      .eyebrow{color:#56616d!important;opacity:1!important}
      .service-card:not(.dark) .service-no{color:#596d00!important}
      .service-link,.case-copy a{color:#4f6000!important}
      .button-light,
      .dropdown-menu,
      .case-card,
      .case-copy,
      .price-card:not(.featured),
      .feature-row,
      .contact-meta>div,
      .legal-box,
      .problem-card.before,
      .service-card:not(.dark){color:#11151b}
      .button-light{color:#11151b!important;border-color:#c9d0c8!important;background:#fff!important}
      .button-outline{color:#fff!important;border-color:rgba(255,255,255,.52)!important;background:rgba(255,255,255,.08)!important}
      .section-dark p,
      .section-dark .section-head p,
      .section-dark .partner-card p,
      .section-dark .process-card p,
      .section-dark .cta-panel p,
      .service-card.dark p,
      .price-card.featured p,
      .stage-card.auto small{
        color:var(--lava-dark-secondary)!important;
        opacity:1!important;
      }
      .section-dark .eyebrow,
      .site-footer .eyebrow{color:#cbd3db!important}
      .site-footer .brand-copy small,
      .site-footer .business-info span,
      .site-footer .footer-bottom{color:#b9c3cc!important;opacity:1!important}
      .site-footer .footer-main h4{color:#c7d0d8!important}
      .site-footer .footer-main p,
      .site-footer .footer-main a{color:#d9dee4!important;opacity:1!important}
      .business-info strong,.business-info a{color:#f0f3f6!important}
      input::placeholder,textarea::placeholder{color:#697581!important;opacity:1!important}
      .section-dark input::placeholder,
      .section-dark textarea::placeholder,
      .site-footer input::placeholder,
      .site-footer textarea::placeholder{color:#b9c3cc!important}
      input,select,textarea{color:#172029}
      .section-dark input,.section-dark select,.section-dark textarea{color:#f3f6f8}
      [${FIX_ATTR}]{color:var(--lava-contrast-safe-color)!important;text-shadow:none!important}
      @media(max-width:680px){
        .hero-lead,.page-hero p,.section-head p{color:#46525e!important}
        .service-card p,.case-copy p,.feature-row p,.faq-list details p{font-size:max(13px,1em)}
      }
      html[data-theme='dark'],html[data-theme='dark'] body,
      body.dark-mode,body.theme-dark{
        --bg:#10151b;
        --paper:#171e26;
        --ink:#f2f5f7;
        --muted:#c3ccd4;
        --line:#39434d;
        color:#f2f5f7;
      }
      html[data-theme='dark'] .section:not(.section-dark) p,
      body.dark-mode .section:not(.section-dark) p,
      body.theme-dark .section:not(.section-dark) p{color:#c3ccd4!important}
      html[data-theme='dark'] .button-light,
      body.dark-mode .button-light,
      body.theme-dark .button-light{background:#f7f9fa!important;color:#11151b!important}
      @media(prefers-contrast:more){
        :root{--lava-text-secondary:#3f4b56;--lava-dark-secondary:#d5dce2}
        .button,.fp-btn{border-width:2px}
      }
    `;
    document.head.appendChild(style);
  }

  const parseColor=value=>{
    if(!value||value==='transparent')return null;
    const nums=value.match(/[\d.]+/g);
    if(!nums||nums.length<3)return null;
    return {r:+nums[0],g:+nums[1],b:+nums[2],a:nums.length>3?+nums[3]:1};
  };
  const luminance=color=>{
    const channels=[color.r,color.g,color.b].map(value=>{
      const c=value/255;
      return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);
    });
    return .2126*channels[0]+.7152*channels[1]+.0722*channels[2];
  };
  const blend=(front,back)=>{
    const a=front.a??1;
    return {r:front.r*a+back.r*(1-a),g:front.g*a+back.g*(1-a),b:front.b*a+back.b*(1-a),a:1};
  };
  const ratio=(one,two)=>{
    const l1=luminance(one),l2=luminance(two);
    return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
  };
  const gradientColors=value=>{
    if(!value||value==='none'||value.includes('url('))return [];
    const matches=value.match(/rgba?\([^)]*\)/gi)||[];
    return matches.map(parseColor).filter(Boolean);
  };
  const effectiveBackgrounds=element=>{
    const samples=[];
    let node=element;
    let fallback={r:244,g:244,b:239,a:1};
    while(node){
      const style=getComputedStyle(node);
      if(style.backgroundImage&&style.backgroundImage.includes('url('))return {samples:[],image:true};
      const gradients=gradientColors(style.backgroundImage);
      gradients.forEach(color=>samples.push(color.a<1?blend(color,fallback):color));
      const solid=parseColor(style.backgroundColor);
      if(solid&&solid.a>.02){
        fallback=solid.a<1?blend(solid,fallback):solid;
        samples.push(fallback);
        if(solid.a>.98&&!gradients.length)break;
      }
      node=node.parentElement;
    }
    if(!samples.length)samples.push(fallback);
    return {samples,image:false};
  };
  const directText=element=>[...element.childNodes].some(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim());
  const isLargeText=style=>{
    const size=parseFloat(style.fontSize)||16;
    const weight=parseInt(style.fontWeight,10)||400;
    return size>=24||(size>=18.66&&weight>=700);
  };
  const minimumRatio=(foreground,backgrounds)=>Math.min(...backgrounds.map(background=>ratio(foreground.a<1?blend(foreground,background):foreground,background)));
  const skipElement=element=>{
    if(!element||element.nodeType!==1)return true;
    if(element.closest('svg,canvas,[aria-hidden="true"],.contrast-skip,.mock-grid,.mock-tabs,.mock-block,.code-lines,.window-dots,.skeleton'))return true;
    if(element.matches(':disabled,[aria-disabled="true"]'))return true;
    const style=getComputedStyle(element);
    if(style.display==='none'||style.visibility==='hidden'||parseFloat(style.opacity)<.55)return true;
    if(style.webkitTextFillColor==='transparent'||style.color==='transparent')return true;
    if(!element.getClientRects().length)return true;
    return false;
  };

  let running=false;
  let timer=0;
  const clearPrevious=()=>{
    document.querySelectorAll(`[${FIX_ATTR}]`).forEach(element=>{
      element.removeAttribute(FIX_ATTR);
      element.style.removeProperty('--lava-contrast-safe-color');
    });
  };
  const audit=()=>{
    if(running)return;
    running=true;
    clearPrevious();
    const candidates=[...document.querySelectorAll('p,span,small,li,label,a,button,summary,th,td,strong,em,h1,h2,h3,h4,h5,h6,legend,figcaption')];
    let scanned=0,fixed=0,skippedImages=0;
    candidates.forEach(element=>{
      if(skipElement(element)||!directText(element))return;
      const style=getComputedStyle(element);
      const foreground=parseColor(style.color);
      if(!foreground)return;
      const background=effectiveBackgrounds(element);
      if(background.image){skippedImages++;return;}
      const threshold=isLargeText(style)?MIN_LARGE:MIN_NORMAL;
      const current=minimumRatio(foreground,background.samples);
      scanned++;
      if(current>=threshold)return;
      const dark={r:17,g:21,b:27,a:1};
      const light={r:247,g:250,b:252,a:1};
      const darkRatio=minimumRatio(dark,background.samples);
      const lightRatio=minimumRatio(light,background.samples);
      const safe=darkRatio>=lightRatio?dark:light;
      const safeRatio=Math.max(darkRatio,lightRatio);
      if(safeRatio<current+.35)return;
      const value=safe===dark?'#11151b':'#f7fafc';
      element.style.setProperty('--lava-contrast-safe-color',value);
      element.setAttribute(FIX_ATTR,`${current.toFixed(2)}-${safeRatio.toFixed(2)}`);
      fixed++;
    });
    window.__lavaContrastAudit={scanned,fixed,skippedImages,updatedAt:new Date().toISOString(),path:location.pathname};
    document.documentElement.dataset.lavaContrastReady='true';
    running=false;
  };
  const schedule=()=>{
    clearTimeout(timer);
    timer=setTimeout(audit,180);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  window.addEventListener('load',()=>setTimeout(audit,120));
  window.addEventListener('pageshow',schedule);
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(mutation=>mutation.type==='childList'||(mutation.type==='attributes'&&['class','style','data-theme'].includes(mutation.attributeName))))schedule();
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','data-theme']});
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',schedule);
})();