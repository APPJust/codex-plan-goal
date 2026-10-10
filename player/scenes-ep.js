// Episode scenes (origin, menu, goal, compare, demo, outlook). Shares helpers from scenes.js.
// All positions are in the 1728x610 visual area; bounds go to B for automated overlap QA.
const card=(x,y,w,h,o={})=>shadow(x,y,w,h,o.rx||20,o.sh??1)+S.rect({x,y,width:w,height:h,rx:o.rx||20,fill:o.fill||C.card,stroke:o.stroke||'#e3e5ec','stroke-width':o.sw||1.5});
const pill=(x,y,label,o={})=>{const size=o.size||20,w=o.w||tw(label,size)+30,h=o.h||size+16;return {w,svg:S.rect({x,y,width:w,height:h,rx:h/2,fill:o.fill||C.blueL,stroke:o.stroke,'stroke-width':o.stroke?2:undefined})+S.text(x+w/2,y+h/2+size*.36,label,{'font-size':size,'font-weight':o.weight||700,fill:o.color||C.blue,'text-anchor':'middle'})}};
const pop=(u,cx,cy,inner,from=.7)=>u<=0?'':S.g({opacity:clamp(u*1.8),transform:`translate(${cx} ${cy}) scale(${lerp(from,1,E.back(u))}) translate(${-cx} ${-cy})`},inner);
const rise=(u,inner,d=24)=>u<=0?'':S.g({opacity:clamp(u*1.5),transform:`translate(0 ${(1-E.out(u))*d})`},inner);
const NOT_DOC='官方文件未詳述 · Not detailed in docs';

