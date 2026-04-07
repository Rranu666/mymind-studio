/* ─── Async Google Fonts (no inline onload handler) ─── */
(function(){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&family=Barlow+Condensed:wght@700;800;900&display=swap';
  document.head.appendChild(link);
})();

/* ─── Always land on hero on refresh ─── */
if('scrollRestoration' in history) history.scrollRestoration='manual';
window.addEventListener('load',function(){ window.scrollTo(0,0); });

/* ─── Hero video iframe scale-to-fill ─── */
(function(){
  const iframe = document.querySelector('.hero-video-iframe');
  if(!iframe) return;
  function scaleIframe(){
    const hero = iframe.closest('.hero-video-bg');
    if(!hero) return;
    const hw = hero.offsetWidth, hh = hero.offsetHeight;
    const scale = Math.max(hw/1280, hh/800);
    /* Only change transform — no layout-shifting properties (width/height/left/top) */
    iframe.style.transform = `translate(-50%,-50%) scale(${scale})`;
  }
  window.addEventListener('resize', scaleIframe);
  scaleIframe();
})();

/* ─── Nav scroll effect ─── */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.style.background=window.scrollY>50?'rgba(13,15,20,0.98)':'rgba(13,15,20,0.88)';
},{ passive:true });

/* ─── Selected Work — horizontal scroll strip ─── */
(function(){
  var workEl=document.querySelector('.work');
  var track=document.querySelector('.work-grid');
  var dots=document.querySelectorAll('.work-progress-dot');
  var cards=document.querySelectorAll('.work-card');
  var maxX=0;
  var cardCount=cards.length;

  function calcMax(){
    if(window.innerWidth<=768){workEl.style.height='';return;}
    maxX=Math.max(0,track.scrollWidth-window.innerWidth);
    /* Set exact scroll height so no dead gap at end */
    workEl.style.height=(window.innerHeight+maxX+80)+'px';
  }

  function onScroll(){
    if(window.innerWidth<=768){track.style.transform='';return;}
    var rect=workEl.getBoundingClientRect();
    var sectionH=workEl.offsetHeight;
    var vp=window.innerHeight;
    var progress=Math.max(0,Math.min(1,-rect.top/(sectionH-vp)));
    track.style.transform='translateX('+(-progress*maxX)+'px)';
    /* update progress dots */
    if(dots.length&&cardCount>0){
      var activeIdx=Math.min(cardCount-1,Math.floor(progress*cardCount));
      dots.forEach(function(d,i){
        d.classList.toggle('active',i===activeIdx);
      });
    }
  }

  calcMax();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',function(){calcMax();onScroll();});
  onScroll();
})();

/* ─── Mobile menu ─── */
const menuBtn=document.getElementById('menuBtn');
const mobMenu=document.getElementById('mobMenu');
const mobCloseBtn=document.getElementById('mobCloseBtn');
function closeMobMenu(){
  menuBtn.classList.remove('open');
  mobMenu.classList.remove('open');
  document.body.style.overflow='';
}
menuBtn.addEventListener('click',()=>{
  menuBtn.classList.toggle('open');
  mobMenu.classList.toggle('open');
  document.body.style.overflow=mobMenu.classList.contains('open')?'hidden':'';
});
if(mobCloseBtn) mobCloseBtn.addEventListener('click', closeMobMenu);
mobMenu.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', closeMobMenu);
});

/* ─── Scroll reveal ─── */
document.body.classList.add('anim-ready');
const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
},{threshold:.05,rootMargin:'0px 0px 0px 0px'});
revealEls.forEach(el=>io.observe(el));

/* ─── Custom select helpers ─── */
function toggleCselect(id){
  const el = document.getElementById(id);
  if(!el) return;
  const isOpen = el.classList.contains('open');
  // close all others first
  document.querySelectorAll('.cselect.open').forEach(c=>c.classList.remove('open'));
  if(!isOpen) el.classList.add('open');
}
function pickCselect(id, val){
  const el = document.getElementById(id);
  if(!el) return;
  // Update visible label
  el.querySelector('.cselect-val').textContent = val;
  // Update hidden native select
  const native = el.querySelector('select');
  if(native){
    for(let opt of native.options){ if(opt.value===val||opt.text===val){ opt.selected=true; break; } }
  }
  // Mark chosen item
  el.querySelectorAll('.cselect-list li').forEach(li=>li.classList.toggle('chosen', li.textContent===val));
  el.classList.add('selected');
  el.classList.remove('open');
}
// Close custom selects when clicking outside
document.addEventListener('click', e=>{
  if(!e.target.closest('.cselect')) document.querySelectorAll('.cselect.open').forEach(c=>c.classList.remove('open'));
});

