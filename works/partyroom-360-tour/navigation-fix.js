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
      background:rgba(13,17,23,.82)!important;
      box-shadow:0 12px 30px rgba(0,0,0,.48),0 0 0 7px rgba(255,255,255,.09)!important;
      cursor:pointer!important;
      transition:transform .18s ease,background .18s ease!important;
    }
    .pnlm-hotspot-base.tour-arrow-fixed:before{
      content:'↑';position:absolute;inset:0;display:grid;place-items:center;
      color:#fff;font-size:34px;font-weight:950;line-height:1;
      text-shadow:0 2px 8px rgba(0,0,0,.5);
    }
    .pnlm-hotspot-base.tour-arrow-fixed:hover{background:#0d1117!important;transform:scale(1.08)!important}
    .pnlm-hotspot-base.tour-arrow-fixed .pnlm-tooltip{
      top:70px!important;left:50%!important;transform:translateX(-50%)!important;
      min-width:max-content!important;padding:8px 11px!important;border-radius:10px!important;
      background:rgba(13,17,23,.92)!important;color:#fff!important;
      font-size:12px!important;font-weight:850!important;white-space:nowrap!important;
    }
    @media(max-width:640px){
      .pnlm-hotspot-base.tour-arrow-fixed{width:54px!important;height:54px!important;margin-left:-27px!important;margin-top:-27px!important}
      .pnlm-hotspot-base.tour-arrow-fixed:before{font-size:29px}
    }
  `;
  document.head.appendChild(style);

  const routes={
    overview:[
      {id:'ov-lounge',pitch:-17,yaw:168,sceneId:'lounge',text:'소파·TV 라운지',targetYaw:5},
      {id:'ov-tablepc',pitch:-16,yaw:-47,sceneId:'tablepc',text:'대형 테이블·PC존',targetYaw:2},
      {id:'ov-kitchen',pitch:-15,yaw:-82,sceneId:'kitchen',text:'주방·편의시설',targetYaw:176}
    ],
    lounge:[
      {id:'lo-overview',pitch:-16,yaw:18,sceneId:'overview',text:'전체 공간',targetYaw:168},
      {id:'lo-tablepc',pitch:-16,yaw:-18,sceneId:'tablepc',text:'대형 테이블·PC존',targetYaw:88},
      {id:'lo-kitchen',pitch:-14,yaw:-42,sceneId:'kitchen',text:'주방·편의시설',targetYaw:178}
    ],
    tablepc:[
      {id:'tp-overview',pitch:-16,yaw:4,sceneId:'overview',text:'전체 공간',targetYaw:-47},
      {id:'tp-lounge',pitch:-16,yaw:88,sceneId:'lounge',text:'소파·TV 라운지',targetYaw:18},
      {id:'tp-kitchen',pitch:-15,yaw:-67,sceneId:'kitchen',text:'주방·편의시설',targetYaw:178}
    ],
    kitchen:[
      {id:'ki-tablepc',pitch:-17,yaw:176,sceneId:'tablepc',text:'대형 테이블·PC존',targetYaw:-67},
      {id:'ki-overview',pitch:-16,yaw:-92,sceneId:'overview',text:'전체 공간',targetYaw:-82},
      {id:'ki-lounge',pitch:-14,yaw:-118,sceneId:'lounge',text:'소파·TV 라운지',targetYaw:-18}
    ]
  };

  Object.entries(routes).forEach(([sceneId,items])=>{
    items.forEach(item=>{
      try{viewer.removeHotSpot(item.id,sceneId)}catch(e){}
      viewer.addHotSpot({
        id:item.id,
        pitch:item.pitch,
        yaw:item.yaw,
        type:'scene',
        sceneId:item.sceneId,
        text:item.text,
        cssClass:'tour-arrow-fixed',
        targetPitch:-2,
        targetYaw:item.targetYaw,
        targetHfov:102
      },sceneId);
    });
  });

  const preferredViews={overview:150,lounge:8,tablepc:78,kitchen:178};
  viewer.on('scenechange',id=>{
    window.setTimeout(()=>{
      if(preferredViews[id]!==undefined){
        viewer.setPitch(-2,300);
        viewer.setYaw(preferredViews[id],500);
        viewer.setHfov(102,400);
      }
    },80);
  });
})();
