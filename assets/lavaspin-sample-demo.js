(()=>{
  if(!/lavaspin\.html$/i.test(location.pathname)||window.__lssSample3D)return;
  window.__lssSample3D=true;

  const $=(selector,root=document)=>root.querySelector(selector);
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const canvasToBlob=(canvas,type='image/jpeg',quality=.92)=>new Promise((resolve,reject)=>{
    canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('3D 프레임 변환에 실패했습니다.')),type,quality);
  });

  async function loadThree(){
    if(window.__lavaThreePromise)return window.__lavaThreePromise;
    window.__lavaThreePromise=import('https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js');
    return window.__lavaThreePromise;
  }

  function roundedRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);
    else{
      const radius=Math.min(r,w/2,h/2);
      ctx.moveTo(x+radius,y);
      ctx.arcTo(x+w,y,x+w,y+h,radius);
      ctx.arcTo(x+w,y+h,x,y+h,radius);
      ctx.arcTo(x,y+h,x,y,radius);
      ctx.arcTo(x,y,x+w,y,radius);
    }
    ctx.closePath();
  }

  function createLabelTexture(THREE){
    const canvas=document.createElement('canvas');
    canvas.width=2048;
    canvas.height=768;
    const ctx=canvas.getContext('2d');

    const paper=ctx.createLinearGradient(0,0,2048,768);
    paper.addColorStop(0,'#efe0ad');
    paper.addColorStop(.5,'#fff2c7');
    paper.addColorStop(1,'#d9c47c');
    ctx.fillStyle=paper;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle='#22251e';
    ctx.fillRect(0,0,2048,42);
    ctx.fillRect(0,726,2048,42);

    // 앞면 라벨
    roundedRect(ctx,690,82,668,604,48);
    ctx.fillStyle='rgba(255,255,255,.72)';
    ctx.fill();
    ctx.strokeStyle='rgba(34,37,30,.24)';
    ctx.lineWidth=5;
    ctx.stroke();

    ctx.textAlign='center';
    ctx.fillStyle='#26301e';
    ctx.font='700 42px Arial, sans-serif';
    ctx.fillText('LAVASPIN',1024,190);
    ctx.font='900 102px Arial, sans-serif';
    ctx.fillText('STUDIO',1024,330);
    ctx.font='700 36px Arial, sans-serif';
    ctx.fillText('3D PRODUCT SAMPLE',1024,405);
    ctx.fillStyle='#718719';
    roundedRect(ctx,852,470,344,84,42);
    ctx.fill();
    ctx.fillStyle='#fff';
    ctx.font='800 31px Arial, sans-serif';
    ctx.fillText('360° VIEW',1024,524);
    ctx.fillStyle='#545b4e';
    ctx.font='600 23px Arial, sans-serif';
    ctx.fillText('WEBGL RENDERED DEMO',1024,615);

    // 뒷면 정보 영역
    roundedRect(ctx,70,106,480,556,36);
    ctx.fillStyle='rgba(248,250,244,.78)';
    ctx.fill();
    ctx.fillStyle='#293027';
    ctx.textAlign='left';
    ctx.font='800 31px Arial, sans-serif';
    ctx.fillText('SAMPLE PRODUCT',112,174);
    ctx.font='600 21px Arial, sans-serif';
    ctx.fillStyle='#606a5d';
    ['Browser rendered 3D object','Fictional label and data','No real product information'].forEach((line,index)=>ctx.fillText(line,112,232+index*42));
    ctx.fillStyle='#293027';
    for(let i=0;i<38;i++)ctx.fillRect(112+i*8,442,(i%5===0?5:3),128);
    ctx.font='700 17px monospace';
    ctx.fillText('0000 3600 0000',155,608);

    // 측면 포인트
    ctx.fillStyle='#c9ff48';
    ctx.fillRect(1510,42,105,684);
    ctx.save();
    ctx.translate(1562,384);
    ctx.rotate(Math.PI/2);
    ctx.textAlign='center';
    ctx.fillStyle='#152010';
    ctx.font='900 34px Arial, sans-serif';
    ctx.fillText('LAVASPIN · PUBLIC 3D DEMO',0,10);
    ctx.restore();

    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=8;
    texture.needsUpdate=true;
    return texture;
  }

  function createStudioScene(THREE,size=720){
    const scene=new THREE.Scene();
    scene.background=new THREE.Color('#eef2ec');
    scene.fog=new THREE.Fog('#eef2ec',10,18);

    const camera=new THREE.PerspectiveCamera(31,1,.1,100);
    camera.position.set(0,.35,7.6);
    camera.lookAt(0,.05,0);

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
    renderer.setSize(size,size,false);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.08;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;

    const studio=new THREE.Group();
    scene.add(studio);

    const floorMaterial=new THREE.MeshStandardMaterial({color:'#d8dfd9',roughness:.9,metalness:.02});
    const floor=new THREE.Mesh(new THREE.CircleGeometry(3.15,96),floorMaterial);
    floor.rotation.x=-Math.PI/2;
    floor.position.y=-2.07;
    floor.receiveShadow=true;
    studio.add(floor);

    const platformMaterial=new THREE.MeshPhysicalMaterial({color:'#f8faf7',roughness:.28,metalness:.15,clearcoat:.75,clearcoatRoughness:.18});
    const platform=new THREE.Mesh(new THREE.CylinderGeometry(2.15,2.28,.28,96),platformMaterial);
    platform.position.y=-1.93;
    platform.receiveShadow=true;
    platform.castShadow=true;
    studio.add(platform);

    const platformEdge=new THREE.Mesh(
      new THREE.TorusGeometry(2.19,.065,16,128),
      new THREE.MeshStandardMaterial({color:'#99a49d',roughness:.36,metalness:.58})
    );
    platformEdge.rotation.x=Math.PI/2;
    platformEdge.position.y=-1.84;
    studio.add(platformEdge);

    const product=new THREE.Group();
    product.position.y=-.15;
    studio.add(product);

    // 실제 회전체 형태를 만드는 병 프로필
    const profile=[
      [0,-1.62],[.84,-1.62],[1.03,-1.52],[1.13,-1.31],[1.16,-1.02],
      [1.16,.86],[1.11,1.08],[.93,1.26],[.67,1.39],[.59,1.53],[.59,1.66],[0,1.66]
    ].map(([x,y])=>new THREE.Vector2(x,y));
    const bodyGeometry=new THREE.LatheGeometry(profile,128);
    bodyGeometry.computeVertexNormals();
    const bodyMaterial=new THREE.MeshPhysicalMaterial({
      color:'#202a34',roughness:.22,metalness:.18,clearcoat:.78,clearcoatRoughness:.12,
      sheen:.35,sheenColor:new THREE.Color('#94a4b2')
    });
    const body=new THREE.Mesh(bodyGeometry,bodyMaterial);
    body.castShadow=true;
    body.receiveShadow=true;
    product.add(body);

    const neck=new THREE.Mesh(
      new THREE.CylinderGeometry(.59,.64,.42,96),
      new THREE.MeshPhysicalMaterial({color:'#26313b',roughness:.2,metalness:.2,clearcoat:.7})
    );
    neck.position.y=1.68;
    neck.castShadow=true;
    product.add(neck);

    const capMaterial=new THREE.MeshPhysicalMaterial({color:'#697681',roughness:.16,metalness:.72,clearcoat:.6,clearcoatRoughness:.08});
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.72,.68,.7,96),capMaterial);
    cap.position.y=2.08;
    cap.castShadow=true;
    product.add(cap);

    // 캡 홈과 금속 링
    for(let i=0;i<5;i++){
      const groove=new THREE.Mesh(
        new THREE.TorusGeometry(.705,.016,8,96),
        new THREE.MeshStandardMaterial({color:i%2?'#3e4851':'#aeb7be',roughness:.3,metalness:.8})
      );
      groove.rotation.x=Math.PI/2;
      groove.position.y=1.84+i*.12;
      product.add(groove);
    }
    const collar=new THREE.Mesh(
      new THREE.CylinderGeometry(.69,.73,.12,96),
      new THREE.MeshStandardMaterial({color:'#c7b56a',roughness:.2,metalness:.85})
    );
    collar.position.y=1.71;
    collar.castShadow=true;
    product.add(collar);

    const labelTexture=createLabelTexture(THREE);
    const labelMaterial=new THREE.MeshPhysicalMaterial({
      map:labelTexture,roughness:.52,metalness:.02,clearcoat:.18,clearcoatRoughness:.3,
      side:THREE.DoubleSide
    });
    const label=new THREE.Mesh(new THREE.CylinderGeometry(1.172,1.172,1.55,128,1,true),labelMaterial);
    label.position.y=-.05;
    label.rotation.y=Math.PI;
    label.castShadow=true;
    product.add(label);

    const bottomRing=new THREE.Mesh(
      new THREE.TorusGeometry(1.03,.035,12,128),
      new THREE.MeshStandardMaterial({color:'#111820',roughness:.25,metalness:.5})
    );
    bottomRing.rotation.x=Math.PI/2;
    bottomRing.position.y=-1.5;
    product.add(bottomRing);

    // 스튜디오 조명
    scene.add(new THREE.HemisphereLight('#ffffff','#7b857e',1.55));

    const key=new THREE.DirectionalLight('#fff9ed',3.1);
    key.position.set(4.5,6.5,5.5);
    key.castShadow=true;
    key.shadow.mapSize.set(2048,2048);
    key.shadow.camera.left=-5;
    key.shadow.camera.right=5;
    key.shadow.camera.top=6;
    key.shadow.camera.bottom=-5;
    key.shadow.bias=-.0002;
    scene.add(key);

    const fill=new THREE.DirectionalLight('#c8dcff',1.65);
    fill.position.set(-4,2.2,4);
    scene.add(fill);

    const rim=new THREE.SpotLight('#b7ffdc',4.2,18,Math.PI/4,.6,1.2);
    rim.position.set(-3.8,4.4,-4.5);
    rim.target=product;
    scene.add(rim);
    scene.add(rim.target);

    const front=new THREE.PointLight('#ffe7a8',1.4,13,2);
    front.position.set(0,-.2,4.6);
    scene.add(front);

    const backdrop=new THREE.Mesh(
      new THREE.PlaneGeometry(18,14),
      new THREE.MeshStandardMaterial({color:'#eef2ec',roughness:1})
    );
    backdrop.position.set(0,1.8,-4.4);
    backdrop.receiveShadow=true;
    scene.add(backdrop);

    product.rotation.x=-.025;

    const dispose=()=>{
      scene.traverse(object=>{
        object.geometry?.dispose?.();
        if(object.material){
          const materials=Array.isArray(object.material)?object.material:[object.material];
          materials.forEach(material=>{
            Object.values(material).forEach(value=>value?.isTexture&&value.dispose?.());
            material.dispose?.();
          });
        }
      });
      labelTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
    };

    return {scene,camera,renderer,product,dispose};
  }

  async function generate3DFrames(frameCount,button){
    const input=$('#lssPhotoInput');
    const status=$('#lssStatus');
    const progress=$('#lssProgressBar');
    if(!input)return;

    const original=button.textContent;
    button.disabled=true;
    button.textContent='3D 엔진 불러오는 중…';

    let studio;
    try{
      if(!window.WebGLRenderingContext)throw new Error('이 브라우저는 WebGL을 지원하지 않습니다.');
      const THREE=await loadThree();
      button.textContent='3D 샘플 렌더링 중…';
      studio=createStudioScene(THREE,720);

      const transfer=new DataTransfer();
      for(let i=0;i<frameCount;i++){
        const angle=(i/frameCount)*Math.PI*2;
        studio.product.rotation.y=angle;
        studio.product.position.y=-.15+Math.sin(angle*2)*.008;
        studio.renderer.render(studio.scene,studio.camera);

        const frameBlob=await canvasToBlob(studio.renderer.domElement,'image/jpeg',.92);
        const filename=`lavaspin-3d-${String(i+1).padStart(3,'0')}.jpg`;
        transfer.items.add(new File([frameBlob],filename,{type:'image/jpeg',lastModified:Date.now()}));

        const percent=Math.round(((i+1)/frameCount)*92);
        if(status)status.textContent=`WebGL 3D 프레임 렌더링 · ${i+1}/${frameCount}`;
        if(progress)progress.style.width=`${percent}%`;
        if(i%3===0)await sleep(0);
      }

      input.files=transfer.files;
      input.dispatchEvent(new Event('change',{bubbles:true}));
      button.textContent='3D 샘플 생성 완료';
      if(status)status.textContent=`실제 3D 모델을 렌더링한 ${frameCount}개 샘플 프레임을 불러왔습니다.`;
      setTimeout(()=>button.textContent=original,1700);
    }catch(error){
      console.error(error);
      if(status)status.textContent=`3D 샘플 생성 실패: ${error.message}`;
      alert(`3D 샘플을 만들지 못했습니다.\n${error.message}\n최신 Chrome 또는 Edge에서 다시 시도해 주세요.`);
      button.textContent=original;
    }finally{
      studio?.dispose?.();
      button.disabled=false;
    }
  }

  async function mount(){
    for(let i=0;i<100&&!$('#lssPhotoInput');i++)await sleep(100);
    const modes=$('.lss-modes');
    if(!modes)return;

    $('.lss-sample-start')?.remove();

    const style=document.createElement('style');
    style.textContent=`
      .lss-sample-start{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;align-items:center;margin:18px 0;padding:22px 24px;border:1px solid #cbd9ad;border-radius:22px;background:radial-gradient(circle at 88% 10%,#fff 0 6%,transparent 7%),linear-gradient(135deg,#f8ffe8,#eaf5ce);box-shadow:0 16px 38px rgba(60,78,13,.09)}
      .lss-sample-copy{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start}
      .lss-3d-mark{display:grid;width:52px;height:52px;place-items:center;border-radius:16px;background:#111820;color:#c9ff48;font-size:16px;font-weight:950;box-shadow:inset 0 0 0 1px #ffffff16}
      .lss-sample-start small{color:#718100;font-size:9px;font-weight:900;letter-spacing:.12em}
      .lss-sample-start h3{margin:7px 0 5px;font-size:21px;letter-spacing:-.03em}
      .lss-sample-start p{margin:0;color:#66725f;font-size:11px;line-height:1.7}
      .lss-sample-note{display:flex;flex-wrap:wrap;gap:6px;margin-top:11px}
      .lss-sample-note span{padding:5px 8px;border-radius:999px;background:#fff;color:#57624e;font-size:8px;font-weight:850;border:1px solid #dce6c7}
      .lss-sample-actions{display:flex;gap:8px;align-items:center}
      .lss-sample-actions select,.lss-sample-actions button{min-height:48px;border-radius:13px;font:inherit;font-weight:900}
      .lss-sample-actions select{padding:0 13px;border:1px solid #c5d1ab;background:#fff;color:#26301e}
      .lss-sample-actions button{padding:0 18px;border:0;background:#111820;color:#c9ff48;box-shadow:0 10px 22px rgba(17,24,32,.16)}
      .lss-sample-actions button:disabled{opacity:.58;cursor:wait}
      @media(max-width:760px){.lss-sample-start{grid-template-columns:1fr;padding:18px}.lss-sample-actions{display:grid;grid-template-columns:1fr 1.65fr}.lss-sample-actions>*{width:100%}}
      @media(max-width:450px){.lss-sample-copy{grid-template-columns:1fr}.lss-sample-actions{grid-template-columns:1fr}.lss-3d-mark{width:46px;height:46px}}
    `;
    document.head.append(style);

    const card=document.createElement('div');
    card.className='lss-sample-start';
    card.innerHTML=`
      <div class="lss-sample-copy">
        <span class="lss-3d-mark">3D</span>
        <div>
          <small>WEBGL PRODUCT SAMPLE · REAL 3D RENDER</small>
          <h3>사진 없이 실제 3D 제품으로 먼저 체험하세요.</h3>
          <p>입체 보틀 모델에 재질·라벨·금속 캡·스튜디오 조명·바닥 그림자를 적용하고, 선택한 각도 수만큼 직접 렌더링합니다.</p>
          <div class="lss-sample-note"><span>WebGL 3D</span><span>실제 앞·옆·뒷면</span><span>조명·반사·그림자</span><span>HTML·ZIP 출력 가능</span></div>
        </div>
      </div>
      <div class="lss-sample-actions">
        <select id="lssSampleCount" aria-label="3D 샘플 프레임 수">
          <option value="24">24컷 · 빠른 생성</option>
          <option value="36" selected>36컷 · 권장</option>
          <option value="48">48컷 · 부드러움</option>
          <option value="72">72컷 · 고밀도</option>
        </select>
        <button id="lssSampleGenerate" type="button">3D 샘플로 바로 체험</button>
      </div>`;

    modes.before(card);
    $('#lssSampleGenerate').onclick=event=>generate3DFrames(+$(`#lssSampleCount`).value,event.currentTarget);

    const firstMeta=document.querySelector('.ls-hero-meta span');
    if(firstMeta)firstMeta.textContent='WebGL 3D 샘플 즉시 생성';
  }

  mount();
})();