// Scene renderers for "Codex + menu: Plan mode & Goals". Each returns SVG markup for the 1728x610
// visual area as a pure function of (scene, time). Custom geometry goes to B for automated overlap QA.
// Main style: rebuilt Traditional-Chinese Codex UI with callouts; support style: blueprint board.
const C={ink:'#1d1f2a',sub:'#4a4f63',muted:'#8a8fa3',blue:'#3d6ef0',blueL:'#e3eafe',green:'#14875f',greenL:'#dcf2e9',amber:'#b97a10',amberL:'#fcf0d6',red:'#c8423a',redL:'#fbe3e0',card:'#ffffff',line:'#d5d8e2',row:'#eef1f7',
 bp:'#1f3a6b',bpLine:'#ffffff16',bpInk:'#e6efff',bpSub:'#a9c1ee',bpMark:'#ffd36b'};
const clamp=x=>Math.min(1,Math.max(0,x)),lerp=(a,b,u)=>a+(b-a)*u;
const E={out:x=>1-Math.pow(1-clamp(x),3),inout:x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},back:x=>{x=clamp(x);const c=1.4;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function attrs(a){return Object.entries(a).filter(([,v])=>v!==undefined&&v!==null).map(([k,v])=>k+'="'+esc(v)+'"').join(' ')}
const S={rect:a=>'<rect '+attrs(a)+'/>',text:(x,y,s,a={})=>'<text '+attrs({x,y,...a})+'>'+esc(s)+'</text>',g:(a,inner)=>'<g '+attrs(a)+'>'+inner+'</g>',path:a=>'<path '+attrs(a)+'/>',circle:a=>'<circle '+attrs(a)+'/>',line:a=>'<line '+attrs(a)+'/>'};
function phaser(scene,t){const map={};for(const p of scene.phases)map[p.name]=p;return n=>{const p=map[n];if(!p)return t>=scene.end?1:0;return clamp((t-p.start)/Math.max(.001,p.end-p.start))}}
const tw=(s,size)=>[...s].reduce((w,ch)=>w+(/[　-鿿＀-￯]/.test(ch)?size:size*.56),0);
const MONO='Consolas,"Lesson Latin",monospace';

// ── icons (line style, 1.0 = 48px box, origin top-left) ──
function icon(kind,x,y,s=1,color=C.ink,sw=3){
 const st={stroke:color,'stroke-width':sw,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'};
 const P=d=>S.path({d,...st});
 const body={
  clip:P('M30 14 L17 27 Q13 31 17 35 Q21 39 25 35 L37 23 Q43 17 37 11 Q31 5 25 11 L12 24 Q6 30 12 36'),
  globe:S.circle({cx:24,cy:24,r:16,...st})+P('M8 24 H40')+P('M24 8 Q14 24 24 40 Q34 24 24 8'),
  folder:P('M6 14 Q6 11 9 11 H19 L23 15 H39 Q42 15 42 18 V35 Q42 38 39 38 H9 Q6 38 6 35 Z'),
  goal:P('M38 22 A15 15 0 1 1 26 9')+P('M30 24 A6 6 0 1 1 24 18')+P('M24 24 L38 10')+P('M33 10 H38 V15'),
  bulb:P('M17 30 Q11 25 11 19 A13 13 0 0 1 37 19 Q37 25 31 30 V34 H17 Z')+P('M18 39 H30')+P('M21 43 H27'),
  draw:P('M6 34 Q12 14 18 30 Q24 44 30 22 Q34 10 42 18'),
  file:P('M13 7 H29 L37 15 V41 H13 Z')+P('M29 7 V15 H37'),
  check:P('M10 25 L20 34 L38 14'),
  plus:P('M24 12 V36')+P('M12 24 H36'),
  shield:P('M24 7 L38 12 V23 Q38 35 24 41 Q10 35 10 23 V12 Z'),
  lock:P('M14 22 H34 V40 H14 Z')+P('M18 22 V16 A6 6 0 0 1 30 16 V22'),
  unlock:P('M14 22 H34 V40 H14 Z')+P('M18 22 V16 A6 6 0 0 1 30 14'),
  lens:S.circle({cx:21,cy:21,r:12,...st})+P('M30 30 L41 41'),
  cursor:S.path({d:'M10 6 L10 38 L18 30 L24 43 L30 40 L24 28 L35 28 Z',fill:'#fff',stroke:C.ink,'stroke-width':2.4,'stroke-linejoin':'round'})
 }[kind];
 return S.g({transform:`translate(${x} ${y}) scale(${s})`},body);
}
const shadow=(x,y,w,h,rx,op=1)=>S.rect({x,y:y+10,width:w,height:h,rx,fill:'#1d1f2a',opacity:.07*op})+S.rect({x,y:y+3,width:w,height:h,rx,fill:'#1d1f2a',opacity:.05*op});
const bi=(x,y,zh,en,o={})=>S.text(x,y,zh,{'font-size':o.zs||30,'font-weight':o.zw||700,fill:o.zc||C.ink,'text-anchor':o.anchor||'start'})+(en?S.text(x,y+(o.gap||28),en,{'font-size':o.es||20,fill:o.ec||C.muted,'text-anchor':o.anchor||'start','font-weight':500}):'');
function badge(x,y,label,u,fill=C.blue){if(u<=0)return '';const w=tw(label,22)+34,s=lerp(.6,1,E.back(u));return S.g({transform:`translate(${x} ${y}) scale(${s})`,opacity:clamp(u*2)},S.rect({x:-w/2,y:-20,width:w,height:40,rx:20,fill})+S.text(0,8,label,{'text-anchor':'middle','font-size':22,'font-weight':700,fill:'#fff'}))}
const ripple=(cx,cy,u,r=120)=>u>0&&u<1?S.circle({cx,cy,r:lerp(8,r,E.out(u)),fill:C.blue,opacity:.18*(1-u)}):'';

// ── "+" menu rebuilt from the app (新增 section, Traditional Chinese UI) ──
const MENU=[{i:'clip',zh:'檔案和資料夾',d:''},{i:'globe',zh:'附加 Google Chrome',d:''},{i:'folder',zh:'在專案中工作',d:'為新聊天選擇專案'},
 {i:'goal',zh:'目標',d:'設定要持續追求的目標'},{i:'bulb',zh:'規劃模式',d:'開啟規劃模式'},{i:'draw',zh:'繪圖',d:'繪製草圖',c:'#2fa58a'}];
const MENU_W=500,MENU_H=430,ROW=58,ROW0=62;
function plusMenu(hi,hiU,clickU){
 let o=shadow(0,0,MENU_W,MENU_H,22)+S.rect({x:0,y:0,width:MENU_W,height:MENU_H,rx:22,fill:C.card,stroke:'#e3e5ec','stroke-width':1.5});
 o+=S.text(26,44,'新增',{'font-size':22,fill:C.muted,'font-weight':500});
 if(hi>=0&&hiU>0)o+=S.rect({x:10,y:ROW0+hi*ROW,width:MENU_W-20,height:ROW-4,rx:12,fill:C.row,opacity:hiU});
 if(hi>=0)o+=ripple(250,ROW0+hi*ROW+27,clickU,260);
 MENU.forEach((m,k)=>{const y=ROW0+k*ROW;o+=icon(m.i,22,y+5,.9,m.c||C.sub,2.6)+S.text(74,y+37,m.zh,{'font-size':26,fill:C.ink,'font-weight':500});
  if(m.d)o+=S.text(74+tw(m.zh,26)+14,y+37,m.d,{'font-size':21,fill:C.muted})});
 o+=S.text(26,ROW0+6*ROW+30,'外掛程式 · GitHub、Google Drive…',{'font-size':20,fill:C.muted});
 return o;
}
// composer (輸入框) rebuilt: text line + bottom row with "+" and 代我核准
function composer(w,text,typed,plusU,tag){
 let o=shadow(0,0,w,124,24)+S.rect({x:0,y:0,width:w,height:124,rx:24,fill:C.card,stroke:'#dfe2ea','stroke-width':1.5});
 const shown=[...text].slice(0,Math.round([...text].length*clamp(typed))).join('');
 o+=shown?S.text(24,46,shown,{'font-size':25,fill:C.ink,'font-weight':500}):S.text(24,46,'想做什麼都可以',{'font-size':24,fill:C.muted});
 o+=S.circle({cx:42,cy:92,r:22,fill:plusU>0?C.blueL:'#eef0f4'})+icon('plus',24,74,.75,plusU>0?C.blue:C.ink,3.2);
 o+=icon('shield',78,76,.66,C.sub,2.8)+S.text(114,101,'代我核准',{'font-size':21,fill:C.sub});
 if(tag>0)o+=S.g({opacity:tag},S.rect({x:w-212,y:74,width:196,height:38,rx:19,fill:C.blueL,stroke:C.blue,'stroke-width':2,'stroke-dasharray':'6 5'})+icon('bulb',w-204,77,.68,C.blue,3)+S.text(w-170,100,'規劃模式：開啟',{'font-size':20,'font-weight':700,fill:C.blue}));
 return o;
}

const SCENES={};
SCENES.title=(sc)=>S.text(864,300,sc.screen||'',{'text-anchor':'middle','font-size':40,fill:C.ink});

// ── Principle core shot: Plan mode = read → ask (with options) → plan → you approve → build ──
const FILES=['index.html','app.js','roster.csv'];
const NOTES=[{q:'誰會使用？',qe:'Who uses it?',a:'老師點名',ae:'Teacher check-in'},
 {q:'名單從哪裡來？',qe:'Where is the roster from?',a:'上傳 CSV 檔',ae:'Upload a CSV'},
 {q:'紀錄要保存嗎？',qe:'Keep the records?',a:'匯出出席紀錄',ae:'Export attendance'}];
const OPTS=[['上傳 CSV 檔','Upload a CSV'],['每次手動輸入','Type it in each time'],['其他…（自己填寫）','Other (write your own)']];
const STEPS=[['讀入 CSV 名單','Load the CSV roster'],['點名畫面與按鈕','Check-in screen'],['匯出出席紀錄','Export attendance']];
SCENES.plan=(sc,t,B)=>{
 const P=phaser(sc,t),has=n=>sc.phases.some(p=>p.name===n),ur=P('read'),uq=P('question'),up=P('plan'),ug=P('go'),urv=P('revise'),uw=P('when');
 // episode: 'menu' (entry points) + 'lock' (no edits yet); sample: one 'menu' phase covers both
 const hasLock=has('lock'),um=hasLock?(P('lock')>0?.47+.53*P('lock'):.47*P('menu')):P('menu'),uEntry=hasLock?P('menu'):0;
 const qSel=hasLock?.3:.5,ownU=hasLock?clamp((uq-.55)/.15):0;
 let o='';
 // left column: + menu above the composer, then the camera lifts the composer and reveals the files
 const open=E.out(clamp((t-sc.start+.3)/.5)),close=E.out(clamp((um-.42)/.2)),cm=E.inout(clamp((um-.48)/.32));
 const cy=lerp(470,0,cm),filesU=E.out(clamp((um-.8)/.2));
 const moving=cm>0&&cm<1;
 if(close<1){const s=lerp(.94,1,open)*lerp(1,.86,close);
  B.push({id:'plus-menu',x:0,y:0,width:MENU_W,height:MENU_H,overlapGroup:'ui'});
  o+=S.g({transform:`translate(${(1-s)*40} ${(1-s)*MENU_H}) scale(${s})`,opacity:open*(1-close)},plusMenu(4,E.out(clamp(um/.22)),clamp((um-.22)/.24)))}
 B.push({id:'composer',x:0,y:cy,width:MENU_W,height:124,overlapGroup:moving||close<1?'ui':undefined});
 o+=S.g({transform:`translate(0 ${cy})`},composer(MENU_W,'幫我做一個課堂點名網頁',clamp((um-.55)/.35),close<1?1:0,E.out(clamp((um-.3)/.2))));
 // pointer travels to 規劃模式 and clicks
 if(close<1&&um>0){const k=E.inout(clamp(um/.22));o+=S.g({opacity:1-close},icon('cursor',lerp(360,300,k),lerp(520,ROW0+4*ROW+18,k),.9))}
 // files panel with lock badges (plan mode: no edits yet)
 const fy=158,fh=344;
 if(filesU>0){B.push({id:'files',x:0,y:fy,width:MENU_W,height:fh,overlapGroup:moving?'ui':undefined});
  let f=shadow(0,0,MENU_W,fh,22)+S.rect({x:0,y:0,width:MENU_W,height:fh,rx:22,fill:C.card,stroke:'#e3e5ec','stroke-width':1.5});
  f+=icon('folder',20,16,.8,C.blue,2.8)+S.text(66,50,'專案檔案',{'font-size':25,'font-weight':700,fill:C.ink})+S.text(178,50,'my-class',{'font-size':20,fill:C.muted,'font-family':MONO});
  const unlock=E.out(clamp((ug-.35)/.2)),edit=E.out(clamp((ug-.55)/.2));
  FILES.forEach((n,i)=>{const y=76+i*84,hot=i===1&&edit>0,scan=ur>0&&ur<1&&Math.abs(ur*3-.5-i)<.6;
   f+=S.rect({x:18,y,width:MENU_W-36,height:68,rx:14,fill:hot?C.amberL:scan?C.blueL:'#f7f8fb',stroke:hot?C.amber:scan?C.blue:C.line,'stroke-width':hot||scan?2.4:1.4});
   f+=icon('file',30,y+10,.92,C.sub,2.4)+S.text(82,y+43,n,{'font-size':24,fill:C.ink,'font-family':MONO});
   const lx=MENU_W-170;
   if(hot)f+=S.rect({x:lx,y:y+16,width:136,height:36,rx:18,fill:C.amber})+S.text(lx+68,y+41,'✎ 修改中',{'font-size':20,'font-weight':700,fill:'#fff','text-anchor':'middle'});
   else f+=S.g({opacity:1},S.rect({x:lx,y:y+16,width:136,height:36,rx:18,fill:unlock>.5?C.greenL:C.row})+icon(unlock>.5?'unlock':'lock',lx+8,y+18,.66,unlock>.5?C.green:C.sub,3)+S.text(lx+82,y+41,unlock>.5?'可動手':'未修改',{'font-size':20,'font-weight':700,fill:unlock>.5?C.green:C.sub,'text-anchor':'middle'}));
  });
  o+=S.g({transform:`translate(0 ${fy}) translate(0 ${(1-filesU)*24})`,opacity:filesU},f);
  // magnifier sweeps the files while Codex reads
  if(ur>0&&ur<1){const k=clamp(ur*1.25);o+=icon('lens',MENU_W-240,fy+64+k*168,1.05,C.blue,3.6)}
 }
 // approve button
 const btnU=E.out(clamp(ug/.18));
 if(btnU>0){const by=524;B.push({id:'go-btn',x:0,y:by,width:MENU_W,height:72});
  o+=S.g({opacity:btnU,transform:`translate(0 ${(1-btnU)*16})`},S.rect({x:0,y:by,width:MENU_W,height:72,rx:20,fill:C.blue})+ripple(MENU_W/2,by+36,clamp((ug-.22)/.25),260)+
   S.text(MENU_W/2,by+34,'✓ 確認計畫，開始實作',{'font-size':26,'font-weight':800,fill:'#fff','text-anchor':'middle'})+S.text(MENU_W/2,by+60,'Approve the plan & build',{'font-size':18,fill:'#dbe5ff','text-anchor':'middle'}))}
 // blueprint board
 const BX=540,BW=1188,BH=610,boardU=E.out(clamp((t-sc.start+.3)/.6));
 B.push({id:'board',x:BX,y:0,width:BW,height:BH,overlapGroup:'board'});
 let b=S.rect({x:0,y:0,width:BW,height:BH,rx:24,fill:C.bp});
 for(let x=32;x<BW;x+=32)b+=S.line({x1:x,y1:0,x2:x,y2:BH,stroke:C.bpLine,'stroke-width':1});
 for(let y=32;y<BH;y+=32)b+=S.line({x1:0,y1:y,x2:BW,y2:y,stroke:C.bpLine,'stroke-width':1});
 const wU=E.out(clamp(uw/.2));
 b+=icon('bulb',26,16,.8,C.bpMark,3);
 if(wU<1)b+=S.g({opacity:1-wU},S.text(70,48,'藍圖 · 計畫草稿',{'font-size':25,'font-weight':700,fill:C.bpInk})+S.text(276,48,'Blueprint · draft plan',{'font-size':19,fill:C.bpSub}));
 if(wU>0)b+=S.g({opacity:wU},S.text(70,48,'官方建議：複雜 · 模糊 · 難以說清楚的任務，先規劃',{'font-size':25,'font-weight':800,fill:C.bpMark})+S.text(70+tw('官方建議：複雜 · 模糊 · 難以說清楚的任務，先規劃',25)+14,48,'Plan first when a task is complex or ambiguous',{'font-size':18,fill:C.bpSub}));
 // episode: three ways to turn Plan mode on, shown while the narration lists them
 const entryOut=E.out(clamp(um>.47?(um-.47)/.12:0));
 if(uEntry>0&&entryOut<1){const items=[['＋ 選單 → 規劃模式','+ menu → Plan mode'],['/plan','slash command'],['Shift + Tab','keyboard']];
  items.forEach(([a,e],i)=>{const u=E.back(clamp((uEntry-.12-i*.2)/.2));if(u<=0)return;const w=332,x=56+i*(w+36),y=200;
   B.push({id:'entry-'+i,x:BX+x,y,width:w,height:132,overlapGroup:'board'});
   b+=S.g({opacity:clamp(u*2)*(1-entryOut),transform:`translate(${x+w/2} ${y+66}) scale(${lerp(.7,1,u)}) translate(${-w/2} -66)`},S.rect({x:0,y:0,width:w,height:132,rx:20,fill:'#ffffff14',stroke:C.bpInk,'stroke-width':2.4})+
    S.circle({cx:40,cy:40,r:20,fill:C.bpMark})+S.text(40,49,String(i+1),{'font-size':24,'font-weight':800,fill:C.bp,'text-anchor':'middle'})+
    S.text(w/2,78,a,{'font-size':i?34:28,'font-weight':800,fill:'#fff','text-anchor':'middle','font-family':i===1?MONO:undefined})+S.text(w/2,112,e,{'font-size':19,fill:C.bpSub,'text-anchor':'middle'}))});
 }
 // unclear spots found while reading → resolved by the answers
 NOTES.forEach((n,i)=>{const u=E.back(clamp((ur-.22-i*.2)/.25));if(u<=0)return;const x=32,y=78+i*92,w=470,h=76;
  const res=i===1?clamp((uq-qSel-.12)/.12):clamp((uq-.84-(i?0.08:0))/.08);
  B.push({id:'note-'+i,x:BX+x,y:y,width:w,height:h,overlapGroup:'board'});
  b+=S.g({transform:`translate(${x} ${y}) scale(${lerp(.7,1,u)})`,opacity:clamp(u*1.5)},
   S.rect({x:0,y:0,width:w,height:h,rx:14,fill:res>.5?C.greenL:'#fff3cf',stroke:res>.5?C.green:C.amber,'stroke-width':2.4})+
   S.circle({cx:38,cy:38,r:20,fill:res>.5?C.green:C.amber})+(res>.5?icon('check',22,22,.66,'#fff',4.4):S.text(38,47,'?',{'font-size':26,'font-weight':800,fill:'#fff','text-anchor':'middle'}))+
   bi(74,34,res>.5?n.a:n.q,res>.5?n.ae:n.qe,{zs:25,es:18,zc:res>.5?C.green:C.ink,gap:26}));
 });
 // question card with options (overlaid on the board on purpose)
 const qU=E.back(clamp(uq/.28)),sel=clamp((uq-qSel)/.14);
 if(qU>0){const x=540,y=74,w=616,h=292;B.push({id:'q-card',x:BX+x,y,width:w,height:h,overlapGroup:'board'});
  let q=shadow(0,0,w,h,20)+S.rect({x:0,y:0,width:w,height:h,rx:20,fill:C.card});
  q+=S.text(26,40,'Codex 想先確認',{'font-size':21,'font-weight':700,fill:C.blue})+S.text(186,40,'Codex asks first',{'font-size':17,fill:C.muted});
  q+=bi(26,86,'名單從哪裡來？','Where does the roster come from?',{zs:29,es:19,gap:28});
  OPTS.forEach(([zh,en],k)=>{const oy=134+k*50,on=k===0&&sel>0;
   q+=S.rect({x:20,y:oy,width:w-40,height:44,rx:12,fill:on?C.blueL:'#f6f7fa',stroke:on?C.blue:C.line,'stroke-width':on?2.4:1.2,opacity:on?1:1});
   q+=S.circle({cx:46,cy:oy+22,r:10,fill:'#fff',stroke:on?C.blue:C.muted,'stroke-width':2.4})+(on?S.circle({cx:46,cy:oy+22,r:5,fill:C.blue}):'');
   q+=S.text(68,oy+30,zh,{'font-size':22,fill:C.ink,'font-weight':on?700:500})+S.text(68+tw(zh,22)+14,oy+30,en,{'font-size':17,fill:C.muted});
   if(k===0)q+=ripple(w/2,oy+22,clamp((uq-qSel)/.3),300);
   // "Other" lets you write your own answer
   const own=k===2?ownU*(1-clamp(up*3)):0;
   if(own>0)q+=S.g({opacity:own},S.rect({x:18,y:oy-2,width:w-36,height:48,rx:13,fill:'none',stroke:C.amber,'stroke-width':3})+
    S.rect({x:w-184,y:oy+6,width:156,height:32,rx:16,fill:C.amber})+S.text(w-106,oy+29,'✎ 可自己填答',{'font-size':18,'font-weight':800,fill:'#fff','text-anchor':'middle'}));
  });
  b+=S.g({transform:`translate(${x+w/2} ${y+h/2}) scale(${lerp(.82,1,qU)}) translate(${-w/2} ${-h/2})`,opacity:clamp(qU*1.6)},q);
 }
 // the plan is drawn step by step
 const py=420;
 if(up>0)b+=S.text(32,py-14,'計畫 PLAN',{'font-size':22,'font-weight':800,fill:C.bpMark,opacity:clamp(up*4)});
 const sw=332,gap=64,sh=150;
 STEPS.forEach(([zh,en],i)=>{const u=clamp((up-i*.24)/.4);if(u<=0)return;const x=32+i*(sw+gap),per=2*(sw+sh);
  B.push({id:'step-'+i,x:BX+x,y:py,width:sw,height:sh,overlapGroup:'board'});
  const active=i===0?E.out(clamp((ug-.5)/.2)):0;
  b+=S.rect({x,y:py,width:sw,height:sh,rx:16,fill:active>0?C.green:'#ffffff',['fill-opacity']:active>0?1:.06*clamp((u-.5)/.4),stroke:active>0?'#7fe0b4':C.bpInk,'stroke-width':2.6,'stroke-dasharray':per,'stroke-dashoffset':per*(1-E.inout(u))});
  const tu=clamp((u-.45)/.4),rv=i===1?clamp((urv-.25)/.15):0,flash=i===1&&urv>0&&ug<=0?Math.sin(Math.PI*clamp(urv/.6)):0;
  if(flash>0)b+=S.rect({x:x-5,y:py-5,width:sw+10,height:sh+10,rx:20,fill:'none',stroke:C.bpMark,'stroke-width':4,opacity:flash});
  const [lz,le]=rv>.5?['點名畫面＋學號搜尋','Check-in + ID search']:[zh,en];
  b+=S.g({opacity:tu},S.circle({cx:x+40,cy:py+46,r:21,fill:active>0?'#fff':C.bpMark})+S.text(x+40,py+55,String(i+1),{'font-size':24,'font-weight':800,fill:active>0?C.green:C.bp,'text-anchor':'middle'})+
   bi(x+76,py+56,lz,le,{zs:lz.length>8?23:26,es:19,zc:'#fff',ec:active>0?'#d9f6ea':C.bpSub,gap:30}));
  if(rv>0)b+=S.g({opacity:rv},S.rect({x:x+sw-138,y:py+sh-50,width:122,height:34,rx:17,fill:C.bpMark})+S.text(x+sw-77,py+sh-26,'✎ 已修改',{'font-size':19,'font-weight':800,fill:C.bp,'text-anchor':'middle'}));
  if(active>0)b+=S.g({opacity:active},S.rect({x:x+sw-138,y:py+sh-50,width:122,height:34,rx:17,fill:'#fff'})+S.text(x+sw-77,py+sh-26,'進行中',{'font-size':19,'font-weight':800,fill:C.green,'text-anchor':'middle'}));
  if(i<2){const au=clamp((up-i*.24-.3)/.2);if(au>0)b+=S.path({d:`M${x+sw+10} ${py+sh/2} H${x+sw+10+(gap-22)*au}`,stroke:C.bpInk,'stroke-width':3,'stroke-dasharray':'7 6'})+(au>=1?S.path({d:`M${x+sw+gap-22} ${py+sh/2-8} L${x+sw+gap-12} ${py+sh/2} L${x+sw+gap-22} ${py+sh/2+8}`,stroke:C.bpInk,'stroke-width':3,fill:'none'}):'')}
 });
 o+=S.g({opacity:boardU,transform:`translate(${BX+(1-boardU)*30} 0)`},b);
 // Codex badge travels from the approve button to step 1
 const tr=clamp((ug-.45)/.35);
 if(tr>0&&tr<1)o+=badge(lerp(MENU_W/2,BX+32+sw/2,E.inout(tr)),lerp(520,py-6,E.inout(tr)),'Codex',1);
 if(tr>=1)o+=badge(BX+32+sw/2,py-2,'Codex',1);
 return o;
};
