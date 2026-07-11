(()=>{
  'use strict';
  if(window.__lavaPrivacyEditorV3Installed)return;
  window.__lavaPrivacyEditorV3Installed=true;

  const VERSION='20260711s';
  const imageInput=document.querySelector('#imageInput');
  const controls=document.querySelector('.controls');
  const dock=document.querySelector('.mobile-editor-dock');
  if(!imageInput||!controls)return;

  document.querySelectorAll('.privacy-card,#privacyEditModal,#privacyEditModalV2').forEach(node=>node.remove());
  document.querySelectorAll('[data-mobile-tab="privacy"]').forEach(node=>node.remove());

  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href=`assets/360-editor-privacy-v3.css?v=${VERSION}`;
  document.head.appendChild(style);

  const toast=(message,isError=false)=>{
    const target=document.querySelector('#editorToast');
    if(!target)return;
    target.textContent=message;
    target.classList.toggle('error',isError);
    target.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>target.classList.remove('show'),3600);
  };

  let sourceFile=imageInput.files?.[0]||null;
  let sourceInfo=null;
  let previewSource=null;
  let modalOpen=false;
  let applying=false;
  let renderFrame=0;
  let viewer3D=null;
  let viewer3DUrl='';
  let refresh3DTimer=0;

  const state={
    view:'flat',tool:'rect',effect:'mosaic',strength:36,opacity:1,color:'#11161d',brush:.05,padding:.015,roundness:.18,
    masks:[],selected:null,history:[],future:[],pointer:null,polygonDraft:null,lineDraft:null,original:false,
    width:0,height:0,threeWidthDeg:14,threeHeightDeg:10
  };

  const card=document.createElement('section');
  card.className='control-card privacy-card';
  card.dataset.editorSection='privacy';
  card.innerHTML=`
    <div class="control-head"><div><h2>개인정보 가리기</h2><p>사각형·원형·둥근 사각형·브러시·선·다각형을 평면과 3D에서 함께 편집합니다.</p></div><span class="mini-tag">SHAPES · 3D</span></div>
    <div class="privacy-card-summary"><div><strong id="privacyMaskCountV3">가림 영역 0개</strong><span id="privacySourceStateV3">360 이미지를 먼저 업로드하세요.</span></div><button class="tool-btn primary" id="openPrivacyEditorV3" type="button" disabled>가리기 편집기 열기</button></div>
    <div class="privacy-feature-grid privacy-feature-grid-v3"><span>▭ 사각형</span><span>◯ 원형</span><span>▢ 둥근 사각형</span><span>〰 브러시</span><span>／ 선형</span><span>⬡ 다각형</span><span>◎ 3D 지정</span><span>▦ 모자이크</span></div>
    <div class="privacy-card-note"><b>평면 + 3D 동기화</b><span>3D에서 빠르게 위치를 지정하고 평면에서 경계를 정밀하게 수정할 수 있습니다.</span></div>`;
  controls.insertBefore(card,controls.querySelector('.export-card')||null);

  const openButton=card.querySelector('#openPrivacyEditorV3');
  const countLabel=card.querySelector('#privacyMaskCountV3');
  const sourceLabel=card.querySelector('#privacySourceStateV3');

  if(dock){
    const button=document.createElement('button');
    button.type='button';
    button.dataset.mobileTab='privacy';
    button.innerHTML='<span>▦</span>가리기';
    dock.insertBefore(button,dock.querySelector('[data-mobile-tab="export"]')||null);
    button.addEventListener('click',()=>{
      dock.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
      controls.querySelectorAll('.control-card').forEach(item=>item.classList.toggle('mobile-active',item===card));
      card.scrollIntoView({behavior:'smooth',block:'start'});
    });
    dock.querySelectorAll('button:not([data-mobile-tab="privacy"])').forEach(item=>item.addEventListener('click',()=>card.classList.remove('mobile-active')));
  }

  const modal=document.createElement('div');
  modal.className='privacy-edit-modal privacy-edit-modal-v3';
  modal.id='privacyEditModalV3';
  modal.hidden=true;
  modal.innerHTML=`
    <div class="privacy-edit-backdrop" data-v3-close></div>
    <section class="privacy-edit-dialog privacy-edit-dialog-v3" role="dialog" aria-modal="true" aria-labelledby="privacyV3Title">
      <header class="privacy-edit-header">
        <div><span class="privacy-edit-eyebrow">PRIVACY MASK · FLAT + 3D</span><h2 id="privacyV3Title">개인정보 가리기</h2><p>평면과 360 화면이 같은 가림 영역을 공유합니다.</p></div>
        <button class="privacy-icon-button" type="button" data-v3-close aria-label="닫기">×</button>
      </header>
      <div class="privacy-view-switch" role="tablist" aria-label="편집 화면">
        <button class="active" type="button" data-v3-view="flat">평면 정밀 편집</button>
        <button type="button" data-v3-view="3d">360 화면 편집</button>
        <button type="button" data-v3-view="list">영역 목록</button>
      </div>
      <div class="privacy-edit-layout privacy-edit-layout-v3">
        <div class="privacy-preview-column">
          <div class="privacy-toolbar privacy-toolbar-v3">
            <div class="privacy-tool-tabs privacy-tool-tabs-v3" role="group" aria-label="영역 도구">
              <button type="button" data-v3-tool="select"><span>↖</span>선택</button>
              <button class="active" type="button" data-v3-tool="rect"><span>▭</span>사각형</button>
              <button type="button" data-v3-tool="ellipse"><span>◯</span>원형</button>
              <button type="button" data-v3-tool="rounded"><span>▢</span>둥근</button>
              <button type="button" data-v3-tool="brush"><span>〰</span>브러시</button>
              <button type="button" data-v3-tool="line"><span>／</span>선형</button>
              <button type="button" data-v3-tool="polygon"><span>⬡</span>다각형</button>
            </div>
            <div class="privacy-view-actions"><button id="privacyV3Original" type="button">원본 보기</button><button id="privacyV3Fit" type="button">화면 맞춤</button></div>
          </div>
          <div class="privacy-flat-panel active" data-v3-panel="flat">
            <div class="privacy-stage" id="privacyV3Stage"><div class="privacy-canvas-shell" id="privacyV3Shell"><canvas id="privacyV3Canvas"></canvas><canvas id="privacyV3Overlay" aria-label="개인정보 영역 편집 캔버스"></canvas></div><div class="privacy-stage-hint" id="privacyV3Hint">가릴 영역을 드래그하세요.</div></div>
          </div>
          <div class="privacy-3d-panel" data-v3-panel="3d">
            <div class="privacy-3d-stage" id="privacyV3Viewer"></div>
            <div class="privacy-3d-tip" id="privacyV3Tip"><strong>360 화면을 클릭해 영역을 추가하세요.</strong><span>드래그는 화면 회전, 클릭은 현재 도구의 가림 영역 추가입니다.</span></div>
          </div>
          <div class="privacy-list-panel" data-v3-panel="list"><div class="privacy-mask-list" id="privacyV3MaskList"></div></div>
          <div class="privacy-statusbar"><span id="privacyV3Meta">이미지 준비 중</span><strong id="privacyV3Status">가림 영역 0개</strong></div>
        </div>
        <aside class="privacy-edit-controls">
          <section class="privacy-edit-card">
            <div class="privacy-card-head"><div><span>EFFECT</span><h3>가림 방식</h3></div><span class="privacy-selected-badge" id="privacyV3Badge">새 영역</span></div>
            <div class="privacy-effect-tabs" role="group"><button class="active" type="button" data-v3-effect="mosaic">▦ 모자이크</button><button type="button" data-v3-effect="blur">◌ 블러</button><button type="button" data-v3-effect="solid">■ 단색</button></div>
            <label class="privacy-range"><span><b>효과 강도</b><output id="privacyV3StrengthOut">36</output></span><input id="privacyV3Strength" type="range" min="8" max="112" value="36"></label>
            <label class="privacy-range"><span><b>불투명도</b><output id="privacyV3OpacityOut">100%</output></span><input id="privacyV3Opacity" type="range" min="20" max="100" value="100"></label>
            <label class="privacy-color-row" id="privacyV3ColorRow" hidden><span>가림 색상</span><input id="privacyV3Color" type="color" value="#11161d"></label>
          </section>
          <section class="privacy-edit-card">
            <div class="privacy-card-head"><div><span>SHAPE</span><h3>영역 설정</h3></div></div>
            <label class="privacy-range"><span><b>브러시·선 굵기</b><output id="privacyV3BrushOut">5%</output></span><input id="privacyV3Brush" type="range" min="1" max="20" value="5"></label>
            <label class="privacy-range"><span><b>가장자리 여유</b><output id="privacyV3PaddingOut">2%</output></span><input id="privacyV3Padding" type="range" min="0" max="15" value="2"></label>
            <label class="privacy-range"><span><b>둥근 정도</b><output id="privacyV3RoundOut">18%</output></span><input id="privacyV3Round" type="range" min="0" max="50" value="18"></label>
            <div class="privacy-polygon-actions"><button id="privacyV3PolygonDone" type="button" disabled>다각형 완료</button><button id="privacyV3PolygonCancel" type="button" disabled>작성 취소</button></div>
            <div class="privacy-object-actions"><button id="privacyV3Duplicate" type="button" disabled>복제</button><button id="privacyV3Delete" type="button" disabled>선택 삭제</button><button id="privacyV3Clear" type="button" disabled>전체 삭제</button></div>
          </section>
          <section class="privacy-edit-card privacy-3d-size-card">
            <div class="privacy-card-head"><div><span>3D QUICK ADD</span><h3>360 클릭 크기</h3></div></div>
            <label class="privacy-range"><span><b>가로 각도</b><output id="privacyV3WidthDegOut">14°</output></span><input id="privacyV3WidthDeg" type="range" min="2" max="60" value="14"></label>
            <label class="privacy-range"><span><b>세로 각도</b><output id="privacyV3HeightDegOut">10°</output></span><input id="privacyV3HeightDeg" type="range" min="2" max="45" value="10"></label>
          </section>
          <section class="privacy-edit-card privacy-history-card"><div class="privacy-history-actions"><button id="privacyV3Undo" type="button" disabled>↶ 실행 취소</button><button id="privacyV3Redo" type="button" disabled>↷ 다시 실행</button></div><label class="privacy-check"><input id="privacyV3Wrap" type="checkbox" checked><span>좌우 경계를 반대편에도 이어서 처리</span></label></section>
          <section class="privacy-edit-card privacy-guide-card"><strong>도구 안내</strong><div><span>원형: 얼굴</span><span>선형: 번호판</span><span>다각형: 문서·화면</span><span>브러시: 불규칙 영역</span><span>3D: 위치 빠른 지정</span><span>평면: 정밀 조정</span></div></section>
        </aside>
      </div>
      <footer class="privacy-edit-footer"><div><strong>동일 렌더러 사용</strong><span>평면·3D 미리보기와 최종 적용이 같은 마스크 데이터를 사용합니다.</span></div><div class="privacy-footer-actions"><button class="privacy-cancel" type="button" data-v3-close>취소</button><button class="privacy-apply" id="privacyV3Apply" type="button">가림 적용</button></div></footer>
    </section>`;
  document.body.appendChild(modal);

  const $=selector=>modal.querySelector(selector);
  const $$=selector=>Array.from(modal.querySelectorAll(selector));
  const canvas=$('#privacyV3Canvas');
  const overlay=$('#privacyV3Overlay');
  const overlayCtx=overlay.getContext('2d');
  const stage=$('#privacyV3Stage');
  const shell=$('#privacyV3Shell');
  const viewer3DElement=$('#privacyV3Viewer');

  const cloneMasks=()=>JSON.parse(JSON.stringify(state.masks));
  const selectedMask=()=>state.masks.find(mask=>mask.id===state.selected)||null;
  const uid=()=>`mask-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

  function pushHistory(){state.history.push(cloneMasks());if(state.history.length>40)state.history.shift();state.future=[];updateUI();}
  function undo(){if(!state.history.length)return;state.future.push(cloneMasks());state.masks=state.history.pop();state.selected=null;state.polygonDraft=null;state.lineDraft=null;updateUI();renderAll();}
  function redo(){if(!state.future.length)return;state.history.push(cloneMasks());state.masks=state.future.pop();state.selected=null;state.polygonDraft=null;state.lineDraft=null;updateUI();renderAll();}

  async function getDimensions(file){
    if('createImageBitmap'in window){const bitmap=await createImageBitmap(file);const result={width:bitmap.width,height:bitmap.height};bitmap.close?.();return result;}
    const url=URL.createObjectURL(file);try{return await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('이미지 크기를 확인하지 못했습니다.'));image.src=url;});}finally{URL.revokeObjectURL(url);}
  }
  async function decode(file,width,height){
    if('createImageBitmap'in window){try{const bitmap=await createImageBitmap(file,{resizeWidth:width,resizeHeight:height,resizeQuality:'high'});const out=document.createElement('canvas');out.width=width;out.height=height;out.getContext('2d').drawImage(bitmap,0,0,width,height);bitmap.close?.();return out;}catch(error){console.warn('privacy bitmap fallback',error);}}
    const url=URL.createObjectURL(file);try{return await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{const out=document.createElement('canvas');out.width=width;out.height=height;out.getContext('2d').drawImage(image,0,0,width,height);resolve(out);};image.onerror=()=>reject(new Error('이미지를 읽지 못했습니다.'));image.src=url;});}finally{URL.revokeObjectURL(url);}
  }

  function roundedPath(ctx,x,y,w,h,r){
    const radius=Math.max(0,Math.min(Math.abs(w),Math.abs(h))*r);
    ctx.beginPath();ctx.moveTo(x+radius,y);ctx.lineTo(x+w-radius,y);ctx.quadraticCurveTo(x+w,y,x+w,y+radius);ctx.lineTo(x+w,y+h-radius);ctx.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);ctx.lineTo(x+radius,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-radius);ctx.lineTo(x,y+radius);ctx.quadraticCurveTo(x,y,x+radius,y);ctx.closePath();
  }

  function drawMaskPath(ctx,mask,width,height,shiftX=0){
    const pad=(mask.padding??state.padding)*Math.min(width,height);
    if(['rect','ellipse','rounded'].includes(mask.type)){
      const x=(mask.x+shiftX)*width-pad,y=mask.y*height-pad,w=mask.w*width+pad*2,h=mask.h*height+pad*2;
      if(mask.type==='rect'){ctx.beginPath();ctx.rect(x,y,w,h);}
      else if(mask.type==='ellipse'){ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);}
      else roundedPath(ctx,x,y,w,h,mask.roundness??state.roundness);
    }else if(mask.type==='line'){
      const points=mask.points||[];if(points.length<2)return false;ctx.beginPath();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=(mask.brush??state.brush)*Math.min(width,height)+pad*2;ctx.moveTo((points[0].x+shiftX)*width,points[0].y*height);ctx.lineTo((points[1].x+shiftX)*width,points[1].y*height);
    }else if(mask.type==='brush'){
      const points=mask.points||[];if(!points.length)return false;ctx.beginPath();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=(mask.brush??state.brush)*Math.min(width,height)+pad*2;points.forEach((point,index)=>index?ctx.lineTo((point.x+shiftX)*width,point.y*height):ctx.moveTo((point.x+shiftX)*width,point.y*height));if(points.length===1){ctx.arc((points[0].x+shiftX)*width,points[0].y*height,ctx.lineWidth/2,0,Math.PI*2);}
    }else if(mask.type==='polygon'){
      const points=mask.points||[];if(points.length<3)return false;ctx.beginPath();points.forEach((point,index)=>index?ctx.lineTo((point.x+shiftX)*width,point.y*height):ctx.moveTo((point.x+shiftX)*width,point.y*height));ctx.closePath();
    }else return false;
    return true;
  }

  function maskCanvas(width,height,mask){
    const out=document.createElement('canvas');out.width=width;out.height=height;const ctx=out.getContext('2d');ctx.fillStyle='#fff';ctx.strokeStyle='#fff';
    const shifts=$('#privacyV3Wrap')?.checked?[-1,0,1]:[0];
    shifts.forEach(shift=>{if(!drawMaskPath(ctx,mask,width,height,shift))return;if(['line','brush'].includes(mask.type))ctx.stroke();else ctx.fill();});
    return out;
  }

  function mosaicCanvas(source,strength){
    const block=Math.max(6,Math.round(strength));
    const small=document.createElement('canvas');small.width=Math.max(1,Math.ceil(source.width/block));small.height=Math.max(1,Math.ceil(source.height/block));
    const sctx=small.getContext('2d');sctx.imageSmoothingEnabled=true;sctx.drawImage(source,0,0,small.width,small.height);
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

  function currentMasks(){
    const masks=[...state.masks];
    if(state.pointer?.mode==='create'&&state.pointer.draft)masks.push(state.pointer.draft);
    if(state.polygonDraft?.points?.length>=2)masks.push(state.polygonDraft);
    if(state.lineDraft?.points?.length===2)masks.push(state.lineDraft);
    return masks;
  }

  function renderTo(target,source,masks){
    const ctx=target.getContext('2d');ctx.clearRect(0,0,target.width,target.height);ctx.drawImage(source,0,0,target.width,target.height);if(state.original)return;
    const scaled=document.createElement('canvas');scaled.width=target.width;scaled.height=target.height;scaled.getContext('2d').drawImage(source,0,0,scaled.width,scaled.height);
    masks.forEach(mask=>{ctx.save();ctx.globalAlpha=mask.opacity??state.opacity;ctx.drawImage(effectLayer(scaled,mask),0,0);ctx.restore();});
  }

  function renderFlat(){
    if(!previewSource)return;cancelAnimationFrame(renderFrame);renderFrame=requestAnimationFrame(()=>{
      renderTo(canvas,previewSource,currentMasks());overlayCtx.clearRect(0,0,overlay.width,overlay.height);state.masks.forEach(mask=>outline(mask,mask.id===state.selected));if(state.pointer?.draft)outline(state.pointer.draft,true);if(state.polygonDraft)outline(state.polygonDraft,true);if(state.lineDraft)outline(state.lineDraft,true);updateUI();
    });
  }

  function outline(mask,selected){
    overlayCtx.save();overlayCtx.strokeStyle=selected?'#c9ff48':'rgba(255,255,255,.95)';overlayCtx.fillStyle=selected?'rgba(201,255,72,.08)':'rgba(255,255,255,.035)';overlayCtx.lineWidth=Math.max(2,overlay.width/700);overlayCtx.setLineDash(selected?[]:[8,6]);
    const width=overlay.width,height=overlay.height;
    if(['rect','ellipse','rounded'].includes(mask.type)){
      const x=mask.x*width,y=mask.y*height,w=mask.w*width,h=mask.h*height;
      if(mask.type==='rect'){overlayCtx.beginPath();overlayCtx.rect(x,y,w,h);}else if(mask.type==='ellipse'){overlayCtx.beginPath();overlayCtx.ellipse(x+w/2,y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);}else roundedPath(overlayCtx,x,y,w,h,mask.roundness??state.roundness);overlayCtx.fill();overlayCtx.stroke();
      if(selected){const s=Math.max(10,width/80);overlayCtx.setLineDash([]);overlayCtx.fillStyle='#c9ff48';overlayCtx.fillRect(x+w-s/2,y+h-s/2,s,s);}
    }else if(['line','brush'].includes(mask.type)){
      const points=mask.points||[];if(points.length){overlayCtx.lineCap='round';overlayCtx.lineJoin='round';overlayCtx.lineWidth=(mask.brush??state.brush)*Math.min(width,height);overlayCtx.beginPath();points.forEach((point,index)=>index?overlayCtx.lineTo(point.x*width,point.y*height):overlayCtx.moveTo(point.x*width,point.y*height));overlayCtx.stroke();}
    }else if(mask.type==='polygon'){
      const points=mask.points||[];if(points.length){overlayCtx.beginPath();points.forEach((point,index)=>index?overlayCtx.lineTo(point.x*width,point.y*height):overlayCtx.moveTo(point.x*width,point.y*height));if(points.length>=3)overlayCtx.closePath();overlayCtx.fill();overlayCtx.stroke();points.forEach(point=>{overlayCtx.fillStyle='#c9ff48';overlayCtx.fillRect(point.x*width-4,point.y*height-4,8,8);});}
    }
    overlayCtx.restore();
  }

  function fitShell(){if(!state.width)return;const ratio=state.width/state.height;const maxW=Math.max(280,stage.clientWidth-28);const maxH=Math.max(240,window.innerHeight-300);let w=maxW,h=w/ratio;if(h>maxH){h=maxH;w=h*ratio;}shell.style.width=`${Math.round(w)}px`;shell.style.height=`${Math.round(h)}px`;}
  function point(event){const rect=overlay.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))};}
  function baseMask(type){return{id:uid(),type,effect:state.effect,strength:state.strength,opacity:state.opacity,color:state.color,brush:state.brush,padding:state.padding,roundness:state.roundness};}

  function hitTest(p){
    for(let index=state.masks.length-1;index>=0;index--){const mask=state.masks[index];
      if(['rect','ellipse','rounded'].includes(mask.type)){if(p.x>=mask.x&&p.x<=mask.x+mask.w&&p.y>=mask.y&&p.y<=mask.y+mask.h)return mask;}
      else if(['line','brush'].includes(mask.type)){for(const q of mask.points||[])if(Math.hypot(p.x-q.x,p.y-q.y)<=(mask.brush||.05)/1.5)return mask;}
      else if(mask.type==='polygon'){const pts=mask.points||[];let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const xi=pts[i].x,yi=pts[i].y,xj=pts[j].x,yj=pts[j].y;const intersect=((yi>p.y)!=(yj>p.y))&&(p.x<(xj-xi)*(p.y-yi)/(yj-yi+.000001)+xi);if(intersect)inside=!inside;}if(inside)return mask;}
    }return null;
  }

  overlay.addEventListener('pointerdown',event=>{
    if(!previewSource||state.view!=='flat')return;event.preventDefault();overlay.setPointerCapture?.(event.pointerId);const p=point(event);
    if(state.tool==='polygon'){
      if(!state.polygonDraft){pushHistory();state.polygonDraft={...baseMask('polygon'),points:[]};}
      state.polygonDraft.points.push(p);renderAll();return;
    }
    if(state.tool==='select'){
      const mask=hitTest(p);state.selected=mask?.id||null;if(!mask){renderAll();return;}pushHistory();const handle=['rect','ellipse','rounded'].includes(mask.type)&&Math.abs(p.x-(mask.x+mask.w))<.035&&Math.abs(p.y-(mask.y+mask.h))<.055;state.pointer={mode:handle?'resize':'move',start:p,original:JSON.parse(JSON.stringify(mask))};
    }else if(state.tool==='brush'){
      pushHistory();const mask={...baseMask('brush'),points:[p]};state.masks.push(mask);state.selected=mask.id;state.pointer={mode:'brush'};
    }else if(state.tool==='line'){
      pushHistory();state.lineDraft={...baseMask('line'),points:[p,p]};state.pointer={mode:'line',start:p};
    }else{
      pushHistory();const draft={...baseMask(state.tool),x:p.x,y:p.y,w:0,h:0};state.selected=draft.id;state.pointer={mode:'create',start:p,draft};
    }
    renderAll();
  });
  overlay.addEventListener('pointermove',event=>{
    if(!state.pointer)return;const p=point(event);
    if(state.pointer.mode==='create'){const draft=state.pointer.draft;draft.x=Math.min(state.pointer.start.x,p.x);draft.y=Math.min(state.pointer.start.y,p.y);draft.w=Math.abs(p.x-state.pointer.start.x);draft.h=Math.abs(p.y-state.pointer.start.y);}
    else if(state.pointer.mode==='brush'){const mask=selectedMask();const last=mask?.points.at(-1);if(mask&&(!last||Math.hypot(last.x-p.x,last.y-p.y)>.0025))mask.points.push(p);}
    else if(state.pointer.mode==='line'&&state.lineDraft)state.lineDraft.points[1]=p;
    else{const mask=selectedMask();if(!mask)return;const original=state.pointer.original;if(state.pointer.mode==='move'){
      const dx=p.x-state.pointer.start.x,dy=p.y-state.pointer.start.y;
      if(['rect','ellipse','rounded'].includes(mask.type)){mask.x=original.x+dx;mask.y=Math.max(0,Math.min(1-mask.h,original.y+dy));}
      else if(mask.points)mask.points=original.points.map(point=>({x:point.x+dx,y:Math.max(0,Math.min(1,point.y+dy))}));
    }else{mask.w=Math.max(.01,p.x-original.x);mask.h=Math.max(.01,p.y-original.y);}}
    renderAll();
  });
  const finishPointer=()=>{
    if(!state.pointer)return;
    if(state.pointer.mode==='create'){const draft=state.pointer.draft;if(draft.w>.005&&draft.h>.005)state.masks.push(draft);else state.history.pop();}
    if(state.pointer.mode==='line'&&state.lineDraft){if(Math.hypot(state.lineDraft.points[0].x-state.lineDraft.points[1].x,state.lineDraft.points[0].y-state.lineDraft.points[1].y)>.005){state.masks.push(state.lineDraft);state.selected=state.lineDraft.id;}else state.history.pop();state.lineDraft=null;}
    state.pointer=null;renderAll();
  };
  overlay.addEventListener('pointerup',finishPointer);overlay.addEventListener('pointercancel',finishPointer);
  overlay.addEventListener('dblclick',event=>{if(state.tool==='polygon'&&state.polygonDraft){event.preventDefault();finishPolygon();}});

  function finishPolygon(){
    if(!state.polygonDraft)return;
    if(state.polygonDraft.points.length>=3){state.masks.push(state.polygonDraft);state.selected=state.polygonDraft.id;}else state.history.pop();
    state.polygonDraft=null;updateUI();renderAll();
  }
  function cancelPolygon(){if(!state.polygonDraft)return;state.polygonDraft=null;state.history.pop();updateUI();renderAll();}

  function centerOf(mask){
    if(['rect','ellipse','rounded'].includes(mask.type))return{x:mask.x+mask.w/2,y:mask.y+mask.h/2};
    const points=mask.points||[];if(!points.length)return{x:.5,y:.5};return{x:points.reduce((sum,p)=>sum+p.x,0)/points.length,y:points.reduce((sum,p)=>sum+p.y,0)/points.length};
  }
  const normalizedFromYawPitch=(yaw,pitch)=>({x:((yaw+180)/360+1)%1,y:Math.max(0,Math.min(1,(90-pitch)/180))});

  function add3DPoint(yaw,pitch){
    const p=normalizedFromYawPitch(yaw,pitch);
    if(state.tool==='select'){const nearest=state.masks.map(mask=>({mask,d:Math.hypot(centerOf(mask).x-p.x,centerOf(mask).y-p.y)})).sort((a,b)=>a.d-b.d)[0];if(nearest&&nearest.d<.08)state.selected=nearest.mask.id;updateUI();refresh3D();return;}
    if(state.tool==='polygon'){
      if(!state.polygonDraft){pushHistory();state.polygonDraft={...baseMask('polygon'),points:[]};}
      state.polygonDraft.points.push(p);renderAll();return;
    }
    if(state.tool==='brush'){
      if(!state.polygonDraft){pushHistory();state.polygonDraft={...baseMask('brush'),points:[]};}
      state.polygonDraft.points.push(p);renderAll();return;
    }
    if(state.tool==='line'){
      if(!state.lineDraft){pushHistory();state.lineDraft={...baseMask('line'),points:[p]};toast('선형 가림의 끝점을 한 번 더 클릭하세요.');}
      else{state.lineDraft.points.push(p);if(state.lineDraft.points.length>=2){state.masks.push(state.lineDraft);state.selected=state.lineDraft.id;state.lineDraft=null;renderAll();}}return;
    }
    pushHistory();const w=state.threeWidthDeg/360,h=state.threeHeightDeg/180;const mask={...baseMask(state.tool),x:p.x-w/2,y:Math.max(0,Math.min(1-h,p.y-h/2)),w,h};state.masks.push(mask);state.selected=mask.id;renderAll();
  }

  function render3DSource(){const out=document.createElement('canvas');out.width=previewSource.width;out.height=previewSource.height;renderTo(out,previewSource,currentMasks());return out;}
  function destroy3D(){if(viewer3D){try{viewer3D.destroy();}catch{}viewer3D=null;}if(viewer3DUrl){URL.revokeObjectURL(viewer3DUrl);viewer3DUrl='';}viewer3DElement.innerHTML='';}
  function refresh3D(){
    if(state.view!=='3d'||!previewSource||!window.pannellum)return;
    clearTimeout(refresh3DTimer);refresh3DTimer=setTimeout(()=>{
      const old={yaw:viewer3D?.getYaw?.()||0,pitch:viewer3D?.getPitch?.()||0,hfov:viewer3D?.getHfov?.()||100};
      const rendered=render3DSource();rendered.toBlob(blob=>{
        if(!blob)return;destroy3D();viewer3DUrl=URL.createObjectURL(blob);viewer3D=window.pannellum.viewer(viewer3DElement,{type:'equirectangular',panorama:viewer3DUrl,autoLoad:true,showControls:true,showFullscreenCtrl:true,compass:false,yaw:old.yaw,pitch:old.pitch,hfov:old.hfov});
        viewer3D.on('load',()=>{
          const container=viewer3D.getContainer?.()||viewer3DElement;let down=null;
          container.addEventListener('pointerdown',event=>{down={x:event.clientX,y:event.clientY,time:Date.now()};},{once:true});
          container.addEventListener('pointerup',event=>{
            if(!down||Math.hypot(event.clientX-down.x,event.clientY-down.y)>8||Date.now()-down.time>500)return;
            const coords=viewer3D.mouseEventToCoords?.(event);if(coords)add3DPoint(coords[1],coords[0]);
          });
          state.masks.forEach((mask,index)=>{const c=centerOf(mask);const yaw=c.x*360-180,pitch=90-c.y*180;try{viewer3D.addHotSpot({id:`privacy-v3-${mask.id}`,pitch,yaw,cssClass:`privacy-3d-hotspot${mask.id===state.selected?' selected':''}`,text:String(index+1),clickHandlerFunc:()=>{state.selected=mask.id;updateUI();refresh3D();}});}catch{}});
        });
      },'image/jpeg',.92);
    },140);
  }

  function renderList(){
    const list=$('#privacyV3MaskList');
    if(!state.masks.length){list.innerHTML='<div class="privacy-mask-empty"><strong>아직 가림 영역이 없습니다.</strong><span>평면 또는 360 화면에서 영역을 추가하세요.</span></div>';return;}
    const shapeName={rect:'사각형',ellipse:'원형·타원',rounded:'둥근 사각형',brush:'브러시',line:'선형',polygon:'다각형'};
    const effectName={mosaic:'모자이크',blur:'블러',solid:'단색'};
    list.innerHTML=state.masks.map((mask,index)=>`<article class="privacy-mask-item${mask.id===state.selected?' active':''}" data-mask-id="${mask.id}"><button class="privacy-mask-select" type="button"><b>${index+1}. ${shapeName[mask.type]||mask.type}</b><span>${effectName[mask.effect]||mask.effect} · 강도 ${mask.strength}</span></button><button class="privacy-mask-remove" type="button" aria-label="삭제">×</button></article>`).join('');
    list.querySelectorAll('.privacy-mask-select').forEach(button=>button.addEventListener('click',()=>{state.selected=button.closest('[data-mask-id]').dataset.maskId;updateUI();renderAll();}));
    list.querySelectorAll('.privacy-mask-remove').forEach(button=>button.addEventListener('click',()=>{pushHistory();const id=button.closest('[data-mask-id]').dataset.maskId;state.masks=state.masks.filter(mask=>mask.id!==id);if(state.selected===id)state.selected=null;renderAll();}));
  }

  function switchView(view){
    state.view=view;$$('[data-v3-view]').forEach(button=>button.classList.toggle('active',button.dataset.v3View===view));$$('[data-v3-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.v3Panel===view));
    if(view==='flat'){destroy3D();fitShell();renderFlat();}
    else if(view==='3d'){refresh3D();}
    else{destroy3D();renderList();}
  }

  function updateUI(){
    const selected=!!selectedMask();$('#privacyV3Undo').disabled=!state.history.length;$('#privacyV3Redo').disabled=!state.future.length;$('#privacyV3Delete').disabled=!selected;$('#privacyV3Duplicate').disabled=!selected;$('#privacyV3Clear').disabled=!state.masks.length;$('#privacyV3Badge').textContent=selected?'선택 영역':'새 영역';$('#privacyV3Status').textContent=`가림 영역 ${state.masks.length}개`;countLabel.textContent=`가림 영역 ${state.masks.length}개`;$('#privacyV3StrengthOut').textContent=state.strength;$('#privacyV3OpacityOut').textContent=`${Math.round(state.opacity*100)}%`;$('#privacyV3BrushOut').textContent=`${Math.round(state.brush*100)}%`;$('#privacyV3PaddingOut').textContent=`${Math.round(state.padding*100)}%`;$('#privacyV3RoundOut').textContent=`${Math.round(state.roundness*100)}%`;$('#privacyV3WidthDegOut').textContent=`${state.threeWidthDeg}°`;$('#privacyV3HeightDegOut').textContent=`${state.threeHeightDeg}°`;$('#privacyV3ColorRow').hidden=state.effect!=='solid';$('#privacyV3PolygonDone').disabled=!(state.polygonDraft?.points?.length>=3);$('#privacyV3PolygonCancel').disabled=!state.polygonDraft;
  }
  function renderAll(){renderFlat();if(state.view==='3d')refresh3D();if(state.view==='list')renderList();updateUI();}

  async function prepare(file){
    sourceInfo=await getDimensions(file);const width=Math.min(2048,sourceInfo.width),height=Math.max(1,Math.round(width*sourceInfo.height/sourceInfo.width));previewSource=await decode(file,width,height);sourceFile=file;state.width=width;state.height=height;state.masks=[];state.history=[];state.future=[];state.selected=null;state.polygonDraft=null;state.lineDraft=null;state.original=false;canvas.width=overlay.width=width;canvas.height=overlay.height=height;$('#privacyV3Meta').textContent=`${sourceInfo.width.toLocaleString()} × ${sourceInfo.height.toLocaleString()} · 편집 미리보기 ${width.toLocaleString()}px`;fitShell();openModal();switchView('flat');updateUI();renderAll();
  }
  function openModal(){modal.hidden=false;modalOpen=true;document.documentElement.classList.add('privacy-editor-open');document.body.classList.add('privacy-editor-open');requestAnimationFrame(()=>{modal.classList.add('visible');fitShell();});}
  function closeModal(){destroy3D();modal.classList.remove('visible');modalOpen=false;document.documentElement.classList.remove('privacy-editor-open');document.body.classList.remove('privacy-editor-open');setTimeout(()=>modal.hidden=true,180);}

  async function apply(){
    if(!sourceFile||!state.masks.length){toast('가릴 영역을 하나 이상 지정해주세요.',true);return;}const button=$('#privacyV3Apply');button.disabled=true;button.textContent='가림 적용 중…';
    try{const width=Math.min(sourceInfo.width,4096),height=Math.max(1,Math.round(width*sourceInfo.height/sourceInfo.width));const source=await decode(sourceFile,width,height);const output=document.createElement('canvas');output.width=width;output.height=height;const wasOriginal=state.original;state.original=false;renderTo(output,source,state.masks);state.original=wasOriginal;const blob=await new Promise((resolve,reject)=>output.toBlob(value=>value?resolve(value):reject(new Error('가림 결과를 만들지 못했습니다.')),'image/jpeg',.95));const base=(sourceFile.name||'360-image').replace(/\.[^.]+$/,'');const file=new File([blob],`${base}-privacy.jpg`,{type:'image/jpeg',lastModified:Date.now()});const transfer=new DataTransfer();transfer.items.add(file);applying=true;imageInput.files=transfer.files;sourceFile=file;sourceInfo={width,height};imageInput.dispatchEvent(new Event('change',{bubbles:true}));applying=false;sourceLabel.textContent=`${width.toLocaleString()} × ${height.toLocaleString()} · 개인정보 가림 적용 완료`;state.masks=[];updateUI();closeModal();toast('평면·3D 가림 영역을 360 이미지에 적용했습니다.');}
    catch(error){console.error(error);toast(error.message||'가림 적용 중 오류가 발생했습니다.',true);}finally{button.disabled=false;button.textContent='가림 적용';}
  }

  $$('[data-v3-view]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.v3View)));
  $$('[data-v3-tool]').forEach(button=>button.addEventListener('click',()=>{state.tool=button.dataset.v3Tool;$$('[data-v3-tool]').forEach(item=>item.classList.toggle('active',item===button));$('#privacyV3Hint').textContent=state.tool==='select'?'영역을 선택해 이동하거나 크기를 조절하세요.':state.tool==='polygon'?'점들을 클릭하고 “다각형 완료”를 누르세요.':state.tool==='brush'?'가릴 부분을 문질러 주세요.':'가릴 영역을 드래그하세요.';$('#privacyV3Tip').querySelector('strong').textContent=state.tool==='polygon'?'360 화면에서 다각형 점을 차례로 클릭하세요.':state.tool==='line'?'360 화면에서 시작점과 끝점을 클릭하세요.':state.tool==='brush'?'360 화면에서 여러 점을 클릭해 브러시 경로를 만드세요.':'360 화면을 클릭해 영역을 추가하세요.';}));
  $$('[data-v3-effect]').forEach(button=>button.addEventListener('click',()=>{state.effect=button.dataset.v3Effect;$$('[data-v3-effect]').forEach(item=>item.classList.toggle('active',item===button));const mask=selectedMask();if(mask)mask.effect=state.effect;renderAll();}));
  $('#privacyV3Strength').addEventListener('input',event=>{state.strength=Number(event.target.value);const mask=selectedMask();if(mask)mask.strength=state.strength;renderAll();});
  $('#privacyV3Opacity').addEventListener('input',event=>{state.opacity=Number(event.target.value)/100;const mask=selectedMask();if(mask)mask.opacity=state.opacity;renderAll();});
  $('#privacyV3Brush').addEventListener('input',event=>{state.brush=Number(event.target.value)/100;const mask=selectedMask();if(mask&&['brush','line'].includes(mask.type))mask.brush=state.brush;renderAll();});
  $('#privacyV3Padding').addEventListener('input',event=>{state.padding=Number(event.target.value)/100;const mask=selectedMask();if(mask)mask.padding=state.padding;renderAll();});
  $('#privacyV3Round').addEventListener('input',event=>{state.roundness=Number(event.target.value)/100;const mask=selectedMask();if(mask?.type==='rounded')mask.roundness=state.roundness;renderAll();});
  $('#privacyV3Color').addEventListener('input',event=>{state.color=event.target.value;const mask=selectedMask();if(mask)mask.color=state.color;renderAll();});
  $('#privacyV3WidthDeg').addEventListener('input',event=>{state.threeWidthDeg=Number(event.target.value);updateUI();});
  $('#privacyV3HeightDeg').addEventListener('input',event=>{state.threeHeightDeg=Number(event.target.value);updateUI();});
  $('#privacyV3PolygonDone').addEventListener('click',()=>{if(state.polygonDraft?.type==='brush'&&state.polygonDraft.points.length>=1){state.masks.push(state.polygonDraft);state.selected=state.polygonDraft.id;state.polygonDraft=null;renderAll();}else finishPolygon();});
  $('#privacyV3PolygonCancel').addEventListener('click',cancelPolygon);
  $('#privacyV3Undo').addEventListener('click',undo);$('#privacyV3Redo').addEventListener('click',redo);
  $('#privacyV3Delete').addEventListener('click',()=>{if(!state.selected)return;pushHistory();state.masks=state.masks.filter(mask=>mask.id!==state.selected);state.selected=null;renderAll();});
  $('#privacyV3Clear').addEventListener('click',()=>{if(!state.masks.length)return;pushHistory();state.masks=[];state.selected=null;renderAll();});
  $('#privacyV3Duplicate').addEventListener('click',()=>{const mask=selectedMask();if(!mask)return;pushHistory();const copy=JSON.parse(JSON.stringify(mask));copy.id=uid();if('x'in copy){copy.x+=.03;copy.y=Math.min(1-copy.h,copy.y+.03);}else if(copy.points)copy.points=copy.points.map(point=>({x:point.x+.03,y:point.y+.03}));state.masks.push(copy);state.selected=copy.id;renderAll();});
  $('#privacyV3Original').addEventListener('click',event=>{state.original=!state.original;event.currentTarget.textContent=state.original?'편집본 보기':'원본 보기';renderAll();});
  $('#privacyV3Fit').addEventListener('click',()=>{if(state.view==='flat')fitShell();else if(state.view==='3d')viewer3D?.resize?.();});
  $('#privacyV3Wrap').addEventListener('change',renderAll);$('#privacyV3Apply').addEventListener('click',apply);
  $$('[data-v3-close]').forEach(button=>button.addEventListener('click',closeModal));

  openButton.addEventListener('click',async()=>{if(!sourceFile){toast('360 이미지를 먼저 업로드해주세요.',true);return;}openButton.disabled=true;openButton.textContent='불러오는 중…';try{await prepare(sourceFile);}catch(error){console.error(error);toast(error.message||'가리기 편집기를 열지 못했습니다.',true);}finally{openButton.disabled=false;openButton.textContent='가리기 편집기 열기';}});
  imageInput.addEventListener('change',()=>{const file=imageInput.files?.[0];if(!file)return;sourceFile=file;sourceInfo=null;openButton.disabled=false;sourceLabel.textContent=`${file.name} · 평면·3D 편집 가능`;if(!applying){state.masks=[];state.history=[];state.future=[];updateUI();}},true);
  window.addEventListener('resize',()=>{if(modalOpen){fitShell();viewer3D?.resize?.();}});
  window.addEventListener('keydown',event=>{if(!modalOpen)return;if(event.key==='Escape'){event.preventDefault();closeModal();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redo();}if(event.key==='Enter'&&state.polygonDraft){event.preventDefault();$('#privacyV3PolygonDone').click();}if((event.key==='Delete'||event.key==='Backspace')&&state.selected&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){event.preventDefault();$('#privacyV3Delete').click();}});

  if(sourceFile){openButton.disabled=false;sourceLabel.textContent=`${sourceFile.name} · 평면·3D 편집 가능`;}
  updateUI();
})();