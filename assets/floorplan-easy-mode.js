(()=>{
  'use strict';
  if(!/\/floorplan-editor\.html$/i.test(location.pathname))return;

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const select=$('#templateSelect');
  const widthInput=$('#spaceWidth');
  const heightInput=$('#spaceHeight');
  const apply=$('#applyTemplateBtn');
  const gallery=$('.fp-template-gallery');
  if(!select||!widthInput||!heightInput||!apply)return;

  const toast=(message,error=false)=>{
    const box=$('#fpToast');
    if(!box)return;
    box.textContent=message;
    box.classList.toggle('error',error);
    box.classList.add('show');
    clearTimeout(box.__easyTimer);
    box.__easyTimer=setTimeout(()=>box.classList.remove('show'),3000);
  };

  const defaults={
    blank:{small:[4,3],medium:[8,6],large:[12,9]},
    rectangle:{small:[4,3],medium:[8,6],large:[12,9]},
    office:{small:[5,4],medium:[8,6],large:[12,8]},
    cafe:{small:[6,5],medium:[10,8],large:[15,10]},
    party:{small:[7,5],medium:[12,8],large:[18,12]},
    studio:{small:[6,5],medium:[9,7],large:[14,10]}
  };

  const style=document.createElement('style');
  style.textContent=`
    .fp-easy-box{margin:10px 0 12px;padding:12px;border:1px solid #c7d79a;border-radius:13px;background:#f3f8e4}
    .fp-easy-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
    .fp-easy-head strong,.fp-easy-head span{display:block}.fp-easy-head strong{font-size:11px;color:#2e390d}.fp-easy-head span{margin-top:3px;color:#68743e;font-size:8px;line-height:1.55}
    .fp-mode-toggle{display:flex;flex:none;padding:3px;border:1px solid #c7d3a6;border-radius:9px;background:#fff}
    .fp-mode-toggle button{min-height:29px;padding:6px 8px;border:0;border-radius:7px;background:transparent;color:#69745d;font-size:7px;font-weight:900;cursor:pointer}
    .fp-mode-toggle button.active{background:#11161d;color:#c9ff48}
    .fp-size-question{margin:11px 0 6px;color:#3d481d;font-size:8px;font-weight:900}
    .fp-size-choices{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
    .fp-size-choice{display:grid;gap:2px;min-height:47px;padding:7px 5px;border:1px solid #cad5ae;border-radius:9px;background:#fff;color:#394324;text-align:center;cursor:pointer}
    .fp-size-choice b{font-size:8px}.fp-size-choice small{color:#77815f;font-size:6px;line-height:1.35}.fp-size-choice:hover,.fp-size-choice.active{border-color:#789700;background:#eaf4c9;color:#293600}
    .fp-easy-note{margin:8px 0 0;color:#6d7851;font-size:7px;line-height:1.55}
    .fp-exact-size-row.is-hidden,.fp-exact-apply.is-hidden{display:none!important}
    .fp-easy-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:9px}
    .fp-camera-suggest{min-height:38px;border:1px solid #11161d;border-radius:9px;background:#11161d;color:#c9ff48;font-size:8px;font-weight:900;cursor:pointer}
    .fp-guide-button{min-height:38px;border:1px solid #c8d0c2;border-radius:9px;background:#fff;color:#39434b;font-size:8px;font-weight:850;cursor:pointer}
    .fp-export-help{display:grid;gap:7px;margin:11px 0}
    .fp-export-option{display:grid;grid-template-columns:34px 1fr auto;gap:9px;align-items:center;padding:10px;border:1px solid var(--fp-line);border-radius:11px;background:#fafbf8;text-align:left;cursor:pointer}
    .fp-export-option:hover{border-color:#9ab147;background:#f4f8e7}.fp-export-option>span:first-child{display:grid;width:34px;height:34px;place-items:center;border-radius:9px;background:#11161d;color:#c9ff48;font-size:7px;font-weight:950}
    .fp-export-option strong,.fp-export-option small{display:block}.fp-export-option strong{font-size:9px}.fp-export-option small{margin-top:2px;color:#75808a;font-size:7px;line-height:1.45}.fp-export-option em{padding:4px 6px;border-radius:99px;background:#eaf3ca;color:#526500;font-size:6px;font-style:normal;font-weight:950}
    .fp-export-explain{margin:0 0 9px;color:#737e87;font-size:8px;line-height:1.55}.fp-export-grid.is-easy-hidden{display:none!important}
    @media(max-width:560px){.fp-size-choices{grid-template-columns:repeat(2,minmax(0,1fr))}.fp-easy-actions{grid-template-columns:1fr}.fp-mode-toggle button{padding-inline:7px}}
  `;
  document.head.appendChild(style);

  const exactRow=widthInput.closest('.fp-two');
  exactRow?.classList.add('fp-exact-size-row');
  apply.classList.add('fp-exact-apply');

  const easy=document.createElement('div');
  easy.className='fp-easy-box';
  easy.innerHTML=`
    <div class="fp-easy-head">
      <div><strong>크기를 몰라도 괜찮아요</strong><span>정확한 설계도 대신 공간의 대략적인 구조와 촬영 위치를 전달하는 용도로 만들 수 있습니다.</span></div>
      <div class="fp-mode-toggle" role="group" aria-label="도면 제작 방식"><button type="button" class="active" data-fp-mode="easy">쉽게</button><button type="button" data-fp-mode="exact">실측 입력</button></div>
    </div>
    <p class="fp-size-question">공간이 체감상 어느 정도인가요?</p>
    <div class="fp-size-choices">
      <button type="button" class="fp-size-choice" data-fp-size="small"><b>작은 공간</b><small>방·소형 매장</small></button>
      <button type="button" class="fp-size-choice active" data-fp-size="medium"><b>보통 공간</b><small>사무실·카페</small></button>
      <button type="button" class="fp-size-choice" data-fp-size="large"><b>넓은 공간</b><small>파티룸·스튜디오</small></button>
      <button type="button" class="fp-size-choice" data-fp-size="unknown"><b>잘 모르겠어요</b><small>추천 크기 사용</small></button>
    </div>
    <div class="fp-easy-actions"><button type="button" class="fp-camera-suggest" id="suggestCameraBtn">360 촬영 위치 자동 추천</button><button type="button" class="fp-guide-button" id="showExactSizeBtn">정확한 숫자 직접 입력</button></div>
    <p class="fp-easy-note">대략적으로 만든 도면도 상담 자료로 충분합니다. 나중에 실제 크기를 알게 되면 ‘실측 입력’에서 수정할 수 있습니다.</p>
  `;
  (gallery||select.closest('.fp-field')).insertAdjacentElement('afterend',easy);

  const setMode=mode=>{
    const exact=mode==='exact';
    easy.querySelectorAll('[data-fp-mode]').forEach(button=>button.classList.toggle('active',button.dataset.fpMode===mode));
    exactRow?.classList.toggle('is-hidden',!exact);
    apply.classList.toggle('is-hidden',!exact);
    easy.querySelector('.fp-size-question').hidden=exact;
    easy.querySelector('.fp-size-choices').hidden=exact;
    easy.querySelector('.fp-easy-actions').hidden=exact;
    easy.querySelector('.fp-easy-note').textContent=exact?'실측값이 있다면 미터 단위로 입력하세요. 완벽하게 정확하지 않아도 됩니다.':'대략적으로 만든 도면도 상담 자료로 충분합니다. 나중에 실제 크기를 알게 되면 ‘실측 입력’에서 수정할 수 있습니다.';
  };
  setMode('easy');

  easy.addEventListener('click',event=>{
    const mode=event.target.closest('[data-fp-mode]');
    if(mode){setMode(mode.dataset.fpMode);return}
    const sizeButton=event.target.closest('[data-fp-size]');
    if(sizeButton){
      const size=sizeButton.dataset.fpSize;
      easy.querySelectorAll('[data-fp-size]').forEach(button=>button.classList.toggle('active',button===sizeButton));
      const table=defaults[select.value]||defaults.rectangle;
      const values=table[size==='unknown'?'medium':size];
      widthInput.value=values[0];heightInput.value=values[1];
      apply.click();
      toast(size==='unknown'?'추천 크기로 도면을 만들었습니다. 실제 비율과 달라도 괜찮습니다.':`${sizeButton.querySelector('b').textContent} 기준으로 도면을 만들었습니다.`);
      return;
    }
  });
  $('#showExactSizeBtn')?.addEventListener('click',()=>setMode('exact'));

  const cameraPositions={
    office:[[.28,.38],[.56,.62],[.79,.28]],
    cafe:[[.24,.32],[.49,.65],[.79,.35]],
    party:[[.24,.34],[.5,.62],[.77,.27],[.78,.7]],
    studio:[[.28,.3],[.5,.68],[.8,.38]],
    rectangle:[[.32,.36],[.68,.64]],
    blank:[[.38,.4],[.65,.62]]
  };
  $('#suggestCameraBtn')?.addEventListener('click',()=>{
    if($$('.fp-camera-shape').length){toast('이미 촬영 위치가 표시되어 있습니다. 필요한 곳만 추가하거나 이동해 주세요.');return}
    const svg=$('#floorplanSvg');
    const tool=$('[data-tool="camera"]');
    if(!svg||!tool){toast('촬영 위치 도구를 찾지 못했습니다.',true);return}
    svg.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(()=>{
      const rect=svg.getBoundingClientRect();
      const points=cameraPositions[select.value]||cameraPositions.rectangle;
      tool.click();
      points.forEach(([x,y],index)=>{
        setTimeout(()=>{
          const EventClass=window.PointerEvent||window.MouseEvent;
          svg.dispatchEvent(new EventClass('pointerdown',{bubbles:true,button:0,clientX:rect.left+rect.width*x,clientY:rect.top+rect.height*y,pointerId:index+20}));
        },index*70);
      });
      setTimeout(()=>{$('[data-tool="select"]')?.click();toast(`${points.length}개의 360 촬영 위치를 추천했습니다. 드래그해서 옮길 수 있습니다.`)},points.length*80+80);
    },350);
  });

  const exportPanel=$$('.fp-panel').find(panel=>panel.querySelector('h2')?.textContent.trim()==='내보내기');
  if(exportPanel&&!exportPanel.querySelector('.fp-export-help')){
    const grid=exportPanel.querySelector('.fp-export-grid');
    grid?.classList.add('is-easy-hidden');
    const intro=document.createElement('p');intro.className='fp-export-explain';intro.textContent='용도에 맞는 형식을 선택하세요. 일반 고객 문의에는 PNG가 가장 간단합니다.';
    const options=document.createElement('div');options.className='fp-export-help';
    options.innerHTML=`
      <button type="button" class="fp-export-option" data-easy-export="png"><span>PNG</span><span><strong>상담용 이미지</strong><small>카카오톡·이메일·문의 폼에 첨부</small></span><em>추천</em></button>
      <button type="button" class="fp-export-option" data-easy-export="project"><span>JSON</span><span><strong>나중에 계속 수정</strong><small>이 도구에서 다시 열 수 있는 프로젝트 파일</small></span><em>편집용</em></button>
      <button type="button" class="fp-export-option" data-easy-export="pdf"><span>PDF</span><span><strong>인쇄 또는 PDF 저장</strong><small>인쇄 창에서 ‘PDF로 저장’을 선택</small></span><em>문서용</em></button>
      <button type="button" class="fp-export-option" data-easy-export="svg"><span>SVG</span><span><strong>디자인·확대 편집</strong><small>Illustrator 등에서 품질 저하 없이 사용</small></span><em>전문용</em></button>
    `;
    const background=exportPanel.querySelector('#exportBackground')?.closest('.fp-field');
    (background||grid)?.insertAdjacentElement('afterend',intro);
    intro.insertAdjacentElement('afterend',options);
    options.addEventListener('click',event=>{
      const button=event.target.closest('[data-easy-export]');if(!button)return;
      const map={png:'#exportPngSideBtn',project:'#saveProjectBtn',pdf:'#printBtn',svg:'#exportSvgBtn'};
      $(map[button.dataset.easyExport])?.click();
    });
  }
})();
