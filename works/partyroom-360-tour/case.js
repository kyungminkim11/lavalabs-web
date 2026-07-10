const sceneInfo={
  overview:{no:"01",title:"전체 공간",desc:"전체 공간의 구조와 주요 구역 사이 동선을 확인하는 기준 장면입니다."},
  lounge:{no:"02",title:"TV · 노래방 · PS5 라운지",desc:"소파와 대형 TV, 노래방 기기, 플레이스테이션 5가 모인 엔터테인먼트 구역입니다."},
  tablepc:{no:"03",title:"다인석 테이블",desc:"식사, 보드게임과 단체 모임에 활용하는 중앙 다인석 테이블입니다."},
  pc:{no:"04",title:"PC 게임존",desc:"여러 대의 PC와 게이밍 좌석이 나란히 배치된 게임 구역입니다."},
  kitchen:{no:"05",title:"주방 · 편의시설",desc:"싱크대, 냉장고, 전자레인지와 식기류를 확인하는 주방 구역입니다."}
};

const floorplan=document.getElementById("floorplan");
if(floorplan){
  floorplan.innerHTML=`<svg viewBox="0 0 900 520" role="img" aria-label="실제 배치 기반 파티룸 안내 도면. 출입문은 왼쪽 아래에 있습니다.">
    <rect x="28" y="30" width="824" height="455" rx="22" fill="#fff" stroke="#d6dee7" stroke-width="5"/>
    <text class="map-small" x="48" y="58">안쪽 벽면</text>
    <ellipse cx="120" cy="174" rx="74" ry="102" fill="#ede7ff" stroke="#d6cbea" stroke-width="2"/><text class="map-label" x="120" y="170" text-anchor="middle">홀덤</text><text class="map-small" x="120" y="194" text-anchor="middle">포커 테이블</text>
    <rect x="210" y="96" width="96" height="150" rx="14" fill="#e8f4ff" stroke="#cbd8e4" stroke-width="2"/><text class="map-label" x="258" y="175" text-anchor="middle" transform="rotate(-90 258 175)">소파</text>
    <rect x="346" y="46" width="156" height="60" rx="12" fill="#fff2cf" stroke="#e3d5ab" stroke-width="2"/><text class="map-small" x="424" y="82" text-anchor="middle">전자레인지</text>
    <rect x="390" y="138" width="76" height="96" rx="10" fill="#202734"/><text x="428" y="194" text-anchor="middle" font-size="22" font-weight="950" fill="#fff">TV</text><text class="map-small" x="428" y="258" text-anchor="middle">노래방 · PS5</text>
    <rect x="506" y="166" width="226" height="104" rx="14" fill="#eaffdf" stroke="#cfe3c6" stroke-width="2"/><text class="map-label" x="619" y="224" text-anchor="middle">다인석 테이블</text>
    <rect x="566" y="48" width="92" height="52" rx="11" fill="#e9f5ff" stroke="#cedbe5" stroke-width="2"/><text class="map-small" x="612" y="79" text-anchor="middle">싱크대</text>
    <rect x="675" y="48" width="76" height="80" rx="11" fill="#eef2f5" stroke="#d6dde3" stroke-width="2"/><text class="map-small" x="713" y="93" text-anchor="middle">냉장고</text>
    <rect x="770" y="48" width="56" height="100" rx="11" fill="#e8f4ff" stroke="#cedbe5" stroke-width="2"/><text class="map-small" x="798" y="102" text-anchor="middle" transform="rotate(-90 798 102)">에어컨</text>
    <rect x="784" y="182" width="42" height="174" rx="10" fill="#ffe9e9" stroke="#e5cfcf" stroke-width="2"/><text class="map-small" x="805" y="271" text-anchor="middle" transform="rotate(-90 805 271)">주방 수납</text>
    <rect x="390" y="382" width="164" height="70" rx="12" fill="#fff2cf" stroke="#e3d5ab" stroke-width="2"/><text class="map-label" x="472" y="424" text-anchor="middle">보드게임</text>
    <rect x="598" y="382" width="168" height="70" rx="12" fill="#e9f5ff" stroke="#cedbe5" stroke-width="2"/><text class="map-label" x="682" y="424" text-anchor="middle">PC 게임존</text>
    <path d="M58 485H200" fill="none" stroke="#fff" stroke-width="12"/><path d="M200 485V343" fill="none" stroke="#8d98a5" stroke-width="5"/><path d="M58 485A142 142 0 0 1 200 343" fill="none" stroke="#c7d0d9" stroke-width="3" stroke-dasharray="8 7"/><text class="map-small" x="129" y="470" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="5">출입문</text>
  </svg>
  <button class="marker active" style="left:50%;top:57%" data-scene="overview" aria-label="전체 공간으로 이동">01</button>
  <button class="marker" style="left:29%;top:42%" data-scene="lounge" aria-label="TV 라운지로 이동">02</button>
  <button class="marker" style="left:69%;top:47%" data-scene="tablepc" aria-label="다인석 테이블로 이동">03</button>
  <button class="marker" style="left:76%;top:82%" data-scene="pc" aria-label="PC 게임존으로 이동">04</button>
  <button class="marker" style="left:89%;top:35%" data-scene="kitchen" aria-label="주방으로 이동">05</button>`;
}

