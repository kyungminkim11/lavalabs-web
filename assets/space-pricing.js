(()=>{
  const $=(selector,scope=document)=>scope.querySelector(selector);
  const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if($('#space-pricing-style'))return;

  const tiers=[
    {
      id:'capture',label:'CAPTURE ONLY',title:'360 촬영본 제공',price:'19',service:'360 촬영본 제공 · 19만원부터',
      desc:'가상투어 웹 제작 없이 공간을 360도로 촬영하고 기본 정리한 이미지 파일을 전달합니다.',
      items:['360 이미지 촬영본 제공','기본 노출·색감·수평 정리','소규모 공간 기준','가상투어·핫스팟 제작 제외']
    },
    {
      id:'basic',label:'BASIC TOUR',title:'기본 360 가상투어',price:'29',service:'기본 360 가상투어 · 29만원부터',
      desc:'주요 촬영 지점을 연결해 모바일과 PC에서 직접 이동하며 보는 간단한 웹 투어를 제작합니다.',
      items:['주요 촬영 지점 연결','모바일·PC 웹 링크','기본 매장 정보·문의 연결','간단한 공유용 링크 제공']
    },
    {
      id:'custom',label:'CUSTOM SPACE',title:'맞춤형 360 공간 안내',price:'39',service:'맞춤형 360 공간 안내 · 39만원부터',
      desc:'공간 안의 상품·시설·메뉴 설명과 예약·구매 링크까지 업종에 맞춰 설계합니다.',
      items:['정보 핫스팟·외부 링크','층별·구역별 이동 안내','브랜드 디자인·QR 공유','다국어·예약·온라인몰 확장']
    }
  ];

  const style=document.createElement('style');
  style.id='space-pricing-style';
  style.textContent=`
    .space-price-section{padding:104px 0;background:#eef0e9;color:#11151b}
    .space-price-section.dark{background:#0d1117;color:#fff}
    .space-price-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.72fr);gap:42px;align-items:end;margin-bottom:34px}
    .space-price-head h2{margin:13px 0 0;font-size:clamp(34px,4.7vw,58px);line-height:1.08;letter-spacing:-.055em}
    .space-price-head p{margin:0;color:#56616d;font-size:13px;line-height:1.8}
    .space-price-section.dark .space-price-head p{color:#c3cad2}
    .space-price-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}
    .space-price-tier{display:flex;min-height:470px;flex-direction:column;padding:26px;border:1px solid #d9dcd4;border-radius:24px;background:#fff;color:#11151b;box-shadow:0 14px 38px rgba(17,21,27,.06)}
    .space-price-tier.featured{background:#11151b;color:#fff;border-color:#11151b}
    .space-price-tier .tier-label{font-size:9px;font-weight:900;letter-spacing:.13em;color:#617400}
    .space-price-tier.featured .tier-label{color:#c9ff48}
    .space-price-tier h3{margin:36px 0 8px;font-size:24px;line-height:1.18}
    .space-price-tier .tier-price{display:flex;align-items:end;gap:5px;margin:5px 0 16px;font-size:48px;font-weight:950;line-height:1;letter-spacing:-.06em}
    .space-price-tier .tier-price small{padding-bottom:5px;font-size:12px;letter-spacing:-.02em}
    .space-price-tier>p{margin:0;color:#56616d;font-size:12px;line-height:1.75}
    .space-price-tier.featured>p{color:#c3cad2}
    .space-price-tier ul{display:grid;gap:8px;margin:auto 0 22px;padding:20px 0 0;border-top:1px solid #e0e2dc;list-style:none}
    .space-price-tier.featured ul{border-color:#ffffff1d}
    .space-price-tier li{font-size:11px;line-height:1.55}
    .space-price-tier li:before{content:'✓';margin-right:8px;color:#617400;font-weight:900}
    .space-price-tier.featured li:before{color:#c9ff48}
    .space-price-tier .button{width:100%;min-height:46px;font-size:11px}
    .space-price-notice{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;margin-top:17px;padding:19px 21px;border:1px solid #a9c64a;border-radius:18px;background:#f0f8d4;color:#263300}
    .space-price-notice b{display:grid;width:40px;height:40px;place-items:center;border-radius:12px;background:#c9ff48;color:#11151b;font-size:10px}
    .space-price-notice strong{display:block;font-size:13px}
    .space-price-notice span{display:block;margin-top:4px;color:#4b5d1a;font-size:11px;line-height:1.65}
    .space-price-compact{padding:76px 0;background:#eef0e9;color:#11151b}
    .space-price-compact-inner{display:grid;grid-template-columns:minmax(220px,.72fr) minmax(0,1.28fr);gap:34px;align-items:start}
    .space-price-compact-copy h2{margin:12px 0 12px;font-size:clamp(28px,3.8vw,44px);line-height:1.1;letter-spacing:-.05em}
    .space-price-compact-copy p{margin:0;color:#56616d;font-size:12px;line-height:1.75}
    .space-price-compact-list{display:grid;gap:10px}
    .space-price-compact-item{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;padding:18px 20px;border:1px solid #d9dcd4;border-radius:17px;background:#fff;color:#11151b}
    .space-price-compact-item strong{display:block;font-size:14px}
    .space-price-compact-item span{display:block;margin-top:3px;color:#64707a;font-size:10px;line-height:1.55}
    .space-price-compact-item b{color:#4f6500;font-size:18px;white-space:nowrap}
    .space-pricing-inline{margin:28px 0;padding:22px;border:1px solid #a9c64a;border-radius:18px;background:#f0f8d4;color:#263300}
    .space-pricing-inline h3{margin:0 0 8px!important;font-size:20px!important}
    .space-pricing-inline p{margin:0!important;color:#4b5d1a!important}
    .space-pricing-inline ul{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 12px;margin:15px 0 0!important;padding:0!important;list-style:none!important}
    .space-pricing-inline li{padding:11px;border-radius:12px;background:#fff;font-size:11px;line-height:1.55}
    .space-pricing-inline li strong{display:block;color:#263300}
    .space-contact-price-note{margin:12px 0 18px;padding:15px 17px;border:1px solid #a9c64a;border-radius:15px;background:#f0f8d4;color:#263300;font-size:11px;line-height:1.65}
    .space-package-price{display:block;margin:12px 0 0;padding:10px 12px;border-radius:12px;background:#c9ff4817;color:inherit;font-size:10px;font-weight:850;line-height:1.55}
    .space-budget-option{margin-top:12px;padding:14px;border:1px solid #c9ff4860;border-radius:14px;background:#ffffff08;color:#fff}
    .space-budget-option strong{display:block;color:#c9ff48;font-size:11px}
    .space-budget-option span{display:block;margin-top:4px;color:#bec6ce;font-size:9px;line-height:1.55}
    html[data-theme="dark"] .space-price-section,html.lavalabs-auto-dark .space-price-section,
    html[data-theme="dark"] .space-price-compact,html.lavalabs-auto-dark .space-price-compact{background:#111821;color:#f4f7fb}
    html[data-theme="dark"] .space-price-tier:not(.featured),html.lavalabs-auto-dark .space-price-tier:not(.featured),
    html[data-theme="dark"] .space-price-compact-item,html.lavalabs-auto-dark .space-price-compact-item{background:#171e27;color:#f4f7fb;border-color:#2c3540}
    html[data-theme="dark"] .space-price-tier:not(.featured)>p,html.lavalabs-auto-dark .space-price-tier:not(.featured)>p,
    html[data-theme="dark"] .space-price-compact-copy p,html.lavalabs-auto-dark .space-price-compact-copy p,
    html[data-theme="dark"] .space-price-compact-item span,html.lavalabs-auto-dark .space-price-compact-item span{color:#bdc7d1}
    html[data-theme="dark"] .space-price-tier:not(.featured) ul,html.lavalabs-auto-dark .space-price-tier:not(.featured) ul{border-color:#2c3540}
    html[data-theme="dark"] .space-price-compact-item b,html.lavalabs-auto-dark .space-price-compact-item b{color:#c9ff48}
    @media(max-width:900px){.space-price-head,.space-price-compact-inner{grid-template-columns:1fr;gap:18px}.space-price-grid{grid-template-columns:1fr}.space-price-tier{min-height:410px}.space-pricing-inline ul{grid-template-columns:1fr}}
    @media(max-width:620px){.space-price-section{padding:76px 0}.space-price-compact{padding:62px 0}.space-price-compact-item{grid-template-columns:1fr}.space-price-compact-item b{font-size:16px}.space-price-notice{grid-template-columns:1fr}.space-price-tier .tier-price{font-size:42px}}
  `;
  document.head.appendChild(style);

  const tierCards=()=>tiers.map((tier,index)=>`<article class="space-price-tier ${index===1?'featured':''}"><span class="tier-label">${tier.label}</span><h3>${tier.title}</h3><div class="tier-price">${tier.price}<small>만원부터</small></div><p>${tier.desc}</p><ul>${tier.items.map(item=>`<li>${item}</li>`).join('')}</ul><a class="button ${index===1?'button-primary':'button-dark'}" data-service="${tier.service}" href="contact.html">이 구성으로 문의</a></article>`).join('');

  const fullSection=()=>{
    const section=document.createElement('section');
    section.id='space-pricing';
    section.className='space-price-section';
    section.innerHTML=`<div class="container"><div class="space-price-head"><div><span class="eyebrow">SPACE PRICING</span><h2>필요한 결과에 따라<br>세 단계로 시작합니다.</h2></div><p>촬영 파일만 필요한 경우와 웹 가상투어까지 필요한 경우를 분리했습니다. 처음부터 39만원 구성을 선택하지 않아도 됩니다.</p></div><div class="space-price-grid">${tierCards()}</div><div class="space-price-notice"><b>INFO</b><div><strong>표시 금액은 소규모 공간의 기본 범위를 기준으로 한 시작 가격입니다.</strong><span>촬영 지점 수, 면적, 층수, 이동 거리, 야간·휴일 촬영, 재촬영, 별도 도메인·호스팅과 추가 보정 범위에 따라 견적이 달라질 수 있으며 부가세는 별도입니다.</span></div></div></div>`;
    return section;
  };

  const compactSection=(title='360 촬영부터 맞춤형 공간 안내까지')=>{
    const section=document.createElement('section');
    section.className='space-price-compact';
    section.dataset.spacePricing='compact';
    section.innerHTML=`<div class="container space-price-compact-inner"><div class="space-price-compact-copy"><span class="eyebrow">CHOOSE YOUR SCOPE</span><h2>${title}</h2><p>가상투어 제작이 필요하지 않다면 360 촬영본만 받을 수 있습니다. 공간과 활용 목적에 맞는 범위만 선택하세요.</p></div><div class="space-price-compact-list">${tiers.map(tier=>`<a class="space-price-compact-item" data-service="${tier.service}" href="contact.html"><div><strong>${tier.title}</strong><span>${tier.desc}</span></div><b>${tier.price}만원부터</b></a>`).join('')}</div></div>`;
    return section;
  };

  function addMainSpacePricing(){
    if(path!=='space.html'||$('#space-pricing'))return;
    const target=$('#industries')||$('#main > .section:nth-of-type(3)')||$('#main > .section:last-of-type');
    target?.insertAdjacentElement('beforebegin',fullSection());
    const hero=$('.page-hero .subnav');
    if(hero&&!$('a[href="#space-pricing"]',hero))hero.insertAdjacentHTML('afterbegin','<a href="#space-pricing">가격 보기 ↓</a>');
  }

  function replacePricingCard(){
    if(path!=='pricing.html'||$('.price-grid[data-space-tiered="true"]'))return;
    const grid=$('.price-grid');
    if(!grid)return;
    const old=$$('.price-card',grid).find(card=>$('h3',card)?.textContent.includes('360 가상투어'));
    if(!old)return;
    const fragment=document.createDocumentFragment();
    tiers.forEach((tier,index)=>{
      const card=document.createElement('article');
      card.className=`price-card ${index===1?'featured':''}`;
      card.dataset.spaceTier=tier.id;
      card.innerHTML=`<span class="badge">${tier.label}</span><h3>${tier.title}</h3><div class="price">${tier.price}<small>만원부터</small></div><ul>${tier.items.map(item=>`<li>${item}</li>`).join('')}</ul><a class="button ${index===1?'button-primary':'button-dark'}" data-service="${tier.service}" href="contact.html">문의하기</a>`;
      fragment.appendChild(card);
    });
    old.replaceWith(fragment);
    grid.dataset.spaceTiered='true';
    const note=$('.price-note');
    if(note&&!$('.space-price-notice',note.parentElement))note.insertAdjacentHTML('beforebegin','<div class="space-price-notice"><b>360</b><div><strong>360 촬영본 제공과 가상투어 웹 제작은 서로 다른 상품입니다.</strong><span>촬영본만 필요한 경우 19만원부터, 주요 장면을 연결한 기본 투어는 29만원부터, 핫스팟·다국어·예약 링크가 포함된 맞춤형 안내는 39만원부터 시작합니다.</span></div></div>');
  }

  function updateOverviewCards(){
    $$('a.service-card[href="space.html"]').forEach(card=>{
      const list=$('ul',card);
      if(!list)return;
      list.innerHTML='<li>360 촬영본 제공 · 19만원부터</li><li>기본 가상투어 · 29만원부터</li><li>맞춤형 공간 안내 · 39만원부터</li>';
    });
  }

  function addDetailPricing(){
    if(!/^space-(?!pricing).*\.html$/.test(path)||$('[data-space-pricing="compact"]'))return;
    const main=$('#main');
    if(!main)return;
    const sections=$(':scope > section',main);
    const finalSection=sections[sections.length-1];
    const title=path.includes('for-')?'사업 규모에 맞춰 필요한 범위만 선택하세요.':'이 공간에 필요한 범위만 선택하세요.';
    if(finalSection)finalSection.insertAdjacentElement('beforebegin',compactSection(title));
    else main.appendChild(compactSection(title));
  }

  function addRelatedPricing(){
    const related={
      'photography.html':'일반 공간 사진과 360 촬영을 함께 선택할 수 있습니다.',
      'web.html':'홈페이지에 넣을 360 공간 콘텐츠도 단계별로 선택할 수 있습니다.',
      'store.html':'QR 매장 안내에 연결할 360 공간 콘텐츠를 선택하세요.',
      'equipment.html':'촬영 장비보다 필요한 결과에 따라 서비스 범위를 선택하세요.',
      'packages.html':'공간 경험 패키지는 촬영본부터 맞춤형 투어까지 조정할 수 있습니다.',
      'start.html':'360 공간 서비스는 19만원부터 작은 범위로 시작할 수 있습니다.'
    };
    if(!related[path]||$('[data-space-pricing="compact"]'))return;
    const main=$('#main');
    if(!main)return;
    const last=$(':scope > section:last-of-type',main);
    const section=compactSection(related[path]);
    if(last)last.insertAdjacentElement('beforebegin',section);else main.appendChild(section);
  }

  function addGuidePricing(){
    if(path!=='guide-360-virtual-tour.html'||$('.space-pricing-inline'))return;
    const article=$('.insight-article');
    const anchor=$('#points',article);
    if(!article||!anchor)return;
    const box=document.createElement('div');
    box.className='space-pricing-inline';
    box.innerHTML='<h3>가상투어 제작 없이 촬영본만 받을 수도 있습니다.</h3><p>활용 목적이 단순 기록이나 내부 보관이라면 웹 투어를 만들지 않고 360 이미지 파일만 제공받는 편이 효율적입니다.</p><ul><li><strong>19만원부터</strong>360 촬영본 제공</li><li><strong>29만원부터</strong>기본 360 가상투어</li><li><strong>39만원부터</strong>맞춤형 공간 안내</li></ul>';
    anchor.insertAdjacentElement('beforebegin',box);
  }

  function updatePackage(){
    if(path!=='packages.html')return;
    const card=$$('.bundle-card').find(item=>$('h3',item)?.textContent.includes('공간 경험 패키지'));
    if(!card||$('.space-package-price',card))return;
    const desc=$(':scope > p',card);
    desc?.insertAdjacentHTML('afterend','<span class="space-package-price">360 촬영본 19만원부터 · 기본 투어 29만원부터 · 맞춤형 공간 안내 39만원부터 선택해 패키지 범위를 조정합니다.</span>');
  }

  function updateContact(){
    if(path!=='contact.html')return;
    const select=$('#type');
    if(!select)return;
    const generic=[...select.options].find(option=>option.textContent.includes('360 가상투어·공간 촬영'));
    tiers.forEach(tier=>{
      if([...select.options].some(option=>option.value===tier.service))return;
      const option=document.createElement('option');
      option.value=option.textContent=tier.service;
      if(generic)generic.insertAdjacentElement('afterend',option);else select.appendChild(option);
    });
    const form=$('#contact-form');
    if(!form||$('.space-contact-price-note',form))return;
    const note=document.createElement('div');
    note.className='space-contact-price-note';
    const render=()=>{
      const active=select.value.includes('360');
      note.hidden=!active;
      note.innerHTML='<strong>360 공간 서비스 선택 안내</strong><br>촬영본만 필요한 경우 19만원부터, 기본 웹 투어는 29만원부터, 핫스팟·다국어·예약 링크가 필요한 맞춤형 안내는 39만원부터 시작합니다.';
    };
    select.insertAdjacentElement('afterend',note);
    select.addEventListener('change',render);
    render();
  }

  function updateFaq(){
    if(path!=='faq.html')return;
    const list=$('.faq-list');
    if(!list)return;
    const faqs=[
      ['가상투어 웹 제작 없이 360 촬영본만 받을 수 있나요?','가능합니다. 360 촬영본 제공 상품은 19만원부터 시작하며 기본 노출·색감·수평 정리 후 이미지 파일을 전달합니다. 장면 연결, 핫스팟, 다국어, 별도 웹 링크와 호스팅은 포함되지 않습니다.'],
      ['360 공간 서비스의 19만원·29만원·39만원 구성은 무엇이 다른가요?','19만원부터는 360 촬영본 제공, 29만원부터는 주요 촬영 지점을 연결한 기본 웹 가상투어, 39만원부터는 정보 핫스팟·층별 안내·브랜드 디자인·예약 또는 온라인몰 링크를 포함하는 맞춤형 공간 안내입니다. 공간 규모와 촬영 지점에 따라 최종 견적은 달라집니다.']
    ];
    faqs.forEach(([question,answer])=>{
      if($$('summary',list).some(summary=>summary.textContent.includes(question)))return;
      const detail=document.createElement('details');
      detail.innerHTML=`<summary>${question}<span>+</span></summary><p>${answer}</p>`;
      list.appendChild(detail);
    });
  }

  function updateBudgetFinder(){
    if(!['start.html','pricing.html'].includes(path))return;
    const patch=()=>{
      const form=$('.budget-form');
      const result=$('.budget-result');
      if(!form||!result)return;
      $$('.budget-result-card',result).forEach(card=>{
        const title=$('strong',card),price=$('b',card),desc=$('p',card);
        if(title?.textContent.includes('360 가상투어')){
          title.textContent='360 공간 촬영·가상투어';
          if(price)price.textContent='19만원부터';
          if(desc)desc.textContent='촬영본 19만원, 기본 투어 29만원, 맞춤형 공간 안내 39만원부터 선택합니다.';
        }
      });
      const budget=Number(form.elements?.budget?.value)||0;
      const goal=form.elements?.goal?.value||'';
      let option=$('.space-budget-option',result);
      if(budget>=19&&goal==='show'){
        if(!option){
          option=document.createElement('a');
          option.className='space-budget-option';
          option.href='space.html#space-pricing';
          result.appendChild(option);
        }
        option.innerHTML='<strong>360 촬영본 제공 · 19만원부터도 가능합니다.</strong><span>가상투어 웹 제작 없이 기본 정리한 360 이미지 파일만 전달받는 입문형 구성입니다. 기본 투어는 29만원, 맞춤형 안내는 39만원부터입니다.</span>';
      }else option?.remove();
    };
    const form=$('.budget-form');
    if(form){
      form.addEventListener('submit',()=>setTimeout(patch,0));
      form.addEventListener('change',()=>setTimeout(patch,0));
      form.addEventListener('click',()=>setTimeout(patch,0));
    }
    setTimeout(patch,0);
  }

  function bindServiceLinks(){
    $$('[data-service]').forEach(link=>{
      if(link.dataset.spacePricingBound)return;
      link.dataset.spacePricingBound='1';
      link.addEventListener('click',()=>sessionStorage.setItem('service',link.dataset.service));
    });
  }

  function updateMetaAndSchema(){
    const descriptions={
      'space.html':'매장과 비즈니스 공간을 위한 360 촬영본 제공은 19만원부터, 기본 360 가상투어는 29만원부터, 핫스팟과 다국어를 포함한 맞춤형 공간 안내는 39만원부터 제작합니다.',
      'pricing.html':'홈페이지, QR 메뉴판, 매장 사진과 함께 360 촬영본 19만원부터, 기본 가상투어 29만원부터, 맞춤형 공간 안내 39만원부터의 시작 가격을 확인하세요.'
    };
    if(descriptions[path]){
      const text=descriptions[path];
      ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'].forEach(selector=>$(selector)?.setAttribute('content',text));
    }
    const script=$('script[data-seo-schema]');
    if(!script)return;
    try{
      const data=JSON.parse(script.textContent);
      const graph=Array.isArray(data['@graph'])?data['@graph']:[];
      if(path==='space.html'){
        const service=graph.find(item=>item['@type']==='Service');
        if(service)service.offers={
          '@type':'AggregateOffer',priceCurrency:'KRW',lowPrice:'190000',highPrice:'390000',offerCount:'3',
          url:'https://space.lavalabs.co.kr/space.html#space-pricing'
        };
      }
      if(path==='faq.html'){
        const questions=$$('.faq-list details').map(detail=>{
          const question=$('summary',detail)?.childNodes[0]?.textContent?.trim()||$('summary',detail)?.textContent.replace(/\+\s*$/,'').trim();
          const answer=$('p',detail)?.textContent.trim();
          return question&&answer?{'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}:null;
        }).filter(Boolean);
        let faq=graph.find(item=>item['@type']==='FAQPage');
        if(!faq){faq={'@type':'FAQPage'};graph.push(faq)}
        faq.mainEntity=questions;
      }
      script.textContent=JSON.stringify(data);
    }catch{}
  }

  addMainSpacePricing();
  replacePricingCard();
  updateOverviewCards();
  addDetailPricing();
  addRelatedPricing();
  addGuidePricing();
  updatePackage();
  updateContact();
  updateFaq();
  updateBudgetFinder();
  bindServiceLinks();
  updateMetaAndSchema();
})();