(()=>{
  'use strict';
  if(!/\/floorplan-editor\.html$/i.test(location.pathname))return;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const drawing=$('#drawingLayer'),selectedType=$('#selectedType'),sizeFields=$('#sizeFields'),widthInput=$('#itemWidth');
  if(!drawing)return;

  const style=document.createElement('style');
  style.textContent=`
    .fp-door-presets{display:none;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
    .fp-door-presets.show{display:grid}
    .fp-door-presets button{min-height:34px;padding:6px;border:1px solid var(--fp-line);border-radius:9px;background:#f8faf6;color:#35404a;font:800 8px/1.2 Inter,"Noto Sans KR",sans-serif;cursor:pointer}
    .fp-door-presets button:hover,.fp-door-presets button.active{border-color:#95b72c;background:#eef8cf;color:#354400}
    .fp-door-width-note{display:none;margin:7px 0 0;color:#6e7982;font-size:8px;line-height:1.5}
    .fp-door-width-note.show{display:block}
    .fp-door-hinge{fill:#20262d;pointer-events:none}
  `;
  document.head.appendChild(style);

  const patchDoor=group=>{
    const arc=$('path.fp-door-line',group),leaf=$('line.fp-door-line',group);
    if(!arc||!leaf)return;
    const x=+leaf.getAttribute('x1'),y=+leaf.getAttribute('y1'),x2=+leaf.getAttribute('x2'),y2=+leaf.getAttribute('y2');
    const width=Math.hypot(x2-x,y2-y)||90;
    // Closed leaf: hinge -> right. Open leaf endpoint is directly above hinge.
    // The arc must start at the closed leaf endpoint, not at the hinge.
    arc.setAttribute('d',`M ${x2} ${y2} A ${width} ${width} 0 0 0 ${x} ${y-width}`);
    arc.setAttribute('fill','none');
    arc.dataset.doorGeometry='fixed';
    let hinge=$('.fp-door-hinge',group);
    if(!hinge){
      hinge=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hinge.setAttribute('class','fp-door-hinge');
      hinge.setAttribute('r','5');
      group.insertBefore(hinge,group.firstChild);
    }
    hinge.setAttribute('cx',x);hinge.setAttribute('cy',y);
  };

  const patchAll=()=>$$('.fp-object',drawing).forEach(patchDoor);
  new MutationObserver(patchAll).observe(drawing,{childList:true,subtree:true});
  patchAll();

  let presets=null,note=null;
  const buildControls=()=>{
    if(!sizeFields||!widthInput||presets)return;
    presets=document.createElement('div');
    presets.className='fp-door-presets';
    presets.innerHTML=['0.8','0.9','1.0','1.2'].map(v=>`<button type="button" data-door-width="${v}">${v}m</button>`).join('');
    note=document.createElement('p');
    note.className='fp-door-width-note';
    note.textContent='일반 실내문은 0.8~0.9m, 넓은 출입문은 1.0~1.2m를 권장합니다.';
    sizeFields.insertAdjacentElement('afterend',presets);
    presets.insertAdjacentElement('afterend',note);
    presets.addEventListener('click',event=>{
      const button=event.target.closest('[data-door-width]');if(!button)return;
      widthInput.value=button.dataset.doorWidth;
      widthInput.dispatchEvent(new Event('input',{bubbles:true}));
      widthInput.dispatchEvent(new Event('change',{bubbles:true}));
      syncControls();
    });
  };

  const syncControls=()=>{
    buildControls();
    if(!selectedType||!sizeFields||!presets||!note)return;
    const isDoor=selectedType.textContent.trim()==='DOOR';
    const labels=$$('label',sizeFields),firstSpan=$('span',labels[0]),second=labels[1];
    if(isDoor){
      if(firstSpan)firstSpan.textContent='문 폭';
      if(second)second.style.display='none';
      widthInput.min='0.6';widthInput.max='2';widthInput.step='0.1';
      presets.classList.add('show');note.classList.add('show');
      const current=Number(widthInput.value).toFixed(1);
      $$('button',presets).forEach(b=>b.classList.toggle('active',Number(b.dataset.doorWidth).toFixed(1)===current));
    }else{
      if(firstSpan)firstSpan.textContent='가로';
      if(second)second.style.display='grid';
      widthInput.min='0.1';widthInput.removeAttribute('max');widthInput.step='0.1';
      presets.classList.remove('show');note.classList.remove('show');
    }
  };

  if(selectedType)new MutationObserver(syncControls).observe(selectedType,{childList:true,characterData:true,subtree:true});
  widthInput?.addEventListener('input',syncControls);
  syncControls();
})();
