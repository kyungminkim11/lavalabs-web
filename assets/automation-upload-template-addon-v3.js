(()=>{
  if(!location.pathname.toLowerCase().endsWith('automation-pos-live.html')) return;

  const FILE_NAME='POS_Upload_Template_Excel_Compatible.xlsx';
  const required=['주문번호','상품명','수량','단가','결제수단','결제상태','과세구분'];
  const optional=['판매일자','담당자','거래처','비고'];
  const inputRows=[
    ['판매일자','주문번호','상품명','수량','단가','결제수단','결제상태','과세구분','담당자','거래처','비고'],
    ['2026-07-12','SAMPLE-001','샘플 상품 A',2,60000,'카드','완료','과세','담당자 A','샘플 매장','예시 행 — 실제 데이터로 교체'],
    ['2026-07-12','SAMPLE-002','샘플 면세상품',1,30000,'현금','완료','면세','담당자 A','샘플 매장','면세 예시'],
    ['2026-07-12','SAMPLE-003','샘플 상품 B',1,45000,'복합결제','완료','과세','담당자 B','샘플 매장','카드 30,000 + 현금 15,000']
  ];
  const guideRows=[
    ['POS 마감 자동화 업로드 양식','Microsoft Excel 호환 버전'],
    ['순서','사용 방법'],
    ['1','입력양식 시트의 2행부터 데이터를 입력합니다.'],
    ['2','2~4행은 예시입니다. 실제 데이터로 교체하거나 삭제하세요.'],
    ['3','첫 행의 열 이름과 순서를 변경하지 마세요.'],
    ['4','필수 열: 주문번호, 상품명, 수량, 단가, 결제수단, 결제상태, 과세구분'],
    ['5','수량과 단가는 숫자만 입력합니다.'],
    ['6','결제상태: 완료 / 취소 / 환불 / 보류'],
    ['7','과세구분: 과세 / 면세 / 영세'],
    ['8','복합결제는 결제수단에 복합결제를 입력하고 비고에 구성을 적습니다.'],
    ['9','작성 후 XLSX 형식으로 저장하고 체험 페이지에서 업로드합니다.'],
    ['개인정보','공개 체험에는 고객명, 전화번호, 주소, 카드번호를 입력하지 마세요.']
  ];

  const style=document.createElement('style');
  style.textContent=`.template-guide{padding:24px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,#f7f9f3,#fff);box-shadow:0 18px 45px rgba(13,17,23,.06);margin-bottom:15px}.template-guide-grid{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:center}.template-guide h2{margin:6px 0 8px;font-size:25px;letter-spacing:-.035em}.template-guide p{margin:0;color:var(--muted);font-size:12px}.template-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:18px}.template-step{padding:13px;border:1px solid #dfe3dd;border-radius:14px;background:#fff}.template-step b,.template-step span{display:block}.template-step b{color:#718719;font-size:10px}.template-step span{margin-top:4px;font-size:11px;font-weight:800}.template-columns{display:flex;gap:7px;flex-wrap:wrap;margin-top:16px}.template-columns span{padding:6px 9px;border-radius:999px;background:#edf1e8;font-size:9px;font-weight:850}.template-columns span.required{background:#0d1117;color:#c9ff48}.template-validation{display:none;margin-top:13px;padding:13px 14px;border-radius:13px;font-size:11px;font-weight:800}.template-validation.show{display:block}.template-validation.ok{background:#eaf8e2;color:#386415}.template-validation.bad{background:#ffe5e5;color:#8c2929}.template-note{margin-top:12px!important;color:#78818b!important;font-size:10px!important}.template-download{min-width:220px}.template-download .button{width:100%}@media(max-width:760px){.template-guide-grid{grid-template-columns:1fr}.template-steps{grid-template-columns:1fr 1fr}.template-download{min-width:0}}@media(max-width:480px){.template-guide{padding:18px}.template-steps{grid-template-columns:1fr}.template-guide h2{font-size:21px}}`;
  document.head.append(style);

  const escapeXml=value=>String(value??'').replace(/[<>&'\"]/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','\"':'&quot;'}[char]));
  const colName=index=>{let n=index+1,out='';while(n){const r=(n-1)%26;out=String.fromCharCode(65+r)+out;n=Math.floor((n-1)/26);}return out;};
  const worksheetXml=rows=>{
    const maxCol=Math.max(...rows.map(row=>row.length));
    const sheetData=rows.map((row,rowIndex)=>{
      const cells=row.map((value,colIndex)=>{
        if(value===null||value===undefined||value==='') return '';
        const ref=`${colName(colIndex)}${rowIndex+1}`;
        if(typeof value==='number') return `<c r="${ref}"><v>${value}</v></c>`;
        return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
      }).join('');
      return `<row r="${rowIndex+1}">${cells}</row>`;
    }).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><dimension ref="A1:${colName(maxCol-1)}${rows.length}"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><sheetData>${sheetData}</sheetData><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>`;
  };

  async function waitForZip(){
    for(let i=0;i<50;i++){
      if(window.JSZip) return window.JSZip;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw new Error('파일 생성 모듈을 불러오지 못했습니다.');
  }

  async function createTemplateBlob(){
    const JSZip=await waitForZip();
    const zip=new JSZip();
    const main='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    const rel='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const pkg='http://schemas.openxmlformats.org/package/2006/relationships';
    const now=new Date().toISOString();
    zip.file('[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
    zip.folder('_rels').file('.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="${pkg}"><Relationship Id="rId1" Type="${rel}/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="${rel}/extended-properties" Target="docProps/app.xml"/></Relationships>`);
    zip.folder('docProps').file('core.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>POS Upload Template</dc:title><dc:creator>LavaLabs</dc:creator><cp:lastModifiedBy>LavaLabs</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`);
    zip.folder('docProps').file('app.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>2</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="2" baseType="lpstr"><vt:lpstr>입력양식</vt:lpstr><vt:lpstr>작성안내</vt:lpstr></vt:vector></TitlesOfParts><Company>LavaLabs</Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>`);
    zip.folder('xl').file('workbook.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="${main}" xmlns:r="${rel}"><fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="0"/><workbookPr defaultThemeVersion="164011"/><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="24000" windowHeight="12000"/></bookViews><sheets><sheet name="입력양식" sheetId="1" r:id="rId1"/><sheet name="작성안내" sheetId="2" r:id="rId2"/></sheets><calcPr calcId="191029"/></workbook>`);
    zip.folder('xl').folder('_rels').file('workbook.xml.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="${pkg}"><Relationship Id="rId1" Type="${rel}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${rel}/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="${rel}/styles" Target="styles.xml"/></Relationships>`);
    zip.folder('xl').file('styles.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="${main}"><fonts count="1"><font><sz val="11"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/></styleSheet>`);
    zip.folder('xl').folder('worksheets').file('sheet1.xml',worksheetXml(inputRows));
    zip.folder('xl').folder('worksheets').file('sheet2.xml',worksheetXml(guideRows));
    return zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',compression:'DEFLATE'});
  }

  async function downloadTemplate(button){
    const original=button?.textContent||'표준 양식 다운로드';
    try{
      if(button){button.disabled=true;button.textContent='Excel 호환 파일 생성 중…';}
      const blob=await createTemplateBlob();
      if(blob.size<3000) throw new Error('생성된 파일 크기가 비정상입니다.');
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');
      anchor.href=url;
      anchor.download=FILE_NAME;
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
    if(!host) return false;
    document.querySelectorAll('.template-guide').forEach(node=>node.remove());
    const card=document.createElement('article');
    card.className='template-guide';
    card.innerHTML=`<div class="template-guide-grid"><div><small class="eyebrow">STANDARD EXCEL TEMPLATE · V3</small><h2>양식을 먼저 내려받아 작성하세요.</h2><p>Microsoft Excel 호환 OOXML 구조로 브라우저에서 새 파일을 생성합니다.</p><div class="template-steps"><div class="template-step"><b>01</b><span>양식 다운로드</span></div><div class="template-step"><b>02</b><span>예시 행 수정·입력</span></div><div class="template-step"><b>03</b><span>XLSX로 저장</span></div><div class="template-step"><b>04</b><span>파일 업로드·검사</span></div></div><div class="template-columns">${required.map(v=>`<span class="required">${v} · 필수</span>`).join('')}${optional.map(v=>`<span>${v} · 선택</span>`).join('')}</div><p class="template-note">파일명은 ${FILE_NAME}으로 저장됩니다. 표·매크로·외부 연결은 포함하지 않습니다.</p></div><div class="template-download"><button class="button button-primary" type="button" data-template-download>표준 양식 XLSX 다운로드</button></div></div><div class="template-validation" id="templateValidation" aria-live="polite"></div>`;
    host.prepend(card);

    const bind=(selector,label)=>{
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
    bind('#heroInput','표준 업로드 양식 XLSX');
    bind('#input','표준 양식 다운로드');
    bind('#inputCard','표준 양식 다운로드');

    const choose=document.querySelector('#choose');
    if(choose) choose.textContent='양식으로 작성한 파일 업로드';
    const inputCard=document.querySelector('#inputCard')?.closest('.download');
    if(inputCard){
      inputCard.querySelector('h3').textContent='업로드 표준 양식';
      inputCard.querySelector('p').textContent='Microsoft Excel 호환 구조와 예시 행을 포함한 XLSX 양식입니다.';
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
          box.textContent=`양식 확인 실패: ${missing.join(', ')} 열이 없습니다.`;
          const run=document.querySelector('#run');
          if(run) run.disabled=true;
        }else{
          box.className='template-validation show ok';
          box.textContent=`양식 확인 완료 · ${name} 시트 · 필수 열 ${required.length}개 · 데이터 ${Math.max(0,grid.length-1)}행`;
        }
      }catch(error){
        box.className='template-validation show bad';
        box.textContent='양식을 확인하지 못했습니다: '+(error?.message||error);
      }
    });
    return true;
  };

  if(!mount()) new MutationObserver((_,observer)=>{if(mount()) observer.disconnect();}).observe(document.documentElement,{childList:true,subtree:true});
})();