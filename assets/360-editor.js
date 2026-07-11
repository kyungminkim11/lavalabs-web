(()=>{
  'use strict';

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
  const STORAGE_KEY='lava360-editor-settings-v2';
  const isMobileDevice=()=>matchMedia('(max-width:720px)').matches||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const normalizeHeading=value=>((Math.round(Number(value)||0)%360)+360)%360;

  const state={
    image:null,file:null,fileName:'lava-360-demo.jpg',originalWidth:2048,originalHeight:1024,
    ratioAdjusted:false,hasGpano:false,logo:null,logoName:'',mode:'logo',showOriginal:false,
    renderToken:0,viewer:null,viewerUrl:'',startYaw:0,maxSafeWidth:8192,
    baked:{brightness:100,contrast:100,saturation:100,warmth:0},
    settings:{brightness:100,contrast:100,saturation:100,warmth:0,patchSize:31,patchRotation:0,patchOpacity:100,logoScale:62,borderWidth:2},
    history:[],historyIndex:-1,restoring:false,toastTimer:0
  };

  const els={
    imageInput:$('#imageInput'),logoInput:$('#logoInput'),viewerStage:$('#viewerStage'),panorama:$('#panorama'),warmthPreview:$('#warmthPreview'),
    status:$('#statusPill'),fileName:$('#fileName'),fileMeta:$('#fileMeta'),logoName:$('#logoName'),compareState:$('#compareState'),
    beforeAfter:$('#beforeAfterBtn'),demo:$('#demoBtn'),download:$('#downloadBtn'),topDownload:$('#topDownloadBtn'),
    floorView:$('#floorViewBtn'),frontView:$('#frontViewBtn'),previewFloor:$('#previewFloorBtn'),setStartView:$('#setStartViewBtn'),
    startViewValue:$('#startViewValue'),resetAdjust:$('#resetAdjustBtn'),resetPatch:$('#resetPatchBtn'),resetAll:$('#resetAllBtn'),
    removeLogo:$('#removeLogoBtn'),undo:$('#undoBtn'),redo:$('#redoBtn'),toast:$('#editorToast'),toolNotice:$('#toolNotice'),
    exportProgress:$('#exportProgress'),exportProgressBar:$('#exportProgressBar'),exportProgressCopy:$('#exportProgressCopy'),
    exportSize:$('#exportSize'),exportFormat:$('#exportFormat'),exportQuality:$('#exportQuality'),exportName:$('#exportName'),
    exportSafety:$('#exportSafety'),qualityRow:$('#qualityRow'),autosaveState:$('#autosaveState'),deviceHint:$('#deviceHint'),logoDrop:$('#logoDrop')
  };

  const adjustmentIds=['brightness','contrast','saturation','warmth'];
  const patchRangeIds=['patchSize','patchRotation','patchOpacity','logoScale','borderWidth'];
  const allRangeIds=[...adjustmentIds,...patchRangeIds,'exportQuality'];
  let previewTimer=0;

  function setStatus(text,type='ready'){
    els.status.textContent=text;
    els.status.classList.toggle('busy',type==='busy');
    els.status.classList.toggle('error',type==='error');
  }

  function toast(message,type='ready'){
    clearTimeout(state.toastTimer);
    els.toast.textContent=message;
    els.toast.classList.toggle('error',type==='error');
    els.toast.classList.add('show');
    state.toastTimer=setTimeout(()=>els.toast.classList.remove('show'),2800);
  }

  function updateOutput(input){
    const out=$(`output[for="${input.id}"]`);
    if(!out)return;
    const degreeIds=['patchSize','patchRotation'];
    const percentIds=['patchOpacity','exportQuality','logoScale','borderWidth'];
    const suffix=degreeIds.includes(input.id)?'°':percentIds.includes(input.id)?'%':'';
    out.value=`${input.value}${suffix}`;
    out.textContent=out.value;
  }

  function readSettings(){
    [...adjustmentIds,...patchRangeIds].forEach(id=>{state.settings[id]=Number($(`#${id}`).value);});
  }

  function setControls(values){
    Object.entries(values).forEach(([key,value])=>{
      const input=$(`#${key}`);
      if(input){input.value=String(value);updateOutput(input);}
    });
    readSettings();
  }

  function setMode(mode,{render=true}={}){
    state.mode=mode;
    $$('[data-mode]').forEach(button=>{
      const active=button.dataset.mode===mode;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });
    $$('.mode-panel').forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===mode));
    if(render){state.showOriginal=false;syncCompareUi();schedulePreview(90);commitState();}
  }

  function cropForTwoToOne(width,height){
    const ratio=width/height;
    if(Math.abs(ratio-2)<0.012)return {sx:0,sy:0,sw:width,sh:height,adjusted:false};
    if(ratio>2){const sw=height*2;return {sx:(width-sw)/2,sy:0,sw,sh:height,adjusted:true};}
    const sh=width/2;return {sx:0,sy:(height-sh)/2,sw:width,sh,adjusted:true};
  }

  function createDemoCanvas(){
    const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
    const ctx=canvas.getContext('2d');
    const sky=ctx.createLinearGradient(0,0,0,520);sky.addColorStop(0,'#7db7e8');sky.addColorStop(1,'#e7f3f7');ctx.fillStyle=sky;ctx.fillRect(0,0,2048,560);
    const floor=ctx.createLinearGradient(0,520,0,1024);floor.addColorStop(0,'#b9aa91');floor.addColorStop(1,'#514538');ctx.fillStyle=floor;ctx.fillRect(0,560,2048,464);
    ctx.fillStyle='#f5f2e9';ctx.fillRect(0,420,2048,170);
    for(let i=0;i<8;i++){
      const x=i*256+45;ctx.fillStyle=i%2?'#d5e4ea':'#cfe0cf';ctx.fillRect(x,444,166,118);ctx.fillStyle='#8d765e';ctx.fillRect(x+74,562,18,182);ctx.fillStyle='#e8dfcf';ctx.fillRect(x+30,735,106,18);
    }
    ctx.strokeStyle='#8b7968';ctx.lineWidth=4;
    for(let y=600;y<1024;y+=72){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2048,y);ctx.stroke();}
    for(let x=0;x<2048;x+=160){ctx.beginPath();ctx.moveTo(x,560);ctx.lineTo(1024+(x-1024)*2.8,1024);ctx.stroke();}
    ctx.fillStyle='#11161d';ctx.textAlign='center';ctx.font='900 68px Inter, sans-serif';ctx.fillText('LAVA 360 STUDIO',1024,255);
    ctx.font='700 24px "Noto Sans KR", sans-serif';ctx.fillText('이미지를 업로드하면 실제 360 촬영 이미지로 바뀝니다.',1024,305);
    ctx.font='900 34px Inter, sans-serif';['NORTH','EAST','SOUTH','WEST'].forEach((label,index)=>ctx.fillText(label,index*512+256,390));
    return canvas;
  }

  async function canvasToImage(canvas){
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('데모 이미지를 만들 수 없습니다.')),'image/jpeg',.9));
    return loadImageFromBlob(blob);
  }

  async function loadImageFromBlob(blob){
    if('createImageBitmap' in window){
      try{return await createImageBitmap(blob,{imageOrientation:'from-image'});}catch(error){console.warn('ImageBitmap fallback',error);}
    }
    return new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(blob);const img=new Image();
      img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('이미지를 읽을 수 없습니다.'));};img.src=url;
    });
  }

  function releaseImage(image){if(image&&typeof image.close==='function'){try{image.close();}catch(error){console.warn(error);}}}

  async function inspectGpano(file){
    if(!file||file.type!=='image/jpeg')return false;
    try{
      const head=await file.slice(0,Math.min(file.size,1024*1024)).arrayBuffer();
      const text=new TextDecoder('utf-8',{fatal:false}).decode(head);
      return /GPano:ProjectionType|UsePanoramaViewer|photos\.google\.com\/panorama/i.test(text);
    }catch(error){return false;}
  }

  async function loadUserImage(file){
    if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('JPEG, PNG 또는 WebP 이미지를 선택해주세요.');
    if(file.size>120*1024*1024)throw new Error('120MB 이하 이미지를 사용해주세요.');
    const img=await loadImageFromBlob(file);
    if(img.width<1000||img.height<500){releaseImage(img);throw new Error('가로 1000px 이상의 360 이미지를 권장합니다.');}
    releaseImage(state.image);state.image=img;state.file=file;state.fileName=file.name;state.originalWidth=img.width;state.originalHeight=img.height;
    const crop=cropForTwoToOne(img.width,img.height);state.ratioAdjusted=crop.adjusted;state.hasGpano=await inspectGpano(file);
    els.fileName.textContent=file.name;
    const flags=[crop.adjusted?'2:1 자동 맞춤':'2:1 비율',state.hasGpano?'GPano 감지':'GPano 없음'];
    els.fileMeta.textContent=`${img.width.toLocaleString()} × ${img.height.toLocaleString()} · ${(file.size/1024/1024).toFixed(1)}MB · ${flags.join(' · ')}`;
    els.exportName.value=sanitizeName(file.name.replace(/\.[^.]+$/,''))+'-edited';
    updateNotice();updateExportSafety();setStatus(crop.adjusted?'2:1 자동 맞춤':'이미지 준비됨');
    await renderPreview(true);commitState();
  }

  function getPatchOptions(){
    return {
      mode:state.mode,logo:state.logo,logoBackground:$('#logoBackground').value,solidColor:$('#solidColor').value,
      text:$('#patchText').value.trim()||'LavaLabs',textBackground:$('#textBackground').value,textColor:$('#textColor').value,
      shape:$('#patchShape').value,borderColor:$('#borderColor').value,borderWidth:state.settings.borderWidth/100,
      logoScale:state.settings.logoScale/100,opacity:state.settings.patchOpacity/100
    };
  }

  function roundedRectPath(ctx,x,y,width,height,radius){
    const r=Math.min(radius,width/2,height/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+width,y,x+width,y+height,r);ctx.arcTo(x+width,y+height,x,y+height,r);ctx.arcTo(x,y+height,x,y,r);ctx.arcTo(x,y,x+width,y,r);ctx.closePath();
  }

  function makePatchTexture(size=640){
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d');const opts=getPatchOptions();
    const center=size/2;const inset=size*.035;const shapeSize=size-inset*2;ctx.clearRect(0,0,size,size);ctx.save();
    if(opts.shape==='rounded')roundedRectPath(ctx,inset,inset,shapeSize,shapeSize,size*.16);else{ctx.beginPath();ctx.arc(center,center,size*.465,0,Math.PI*2);ctx.closePath();}
    ctx.clip();const background=opts.mode==='color'?opts.solidColor:opts.mode==='text'?opts.textBackground:opts.logoBackground;ctx.fillStyle=background;ctx.fillRect(0,0,size,size);
    const shine=ctx.createRadialGradient(center*.72,center*.62,size*.05,center,center,size*.48);shine.addColorStop(0,'rgba(255,255,255,.16)');shine.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=shine;ctx.fillRect(0,0,size,size);
    if(opts.mode==='logo'&&opts.logo){
      const max=size*opts.logoScale;const ratio=opts.logo.width/opts.logo.height;let w=max,h=max;if(ratio>1)h=w/ratio;else w=h*ratio;ctx.drawImage(opts.logo,center-w/2,center-h/2,w,h);
    }else if(opts.mode==='logo'){
      ctx.fillStyle='#c9ff48';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${size*.105}px Inter, sans-serif`;ctx.fillText('YOUR LOGO',center,center);
    }else if(opts.mode==='text'){
      const words=opts.text.slice(0,36);const lines=[];let current='';
      for(const char of words){if((current+char).length>15){lines.push(current);current=char;}else current+=char;}if(current)lines.push(current);const trimmed=lines.slice(0,2);
      let fontSize=size*.13;while(fontSize>32){ctx.font=`900 ${fontSize}px "Noto Sans KR", Inter, sans-serif`;if(trimmed.every(line=>ctx.measureText(line).width<=size*.72))break;fontSize-=4;}
      ctx.fillStyle=opts.textColor;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${fontSize}px "Noto Sans KR", Inter, sans-serif`;const lineHeight=fontSize*1.18;const start=center-(trimmed.length-1)*lineHeight/2;trimmed.forEach((line,index)=>ctx.fillText(line,center,start+index*lineHeight));
    }
    ctx.restore();
    if(opts.borderWidth>0){ctx.strokeStyle=opts.borderColor;ctx.lineWidth=size*opts.borderWidth;ctx.globalAlpha=.75;if(opts.shape==='rounded')roundedRectPath(ctx,inset+ctx.lineWidth/2,inset+ctx.lineWidth/2,shapeSize-ctx.lineWidth,shapeSize-ctx.lineWidth,size*.15);else{ctx.beginPath();ctx.arc(center,center,size*.465-ctx.lineWidth/2,0,Math.PI*2);}ctx.stroke();ctx.globalAlpha=1;}
    return canvas;
  }

  function drawBaseImage(ctx,width,height,original=false){
    const crop=cropForTwoToOne(state.image.width,state.image.height);ctx.save();
    if(!original){
      const {brightness,contrast,saturation,warmth}=state.settings;ctx.filter=`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;ctx.drawImage(state.image,crop.sx,crop.sy,crop.sw,crop.sh,0,0,width,height);ctx.filter='none';
      if(warmth!==0){ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=Math.min(.28,Math.abs(warmth)/180);ctx.fillStyle=warmth>0?'#ff8c42':'#4b8dff';ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
    }else ctx.drawImage(state.image,crop.sx,crop.sy,crop.sw,crop.sh,0,0,width,height);
    ctx.restore();
  }

  async function applyNadirPatch(ctx,width,height,patchCanvas,radiusDegrees,rotationDegrees,opacity=1,{yieldRows=false,onProgress=()=>{}}={}){
    const radiusRad=clamp(radiusDegrees,5,80)*Math.PI/180;const startY=Math.max(0,Math.floor(height*(1-radiusRad/Math.PI)-2));const bandHeight=height-startY;if(bandHeight<=0)return;
    const patchCtx=patchCanvas.getContext('2d');const patchData=patchCtx.getImageData(0,0,patchCanvas.width,patchCanvas.height).data;const pSize=patchCanvas.width;const rotation=rotationDegrees*Math.PI/180;
    const chunkRows=yieldRows?Math.max(24,Math.floor(1400000/Math.max(width,1))):bandHeight;
    for(let chunkStart=startY;chunkStart<height;chunkStart+=chunkRows){
      const rows=Math.min(chunkRows,height-chunkStart);const imageData=ctx.getImageData(0,chunkStart,width,rows);const data=imageData.data;
      for(let localY=0;localY<rows;localY++){
        const y=chunkStart+localY;const delta=Math.PI*(1-(y+.5)/height);const radial=delta/radiusRad;if(radial>1.02)continue;
        for(let x=0;x<width;x++){
          const longitude=((x+.5)/width)*Math.PI*2-Math.PI+rotation;const u=.5+.5*radial*Math.cos(longitude);const v=.5+.5*radial*Math.sin(longitude);if(u<0||u>1||v<0||v>1)continue;
          const px=clamp(Math.floor(u*(pSize-1)),0,pSize-1);const py=clamp(Math.floor(v*(pSize-1)),0,pSize-1);const pi=(py*pSize+px)*4;const alpha=(patchData[pi+3]/255)*opacity;if(alpha<=.002)continue;
          const di=(localY*width+x)*4;const inv=1-alpha;data[di]=patchData[pi]*alpha+data[di]*inv;data[di+1]=patchData[pi+1]*alpha+data[di+1]*inv;data[di+2]=patchData[pi+2]*alpha+data[di+2]*inv;data[di+3]=255;
        }
      }
      ctx.putImageData(imageData,0,chunkStart);onProgress((chunkStart+rows-startY)/bandHeight);if(yieldRows)await nextFrame();
    }
  }

  async function renderCanvas(width,{original=false,yieldRows=false,onProgress=()=>{}}={}){
    const safeWidth=Math.max(1024,Math.round(width/2)*2);const canvas=document.createElement('canvas');canvas.width=safeWidth;canvas.height=safeWidth/2;
    const ctx=canvas.getContext('2d',{alpha:false,willReadFrequently:state.mode!=='none'});if(!ctx)throw new Error('현재 브라우저에서 이미지 캔버스를 만들 수 없습니다.');
    drawBaseImage(ctx,canvas.width,canvas.height,original);onProgress(.18);
    if(!original&&state.mode!=='none'){
      const patch=makePatchTexture(yieldRows?900:520);await applyNadirPatch(ctx,canvas.width,canvas.height,patch,state.settings.patchSize,state.settings.patchRotation,state.settings.patchOpacity/100,{yieldRows,onProgress:value=>onProgress(.18+value*.72)});
    }
    onProgress(.92);return canvas;
  }

  function applyLivePreview(){
    if(state.showOriginal)return;
    const safe=(value,fallback)=>Number.isFinite(value)&&value>0?value:fallback;
    const brightness=state.settings.brightness/safe(state.baked.brightness,100);const contrast=state.settings.contrast/safe(state.baked.contrast,100);const saturation=state.settings.saturation/safe(state.baked.saturation,100);
    els.panorama.style.filter=`brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
    const warmthDelta=state.settings.warmth-state.baked.warmth;els.warmthPreview.style.background=warmthDelta>=0?'#ff8c42':'#4b8dff';els.warmthPreview.style.opacity=String(Math.min(.22,Math.abs(warmthDelta)/180));
  }

  function clearLivePreview(){els.panorama.style.filter='none';els.warmthPreview.style.opacity='0';state.baked={brightness:state.settings.brightness,contrast:state.settings.contrast,saturation:state.settings.saturation,warmth:state.settings.warmth};}
  function schedulePreview(delay=180){clearTimeout(previewTimer);previewTimer=setTimeout(()=>renderPreview(false),delay);}

  async function waitForPannellum(){
    for(let i=0;i<24;i++){if(window.pannellum?.viewer)return true;await new Promise(resolve=>setTimeout(resolve,125));}
    return false;
  }

  async function renderPreview(resetView=false){
    if(!state.image)return;const token=++state.renderToken;readSettings();setStatus('미리보기 처리 중','busy');
    try{
      if(!(await waitForPannellum()))throw new Error('360 뷰어를 불러오지 못했습니다. 네트워크를 확인해주세요.');
      const sourceWidth=cropForTwoToOne(state.image.width,state.image.height).sw;const previewCap=isMobileDevice()?2048:3072;const previewWidth=Math.min(previewCap,Math.max(1600,Math.round(sourceWidth/2)*2));
      const canvas=await renderCanvas(previewWidth,{original:state.showOriginal,yieldRows:false});if(token!==state.renderToken)return;
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('미리보기를 만들 수 없습니다.')),'image/jpeg',.88));const url=URL.createObjectURL(blob);const previous=state.viewerUrl;
      const view=state.viewer&&!resetView?{yaw:state.viewer.getYaw(),pitch:state.viewer.getPitch(),hfov:state.viewer.getHfov()}:{yaw:state.startYaw,pitch:0,hfov:100};
      if(state.viewer){try{state.viewer.destroy();}catch(error){console.warn(error);}}
      state.viewer=window.pannellum.viewer('panorama',{type:'equirectangular',panorama:url,autoLoad:true,showControls:true,showZoomCtrl:true,showFullscreenCtrl:true,yaw:view.yaw,pitch:view.pitch,hfov:view.hfov,minHfov:38,maxHfov:120,mouseZoom:true,draggable:true,friction:.16,strings:{loadButtonLabel:'360 이미지 보기',loadingLabel:'이미지 처리 중',bylineLabel:'LavaLabs'}});
      state.viewerUrl=url;state.viewer.on('load',()=>{if(previous)URL.revokeObjectURL(previous);clearLivePreview();setStatus(state.showOriginal?'원본 표시 중':'편집본 표시 중');});state.viewer.on('error',()=>setStatus('미리보기를 열 수 없습니다','error'));
    }catch(error){console.error(error);setStatus(error.message||'미리보기 오류','error');toast(error.message||'미리보기 오류','error');}
  }

  function syncCompareUi(){
    els.beforeAfter.textContent=state.showOriginal?'편집본 보기':'원본 보기';els.beforeAfter.setAttribute('aria-pressed',String(state.showOriginal));els.compareState.hidden=!state.showOriginal;
  }

  const presets={natural:{brightness:104,contrast:102,saturation:104,warmth:3},bright:{brightness:114,contrast:98,saturation:105,warmth:1},warm:{brightness:106,contrast:104,saturation:112,warmth:18},night:{brightness:112,contrast:112,saturation:96,warmth:-5}};

  async function loadLogo(file){
    if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('PNG, JPG 또는 WebP 로고를 선택해주세요.');if(file.size>15*1024*1024)throw new Error('로고 이미지는 15MB 이하로 사용해주세요.');
    const img=await loadImageFromBlob(file);releaseImage(state.logo);state.logo=img;state.logoName=file.name;els.logoName.textContent=file.name;setMode('logo',{render:false});state.showOriginal=false;syncCompareUi();await renderPreview(false);commitState();toast('로고를 적용했습니다.');
  }

  function removeLogo(){releaseImage(state.logo);state.logo=null;state.logoName='';els.logoName.textContent='로고를 선택하세요.';schedulePreview(60);commitState();toast('로고를 제거했습니다.');}

  function buildGpanoSegment(width,height,heading){
    const encoder=new TextEncoder();const header='http://ns.adobe.com/xap/1.0/\0';
    const xml=`<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:GPano="http://ns.google.com/photos/1.0/panorama/" GPano:ProjectionType="equirectangular" GPano:UsePanoramaViewer="True" GPano:CroppedAreaImageWidthPixels="${width}" GPano:CroppedAreaImageHeightPixels="${height}" GPano:FullPanoWidthPixels="${width}" GPano:FullPanoHeightPixels="${height}" GPano:CroppedAreaLeftPixels="0" GPano:CroppedAreaTopPixels="0" GPano:InitialViewHeadingDegrees="${normalizeHeading(heading)}" GPano:InitialViewPitchDegrees="0" GPano:InitialViewRollDegrees="0"/></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
    const payload=encoder.encode(header+xml);const length=payload.length+2;const segment=new Uint8Array(payload.length+4);segment[0]=0xff;segment[1]=0xe1;segment[2]=(length>>8)&0xff;segment[3]=length&0xff;segment.set(payload,4);return segment;
  }

  function injectGpanoMetadata(jpegBuffer,width,height,heading){
    const jpeg=new Uint8Array(jpegBuffer);if(jpeg[0]!==0xff||jpeg[1]!==0xd8)return jpeg;const segment=buildGpanoSegment(width,height,heading);const output=new Uint8Array(jpeg.length+segment.length);output.set(jpeg.subarray(0,2),0);output.set(segment,2);output.set(jpeg.subarray(2),2+segment.length);return output;
  }

  function computeMaxSafeWidth(){
    const memory=Number(navigator.deviceMemory)||4;const mobile=isMobileDevice();let max=mobile?(memory>=8?8192:4096):(memory>=8?12000:8192);if(/iPad|iPhone|iPod/i.test(navigator.userAgent))max=Math.min(max,4096);return max;
  }

  function resolveExportWidth(){
    const crop=cropForTwoToOne(state.image.width,state.image.height);const source=Math.max(1024,Math.round(crop.sw/2)*2);const selected=els.exportSize.value;const requested=selected==='original'?source:Number(selected);return Math.min(requested,source,state.maxSafeWidth);
  }

  function estimateMemory(width){return width*(width/2)*4*2.35/1024/1024;}

  function updateExportSafety(){
    if(!state.image)return;const width=resolveExportWidth();const requested=els.exportSize.value==='original'?cropForTwoToOne(state.image.width,state.image.height).sw:Number(els.exportSize.value);const limited=width<requested;const memory=Math.round(estimateMemory(width));
    els.exportSafety.classList.toggle('warning',limited);els.exportSafety.innerHTML=`<strong>${limited?'자동 제한':'안전 출력'}</strong><span>${width.toLocaleString()}×${Math.round(width/2).toLocaleString()} 예상 · 작업 메모리 약 ${memory.toLocaleString()}MB${limited?' · 원본 또는 선택 해상도가 기기 권장 범위를 넘어 자동으로 낮춥니다.':''}</span>`;
  }

  function updateProgress(value,text=''){
    const percent=clamp(Math.round(value*100),0,100);els.exportProgressBar.style.width=`${percent}%`;els.exportProgressCopy.textContent=text||`${percent}% 처리 중`;
  }

  function sanitizeName(value){return (value||'lava-360-edited').trim().replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9가-힣_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)||'lava-360-edited';}

  async function exportImage(){
    if(!state.image)return;els.download.disabled=true;els.topDownload.disabled=true;els.exportProgress.classList.add('show');els.exportProgress.setAttribute('aria-hidden','false');updateProgress(.02,'출력 준비 중');setStatus('고해상도 저장 중','busy');
    try{
      state.showOriginal=false;syncCompareUi();readSettings();let width=resolveExportWidth();let canvas;
      try{canvas=await renderCanvas(width,{original:false,yieldRows:true,onProgress:value=>updateProgress(value*.86,'이미지와 바닥 패치를 처리하고 있습니다.')});}
      catch(error){
        console.warn('Export fallback',error);width=Math.min(4096,width);toast('기기 메모리에 맞춰 4K로 다시 처리합니다.');canvas=await renderCanvas(width,{original:false,yieldRows:true,onProgress:value=>updateProgress(value*.86,'4K 안전 모드로 처리하고 있습니다.')});
      }
      updateProgress(.9,'파일을 압축하고 있습니다.');const format=els.exportFormat.value;const base=sanitizeName(els.exportName.value||state.fileName);let blob;
      if(format==='png')blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('PNG 파일을 만들 수 없습니다.')),'image/png'));
      else{
        const quality=Number(els.exportQuality.value)/100;const raw=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('JPEG 파일을 만들 수 없습니다.')),'image/jpeg',quality));const buffer=await raw.arrayBuffer();blob=new Blob([injectGpanoMetadata(buffer,canvas.width,canvas.height,state.startYaw)],{type:'image/jpeg'});
      }
      updateProgress(.98,'다운로드를 시작합니다.');const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`${base}-${canvas.width}x${canvas.height}.${format==='png'?'png':'jpg'}`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3500);
      updateProgress(1,'저장이 완료되었습니다.');setStatus(`${canvas.width.toLocaleString()}×${canvas.height.toLocaleString()} 저장 완료`);toast('360 이미지 다운로드가 완료되었습니다.');await renderPreview(false);
    }catch(error){console.error(error);setStatus(error.message||'다운로드 처리 실패','error');toast(error.message||'저장 중 문제가 발생했습니다.','error');}
    finally{setTimeout(()=>{els.exportProgress.classList.remove('show');els.exportProgress.setAttribute('aria-hidden','true');els.exportProgressBar.style.width='0';els.exportProgressCopy.textContent='';},900);els.download.disabled=false;els.topDownload.disabled=false;}
  }

  function getSnapshot(){
    const values={};[...adjustmentIds,...patchRangeIds,'exportQuality'].forEach(id=>values[id]=$(`#${id}`).value);
    ['logoBackground','solidColor','patchText','textBackground','textColor','patchShape','borderColor','exportSize','exportFormat','exportName'].forEach(id=>values[id]=$(`#${id}`).value);
    return {values,mode:state.mode,startYaw:state.startYaw};
  }

  function applySnapshot(snapshot,{render=true}={}){
    if(!snapshot)return;state.restoring=true;Object.entries(snapshot.values||{}).forEach(([id,value])=>{const input=$(`#${id}`);if(input){input.value=value;updateOutput(input);}});state.startYaw=normalizeHeading(snapshot.startYaw||0);els.startViewValue.textContent=`${state.startYaw}°`;setMode(snapshot.mode||'logo',{render:false});readSettings();state.restoring=false;updateFormatUi();updateExportSafety();applyLivePreview();if(render)schedulePreview(50);
  }

  function updateHistoryButtons(){els.undo.disabled=state.historyIndex<=0;els.redo.disabled=state.historyIndex>=state.history.length-1;}

  function commitState(){
    if(state.restoring)return;const snapshot=getSnapshot();const json=JSON.stringify(snapshot);const current=state.history[state.historyIndex];if(current&&current.json===json){saveSettings(snapshot);return;}
    state.history=state.history.slice(0,state.historyIndex+1);state.history.push({json,snapshot});if(state.history.length>40)state.history.shift();state.historyIndex=state.history.length-1;updateHistoryButtons();saveSettings(snapshot);
  }

  function undo(){if(state.historyIndex<=0)return;state.historyIndex--;applySnapshot(state.history[state.historyIndex].snapshot);updateHistoryButtons();toast('이전 설정으로 되돌렸습니다.');}
  function redo(){if(state.historyIndex>=state.history.length-1)return;state.historyIndex++;applySnapshot(state.history[state.historyIndex].snapshot);updateHistoryButtons();toast('다시 적용했습니다.');}

  function saveSettings(snapshot=getSnapshot()){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(snapshot));els.autosaveState.textContent='설정 저장됨';setTimeout(()=>els.autosaveState.textContent='설정 자동 저장',1200);}catch(error){els.autosaveState.textContent='자동 저장 불가';}
  }

  function restoreSavedSettings(){
    try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return false;applySnapshot(JSON.parse(raw),{render:false});return true;}catch(error){return false;}
  }

  function resetAdjustments(){setControls({brightness:100,contrast:100,saturation:100,warmth:0});state.showOriginal=false;syncCompareUi();schedulePreview(50);commitState();}
  function resetPatch(){setControls({patchSize:31,patchRotation:0,patchOpacity:100,logoScale:62,borderWidth:2});$('#logoBackground').value='#11161d';$('#solidColor').value='#11161d';$('#textBackground').value='#11161d';$('#textColor').value='#c9ff48';$('#patchText').value='LavaLabs';$('#patchShape').value='circle';$('#borderColor').value='#ffffff';setMode('logo',{render:false});schedulePreview(50);commitState();}
  async function resetAll(){resetAdjustments();resetPatch();els.exportSize.value='original';els.exportFormat.value='jpeg';els.exportQuality.value='92';updateOutput(els.exportQuality);els.exportName.value=sanitizeName(state.fileName.replace(/\.[^.]+$/,''))+'-edited';state.startYaw=0;els.startViewValue.textContent='0°';updateFormatUi();updateExportSafety();commitState();await renderPreview(true);toast('모든 설정을 초기화했습니다.');}

  async function loadDemo(){
    setStatus('데모 준비 중','busy');releaseImage(state.image);const canvas=createDemoCanvas();state.image=await canvasToImage(canvas);state.file=null;state.fileName='lava-360-demo.jpg';state.originalWidth=2048;state.originalHeight=1024;state.ratioAdjusted=false;state.hasGpano=true;els.fileName.textContent='Lava 360 Studio 데모';els.fileMeta.textContent='2048 × 1024 · 데모 이미지 · GPano 예시';if(!els.exportName.value)els.exportName.value='lava-360-demo-edited';updateNotice();updateExportSafety();await renderPreview(true);
  }

  function updateNotice(){
    const warning=state.ratioAdjusted;els.toolNotice.classList.toggle('warning',warning);els.toolNotice.innerHTML=warning?'<strong>2:1 비율 자동 맞춤:</strong> 업로드한 이미지가 정확한 이퀴렉탱귤러 비율이 아니어서 중앙을 기준으로 잘라 사용합니다. 중요한 피사체가 위·아래 또는 양옆 끝에 있다면 카메라 앱에서 2:1 이미지로 다시 내보내는 편이 안전합니다.':'<strong>권장 파일:</strong> 가로가 세로의 2배인 이퀴렉탱귤러 JPEG·PNG·WebP. JPEG 저장 시 GPano 메타데이터와 시작 방향을 삽입합니다. PNG는 GPano 정보가 포함되지 않습니다.';
  }

  function updateFormatUi(){const jpeg=els.exportFormat.value==='jpeg';els.qualityRow.hidden=!jpeg;updateExportSafety();}

  function setCurrentStartView(){
    if(!state.viewer)return;state.startYaw=normalizeHeading(state.viewer.getYaw());els.startViewValue.textContent=`${state.startYaw}°`;commitState();toast(`시작 방향을 ${state.startYaw}°로 저장했습니다.`);
  }

  function showFloor(){if(state.viewer){state.viewer.setPitch(-90,650);state.viewer.setHfov(82,650);}}
  function showFront(){if(state.viewer){state.viewer.setPitch(0,650);state.viewer.setYaw(state.startYaw,650);state.viewer.setHfov(100,650);}}

  function setupMobileTabs(){
    const buttons=$$('[data-mobile-tab]');const activate=name=>{
      buttons.forEach(button=>button.classList.toggle('active',button.dataset.mobileTab===name));$$('.control-card[data-editor-section]').forEach(card=>card.classList.toggle('mobile-active',card.dataset.editorSection===name));
      const target=name==='preview'?$('.viewer-card'):$(`.control-card[data-editor-section="${name}"]`);target?.scrollIntoView({behavior:'smooth',block:'start'});
    };
    buttons.forEach(button=>button.addEventListener('click',()=>activate(button.dataset.mobileTab)));
    const sync=()=>{if(!matchMedia('(max-width:720px)').matches)$$('.control-card').forEach(card=>card.classList.remove('mobile-active'));};window.addEventListener('resize',sync,{passive:true});sync();
  }

  function bindDropTarget(target,handler){
    ['dragenter','dragover'].forEach(type=>target.addEventListener(type,event=>{event.preventDefault();target.classList.add('dragging');}));
    ['dragleave','drop'].forEach(type=>target.addEventListener(type,event=>{event.preventDefault();target.classList.remove('dragging');}));
    target.addEventListener('drop',event=>{const file=event.dataTransfer?.files?.[0];if(file)handler(file);});
  }

  function initializeDeviceHints(){state.maxSafeWidth=computeMaxSafeWidth();const memory=Number(navigator.deviceMemory)||null;els.deviceHint.textContent=`권장 최대 ${state.maxSafeWidth>=8192?`${Math.round(state.maxSafeWidth/1024)}K`:'4K'}${memory?` · 메모리 ${memory}GB급`:''}`;updateExportSafety();}

  allRangeIds.forEach(id=>{const input=$(`#${id}`);if(input)updateOutput(input);});
  restoreSavedSettings();readSettings();state.baked={brightness:state.settings.brightness,contrast:state.settings.contrast,saturation:state.settings.saturation,warmth:state.settings.warmth};commitState();initializeDeviceHints();updateFormatUi();setupMobileTabs();

  adjustmentIds.forEach(id=>{
    const input=$(`#${id}`);input.addEventListener('input',()=>{updateOutput(input);readSettings();state.showOriginal=false;syncCompareUi();applyLivePreview();});
    input.addEventListener('change',()=>{readSettings();schedulePreview(20);commitState();});
  });
  patchRangeIds.forEach(id=>{
    const input=$(`#${id}`);input.addEventListener('input',()=>{updateOutput(input);readSettings();state.showOriginal=false;syncCompareUi();schedulePreview(100);});input.addEventListener('change',commitState);
  });
  els.exportQuality.addEventListener('input',()=>updateOutput(els.exportQuality));els.exportQuality.addEventListener('change',commitState);
  $$('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
  $$('.preset-btn').forEach(button=>button.addEventListener('click',()=>{setControls(presets[button.dataset.preset]);$$('.preset-btn').forEach(item=>item.classList.toggle('active',item===button));state.showOriginal=false;syncCompareUi();schedulePreview(20);commitState();}));
  ['logoBackground','solidColor','patchText','textBackground','textColor','patchShape','borderColor'].forEach(id=>{const input=$(`#${id}`);input.addEventListener(input.type==='text'?'input':'change',()=>{state.showOriginal=false;syncCompareUi();schedulePreview(input.type==='text'?180:40);});input.addEventListener('change',commitState);});
  ['exportSize','exportFormat','exportName'].forEach(id=>{const input=$(`#${id}`);input.addEventListener('change',()=>{updateFormatUi();commitState();});});

  els.imageInput.addEventListener('change',async event=>{try{setStatus('이미지 읽는 중','busy');await loadUserImage(event.target.files[0]);toast('360 이미지를 불러왔습니다.');}catch(error){setStatus(error.message,'error');toast(error.message,'error');}finally{event.target.value='';}});
  els.logoInput.addEventListener('change',async event=>{try{setStatus('로고 적용 중','busy');await loadLogo(event.target.files[0]);}catch(error){setStatus(error.message,'error');toast(error.message,'error');}finally{event.target.value='';}});
  els.demo.addEventListener('click',loadDemo);els.beforeAfter.addEventListener('click',()=>{state.showOriginal=!state.showOriginal;syncCompareUi();renderPreview(false);});
  els.floorView.addEventListener('click',showFloor);els.previewFloor.addEventListener('click',showFloor);els.frontView.addEventListener('click',showFront);els.setStartView.addEventListener('click',setCurrentStartView);
  els.resetAdjust.addEventListener('click',resetAdjustments);els.resetPatch.addEventListener('click',resetPatch);els.resetAll.addEventListener('click',resetAll);els.removeLogo.addEventListener('click',removeLogo);els.undo.addEventListener('click',undo);els.redo.addEventListener('click',redo);
  els.download.addEventListener('click',exportImage);els.topDownload.addEventListener('click',exportImage);

  bindDropTarget(els.viewerStage,async file=>{try{setStatus('이미지 읽는 중','busy');await loadUserImage(file);toast('360 이미지를 불러왔습니다.');}catch(error){setStatus(error.message,'error');toast(error.message,'error');}});
  bindDropTarget(els.logoDrop,async file=>{try{await loadLogo(file);}catch(error){setStatus(error.message,'error');toast(error.message,'error');}});

  window.addEventListener('paste',async event=>{const file=Array.from(event.clipboardData?.files||[]).find(item=>item.type.startsWith('image/'));if(!file)return;try{setStatus('붙여넣은 이미지 읽는 중','busy');await loadUserImage(file);toast('클립보드 이미지를 불러왔습니다.');}catch(error){setStatus(error.message,'error');toast(error.message,'error');}});
  window.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redo();}
  });
  window.addEventListener('beforeunload',()=>{if(state.viewerUrl)URL.revokeObjectURL(state.viewerUrl);releaseImage(state.image);releaseImage(state.logo);});

  loadDemo().catch(error=>{console.error(error);setStatus('데모 로드 실패','error');toast('데모 이미지를 열지 못했습니다.','error');});
})();
