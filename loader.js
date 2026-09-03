(()=>{
const ROOT='__bm_launcher_host__';
if(document.getElementById(ROOT)){document.getElementById(ROOT).remove();return}
const src=document.currentScript?.src||'https://ztcgh01.github.io/Bookmarklet/loader.js';
const base=src.replace(/\/[^/]*$/,'/');
const host=document.createElement('div');
host.id=ROOT;
Object.assign(host.style,{
  position:'fixed',right:'16px',bottom:'16px',
  width:'360px',height:'500px',
  zIndex:'2147483647',border:'0',background:'transparent',
  pointerEvents:'auto'
});
const fr=document.createElement('iframe');
fr.src=base+'launcher.html?v='+Date.now();
fr.title='Bookmarklet Launcher';
fr.setAttribute('allowtransparency','true');
Object.assign(fr.style,{width:'100%',height:'100%',border:'0',background:'transparent'});
host.appendChild(fr);
document.documentElement.appendChild(host);

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
addEventListener('message',e=>{
  if(e.source!==fr.contentWindow)return;
  const d=e.data||{};
  if(d.type==='bm-run'){
    try{
      const code=String(d.code||'').trim().replace(/^javascript:/i,'');
      if(!code)throw new Error('코드가 비어 있습니다.');
      (0,eval)(code);
    }catch(err){alert('북마클릿 실행 오류: '+(err?.message||err))}
  }else if(d.type==='bm-close'){
    host.remove();
  }else if(d.type==='bm-min'){
    Object.assign(host.style,{width:'64px',height:'64px',right:'16px',bottom:'16px',left:'auto',top:'auto'});
  }else if(d.type==='bm-restore'){
    const w=clamp(+d.w||360,300,Math.min(innerWidth-20,720));
    const h=clamp(+d.h||500,280,Math.min(innerHeight-20,900));
    Object.assign(host.style,{width:w+'px',height:h+'px'});
  }else if(d.type==='bm-resize'){
    const w=clamp(+d.w||360,300,Math.min(innerWidth-10,720));
    const h=clamp(+d.h||500,280,Math.min(innerHeight-10,900));
    Object.assign(host.style,{width:w+'px',height:h+'px'});
  }else if(d.type==='bm-move'){
    host.style.right='auto';host.style.bottom='auto';
    host.style.left=clamp(+d.x||0,0,Math.max(0,innerWidth-host.offsetWidth))+'px';
    host.style.top=clamp(+d.y||0,0,Math.max(0,innerHeight-host.offsetHeight))+'px';
  }
});
})();