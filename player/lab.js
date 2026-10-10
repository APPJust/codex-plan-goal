// Interactive checks tied to the learning goal: pick normal chat / Plan mode / Goal for a task
// (official docs: plan when a task is complex or ambiguous; goals need a verifiable stopping condition).
(function(){
 const KEYS={chat:'一般對話',plan:'規劃模式',goal:'目標'};
 const Q=[
  {q:'把這段錯誤訊息翻成中文，順便說明意思。',a:'chat',why:'一次就能回答完，不需要先規劃，也不必持續多輪。'},
  {q:'我想做一個課堂點名網頁，但還沒想好要不要登入、名單放哪裡。',a:'plan',why:'需求還模糊：先讓 Codex 讀專案、用選項問清楚，再提出分步驟計畫。'},
  {q:'依照 PLAN.md 完成三個里程碑，每個里程碑都要通過測試。',a:'goal',why:'有明確終點與可驗證的完成條件（測試通過），適合讓 Codex 持續做到完成。'},
  {q:'把整個專案從舊框架搬到新框架，但我還不確定要分幾步。',a:'plan',why:'先規劃把步驟與風險問清楚；計畫定案後，再設目標讓它做到完成。'}
 ];
 const GOALS=[
  {text:'/goal 把網站弄得更好一點',ok:false,why:'沒有完成條件：Codex 無法判斷什麼時候算「完成」。'},
  {text:'/goal 完成 PLAN.md 的三個里程碑；每個里程碑跑 npm test 全部通過；不要修改 data/ 資料夾',ok:true,why:'一個目標、可驗證的停止條件（測試通過），也寫清楚不能改的範圍。'}
 ];
 const el=document.getElementById('lab');if(!el)return;
 let html='<h2>互動練習：該開哪一個？</h2><p class="fine">依官方文件：複雜、模糊的任務先用規劃模式；有明確終點與可驗證條件的長任務用目標。</p><div class="lab-grid">';
 Q.forEach((x,i)=>{html+=`<div class="lab-card"><p><strong>情境 ${i+1}</strong>：${x.q}</p><div class="steps">`+Object.entries(KEYS).map(([k,v])=>`<button data-i="${i}" data-k="${k}">${v}</button>`).join('')+`</div><p class="feedback" id="fb${i}" aria-live="polite"></p></div>`});
 html+='</div><h2 style="margin-top:22px">哪一個目標寫得好？</h2><div class="lab-grid">';
 GOALS.forEach((g,i)=>{html+=`<div class="lab-card"><p><code>${g.text}</code></p><div class="steps"><button data-g="${i}">選這個</button></div><p class="feedback" id="gfb${i}" aria-live="polite"></p></div>`});
 html+='</div>';el.innerHTML=html;
 el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.i!==undefined){const x=Q[b.dataset.i],fb=document.getElementById('fb'+b.dataset.i),ok=b.dataset.k===x.a;fb.className='feedback '+(ok?'ok':'bad');fb.textContent=(ok?'正確！':'再想想：這題比較適合「'+KEYS[x.a]+'」。')+x.why}
  if(b.dataset.g!==undefined){const g=GOALS[b.dataset.g],fb=document.getElementById('gfb'+b.dataset.g);fb.className='feedback '+(g.ok?'ok':'bad');fb.textContent=(g.ok?'正確！':'再想想：')+g.why}
 });
 window.labInfo={keys:Object.keys(KEYS),answers:Q.map(x=>x.a)};
})();
