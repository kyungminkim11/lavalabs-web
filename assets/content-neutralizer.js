(()=>{
  const replacements=[
    [/블루블랙\s*펜샵/gi,'샘플 리테일 매장'],
    [/블루블랙/gi,'샘플 리테일'],
    [/Blue\s*Black(?:\s*Pen\s*Shop)?/gi,'Sample Retail'],
    [/세일러\s*프로기어\s*슬림\s*블랙\s*EF/gi,'프리미엄 티 세트 블랙'],
    [/세일러\s*프로기어[^\n<]*/gi,'프리미엄 리테일 상품'],
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
    document.querySelectorAll('[data-project],[data-service],[aria-label],[title]').forEach(el=>{
      for(const attr of ['data-project','data-service','aria-label','title']){
        if(!el.hasAttribute(attr))continue;
        const value=el.getAttribute(attr)||'';
        if(blocked.test(value)){removeRelatedElement(el);break;}
        const next=replaceText(value);
        if(next!==value)el.setAttribute(attr,next);
      }
    });
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
