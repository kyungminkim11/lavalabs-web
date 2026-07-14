(()=>{
  'use strict';
  if(!/\/floorplan-editor\.html$/i.test(location.pathname)) return;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const app=$('#floorplanApp');
  const stageWrap=$('#stageWrap');
  const stage=$('#stage');
  const svg=$('#floorplanSvg');
  const inspector=$('.fp-inspector');
  const selectedType=$('#selectedType');
  if(!app||!stageWrap||!stage||!svg) return;

  const mq=matchMedia('(max-width:850px)');
  const MOBILE_HELP_KEY='lava-floorplan-mobile-help-v2';
  const gesture={mode:'navigate',scale:1,panX:0,panY:0,pointers:new Map(),start:null};
  let inspectorHome=null;
  let inspectorNext=null;

  const style=document.createElement('style');
  style.textContent=`
    .fp-mobile-only{display:none!important}
    @media(max-width:850px){
      body.fp-mobile-editor-active{padding-bottom:84px!important}
      .fp-mobile-only{display:flex!important}
      .fp-canvas-toolbar{display:none!important}
      .fp-stage-wrap{position:relative;isolation:isolate;overscroll-behavior:contain;background:#c8d1c5!important}
      .fp-stage{will-change:transform;transform:translate3d(var(--fp-mobile-pan-x,0px),var(--fp-mobile-pan-y,0px),0) scale(var(--fp-mobile-scale,1))!important;transform-origin:center center!important;transition:transform .18s ease}
      .fp-stage-wrap.fp-mobile-gesture-active .fp-stage{transition:none}
      .fp-stage-wrap[data-mobile-mode="navigate"]{cursor:grab}
      .fp-stage-wrap[data-mobile-mode="navigate"].fp-mobile-gesture-active{cursor:grabbing}
      .fp-stage-wrap[data-mobile-mode="edit"]{cursor:crosshair}
      .fp-mobile-canvas-hud{position:absolute;z-index:8;left:16px;right:16px;top:16px;display:flex!important;align-items:center;justify-content:space-between;gap:8px;pointer-events:none}
      .fp-mobile-hud-pill{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:7px 10px;border:1px solid rgba(255,255,255,.72);border-radius:999px;background:rgba(17,22,29,.82);color:#fff;box-shadow:0 8px 25px rgba(17,22,29,.2);backdrop-filter:blur(12px);font-size:10px;font-weight:900;pointer-events:auto}
      .fp-mobile-hud-pill b{color:#c9ff48}
      .fp-mobile-hud-pill button{width:24px;height:24px;padding:0;border:0;border-radius:50%;background:#ffffff18;color:#fff;font:900 14px/1 sans-serif;cursor:pointer}
      .fp-mobile-jump{display:grid!important;grid-template-columns:1fr auto;gap:8px;padding:10px 12px;border-bottom:1px solid var(--fp-line);background:#f8faf6}
      .fp-mobile-jump button{min-height:44px;border:1px solid #ced6cb;border-radius:12px;background:#fff;color:#222d35;font-size:11px;font-weight:900}
      .fp-mobile-jump button:first-child{background:#11161d;border-color:#11161d;color:#c9ff48}
      .fp-mobile-toolbar{position:fixed;z-index:10020;left:8px;right:8px;bottom:max(8px,env(safe-area-inset-bottom));display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;padding:6px;border:1px solid #ffffff2c;border-radius:18px;background:rgba(17,22,29,.95);box-shadow:0 18px 50px rgba(0,0,0,.3);backdrop-filter:blur(16px);transform:translateY(calc(100% + 24px));opacity:0;pointer-events:none;transition:.22s ease}
      .fp-mobile-toolbar.is-visible{transform:none;opacity:1;pointer-events:auto}
      .fp-mobile-tool{display:grid;place-items:center;gap:2px;min-width:0;min-height:52px;padding:5px 2px;border:0;border-radius:12px;background:transparent;color:#e9edf0;font-family:inherit;cursor:pointer}
      .fp-mobile-tool b{font-size:17px;line-height:1}.fp-mobile-tool span{font-size:8px;font-weight:850;white-space:nowrap}
      .fp-mobile-tool.active{background:#c9ff48;color:#11161d}.fp-mobile-tool:disabled{opacity:.35}
      .fp-mobile-selected-action{position:fixed;z-index:10019;right:12px;bottom:calc(max(8px,env(safe-area-inset-bottom)) + 72px);display:none!important;align-items:center;gap:7px;min-height:42px;padding:8px 12px;border:1px solid #cfdbc5;border-radius:999px;background:#fff;color:#1b252e;box-shadow:0 12px 34px rgba(17,22,29,.16);font-size:10px;font-weight:900;cursor:pointer}
      .fp-mobile-selected-action.show{display:flex!important}
      .fp-mobile-selected-action b{display:grid;place-items:center;min-width:24px;height:24px;padding:0 7px;border-radius:999px;background:#eef5da;color:#546b00;font-size:8px}
      .fp-mobile-scrim{position:fixed;z-index:10030;inset:0;display:block!important;background:rgba(7,11,15,.5);opacity:0;pointer-events:none;transition:.2s}
      .fp-mobile-scrim.show{opacity:1;pointer-events:auto}
      .fp-mobile-sheet{position:fixed;z-index:10031;left:0;right:0;bottom:0;display:block!important;max-height:min(78dvh,760px);padding:0 12px max(14px,env(safe-area-inset-bottom));border-radius:24px 24px 0 0;background:#f5f7f2;box-shadow:0 -22px 60px rgba(0,0,0,.25);transform:translateY(105%);transition:.24s ease;overflow:hidden}
      .fp-mobile-sheet.show{transform:none}
      .fp-mobile-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 2px 9px}
      .fp-mobile-sheet-head:before{content:'';position:absolute;left:50%;top:7px;width:40px;height:4px;border-radius:999px;background:#c5cbc2;transform:translateX(-50%)}
      .fp-mobile-sheet-head strong{font-size:14px}.fp-mobile-sheet-head button{width:38px;height:38px;border:1px solid #d7ddd2;border-radius:12px;background:#fff;font-size:18px}
      .fp-mobile-sheet-body{max-height:calc(min(78dvh,760px) - 62px);padding:2px 0 20px;overflow:auto;overscroll-behavior:contain}
      .fp-mobile-sheet .fp-panel{margin:0;border-radius:16px;box-shadow:none}
      .fp-mobile-tool-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
      .fp-mobile-tool-grid button{display:grid;place-items:center;gap:4px;min-height:62px;padding:8px 4px;border:1px solid #dbe1d7;border-radius:12px;background:#fff;color:#33404a;font-size:9px;font-weight:850}
      .fp-mobile-tool-grid button b{font-size:17px}.fp-mobile-tool-grid button.active{border-color:#9dc329;background:#eff8d4;color:#334400}
      .fp-mobile-sheet-section{margin-top:12px;padding:13px;border:1px solid #dfe4da;border-radius:15px;background:#fff}
      .fp-mobile-sheet-section h3{margin:0 0 10px;font-size:12px}
      .fp-mobile-furniture{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
      .fp-mobile-furniture button{min-height:39px;padding:6px 3px;border:1px solid #dfe4da;border-radius:10px;background:#f8faf6;color:#38444d;font-size:8px;font-weight:850}
      .fp-mobile-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
      .fp-mobile-actions button{min-height:42px;border:1px solid #d8ded4;border-radius:11px;background:#fff;color:#29343d;font-size:9px;font-weight:900}
      .fp-mobile-actions button.primary{background:#11161d;border-color:#11161d;color:#c9ff48}
      .fp-mobile-gesture-tip{position:absolute;z-index:9;left:50%;bottom:16px;display:grid!important;gap:2px;width:min(300px,calc(100% - 32px));padding:10px 12px;border-radius:13px;background:rgba(17,22,29,.9);color:#fff;text-align:center;box-shadow:0 12px 35px rgba(17,22,29,.2);transform:translate(-50%,12px);opacity:0;pointer-events:none;transition:.25s}
      .fp-mobile-gesture-tip.show{transform:translate(-50%,0);opacity:1}.fp-mobile-gesture-tip b{font-size:10px}.fp-mobile-gesture-tip span{color:#cbd2d7;font-size:8px}
      .fp-mobile-editor-active .fp-toast{bottom:88px!important}
    }
    @media(max-width:420px){
      .fp-mobile-toolbar{grid-template-columns:repeat(6,minmax(45px,1fr));overflow-x:auto}.fp-mobile-tool{min-width:48px}
      .fp-mobile-tool-grid,.fp-mobile-furniture{grid-template-columns:repeat(3,1fr)}
    }
  `;
  document.head.appendChild(style);

  const jump=document.createElement('div');
  jump.className='fp-mobile-jump fp-mobile-only';
  jump.innerHTML='<button type="button" data-mobile-jump="canvas">캔버스에서 편집하기</button><button type="button" data-mobile-jump="save">PNG 저장</button>';
  $('.fp-topbar',app)?.insertAdjacentElement('afterend',jump);

  const hud=document.createElement('div');
  hud.className='fp-mobile-canvas-hud fp-mobile-only';
  hud.innerHTML='<div class="fp-mobile-hud-pill"><b id="fpMobileModeLabel">이동·확대</b><span id="fpMobileZoomLabel">100%</span></div><div class="fp-mobile-hud-pill"><button type="button" id="fpMobileZoomOut" aria-label="축소">−</button><button type="button" id="fpMobileFit" aria-label="화면 맞춤">⌂</button><button type="button" id="fpMobileZoomIn" aria-label="확대">＋</button></div>';
  stageWrap.appendChild(hud);

  const tip=document.createElement('div');
  tip.className='fp-mobile-gesture-tip fp-mobile-only';
  tip.innerHTML='<b>도면 이동 모드</b><span>한 손가락으로 이동하고 두 손가락으로 확대·축소하세요.</span>';
  stageWrap.appendChild(tip);

  const toolbar=document.createElement('nav');
  toolbar.className='fp-mobile-toolbar fp-mobile-only';
  toolbar.setAttribute('aria-label','모바일 도면 편집 도구');
  toolbar.innerHTML=`
    <button class="fp-mobile-tool active" type="button" data-mobile-mode="navigate"><b>✥</b><span>이동</span></button>
    <button class="fp-mobile-tool" type="button" data-mobile-tool="select"><b>↖</b><span>선택</span></button>
    <button class="fp-mobile-tool" type="button" data-mobile-tool="room"><b>▭</b><span>방</span></button>
    <button class="fp-mobile-tool" type="button" data-mobile-tool="wall"><b>╱</b><span>벽</span></button>
    <button class="fp-mobile-tool" type="button" data-mobile-tool="door"><b>◜</b><span>문</span></button>
    <button class="fp-mobile-tool" type="button" data-mobile-sheet="tools"><b>•••</b><span>더보기</span></button>`;
  document.body.appendChild(toolbar);

  const selectedAction=document.createElement('button');
  selectedAction.className='fp-mobile-selected-action fp-mobile-only';
  selectedAction.type='button';
  selectedAction.innerHTML='<b id="fpMobileSelectedBadge">ITEM</b><span>선택 요소 설정</span>';
  document.body.appendChild(selectedAction);

  const scrim=document.createElement('div');
  scrim.className='fp-mobile-scrim fp-mobile-only';
  document.body.appendChild(scrim);

  const toolsSheet=document.createElement('section');
  toolsSheet.className='fp-mobile-sheet fp-mobile-only';
  toolsSheet.setAttribute('aria-label','도면 도구 더보기');
  toolsSheet.innerHTML=`<div class="fp-mobile-sheet-head"><strong>도구 더보기</strong><button type="button" data-sheet-close aria-label="닫기">×</button></div><div class="fp-mobile-sheet-body"><div class="fp-mobile-tool-grid">
    <button type="button" data-proxy-tool="window"><b>═</b>창문</button><button type="button" data-proxy-tool="dimension"><b>↔</b>치수</button><button type="button" data-proxy-tool="text"><b>T</b>텍스트</button><button type="button" data-proxy-tool="camera"><b>360</b>촬영점</button>
  </div><div class="fp-mobile-sheet-section"><h3>가구·시설 추가</h3><div class="fp-mobile-furniture" id="fpMobileFurniture"></div></div><div class="fp-mobile-sheet-section"><h3>편집·저장</h3><div class="fp-mobile-actions"><button type="button" data-proxy-action="undo">실행 취소</button><button type="button" data-proxy-action="redo">다시 실행</button><button type="button" data-proxy-action="delete">선택 삭제</button><button type="button" data-proxy-action="fit">화면 맞춤</button><button type="button" data-proxy-action="settings">요소 설정</button><button class="primary" type="button" data-proxy-action="png">PNG 저장</button></div></div></div>`;
  document.body.appendChild(toolsSheet);

  const inspectorSheet=document.createElement('section');
  inspectorSheet.className='fp-mobile-sheet fp-mobile-only';
  inspectorSheet.setAttribute('aria-label','선택 요소 설정');
  inspectorSheet.innerHTML='<div class="fp-mobile-sheet-head"><strong>선택 요소 설정</strong><button type="button" data-sheet-close aria-label="닫기">×</button></div><div class="fp-mobile-sheet-body" id="fpMobileInspectorBody"></div>';
  document.body.appendChild(inspectorSheet);

  const furniture=$('#fpMobileFurniture');
  $$('[data-furniture]',app).forEach(button=>{
    const proxy=document.createElement('button');
    proxy.type='button';
    proxy.dataset.proxyFurniture=button.dataset.furniture;
    proxy.textContent=button.textContent.trim();
    furniture.appendChild(proxy);
  });

  const setVars=()=>{
    stage.style.setProperty('--fp-mobile-scale',String(gesture.scale));
    stage.style.setProperty('--fp-mobile-pan-x',`${gesture.panX}px`);
    stage.style.setProperty('--fp-mobile-pan-y',`${gesture.panY}px`);
    $('#fpMobileZoomLabel').textContent=`${Math.round(gesture.scale*100)}%`;
  };

  const clampPan=()=>{
    const wrap=stageWrap.getBoundingClientRect();
    const baseW=Math.max(1,stage.offsetWidth),baseH=Math.max(1,stage.offsetHeight);
    const extraX=Math.max(0,(baseW*gesture.scale-wrap.width)/2)+Math.min(56,wrap.width*.14);
    const extraY=Math.max(0,(baseH*gesture.scale-wrap.height)/2)+Math.min(56,wrap.height*.18);
    gesture.panX=Math.max(-extraX,Math.min(extraX,gesture.panX));
    gesture.panY=Math.max(-extraY,Math.min(extraY,gesture.panY));
  };

  const fit=()=>{
    gesture.scale=1;gesture.panX=0;gesture.panY=0;clampPan();setVars();
  };

  const zoomBy=(factor,anchor=null)=>{
    const old=gesture.scale;
    const next=Math.max(1,Math.min(4,old*factor));
    if(next===old)return;
    const rect=stageWrap.getBoundingClientRect();
    const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    const ax=anchor?.x??cx,ay=anchor?.y??cy;
    gesture.panX=(ax-cx)-next*((ax-cx-gesture.panX)/old);
    gesture.panY=(ay-cy)-next*((ay-cy-gesture.panY)/old);
    gesture.scale=next;clampPan();setVars();
  };

  const setMode=mode=>{
    gesture.pointers.clear();gesture.start=null;stageWrap.classList.remove('fp-mobile-gesture-active');
    gesture.mode=mode;
    stageWrap.dataset.mobileMode=mode;
    $('#fpMobileModeLabel').textContent=mode==='navigate'?'이동·확대':'편집';
    $$('[data-mobile-mode]',toolbar).forEach(b=>{const active=b.dataset.mobileMode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    if(mode==='navigate'){
      $$('[data-mobile-tool]',toolbar).forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
    }
  };

  const clickTool=tool=>{
    const original=$(`.fp-tool[data-tool="${tool}"]`,app);
    if(!original)return;
    setMode('edit');
    original.click();
    $$('[data-mobile-tool]',toolbar).forEach(b=>{const active=b.dataset.mobileTool===tool;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $$('[data-proxy-tool]',toolsSheet).forEach(b=>b.classList.toggle('active',b.dataset.proxyTool===tool));
    closeSheets();
    navigator.vibrate?.(12);
  };

  const openSheet=sheet=>{
    closeSheets(false);
    if(sheet===inspectorSheet&&inspector){
      if(!inspectorHome){inspectorHome=inspector.parentNode;inspectorNext=inspector.nextSibling;}
      $('#fpMobileInspectorBody').appendChild(inspector);
    }
    sheet.classList.add('show');scrim.classList.add('show');document.body.style.overflow='hidden';
  };

  function closeSheets(restore=true){
    toolsSheet.classList.remove('show');inspectorSheet.classList.remove('show');scrim.classList.remove('show');document.body.style.overflow='';
    if(restore&&inspector&&inspectorHome&&inspectorSheet.contains(inspector)){
      if(inspectorNext&&inspectorNext.parentNode===inspectorHome)inspectorHome.insertBefore(inspector,inspectorNext);else inspectorHome.appendChild(inspector);
    }
  }

  const selectedSync=()=>{
    const type=(selectedType?.textContent||'NONE').trim();
    const has=type&&type!=='NONE';
    selectedAction.classList.toggle('show',mq.matches&&has&&toolbar.classList.contains('is-visible'));
    $('#fpMobileSelectedBadge').textContent=type.slice(0,8);
    $('[data-proxy-action="settings"]',toolsSheet).disabled=!has;
  };

  const toolsSync=()=>{
    const active=$('.fp-tool.active',app)?.dataset.tool;
    if(gesture.mode==='edit'&&active){
      $$('[data-mobile-tool]',toolbar).forEach(b=>b.classList.toggle('active',b.dataset.mobileTool===active));
      $$('[data-proxy-tool]',toolsSheet).forEach(b=>b.classList.toggle('active',b.dataset.proxyTool===active));
    }
    $('[data-proxy-action="undo"]',toolsSheet).disabled=$('#undoBtn')?.disabled??true;
    $('[data-proxy-action="redo"]',toolsSheet).disabled=$('#redoBtn')?.disabled??true;
    $('[data-proxy-action="delete"]',toolsSheet).disabled=$('#deleteBtn')?.disabled??true;
  };

  toolbar.addEventListener('click',event=>{
    const mode=event.target.closest('[data-mobile-mode]');if(mode){setMode(mode.dataset.mobileMode);return;}
    const tool=event.target.closest('[data-mobile-tool]');if(tool){clickTool(tool.dataset.mobileTool);return;}
    if(event.target.closest('[data-mobile-sheet="tools"]'))openSheet(toolsSheet);
  });

  jump.addEventListener('click',event=>{
    const action=event.target.closest('[data-mobile-jump]')?.dataset.mobileJump;
    if(action==='canvas'){stageWrap.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>{setMode('navigate');showTip()},400);}
    if(action==='save')$('#exportPngBtn')?.click();
  });

  toolsSheet.addEventListener('click',event=>{
    const tool=event.target.closest('[data-proxy-tool]');if(tool){clickTool(tool.dataset.proxyTool);return;}
    const furn=event.target.closest('[data-proxy-furniture]');if(furn){$(`[data-furniture="${furn.dataset.proxyFurniture}"]`,app)?.click();setMode('edit');closeSheets();return;}
    const action=event.target.closest('[data-proxy-action]')?.dataset.proxyAction;
    const map={undo:'#undoBtn',redo:'#redoBtn',delete:'#deleteBtn',png:'#exportPngBtn'};
    if(map[action]){$(map[action])?.click();toolsSync();if(action==='png')closeSheets();return;}
    if(action==='fit'){fit();closeSheets();return;}
    if(action==='settings'&&!event.target.disabled)openSheet(inspectorSheet);
  });

  selectedAction.addEventListener('click',()=>openSheet(inspectorSheet));
  $$('[data-sheet-close]').forEach(b=>b.addEventListener('click',()=>closeSheets()));
  scrim.addEventListener('click',()=>closeSheets());
  $('#fpMobileZoomIn').addEventListener('click',()=>zoomBy(1.25));
  $('#fpMobileZoomOut').addEventListener('click',()=>zoomBy(.8));
  $('#fpMobileFit').addEventListener('click',fit);

  let lastTap=0;
  stageWrap.addEventListener('pointerdown',event=>{
    if(!mq.matches||gesture.mode!=='navigate'||event.pointerType==='mouse')return;
    event.preventDefault();event.stopPropagation();
    try{stageWrap.setPointerCapture?.(event.pointerId);}catch{}
    gesture.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    stageWrap.classList.add('fp-mobile-gesture-active');
    const points=[...gesture.pointers.values()];
    if(points.length===1){
      gesture.start={kind:'pan',x:points[0].x,y:points[0].y,panX:gesture.panX,panY:gesture.panY};
      const now=Date.now();if(now-lastTap<300){fit();lastTap=0}else lastTap=now;
    }else if(points.length===2){
      const [a,b]=points;
      gesture.start={kind:'pinch',distance:Math.hypot(b.x-a.x,b.y-a.y),scale:gesture.scale,panX:gesture.panX,panY:gesture.panY,midX:(a.x+b.x)/2,midY:(a.y+b.y)/2};
    }
  },true);

  stageWrap.addEventListener('pointermove',event=>{
    if(!mq.matches||gesture.mode!=='navigate'||!gesture.pointers.has(event.pointerId))return;
    event.preventDefault();event.stopPropagation();
    gesture.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    const points=[...gesture.pointers.values()];
    if(points.length===1&&gesture.start?.kind==='pan'){
      const p=points[0];gesture.panX=gesture.start.panX+p.x-gesture.start.x;gesture.panY=gesture.start.panY+p.y-gesture.start.y;clampPan();setVars();
    }else if(points.length>=2){
      const [a,b]=points,dist=Math.max(20,Math.hypot(b.x-a.x,b.y-a.y)),midX=(a.x+b.x)/2,midY=(a.y+b.y)/2;
      if(gesture.start?.kind!=='pinch')gesture.start={kind:'pinch',distance:dist,scale:gesture.scale,panX:gesture.panX,panY:gesture.panY,midX,midY};
      const start=gesture.start,next=Math.max(1,Math.min(4,start.scale*(dist/start.distance));
      const rect=stageWrap.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
      gesture.panX=(midX-cx)-next*((start.midX-cx-start.panX)/start.scale);
      gesture.panY=(midY-cy)-next*((start.midY-cy-start.panY)/start.scale);
      gesture.scale=next;clampPan();setVars();
    }
  },true);

  const endPointer=event=>{
    if(!gesture.pointers.has(event.pointerId))return;
    if(mq.matches&&gesture.mode==='navigate'){event.preventDefault();event.stopPropagation();}
    gesture.pointers.delete(event.pointerId);
    const points=[...gesture.pointers.values()];
    if(points.length===1){const p=points[0];gesture.start={kind:'pan',x:p.x,y:p.y,panX:gesture.panX,panY:gesture.panY};}
    else if(!points.length){gesture.start=null;stageWrap.classList.remove('fp-mobile-gesture-active');}
  };
  stageWrap.addEventListener('pointerup',endPointer,true);
  stageWrap.addEventListener('pointercancel',endPointer,true);

  const showTip=()=>{
    if(!mq.matches)return;
    try{if(localStorage.getItem(MOBILE_HELP_KEY))return;}catch{}
    tip.classList.add('show');
    setTimeout(()=>tip.classList.remove('show'),4200);
    try{localStorage.setItem(MOBILE_HELP_KEY,'1');}catch{}
  };

  const appObserver=new IntersectionObserver(entries=>{
    const visible=entries.some(e=>e.isIntersecting);
    toolbar.classList.toggle('is-visible',mq.matches&&visible);
    document.body.classList.toggle('fp-mobile-editor-active',mq.matches&&visible);
    selectedSync();
  },{threshold:.05});
  appObserver.observe(app);

  new MutationObserver(()=>{selectedSync();toolsSync();}).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled']});

  const activate=()=>{
    if(mq.matches){stageWrap.dataset.mobileMode=gesture.mode;setVars();setTimeout(showTip,900);}
    else{toolbar.classList.remove('is-visible');selectedAction.classList.remove('show');document.body.classList.remove('fp-mobile-editor-active');closeSheets();stage.style.removeProperty('--fp-mobile-scale');stage.style.removeProperty('--fp-mobile-pan-x');stage.style.removeProperty('--fp-mobile-pan-y');}
  };
  mq.addEventListener?.('change',activate);
  window.addEventListener('resize',()=>{if(mq.matches){clampPan();setVars();}});
  setMode('navigate');toolsSync();selectedSync();activate();
})();