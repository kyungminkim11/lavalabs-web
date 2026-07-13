(()=>{
  'use strict';
  if(!/\/space\.html$/i.test(location.pathname))return;

  const form=document.querySelector('#space-inquiry-form');
  if(!form||form.dataset.materialFieldsReady==='true')return;
  form.dataset.materialFieldsReady='true';

  const style=document.createElement('style');
  style.textContent=`
    .inquiry-material-links{margin-top:2px}
    .inquiry-material-links input{width:100%}
    .material-upload-summary{display:none;margin:-4px 0 13px;padding:10px 12px;border-radius:11px;background:#f1f8d8;color:#4b5d1a;font-size:10px;line-height:1.6}
    .material-upload-summary.show{display:block}
    .material-guide{margin:-4px 0 13px;padding:11px 12px;border:1px solid #ffffff20;border-radius:11px;background:#ffffff08;color:#b6bec7;font-size:10px;line-height:1.65}
    .material-guide strong{color:#fff}
    @media(max-width:680px){.inquiry-material-links{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const message=form.querySelector('textarea[name="문의_내용"]')?.closest('label');
  if(message){
    const links=document.createElement('div');
    links.className='form-grid inquiry-material-links';
    links.innerHTML=`
      <label><span>기존 홈페이지·네이버 플레이스 링크</span><input name="운영_페이지_링크" type="url" inputmode="url" placeholder="https://... (선택사항)"></label>
      <label><span>도면·자료 공유 링크</span><input name="자료_공유_링크" type="url" inputmode="url" placeholder="Google Drive·MYBOX 등 (선택사항)"></label>
    `;
    message.insertAdjacentElement('afterend',links);
  }

  const fileInput=form.querySelector('input[type="file"]');
  if(fileInput){
    fileInput.accept='image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';
    fileInput.multiple=true;
    const label=fileInput.closest('label');
    const title=label?.querySelector('span');
    if(title)title.textContent='도면·공간 사진·참고자료 첨부';

    const helper=label?.nextElementSibling;
    if(helper?.classList.contains('form-helper')){
      helper.textContent='선택사항 · JPG, PNG, WebP, HEIC, PDF, Word, PowerPoint, Excel · 전체 합계 10MB 이하';
      const guide=document.createElement('p');
      guide.className='material-guide';
      guide.innerHTML='<strong>링크로 보내는 경우</strong> Google Drive·네이버 MYBOX 등은 담당자가 열 수 있도록 “링크가 있는 사용자 보기” 권한을 설정해 주세요. 주민등록번호, 출입 비밀번호, 결제정보 등 민감정보는 보내지 마세요.';
      helper.insertAdjacentElement('afterend',guide);

      const summary=document.createElement('div');
      summary.className='material-upload-summary';
      summary.setAttribute('aria-live','polite');
      guide.insertAdjacentElement('afterend',summary);

      fileInput.addEventListener('change',()=>{
        const files=[...(fileInput.files||[])];
        if(!files.length){summary.classList.remove('show');summary.textContent='';return}
        const bytes=files.reduce((sum,file)=>sum+file.size,0);
        const mb=(bytes/1024/1024).toFixed(1);
        summary.textContent=`${files.length}개 파일 선택 · 총 ${mb}MB${bytes>10*1024*1024?' · 10MB 이하로 줄여주세요.':''}`;
        summary.classList.add('show');
      });
    }
  }

  const reassurance=[...document.querySelectorAll('.inquiry-reassurance div span')];
  const materialLine=reassurance.find(node=>node.textContent.includes('사진을 첨부하면'));
  if(materialLine)materialLine.innerHTML='도면·현장 사진·기존 페이지 링크를 보내면 <strong>촬영 지점과 필요한 구성</strong>을 더 구체적으로 검토할 수 있습니다.';

  const consent=form.querySelector('input[name="개인정보_동의"]')?.closest('label')?.querySelector('span');
  if(consent)consent.textContent='문의 답변을 위해 입력 정보, 첨부자료와 참고 링크를 이용하고 외부 폼 전송 서비스를 통해 이메일로 전달하는 것에 동의합니다. *';

  const faq=document.querySelector('.faq-list');
  if(faq&&!faq.textContent.includes('도면이나 참고 링크는 어떻게 보내나요')){
    const item=document.createElement('details');
    item.innerHTML='<summary>도면이나 참고 링크는 어떻게 보내나요?<span>+</span></summary><p>문의 폼에서 이미지, PDF, Word, PowerPoint, Excel 파일을 첨부할 수 있습니다. 파일이 크거나 여러 개인 경우 Google Drive·네이버 MYBOX 등의 공유 링크를 입력하고 담당자가 열 수 있도록 보기 권한을 설정해 주세요.</p>';
    faq.prepend(item);
  }
})();