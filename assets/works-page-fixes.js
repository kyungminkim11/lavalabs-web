(()=>{
  if(!/^\/works\/?$/.test(location.pathname.toLowerCase()))return;
  const style=document.createElement('style');
  style.textContent=`
    .works-section .project-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
    .works-section .project-card{display:flex;flex-direction:column;min-height:326px;padding:25px;border:1px solid #d8ddd4;border-radius:23px;background:#fff;color:#161d25;overflow:visible}
    .works-section .project-card:hover{transform:translateY(-4px);box-shadow:0 18px 45px #17200e12;border-color:#b8c28b}
    .works-section .project-card[hidden]{display:none}
    .works-section .project-top{display:flex;justify-content:space-between;gap:15px;align-items:flex-start;padding:0;background:none;color:inherit}
    .works-section .project-status{padding:0;border:0;border-radius:0;opacity:1;font-size:9px;font-weight:800;color:#7c8790}
    @media(max-width:1000px){.works-section .project-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:540px){.works-section .project-grid{grid-template-columns:1fr}.works-section .project-card{min-height:auto}}
  `;
  document.head.appendChild(style);
})();