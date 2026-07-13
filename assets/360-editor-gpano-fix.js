(()=>{
  'use strict';

  const XMP_HEADER='http://ns.adobe.com/xap/1.0/\0';
  const state={armedUntil:0,sourceMeta:{},sourceName:'',installed:false};
  const originalToBlob=HTMLCanvasElement.prototype.toBlob;
  const originalConvertToBlob=typeof OffscreenCanvas!=='undefined'&&OffscreenCanvas.prototype.convertToBlob;

  const textEncoder=new TextEncoder();
  const textDecoder=new TextDecoder('utf-8',{fatal:false});
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

  function toast(message,error=false){
    const existing=$('#editorToast');
    if(existing){
      existing.textContent=message;
      existing.classList.toggle('error',error);
      existing.classList.add('show');
      clearTimeout(existing.__gpanoTimer);
      existing.__gpanoTimer=setTimeout(()=>existing.classList.remove('show'),3200);
      return;
    }
    let box=$('#gpanoCompatToast');
    if(!box){box=document.createElement('div');box.id='gpanoCompatToast';document.body.appendChild(box)}
    box.textContent=message;box.classList.toggle('error',error);box.classList.add('show');
    clearTimeout(box.__timer);box.__timer=setTimeout(()=>box.classList.remove('show'),3200);
  }

  function enabled(){return $('#naver360Compat')?.checked!==false}
  function isArmed(){return enabled()&&Date.now()<state.armedUntil}
  function arm(){state.armedUntil=Date.now()+30000}
  function disarm(){state.armedUntil=0}

  function cleanNumber(value,fallback=0){
    const n=Number.parseFloat(String(value??'').replace(/[^0-9+\-.]/g,''));
    return Number.isFinite(n)?n:fallback;
  }

  function getInitialHeading(){
    const candidates=['#startViewValue','#initialHeading','#startYaw','[data-start-heading]'];
    for(const selector of candidates){
      const node=$(selector);if(!node)continue;
      const raw=node.value??node.dataset.startHeading??node.textContent;
      const n=cleanNumber(raw,NaN);if(Number.isFinite(n))return((n%360)+360)%360;
    }
    return cleanNumber(state.sourceMeta.InitialViewHeadingDegrees,state.sourceMeta.PoseHeadingDegrees||0);
  }

  function buildXmp(width,height){
    const heading=getInitialHeading();
    const poseHeading=cleanNumber(state.sourceMeta.PoseHeadingDegrees,heading);
    const posePitch=cleanNumber(state.sourceMeta.PosePitchDegrees,0);
    const poseRoll=cleanNumber(state.sourceMeta.PoseRollDegrees,0);
    const initialPitch=cleanNumber(state.sourceMeta.InitialViewPitchDegrees,0);
    const initialRoll=cleanNumber(state.sourceMeta.InitialViewRollDegrees,0);
    const initialFov=cleanNumber(state.sourceMeta.InitialHorizontalFOVDegrees,90);
    return `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>\n`+
`<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="LavaLabs 360 Editor">\n`+
` <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n`+
`  <rdf:Description rdf:about="" xmlns:GPano="http://ns.google.com/photos/1.0/panorama/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/">\n`+
`   <GPano:UsePanoramaViewer>True</GPano:UsePanoramaViewer>\n`+
`   <GPano:ProjectionType>equirectangular</GPano:ProjectionType>\n`+
`   <GPano:StitchingSoftware>LavaLabs 360 Editor</GPano:StitchingSoftware>\n`+
`   <GPano:PoseHeadingDegrees>${poseHeading.toFixed(1)}</GPano:PoseHeadingDegrees>\n`+
`   <GPano:PosePitchDegrees>${posePitch.toFixed(1)}</GPano:PosePitchDegrees>\n`+
`   <GPano:PoseRollDegrees>${poseRoll.toFixed(1)}</GPano:PoseRollDegrees>\n`+
`   <GPano:InitialViewHeadingDegrees>${Math.round(heading)}</GPano:InitialViewHeadingDegrees>\n`+
`   <GPano:InitialViewPitchDegrees>${Math.round(initialPitch)}</GPano:InitialViewPitchDegrees>\n`+
`   <GPano:InitialViewRollDegrees>${Math.round(initialRoll)}</GPano:InitialViewRollDegrees>\n`+
`   <GPano:InitialHorizontalFOVDegrees>${initialFov.toFixed(1)}</GPano:InitialHorizontalFOVDegrees>\n`+
`   <GPano:CroppedAreaLeftPixels>0</GPano:CroppedAreaLeftPixels>\n`+
`   <GPano:CroppedAreaTopPixels>0</GPano:CroppedAreaTopPixels>\n`+
`   <GPano:CroppedAreaImageWidthPixels>${width}</GPano:CroppedAreaImageWidthPixels>\n`+
`   <GPano:CroppedAreaImageHeightPixels>${height}</GPano:CroppedAreaImageHeightPixels>\n`+
`   <GPano:FullPanoWidthPixels>${width}</GPano:FullPanoWidthPixels>\n`+
`   <GPano:FullPanoHeightPixels>${height}</GPano:FullPanoHeightPixels>\n`+
`   <xmp:CreatorTool>LavaLabs 360 Editor</xmp:CreatorTool>\n`+
`   <dc:format>image/jpeg</dc:format>\n`+
`  </rdf:Description>\n`+
` </rdf:RDF>\n`+
`</x:xmpmeta>\n<?xpacket end="w"?>`;
  }

  function app1Segment(xml){
    const header=textEncoder.encode(XMP_HEADER),body=textEncoder.encode(xml);
    const payloadLength=header.length+body.length;
    if(payloadLength+2>65535)throw new Error('360 메타데이터가 JPEG APP1 허용 크기를 초과했습니다.');
    const segment=new Uint8Array(payloadLength+4);
    segment[0]=0xff;segment[1]=0xe1;
    const length=payloadLength+2;
    segment[2]=(length>>8)&0xff;segment[3]=length&0xff;
    segment.set(header,4);segment.set(body,4+header.length);
    return segment;
  }

  function startsWith(bytes,offset,signature){
    if(offset+signature.length>bytes.length)return false;
    for(let i=0;i<signature.length;i++)if(bytes[offset+i]!==signature[i])return false;
    return true;
  }

  function findInsertOffset(bytes){
    let offset=2;
    while(offset+4<=bytes.length&&bytes[offset]===0xff){
      const marker=bytes[offset+1];
      if(marker===0xda||marker===0xd9)return offset;
      if(marker===0x00||marker===0xff){offset++;continue}
      if(marker===0xd8||marker===0x01||(marker>=0xd0&&marker<=0xd7)){offset+=2;continue}
      const length=(bytes[offset+2]<<8)|bytes[offset+3];
      if(length<2||offset+2+length>bytes.length)return offset;
      if(marker===0xe0||marker===0xe1||marker===0xe2||marker===0xed){offset+=2+length;continue}
      return offset;
    }
    return 2;
  }

  function removeExistingGpano(bytes){
    const pieces=[bytes.slice(0,2)];
    let offset=2,last=2;
    const xmpSignature=textEncoder.encode(XMP_HEADER);
    while(offset+4<=bytes.length&&bytes[offset]===0xff){
      const marker=bytes[offset+1];
      if(marker===0xda||marker===0xd9)break;
      if(marker===0x00||marker===0xff){offset++;continue}
      if(marker===0xd8||marker===0x01||(marker>=0xd0&&marker<=0xd7)){offset+=2;continue}
      const length=(bytes[offset+2]<<8)|bytes[offset+3];
      const end=offset+2+length;
      if(length<2||end>bytes.length)break;
      let remove=false;
      if(marker===0xe1&&startsWith(bytes,offset+4,xmpSignature)){
        const sample=textDecoder.decode(bytes.slice(offset+4+xmpSignature.length,Math.min(end,offset+4+xmpSignature.length+8192)));
        remove=sample.includes('http://ns.google.com/photos/1.0/panorama/')||sample.includes('GPano:ProjectionType');
      }
      if(remove){
        if(last<offset)pieces.push(bytes.slice(last,offset));
        last=end;
      }
      offset=end;
    }
    if(last===2)return bytes;
    pieces.push(bytes.slice(last));
    const size=pieces.reduce((sum,p)=>sum+p.length,0),out=new Uint8Array(size);
    let cursor=0;for(const piece of pieces){out.set(piece,cursor);cursor+=piece.length}
    return out;
  }

  async function injectGpano(blob,width,height){
    if(!blob||blob.type&&!/jpe?g/i.test(blob.type))return blob;
    if(width!==height*2)throw new Error(`360 전체 구면 이미지는 2:1 비율이어야 합니다. 현재 ${width}×${height}입니다.`);
    let bytes=new Uint8Array(await blob.arrayBuffer());
    if(bytes[0]!==0xff||bytes[1]!==0xd8)throw new Error('JPEG 파일 구조를 확인할 수 없습니다.');
    bytes=removeExistingGpano(bytes);
    const xmp=app1Segment(buildXmp(width,height));
    const insert=findInsertOffset(bytes);
    const out=new Uint8Array(bytes.length+xmp.length);
    out.set(bytes.slice(0,insert),0);out.set(xmp,insert);out.set(bytes.slice(insert),insert+xmp.length);
    const patched=new Blob([out],{type:'image/jpeg'});
    const check=textDecoder.decode(out.slice(0,Math.min(out.length,262144)));
    if(!check.includes('GPano:ProjectionType')||!check.includes(`<GPano:FullPanoWidthPixels>${width}</GPano:FullPanoWidthPixels>`))throw new Error('360 메타데이터 검증에 실패했습니다.');
    return patched;
  }

  function parseSourceMeta(file){
    if(!file||!/^image\/jpe?g$/i.test(file.type))return;
    state.sourceName=file.name||'';
    file.slice(0,4*1024*1024).arrayBuffer().then(buffer=>{
      const text=textDecoder.decode(new Uint8Array(buffer));
      const names=['PoseHeadingDegrees','PosePitchDegrees','PoseRollDegrees','InitialViewHeadingDegrees','InitialViewPitchDegrees','InitialViewRollDegrees','InitialHorizontalFOVDegrees'];
      const meta={};
      for(const name of names){
        const match=text.match(new RegExp(`<GPano:${name}>([^<]+)</GPano:${name}>`,'i'))||text.match(new RegExp(`GPano:${name}="([^"]+)"`,'i'));
        if(match)meta[name]=match[1];
      }
      state.sourceMeta=meta;
      const status=$('#gpanoSourceState');
      if(status)status.textContent=text.includes('GPano:ProjectionType')?'원본 360 메타데이터 감지됨':'원본은 2:1 이미지이며 저장 시 360 메타데이터를 새로 삽입합니다.';
    }).catch(()=>{});
  }

  function forceJpeg(){
    const format=$('#exportFormat')||$('select[name*="format" i]')||$$('select').find(select=>[...select.options].some(option=>/JPEG/i.test(option.textContent||option.value)));
    if(!format)return;
    const option=[...format.options].find(item=>/jpe?g/i.test(item.value)||/JPEG/i.test(item.textContent));
    if(option&&format.value!==option.value){format.value=option.value;format.dispatchEvent(new Event('change',{bubbles:true}))}
  }

  function shouldArmButton(button){
    const text=(button.textContent||'').replace(/\s+/g,' ').trim();
    if(/프로젝트|설정|JSON|시작 화면/i.test(text))return false;
    return /다운로드|이미지 저장|결과 저장|내보내기/i.test(text)&&!!button.closest('[data-editor-section="export"],.export-card,.viewer-toolbar,.editor-export');
  }

  HTMLCanvasElement.prototype.toBlob=function(callback,type,quality){
    const canvas=this;
    return originalToBlob.call(canvas,async blob=>{
      if(!isArmed()||!blob||!/image\/jpe?g/i.test(blob.type||type||'')){callback(blob);return}
      try{
        const patched=await injectGpano(blob,canvas.width,canvas.height);
        disarm();toast('네이버 360 호환 메타데이터를 넣어 저장했습니다.');callback(patched);
      }catch(error){
        disarm();toast(error.message||'360 메타데이터 삽입에 실패했습니다.',true);callback(blob);
      }
    },type,quality);
  };

  if(originalConvertToBlob){
    OffscreenCanvas.prototype.convertToBlob=async function(options){
      const blob=await originalConvertToBlob.call(this,options);
      if(!isArmed()||!blob||!/image\/jpe?g/i.test(blob.type||options?.type||''))return blob;
      try{const patched=await injectGpano(blob,this.width,this.height);disarm();toast('네이버 360 호환 메타데이터를 넣어 저장했습니다.');return patched}
      catch(error){disarm();toast(error.message||'360 메타데이터 삽입에 실패했습니다.',true);return blob}
    };
  }

  async function repairExisting(file){
    if(!file)return;
    if(!/^image\/jpe?g$/i.test(file.type)){toast('네이버 360 호환 저장은 JPEG 파일만 지원합니다.',true);return}
    try{
      const bitmap=await createImageBitmap(file);
      const {width,height}=bitmap;bitmap.close?.();
      const patched=await injectGpano(file,width,height);
      const a=document.createElement('a');
      const url=URL.createObjectURL(patched);
      a.href=url;a.download=(file.name.replace(/\.jpe?g$/i,'')||'lava-360-edited')+'-naver360.jpg';
      document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
      toast('기존 JPEG에 360 메타데이터를 복구했습니다.');
    }catch(error){toast(error.message||'메타데이터 복구에 실패했습니다.',true)}
  }

  function installUi(){
    if(state.installed)return true;
    const exportRoot=$('[data-editor-section="export"]')||$('.export-card')||$$('section,article,div').find(node=>/결과 저장|내보내기|EXPORT/i.test(node.querySelector('h2,h3')?.textContent||''));
    if(!exportRoot)return false;
    state.installed=true;
    const style=document.createElement('style');
    style.textContent=`
      .gpano-compat{margin:14px 0;padding:14px;border:1px solid #b8cf68;border-radius:14px;background:#f4fadf;color:#344400}
      .gpano-compat label{display:flex;gap:10px;align-items:flex-start;font-size:11px;font-weight:900;cursor:pointer}
      .gpano-compat input[type=checkbox]{width:18px;height:18px;flex:none;accent-color:#708f00}
      .gpano-compat p{margin:7px 0 0;color:#596b22;font-size:10px;line-height:1.65}
      .gpano-compat-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}
      .gpano-repair-label{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:9px 11px;border:1px solid #b8c893;border-radius:10px;background:#fff;color:#35420e;font-size:10px;font-weight:850;cursor:pointer}
      .gpano-repair-label input{display:none}
      #gpanoSourceState{align-self:center;color:#66733a;font-size:9px}
      #gpanoCompatToast{position:fixed;right:18px;bottom:18px;z-index:10000;max-width:min(380px,calc(100vw - 36px));padding:13px 16px;border-radius:13px;background:#11161d;color:#fff;font-size:11px;font-weight:800;opacity:0;transform:translateY(12px);pointer-events:none;transition:.2s}
      #gpanoCompatToast.show{opacity:1;transform:none}#gpanoCompatToast.error{background:#8b2a24}
    `;
    document.head.appendChild(style);
    const box=document.createElement('div');box.className='gpano-compat';
    box.innerHTML=`<label><input id="naver360Compat" type="checkbox" checked><span>네이버 블로그 360 호환 JPEG로 저장</span></label><p>저장 시 JPEG를 2:1 구면 이미지로 확인하고 GPano XMP 메타데이터를 삽입합니다. 이 정보가 없으면 네이버에서 긴 평면 사진으로 표시될 수 있습니다.</p><div class="gpano-compat-actions"><label class="gpano-repair-label">이미 저장한 JPEG 메타데이터 복구<input id="gpanoRepairInput" type="file" accept="image/jpeg"></label><span id="gpanoSourceState">원본 메타데이터 확인 전</span></div>`;
    const actions=exportRoot.querySelector('.export-actions,.card-actions,[class*="export-action"]');
    if(actions)actions.insertAdjacentElement('beforebegin',box);else exportRoot.appendChild(box);
    $('#naver360Compat')?.addEventListener('change',event=>{if(event.target.checked){forceJpeg();toast('네이버 360 호환 모드를 켰습니다. JPEG로 저장됩니다.')}});
    $('#gpanoRepairInput')?.addEventListener('change',event=>{repairExisting(event.target.files?.[0]);event.target.value=''});
    const imageInput=$('#imageInput');imageInput?.addEventListener('change',event=>parseSourceMeta(event.target.files?.[0]));
    return true;
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest('button,a');if(!button||!shouldArmButton(button))return;
    if(enabled()){forceJpeg();arm()}
  },true);

  document.addEventListener('change',event=>{
    if(event.target.matches('#imageInput'))parseSourceMeta(event.target.files?.[0]);
    if(event.target.matches('#exportFormat')&&enabled()&&!/jpe?g/i.test(event.target.value)){forceJpeg();toast('네이버 360 호환 모드에서는 JPEG 형식을 사용합니다.')}
  },true);

  if(!installUi()){
    const observer=new MutationObserver(()=>{if(installUi())observer.disconnect()});
    observer.observe(document.documentElement,{subtree:true,childList:true});
    setTimeout(()=>observer.disconnect(),20000);
  }
})();