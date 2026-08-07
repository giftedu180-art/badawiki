(()=>{
  const form=document.querySelector('#authForm'); if(!form)return;
  const authLayer=document.querySelector('#authModal');
  /* 로그인 창 자체가 길어지면, 흰 창 위에서 드래그해 끝까지 내려갈 수 있게 합니다. */
  authLayer.style.setProperty('overflow-y','auto','important');
  authLayer.style.setProperty('align-items','start','important');
  authLayer.style.setProperty('overscroll-behavior','contain','important');
  authLayer.style.setProperty('touch-action','pan-y','important');
  form.style.setProperty('max-height','none','important');
  form.style.setProperty('overflow-y','visible','important');
  form.style.setProperty('margin','20px auto','important');
  form.style.setProperty('touch-action','pan-y','important');
  /* 데스크톱에서도 흰 로그인 창의 빈 부분을 잡아 위·아래로 끌 수 있게 합니다. */
  let dragStartY=null,dragStartScroll=0;
  form.addEventListener('pointerdown',event=>{
    if(event.button!==undefined&&event.button!==0)return;
    if(event.target.closest('input,select,textarea,button'))return;
    dragStartY=event.clientY;
    dragStartScroll=authLayer.scrollTop;
    form.setPointerCapture?.(event.pointerId);
  });
  form.addEventListener('pointermove',event=>{
    if(dragStartY===null)return;
    authLayer.scrollTop=dragStartScroll-(event.clientY-dragStartY);
  });
  const stopModalDrag=event=>{
    dragStartY=null;
    try{form.releasePointerCapture?.(event.pointerId)}catch(error){}
  };
  form.addEventListener('pointerup',stopModalDrag);
  form.addEventListener('pointercancel',stopModalDrag);
  const identity=document.createElement('div');
  identity.innerHTML='<label>실명</label><input id="authRealName" required placeholder="실명을 입력하세요" autocomplete="name"><label>휴대폰 번호</label><input id="authPhone" required placeholder="010-0000-0000" inputmode="tel" autocomplete="tel"><label>시연용 본인확인번호 7자리 <small>(실제 주민등록번호 입력 금지)</small></label><input id="authId7" required placeholder="숫자 7자리" inputmode="numeric" maxlength="7" autocomplete="off"><label>시연용 인증번호</label><input id="authCode" required placeholder="000000" inputmode="numeric" maxlength="6"><p class="notice">민감한 입력값은 저장·전송하지 않습니다. 시연용 인증번호는 000000입니다.</p>';
  form.insertBefore(identity,form.querySelector('label'));
  document.querySelectorAll('[data-go]').forEach(button=>button.onclick=()=>{targetRole=button.dataset.go;const fisher=targetRole==='fisher';authTitle.textContent=fisher?'어업 종사자 회원가입·로그인':'귀어인 회원가입·로그인';userSpeciesLabel.textContent=fisher?'주요 어종':'관심 어종';userCareerLabel.textContent=fisher?'어업 경력':'귀어 준비 단계';userCareer.innerHTML=(fisher?['1년 미만','1~5년','6~10년','11~20년','21년 이상']:['준비 중','교육 수강 중','초기 정착']).map(v=>'<option>'+v+'</option>').join('');modal.classList.add('show')});
  form.onsubmit=e=>{e.preventDefault();if(!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(authPhone.value))return alert('휴대폰 번호를 확인해 주세요.');if(!/^\d{7}$/.test(authId7.value))return alert('시연용 본인확인번호 숫자 7자리를 입력해 주세요.');if(authCode.value!=='000000')return alert('시연용 인증번호는 000000입니다.');localStorage.setItem('badawikiUser',JSON.stringify({role:targetRole,name:userName.value.trim(),region:userRegion.value.trim(),species:userSpecies.value.trim(),career:userCareer.value,verified:true}));location.href=targetRole+'.html'};
})();