// ── 1. Origin: two pains → two menu items → release timeline ──
SCENES.origin=(sc,t,B)=>{
 const P=phaser(sc,t),ua=P('pain'),ug=P('guess'),us=P('stop'),upl=P('plus'),u1=P('t1'),u2=P('t2'),u3=P('t3'),u4=P('t4');
 let o='';const out=E.inout(clamp(u1/.25)),stageA=1-out;
 if(stageA>0){let a='';
  // card A: vague request → guessed direction
  const cA=E.out(clamp(ua/.4)),cB=E.out(clamp((ua-.3)/.4));
  const aw=800,ah=330;
  if(cA>0){B.push({id:'pain-a',x:0,y:0,width:aw,height:ah,overlapGroup:'stageA'});
   let g=card(0,0,aw,ah)+S.circle({cx:46,cy:46,r:24,fill:C.redL})+S.text(46,55,'1',{'font-size':26,'font-weight':800,fill:C.red,'text-anchor':'middle'})+bi(84,56,'需求說不清楚 → 照猜測動手','Vague request → acts on a guess',{zs:30,es:20,gap:28});
   g+=S.rect({x:40,y:120,width:300,height:64,rx:18,fill:C.row})+S.text(60,161,'「幫我做點名網頁」',{'font-size':24,fill:C.ink,'font-weight':600});
   const dirs=[['登入系統？',-70],['名單 CSV？',0],['列印表格？',70]];
   dirs.forEach(([lab,dy],i)=>{const u=E.out(clamp((ug-.1-i*.12)/.3));if(u<=0)return;const x2=lerp(350,560,u),y2=152+dy*1.25*u;
    g+=S.path({d:`M350 152 Q450 152 ${x2} ${y2}`,stroke:i===2?C.red:C.line,'stroke-width':i===2?4:3,fill:'none','stroke-dasharray':i===2?undefined:'8 7'});
    if(u>.9)g+=S.text(576,y2+9,lab,{'font-size':23,fill:i===2?C.red:C.muted,'font-weight':i===2?800:500})});
   const wrong=E.out(clamp((ug-.55)/.25));
   if(wrong>0)g+=S.g({opacity:wrong},S.circle({cx:732,cy:239,r:20,fill:C.red})+icon('cross',716,223,.66,'#fff',4.4)+S.text(400,290,'猜錯方向，白做一場',{'font-size':24,'font-weight':700,fill:C.red})+S.text(620,290,'Wrong guess',{'font-size':19,fill:C.red}));
   a+=S.g({opacity:cA,transform:`translate(0 ${(1-cA)*20})`},g)}
  if(cB>0){const x=aw+128,w=1728-x;B.push({id:'pain-b',x,y:0,width:w,height:ah,overlapGroup:'stageA'});
   let g=card(0,0,w,ah)+S.circle({cx:46,cy:46,r:24,fill:C.redL})+S.text(46,55,'2',{'font-size':26,'font-weight':800,fill:C.red,'text-anchor':'middle'})+bi(84,56,'任務很大 → 做一輪就停','Big task → stops after one round',{zs:30,es:20,gap:28});
   const segs=5,sx=40,sw=(w-80-4*10)/segs;
   for(let i=0;i<segs;i++){const fill=i===0?E.out(clamp(us/.35)):0;g+=S.rect({x:sx+i*(sw+10),y:150,width:sw,height:40,rx:10,fill:C.row})+(fill>0?S.rect({x:sx+i*(sw+10),y:150,width:sw*fill,height:40,rx:10,fill:C.blue}):'')}
   g+=S.text(sx,226,'第 1 輪',{'font-size':21,fill:C.blue,'font-weight':700});
   const wait=E.out(clamp((us-.4)/.3));
   if(wait>0)g+=S.g({opacity:wait},S.rect({x:sx+sw+18,y:212,width:150,height:40,rx:20,fill:C.amberL})+S.rect({x:sx+sw+36,y:222,width:6,height:20,fill:C.amber})+S.rect({x:sx+sw+48,y:222,width:6,height:20,fill:C.amber})+S.text(sx+sw+66,240,'等你…',{'font-size':21,'font-weight':700,fill:C.amber})+
    S.text(sx,290,'剩下的工作沒有人推',{'font-size':24,'font-weight':700,fill:C.red})+S.text(sx+234,290,'The rest just waits',{'font-size':19,fill:C.red}));
   a+=S.g({opacity:cB,transform:`translate(${x} ${(1-cB)*20})`},g)}
  // + button and the two matching menu items
  const pu=E.out(clamp(upl/.25));
  if(pu>0){const cx=864,cy=520;
   a+=pop(pu,cx,cy,S.circle({cx,cy,r:36,fill:C.blueL,stroke:C.blue,'stroke-width':2.5})+icon('plus',cx-26,cy-26,1.08,C.blue,3.4));
   const items=[{i:'bulb',zh:'規劃模式',d:'開啟規劃模式',x:150,to:400},{i:'goal',zh:'目標',d:'設定要持續追求的目標',x:1078,to:1328}];
   items.forEach((m,k)=>{const u=E.out(clamp((upl-.2-k*.18)/.3));if(u<=0)return;const w=500,h=72,x=lerp(cx-w/2,m.x,u),y=lerp(cy-36,400,u);
    B.push({id:'item-'+k,x:m.x,y:400,width:w,height:h,overlapGroup:u<1?'stageA':undefined});
    a+=S.g({opacity:clamp(u*2)},S.path({d:`M${cx+(k?40:-40)} ${cy} Q${m.to} ${cy} ${m.to} ${y+h}`,stroke:C.blue,'stroke-width':2.5,fill:'none','stroke-dasharray':'7 6'})+
     card(x,y,w,h,{rx:16,stroke:C.blue,sw:2.5})+icon(m.i,x+18,y+12,.92,C.blue,2.8)+S.text(x+72,y+46,m.zh,{'font-size':28,'font-weight':800,fill:C.ink})+S.text(x+72+tw(m.zh,28)+14,y+46,m.d,{'font-size':21,fill:C.muted})+
     S.path({d:`M${m.to} ${y-8} V${y-50}`,stroke:C.blue,'stroke-width':3})+S.path({d:`M${m.to-9} ${y-41} L${m.to} ${y-54} L${m.to+9} ${y-41}`,stroke:C.blue,'stroke-width':3,fill:'none'}))});
  }
  o+=S.g({opacity:stageA,transform:`translate(0 ${-out*40})`},a);
 }
 // stage B: release timeline (evenly spaced, not to scale)
 if(out>0){const ax=60,bx=1668,ay=304,nodes=[
   {d:'2026-01-31',zh:'規劃模式推出',z2:'Codex CLI 0.93 · /plan（需開功能）',en:'Plan mode in Codex CLI 0.93',c:C.blue,up:true,u:u1,origin:true},
   {d:'2026-02-02',zh:'規劃模式預設開啟',z2:'同一天 Codex App 推出',en:'On by default · Codex app launches',c:C.blue,up:false,u:u2},
   {d:'2026-04-30',zh:'目標：實驗功能',z2:'Codex CLI 0.128 · /goal',en:'Goals (experimental), CLI 0.128',c:C.green,up:true,u:u3},
   {d:'2026-05-21',zh:'目標正式推出',z2:'App · IDE 擴充 · CLI',en:'Goals GA: app, IDE, CLI',c:C.green,up:false,u:u4}];
  const line=E.inout(clamp(u1/.5));
  o+=S.g({opacity:out},S.line({x1:ax,y1:ay,x2:lerp(ax,bx,line),y2:ay,stroke:C.ink,'stroke-width':4,'stroke-linecap':'round'})+
   S.text(bx,ay+40,'時間軸非等比例',{'font-size':18,fill:C.muted,'text-anchor':'end'})+S.text(bx,ay+62,'not to scale',{'font-size':16,fill:C.muted,'text-anchor':'end'}));
  nodes.forEach((n,i)=>{const x=190+i*410,u=E.out(clamp((n.u-(i?0:.25))/.35));if(u<=0)return;const w=390,h=168,cx=x-w/2+150,y=n.up?40:ay+66;
   const bx0=Math.max(0,x-120);
   B.push({id:'node-'+i,x:bx0,y,width:w,height:h});
   o+=S.g({opacity:clamp(u*1.6)},S.circle({cx:x,cy:ay,r:13,fill:n.c,stroke:'#fff','stroke-width':4})+S.line({x1:x,y1:n.up?y+h:ay+14,x2:x,y2:n.up?ay-14:y,stroke:n.c,'stroke-width':2.5,'stroke-dasharray':'5 5'})+
    S.g({transform:`translate(0 ${(1-u)*(n.up?-16:16)})`},card(bx0,y,w,h,{stroke:n.c,sw:2.5})+S.text(bx0+24,y+48,n.d,{'font-size':34,'font-weight':800,fill:n.c,'font-family':MONO})+
     S.text(bx0+24,y+92,n.zh,{'font-size':27,'font-weight':800,fill:C.ink})+S.text(bx0+24,y+124,n.z2,{'font-size':21,fill:C.sub})+S.text(bx0+24,y+152,n.en,{'font-size':18,fill:C.muted})));
   if(n.origin){const su=clamp((u1-.55)/.2);if(su>0){const sx=bx0+w-66,sy=y+52;o+=S.g({opacity:su,transform:`translate(${sx} ${sy}) rotate(-12) scale(${lerp(1.6,1,E.out(su))})`},S.circle({cx:0,cy:0,r:44,fill:'none',stroke:C.red,'stroke-width':4})+S.text(0,-2,'起源',{'font-size':24,'font-weight':900,fill:C.red,'text-anchor':'middle'})+S.text(0,22,'ORIGIN',{'font-size':14,'font-weight':800,fill:C.red,'text-anchor':'middle'}))}}
  });
  const legend=E.out(clamp(u1/.4));
  o+=S.g({opacity:legend*out},S.circle({cx:70,cy:590,r:9,fill:C.blue})+S.text(88,597,'規劃模式 Plan mode',{'font-size':19,fill:C.sub})+S.circle({cx:320,cy:590,r:9,fill:C.green})+S.text(338,597,'目標 Goals',{'font-size':19,fill:C.sub}));
 }
 return o;
};

// ── 2. The + menu, item by item, then three groups ──
const FULL=[{i:'clip',zh:'檔案和資料夾',d:'',g:0,ph:'files'},{i:'globe',zh:'附加 Google Chrome',d:'',g:0,ph:'chrome'},{i:'folder',zh:'在專案中工作',d:'為新聊天選擇專案',g:0,ph:'project'},
 {i:'goal',zh:'目標',d:'設定要持續追求的目標',g:1},{i:'bulb',zh:'規劃模式',d:'開啟規劃模式',g:1},{i:'draw',zh:'繪圖',d:'繪製草圖',g:0,ph:'draw',c:'#2fa58a'}];
const PLUG=[{i:'repo',zh:'GitHub',d:'Triage PRs, issues, CI'},{i:'cloudi',zh:'Google Drive',d:'Drive, Docs, Sheets…'},{i:'doc',zh:'Documents',d:'Create and edit documents'}];
const GROUPS=[{zh:'給材料',en:'Add context',c:C.blue,cl:C.blueL},{zh:'改變工作方式',en:'Change how Codex works',c:C.amber,cl:C.amberL},{zh:'接上工具',en:'Connect tools',c:C.green,cl:C.greenL}];
const DETAIL={files:{zh:'檔案和資料夾',en:'Files and folders',i:'clip',d:'把文件、圖片等檔案直接附給 Codex',de:'Attach documents, images and other files'},
 chrome:{zh:'附加 Google Chrome',en:'Attach Google Chrome',i:'globe',d:'把 Chrome 瀏覽器接進這次對話',de:'Bring your Chrome browser into the chat',nd:true},
 project:{zh:'在專案中工作',en:'Work in a project',i:'folder',d:'替新聊天選一個專案資料夾',de:'Pick a project folder for a new chat'},
 draw:{zh:'繪圖',en:'Draw',i:'draw',d:'畫一張草圖，附在訊息裡',de:'Sketch something and attach it',nd:true}};
