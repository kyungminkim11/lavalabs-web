(()=>{
  const ENDPOINT='https://formsubmit.co/info@lavalabs.co.kr';
  const THANK_YOU='https://space.lavalabs.co.kr/thanks.html';
  const AUTO_REPLY='문의가 접수되었습니다. 내용을 확인한 뒤 순차적으로 답변드리겠습니다. 문의만으로 계약이나 결제가 진행되지는 않습니다.';
  const MAX_FILE_BYTES=10*1024*1024;

  const hidden=(form,name,value)=>{
    let input=form.querySelector(`input[name="${name}"]`);
    if(!input){input=document.createElement('input');input.type='hidden';input.name=name;form.prepend(input)}
    if(!input.value)input.value=value;
  };

  const readableFormText=form=>{
    const lines=[];
    new FormData(form).forEach((value,key)=>{
      if(key.startsWith('_')||key==='attachment'||value instanceof File)return;
      lines.push(`${key}: ${String(value||'-')}`);
    });
    return `LavaLabs 문의\n\n${lines.join('\n')}`;
  };

  const prepare=(original)=>{
    if(!original||original.dataset.formsubmitReady==='true')return;
    let form=original;
    if(form.id==='contact-form'){
      const clone=form.cloneNode(true);
      form.replaceWith(clone);
      form=clone;
    }
    form.dataset.formsubmitReady='true';
    form.action=ENDPOINT;
    form.method='POST';
    form.enctype='multipart/form-data';
    hidden(form,'_subject','[LavaLabs] 새로운 공간·프로젝트 문의');
    hidden(form,'_next',THANK_YOU);
    hidden(form,'_template','table');
    hidden(form,'_autoresponse',AUTO_REPLY);
    if(!form.querySelector('[name="_honey"]')){
      const honey=document.createElement('input');
      honey.type='text';honey.name='_honey';honey.tabIndex=-1;honey.autocomplete='off';honey.style.display='none';
      form.prepend(honey);
    }

    const button=form.querySelector('button[type="submit"]');
    if(button)button.textContent='문의 접수하기';
    const note=form.querySelector('.form-note');
    if(note)note.textContent='문의 접수는 견적 요청 단계이며 계약·결제가 아닙니다. 주민등록번호·결제정보 등 민감정보는 보내지 마세요.';

    const status=form.querySelector('.form-status');
    const copy=form.querySelector('#copy-inquiry');
    copy?.addEventListener('click',async()=>{
      if(!form.reportValidity())return;
      try{await navigator.clipboard.writeText(readableFormText(form));if(status)status.textContent='문의 내용이 복사되었습니다.'}
      catch{if(status)status.textContent='자동 복사에 실패했습니다. 입력 내용을 직접 선택해 복사해 주세요.'}
    });

    form.addEventListener('submit',event=>{
      if(!form.reportValidity()){
        event.preventDefault();
        return;
      }
      const files=[...form.querySelectorAll('input[type="file"]')].flatMap(input=>[...(input.files||[])]);
      const total=files.reduce((sum,file)=>sum+file.size,0);
      if(total>MAX_FILE_BYTES){
        event.preventDefault();
        if(status)status.textContent='첨부파일 전체 크기를 10MB 이하로 줄여주세요.';
        return;
      }
      if(button){button.disabled=true;button.textContent='안전하게 접수하는 중...'}
      if(status)status.textContent='문의 내용을 전송하고 있습니다.';
    });
  };

  document.querySelectorAll('#contact-form,[data-real-inquiry]').forEach(prepare);
})();
