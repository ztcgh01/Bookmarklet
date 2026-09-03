(()=>{
  const ID="__ubm_remote_launcher__";
  document.getElementById(ID)?.remove();

  const TOOLS_URL=new URL("./tools.json",document.currentScript?.src||location.href).href;
  const css=(el,s)=>Object.assign(el.style,s);
  const strip=s=>String(s||"").trim().replace(/^javascript:/i,"");

  async function loadText(url){
    const r=await fetch(url,{cache:"no-store"});
    if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return await r.text();
  }
  async function runTool(t){
    try{
      let code=t.code||"";
      if(t.url) code=await loadText(t.url);
      if(!code) throw new Error("도구 코드가 비어 있습니다.");
      document.getElementById(ID)?.remove();
      (0,eval)(strip(code));
    }catch(e){
      alert("도구 실행 오류: "+(e?.message||e));
    }
  }

  const root=document.createElement("div");
  root.id=ID;
  css(root,{position:"fixed",inset:"0",zIndex:"2147483647",background:"rgba(0,0,0,.28)",
    fontFamily:"system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"});
  root.onclick=e=>{if(e.target===root)root.remove()};

  const p=document.createElement("div");
  css(p,{position:"absolute",right:"14px",top:"14px",width:"min(92vw,360px)",maxHeight:"82vh",
    background:"#fff",color:"#111",border:"1px solid #ddd",borderRadius:"15px",
    boxShadow:"0 16px 45px #0004",overflow:"hidden",display:"flex",flexDirection:"column"});
  p.onclick=e=>e.stopPropagation();

  const h=document.createElement("div");
  css(h,{display:"flex",alignItems:"center",gap:"8px",padding:"12px",borderBottom:"1px solid #eee",
    background:"#fafafa",fontWeight:"800",cursor:"move",userSelect:"none"});
  const title=document.createElement("div"); title.textContent="🧰 북마클릿 런처"; title.style.flex="1";
  const reload=document.createElement("button"); reload.textContent="↻"; reload.title="목록 새로고침";
  const close=document.createElement("button"); close.textContent="×";
  for(const b of [reload,close]) css(b,{border:"1px solid #ccc",background:"#fff",color:"#111",
    borderRadius:"8px",padding:"6px 9px",fontWeight:"700"});
  h.append(title,reload,close);

  const sw=document.createElement("div"); sw.style.padding="10px 11px 6px";
  const search=document.createElement("input"); search.placeholder="도구 검색";
  css(search,{boxSizing:"border-box",width:"100%",padding:"9px 10px",border:"1px solid #ccc",
    borderRadius:"9px",fontSize:"14px"});
  sw.append(search);

  const list=document.createElement("div");
  css(list,{padding:"4px 10px 12px",overflow:"auto"});

  p.append(h,sw,list); root.append(p); document.body.append(root);

  let tools=[];
  function render(){
    const q=search.value.trim().toLowerCase();
    list.innerHTML="";
    const rows=tools.filter(t=>!q||String(t.name||"").toLowerCase().includes(q)||String(t.note||"").toLowerCase().includes(q));
    if(!rows.length){
      list.innerHTML='<div style="padding:18px;text-align:center;color:#888">도구가 없습니다.</div>';
      return;
    }
    for(const t of rows){
      const b=document.createElement("button");
      css(b,{display:"block",width:"100%",textAlign:"left",border:"0",borderBottom:"1px solid #eee",
        background:"transparent",padding:"10px 5px",color:"#111"});
      const n=document.createElement("div"); n.textContent=t.name||"이름 없음"; n.style.fontWeight="800";
      b.append(n);
      if(t.note){const x=document.createElement("div");x.textContent=t.note;css(x,{fontSize:"11px",color:"#888",marginTop:"2px"});b.append(x)}
      b.onclick=()=>runTool(t);
      list.append(b);
    }
  }
  async function loadTools(){
    list.innerHTML='<div style="padding:18px;text-align:center;color:#888">불러오는 중…</div>';
    try{
      const r=await fetch(TOOLS_URL,{cache:"no-store"});
      if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const j=await r.json();
      tools=Array.isArray(j)?j:j.tools||[];
      render();
    }catch(e){
      list.innerHTML='<div style="padding:18px;color:#b22">tools.json 로드 실패<br>'+String(e.message||e)+'</div>';
    }
  }
  search.oninput=render;
  reload.onclick=loadTools;
  close.onclick=()=>root.remove();

  let drag=false,dx=0,dy=0;
  h.onpointerdown=e=>{
    if(e.target.tagName==="BUTTON")return;
    drag=true; const r=p.getBoundingClientRect(); dx=e.clientX-r.left;dy=e.clientY-r.top;
    h.setPointerCapture?.(e.pointerId);
  };
  h.onpointermove=e=>{
    if(!drag)return;
    p.style.left=Math.max(0,Math.min(innerWidth-p.offsetWidth,e.clientX-dx))+"px";
    p.style.top=Math.max(0,Math.min(innerHeight-p.offsetHeight,e.clientY-dy))+"px";
    p.style.right="auto";
  };
  h.onpointerup=()=>drag=false;

  loadTools();
})();