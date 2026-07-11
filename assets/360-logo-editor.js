(()=>{
  'use strict';

  const logoInput=document.querySelector('#logoInput');
  if(!logoInput||window.__lavaLogoEditorInstalled)return;
  window.__lavaLogoEditorInstalled=true;

  const VERSION='20260711k';
  const MAX_EDITOR_SIDE=1200;
  const MAX_HISTORY=10;

  const styleLink=document.createElement('link');
  styleLink.rel='stylesheet';
  styleLink.href=`assets/360-logo-editor.css?v=${VERSION}`;
  document.head.appendChild(styleLink);

  const modal=document.createElement('div');
  modal.className='logo-edit-modal';
  modal.id='logoEditModal';
  modal.hidden=true;
  modal.innerHTML=`
    <div class="logo-edit-backdrop" data-logo-close></div>
    <section class="logo-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="logoEditTitle">
      <header class="logo-edit-header">
        <div>
          <span class="logo-edit-eyebrow">LOGO PREP</span>
          <h2 id="logoEditTitle">로고 배경·영역 편집</h2>
          <p>가짜 투명 격자 배경을 지우거나, 원하는 영역만 투명 PNG로 만듭니다.</p>
        </div>
        <button class="logo-edit-icon" type="button" data-logo-close aria-label="로고 편집 닫기">×</button>
      </header>

      <div class="logo-edit-layout">
        <div class="logo-edit-preview-column">
          <div class="logo-edit-detection" id="logoEditDetection" role="status"></div>
          <div class="logo-edit-stage" id="logoEditStage" data-preview-bg="checker">
            <canvas id="logoEditCanvas"></canvas>
            <canvas id="logoEditOverlay" aria-label="로고 편집 캔버스"></canvas>
            <div class="logo-edit-cursor-hint" id="logoEditCursorHint">이미지를 클릭해 배경을 지우세요.</div>
          </div>
          <div class="logo-edit-preview-bar">
            <span>투명 배경 확인</span>
            <div class="logo-edit-bg-tabs" role="group" aria-label="미리보기 배경">
              <button class="active" type="button" data-preview-bg="checker">격자</button>
              <button type="button" data-preview-bg="dark">검정</button>
              <button type="button" data-preview-bg="light">흰색</button>
              <button type="button" data-preview-bg="lime">라임</button>
            </div>
          </div>
        </div>

        <aside class="logo-edit-controls">
          <section class="logo-edit-card logo-edit-quick-card">
            <div class="logo-edit-card-head">
              <div><span>QUICK FIX</span><h3>빠른 처리</h3></div>
              <span class="logo-edit-badge" id="logoAlphaBadge">분석 중</span>
            </div>
            <div class="logo-edit-quick-grid">
              <button class="logo-edit-action primary" id="logoAutoRemove" type="button"><b>자동 배경 제거</b><small>가장자리 격자·밝은 배경 제거</small></button>
              <button class="logo-edit-action" id="logoCircleQuick" type="button"><b>가운데 원형만 사용</b><small>원 바깥을 바로 투명화</small></button>
              <button class="logo-edit-action" id="logoTrimTransparent" type="button"><b>투명 여백 정리</b><small>로고 외곽에 맞춰 자동 자르기</small></button>
              <button class="logo-edit-action" id="logoRestoreOriginal" type="button"><b>원본 복원</b><small>처음 업로드 상태로 되돌리기</small></button>
            </div>
            <label class="logo-edit-range">
              <span><b>자동 제거 민감도</b><output id="autoThresholdOutput">165</output></span>
              <input id="autoThreshold" type="range" min="120" max="235" value="165">
            </label>
          </section>

          <section class="logo-edit-card">
            <div class="logo-edit-card-head"><div><span>MANUAL</span><h3>직접 편집</h3></div></div>
            <div class="logo-edit-tools" role="tablist" aria-label="로고 편집 도구">
              <button class="active" type="button" data-logo-tool="magic"><span>✦</span>매직툴</button>
              <button type="button" data-logo-tool="eraser"><span>◌</span>지우개</button>
              <button type="button" data-logo-tool="circle"><span>◯</span>원형 영역</button>
            </div>

            <div class="logo-tool-panel active" data-tool-panel="magic">
              <p>지울 배경을 클릭하세요. 비슷한 색의 연결된 영역이 투명해집니다.</p>
              <label class="logo-edit-range">
                <span><b>색상 허용 범위</b><output id="magicToleranceOutput">38</output></span>
                <input id="magicTolerance" type="range" min="5" max="140" value="38">
              </label>
              <label class="logo-edit-check"><input id="magicConnected" type="checkbox" checked><span>클릭한 곳과 연결된 영역만 지우기</span></label>
            </div>

            <div class="logo-tool-panel" data-tool-panel="eraser">
              <p>마우스나 손가락으로 문질러 불필요한 부분을 직접 지웁니다.</p>
              <label class="logo-edit-range">
                <span><b>지우개 크기</b><output id="eraserSizeOutput">42</output></span>
                <input id="eraserSize" type="range" min="8" max="180" value="42">
              </label>
            </div>

            <div class="logo-tool-panel" data-tool-panel="circle">
              <p>원 중심을 화면에서 드래그하거나 아래 값으로 조정한 뒤 적용하세요.</p>
              <label class="logo-edit-range"><span><b>원 크기</b><output id="circleSizeOutput">92%</output></span><input id="circleSize" type="range" min="20" max="100" value="92"></label>
              <div class="logo-edit-two-ranges">
                <label class="logo-edit-range"><span><b>중심 X</b><output id="circleXOutput">50%</output></span><input id="circleX" type="range" min="0" max="100" value="50"></label>
                <label class="logo-edit-range"><span><b>중심 Y</b><output id="circleYOutput">50%</output></span><input id="circleY" type="range" min="0" max="100" value="50"></label>
              </div>
              <label class="logo-edit-range"><span><b>가장자리 부드럽게</b><output id="circleFeatherOutput">2%</output></span><input id="circleFeather" type="range" min="0" max="15" value="2"></label>
              <button class="logo-edit-secondary-wide" id="logoApplyCircle" type="button">원 바깥을 투명하게 적용</button>
            </div>
          </section>

          <section class="logo-edit-card logo-edit-history-card">
            <div class="logo-edit-history">
              <button id="logoUndo" type="button" disabled>↶ 실행 취소</button>
              <button id="logoRedo" type="button" disabled>↷ 다시 실행</button>
            </div>
            <label class="logo-edit-check"><input id="logoAutoTrim" type="checkbox" checked><span>적용할 때 투명 여백 자동 정리</span></label>
          </section>
        </aside>
      </div>

      <footer class="logo-edit-footer">
        <div class="logo-edit-footer-note"><strong>결과 형식: 투명 PNG</strong><span>편집한 로고는 서버로 전송되지 않고 현재 브라우저에서만 처리됩니다.</span></div>
        <div class="logo-edit-footer-actions">
          <button class="logo-edit-cancel" type="button" data-logo-close>취소</button>
          <button class="logo-edit-original" id="logoUseOriginal" type="button">원본 그대로 사용</button>
          <button class="logo-edit-apply" id="logoApplyEdited" type="button">편집한 로고 적용</button>
        </div>
      </footer>
    </section>`;
  document.body.appendChild(modal);

  const $=selector=>modal.querySelector(selector);
  const $$=selector=>Array.from(modal.querySelectorAll(selector));
  const canvas=$('#logoEditCanvas');
  const overlay=$('#logoEditOverlay');
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const overlayCtx=overlay.getContext('2d');
  const stage=$('#logoEditStage');
  const detection=$('#logoEditDetection');
  const alphaBadge=$('#logoAlphaBadge');
  const cursorHint=$('#logoEditCursorHint');

  const state={
    file:null,
    sourceName:'logo.png',
    original:null,
    history:[],
    future:[],
    tool:'magic',
    bypass:false,
    pointerDown:false,
    eraserActive:false,
    lastPoint:null,
    circleDragging:false,
    circle:{x:.5,y:.5,size:.92,feather:.02},
    lastAppliedFile:null,
    hasAlpha:false,
    checkerCandidate:false
  };

  const editButton=document.createElement('button');
  editButton.type='button';
  editButton.className='tool-btn logo-reopen-button';
  editButton.textContent='로고 편집';
  editButton.disabled=true;
  const logoActions=logoInput.closest('.logo-actions');
  if(logoActions)logoActions.insertBefore(editButton,logoActions.querySelector('#removeLogoBtn'));

  function toast(message,isError=false){
    const target=document.querySelector('#editorToast');
    if(!target)return;
    target.textContent=message;
    target.classList.toggle('error',isError);
    target.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>target.classList.remove('show'),3200);
  }

  function setBodyLock(locked){
    document.documentElement.classList.toggle('logo-editor-open',locked);
    document.body.classList.toggle('logo-editor-open',locked);
  }

  function openModal(){
    modal.hidden=false;
    setBodyLock(true);
    requestAnimationFrame(()=>modal.classList.add('visible'));
  }

  function closeModal({clearInput=false}={}){
    modal.classList.remove('visible');
    setBodyLock(false);
    setTimeout(()=>{modal.hidden=true;},180);
    if(clearInput)logoInput.value='';
  }

  function loadHtmlImage(file){
    return new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(file);
      const image=new Image();
      image.decoding='sync';
      image.onload=()=>resolve({image,url});
      image.onerror=()=>{
        URL.revokeObjectURL(url);
        reject(new Error('로고 이미지를 읽지 못했습니다.'));
      };
      image.src=url;
    });
  }

  function snapshot(){
    return {width:canvas.width,height:canvas.height,data:ctx.getImageData(0,0,canvas.width,canvas.height)};
  }

  function restoreSnapshot(item){
    canvas.width=item.width;
    canvas.height=item.height;
    overlay.width=item.width;
    overlay.height=item.height;
    ctx.putImageData(item.data,0,0);
    syncStageAspect();
    drawOverlay();
    analyzeCanvas(false);
  }

  function pushHistory(){
    state.history.push(snapshot());
    if(state.history.length>MAX_HISTORY)state.history.shift();
    state.future=[];
    updateHistoryButtons();
  }

  function updateHistoryButtons(){
    $('#logoUndo').disabled=state.history.length===0;
    $('#logoRedo').disabled=state.future.length===0;
  }

  function undo(){
    if(!state.history.length)return;
    state.future.push(snapshot());
    restoreSnapshot(state.history.pop());
    updateHistoryButtons();
  }

  function redo(){
    if(!state.future.length)return;
    state.history.push(snapshot());
    restoreSnapshot(state.future.pop());
    updateHistoryButtons();
  }

  function syncStageAspect(){
    stage.style.setProperty('--logo-aspect',`${canvas.width}/${canvas.height}`);
  }

  function getPixelStats(imageData){
    const data=imageData.data;
    let transparent=0;
    let semitransparent=0;
    let opaque=0;
    for(let index=3;index<data.length;index+=4){
      const alpha=data[index];
      if(alpha<8)transparent++;
      else if(alpha<247)semitransparent++;
      else opaque++;
    }
    const total=data.length/4;
    return {transparentRatio:transparent/total,semiRatio:semitransparent/total,opaqueRatio:opaque/total};
  }

  function isLightNeutral(data,index,threshold=165){
    const r=data[index];
    const g=data[index+1];
    const b=data[index+2];
    const a=data[index+3];
    if(a<16)return false;
    const max=Math.max(r,g,b);
    const min=Math.min(r,g,b);
    const luminance=r*.2126+g*.7152+b*.0722;
    return max-min<=36&&luminance>=threshold;
  }

  function borderBackgroundRatio(imageData,threshold=165){
    const {width,height,data}=imageData;
    let matches=0;
    let total=0;
    const sample=(x,y)=>{
      total++;
      if(isLightNeutral(data,(y*width+x)*4,threshold))matches++;
    };
    const step=Math.max(1,Math.round(Math.max(width,height)/300));
    for(let x=0;x<width;x+=step){sample(x,0);sample(x,height-1);}
    for(let y=step;y<height-step;y+=step){sample(0,y);sample(width-1,y);}
    return total?matches/total:0;
  }

  function analyzeCanvas(showMessage=true){
    const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
    const stats=getPixelStats(imageData);
    const borderRatio=borderBackgroundRatio(imageData,Number($('#autoThreshold').value));
    state.hasAlpha=stats.transparentRatio>0.001||stats.semiRatio>0.003;
    state.checkerCandidate=!state.hasAlpha&&borderRatio>.32;

    if(state.hasAlpha){
      alphaBadge.textContent='투명 영역 감지';
      alphaBadge.dataset.state='good';
      detection.innerHTML='<strong>실제 투명 영역이 확인되었습니다.</strong><span>필요한 경우 여백 정리나 원형 마스크를 추가로 적용할 수 있습니다.</span>';
      detection.dataset.state='good';
    }else if(state.checkerCandidate){
      alphaBadge.textContent='격자 배경 감지';
      alphaBadge.dataset.state='warn';
      detection.innerHTML='<strong>투명처럼 보이는 격자가 이미지 픽셀로 들어 있습니다.</strong><span>“자동 배경 제거”를 누르면 가장자리에서 연결된 격자 영역만 투명하게 바꿉니다.</span>';
      detection.dataset.state='warn';
    }else{
      alphaBadge.textContent='불투명 이미지';
      alphaBadge.dataset.state='neutral';
      detection.innerHTML='<strong>현재 이미지는 투명하지 않습니다.</strong><span>매직툴로 배경을 클릭하거나 원형 영역만 사용하세요.</span>';
      detection.dataset.state='neutral';
    }
    if(showMessage)drawOverlay();
  }

  async function prepareFile(file){
    state.file=file;
    state.sourceName=file.name||'logo.png';
    state.history=[];
    state.future=[];
    updateHistoryButtons();

    const {image,url}=await loadHtmlImage(file);
    try{
      const naturalWidth=image.naturalWidth||image.width;
      const naturalHeight=image.naturalHeight||image.height;
      const scale=Math.min(1,MAX_EDITOR_SIDE/Math.max(naturalWidth,naturalHeight));
      canvas.width=Math.max(1,Math.round(naturalWidth*scale));
      canvas.height=Math.max(1,Math.round(naturalHeight*scale));
      overlay.width=canvas.width;
      overlay.height=canvas.height;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(image,0,0,canvas.width,canvas.height);
      state.original=snapshot();
      state.circle={x:.5,y:.5,size:.92,feather:.02};
      syncCircleControls();
      syncStageAspect();
      setTool('magic');
      analyzeCanvas();
      drawOverlay();
      openModal();
    }finally{
      URL.revokeObjectURL(url);
    }
  }

  function colorDistance(r1,g1,b1,r2,g2,b2){
    const dr=r1-r2;
    const dg=g1-g2;
    const db=b1-b2;
    return Math.sqrt(dr*dr+dg*dg+db*db);
  }

  function softenRemovedBoundary(imageData,removed,width,height){
    const source=new Uint8Array(removed);
    const data=imageData.data;
    for(let y=1;y<height-1;y++){
      for(let x=1;x<width-1;x++){
        const position=y*width+x;
        if(source[position])continue;
        let neighbors=0;
        if(source[position-1])neighbors++;
        if(source[position+1])neighbors++;
        if(source[position-width])neighbors++;
        if(source[position+width])neighbors++;
        if(!neighbors)continue;
        const index=position*4;
        const luminance=(data[index]+data[index+1]+data[index+2])/3;
        const chroma=Math.max(data[index],data[index+1],data[index+2])-Math.min(data[index],data[index+1],data[index+2]);
        if(luminance>145&&chroma<45){
          data[index+3]=Math.min(data[index+3],Math.max(0,255-neighbors*58));
        }
      }
    }
  }

  function removeBorderBackground(){
    pushHistory();
    const threshold=Number($('#autoThreshold').value);
    const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
    const {data,width,height}=imageData;
    const total=width*height;
    const removed=new Uint8Array(total);
    const queue=new Int32Array(total);
    let head=0;
    let tail=0;

    const enqueue=(x,y)=>{
      if(x<0||y<0||x>=width||y>=height)return;
      const position=y*width+x;
      if(removed[position])return;
      if(!isLightNeutral(data,position*4,threshold))return;
      removed[position]=1;
      queue[tail++]=position;
    };

    for(let x=0;x<width;x++){enqueue(x,0);enqueue(x,height-1);}
    for(let y=1;y<height-1;y++){enqueue(0,y);enqueue(width-1,y);}

    while(head<tail){
      const position=queue[head++];
      const x=position%width;
      const y=(position/width)|0;
      enqueue(x-1,y);
      enqueue(x+1,y);
      enqueue(x,y-1);
      enqueue(x,y+1);
    }

    if(tail/total<.005){
      state.history.pop();
      updateHistoryButtons();
      toast('가장자리에서 제거할 밝은 배경을 찾지 못했습니다.',true);
      return;
    }

    for(let position=0;position<total;position++){
      if(removed[position])data[position*4+3]=0;
    }
    softenRemovedBoundary(imageData,removed,width,height);
    ctx.putImageData(imageData,0,0);
    analyzeCanvas();
    toast('격자 또는 밝은 배경을 실제 투명 영역으로 바꿨습니다.');
  }

  function magicEraseAt(x,y){
    const width=canvas.width;
    const height=canvas.height;
    x=Math.max(0,Math.min(width-1,Math.round(x)));
    y=Math.max(0,Math.min(height-1,Math.round(y)));
    pushHistory();

    const tolerance=Number($('#magicTolerance').value);
    const connected=$('#magicConnected').checked;
    const imageData=ctx.getImageData(0,0,width,height);
    const data=imageData.data;
    const seed=(y*width+x)*4;
    const sr=data[seed];
    const sg=data[seed+1];
    const sb=data[seed+2];
    const removed=new Uint8Array(width*height);

    const matches=position=>{
      const index=position*4;
      return data[index+3]>0&&colorDistance(sr,sg,sb,data[index],data[index+1],data[index+2])<=tolerance;
    };

    let count=0;
    if(connected){
      const visited=new Uint8Array(width*height);
      const queue=new Int32Array(width*height);
      let head=0;
      let tail=0;
      const start=y*width+x;
      queue[tail++]=start;
      visited[start]=1;
      while(head<tail){
        const position=queue[head++];
        if(!matches(position))continue;
        removed[position]=1;
        count++;
        const px=position%width;
        const py=(position/width)|0;
        const add=next=>{if(next<0||next>=visited.length||visited[next])return;visited[next]=1;queue[tail++]=next;};
        if(px>0)add(position-1);
        if(px<width-1)add(position+1);
        if(py>0)add(position-width);
        if(py<height-1)add(position+width);
      }
    }else{
      for(let position=0;position<width*height;position++){
        if(matches(position)){removed[position]=1;count++;}
      }
    }

    if(count<1){
      state.history.pop();
      updateHistoryButtons();
      return;
    }
    for(let position=0;position<removed.length;position++){
      if(removed[position])data[position*4+3]=0;
    }
    softenRemovedBoundary(imageData,removed,width,height);
    ctx.putImageData(imageData,0,0);
    analyzeCanvas();
  }

  function eraseStroke(from,to){
    const size=Number($('#eraserSize').value);
    ctx.save();
    ctx.globalCompositeOperation='destination-out';
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.lineWidth=size;
    ctx.beginPath();
    ctx.moveTo(from.x,from.y);
    ctx.lineTo(to.x,to.y);
    ctx.stroke();
    ctx.restore();
  }

  function applyCircleMask(){
    pushHistory();
    const width=canvas.width;
    const height=canvas.height;
    const cx=state.circle.x*width;
    const cy=state.circle.y*height;
    const radius=Math.min(width,height)*.5*state.circle.size;
    const feather=Math.max(0,radius*state.circle.feather);
    const imageData=ctx.getImageData(0,0,width,height);
    const data=imageData.data;

    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        const distance=Math.hypot(x+.5-cx,y+.5-cy);
        const index=(y*width+x)*4+3;
        if(distance>=radius){
          data[index]=0;
        }else if(feather>0&&distance>radius-feather){
          const factor=(radius-distance)/feather;
          data[index]=Math.round(data[index]*Math.max(0,Math.min(1,factor)));
        }
      }
    }
    ctx.putImageData(imageData,0,0);
    analyzeCanvas();
    toast('원 바깥 영역을 투명하게 처리했습니다.');
  }

  function getTransparentBounds(sourceCanvas=canvas){
    const sourceCtx=sourceCanvas.getContext('2d',{willReadFrequently:true});
    const {width,height}=sourceCanvas;
    const data=sourceCtx.getImageData(0,0,width,height).data;
    let minX=width;
    let minY=height;
    let maxX=-1;
    let maxY=-1;
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        if(data[(y*width+x)*4+3]>6){
          if(x<minX)minX=x;
          if(y<minY)minY=y;
          if(x>maxX)maxX=x;
          if(y>maxY)maxY=y;
        }
      }
    }
    return maxX<minX?null:{minX,minY,maxX,maxY};
  }

  function createTrimmedCanvas(sourceCanvas=canvas,paddingRatio=.025){
    const bounds=getTransparentBounds(sourceCanvas);
    if(!bounds)return null;
    const boxWidth=bounds.maxX-bounds.minX+1;
    const boxHeight=bounds.maxY-bounds.minY+1;
    const padding=Math.max(2,Math.round(Math.max(boxWidth,boxHeight)*paddingRatio));
    const sx=Math.max(0,bounds.minX-padding);
    const sy=Math.max(0,bounds.minY-padding);
    const sw=Math.min(sourceCanvas.width-sx,boxWidth+padding*2);
    const sh=Math.min(sourceCanvas.height-sy,boxHeight+padding*2);
    const output=document.createElement('canvas');
    output.width=sw;
    output.height=sh;
    output.getContext('2d').drawImage(sourceCanvas,sx,sy,sw,sh,0,0,sw,sh);
    return output;
  }

  function trimTransparentMargins(){
    const trimmed=createTrimmedCanvas();
    if(!trimmed){toast('남아 있는 로고 영역을 찾지 못했습니다.',true);return;}
    if(trimmed.width===canvas.width&&trimmed.height===canvas.height){toast('정리할 투명 여백이 없습니다.');return;}
    pushHistory();
    canvas.width=trimmed.width;
    canvas.height=trimmed.height;
    overlay.width=trimmed.width;
    overlay.height=trimmed.height;
    ctx.drawImage(trimmed,0,0);
    syncStageAspect();
    drawOverlay();
    analyzeCanvas();
    toast('투명 여백을 로고 외곽에 맞춰 정리했습니다.');
  }

  function restoreOriginal(){
    if(!state.original)return;
    pushHistory();
    restoreSnapshot(state.original);
    toast('업로드한 원본 상태로 복원했습니다.');
  }

  function setTool(tool){
    state.tool=tool;
    $$('[data-logo-tool]').forEach(button=>button.classList.toggle('active',button.dataset.logoTool===tool));
    $$('[data-tool-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.toolPanel===tool));
    cursorHint.textContent=tool==='magic'?'지울 배경을 클릭하세요.':tool==='eraser'?'지울 부분을 문질러 주세요.':'원을 드래그해 중심을 이동하고 크기를 조정하세요.';
    stage.dataset.tool=tool;
    drawOverlay();
  }

  function syncCircleControls(){
    $('#circleSize').value=Math.round(state.circle.size*100);
    $('#circleX').value=Math.round(state.circle.x*100);
    $('#circleY').value=Math.round(state.circle.y*100);
    $('#circleFeather').value=Math.round(state.circle.feather*100);
    updateOutputs();
  }

  function readCircleControls(){
    state.circle.size=Number($('#circleSize').value)/100;
    state.circle.x=Number($('#circleX').value)/100;
    state.circle.y=Number($('#circleY').value)/100;
    state.circle.feather=Number($('#circleFeather').value)/100;
    drawOverlay();
  }

  function drawOverlay(){
    overlayCtx.clearRect(0,0,overlay.width,overlay.height);
    if(state.tool==='circle'){
      const cx=state.circle.x*overlay.width;
      const cy=state.circle.y*overlay.height;
      const radius=Math.min(overlay.width,overlay.height)*.5*state.circle.size;
      overlayCtx.save();
      overlayCtx.fillStyle='rgba(10,15,20,.42)';
      overlayCtx.beginPath();
      overlayCtx.rect(0,0,overlay.width,overlay.height);
      overlayCtx.arc(cx,cy,radius,0,Math.PI*2,true);
      overlayCtx.fill('evenodd');
      overlayCtx.strokeStyle='#c9ff48';
      overlayCtx.lineWidth=Math.max(2,overlay.width/350);
      overlayCtx.setLineDash([Math.max(7,overlay.width/90),Math.max(5,overlay.width/120)]);
      overlayCtx.beginPath();
      overlayCtx.arc(cx,cy,radius,0,Math.PI*2);
      overlayCtx.stroke();
      overlayCtx.setLineDash([]);
      overlayCtx.fillStyle='#c9ff48';
      overlayCtx.beginPath();
      overlayCtx.arc(cx,cy,Math.max(5,overlay.width/100),0,Math.PI*2);
      overlayCtx.fill();
      overlayCtx.restore();
    }else if(state.tool==='eraser'&&state.lastPoint){
      const radius=Number($('#eraserSize').value)/2;
      overlayCtx.save();
      overlayCtx.strokeStyle='#c9ff48';
      overlayCtx.lineWidth=Math.max(2,overlay.width/500);
      overlayCtx.beginPath();
      overlayCtx.arc(state.lastPoint.x,state.lastPoint.y,radius,0,Math.PI*2);
      overlayCtx.stroke();
      overlayCtx.restore();
    }
  }

  function pointerToCanvas(event){
    const rect=overlay.getBoundingClientRect();
    return {
      x:(event.clientX-rect.left)*(overlay.width/rect.width),
      y:(event.clientY-rect.top)*(overlay.height/rect.height)
    };
  }

  function updateOutputs(){
    $('#autoThresholdOutput').textContent=$('#autoThreshold').value;
    $('#magicToleranceOutput').textContent=$('#magicTolerance').value;
    $('#eraserSizeOutput').textContent=$('#eraserSize').value;
    $('#circleSizeOutput').textContent=`${$('#circleSize').value}%`;
    $('#circleXOutput').textContent=`${$('#circleX').value}%`;
    $('#circleYOutput').textContent=`${$('#circleY').value}%`;
    $('#circleFeatherOutput').textContent=`${$('#circleFeather').value}%`;
  }

  function useFileInMainEditor(file,message){
    const transfer=new DataTransfer();
    transfer.items.add(file);
    state.bypass=true;
    logoInput.files=transfer.files;
    logoInput.dispatchEvent(new Event('change',{bubbles:true}));
    state.lastAppliedFile=file;
    editButton.disabled=false;
    closeModal();
    toast(message);
  }

  function canvasToPngFile(sourceCanvas,name){
    return new Promise((resolve,reject)=>{
      sourceCanvas.toBlob(blob=>{
        if(!blob){reject(new Error('투명 PNG 파일을 만들지 못했습니다.'));return;}
        resolve(new File([blob],name,{type:'image/png',lastModified:Date.now()}));
      },'image/png');
    });
  }

  async function applyEdited(){
    try{
      let output=canvas;
      if($('#logoAutoTrim').checked){
        const trimmed=createTrimmedCanvas(canvas,.025);
        if(trimmed)output=trimmed;
      }
      const base=state.sourceName.replace(/\.[^.]+$/,'')||'logo';
      const file=await canvasToPngFile(output,`${base}-transparent.png`);
      useFileInMainEditor(file,'편집한 투명 PNG 로고를 바닥 패치에 적용했습니다.');
    }catch(error){
      console.error(error);
      toast(error.message||'로고 적용 중 오류가 발생했습니다.',true);
    }
  }

  function useOriginal(){
    if(!state.file)return;
    useFileInMainEditor(state.file,'원본 로고를 그대로 적용했습니다.');
  }

  logoInput.addEventListener('change',async event=>{
    if(state.bypass){state.bypass=false;return;}
    const file=logoInput.files?.[0];
    if(!file)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    try{
      await prepareFile(file);
    }catch(error){
      console.error(error);
      toast(error.message||'로고 편집기를 열지 못했습니다.',true);
      logoInput.value='';
    }
  },true);

  editButton.addEventListener('click',async()=>{
    if(!state.lastAppliedFile)return;
    try{await prepareFile(state.lastAppliedFile);}catch(error){toast(error.message,true);}
  });

  const removeLogo=document.querySelector('#removeLogoBtn');
  removeLogo?.addEventListener('click',()=>{
    state.lastAppliedFile=null;
    editButton.disabled=true;
  });

  $$('[data-logo-close]').forEach(button=>button.addEventListener('click',()=>closeModal({clearInput:true})));
  $('#logoAutoRemove').addEventListener('click',removeBorderBackground);
  $('#logoCircleQuick').addEventListener('click',()=>{state.circle={x:.5,y:.5,size:.92,feather:.02};syncCircleControls();setTool('circle');applyCircleMask();});
  $('#logoTrimTransparent').addEventListener('click',trimTransparentMargins);
  $('#logoRestoreOriginal').addEventListener('click',restoreOriginal);
  $('#logoApplyCircle').addEventListener('click',applyCircleMask);
  $('#logoUndo').addEventListener('click',undo);
  $('#logoRedo').addEventListener('click',redo);
  $('#logoApplyEdited').addEventListener('click',applyEdited);
  $('#logoUseOriginal').addEventListener('click',useOriginal);

  $$('[data-logo-tool]').forEach(button=>button.addEventListener('click',()=>setTool(button.dataset.logoTool)));
  $$('.logo-edit-bg-tabs [data-preview-bg]').forEach(button=>button.addEventListener('click',()=>{
    stage.dataset.previewBg=button.dataset.previewBg;
    $$('.logo-edit-bg-tabs [data-preview-bg]').forEach(item=>item.classList.toggle('active',item===button));
  }));

  ['autoThreshold','magicTolerance','eraserSize','circleSize','circleX','circleY','circleFeather'].forEach(id=>{
    const control=$(`#${id}`);
    control.addEventListener('input',()=>{
      updateOutputs();
      if(id.startsWith('circle'))readCircleControls();
      if(id==='eraserSize')drawOverlay();
      if(id==='autoThreshold')analyzeCanvas(false);
    });
  });

  overlay.addEventListener('pointerdown',event=>{
    event.preventDefault();
    overlay.setPointerCapture?.(event.pointerId);
    const point=pointerToCanvas(event);
    state.pointerDown=true;
    state.lastPoint=point;
    if(state.tool==='magic'){
      magicEraseAt(point.x,point.y);
      state.pointerDown=false;
    }else if(state.tool==='eraser'){
      pushHistory();
      state.eraserActive=true;
      eraseStroke(point,point);
      drawOverlay();
    }else if(state.tool==='circle'){
      state.circleDragging=true;
      state.circle.x=Math.max(0,Math.min(1,point.x/overlay.width));
      state.circle.y=Math.max(0,Math.min(1,point.y/overlay.height));
      syncCircleControls();
      drawOverlay();
    }
  });

  overlay.addEventListener('pointermove',event=>{
    const point=pointerToCanvas(event);
    if(state.tool==='eraser'){
      state.lastPoint=point;
      if(state.pointerDown&&state.eraserActive){
        eraseStroke(state.lastPointPrevious||point,point);
        state.lastPointPrevious=point;
      }
      drawOverlay();
    }else if(state.tool==='circle'&&state.pointerDown&&state.circleDragging){
      state.circle.x=Math.max(0,Math.min(1,point.x/overlay.width));
      state.circle.y=Math.max(0,Math.min(1,point.y/overlay.height));
      syncCircleControls();
      drawOverlay();
    }
  });

  const endPointer=()=>{
    if(state.eraserActive)analyzeCanvas();
    state.pointerDown=false;
    state.eraserActive=false;
    state.circleDragging=false;
    state.lastPointPrevious=null;
  };
  overlay.addEventListener('pointerup',endPointer);
  overlay.addEventListener('pointercancel',endPointer);
  overlay.addEventListener('pointerleave',event=>{if(!state.pointerDown&&state.tool==='eraser'){state.lastPoint=null;drawOverlay();}});

  window.addEventListener('keydown',event=>{
    if(modal.hidden)return;
    if(event.key==='Escape'){event.preventDefault();closeModal({clearInput:true});}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){
      event.preventDefault();
      event.shiftKey?redo():undo();
    }
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){
      event.preventDefault();
      redo();
    }
  });

  updateOutputs();
})();