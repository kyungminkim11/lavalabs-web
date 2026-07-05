(() => {
  const style = document.createElement("style");
  style.textContent = `
@media(max-width:1020px){
  .nav{gap:10px}
  .nav > .theme-toggle:not(.mobile-theme-toggle){margin-left:auto}
  .nav > .menu-toggle{margin-left:0}
}
@media(max-width:680px){
  .nav{gap:8px}
}
`;
  document.head.appendChild(style);
})();
