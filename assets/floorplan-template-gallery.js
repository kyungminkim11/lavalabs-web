(()=>{
  'use strict';
  const select=document.querySelector('#templateSelect');
  const apply=document.querySelector('#applyTemplateBtn');
  if(!select||!apply)return;

  const templates=[
    {id:'blank',title:'빈 도면',desc:'처음부터 직접 그리기',badge:'FREE',preview:'blank'},
    {id:'rectangle',title:'기본 직사각형',desc:'가장 쉬운 시작',badge:'BASIC',preview:'rectangle'},
    {id:'office',title:'소형 사무실',desc:'업무·회의·탕비 공간',badge:'OFFICE',preview:'office'},
    {id:'cafe',title:'카페·매장',desc:'홀·카운터·창고',badge:'SHOP',preview:'cafe'},
    {id:'party',title:'파티룸',desc:'라운지·PC·주방·게임',badge:'POPULAR',preview:'party'},
    {id:'studio',title:'촬영 스튜디오',desc:'촬영·메이크업·피팅',badge:'STUDIO',preview:'studio'}
  ];

  const style=document.createElement('style');
  style.textContent=`
    .fp-template-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}
    .fp-template-card{position:relative;display:grid;gap:7px;min-height:118px;padding:9px;border:1px solid var(--fp-line);border-radius:12px;background:#fafbf8;color:#27313a;text-align:left;cursor:pointer;transition:.18s}
    .fp-template-card:hover{border-color:#a9bd68;transform:translateY(-1px);box-shadow:0 8px 22px rgba(42,54,61,.07)}
    .fp-template-card.active{border-color:#759600;background:#f2f8df;box-shadow:0 0 0 2px rgba(123,157,20,.12)}
    .fp-template-card strong{font-size:10px}.fp-template-card small{color:#74808a;font-size:8px;line-height:1.45}
    .fp-template-badge{position:absolute;right:7px;top:7px;padding:4px 5px;border-radius:99px;background:#11161d;color:#c9ff48;font-size:6px;font-weight:900;letter-spacing:.04em}
    .fp-template-preview{position:relative;height:54px;overflow:hidden;border:1px solid #d7ddd2;border-radius:8px;background:linear-gradient(#eef2eb 1px,transparent 1px),linear-gradient(90deg,#eef2eb 1px,transparent 1px),#fff;background-size:10px 10px}
    .fp-template-preview i{position:absolute;display:block;border:2px solid #263039;background:#eef4df}
    .fp-template-preview.blank::after{content:'+';position:absolute;inset:0;display:grid;place-items:center;color:#a5aea4;font-size:23px;font-weight:500}
    .fp-template-preview.rectangle i:nth-child(1){left:10px;right:10px;top:8px;bottom:8px}
    .fp-template-preview.office i:nth-child(1){left:7px;width:58%;top:7px;bottom:7px}.fp-template-preview.office i:nth-child(2){right:7px;width:29%;top:7px;height:42%}.fp-template-preview.office i:nth-child(3){right:7px;width:29%;bottom:7px;height:38%;background:#f3ecdf}
    .fp-template-preview.cafe i:nth-child(1){left:7px;width:62%;top:7px;bottom:7px}.fp-template-preview.cafe i:nth-child(2){right:7px;width:25%;top:7px;height:55%;background:#e4eee0}.fp-template-preview.cafe i:nth-child(3){right:7px;width:25%;bottom:7px;height:25%;background:#eee8dd}
    .fp-template-preview.party i:nth-child(1){left:7px;width:61%;top:7px;bottom:7px;background:#efe8f5}.fp-template-preview.party i:nth-child(2){right:7px;width:26%;top:7px;height:30%;background:#e5eef7}.fp-template-preview.party i:nth-child(3){right:7px;width:26%;top:38%;height:26%;background:#e3efe5}.fp-template-preview.party i:nth-child(4){right:7px;width:26%;bottom:7px;height:20%;background:#f1eadf}
    .fp-template-preview.studio i:nth-child(1){left:7px;width:64%;top:7px;bottom:7px}.fp-template-preview.studio i:nth-child(2){right:7px;width:23%;top:7px;height:28%;background:#f3e7ef}.fp-template-preview.studio i:nth-child(3){right:7px;width:23%;top:38%;height:27%;background:#e8eef4}.fp-template-preview.studio i:nth-child(4){right:7px;width:23%;bottom:7px;height:20%;background:#eee9df}
    .fp-template-note{margin:8px 0 0;padding:9px 10px;border-radius:10px;background:#eef5d7;color:#536600;font-size:8px;line-height:1.55}
    @media(max-width:560px){.fp-template-gallery{grid-template-columns:repeat(2,minmax(0,1fr))}.fp-template-card{min-height:112px}}
  `;
  document.head.appendChild(style);

  const selectLabel=select.closest('.fp-field');
  const gallery=document.createElement('div');
  gallery.className='fp-template-gallery';
  gallery.setAttribute('aria-label','도면 템플릿 선택');
  gallery.innerHTML=templates.map(t=>`<button type="button" class="fp-template-card" data-template-card="${t.id}"><span class="fp-template-badge">${t.badge}</span><span class="fp-template-preview ${t.preview}"><i></i><i></i><i></i><i></i></span><strong>${t.title}</strong><small>${t.desc}</small></button>`).join('');
  selectLabel.insertAdjacentElement('afterend',gallery);

  const note=document.createElement('p');
  note.className='fp-template-note';
  note.textContent='카드를 누르면 선택한 템플릿이 즉시 도면에 만들어집니다. 기존 도면이 있다면 실행 취소(Ctrl+Z)로 되돌릴 수 있습니다.';
  gallery.insertAdjacentElement('afterend',note);

  const sync=()=>{
    gallery.querySelectorAll('[data-template-card]').forEach(btn=>btn.classList.toggle('active',btn.dataset.templateCard===select.value));
  };

  gallery.addEventListener('click',event=>{
    const card=event.target.closest('[data-template-card]');
    if(!card)return;
    select.value=card.dataset.templateCard;
    select.dispatchEvent(new Event('change',{bubbles:true}));
    sync();
    apply.click();
  });
  select.addEventListener('change',sync);

  const storageKey='lava-floorplan-v1';
  const seededKey='lava-floorplan-template-seeded-v2';
  const safeGet=key=>{try{return localStorage.getItem(key)}catch{return null}};
  const safeSet=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
  let saved=null;
  try{saved=JSON.parse(safeGet(storageKey)||'null')}catch{}
  const hasItems=Array.isArray(saved?.items)&&saved.items.length>0;
  const alreadySeeded=safeGet(seededKey)==='1';
  if(!hasItems&&!alreadySeeded){
    select.value='party';
    sync();
    setTimeout(()=>{
      apply.click();
      safeSet(seededKey,'1');
      const toast=document.querySelector('#fpToast');
      if(toast){toast.textContent='파티룸 예시 템플릿을 열었습니다. 다른 카드를 눌러 바로 바꿀 수 있습니다.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3200)}
    },80);
  }else{
    if(select.value==='blank')select.value=hasItems?'blank':'rectangle';
    sync();
  }
})();