function iconX(kind,x,y,s,color,sw){
 const st={stroke:color,'stroke-width':sw,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},P=d=>S.path({d,...st});
 const body={repo:P('M12 8 H36 V40 H12 Z')+P('M18 16 H30')+P('M18 23 H30')+P('M18 30 H26'),cloudi:P('M14 36 H35 A8 8 0 0 0 35 20 A11 11 0 0 0 14 22 A7 7 0 0 0 14 36 Z'),doc:P('M13 7 H35 V41 H13 Z')+P('M18 16 H30')+P('M18 23 H30')+P('M18 30 H26')}[kind];
 return body?S.g({transform:`translate(${x} ${y}) scale(${s})`},body):icon(kind,x,y,s,color,sw);
}
SCENES.menu=(sc,t,B)=>{
 const P=phaser(sc,t),uo=P('open'),ugr=P('group'),upg=P('plugins');
 const cur=['files','chrome','project','draw'].find(n=>P(n)>0&&P(n)<1&&ugr<=0);
 let o='';const MW=560,MH=590,RH=50,R0=58,PH0=R0+6*RH+40;
 const op=E.out(clamp((t-sc.start+.2)/.5));
 B.push({id:'menu-full',x:0,y:10,width:MW,height:MH});
 let m=card(0,0,MW,MH,{rx:24})+S.text(26,40,'新增',{'font-size':21,fill:C.muted,'font-weight':600});
 FULL.forEach((r,k)=>{const y=R0+k*RH,on=r.ph&&cur===r.ph,grp=ugr>0?GROUPS[r.g]:null,gu=grp?E.out(clamp((ugr-.1-r.g*.25)/.25)):0;
  if(on)m+=S.rect({x:10,y,width:MW-20,height:RH-4,rx:12,fill:C.blueL,stroke:C.blue,'stroke-width':2});
  if(gu>0)m+=S.rect({x:10,y,width:MW-20,height:RH-4,rx:12,fill:grp.cl,opacity:gu});
  m+=xIcon(r,y)+S.text(70,y+33,r.zh,{'font-size':24,fill:C.ink,'font-weight':on||r.g===1&&gu>0?800:500});
  if(r.d)m+=S.text(70+tw(r.zh,24)+12,y+33,r.d,{'font-size':19,fill:C.muted});
  if(gu>0)m+=S.circle({cx:MW-34,cy:y+23,r:9,fill:grp.c,opacity:gu});
 });
 m+=S.text(26,PH0-6,'外掛程式',{'font-size':21,fill:C.muted,'font-weight':600});
 const pgU=E.out(clamp(upg/.3));
 PLUG.forEach((r,k)=>{const y=PH0+8+k*RH;if(pgU>0)m+=S.rect({x:10,y,width:MW-20,height:RH-4,rx:12,fill:C.greenL,opacity:pgU});
  m+=iconX(r.i,20,y+3,.82,C.sub,2.6)+S.text(70,y+33,r.zh,{'font-size':24,fill:C.ink,'font-weight':500})+S.text(70+tw(r.zh,24)+12,y+33,r.d,{'font-size':18,fill:C.muted});
  if(pgU>0)m+=S.circle({cx:MW-34,cy:y+23,r:9,fill:C.green,opacity:pgU})});
 const s=lerp(.9,1,op);
 o+=S.g({opacity:op,transform:`translate(0 10) translate(0 ${MH}) scale(${s}) translate(0 ${-MH})`},m);
 // right panel
 const RX=640,RW=1728-RX;
 // open: two sections
 const secOut=E.out(clamp(P('files')/.2));
 if(uo>0&&secOut<1){[['新增','Add','附加材料、切換工作方式',R0+10,C.blue],['外掛程式','Plugins','接上外部工具與服務',PH0,C.green]].forEach(([zh,en,d,y,c],k)=>{const u=E.out(clamp((uo-.15-k*.3)/.3));if(u<=0)return;
   B.push({id:'sec-'+k,x:RX,y:y,width:RW,height:110,overlapGroup:'detail'});
   o+=S.g({opacity:u*(1-secOut),transform:`translate(${(1-u)*-30} 0)`},S.path({d:`M${MW+16} ${y+40} H${RX-10}`,stroke:c,'stroke-width':3,'stroke-dasharray':'7 6'})+card(RX,y,RW,110,{stroke:c,sw:2.5})+
    S.text(RX+30,y+52,zh,{'font-size':36,'font-weight':800,fill:c})+S.text(RX+30+tw(zh,36)+16,y+52,en,{'font-size':22,fill:C.muted,'font-weight':600})+S.text(RX+30,y+88,d,{'font-size':23,fill:C.sub}))});}
 // item detail card
 const items=['files','chrome','project','draw'];
 items.forEach((n,k)=>{const u=P(n);if(u<=0||ugr>0&&P('group')>.25)return;const din=E.out(clamp(u/.15)),dout=k<3?E.out(clamp(P(items[k+1])/.15)):E.out(clamp(ugr/.2));if(dout>=1)return;
  const D=DETAIL[n],y=60,h=420,r=FULL.find(f=>f.ph===n),ry=10+R0+FULL.indexOf(r)*RH+23;
  B.push({id:'detail-'+n,x:RX,y,width:RW,height:h,overlapGroup:'detail'});
  let g=S.path({d:`M${MW+6} ${ry} C${MW+50} ${ry} ${RX-50} ${y+90} ${RX} ${y+90}`,stroke:C.blue,'stroke-width':2.5,fill:'none','stroke-dasharray':'7 6'})+card(RX,y,RW,h,{stroke:C.blue,sw:2.5});
  g+=S.circle({cx:RX+92,cy:y+96,r:58,fill:C.blueL})+iconX(D.i,RX+44,y+48,2,n==='draw'?'#2fa58a':C.blue,2.2);
  g+=S.text(RX+180,y+92,D.zh,{'font-size':44,'font-weight':800,fill:C.ink})+S.text(RX+180,y+130,D.en,{'font-size':24,fill:C.muted,'font-weight':600});
  g+=S.text(RX+52,y+232,D.d,{'font-size':34,'font-weight':600,fill:C.ink})+S.text(RX+52,y+274,D.de,{'font-size':23,fill:C.sub});
  g+=pill(RX+52,y+320,'給材料 · Add context',{size:21}).svg;
  if(D.nd)g+=pill(RX+330,y+320,NOT_DOC,{size:20,fill:C.amberL,color:C.amber}).svg;
  g+=S.circle({cx:RX+RW-60,cy:y+60,r:26,fill:C.blue})+S.text(RX+RW-60,y+69,String(k+1),{'font-size':26,'font-weight':800,fill:'#fff','text-anchor':'middle'});
  o+=S.g({opacity:din*(1-dout),transform:`translate(${(1-din)*30} 0)`},g);
 });
 // groups
 const gin=E.out(clamp((ugr-.1)/.2));
 if(gin>0){const cw=(RW-2*28)/3;GROUPS.forEach((G,k)=>{const u=E.out(clamp((ugr-.1-k*.22)/.25))*(k===2?Math.max(.35,E.out(clamp(upg/.3))):1);if(u<=0)return;
   const x=RX+k*(cw+28),y=40,h=500,focus=k===1;
   B.push({id:'group-'+k,x,y,width:cw,height:h});
   const list=k===0?['檔案和資料夾','附加 Google Chrome','在專案中工作','繪圖']:k===1?['目標','規劃模式']:['GitHub','Google Drive','Documents…'];
   let g=card(x,y,cw,h,{stroke:G.c,sw:focus?4:2.5})+S.rect({x,y,width:cw,height:96,rx:20,fill:G.cl})+S.text(x+26,y+54,G.zh,{'font-size':32,'font-weight':800,fill:G.c})+S.text(x+26,y+84,G.en,{'font-size':19,fill:C.sub,'font-weight':600});
   list.forEach((s,j)=>{g+=S.circle({cx:x+36,cy:y+142+j*58,r:7,fill:G.c})+S.text(x+56,y+150+j*58,s,{'font-size':focus?30:25,'font-weight':focus?800:500,fill:C.ink})});
   if(focus)g+=pill(x+26,y+h-70,'本集重點 · This video',{size:21,fill:C.amber,color:'#fff'}).svg;
   if(k===1)g+=S.text(x+26,y+h-100,'不給材料，改變做法',{'font-size':22,fill:C.amber,'font-weight':700});
   o+=S.g({opacity:clamp(u*1.4),transform:`translate(0 ${(1-clamp(u*1.4))*24})`},g)});}
 return o;
};
function xIcon(r,y){return icon(r.i,20,y+3,.82,r.c||C.sub,2.6)}

