(()=>{
  'use strict';
  let attempts=0;
  const timer=setInterval(()=>{
    const modal=document.querySelector('#logoEditModal');
    const buttons=Array.from(document.querySelectorAll('[data-pro-tab="transform"],[data-pro-tab="edge"]'));
    if(!modal||buttons.length<2){
      if(++attempts>120)clearInterval(timer);
      return;
    }
    clearInterval(timer);
    buttons.forEach(button=>button.addEventListener('click',event=>{
      if(button.dataset.lavaRefreshed==='1'){
        delete button.dataset.lavaRefreshed;
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      button.dataset.lavaRefreshed='1';
      modal.classList.toggle('logo-pro-base-refresh');
      setTimeout(()=>button.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})),0);
    },true));
    if(!modal.hidden&&modal.classList.contains('visible'))modal.classList.toggle('logo-pro-base-refresh');
  },50);
})();