/* ─── Thank You Modal ─── */
function showThankYou(email){
  const overlay=document.getElementById('thankYouOverlay');
  const box=document.getElementById('thankYouBox');
  const emailEl=document.getElementById('tyEmail');
  const circle=document.getElementById('tyCircle');
  const tick=document.getElementById('tyTick');
  if(emailEl&&email)emailEl.textContent=email;
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
  // Trigger animations after paint
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      box.style.transform='scale(1)';
      if(circle)circle.style.strokeDashoffset='0';
      if(tick)tick.style.opacity='1';
    });
  });
}
function closeThankYou(){
  const overlay=document.getElementById('thankYouOverlay');
  const box=document.getElementById('thankYouBox');
  box.style.transform='scale(.92)';
  setTimeout(()=>{
    overlay.style.display='none';
    document.body.style.overflow='';
  },300);
}
document.getElementById('thankYouOverlay')?.addEventListener('click',function(e){
  if(e.target===this)closeThankYou();
});

function openContactForm(){
  const anchor = document.getElementById('cta-form-anchor');
  const csel   = document.getElementById('cSelectService');
  if(!anchor) return;
  anchor.scrollIntoView({behavior:'smooth', block:'center'});
  // After scroll lands open the dropdown + pulse the form
  setTimeout(()=>{
    anchor.classList.remove('form-highlight');
    void anchor.offsetWidth;
    anchor.classList.add('form-highlight');
    if(csel){
      document.querySelectorAll('.cselect.open').forEach(c=>c.classList.remove('open'));
      csel.classList.add('open');
    }
  }, 700);
}

/* ─── Real Results video scroll + play/pause ─── */
function toggleRvid(playEl){
  const card = playEl.closest('.rwork-card,.rwork-phone-card');
  const vid  = playEl.closest('.rwork-laptop-screen,.rwork-phone-inner') ?
               playEl.closest('.rwork-laptop-screen,.rwork-phone-inner').querySelector('video') : null;
  if(!vid || !card) return;
  if(card.classList.contains('rplaying')){
    vid.pause(); card.classList.remove('rplaying');
  } else {
    document.querySelectorAll('.rwork-card.rplaying,.rwork-phone-card.rplaying').forEach(c=>{
      c.classList.remove('rplaying');
      const v=c.querySelector('video'); if(v) v.pause();
    });
    vid.play(); card.classList.add('rplaying');
  }
}
(function(){
  var rSection = document.querySelector('.rwork');
  var rTrack   = document.getElementById('rworkGrid');
  var rDots    = document.querySelectorAll('.rwork-progress-dot');
  var rCards   = document.querySelectorAll('#rworkGrid > [data-rcard]');
  if(!rSection || !rTrack) return;
  function getRworkMaxX(){
    var cards = rTrack.querySelectorAll('.rwork-card');
    var total = 0;
    cards.forEach(c=>{ total += c.offsetWidth + 30; }); // gap=30px (matches CSS)
    total -= 30; // last card: no trailing gap
    return Math.max(0, total + 120 - window.innerWidth); // 60px padding each side
  }
  function setRworkHeight(){
    if(window.innerWidth<=768){rSection.style.height='';return;}
    var maxX = getRworkMaxX();
    rSection.style.height = (window.innerHeight + maxX + 80) + 'px';
  }
  function onRworkScroll(){
    if(window.innerWidth<=768){rTrack.style.transform='';return;}
    var rect   = rSection.getBoundingClientRect();
    var sH     = rSection.offsetHeight - window.innerHeight;
    var prog   = Math.max(0, Math.min(1, -rect.top / sH));
    var maxX   = getRworkMaxX();
    var tx     = prog * maxX;
    rTrack.style.transform = 'translateX(-'+tx+'px)';
    // update dots
    if(rCards.length){
      var idx = Math.min(rCards.length-1, Math.floor(prog * rCards.length));
      rDots.forEach((d,i)=>d.classList.toggle('active',i===idx));
    }
  }
  setRworkHeight();
  window.addEventListener('scroll', onRworkScroll, {passive:true});
  window.addEventListener('resize', function(){ setRworkHeight(); onRworkScroll(); });
  onRworkScroll();
})();

/* ─── Tech tabs ─── */
document.querySelectorAll('.tech-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tech-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tech-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
  });
});

/* ─── FAQ accordion ─── */
document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click',()=>{
    const isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!isOpen)item.classList.add('open');
  });
});

