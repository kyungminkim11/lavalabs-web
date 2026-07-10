const sceneInfo={
  overview:{no:"01",title:"전체 공간",desc:"포커존, TV 라운지, 다인석 테이블, PC존과 주방이 연결되는 전체 구조입니다."},
  lounge:{no:"02",title:"TV · 노래방 · PS5 라운지",desc:"소파와 대형 TV, 노래방 기기, 플레이스테이션 5가 모인 엔터테인먼트 구역입니다."},
  tablepc:{no:"03",title:"다인석 테이블",desc:"식사, 보드게임과 단체 모임에 활용하는 중앙 다인석 테이블입니다."},
  pc:{no:"04",title:"PC 게임존",desc:"여러 대의 PC와 게이밍 좌석이 한쪽 벽면에 나란히 배치된 게임 구역입니다."},
  kitchen:{no:"05",title:"주방 · 편의시설",desc:"싱크대, 냉장고, 전자레인지와 식기류를 확인하는 주방 구역입니다."}
};

const floorplan=document.getElementById("floorplan");
floorplan.innerHTML=`<svg viewBox="0 0 900 520" role="img" aria-label="퓨처스페이스 게임파티룸 공간 배치도">
<rect x="28" y="30" width="824" height="455" rx="22" fill="#fff" stroke="#d6dee7" stroke-width="5"/>
<rect x="55" y="94" width="135" height="145" rx="54" fill="#ede7ff"/><text class="map-label" x="122" y="172" text-anchor="middle">포커</text>
<rect x="218" y="96" width="105" height="142" rx="14" fill="#e8f4ff"/><text class="map-label" x="270" y="172" text-anchor="middle">소파</text>
<rect x="350" y="46" width="150" height="58" rx="12" fill="#fff2cf"/><text class="map-small" x="425" y="81" text-anchor="middle">전자레인지</text>
<rect x="390" y="140" width="76" height="94" rx="10" fill="#202734"/><text x="428" y="194" text-anchor="middle" font-size="22" font-weight="950" fill="#fff">TV</text><text class="map-small" x="428" y="258" text-anchor="middle">노래방 · PS5</text>
<rect x="480" y="168" width="232" height="102" rx="14" fill="#eaffdf"/><text class="map-label" x="596" y="226" text-anchor="middle">다인석 테이블</text>
<rect x="575" y="48" width="92" height="52" rx="11" fill="#e9f5ff"/><text class="map-small" x="621" y="79" text-anchor="middle">싱크대</text>
<rect x="684" y="48" width="74" height="78" rx="11" fill="#eef2f5"/><text class="map-small" x="721" y="91" text-anchor="middle">냉장고</text>
<rect x="775" y="48" width="55" height="98" rx="11" fill="#e8f4ff"/><text class="map-small" x="802" y="101" text-anchor="middle" transform="rotate(-90 802 101)">에어컨</text>
<rect x="786" y="182" width="44" height="172" rx="10" fill="#ffe9e9"/><text class="map-small" x="808" y="271" text-anchor="middle" transform="rotate(-90 808 271)">주방</text>
<rect x="390" y="382" width="164" height="70" rx="12" fill="#fff2cf"/><text class="map-label" x="472" y="424" text-anchor="middle">보드게임</text>
<rect x="598" y="382" width="168" height="70" rx="12" fill="#e9f5ff"/><text class="map-label" x="682" y="424" text-anchor="middle">PC</text>
<path d="M852 485h-78m78 0v-78" fill="none" stroke="#8d98a5" stroke-width="5"/><path d="M774 485a78 78 0 0 1 78-78" fill="none" stroke="#c7d0d9" stroke-width="3" stroke-dasharray="8 7"/><text class="map-small" x="805" y="472" text-anchor="middle">출입문</text></svg>
<button class="marker active" style="left:50%;top:57%" data-scene="overview" aria-label="전체 공간으로 이동">01</button>
<button class="marker" style="left:29%;top:42%" data-scene="lounge" aria-label="TV 라운지로 이동">02</button>
<button class="marker" style="left:66%;top:47%" data-scene="tablepc" aria-label="다인석 테이블로 이동">03</button>
<button class="marker" style="left:76%;top:82%" data-scene="pc" aria-label="PC 게임존으로 이동">04</button>
<button class="marker" style="left:88%;top:34%" data-scene="kitchen" aria-label="주방으로 이동">05</button>`;

