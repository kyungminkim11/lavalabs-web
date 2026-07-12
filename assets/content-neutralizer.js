(()=>{
  const replacements=[
    [/블루블랙\s*펜샵/gi,'샘플 리테일 매장'],
    [/블루블랙/gi,'샘플 리테일'],
    [/Blue\s*Black(?:\s*Pen\s*Shop)?/gi,'Sample Retail'],
    [/세일러\s*프로기어\s*슬림\s*블랙\s*EF/gi,'프리미엄 블렌드 티 기프트 세트'],
    [/세일러\s*프로기어[^\n<]*/gi,'프리미엄 리테일 상품'],
    [/세일러\s*프로피트\s*21/gi,'프리미엄 블렌드 티 기프트 세트'],
    [/만년필\s*·\s*문구/gi,'홈·리빙 소품'],
    [/유광\s*금속\s*클립과?\s*투명\s*배럴/gi,'유광 패키지와 투명 용기'],
    [/유광\s*금속\s*클립,?\s*투명\s*배럴,?\s*길이\s*140mm/gi,'유광 패키지, 투명 용기, 높이 140mm'],
    [/140[×xX*]15mm,?\s*약\s*25g/gi,'120×80×60mm, 약 250g'],
    [/투명\s*배럴/gi,'투명 용기'],
    [/만년필/gi,'리테일 상품'],
    [/펜촉/gi,'옵션'],
    [/시필펜/gi,'전시 샘플'],
    [/병잉크/gi,'소모품'],
    [/잉크\s*색상/gi,'상품 색상'],
    [/잉크/gi,'소모품'],
    [/\bSailor\b/gi,'Retail Brand'],
    [/\bFountain\s*Pen(?:s)?\b/gi,'Retail Product'],
    [/\bPen\s*Buffet\b/gi,'Product Builder']
  ];
  const blocked=/(?:blueblack|blue-black|pen-buffet|fountain[-_ ]?pen|sailor[-_ ]?pen)/i;
  const replaceText=value=>{
    if(!value)return value;
    return replacements.reduce((text,[pattern,next])=>text.replace(pattern,next),value);
  };
  const removeRelatedElement=element=>{
    const container=element.closest('article,.case-card,.portfolio-card,.project-card,.work-card,.lx-card,.example-card,.card,li');
    (container||element).remove();
  };
  const neutralizeProductSpinVisual=()=>{
    if(!document.querySelector('.spin-demo-product')||document.querySelector('#neutral-product-spin-style'))return;
    const style=document.createElement('style');
    style.id='neutral-product-spin-style';
    style.textContent=`
      .spin-demo-product{width:176px!important;height:220px!important}
      .spin-demo-product .cap{inset:0 40px 164px!important;border-radius:18px 18px 8px 8px!important;background:linear-gradient(90deg,#23435a,#7ba2b6 46%,#183044 82%)!important;box-shadow:inset 10px 0 16px rgba(255,255,255,.16),inset -10px 0 16px rgba(0,0,0,.2)!important}
      .spin-demo-product .ring{left:28px!important;right:28px!important;top:52px!important;height:10px!important;border-radius:5px!important;background:linear-gradient(90deg,#b38b2c,#f4d574 42%,#8c6717 80%)!important}
      .spin-demo-product .body{inset:62px 10px 0!important;border-radius:24px 24px 38px 38px!important;background:linear-gradient(90deg,#315d70,#91bdc7 45%,#244b61 82%)!important;box-shadow:inset 16px 0 22px rgba(255,255,255,.16),inset -16px 0 22px rgba(0,0,0,.22)!important}
      .spin-demo-product .clip{display:none!important}
      .spin-demo-product .brand-line{top:128px!important;width:72px!important;height:3px!important;background:#f0d377!important;box-shadow:0 10px 0 #f0d377!important}
    `;
    document.head.appendChild(style);
  };
  const scrub=()=>{
    document.title=replaceText(document.title);
    document.querySelectorAll('meta[content]').forEach(meta=>{
      const next=replaceText(meta.content);
      if(next!==meta.content)meta.content=next;
    });
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script=>{
      const next=replaceText(script.textContent||'');
      if(next!==script.textContent)script.textContent=next;
    });
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const parent=node.parentElement;
      if(!parent||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(parent.tagName))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const next=replaceText(node.nodeValue);
      if(next!==node.nodeValue)node.nodeValue=next;
    });
    document.querySelectorAll('a[href]').forEach(link=>{
      const raw=link.getAttribute('href')||'';
      if(blocked.test(raw))removeRelatedElement(link);
    });
    document.querySelectorAll('img[src],source[srcset]').forEach(media=>{
      const raw=(media.getAttribute('src')||'')+' '+(media.getAttribute('srcset')||'')+' '+(media.getAttribute('alt')||'');
      if(blocked.test(raw))removeRelatedElement(media);
    });
    document.querySelectorAll('[data-project],[data-service],[aria-label],[title],[placeholder],[alt]').forEach(el=>{
      for(const attr of ['data-project','data-service','aria-label','title','placeholder','alt']){
        if(!el.hasAttribute(attr))continue;
        const value=el.getAttribute(attr)||'';
        if(blocked.test(value)){removeRelatedElement(el);break;}
        const next=replaceText(value);
        if(next!==value)el.setAttribute(attr,next);
      }
    });
    neutralizeProductSpinVisual();
  };
  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;scrub();});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scrub,{once:true});
  else scrub();
  [100,400,1200].forEach(delay=>setTimeout(scrub,delay));
  new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