/* ─── Smooth scroll for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){
      const target=document.querySelector(id);
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
    }
  });
});

/* ─── Form submit (multi-step) ─── */
const ctaForm=document.getElementById('ctaForm');
if(ctaForm){
  // Multi-step logic
  function goFormStep(from,to){
    document.getElementById('fstep'+from).classList.remove('active');
    document.getElementById('fstep'+to).classList.add('active');
    // Update dots
    for(let i=1;i<=3;i++){
      const dot=document.getElementById('fsd'+i);
      const line=document.getElementById('fsl'+i);
      if(i<to){dot.classList.add('done');dot.classList.remove('active');if(line)line.classList.add('done');}
      else if(i===to){dot.classList.remove('done');dot.classList.add('active');}
      else{dot.classList.remove('done','active');}
    }
  }
  function validateStep(stepEl){
    let ok=true;
    stepEl.querySelectorAll('[required]').forEach(el=>{
      if(!el.value.trim()){ok=false;el.style.borderColor='rgba(255,80,80,.7)';}
      else{el.style.borderColor='';}
    });
    return ok;
  }
  document.getElementById('fNext1')?.addEventListener('click',()=>{
    if(validateStep(document.getElementById('fstep1')))goFormStep(1,2);
  });
  document.getElementById('fBack2')?.addEventListener('click',()=>goFormStep(2,1));
  document.getElementById('fNext2')?.addEventListener('click',()=>goFormStep(2,3));
  document.getElementById('fBack3')?.addEventListener('click',()=>goFormStep(3,2));
  ctaForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(!validateStep(document.getElementById('fstep3')))return;
    const btn=ctaForm.querySelector('[type="submit"]');
    const origText=btn.textContent;
    btn.textContent='Sending…';btn.disabled=true;
    try{
      const fd=new FormData(ctaForm);
      const emailVal=ctaForm.querySelector('[name="email"]')?.value||'';
      const res=await fetch('https://formsubmit.co/ajax/hello@mymindstudio.ai',{
        method:'POST',
        body:fd,
        headers:{'Accept':'application/json'}
      });
      const data=await res.json().catch(()=>({}));
      if(res.ok&&(data.success==='true'||data.success===true||res.status===200)){
        showThankYou(emailVal);
        ctaForm.reset();
        // Reset multi-step form back to step 1
        goFormStep(3,1);
        document.getElementById('cSelectService')?.classList.remove('open','selected');
        const valEl=document.querySelector('.cselect-val');
        if(valEl)valEl.textContent='What are you building? *';
        const nativeSel=document.getElementById('cSelectServiceNative');
        if(nativeSel)nativeSel.selectedIndex=0;
        document.querySelectorAll('.cselect-list li').forEach(li=>li.classList.remove('chosen'));
      } else {
        btn.textContent=origText;btn.disabled=false;
        alert('Something went wrong. Please email us at hello@mymindstudio.ai');
      }
    }catch(err){
      btn.textContent=origText;btn.disabled=false;
      alert('Network error. Please email us at hello@mymindstudio.ai');
    }
  });
}

/* ─── Video modal ─── */
const vidOverlay=document.getElementById('vidModalOverlay');
const vidIframe=document.getElementById('vidIframe');
const heroPlayBtn=document.getElementById('heroPlayBtn');
const vidClose=document.getElementById('vidModalClose');
const EXPLAINER_URL='/explainer-video/';
function openVidModal(){
  if(vidIframe)vidIframe.src=EXPLAINER_URL;
  if(vidOverlay)vidOverlay.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeVidModal(){
  if(vidIframe)vidIframe.src='about:blank';
  if(vidOverlay)vidOverlay.classList.remove('open');
  document.body.style.overflow='';
}
heroPlayBtn?.addEventListener('click',openVidModal);
vidClose?.addEventListener('click',closeVidModal);
vidOverlay?.addEventListener('click',e=>{if(e.target===vidOverlay)closeVidModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeVidModal();closeAiModal();}});

/* ─── AI Modal ─── */
const aiModal=document.getElementById('aiModal');
const askAiBtn=document.getElementById('askAiBtn');
const aiModalClose=document.getElementById('aiModalClose');
const aiMessages=document.getElementById('aiMessages');
const aiInput=document.getElementById('aiInput');
const aiSend=document.getElementById('aiSend');

