(()=>{try{
const esc=s=>String(s??'').replace(/\s+/g,' ').trim();
const short=(s,n=220)=>{s=esc(s);return s.length>n?s.slice(0,n)+'…':s};
const vis=el=>{try{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'}catch{return false}};
const cssPath=el=>{if(!el||!el.nodeType)return'';const parts=[];while(el&&el.nodeType===1&&parts.length<7){let p=el.nodeName.toLowerCase();if(el.id){p+='#'+CSS.escape(el.id);parts.unshift(p);break}let i=1,sib=el;while((sib=sib.previousElementSibling))if(sib.nodeName===el.nodeName)i++;p+=`:nth-of-type(${i})`;parts.unshift(p);el=el.parentElement}return parts.join(' > ')};
const labelFor=el=>{
  const out=[];
  if(el.id){document.querySelectorAll(`label[for="${CSS.escape(el.id)}"]`).forEach(x=>out.push(short(x.innerText||x.textContent,120)))}
  let p=el.parentElement,depth=0;
  while(p&&depth<4){
    const lab=p.querySelector(':scope > label');
    if(lab)out.push(short(lab.innerText||lab.textContent,120));
    const prev=el.previousElementSibling;
    if(prev&&/^(LABEL|DIV|SPAN|P|H[1-6])$/.test(prev.tagName))out.push(short(prev.innerText||prev.textContent,120));
    p=p.parentElement;depth++;
  }
  return [...new Set(out.filter(Boolean))].slice(0,4)
};
const nearby=el=>{
  const arr=[];
  let p=el.parentElement,d=0;
  while(p&&d<3){
    const t=short(p.innerText||p.textContent,300);
    if(t)arr.push(t);
    p=p.parentElement;d++;
  }
  return [...new Set(arr)].slice(0,3)
};
const nodes=[...document.querySelectorAll('textarea,input,[contenteditable="true"],[role="textbox"]')].filter(vis);
const data=nodes.map((el,i)=>({
  index:i,
  tag:el.tagName,
  type:el.getAttribute('type')||'',
  role:el.getAttribute('role')||'',
  contenteditable:el.getAttribute('contenteditable')||'',
  name:el.getAttribute('name')||'',
  id:el.id||'',
  placeholder:el.getAttribute('placeholder')||'',
  ariaLabel:el.getAttribute('aria-label')||'',
  ariaLabelledby:el.getAttribute('aria-labelledby')||'',
  dataTestId:el.getAttribute('data-testid')||'',
  class:short(el.className,180),
  labels:labelFor(el),
  nearbyText:nearby(el),
  valuePreview:short(('value'in el?el.value:el.innerText||el.textContent),180),
  selector:cssPath(el)
}));
const buttons=[...document.querySelectorAll('button,[role="button"]')].filter(vis).map((el,i)=>({
  index:i,text:short(el.innerText||el.textContent,120),
  ariaLabel:el.getAttribute('aria-label')||'',
  title:el.getAttribute('title')||'',
  dataTestId:el.getAttribute('data-testid')||'',
  selector:cssPath(el)
})).filter(x=>x.text||x.ariaLabel||x.title);
const report={
  title:'NAI PROMPT DOM DIAG',
  url:location.href,
  titleText:document.title,
  time:new Date().toISOString(),
  inputs:data,
  relevantButtons:buttons.filter(x=>/character|prompt|undesired|uc|add|base/i.test([x.text,x.ariaLabel,x.title,x.dataTestId].join(' '))).slice(0,40)
};
const txt=JSON.stringify(report,null,2);
document.getElementById('__nai_diag_panel__')?.remove();
const ov=document.createElement('div');ov.id='__nai_diag_panel__';
ov.style='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px;font-family:system-ui,sans-serif';
const box=document.createElement('div');box.style='width:min(94vw,720px);height:min(82vh,760px);background:#fff;color:#111;border-radius:14px;box-shadow:0 12px 42px #0008;display:flex;flex-direction:column;overflow:hidden';
const hd=document.createElement('div');hd.style='padding:14px 16px;border-bottom:1px solid #ddd;font-weight:800;font-size:16px';hd.textContent='NAI 프롬프트 입력칸 진단';
const sub=document.createElement('div');sub.style='padding:8px 16px;font-size:12px;color:#555;border-bottom:1px solid #eee';sub.textContent=`입력칸 후보 ${data.length}개 감지 · 아래 결과를 복사해서 보내주세요.`;
const ta=document.createElement('textarea');ta.value=txt;ta.readOnly=true;ta.style='flex:1;margin:12px 14px 8px;padding:10px;border:1px solid #ccc;border-radius:10px;font:11px/1.45 ui-monospace,monospace;resize:none;color:#111;background:#fafafa';
const ft=document.createElement('div');ft.style='display:flex;gap:8px;padding:8px 14px 14px';
const cp=document.createElement('button');cp.textContent='진단결과 복사';cp.style='flex:1;padding:11px;border:0;border-radius:10px;background:#111;color:white;font-weight:800';
const close=document.createElement('button');close.textContent='닫기';close.style='padding:11px 18px;border:1px solid #bbb;border-radius:10px;background:white;color:#111;font-weight:700';
cp.onclick=async()=>{try{await navigator.clipboard.writeText(txt);cp.textContent='복사 완료 ✓'}catch{ta.focus();ta.select();document.execCommand('copy');cp.textContent='복사 완료 ✓'}};
close.onclick=()=>ov.remove();
ov.onclick=e=>{if(e.target===ov)ov.remove()};
ft.append(cp,close);box.append(hd,sub,ta,ft);ov.append(box);document.body.append(ov);
}catch(e){alert('NAI 진단 오류: '+(e?.message||e))}})();