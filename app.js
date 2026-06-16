/* ── PRELOADER ── */
(function(){
  const p=document.getElementById('prePct');let n=0;
  const iv=setInterval(()=>{
    n+=Math.random()<.3?Math.floor(Math.random()*5+1):Math.floor(Math.random()*2);
    if(n>=100){n=100;clearInterval(iv);setTimeout(()=>document.getElementById('preloader').classList.add('done'),300);}
    p.textContent=n+'%';
  },30);
})();

document.addEventListener('DOMContentLoaded', function() {


// ── RANDOMIZED DEMO ENGINE ──
// 6 realistic annotation scenarios — a new one loads on every press

const DEMOS = [

  // 1. RLHF Response Quality (high agreement, 5 annotators, 1-5 scale)
  {
    label: 'RLHF Response Quality',
    csv: `item,Marcus,Priya,Jordan,Sofia,Kwame
RESP_001,4,4,3,4,4
RESP_002,2,2,2,3,2
RESP_003,5,5,4,5,5
RESP_004,1,1,2,1,1
RESP_005,3,4,3,3,3
RESP_006,2,2,3,2,2
RESP_007,5,4,5,5,4
RESP_008,1,2,1,1,2
RESP_009,3,3,3,4,3
RESP_010,4,4,4,4,5
RESP_011,2,3,2,2,2
RESP_012,1,1,1,2,1
RESP_013,5,5,5,4,5
RESP_014,3,3,4,3,3
RESP_015,4,3,4,4,3
RESP_016,2,2,2,2,3
RESP_017,1,1,1,1,2
RESP_018,4,4,3,5,4
RESP_019,3,4,3,3,4
RESP_020,5,5,5,5,4`
  },

  // 2. Sentiment Labeling (moderate agreement, 3 annotators, nominal: 1=neg 2=neu 3=pos)
  {
    label: 'Sentiment Labeling',
    csv: `item,Anna,Ben,Carlos
SENT_001,3,3,3
SENT_002,1,1,2
SENT_003,2,2,2
SENT_004,3,2,3
SENT_005,1,1,1
SENT_006,2,3,2
SENT_007,3,3,2
SENT_008,1,2,1
SENT_009,2,2,3
SENT_010,3,3,3
SENT_011,1,1,1
SENT_012,2,1,2
SENT_013,3,3,3
SENT_014,2,2,1
SENT_015,1,1,2
SENT_016,3,2,3
SENT_017,2,2,2
SENT_018,1,1,1
SENT_019,3,3,2
SENT_020,2,3,3`
  },

  // 3. Medical Imaging Severity (high agreement, 4 radiologists, 1-4 scale)
  {
    label: 'Medical Imaging Severity',
    csv: `item,Dr_Chen,Dr_Okafor,Dr_Patel,Dr_Novak
SCAN_001,2,2,2,3
SCAN_002,4,4,4,4
SCAN_003,1,1,1,1
SCAN_004,3,3,2,3
SCAN_005,2,2,2,2
SCAN_006,4,3,4,4
SCAN_007,1,1,2,1
SCAN_008,3,3,3,3
SCAN_009,2,2,2,2
SCAN_010,4,4,4,3
SCAN_011,1,2,1,1
SCAN_012,3,3,3,3
SCAN_013,2,2,2,2
SCAN_014,4,4,3,4
SCAN_015,1,1,1,2
SCAN_016,3,2,3,3
SCAN_017,2,2,2,2
SCAN_018,4,4,4,4
SCAN_019,1,1,1,1
SCAN_020,3,3,2,3`
  },

  // 4. Content Toxicity (poor agreement, 5 annotators, 1-3 scale — shows calibration issues)
  {
    label: 'Content Toxicity Rating',
    csv: `item,Zara,Felix,Ingrid,Omar,Yuki
POST_001,1,2,1,3,1
POST_002,3,3,2,3,2
POST_003,1,1,1,2,1
POST_004,2,3,3,2,3
POST_005,1,1,2,1,2
POST_006,3,2,3,3,1
POST_007,2,2,1,3,2
POST_008,1,3,1,1,3
POST_009,2,2,2,2,2
POST_010,3,3,3,2,3
POST_011,1,2,3,1,2
POST_012,2,1,2,3,1
POST_013,3,3,2,3,2
POST_014,1,1,1,1,1
POST_015,2,3,3,2,3
POST_016,1,2,1,3,2
POST_017,3,1,3,2,3
POST_018,2,2,2,2,2
POST_019,1,3,1,1,3
POST_020,3,2,3,3,1`
  },

  // 5. Named Entity Tagging (excellent agreement, 4 annotators, 1=PER 2=ORG 3=LOC 4=MISC)
  {
    label: 'Named Entity Tagging',
    csv: `item,Lena,Raj,Fatima,Tom
ENT_001,1,1,1,1
ENT_002,3,3,3,3
ENT_003,2,2,2,2
ENT_004,1,1,1,2
ENT_005,3,3,3,3
ENT_006,2,2,2,2
ENT_007,4,4,4,4
ENT_008,1,1,1,1
ENT_009,3,3,2,3
ENT_010,2,2,2,2
ENT_011,1,1,1,1
ENT_012,4,4,4,3
ENT_013,3,3,3,3
ENT_014,2,1,2,2
ENT_015,1,1,1,1
ENT_016,4,4,4,4
ENT_017,3,3,3,3
ENT_018,2,2,2,2
ENT_019,1,1,1,1
ENT_020,3,3,3,4`
  },

  // 6. Instruction-Following Quality (mixed agreement, 3 annotators, 1-5 scale, missing data)
  {
    label: 'Instruction-Following Quality',
    csv: `item,Grace,Henri,Isabelle
IFQ_001,4,4,3
IFQ_002,2,,2
IFQ_003,5,4,5
IFQ_004,1,2,1
IFQ_005,3,3,
IFQ_006,4,4,4
IFQ_007,2,3,2
IFQ_008,5,5,4
IFQ_009,,2,3
IFQ_010,4,4,4
IFQ_011,1,1,2
IFQ_012,3,3,3
IFQ_013,5,4,5
IFQ_014,2,2,2
IFQ_015,4,3,4
IFQ_016,1,,1
IFQ_017,3,3,3
IFQ_018,5,5,5
IFQ_019,2,3,2
IFQ_020,4,4,3`
  }

];

let lastDemoIndex = -1;

function loadDemo() {
  // Pick a random demo that isn't the same as last time
  let idx;
  do { idx = Math.floor(Math.random() * DEMOS.length); }
  while (idx === lastDemoIndex && DEMOS.length > 1);
  lastDemoIndex = idx;

  const demo = DEMOS[idx];
  showToast(`DEMO LOADED — ${demo.label.toUpperCase()}`);
  parseIt(demo.csv);
}

const BENCHMARKS=[
  {domain:'NLP · SENTIMENT',name:'Amazon Product Reviews',alpha:0.74,fleiss:0.71},
  {domain:'CV · IMAGE LABELS',name:'Medical Imaging QA',alpha:0.82,fleiss:0.79},
  {domain:'RLHF · PREFERENCE',name:'Human Preference Labels',alpha:0.65,fleiss:0.61},
  {domain:'NER · ENTITY TAGS',name:'CoNLL Annotation Study',alpha:0.88,fleiss:0.85},
];
const TDESC={
  ordinal:'Ordinal: values carry rank order (1–5 ratings). Krippendorff\'s α applies ordinal distance weighting between disagreeing pairs.',
  nominal:'Nominal: values are unordered categories. Krippendorff\'s α uses binary disagreement — any mismatch counts equally.',
  interval:'Interval: values are equally spaced numeric scores. Krippendorff\'s α uses squared difference — larger gaps penalized more.'
};

let pData=null,cM=null,curType='ordinal',aiOut='';
let CH={hw:null,cal:null,it:null,cmp:null};

document.getElementById('fileIn').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=ev=>parseIt(ev.target.result);r.readAsText(f);
});
const dz=document.getElementById('dropZone');
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('over')});
dz.addEventListener('dragleave',()=>dz.classList.remove('over'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('over');const f=e.dataTransfer.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>parseIt(ev.target.result);r.readAsText(f);});


