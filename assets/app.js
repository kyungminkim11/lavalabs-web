const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const contrastStyle=document.createElement('style');contrastStyle.textContent=`
:root{--muted:#56616d;--accent:#667b00}
body{color:#11151b}
.button-light,.dropdown-menu,.case-card,.case-copy,.price-card,.feature-row,.contact-meta div,.legal-box,.problem-card.before,.service-card:not(.dark){color:#11151b}
.button-light{color:#11151b!important}
.section-dark .eyebrow,.site-footer .eyebrow{color:#c3cad2}
.section-dark .case-card,.section-dark .case-copy{color:#11151b}
.section-dark .case-copy a{color:#4d5d00}
.trust>span,.trust-list{color:#59636f}
.brand-copy small,.dropdown-menu small,.hero-metrics span,.stage-card small,.price-note,.contact-meta span{color:#59636f}
.site-footer .brand-copy small,.site-footer .business-info span,.site-footer .footer-bottom{color:#aeb5be}
.site-footer .footer-main h4{color:#b6bdc6}
.site-footer .footer-main p,.site-footer .footer-main a{color:#d3d8de}
.service-card .service-no{color:#5c7000}
.service-card.dark .service-no,.section-dark .service-card .service-no{color:#c9ff48}
.case-copy p,.feature-row p,.sticky-copy p,.faq-list details p,.page-hero p{color:#56616d}
.section-dark .section-head p,.section-dark .partner-card p,.section-dark .process-card p,.section-dark .cta-panel p{color:#c3cad2}
.business-info strong,.business-info a{color:#eef1f4}
.contact-form input::placeholder,.contact-form textarea::placeholder{color:#b8c0c9;opacity:1}
.contact-form input,.contact-form select,.contact-form textarea{border-color:#ffffff3d}
.button-outline{border-color:#ffffff70;background:#ffffff08}
.brand-copy small{font-size:10px}.dropdown-menu small{font-size:11px}.hero-metrics span,.stage-card small,.trust-list{font-size:11px}.service-card .service-no{font-size:11px}.case-visual .label{font-size:10px}.price-card .badge{font-size:9px}.price-note{font-size:12px}.partner-benefit small{font-size:10px}.contact-meta span,.business-info span{font-size:10px}.business-info strong,.business-info a{font-size:12px}.footer-bottom{font-size:11px}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #9bc600;outline-offset:3px}
@media(max-width:680px){.hero-lead,.page-hero p,.section-head p{color:#4e5965}.service-card p,.case-copy p,.feature-row p,.faq-list details p{font-size:13px}.business-info strong,.business-info a{line-height:1.65}}
`;document.head.appendChild(contrastStyle);

const toggle=$('.menu-toggle'),menu=$('.mobile-menu');if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)});$$('a',menu).forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')}));}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(e=>io.observe(e));
$$('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open){const parent=d.parentElement;$$('details[open]',parent).forEach(o=>{if(o!==d)o.open=false})}}));
const form=$('#contact-form'),status=$('#form-status');function body(){if(!form)return'';const d=new FormData(form),v=n=>d.get(n)||'-';return`LavaLabs 프로젝트 문의\n\n문의 유형: ${v('type')}\n성함/담당자: ${v('name')}\n업체/브랜드명: ${v('company')}\n연락처: ${v('phone')}\n이메일: ${v('email')}\n예산: ${v('budget')}\n희망 일정: ${v('schedule')}\n\n요청 내용:\n${v('message')}\n\n※ 사업자 거래 및 세금계산서 발행이 가능합니다.`}if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const type=new FormData(form).get('type')||'프로젝트';location.href=`mailto:lavalabs.ceo@gmail.com?subject=${encodeURIComponent('[LavaLabs 문의] '+type)}&body=${encodeURIComponent(body())}`;if(status)status.textContent='이메일 앱을 여는 중입니다.'});$('#copy-inquiry')?.addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.clipboard.writeText(body());if(status)status.textContent='문의 내용이 복사되었습니다.'}catch{if(status)status.textContent='복사에 실패했습니다.'}})}
$$('[data-service]').forEach(a=>a.addEventListener('click',()=>{sessionStorage.setItem('service',a.dataset.service)}));const typeSelect=$('#type');if(typeSelect){const saved=sessionStorage.getItem('service');if(saved)typeSelect.value=saved}
if($('#year'))$('#year').textContent=new Date().getFullYear();