let viewer=null;
function syncScene(id){
  const scene=sceneInfo[id];
  if(!scene)return;
  const badge=document.getElementById("sceneBadge");
  const number=document.getElementById("sceneNo");
  const title=document.getElementById("sceneTitle");
  const desc=document.getElementById("sceneDesc");
  if(badge)badge.textContent=`${scene.no} · ${scene.title}`;
  if(number)number.textContent=`SCENE ${scene.no}`;
  if(title)title.textContent=scene.title;
  if(desc)desc.textContent=scene.desc;
  document.querySelectorAll("[data-scene]").forEach(element=>element.classList.toggle("active",element.dataset.scene===id));
}
function loadScene(id){
  if(viewer){viewer.loadScene(id)}else{syncScene(id)}
}
window.loadScene=loadScene;

const sceneList=document.getElementById("sceneList");
if(sceneList){
  Object.entries(sceneInfo).forEach(([id,scene])=>{
    const button=document.createElement("button");
    button.type="button";
    button.dataset.scene=id;
    button.innerHTML=`<span>${scene.no} · ${scene.title}</span><b aria-hidden="true">↗</b>`;
    button.addEventListener("click",()=>loadScene(id));
    sceneList.appendChild(button);
  });
}
document.querySelectorAll(".marker").forEach(button=>button.addEventListener("click",()=>loadScene(button.dataset.scene)));

if(window.pannellum&&document.getElementById("panorama")){
  const root="/works/partyroom-360-tour/assets/";
  viewer=pannellum.viewer("panorama",{
    default:{firstScene:"overview",autoLoad:true,sceneFadeDuration:650,showControls:true,compass:false,hfov:102,minHfov:45,maxHfov:120},
    scenes:{
      overview:{type:"equirectangular",panorama:root+"scene-overview.png?v=20260710hq",yaw:35,pitch:-2,hotSpots:[{pitch:-13,yaw:72,type:"scene",sceneId:"lounge",text:"TV 라운지",cssClass:"tour-arrow"},{pitch:-12,yaw:-88,type:"scene",sceneId:"tablepc",text:"다인석 테이블",cssClass:"tour-arrow"},{pitch:-11,yaw:-112,type:"scene",sceneId:"pc",text:"PC 게임존",cssClass:"tour-arrow"},{pitch:-11,yaw:-25,type:"scene",sceneId:"kitchen",text:"주방",cssClass:"tour-arrow"}]},
      lounge:{type:"equirectangular",panorama:root+"scene-lounge.png?v=20260710hq",yaw:12,pitch:-2,hotSpots:[{pitch:-12,yaw:-88,type:"scene",sceneId:"overview",text:"전체 공간",cssClass:"tour-arrow"},{pitch:-11,yaw:12,type:"scene",sceneId:"tablepc",text:"다인석 테이블",cssClass:"tour-arrow"},{pitch:-15,yaw:-62,type:"scene",sceneId:"pc",text:"PC 게임존",cssClass:"tour-arrow"}]},
      tablepc:{type:"equirectangular",panorama:root+"scene-table-pc.png?v=20260710hq",yaw:20,pitch:-2,hotSpots:[{pitch:-12,yaw:88,type:"scene",sceneId:"overview",text:"전체 공간",cssClass:"tour-arrow"},{pitch:-11,yaw:-82,type:"scene",sceneId:"kitchen",text:"주방",cssClass:"tour-arrow"},{pitch:-16,yaw:-102,type:"scene",sceneId:"pc",text:"PC 게임존",cssClass:"tour-arrow"}]},
      pc:{type:"equirectangular",panorama:root+"scene-pc.jpg?v=20260710hq",yaw:-28,pitch:-2,hotSpots:[{pitch:-16,yaw:118,type:"scene",sceneId:"overview",text:"전체 공간",cssClass:"tour-arrow"},{pitch:-16,yaw:12,type:"scene",sceneId:"tablepc",text:"다인석 테이블",cssClass:"tour-arrow"},{pitch:-15,yaw:-74,type:"scene",sceneId:"kitchen",text:"주방",cssClass:"tour-arrow"}]},
      kitchen:{type:"equirectangular",panorama:root+"scene-kitchen.png?v=20260710hq",yaw:4,pitch:-2,hotSpots:[{pitch:-12,yaw:82,type:"scene",sceneId:"tablepc",text:"다인석 테이블",cssClass:"tour-arrow"},{pitch:-11,yaw:8,type:"scene",sceneId:"overview",text:"전체 공간",cssClass:"tour-arrow"}]}
    }
  });
  viewer.on("scenechange",syncScene);
}else{
  const panorama=document.getElementById("panorama");
  if(panorama)panorama.innerHTML='<div class="viewer-fallback"><b>360° 투어를 불러오지 못했습니다.</b><span>네트워크를 확인한 뒤 새로고침해 주세요.</span></div>';
}
syncScene("overview");