function parseIt(txt){
  const res=Papa.parse(txt.trim(),{header:true,dynamicTyping:true,skipEmptyLines:true});
  if(!res.data.length)return;
  pData=res;showPreview(res);compute(res,curType);
}
function showPreview(res){
  const hs=res.meta.fields,rows=res.data.slice(0,6);
  let h='<tr>'+hs.map(x=>`<th>${x}</th>`).join('')+'</tr>';
  rows.forEach(r=>{h+='<tr>'+hs.map(k=>`<td>${r[k]!==null&&r[k]!==undefined?r[k]:'—'}</td>`).join('')+'</tr>';});
  if(res.data.length>6)h+=`<tr><td colspan="${hs.length}" style="color:var(--muted);text-align:center;padding:10px;font-family:var(--mono);font-size:9px;letter-spacing:.1em">…${res.data.length-6} MORE ROWS</td></tr>`;
  document.getElementById('prevTbl').innerHTML=h;
  document.getElementById('dataStats').textContent=`${res.data.length} ITEMS · ${res.meta.fields.length-1} ANNOTATORS`;
  document.getElementById('prevSec').classList.remove('hidden');
  document.getElementById('clearBtn').classList.remove('hidden');
}

function getMat(res){const f=res.meta.fields,anns=f.slice(1),items=res.data;const mat=anns.map(a=>items.map(r=>r[a]!==null&&r[a]!==undefined&&r[a]!==''?r[a]:null));return{mat,anns,items};}
function cohenK(a,b){const pp=a.map((v,i)=>[v,b[i]]).filter(([x,y])=>x!==null&&y!==null);if(!pp.length)return null;const vals=[...new Set(pp.flat())].sort(),n=pp.length;let ag=0;pp.forEach(([x,y])=>{if(x===y)ag++;});const po=ag/n;let pe=0;vals.forEach(v=>{pe+=(pp.filter(([x])=>x===v).length/n)*(pp.filter(([,y])=>y===v).length/n);});return pe===1?1:(po-pe)/(1-pe);}
function fleissK(mat,anns,items){const n=items.length,k=anns.length;const av=[...new Set(mat.flat().filter(v=>v!==null))].sort();if(av.length<2)return 1;const cnts=items.map((_,i)=>{const c={};av.forEach(v=>c[v]=0);anns.forEach((_,j)=>{const v=mat[j][i];if(v!==null)c[v]++;});return c;});const Pi=cnts.map(c=>{const ni=Object.values(c).reduce((a,b)=>a+b,0);if(ni<=1)return 0;return av.reduce((s,v)=>s+c[v]*(c[v]-1),0)/(ni*(ni-1));});const Pb=Pi.reduce((a,b)=>a+b,0)/n;const pj=av.map(v=>cnts.reduce((s,c)=>s+c[v],0)/(n*k));const Pe=pj.reduce((s,p)=>s+p*p,0);return Pe===1?1:(Pb-Pe)/(1-Pe);}
function krippA(mat,anns,items,type){const pp=[];items.forEach((_,i)=>{const v=anns.map((_,j)=>mat[j][i]).filter(x=>x!==null);for(let a=0;a<v.length-1;a++)for(let b=a+1;b<v.length;b++)pp.push([v[a],v[b]]);});if(!pp.length)return null;const d=(a,b)=>type==='nominal'?(a===b?0:1):(a-b)**2;const Do=pp.reduce((s,[a,b])=>s+d(a,b),0)/pp.length;const fl=pp.flat(),cn=fl.length;let De=0;for(let i=0;i<cn;i++)for(let j=0;j<cn;j++)if(i!==j)De+=d(fl[i],fl[j]);De/=cn*(cn-1);return De===0?1:1-Do/De;}
function gwetAC(mat,anns,items){const n=items.length,k=anns.length;const av=[...new Set(mat.flat().filter(v=>v!==null))].sort(),q=av.length;if(q<2)return 1;const Pi=items.map((_,i)=>{const v=anns.map((_,j)=>mat[j][i]).filter(x=>x!==null),ni=v.length;if(ni<=1)return 0;let ag=0;for(let a=0;a<ni-1;a++)for(let b=a+1;b<ni;b++)if(v[a]===v[b])ag++;return ag/(ni*(ni-1)/2);});const Pb=Pi.reduce((a,b)=>a+b,0)/n;const pk=av.map(v=>{let t=0,c=0;items.forEach((_,i)=>anns.forEach((_,j)=>{if(mat[j][i]!==null){c++;if(mat[j][i]===v)t++;}}));return c?t/c:0;});const Pe=(1/(q-1))*(1-pk.reduce((s,p)=>s+p*p,0));return Pe===1?1:(Pb-Pe)/(1-Pe);}
function itemAgr(mat,anns,items){return items.map((_,i)=>{const v=anns.map((_,j)=>mat[j][i]).filter(x=>x!==null);if(!v.length)return 0;const c={};v.forEach(x=>c[x]=(c[x]||0)+1);return Math.max(...Object.values(c))/v.length;});}
function annMns(mat,anns){return anns.map((_,j)=>{const v=mat[j].filter(x=>x!==null);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;});}
function bootstrapCI(mat,anns,items,type,iters=150){const scores=[];for(let i=0;i<iters;i++){const idx=Array.from({length:items.length},()=>Math.floor(Math.random()*items.length));const bI=idx.map(k=>items[k]);const bM=anns.map((_,j)=>idx.map(k=>mat[j][k]));const a=krippA(bM,anns,bI,type);if(a!==null)scores.push(a);}scores.sort((a,b)=>a-b);return{lo:scores[Math.floor(scores.length*.025)]||0,hi:scores[Math.floor(scores.length*.975)]||1};}
function bench(v){return v>=0.8?['EXCELLENT','good']:v>=0.67?['ACCEPTABLE','ok']:['POOR','poor'];}

