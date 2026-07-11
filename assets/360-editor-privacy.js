(()=>{
  'use strict';
  if(window.__lavaPrivacyEditorInstalled)return;
  window.__lavaPrivacyEditorInstalled=true;

  const VERSION='20260711p';
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href=`assets/360-editor-privacy.css?v=${VERSION}`;
  document.head.appendChild(style);

  const imageInput=document.querySelector('#imageInput');
  const controls=document.querySelector('.controls');
  const dock=document.querySelector('.mobile-editor-dock');
  if(!imageInput||!controls)return;

  let sourceFile=imageInput.files?.[0]||null;
  let sourceInfo=null;
  let previewSource=null;
  let outputSource=null;
  let modalOpen=false;
  let renderQueued=false;

  const toast=(message,isError=false)=>{
    const target=document.querySelector('#editorToast');
    if(!target)return;
    target.textContent=message;
    target.classList.toggle('error',isError);
    target.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>target.classList.remove('show'),3500);
  };

  const privacyCard=document.createElement('section');
  privacyCard.className='control-card privacy-card';
  privacyCard.dataset.editorSection='privacy';
  privacyCard.innerHTML=`
    <div class="control-head">
      <div><h2>개인정보 가리기</h2><p>자동차 번호판, 얼굴, 모니터 화면과 문서를 모자이크·블러·단색으로 가립니다.</p></div>
      <span class="mini-tag">PRIVACY</span>
    </div>
    <div class="privacy-card-summary">
      <div><strong id="privacyMaskCount">가림 영역 0개</strong><span id="privacySourceState">360 이미지를 먼저 업로드하세요.</span></div>
      <button class="tool-btn primary" id="openPrivacyEditor" type="button" disabled>평면 편집기 열기</button>
    </div>
    <div class="privacy-feature-grid">
      <span>▭ 사각형</span><span>◯ 타원형</span><span>〰 브러시</span><span>▦ 모자이크</span><span>◌ 블러</span><span>■ 단색 가림</span>
    </div>
    <div class="privacy-card-note"><b>왜 평면 보기인가요?</b><span>360 화면의 좌우 끝은 연결됩니다. 2:1 원본 위에서 지정해야 번호판과 얼굴 위치를 정확하게 저장할 수 있습니다.</span></div>`;

  const exportCard=controls.querySelector('.export-card');
  controls.insertBefore(privacyCard,exportCard||null);

  const openButton=privacyCard.querySelector('#openPrivacyEditor');
  const countLabel=privacyCard.querySelector('#privacyMaskCount');
  const sourceState=privacyCard.querySelector('#privacySourceState');

  if(dock&&!dock.querySelector('[data-mobile-tab="privacy"]')){
    const button=document.createElement('button');
    button.type='button';
    button.dataset.mobileTab='privacy';
    button.innerHTML='<span>▦</span>가리기';
    const exportButton=dock.querySelector('[data-mobile-tab="export"]');
    dock.insertBefore(button,exportButton||null);
    button.addEventListener('click',()=>{
      dock.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
      controls.querySelectorAll('.control-card').forEach(card=>card.classList.toggle('mobile-active',card===privacyCard));
      privacyCard.scrollIntoView({behavior:'smooth',block:'start'});
    });
    dock.querySelectorAll('button:not([data-mobile-tab="privacy"])').forEach(item=>item.addEventListener('click',()=>privacyCard.classList.remove('mobile-active')));
  }

  const modal=document.createElement('div');
  modal.className='privacy-edit-modal';
  modal.id='privacyEditModal';
  modal.hidden=true;
  modal.innerHTML=`
    <div class="privacy-edit-backdrop" data-privacy-close></div>
    <section class="privacy-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="privacyEditTitle">
      <header class="privacy-edit-header">
        <div><span class="privacy-edit-eyebrow">PRIVACY MASK</span><h2 id="privacyEditTitle">개인정보 가리기</h2><p>얼굴·번호판·주소·화면 영역을 지정하면 최종 360 이미지에 그대로 반영됩니다.</p></div>
        <button class="privacy-icon-button" type="button" data-privacy-close aria-label="개인정보 편집기 닫기">×</button>
      </header>
      <div class="privacy-edit-layout">
        <div class="privacy-preview-column">
          <div class="privacy-toolbar">
            <div class="privacy-tool-tabs" role="group" aria-label="영역 도구">
              <button type="button" data-privacy-tool="select"><span>↖</span>선택</button>
              <button class="active" type="button" data-privacy-tool="rect"><span>▭</span>사각형</button>
              <button type="button" data-privacy-tool="ellipse"><span>◯</span>타원</button>
              <button type="button" data-privacy-tool="brush"><span>〰</span>브러시</button>
            </div>
            <div class="privacy-view-actions">
              <button id="privacyOriginalToggle" type="button" aria-pressed="false">원본 보기</button>
              <button id="privacyFitView" type="button">화면 맞춤</button>
            </div>
          </div>
          <div class="privacy-stage" id="privacyStage">
            <div class="privacy-canvas-shell" id="privacyCanvasShell">
              <canvas id="privacyCanvas"></canvas>
              <canvas id="privacyOverlay" aria-label="개인정보 영역 편집 캔버스"></canvas>
            </div>
            <div class="privacy-stage-hint" id="privacyStageHint">가릴 영역을 드래그하세요.</div>
          </div>
          <div class="privacy-statusbar">
            <span id="privacyImageMeta">이미지 준비 중</span>
            <strong id="privacyMaskStatus">가림 영역 0개</strong>
          </div>
        </div>
        <aside class="privacy-edit-controls">
          <section class="privacy-edit-card">
            <div class="privacy-card-head"><div><span>EFFECT</span><h3>가림 방식</h3></div><span class="privacy-selected-badge" id="privacySelectedBadge">새 영역</span></div>
            <div class="privacy-effect-tabs" role="group" aria-label="가림 효과">
              <button class="active" type="button" data-privacy-effect="mosaic">▦ 모자이크</button>
              <button type="button" data-privacy-effect="blur">◌ 블러</button>
              <button type="button" data-privacy-effect="solid">■ 단색</button>
            </div>
            <label class="privacy-range"><span><b>효과 강도</b><output id="privacyStrengthOutput">20</output></span><input id="privacyStrength" type="range" min="4" max="60" value="20"></label>
            <label class="privacy-range"><span><b>불투명도</b><output id="privacyOpacityOutput">100%</output></span><input id="privacyOpacity" type="range" min="20" max="100" value="100"></label>
            <label class="privacy-color-row" id="privacySolidColorRow"><span>가림 색상</span><input id="privacySolidColor" type="color" value="#11161d"></label>
          </section>
          <section class="privacy-edit-card">
            <div class="privacy-card-head"><div><span>SHAPE</span><h3>영역 설정</h3></div></div>
            <label class="privacy-range"><span><b>브러시 크기</b><output id="privacyBrushOutput">5%</output></span><input id="privacyBrushSize" type="range" min="1" max="20" value="5"></label>
            <label class="privacy-range"><span><b>가장자리 여유</b><output id="privacyPaddingOutput">2%</output></span><input id="privacyPadding" type="range" min="0" max="15" value="2"></label>
            <div class="privacy-object-actions">
              <button id="privacyDuplicate" type="button" disabled>복제</button>
              <button id="privacyDeleteSelected" type="button" disabled>선택 삭제</button>
              <button id="privacyClearAll" type="button" disabled>전체 삭제</button>
            </div>
            <p class="privacy-control-help">선택 도구에서 영역을 끌어 이동하고, 우측 아래 손잡이로 크기를 조절합니다.</p>
          </section>
          <section class="privacy-edit-card privacy-history-card">
            <div class="privacy-history-actions"><button id="privacyUndo" type="button" disabled>↶ 실행 취소</button><button id="privacyRedo" type="button" disabled>↷ 다시 실행</button></div>
            <label class="privacy-check"><input id="privacyWrapEdges" type="checkbox" checked><span>좌우 경계에 걸친 영역을 반대편에도 이어서 처리</span></label>
          </section>
          <section class="privacy-edit-card privacy-guide-card">
            <strong>가려야 할 항목 예시</strong>
            <div><span>자동차 번호판</span><span>사람 얼굴</span><span>주소·전화번호</span><span>명찰·문서</span><span>모니터 화면</span><span>출입 비밀번호</span></div>
          </section>
        </aside>
      </div>
      <footer class="privacy-edit-footer">
        <div><strong>로컬 처리</strong><span>사진은 서버로 전송되지 않습니다. 적용 시 최대 4K 편집본을 메인 360 뷰어로 전달합니다.</span></div>
        <div class="privacy-footer-actions"><button class="privacy-cancel" type="button" data-privacy-close>취소</button><button class="privacy-apply" id="privacyApply" type="button">가림 적용</button></div>
      </footer>
    </section>`;
  document.body.appendChild(modal);

  const $=selector=>modal.querySelector(selector);
  const $$=selector=>Array.from(modal.querySelectorAll(selector));
  const canvas=$('#privacyCanvas');
  const overlay=$('#privacyOverlay');
  const overlayCtx=overlay.getContext('2d');
  const shell=$('#privacyCanvasShell');
  const stage=$('#privacyStage');

  const state={
    tool:'rect',effect:'mosaic',strength:20,opacity:1,color:'#11161d',brushSize:.05,padding:.02,
    masks:[],selectedId:null,history:[],future:[],originalView:false,pointer:null,sourceFile:null,
    sourceWidth:0,sourceHeight:0,previewWidth:0,previewHeight:0
  };

  function openModal(){
    modal.hidden=false;modalOpen=true;
    document.documentElement.classList.add('privacy-editor-open');
    document.body.classList.add('privacy-editor-open');
    requestAnimationFrame(()=>{modal.classList.add('visible');fitCanvasShell();});
  }
  function closeModal(){
    modal.classList.remove('visible');modalOpen=false;
    document.documentElement.classList.remove('privacy-editor-open');
    document.body.classList.remove('privacy-editor-open');
    setTimeout(()=>{modal.hidden=true;},180);
  }

  function cloneMasks(){return JSON.parse(JSON.stringify(state.masks));}
  function pushHistory(){
    state.history.push(cloneMasks());
    if(state.history.length>30)state.history.shift();
    state.future=[];updateButtons();
  }
  function undo(){if(!state.history.length)return;state.future.push(cloneMasks());state.masks=state.history.pop();state.selectedId=null;updateButtons();queueRender();}
  function redo(){if(!state.future.length)return;state.history.push(cloneMasks());state.masks=state.future.pop();state.selectedId=null;updateButtons();queueRender();}
  function updateButtons(){
    const selected=state.masks.some(mask=>mask.id===state.selectedId);
    $('#privacyUndo').disabled=!state.history.length;
    $('#privacyRedo').disabled=!state.future.length;
    $('#privacyDeleteSelected').disabled=!selected;
    $('#privacyDuplicate').disabled=!selected;
    $('#privacyClearAll').disabled=!state.masks.length;
    $('#privacySelectedBadge').textContent=selected?'선택 영역':'새 영역';
    $('#privacyMaskStatus').textContent=`가림 영역 ${state.masks.length}개`;
    countLabel.textContent=`가림 영역 ${state.masks.length}개`;
  }

  function readJpegSize(buffer){
    const view=new DataView(buffer);if(view.getUint16(0)!==0xffd8)return null;let offset=2;
    while(offset<view.byteLength){if(view.getUint8(offset)!==0xff){offset++;continue;}const marker=view.getUint8(offset+1);if(marker===0xd8||marker===0xd9){offset+=2;continue;}if(offset+4>view.byteLength)break;const length=view.getUint16(offset+2);if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){return {height:view.getUint16(offset+5),width:view.getUint16(offset+7)};}offset+=2+length;
    }return null;
  }
  async function readDimensions(file){
    const head=await file.slice(0,262144).arrayBuffer();
    if(file.type==='image/png'){const view=new DataView(head);return {width:view.getUint32(16),height:view.getUint32(20)};}
    if(file.type==='image/jpeg'||file.name.toLowerCase().match(/\.jpe?g$/)){const size=readJpegSize(head);if(size)return size;}
    const url=URL.createObjectURL(file);try{return await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('이미지 크기를 확인하지 못했습니다.'));image.src=url;});}finally{URL.revokeObjectURL(url);}
  }

  async function decodeScaled(file,width,height){
    if('ImageDecoder'in window){
      let decoder;
      try{
        decoder=new ImageDecoder({data:file.stream(),type:file.type||'image/jpeg'});
        await decoder.tracks.ready;
        const result=await decoder.decode({frameIndex:0,completeFramesOnly:true,desiredWidth:width,desiredHeight:height});
        const frame=result.image;
        const out=document.createElement('canvas');out.width=width;out.height=height;out.getContext('2d').drawImage(frame,0,0,width,height);frame.close();decoder.close();return out;
      }catch(error){try{decoder?.close();}catch{}console.warn('ImageDecoder fallback',error);}
    }
    if('createImageBitmap'in window){
      const bitmap=await createImageBitmap(file,{resizeWidth:width,resizeHeight:height,resizeQuality:'high'});
      const out=document.createElement('canvas');out.width=width;out.height=height;out.getContext('2d').drawImage(bitmap,0,0,width,height);bitmap.close?.();return out;
    }
    const url=URL.createObjectURL(file);try{return await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const out=document.createElement('canvas');out.width=width;out.height=height;out.getContext('2d').drawImage(image,0,0,width,height);resolve(out);};image.onerror=()=>reject(new Error('이미지를 읽지 못했습니다.'));image.src=url;});}finally{URL.revokeObjectURL(url);}
  }

  function fitCanvasShell(){
    if(!state.previewWidth||!state.previewHeight)return;
    const ratio=state.previewWidth/state.previewHeight;
    const maxWidth=Math.max(280,stage.clientWidth-28);
    const maxHeight=Math.max(220,window.innerHeight-300);
    let width=maxWidth;let height=width/ratio;
    if(height>maxHeight){height=maxHeight;width=height*ratio;}
    shell.style.width=`${Math.round(width)}px`;shell.style.height=`${Math.round(height)}px`;
  }

  function makeMaskCanvas(width,height,mask){
    const out=document.createElement('canvas');out.width=width;out.height=height;const mctx=out.getContext('2d');
    mctx.fillStyle='#fff';mctx.strokeStyle='#fff';mctx.lineCap='round';mctx.lineJoin='round';
    const pad=(mask.padding??state.padding)*Math.min(width,height);
    if(mask.type==='rect'){
      const x=mask.x*width-pad,y=mask.y*height-pad,w=mask.w*width+pad*2,h=mask.h*height+pad*2;
      mctx.fillRect(x,y,w,h);
    }else if(mask.type==='ellipse'){
      const x=mask.x*width-pad,y=mask.y*height-pad,w=mask.w*width+pad*2,h=mask.h*height+pad*2;
      mctx.beginPath();mctx.ellipse(x+w/2,y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);mctx.fill();
    }else if(mask.type==='brush'&&mask.points?.length){
      mctx.lineWidth=(mask.brushSize??state.brushSize)*Math.min(width,height)+pad*2;
      mctx.beginPath();mask.points.forEach((point,index)=>{const x=point.x*width,y=point.y*height;index?mctx.lineTo(x,y):mctx.moveTo(x,y);});mctx.stroke();
    }
    return out;
  }

  function effectCanvas(source,mask){
    const width=source.width,height=source.height;
    const effect=document.createElement('canvas');effect.width=width;effect.height=height;const ectx=effect.getContext('2d');
    const mode=mask.effect||state.effect;const strength=mask.strength||state.strength;
    if(mode==='mosaic'){
      const block=Math.max(4,Math.round(strength));
      const small=document.createElement('canvas');small.width=Math.max(1,Math.ceil(width/block));small.height=Math.max(1,Math.ceil(height/block));
      const sctx=small.getContext('2d');sctx.imageSmoothingEnabled=true;sctx.drawImage(source,0,0,small.width,small.height);
      ectx.imageSmoothingEnabled=false;ectx.drawImage(small,0,0,width,height);
    }else if(mode==='blur'){
      ectx.filter=`blur(${Math.max(2,strength/2)}px)`;ectx.drawImage(source,0,0);ectx.filter='none';
    }else{
      ectx.fillStyle=mask.color||state.color;ectx.fillRect(0,0,width,height);
    }
    ectx.globalCompositeOperation='destination-in';ectx.globalAlpha=mask.opacity??state.opacity;ectx.drawImage(makeMaskCanvas(width,height,mask),0,0);ectx.globalAlpha=1;ectx.globalCompositeOperation='source-over';
    return effect;
  }

  function renderTo(target,source,masks){
    const tctx=target.getContext('2d');tctx.clearRect(0,0,target.width,target.height);tctx.drawImage(source,0,0,target.width,target.height);
    if(state.originalView)return;
    const scaledSource=source.width===target.width&&source.height===target.height?source:(()=>{const c=document.createElement('canvas');c.width=target.width;c.height=target.height;c.getContext('2d').drawImage(source,0,0,c.width,c.height);return c;})();
    masks.forEach(mask=>{
      tctx.drawImage(effectCanvas(scaledSource,mask),0,0,target.width,target.height);
      if($('#privacyWrapEdges').checked&&mask.type!=='brush'){
        if(mask.x<0){const copy={...mask,x:mask.x+1};tctx.drawImage(effectCanvas(scaledSource,copy),0,0,target.width,target.height);}
        if(mask.x+mask.w>1){const copy={...mask,x:mask.x-1};tctx.drawImage(effectCanvas(scaledSource,copy),0,0,target.width,target.height);}
      }
    });
  }

  function queueRender(){if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;render();});}
  function render(){
    if(!previewSource)return;
    renderTo(canvas,previewSource,state.masks);
    overlayCtx.clearRect(0,0,overlay.width,overlay.height);
    state.masks.forEach(mask=>drawMaskOutline(mask,mask.id===state.selectedId));
    if(state.pointer?.draft)drawMaskOutline(state.pointer.draft,true);
    updateButtons();
  }

  function drawMaskOutline(mask,selected){
    overlayCtx.save();overlayCtx.strokeStyle=selected?'#c9ff48':'rgba(255,255,255,.9)';overlayCtx.fillStyle=selected?'rgba(201,255,72,.08)':'rgba(255,255,255,.04)';overlayCtx.lineWidth=Math.max(2,overlay.width/700);overlayCtx.setLineDash(selected?[]:[8,6]);
    if(mask.type==='rect'||mask.type==='ellipse'){
      const x=mask.x*overlay.width,y=mask.y*overlay.height,w=mask.w*overlay.width,h=mask.h*overlay.height;
      if(mask.type==='rect'){overlayCtx.fillRect(x,y,w,h);overlayCtx.strokeRect(x,y,w,h);}else{overlayCtx.beginPath();overlayCtx.ellipse(x+w/2,y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);overlayCtx.fill();overlayCtx.stroke();}
      if(selected){const size=Math.max(10,overlay.width/80);overlayCtx.setLineDash([]);overlayCtx.fillStyle='#c9ff48';overlayCtx.fillRect(x+w-size/2,y+h-size/2,size,size);}
    }else if(mask.type==='brush'&&mask.points?.length){overlayCtx.lineCap='round';overlayCtx.lineJoin='round';overlayCtx.lineWidth=(mask.brushSize??state.brushSize)*Math.min(overlay.width,overlay.height);overlayCtx.beginPath();mask.points.forEach((point,index)=>{const x=point.x*overlay.width,y=point.y*overlay.height;index?overlayCtx.lineTo(x,y):overlayCtx.moveTo(x,y);});overlayCtx.stroke();}
    overlayCtx.restore();
  }

  function pointFromEvent(event){const rect=overlay.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))};}
  function hitTest(point){
    for(let index=state.masks.length-1;index>=0;index--){const mask=state.masks[index];if(mask.type==='rect'||mask.type==='ellipse'){if(point.x>=mask.x&&point.x<=mask.x+mask.w&&point.y>=mask.y&&point.y<=mask.y+mask.h)return mask;}else if(mask.type==='brush'){const radius=(mask.brushSize||.05)/2;for(const p of mask.points||[]){if(Math.hypot(point.x-p.x,point.y-p.y)<=radius)return mask;}}}return null;
  }
  function selectedMask(){return state.masks.find(mask=>mask.id===state.selectedId)||null;}
  function newMaskBase(type){return {id:`privacy-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type,effect:state.effect,strength:state.strength,opacity:state.opacity,color:state.color,padding:state.padding,brushSize:state.brushSize};}

  overlay.addEventListener('pointerdown',event=>{
    if(!previewSource)return;event.preventDefault();overlay.setPointerCapture?.(event.pointerId);const point=pointFromEvent(event);
    if(state.tool==='select'){
      const hit=hitTest(point);state.selectedId=hit?.id||null;if(!hit){queueRender();return;}
      pushHistory();const handle=hit.type!=='brush'&&Math.abs(point.x-(hit.x+hit.w))<.035&&Math.abs(point.y-(hit.y+hit.h))<.05;
      state.pointer={mode:handle?'resize':'move',start:point,original:JSON.parse(JSON.stringify(hit)),id:hit.id};
    }else if(state.tool==='brush'){
      pushHistory();const mask={...newMaskBase('brush'),points:[point]};state.masks.push(mask);state.selectedId=mask.id;state.pointer={mode:'brush',id:mask.id};
    }else{
      pushHistory();const mask={...newMaskBase(state.tool),x:point.x,y:point.y,w:0,h:0};state.selectedId=mask.id;state.pointer={mode:'create',start:point,draft:mask};
    }
    queueRender();
  });
  overlay.addEventListener('pointermove',event=>{
    if(!state.pointer)return;const point=pointFromEvent(event);
    if(state.pointer.mode==='create'){
      const draft=state.pointer.draft;draft.x=Math.min(state.pointer.start.x,point.x);draft.y=Math.min(state.pointer.start.y,point.y);draft.w=Math.abs(point.x-state.pointer.start.x);draft.h=Math.abs(point.y-state.pointer.start.y);
    }else if(state.pointer.mode==='brush'){
      const mask=selectedMask();if(mask){const last=mask.points[mask.points.length-1];if(!last||Math.hypot(point.x-last.x,point.y-last.y)>.003)mask.points.push(point);}
    }else{
      const mask=selectedMask();if(!mask)return;const original=state.pointer.original;
      if(state.pointer.mode==='move'){mask.x=Math.max(-.5,Math.min(1.5,original.x+point.x-state.pointer.start.x));mask.y=Math.max(0,Math.min(1-(mask.h||0),original.y+point.y-state.pointer.start.y));}
      else{mask.w=Math.max(.01,point.x-original.x);mask.h=Math.max(.01,point.y-original.y);}
    }
    queueRender();
  });
  const finishPointer=()=>{
    if(!state.pointer)return;
    if(state.pointer.mode==='create'){
      const draft=state.pointer.draft;if(draft.w>.005&&draft.h>.005)state.masks.push(draft);else{state.history.pop();updateButtons();}
    }
    state.pointer=null;queueRender();
  };
  overlay.addEventListener('pointerup',finishPointer);overlay.addEventListener('pointercancel',finishPointer);

  async function prepareEditor(file){
    sourceInfo=await readDimensions(file);const maxPreview=2048;const width=Math.min(maxPreview,sourceInfo.width);const height=Math.max(1,Math.round(width*sourceInfo.height/sourceInfo.width));
    previewSource=await decodeScaled(file,width,height);state.sourceFile=file;state.sourceWidth=sourceInfo.width;state.sourceHeight=sourceInfo.height;state.previewWidth=width;state.previewHeight=height;
    canvas.width=overlay.width=width;canvas.height=overlay.height=height;state.history=[];state.future=[];state.masks=[];state.selectedId=null;state.originalView=false;$('#privacyOriginalToggle').setAttribute('aria-pressed','false');$('#privacyOriginalToggle').textContent='원본 보기';
    $('#privacyImageMeta').textContent=`${sourceInfo.width.toLocaleString()} × ${sourceInfo.height.toLocaleString()} · 편집 미리보기 ${width.toLocaleString()}px`;
    fitCanvasShell();queueRender();openModal();
  }

  async function applyPrivacy(){
    if(!state.sourceFile||!state.masks.length){toast('가릴 영역을 하나 이상 지정해주세요.',true);return;}
    const button=$('#privacyApply');button.disabled=true;button.textContent='적용 중…';
    try{
      const maxWidth=Math.min(state.sourceWidth,4096);const height=Math.max(1,Math.round(maxWidth*state.sourceHeight/state.sourceWidth));
      outputSource=await decodeScaled(state.sourceFile,maxWidth,height);const output=document.createElement('canvas');output.width=maxWidth;output.height=height;
      const previousOriginalView=state.originalView;state.originalView=false;renderTo(output,outputSource,state.masks);state.originalView=previousOriginalView;
      const mime='image/jpeg';const blob=await new Promise((resolve,reject)=>output.toBlob(value=>value?resolve(value):reject(new Error('가림 편집본을 만들지 못했습니다.')),mime,.94));
      const base=(state.sourceFile.name||'360-image').replace(/\.[^.]+$/,'');const file=new File([blob],`${base}-privacy.jpg`,{type:mime,lastModified:Date.now()});
      const transfer=new DataTransfer();transfer.items.add(file);imageInput.files=transfer.files;sourceFile=file;sourceInfo={width:maxWidth,height};imageInput.dispatchEvent(new Event('change',{bubbles:true}));
      state.masks=[];state.history=[];state.future=[];updateButtons();sourceState.textContent=`${maxWidth.toLocaleString()} × ${height.toLocaleString()} · 개인정보 가림 적용됨`;closeModal();toast('개인정보 가림을 360 이미지에 적용했습니다.');
    }catch(error){console.error(error);toast(error.message||'개인정보 가림 적용 중 오류가 발생했습니다.',true);}finally{button.disabled=false;button.textContent='가림 적용';}
  }

  function syncEffectControls(){
    $('#privacyStrengthOutput').textContent=$('#privacyStrength').value;$('#privacyOpacityOutput').textContent=`${$('#privacyOpacity').value}%`;$('#privacyBrushOutput').textContent=`${$('#privacyBrushSize').value}%`;$('#privacyPaddingOutput').textContent=`${$('#privacyPadding').value}%`;$('#privacySolidColorRow').hidden=state.effect!=='solid';
  }
  function applyControlsToSelected(){const mask=selectedMask();if(!mask)return;mask.effect=state.effect;mask.strength=state.strength;mask.opacity=state.opacity;mask.color=state.color;mask.padding=state.padding;if(mask.type==='brush')mask.brushSize=state.brushSize;queueRender();}

  $$('[data-privacy-tool]').forEach(button=>button.addEventListener('click',()=>{state.tool=button.dataset.privacyTool;$$('[data-privacy-tool]').forEach(item=>item.classList.toggle('active',item===button));$('#privacyStageHint').textContent=state.tool==='select'?'영역을 선택해 이동하거나 크기를 조절하세요.':state.tool==='brush'?'가릴 부분을 손가락이나 마우스로 문질러 주세요.':'가릴 영역을 드래그하세요.';}));
  $$('[data-privacy-effect]').forEach(button=>button.addEventListener('click',()=>{state.effect=button.dataset.privacyEffect;$$('[data-privacy-effect]').forEach(item=>item.classList.toggle('active',item===button));syncEffectControls();applyControlsToSelected();}));
  ['privacyStrength','privacyOpacity','privacyBrushSize','privacyPadding'].forEach(id=>{const input=$(`#${id}`);input.addEventListener('input',()=>{state.strength=Number($('#privacyStrength').value);state.opacity=Number($('#privacyOpacity').value)/100;state.brushSize=Number($('#privacyBrushSize').value)/100;state.padding=Number($('#privacyPadding').value)/100;syncEffectControls();applyControlsToSelected();});});
  $('#privacySolidColor').addEventListener('input',event=>{state.color=event.target.value;applyControlsToSelected();});
  $('#privacyDeleteSelected').addEventListener('click',()=>{if(!state.selectedId)return;pushHistory();state.masks=state.masks.filter(mask=>mask.id!==state.selectedId);state.selectedId=null;queueRender();});
  $('#privacyClearAll').addEventListener('click',()=>{if(!state.masks.length)return;pushHistory();state.masks=[];state.selectedId=null;queueRender();});
  $('#privacyDuplicate').addEventListener('click',()=>{const mask=selectedMask();if(!mask)return;pushHistory();const copy=JSON.parse(JSON.stringify(mask));copy.id=`privacy-${Date.now()}`;if('x'in copy){copy.x=Math.min(1-copy.w,copy.x+.03);copy.y=Math.min(1-copy.h,copy.y+.03);}state.masks.push(copy);state.selectedId=copy.id;queueRender();});
  $('#privacyUndo').addEventListener('click',undo);$('#privacyRedo').addEventListener('click',redo);
  $('#privacyOriginalToggle').addEventListener('click',event=>{state.originalView=!state.originalView;event.currentTarget.setAttribute('aria-pressed',String(state.originalView));event.currentTarget.textContent=state.originalView?'편집본 보기':'원본 보기';queueRender();});
  $('#privacyFitView').addEventListener('click',fitCanvasShell);$('#privacyWrapEdges').addEventListener('change',queueRender);$('#privacyApply').addEventListener('click',applyPrivacy);
  $$('[data-privacy-close]').forEach(button=>button.addEventListener('click',closeModal));

  openButton.addEventListener('click',async()=>{if(!sourceFile){toast('360 이미지를 먼저 업로드해주세요.',true);return;}openButton.disabled=true;openButton.textContent='불러오는 중…';try{await prepareEditor(sourceFile);}catch(error){console.error(error);toast(error.message||'개인정보 편집기를 열지 못했습니다.',true);}finally{openButton.disabled=false;openButton.textContent='평면 편집기 열기';}});
  imageInput.addEventListener('change',()=>{const file=imageInput.files?.[0];if(!file)return;sourceFile=file;sourceInfo=null;openButton.disabled=false;sourceState.textContent=`${file.name} · 편집 가능`;},true);
  window.addEventListener('resize',()=>{if(modalOpen)fitCanvasShell();});
  window.addEventListener('keydown',event=>{if(!modalOpen)return;if(event.key==='Escape'){event.preventDefault();closeModal();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redo();}if(event.key==='Delete'||event.key==='Backspace'){if(state.selectedId&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){event.preventDefault();$('#privacyDeleteSelected').click();}}});

  function installLogoRatioFix(){
    const fit=()=>{
      const logoModal=document.querySelector('#logoEditModal');const logoCanvas=document.querySelector('#logoEditCanvas');const logoStage=document.querySelector('#logoEditStage');const column=logoStage?.parentElement;
      if(!logoModal||logoModal.hidden||!logoCanvas?.width||!logoCanvas?.height||!logoStage||!column)return;
      const ratio=logoCanvas.width/logoCanvas.height;const maxWidth=Math.max(260,column.clientWidth);const maxHeight=Math.max(260,window.innerHeight-330);let width=maxWidth,height=width/ratio;if(height>maxHeight){height=maxHeight;width=height*ratio;}
      logoStage.style.setProperty('width',`${Math.round(width)}px`,'important');logoStage.style.setProperty('height',`${Math.round(height)}px`,'important');logoStage.style.setProperty('aspect-ratio','auto','important');logoStage.style.marginInline='auto';
    };
    const observer=new MutationObserver(()=>requestAnimationFrame(fit));observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','class','style']});window.addEventListener('resize',fit);setInterval(fit,700);
  }
  installLogoRatioFix();syncEffectControls();updateButtons();
})();