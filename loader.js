(()=>{
const ROOT='__bm_launcher_host__';
if(document.getElementById(ROOT)){document.getElementById(ROOT).remove();return}
const src=document.currentScript?.src||'https://ztcgh01.github.io/Bookmarklet/loader.js';
const base=src.replace(/\/[^/]*$/,'/');
const POSKEY='__bm_launcher_position_v3__';

const host=document.createElement('div');
host.id=ROOT;
Object.assign(host.style,{
  position:'fixed',right:'16px',bottom:'16px',
  width:'38px',height:'38px',
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

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
let mode='fab';
let dragStart=null;
let dragFrame=0, dragPending=null;
function paintDrag(){dragFrame=0;if(!dragPending||!dragStart)return;const x=clamp(dragStart.x+dragPending.dx,0,Math.max(0,innerWidth-host.offsetWidth));const y=clamp(dragStart.y+dragPending.dy,0,Math.max(0,innerHeight-host.offsetHeight));host.style.transform=`translate3d(${x-dragStart.x}px,${y-dragStart.y}px,0)`;}
function queueDrag(d){if(!dragStart){const r=getRect();dragStart={x:r.left,y:r.top};host.style.left=r.left+'px';host.style.top=r.top+'px';host.style.right='auto';host.style.bottom='auto';host.style.willChange='transform';}dragPending={dx:+d.dx||0,dy:+d.dy||0};if(!dragFrame)dragFrame=requestAnimationFrame(paintDrag)}
function finishDrag(){if(dragFrame)cancelAnimationFrame(dragFrame);dragFrame=0;if(dragStart){const d=dragPending||{dx:0,dy:0};host.style.transform='none';setXY(dragStart.x+d.dx,dragStart.y+d.dy);host.style.willChange='auto';}dragPending=null;dragStart=null;savePos()}

function getRect(){return host.getBoundingClientRect()}
function setXY(x,y){
  const r=getRect();
  x=clamp(x,0,Math.max(0,innerWidth-r.width));
  y=clamp(y,0,Math.max(0,innerHeight-r.height));
  host.style.left=x+'px';host.style.top=y+'px';
  host.style.right='auto';host.style.bottom='auto';
}
function savePos(){
  try{
    const r=getRect();
    localStorage.setItem(POSKEY,JSON.stringify({x:r.left,y:r.top,mode}));
  }catch{}
}
function restoreSaved(){
  try{
    const p=JSON.parse(localStorage.getItem(POSKEY)||'null');
    if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))setXY(p.x,p.y);
  }catch{}
}

addEventListener('message',e=>{
  if(e.source!==fr.contentWindow)return;
  const d=e.data||{};

  if(d.type==='bm-run'){
    try{
      const code=String(d.code||'').trim().replace(/^javascript:/i,'');
      if(!code)throw new Error('코드가 비어 있습니다.');
      (0,eval)(code);
    }catch(err){alert('북마클릿 실행 오류: '+(err?.message||err))}
  }

  else if(d.type==='bm-close'){
    host.remove();
  }

  else if(d.type==='bm-min'){
    const r=getRect();
    mode='fab';
    Object.assign(host.style,{width:'38px',height:'38px'});
    setXY(r.left,r.top);
    savePos();
  }

  else if(d.type==='bm-restore'){
    const r=getRect();
    mode='full';
    const w=clamp(+d.w||360,300,Math.min(innerWidth-20,720));
    const h=clamp(+d.h||500,280,Math.min(innerHeight-20,900));
    Object.assign(host.style,{width:w+'px',height:h+'px'});
    setXY(r.left,r.top);
    savePos();
  }

  else if(d.type==='bm-resize'){
    const r=getRect();
    const w=clamp(+d.w||360,300,Math.min(innerWidth-10,720));
    const h=clamp(+d.h||500,280,Math.min(innerHeight-10,900));
    Object.assign(host.style,{width:w+'px',height:h+'px'});
    setXY(r.left,r.top);
    savePos();
  }

  else if(d.type==='bm-drag'||d.type==='bm-fab-drag'){
    queueDrag(d);
  }
  else if(d.type==='bm-drop'||d.type==='bm-fab-drop'){
    finishDrag();
  }
});

restoreSaved();
})();