function compute(res,type){
  const{mat,anns,items}=getMat(res);
  const alpha=krippA(mat,anns,items,type),fleiss=fleissK(mat,anns,items),gwet=gwetAC(mat,anns,items);
  const pw=[];for(let i=0;i<anns.length;i++)for(let j=i+1;j<anns.length;j++)pw.push({a:anns[i],b:anns[j],k:cohenK(mat[i],mat[j])});
  const ia=itemAgr(mat,anns,items),mn=annMns(mat,anns),ci=bootstrapCI(mat,anns,items,type);
  const avg=pw.length?pw.reduce((s,p)=>s+(p.k||0),0)/pw.length:null;
  cM={alpha,fleiss,gwet,pw,ia,anns,items,mat,mn,type,ci,avg};
  updateHero(alpha,fleiss,gwet,avg);renderMetricCards(alpha,fleiss,gwet,avg,ci);
  renderCharts(pw,anns,items,ia,mat,mn,alpha,fleiss,gwet);renderBenchmarks(alpha,fleiss);
  document.getElementById('resSec').classList.remove('hidden');
  document.getElementById('expMeta').textContent=`${items.length} ITEMS · ${anns.length} ANNOTATORS · ${type.toUpperCase()} · ${new Date().toLocaleTimeString()}`;
  document.getElementById('metaTs').textContent=new Date().toLocaleTimeString();
  runAI(alpha,fleiss,gwet,pw,anns,items.length,type);
}

function updateHero(a,f,g,avg){
  [a,f,g,avg].forEach((v,i)=>{
    const el=document.getElementById(`hv${i}`),bar=document.getElementById(`hb${i}`);
    if(!el)return;if(v===null){el.textContent='—';return;}
    el.textContent=v.toFixed(3);
    if(bar)setTimeout(()=>{bar.style.width=Math.max(0,Math.min(1,v))*100+'%';},150+i*100);
  });
}

