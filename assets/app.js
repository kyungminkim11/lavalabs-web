const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const CONTACT={email:'info@lavalabs.co.kr',center:'0507-1362-3970',centerTel:'050713623970',mobile:'010-7914-3970',mobileTel:'01079143970'};
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
.page-hero .tax-pill{background:#e4f5ad;color:#334200;border-color:#94b52b;box-shadow:0 0 0 1px rgba(79,99,0,.08)}
.page-hero .tax-pill:before{background:#9edc18;color:#11151b}
.section-dark .tax-pill{background:#c9ff4818;color:#c9ff48;border-color:#c9ff4840}
.section-dark .tax-pill:before{background:#c9ff48;color:#11151b}
.payment-notice{display:grid;grid-template-columns:auto 1fr;gap:13px;align-items:start;margin:22px auto 0;max-width:780px;padding:18px 20px;border:1px solid #a9c64a;border-radius:18px;background:#f0f8d4;color:#263300;text-align:left}
.payment-notice .payment-icon{width:38px;height:38px;border-radius:12px;background:#c9ff48;color:#11151b;display:grid;place-items:center;font-size:17px;font-weight:900}
.payment-notice strong,.payment-notice span{display:block}.payment-notice strong{font-size:14px}.payment-notice span{margin-top:3px;color:#4b5d1a;font-size:12px;line-height:1.6}
.contact-meta .payment-card{border-color:#a9c64a;background:#f0f8d4}.contact-meta .payment-card span{color:#53651c}.contact-meta .payment-card small{display:block;margin-top:6px;color:#53615d;font-size:10px;line-height:1.5}
.brand-copy small{font-size:10px}.dropdown-menu small{font-size:11px}.hero-metrics span,.stage-card small,.trust-list{font-size:11px}.service-card .service-no{font-size:11px}.case-visual .label{font-size:10px}.price-card .badge{font-size:9px}.price-note{font-size:12px}.partner-benefit small{font-size:10px}.contact-meta span,.business-info span{font-size:10px}.business-info strong,.business-info a{font-size:12px}.footer-bottom{font-size:11px}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #9bc600;outline-offset:3px}
@media(max-width:680px){.hero-lead,.page-hero p,.section-head p{color:#4e5965}.service-card p,.case-copy p,.feature-row p,.faq-list details p{font-size:13px}.business-info strong,.business-info a{line-height:1.65}.page-hero .tax-pill{font-size:12px;padding:9px 12px}.payment-notice{grid-template-columns:1fr;padding:17px}.payment-notice .payment-icon{width:34px;height:34px}}
`;document.head.appendChild(contrastStyle);

function updateContactInfo(){
  $$('a[href^="mailto:"]').forEach(a=>{if(a.href.includes('lavalabs.ceo@gmail.com')){a.href=`mailto:${CONTACT.email}`;if(a.textContent.includes('lavalabs.ceo@gmail.com'))a.textContent=CONTACT.email}});
  $$('a[href^="tel:"]').forEach(a=>{if(a.href.includes('0319009228')){a.href=`tel:${CONTACT.centerTel}`;a.textContent=CONTACT.center}});
  $$('strong,a').forEach(el=>{const t=el.textContent.trim();if(t==='lavalabs.ceo@gmail.com'){el.textContent=CONTACT.email;if(el.tagName==='A')el.href=`mailto:${CONTACT.email}`}if(t==='031-900-9228'){el.textContent=CONTACT.center;if(el.tagName==='A')el.href=`tel:${CONTACT.centerTel}`}});
  $$('.business-info>div').forEach(div=>{const label=$('span',div);if(!label)return;if(label.textContent.trim()==='대표 연락처'){label.textContent='고객센터';const value=$('a,strong',div);if(value){value.textContent=CONTACT.center;if(value.tagName==='A')value.href=`tel:${CONTACT.centerTel}`}}if(label.textContent.trim()==='이메일'){const value=$('a,strong',div);if(value){value.textContent=CONTACT.email;if(value.tagName==='A')value.href=`mailto:${CONTACT.email}`}}});
  const business=$('.business-info');if(business&&!$$('.business-info span').some(s=>s.textContent.trim()==='업무용 휴대전화')){const mobile=document.createElement('div');mobile.innerHTML=`<span>업무용 휴대전화</span><a href="tel:${CONTACT.mobileTel}">${CONTACT.mobile}</a>`;const emailBox=$$('.business-info>div').find(d=>$('span',d)?.textContent.trim()==='이메일');emailBox?.insertAdjacentElement('beforebegin',mobile)}
  const footerLinks=$$('.footer-links').find(box=>$$('a',box).some(a=>a.href.startsWith('mailto:')));if(footerLinks&&!$$('a',footerLinks).some(a=>a.href.includes(CONTACT.mobileTel))){const center=$$('a',footerLinks).find(a=>a.href.startsWith('tel:'));if(center){center.textContent=`고객센터 ${CONTACT.center}`;center.href=`tel:${CONTACT.centerTel}`;const mobile=document.createElement('a');mobile.href=`tel:${CONTACT.mobileTel}`;mobile.textContent=`업무용 휴대전화 ${CONTACT.mobile}`;center.insertAdjacentElement('afterend',mobile)}}
  $$('.contact-meta>div').forEach(div=>{const label=$('span',div),value=$('strong',div);if(!label||!value)return;const l=label.textContent.trim(),v=value.textContent.trim();if(l==='PHONE'||l==='대표 연락처'||v==='031-900-9228'){label.textContent=l==='PHONE'?'CUSTOMER CENTER':'고객센터';value.textContent=CONTACT.center}if(l==='EMAIL'||l==='이메일'||v==='lavalabs.ceo@gmail.com'){value.textContent=CONTACT.email}});
  const meta=$('.contact-meta');if(meta&&!$$('.contact-meta span').some(s=>['BUSINESS MOBILE','업무용 휴대전화'].includes(s.textContent.trim()))){const mobile=document.createElement('div');mobile.innerHTML=`<span>${location.pathname.endsWith('contact.html')?'BUSINESS MOBILE':'업무용 휴대전화'}</span><strong>${CONTACT.mobile}</strong>`;const emailCard=$$('.contact-meta>div').find(d=>['EMAIL','이메일'].includes($('span',d)?.textContent.trim()));emailCard?.insertAdjacentElement('afterend',mobile)}
}

function addPaymentNotice(){
  const markup=`<span class="payment-icon">₩</span><div><strong>카드 결제 도입 준비 중</strong><span>토스페이먼츠 링크페이 도입을 검토하고 있습니다. 현재는 계약 전 단계이며, 도입 완료 후 카드 결제 가능 여부와 이용 방법을 안내합니다.</span></div>`;
  $$('.price-note').forEach(note=>{if(note.nextElementSibling?.classList.contains('payment-notice'))return;const box=document.createElement('div');box.className='payment-notice';box.innerHTML=markup;note.insertAdjacentElement('afterend',box)});
  const meta=$('.contact-meta');if(meta&&!$('.payment-card',meta)){const card=document.createElement('div');card.className='payment-card';card.innerHTML='<span>CARD PAYMENT</span><strong>토스페이먼츠 링크페이 도입 준비 중</strong><small>현재 계약 전 단계로 아직 카드 결제는 제공되지 않습니다.</small>';meta.appendChild(card)}
  const business=$('.business-info');if(business&&!$$('.business-info span').some(s=>s.textContent.trim()==='카드 결제')){const card=document.createElement('div');card.innerHTML='<span>카드 결제</span><strong>토스페이먼츠 링크페이 도입 준비 중</strong>';business.appendChild(card)}
  const faq=$('.faq-list');if(faq&&!$$('summary',faq).some(s=>s.textContent.includes('카드 결제'))){const item=document.createElement('details');item.innerHTML='<summary>카드 결제가 가능한가요?<span>+</span></summary><p>현재 토스페이먼츠 링크페이 도입을 검토 중이며 아직 계약 전 단계입니다. 도입 완료 후 카드 결제 가능 여부와 이용 방법을 홈페이지에 안내합니다.</p>';faq.appendChild(item)}
}

updateContactInfo();
addPaymentNotice();

const toggle=$('.menu-toggle'),menu=$('.mobile-menu');if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)});$$('a',menu).forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')}));}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(e=>io.observe(e));
$$('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open){const parent=d.parentElement;$$('details[open]',parent).forEach(o=>{if(o!==d)o.open=false})}}));
const form=$('#contact-form'),status=$('#form-status');function body(){if(!form)return'';const d=new FormData(form),v=n=>d.get(n)||'-';return`LavaLabs 프로젝트 문의\n\n문의 유형: ${v('type')}\n성함/담당자: ${v('name')}\n업체/브랜드명: ${v('company')}\n연락처: ${v('phone')}\n이메일: ${v('email')}\n예산: ${v('budget')}\n희망 일정: ${v('schedule')}\n\n요청 내용:\n${v('message')}\n\n※ 사업자 거래 및 세금계산서 발행이 가능합니다.\n※ 카드 결제는 토스페이먼츠 링크페이 도입 검토 중이며 현재 계약 전 단계입니다.`}if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const type=new FormData(form).get('type')||'프로젝트';location.href=`mailto:${CONTACT.email}?subject=${encodeURIComponent('[LavaLabs 문의] '+type)}&body=${encodeURIComponent(body())}`;if(status)status.textContent='이메일 앱을 여는 중입니다.'});$('#copy-inquiry')?.addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.clipboard.writeText(body());if(status)status.textContent='문의 내용이 복사되었습니다.'}catch{if(status)status.textContent='복사에 실패했습니다.'}})}
$$('[data-service]').forEach(a=>a.addEventListener('click',()=>{sessionStorage.setItem('service',a.dataset.service)}));const typeSelect=$('#type');if(typeSelect){const saved=sessionStorage.getItem('service');if(saved)typeSelect.value=saved}
if($('#year'))$('#year').textContent=new Date().getFullYear();