(()=>{
  'use strict';

  const nativeCreateImageBitmap=window.createImageBitmap?.bind(window);
  const isAndroid=/Android/i.test(navigator.userAgent);
  const isImageBlob=value=>value instanceof Blob&&/^image\//i.test(value.type||'');

  if(isAndroid&&nativeCreateImageBitmap){
    const decodeWithImageElement=blob=>new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(blob);
      const image=new Image();
      image.decoding='sync';
      image.onload=()=>{URL.revokeObjectURL(url);resolve(image);};
      image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('안드로이드 이미지 디코더로 사진을 읽지 못했습니다.'));};
      image.src=url;
    });

    window.createImageBitmap=(source,...options)=>isImageBlob(source)
      ?decodeWithImageElement(source)
      :nativeCreateImageBitmap(source,...options);

    document.documentElement.dataset.android360Decoder='html-image';
  }

  const script=document.createElement('script');
  script.src='assets/360-editor-v3.js?v=20260711d';
  script.async=false;
  script.onerror=()=>{
    const status=document.querySelector('#statusPill');
    if(status){status.textContent='편집기 로드 실패';status.classList.add('error');}
  };
  document.body.appendChild(script);
})();