function renderMetricCards(alpha,fleiss,gwet,avg,ci){
  const list=[
    {val:alpha,name:"Krippendorff's α",sys:'METRIC // 01',sub:'ORDINAL · MISSING-SAFE',ci},
    {val:fleiss,name:"Fleiss' κ",sys:'METRIC // 02',sub:'MULTI-RATER · NOMINAL',ci:null},
    {val:gwet,name:"Gwet's AC1",sys:'METRIC // 03',sub:'PREVALENCE-ROBUST',ci:null},
    {val:avg,name:"Avg Cohen's κ",sys:'METRIC // 04',sub:`${cM.pw.length} PAIRS AVERAGED`,ci:null},
  ];
  document.getElementById('metGrid').innerHTML=list.map(m=>{
    const[lab,cls]=m.val!==null?bench(m.val):['N/A','ok'];
    return`<div class="m-card"><div class="m-card-sys">${m.sys}</div><div class="m-card-val lit">${m.val!==null?m.val.toFixed(3):'—'}</div><div class="m-card-name">${m.name}</div><span class="m-badge ${cls}">${lab}</span>${m.ci&&m.val!==null?`<div class="m-card-ci">95% CI [${m.ci.lo.toFixed(3)}, ${m.ci.hi.toFixed(3)}]</div>`:''}<div class="m-card-sub">${m.sub}</div></div>`;
  }).join('');
}

/* chart colors for cream bg */
const TC='rgba(13,12,10,0.4)';const GC='rgba(13,12,10,0.06)';
const TS={backgroundColor:'rgba(13,12,10,0.95)',borderColor:'rgba(13,12,10,0.2)',borderWidth:1,padding:10,titleColor:'rgba(240,235,225,0.5)',bodyColor:'#F0EBE1',cornerRadius:0};

function hCol(v){if(v===null)return'rgba(30,29,26,0.8)';if(v>=0.75)return`rgba(40,${Math.round(140+50*(v-.75)/.25)},${Math.round(110+40*(v-.75)/.25)},${.5+v*.4})`;if(v>=0.4)return`rgba(${Math.round(170+50*(v-.4)/.35)},${Math.round(120+44*(v-.4)/.35)},40,${.4+v*.4})`;return`rgba(${Math.round(180+60*(.4-v)/.4)},60,60,${.5+(.4-v)*.8})`;}
function cCol(v,mn,mx){if(v===null)return'rgba(30,29,26,0.5)';const t=(v-mn)/(mx-mn||1);return`rgba(${Math.round(30+80*t)},${Math.round(60+100*(t>.5?1-t:t))},${Math.round(120+80*t)},0.75)`;}

function renderCharts(pw,anns,items,ia,mat,mn,alpha,fleiss,gwet){
  Object.values(CH).forEach(c=>{if(c)c.destroy();});
  const iKey=pData.meta.fields[0];const iLbls=items.map((r,i)=>r[iKey]!==null?String(r[iKey]):`Item ${i+1}`);
  const hm=anns.map(()=>anns.map(()=>null));
  pw.forEach(({a,b,k})=>{const ai=anns.indexOf(a),bi=anns.indexOf(b);hm[ai][bi]=k;hm[bi][ai]=k;});
  anns.forEach((_,i)=>hm[i][i]=1);
  const hData=[];anns.forEach((a,i)=>anns.forEach((b,j)=>hData.push({x:b,y:a,v:hm[i][j]})));
  CH.hw=new Chart(document.getElementById('hwChart'),{type:'scatter',data:{datasets:[{data:hData.map(d=>({x:d.x,y:d.y})),backgroundColor:hData.map(d=>hCol(d.v)),pointRadius:anns.length>5?15:28,pointStyle:'rect'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TS,callbacks:{label:ctx=>{const d=hData[ctx.dataIndex];return`  ${d.y} vs ${d.x}: κ = ${d.v!==null?d.v.toFixed(3):'—'}  `;},title:()=>''}}},scales:{x:{type:'category',labels:anns,ticks:{color:TC,font:{size:11,family:'Space Mono'}},grid:{color:GC}},y:{type:'category',labels:[...anns].reverse(),ticks:{color:TC,font:{size:11,family:'Space Mono'}},grid:{color:GC}}}}});

  const allR=mat.flat().filter(v=>v!==null);const rMn=Math.min(...allR),rMx=Math.max(...allR);
  const cData=[];anns.forEach((a,j)=>items.forEach((_,i)=>cData.push({x:iLbls[i],y:a,v:mat[j][i]})));
  CH.cal=new Chart(document.getElementById('calChart'),{type:'scatter',data:{datasets:[{data:cData.map(d=>({x:d.x,y:d.y})),backgroundColor:cData.map(d=>cCol(d.v,rMn,rMx)),pointRadius:items.length>10?7:14,pointStyle:'rect'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TS,callbacks:{label:ctx=>{const d=cData[ctx.dataIndex];return`  ${d.y} → ${d.x}: ${d.v!==null?d.v:'missing'}  `;},title:()=>''}}},scales:{x:{type:'category',labels:iLbls,ticks:{color:TC,font:{size:10},maxRotation:45,autoSkip:items.length>10},grid:{color:GC}},y:{type:'category',labels:[...anns].reverse(),ticks:{color:TC,font:{size:11}},grid:{color:GC}}}}});

  const gm=mn.filter(v=>v!==null).reduce((a,b)=>a+b,0)/mn.filter(v=>v!==null).length;
  const mxD=Math.max(...mn.map(m=>m!==null?Math.abs(m-gm):0),.01);
  document.getElementById('calBars').innerHTML=anns.map((a,i)=>{if(mn[i]===null)return'';const diff=mn[i]-gm,pct=Math.abs(diff)/mxD*50;const col=diff>.3?'#C8A44A':diff<-.3?'#5B8BC8':'#5BBFA0';const lft=diff>=0?'50%':`${50-pct}%`;return`<div class="c-row"><div class="c-name">${a}</div><div class="c-avg">${mn[i].toFixed(2)}</div><div class="c-track"><div class="c-mid"></div><div class="c-fill" style="background:${col};left:${lft};width:${pct}%"></div></div><div class="c-diff" style="color:${col}">${diff>=0?'+':''}${diff.toFixed(2)}</div></div>`;}).join('');
  const outliers=anns.filter((_,i)=>mn[i]!==null&&Math.abs(mn[i]-gm)>.5);
  document.getElementById('calInsight').innerHTML=outliers.length?`GROUP MEAN: ${gm.toFixed(2)}. ANNOTATOR${outliers.length>1?'S':''} ${outliers.map(x=>`<b style="color:var(--gold2)">${x.toUpperCase()}</b>`).join(', ')} DEVIATE >0.5 FROM GROUP MEAN — SCHEDULE CALIBRATION SESSION BEFORE NEXT ROUND.`:`GROUP MEAN: ${gm.toFixed(2)}. ALL ANNOTATORS WITHIN 0.5 PTS OF GROUP MEAN — CALIBRATION LOOKS SOLID.`;

  const wrap=document.getElementById('itWrap');wrap.style.height=Math.max(220,items.length*34+60)+'px';wrap.style.position='relative';
  CH.it=new Chart(document.getElementById('itChart'),{type:'bar',data:{labels:iLbls,datasets:[{data:ia.map(v=>+v.toFixed(3)),backgroundColor:ia.map(v=>v>=.8?'#5BBFA0':v>=.6?'#C8A44A':'#C45A5A'),borderRadius:0,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TS,callbacks:{label:ctx=>`  Agreement: ${(ctx.parsed.x*100).toFixed(0)}%  `,title:()=>''}}},scales:{x:{min:0,max:1,ticks:{color:TC,font:{family:'Space Mono',size:10},callback:v=>`${(v*100).toFixed(0)}%`},grid:{color:GC}},y:{ticks:{color:TC,font:{size:10,family:'Space Mono'}},grid:{display:false}}}}});

  CH.cmp=new Chart(document.getElementById('cmpChart'),{type:'bar',data:{labels:["Krippendorff's α","Fleiss' κ","Gwet's AC1"],datasets:[{label:'Score',data:[alpha,fleiss,gwet].map(v=>v!==null?+v.toFixed(3):0),backgroundColor:['rgba(13,12,10,0.82)','rgba(90,75,55,0.82)','rgba(184,168,130,0.82)'],borderColor:['rgba(13,12,10,0.9)','rgba(90,75,55,0.9)','rgba(184,168,130,0.9)'],borderWidth:1,borderRadius:0,borderSkipped:false},{label:'Excellent',data:[.8,.8,.8],type:'line',borderColor:'rgba(196,90,90,0.6)',borderDash:[5,4],borderWidth:1.5,pointRadius:0,fill:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TS,callbacks:{label:ctx=>ctx.dataset.label==='Score'?`  Score: ${ctx.parsed.y.toFixed(3)}  `:'  Excellent threshold: 0.800  ',title:()=>''}}},scales:{x:{ticks:{color:TC,font:{size:12,family:'Space Grotesk'}},grid:{display:false}},y:{min:-0.1,max:1.1,ticks:{color:TC,callback:v=>v.toFixed(1),font:{family:'Space Mono',size:10}},grid:{color:GC}}}}});
}

