(()=>{
  const path=(location.pathname.split('/').pop()||'').toLowerCase();
  if(path!=='lavaspin.html'||window.__lavaspinStudio)return;
  window.__lavaspinStudio=true;

  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/lavaspin-studio.css?v=20260712a';
  document.head.append(css);

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const state={mode:'photo',frames:[],index:0,playTimer:null,videoUrl:null,stream:null,autoTimer:null,capturing:false};
  const collator=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});

  const toast=(message)=>{
    const el=$('#lssToast');
    if(!el)return;
    el.textContent=message;
    el.classList.add('show');
    clearTimeout(window.__lssToastTimer);
    window.__lssToastTimer=setTimeout(()=>el.classList.remove('show'),1900);
  };
  const setStatus=(message)=>{const el=$('#lssStatus');if(el)el.textContent=message||'';};
  const setProgress=(value)=>{const bar=$('#lssProgressBar');if(bar)bar.style.width=`${Math.max(0,Math.min(100,value))}%`;};
  const formatBytes=(bytes)=>bytes<1024*1024?`${Math.max(1,Math.round(bytes/1024))}KB`:`${(bytes/1024/1024).toFixed(1)}MB`;
  const downloadBlob=(blob,name)=>{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);};
  const blobToDataURL=(blob)=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
  const canvasToBlob=(canvas,type='image/jpeg',quality=.9)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('이미지 변환에 실패했습니다.')),type,quality));
  const imageSize=(url)=>new Promise((resolve)=>{const img=new Image();img.onload=()=>resolve({width:img.naturalWidth,height:img.naturalHeight});img.onerror=()=>resolve({width:0,height:0});img.src=url;});

  function stopPlayback(){
    clearInterval(state.playTimer);state.playTimer=null;
    $('#lssPlay')?.classList.remove('active');
    if($('#lssPlay'))$('#lssPlay').textContent='자동 회전';
  }
  function cleanupFrames(){
    stopPlayback();
    state.frames.forEach(frame=>URL.revokeObjectURL(frame.url));
    state.frames=[];state.index=0;
  }
  function createFrame(blob,name,meta={}){return {blob,name,url:URL.createObjectURL(blob),...meta};}
  function updateMetrics(){
    const count=state.frames.length;
    const first=state.frames[0];
    const bytes=state.frames.reduce((sum,f)=>sum+(f.blob?.size||0),0);
    if($('#lssMetricFrames'))$('#lssMetricFrames').textContent=String(count);
    if($('#lssMetricSize'))$('#lssMetricSize').textContent=first?.width&&first?.height?`${first.width}×${first.height}`:'-';
    if($('#lssMetricBytes'))$('#lssMetricBytes').textContent=count?formatBytes(bytes):'-';
    if($('#lssFrameBadge'))$('#lssFrameBadge').textContent=count?`${count} FRAMES`:'NO FRAMES';
  }
  function showFrame(index=state.index){
    const count=state.frames.length,stage=$('#lssStage'),img=$('#lssFrame'),range=$('#lssRange');
    if(!stage||!img||!range)return;
    if(!count){stage.classList.remove('has-frame');img.removeAttribute('src');range.max=0;range.value=0;$('#lssFrameText').textContent='0 / 0';$('#lssFrameName').textContent='업로드 대기';updateMetrics();return;}
    state.index=(index%count+count)%count;
    const frame=state.frames[state.index];
    stage.classList.add('has-frame');img.src=frame.url;img.alt=`360 프레임 ${state.index+1}`;
    range.max=Math.max(0,count-1);range.value=state.index;
    $('#lssFrameText').textContent=`${state.index+1} / ${count}`;
    $('#lssFrameName').textContent=frame.name;
    $$('.lss-thumb').forEach((thumb,i)=>thumb.classList.toggle('active',i===state.index));
    updateMetrics();
  }
  function renderThumbs(){
    const box=$('#lssThumbs');if(!box)return;
    box.innerHTML=state.frames.map((frame,i)=>`<button class="lss-thumb ${i===state.index?'active':''}" type="button" data-frame="${i}" title="${frame.name}"><img src="${frame.url}" alt="프레임 ${i+1}"><span>${i+1}</span></button>`).join('');
    $$('[data-frame]',box).forEach(button=>button.onclick=()=>showFrame(+button.dataset.frame));
  }
  function replaceFrames(frames,message){
    cleanupFrames();state.frames=frames;state.index=0;renderThumbs();showFrame(0);setProgress(100);setStatus(message||`${frames.length}개 프레임을 불러왔습니다.`);
  }
  function appendFrame(frame){state.frames.push(frame);state.index=state.frames.length-1;renderThumbs();showFrame(state.index);}

  function switchMode(mode,scroll=false){
    state.mode=mode;
    $$('[data-lss-mode]').forEach(button=>button.classList.toggle('active',button.dataset.lssMode===mode));
    $$('[data-lss-pane]').forEach(pane=>pane.classList.toggle('active',pane.dataset.lssPane===mode));
    if(scroll)$('#lavaspin-studio')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function improveExistingCopy(){
    const status=$('.ls-status');if(status)status.textContent='브라우저 체험 가능 · BETA';
    const lead=$('.ls-hero-lead');if(lead)lead.textContent='사진 시퀀스를 올리거나 회전 영상에서 프레임을 추출해, 마우스와 손가락으로 돌려보는 360° 상품 뷰를 브라우저에서 직접 만들 수 있습니다.';
    const primary=$('.ls-hero .hero-actions .button-primary');if(primary){primary.textContent='지금 직접 만들기';primary.href='#lavaspin-studio';}
    const mockText=$('.ls-upload p');if(mockText)mockText.textContent='JPG · PNG · WebP · MP4 / 아래 스튜디오에서 실제 체험';
    const badge=$('.ls-window-badge');if(badge)badge.textContent='LIVE DEMO';
    const meta=$$('.ls-hero-meta span');
    ['사진 다중 업로드','영상 프레임 추출','카메라 단계 촬영','HTML · ZIP 저장'].forEach((text,i)=>{if(meta[i])meta[i].textContent=text;});

    const cards=$$('.ls-input-grid .ls-card');
    const configs=[
      {mode:'photo',status:'현재 사용 가능',action:'사진으로 만들기 →',paragraph:'회전판을 일정 각도로 돌리며 촬영한 사진을 순서대로 올리고, 썸네일에서 누락·흔들린 프레임을 확인합니다.'},
      {mode:'video',status:'현재 사용 가능',action:'영상에서 추출하기 →',paragraph:'제품이 한 바퀴 도는 영상을 올리면 브라우저에서 24·36·48·72장의 프레임을 균일한 간격으로 추출합니다.'},
      {mode:'camera',status:'카메라 촬영 지원',action:'단계 촬영 시작하기 →',paragraph:'카메라를 켜고 각도별로 수동 또는 일정 간격 촬영합니다. 특정 스마트 회전판 모터 제어는 장치 통신 규격 연동이 필요합니다.'}
    ];
    cards.slice(0,3).forEach((card,i)=>{
      const config=configs[i];if(!config)return;
      const p=$('p',card);if(p)p.textContent=config.paragraph;
      card.insertAdjacentHTML('beforeend',`<span class="lss-card-status">${config.status}</span><a class="lss-card-action" href="#lavaspin-studio" data-card-mode="${config.mode}">${config.action}</a>`);
    });
    $$('[data-card-mode]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();switchMode(link.dataset.cardMode,true);}));

    const workflow=$$('.section-dark').find(section=>section.textContent.includes('AUTOMATED WORKFLOW'));
    if(workflow){
      const title=$('.section-head h2',workflow);if(title)title.innerHTML='업로드부터 결과 저장까지<br>브라우저에서 직접 처리합니다.';
      const items=$$('.ls-flow article',workflow);
      const flow=[['01 · UPLOAD','자료 업로드','사진 묶음, 회전 영상 또는 카메라 촬영을 선택합니다.'],['02 · CHECK','프레임 확인','사진 순서와 썸네일을 확인하고 불필요한 프레임을 삭제합니다.'],['03 · EXTRACT','프레임 추출','영상은 선택한 개수만큼 균일한 간격으로 이미지로 변환합니다.'],['04 · PREVIEW','360° 미리보기','마우스·터치 드래그와 자동 재생으로 회전 결과를 확인합니다.'],['05 · EXPORT','결과 저장','독립 실행 HTML, 이미지 ZIP과 삽입 코드 형태로 내보냅니다.']];
      items.forEach((item,i)=>{if(!flow[i])return;const [s,h,p]=flow[i];$('span',item).textContent=s;$('h3',item).textContent=h;$('p',item).textContent=p;});
    }
  }

  function buildStudio(){
    const host=$('.ls-input-grid')?.closest('section');if(!host)return;
    const section=document.createElement('section');
    section.id='lavaspin-studio';section.className='lss-section';
    section.innerHTML=`<div class="container">
      <div class="lss-head"><div><span class="eyebrow">LIVE BROWSER STUDIO</span><h2>파일을 올리고<br>지금 바로 돌려보세요.</h2><p>설치 없이 사진·영상·카메라 입력을 회전 프레임으로 만들고 결과를 내려받습니다.</p></div><div class="lss-privacy"><strong>로컬 처리</strong><br>업로드한 사진과 영상은 별도 서버로 전송하지 않고 현재 브라우저 메모리에서만 처리합니다. 새로고침하면 작업 내용이 사라집니다.</div></div>
      <div class="lss-modes" role="tablist">
        <button class="lss-mode active" type="button" data-lss-mode="photo"><b>01</b><span><strong>연속 사진</strong><span>여러 장 업로드·순서 확인</span></span></button>
        <button class="lss-mode" type="button" data-lss-mode="video"><b>02</b><span><strong>회전 영상</strong><span>균일 간격 프레임 추출</span></span></button>
        <button class="lss-mode" type="button" data-lss-mode="camera"><b>03</b><span><strong>카메라 단계 촬영</strong><span>각도별 수동·간격 촬영</span></span></button>
      </div>
      <div class="lss-shell">
        <div class="lss-panel">
          <section class="lss-pane active" data-lss-pane="photo">
            <div class="lss-pane-head"><div><h3>연속 사진 업로드</h3><p>파일명 순서대로 정렬합니다. 촬영 파일은 001, 002, 003처럼 번호를 붙이면 가장 안정적입니다.</p></div><span class="lss-chip">JPG · PNG · WEBP</span></div>
            <label class="lss-drop" id="lssPhotoDrop"><input class="lss-file" id="lssPhotoInput" type="file" accept="image/jpeg,image/png,image/webp" multiple><span><span class="lss-drop-icon">↑</span><h4>사진 묶음을 선택하거나 끌어놓으세요</h4><p>2장 이상부터 작동 · 24~72장 권장</p><small>파일명 기준 자연 정렬 후 썸네일에서 개별 확인</small></span></label>
            <div class="lss-toolbar"><button class="lss-button" id="lssPhotoChoose" type="button">사진 선택</button><button class="lss-button" id="lssReverse" type="button" disabled>순서 뒤집기</button><button class="lss-button danger" id="lssRemove" type="button" disabled>현재 프레임 삭제</button><button class="lss-button danger" id="lssClear" type="button" disabled>전체 비우기</button></div>
          </section>
          <section class="lss-pane" data-lss-pane="video">
            <div class="lss-pane-head"><div><h3>회전 영상 프레임 추출</h3><p>영상 전체 길이를 균등하게 나누어 선택한 수만큼 JPG 프레임을 생성합니다.</p></div><span class="lss-chip">MP4 · WEBM · MOV*</span></div>
            <label class="lss-drop" id="lssVideoDrop"><input class="lss-file" id="lssVideoInput" type="file" accept="video/*"><span><span class="lss-drop-icon">▶</span><h4>한 바퀴 회전 영상을 선택하세요</h4><p>제품과 카메라 위치가 고정된 영상 권장</p><small>* MOV 재생 여부는 브라우저 코덱 지원에 따라 다릅니다.</small></span></label>
            <div class="lss-video-wrap" id="lssVideoWrap" hidden><video id="lssVideo" controls playsinline preload="metadata"></video></div>
            <div class="lss-toolbar"><select class="lss-select" id="lssVideoCount" aria-label="추출 프레임 수"><option value="24">24컷</option><option value="36" selected>36컷</option><option value="48">48컷</option><option value="72">72컷</option></select><button class="lss-button primary" id="lssExtract" type="button" disabled>프레임 추출 시작</button></div>
          </section>
          <section class="lss-pane" data-lss-pane="camera">
            <div class="lss-pane-head"><div><h3>카메라 단계 촬영</h3><p>카메라를 고정하고 회전판을 일정 각도로 돌리면서 한 장씩 촬영하거나 설정한 간격으로 연속 촬영합니다.</p></div><span class="lss-chip warn">모터 제어는 장치 연동 필요</span></div>
            <div class="lss-camera-wrap"><video id="lssCamera" autoplay muted playsinline></video><div class="lss-camera-overlay"></div><span class="lss-angle" id="lssAngle">카메라 대기</span></div>
            <div class="lss-toolbar"><select class="lss-select" id="lssCameraCount"><option value="24">24컷 · 15°</option><option value="36" selected>36컷 · 10°</option><option value="48">48컷 · 7.5°</option><option value="72">72컷 · 5°</option></select><select class="lss-select" id="lssInterval"><option value="2">2초 간격</option><option value="3" selected>3초 간격</option><option value="5">5초 간격</option></select><button class="lss-button" id="lssCameraStart" type="button">카메라 켜기</button><button class="lss-button" id="lssCapture" type="button" disabled>한 장 촬영</button><button class="lss-button lime" id="lssAutoCapture" type="button" disabled>간격 촬영 시작</button><button class="lss-button danger" id="lssCameraStop" type="button" disabled>카메라 종료</button></div>
            <div class="lss-hardware-note"><strong>스마트 회전판 연동 범위</strong><br>현재 페이지는 실제 카메라 촬영과 각도 진행을 지원합니다. 회전판의 자동 정지·회전 명령은 제품별 Bluetooth·USB 통신 규격이 필요하므로, 지원 장치가 정해지면 해당 프로토콜에 맞춰 연결해야 합니다.</div>
          </section>
          <div class="lss-progress"><i id="lssProgressBar"></i></div><div class="lss-status" id="lssStatus">입력 방식을 선택하고 파일을 올려주세요.</div><div class="lss-thumbs" id="lssThumbs"></div>
        </div>
        <aside class="lss-view">
          <div class="lss-view-head"><h3>360° 결과 미리보기</h3><span id="lssFrameBadge">NO FRAMES</span></div>
          <div class="lss-stage" id="lssStage" tabindex="0"><div class="lss-placeholder"><b>360°</b><span>프레임을 불러오면 여기에 표시됩니다.</span></div><img id="lssFrame" alt=""><span class="lss-drag-hint">↔ 드래그하여 회전</span></div>
          <div class="lss-view-meta"><span id="lssFrameText">0 / 0</span><span id="lssFrameName">업로드 대기</span></div>
          <input class="lss-range" id="lssRange" type="range" min="0" max="0" value="0" aria-label="프레임 이동">
          <div class="lss-controls"><button id="lssPrev" type="button">이전</button><button id="lssPlay" type="button">자동 회전</button><button id="lssNext" type="button">다음</button><button id="lssDirection" type="button">방향 반전</button></div>
          <div class="lss-metrics"><div class="lss-metric"><b id="lssMetricFrames">0</b><span>프레임</span></div><div class="lss-metric"><b id="lssMetricSize">-</b><span>기준 해상도</span></div><div class="lss-metric"><b id="lssMetricBytes">-</b><span>메모리 파일 크기</span></div></div>
          <div class="lss-output"><button class="primary" id="lssExportHtml" type="button" disabled>독립 뷰어 HTML</button><button id="lssExportZip" type="button" disabled>프레임 ZIP</button><button id="lssDownloadFrame" type="button" disabled>현재 프레임 저장</button><button id="lssCopyEmbed" type="button" disabled>삽입 코드 복사</button></div>
          <p class="lss-empty-note">공유 URL 발급과 클라우드 저장은 서버·회원 기능이 필요한 별도 범위입니다. 현재 체험판은 파일을 서버에 올리지 않고 HTML·ZIP 결과를 직접 내려받습니다.</p>
        </aside>
      </div>
    </div>`;
    host.insertAdjacentElement('afterend',section);
    const toastEl=document.createElement('div');toastEl.id='lssToast';toastEl.className='lss-toast';toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite');document.body.append(toastEl);
  }

  async function loadPhotoFiles(fileList){
    const files=[...fileList].filter(file=>file.type.startsWith('image/')).sort((a,b)=>collator.compare(a.name,b.name));
    if(files.length<2){toast('이미지를 2장 이상 선택해 주세요.');return;}
    setStatus(`${files.length}개 사진을 읽는 중입니다.`);setProgress(5);
    const frames=[];
    for(let i=0;i<files.length;i++){
      const file=files[i],url=URL.createObjectURL(file),size=await imageSize(url);URL.revokeObjectURL(url);
      frames.push(createFrame(file,file.name,size));setProgress(((i+1)/files.length)*90);
    }
    replaceFrames(frames,`${frames.length}개 사진을 파일명 순서로 불러왔습니다.${frames.length<24?' 24장 이상이면 더 부드럽습니다.':''}`);
    enableFrameActions();
  }

  function waitVideoMetadata(video){return new Promise((resolve,reject)=>{if(video.readyState>=1&&Number.isFinite(video.duration))return resolve();const ok=()=>{cleanup();resolve();},bad=()=>{cleanup();reject(new Error('영상을 읽지 못했습니다. 다른 MP4 파일을 사용해 주세요.'));},cleanup=()=>{video.removeEventListener('loadedmetadata',ok);video.removeEventListener('error',bad);};video.addEventListener('loadedmetadata',ok);video.addEventListener('error',bad);});}
  function seekVideo(video,time){return new Promise((resolve,reject)=>{const target=Math.max(0,Math.min(time,Math.max(0,video.duration-.04)));if(Math.abs(video.currentTime-target)<.015)return resolve();let timer;const done=()=>{clearTimeout(timer);video.removeEventListener('seeked',done);resolve();};video.addEventListener('seeked',done,{once:true});timer=setTimeout(()=>{video.removeEventListener('seeked',done);reject(new Error('영상 프레임 이동 시간이 초과됐습니다.'));},6000);video.currentTime=target;});}
  function canvasSize(width,height,max=1400){const ratio=Math.min(1,max/Math.max(width,height));return {width:Math.max(1,Math.round(width*ratio)),height:Math.max(1,Math.round(height*ratio))};}

  async function extractVideoFrames(){
    const video=$('#lssVideo'),button=$('#lssExtract'),count=+$('#lssVideoCount').value;
    if(!video.src)return;
    button.disabled=true;setStatus(`영상에서 ${count}개 프레임을 추출합니다. 브라우저를 닫지 마세요.`);setProgress(0);stopPlayback();
    try{
      await waitVideoMetadata(video);video.pause();
      if(!Number.isFinite(video.duration)||video.duration<=0)throw new Error('영상 길이를 확인하지 못했습니다.');
      const size=canvasSize(video.videoWidth,video.videoHeight),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});canvas.width=size.width;canvas.height=size.height;
      const frames=[];
      for(let i=0;i<count;i++){
        await seekVideo(video,(video.duration*i)/count);
        ctx.drawImage(video,0,0,size.width,size.height);
        const blob=await canvasToBlob(canvas,'image/jpeg',.9);
        frames.push(createFrame(blob,`video-frame-${String(i+1).padStart(3,'0')}.jpg`,size));
        setProgress(((i+1)/count)*100);setStatus(`${i+1} / ${count} 프레임 추출 중`);
      }
      replaceFrames(frames,`${count}개 영상 프레임 추출이 완료됐습니다.`);enableFrameActions();toast('영상 프레임 추출이 완료됐습니다.');
    }catch(error){setStatus(`추출 실패: ${error.message}`);toast(error.message);}finally{button.disabled=false;}
  }

  async function startCamera(){
    if(!navigator.mediaDevices?.getUserMedia){toast('이 브라우저는 카메라 촬영을 지원하지 않습니다.');return;}
    try{
      stopCamera();
      state.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});
      const video=$('#lssCamera');video.srcObject=state.stream;await video.play();
      $('#lssCameraStart').disabled=true;$('#lssCapture').disabled=false;$('#lssAutoCapture').disabled=false;$('#lssCameraStop').disabled=false;$('#lssAngle').textContent='0° · 촬영 준비';setStatus('카메라가 켜졌습니다. 제품과 카메라 위치를 고정하세요.');
    }catch(error){toast('카메라 권한을 확인해 주세요.');setStatus(`카메라 시작 실패: ${error.message}`);}
  }
  function stopCamera(){
    clearInterval(state.autoTimer);state.autoTimer=null;state.capturing=false;
    state.stream?.getTracks().forEach(track=>track.stop());state.stream=null;
    const video=$('#lssCamera');if(video)video.srcObject=null;
    if($('#lssCameraStart'))$('#lssCameraStart').disabled=false;if($('#lssCapture'))$('#lssCapture').disabled=true;if($('#lssAutoCapture')){$('#lssAutoCapture').disabled=true;$('#lssAutoCapture').textContent='간격 촬영 시작';}if($('#lssCameraStop'))$('#lssCameraStop').disabled=true;
  }
  async function captureCameraFrame(){
    const video=$('#lssCamera');if(!state.stream||video.readyState<2)throw new Error('카메라 화면이 준비되지 않았습니다.');
    const size=canvasSize(video.videoWidth,video.videoHeight),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});canvas.width=size.width;canvas.height=size.height;ctx.drawImage(video,0,0,size.width,size.height);
    const blob=await canvasToBlob(canvas,'image/jpeg',.92),index=state.frames.length+1;
    appendFrame(createFrame(blob,`camera-frame-${String(index).padStart(3,'0')}.jpg`,size));enableFrameActions();return index;
  }
  async function autoCapture(){
    if(state.capturing){clearInterval(state.autoTimer);state.autoTimer=null;state.capturing=false;$('#lssAutoCapture').textContent='간격 촬영 시작';setStatus('간격 촬영을 일시 중지했습니다.');return;}
    if(!state.stream){await startCamera();if(!state.stream)return;}
    const target=+$('#lssCameraCount').value,seconds=+$('#lssInterval').value;
    if(state.frames.length&& !confirm('현재 프레임을 비우고 새 간격 촬영을 시작할까요?'))return;
    cleanupFrames();renderThumbs();showFrame();enableFrameActions();
    state.capturing=true;$('#lssAutoCapture').textContent='간격 촬영 중지';
    const take=async()=>{
      if(!state.capturing)return;
      try{
        const current=await captureCameraFrame(),angle=Math.round(((current-1)/target)*3600)/10;
        $('#lssAngle').textContent=`${angle}° · ${current}/${target}`;setProgress((current/target)*100);setStatus(`${current}/${target} 촬영 완료 · 회전판을 다음 각도로 이동하세요.`);
        if(current>=target){clearInterval(state.autoTimer);state.autoTimer=null;state.capturing=false;$('#lssAutoCapture').textContent='간격 촬영 시작';$('#lssAngle').textContent='360° · 촬영 완료';toast(`${target}컷 촬영이 완료됐습니다.`);}
      }catch(error){clearInterval(state.autoTimer);state.capturing=false;$('#lssAutoCapture').textContent='간격 촬영 시작';toast(error.message);}
    };
    await take();if(state.capturing)state.autoTimer=setInterval(take,seconds*1000);
  }

  function enableFrameActions(){
    const has=state.frames.length>0;
    ['#lssReverse','#lssRemove','#lssClear','#lssExportHtml','#lssExportZip','#lssDownloadFrame','#lssCopyEmbed'].forEach(selector=>{const el=$(selector);if(el)el.disabled=!has;});
  }
  function removeCurrent(){
    if(!state.frames.length)return;
    const [frame]=state.frames.splice(state.index,1);URL.revokeObjectURL(frame.url);state.index=Math.min(state.index,state.frames.length-1);renderThumbs();showFrame();enableFrameActions();setStatus(`${state.frames.length}개 프레임이 남았습니다.`);
  }
  function clearAll(){if(!state.frames.length||confirm('현재 프레임을 모두 비울까요?')){cleanupFrames();renderThumbs();showFrame();enableFrameActions();setProgress(0);setStatus('프레임을 비웠습니다.');}}
  function reverseFrames(){state.frames.reverse();state.index=state.frames.length-1-state.index;renderThumbs();showFrame();toast('프레임 순서를 뒤집었습니다.');}
  function togglePlay(){
    if(!state.frames.length)return;
    if(state.playTimer){stopPlayback();return;}
    $('#lssPlay').classList.add('active');$('#lssPlay').textContent='정지';state.playTimer=setInterval(()=>showFrame(state.index+1),90);
  }

  async function exportStandalone(){
    if(!state.frames.length)return;
    const button=$('#lssExportHtml');button.disabled=true;setStatus('독립 뷰어에 프레임을 포함하는 중입니다.');setProgress(0);
    try{
      const images=[];
      for(let i=0;i<state.frames.length;i++){images.push(await blobToDataURL(state.frames[i].blob));setProgress(((i+1)/state.frames.length)*90);}
      const payload=JSON.stringify(images).replace(/</g,'\\u003c');
      const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LavaSpin 360 Viewer</title><style>*{box-sizing:border-box}body{margin:0;background:#eef1ec;font-family:Arial,sans-serif}.viewer{position:relative;display:grid;place-items:center;width:100%;height:100vh;min-height:360px;overflow:hidden;touch-action:none;user-select:none}.viewer img{max-width:100%;max-height:100%;object-fit:contain}.hint{position:absolute;bottom:16px;padding:8px 11px;border-radius:999px;background:#111820;color:#c9ff48;font-size:12px;font-weight:700}.count{position:absolute;right:14px;top:14px;padding:7px 9px;border-radius:999px;background:#111820;color:#fff;font-size:11px}</style></head><body><div class="viewer" id="viewer"><img id="frame" alt="360 product"><span class="count" id="count"></span><span class="hint">↔ 드래그하여 회전</span></div><script>const images=${payload};let index=0,start=0,base=0;const v=document.querySelector('#viewer'),img=document.querySelector('#frame'),count=document.querySelector('#count');function show(i){index=(i%images.length+images.length)%images.length;img.src=images[index];count.textContent=(index+1)+' / '+images.length}v.onpointerdown=e=>{start=e.clientX;base=index;v.setPointerCapture(e.pointerId)};v.onpointermove=e=>{if(!v.hasPointerCapture(e.pointerId))return;show(base+Math.round((start-e.clientX)/9))};v.onwheel=e=>{e.preventDefault();show(index+(e.deltaY>0?1:-1))};show(0);<\/script></body></html>`;
      downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),'lavaspin-viewer.html');setProgress(100);setStatus('독립 실행 HTML을 저장했습니다.');toast('HTML 뷰어를 저장했습니다.');
    }catch(error){setStatus(`HTML 생성 실패: ${error.message}`);toast(error.message);}finally{button.disabled=false;}
  }
  function loadJSZip(){return new Promise((resolve,reject)=>{if(window.JSZip)return resolve(window.JSZip);const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';script.onload=()=>resolve(window.JSZip);script.onerror=()=>reject(new Error('ZIP 모듈을 불러오지 못했습니다. HTML 내보내기를 사용해 주세요.'));document.head.append(script);});}
  async function exportZip(){
    if(!state.frames.length)return;
    const button=$('#lssExportZip');button.disabled=true;setStatus('프레임 ZIP을 만드는 중입니다.');
    try{const JSZip=await loadJSZip(),zip=new JSZip(),folder=zip.folder('frames');state.frames.forEach((frame,i)=>{const ext=(frame.blob.type.split('/')[1]||'jpg').replace('jpeg','jpg');folder.file(`frame-${String(i+1).padStart(3,'0')}.${ext}`,frame.blob);});zip.file('README.txt',`LavaSpin browser export\nFrames: ${state.frames.length}\nGenerated: ${new Date().toISOString()}\nAll processing was performed locally in the browser.`);const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE'},meta=>setProgress(meta.percent));downloadBlob(blob,'lavaspin-frames.zip');setStatus('프레임 ZIP을 저장했습니다.');toast('ZIP 저장이 완료됐습니다.');}catch(error){setStatus(`ZIP 생성 실패: ${error.message}`);toast(error.message);}finally{button.disabled=false;}
  }

  function bindEvents(){
    $$('[data-lss-mode]').forEach(button=>button.onclick=()=>switchMode(button.dataset.lssMode));
    const photoInput=$('#lssPhotoInput'),photoDrop=$('#lssPhotoDrop');
    $('#lssPhotoChoose').onclick=()=>photoInput.click();photoInput.onchange=()=>loadPhotoFiles(photoInput.files);
    ['dragenter','dragover'].forEach(type=>photoDrop.addEventListener(type,event=>{event.preventDefault();photoDrop.classList.add('drag');}));
    ['dragleave','drop'].forEach(type=>photoDrop.addEventListener(type,event=>{event.preventDefault();photoDrop.classList.remove('drag');}));photoDrop.addEventListener('drop',event=>loadPhotoFiles(event.dataTransfer.files));
    $('#lssReverse').onclick=reverseFrames;$('#lssRemove').onclick=removeCurrent;$('#lssClear').onclick=clearAll;

    const videoInput=$('#lssVideoInput'),video=$('#lssVideo');
    videoInput.onchange=async()=>{const file=videoInput.files?.[0];if(!file)return;if(state.videoUrl)URL.revokeObjectURL(state.videoUrl);state.videoUrl=URL.createObjectURL(file);video.src=state.videoUrl;$('#lssVideoWrap').hidden=false;$('#lssExtract').disabled=false;setStatus(`영상 선택: ${file.name}`);setProgress(0);try{await waitVideoMetadata(video);setStatus(`영상 선택: ${file.name} · ${video.duration.toFixed(1)}초 · ${video.videoWidth}×${video.videoHeight}`);}catch(error){setStatus(error.message);}};
    $('#lssExtract').onclick=extractVideoFrames;

    $('#lssCameraStart').onclick=startCamera;$('#lssCameraStop').onclick=stopCamera;$('#lssCapture').onclick=async()=>{try{const current=await captureCameraFrame(),target=+$('#lssCameraCount').value,angle=Math.round(((current-1)/target)*3600)/10;$('#lssAngle').textContent=`${angle}° · ${current}/${target}`;setProgress(Math.min(100,current/target*100));setStatus(`${current}번째 프레임을 촬영했습니다.`);}catch(error){toast(error.message);}};$('#lssAutoCapture').onclick=autoCapture;

    $('#lssRange').oninput=event=>showFrame(+event.target.value);$('#lssPrev').onclick=()=>showFrame(state.index-1);$('#lssNext').onclick=()=>showFrame(state.index+1);$('#lssPlay').onclick=togglePlay;$('#lssDirection').onclick=reverseFrames;
    const stage=$('#lssStage');let dragStart=0,dragIndex=0;
    stage.onpointerdown=event=>{if(!state.frames.length)return;dragStart=event.clientX;dragIndex=state.index;stage.setPointerCapture(event.pointerId);};
    stage.onpointermove=event=>{if(!stage.hasPointerCapture(event.pointerId)||!state.frames.length)return;showFrame(dragIndex+Math.round((dragStart-event.clientX)/9));};
    stage.onwheel=event=>{if(!state.frames.length)return;event.preventDefault();showFrame(state.index+(event.deltaY>0?1:-1));};
    stage.onkeydown=event=>{if(event.key==='ArrowLeft')showFrame(state.index-1);if(event.key==='ArrowRight')showFrame(state.index+1);if(event.key===' '){event.preventDefault();togglePlay();}};

    $('#lssExportHtml').onclick=exportStandalone;$('#lssExportZip').onclick=exportZip;$('#lssDownloadFrame').onclick=()=>{const frame=state.frames[state.index];if(frame)downloadBlob(frame.blob,frame.name||`frame-${state.index+1}.jpg`);};$('#lssCopyEmbed').onclick=async()=>{const code='<iframe src="lavaspin-viewer.html" width="100%" height="560" style="border:0" loading="lazy" title="360 product viewer"></iframe>';try{await navigator.clipboard.writeText(code);toast('삽입 코드를 복사했습니다.');}catch{toast('복사하지 못했습니다.');}};
    window.addEventListener('beforeunload',()=>{stopCamera();cleanupFrames();if(state.videoUrl)URL.revokeObjectURL(state.videoUrl);});
  }

  improveExistingCopy();buildStudio();bindEvents();showFrame();enableFrameActions();
})();