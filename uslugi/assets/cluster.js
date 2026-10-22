
const progress=document.querySelector('.reading-progress');
const topButton=document.querySelector('.back-top');
const updateScroll=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress) progress.style.width=(max>0?scrollY/max*100:0)+'%';
  if(topButton) topButton.classList.toggle('visible',scrollY>700);
};
addEventListener('scroll',updateScroll,{passive:true});
updateScroll();
if(topButton) topButton.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
document.querySelectorAll('.lead-form').forEach(form=>{
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const status=form.querySelector('.status');
    const submit=form.querySelector('button[type="submit"]');
    if(!form.reportValidity()) return;
    status.className='status';
    status.textContent='Отправляем заявку...';
    submit.disabled=true;
    const data=new FormData(form);
    const payload={task:`${form.dataset.service}: ${data.get('task')}`,telegram:data.get('telegram'),name:data.get('name'),timestamp:new Date().toISOString()};
    try{
      const response=await fetch('https://n8n.snezhko.store/webhook/lead-form',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      status.className='status ok';
      status.textContent='Заявка отправлена. Сергей свяжется с вами в Telegram.';
      form.reset();
    }catch(error){
      status.className='status error';
      status.textContent='Не удалось отправить. Напишите напрямую: @snezhko_sergey';
    }finally{submit.disabled=false}
  });
});