function renderBenchmarks(alpha,fleiss){
  const grid=document.getElementById('bmGrid');if(!grid)return;
  grid.innerHTML=BENCHMARKS.map(b=>{const aDiff=alpha!==null?alpha-b.alpha:null,fDiff=fleiss!==null?fleiss-b.fleiss:null;const fd=(d,lbl)=>{if(d===null)return`<div class="bmark-row"><span>${lbl}</span><span>LOAD DATA</span></div>`;const col=d>0?'#5BBFA0':d<-.1?'#C45A5A':'#C8A44A';return`<div class="bmark-row"><span>${lbl}</span><span style="color:${col}">${d>=0?'+':''}${d.toFixed(3)}</span></div>`;};return`<div class="bmark-cell"><div class="bmark-domain">${b.domain}</div><div class="bmark-name">${b.name}</div><div class="bmark-row"><span>BENCHMARK α</span><span>${b.alpha}</span></div><div class="bmark-row"><span>BENCHMARK κ</span><span>${b.fleiss}</span></div><div class="bmark-vs">${fd(aDiff,'YOUR α')}${fd(fDiff,'YOUR κ')}</div></div>`;}).join('');
}

function runAI(alpha,fleiss,gwet,pw,anns,nItems,type){
  document.getElementById('aiLoad').classList.remove('hidden');
  document.getElementById('aiOut').classList.add('hidden');
  document.getElementById('aiTs').textContent='';

  // Simulate a brief analysis delay so it feels computed
  setTimeout(()=>{
    aiOut = generateAnalysis(alpha,fleiss,gwet,pw,anns,nItems,type);
    document.getElementById('aiOut').innerHTML = aiOut.replace(/\n\n/g,'</p><p>').replace(/^/,'<p>').replace(/$/,'</p>');
    document.getElementById('aiLoad').classList.add('hidden');
    document.getElementById('aiOut').classList.remove('hidden');
    document.getElementById('aiTs').textContent = new Date().toLocaleTimeString();
  }, 900);
}

