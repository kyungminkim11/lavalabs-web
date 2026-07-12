(()=>{
  if(!location.pathname.toLowerCase().endsWith('automation-pos-live.html')) return;
  const TEMPLATE='downloads/POS_마감자동화_업로드_표준양식.xlsx';
  const required=['주문번호','상품명','수량','단가','결제수단','결제상태','과세구분'];
  const optional=['판매일자','담당자','거래처','비고'];
  const style=document.createElement('style');
  style.textContent=`
  .template-guide{padding:24px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,#f7f9f3,#fff);box-shadow:0 18px 45px rgba(13,17,23,.06);margin-bottom:15px}.template-guide-grid{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:center}.template-guide h2{margin:6px 0 8px;font-size:25px;letter-spacing:-.035em}.template-guide p{margin:0;color:var(--muted);font-size:12px}.template-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:18px}.template-step{padding:13px;border:1px solid #dfe3dd;border-radius:14px;background:#fff}.template-step b,.template-step span{display:block}.template-step b{color:#718719;font-size:10px}.template-step span{margin-top:4px;font-size:11px;font-weight:800}.template-columns{display:flex;gap:7px;flex-wrap:wrap;margin-top:16px}.template-columns span{padding:6px 9px;border-radius:999px;background:#edf1e8;font-size:9px;font-weight:850}.template-columns span.required{background:#0d1117;color:#c9ff48}.template-validation{display:none;margin-top:13px;padding:13px 14px;border-radius:13px;font-size:11px;font-weight:800}.template-validation.show{display:block}.template-validation.ok{background:#eaf8e2;color:#386415}.template-validation.bad{background:#ffe5e5;color:#8c2929}.template-note{margin-top:12px;color:#78818b;font-size:10px}.template-download{min-width:210px}.template-download .button{width:100%}@media(max-width:760px){.template-guide-grid{grid-template-columns:1fr}.template-steps{grid-template-columns:1fr 1fr}.template-download{min-width:0}}@media(max-width:480px){.template-guide{padding:18px}.template-steps{grid-template-columns:1fr}.template-guide h2{font-size:21px}}
  `;
  document.head.append(style);
  const mount=()=>{
    const host=document.querySelector('.live-grid>div');
    if(!host||document.querySelector('.template-guide')) return false;
    const card=document.createElement('article');
    card.className='template-guide';
    card.innerHTML=`<div class="template-guide-grid"><div><small class="eyebrow">STANDARD EXCEL TEMPLATE</small><h2>양식을 먼저 내려받아 작성하세요.</h2><p>열 이름을 추측할 필요 없이 표준 양식에 입력하고 XLSX로 저장한 뒤 그대로 업로드하면 됩니다.</p><div class="template-steps"><div class="template-step"><b>01</b><span>양식 다운로드</span></div><div class="template-step"><b>02</b><span>예시 행 수정·입력</span></div><div class="template-step"><b>03</b><span>XLSX로 저장</span></div><div class="template-step"><b>04</b><span>파일 업로드·검사</span></div></div><div class="template-columns">${required.map(v=>`<span class="required">${v} · 필수</span>`).join('')}${optional.map(v=>`<span>${v} · 선택</span>`).join('')}</div><p class="template-note">입력양식 시트가 첫 번째 시트로 구성되어 있으며, 결제수단·상태·과세구분에는 드롭다운이 들어 있습니다.</p></div><div class="template-download"><a class="button button-primary" href="${TEMPLATE}" download>표준 양식 XLSX 다운로드</a></div></div><div class="template-validation" id="templateValidation" aria-live="polite"></div>`;
    host.prepend(card);
    const bindDownload=(selector,label)=>{const el=document.querySelector(selector);if(!el)return;el.textContent=label;el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const a=document.createElement('a');a.href=TEMPLATE;a.download='POS_마감자동화_업로드_표준양식.xlsx';document.body.append(a);a.click();a.remove();},true)};
    bindDownload('#heroInput','표준 업로드 양식 XLSX');
    bindDownload('#input','표준 양식 다운로드');
    bindDownload('#inputCard','표준 양식 다운로드');
    const choose=document.querySelector('#choose');if(choose)choose.textContent='양식으로 작성한 파일 업로드';
    const inputCard=document.querySelector('#inputCard')?.closest('.download');if(inputCard){inputCard.querySelector('h3').textContent='업로드 표준 양식';inputCard.querySelector('p').textContent='필수 열, 드롭다운, 작성안내와 예시 행이 포함된 XLSX 양식입니다.';}
    const file=document.querySelector('#file');
    if(file) file.addEventListener('change',async()=>{
      const box=document.querySelector('#templateValidation');
      const selected=file.files?.[0];
      if(!box||!selected) return;
      box.className='template-validation show';box.textContent='업로드 양식의 열을 확인하고 있습니다…';
      try{
        let tries=0;while(!window.XLSX&&tries++<30) await new Promise(r=>setTimeout(r,100));
        if(!window.XLSX) throw new Error('XLSX 분석 모듈을 불러오지 못했습니다.');
        const wb=XLSX.read(await selected.arrayBuffer(),{type:'array'});
        const name=wb.SheetNames.includes('입력양식')?'입력양식':wb.SheetNames[0];
        const grid=XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,defval:''});
        const headers=(grid[0]||[]).map(v=>String(v).trim().replace(/\*/g,''));
        const missing=required.filter(v=>!headers.includes(v));
        if(missing.length){box.className='template-validation show bad';box.textContent=`양식 확인 실패: ${missing.join(', ')} 열이 없습니다. 표준 양식을 내려받아 열 이름을 유지해 주세요.`;const run=document.querySelector('#run');if(run)run.disabled=true;}
        else{box.className='template-validation show ok';box.textContent=`양식 확인 완료 · ${name} 시트 · 필수 열 ${required.length}개 확인 · 데이터 ${Math.max(0,grid.length-1)}행`;}
      }catch(err){box.className='template-validation show bad';box.textContent='양식을 확인하지 못했습니다: '+(err?.message||err);}
    });
    return true;
  };
  if(!mount()) new MutationObserver((_,o)=>{if(mount())o.disconnect()}).observe(document.documentElement,{childList:true,subtree:true});
})();