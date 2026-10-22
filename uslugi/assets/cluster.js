
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
const LEAD_ENDPOINTS=[
  'https://n8n.82-38-69-40.sslip.io/webhook/lead-form',
  'https://n8n.snezhko.store/webhook/lead-form'
];
const sendLead=async payload=>{
  let lastError;
  for(const endpoint of LEAD_ENDPOINTS){
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify(payload)});
      const responseBody=await response.json().catch(()=>null);
      if(!response.ok||responseBody?.ok!==true) throw new Error(`HTTP ${response.status}`);
      return;
    }catch(error){lastError=error}
    finally{clearTimeout(timeout)}
  }
  throw lastError;
};
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
    const params=new URLSearchParams(location.search);
    const payload={
      lead_id:crypto.randomUUID?crypto.randomUUID():Date.now().toString(36),
      task:`${form.dataset.service}: ${data.get('task')}`,
      telegram:data.get('telegram'),
      name:data.get('name'),
      timestamp:new Date().toISOString(),
      utm_source:params.get('utm_source'),
      utm_medium:params.get('utm_medium'),
      utm_campaign:params.get('utm_campaign'),
      referrer:document.referrer||null,
      landing_path:location.pathname
    };
    try{
      await sendLead(payload);
      form.innerHTML='<div class="form-success-screen" role="status"><strong>Заявка отправлена</strong><span>Сергей свяжется с вами в Telegram.</span></div>';
    }catch(error){
      status.className='status error';
      status.textContent='Не удалось отправить. Напишите напрямую: @snezhko_sergey';
    }finally{submit.disabled=false}
  });
});
