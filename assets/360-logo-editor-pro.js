(()=>{
  'use strict';
  if(window.__lavaLogoEditorProInstalled)return;
  window.__lavaLogoEditorProInstalled=true;

  const VERSION='20260711m';
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href=`assets/360-logo-editor-pro.css?v=${VERSION}`;
  document.head.appendChild(style);

  const waitForEditor=()=>new Promise((resolve,reject)=>{
    let count=0;
    const timer=setInterval(()=>{
      const modal=document.querySelector('#logoEditModal');
      const canvas=document.querySelector('#logoEditCanvas');
      const controls=modal?.querySelector('.logo-edit-controls');
      if(modal&&canvas&&controls){clearInterval(timer);resolve({modal,canvas,controls});}
      else if(++count>120){clearInterval(timer);reject(new Error('로고 편집기 확장 UI를 찾지 못했습니다.'));}
    },50);
  });

  const cloneCanvas=source=>{
    const output=document.createElement('canvas');
    output.width=source.width;
    output.height=source.height;
    output.getContext('2d').drawImage(source,0,0);
    return output;
  };

  const canvasBlob=(canvas,type='image/png',quality=.95)=>new Promise((resolve,reject)=>{
    canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('이미지 파일을 만들지 못했습니다.')),type,quality);
  });

  const toast=(message,isError=false)=>{
    const target=document.querySelector('#editorToast');
    if(!target)return;
    target.textContent=message;
    target.classList.toggle('error',isError);
    target.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>target.classList.remove('show'),3200);
  };

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  waitForEditor().then(({modal,canvas,controls})=>{
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const historyCard=controls.querySelector('.logo-edit-history-card');
    const proCard=document.createElement('section');
    proCard.className='logo-edit-card logo-pro-card';
    proCard.innerHTML=`
      <div class="logo-edit-card-head">
        <div><span>ADVANCED</span><h3>고급 로고 편집</h3></div>
        <span class="logo-edit-badge" id="logoProBadge">LOCAL</span>
      </div>
      <div class="logo-pro-tabs" role="tablist" aria-label="고급 로고 편집">
        <button class="active" type="button" data-pro-tab="transform">변형</button>
        <button type="button" data-pro-tab="crop">자르기</button>
        <button type="button" data-pro-tab="edge">가장자리</button>
        <button type="button" data-pro-tab="output">내보내기</button>
      </div>

      <div class="logo-pro-panel active" data-pro-panel="transform">
        <p class="logo-pro-help">로고의 크기·위치·회전을 조정합니다. 슬라이더는 원본 기준으로 다시 그려져 화질 저하를 줄입니다.</p>
        <label class="logo-edit-range"><span><b>확대/축소</b><output id="proScaleOutput">100%</output></span><input id="proScale" type="range" min="20" max="300" value="100"></label>
        <label class="logo-edit-range"><span><b>회전</b><output id="proRotateOutput">0°</output></span><input id="proRotate" type="range" min="-180" max="180" value="0"></label>
        <div class="logo-edit-two-ranges">
          <label class="logo-edit-range"><span><b>가로 위치</b><output id="proXOutput">0%</output></span><input id="proX" type="range" min="-100" max="100" value="0"></label>
          <label class="logo-edit-range"><span><b>세로 위치</b><output id="proYOutput">0%</output></span><input id="proY" type="range" min="-100" max="100" value="0"></label>
        </div>
        <div class="logo-pro-button-grid four">
          <button type="button" id="proRotateLeft">↶ 90°</button>
          <button type="button" id="proRotateRight">↷ 90°</button>
          <button type="button" id="proFlipX">↔ 좌우</button>
          <button type="button" id="proFlipY">↕ 상하</button>
        </div>
        <div class="logo-pro-actions">
          <button type="button" id="proTransformReset">변형 초기화</button>
          <button class="primary" type="button" id="proTransformCommit">변형 적용</button>
        </div>
      </div>

      <div class="logo-pro-panel" data-pro-panel="crop">
        <p class="logo-pro-help">가운데를 기준으로 원하는 비율만 남기거나 투명한 외곽을 정리합니다.</p>
        <div class="logo-pro-button-grid">
          <button type="button" data-crop-ratio="1">1:1 정사각형</button>
          <button type="button" data-crop-ratio="1.333333">4:3</button>
          <button type="button" data-crop-ratio="1.777778">16:9</button>
          <button type="button" id="proCropContent">내용에 맞춤</button>
        </div>
        <label class="logo-edit-range"><span><b>자르기 여백</b><output id="proCropPaddingOutput">3%</output></span><input id="proCropPadding" type="range" min="0" max="25" value="3"></label>
        <div class="logo-pro-button-grid">
          <button type="button" id="proCenterContent">투명 캔버스 중앙 정렬</button>
          <button type="button" id="proSquareCanvas">정사각형 캔버스 확장</button>
        </div>
      </div>

      <div class="logo-pro-panel" data-pro-panel="edge">
        <p class="logo-pro-help">배경 제거 뒤 남는 흰 테두리와 거친 알파 가장자리를 다듬습니다.</p>
        <label class="logo-edit-range"><span><b>알파 기준값</b><output id="proAlphaThresholdOutput">8</output></span><input id="proAlphaThreshold" type="range" min="0" max="240" value="8"></label>
        <label class="logo-edit-range"><span><b>가장자리 축소/확장</b><output id="proAlphaMorphOutput">0px</output></span><input id="proAlphaMorph" type="range" min="-6" max="6" value="0"></label>
        <label class="logo-edit-range"><span><b>가장자리 부드럽게</b><output id="proAlphaBlurOutput">0px</output></span><input id="proAlphaBlur" type="range" min="0" max="12" value="0"></label>
        <label class="logo-edit-range"><span><b>전체 불투명도</b><output id="proOpacityOutput">100%</output></span><input id="proOpacity" type="range" min="5" max="100" value="100"></label>
        <div class="logo-pro-button-grid">
          <button type="button" id="proRemoveWhiteFringe">흰색 테두리 제거</button>
          <button type="button" id="proRemoveBlackFringe">검은 테두리 제거</button>
        </div>
        <div class="logo-pro-actions">
          <button type="button" id="proEdgePreview">미리보기 갱신</button>
          <button class="primary" type="button" id="proEdgeApply">가장자리 적용</button>
        </div>
      </div>

      <div class="logo-pro-panel" data-pro-panel="output">
        <div class="logo-pro-diagnostics" id="logoProDiagnostics">
          <div><span>크기</span><strong>-</strong></div>
          <div><span>투명 영역</span><strong>-</strong></div>
          <div><span>예상 PNG</span><strong>-</strong></div>
        </div>
        <label class="logo-edit-check"><input id="proIncludePadding" type="checkbox"><span>다운로드 시 현재 투명 여백 유지</span></label>
        <div class="logo-pro-button-grid">
          <button type="button" id="proDownloadPng">투명 PNG 다운로드</button>
          <button type="button" id="proCopyPng">PNG 클립보드 복사</button>
        </div>
        <div class="logo-pro-drop" id="logoProDrop" tabindex="0">
          <strong>새 로고를 끌어 놓거나 붙여넣기</strong>
          <span>Ctrl/⌘ + V · JPEG, PNG, WebP</span>
        </div>
      </div>`;
    controls.insertBefore(proCard,historyCard||null);

    const $=selector=>proCard.querySelector(selector);
    const $$=selector=>Array.from(proCard.querySelectorAll(selector));
    const logoInput=document.querySelector('#logoInput');
    let transformBase=null;
    let edgeBase=null;
    let flipX=1;
    let flipY=1;
    let rotateOffset=0;
    let diagnosticTimer=0;

    const syncCanvasSize=(width,height)=>{
      canvas.width=Math.max(1,Math.round(width));
      canvas.height=Math.max(1,Math.round(height));
      const overlay=document.querySelector('#logoEditOverlay');
      if(overlay){overlay.width=canvas.width;overlay.height=canvas.height;}
      const stage=document.querySelector('#logoEditStage');
      stage?.style.setProperty('--logo-aspect',`${canvas.width}/${canvas.height}`);
    };

    const replaceCanvas=source=>{
      syncCanvasSize(source.width,source.height);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(source,0,0);
      refreshDiagnostics();
      document.querySelector('#logoEditOverlay')?.dispatchEvent(new Event('pointerleave'));
    };

    const captureTransformBase=()=>{
      transformBase=cloneCanvas(canvas);
      flipX=1;
      flipY=1;
      rotateOffset=0;
      $('#proScale').value='100';
      $('#proRotate').value='0';
      $('#proX').value='0';
      $('#proY').value='0';
      updateTransformOutputs();
    };

    const updateTransformOutputs=()=>{
      $('#proScaleOutput').textContent=`${$('#proScale').value}%`;
      $('#proRotateOutput').textContent=`${Number($('#proRotate').value)+rotateOffset}°`;
      $('#proXOutput').textContent=`${$('#proX').value}%`;
      $('#proYOutput').textContent=`${$('#proY').value}%`;
    };

    const renderTransform=()=>{
      if(!transformBase)captureTransformBase();
      const width=transformBase.width;
      const height=transformBase.height;
      const out=document.createElement('canvas');
      out.width=width;
      out.height=height;
      const outCtx=out.getContext('2d');
      const scale=Number($('#proScale').value)/100;
      const rotation=(Number($('#proRotate').value)+rotateOffset)*Math.PI/180;
      const offsetX=Number($('#proX').value)/100*width*.5;
      const offsetY=Number($('#proY').value)/100*height*.5;
      outCtx.translate(width/2+offsetX,height/2+offsetY);
      outCtx.rotate(rotation);
      outCtx.scale(scale*flipX,scale*flipY);
      outCtx.drawImage(transformBase,-width/2,-height/2,width,height);
      replaceCanvas(out);
      updateTransformOutputs();
    };

    const commitTransform=()=>{
      transformBase=cloneCanvas(canvas);
      flipX=1;
      flipY=1;
      rotateOffset=0;
      $('#proScale').value='100';
      $('#proRotate').value='0';
      $('#proX').value='0';
      $('#proY').value='0';
      updateTransformOutputs();
      toast('로고 변형을 적용했습니다.');
    };

    const resetTransform=()=>{
      if(transformBase)replaceCanvas(transformBase);
      flipX=1;
      flipY=1;
      rotateOffset=0;
      $('#proScale').value='100';
      $('#proRotate').value='0';
      $('#proX').value='0';
      $('#proY').value='0';
      updateTransformOutputs();
    };

    const transparentBounds=source=>{
      const sourceCtx=source.getContext('2d',{willReadFrequently:true});
      const {width,height}=source;
      const data=sourceCtx.getImageData(0,0,width,height).data;
      let minX=width,minY=height,maxX=-1,maxY=-1,count=0;
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        if(data[(y*width+x)*4+3]>6){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);count++;}
      }
      return maxX<minX?null:{minX,minY,maxX,maxY,count};
    };

    const cropCanvas=(sx,sy,sw,sh)=>{
      const out=document.createElement('canvas');
      out.width=Math.max(1,Math.round(sw));
      out.height=Math.max(1,Math.round(sh));
      out.getContext('2d').drawImage(canvas,sx,sy,sw,sh,0,0,out.width,out.height);
      replaceCanvas(out);
      captureTransformBase();
    };

    const cropRatio=ratio=>{
      const current=canvas.width/canvas.height;
      let sw=canvas.width,sh=canvas.height;
      if(current>ratio)sw=sh*ratio;else sh=sw/ratio;
      cropCanvas((canvas.width-sw)/2,(canvas.height-sh)/2,sw,sh);
      toast('선택한 비율로 가운데 영역을 잘랐습니다.');
    };

    const cropToContent=()=>{
      const bounds=transparentBounds(canvas);
      if(!bounds){toast('남아 있는 로고 영역이 없습니다.',true);return;}
      const padding=Number($('#proCropPadding').value)/100;
      const bw=bounds.maxX-bounds.minX+1;
      const bh=bounds.maxY-bounds.minY+1;
      const pad=Math.round(Math.max(bw,bh)*padding);
      const sx=Math.max(0,bounds.minX-pad);
      const sy=Math.max(0,bounds.minY-pad);
      const ex=Math.min(canvas.width,bounds.maxX+1+pad);
      const ey=Math.min(canvas.height,bounds.maxY+1+pad);
      cropCanvas(sx,sy,ex-sx,ey-sy);
      toast('로고 내용에 맞춰 투명 여백을 정리했습니다.');
    };

    const centerContent=()=>{
      const bounds=transparentBounds(canvas);
      if(!bounds){toast('정렬할 로고 영역이 없습니다.',true);return;}
      const out=document.createElement('canvas');
      out.width=canvas.width;
      out.height=canvas.height;
      const bw=bounds.maxX-bounds.minX+1;
      const bh=bounds.maxY-bounds.minY+1;
      out.getContext('2d').drawImage(canvas,bounds.minX,bounds.minY,bw,bh,(out.width-bw)/2,(out.height-bh)/2,bw,bh);
      replaceCanvas(out);
      captureTransformBase();
      toast('로고 내용을 캔버스 중앙에 정렬했습니다.');
    };

    const squareCanvas=()=>{
      const side=Math.max(canvas.width,canvas.height);
      const out=document.createElement('canvas');
      out.width=side;
      out.height=side;
      out.getContext('2d').drawImage(canvas,(side-canvas.width)/2,(side-canvas.height)/2);
      replaceCanvas(out);
      captureTransformBase();
      toast('로고를 정사각형 투명 캔버스 중앙에 배치했습니다.');
    };

    const alphaMorph=(alpha,width,height,radius,expand)=>{
      if(radius<=0)return alpha;
      let source=new Uint8ClampedArray(alpha);
      for(let pass=0;pass<radius;pass++){
        const next=new Uint8ClampedArray(source.length);
        for(let y=0;y<height;y++)for(let x=0;x<width;x++){
          let value=expand?0:255;
          for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
            const nx=clamp(x+ox,0,width-1),ny=clamp(y+oy,0,height-1);
            const sample=source[ny*width+nx];
            value=expand?Math.max(value,sample):Math.min(value,sample);
          }
          next[y*width+x]=value;
        }
        source=next;
      }
      return source;
    };

    const blurAlpha=(alpha,width,height,radius)=>{
      if(radius<=0)return alpha;
      const horizontal=new Float32Array(alpha.length);
      const output=new Uint8ClampedArray(alpha.length);
      for(let y=0;y<height;y++){
        let sum=0;
        for(let x=-radius;x<=radius;x++)sum+=alpha[y*width+clamp(x,0,width-1)];
        for(let x=0;x<width;x++){
          horizontal[y*width+x]=sum/(radius*2+1);
          sum-=alpha[y*width+clamp(x-radius,0,width-1)];
          sum+=alpha[y*width+clamp(x+radius+1,0,width-1)];
        }
      }
      for(let x=0;x<width;x++){
        let sum=0;
        for(let y=-radius;y<=radius;y++)sum+=horizontal[clamp(y,0,height-1)*width+x];
        for(let y=0;y<height;y++){
          output[y*width+x]=Math.round(sum/(radius*2+1));
          sum-=horizontal[clamp(y-radius,0,height-1)*width+x];
          sum+=horizontal[clamp(y+radius+1,0,height-1)*width+x];
        }
      }
      return output;
    };

    const renderEdgePreview=()=>{
      if(!edgeBase)edgeBase=cloneCanvas(canvas);
      const out=cloneCanvas(edgeBase);
      const outCtx=out.getContext('2d',{willReadFrequently:true});
      const image=outCtx.getImageData(0,0,out.width,out.height);
      const data=image.data;
      const alpha=new Uint8ClampedArray(out.width*out.height);
      const threshold=Number($('#proAlphaThreshold').value);
      const opacity=Number($('#proOpacity').value)/100;
      for(let i=0,p=0;i<data.length;i+=4,p++)alpha[p]=data[i+3]<threshold?0:Math.round(data[i+3]*opacity);
      const morph=Number($('#proAlphaMorph').value);
      let processed=alphaMorph(alpha,out.width,out.height,Math.abs(morph),morph>0);
      processed=blurAlpha(processed,out.width,out.height,Number($('#proAlphaBlur').value));
      for(let i=3,p=0;i<data.length;i+=4,p++)data[i]=processed[p];
      outCtx.putImageData(image,0,0);
      replaceCanvas(out);
      updateEdgeOutputs();
    };

    const commitEdge=()=>{
      edgeBase=cloneCanvas(canvas);
      $('#proAlphaThreshold').value='8';
      $('#proAlphaMorph').value='0';
      $('#proAlphaBlur').value='0';
      $('#proOpacity').value='100';
      updateEdgeOutputs();
      toast('가장자리 보정을 적용했습니다.');
    };

    const removeFringe=background=>{
      const image=ctx.getImageData(0,0,canvas.width,canvas.height);
      const data=image.data;
      for(let i=0;i<data.length;i+=4){
        const a=data[i+3]/255;
        if(a<=0||a>=.995)continue;
        for(let channel=0;channel<3;channel++){
          if(background===255)data[i+channel]=clamp(Math.round((data[i+channel]-255*(1-a))/Math.max(a,.01)),0,255);
          else data[i+channel]=clamp(Math.round(data[i+channel]/Math.max(a,.01)),0,255);
        }
      }
      ctx.putImageData(image,0,0);
      edgeBase=cloneCanvas(canvas);
      refreshDiagnostics();
      toast(background===255?'반투명 가장자리의 흰색 번짐을 줄였습니다.':'반투명 가장자리의 검은색 번짐을 줄였습니다.');
    };

    const prepareOutputCanvas=()=>{
      if($('#proIncludePadding').checked)return cloneCanvas(canvas);
      const bounds=transparentBounds(canvas);
      if(!bounds)return cloneCanvas(canvas);
      const out=document.createElement('canvas');
      out.width=bounds.maxX-bounds.minX+1;
      out.height=bounds.maxY-bounds.minY+1;
      out.getContext('2d').drawImage(canvas,bounds.minX,bounds.minY,out.width,out.height,0,0,out.width,out.height);
      return out;
    };

    const downloadPng=async()=>{
      const out=prepareOutputCanvas();
      const blob=await canvasBlob(out);
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');
      const source=(document.querySelector('#logoName')?.textContent||'logo').replace(/\.[^.]+$/,'').replace(/[^\w가-힣-]+/g,'-');
      anchor.href=url;
      anchor.download=`${source||'logo'}-transparent.png`;
      anchor.click();
      setTimeout(()=>URL.revokeObjectURL(url),2000);
      toast('편집한 투명 PNG를 다운로드했습니다.');
    };

    const copyPng=async()=>{
      try{
        if(!navigator.clipboard||typeof ClipboardItem==='undefined')throw new Error('이 브라우저는 이미지 복사를 지원하지 않습니다.');
        const blob=await canvasBlob(prepareOutputCanvas());
        await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
        toast('투명 PNG를 클립보드에 복사했습니다.');
      }catch(error){toast(error.message||'클립보드 복사에 실패했습니다.',true);}
    };

    const refreshDiagnostics=()=>{
      clearTimeout(diagnosticTimer);
      diagnosticTimer=setTimeout(async()=>{
        const diagnostics=$('#logoProDiagnostics');
        if(!diagnostics||!canvas.width)return;
        const image=ctx.getImageData(0,0,canvas.width,canvas.height).data;
        let transparent=0,semi=0;
        for(let i=3;i<image.length;i+=4){if(image[i]<8)transparent++;else if(image[i]<247)semi++;}
        const total=image.length/4;
        diagnostics.children[0].querySelector('strong').textContent=`${canvas.width.toLocaleString()} × ${canvas.height.toLocaleString()}`;
        diagnostics.children[1].querySelector('strong').textContent=`${Math.round((transparent+semi)/total*100)}%`;
        try{
          const blob=await canvasBlob(canvas);
          diagnostics.children[2].querySelector('strong').textContent=blob.size>1048576?`${(blob.size/1048576).toFixed(1)}MB`:`${Math.round(blob.size/1024)}KB`;
        }catch{diagnostics.children[2].querySelector('strong').textContent='계산 실패';}
      },180);
    };

    const loadExternalFile=file=>{
      if(!file||!/^image\/(png|jpeg|webp)$/i.test(file.type)){toast('JPEG, PNG 또는 WebP 이미지를 선택해주세요.',true);return;}
      const transfer=new DataTransfer();
      transfer.items.add(file);
      logoInput.files=transfer.files;
      logoInput.dispatchEvent(new Event('change',{bubbles:true}));
    };

    const updateEdgeOutputs=()=>{
      $('#proAlphaThresholdOutput').textContent=$('#proAlphaThreshold').value;
      $('#proAlphaMorphOutput').textContent=`${$('#proAlphaMorph').value}px`;
      $('#proAlphaBlurOutput').textContent=`${$('#proAlphaBlur').value}px`;
      $('#proOpacityOutput').textContent=`${$('#proOpacity').value}%`;
    };

    $$('[data-pro-tab]').forEach(button=>button.addEventListener('click',()=>{
      $$('[data-pro-tab]').forEach(item=>item.classList.toggle('active',item===button));
      $$('[data-pro-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.proPanel===button.dataset.proTab));
      if(button.dataset.proTab==='transform'&&!transformBase)captureTransformBase();
      if(button.dataset.proTab==='edge'&&!edgeBase)edgeBase=cloneCanvas(canvas);
      if(button.dataset.proTab==='output')refreshDiagnostics();
    }));

    ['proScale','proRotate','proX','proY'].forEach(id=>$('#'+id).addEventListener('input',renderTransform));
    $('#proRotateLeft').addEventListener('click',()=>{rotateOffset-=90;renderTransform();});
    $('#proRotateRight').addEventListener('click',()=>{rotateOffset+=90;renderTransform();});
    $('#proFlipX').addEventListener('click',()=>{flipX*=-1;renderTransform();});
    $('#proFlipY').addEventListener('click',()=>{flipY*=-1;renderTransform();});
    $('#proTransformReset').addEventListener('click',resetTransform);
    $('#proTransformCommit').addEventListener('click',commitTransform);

    $$('[data-crop-ratio]').forEach(button=>button.addEventListener('click',()=>cropRatio(Number(button.dataset.cropRatio))));
    $('#proCropContent').addEventListener('click',cropToContent);
    $('#proCenterContent').addEventListener('click',centerContent);
    $('#proSquareCanvas').addEventListener('click',squareCanvas);
    $('#proCropPadding').addEventListener('input',()=>$('#proCropPaddingOutput').textContent=`${$('#proCropPadding').value}%`);

    ['proAlphaThreshold','proAlphaMorph','proAlphaBlur','proOpacity'].forEach(id=>$('#'+id).addEventListener('input',()=>{updateEdgeOutputs();renderEdgePreview();}));
    $('#proEdgePreview').addEventListener('click',renderEdgePreview);
    $('#proEdgeApply').addEventListener('click',commitEdge);
    $('#proRemoveWhiteFringe').addEventListener('click',()=>removeFringe(255));
    $('#proRemoveBlackFringe').addEventListener('click',()=>removeFringe(0));
    $('#proDownloadPng').addEventListener('click',()=>downloadPng().catch(error=>toast(error.message,true)));
    $('#proCopyPng').addEventListener('click',copyPng);

    const drop=$('#logoProDrop');
    drop.addEventListener('dragover',event=>{event.preventDefault();drop.classList.add('dragging');});
    drop.addEventListener('dragleave',()=>drop.classList.remove('dragging'));
    drop.addEventListener('drop',event=>{event.preventDefault();drop.classList.remove('dragging');loadExternalFile(event.dataTransfer?.files?.[0]);});
    drop.addEventListener('click',()=>logoInput?.click());

    window.addEventListener('paste',event=>{
      if(modal.hidden)return;
      const item=Array.from(event.clipboardData?.items||[]).find(entry=>entry.type.startsWith('image/'));
      const file=item?.getAsFile();
      if(file){event.preventDefault();loadExternalFile(file);}
    });

    window.addEventListener('keydown',event=>{
      if(modal.hidden)return;
      const target=event.target;
      if(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement||target instanceof HTMLSelectElement)return;
      if(event.key.toLowerCase()==='d'&&(event.ctrlKey||event.metaKey)){event.preventDefault();downloadPng().catch(error=>toast(error.message,true));}
      if(event.key.toLowerCase()==='c'&&(event.ctrlKey||event.metaKey)&&event.shiftKey){event.preventDefault();copyPng();}
      if(event.key==='ArrowLeft'&&transformBase){event.preventDefault();$('#proX').value=String(clamp(Number($('#proX').value)-1,-100,100));renderTransform();}
      if(event.key==='ArrowRight'&&transformBase){event.preventDefault();$('#proX').value=String(clamp(Number($('#proX').value)+1,-100,100));renderTransform();}
      if(event.key==='ArrowUp'&&transformBase){event.preventDefault();$('#proY').value=String(clamp(Number($('#proY').value)-1,-100,100));renderTransform();}
      if(event.key==='ArrowDown'&&transformBase){event.preventDefault();$('#proY').value=String(clamp(Number($('#proY').value)+1,-100,100));renderTransform();}
    },true);

    const visibleObserver=new MutationObserver(()=>{
      if(!modal.hidden&&modal.classList.contains('visible')){
        transformBase=cloneCanvas(canvas);
        edgeBase=cloneCanvas(canvas);
        refreshDiagnostics();
      }
    });
    visibleObserver.observe(modal,{attributes:true,attributeFilter:['class','hidden']});

    const originalApply=document.querySelector('#logoApplyEdited');
    originalApply?.addEventListener('click',()=>{transformBase=null;edgeBase=null;},true);

    updateTransformOutputs();
    updateEdgeOutputs();
    $('#proCropPaddingOutput').textContent=`${$('#proCropPadding').value}%`;
    refreshDiagnostics();
  }).catch(error=>console.error(error));
})();