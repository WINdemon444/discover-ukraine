/* Discover Ukraine: Secret Hunt + mini-games. Vanilla JS, no dependencies. */
(function(){
"use strict";
var KEY="du_game_v1",MAX=10,PTS=100,BONUS=500,FONT='"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
var $=function(q){return document.querySelector(q)};
var S=[
{id:"flag",e:"🇺🇦",h:".hero .wrap",p:"right:6%;bottom:2rem",c:"Near the very top of the page, where blue meets gold."},
{id:"sun",e:"🌻",h:'.card[data-id="kyiv"] .body',p:"right:.8rem;top:.6rem",c:"A sunflower turns toward Ukraine’s capital."},
{id:"tri",e:"🔱",h:'.card[data-id="lviv"] .body',p:"left:46%;bottom:.5rem",c:"A trident hides among Lviv’s café-lined streets."},
{id:"anc",e:"⚓",h:'.card[data-id="odesa"] .body',p:"right:1.2rem;top:42%",c:"Something nautical rests in the Black Sea port."},
{id:"emb",e:"🧵",h:'.card[data-id="kharkiv"] .body',p:"left:.7rem;bottom:.4rem",c:"A thread of embroidery is tucked into a university city."},
{id:"cry",e:"💎",h:"#attrGrid .card:nth-child(4) .body",p:"right:.8rem;top:.8rem",c:"Look in the mountains for something that sparkles."},
{id:"tre",e:"💰",h:"#attrGrid .card:nth-child(5) .body",p:"right:1rem;bottom:.6rem",c:"Cossack treasure is buried on an island in the river."},
{id:"spk",e:"✨",h:"#attrGrid .card:nth-child(1) .body",p:"left:55%;top:.5rem",c:"A golden spark glints near an ancient cathedral."},
{id:"whe",e:"🌾",h:".tips .tip:nth-child(1)",p:"right:1rem;bottom:.8rem",c:"Golden wheat grows in the travel tips, near the food."},
{id:"coin",e:"🪙",h:"footer .fine",p:"right:1.2rem;top:50%;margin-top:-14px",c:"Check the very bottom of the page for a coin."}
];
var ids=S.map(function(s){return s.id});
/* ---- state (derived score: no way to double count) ---- */
var st=load();
function load(){try{var r=JSON.parse(localStorage.getItem(KEY));if(r&&Array.isArray(r.found)){var f=[];r.found.forEach(function(x){if(ids.indexOf(x)>-1&&f.indexOf(x)<0)f.push(x)});return{found:f,best:+r.best||0,cb:+r.cb||0,mb:+r.mb||0}}}catch(e){}return{found:[],best:0,cb:0,mb:0}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function score(){return st.found.length*PTS+(st.found.length===MAX?BONUS:0)}
function fmt(n){return n.toLocaleString("en-US")}
/* ---- panel ---- */
var gp=document.createElement("div");gp.id="gp";
gp.innerHTML='<div id="gpB" hidden><h3>🌻 Secret Hunt</h3><div>Secrets found: <b id="gN"></b></div><div class="gbar"><i id="gBar"></i></div><div>Score <b id="gS"></b> / 1,500 · Best <b id="gBest"></b></div><p class="gh" id="gH" aria-live="polite">Tiny glowing symbols are hidden around the site. Click or tap them!</p><div class="gb"><button id="gHint">💡 Hint</button><button id="gCatch">🌻 Catch</button><button id="gMaze">🧭 Labyrinth</button><button id="gReset">Reset</button></div></div><button id="gpT" aria-expanded="false" aria-controls="gpB"></button>';
document.body.appendChild(gp);
var gpB=$("#gpB"),gpT=$("#gpT");
gpT.onclick=function(){gpB.hidden=!gpB.hidden;gpT.setAttribute("aria-expanded",!gpB.hidden)};
function update(bump){var n=st.found.length,s=score();if(s>st.best){st.best=s;save()}
$("#gN").textContent=n+"/"+MAX;$("#gS").textContent=fmt(s);$("#gBest").textContent=fmt(st.best);$("#gBar").style.width=n*10+"%";
gpT.innerHTML="🌻 "+n+"/"+MAX+" · "+fmt(s)+" pts";
if(bump){gpT.classList.remove("bump");void gpT.offsetWidth;gpT.classList.add("bump")}}
/* ---- hidden secrets ---- */
function place(){document.querySelectorAll(".sx").forEach(function(b){b.remove()});
S.forEach(function(s){if(st.found.indexOf(s.id)>-1)return;var h=$(s.h);if(!h)return;h.classList.add("sx-host");
var b=document.createElement("button");b.className="sx";b.dataset.sx=s.id;b.style.cssText=s.p;b.textContent=s.e;b.setAttribute("aria-label","Hidden secret! Click to collect.");
b.onclick=function(){collect(s.id,b)};h.appendChild(b)})}
function collect(id,b){if(st.found.indexOf(id)>-1)return;st.found.push(id);var all=st.found.length===MAX;save();
var r=b.getBoundingClientRect(),t=document.createElement("span");t.className="pts";t.textContent="+"+PTS;t.style.left=r.left+"px";t.style.top=r.top+"px";document.body.appendChild(t);setTimeout(function(){t.remove()},1000);
b.onclick=null;b.classList.add("got");setTimeout(function(){b.remove()},500);update(true);
$("#gH").textContent=all?"Every secret found!":"Found! "+(MAX-st.found.length)+" to go.";
if(all)setTimeout(function(){openD('<div class="gin"><h3>🏆 All 10 secrets found!</h3><p>You collected every secret and earned the <b>+'+BONUS+' bonus</b>.<br>Total score: <b>'+fmt(score())+'</b></p><div class="gbtns"><button class="btn y" data-close>Keep exploring</button></div></div>')},600)}
$("#gHint").onclick=function(){var left=S.filter(function(s){return st.found.indexOf(s.id)<0});
if(!left.length){$("#gH").textContent="Nothing left to find. Well done!";return}
var s=left[Math.floor(Math.random()*left.length)];$("#gH").textContent="Hint: "+s.c;var b=$('.sx[data-sx="'+s.id+'"]');
if(b){b.scrollIntoView({block:"center",behavior:"smooth"});b.classList.add("pulse");setTimeout(function(){b.classList.remove("pulse")},3500)}};
$("#gReset").onclick=function(){if(confirm("Reset your Secret Hunt progress? Your best scores are kept.")){st.found=[];save();place();update();$("#gH").textContent="Progress reset. Happy hunting!"}};
$("#gCatch").onclick=function(){catchGame()};$("#gMaze").onclick=function(){mazeGame()};
/* ---- shared dialog ---- */
var d=document.createElement("dialog");d.className="gd";d.setAttribute("aria-label","Discover Ukraine game");document.body.appendChild(d);
d.addEventListener("click",function(e){if(e.target===d||e.target.hasAttribute("data-close"))d.close()});
d.addEventListener("close",stop);
function openD(html){d.innerHTML='<button class="x" data-close aria-label="Close">✕</button>'+html;if(!d.open)d.showModal()}
var G={mode:null},C={},M={};
function stop(){G.mode=null;cancelAnimationFrame(C.raf);C.run=false;M.run=false;clearInterval(M.tm)}
/* ---- Catch the Sunflowers ---- */
var T=[{e:"🌻",p:10,w:30},{e:"🪙",p:10,w:25},{e:"⭐",p:10,w:15},{e:"🔱",p:50,w:8,gold:1},{e:"💣",p:-20,w:22}];
function catchGame(){stop();G.mode="catch";
openD('<div class="gin"><h3>Catch the Sunflowers</h3><p class="gsub">Catch 🌻 🪙 ⭐ (+10) and golden 🔱 (+50). Avoid 💣 (−20). Move your mouse or finger, or use ← → keys. P pauses.</p><div class="hud"><span>⏱ <b id="cT">45</b>s</span><span>Score <b id="cS">0</b></span><span>Best <b id="cB">'+st.cb+'</b></span></div><div class="cw" id="cw"><canvas id="cv" width="320" height="400"></canvas><div class="ov" id="cO">Ready?</div></div><div class="gbtns"><button class="btn y" id="cStart">Start Game</button><button class="btn o" id="cRe" hidden style="color:var(--blue)">Restart</button></div></div>');
var cv=$("#cv"),cx=cv.getContext("2d"),ov=$("#cO"),bs=$("#cStart"),br=$("#cRe"),cw=$("#cw");
C={run:false,paused:false,px:160,dir:0,items:[],pops:[],t:0,score:0,sp:0,last:0,raf:0};
function draw(){var g=cx.createLinearGradient(0,0,0,400);g.addColorStop(0,"#5aa9e6");g.addColorStop(.75,"#cfe6ff");g.addColorStop(1,"#FFD700");cx.fillStyle=g;cx.fillRect(0,0,320,400);cx.textAlign="center";cx.textBaseline="middle";
C.items.forEach(function(i){cx.font="30px "+FONT;if(i.t.gold){cx.shadowColor="#FFD700";cx.shadowBlur=16}cx.fillText(i.t.e,i.x,i.y);cx.shadowBlur=0});
cx.font="40px "+FONT;cx.fillText("🧺",C.px,378);
C.pops.forEach(function(p){cx.font="800 18px sans-serif";cx.fillStyle=p.v>0?"#0057B7":"#c0392b";cx.fillText((p.v>0?"+":"")+p.v,p.x,p.y)})}
function hud(){$("#cT").textContent=Math.max(0,Math.ceil(45-C.t));$("#cS").textContent=C.score}
function spawn(df){var tot=0,r,i;T.forEach(function(t){tot+=t.w});r=Math.random()*tot;for(i=0;i<T.length-1&&r>T[i].w;i++)r-=T[i].w;
C.items.push({t:T[i],x:24+Math.random()*272,y:-20,v:(90+150*df)*(.85+Math.random()*.4)})}
function loop(ts){if(!C.run||C.paused)return;if(!C.last)C.last=ts;var dt=Math.min(.05,(ts-C.last)/1000);C.last=ts;C.t+=dt;var df=Math.min(1,C.t/45);
C.px=Math.max(24,Math.min(296,C.px+C.dir*340*dt));C.sp-=dt;if(C.sp<=0){spawn(df);C.sp=.85-.5*df}
for(var i=C.items.length-1;i>=0;i--){var it=C.items[i];it.y+=it.v*dt;
if(it.y>350&&it.y<395&&Math.abs(it.x-C.px)<38){C.score=Math.max(0,C.score+it.t.p);C.pops.push({x:it.x,y:340,v:it.t.p,a:0});C.items.splice(i,1)}else if(it.y>430)C.items.splice(i,1)}
C.pops=C.pops.filter(function(p){p.a+=dt;p.y-=40*dt;return p.a<.7});
draw();hud();if(C.t>=45)end();else C.raf=requestAnimationFrame(loop)}
function start(){cancelAnimationFrame(C.raf);C.run=true;C.paused=false;C.t=0;C.score=0;C.items=[];C.pops=[];C.sp=.3;C.last=0;ov.hidden=true;bs.hidden=true;br.hidden=false;hud();C.raf=requestAnimationFrame(loop)}
function pause(by){if(!C.run||C.paused)return;C.paused=true;C.by=by;cancelAnimationFrame(C.raf);ov.hidden=false;ov.innerHTML='<b>Paused</b><button class="btn y" id="cRes">Resume</button>';$("#cRes").onclick=resume}
function resume(){if(!C.run||!C.paused)return;C.paused=false;C.last=0;ov.hidden=true;C.raf=requestAnimationFrame(loop)}
function end(){C.run=false;C.dir=0;if(C.score>st.cb){st.cb=C.score;save()}$("#cB").textContent=st.cb;ov.hidden=false;ov.innerHTML='<b>Time’s up!</b><span>Score '+C.score+' · Best '+st.cb+'</span>';bs.hidden=false;bs.textContent="Play Again";br.hidden=true}
C.pause=pause;C.resume=resume;
bs.onclick=start;br.onclick=start;
cw.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();C.px=Math.max(24,Math.min(296,(e.clientX-r.left)/r.width*320));if(!C.run||C.paused)draw()});
cw.addEventListener("pointerleave",function(e){if(e.pointerType==="mouse")pause("leave")});
cw.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"&&C.paused&&C.by==="leave")resume()});
draw()}
/* ---- Ukrainian Labyrinth ---- */
function mazeGame(){stop();G.mode="maze";
openD('<div class="gin"><h3>Ukrainian Labyrinth</h3><p class="gsub">Reach the treasure 💰. Arrow keys or WASD, or the pad. Faster = more points (new maze each round).</p><div class="hud"><span>⏱ <b id="mT">0.0</b>s</span><span>Best <b id="mB">'+st.mb+'</b></span></div><div class="cw"><canvas id="mv" width="340" height="340"></canvas><div class="ov" id="mO" hidden></div></div><div class="pad"><button data-d="0,-1" aria-label="Up">▲</button><button data-d="-1,0" aria-label="Left">◀</button><button data-d="1,0" aria-label="Right">▶</button><button data-d="0,1" aria-label="Down">▼</button></div><div class="gbtns"><button class="btn y" id="mNew">New Maze</button></div></div>');
var cv=$("#mv"),cx=cv.getContext("2d"),ov=$("#mO"),W=17,Z=20,g;
function gen(){var i,j,stack=[[1,1]];g=[];for(i=0;i<W;i++){g.push([]);for(j=0;j<W;j++)g[i].push(1)}g[1][1]=0;
while(stack.length){var c=stack[stack.length-1],o=[[0,-2],[0,2],[-2,0],[2,0]].filter(function(v){var x=c[0]+v[0],y=c[1]+v[1];return x>0&&y>0&&x<W-1&&y<W-1&&g[y][x]===1});
if(!o.length){stack.pop();continue}var v=o[Math.floor(Math.random()*o.length)];g[c[1]+v[1]/2][c[0]+v[0]/2]=0;g[c[1]+v[1]][c[0]+v[0]]=0;stack.push([c[0]+v[0],c[1]+v[1]])}}
function draw(){cx.textAlign="center";cx.textBaseline="middle";for(var y=0;y<W;y++)for(var x=0;x<W;x++){cx.fillStyle=g[y][x]?"#0057B7":"#fff3b0";cx.fillRect(x*Z,y*Z,Z,Z)}
cx.font="18px "+FONT;cx.fillText("💰",15*Z+10,15*Z+11);cx.fillStyle="#FFD700";cx.strokeStyle="#14213d";cx.lineWidth=2;cx.beginPath();cx.arc(M.x*Z+10,M.y*Z+10,7,0,7);cx.fill();cx.stroke()}
function fresh(){clearInterval(M.tm);gen();M.x=1;M.y=1;M.run=true;ov.hidden=true;M.t0=performance.now();$("#mT").textContent="0.0";M.tm=setInterval(function(){$("#mT").textContent=((performance.now()-M.t0)/1000).toFixed(1)},100);draw()}
function win(){clearInterval(M.tm);M.run=false;var s=(performance.now()-M.t0)/1000,p=Math.max(50,300-Math.round(s*3));if(p>st.mb){st.mb=p;save()}$("#mB").textContent=st.mb;
ov.hidden=false;ov.innerHTML='<b>You found the treasure! 🏆</b><span>Time '+s.toFixed(1)+'s · +'+p+' points · Best '+st.mb+'</span><button class="btn y" id="mAgain">Play Again</button>';$("#mAgain").onclick=fresh}
M.move=function(dx,dy){if(!M.run)return;var nx=M.x+dx,ny=M.y+dy;if(g[ny]&&g[ny][nx]===0){M.x=nx;M.y=ny;draw();if(nx===15&&ny===15)win()}};
$("#mNew").onclick=fresh;d.querySelectorAll(".pad button").forEach(function(b){b.onpointerdown=function(e){e.preventDefault();var v=b.dataset.d.split(",");M.move(+v[0],+v[1])}});
fresh()}
/* ---- global listeners (added once) ---- */
document.addEventListener("keydown",function(e){var k=e.key.toLowerCase();
if(G.mode==="catch"){if(k==="arrowleft"||k==="a"){C.dir=-1;e.preventDefault()}else if(k==="arrowright"||k==="d"){C.dir=1;e.preventDefault()}else if(k==="p"&&C.run){C.paused?C.resume():C.pause("key")}}
else if(G.mode==="maze"){var m={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]}[k];if(m&&M.move){e.preventDefault();M.move(m[0],m[1])}}});
document.addEventListener("keyup",function(e){var k=e.key.toLowerCase();if(G.mode==="catch"&&(k==="arrowleft"||k==="a"||k==="arrowright"||k==="d"))C.dir=0});
document.addEventListener("visibilitychange",function(){if(document.hidden&&G.mode==="catch"&&C.pause)C.pause("hidden")});
place();update();
})();
