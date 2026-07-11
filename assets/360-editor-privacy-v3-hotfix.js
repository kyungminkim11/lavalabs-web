(()=>{
  'use strict';
  if(window.__lavaPrivacyV3HotfixInstalled)return;
  window.__lavaPrivacyV3HotfixInstalled=true;

  const originalAdd=EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener=function(type,listener,options){
    if(type==='pointerdown'&&this instanceof Element&&this.closest?.('#privacyV3Viewer')&&options&&typeof options==='object'&&options.once){
      options={...options,once:false};
    }
    return originalAdd.call(this,type,listener,options);
  };

  if(window.pannellum?.viewer&&!window.pannellum.viewer.__lavaElementFix){
    const originalViewer=window.pannellum.viewer.bind(window.pannellum);
    const fixed=(container,config)=>{
      if(container instanceof Element){
        if(!container.id)container.id=`lava-pano-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
        container=container.id;
      }
      return originalViewer(container,config);
    };
    fixed.__lavaElementFix=true;
    window.pannellum.viewer=fixed;
  }

  function readJpegSize(buffer){
    const view=new DataView(buffer);if(view.byteLength<4||view.getUint16(0)!==0xffd8)return null;let offset=2;
    while(offset+9<view.byteLength){if(view.getUint8(offset)!==0xff){offset++;continue;}const marker=view.getUint8(offset+1);if(marker===0xd8||marker===0xd9){offset+=2;continue;}const length=view.getUint16(offset+2);if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))return{height:view.getUint16(offset+5),width:view.getUint16(offset+7)};if(length<2)break;offset+=2+length;}return null;
  }
  async function dimensions(file){
    const head=await file.slice(0,262144).arrayBuffer();
    if(file.type==='image/png'&&head.byteLength>=24){const view=new DataView(head);return{width:view.getUint32(16),height:view.getUint32(20)};}
    if(file.type==='image/jpeg'||/\.jpe?g$/i.test(file.name||'')){const value=readJpegSize(head);if(value)return value;}
    return null;
  }
  async function scaledCanvas(file,width,height){
    if('ImageDecoder'in window){let decoder;try{decoder=new ImageDecoder({data:file.stream(),type:file.type||'image/jpeg'});await decoder.tracks.ready;const result=await decoder.decode({frameIndex:0,completeFramesOnly:true,desiredWidth:width,desiredHeight:height});const frame=result.image;const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').drawImage(frame,0,0,width,height);frame.close();decoder.close();return canvas;}catch(error){try{decoder?.close();}catch{}console.warn('privacy v3 ImageDecoder fallback',error);}}
    const url=URL.createObjectURL(file);try{return await new Promise((resolve,reject)=>{const image=new Image();image.decoding='sync';image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').drawImage(image,0,0,width,height);resolve(canvas);};image.onerror=()=>reject(new Error('이미지를 읽지 못했습니다.'));image.src=url;});}finally{URL.revokeObjectURL(url);}
  }

  function installSafeDecode(button){
    button.addEventListener('click',()=>{
      const native=window.createImageBitmap?.bind(window);
      if(!native)return;
      let active=true;
      window.createImageBitmap=async(source,options)=>{
        if(active&&source instanceof Blob&&/^image\//i.test(source.type||'')){
          if(!options?.resizeWidth&&!options?.resizeHeight){
            const size=await dimensions(source);
            if(size)return{width:size.width,height:size.height,close(){}};
          }
          if(options?.resizeWidth&&options?.resizeHeight)return scaledCanvas(source,options.resizeWidth,options.resizeHeight);
        }
        return native(source,options);
      };
      setTimeout(()=>{active=false;window.createImageBitmap=native;},12000);
    },true);
  }

  function finalizeUi(){
    const button=document.querySelector('#openPrivacyEditorV3');
    if(button&&!button.dataset.safeDecode){button.dataset.safeDecode='true';installSafeDecode(button);}
    const done=document.querySelector('#privacyV3PolygonDone');
    const cancel=document.querySelector('#privacyV3PolygonCancel');
    if(done){done.disabled=false;done.textContent='현재 경로 완료';}
    if(cancel)cancel.disabled=false;
  }

  const observer=new MutationObserver(finalizeUi);
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});
  finalizeUi();
})();