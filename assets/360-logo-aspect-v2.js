(()=>{
  'use strict';
  if(window.__lavaLogoAspectV2Installed)return;
  window.__lavaLogoAspectV2Installed=true;

  function install(){
    const modal=document.querySelector('#logoEditModal');
    const stage=document.querySelector('#logoEditStage');
    const canvas=document.querySelector('#logoEditCanvas');
    const overlay=document.querySelector('#logoEditOverlay');
    const column=document.querySelector('.logo-edit-preview-column');
    if(!modal||!stage||!canvas||!column)return false;

    const fit=()=>{
      if(modal.hidden||!canvas.width||!canvas.height)return;
      const ratio=canvas.width/canvas.height;
      const columnStyle=getComputedStyle(column);
      const horizontalPadding=parseFloat(columnStyle.paddingLeft||0)+parseFloat(columnStyle.paddingRight||0);
      const availableWidth=Math.max(240,column.clientWidth-horizontalPadding);
      const header=document.querySelector('.logo-edit-header');
      const footer=document.querySelector('.logo-edit-footer');
      const detection=document.querySelector('.logo-edit-detection');
      const previewBar=document.querySelector('.logo-edit-preview-bar');
      const reserved=(header?.offsetHeight||0)+(footer?.offsetHeight||0)+(detection?.offsetHeight||0)+(previewBar?.offsetHeight||0)+118;
      const availableHeight=Math.max(240,Math.min(700,window.innerHeight-reserved));
      let width=availableWidth;
      let height=width/ratio;
      if(height>availableHeight){height=availableHeight;width=height*ratio;}
      stage.style.aspectRatio='auto';
      stage.style.width=`${Math.round(width)}px`;
      stage.style.height=`${Math.round(height)}px`;
      stage.style.maxWidth='100%';
      stage.style.maxHeight='none';
      stage.style.marginInline='auto';
      stage.dataset.fittedRatio=`${canvas.width}:${canvas.height}`;
      canvas.style.width='100%';canvas.style.height='100%';
      if(overlay){overlay.style.width='100%';overlay.style.height='100%';}
    };

    const schedule=()=>requestAnimationFrame(()=>requestAnimationFrame(fit));
    const observer=new MutationObserver(schedule);
    observer.observe(modal,{attributes:true,attributeFilter:['class','hidden'],subtree:false});
    observer.observe(canvas,{attributes:true,attributeFilter:['width','height']});
    new ResizeObserver(schedule).observe(column);
    window.addEventListener('resize',schedule);
    document.querySelector('.logo-reopen-button')?.addEventListener('click',schedule);
    document.querySelector('#logoInput')?.addEventListener('change',()=>setTimeout(schedule,80),true);
    schedule();
    return true;
  }

  if(!install()){
    const observer=new MutationObserver(()=>{if(install())observer.disconnect();});
    observer.observe(document.body,{childList:true,subtree:true});
  }
})();