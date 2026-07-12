(()=>{
  if(!location.pathname.toLowerCase().endsWith('demo-store-guide.html')) return;
  const style=document.createElement('style');
  style.textContent=`
    #floorMap .zone[data-id="daily"]{grid-column:1/5!important;grid-row:1/4!important}
    #floorMap .zone[data-id="living"]{grid-column:5/13!important;grid-row:1/3!important}
    #floorMap .zone[data-id="gift"]{grid-column:1/5!important;grid-row:4/8!important}
    #floorMap .zone[data-id="season"]{grid-column:5/9!important;grid-row:3/8!important}
    #floorMap .zone[data-id="experience"]{grid-column:9/13!important;grid-row:3/7!important}
    @media(max-width:620px){
      #floorMap .zone{min-width:0;overflow:hidden}
      #floorMap .zone span{max-width:100%;overflow-wrap:anywhere}
    }
  `;
  document.head.append(style);
})();