let viewer=null;
function syncScene(id){
  const s=sceneInfo[id];if(!s)return;
  document.getElementById("sceneBadge").textContent=`${s.no} · ${s.title}`;
  document.getElementById("sceneNumber").textContent=`SCENE ${s.no}`;
  document.getElementById("sceneTitle").textContent=s.title;
  document.getElementById("sceneDesc").textContent=s.desc;
  document.querySelectorAll("[data-scene]").forEach(el=>el.classList.toggle("active",el.dataset.scene===id));
}
function loadScene(id){if(viewer)viewer.loadScene(id);else syncScene(id)}
const sceneList=document.getElementById("sceneList");
Object.entries(sceneInfo).forEach(([id,s])=>{
  const button=document.createElement("button");
  button.type="button";button.dataset.scene=id;
  button.innerHTML=`<span>${s.no} · ${s.title}</span><b aria-hidden="true">↗</b>`;
  button.addEventListener("click",()=>loadScene(id));
  sceneList.appendChild(button);
});
document.querySelectorAll(".marker").forEach(button=>button.addEventListener("click",()=>loadScene(button.dataset.scene)));

if(window.pannellum){
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
  document.getElementById("panorama").innerHTML='<div class="viewer-fallback"><b>360° 투어를 불러오지 못했습니다.</b><span>네트워크를 확인한 뒤 새로고침해 주세요.</span></div>';
}
syncScene("overview");

const menuToggle=document.querySelector(".menu-toggle");
const nav=document.getElementById("primaryNav");
function closeMenu(){menuToggle.setAttribute("aria-expanded","false");nav.classList.remove("open");document.body.classList.remove("menu-open")}
menuToggle.addEventListener("click",()=>{const open=menuToggle.getAttribute("aria-expanded")==="true";menuToggle.setAttribute("aria-expanded",String(!open));nav.classList.toggle("open",!open);document.body.classList.toggle("menu-open",!open)});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
window.addEventListener("resize",()=>{if(innerWidth>720)closeMenu()});

const config=window.PARTYROOM_CONFIG||{};
document.querySelectorAll("[data-config-text]").forEach(el=>{const value=config[el.dataset.configText];if(value)el.textContent=value});
document.querySelectorAll("[data-config-link]").forEach(el=>{
  const key=el.dataset.configLink;const value=config[key];
  if(!value)return;
  el.hidden=false;
  el.href=el.dataset.linkType==="tel"?`tel:${String(value).replace(/[^0-9+]/g,"")}`:value;
  if(!el.href.startsWith("tel:")){el.target="_blank";el.rel="noopener"}
});
const bookingButton=document.getElementById("bookingPrimary");
if(config.bookingUrl){bookingButton.href=config.bookingUrl;bookingButton.textContent=config.bookingLabel||"온라인 예약";bookingButton.target="_blank";bookingButton.rel="noopener"}else{bookingButton.setAttribute("aria-disabled","true");bookingButton.textContent="예약 채널 연결 예정"}

const shareData={title:document.title,text:"퓨처스페이스 게임파티룸을 사진과 360° 투어로 둘러보세요.",url:location.href};
document.querySelectorAll(".share-button").forEach(button=>button.addEventListener("click",async()=>{
  try{if(navigator.share)await navigator.share(shareData);else{await navigator.clipboard.writeText(location.href);const old=button.textContent;button.textContent="링크 복사 완료";setTimeout(()=>button.textContent=old,1800)}}catch(error){if(error.name!=="AbortError")console.warn(error)}
}));

const lightbox=document.getElementById("lightbox");
const lightboxImage=lightbox.querySelector("img");
const lightboxCaption=lightbox.querySelector("figcaption");
const lightboxItems=[...document.querySelectorAll("[data-lightbox-src]")];
let currentIndex=0,lastFocus=null;
function renderLightbox(index){currentIndex=(index+lightboxItems.length)%lightboxItems.length;const item=lightboxItems[currentIndex];lightboxImage.src=item.dataset.lightboxSrc;lightboxImage.alt=item.dataset.lightboxAlt||"";lightboxCaption.textContent=item.dataset.lightboxAlt||""}
function openLightbox(index){lastFocus=lightboxItems[index];renderLightbox(index);lightbox.hidden=false;document.body.style.overflow="hidden";lightbox.querySelector(".lightbox-close").focus()}
function closeLightbox(){lightbox.hidden=true;lightboxImage.src="";document.body.style.overflow="";lastFocus?.focus()}
lightboxItems.forEach((button,index)=>button.addEventListener("click",()=>openLightbox(index)));
lightbox.querySelector(".lightbox-close").addEventListener("click",closeLightbox);
lightbox.querySelector(".prev").addEventListener("click",()=>renderLightbox(currentIndex-1));
lightbox.querySelector(".next").addEventListener("click",()=>renderLightbox(currentIndex+1));
lightbox.addEventListener("click",event=>{if(event.target===lightbox)closeLightbox()});
document.addEventListener("keydown",event=>{
  if(lightbox.hidden)return;
  if(event.key==="Escape")closeLightbox();
  if(event.key==="ArrowLeft")renderLightbox(currentIndex-1);
  if(event.key==="ArrowRight")renderLightbox(currentIndex+1);
  if(event.key==="Tab"){
    const focusables=[...lightbox.querySelectorAll("button:not([disabled])")];const first=focusables[0],last=focusables.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
});

document.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>{img.closest("picture")?.classList.add("image-error");img.alt="이미지를 불러오지 못했습니다."}));