const aiAnswers={
  'what services do you offer':'We offer Custom App & Website Development, Mobile Apps (iOS/Android), AI Integration & Chatbots, eCommerce Solutions, UI/UX Design, Business Automation, and SEO & Digital Marketing. Every project is built from scratch — no templates. 🚀',
  'app cost':'Custom apps typically cost $3,000–$15,000 depending on complexity. Use our free Cost Estimator tool on this page for a personalised estimate, or book a free consultation for an exact quote!',
  'fixed bid':'Fixed Bid is best for defined projects — you know exactly what you\'re building and want clear scope, timeline, and cost upfront. Dedicated Team is best for ongoing work — starting from $4,000/month with flexible scaling. Not sure? Book a free call and we\'ll advise!',
  'how long':'Websites typically go live in 2–4 weeks. Custom apps take 6–16 weeks. The exact timeline is agreed before we start — and we stick to it. We also offer an on-time guarantee or money back.',
  'process':'4 steps: (1) Discovery Call — we listen, no sales pitch. (2) Strategy & Blueprint — full roadmap, cost, and timeline within 24hrs. (3) Build & Launch — weekly check-ins, milestone sign-offs. (4) Support & Grow — go-to-market guidance included. 🎯',
  'default':'Great question! I\'d recommend booking a free 30-minute consultation — we\'ll answer everything about your specific project and send you a full roadmap within 24 hours. 👉 <a href="#contact" class="ai-contact-link" style="color:#aaff00;text-decoration:none;font-weight:700">Contact us here</a>'
};

function addAiMsg(text,type){
  const div=document.createElement('div');
  div.className='ai-msg '+type;
  /* ── DOM XSS fix: user input uses textContent; bot replies use innerHTML
     (bot answers come from a fixed internal dictionary, not user data) ── */
  if(type==='user'){div.textContent=text;}else{div.innerHTML=text;}
  aiMessages?.appendChild(div);
  aiMessages?.scrollTo(0,aiMessages.scrollHeight);
}
function showTyping(){
  const t=document.createElement('div');
  t.className='ai-typing';t.id='aiTyping';
  t.innerHTML='<span></span><span></span><span></span>';
  aiMessages?.appendChild(t);
  aiMessages?.scrollTo(0,aiMessages.scrollHeight);
}
function removeTyping(){document.getElementById('aiTyping')?.remove();}

function handleAiQ(q){
  if(!q.trim())return;
  addAiMsg(q,'user');
  if(aiInput)aiInput.value='';
  showTyping();
  const lower=q.toLowerCase();
  let ans=aiAnswers.default;
  Object.keys(aiAnswers).forEach(k=>{if(lower.includes(k))ans=aiAnswers[k];});
  setTimeout(()=>{removeTyping();addAiMsg(ans,'bot');},900+Math.random()*400);
}

/* ─── AI contact link — event delegation (no inline onclick needed) ─── */
aiMessages?.addEventListener('click', e=>{
  if(e.target.matches('.ai-contact-link')){
    e.preventDefault();
    closeAiModal();
    const contact=document.getElementById('contact');
    if(contact) contact.scrollIntoView({behavior:'smooth',block:'start'});
  }
});

function openAiModal(){aiModal?.classList.add('open');}
function closeAiModal(){aiModal?.classList.remove('open');}
askAiBtn?.addEventListener('click',openAiModal);
aiModalClose?.addEventListener('click',closeAiModal);
aiSend?.addEventListener('click',()=>handleAiQ(aiInput?.value||''));
aiInput?.addEventListener('keydown',e=>{if(e.key==='Enter')handleAiQ(aiInput.value);});
document.querySelectorAll('.ai-sug').forEach(btn=>{
  btn.addEventListener('click',()=>handleAiQ(btn.dataset.q||btn.textContent));
});

/* ─── Exit Intent Modal ─── */
const exitOverlay=document.getElementById('exitOverlay');
const exitClose=document.getElementById('exitClose');
const exitSubmit=document.getElementById('exitSubmit');
let exitShown=false;
document.addEventListener('mouseleave',e=>{
  if(e.clientY<10&&!exitShown&&!sessionStorage.getItem('exitShown')){
    exitShown=true;
    sessionStorage.setItem('exitShown','1');
    exitOverlay?.classList.add('open');
  }
});
// Also show after 45s
setTimeout(()=>{
  if(!exitShown&&!sessionStorage.getItem('exitShown')){
    exitShown=true;sessionStorage.setItem('exitShown','1');
    exitOverlay?.classList.add('open');
  }
},45000);
exitClose?.addEventListener('click',()=>exitOverlay?.classList.remove('open'));
exitOverlay?.addEventListener('click',e=>{if(e.target===exitOverlay)exitOverlay.classList.remove('open');});
exitSubmit?.addEventListener('click',()=>{
  const email=document.getElementById('exitEmail')?.value;
  if(!email||!email.includes('@'))return;
  document.getElementById('exitSuccess').style.display='block';
  document.getElementById('exitEmail').style.display='none';
  exitSubmit.style.display='none';
  setTimeout(()=>exitOverlay?.classList.remove('open'),3000);
});

