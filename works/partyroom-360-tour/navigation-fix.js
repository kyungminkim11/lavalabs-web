(()=>{
  if(typeof viewer==='undefined') return;

  const style=document.createElement('style');
  style.textContent=`
    .pnlm-hotspot-base.tour-arrow{display:none!important}
    .pnlm-hotspot-base.tour-arrow-fixed{
      display:block!important;
      width:62px!important;height:62px!important;
      margin-left:-31px!important;margin-top:-31px!important;
      border:2px solid rgba(255,255,255,.96)!important;
      border-radius:50%!important;
      background-color:rgba(13,17,23,.86)!important;
      background-image:none!important;
      box-shadow:0 12px 30px rgba(0,0,0,.48),0 0 0 7px rgba(255,255,255,.09)!important;
      cursor:pointer!important;
      transition:none!important;
      animation:none!important;
      will-change:auto!important;
      overflow:visible!important;
    }
    .pnlm-hotspot-base.tour-arrow-fixed:before{
      content:'↑';position:absolute;inset:0;display:grid;place-items:center;
      color:#fff;font-size:34px;font-weight:950;line-height:1;
      text-shadow:0 2px 8px rgba(0,0,0,.5);
      pointer-events:none;
    }
    .pnlm-hotspot-base.tour-arrow-fixed:hover,
    .pnlm-hotspot-base.tour-arrow-fixed:active,
    .pnlm-hotspot-base.tour-arrow-fixed:focus{
      background-color:rgba(13,17,23,.86)!important;
      background-image:none!important;
      box-shadow:0 12px 30px rgba(0,0,0,.48),0 0 0 7px rgba(255,255,255,.09)!important;
      transition:none!important;
      animation:none!important;
    }
    .pnlm-hotspot-base.tour-arrow-fixed .pnlm-tooltip{display:none!important}
    .tour-arrow-label{
      position:absolute;
      left:50%;
      top:72px;
      transform:translateX(-50%);
      display:block;
      min-width:max-content;
      max-width:180px;
      padding:8px 12px;
      border:1px solid rgba(255,255,255,.22);
      border-radius:999px;
      background:rgba(13,17,23,.86);
      color:#fff;
      box-shadow:0 8px 22px rgba(0,0,0,.35);
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
      font-size:12px;
      font-weight:850;
      line-height:1.2;
      letter-spacing:-.02em;
      text-align:center;
      white-space:nowrap;
      pointer-events:none;
    }
    @media(max-width:640px){
      .pnlm-hotspot-base.tour-arrow-fixed{width:54px!important;height:54px!important;margin-left:-27px!important;margin-top:-27px!important}
      .pnlm-hotspot-base.tour-arrow-fixed:before{font-size:29px}
      .tour-arrow-label{top:64px;padding:7px 10px;font-size:11px;max-width:150px}
    }
  `;
  document.head.appendChild(style);

  if(typeof sceneInfo!=='undefined'&&sceneInfo.tablepc){
    sceneInfo.tablepc.title='PC존 · 대형 테이블';
    sceneInfo.tablepc.desc='여러 대의 PC와 대형 테이블이 함께 보이는 게임·작업·모임 구역입니다.';
  }

  try{viewer.removeScene('tablepc')}catch(e){}
  viewer.addScene('tablepc',{
    type:'equirectangular',
    panorama:'assets/scene-table-pc.jpg?v=20260710-pczone',
    yaw:10,
    pitch:-2,
    hfov:105
  });

  const routes={
    overview:[
      {id:'ov-lounge',pitch:-17,yaw:168,sceneId:'lounge',text:'소파·TV 라운지',targetYaw:5},
      {id:'ov-tablepc',pitch:-16,yaw:-47,sceneId:'tablepc',text:'PC존 · 대형 테이블',targetYaw:10},
      {id:'ov-kitchen',pitch:-15,yaw:-82,sceneId:'kitchen',text:'주방·편의시설',targetYaw:176}
    ],
    lounge:[
      {id:'lo-overview',pitch:-16,yaw:18,sceneId:'overview',text:'전체 공간',targetYaw:168},
      {id:'lo-tablepc',pitch:-16,yaw:-18,sceneId:'tablepc',text:'PC존 · 대형 테이블',targetYaw:10},
      {id:'lo-kitchen',pitch:-14,yaw:-42,sceneId:'kitchen',text:'주방·편의시설',targetYaw:178}
    ],
    tablepc:[
      {id:'tp-overview',pitch:-16,yaw:142,sceneId:'overview',text:'전체 공간',targetYaw:-47},
      {id:'tp-lounge',pitch:-16,yaw:176,sceneId:'lounge',text:'소파·TV 라운지',targetYaw:18},
      {id:'tp-kitchen',pitch:-15,yaw:-126,sceneId:'kitchen',text:'주방·편의시설',targetYaw:178}
    ],
    kitchen:[
      {id:'ki-tablepc',pitch:-17,yaw:176,sceneId:'tablepc',text:'PC존 · 대형 테이블',targetYaw:10},
      {id:'ki-overview',pitch:-16,yaw:-92,sceneId:'overview',text:'전체 공간',targetYaw:-82},
      {id:'ki-lounge',pitch:-14,yaw:-118,sceneId:'lounge',text:'소파·TV 라운지',targetYaw:-18}
    ]
  };

  function goToScene(_hotspot,args){
    viewer.loadScene(args.sceneId,-2,args.targetYaw,102);
  }

  function prepareArrow(hotspot,args){
    hotspot.setAttribute('role','button');
    hotspot.setAttribute('tabindex','0');
    hotspot.setAttribute('aria-label',args.text+'으로 이동');

    const label=document.createElement('span');
    label.className='tour-arrow-label';
    label.textContent=args.text;
    hotspot.appendChild(label);

    hotspot.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        viewer.loadScene(args.sceneId,-2,args.targetYaw,102);
      }
    });
  }

  Object.entries(routes).forEach(([sceneId,items])=>{
    items.forEach(item=>{
      try{viewer.removeHotSpot(item.id,sceneId)}catch(e){}
      viewer.addHotSpot({
        id:item.id,
        pitch:item.pitch,
        yaw:item.yaw,
        type:'info',
        cssClass:'tour-arrow-fixed',
        clickHandlerFunc:goToScene,
        clickHandlerArgs:{sceneId:item.sceneId,targetYaw:item.targetYaw},
        createTooltipFunc:prepareArrow,
        createTooltipArgs:{sceneId:item.sceneId,targetYaw:item.targetYaw,text:item.text}
      },sceneId);
    });
  });
})();
