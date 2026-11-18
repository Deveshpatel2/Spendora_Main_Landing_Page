// First-party, minimized browser observations. No account/expense data or full URLs.
(() => {
  'use strict';
  if(navigator.doNotTrack==='1' || navigator.globalPrivacyControl || location.pathname.startsWith('/admin') || location.pathname.startsWith('/join'))return;
  const random=()=>crypto.randomUUID();
  const send=name=>{
    try {
      const now=Date.now();
      let session=JSON.parse(sessionStorage.getItem('spendora_browser_session') || 'null');
      if(!session || now-session.lastSeen>1800000)session={id:random(),visitor:random(),lastSeen:now};
      session.lastSeen=now;sessionStorage.setItem('spendora_browser_session',JSON.stringify(session));
      const query=new URLSearchParams(location.search);
      const payload={id:random(),sessionId:session.id,visitorId:session.visitor,name,path:location.pathname.replace(/\/$/,'') || '/',platform:matchMedia('(max-width: 800px)').matches?'mobile':'desktop',source:query.get('utm_source'),medium:query.get('utm_medium'),campaign:query.get('utm_campaign'),referrer:document.referrer?new URL(document.referrer).origin:null};
      void fetch('/spendora-telemetry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
    } catch { /* Storage restrictions and analytics must never block the website. */ }
  };
  send('page_view');
  document.addEventListener('click',event=>{
    const link=event.target.closest('a');if(!link)return;
    try {if(['apps.apple.com','play.google.com'].includes(new URL(link.href).hostname))send('store_click');}catch{}
  });
})();
