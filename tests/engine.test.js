// Test herní logiky: validita rozložení, řešitelnost všech 150 levelů (i s překážkami, žralokem a Krakenem), denní výzvy a odhad obtížnosti.
// Spuštění: node tests/engine.test.js
const path = require('path').join(__dirname, '..', 'js') + '/';
require(path+'levels.js'); require(path+'engine.js');
const {Levels, Engine} = globalThis.CD;
let ok=true;
// layout validation
for (const [k,L] of Object.entries(Levels.LAYOUTS)) {
  const lay = Levels.parse(L.rows);
  for (const a of lay.slots) for (const b of lay.slots) if (a!==b && a.y===b.y && Math.abs(a.x-b.x)<2) { console.log('OVERLAP',k,a,b); ok=false; }
  const free = lay.slots.filter(s=>!s.coveredBy.length).length;
  console.log(k.padEnd(10), 'cards',lay.slots.length,'free',free,'w',lay.maxX,'h',lay.maxY);
}
// solution replay
function replay(st){ for (const m of st.sol){ if (m===-1){ if(!Engine.draw(st)) return false;} else { if(!Engine.play(st,m)) return false; } } return Engine.isWon(st); }
// heuristic player
function chainLen(st, depth){ if(depth>6) return 0; let best=0; for(const i of Engine.playable(st)){ const s2=JSON.parse(JSON.stringify(st)); s2.sol=st.sol; Engine.play(s2,i); const v=1+chainLen(s2,depth+1); if(v>best)best=v; if(best>6)break;} return best; }
function smart(st){ let guard=0; while(!Engine.isWon(st) && guard++<500){ const p=Engine.playable(st); if(p.length){ let bi=p[0],bv=-1; for(const i of p){ const s2=JSON.parse(JSON.stringify(st)); s2.sol=st.sol; const ev=Engine.play(s2,i); const v=chainLen(s2,1)*2+ev.flipped.length*1.5+Math.random()*0.5; if(v>bv){bv=v;bi=i;} } Engine.play(st,bi);} else if(!Engine.draw(st)) return false; } return Engine.isWon(st); }
const ONLY=(process.env.LV||'').split(',').filter(Boolean).map(Number);
for (let n=1;n<=Levels.COUNT;n++){ if (ONLY.length && !ONLY.includes(n)) continue;
  const d=Levels.get(n); let solv=0, wins=0, stars=[0,0,0,0], fall=0; const T=n%5==0?40:25;
  for (let t=0;t<T;t++){ const seed=n*1000+t; const g=Engine.newGame(n,seed); if(g.gen>=40) fall++; if(replay(g)) solv++; const st=Engine.newGame(n,seed+7); if(smart(st)){wins++; stars[Engine.stars(st)]++;} }
  if (solv!==T || fall>T*0.2) ok=false;
  console.log(`L${String(n).padStart(2)} ${d.layout.padEnd(10)} N${d.N} stock${d.stockSize} t2=${d.t2} t3=${d.t3} solvable ${solv}/${T} smartWin ${(100*wins/T|0)}% stars1/2/3 ${stars.slice(1).join('/')}${fall?` méně-překážek ${fall}/${T}`:''}`);
}
// denní výzvy: 30 dní za sebou
for (let day=20400; day<20430; day++){ const st=Engine.newGame(Levels.DAILY_BASE+day, day); if(!replay(st)){ console.log('DAILY FAIL', day); ok=false; } }
console.log('daily 30 dní: řešitelné');
console.log(ok?'ALL OK':'PROBLEMS');
