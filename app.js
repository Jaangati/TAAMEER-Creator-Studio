import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.81.1';
const sb=createClient('https://hylcxekemqttsyfnsiov.supabase.co','sb_publishable_LW0kaE_sYUQnDpyktCE0qQ_5dQW-TDY');
const api='https://hylcxekemqttsyfnsiov.supabase.co/functions/v1/creator-studio?api=1';
const root=document.getElementById('app');
const logo='assets/taameer-logo.svg';
const mark='assets/taameer-mark.svg';
let activeModule='brain',chatPanelOpen=true;
const maxIdle=8*60*60*1000;
const initialProjects=[
{slug:'general',name:'Qatar Real Estate',location:'Qatar',facts:['Educational real estate content. Verify all financial claims.']},
{slug:'sama',name:'Sama Residence',location:'Lusail Boulevard South',facts:['TAAMEER residential project in Lusail Boulevard South.']},
{slug:'the-one',name:'The One by TAAMEER',location:'Qetaifan Island North',facts:['TAAMEER residential development on Qetaifan Island North.']},
{slug:'sukoon',name:'Sukoon Tower',location:'Lusail Kharayej',facts:['TAAMEER residential tower in Lusail Kharayej.']},
{slug:'valencia-thani',name:'Valencia Thani Residence',location:'Lusail Boulevard East',facts:['TAAMEER residential development on Lusail Boulevard East.']},
{slug:'canal-bay',name:'Canal Bay Residence',location:'Qetaifan Island North',facts:['TAAMEER residential development on Qetaifan Island North.']},
{slug:'skala',name:'Skala Tower',location:'Lusail Waterfront',facts:['TAAMEER waterfront development in Lusail.']}
];
const hooks=[
'Before buying a property in {location}, ask yourself this question.',
'Most buyers overlook one important detail in {location}.',
'Here are three things to check before considering {project}.',
'Buying for yourself or investing? The answer changes your priorities.',
'The first thing I check when someone asks me about {project}.',
'Your next property choice should start with this — not the price.',
'Let me show you how I compare projects around {location}.',
'One question you should ask before visiting any showroom.',
'What really makes a location worth considering?',
'Would you choose location, layout or payment flexibility?',
'You have 30 seconds? Here is what to know about {project}.',
'Three questions I hear from buyers every week.',
'Not every property is right for every buyer.',
'An insider tip from a property advisor in Qatar.',
'The smartest buyers compare these three things first.',
'Here is a common misconception about buying off-plan.',
'How I would shortlist my first property in Qatar.',
'The difference between a nice viewing and a useful viewing.',
'What can a project model tell you about your future home?',
'My advice before you request a property payment plan.'
];
const formats=['Direct to camera','Walking tour','Showroom model','Location walkthrough','Buyer Q&A','Myth vs fact','Three-point checklist','Behind the scenes'];
let state={token:null,admin:null,mode:null,last:0,projects:initialProjects,project:'general',modeTag:'Ideas',messages:[],threads:[],threadId:null,saved:[],plans:[],drawer:null,loading:false};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const $=id=>document.getElementById(id);
const toText=x=>String(x||'').trim();
const now=()=>Date.now();
function storage(){try{return JSON.parse(localStorage.getItem('taameer-studio-v3')||'{}')}catch{return {}}}
function saveState(){try{localStorage.setItem('taameer-studio-v3',JSON.stringify({token:state.token,last:state.last,project:state.project,threads:state.threads.slice(0,40),threadId:state.threadId,modeTag:state.modeTag}))}catch{}}
function logout(){state.token=null;state.admin=null;state.mode=null;state.messages=[];state.threadId=null;state.drawer=null;saveState();sb.auth.signOut().catch(()=>{});render()}
function touch(){if(!state.mode)return;if(now()-state.last>maxIdle){logout();return}if(now()-state.last>30000){state.last=now();saveState()}}
function timedOut(){return !state.last||now()-state.last>maxIdle}
setInterval(()=>{if(state.mode&&timedOut())logout()},60000);
window.addEventListener('pointerdown',touch,{passive:true});window.addEventListener('keydown',touch,{passive:true});
async function request(action,rest={}){let res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,token:state.token,...rest})});let data;try{data=await res.json()}catch{throw Error('Network response was invalid')}if(res.status===401){logout();throw Error('Session expired. Please sign in again.')}if(!res.ok)throw Error(data.error||'Request failed');return data}
function currentProject(){return state.projects.find(p=>p.slug===state.project)||state.projects[0]}
function detectProject(query){const q=query.toLowerCase();const matches=state.projects.filter(p=>p.slug!=='general').map(p=>({p,score:p.name.toLowerCase().split(' ').filter(w=>w.length>3&&q.includes(w)).length+(q.includes(p.slug.replaceAll('-',' '))?2:0)})).sort((a,b)=>b.score-a.score);return matches[0]?.score>0?matches[0].p:null}
function pickProject(q){const detected=detectProject(q);if(detected){state.project=detected.slug;return detected}return currentProject()}
function facts(p){return(p.facts||[]).map(x=>'• '+x).join('\n')||'Project details are awaiting Marketing approval.'}
function safeFact(p){return (p.facts||[]).find(x=>!/(price|yield|roi|percent|handover)/i.test(x))||p.name+' is a TAAMEER development.'}
function fill(s,p){return s.replaceAll('{project}',p.name).replaceAll('{location}',p.location)}
function chooseHook(p,n=0){return fill(hooks[(n+Math.floor(Math.random()*hooks.length))%hooks.length],p)}
function concept(p,n){return {hook:chooseHook(p,n*3),format:formats[n%formats.length],project:p.name,location:p.location,duration:30}}
function script(p,short=false){const h=chooseHook(p,state.messages.length);return 'VIDEO CONCEPT · '+p.name+'\n\nHOOK (0–5 SEC)\n“'+h+'”\n\n'+(short?'MAIN MESSAGE (5–20 SEC)':'SCENE 1 (5–12 SEC) · TALK TO CAMERA')+'\n'+safeFact(p)+'\n\n'+(short?'CLOSING (20–30 SEC)':'SCENE 2 (12–23 SEC) · SHOW THE PROJECT OR LOCATION')+'\nTalk about how you help clients compare location, lifestyle and buying goals. Show only approved visuals.\n\nCALL TO ACTION\n“Tell me what matters most to you in a property, and I will help you explore the options.”\n\nFILMING NOTES\nRecord vertically on your phone. Use natural lighting, a quiet setting, and short clips. Do not mention unverified prices, availability or investment returns.'}
function shoot(){return 'SIMPLE MOBILE FILMING PLAN\n\n1. Start with your best sentence. Look directly into your phone camera.\n2. Film a 5–7 second clip of yourself explaining a buyer question.\n3. Film two supporting shots of approved project visuals, the showroom model or the area.\n4. Explain a specific, verified benefit without overpromising.\n5. End with one clear question inviting a response.\n\nEDITING\nUse vertical 9:16, captions, quick cuts and natural audio. A phone is enough — useful information matters more than fancy transitions.'}
function review(input){const checks=[];if(/guaranteed?|risk.free|highest return|best investment|\d+\s*%\s*(roi|return)/i.test(input))checks.push('Potentially unsupported investment or superlative claim — remove or verify with Marketing.');if(/price|qar|installment|handover|ready to move|sqm|amenit|pool|gym/i.test(input))checks.push('Check project facts, availability, pricing and amenities against current approvals.');if(input.length<80)checks.push('Your script needs a clear useful takeaway and a call to action.');if(!/[?]/.test(input))checks.push('Consider ending with a buyer-focused question to increase interaction.');return 'SCRIPT REVIEW\n\n'+(checks.length?checks.map((c,i)=>(i+1)+'. '+c).join('\n'):'No obvious rule-based red flags detected. Human Marketing approval is still required.')+'\n\nSTRONGER STRUCTURE\nHook → one buyer insight → approved project detail → simple CTA.\n\nNote: this is a rules-based review, not full language-model analysis.'}
function answer(q){
 const t=q.toLowerCase().trim();const p=pickProject(q);
 const prev=state.messages.slice(0,-1).filter(m=>!m.me).at(-1);
 const previousText=prev?.body||'';
 const previousUser=state.messages.slice(0,-1).filter(m=>m.me).at(-1)?.body||'';
 const contextProject=detectProject(previousUser)||p;
 const requestedCount=Number(t.match(/\b([2-9]|10)\s+(?:ideas?|hooks?|options?|concepts?)\b/)?.[1]||0);
 const greeting=/^(hi|hello|hey|good morning|good evening|مرحبا|هلا|السلام عليكم)[! .]*$/i.test(t);
 const acknowledgement=/^(thanks|thank you|perfect|great|okay|ok|nice|شكرا|تمام)[! .]*$/i.test(t);
 const reviewRequest=/review|check my|critique|feedback|improve my script|rate my/i.test(t);
 const shorter=/shorter|shorten|too long|concise|less words|15[ -]?sec|اختصر/i.test(t);
 const longer=/longer|expand|more detail|more detailed|60[ -]?sec/i.test(t);
 const rewrite=/rewrite|rephrase|another version|different version|change the hook|stronger hook|catchier|more catchy|more sales|more engaging|less formal|more natural|more emotional|negative hook|more human|sound human|more conversational|make it better/i.test(t);
 const follow=/^(more|another|again|one more|different|option\s*[2-9]|number\s*[2-9]|the second|the third|that one|this one|do it|yes|go ahead)[.! ]*$/i.test(t);
 const chosen=Number(t.match(/(?:option|number|idea)\s*([1-9])/)?.[1]||(t==='the second'?'2':t==='the third'?'3':'0'));
 let body='',type='general';
 const smooth=(s)=>s.replace(/\bVIDEO CONCEPT\b/g,'Your reel').replace(/\bFRESH REEL IDEAS\b/g,'Ideas you can film');
 if(chosen&&/turn|make|write|develop|expand|script|film/i.test(t)&&/idea|option|number/i.test(t)){
  type='script';
  const selected=previousText.split('\n').find(line=>new RegExp('^\\s*'+chosen+'\\.').test(line));
  const hook=selected?.replace(/^\s*\d+\.\s*/,'')||chooseHook(contextProject,chosen);
  body='Absolutely — let’s develop option '+chosen+' into a reel.\n\nHOOK (0–5 SECONDS)\n'+hook+'\n\nMAIN POINT (5–22 SECONDS)\n'+safeFact(contextProject)+' Explain why this matters to the buyer.\n\nCLOSING\n“What matters most to you? Message me and let’s explore the options.”\n\nFILM IT\nStart talking to camera, show the project model or approved location footage, and finish looking at the camera.\n\nWant a bolder opening or a shorter version?';
 }else if(greeting){body='Hey! What are we creating today? Tell me the project, your audience, or just where you are filming and I’ll suggest something practical.';type='chat'}
 else if(acknowledgement){body='Glad that works. Want to turn it into a short filming script, explore another angle, or get a shot-by-shot plan?';type='chat'}
 else if(/^(what can you do|help|how does this work|who are you)/i.test(t)){body='I’m your TAAMEER content coach. I can help you think of useful real estate reels, structure scripts, improve hooks, review drafts, plan simple phone shoots, and check approved project facts.\n\nYou can also tell me “make it shorter,” “try another angle,” or “turn idea 2 into a script.” I’ll follow our conversation. I use TAAMEER’s prepared content rules and project information, so I won’t make up facts I don’t have.';type='chat'}
 else if(/\b(available|how much|price|payment|roi|handover|yield|discount|units left)\b/i.test(t)&&!/(script|reel|idea|hook|caption|write)/i.test(t)){body='I can help you explain '+p.name+' accurately, but I don’t have live availability, pricing or payment-plan confirmation here. Please check the latest Marketing/Sales approvals first.\n\nWould you like a video idea that highlights its verified location or explains the questions buyers should ask?';type='facts'}
 else if((shorter||longer||rewrite||follow)&&previousText){
   type='revision';
   if(chosen&&/(\d+\.)/.test(previousText)){
     const lines=previousText.split('\n').filter(x=>new RegExp('^\\s*'+chosen+'\\.').test(x));
     body='Good choice. Let’s develop option '+chosen+'.\n\n'+(lines[0]||'We can build a focused buyer-friendly reel around that idea.')+'\n\n'+script(contextProject,true)+'\n\nWould you like a sharper opening or a simpler phone filming plan?';
   }else if(shorter){
     body='Sure — here’s a tighter version you can say naturally:\n\n'+(previousText.match(/[“"][^”"]+[”"]/)?.[0]||chooseHook(contextProject,8))+'\n\n'+safeFact(contextProject)+'\n\n“Message me with what you are looking for and I’ll help you explore the options.”\n\nKeep it to about 20–30 seconds, and use only verified details.';
   }else if(longer){
     body='Absolutely. Let’s add substance rather than just more words.\n\n'+script(contextProject)+'\n\nThe key is to explain *why* that information matters to a real buyer.';
   }else if(rewrite){
     const angle=/negative|provocative|stronger|catchy/i.test(t)?'a stronger, curiosity-led opening':/natural|formal/i.test(t)?'a natural, conversational delivery':'a fresh buyer-first angle';
     body='Let’s try '+angle+'.\n\nHOOK\n'+chooseHook(contextProject,state.messages.length+7)+'\n\nMAIN POINT\n'+safeFact(contextProject)+' Explain how this relates to what your buyer is looking for.\n\nCTA\n“What matters most in your property search? Tell me and we’ll explore the options together.”\n\nWant a second version aimed specifically at investors or end users?';
   }else{
     body='Here’s another direction for '+contextProject.name+':\n\n'+chooseHook(contextProject,state.messages.length+11)+'\n\nYou can make this a 25–30 second direct-to-camera reel. Explain one practical buyer consideration, show the project model or approved visuals, and finish with a question.\n\nShould I write the complete script?';
   }
 }else if(reviewRequest){
   if(t.length<70&&!/\n/.test(q)){body='Of course. Paste your script here and I’ll check the hook, flow, clarity, CTA, and risky property claims. I’ll suggest specific improvements, not just give it a score.';type='chat'}
   else{body='Let’s make this stronger. Here are the first improvements I’d consider:\n\n'+review(q)+'\n\nIf you tell me who the video is targeting, I can tailor the structure further.';type='review'}
 }else if(/arabic|عربي|بالعربي|باللهجة/i.test(t)){body='أكيد. خلّينا نخلي الكلام طبيعي وقريب من العميل.\n\nالهوك: قبل ما تختار عقارك، اسأل نفسك: بتشتري للسكن ولا للاستثمار؟\n\nالفكرة: أهم شيء نعرف احتياجاتك أول، وبعدها نقارن الموقع والتفاصيل المعتمدة للمشروع.\n\nالخاتمة: اكتب لي شنو تدور عليه، ونساعدك تستكشف الخيارات المناسبة.\n\nتحبّه بأسلوب خليجي أقوى أو رسمي؟';type='arabic'}
 else if(/film|shoot|edit|camera|capcut|record|transition/i.test(t)){body='You don’t need a production crew for this. Here’s a practical way to shoot it:\n\n'+shoot()+'\n\nAre you filming at the showroom, on-site, or at home? I can simplify the shot list for your location.';type='shoot'}
 else if(/fact|amenit|where|location|know about|information|details|project knowledge/i.test(t)){body='Here’s what I have approved for '+p.name+':\n\nLocation: '+p.location+'\n'+facts(p)+'\n\nI don’t want to invent amenities, prices or availability. If those details haven’t been approved, check with Marketing before adding them to your script.\n\nWant me to turn these facts into a useful reel?';type='facts'}
 else if(/caption|post copy|instagram copy/i.test(t)){body='Here’s a caption you can adapt:\n\nFinding the right property starts with understanding what matters to you.\n\nExplore '+p.name+' in '+p.location+' and compare the options with your own needs in mind.\n\nTell me your priorities and I’ll help you explore.\n\n#TAAMEER #QatarRealEstate\n\nWant something more direct, more luxurious, or in Arabic?';type='caption'}
 else if(/hook|ideas|concept|inspiration|topics|content plan/i.test(t)){
   const count=Math.min(10,requestedCount||4);type='ideas';
   body='Here are '+count+' directions I’d try for '+p.name+'. Each gives your audience a reason to keep watching:\n\n'+Array.from({length:count},(_,i)=>{const x=concept(p,i+state.messages.length);return(i+1)+'. '+x.hook+'\n   Shoot it as: '+x.format}).join('\n\n')+'\n\nWhich one feels closest to your style? Say “turn idea 2 into a script” or ask for a different angle.';
 }else if(/script|reel|video|write|create/i.test(t)){type='script';body='Here’s a version you can film without complicated editing.\n\n'+smooth(script(p))+'\n\nWant me to make it punchier, shorter, or more conversational?'}
 else if(/\b(investor|investment|family|first.time buyer|luxury|buyer)\b/i.test(t)){
   type='ideas';body='That’s a useful audience to focus on. For '+p.name+', I’d lead with a real buyer question:\n\n'+chooseHook(p,6)+'\n\nA good reel should help that audience compare what matters without promising returns or inventing project facts.\n\nShall I write a 30-second script for this audience?';
 }else{
   body='I can work with that. To make it useful instead of generic, tell me one thing: are you trying to educate buyers, introduce a TAAMEER project, or get people to message you?\n\nOr just say “surprise me with a reel idea” and I’ll suggest a direction.';type='chat'
 }
 return {type,body,project:p.name,created:now()}
}
function isLogged(){return state.mode==='sales'||state.mode==='admin'}
function entryView(){root.innerHTML='<main class="login-bg"><div class="login-card"><section class="login-left"><img src="'+logo+'" alt="TAAMEER"><div class="pitch"><h1>Building<br>Success,<br>Together.</h1><p>The people behind TAAMEER’s growth — creating stories worth sharing.</p></div><footer>© 2026 TAAMEER Group Marketing Department. All rights reserved.</footer></section><section class="login-right"><h2>Welcome back</h2><div class="sub">Sign in to your TAAMEER Agents Studio.</div><label for="salespass">Team access password</label><input id="salespass" type="password" placeholder="Enter your team password" autocomplete="off"><button class="primary" id="sales-login">Sign in</button><div id="login-error" class="notice hide"></div><details><summary>Marketing administration access</summary><label for="admin-user">Marketing account</label><input id="admin-user" type="text" autocomplete="username" placeholder="Account identifier"><label for="admin-pass">Password</label><input id="admin-pass" type="password" autocomplete="current-password"><button class="secondary" id="admin-login" style="width:100%;margin-top:14px">Access administration</button></details><p style="font-size:11px;color:#a4a9b0;margin-top:27px;line-height:1.7">Need access? Contact the TAAMEER Marketing Department.</p></section></div></main>'; $('sales-login').onclick=loginSales;$('salespass').onkeydown=e=>{if(e.key==='Enter')loginSales()};$('admin-login').onclick=loginAdmin;}
async function loginSales(){const b=$('sales-login');const pass=$('salespass').value;b.disabled=true;try{const res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'login',password:pass})});const d=await res.json();if(!res.ok)throw Error(d.error||'Invalid password');state.token=d.token;state.mode='sales';state.last=now();state.project='general';state.messages=[];state.threads=storage().threads||[];newThread(false);saveState();await loadData();render()}catch(e){$('login-error').textContent='Could not sign in. Check the password and try again.';$('login-error').classList.remove('hide');b.disabled=false}}
async function loginAdmin(){const b=$('admin-login');b.disabled=true;const u=$('admin-user').value,p=$('admin-pass').value;try{const r=await sb.auth.signInWithPassword({email:u,password:p});if(r.error)throw Error('Not allowed');const role=await sb.from('profiles').select('role').eq('id',r.data.user.id).maybeSingle();if(role.data?.role!=='admin')throw Error('Not allowed');state.mode='admin';state.admin=r.data.user.id;state.last=now();state.threads=[];newThread(false);saveState();await loadData();render()}catch(e){$('login-error').textContent='Marketing sign-in failed. Contact your administrator.';$('login-error').classList.remove('hide');b.disabled=false}}
function newThread(draw=true){
  activeModule='brain';
  if(state.messages.length)persistThread();
  state.threadId=crypto.randomUUID();state.messages=[];state.project='general';
  state.threads.unshift({id:state.threadId,title:'New chat',customTitle:false,messages:[],project:'general',updatedAt:now()});
  state.threads=state.threads.slice(0,40);saveState();if(draw)render()
}
function persistThread(){
  const t=state.threads.find(x=>x.id===state.threadId);
  if(t){t.messages=state.messages.slice(-75);t.project=state.project;t.updatedAt=now();
    if(!t.customTitle)t.title=(state.messages.find(x=>x.me)?.body||'New chat').replace(/\s+/g,' ').slice(0,48);
  }
  state.threads.sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));state.threads=state.threads.slice(0,40);saveState()
}
function selectThread(id){
  activeModule='brain';
  const t=state.threads.find(x=>x.id===id);if(!t)return;
  state.threadId=id;state.messages=Array.isArray(t.messages)?t.messages:[];state.project=t.project||'general';state.drawer=null;
  saveState();render()
}
function renameThread(id){
  const t=state.threads.find(x=>x.id===id);if(!t)return;
  const next=window.prompt('Rename conversation',t.title);
  if(next===null)return;const name=next.trim().slice(0,70);if(!name)return;
  t.title=name;t.customTitle=true;saveState();render()
}
function deleteThread(id){
  const t=state.threads.find(x=>x.id===id);if(!t||!window.confirm('Delete this conversation from this browser?'))return;
  state.threads=state.threads.filter(x=>x.id!==id);
  if(state.threadId===id){const next=state.threads[0];if(next){state.threadId=next.id;state.messages=next.messages||[];state.project=next.project||'general'}else newThread(false)}
  saveState();render()
}
async function loadData(){if(state.mode==='sales'){const d=await Promise.all([request('list'),request('projects')]);state.saved=d[0].ideas||[];state.plans=d[0].plans||[];if(d[1].projects?.length)state.projects=d[1].projects}else if(state.mode==='admin'){const r=await sb.from('projects').select('slug,name,location,facts,approved').eq('approved',true);if(r.data?.length)state.projects=r.data}}
function icon(name){const icons={chat:'<path d="M4 5h16v12H8l-4 3z"/>',plus:'<path d="M12 5v14M5 12h14"/>',save:'<path d="M5 3h14l2 2v16H3V3z"/><path d="M7 3v7h10V3M7 21v-8h10v8"/>',logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',arrow:'<path d="M12 19V5m-7 7 7-7 7 7"/>',history:'<path d="M3 12a9 9 0 1 0 3-7M3 3v6h6M12 7v5l4 3"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>'};return'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(icons[name]||icons.chat)+'</svg>'}
function shell(){
 const recent=state.threads.filter(t=>t.messages?.length).slice(0,40).map(t=>
 '<div class="thread-row '+(state.threadId===t.id?'selected':'')+'"><button class="thread-select" data-thread="'+esc(t.id)+'" title="'+esc(t.title)+'">'+esc(t.title)+'</button><button class="thread-more" data-thread-menu="'+esc(t.id)+'" aria-label="Chat options">···</button></div>'
 ).join('');
 const item=(name,label,iconName)=>'<button class="module-link '+(activeModule===name?'active':'')+'" data-module="'+name+'">'+icon(iconName)+'<span>'+label+'</span></button>';
 const left='<aside class="global-side"><div class="global-header"><div class="global-logo"><img src="'+logo+'" alt="TAAMEER"></div><div class="global-subtitle">AGENTS STUDIO</div></div><div class="module-title">WORKSPACE</div><nav class="module-nav">'+item('brain','Creator Brain','chat')+item('toolkit','Content Tools','plus')+item('projects','Project Library','save')+'</nav><div class="module-spacer"></div><div class="global-bottom"><div class="global-caption">Designed for TAAMEER sales professionals.</div><div class="global-copyright">© 2026 TAAMEER Group Marketing Department.<br>All rights reserved.</div></div></aside>';
 const right='<aside class="chat-side" id="chat-side"><div class="chat-side-head"><div><div class="module-title" style="margin:0">CREATOR BRAIN</div><strong>Your conversations</strong></div><button class="icon-btn" data-action="toggle-right" aria-label="Close conversations">×</button></div><div class="chat-side-actions"><button class="new-chat" data-action="new">'+icon('plus')+' New chat</button></div><div class="chat-side-heading">RECENT CHATS <span>On this browser</span></div><div class="chat-side-list">'+(recent||'<p class="no-chats">Your chats will appear here after your first message.</p>')+'</div><div class="chat-side-bottom"><button class="side-action" data-action="saved">'+icon('save')+' Saved drafts</button><div class="right-caption">Private to this browser · Saved locally</div></div></aside>';
 root.innerHTML='<div class="app agents-layout '+(window.innerWidth<850?'right-closed':'')+' '+(chatPanelOpen?'':'right-closed')+'">'+left+'<section class="stage"><header class="topbar"><div class="topbrand"><img class="header-icon" src="'+mark+'" alt=""><span>'+({brain:'Creator Brain',toolkit:'Content Tools',projects:'Project Library'}[activeModule]||'Creator Brain')+'</span><span class="quiet-label">by TAAMEER</span></div><div class="topright"><button class="secondary right-toggle" data-action="toggle-right">'+icon('history')+' <span>Chats</span></button><button class="secondary" data-action="logout">Sign out</button></div></header><div class="chat-scroll" id="scroll"><div class="chat-inner" id="messages"></div></div><div class="composer-area" id="composer-area"><div class="tagstrip" id="tags"></div><div class="compose"><textarea id="message-input" rows="2" placeholder="Ask anything about your next reel..."></textarea><div class="compose-row"><span class="compose-hint">Enter to send · Shift+Enter for a new line</span><button class="send" data-action="send" aria-label="Send">'+icon('arrow')+'</button></div></div><div class="note">Verify project claims with TAAMEER Marketing before publication.</div></div><div id="drawer-root"></div></section>'+right+'</div>';
 renderWorkspace();renderDrawer();root.onclick=clickHandler;
 const field=$('message-input');if(field)field.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}};
}
function renderWorkspace(){
 if(activeModule==='brain'){renderMessages();renderTags();$('composer-area')?.classList.remove('hide');return}
 const area=$('messages'),composer=$('composer-area');if(composer)composer.classList.add('hide');
 if(!area)return;
 if(activeModule==='toolkit'){
   area.innerHTML='<section class="module-page"><p class="module-kicker">CONTENT PRODUCTION</p><h1>Your content toolkit</h1><p class="muted">Pick a task and Creator Brain will help you get started. Everything stays in your chat.</p><div class="module-cards">'+[['Write a reel','Write a 30-second property reel script'],['Find content ideas','Give me five reel ideas I can shoot with my phone'],['Review a draft','Help me review my existing reel script'],['Plan a shoot','Give me a filming plan for a simple Instagram reel']].map(([title,prompt])=>'<button class="module-card" data-prompt="'+esc(prompt)+'"><strong>'+esc(title)+'</strong><span>Start with Creator Brain →</span></button>').join('')+'</div></section>';
 }else{
   area.innerHTML='<section class="module-page"><p class="module-kicker">TAAMEER REFERENCE</p><h1>Project Library</h1><p class="muted">Quick reference information for your next reel. Use only Marketing-approved facts.</p><div class="module-cards">'+state.projects.filter(p=>p.slug!=='general').map(p=>'<article class="module-card"><strong>'+esc(p.name)+'</strong><p>'+esc(p.location||'Qatar')+'</p><button class="module-mini" data-ask-project="'+esc(p.slug)+'">Ask Creator Brain →</button></article>').join('')+'</div></section>';
 }
}
function safeSource(url){try{const u=new URL(url);return u.protocol==="https:"&&/^(?:[\w-]+\.)*(?:gov\.qa|lusail\.com|qetaifanprojects\.com|udcqatar\.com|thepeninsulaqatar\.com)$/.test(u.hostname)?u.href:""}catch{return ""}}
function fmt(s){return esc(s).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>')}
function extractCreativeOptions(body){
 const text=String(body||'');
 const lines=text.split('\n');
 const opts=[];
 for(const line of lines){
  const m=line.match(/^\s*(\d{1,2})[.)]\s+(.+)$/);
  if(!m)continue;
  const number=Number(m[1]);if(number<1||number>10||!m[2]?.trim())continue;
  if(opts.length && number<=opts[opts.length-1].number)continue;
  if(/^(?:are|is|do|does|can|why|what)\b/i.test(m[2])&&text.length<60)continue;
  opts.push({number,title:m[2].trim().slice(0,190)});
 }
 return opts.length>=2?opts:[];
}
function renderMessages(){
 const target=$('messages');if(!target)return;
 if(!state.messages.length){
 target.innerHTML='<div class="empty"><div class="empty-mark"><img src="'+mark+'" alt="TAAMEER"></div><h1>What shall we film today?</h1><p>Pick a video idea. I'll write the exact script you can say on camera, then help you make it sound like you.</p><div class="suggestions">'+[
 ['Give me reel ideas','Suggest four informative real estate reel ideas for a sales agent'],
 ['Write me a script','Write me a natural spoken 30-second reel script for a Qatar real estate agent'],
 ['I am at the showroom','Suggest four reel ideas I can film in the showroom today']
 ].map(([label,prompt])=>'<button class="suggest" data-prompt="'+esc(prompt)+'"><strong>'+esc(label)+'</strong><span>'+esc(prompt)+'</span></button>').join('')+'</div></div>';return;
 }
 target.innerHTML=state.messages.map((m,i)=>{
 if(m.me)return'<div class="message me"><div class="bubble">'+fmt(m.body)+'</div></div>';
 const sources=(m.sources||[]).map(x=>{const url=safeSource(x.url);return url?'<a class="answer-source" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'"><span class="source-index">['+Number(x.number||1)+']</span> '+esc(x.title)+'</a>':''}).filter(Boolean).join('');
 const reel=m.reel&&!m.pending?'<section class="reel-output"><div class="reel-eyebrow">REEL IDEA</div><h3>'+esc(m.reel.title||'Your reel concept')+'</h3><div class="spoken-section"><div class="spoken-header"><span>'+(m.reel.language==='ar-QA'?'النص اللي تقوله أمام الكاميرا':'EXACT WORDS TO SAY')+'</span><button class="script-copy" data-copy-script="'+i+'">Copy script</button></div><blockquote class="spoken-script" '+(m.reel.language==='ar-QA'?'dir="rtl" lang="ar"':'')+'>'+esc(m.reel.spoken_script||'')+'</blockquote></div><div class="reel-film"><strong>'+(m.reel.language==='ar-QA'?'طريقة التصوير':'SIMPLE FILMING NOTE')+'</strong><p>'+esc(m.reel.film_tip||'')+'</p></div></section>':'';
 const options=!m.pending&&m.creativeOptions?m.creativeOptions:(!m.pending&&/idea|reel|hook|concept|options|directions/i.test(m.body)?extractCreativeOptions(m.body):[]);
 const choices=options.length?'<div class="creative-choices"><div class="choice-heading">Choose a direction to develop</div>'+options.map(opt=>'<button class="choice-button" data-select-option="'+i+':'+opt.number+'"><span class="choice-number">'+opt.number+'</span><span>'+esc(opt.title)+'</span><span class="choice-arrow">→</span></button>').join('')+'</div>':'';
 const develop=m.selectedOption?'<div class="selected-followups"><span>Continue with idea '+Number(m.selectedOption.number)+'</span><button data-follow="Make this selected idea shorter">15-second version</button><button data-follow="Try another stronger hook for this selected idea">Stronger hook</button></div>':'';
 const footer=m.pending?'<span class="thinking-dots">Working on it…</span>':choices+develop+'<div class="answer-actions"><button data-copy="'+i+'">Copy</button><button data-save="'+i+'">Save</button><button data-follow="Make it shorter">Shorter</button><button data-follow="Try another version">Another version</button></div>';
 return'<div class="message"><div class="assistant-symbol"><img src="'+mark+'" alt="TAAMEER"></div><div class="answer">'+(reel||'<div class="answer-text">'+fmt(m.body)+'</div>')+(sources?'<div class="answer-sources"><div class="source-title">Sources · Verified reference library</div>'+sources+'</div>':'')+footer+'</div></div>';
 }).join('');
 const sc=$('scroll');sc.scrollTop=sc.scrollHeight;
}
function renderTags(){
 const t=$('tags');if(!t)return;const p=currentProject();
 t.innerHTML='<div class="compact-tags"><button class="chip" data-prompt="Give me reel ideas">✦ Ideas</button><button class="chip" data-prompt="Write a 30-second reel script">✎ Script</button><button class="chip" data-action="review">✓ Review</button><button class="chip project-chip" data-action="projects">⌖ '+esc(p.slug==='general'?'Add project':p.name)+' <span>⌄</span></button></div><div class="project-chips hide" id="project-chips">'+state.projects.map(x=>'<button class="chip '+(state.project===x.slug?'selected':'')+'" data-project="'+esc(x.slug)+'">'+esc(x.name)+'</button>').join('')+'</div>'
}
function renderDrawer(){const target=$('drawer-root');if(!target)return;if(!state.drawer){target.innerHTML='';return}const saved=[...state.saved.map(x=>({...x,kind:'idea'})),...state.plans.map(x=>({...x,kind:'plan'}))].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));const cards=saved.map(d=>{const c=d.content||{};return'<article class="draft"><strong>'+esc(c.hook||c.project||'Saved draft')+'</strong><p>'+esc((c.script||c.body||'').slice(0,240))+'</p><div class="meta">'+esc(c.project||'TAAMEER')+' · '+(d.kind==='plan'?'Production plan':'Saved idea')+'</div><div class="draft-actions"><button data-draft-copy="'+esc(d.id)+'">Copy</button><button data-draft-use="'+esc(d.id)+'">Open in chat</button><button data-draft-delete="'+esc(d.id)+'">Delete</button></div></article>'}).join('');target.innerHTML='<aside class="drawer"><div class="drawer-header"><h2>Saved drafts</h2><button class="secondary" data-action="close">'+icon('close')+'</button></div><div class="drawer-content">'+(cards||'<p style="color:#888;font-size:13px">No saved drafts yet. Ask Creator Brain for an idea and save the response here.</p>')+'</div></aside>'}
function findSaved(id){return [...state.saved,...state.plans].find(x=>x.id===id)}
async function clickHandler(e){const t=e.target.closest('button');if(!t)return;const a=t.dataset.action;if(a==='new'){newThread();return}
 if(a==='toggle-right'){const app=root.querySelector('.app');app?.classList.toggle('right-closed');chatPanelOpen=!app?.classList.contains('right-closed');return}
 if(t.dataset.module){activeModule=t.dataset.module;render();return}
 if(t.dataset.askProject){state.project=t.dataset.askProject;activeModule='brain';render();send('Tell me about '+currentProject().name+' and suggest a useful reel idea');return}
 if(a==='projects'){$('project-chips')?.classList.toggle('hide');return}
 if(t.dataset.threadMenu){
  const id=t.dataset.threadMenu,row=t.closest('.thread-row');if(!row)return;
  const open=row.querySelector('.thread-popover');
  document.querySelectorAll('.thread-popover').forEach(n=>n.remove());
  if(open)return;
  const menu=document.createElement('div');menu.className='thread-popover';
  menu.innerHTML='<button data-rename="'+esc(id)+'">Rename</button><button data-delete="'+esc(id)+'">Delete</button>';
  row.appendChild(menu);return
 }
 if(t.dataset.rename){renameThread(t.dataset.rename);return}
 if(t.dataset.delete){deleteThread(t.dataset.delete);return}if(a==='logout'){logout();return}if(a==='saved'){state.drawer='saved';renderDrawer();return}if(a==='close'){state.drawer=null;renderDrawer();return}if(a==='send'){send();return}if(a==='review'){const input=$('message-input');input.value='Please review this script and suggest improvements:\n\n';input.focus();return}if(a==='filming'){send('Give me a filming plan for a simple Instagram reel');return}if(t.dataset.project){state.project=t.dataset.project;renderTags();saveState();return}if(t.dataset.thread){selectThread(t.dataset.thread);return}if(t.dataset.prompt){activeModule='brain';render();send(t.dataset.prompt);return}if(t.dataset.selectOption){
  const [position,number]=t.dataset.selectOption.split(':').map(Number);
  const msg=state.messages[position];const options=msg?.creativeOptions||extractCreativeOptions(msg?.body);
  const chosen=options?.find(x=>x.number===number);if(!chosen)return;
  const selection='Develop option '+number+': '+chosen.title+'. Write the exact spoken words for the reel, with a strong hook and natural closing.';
  send(selection,{number,title:chosen.title});return
 }
 if(t.dataset.follow){send(t.dataset.follow);return}if(t.dataset.copyScript!==undefined){const m=state.messages[Number(t.dataset.copyScript)];if(m?.reel?.spoken_script){await navigator.clipboard.writeText(m.reel.spoken_script);t.textContent='Copied ✓'}return}
 if(t.dataset.copy!==undefined){const m=state.messages[Number(t.dataset.copy)];if(m)await navigator.clipboard.writeText(m.body);t.textContent='Copied';return}if(t.dataset.save!==undefined){const m=state.messages[Number(t.dataset.save)],p=currentProject();if(!m)return;try{const r=await request('create',{kind:'idea',content:{body:m.body,hook:m.body.split('\n')[0],project:p.name,created:now()}});state.saved.unshift(r.item);t.textContent='Saved ✓'}catch{t.textContent='Could not save'}return}if(t.dataset.draftCopy){const d=findSaved(t.dataset.draftCopy);if(d)await navigator.clipboard.writeText(d.content?.body||d.content?.script||'');t.textContent='Copied';return}if(t.dataset.draftUse){const d=findSaved(t.dataset.draftUse);if(d){state.drawer=null;state.messages.push({me:false,body:d.content?.body||d.content?.script||'',type:'saved'});persistThread();render()}return}if(t.dataset.draftDelete){try{await request('delete',{id:t.dataset.draftDelete});state.saved=state.saved.filter(x=>x.id!==t.dataset.draftDelete);state.plans=state.plans.filter(x=>x.id!==t.dataset.draftDelete);renderDrawer()}catch{alert('Could not delete draft')}return}}
