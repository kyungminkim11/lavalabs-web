(()=>{
  const ENDPOINT='https://formsubmit.co/info@lavalabs.co.kr';
  const THANK_YOU='https://space.lavalabs.co.kr/thanks.html';
  const AUTO_REPLY='문의가 접수되었습니다. 내용을 확인한 뒤 순차적으로 답변드리겠습니다. 문의만으로 계약이나 결제가 진행되지는 않습니다.';

  const hidden=(form,name,value)=>{
    let input=form.querySelector(`input[name="${name}"]`);
    if(!input){input=document.createElement('input');input.type='hidden';input.name=name;form.prepend(input)}
    input.value=value;
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

    form.addEventListener('submit',event=>{
      if(!form.reportValidity()){
        event.preventDefault();
        return;
      }
      if(button){button.disabled=true;button.textContent='안전하게 접수하는 중...'}
      const status=form.querySelector('.form-status');
      if(status)status.textContent='문의 내용을 전송하고 있습니다.';
    });
  };

  document.querySelectorAll('#contact-form,[data-real-inquiry]').forEach(prepare);
})();