// ── 4. Goals: one finish line, a verifiable condition, rounds of work, progress row ──
function goalComposer(w,lines,typed,label){
 let o=card(0,0,w,150,{rx:24});const total=lines.join('').length;let left=Math.round(total*clamp(typed));
 lines.forEach((ln,i)=>{const n=Math.min(ln.length,left);left-=n;const s=[...ln].slice(0,n).join('');if(s)o+=S.text(24,44+i*34,s,{'font-size':23,fill:C.ink,'font-weight':500,'font-family':i===0&&ln.startsWith('/')?undefined:undefined})});
 if(!typed)o+=S.text(24,44,'想做什麼都可以',{'font-size':23,fill:C.muted});
 o+=S.circle({cx:42,cy:118,r:20,fill:'#eef0f4'})+icon('plus',26,102,.68,C.ink,3.2)+icon('shield',76,103,.6,C.sub,2.8)+S.text(108,126,'代我核准',{'font-size':20,fill:C.sub});
 if(label)o+=S.text(w-20,126,label,{'font-size':18,fill:C.muted,'text-anchor':'end'});
 return o;
}
SCENES.goal=(sc,t,B)=>{
 const P=phaser(sc,t),us=P('set'),ust=P('stop'),ul=P('loop'),ue=P('end'),ur=P('row'),uc=P('chat');
 let o='';const LW=500;
 // + menu → 目標 (first half of 'set'), then the /goal text is typed
 const close=E.out(clamp((us-.42)/.18)),open=E.out(clamp((t-sc.start+.3)/.5));
 if(close<1){const s=lerp(.94,1,open)*lerp(1,.86,close);B.push({id:'g-menu',x:0,y:0,width:MENU_W,height:MENU_H,overlapGroup:'gui'});
  o+=S.g({transform:`translate(${(1-s)*40} ${(1-s)*MENU_H}) scale(${s})`,opacity:open*(1-close)},plusMenu(3,E.out(clamp(us/.2)),clamp((us-.2)/.22)));
  if(us>0){const k=E.inout(clamp(us/.2));o+=S.g({opacity:1-close},icon('cursor',lerp(360,250,k),lerp(520,ROW0+3*ROW+18,k),.9))}}
 const cy=460;B.push({id:'g-composer',x:0,y:cy,width:LW,height:150,overlapGroup:close<1?'gui':undefined});
 const chatting=uc>.15;
 o+=S.g({transform:`translate(0 ${cy})`},goalComposer(LW,chatting?['順便把按鈕改成藍色']:['/goal 完成 PLAN.md 三個里程碑，','每個都要通過測試'],chatting?clamp((uc-.15)/.4):clamp((us-.5)/.45),chatting?'目標執行中也能傳訊息':''));
 // progress row (illustration of the documented controls)
 const rowU=E.out(clamp(ur/.25));
 if(rowU>0){const y=318,h=124;B.push({id:'g-row',x:0,y,width:LW,height:h});
  const hit=k=>clamp((ur-.3-k*.15)/.12)*(1-clamp((ur-.42-k*.15)/.12));
  let g=card(0,y,LW,h,{rx:18,stroke:C.green,sw:2.5})+icon('goal',16,y+10,.75,C.green,3)+S.text(60,y+42,'目標進行中 · 里程碑 2/3',{'font-size':22,'font-weight':800,fill:C.ink})+S.text(LW-16,y+40,'示意',{'font-size':17,fill:C.muted,'text-anchor':'end'});
  [['⏸ 暫停'],['▶ 繼續'],['✎ 編輯'],['✕ 清除']].forEach(([l],k)=>{const x=14+k*120,h2=hit(k);g+=S.rect({x,y:y+68,width:112,height:40,rx:12,fill:h2>0?C.blue:C.row})+S.text(x+56,y+95,l,{'font-size':20,'font-weight':700,fill:h2>0?'#fff':C.ink,'text-anchor':'middle'})});
  o+=rise(rowU,g)}
 // blueprint route
 const BX=540,BW=1188,BH=610;B.push({id:'g-board',x:BX,y:0,width:BW,height:BH,overlapGroup:'gboard'});
 let b=S.rect({x:0,y:0,width:BW,height:BH,rx:24,fill:C.bp});
 for(let x=32;x<BW;x+=32)b+=S.line({x1:x,y1:0,x2:x,y2:BH,stroke:C.bpLine,'stroke-width':1});
 for(let y=32;y<BH;y+=32)b+=S.line({x1:0,y1:y,x2:BW,y2:y,stroke:C.bpLine,'stroke-width':1});
 b+=icon('goal',26,16,.8,C.bpMark,3)+S.text(70,48,'藍圖 · 航線與檢查點',{'font-size':25,'font-weight':700,fill:C.bpInk})+S.text(318,48,'Route & checkpoints',{'font-size':19,fill:C.bpSub});
 const pts=[[80,230],[330,170],[590,250],[840,170],[1090,220]];
 const routeU=E.inout(clamp((us-.45)/.5));
 const d='M'+pts.map(p=>p.join(' ')).join(' L');
 b+=S.path({d,stroke:C.bpInk,'stroke-width':4,fill:'none','stroke-dasharray':'12 9',opacity:routeU});
 pts.forEach(([x,y],i)=>{if(routeU<=i/4-.05)return;const fin=i===4,st=i===0;
  if(st)b+=S.circle({cx:x,cy:y,r:16,fill:C.bpInk})+S.text(x,y+48,'起點',{'font-size':20,fill:C.bpSub,'text-anchor':'middle'});
  else if(!fin){const done=i===1?clamp((ul-.45)/.1):i===2?clamp((ue-.5)/.1):0;b+=S.circle({cx:x,cy:y,r:22,fill:done>.5?C.green:C.bp,stroke:done>.5?'#7fe0b4':C.bpInk,'stroke-width':3})+(done>.5?icon('check',x-16,y-16,.66,'#fff',4.4):S.text(x,y+8,String(i),{'font-size':22,'font-weight':800,fill:C.bpInk,'text-anchor':'middle'}))+S.text(x,y+56,'檢查點 '+i,{'font-size':19,fill:C.bpSub,'text-anchor':'middle'})}
 });
 // finish line + verifiable condition
 const fu=E.back(clamp(ust/.3)),cu=E.out(clamp((ust-.35)/.3));
 if(fu>0){const [x,y]=pts[4];b+=S.g({opacity:clamp(fu*2)},S.line({x1:x,y1:y+20,x2:x,y2:y-70,stroke:'#fff','stroke-width':4})+S.path({d:`M${x} ${y-70} H${x+56} L${x+44} ${y-55} L${x+56} ${y-40} H${x}`,fill:C.bpMark})+S.text(x,y+52,'終點',{'font-size':21,'font-weight':800,fill:C.bpMark,'text-anchor':'middle'}))}
 if(cu>0){const x=760,y=300,w=396,h=92;B.push({id:'g-cond',x:BX+x,y,width:w,height:h,overlapGroup:'gboard'});
  b+=pop(cu,x+w/2,y+h/2,S.rect({x,y,width:w,height:h,rx:16,fill:C.greenL,stroke:C.green,'stroke-width':2.5})+S.text(x+22,y+38,'完成條件：測試全部通過',{'font-size':25,'font-weight':800,fill:C.green})+S.text(x+22,y+70,'Verifiable: all tests pass',{'font-size':19,fill:C.green}))}
 // Codex moves round after round: do → check → log
 const pos=clamp(.04+.3*E.inout(ul)+.2*E.inout(ue)+.04*ur);
 if(ul>0){const seg=pos*4,i=Math.min(3,Math.floor(seg)),f=seg-i,[x1,y1]=pts[i],[x2,y2]=pts[i+1],bxp=lerp(x1,x2,f),byp=lerp(y1,y2,f);
  const spin=(t*1.4)%(2*Math.PI);
  b+=S.g({opacity:clamp(ul*4)},S.circle({cx:bxp,cy:byp,r:58,fill:'none',stroke:C.bpMark,'stroke-width':3,'stroke-dasharray':'60 22','stroke-dashoffset':-spin*30})+
   S.rect({x:bxp-48,y:byp-18,width:96,height:36,rx:18,fill:C.blue})+S.text(bxp,byp+8,'Codex',{'font-size':20,'font-weight':800,fill:'#fff','text-anchor':'middle'}));
  b+=S.g({opacity:clamp(ul*3)},S.text(40,116,'每一輪：做 → 檢查 → 記錄',{'font-size':24,'font-weight':800,fill:C.bpMark})+S.text(352,116,'Each round: do → check → log',{'font-size':18,fill:C.bpSub}))}
 // progress log
 const logs=[['✓ 里程碑 1：測試通過','Milestone 1: tests pass',ul,.5],['… 里程碑 2：進行中','Milestone 2: in progress',ul,.75],['✓ 里程碑 2：測試通過','Milestone 2: tests pass',ue,.55]];
 const lU=E.out(clamp((ul-.3)/.2));
 if(lU>0){const x=40,y=420,w=560,h=166;B.push({id:'g-log',x:BX+x,y,width:w,height:h,overlapGroup:'gboard'});
  let g=S.rect({x,y,width:w,height:h,rx:16,fill:'#ffffff12',stroke:C.bpSub,'stroke-width':1.6})+S.text(x+20,y+36,'進度紀錄 Progress log',{'font-size':21,'font-weight':800,fill:C.bpInk});
  let row=0;logs.forEach(([zh,en,u,th],k)=>{if(u<th)return;if(k===1&&ue>=.55)return;g+=S.text(x+20,y+76+row*40,zh,{'font-size':22,fill:zh.startsWith('✓')?'#9ff0c9':C.bpMark,'font-weight':700})+S.text(x+20+tw(zh,22)+12,y+76+row*40,en,{'font-size':17,fill:C.bpSub});row++});
  b+=rise(lU,g)}
 // when does it stop?
 const eU=E.out(clamp(ue/.25));
 if(eU>0){const x=640,y=420,w=508,h=166;B.push({id:'g-stopwhen',x:BX+x,y,width:w,height:h,overlapGroup:'gboard'});
  let g=S.rect({x,y,width:w,height:h,rx:16,fill:'#ffffff12',stroke:C.bpSub,'stroke-width':1.6})+S.text(x+20,y+36,'什麼時候停？ When it stops',{'font-size':21,'font-weight':800,fill:C.bpInk});
  [['✓ 完成','Done'],['⏸ 你暫停','Paused'],['？需要你','Needs input']].forEach(([zh,en],k)=>{const u=E.back(clamp((ue-.1-k*.15)/.2));if(u<=0)return;const px=x+20+k*160;g+=pop(u,px+74,y+92,S.rect({x:px,y:y+60,width:148,height:64,rx:14,fill:'#fff'})+S.text(px+74,y+90,zh,{'font-size':22,'font-weight':800,fill:C.bp,'text-anchor':'middle'})+S.text(px+74,y+114,en,{'font-size':16,fill:C.muted,'text-anchor':'middle'}))});
  const hr=clamp((ue-.6)/.2);if(hr>0)g+=S.text(x+20,y+150,'可以獨立工作好幾個小時 · can run for hours',{'font-size':19,fill:C.bpMark,opacity:hr,'font-weight':700});
  b+=rise(eU,g)}
 // a chat message reaches Codex while the goal runs
 const fly=clamp((uc-.6)/.3);
 o+=S.g({transform:`translate(${BX} 0)`},b);
 if(fly>0&&fly<1){const x=lerp(250,BX+pts[2][0],E.inout(fly)),y=lerp(470,pts[2][1]-40,E.inout(fly));o+=S.g({opacity:1-clamp((fly-.8)/.2)},S.rect({x:x-80,y:y-20,width:160,height:40,rx:20,fill:C.amber})+S.text(x,y+8,'💬 新訊息',{'font-size':19,'font-weight':800,fill:'#fff','text-anchor':'middle'}))}
 return o;
};