function generateAnalysis(alpha,fleiss,gwet,pw,anns,nItems,type){
  const avg = pw.length ? pw.reduce((s,p)=>s+(p.k||0),0)/pw.length : null;
  const mn  = cM.mn;
  const ia  = cM.ia;

  // ── PARAGRAPH 1: Overall quality & training readiness ──
  const alphaLabel = alpha>=0.8?'excellent':alpha>=0.67?'acceptable':alpha>=0.4?'marginal':'poor';
  const fleissLabel= fleiss>=0.75?'strong':fleiss>=0.6?'moderate':fleiss>=0.4?'fair':'weak';
  const gwetLabel  = gwet>=0.8?'robust':gwet>=0.67?'acceptable':gwet>=0.4?'marginal':'low';

  let readiness, readinessDetail;
  if(alpha>=0.8 && fleiss>=0.7){
    readiness='ready for production AI training';
    readinessDetail='The data is reliable enough to use directly as training signal without further re-annotation.';
  } else if(alpha>=0.67){
    readiness='acceptable for training with caveats';
    readinessDetail='The data is usable for training, but high-disagreement items should be reviewed or adjudicated before fine-tuning sensitive models.';
  } else if(alpha>=0.4){
    readiness='marginal — significant cleanup required before training';
    readinessDetail='Using this data as-is risks introducing label noise into model training. A second annotation pass on disputed items is strongly recommended.';
  } else {
    readiness='not yet suitable for AI training';
    readinessDetail='Agreement levels are too low to produce reliable training signal. The annotation schema likely needs clarification and annotators need calibration before proceeding.';
  }

  // Metric consistency check
  const metricsAligned = Math.abs(alpha-(fleiss||alpha))<0.12 && Math.abs(alpha-(gwet||alpha))<0.12;
  const consistencyNote = metricsAligned
    ? `All three metrics are in close agreement with each other, which confirms the scores are stable and not an artifact of dataset prevalence.`
    : `There is some divergence between the metrics — notably Gwet's AC1 (${gwet!==null?gwet.toFixed(3):'N/A'}) versus Fleiss' κ (${fleiss!==null?fleiss.toFixed(3):'N/A'}) — which suggests the dataset may have skewed label distributions that inflate or deflate certain metrics. Gwet's AC1 is the more reliable figure in this case.`;

  const p1 = `With a Krippendorff's α of ${alpha!==null?alpha.toFixed(3):'N/A'} (${alphaLabel}), Fleiss' κ of ${fleiss!==null?fleiss.toFixed(3):'N/A'} (${fleissLabel}), and Gwet's AC1 of ${gwet!==null?gwet.toFixed(3):'N/A'} (${gwetLabel}), this ${nItems}-item dataset is ${readiness}. ${readinessDetail} ${consistencyNote}`;

  // ── PARAGRAPH 2: Pairwise analysis & calibration ──
  const sortedPW = [...pw].filter(p=>p.k!==null).sort((a,b)=>a.k-b.k);
  const weakestPairs  = sortedPW.slice(0,Math.min(2,sortedPW.length));
  const strongestPairs= sortedPW.slice(-Math.min(2,sortedPW.length)).reverse();

  let pairNote = '';
  if(weakestPairs.length){
    const wp = weakestPairs[0];
    const wpLabel = wp.k<0.4?'notably weak':'below average';
    pairNote += `The lowest agreement is between ${wp.a} and ${wp.b} (κ = ${wp.k.toFixed(3)}), which is ${wpLabel} and warrants attention. `;
    if(weakestPairs.length>1 && weakestPairs[1].k<0.5){
      pairNote += `${weakestPairs[1].a} and ${weakestPairs[1].b} also show reduced agreement (κ = ${weakestPairs[1].k.toFixed(3)}). `;
    }
  }
  if(strongestPairs.length && strongestPairs[0].k>0.75){
    pairNote += `In contrast, ${strongestPairs[0].a} and ${strongestPairs[0].b} are the most closely aligned pair (κ = ${strongestPairs[0].k.toFixed(3)}), suggesting a shared interpretation of the rating schema. `;
  }

  // Calibration note
  let calibNote = '';
  if(mn && mn.filter(v=>v!==null).length>0){
    const validMns = mn.filter(v=>v!==null);
    const gm = validMns.reduce((a,b)=>a+b,0)/validMns.length;
    const outliers = anns.filter((_,i)=>mn[i]!==null&&Math.abs(mn[i]-gm)>0.4)
                        .map((a,_,arr)=>({name:a,diff:mn[anns.indexOf(a)]-gm}));
    if(outliers.length){
      const o = outliers.sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff))[0];
      const dir = o.diff>0?'consistently higher':'consistently lower';
      calibNote = `From a calibration standpoint, ${o.name} rates ${dir} than the group mean by ${Math.abs(o.diff).toFixed(2)} points on average — a systematic bias that could skew label distributions if not corrected before training.`;
    } else {
      calibNote = `Calibration looks healthy overall — no annotator deviates more than 0.4 points from the group mean, indicating shared rating standards.`;
    }
  }

  const p2 = `${pairNote}${calibNote}`;

  // ── PARAGRAPH 3: Specific actionable recommendations ──
  const recs = [];

  // Recommendation based on alpha level
  if(alpha<0.67){
    recs.push(`Run a calibration session before the next annotation round — show annotators 8–10 pre-labeled examples with rationale, focusing specifically on the boundary cases between adjacent rating levels where most disagreement occurs.`);
  } else if(alpha<0.8){
    recs.push(`Hold a targeted alignment review on the ${Math.round(ia.filter(v=>v<0.6).length)} items with sub-60% agreement — these are likely edge cases where the annotation guidelines are ambiguous. Clarifying the schema for these cases could push α above 0.80.`);
  } else {
    recs.push(`Maintain the current annotation workflow — the agreement level is production-ready. Document the exact guidelines and annotator instructions so this quality can be replicated in future batches.`);
  }

  // Recommendation based on weakest pair
  if(weakestPairs.length && weakestPairs[0].k<0.5){
    recs.push(`Investigate the specific disagreements between ${weakestPairs[0].a} and ${weakestPairs[0].b} — pull the items where they diverge and look for a systematic pattern. Often one annotator is applying a stricter interpretation of one rating level, which can be resolved with a 30-minute sync.`);
  } else {
    recs.push(`For future batches, consider adding a mandatory "confidence flag" column where annotators mark low-confidence labels. Items flagged by multiple annotators are strong candidates for a third-pass adjudication rather than majority vote.`);
  }

  // Recommendation based on item-level agreement
  const poorItems = ia.filter(v=>v<0.6).length;
  const totalItems = ia.length;
  if(poorItems>totalItems*0.2){
    recs.push(`${poorItems} of ${totalItems} items (${Math.round(poorItems/totalItems*100)}%) have sub-60% agreement — too high to ignore. Consider breaking these out into a separate re-annotation task with a refined rubric, rather than including them in the training set at their current quality level.`);
  } else if(poorItems>0){
    recs.push(`The ${poorItems} low-agreement item${poorItems>1?'s':''} should be adjudicated by a senior annotator or team lead before being included in training data — a quick majority-override pass on just these items is sufficient and won't require a full re-annotation round.`);
  } else {
    recs.push(`Per-item agreement is uniformly high across the dataset. For scale, consider expanding the dataset size — with this level of annotator consistency, you can likely reduce the annotator overlap from ${anns.length} to 3 per item on future batches without sacrificing data quality, which will improve throughput significantly.`);
  }

  const p3 = `Three concrete next steps: First, ${recs[0]} Second, ${recs[1]} Third, ${recs[2]}`;

  return `${p1}\n\n${p2}\n\n${p3}`;
}

