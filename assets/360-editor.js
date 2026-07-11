(()=>{
  'use strict';

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
  const state={
    image:null,
    file:null,
    fileName:'lava-360-demo.jpg',
    originalWidth:2048,
    originalHeight:1024,
    ratioAdjusted:false,
    logo:null,
    logoName:'',
    mode:'logo',
    showOriginal:false,
    renderToken:0,
    viewer:null,
    viewerUrl:'',
    settings:{brightness:100,contrast:100,saturation:100,warmth:0,patchSize:31,patchRotation:0,patchOpacity:100}
  };

  const els={
    imageInput:$('#imageInput'),logoInput:$('#logoInput'),viewerStage:$('#viewerStage'),panorama:$('#panorama'),
    status:$('#statusPill'),fileName:$('#fileName'),fileMeta:$('#fileMeta'),logoName:$('#logoName'),
    beforeAfter:$('#beforeAfterBtn'),demo:$('#demoBtn'),download:$('#downloadBtn'),topDownload:$('#topDownloadBtn'),
    floorView:$('#floorViewBtn'),frontView:$('#frontViewBtn'),resetAdjust:$('#resetAdjustBtn'),resetAll:$('#resetAllBtn'),
    exportProgress:$('#exportProgress'),exportSize:$('#exportSize'),exportFormat:$('#exportFormat'),exportQuality:$('#exportQuality')
  };

  const controlIds=['brightness','contrast','saturation','warmth','patchSize','patchRotation','patchOpacity','exportQuality'];
  const previewDebounce={timer:0};

  function setStatus(text,type='ready'){
    els.status.textContent=text;
    els.status.classList.toggle('busy',type==='busy');
    els.status.classList.toggle('error',type==='error');
  }

  function updateOutput(input){
    const out=$(`output[for="${input.id}"]`);
    if(!out)return;
    const suffix=input.id==='patchSize'||input.id==='patchRotation'?'°':input.id==='patchOpacity'||input.id==='exportQuality'?'%':'';
    out.value=`${input.value}${suffix}`;
    out.textContent=out.value;
  }

  function readSettings(){
    state.settings.brightness=Number($('#brightness').value);
    state.settings.contrast=Number($('#contrast').value);
    state.settings.saturation=Number($('#saturation').value);
    state.settings.warmth=Number($('#warmth').value);
    state.settings.patchSize=Number($('#patchSize').value);
    state.settings.patchRotation=Number($('#patchRotation').value);
    state.settings.patchOpacity=Number($('#patchOpacity').value);
  }

  function setControls(values){
    Object.entries(values).forEach(([key,value])=>{
      const input=$(`#${key}`);
      if(input){input.value=String(value);updateOutput(input);}
    });
    readSettings();
  }

  function cropForTwoToOne(width,height){
    const ratio=width/height;
    if(Math.abs(ratio-2)<0.012)return {sx:0,sy:0,sw:width,sh:height,adjusted:false};
    if(ratio>2){
      const sw=height*2;
      return {sx:(width-sw)/2,sy:0,sw,sh:height,adjusted:true};
    }
    const sh=width/2;
    return {sx:0,sy:(height-sh)/2,sw:width,sh,adjusted:true};
  }

  function createDemoCanvas(){
    const canvas=document.createElement('canvas');
    canvas.width=2048;canvas.height=1024;
    const ctx=canvas.getContext('2d');
    const sky=ctx.createLinearGradient(0,0,0,520);
    sky.addColorStop(0,'#7db7e8');sky.addColorStop(1,'#e7f3f7');
    ctx.fillStyle=sky;ctx.fillRect(0,0,2048,560);
    const floor=ctx.createLinearGradient(0,520,0,1024);
    floor.addColorStop(0,'#b9aa91');floor.addColorStop(1,'#514538');
    ctx.fillStyle=floor;ctx.fillRect(0,560,2048,464);
    ctx.fillStyle='#f5f2e9';ctx.fillRect(0,420,2048,170);
    for(let i=0;i<8;i++){
      const x=i*256+45;
      ctx.fillStyle=i%2?'#d5e4ea':'#cfe0cf';ctx.fillRect(x,444,166,118);
      ctx.fillStyle='#8d765e';ctx.fillRect(x+74,562,18,182);
      ctx.fillStyle='#e8dfcf';ctx.fillRect(x+30,735,106,18);
    }
    ctx.strokeStyle='#8b7968';ctx.lineWidth=4;
    for(let y=600;y<1024;y+=72){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2048,y);ctx.stroke();}
    for(let x=0;x<2048;x+=160){ctx.beginPath();ctx.moveTo(x,560);ctx.lineTo(1024+(x-1024)*2.8,1024);ctx.stroke();}
    ctx.fillStyle='#11161d';ctx.textAlign='center';ctx.font='900 68px Inter, sans-serif';ctx.fillText('LAVA 360 STUDIO',1024,255);
    ctx.font='700 24px "Noto Sans KR", sans-serif';ctx.fillText('이미지를 업로드하면 이 화면이 실제 360 촬영 이미지로 바뀝니다.',1024,305);
    ctx.font='900 34px Inter, sans-serif';
    ['NORTH','EAST','SOUTH','WEST'].forEach((label,index)=>ctx.fillText(label,index*512+256,390));
    return canvas;
  }

  async function canvasToImage(canvas){
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.9));
    return loadImageFromBlob(blob);
  }

  function loadImageFromBlob(blob){
    return new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(blob);
      const img=new Image();
      img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('이미지를 읽을 수 없습니다.'));};
      img.src=url;
    });
  }

  async function loadUserImage(file){
    if(!file||!file.type.startsWith('image/'))throw new Error('JPEG, PNG 또는 WebP 이미지를 선택해주세요.');
    if(file.size>120*1024*1024)throw new Error('120MB 이하 이미지를 사용해주세요.');
    const img=await loadImageFromBlob(file);
    if(img.width<1000||img.height<500)throw new Error('가로 1000px 이상의 360 이미지를 권장합니다.');
    state.image=img;state.file=file;state.fileName=file.name;state.originalWidth=img.width;state.originalHeight=img.height;
    const crop=cropForTwoToOne(img.width,img.height);state.ratioAdjusted=crop.adjusted;
    els.fileName.textContent=file.name;
    els.fileMeta.textContent=`${img.width.toLocaleString()} × ${img.height.toLocaleString()} · ${(file.size/1024/1024).toFixed(1)}MB${crop.adjusted?' · 2:1 자동 맞춤':''}`;
    setStatus(crop.adjusted?'2:1 자동 맞춤':'이미지 준비됨');
    await renderPreview(true);
  }

  function getPatchOptions(){
    return {
      mode:state.mode,
      logo:state.logo,
      logoBackground:$('#logoBackground').value,
      solidColor:$('#solidColor').value,
      text:$('#patchText').value.trim()||'LavaLabs',
      textBackground:$('#textBackground').value,
      textColor:$('#textColor').value,
      opacity:state.settings.patchOpacity/100
    };
  }

  function fitText(ctx,text,maxWidth,startSize){
    let size=startSize;
    while(size>34){ctx.font=`900 ${size}px "Noto Sans KR", Inter, sans-serif`;if(ctx.measureText(text).width<=maxWidth)break;size-=4;}
    return size;
  }

  function makePatchTexture(size=768){
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d');
    const opts=getPatchOptions();
    const center=size/2;const radius=size*.47;
    ctx.clearRect(0,0,size,size);
    ctx.save();ctx.beginPath();ctx.arc(center,center,radius,0,Math.PI*2);ctx.clip();
    const background=opts.mode==='color'?opts.solidColor:opts.mode==='text'?opts.textBackground:opts.logoBackground;
    ctx.fillStyle=background;ctx.fillRect(0,0,size,size);
    const shine=ctx.createRadialGradient(center*.72,center*.62,size*.05,center,center,radius);
    shine.addColorStop(0,'rgba(255,255,255,.16)');shine.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=shine;ctx.fillRect(0,0,size,size);
    if(opts.mode==='logo'&&opts.logo){
      const max=size*.62;const ratio=opts.logo.width/opts.logo.height;
      let w=max,h=max;
      if(ratio>1)h=w/ratio;else w=h*ratio;
      ctx.drawImage(opts.logo,center-w/2,center-h/2,w,h);
    }else if(opts.mode==='logo'){
      ctx.fillStyle='#c9ff48';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${size*.11}px Inter, sans-serif`;ctx.fillText('YOUR LOGO',center,center);
    }else if(opts.mode==='text'){
      const text=opts.text.slice(0,28);
      const parts=text.length>14?[text.slice(0,14),text.slice(14)]:[text];
      const fontSize=fitText(ctx,parts.reduce((a,b)=>a.length>b.length?a:b,''),size*.7,size*.13);
      ctx.fillStyle=opts.textColor;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${fontSize}px "Noto Sans KR", Inter, sans-serif`;
      const lineHeight=fontSize*1.18;const start=center-(parts.length-1)*lineHeight/2;
      parts.forEach((line,index)=>ctx.fillText(line,center,start+index*lineHeight));
    }
    ctx.restore();
    ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=size*.012;ctx.beginPath();ctx.arc(center,center,radius-size*.008,0,Math.PI*2);ctx.stroke();
    return canvas;
  }

  function drawBaseImage(ctx,width,height,original=false){
    const crop=cropForTwoToOne(state.image.width,state.image.height);
    ctx.save();
    if(!original){
      const {brightness,contrast,saturation,warmth}=state.settings;
      ctx.filter=`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(state.image,crop.sx,crop.sy,crop.sw,crop.sh,0,0,width,height);
      ctx.filter='none';
      if(warmth!==0){
        ctx.globalCompositeOperation='soft-light';
        ctx.globalAlpha=Math.min(.28,Math.abs(warmth)/180);
        ctx.fillStyle=warmth>0?'#ff8c42':'#4b8dff';ctx.fillRect(0,0,width,height);
        ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
      }
    }else{
      ctx.drawImage(state.image,crop.sx,crop.sy,crop.sw,crop.sh,0,0,width,height);
    }
    ctx.restore();
  }

  async function applyNadirPatch(ctx,width,height,patchCanvas,radiusDegrees,rotationDegrees,opacity=1,allowYield=false){
    const radiusRad=clamp(radiusDegrees,5,80)*Math.PI/180;
    const startY=Math.max(0,Math.floor(height*(1-radiusRad/Math.PI)-2));
    const bandHeight=height-startY;
    if(bandHeight<=0)return;
    const imageData=ctx.getImageData(0,startY,width,bandHeight);
    const data=imageData.data;
    const patchCtx=patchCanvas.getContext('2d');
    const patchData=patchCtx.getImageData(0,0,patchCanvas.width,patchCanvas.height).data;
    const pSize=patchCanvas.width;
    const rotation=rotationDegrees*Math.PI/180;
    for(let localY=0;localY<bandHeight;localY++){
      const y=startY+localY;
      const delta=Math.PI*(1-(y+.5)/height);
      const radial=delta/radiusRad;
      if(radial<=1.02){
        for(let x=0;x<width;x++){
          const longitude=((x+.5)/width)*Math.PI*2-Math.PI+rotation;
          const u=.5+.5*radial*Math.cos(longitude);
          const v=.5+.5*radial*Math.sin(longitude);
          if(u<0||u>1||v<0||v>1)continue;
          const px=clamp(Math.floor(u*(pSize-1)),0,pSize-1);
          const py=clamp(Math.floor(v*(pSize-1)),0,pSize-1);
          const pi=(py*pSize+px)*4;
          const alpha=(patchData[pi+3]/255)*opacity;
          if(alpha<=.002)continue;
          const di=(localY*width+x)*4;
          const inv=1-alpha;
          data[di]=patchData[pi]*alpha+data[di]*inv;
          data[di+1]=patchData[pi+1]*alpha+data[di+1]*inv;
          data[di+2]=patchData[pi+2]*alpha+data[di+2]*inv;
          data[di+3]=255;
        }
      }
      if(allowYield&&localY%56===0)await nextFrame();
    }
    ctx.putImageData(imageData,0,startY);
  }

  async function renderCanvas(width,{original=false,yieldRows=false}={}){
    const safeWidth=Math.max(1024,Math.round(width/2)*2);
    const canvas=document.createElement('canvas');canvas.width=safeWidth;canvas.height=safeWidth/2;
    const ctx=canvas.getContext('2d',{alpha:false,willReadFrequently:true});
    drawBaseImage(ctx,canvas.width,canvas.height,original);
    if(!original){
      const patch=makePatchTexture(yieldRows?1024:640);
      await applyNadirPatch(ctx,canvas.width,canvas.height,patch,state.settings.patchSize,state.settings.patchRotation,state.settings.patchOpacity/100,yieldRows);
    }
    return canvas;
  }

  function schedulePreview(){
    clearTimeout(previewDebounce.timer);
    previewDebounce.timer=setTimeout(()=>renderPreview(false),140);
  }

  async function renderPreview(resetView=false){
    if(!state.image)return;
    const token=++state.renderToken;
    readSettings();
    setStatus('미리보기 처리 중','busy');
    try{
      const sourceWidth=cropForTwoToOne(state.image.width,state.image.height).sw;
      const previewWidth=Math.min(4096,Math.max(2048,Math.round(sourceWidth/2)*2));
      const canvas=await renderCanvas(previewWidth,{original:state.showOriginal,yieldRows:false});
      if(token!==state.renderToken)return;
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.9));
      const url=URL.createObjectURL(blob);
      const previous=state.viewerUrl;
      const view=state.viewer&&!resetView?{yaw:state.viewer.getYaw(),pitch:state.viewer.getPitch(),hfov:state.viewer.getHfov()}:{yaw:0,pitch:0,hfov:100};
      if(state.viewer){try{state.viewer.destroy();}catch(error){console.warn(error);}}
      state.viewer=pannellum.viewer('panorama',{
        type:'equirectangular',panorama:url,autoLoad:true,showControls:true,showZoomCtrl:true,showFullscreenCtrl:true,
        yaw:view.yaw,pitch:view.pitch,hfov:view.hfov,minHfov:38,maxHfov:120,mouseZoom:true,draggable:true,friction:.16,
        strings:{loadButtonLabel:'360 이미지 보기',loadingLabel:'이미지 처리 중',bylineLabel:'LavaLabs'}
      });
      state.viewerUrl=url;
      state.viewer.on('load',()=>{if(previous)URL.revokeObjectURL(previous);setStatus(state.showOriginal?'원본 표시 중':'편집본 표시 중');});
      state.viewer.on('error',()=>setStatus('미리보기를 열 수 없습니다','error'));
    }catch(error){console.error(error);setStatus(error.message||'미리보기 오류','error');}
  }

  function setMode(mode){
    state.mode=mode;
    $$('[data-mode]').forEach(button=>button.classList.toggle('active',button.dataset.mode===mode));
    $$('.mode-panel').forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===mode));
    state.showOriginal=false;els.beforeAfter.textContent='원본 보기';schedulePreview();
  }

  const presets={
    natural:{brightness:104,contrast:102,saturation:104,warmth:3},
    bright:{brightness:114,contrast:98,saturation:105,warmth:1},
    warm:{brightness:106,contrast:104,saturation:112,warmth:18},
    night:{brightness:112,contrast:112,saturation:96,warmth:-5}
  };

  async function loadLogo(file){
    if(!file)return;
    if(!file.type.startsWith('image/'))throw new Error('이미지 형식의 로고를 선택해주세요.');
    const img=await loadImageFromBlob(file);
    state.logo=img;state.logoName=file.name;els.logoName.textContent=file.name;setMode('logo');
  }

  function buildGpanoSegment(width,height){
    const encoder=new TextEncoder();
    const header='http://ns.adobe.com/xap/1.0/\0';
    const xml=`<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:GPano="http://ns.google.com/photos/1.0/panorama/" GPano:ProjectionType="equirectangular" GPano:UsePanoramaViewer="True" GPano:CroppedAreaImageWidthPixels="${width}" GPano:CroppedAreaImageHeightPixels="${height}" GPano:FullPanoWidthPixels="${width}" GPano:FullPanoHeightPixels="${height}" GPano:CroppedAreaLeftPixels="0" GPano:CroppedAreaTopPixels="0"/></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
    const payload=encoder.encode(header+xml);
    const length=payload.length+2;
    const segment=new Uint8Array(payload.length+4);
    segment[0]=0xff;segment[1]=0xe1;segment[2]=(length>>8)&0xff;segment[3]=length&0xff;segment.set(payload,4);
    return segment;
  }

  function injectGpanoMetadata(jpegBuffer,width,height){
    const jpeg=new Uint8Array(jpegBuffer);
    if(jpeg[0]!==0xff||jpeg[1]!==0xd8)return jpeg;
    const segment=buildGpanoSegment(width,height);
    const output=new Uint8Array(jpeg.length+segment.length);
    output.set(jpeg.subarray(0,2),0);output.set(segment,2);output.set(jpeg.subarray(2),2+segment.length);
    return output;
  }

  async function resolveExportWidth(){
    const crop=cropForTwoToOne(state.image.width,state.image.height);
    const selected=els.exportSize.value;
    if(selected==='original')return Math.max(1024,Math.round(crop.sw/2)*2);
    return Math.min(Number(selected),Math.max(1024,Math.round(crop.sw/2)*2));
  }

  async function exportImage(){
    if(!state.image)return;
    els.download.disabled=true;els.topDownload.disabled=true;els.exportProgress.classList.add('show');setStatus('고해상도 저장 중','busy');
    try{
      state.showOriginal=false;els.beforeAfter.textContent='원본 보기';readSettings();
      let width=await resolveExportWidth();
      if(width>12000)width=12000;
      let canvas;
      try{canvas=await renderCanvas(width,{original:false,yieldRows:true});}
      catch(error){
        console.warn('Original export failed; falling back to 8K.',error);
        width=Math.min(8192,width);canvas=await renderCanvas(width,{original:false,yieldRows:true});
      }
      const format=els.exportFormat.value;
      const base=(state.fileName||'lava-360').replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9가-힣_-]+/g,'-');
      let blob;
      if(format==='png'){
        blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      }else{
        const quality=Number(els.exportQuality.value)/100;
        const raw=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
        const buffer=await raw.arrayBuffer();
        const withMeta=injectGpanoMetadata(buffer,canvas.width,canvas.height);
        blob=new Blob([withMeta],{type:'image/jpeg'});
      }
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');link.href=url;link.download=`${base}-edited-360.${format==='png'?'png':'jpg'}`;document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),2500);
      setStatus(`${canvas.width.toLocaleString()}×${canvas.height.toLocaleString()} 저장 완료`);
      await renderPreview(false);
    }catch(error){console.error(error);setStatus(error.message||'다운로드 처리 실패','error');alert('이미지 저장 중 문제가 발생했습니다. 8K 또는 4K 해상도로 다시 시도해주세요.');}
    finally{els.download.disabled=false;els.topDownload.disabled=false;els.exportProgress.classList.remove('show');}
  }

  function resetAdjustments(){
    setControls({brightness:100,contrast:100,saturation:100,warmth:0});state.showOriginal=false;els.beforeAfter.textContent='원본 보기';schedulePreview();
  }

  async function resetAll(){
    setControls({brightness:100,contrast:100,saturation:100,warmth:0,patchSize:31,patchRotation:0,patchOpacity:100});
    $('#logoBackground').value='#11161d';$('#solidColor').value='#11161d';$('#textBackground').value='#11161d';$('#textColor').value='#c9ff48';$('#patchText').value='LavaLabs';
    state.logo=null;state.logoName='';els.logoName.textContent='PNG·JPG·WebP 로고를 선택하세요.';setMode('logo');
    state.showOriginal=false;els.beforeAfter.textContent='원본 보기';await renderPreview(true);
  }

  async function loadDemo(){
    setStatus('데모 준비 중','busy');
    const canvas=createDemoCanvas();
    state.image=await canvasToImage(canvas);state.file=null;state.fileName='lava-360-demo.jpg';state.originalWidth=2048;state.originalHeight=1024;state.ratioAdjusted=false;
    els.fileName.textContent='Lava 360 Studio 데모';els.fileMeta.textContent='2048 × 1024 · 편집 기능을 먼저 확인해보세요.';
    await renderPreview(true);
  }

  controlIds.forEach(id=>{
    const input=$(`#${id}`);if(!input)return;updateOutput(input);
    input.addEventListener('input',()=>{updateOutput(input);if(id!=='exportQuality'){readSettings();state.showOriginal=false;els.beforeAfter.textContent='원본 보기';schedulePreview();}});
  });

  $$('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
  $$('.preset-btn').forEach(button=>button.addEventListener('click',()=>{setControls(presets[button.dataset.preset]);state.showOriginal=false;els.beforeAfter.textContent='원본 보기';schedulePreview();}));
  ['logoBackground','solidColor','patchText','textBackground','textColor'].forEach(id=>{
    const input=$(`#${id}`);input.addEventListener(input.type==='text'?'input':'change',()=>{state.showOriginal=false;els.beforeAfter.textContent='원본 보기';schedulePreview();});
  });

  els.imageInput.addEventListener('change',async event=>{try{setStatus('이미지 읽는 중','busy');await loadUserImage(event.target.files[0]);}catch(error){setStatus(error.message,'error');alert(error.message);}finally{event.target.value='';}});
  els.logoInput.addEventListener('change',async event=>{try{setStatus('로고 적용 중','busy');await loadLogo(event.target.files[0]);}catch(error){setStatus(error.message,'error');alert(error.message);}finally{event.target.value='';}});
  els.demo.addEventListener('click',loadDemo);
  els.beforeAfter.addEventListener('click',()=>{state.showOriginal=!state.showOriginal;els.beforeAfter.textContent=state.showOriginal?'편집본 보기':'원본 보기';renderPreview(false);});
  els.floorView.addEventListener('click',()=>{if(state.viewer){state.viewer.setPitch(-90,700);state.viewer.setHfov(82,700);}});
  els.frontView.addEventListener('click',()=>{if(state.viewer){state.viewer.setPitch(0,700);state.viewer.setYaw(0,700);state.viewer.setHfov(100,700);}});
  els.resetAdjust.addEventListener('click',resetAdjustments);els.resetAll.addEventListener('click',resetAll);
  els.download.addEventListener('click',exportImage);els.topDownload.addEventListener('click',exportImage);

  ['dragenter','dragover'].forEach(type=>els.viewerStage.addEventListener(type,event=>{event.preventDefault();els.viewerStage.classList.add('dragging');}));
  ['dragleave','drop'].forEach(type=>els.viewerStage.addEventListener(type,event=>{event.preventDefault();els.viewerStage.classList.remove('dragging');}));
  els.viewerStage.addEventListener('drop',async event=>{const file=event.dataTransfer.files[0];if(!file)return;try{setStatus('이미지 읽는 중','busy');await loadUserImage(file);}catch(error){setStatus(error.message,'error');alert(error.message);}});

  window.addEventListener('beforeunload',()=>{if(state.viewerUrl)URL.revokeObjectURL(state.viewerUrl);});
  loadDemo().catch(error=>{console.error(error);setStatus('데모 로드 실패','error');});
})();