async function send(preset,selectedOption=null){
 const field=$('message-input'),q=toText(preset||field?.value);if(!q||state.loading)return;
 const thread=state.threadId;state.loading=true;
 state.messages.push({me:true,body:q});
 if(field){field.value='';field.focus()}
 const latestSelected=state.messages.slice(0,-1).reverse().find(m=>!m.me&&m.selectedOption)?.selectedOption||null;
 const carriedSelection=selectedOption||(/(?:shorter|shorten|stronger|another|different|version|اختصر|أقصر)/i.test(q)?latestSelected:null);
 const history=state.messages.slice(-18).map(m=>({role:m.me?'user':'assistant',content:m.body}));
 state.messages.push({me:false,body:'',pending:true});
 renderMessages();renderTags();
 try{
   const res=await request('chat',{question:q,messages:history,selected_option:carriedSelection});
   if(state.threadId===thread)state.messages[state.messages.length-1]={me:false,body:res.text||'No response returned.',sources:res.sources||[],reel:res.reel||null,creativeOptions:res.creative_options||[],selectedOption:res.selected_option||null,engine:res.engine||'verified_rules'};
 }catch(e){
   if(state.threadId===thread)state.messages[state.messages.length-1]={me:false,body:'The knowledge service is temporarily unavailable. Please retry. I cannot verify project facts offline.'};
 }finally{
   state.loading=false;
   if(state.threadId===thread){persistThread();renderMessages();renderTags()}
 }
}
function render(){if(!isLogged())entryView();else shell()}
async function start(){const saved=storage();state.last=saved.last||0;state.token=saved.token||null;state.project=saved.project||'general';state.modeTag=saved.modeTag||'Ideas';state.threads=Array.isArray(saved.threads)?saved.threads:[];state.threadId=saved.threadId||null;let t=state.threads.find(x=>x.id===state.threadId);if(t)state.messages=t.messages||[];else newThread(false);if(state.token&&!timedOut()){try{await request('verify');state.mode='sales';await loadData();render();return}catch{state.token=null}}state.token=null;const {data}=await sb.auth.getSession();if(data.session){const r=await sb.from('profiles').select('role').eq('id',data.session.user.id).maybeSingle();if(r.data?.role==='admin'){state.mode='admin';state.last=now();await loadData();render();return}}state.mode=null;render()}
start();
