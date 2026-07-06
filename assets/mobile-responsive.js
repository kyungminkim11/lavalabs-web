(()=>{
  const style=document.createElement('style');
  style.dataset.lavalabsMobileResponsive='true';
  style.textContent=`
html{overflow-x:clip;-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{min-width:0;overflow-x:clip}
main,section,article,header,footer,nav,div{min-width:0}
img,video,canvas{max-width:100%;height:auto}
iframe{max-width:100%}
h1,h2,h3,h4,p,a,strong,span,li,td,th{overflow-wrap:anywhere}
.hero-grid>*,.service-grid>*,.problem-grid>*,.case-grid>*,.price-grid>*,.process-grid>*,.partner-grid>*,.partner-band>*,.detail-grid>*,.faq-layout>*,.contact-grid>*,.footer-main>*,.business-info>*,.system-grid>*,.scope-grid>*,.system-process>*,.dev-formats>*,.spec-method-grid>*,.spec-grid>*,.spec-process>*,.edu-grid>*,.bank-summary>*,.question-types>*,.shared-data>*,.expand-grid>*,.edu-scope>*,.edu-process>*,.edu-home-grid>*{min-width:0}
.button,.menu-toggle,.theme-toggle,.mobile-menu a,.subnav a{touch-action:manipulation}
.contact-form input,.contact-form select,.contact-form textarea{min-width:0}
.footer-main a,.business-info a,.contact-meta strong{word-break:break-word}
@media(max-width:1020px){
  .mobile-menu{max-height:calc(100vh - 76px)!important;max-height:calc(100dvh - 76px)!important;overflow-y:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding-bottom:max(24px,env(safe-area-inset-bottom))!important}
  .mobile-menu a{min-height:44px;display:flex;align-items:center}
  .menu-toggle{flex:0 0 44px}
  .hero-stage{width:100%}
}
@media(max-width:680px){
  .container{width:min(calc(100% - 28px),var(--max))!important}
  .nav{height:68px!important;gap:8px!important}
  .brand{gap:9px}.brand-mark{width:36px!important;height:36px!important;border-radius:11px}.brand-mark svg{width:23px;height:23px}.brand-copy strong{font-size:14px}
  .theme-toggle{width:40px!important;height:40px!important}.menu-toggle{width:40px;height:40px;flex-basis:40px}
  .mobile-menu{inset:68px 0 auto!important;max-height:calc(100vh - 68px)!important;max-height:calc(100dvh - 68px)!important;padding-inline:max(16px,env(safe-area-inset-left)) max(16px,env(safe-area-inset-right))!important}
  .hero{padding:62px 0 56px!important}.hero h1{font-size:clamp(38px,12vw,50px)!important;line-height:1.07!important}.hero-lead,.page-hero p{font-size:15px!important}.hero-actions{gap:9px;margin-top:24px}.hero-actions .button,.cta-panel .button,.partner-banner .button,.contact-form .button{width:100%}
  .hero-metrics{margin-top:32px}.hero-proof-list{grid-template-columns:1fr!important;gap:8px}.hero-proof-list span{min-height:48px}
  .stage-window{border-radius:22px!important;padding:8px}.window-bar{height:46px}.stage-content{min-height:360px!important;padding:16px!important}.stage-card.web{inset:16px 16px auto!important;padding:18px!important}.stage-card.web h3{font-size:22px!important}.stage-card.store{left:16px!important;bottom:16px!important;width:48%!important;padding:14px!important}.stage-card.auto{right:16px!important;bottom:16px!important;width:46%!important;padding:14px!important}
  .section,.system-section,.service-spec,.edu-section{padding:68px 0!important}.section-head,.system-head,.service-spec-head,.edu-head{margin-bottom:38px}.section-head h2,.system-head h2,.service-spec-head h2,.edu-head h2{font-size:clamp(31px,9.6vw,38px)!important;line-height:1.14!important}.page-hero{padding:56px 0 42px!important}.page-hero h1{font-size:clamp(35px,10.8vw,42px)!important;line-height:1.08!important}.sticky-copy h2{font-size:clamp(30px,9vw,38px)}
  .subnav{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;margin-right:-14px;padding-right:14px}.subnav::-webkit-scrollbar{display:none}.subnav a{flex:0 0 auto;white-space:nowrap}
  .service-grid,.problem-grid,.case-grid,.price-grid,.process-grid,.partner-grid,.partner-band,.form-grid,.system-grid,.scope-grid,.system-process,.dev-formats,.sample-stock,.spec-method-grid,.spec-grid,.spec-process,.edu-grid,.bank-summary,.question-types,.shared-data,.expand-grid,.edu-scope,.edu-process,.edu-home-grid{grid-template-columns:1fr!important}
  .ll-home-flow-grid{grid-template-columns:1fr!important;gap:0}.ll-home-flow-title{grid-column:auto!important}.ll-home-flow-step{border-left:0!important;border-top:1px solid var(--line);padding:16px 0!important}
  .shared-center{width:100%!important;height:auto!important;border-radius:20px!important;padding:24px}.partner-banner,.cta-panel{grid-template-columns:1fr!important}
  .feature-row{grid-template-columns:46px 1fr;gap:13px;padding:18px}.feature-row .icon{width:46px;height:46px;border-radius:13px}.spec-notice,.system-notice{grid-template-columns:1fr!important}
  .problem-card,.price-card{padding:24px}.contact-form{padding:22px}.contact-form input,.contact-form select,.contact-form textarea{font-size:16px}.faq-list summary{gap:12px}
  .footer-main{grid-template-columns:1fr!important;gap:30px;padding-top:46px}.business-info{grid-template-columns:1fr!important}.business-wide{grid-column:auto!important}.footer-bottom{flex-direction:column}.footer-bottom div{flex-wrap:wrap}
  .floating-contact{right:max(12px,env(safe-area-inset-right))!important;bottom:max(76px,calc(env(safe-area-inset-bottom) + 12px))!important;width:54px!important;height:54px!important;font-size:10px}
  table{display:block;width:100%;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}pre,code{max-width:100%;overflow-x:auto}
}
@media(max-width:420px){
  .container{width:min(calc(100% - 24px),var(--max))!important}.brand-copy small{font-size:8px;letter-spacing:.1em}
  .hero{padding-top:50px!important}.hero h1{font-size:clamp(34px,11.5vw,41px)!important;letter-spacing:-.05em}.hero-lead{font-size:14px!important}.hero-actions .button{min-height:48px}
  .stage-window{padding:7px;border-radius:19px!important}.window-url{max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.stage-content{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;min-height:auto!important;padding:13px!important}
  .stage-card,.stage-card.web,.stage-card.store,.stage-card.auto{position:static!important;inset:auto!important;left:auto!important;right:auto!important;bottom:auto!important;width:100%!important;padding:16px!important}.stage-card.web h3{font-size:21px!important}.mock-tabs{margin-bottom:16px}.mock-grid{grid-template-columns:1fr .72fr;margin-top:18px}.mock-block{min-height:78px}
  .section,.system-section,.service-spec,.edu-section{padding:56px 0!important}.section-head h2,.system-head h2,.service-spec-head h2,.edu-head h2{font-size:clamp(28px,9.2vw,34px)!important}.section-head p,.system-head p,.service-spec-head p,.edu-head p{font-size:14px}.page-hero{padding:48px 0 34px!important}.page-hero h1{font-size:clamp(31px,10.2vw,37px)!important}
  .service-card,.system-card,.spec-method,.edu-card{min-height:auto!important;padding:22px!important}.service-card h3,.system-card h3,.spec-method h3,.edu-card h3{margin-top:34px!important}.problem-card,.price-card,.scope-card,.spec-card,.expand-card,.edu-scope-card{padding:21px!important}.problem-card h3{font-size:24px}.case-copy{padding:19px}.price-card .price{font-size:32px}.process-card,.partner-card,.system-step,.spec-step,.edu-step{min-height:auto!important}.process-card h3,.partner-card h3,.system-step h3,.spec-step h3,.edu-step h3{margin-top:36px!important}
  .cta-panel,.partner-banner{padding:20px!important}.feature-row{grid-template-columns:42px 1fr;padding:16px}.feature-row .icon{width:42px;height:42px}.contact-form{padding:18px;border-radius:20px}.legal-box{padding:16px}.footer-main{padding-top:40px}.business-info{gap:15px}.floating-contact{width:50px!important;height:50px!important}
}
@media(max-width:360px){
  .brand-copy small{display:none}.eyebrow{font-size:10px;letter-spacing:.09em}.hero h1{font-size:32px!important}.section-head h2,.system-head h2,.service-spec-head h2,.edu-head h2{font-size:28px!important}.page-hero h1{font-size:30px!important}.button{padding-inline:15px}.feature-row{grid-template-columns:1fr}.feature-row .icon{width:40px;height:40px}.footer-bottom div{gap:10px}
}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.reveal,.button,.dropdown-menu,.theme-toggle{transition:none!important}.reveal{opacity:1!important;transform:none!important}.button:hover,.theme-toggle:hover{transform:none!important}}
`;
  document.head.appendChild(style);
})();