/* ─── Sticky CTA ─── */
const stickyCta=document.getElementById('stickyCta');
const stickyDismiss=document.getElementById('stickyDismiss');
let stickyDismissed=sessionStorage.getItem('stickyDismissed');
window.addEventListener('scroll',()=>{
  if(!stickyDismissed&&window.scrollY>600){stickyCta?.classList.add('show');}
},{passive:true});
stickyDismiss?.addEventListener('click',()=>{
  stickyCta?.classList.remove('show');
  stickyDismissed=true;
  sessionStorage.setItem('stickyDismissed','1');
});

/* ─── Stats counter animation ─── */
const statNums=document.querySelectorAll('.stat-num[data-count]');
const statObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      const target=+el.dataset.count;
      const suffix=el.dataset.suffix||'';
      let current=0;
      const step=Math.ceil(target/60);
      const timer=setInterval(()=>{
        current=Math.min(current+step,target);
        el.textContent=current+suffix;
        if(current>=target)clearInterval(timer);
      },20);
      statObs.unobserve(el);
    }
  });
},{threshold:.5});
statNums.forEach(el=>statObs.observe(el));

/* ─── Cost Estimator ─── */
const estData={type:'',complexity:'',design:'',timeline:'',extras:[]};
const ranges={
  website:{simple:'$800 – $2,500',medium:'$2,500 – $5,000',complex:'$5,000 – $10,000',notsure:'$1,000 – $5,000'},
  webapp:{simple:'$3,000 – $6,000',medium:'$6,000 – $14,000',complex:'$14,000 – $30,000',notsure:'$5,000 – $15,000'},
  mobile:{simple:'$5,000 – $10,000',medium:'$10,000 – $20,000',complex:'$20,000 – $40,000',notsure:'$8,000 – $20,000'},
  ai:{simple:'$2,000 – $5,000',medium:'$5,000 – $12,000',complex:'$12,000 – $25,000',notsure:'$3,000 – $12,000'}
};

function estGoStep(from,to){
  const fromEl=document.getElementById('est-step-'+from);
  const toEl=document.getElementById('est-step-'+to);
  if(fromEl)fromEl.classList.remove('active');
  if(toEl)toEl.classList.add('active');
  // Update progress
  for(let i=1;i<=5;i++){
    const dot=document.getElementById('ep'+i);
    if(dot){if(i<to)dot.classList.add('done');else dot.classList.remove('done');}
  }
}

document.querySelectorAll('.est-opt:not(.est-opt-check)').forEach(opt=>{
  opt.addEventListener('click',()=>{
    const step=opt.closest('.est-step');
    step?.querySelectorAll('.est-opt').forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
    const key=opt.closest('#est-step-1')?'type':opt.closest('#est-step-2')?'complexity':opt.closest('#est-step-3')?'design':'timeline';
    estData[key]=opt.dataset.val;
  });
});
document.querySelectorAll('.est-opt-check').forEach(opt=>{
  opt.addEventListener('click',()=>{
    opt.classList.toggle('selected');
    const val=opt.dataset.val;
    const idx=estData.extras.indexOf(val);
    if(idx>-1)estData.extras.splice(idx,1);else estData.extras.push(val);
  });
});
document.querySelectorAll('.est-btn-next[data-next]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const from=btn.closest('.est-step')?.id.replace('est-step-','');
    estGoStep(from,btn.dataset.next);
  });
});
document.querySelectorAll('.est-btn-back[data-back]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const from=btn.closest('.est-step')?.id.replace('est-step-','');
    estGoStep(from,btn.dataset.back);
  });
});
document.getElementById('showEstResult')?.addEventListener('click',()=>{
  const t=estData.type||'webapp';
  const c=estData.complexity||'medium';
  const range=ranges[t]?.[c]||'$3,000 – $12,000';
  const rangeEl=document.getElementById('estRange');
  if(rangeEl)rangeEl.textContent=range;
  estGoStep(5,'result');
});

/* ─── Tools tabs ─── */
document.querySelectorAll('.tool-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tool-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tool-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    const panel=document.getElementById('tool-'+tab.dataset.tool);
    if(panel)panel.classList.add('active');
  });
});

/* ─── ROI Calculator ─── */
function calcROI(){
  const h=+document.getElementById('rs1')?.value||20;
  const r=+document.getElementById('rs2')?.value||35;
  const p=+document.getElementById('rs3')?.value||60;
  const m=+document.getElementById('rs4')?.value||3;
  document.getElementById('rv1').textContent=h;
  document.getElementById('rv2').textContent='$'+r;
  document.getElementById('rv3').textContent=p+'%';
  document.getElementById('rv4').textContent=m;
  const annual=Math.round(h*(p/100)*52*r*m);
  document.getElementById('roiSaving').textContent='$'+annual.toLocaleString();
}
['rs1','rs2','rs3','rs4'].forEach(id=>{
  document.getElementById(id)?.addEventListener('input',calcROI);
});
calcROI();

