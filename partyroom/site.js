const info={
overview:{no:"01",title:"전체 공간",desc:"포커존, TV 라운지, 다인석 테이블, PC존과 주방이 연결되는 전체 구조입니다."},
lounge:{no:"02",title:"TV · 노래방 · PS5",desc:"소파와 대형 TV, 노래방 기기, 플레이스테이션 5와 홀덤 테이블이 모인 구역입니다."},
tablepc:{no:"03",title:"다인석 테이블",desc:"식사, 보드게임과 단체 모임에 활용하는 중앙 테이블입니다."},
pc:{no:"04",title:"PC 게임존",desc:"여러 대의 PC와 게이밍 좌석이 나란히 배치된 게임 구역입니다."},
kitchen:{no:"05",title:"주방 · 편의시설",desc:"싱크대, 냉장고, 전자레인지와 중앙 테이블 사이 동선을 확인합니다."}
};
document.getElementById("floorplan").innerHTML=`<svg viewBox="0 0 900 520" role="img" aria-label="퓨처스페이스 게임파티룸 공간 배치도">
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
<button class="marker active" style="left:50%;top:57%" data-scene="overview">01</button><button class="marker" style="left:29%;top:42%" data-scene="lounge">02</button><button class="marker" style="left:66%;top:47%" data-scene="tablepc">03</button><button class="marker" style="left:76%;top:82%" data-scene="pc">04</button><button class="marker" style="left:88%;top:34%" data-scene="kitchen">05</button>`;
const root="/works/partyroom-360-tour/assets/";
const viewer=pannellum.viewer("panorama",{default:{firstScene:"overview",autoLoad:true,sceneFadeDuration:650,hfov:105,minHfov:45,maxHfov:120},scenes:{
overview:{type:"equirectangular",panorama:root+"scene-overview.png",yaw:35,hotSpots:[{pitch:-13,yaw:72,type:"scene",sceneId:"lounge",cssClass:"tour-arrow"},{pitch:-12,yaw:-88,type:"scene",sceneId:"tablepc",cssClass:"tour-arrow"},{pitch:-11,yaw:-112,type:"scene",sceneId:"pc",cssClass:"tour-arrow"},{pitch:-11,yaw:-25,type:"scene",sceneId:"kitchen",cssClass:"tour-arrow"}]},
lounge:{type:"equirectangular",panorama:root+"scene-lounge.png",yaw:12,hotSpots:[{pitch:-12,yaw:-88,type:"scene",sceneId:"overview",cssClass:"tour-arrow"},{pitch:-11,yaw:12,type:"scene",sceneId:"tablepc",cssClass:"tour-arrow"}]},
tablepc:{type:"equirectangular",panorama:root+"scene-table-pc.png",yaw:20,hotSpots:[{pitch:-12,yaw:88,type:"scene",sceneId:"overview",cssClass:"tour-arrow"},{pitch:-11,yaw:-82,type:"scene",sceneId:"kitchen",cssClass:"tour-arrow"},{pitch:-16,yaw:-102,type:"scene",sceneId:"pc",cssClass:"tour-arrow"}]},
pc:{type:"equirectangular",panorama:root+"scene-pc.jpg",yaw:-28,hotSpots:[{pitch:-16,yaw:118,type:"scene",sceneId:"overview",cssClass:"tour-arrow"},{pitch:-16,yaw:12,type:"scene",sceneId:"tablepc",cssClass:"tour-arrow"}]},
kitchen:{type:"equirectangular",panorama:root+"scene-kitchen.png",yaw:4,hotSpots:[{pitch:-12,yaw:82,type:"scene",sceneId:"tablepc",cssClass:"tour-arrow"},{pitch:-11,yaw:8,type:"scene",sceneId:"overview",cssClass:"tour-arrow"}]}
}});
const list=document.getElementById("sceneList");
Object.entries(info).forEach(([id,s])=>{const b=document.createElement("button");b.dataset.scene=id;b.innerHTML=`<span>${s.no} · ${s.title}</span><b>↗</b>`;b.onclick=()=>viewer.loadScene(id);list.appendChild(b)});
document.querySelectorAll(".marker").forEach(b=>b.onclick=()=>viewer.loadScene(b.dataset.scene));
function sync(id){const s=info[id];if(!s)return;sceneBadge.textContent=`${s.no} · ${s.title}`;sceneTitle.textContent=s.title;sceneDesc.textContent=s.desc;document.querySelectorAll("[data-scene]").forEach(e=>e.classList.toggle("active",e.dataset.scene===id))}
viewer.on("scenechange",sync);sync("overview");