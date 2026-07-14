(()=>{
  const toPath=value=>{
    try{return new URL(value,location.href).pathname.toLowerCase()}catch{return String(value||'').toLowerCase()}
  };

  document.querySelectorAll('a[href]').forEach(link=>{
    const path=toPath(link.getAttribute('href'));
    if(path.endsWith('/portfolio.html')||path==='portfolio.html'){
      link.href='/works/';
      if(link.textContent.trim()==='제작 사례')link.textContent='포트폴리오';
      if(link.textContent.trim()==='제작 사례 보기 →')link.textContent='포트폴리오 보기 →';
    }
    if(path.endsWith('/examples.html')||path==='examples.html'){
      link.href='/works/#live-demos';
      const label=link.textContent.trim();
      if(label==='직접 체험'||label==='직접 체험 예시')link.textContent='라이브 데모';
    }
  });

  document.querySelectorAll('.desktop-nav,.mobile-menu').forEach(nav=>{
    const links=[...nav.querySelectorAll('a')].filter(link=>toPath(link.getAttribute('href')).endsWith('/works/'));
    const primary=links.shift();
    links.forEach(link=>link.remove());
    if(primary){primary.href='/works/';primary.textContent='포트폴리오'}
  });
})();