/* ─── Stack quiz ─── */
document.querySelectorAll('.stack-opt').forEach(opt=>{
  opt.addEventListener('click',()=>{
    document.querySelectorAll('.stack-opt').forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
    const result=document.getElementById('stackResult');
    const val=document.getElementById('stackVal');
    if(val)val.textContent=opt.dataset.stack;
    if(result)result.style.display='block';
  });
});

/* ─── Case study tabs ─── */
document.querySelectorAll('.testi-case-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.testi-case-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.testi-case-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    const panel=document.getElementById('case-'+tab.dataset.case);
    if(panel)panel.classList.add('active');
  });
});

/* ─── Real Results play buttons (replaces onclick="toggleRvid(this)") ─── */
document.querySelectorAll('.rwork-play-overlay').forEach(el=>{
  el.addEventListener('click',()=>toggleRvid(el));
});

/* ─── Custom select — trigger + list items (replaces all onclick attrs) ─── */
document.querySelectorAll('.cselect-trigger').forEach(trigger=>{
  trigger.addEventListener('click',()=>{
    const cselect=trigger.closest('.cselect');
    if(cselect) toggleCselect(cselect.id);
  });
});
document.querySelectorAll('.cselect-list li').forEach(li=>{
  li.addEventListener('click',()=>{
    const cselect=li.closest('.cselect');
    if(cselect) pickCselect(cselect.id, li.textContent.trim());
  });
});

/* ─── "Get in Touch" CTA button (replaces onclick="openContactForm()") ─── */
document.getElementById('ctaOpenFormBtn')?.addEventListener('click', openContactForm);

/* ─── Thank You modal close buttons (replaces onclick="closeThankYou()") ─── */
document.getElementById('tyCloseX')?.addEventListener('click', closeThankYou);
document.getElementById('tyCloseBottom')?.addEventListener('click', closeThankYou);

