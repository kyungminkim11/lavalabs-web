(()=>{
  const href='floorplan-editor.html';
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(current==='floorplan-editor.html'){
    const style=document.createElement('style');
    style.textContent='.floorplan-steps{display:grid;gap:12px}.floorplan-steps .editor-step{padding:23px;border:1px solid #dfe3da;border-radius:20px;background:#fff}.floorplan-steps .editor-step span{display:inline-grid;width:34px;height:34px;place-items:center;border-radius:10px;background:#11161d;color:#c9ff48;font:900 11px Inter,sans-serif}.floorplan-steps .editor-step h3{margin:16px 0 7px;font-size:17px}.floorplan-steps .editor-step p{margin:0;color:#66717c;font-size:11px;line-height:1.65}';
    document.head.appendChild(style);
  }
  const addNav=()=>{
    document.querySelectorAll('.dropdown-menu').forEach(menu=>{
      if(menu.querySelector(`a[href="${href}"]`))return;
      const item=document.createElement('a');item.href=href;item.innerHTML='<span class="dropdown-icon">PLAN</span><span><strong>쉬운 공간 도면 만들기</strong><small>벽·문·가구·360 촬영 위치 배치</small></span>';
      const editor=menu.querySelector('a[href="360-editor.html"]'),space=menu.querySelector('a[href="space.html"]');(editor||space)?.insertAdjacentElement('afterend',item);
    });
    document.querySelectorAll('.mobile-menu').forEach(menu=>{
      if(menu.querySelector(`a[href="${href}"]`))return;const item=document.createElement('a');item.href=href;item.className='mobile-sub';item.textContent='쉬운 공간 도면 만들기';const editor=menu.querySelector('a[href="360-editor.html"]'),space=menu.querySelector('a[href="space.html"]');(editor||space)?.insertAdjacentElement('afterend',item);
    });
    document.querySelectorAll('.footer-links').forEach(group=>{if(group.querySelector(`a[href="${href}"]`))return;const space=group.querySelector('a[href="space.html"]');if(!space)return;const a=document.createElement('a');a.href=href;a.textContent='무료 공간 도면 만들기';space.insertAdjacentElement('afterend',a)});
  };
  const addSpaceButton=()=>{if(current!=='space.html')return;const actions=document.querySelector('.space-hero-actions');if(actions&&!actions.querySelector(`a[href="${href}"]`)){const a=document.createElement('a');a.className='button button-light';a.href=href;a.textContent='무료 도면 만들기';actions.appendChild(a)}const form=document.querySelector('#quick-inquiry .inquiry-reassurance');if(form&&!form.textContent.includes('직접 도면을 만들어')){const row=document.createElement('div');row.innerHTML='<b>✓</b><span>도면이 없다면 <a href="floorplan-editor.html" class="inline-link">무료 도면 도구</a>에서 간단히 만들어 첨부할 수 있습니다.</span>';form.appendChild(row)}};
  const addEditorLink=()=>{if(current!=='360-editor.html')return;const add=()=>{const hero=document.querySelector('.editor-hero-actions,.hero-actions');if(hero&&!hero.querySelector(`a[href="${href}"]`)){const a=document.createElement('a');a.className='button button-light';a.href=href;a.textContent='공간 도면 만들기';hero.appendChild(a)}const exportCard=document.querySelector('[data-editor-section="export"],.export-card');if(exportCard&&!exportCard.querySelector('.floorplan-related-link')){const a=document.createElement('a');a.href=href;a.className='tool-btn floorplan-related-link';a.textContent='촬영 위치 도면 만들기';a.style.marginTop='10px';exportCard.appendChild(a);return true}return false};if(!add()){const observer=new MutationObserver(()=>{if(add())observer.disconnect()});observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),15000)}};
  addNav();addSpaceButton();addEditorLink();
})();