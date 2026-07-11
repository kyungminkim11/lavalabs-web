(()=>{
  const href='360-editor.html';
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  document.querySelectorAll('.dropdown-menu').forEach(menu=>{
    if(menu.querySelector(`a[href="${href}"]`))return;
    const item=document.createElement('a');
    item.href=href;
    item.innerHTML='<span class="dropdown-icon">EDIT</span><span><strong>360 이미지 편집기</strong><small>미리보기·간편 보정·바닥 로고</small></span>';
    const spaceLink=menu.querySelector('a[href="space.html"]');
    spaceLink?.insertAdjacentElement('afterend',item);
  });

  document.querySelectorAll('.mobile-menu').forEach(menu=>{
    if(menu.querySelector(`a[href="${href}"]`))return;
    const item=document.createElement('a');
    item.href=href;item.className='mobile-sub';item.textContent='360 이미지 편집기';
    const spaceLink=menu.querySelector('a[href="space.html"]');
    spaceLink?.insertAdjacentElement('afterend',item);
  });

  document.querySelectorAll('.footer-links').forEach(group=>{
    const spaceLink=group.querySelector('a[href="space.html"]');
    if(!spaceLink||group.querySelector(`a[href="${href}"]`))return;
    const item=document.createElement('a');item.href=href;item.textContent='360 이미지 미리보기·보정';
    spaceLink.insertAdjacentElement('afterend',item);
  });

  const addServiceCard=grid=>{
    if(!grid||grid.querySelector(`a[href="${href}"]`))return;
    const card=document.createElement('a');
    card.className='service-card reveal';card.href=href;
    card.innerHTML='<span class="service-no">360 TOOL</span><h3>360 이미지 직접 확인·보정</h3><p>촬영한 360 이미지를 브라우저에서 둘러보고 밝기, 색감과 바닥 로고를 편집합니다.</p><ul><li>실시간 360 미리보기</li><li>로고·단색·텍스트 바닥 패치</li><li>원본·4K·8K 다운로드</li></ul><span class="service-link">무료 편집기 사용하기 →</span>';
    const spaceCard=grid.querySelector('a[href="space.html"]');
    if(spaceCard)spaceCard.insertAdjacentElement('afterend',card);else grid.appendChild(card);
    requestAnimationFrame(()=>card.classList.add('visible'));
  };

  if(current==='index.html'||current===''){
    addServiceCard(document.querySelector('#services .service-grid'));
    const eyebrow=document.querySelector('.hero .eyebrow');
    if(eyebrow&&eyebrow.textContent.includes('WEB'))eyebrow.textContent='WEB · SPACE · 360 TOOL · STORE · AUTOMATION';
    const firstMetric=document.querySelector('.hero-metrics>div:first-child');
    if(firstMetric){
      const strong=firstMetric.querySelector('strong');const span=firstMetric.querySelector('span');
      if(strong)strong.textContent='5 Solutions';
      if(span)span.textContent='웹·공간·360 도구·매장·자동화';
    }
  }

  if(current==='services.html'){
    addServiceCard(document.querySelector('main .service-grid'));
  }
})();