// ── 5. Comparison table ──
SCENES.compare=(sc,t,B)=>{
 const P=phaser(sc,t),rows=['act','long','who','fit'];
 const COLS=[{zh:'一般對話',en:'Normal chat',i:'chat',c:C.sub,cl:'#eceef3'},{zh:'規劃模式',en:'Plan mode',i:'bulb',c:C.blue,cl:C.blueL},{zh:'目標',en:'Goal',i:'goal',c:C.green,cl:C.greenL}];
 const LAB=[['何時動手','When it acts'],['做多久','How long'],['誰決定停','Who stops it'],['適合','Best for']];
 const CELL=[[['馬上做','Acts right away'],['先問、先計畫，確認後才做','Asks & plans; builds after you approve'],['朝著終點一路做','Keeps going to the finish line']],
  [['一輪就回覆','One turn'],['來回問答，到計畫定案','Back and forth until the plan is set'],['連續很多輪，可達數小時','Many turns, even hours']],
  [['你','You'],['你（確認計畫）','You (approve the plan)'],['Codex 依完成條件判斷','Codex checks the condition']],
  [['小問題、一次能答完','Small, one-shot asks'],['方向不清楚、步驟多','Unclear direction, many steps'],['終點明確的大工作','Big job, clear finish line']]];
 let o='';const LX=0,LWc=260,G=16,CW=(1728-LWc-3*G)/3,HY=0,HH=96,RY=112,RH=116;
 const hu=E.out(clamp((t-sc.start+.2)/.6));
 COLS.forEach((c,k)=>{const x=LWc+G+k*(CW+G),u=E.out(clamp(hu*1.6-k*.25));if(u<=0)return;B.push({id:'col-'+k,x,y:HY,width:CW,height:HH});
  const iconSvg=c.i==='chat'?S.path({d:`M${x+28} ${HY+30} H${x+72} V${HY+62} H${x+48} L${x+38} ${HY+72} V${HY+62} H${x+28} Z`,stroke:c.c,'stroke-width':3,fill:'none','stroke-linejoin':'round'}):icon(c.i,x+24,HY+24,1,c.c,3);
  o+=rise(u,S.rect({x,y:HY,width:CW,height:HH,rx:18,fill:c.cl})+iconSvg+S.text(x+92,HY+52,c.zh,{'font-size':34,'font-weight':800,fill:c.c})+S.text(x+92,HY+80,c.en,{'font-size':19,fill:C.sub,'font-weight':600}))});
 rows.forEach((r,ri)=>{const u=P(r),y=RY+ri*(RH+8);if(u<=0)return;const fin=E.out(clamp(u/.2)),active=u<1&&P(rows[ri+1])<=0?1:0;
  B.push({id:'row-'+ri,x:0,y,width:1728,height:RH});
  let g=S.rect({x:0,y,width:1728,height:RH,rx:16,fill:active?'#fffbea':C.card,stroke:active?C.amber:'#e3e5ec','stroke-width':active?2.5:1.5});
  g+=S.text(24,y+54,LAB[ri][0],{'font-size':30,'font-weight':800,fill:ri===3?C.amber:C.ink})+S.text(24,y+86,LAB[ri][1],{'font-size':19,fill:C.muted,'font-weight':600});
  CELL[ri].forEach(([zh,en],k)=>{const cu=E.out(clamp((u-.08-k*.22)/.2));if(cu<=0)return;const x=LWc+G+k*(CW+G);g+=S.g({opacity:cu},S.text(x+24,y+54,zh,{'font-size':27,'font-weight':700,fill:COLS[k].c==C.sub?C.ink:COLS[k].c})+S.text(x+24,y+86,en,{'font-size':19,fill:C.sub}))});
  o+=rise(fin,g,16)});
 return o;
};

