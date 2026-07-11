(()=>{
  'use strict';
  if(window.__lavaPrivacyEditorV2Installed)return;
  window.__lavaPrivacyEditorV2Installed=true;

  const VERSION='20260711r';
  const imageInput=document.querySelector('#imageInput');
  const controls=document.querySelector('.controls');
  const dock=document.querySelector('.mobile-editor-dock');
  if(!imageInput||!controls)return;

  document.querySelector('.privacy-card')?.remove();
  document.querySelector('#privacyEditModal')?.remove();

  let sourceFile=imageInput.files?.[0]||null;
  let previewSource=null;
  let sourceInfo=null;
  let modalOpen=false;
  let renderFrame=0;

  const toast=(message,isError=false)=>{
    const target=document.querySelector('#editorToast');
    if(!target)return;
    target.textContent=message;
    target.classList.toggle('error',isError);
    target.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>target.classList.remove('show'),3600);
  };

  const card=document.createElement('section');
  card.className='control-card privacy-card';
  card.dataset.editorSection='privacy';
  card.innerHTML=`
    <div class="control-head">
      <div><h2>개인정보 가리기</h2><p>번호판·얼굴·문서·화면을 실제 픽셀 모자이크, 블러 또는 단색으로 가립니다.</p></div>
      <span class="mini-tag">LIVE V2</span>
    </div>
    <div class="privacy-card-summary">
      <div><strong id="privacyMaskCountV2">가림 영역 0개</strong><span id="privacySourceStateV2">360 이미지를 먼저 업로드하세요.</span></div>
      <button class="tool-btn primary" id="openPrivacyEditorV2" type="button" disabled>평면 편집기 열기</button>
    </div>
    <div class="privacy-feature-grid"><span>▭ 사각형</span><span>◯ 타원형</span><span>〰 브러시</span><span>▦ 실시간 모자이크</span><span>◌ 블러</span><span>■ 단색</span></div>
    <div class="privacy-card-note"><b>실제 결과 미리보기</b><span>영역을 드래그하는 순간부터 모자이크가 표시되며, 같은 렌더러로 최종 JPEG를 생성합니다.</span></div>`;
  controls.insertBefore(card,controls.querySelector('.export-card')||null);

  const openButton=card.querySelector('#openPrivacyEditorV2');
  const countLabel=card.querySelector('#privacyMaskCountV2');
  const sourceLabel=card.querySelector('#privacySourceStateV2');

  let dockButton=dock?.querySelector('[data-mobile-tab="privacy"]');
  if(dockButton){
    const clean=dockButton.cloneNode(true);
    dockButton.replaceWith(clean);
    dockButton=clean;
  }else if(dock){
    dockButton=document.createElement('button');
    dockButton.type='button';
    dockButton.dataset.mobileTab='privacy';
    dockButton.innerHTML='<span>▦</span>가리기';
    dock.insertBefore(dockButton,dock.querySelector('[data-mobile-tab="export"]')||null);
  }
  dockButton?.addEventListener('click',()=>{
    dock.querySelectorAll('button').forEach(button=>button.classList.toggle('active',button===dockButton));
    controls.querySelectorAll('.control-card').forEach(item=>item.classList.toggle('mobile-active',item===card));
    card.scrollIntoView({behavior:'smooth',block:'start'});
  });
  dock?.querySelectorAll('button:not([data-mobile-tab="privacy"])').forEach(button=>button.addEventListener('click',()=>card.classList.remove('mobile-active')));

  const modal=document.createElement('div');
  modal.className='privacy-edit-modal';
  modal.id='privacyEditModalV2';
  modal.hidden=true;
  modal.innerHTML=`
    <div class="privacy-edit-backdrop" data-v2-close></div>
    <section class="privacy-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="privacyV2Title">
      <header class="privacy-edit-header">
        <div><span class="privacy-edit-eyebrow">PRIVACY MASK · LIVE V2</span><h2 id="privacyV2Title">개인정보 가리기</h2><p>영역을 그리는 즉시 실제 모자이크 결과를 확인할 수 있습니다.</p></div>
        <button class="privacy-icon-button" type="button" data-v2-close aria-label="닫기">×</button>
      </header>
      <div class="privacy-edit-layout">
        <div class="privacy-preview-column">
          <div class="privacy-toolbar">
            <div class="privacy-tool-tabs" role="group" aria-label="영역 도구">
              <button type="button" data-v2-tool="select"><span>↖</span>선택</button>
              <button class="active" type="button" data-v2-tool="rect"><span>▭</span>사각형</button>
              <button type="button" data-v2-tool="ellipse"><span>◯</span>타원</button>
              <button type="button" data-v2-tool="brush"><span>〰</span>브러시</button>
            </div>
            <div class="privacy-view-actions"><button id="privacyV2Original" type="button">원본 보기</button><button id="privacyV2Fit" type="button">화면 맞춤</button></div>
          </div>
          <div class="privacy-stage" id="privacyV2Stage">
            <div class="privacy-canvas-shell" id="privacyV2Shell"><canvas id="privacyV2Canvas"></canvas><canvas id="privacyV2Overlay" aria-label="개인정보 영역 편집 캔버스"></canvas></div>
            <div class="privacy-stage-hint" id="privacyV2Hint">가릴 영역을 드래그하세요.</div>
          </div>
          <div class="privacy-statusbar"><span id="privacyV2Meta">이미지 준비 중</span><strong id="privacyV2Status">가림 영역 0개</strong></div>
        </div>
        <aside class="privacy-edit-controls">
          <section class="privacy-edit-card">
            <div class="privacy-card-head"><div><span>EFFECT</span><h3>가림 방식</h3></div><span class="privacy-selected-badge" id="privacyV2Badge">새 영역</span></div>
            <div class="privacy-effect-tabs" role="group">
              <button class="active" type="button" data-v2-effect="mosaic">▦ 모자이크</button>
              <button type="button" data-v2-effect="blur">◌ 블러</button>
              <button type="button" data-v2-effect="solid">■ 단색</button>
            </div>
            <label class="privacy-range"><span><b>효과 강도</b><output id="privacyV2StrengthOut">32</output></span><input id="privacyV2Strength" type="range" min="8" max="96" value="32"></label>
            <label class="privacy-range"><span><b>불투명도</b><output id="privacyV2OpacityOut">100%</output></span><input id="privacyV2Opacity" type="range" min="20" max="100" value="100"></label>
            <label class="privacy-color-row" id="privacyV2ColorRow" hidden><span>가림 색상</span><input id="privacyV2Color" type="color" value="#11161d"></label>
          </section>
          <section class="privacy-edit-card">
            <div class="privacy-card-head"><div><span>SHAPE</span><h3>영역 설정</h3></div></div>
            <label class="privacy-range"><span><b>브러시 크기</b><output id="privacyV2BrushOut">5%</output></span><input id="privacyV2Brush" type="range" min="1" max="20" value="5"></label>
            <label class="privacy-range"><span><b>가장자리 여유</b><output id="privacyV2PaddingOut">2%</output></span><input id="privacyV2Padding" type="range" min="0" max="15" value="2"></label>
            <div class="privacy-object-actions"><button id="privacyV2Duplicate" type="button" disabled>복제</button><button id="privacyV2Delete" type="button" disabled>선택 삭제</button><button id="privacyV2Clear" type="button" disabled>전체 삭제</button></div>
            <p class="privacy-control-help">선택 도구로 이동하고 우측 아래 라임 손잡이로 크기를 조절합니다.</p>
          </section>
          <section class="privacy-edit-card privacy-history-card">
            <div class="privacy-history-actions"><button id="privacyV2Undo" type="button" disabled>↶ 실행 취소</button><button id="privacyV2Redo" type="button" disabled>↷ 다시 실행</button></div>
            <label class="privacy-check"><input id="privacyV2Wrap" type="checkbox" checked><span>좌우 경계에 걸친 영역을 반대편에도 이어서 처리</span></label>
          </section>
          <section class="privacy-edit-card privacy-guide-card"><strong>권장 강도</strong><div><span>얼굴 24~40</span><span>번호판 32~56</span><span>문서 40~64</span><span>완전 가림: 단색</span></div></section>
        </aside>
      </div>
      <footer class="privacy-edit-footer"><div><strong>실제 출력과 동일한 미리보기</strong><span>미리보기와 최종 적용 모두 같은 모자이크 합성 엔진을 사용합니다.</span></div><div class="privacy-footer-actions"><button class="privacy-cancel" type="button" data-v2-close>취소</button><button class="privacy-apply" id="privacyV2Apply" type="button">가림 적용</button></div></footer>
    </section>`;
  document.body.appendChild(modal);

  const $=selector=>modal.querySelector(selector);
  const $$=selector=>Array.from(modal.querySelectorAll(selector));
  const canvas=$('#privacyV2Canvas');
  const overlay=$('#privacyV2Overlay');
  const overlayCtx=overlay.getContext('2d');
  const stage=$('#privacyV2Stage');
  const shell=$('#privacyV2Shell');

  const state={tool:'rect',effect:'mosaic',strength:32,opacity:1,color:'#11161d',brush:.05,padding:.02,masks:[],selected:null,history:[],future:[],pointer:null,original:false,width:0,height:0};
  const cloneMasks=()=>JSON.parse(JSON.stringify(state.masks));
  const selectedMask=()=>state.masks.find(mask=>mask.id===state.selected)||null;

  function openModal(){modal.hidden=false;modalOpen=true;document.documentElement.classList.add('privacy-editor-open');document.body.classList.add('privacy-editor-open');requestAnimationFrame(()=>{modal.classList.add('visible');fitShell();render();});}
  function closeModal(){modal.classList.remove('visible');modalOpen=false;document.documentElement.classList.remove('privacy-editor-open');document.body.classList.remove('privacy-editor-open');setTimeout(()=>modal.hidden=true,180);}
  function pushHistory(){state.history.push(cloneMasks());if(state.history.length>30)state.history.shift();state.future=[];updateUI();}
  function undo(){if(!state.history.length)return;state.future.push(cloneMasks());state.masks=state.history.pop();state.selected=null;updateUI();render();}
  function redo(){if(!state.future.length)return;state.history.push(cloneMasks());state.masks=state.future.pop();state.selected=null;updateUI();render();}

  function fitShell(){if(!state.width)return;const ratio=state.width/state.height;const maxW=Math.max(280,stage.clientWidth-28);const maxH=Math.max(240,window.innerHeight-300);let w=maxW,h=w/ratio;if(h>maxH){h=maxH;w=h*ratio;}shell.style.width=`${Math.round(w)}px`;shell.style.height=`${Math.round(h)}px`;}

  async function getDimensions(file){
    const bitmap=await createImageBitmap(file);
    const result={width:bitmap.width,height:bitmap.height};bitmap.close?.();return result;
  }
  async function decode(file,width,height){
    try{
      const bitmap=await createImageBitmap(file,{resizeWidth:width,resizeHeight:height,resizeQuality:'high'});
      const out=document.createElement('canvas');out.width=width;out.height=height;out.getContext('2d').drawImage(bitmap,0,0,width,height);bitmap.close?.();return out;
    }catch(error){
      const url=URL.createObjectURL(file);try{return await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const out=document.createElement('canvas');out.width=width;out.height=height;out.getContext('2d').drawImage(image,0,0,width,height);resolve(out);};image.onerror=()=>reject(new Error('이미지를 읽지 못했습니다.'));image.src=url;});}finally{URL.revokeObjectURL(url);}
    }
  }

  function maskCanvas(width,height,mask){
    const out=document.createElement('canvas');out.width=width;out.height=height;const ctx=out.getContext('2d');ctx.fillStyle='#fff';ctx.strokeStyle='#fff';ctx.lineCap='round';ctx.lineJoin='round';
    const pad=(mask.padding??state.padding)*Math.min(width,height);
    if(mask.type==='rect'||mask.type==='ellipse'){
      const x=mask.x*width-pad,y=mask.y*height-pad,w=mask.w*width+pad*2,h=mask.h*height+pad*2;
      if(mask.type==='rect')ctx.fillRect(x,y,w,h);else{ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);ctx.fill();}
    }else if(mask.type==='brush'&&mask.points?.length){
      ctx.lineWidth=(mask.brush??state.brush)*Math.min(width,height)+pad*2;ctx.beginPath();
      mask.points.forEach((point,index)=>{const x=point.x*width,y=point.y*height;if(index)ctx.lineTo(x,y);else ctx.moveTo(x,y);});
      if(mask.points.length===1){const point=mask.points[0];ctx.arc(point.x*width,point.y*height,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();}else ctx.stroke();
    }
    return out;
  }

  function mosaicCanvas(source,strength){
    const block=Math.max(6,Math.round(strength));
    const small=document.createElement('canvas');small.width=Math.max(1,Math.ceil(source.width/block));small.height=Math.max(1,Math.ceil(source.height/block));
    const smallCtx=small.getContext('2d');smallCtx.imageSmoothingEnabled=true;smallCtx.drawImage(source,0,0,small.width,small.height);
    const out=document.createElement('canvas');out.width=source.width;out.height=source.height;const ctx=out.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(small,0,0,out.width,out.height);return out;
  }
  function effectLayer(source,mask){
    const out=document.createElement('canvas');out.width=source.width;out.height=source.height;const ctx=out.getContext('2d');
    const effect=mask.effect||state.effect;const strength=mask.strength??state.strength;
    if(effect==='mosaic')ctx.drawImage(mosaicCanvas(source,strength),0,0);
    else if(effect==='blur'){ctx.filter=`blur(${Math.max(3,Math.round(strength/2))}px)`;ctx.drawImage(source,0,0);ctx.filter='none';}
    else{ctx.fillStyle=mask.color||state.color;ctx.fillRect(0,0,out.width,out.height);}
    ctx.globalCompositeOperation='destination-in';ctx.drawImage(maskCanvas(out.width,out.height,mask),0,0);ctx.globalCompositeOperation='source-over';return out;
  }
  function renderTo(target,source,masks){
    const ctx=target.getContext('2d');ctx.clearRect(0,0,target.width,target.height);ctx.drawImage(source,0,0,target.width,target.height);
    if(state.original)return;
    const scaled=document.createElement('canvas');scaled.width=target.width;scaled.height=target.height;scaled.getContext('2d').drawImage(source,0,0,scaled.width,scaled.height);
    const drawMask=mask=>{ctx.save();ctx.globalAlpha=mask.opacity??state.opacity;ctx.drawImage(effectLayer(scaled,mask),0,0);ctx.restore();};
    masks.forEach(mask=>{
      drawMask(mask);
      if($('#privacyV2Wrap').checked&&mask.type!=='brush'){
        if(mask.x<0)drawMask({...mask,x:mask.x+1});
        if(mask.x+mask.w>1)drawMask({...mask,x:mask.x-1});
      }
    });
  }

  function currentMasks(){return state.pointer?.mode==='create'&&state.pointer.draft?[...state.masks,state.pointer.draft]:state.masks;}
  function render(){
    if(!previewSource)return;
    cancelAnimationFrame(renderFrame);renderFrame=requestAnimationFrame(()=>{
      renderTo(canvas,previewSource,currentMasks());overlayCtx.clearRect(0,0,overlay.width,overlay.height);state.masks.forEach(mask=>outline(mask,mask.id===state.selected));if(state.pointer?.draft)outline(state.pointer.draft,true);updateUI();
    });
  }
  function outline(mask,selected){
    overlayCtx.save();overlayCtx.strokeStyle=selected?'#c9ff48':'rgba(255,255,255,.95)';overlayCtx.fillStyle=selected?'rgba(201,255,72,.08)':'rgba(255,255,255,.035)';overlayCtx.lineWidth=Math.max(2,overlay.width/700);overlayCtx.setLineDash(selected?[]:[8,6]);
    if(mask.type==='rect'||mask.type==='ellipse'){
      const x=mask.x*overlay.width,y=mask.y*overlay.height,w=mask.w*overlay.width,h=mask.h*overlay.height;
      if(mask.type==='rect'){overlayCtx.fillRect(x,y,w,h);overlayCtx.strokeRect(x,y,w,h);}else{overlayCtx.beginPath();overlayCtx.ellipse(x+w/2,y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);overlayCtx.fill();overlayCtx.stroke();}
      if(selected){const s=Math.max(10,overlay.width/80);overlayCtx.setLineDash([]);overlayCtx.fillStyle='#c9ff48';overlayCtx.fillRect(x+w-s/2,y+h-s/2,s,s);}
    }else if(mask.type==='brush'&&mask.points?.length){overlayCtx.lineCap='round';overlayCtx.lineJoin='round';overlayCtx.lineWidth=(mask.brush??state.brush)*Math.min(overlay.width,overlay.height);overlayCtx.beginPath();mask.points.forEach((point,index)=>index?overlayCtx.lineTo(point.x*overlay.width,point.y*overlay.height):overlayCtx.moveTo(point.x*overlay.width,point.y*overlay.height));overlayCtx.stroke();}
    overlayCtx.restore();
  }

  function updateUI(){
    const selected=!!selectedMask();$('#privacyV2Undo').disabled=!state.history.length;$('#privacyV2Redo').disabled=!state.future.length;$('#privacyV2Delete').disabled=!selected;$('#privacyV2Duplicate').disabled=!selected;$('#privacyV2Clear').disabled=!state.masks.length;$('#privacyV2Badge').textContent=selected?'선택 영역':'새 영역';$('#privacyV2Status').textContent=`가림 영역 ${state.masks.length}개`;countLabel.textContent=`가림 영역 ${state.masks.length}개`;$('#privacyV2StrengthOut').textContent=state.strength;$('#privacyV2OpacityOut').textContent=`${Math.round(state.opacity*100)}%`;$('#privacyV2BrushOut').textContent=`${Math.round(state.brush*100)}%`;$('#privacyV2PaddingOut').textContent=`${Math.round(state.padding*100)}%`;$('#privacyV2ColorRow').hidden=state.effect!=='solid';
  }
  function point(event){const rect=overlay.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))};}
  function hitTest(p){for(let i=state.masks.length-1;i>=0;i--){const mask=state.masks[i];if(mask.type==='rect'||mask.type==='ellipse'){if(p.x>=mask.x&&p.x<=mask.x+mask.w&&p.y>=mask.y&&p.y<=mask.y+mask.h)return mask;}else for(const q of mask.points||[])if(Math.hypot(p.x-q.x,p.y-q.y)<=(mask.brush||.05)/2)return mask;}return null;}
  function baseMask(type){return{id:`mask-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type,effect:state.effect,strength:state.strength,opacity:state.opacity,color:state.color,brush:state.brush,padding:state.padding};}

  overlay.addEventListener('pointerdown',event=>{
    if(!previewSource)return;event.preventDefault();overlay.setPointerCapture?.(event.pointerId);const p=point(event);
    if(state.tool==='select'){
      const mask=hitTest(p);state.selected=mask?.id||null;if(!mask){render();return;}pushHistory();const handle=mask.type!=='brush'&&Math.abs(p.x-(mask.x+mask.w))<.035&&Math.abs(p.y-(mask.y+mask.h))<.055;state.pointer={mode:handle?'resize':'move',start:p,original:JSON.parse(JSON.stringify(mask))};
    }else if(state.tool==='brush'){
      pushHistory();const mask={...baseMask('brush'),points:[p]};state.masks.push(mask);state.selected=mask.id;state.pointer={mode:'brush'};
    }else{
      pushHistory();const draft={...baseMask(state.tool),x:p.x,y:p.y,w:0,h:0};state.selected=draft.id;state.pointer={mode:'create',start:p,draft};
    }
    render();
  });
  overlay.addEventListener('pointermove',event=>{
    if(!state.pointer)return;const p=point(event);
    if(state.pointer.mode==='create'){const d=state.pointer.draft;d.x=Math.min(state.pointer.start.x,p.x);d.y=Math.min(state.pointer.start.y,p.y);d.w=Math.abs(p.x-state.pointer.start.x);d.h=Math.abs(p.y-state.pointer.start.y);}
    else if(state.pointer.mode==='brush'){const mask=selectedMask();const last=mask?.points.at(-1);if(mask&&(!last||Math.hypot(last.x-p.x,last.y-p.y)>.0025))mask.points.push(p);}
    else{const mask=selectedMask();if(!mask)return;const original=state.pointer.original;if(state.pointer.mode==='move'){mask.x=original.x+p.x-state.pointer.start.x;mask.y=Math.max(0,Math.min(1-mask.h,original.y+p.y-state.pointer.start.y));}else{mask.w=Math.max(.01,p.x-original.x);mask.h=Math.max(.01,p.y-original.y);}}
    render();
  });
  const finish=()=>{if(!state.pointer)return;if(state.pointer.mode==='create'){const d=state.pointer.draft;if(d.w>.005&&d.h>.005)state.masks.push(d);else state.history.pop();}state.pointer=null;render();};
  overlay.addEventListener('pointerup',finish);overlay.addEventListener('pointercancel',finish);

  async function prepare(file){
    sourceInfo=await getDimensions(file);const width=Math.min(2048,sourceInfo.width),height=Math.max(1,Math.round(width*sourceInfo.height/sourceInfo.width));previewSource=await decode(file,width,height);sourceFile=file;state.width=width;state.height=height;state.masks=[];state.history=[];state.future=[];state.selected=null;state.original=false;canvas.width=overlay.width=width;canvas.height=overlay.height=height;$('#privacyV2Meta').textContent=`${sourceInfo.width.toLocaleString()} × ${sourceInfo.height.toLocaleString()} · 실시간 미리보기 ${width.toLocaleString()}px`;fitShell();openModal();updateUI();render();
  }
  async function apply(){
    if(!sourceFile||!state.masks.length){toast('가릴 영역을 하나 이상 지정해주세요.',true);return;}const button=$('#privacyV2Apply');button.disabled=true;button.textContent='실제 모자이크 적용 중…';
    try{
      const width=Math.min(sourceInfo.width,4096),height=Math.max(1,Math.round(width*sourceInfo.height/sourceInfo.width));const source=await decode(sourceFile,width,height);const output=document.createElement('canvas');output.width=width;output.height=height;const wasOriginal=state.original;state.original=false;renderTo(output,source,state.masks);state.original=wasOriginal;
      const blob=await new Promise((resolve,reject)=>output.toBlob(value=>value?resolve(value):reject(new Error('모자이크 결과를 만들지 못했습니다.')),'image/jpeg',.95));const base=(sourceFile.name||'360-image').replace(/\.[^.]+$/,'');const file=new File([blob],`${base}-privacy.jpg`,{type:'image/jpeg',lastModified:Date.now()});const transfer=new DataTransfer();transfer.items.add(file);imageInput.files=transfer.files;sourceFile=file;sourceInfo={width,height};imageInput.dispatchEvent(new Event('change',{bubbles:true}));sourceLabel.textContent=`${width.toLocaleString()} × ${height.toLocaleString()} · 실제 모자이크 적용 완료`;state.masks=[];updateUI();closeModal();toast('실제 픽셀 모자이크가 360 이미지에 적용됐습니다.');
    }catch(error){console.error(error);toast(error.message||'모자이크 적용 중 오류가 발생했습니다.',true);}finally{button.disabled=false;button.textContent='가림 적용';}
  }

  $$('[data-v2-tool]').forEach(button=>button.addEventListener('click',()=>{state.tool=button.dataset.v2Tool;$$('[data-v2-tool]').forEach(item=>item.classList.toggle('active',item===button));$('#privacyV2Hint').textContent=state.tool==='select'?'영역을 선택해 이동하거나 크기를 조절하세요.':state.tool==='brush'?'가릴 부분을 문질러 주세요.':'가릴 영역을 드래그하세요.';}));
  $$('[data-v2-effect]').forEach(button=>button.addEventListener('click',()=>{state.effect=button.dataset.v2Effect;$$('[data-v2-effect]').forEach(item=>item.classList.toggle('active',item===button));const mask=selectedMask();if(mask){mask.effect=state.effect;}updateUI();render();}));
  $('#privacyV2Strength').addEventListener('input',event=>{state.strength=Number(event.target.value);const mask=selectedMask();if(mask)mask.strength=state.strength;updateUI();render();});
  $('#privacyV2Opacity').addEventListener('input',event=>{state.opacity=Number(event.target.value)/100;const mask=selectedMask();if(mask)mask.opacity=state.opacity;updateUI();render();});
  $('#privacyV2Brush').addEventListener('input',event=>{state.brush=Number(event.target.value)/100;const mask=selectedMask();if(mask?.type==='brush')mask.brush=state.brush;updateUI();render();});
  $('#privacyV2Padding').addEventListener('input',event=>{state.padding=Number(event.target.value)/100;const mask=selectedMask();if(mask)mask.padding=state.padding;updateUI();render();});
  $('#privacyV2Color').addEventListener('input',event=>{state.color=event.target.value;const mask=selectedMask();if(mask)mask.color=state.color;render();});
  $('#privacyV2Undo').addEventListener('click',undo);$('#privacyV2Redo').addEventListener('click',redo);
  $('#privacyV2Delete').addEventListener('click',()=>{if(!state.selected)return;pushHistory();state.masks=state.masks.filter(mask=>mask.id!==state.selected);state.selected=null;render();});
  $('#privacyV2Clear').addEventListener('click',()=>{if(!state.masks.length)return;pushHistory();state.masks=[];state.selected=null;render();});
  $('#privacyV2Duplicate').addEventListener('click',()=>{const mask=selectedMask();if(!mask)return;pushHistory();const copy=JSON.parse(JSON.stringify(mask));copy.id=`mask-${Date.now()}`;if('x'in copy){copy.x+=.03;copy.y=Math.min(1-copy.h,copy.y+.03);}state.masks.push(copy);state.selected=copy.id;render();});
  $('#privacyV2Original').addEventListener('click',event=>{state.original=!state.original;event.currentTarget.textContent=state.original?'편집본 보기':'원본 보기';render();});
  $('#privacyV2Fit').addEventListener('click',fitShell);$('#privacyV2Wrap').addEventListener('change',render);$('#privacyV2Apply').addEventListener('click',apply);
  $$('[data-v2-close]').forEach(button=>button.addEventListener('click',closeModal));

  openButton.addEventListener('click',async()=>{if(!sourceFile){toast('360 이미지를 먼저 업로드해주세요.',true);return;}openButton.disabled=true;openButton.textContent='불러오는 중…';try{await prepare(sourceFile);}catch(error){console.error(error);toast(error.message||'편집기를 열지 못했습니다.',true);}finally{openButton.disabled=false;openButton.textContent='평면 편집기 열기';}});
  imageInput.addEventListener('change',()=>{const file=imageInput.files?.[0];if(!file)return;sourceFile=file;sourceInfo=null;openButton.disabled=false;sourceLabel.textContent=`${file.name} · 실제 모자이크 편집 가능`;},true);
  window.addEventListener('resize',()=>{if(modalOpen)fitShell();});
  window.addEventListener('keydown',event=>{if(!modalOpen)return;if(event.key==='Escape')closeModal();if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redo();}if((event.key==='Delete'||event.key==='Backspace')&&state.selected&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){event.preventDefault();$('#privacyV2Delete').click();}});

  if(sourceFile){openButton.disabled=false;sourceLabel.textContent=`${sourceFile.name} · 실제 모자이크 편집 가능`;}
  updateUI();
})();