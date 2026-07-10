(()=>{
  if(typeof viewer==='undefined' || typeof sceneInfo==='undefined') return;

  sceneInfo.tablepc.title='대형 테이블';
  sceneInfo.tablepc.desc='단체 식사, 보드게임과 모임에 활용하는 대형 테이블 구역입니다.';
  sceneInfo.tablepc.no='03';
  sceneInfo.pc={no:'04',title:'PC존',desc:'여러 대의 PC가 나란히 배치된 게임·공동 작업 구역입니다.'};
  sceneInfo.kitchen.no='05';

  viewer.addScene('pc',{
    type:'equirectangular',
    panorama:'assets/scene-pc.jpg?v=20260710-pc-zone',
    yaw:-28,
    pitch:-2,
    hfov:102
  });

  const list=document.getElementById('sceneList');
  if(list){
    const tableButton=list.querySelector('[data-scene="tablepc"] span');
    if(tableButton) tableButton.textContent='03 · 대형 테이블';
    const kitchenButton=list.querySelector('[data-scene="kitchen"] span');
    if(kitchenButton) kitchenButton.textContent='05 · 주방 · 편의시설';

    if(!list.querySelector('[data-scene="pc"]')){
      const button=document.createElement('button');
      button.type='button';
      button.dataset.scene='pc';
      button.innerHTML='<span>04 · PC존</span><b>↗</b>';
      button.addEventListener('click',()=>viewer.loadScene('pc'));
      const kitchenRow=list.querySelector('[data-scene="kitchen"]');
      if(kitchenRow) list.insertBefore(button,kitchenRow); else list.appendChild(button);
    }
  }

  const map=document.querySelector('.floorplan');
  if(map){
    const tableMarker=map.querySelector('[data-scene="tablepc"]');
    if(tableMarker){
      tableMarker.textContent='03';
      tableMarker.style.left='29%';
      tableMarker.style.top='66%';
      tableMarker.setAttribute('aria-label','대형 테이블로 이동');
    }
    const kitchenMarker=map.querySelector('[data-scene="kitchen"]');
    if(kitchenMarker) kitchenMarker.textContent='05';

    if(!map.querySelector('[data-scene="pc"]')){
      const marker=document.createElement('button');
      marker.className='marker';
      marker.type='button';
      marker.dataset.scene='pc';
      marker.textContent='04';
      marker.style.left='26%';
      marker.style.top='28%';
      marker.setAttribute('aria-label','PC존으로 이동');
      marker.addEventListener('click',()=>viewer.loadScene('pc'));
      map.appendChild(marker);
    }
  }

  function go(_hotspot,args){viewer.loadScene(args.sceneId,-2,args.targetYaw,102)}
  function decorate(hotspot,args){
    hotspot.setAttribute('role','button');
    hotspot.setAttribute('tabindex','0');
    hotspot.setAttribute('aria-label',args.text+'으로 이동');
    const label=document.createElement('span');
    label.className='tour-arrow-label';
    label.textContent=args.text;
    hotspot.appendChild(label);
    hotspot.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();viewer.loadScene(args.sceneId,-2,args.targetYaw,102)}
    });
  }
  function arrow(scene,id,pitch,yaw,target,text,targetYaw){
    viewer.addHotSpot({
      id,pitch,yaw,type:'info',cssClass:'tour-arrow-fixed',
      clickHandlerFunc:go,
      clickHandlerArgs:{sceneId:target,targetYaw},
      createTooltipFunc:decorate,
      createTooltipArgs:{sceneId:target,targetYaw,text}
    },scene);
  }

  arrow('pc','pc-overview',-16,118,'overview','전체 공간',-28);
  arrow('pc','pc-table',-16,12,'tablepc','대형 테이블',38);
  arrow('pc','pc-kitchen',-15,-74,'kitchen','주방 · 편의시설',176);
  arrow('overview','overview-pc',-16,-112,'pc','PC존',-28);
  arrow('tablepc','table-pc',-16,-102,'pc','PC존',-28);
  arrow('lounge','lounge-pc',-15,-62,'pc','PC존',-28);

  const metric=document.querySelector('.metric-grid .metric:nth-child(2) strong');
  const metricText=document.querySelector('.metric-grid .metric:nth-child(2) span');
  if(metric) metric.textContent='5 SCENES';
  if(metricText) metricText.textContent='전체 공간, 라운지, 대형 테이블, PC존, 주방 장면 연결';

  syncScene(viewer.getScene());
})();