// ── 6. Demo: plan first, then set a goal ──
SCENES.demo=(sc,t,B)=>{
 const P=phaser(sc,t),up=P('problem'),ua=P('ask'),uan=P('answer'),um=P('planmd'),ug=P('goal'),ur=P('run'),ul=P('limit');
 let o='';const TW=780;
 // demo badge
 o+=pill(1728-150,0,'示範 DEMO',{size:20,fill:C.amberL,color:C.amber,w:150}).svg;B.push({id:'demo-badge',x:1578,y:0,width:150,height:36});
 // chat thread (left)
 B.push({id:'thread',x:0,y:0,width:TW,height:610});
 let g=card(0,0,TW,610,{rx:24,sh:.6});
 const bubble=(y,txt,u,me=true,w)=>{if(u<=0)return '';w=w||tw(txt,23)+44;const x=me?TW-24-w:24;return rise(u,S.rect({x,y,width:w,height:52,rx:18,fill:me?'#eef1f7':'#fff',stroke:me?undefined:C.line})+S.text(x+22,y+34,txt,{'font-size':23,fill:C.ink,'font-weight':500}),12)};
 g+=bubble(24,'幫我做一個課堂點名網頁',E.out(clamp(up/.3)));
 const tagU=E.out(clamp(ua/.15));if(tagU>0)g+=S.g({opacity:tagU},S.rect({x:24,y:36,width:150,height:34,rx:17,fill:C.blueL,stroke:C.blue,'stroke-width':2,'stroke-dasharray':'6 5'})+icon('bulb',30,38,.6,C.blue,3)+S.text(64,59,'規劃模式',{'font-size':19,'font-weight':800,fill:C.blue}));
 // Codex questions with options
 const qU=E.out(clamp((ua-.15)/.3));
 if(qU>0){const y=94,h=208;let q=S.rect({x:24,y,width:TW-48,height:h,rx:18,fill:'#fff',stroke:C.blue,'stroke-width':2})+S.text(46,y+36,'Codex 想先確認 2 件事',{'font-size':21,'font-weight':800,fill:C.blue});
  const QS=[['要不要登入？',['不用登入','用學號登入'],0],['名單放哪裡？',['上傳 CSV','手動輸入'],0]];
  QS.forEach(([qq,opts,ans],i)=>{const qy=y+62+i*72,qi=E.out(clamp((ua-.3-i*.25)/.25));if(qi<=0)return;let s=S.text(46,qy+30,qq,{'font-size':24,'font-weight':700,fill:C.ink});
   opts.forEach((op,k)=>{const sel=k===ans&&clamp((uan-.15-i*.3)/.15)>.5,x=250+k*200;s+=S.rect({x,y:qy,width:184,height:44,rx:12,fill:sel?C.blue:'#f6f7fa',stroke:sel?C.blue:C.line,'stroke-width':1.5})+S.text(x+92,qy+30,op,{'font-size':21,'font-weight':sel?800:500,fill:sel?'#fff':C.ink,'text-anchor':'middle'})});
   q+=S.g({opacity:qi},s)});
  g+=S.g({opacity:qU},q)}
 // plan written to PLAN.md
 const pmU=E.out(clamp(um/.3));
 if(pmU>0){const y=318;g+=rise(pmU,S.rect({x:24,y,width:TW-48,height:56,rx:18,fill:'#fff',stroke:C.line})+icon('file',36,y+5,.9,C.blue,2.6)+S.text(84,y+37,'計畫：3 個里程碑，已寫入 PLAN.md',{'font-size':23,fill:C.ink,'font-weight':600}),12)}
 // /goal message
 const gU=E.out(clamp(ug/.25));
 if(gU>0){const y=390,w=TW-48;g+=rise(gU,S.rect({x:24,y,width:w,height:92,rx:18,fill:C.greenL,stroke:C.green,'stroke-width':2})+icon('goal',38,y+8,.8,C.green,3)+S.text(84,y+40,'/goal 完成 PLAN.md 的三個里程碑，',{'font-size':23,fill:C.ink,'font-weight':700})+S.text(84,y+74,'每一個都要通過測試',{'font-size':23,fill:C.ink,'font-weight':700}),12)}
 // progress row
 const prU=E.out(clamp(ur/.15)),done=Math.min(3,Math.floor(clamp((ur-.1)/.7)*3+1e-6)+ (ur>=.8?1:0));
 if(prU>0){const y=498,w=TW-48;const k=ur>=.8?3:Math.max(1,Math.ceil(clamp((ur-.1)/.7)*3));let s=S.rect({x:24,y,width:w,height:88,rx:18,fill:'#fff',stroke:C.green,'stroke-width':2.5})+icon('goal',38,y+10,.72,C.green,3)+S.text(80,y+40,ur>=.8?'目標完成':'目標進行中',{'font-size':22,'font-weight':800,fill:ur>=.8?C.green:C.ink})+S.text(w,y+40,'里程碑 '+k+'/3',{'font-size':22,'font-weight':800,fill:C.green,'text-anchor':'end'});
  const bw=w-56,fill=clamp((ur-.05)/.75);s+=S.rect({x:52,y:y+56,width:bw,height:14,rx:7,fill:C.row})+S.rect({x:52,y:y+56,width:bw*fill,height:14,rx:7,fill:C.green});
  g+=rise(prU,s,12)}
 o+=g;
 // right side: unknown sketch → PLAN.md checklist → limits
 const RX=820,RW=1728-RX,limU=E.out(clamp(ul/.15));
 const skU=E.out(clamp(up/.4))*(1-E.out(clamp(um/.2)));
 if(skU>0){B.push({id:'sketch',x:RX,y:60,width:RW,height:520,overlapGroup:'right'});
  let s=card(RX,60,RW,520,{stroke:C.line,sw:2})+S.rect({x:RX,y:60,width:RW,height:46,rx:20,fill:'#eef0f4'})+S.circle({cx:RX+26,cy:83,r:7,fill:C.red})+S.circle({cx:RX+48,cy:83,r:7,fill:C.amber})+S.circle({cx:RX+70,cy:83,r:7,fill:C.green})+S.text(RX+100,90,'課堂點名 · 草稿',{'font-size':20,fill:C.sub});
  [[RX+40,140,RW-80,60],[RX+40,224,RW*.55,170],[RX+RW*.55+60,224,RW*.45-100,170],[RX+40,420,RW-80,60]].forEach(([x,y,w,h],i)=>{s+=S.rect({x,y,width:w,height:h,rx:12,fill:'none',stroke:C.muted,'stroke-width':2.4,'stroke-dasharray':'9 8'})});
  const qs=[[RX+300,175],[RX+250,320],[RX+RW-160,320],[RX+RW/2,455]];qs.forEach(([x,y],i)=>{const u=E.back(clamp((up-.35-i*.12)/.2));if(u>0)s+=pop(u,x,y,S.circle({cx:x,cy:y,r:24,fill:C.amber})+S.text(x,y+9,'?',{'font-size':28,'font-weight':900,fill:'#fff','text-anchor':'middle'}))});
  s+=S.text(RX+40,548,'細節還沒想好 · Details not decided yet',{'font-size':21,fill:C.sub});
  o+=S.g({opacity:skU},s)}
 const plU=E.out(clamp((um-.1)/.3));
 if(plU>0&&limU<1){const dim=1-limU;B.push({id:'planmd',x:RX,y:60,width:RW,height:520,overlapGroup:'right'});
  let s=card(RX,60,RW,520,{stroke:C.blue,sw:2.5})+icon('file',RX+28,80,1,C.blue,2.6)+S.text(RX+84,116,'PLAN.md',{'font-size':32,'font-weight':800,fill:C.ink,'font-family':MONO});
  const MS=[['讀入 CSV 名單','Load the CSV roster'],['點名畫面與按鈕','Check-in screen'],['匯出出席紀錄','Export attendance']];
  MS.forEach(([zh,en],i)=>{const y=160+i*110,u=E.out(clamp((um-.2-i*.15)/.25));if(u<=0)return;const ok=ur>0&&clamp((ur-.1)/.7)*3>=i+.95||ur>=.8,run=!ok&&ur>0&&Math.floor(clamp((ur-.1)/.7)*3)===i;
   s+=S.g({opacity:u},S.rect({x:RX+28,y,width:RW-56,height:94,rx:16,fill:ok?C.greenL:run?C.amberL:'#f7f8fb',stroke:ok?C.green:run?C.amber:C.line,'stroke-width':ok||run?2.5:1.5})+
    S.circle({cx:RX+72,cy:y+47,r:22,fill:ok?C.green:C.blue})+(ok?icon('check',RX+56,y+31,.66,'#fff',4.4):S.text(RX+72,y+56,String(i+1),{'font-size':23,'font-weight':800,fill:'#fff','text-anchor':'middle'}))+
    S.text(RX+112,y+44,'里程碑 '+(i+1)+'：'+zh,{'font-size':26,'font-weight':700,fill:C.ink})+S.text(RX+112,y+74,en,{'font-size':18,fill:C.sub})+
    (ok?S.text(RX+RW-50,y+56,'✓ 測試通過',{'font-size':21,'font-weight':800,fill:C.green,'text-anchor':'end'}):run?S.text(RX+RW-50,y+56,'進行中…',{'font-size':21,'font-weight':800,fill:C.amber,'text-anchor':'end'}):''))});
  const fin=E.out(clamp((ur-.82)/.15));if(fin>0)s+=S.g({opacity:fin},S.rect({x:RX+28,y:500,width:RW-56,height:60,rx:16,fill:C.green})+S.text(RX+RW/2,539,'✓ 網頁完成，測試全部通過 · Done — all tests pass',{'font-size':23,'font-weight':800,fill:'#fff','text-anchor':'middle'}));
  o+=S.g({opacity:plU*dim},s)}
 // limits overlay
 if(limU>0){const L=[['⚠ 長時間執行，用量較多','Long runs use more of your usage'],['⚠ 目標寫得模糊，可能越做越偏','A vague goal can drift'],['⚠ 規劃模式不鎖檔 → 用版本控制','Plan mode doesn\'t lock files → use version control']];
  L.forEach(([zh,en],i)=>{const u=E.back(clamp((ul-.05-i*.25)/.2));if(u<=0)return;const y=110+i*150,x=RX+30,w=RW-60,h=124;B.push({id:'limit-'+i,x,y,width:w,height:h,overlapGroup:'right'});
   o+=pop(u,x+w/2,y+h/2,card(x,y,w,h,{stroke:C.red,sw:2.5,fill:'#fff'})+S.text(x+28,y+54,zh,{'font-size':29,'font-weight':800,fill:C.red})+S.text(x+28,y+92,en,{'font-size':21,fill:C.sub}))});
  o+=S.g({opacity:limU},S.text(RX+30,80,'限制 Limits',{'font-size':26,'font-weight':800,fill:C.red}))}
 return o;
};

