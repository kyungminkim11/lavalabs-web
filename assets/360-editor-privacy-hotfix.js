(()=>{
  'use strict';
  if(window.__lavaPrivacyDecoderHotfixInstalled)return;
  window.__lavaPrivacyDecoderHotfixInstalled=true;

  const originalImageDecoder=window.ImageDecoder;
  let restoreTimer=0;

  function forceScaledBitmapFallback(){
    if(!originalImageDecoder)return;
    window.ImageDecoder=undefined;
    clearTimeout(restoreTimer);
    restoreTimer=setTimeout(()=>{window.ImageDecoder=originalImageDecoder;},1500);
  }

  document.querySelector('#openPrivacyEditor')?.addEventListener('click',forceScaledBitmapFallback,true);
  document.querySelector('#privacyApply')?.addEventListener('click',forceScaledBitmapFallback,true);
})();