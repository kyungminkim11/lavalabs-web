(()=>{
  if(window.__PARTYROOM_REVIEW_NATIVE_SHARE__) return;
  window.__PARTYROOM_REVIEW_NATIVE_SHARE__ = true;

  const ready = () => {
    const actionCard = document.querySelector('.action-card');
    const oldKakaoButton = document.getElementById('kakaoButton');
    const oldShareButton = document.getElementById('shareButton');
    const copyButton = document.getElementById('copyButton');
    const preview = document.getElementById('previewText');
    const toast = document.getElementById('toast');

    if(!actionCard || !preview) return;

    if(oldShareButton) oldShareButton.hidden = true;

    const sourceButton = oldKakaoButton || oldShareButton;
    if(!sourceButton) return;

    const nativeButton = sourceButton.cloneNode(true);
    nativeButton.id = 'kakaoButton';
    nativeButton.type = 'button';
    nativeButton.textContent = '카카오톡으로 공유하기';
    nativeButton.setAttribute('aria-label','휴대폰 공유창을 열어 카카오톡으로 답변 공유하기');
    sourceButton.replaceWith(nativeButton);

    actionCard.classList.add('native-share-mode');

    const style = document.createElement('style');
    style.textContent = `
      .action-card.native-share-mode{grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr)}
      .action-card.native-share-mode #kakaoButton{background:#fee500;color:#191919}
      .action-card.native-share-mode #shareButton[hidden]{display:none!important}
      @media(max-width:620px){
        .action-card.native-share-mode{grid-template-columns:1fr}
        .action-card.native-share-mode #kakaoButton{order:-1;min-height:56px}
      }
    `;
    document.head.appendChild(style);

    let toastTimer;
    const showToast = (message,duration=2600) => {
      if(!toast) return;
      clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add('show');
      toastTimer = setTimeout(()=>toast.classList.remove('show'),duration);
    };

    const answerText = () => {
      const text = (preview.textContent || '').trim();
      return text && text !== '작성하면 여기에 자동으로 정리됩니다.'
        ? text
        : '[퓨처스페이스 홈페이지 운영 정보 답변]\n아직 작성된 내용이 없습니다.';
    };

    const copyFallback = async () => {
      const text = answerText();
      try{
        if(navigator.clipboard && window.isSecureContext){
          await navigator.clipboard.writeText(text);
          showToast('공유 기능을 사용할 수 없어 답변을 복사했습니다. 카카오톡에 붙여넣어 주세요.',3600);
          return;
        }
      }catch(error){ console.warn(error); }

      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try{ document.execCommand('copy'); }catch(error){ console.warn(error); }
      area.remove();
      showToast('답변을 복사했습니다. 카카오톡에 붙여넣어 주세요.',3200);
    };

    nativeButton.addEventListener('click', async () => {
      const shareData = {
        title: '퓨처스페이스 홈페이지 운영 정보',
        text: answerText()
      };

      if(navigator.share){
        try{
          await navigator.share(shareData);
          return;
        }catch(error){
          if(error && error.name === 'AbortError') return;
          console.warn(error);
        }
      }

      await copyFallback();
    });

    if(copyButton){
      copyButton.setAttribute('aria-label','답변 내용을 클립보드에 복사하기');
    }
  };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',ready,{once:true});
  }else{
    ready();
  }
})();