// ── 7. Outlook & recap ──
SCENES.outlook=(sc,t,B)=>{
 const P=phaser(sc,t),un=P('news'),utr=P('trend'),uo=P('open'),urc=P('recap');
 let o='';const G=24,W=(1728-2*G)/3,H=560,shrink=E.inout(clamp(urc/.3));
 const COL=[{zh:'已公布',en:'Announced',c:C.blue,cl:C.blueL,u:un,items:[['2026-06-09','手機版也能用 /goal','/goal on mobile'],['2026-07-20','接續中斷的目標','Resume interrupted goals'],['2026-04-30','CLI 建議改用規劃模式','CLI suggests Plan mode']]},
  {zh:'趨勢（推測）',en:'Trend (inference)',c:C.amber,cl:C.amberL,u:utr,items:[['','先規劃 → 交給長時間代理','Plan first, then a long-running agent'],['','可能成為常見流程','may become a common workflow']]},
  {zh:'未解問題',en:'Open questions',c:C.red,cl:C.redL,u:uo,items:[['','完成條件如何可靠驗證','Verifying completion reliably'],['','用量成本','Cost in usage']]}];
 COL.forEach((c,k)=>{const u=E.out(clamp(c.u/.25));if(u<=0)return;const x=k*(W+G),y=0;B.push({id:'ol-'+k,x,y,width:W,height:H,overlapGroup:shrink>0?'recap':undefined});
  let g=card(x,y,W,H,{stroke:c.c,sw:2.5})+S.rect({x,y,width:W,height:92,rx:20,fill:c.cl})+S.text(x+26,y+52,c.zh,{'font-size':33,'font-weight':800,fill:c.c})+S.text(x+26,y+80,c.en,{'font-size':19,fill:C.sub,'font-weight':600});
  c.items.forEach(([d,zh,en],j)=>{const iu=E.out(clamp((c.u-.15-j*.22)/.25));if(iu<=0)return;const iy=y+120+j*140;
   g+=rise(iu,S.rect({x:x+20,y:iy,width:W-40,height:120,rx:16,fill:'#fff7d6',stroke:'#e9d89a','stroke-width':1.5})+(d?S.text(x+40,iy+34,d,{'font-size':20,'font-weight':800,fill:c.c,'font-family':MONO}):'')+
    S.text(x+40,iy+(d?72:56),zh,{'font-size':26,'font-weight':800,fill:C.ink})+S.text(x+40,iy+(d?102:88),en,{'font-size':18,fill:C.sub}),12)});
  if(k===1)g+=S.text(x+26,y+H-22,'推測，非官方公布 · inference',{'font-size':18,fill:C.amber,'font-weight':700});
  o+=S.g({opacity:u*(1-.8*shrink)},g)});
 if(shrink>0){const w=1280,h=300,x=(1728-w)/2,y=150;B.push({id:'recap',x,y,width:w,height:h,overlapGroup:'recap'});
  o+=pop(shrink,864,y+h/2,card(x,y,w,h,{rx:28,stroke:C.ink,sw:3})+icon('bulb',x+60,y+60,1.5,C.blue,2.4)+S.text(x+150,y+108,'先規劃，把方向問清楚；',{'font-size':48,'font-weight':900,fill:C.blue})+
   icon('goal',x+60,y+150,1.5,C.green,2.4)+S.text(x+150,y+198,'再設目標，讓它做到完成。',{'font-size':48,'font-weight':900,fill:C.green})+
   S.text(x+150,y+258,'Plan to get the direction right; set a goal to see it through.',{'font-size':24,fill:C.sub,'font-weight':600}),.85)}
 return o;
};