const menuToggle=document.querySelector(".menu-toggle");
const primaryNav=document.getElementById("primaryNav");
function closeMenu(){
  if(!menuToggle||!primaryNav)return;
  menuToggle.setAttribute("aria-expanded","false");
  primaryNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}
if(menuToggle&&primaryNav){
  menuToggle.addEventListener("click",()=>{
    const isOpen=menuToggle.getAttribute("aria-expanded")==="true";
    menuToggle.setAttribute("aria-expanded",String(!isOpen));
    primaryNav.classList.toggle("open",!isOpen);
    document.body.classList.toggle("menu-open",!isOpen);
  });
  primaryNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
  window.addEventListener("resize",()=>{if(window.innerWidth>760)closeMenu()});
}

const caseLinks=[...document.querySelectorAll(".case-nav a[href^='#']")];
const trackedSections=caseLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
if("IntersectionObserver" in window&&trackedSections.length){
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    caseLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")===`#${visible.target.id}`));
  },{rootMargin:"-32% 0px -58%",threshold:[0,.2,.5]});
  trackedSections.forEach(section=>observer.observe(section));
}
const progressBar=document.querySelector(".reading-progress i");
function updateProgress(){
  if(!progressBar)return;
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const progress=max>0?Math.min(100,Math.max(0,(window.scrollY/max)*100)):0;
  progressBar.style.width=`${progress}%`;
}
window.addEventListener("scroll",updateProgress,{passive:true});
updateProgress();

const shareData={title:document.title,text:"LavaLabs 파티룸 360° 가상투어·웹사이트 제작 사례",url:`${location.origin}${location.pathname}`};
document.querySelectorAll(".share-button").forEach(button=>button.addEventListener("click",async()=>{
  const original=button.textContent;
  try{
    if(navigator.share){await navigator.share(shareData)}
    else if(navigator.clipboard){await navigator.clipboard.writeText(shareData.url);button.textContent="링크 복사 완료";setTimeout(()=>button.textContent=original,1800)}
    else{window.prompt("아래 주소를 복사해 주세요.",shareData.url)}
  }catch(error){if(error.name!=="AbortError")console.warn(error)}
}));

const lightbox=document.getElementById("lightbox");
const photoButtons=[...document.querySelectorAll(".photo-open")];
let currentPhoto=0;
let lastFocus=null;
function renderPhoto(index){
  if(!lightbox||!photoButtons.length)return;
  currentPhoto=(index+photoButtons.length)%photoButtons.length;
  const item=photoButtons[currentPhoto];
  const image=lightbox.querySelector("img");
  const caption=lightbox.querySelector("figcaption");
  image.src=item.dataset.image;
  image.alt=item.dataset.caption||"공간 사진";
  caption.textContent=item.dataset.caption||"";
}
function openLightbox(index){
  if(!lightbox)return;
  lastFocus=photoButtons[index];
  renderPhoto(index);
  lightbox.hidden=false;
  document.body.classList.add("lightbox-open");
  lightbox.querySelector(".lightbox-close")?.focus();
}
function closeLightbox(){
  if(!lightbox)return;
  lightbox.hidden=true;
  document.body.classList.remove("lightbox-open");
  const image=lightbox.querySelector("img");
  if(image)image.src="";
  lastFocus?.focus();
}
photoButtons.forEach((button,index)=>button.addEventListener("click",()=>openLightbox(index)));
if(lightbox){
  lightbox.querySelector(".lightbox-close")?.addEventListener("click",closeLightbox);
  lightbox.querySelector(".lightbox-prev")?.addEventListener("click",()=>renderPhoto(currentPhoto-1));
  lightbox.querySelector(".lightbox-next")?.addEventListener("click",()=>renderPhoto(currentPhoto+1));
  lightbox.addEventListener("click",event=>{if(event.target===lightbox)closeLightbox()});
}
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){
    if(lightbox&&!lightbox.hidden)closeLightbox();
    else closeMenu();
  }
  if(!lightbox||lightbox.hidden)return;
  if(event.key==="ArrowLeft")renderPhoto(currentPhoto-1);
  if(event.key==="ArrowRight")renderPhoto(currentPhoto+1);
  if(event.key==="Tab"){
    const focusables=[...lightbox.querySelectorAll("button")];
    const first=focusables[0],last=focusables.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
});

document.querySelectorAll(".faq-list details").forEach(details=>details.addEventListener("toggle",()=>{
  if(!details.open)return;
  document.querySelectorAll(".faq-list details[open]").forEach(other=>{if(other!==details)other.open=false});
}));

document.querySelectorAll("img").forEach(image=>image.addEventListener("error",()=>{
  image.closest("picture")?.classList.add("image-error");
  image.alt="이미지를 불러오지 못했습니다.";
}));