/* ─── Chatbot ─── */
(function(){
  const wrap = document.getElementById('mms-bot-wrap');
  const panel = document.getElementById('mms-panel');
  const btn = document.getElementById('mms-bot-btn');
  const msgs = document.getElementById('mms-messages');
  const chips = document.getElementById('mms-chips');
  const input = document.getElementById('mms-input');
  const sendBtn = document.getElementById('mms-send');
  const dragHandle = document.getElementById('mms-drag-handle');
  if(!wrap||!btn) return;

  const KB = [
    {k:['hello','hi','hey','start','help'],a:"Hi there! I'm the MyMind Studio assistant. Ask me anything about our services, pricing, timelines, or how we work. What can I help you with?"},
    {k:['service','what do you do','offer','build','make'],a:"We offer 6 core services:\n\n• <b>Web Development</b> — custom websites you fully own\n• <b>Mobile App Development</b> — iOS & Android (React Native / Swift / Kotlin)\n• <b>AI Integration</b> — chatbots, automation, GPT-powered features\n• <b>E-Commerce</b> — custom storefronts with seamless checkout\n• <b>UI/UX Design</b> — pixel-perfect, conversion-focused design\n• <b>Business Automation</b> — save your team 20+ hours/week\n\nWant details on any of these?"},
    {k:['web','website','webpage'],a:"We build beautiful, fast, fully custom websites — you own every line of code. No Wix, no Webflow lock-in. Websites typically launch in <b>2–4 weeks</b>. Pricing is quoted based on your scope after a free consultation."},
    {k:['mobile','app','ios','android','react native'],a:"We build native-quality iOS & Android apps using React Native, Swift, or Kotlin — tailored to your users. Custom apps typically take <b>6–16 weeks</b> depending on complexity, all agreed upfront before we start."},
    {k:['ai','artificial intelligence','chatbot','automation','gpt','machine learning'],a:"We embed intelligence into products — chatbots, recommendation engines, automation pipelines, and GPT-powered features. If you want to stop doing repetitive tasks manually, we can automate workflows and integrate your systems too."},
    {k:['ecommerce','e-commerce','shop','store','shopify'],a:"We build high-performance e-commerce platforms with seamless checkout, inventory management, and analytics — custom, not a template. Works with Shopify, custom builds, or whatever fits your needs."},
    {k:['price','pricing','cost','how much','rate','charge','fee'],a:"We have two plans:\n\n<b>Fixed Bid</b> — Custom quote scoped to your exact project. Phased milestone payments, no hidden extras.\n\n<b>Dedicated Team</b> — From <b>$4,000/month</b>. Hire 1–5+ dedicated experts. Monthly or yearly contracts, scale up/down anytime.\n\nBoth plans include 100% code ownership. Not sure which fits? Book a free consultation and we'll recommend the right model."},
    {k:['fixed bid','fixed price','project based'],a:"The Fixed Bid plan is ideal if you have a specific project with a clear scope. We agree on the roadmap, timeline, and cost <b>before</b> any work starts. Payments are milestone-based — you only pay when a phase is delivered and you're happy. Includes 30 days free post-launch support."},
    {k:['dedicated team','monthly','ongoing'],a:"The Dedicated Team plan starts from <b>$4,000/month</b>. Our team works as an extension of yours — using your tools and processes. Monthly or yearly contracts, transparent communication, and you can scale the team up or down anytime. No long-term lock-in."},
    {k:['timeline','how long','time','weeks','duration'],a:"Timelines are always agreed upfront:\n\n• <b>Websites:</b> 2–4 weeks\n• <b>Custom apps:</b> 6–16 weeks (depends on complexity)\n\nYou'll always know exactly when your product ships — it's in the roadmap before we start."},
    {k:['consultation','free call','discovery','book','meeting'],a:"The free consultation is a <b>30-minute call</b> — no sales pitch, just listening. You share your vision, what you've tried, what's not working. Within 24 hours we send a complete roadmap: what we'll build, the tech, timeline, and exact cost. Zero obligation to proceed."},
    {k:['process','how does it work','steps','workflow'],a:"Our process:\n\n1. <b>Free consultation</b> — we listen, no pitch\n2. <b>Roadmap sent in 24h</b> — full scope, timeline, cost\n3. <b>Build in milestones</b> — you review and approve each phase\n4. <b>Launch + support</b> — deployment, SEO setup, first users\n\nYou own the code from the very first milestone."},
    {k:['own','ownership','code','source','mine'],a:"100% yours — always. You receive the full source code, complete documentation, and can host it anywhere. No platform lock-in, no ongoing fees to keep your product alive."},
    {k:['different','wix','webflow','bubble','platform','compare'],a:"Those platforms are built to keep you subscribed — their incentive is retention, not your success. We build custom solutions you <b>fully own</b>. No monthly platform fee, no \"almost works,\" no lock-in."},
    {k:['guarantee','refund','money back','happy','satisfied'],a:"We build in milestone sign-offs throughout every project — you review and approve each phase before we move to the next. We also offer an <b>on-time delivery guarantee or your money back</b>."},
    {k:['payment','pay','invoice','deposit','milestone'],a:"For Fixed Bid projects, payments are <b>milestone-based</b> — you only pay when a phase is delivered and you're happy. For Dedicated Team, it's a predictable monthly or yearly fee. No surprises."},
    {k:['disappear','trust','reliable','legit','scam'],a:"We use phased milestone payments — you only pay when a phase is delivered. Plus, you own 100% of the code from the very first milestone. Your product never depends on us."},
    {k:['timezone','country','usa','uk','australia','canada','india','location','where','offshore'],a:"Most of our clients are in the <b>USA, UK, Australia, and Canada</b>. We have offices in California, Florida, India, and China. We're available during your business hours — timezone has never been an issue."},
    {k:['not sure','unclear','idea','no plan','help me figure'],a:"That's exactly what the free consultation is for! Many of our best clients come with just an idea and no technical clarity. We'll help you scope it, refine it, and create a clear plan."},
    {k:['technology','tech','stack','react','next','vue','typescript','python','node'],a:"Our stack covers:\n\n<b>Web:</b> React, Next.js, Vue.js, TypeScript, Tailwind, Shopify, WordPress\n<b>Mobile:</b> React Native, Swift, Kotlin, Flutter\n<b>AI/Automation:</b> Python, OpenAI, LangChain, TensorFlow\n<b>Backend:</b> Node.js, Django, PostgreSQL, Firebase, AWS"},
    {k:['support','maintenance','after','post launch','bug'],a:"All projects include <b>30 days free post-launch support</b>. We also help with deployment, hosting setup, SEO foundations, and getting your first users."},
    {k:['contact','email','reach','talk','speak'],a:"Reach us at <b>hello@mymindstudio.ai</b> — we respond within 24 hours. Or book a free consultation directly on this page."},
    {k:['response','reply','fast','quick','when'],a:"We respond to all inquiries within <b>24 hours</b>, available during your business hours regardless of timezone."},
    {k:['go to market','marketing','launch','seo','first users'],a:"We don't just hand over files. We help with deployment, hosting setup, SEO foundations, initial marketing strategy, and getting your first users."},
  ];
  const QUICK = [
    {label:'Services',q:'What services do you offer?'},
    {label:'Pricing',q:'What does it cost?'},
    {label:'Timeline',q:'How long does it take?'},
    {label:'Free call',q:'What happens in the free consultation?'},
    {label:'Own the code?',q:'Do I own the code?'},
    {label:'Contact',q:'How do I contact you?'},
  ];
  function getTime(){return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
  function addMsg(text,who,showTime){
    var m=document.createElement('div');m.className='mms-msg '+who;
    var b=document.createElement('div');b.className='mms-bubble';b.innerHTML=text.replace(/\n/g,'<br>');
    m.appendChild(b);
    if(showTime){var t=document.createElement('div');t.className='mms-time';t.textContent=getTime();m.appendChild(t);}
    msgs.appendChild(m);msgs.scrollTop=msgs.scrollHeight;return m;
  }
  function showTyping(){
    var m=document.createElement('div');m.className='mms-msg bot mms-typing';
    m.innerHTML='<div class="mms-bubble"><div class="mms-dot"></div><div class="mms-dot"></div><div class="mms-dot"></div></div>';
    msgs.appendChild(m);msgs.scrollTop=msgs.scrollHeight;return m;
  }
  function renderChips(list){
    chips.innerHTML='';
    list.forEach(function(c){
      var el=document.createElement('button');el.className='mms-chip';el.textContent=c.label;
      el.addEventListener('click',function(){handleQuery(c.q);});chips.appendChild(el);
    });
  }
  function findAnswer(text){
    var q=text.toLowerCase();
    for(var i=0;i<KB.length;i++){if(KB[i].k.some(function(k){return q.includes(k);})){return KB[i].a;}}
    return "I'm not sure about that, but feel free to reach out at <b>hello@mymindstudio.ai</b> — we reply within 24 hours.";
  }
  var isTyping=false;
  function handleQuery(text){
    if(isTyping||!text.trim())return;
    addMsg(text,'user',false);input.value='';chips.innerHTML='';isTyping=true;
    var t=showTyping();
    setTimeout(function(){t.remove();addMsg(findAnswer(text),'bot',true);isTyping=false;renderChips(QUICK.slice(0,4));msgs.scrollTop=msgs.scrollHeight;},700+Math.random()*400);
  }
  var isOpen=false;
  function openChat(){
    isOpen=true;wrap.classList.add('open');panel.style.display='flex';
    if(!msgs.children.length){addMsg("Hi! I'm the MyMind Studio assistant. How can I help you today?",'bot',true);renderChips(QUICK);}
    setTimeout(function(){input.focus();},50);
  }
  function closeChat(){isOpen=false;wrap.classList.remove('open');panel.style.display='none';}
  // Drag the whole button — click if moved <8px, drag if more
  var dragging=false,didDrag=false,startX,startY;
  btn.addEventListener('mousedown',startDrag);
  btn.addEventListener('touchstart',startDrag,{passive:true});
  function startDrag(e){
    didDrag=false;var p=e.touches?e.touches[0]:e;
    startX=p.clientX;startY=p.clientY;
    wrap.style.transition='none';
    document.addEventListener('mousemove',onDrag);
    document.addEventListener('touchmove',onDrag,{passive:false});
    document.addEventListener('mouseup',stopDrag);
    document.addEventListener('touchend',stopDrag);
  }
  function onDrag(e){
    var p=e.touches?e.touches[0]:e;
    var dx=p.clientX-startX,dy=p.clientY-startY;
    if(!didDrag&&Math.sqrt(dx*dx+dy*dy)<8)return;
    if(e.cancelable)e.preventDefault();
    didDrag=true;
    var mid=window.innerWidth/2;
    if(p.clientX<mid){wrap.style.left='24px';wrap.style.right='auto';wrap.classList.add('left-side');}
    else{wrap.style.right='24px';wrap.style.left='auto';wrap.classList.remove('left-side');}
  }
  function stopDrag(e){
    wrap.style.transition='';
    document.removeEventListener('mousemove',onDrag);
    document.removeEventListener('touchmove',onDrag);
    document.removeEventListener('mouseup',stopDrag);
    document.removeEventListener('touchend',stopDrag);
    if(!didDrag){isOpen?closeChat():openChat();}
  }
  sendBtn.addEventListener('click',function(){handleQuery(input.value);});
  input.addEventListener('keydown',function(e){if(e.key==='Enter')handleQuery(input.value);});
})();