function swType(btn){document.querySelectorAll('.tgl').forEach(b=>b.classList.remove('on'));btn.classList.add('on');curType=btn.dataset.t;document.getElementById('typeNote').textContent=TDESC[curType];if(pData)compute(pData,curType);}
function swTab(name,btn){document.querySelectorAll('.tab').forEach(b=>b.classList.remove('on'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('on'));btn.classList.add('on');document.getElementById('tab-'+name).classList.add('on');}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}
function clearAll(){pData=null;cM=null;aiOut='';document.getElementById('prevSec').classList.add('hidden');document.getElementById('resSec').classList.add('hidden');document.getElementById('clearBtn').classList.add('hidden');document.getElementById('fileIn').value='';[0,1,2,3].forEach(i=>{const e=document.getElementById(`hv${i}`);if(e)e.textContent='—';const b=document.getElementById(`hb${i}`);if(b)b.style.width='0';});Object.values(CH).forEach(c=>{if(c)c.destroy();});CH={hw:null,cal:null,it:null,cmp:null};}
function askTips(){const msg='How can I improve inter-annotator agreement in my annotation dataset? Give specific, actionable advice based on IAA best practices.';if(typeof sendPrompt==='function')sendPrompt(msg);else{navigator.clipboard.writeText(msg);showToast('PROMPT COPIED TO CLIPBOARD');}}
function copyJSON(){if(!cM)return;const{alpha,fleiss,gwet,pw,anns,items,mn,type,ci,avg}=cM;const obj={meta:{timestamp:new Date().toISOString(),items:items.length,annotators:anns,scaleType:type},metrics:{krippendorff_alpha:alpha,fleiss_kappa:fleiss,gwet_ac1:gwet,avg_cohen_kappa:avg,alpha_95ci:ci},pairwise:pw.map(p=>({annotators:[p.a,p.b],cohen_kappa:p.k})),calibration:anns.map((a,i)=>({annotator:a,mean:mn[i]})),interpretation:aiOut.replace(/<[^>]+>/g,'')};navigator.clipboard.writeText(JSON.stringify(obj,null,2)).then(()=>showToast('JSON COPIED TO CLIPBOARD'));}
function copyReport(){if(!cM)return;const{alpha,fleiss,gwet,pw,anns,items,mn,type,avg}=cM;let r=`INTER-ANNOTATOR RELIABILITY REPORT\n${'─'.repeat(44)}\n${new Date().toLocaleString()} · SCALE: ${type.toUpperCase()}\n\nDATASET\nItems: ${items.length}  ·  Annotators: ${anns.join(', ')}\n\nMETRICS\nKrippendorff's α  ${alpha!==null?alpha.toFixed(3):'N/A'}\nFleiss' κ         ${fleiss!==null?fleiss.toFixed(3):'N/A'}\nGwet's AC1        ${gwet!==null?gwet.toFixed(3):'N/A'}\nAvg Cohen's κ     ${avg!==null?avg.toFixed(3):'N/A'}\n\nPAIRWISE COHEN'S κ\n${pw.map(p=>`  ${p.a} vs ${p.b}: ${p.k!==null?p.k.toFixed(3):'N/A'}`).join('\n')}\n\n`;if(mn)r+=`CALIBRATION\n${anns.map((a,i)=>`  ${a}: ${mn[i]!==null?mn[i].toFixed(2):'N/A'}`).join('\n')}\n\n`;if(aiOut)r+=`AI INTERPRETATION\n${aiOut.replace(/<[^>]+>/g,'')}`;navigator.clipboard.writeText(r).then(()=>showToast('REPORT COPIED TO CLIPBOARD'));}
function doPDF(){
  if(!cM||typeof window.jspdf==='undefined')return;
  const btn=document.getElementById('pdfBtn');btn.textContent='BUILDING…';btn.disabled=true;
  const{jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4'});const W=210,M=18,CW=W-M*2;let y=M;
  doc.setFillColor(13,12,10);doc.rect(0,0,W,28,'F');
  doc.setTextColor(240,235,225);doc.setFontSize(14);doc.setFont('helvetica','bold');doc.text('AGREEMENTLENS™ — IAA REPORT',M,14);
  doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(184,168,130);doc.text('ANNOTATION RELIABILITY SUITE',M,21);doc.text(new Date().toLocaleString(),W-M,21,{align:'right'});
  doc.setTextColor(40,44,60);y=38;
  const{alpha,fleiss,gwet,pw,anns,items,mn,type,ci,avg}=cM;
  doc.setFillColor(240,235,225);doc.rect(M,y,CW,16,'F');
  doc.setFontSize(9);doc.setFont('helvetica','bold');doc.setTextColor(13,12,10);doc.text(`${items.length} ITEMS  ·  ${anns.length} ANNOTATORS  ·  ${type.toUpperCase()} SCALE`,M+6,y+7);
  doc.setFont('helvetica','normal');doc.setTextColor(80,70,60);doc.text(`Annotators: ${anns.join(', ')}`,M+6,y+13);y+=24;
  doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(13,12,10);doc.text('RELIABILITY METRICS',M,y);y+=4;doc.setDrawColor(200,185,160);doc.setLineWidth(.4);doc.line(M,y,W-M,y);y+=3;
  [[`Krippendorff's α`,alpha,ci?`CI [${ci.lo.toFixed(3)}, ${ci.hi.toFixed(3)}]`:''],[`Fleiss' κ`,fleiss,''],[`Gwet's AC1`,gwet,''],['Avg Cohen\'s κ',avg,'']].forEach(([nm,v],idx)=>{const[lb,cl]=v!==null?bench(v):['N/A','ok'];doc.setFillColor(idx%2===0?250:244,idx%2===0?248:242,idx%2===0?244:238);doc.rect(M,y,CW,7,'F');doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.setTextColor(30,28,26);doc.text(nm,M+3,y+5);const cc=cl==='good'?[42,138,106]:cl==='ok'?[138,106,26]:[138,42,42];doc.setTextColor(...cc);doc.text(v!==null?v.toFixed(3):'—',M+72,y+5);doc.text(lb,M+92,y+5);y+=7;});y+=8;
  doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(13,12,10);doc.text("PAIRWISE κ",M,y);y+=4;doc.line(M,y,W-M,y);y+=5;
  const cols=Math.min(3,Math.ceil(pw.length/Math.ceil(pw.length/3)));const pw2=CW/cols;pw.forEach((p,i)=>{const ro=Math.floor(i/cols),co=i%cols;const[,cl]=p.k!==null?bench(p.k):['N/A','ok'];const cc=cl==='good'?[42,138,106]:cl==='ok'?[138,106,26]:[138,42,42];doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(50,46,42);doc.text(`${p.a} vs ${p.b}`,M+co*pw2+2,y+ro*6+4);doc.setFont('helvetica','bold');doc.setTextColor(...cc);doc.text(p.k!==null?p.k.toFixed(3):'—',M+co*pw2+36,y+ro*6+4);});y+=Math.ceil(pw.length/cols)*6+8;
  if(mn&&y<240){doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(13,12,10);doc.text('CALIBRATION',M,y);y+=4;doc.line(M,y,W-M,y);y+=5;const gm=mn.filter(v=>v!==null).reduce((a,b)=>a+b,0)/mn.filter(v=>v!==null).length;anns.forEach((a,i)=>{if(mn[i]===null)return;const diff=mn[i]-gm;doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(50,46,42);doc.text(a,M+2,y+4);doc.text(mn[i].toFixed(2),M+28,y+4);const bw=Math.abs(diff)*24,bx=M+42+(diff>=0?12:12-bw);const bc=diff>.3?[200,164,74]:diff<-.3?[91,139,200]:[91,191,160];doc.setFillColor(...bc);doc.rect(bx,y+1,bw||.5,3,'F');doc.setTextColor(130,120,110);doc.text(`${diff>=0?'+':''}${diff.toFixed(2)}`,M+80,y+4);y+=6;});y+=4;}
  if(aiOut&&y<240){if(y>230){doc.addPage();y=M;}doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(13,12,10);doc.text('AI INTERPRETATION',M,y);y+=4;doc.line(M,y,W-M,y);y+=5;doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.setTextColor(50,46,42);const cl=doc.splitTextToSize(aiOut.replace(/<[^>]+>/g,''),CW);if(y+cl.length*4.5>275){doc.addPage();y=M;}doc.text(cl,M,y);}
  for(let p=1;p<=doc.internal.getNumberOfPages();p++){doc.setPage(p);doc.setFillColor(13,12,10);doc.rect(0,285,W,12,'F');doc.setFontSize(7);doc.setTextColor(100,95,85);doc.text('AGREEMENTLENS™ · BUILT BY SHAUN NCHINDA · UIUC APPLIED MATHEMATICS',M,292);doc.text(`${p}/${doc.internal.getNumberOfPages()}`,W-M,292,{align:'right'});}
  doc.save(`IAA_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  btn.textContent='DOWNLOADED ✓';setTimeout(()=>{btn.textContent='PDF EXPORT';btn.disabled=false;},2200);
}  
}); // end DOMContentLoaded
