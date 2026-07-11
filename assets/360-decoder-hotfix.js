(()=>{
  'use strict';

  const nativeCreateImageBitmap=window.createImageBitmap?.bind(window);
  const isAndroid=/Android/i.test(navigator.userAgent);
  const isImageBlob=value=>value instanceof Blob&&/^image\//i.test(value.type||'');

  if(!isAndroid||!nativeCreateImageBitmap)return;

  function decodeWithImageElement(blob){
    return new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(blob);
      const image=new Image();
      image.decoding='sync';
      image.onload=()=>{
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror=()=>{
        URL.revokeObjectURL(url);
        reject(new Error('안드로이드 이미지 디코더로 사진을 읽지 못했습니다.'));
      };
      image.src=url;
    });
  }

  window.createImageBitmap=(source,...options)=>{
    if(isImageBlob(source))return decodeWithImageElement(source);
    return nativeCreateImageBitmap(source,...options);
  };

  document.documentElement.dataset.android360Decoder='html-image';
})();