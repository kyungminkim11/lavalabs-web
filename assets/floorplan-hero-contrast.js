(()=>{
  'use strict';
  if(!/\/floorplan-editor\.html$/i.test(location.pathname))return;

  const style=document.createElement('style');
  style.textContent=`
    .floorplan-hero{
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(circle at 8% 12%,rgba(201,255,72,.18),transparent 24%),
        linear-gradient(135deg,#fbfcf7 0%,#f1f4ec 100%)!important;
      color:#11161d!important;
      border-bottom:1px solid #d8ded3;
    }
    .floorplan-hero:after{
      content:'';
      position:absolute;
      right:-120px;
      bottom:-180px;
      width:460px;
      height:460px;
      border-radius:50%;
      background:rgba(201,255,72,.12);
      filter:blur(10px);
      pointer-events:none;
    }
    .floorplan-hero .inner{position:relative;z-index:1}
    .floorplan-hero .eyebrow{
      color:#4d5a66!important;
      font-weight:900!important;
      opacity:1!important;
      text-shadow:none!important;
    }
    .floorplan-hero h1{
      color:#0f151c!important;
      text-shadow:none!important;
    }
    .floorplan-hero p{
      max-width:900px!important;
      color:#35424d!important;
      font-weight:560;
      line-height:1.75;
      opacity:1!important;
      text-shadow:none!important;
    }
    .floorplan-hero-actions .button-primary{
      border-color:#a7d92b!important;
      box-shadow:0 12px 30px rgba(126,158,22,.18);
    }
    .floorplan-hero-actions .button-dark{
      background:#11161d!important;
      color:#fff!important;
      border-color:#11161d!important;
      box-shadow:0 12px 28px rgba(17,22,29,.16);
    }
    .floorplan-hero-actions .button-light{
      background:#fff!important;
      color:#11161d!important;
      border-color:#cbd3c9!important;
      box-shadow:0 10px 26px rgba(17,22,29,.08);
    }
    .floorplan-hero-points{
      gap:10px!important;
      margin-top:24px!important;
    }
    .floorplan-hero-points span{
      padding:9px 13px!important;
      border:1px solid #cfd7cd!important;
      background:rgba(255,255,255,.94)!important;
      color:#33404b!important;
      font-size:10px!important;
      font-weight:850!important;
      opacity:1!important;
      text-shadow:none!important;
      box-shadow:0 7px 20px rgba(17,22,29,.06);
      backdrop-filter:none!important;
    }
    .floorplan-hero-points span:before{
      content:'✓';
      margin-right:6px;
      color:#657e0b;
      font-weight:950;
    }
    @media(max-width:700px){
      .floorplan-hero{padding-top:72px!important;padding-bottom:50px!important}
      .floorplan-hero p{font-size:15px!important;line-height:1.7}
      .floorplan-hero-points{display:grid!important;grid-template-columns:1fr 1fr}
      .floorplan-hero-points span{display:flex;align-items:center;justify-content:flex-start;min-height:42px;border-radius:12px!important}
    }
    @media(max-width:420px){
      .floorplan-hero-points{grid-template-columns:1fr!important}
    }
    html[data-theme='dark'] .floorplan-hero,
    body.dark-mode .floorplan-hero{
      background:linear-gradient(135deg,#11161d 0%,#1a222b 100%)!important;
      color:#fff!important;
      border-bottom-color:#ffffff18;
    }
    html[data-theme='dark'] .floorplan-hero h1,
    body.dark-mode .floorplan-hero h1{color:#fff!important}
    html[data-theme='dark'] .floorplan-hero p,
    body.dark-mode .floorplan-hero p{color:#d0d7de!important}
    html[data-theme='dark'] .floorplan-hero .eyebrow,
    body.dark-mode .floorplan-hero .eyebrow{color:#b8c2cb!important}
    html[data-theme='dark'] .floorplan-hero-points span,
    body.dark-mode .floorplan-hero-points span{
      background:#ffffff10!important;
      color:#eef2f5!important;
      border-color:#ffffff25!important;
    }
    @media(prefers-contrast:more){
      .floorplan-hero p{color:#202a33!important}
      .floorplan-hero-points span{border-color:#7a857b!important;color:#172029!important}
    }
  `;
  document.head.appendChild(style);
})();
