(()=>{
  'use strict';

  const input=document.querySelector('#logoInput');
  if(!input)return;

  let redispatching=false;

  const showToast=(message,isError=false)=>{
    const toast=document.querySelector('#editorToast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.toggle('error',isError);
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),3200);
  };

  const loadImage=file=>new Promise((resolve,reject)=>{
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

  const hasRealTransparency=data=>{
    const total=data.length/4;
    let transparent=0;
    for(let i=3;i<data.length;i+=4){
      if(data[i]<245)transparent++;
    }
    return transparent/total>0.001;
  };

  const isLightNeutral=(data,index)=>{
    const r=data[index];
    const g=data[index+1];
    const b=data[index+2];
    const a=data[index+3];
    if(a<220)return false;
    const max=Math.max(r,g,b);
    const min=Math.min(r,g,b);
    const luminance=(r*0.2126)+(g*0.7152)+(b*0.0722);
    return max-min<=30&&luminance>=165;
  };

  const removeConnectedLightBackground=(canvas,ctx)=>{
    const {width,height}=canvas;
    const imageData=ctx.getImageData(0,0,width,height);
    const data=imageData.data;
    if(hasRealTransparency(data))return {changed:false,canvas};

    let eligibleBorder=0;
    let borderCount=0;
    const sampleBorder=(x,y)=>{
      borderCount++;
      if(isLightNeutral(data,(y*width+x)*4))eligibleBorder++;
    };
    for(let x=0;x<width;x++){
      sampleBorder(x,0);
      if(height>1)sampleBorder(x,height-1);
    }
    for(let y=1;y<height-1;y++){
      sampleBorder(0,y);
      if(width>1)sampleBorder(width-1,y);
    }

    if(!borderCount||eligibleBorder/borderCount<0.35){
      return {changed:false,canvas};
    }

    const total=width*height;
    const visited=new Uint8Array(total);
    const queue=new Int32Array(total);
    let head=0;
    let tail=0;

    const enqueue=(x,y)=>{
      const position=y*width+x;
      if(visited[position])return;
      const pixelIndex=position*4;
      if(!isLightNeutral(data,pixelIndex))return;
      visited[position]=1;
      queue[tail++]=position;
    };

    for(let x=0;x<width;x++){
      enqueue(x,0);
      enqueue(x,height-1);
    }
    for(let y=1;y<height-1;y++){
      enqueue(0,y);
      enqueue(width-1,y);
    }

    while(head<tail){
      const position=queue[head++];
      const x=position%width;
      const y=(position/width)|0;
      if(x>0)enqueue(x-1,y);
      if(x<width-1)enqueue(x+1,y);
      if(y>0)enqueue(x,y-1);
      if(y<height-1)enqueue(x,y+1);
    }

    if(tail/total<0.01)return {changed:false,canvas};

    for(let position=0;position<total;position++){
      if(visited[position])data[position*4+3]=0;
    }
    ctx.putImageData(imageData,0,0);

    let minX=width;
    let minY=height;
    let maxX=-1;
    let maxY=-1;
    const updated=ctx.getImageData(0,0,width,height).data;
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        if(updated[(y*width+x)*4+3]>8){
          minX=Math.min(minX,x);
          minY=Math.min(minY,y);
          maxX=Math.max(maxX,x);
          maxY=Math.max(maxY,y);
        }
      }
    }

    if(maxX<minX||maxY<minY)return {changed:true,canvas};

    const boxWidth=maxX-minX+1;
    const boxHeight=maxY-minY+1;
    const padding=Math.max(4,Math.round(Math.max(boxWidth,boxHeight)*0.025));
    const cropX=Math.max(0,minX-padding);
    const cropY=Math.max(0,minY-padding);
    const cropWidth=Math.min(width-cropX,boxWidth+padding*2);
    const cropHeight=Math.min(height-cropY,boxHeight+padding*2);

    const cropped=document.createElement('canvas');
    cropped.width=cropWidth;
    cropped.height=cropHeight;
    cropped.getContext('2d').drawImage(canvas,cropX,cropY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);
    return {changed:true,canvas:cropped};
  };

  const processLogo=async file=>{
    const {image,url}=await loadImage(file);
    try{
      const maxSide=1600;
      const scale=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight));
      const width=Math.max(1,Math.round(image.naturalWidth*scale));
      const height=Math.max(1,Math.round(image.naturalHeight*scale));
      const canvas=document.createElement('canvas');
      canvas.width=width;
      canvas.height=height;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.clearRect(0,0,width,height);
      ctx.drawImage(image,0,0,width,height);

      const result=removeConnectedLightBackground(canvas,ctx);
      if(!result.changed)return {changed:false};

      const blob=await new Promise((resolve,reject)=>{
        result.canvas.toBlob(value=>value?resolve(value):reject(new Error('투명 로고 생성에 실패했습니다.')),'image/png');
      });
      return {changed:true,blob};
    }finally{
      URL.revokeObjectURL(url);
    }
  };

  input.addEventListener('change',async event=>{
    if(redispatching){
      redispatching=false;
      return;
    }

    const file=input.files?.[0];
    if(!file||file.type!=='image/png')return;

    event.preventDefault();
    event.stopImmediatePropagation();

    try{
      const result=await processLogo(file);
      if(result.changed){
        const base=file.name.replace(/\.png$/i,'');
        const fixedFile=new File([result.blob],`${base}-transparent.png`,{type:'image/png',lastModified:Date.now()});
        const transfer=new DataTransfer();
        transfer.items.add(fixedFile);
        input.files=transfer.files;
        showToast('격자 배경을 실제 투명으로 자동 변환했습니다.');
      }
      redispatching=true;
      input.dispatchEvent(new Event('change',{bubbles:true}));
    }catch(error){
      console.error(error);
      showToast(error.message||'로고 투명 처리 중 오류가 발생했습니다.',true);
      redispatching=true;
      input.dispatchEvent(new Event('change',{bubbles:true}));
    }
  },true);

  const logoDrop=document.querySelector('#logoDrop');
  if(logoDrop){
    const hint=logoDrop.querySelector('span');
    if(hint)hint.textContent='실제 투명 PNG 권장 · 격자 배경 자동 제거 지원';
  }
})();