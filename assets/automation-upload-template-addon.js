(()=>{
  if(!location.pathname.toLowerCase().endsWith('automation-pos-live.html')) return;
  const TEMPLATE_B64='downloads/POS_Upload_Template_Simple.xlsx.b64?v=20260712c';
  const TEMPLATE_NAME='POS_Upload_Template_Simple.xlsx';
  const required=['주문번호','상품명','수량','단가','결제수단','결제상태','과세구분'];
  const optional=['판매일자','담당자','거래처','비고'];
  const style=document.createElement('style');
  style.textContent=`
  .template-guide{padding:24px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,#f7f9f3,#fff);box-shadow:0 18px 45px rgba(13,17,23,.06);margin-bottom:15px}.template-guide-grid{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:center}.template-guide h2{margin:6px 0 8px;font-size:25px;letter-spacing:-.035em}.template-guide p{margin:0;color:var(--muted);font-size:12px}.template-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:18px}.template-step{padding:13px;border:1px solid #dfe3dd;border-radius:14px;background:#fff}.template-step b,.template-step span{display:block}.template-step b{color:#718719;font-size:10px}.template-step span{margin-top:4px;font-size:11px;font-weight:800}.template-columns{display:flex;gap:7px;flex-wrap:wrap;margin-top:16px}.template-columns span{padding:6px 9px;border-radius:999px;background:#edf1e8;font-size:9px;font-weight:850}.template-columns span.required{background:#0d1117;color:#c9ff48}.template-validation{display:none;margin-top:13px;padding:13px 14px;border-radius:13px;font-size:11px;font-weight:800}.template-validation.show{display:block}.template-validation.ok{background:#eaf8e2;color:#386415}.template-validation.bad{background:#ffe5e5;color:#8c2929}.template-note{margin-top:12px;color:#78818b;font-size:10px}.template-download{min-width:210px}.template-download .button{width:100%}@media(max-width:760px){.template-guide-grid{grid-template-columns:1fr}.template-steps{grid-template-columns:1fr 1fr}.template-download{min-width:0}}@media(max-width:480px){.template-guide{padding:18px}.template-steps{grid-template-columns:1fr}.template-guide h2{font-size:21px}}
  `;
  document.head.append(style);

  async function downloadTemplate(button){
    const original=button?.textContent||'표준 양식 다운로드';
    try{
      if(button){button.disabled=true;button.textContent='엑셀 파일 준비 중…';}
      const response=await fetch(TEMPLATE_B64,{cache:'no-store'});
      if(!response.ok) throw new Error(`양식 파일을 불러오지 못했습니다. (${response.status})`);
      const base64=(await response.text()).replace(/\s+/g,'');
      if(!base64.startsWith('UEsDB')) throw new Error('양식 데이터가 올바르지 않습니다.');
      const binary=atob(base64);
      const bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
      const blob=new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      if(blob.size<1000) throw new Error('생성된 파일 크기가 비정상입니다.');
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');
      anchor.href=url;
      anchor.download=TEMPLATE_NAME;
      anchor.rel='noopener';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
      if(button) button.textContent='다운로드 완료';
      setTimeout(()=>{if(button){button.disabled=false;button.textContent=original;}},1400);
    }catch(error){
      if(button){button.disabled=false;button.textContent=original;}
      const box=document.querySelector('#templateValidation');
      if(box){box.className='template-validation show bad';box.textContent='양식 다운로드 실패: '+(error?.message||error);}
      else alert('양식 다운로드 실패: '+(error?.message||error));
    }
  }

  const mount=()=>{
    const host=document.querySelector('.live-grid>div');
    if(!host||document.querySelector('.template-guide')) return false;
    const card=document.createElement('article');
    card.className='template-guide';
    card.innerHTML=`<div class="template-guide-grid"><div><small class="eyebrow">STANDARD EXCEL TEMPLATE</small><h2>양식을 먼저 내려받아 작성하세요.</h2><p>열 이름을 추측할 필요 없이 표준 양식에 입력하고 XLSX로 저장한 뒤 그대로 업로드하면 됩니다.</p><div class="template-steps"><div class="template-step"><b>01</b><span>양식 다운로드</span></div><div class="template-step"><b>02</b><span>예시 행 수정·입력</span></div><div class="template-step"><b>03</b><span>XLSX로 저장</span></div><div class="template-step"><b>04</b><span>파일 업로드·검사</span></div></div><div class="template-columns">${required.map(v=>`<span class="required">${v} · 필수</span>`).join('')}${optional.map(v=>`<span>${v} · 선택</span>`).join('')}</div><p class="template-note">Excel 복구 경고를 막기 위해 표·매크로·외부 연결이 없는 최소 구조 양식으로 제공합니다.</p></div><div class="template-download"><button class="button button-primary" type="button" data-template-download>표준 양식 XLSX 다운로드</button></div></div><div class="template-validation" id="templateValidation" aria-live="polite"></div>`;
    host.prepend(card);

    const bindDownload=(selector,label)=>{
      const el=document.querySelector(selector);
      if(!el) return;
      el.textContent=label;
      el.addEventListener('click',event=>{
        event.preventDefault();
        event.stopImmediatePropagation();
        downloadTemplate(el);
      },true);
    };
    card.querySelector('[data-template-download]')?.addEventListener('click',event=>downloadTemplate(event.currentTarget));
    bindDownload('#heroInput','표준 업로드 양식 XLSX');
    bindDownload('#input','표준 양식 다운로드');
    bindDownload('#inputCard','표준 양식 다운로드');

    const choose=document.querySelector('#choose');
    if(choose) choose.textContent='양식으로 작성한 파일 업로드';
    const inputCard=document.querySelector('#inputCard')?.closest('.download');
    if(inputCard){
      inputCard.querySelector('h3').textContent='업로드 표준 양식';
      inputCard.querySelector('p').textContent='필수 열, 작성안내와 예시 행이 포함된 호환성 우선 XLSX 양식입니다.';
    }

    const file=document.querySelector('#file');
    if(file) file.addEventListener('change',async()=>{
      const box=document.querySelector('#templateValidation');
      const selected=file.files?.[0];
      if(!box||!selected) return;
      box.className='template-validation show';
      box.textContent='업로드 양식의 열을 확인하고 있습니다…';
      try{
        let tries=0;
        while(!window.XLSX&&tries++<30) await new Promise(resolve=>setTimeout(resolve,100));
        if(!window.XLSX) throw new Error('XLSX 분석 모듈을 불러오지 못했습니다.');
        const wb=XLSX.read(await selected.arrayBuffer(),{type:'array'});
        const name=wb.SheetNames.includes('입력양식')?'입력양식':wb.SheetNames[0];
        const grid=XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,defval:''});
        const headers=(grid[0]||[]).map(value=>String(value).trim().replace(/\*/g,''));
        const missing=required.filter(value=>!headers.includes(value));
        if(missing.length){
          box.className='template-validation show bad';
          box.textContent=`양식 확인 실패: ${missing.join(', ')} 열이 없습니다. 표준 양식을 내려받아 열 이름을 유지해 주세요.`;
          const run=document.querySelector('#run');
          if(run) run.disabled=true;
        }else{
          box.className='template-validation show ok';
          box.textContent=`양식 확인 완료 · ${name} 시트 · 필수 열 ${required.length}개 확인 · 데이터 ${Math.max(0,grid.length-1)}행`;
        }
      }catch(error){
        box.className='template-validation show bad';
        box.textContent='양식을 확인하지 못했습니다: '+(error?.message||error);
      }
    });
    return true;
  };
  if(!mount()) new MutationObserver((_,observer)=>{if(mount())observer.disconnect()}).observe(document.documentElement,{childList:true,subtree:true});
})();
