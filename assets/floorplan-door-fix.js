(()=>{
  'use strict';
  if(!/\/floorplan-editor\.html$/i.test(location.pathname))return;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const drawing=$('#drawingLayer'),selectedType=$('#selectedType'),sizeFields=$('#sizeFields'),widthInput=$('#itemWidth'),rotationInput=$('#itemRotation');
  if(!drawing)return;

  const manualRotations=new Map();
  const style=document.createElement('style');
  style.textContent=`
    @media(min-width:851px){.fp-stage{transform-origin:center center!important}}
    .fp-door-presets,.fp-door-rotation-presets{display:none;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
    .fp-door-presets.show,.fp-door-rotation-presets.show{display:grid}
    .fp-door-presets button,.fp-door-rotation-presets button{min-height:34px;padding:6px;border:1px solid var(--fp-line);border-radius:9px;background:#f8faf6;color:#35404a;font:800 8px/1.2 Inter,"Noto Sans KR",sans-serif;cursor:pointer}
    .fp-door-presets button:hover,.fp-door-presets button.active,.fp-door-rotation-presets button:hover,.fp-door-rotation-presets button.active{border-color:#95b72c;background:#eef8cf;color:#354400}
    .fp-door-width-note,.fp-door-rotation-note{display:none;margin:7px 0 0;color:#6e7982;font-size:8px;line-height:1.5}
    .fp-door-width-note.show,.fp-door-rotation-note.show{display:block}
    .fp-door-hinge{fill:#20262d;pointer-events:none}
    .fp-door-opening-mask{stroke-linecap:butt;pointer-events:none}
  `;
  document.head.appendChild(style);

  const nearestBoundary=(x,y)=>{
    let best={distance:Infinity,angle:null,fill:'#eef4df'};
    $$('.fp-room-shape',drawing).forEach(rect=>{
      const rx=+rect.getAttribute('x'),ry=+rect.getAttribute('y'),rw=+rect.getAttribute('width'),rh=+rect.getAttribute('height');
      const fill=rect.getAttribute('fill')||'#eef4df';
      if(y>=ry-24&&y<=ry+rh+24){
        [rx,rx+rw].forEach(edge=>{const distance=Math.abs(x-edge);if(distance<best.distance)best={distance,angle:90,fill}});
      }
      if(x>=rx-24&&x<=rx+rw+24){
        [ry,ry+rh].forEach(edge=>{const distance=Math.abs(y-edge);if(distance<best.distance)best={distance,angle:0,fill}});
      }
    });
    return best.distance<=32?best:{distance:best.distance,angle:null,fill:'#eef4df'};
  };

  const currentAngle=group=>{
    const match=(group.getAttribute('transform')||'').match(/rotate\(([-\d.]+)/);
    return match?Number(match[1]):0;
  };

  const patchDoor=group=>{
    const arc=$('path.fp-door-line',group),leaf=$('line.fp-door-line',group);
    if(!arc||!leaf)return;
    const x=+leaf.getAttribute('x1'),y=+leaf.getAttribute('y1');
    const stored=Number(group.dataset.doorWidth);
    const measured=Math.hypot((+leaf.getAttribute('x2'))-x,(+leaf.getAttribute('y2'))-y);
    const width=stored||measured||90;
    group.dataset.doorWidth=String(width);

    const placement=nearestBoundary(x,y);
    const id=group.dataset.id||'';
    const manual=manualRotations.get(id);
    const original=currentAngle(group);
    const visualAngle=manual!=null?manual:(Math.abs(original)>.01?original:(placement.angle??0));
    group.dataset.visualRotation=String(visualAngle);
    group.dataset.autoRotation=manual==null&&Math.abs(original)<=.01&&placement.angle!=null?String(placement.angle):'';
    group.setAttribute('transform',`rotate(${visualAngle} ${x} ${y})`);

    let opening=$('.fp-door-opening-mask',group);
    if(!opening){
      opening=document.createElementNS('http://www.w3.org/2000/svg','line');
      opening.setAttribute('class','fp-door-opening-mask');
      group.insertBefore(opening,leaf);
    }
    opening.setAttribute('x1',x);opening.setAttribute('y1',y);
    opening.setAttribute('x2',x+width);opening.setAttribute('y2',y);
    opening.setAttribute('stroke',placement.fill||'#eef4df');
    opening.setAttribute('stroke-width','14');

    // Proper floor-plan symbol: the wall opening is horizontal in local coordinates,
    // the visible leaf is opened 90 degrees, and the arc joins closed to open position.
    leaf.setAttribute('x2',x);leaf.setAttribute('y2',y-width);
    arc.setAttribute('d',`M ${x+width} ${y} A ${width} ${width} 0 0 0 ${x} ${y-width}`);
    arc.setAttribute('fill','none');
    arc.dataset.doorGeometry='fixed-v2';

    let hinge=$('.fp-door-hinge',group);
    if(!hinge){
      hinge=document.createElementNS('http://www.w3.org/2000/svg','circle');
      hinge.setAttribute('class','fp-door-hinge');
      hinge.setAttribute('r','5');
      group.insertBefore(hinge,leaf);
    }
    hinge.setAttribute('cx',x);hinge.setAttribute('cy',y);
  };

  let patchQueued=false;
  const patchAll=()=>{
    patchQueued=false;
    $$('.fp-object',drawing).forEach(group=>{
      if($('path.fp-door-line',group)&&$('line.fp-door-line',group))patchDoor(group);
    });
  };
  const queuePatch=()=>{if(patchQueued)return;patchQueued=true;requestAnimationFrame(patchAll)};
  new MutationObserver(queuePatch).observe(drawing,{childList:true,subtree:true});
  patchAll();

  let presets=null,note=null,rotationPresets=null,rotationNote=null;
  const buildControls=()=>{
    if(!sizeFields||!widthInput||presets)return;
    presets=document.createElement('div');
    presets.className='fp-door-presets';
    presets.innerHTML=['0.8','0.9','1.0','1.2'].map(v=>`<button type="button" data-door-width="${v}">${v}m</button>`).join('');
    note=document.createElement('p');
    note.className='fp-door-width-note';
    note.textContent='일반 실내문은 0.8~0.9m, 넓은 출입문은 1.0~1.2m를 권장합니다.';
    rotationPresets=document.createElement('div');
    rotationPresets.className='fp-door-rotation-presets';
    rotationPresets.innerHTML=[0,90,180,-90].map(v=>`<button type="button" data-door-rotation="${v}">${v===-90?'−90':v}°</button>`).join('');
    rotationNote=document.createElement('p');
    rotationNote.className='fp-door-rotation-note';
    rotationNote.textContent='문이 벽과 반대로 보이면 90° 또는 −90°를 눌러 방향을 바꿔주세요.';
    sizeFields.insertAdjacentElement('afterend',presets);
    presets.insertAdjacentElement('afterend',note);
    note.insertAdjacentElement('afterend',rotationPresets);
    rotationPresets.insertAdjacentElement('afterend',rotationNote);

    presets.addEventListener('click',event=>{
      const button=event.target.closest('[data-door-width]');if(!button)return;
      widthInput.value=button.dataset.doorWidth;
      widthInput.dispatchEvent(new Event('input',{bubbles:true}));
      widthInput.dispatchEvent(new Event('change',{bubbles:true}));
      syncControls();
    });
    rotationPresets.addEventListener('click',event=>{
      const button=event.target.closest('[data-door-rotation]');if(!button||!rotationInput)return;
      const group=$('.fp-object.selected',drawing),id=group?.dataset.id||'';
      const angle=Number(button.dataset.doorRotation);
      if(id)manualRotations.set(id,angle);
      rotationInput.value=String(angle);
      rotationInput.dispatchEvent(new Event('input',{bubbles:true}));
      rotationInput.dispatchEvent(new Event('change',{bubbles:true}));
      syncControls();
    });
  };

  const syncControls=()=>{
    buildControls();
    if(!selectedType||!sizeFields||!presets||!note||!rotationPresets||!rotationNote)return;
    const isDoor=selectedType.textContent.trim()==='DOOR';
    const labels=$$('label',sizeFields),firstSpan=$('span',labels[0]),second=labels[1];
    if(isDoor){
      if(firstSpan)firstSpan.textContent='문 폭';
      if(second)second.style.display='none';
      widthInput.min='0.6';widthInput.max='2';widthInput.step='0.1';
      presets.classList.add('show');note.classList.add('show');rotationPresets.classList.add('show');rotationNote.classList.add('show');
      const current=Number(widthInput.value).toFixed(1);
      $$('button',presets).forEach(b=>b.classList.toggle('active',Number(b.dataset.doorWidth).toFixed(1)===current));
      const selected=$('.fp-object.selected',drawing);
      const visual=Number(selected?.dataset.visualRotation??rotationInput?.value??0);
      if(rotationInput&&selected?.dataset.autoRotation&&Number(rotationInput.value)===0)rotationInput.value=String(visual);
      $$('button',rotationPresets).forEach(b=>b.classList.toggle('active',Number(b.dataset.doorRotation)===visual));
    }else{
      if(firstSpan)firstSpan.textContent='가로';
      if(second)second.style.display='grid';
      widthInput.min='0.1';widthInput.removeAttribute('max');widthInput.step='0.1';
      presets.classList.remove('show');note.classList.remove('show');rotationPresets.classList.remove('show');rotationNote.classList.remove('show');
    }
  };

  if(selectedType)new MutationObserver(syncControls).observe(selectedType,{childList:true,characterData:true,subtree:true});
  widthInput?.addEventListener('input',syncControls);
  rotationInput?.addEventListener('input',syncControls);
  syncControls();
})();