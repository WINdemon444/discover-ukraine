/* Discover Ukraine: Secret Hunt (3 difficulties), Catch the Sunflowers, Ukrainian Labyrinth. Vanilla JS. */
(function(){
"use strict";
var KEY="du_game_v2",MAX=10,FONT='"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif',DF=["easy","normal","hard"],LB={easy:"Easy",normal:"Normal",hard:"Hard"};
var $=function(q){return document.querySelector(q)};
var rnd=function(n){return Math.floor(Math.random()*n)},clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};
function fmt(n){return n.toLocaleString("en-US")}
function mmss(ms){var s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+":"+("0"+s%60).slice(-2)}
/* ================= storage ================= */
function blank(){var o={run:null,sh:{},cb:{},mb:{}};DF.forEach(function(d){o.sh[d]={b:0,t:0};o.cb[d]=0;o.mb[d]=0});return o}
var st;
function load(){var o=blank();try{var r=JSON.parse(localStorage.getItem(KEY));if(!r)return o;
DF.forEach(function(d){if(r.sh&&r.sh[d]){o.sh[d].b=+r.sh[d].b||0;o.sh[d].t=+r.sh[d].t||0}o.cb[d]=r.cb?+r.cb[d]||0:0;o.mb[d]=r.mb?+r.mb[d]||0:0});
var u=r.run;if(u&&DF.indexOf(u.d)>-1&&+u.t0>0&&Array.isArray(u.f)){var f=[];u.f.forEach(function(x){if(SID.indexOf(x)>-1&&f.indexOf(x)<0)f.push(x)});o.run={d:u.d,t0:+u.t0,f:f,h:+u.h||0,over:!!u.over,fin:u.fin||null}}}catch(e){}return o}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
/* ================= Secret Hunt data ================= */
var HC={easy:{lim:0,hints:1e9,dec:3,s:28,o:.6,g:1,info:"No timer, unlimited clear hints, 3 decoys."},normal:{lim:180,hints:5,dec:6,s:24,o:.4,g:0,info:"3:00 timer, 5 hints, 6 decoys."},hard:{lim:90,hints:2,dec:10,s:20,o:.28,g:0,info:"1:30 timer, only 2 hints, 10 decoys."}};
var S=[
{id:"flag",e:"🇺🇦",h:".stitch",p:"right:14%;top:2px",sec:"Home area",z:"upper part",c:"A small flag waves along the embroidered border under the hero."},
{id:"sun",e:"🌻",h:"#cities .lead",p:"right:2px;bottom:-4px",sec:"Explore Cities",z:"upper part",c:"A sunflower is tucked beside the text that introduces the cities."},
{id:"tri",e:"🔱",h:'.card[data-id="lviv"] .body',p:"left:46%;bottom:.4rem",sec:"Explore Cities",z:"upper part",c:"A trident hides low in the card of the café city."},
{id:"anc",e:"⚓",h:'.card[data-id="odesa"] .body',p:"right:1.2rem;top:44%",sec:"Explore Cities",z:"upper part",c:"A ship’s anchor rests by the Black Sea card."},
{id:"emb",e:"🧵",h:"#plan .lead",p:"right:4px;top:-2px",sec:"Plan Your Trip",z:"middle",c:"A thread of embroidery sits near the planner’s intro."},
{id:"cry",e:"💎",h:"#attrGrid .card:nth-child(4) .body",p:"right:.7rem;top:.8rem",sec:"Attractions",z:"middle",c:"A crystal glints in the mountain card."},
{id:"tre",e:"💰",h:"#attrGrid .card:nth-child(5) .body",p:"right:1rem;bottom:.6rem",sec:"Attractions",z:"middle",c:"Cossack treasure is buried in the island card."},
{id:"spk",e:"✨",h:"#attrGrid .card:nth-child(1) h3",p:"right:-6px;top:-6px",sec:"Attractions",z:"middle",c:"A golden spark flickers by the cathedral’s title."},
{id:"whe",e:"🌾",h:".tips .tip:nth-child(2) li:last-child",p:"right:0;top:0",sec:"Travel Tips",z:"lower part",c:"Wheat grows at the end of a list of useful phrases."},
{id:"coin",e:"🪙",h:"footer ul li:nth-child(5)",p:"right:40%;top:0",sec:"the footer",z:"lower part",c:"A coin has rolled next to the last quick link."}];
var SID=S.map(function(s){return s.id});
st=load();
var DEC=[["🌼",'.card[data-id="dnipro"] .body',"right:1rem;top:.7rem"],["🔶",'.card[data-id="zaporizhzhia"] .body',"left:50%;bottom:.5rem"],["🧶","#attrGrid .card:nth-child(2) .body","right:.8rem;top:.7rem"],["🔹","#attrGrid .card:nth-child(3) .body","left:.8rem;bottom:.7rem"],["🌿",".tips .tip:nth-child(3)","right:1rem;top:.8rem"],["♆",".tips .tip:nth-child(4)","right:1rem;bottom:.8rem"],["✦","#tips .notice","right:.8rem;top:.4rem"],["🌼","#cities h2","right:30%;top:0"],["💠","footer .wrap > div:nth-child(3)","right:0;bottom:0"],["✿","#attractions h2","left:60%;top:0"]];
var sel="normal",hintMsg="",tick=0;
function elapsed(){return Date.now()-st.run.t0}
function score(r){return r.f.length*100}
/* ================= panel ================= */
var gp=document.createElement("div");gp.id="gp";
gp.innerHTML='<div id="gpB" hidden></div><button id="gpT" aria-expanded="false" aria-controls="gpB"></button>';
document.body.appendChild(gp);
var gpB=$("#gpB"),gpT=$("#gpT");
gpT.onclick=function(){gpB.hidden=!gpB.hidden;gpT.setAttribute("aria-expanded",!gpB.hidden)};
function render(bump){var r=st.run,h='<h3>🌻 Discover Ukraine Games</h3>';
if(!r){h+='<p class="gsub">Secret Hunt: find 10 hidden symbols. Beware of decoys!</p><div class="seg" role="group" aria-label="Difficulty">'+DF.map(function(d){return '<button data-act="diff" data-v="'+d+'" aria-pressed="'+(d===sel)+'">'+LB[d]+'</button>'}).join("")+'</div><p class="gsub">'+HC[sel].info+' Max 1,500'+(HC[sel].lim?' + time bonus up to 500':'')+' points.</p><div class="gb"><button class="btn y" data-act="start">Start Hunt</button></div>'}
else if(!r.over){var c=HC[r.d],left=c.hints-r.h;h+='<div class="gl"><span>'+LB[r.d]+'</span><span id="gT">'+(c.lim?mmss(c.lim*1000-elapsed()):mmss(elapsed()))+'</span></div><div>Secrets found: <b>'+r.f.length+'/'+MAX+'</b> · Score <b>'+fmt(score(r))+'</b></div><div class="gbar"><i style="width:'+r.f.length*10+'%"></i></div><p class="gh" aria-live="polite">'+(hintMsg||"Look for tiny symbols. Not every sparkle counts!")+'</p><div class="gb"><button data-act="hint"'+(left<=0?' disabled':'')+'>💡 Hint'+(c.hints<1e9?' ('+Math.max(0,left)+' left)':'')+'</button><button data-act="end">End hunt</button></div>'}
else{var f=r.fin;h+='<div class="gl"><span>'+LB[r.d]+' hunt finished</span></div><div>Found <b>'+f.n+'/'+MAX+'</b> · Score <b>'+fmt(f.score)+'</b></div><div class="gb"><button data-act="results">Results</button><button class="btn y" data-act="again">New hunt</button></div>'}
h+='<h4>Other games</h4><div class="gb"><button data-act="catch">🌻 Catch</button><button data-act="maze">🧭 Labyrinth</button></div><h4>Your personal bests <small>(saved only in this browser)</small></h4><table class="bt"><tr><th></th><th>Hunt</th><th>Catch</th><th>Maze</th></tr>'+DF.map(function(d){return '<tr><td>'+LB[d]+'</td><td>'+fmt(st.sh[d].b)+(st.sh[d].t?' · '+mmss(st.sh[d].t):'')+'</td><td>'+fmt(st.cb[d])+'</td><td>'+fmt(st.mb[d])+'</td></tr>'}).join("")+'</table><div class="gb"><button data-act="wipe">Reset all progress</button></div>';
gpB.innerHTML=h;ticker();if(bump){gpT.classList.remove("bump");void gpT.offsetWidth;gpT.classList.add("bump")}}
function ticker(){var r=st.run;if(!r||r.over){gpT.innerHTML="🌻 Games";return}var c=HC[r.d],ms=c.lim?c.lim*1000-elapsed():elapsed();
if(c.lim&&ms<=0){finish("time");return}gpT.innerHTML="⏱ "+mmss(ms)+" · "+r.f.length+"/"+MAX+" · "+fmt(score(r))+" pts";var t=$("#gT");if(t)t.textContent=mmss(ms)}
setInterval(ticker,500);
gpB.addEventListener("click",function(e){var a=e.target.closest("[data-act]");if(a&&!a.disabled)act(a.dataset.act,a.dataset.v)});
function act(a,v){
if(a==="diff"){sel=v;render()}
else if(a==="start"){st.run={d:sel,t0:Date.now(),f:[],h:0,over:false,fin:null};hintMsg="";save();place();render()}
else if(a==="hint")hint();
else if(a==="end"&&confirm("End this hunt now? Your current result will be recorded."))finish("quit");
else if(a==="results")results();
else if(a==="again"){st.run=null;hintMsg="";save();place();render()}
else if(a==="catch")catchGame();else if(a==="maze")mazeGame();
else if(a==="wipe"&&confirm("Reset ALL game progress and personal bests?")){st=blank();hintMsg="";save();place();render()}}
/* ================= hidden items ================= */
function mk(e,host,pos,cls,c){var h=$(host);if(!h)return null;h.classList.add("sx-host");var b=document.createElement("button");b.className="sx "+cls+(c.g?" glow":"");b.style.cssText=pos;b.style.setProperty("--s",c.s+"px");b.style.setProperty("--o",c.o);b.textContent=e;h.appendChild(b);return b}
function place(){document.querySelectorAll(".sx").forEach(function(b){b.remove()});var r=st.run;if(!r||r.over)return;var c=HC[r.d];
S.forEach(function(s){if(r.f.indexOf(s.id)>-1)return;var b=mk(s.e,s.h,s.p,"sec",c);if(!b)return;b.dataset.sx=s.id;b.setAttribute("aria-label","Hidden secret");b.onclick=function(){collect(s.id,b)}});
DEC.slice(0,c.dec).forEach(function(x){var b=mk(x[0],x[1],x[2],"dec",c);if(!b)return;b.setAttribute("aria-label","Decoration");b.onclick=function(){b.onclick=null;b.classList.add("got");setTimeout(function(){b.remove()},400);hintMsg="That was only a decoration. No points!";render()}})}
function pop(b,txt){var r=b.getBoundingClientRect(),t=document.createElement("span");t.className="pts";t.textContent=txt;t.style.left=r.left+"px";t.style.top=r.top+"px";document.body.appendChild(t);setTimeout(function(){t.remove()},1000)}
function collect(id,b){var r=st.run;if(!r||r.over||r.f.indexOf(id)>-1)return;var c=HC[r.d];if(c.lim&&elapsed()>=c.lim*1000){finish("time");return}
r.f.push(id);save();b.onclick=null;pop(b,"+100");b.classList.add("got");setTimeout(function(){b.remove()},500);hintMsg="Found one! "+(MAX-r.f.length)+" to go.";
if(r.f.length===MAX)finish("complete");else render(true)}
function hint(){var r=st.run;if(!r||r.over)return;var c=HC[r.d];if(r.h>=c.hints)return;if(c.lim&&elapsed()>=c.lim*1000){finish("time");return}
var s=S.filter(function(x){return r.f.indexOf(x.id)<0})[0];if(!s)return;
hintMsg="Hint: "+(r.d==="easy"||r.h===0?s.c:r.h===1?"Try the “"+s.sec+"” area.":"Something is hiding in the "+s.z+" of the page.");r.h++;save();
var b=$('.sx[data-sx="'+s.id+'"]');if(r.d==="easy"&&b){b.scrollIntoView({block:"center",behavior:"smooth"});b.classList.add("pulse");setTimeout(function(){b.classList.remove("pulse")},3000)}render()}
function finish(reason){var r=st.run;if(!r||r.over)return;var c=HC[r.d],n=r.f.length,ms=elapsed();if(c.lim)ms=Math.min(ms,c.lim*1000);
var base=n*100,bonus=n===MAX?500:0,tb=n===MAX&&c.lim?Math.round((c.lim*1000-ms)/(c.lim*1000)*500):0;
r.over=true;r.fin={n:n,ms:ms,reason:reason,base:base,bonus:bonus,tb:tb,score:base+bonus+tb};var b=st.sh[r.d];
if(r.fin.score>b.b)b.b=r.fin.score;if(n===MAX&&(!b.t||ms<b.t))b.t=ms;save();place();hintMsg="";render();if(!d.open)results()}
function results(){var r=st.run;if(!r||!r.over)return;var f=r.fin,b=st.sh[r.d];
openD('<div class="gin"><h3>'+(f.n===MAX?"🏆 All 10 secrets found!":f.reason==="time"?"⏱ Time’s up!":"Hunt ended")+'</h3><table class="bt"><tr><td>Difficulty</td><td>'+LB[r.d]+'</td></tr><tr><td>Secrets found</td><td>'+f.n+'/'+MAX+'</td></tr><tr><td>Time</td><td>'+mmss(f.ms)+'</td></tr><tr><td>Secrets (100 each)</td><td>'+f.base+'</td></tr><tr><td>Completion bonus</td><td>'+f.bonus+'</td></tr><tr><td>Time bonus</td><td>'+f.tb+'</td></tr><tr><td><b>Final score</b></td><td><b>'+fmt(f.score)+'</b></td></tr><tr><td>Your best ('+LB[r.d]+')</td><td>'+fmt(b.b)+(b.t?' · fastest '+mmss(b.t):'')+'</td></tr></table><p class="gsub">Personal bests are stored only in this browser.</p><div class="gbtns"><button class="btn y" data-act="again">New hunt</button><button class="btn o" data-close style="color:var(--blue)">Close</button></div></div>')}
/* ================= shared dialog ================= */
var d=document.createElement("dialog");d.className="gd";d.setAttribute("aria-label","Discover Ukraine game");document.body.appendChild(d);
d.addEventListener("click",function(e){if(e.target===d||e.target.hasAttribute("data-close"))d.close();var a=e.target.closest("[data-act]");if(a){act(a.dataset.act,a.dataset.v);d.close()}});
d.addEventListener("close",stop);
function openD(html){d.innerHTML='<button class="x" data-close aria-label="Close">✕</button>'+html;if(!d.open)d.showModal()}
var G={mode:null},C={},M={};
function stop(){G.mode=null;cancelAnimationFrame(C.raf);C.run=false;M.run=false;clearInterval(M.tm);clearInterval(M.rep)}
function seg(id,cur){return '<div class="seg" id="'+id+'" role="group" aria-label="Difficulty">'+DF.map(function(x){return '<button data-dd="'+x+'" aria-pressed="'+(x===cur)+'">'+LB[x]+'</button>'}).join("")+'</div>'}
function segBind(id,fn){var s=$("#"+id);s.onclick=function(e){var b=e.target.closest("[data-dd]");if(!b||b.disabled)return;fn(b.dataset.dd);s.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)})};return s}
/* ================= Catch the Sunflowers ================= */
var CF={easy:{v:.85,sp:1,bad:.14,wave:15},normal:{v:1,sp:.8,bad:.2,wave:12},hard:{v:1.3,sp:.6,bad:.3,wave:9}};
var GOOD=["🌻","🪙","⭐"],BADS=["💣","🧨"];
function catchGame(){stop();G.mode="catch";var df="normal";
openD('<div class="gin"><h3>Catch the Sunflowers</h3>'+seg("cD",df)+'<div class="hud"><span>⏱ <b id="cT">45</b>s</span><span id="cH"></span><span>Score <b id="cS">0</b></span><span>Combo ×<b id="cC">1</b></span><span>Best <b id="cB"></b></span></div><div class="cw" id="cw"><canvas id="cv" width="320" height="400"></canvas><div class="ov" id="cO"></div></div><div class="gbtns"><button class="btn y" id="cStart">Start</button><button class="btn o" id="cPause" hidden style="color:var(--blue)">Pause</button><button class="btn o" id="cRe" hidden style="color:var(--blue)">Restart</button></div></div>');
var cv=$("#cv"),cx=cv.getContext("2d"),ov=$("#cO"),bs=$("#cStart"),bp=$("#cPause"),br=$("#cRe"),cw=$("#cw"),dseg=$("#cD");
C={run:false,paused:false,px:160,dir:0,items:[],pops:[],t:0,score:0,lives:3,combo:0,sp:0,wv:0,hit:0,last:0,raf:0};
function intro(){ov.hidden=false;ov.innerHTML='<b>Ready?</b><span class="sm">Catch 🌻🪙⭐ (+10) and golden 🔱 (+50). Catching 5 in a row raises your combo. Avoid 💣🧨 (−1 heart, −20) and decoy 🌼 (breaks combo). 3 hearts, 45 seconds. Move mouse or finger; ← → keys also work.</span>'}
function info(){$("#cB").textContent=fmt(st.cb[df]);$("#cH").textContent="❤️❤️❤️".slice(0,C.lives*2)+"🖤🖤🖤".slice(0,(3-C.lives)*2);$("#cS").textContent=C.score;$("#cC").textContent=mult();$("#cT").textContent=Math.max(0,Math.ceil(45-C.t))}
function mult(){return Math.min(3,1+Math.floor(C.combo/5)*.5)}
segBind("cD",function(x){if(C.run)return;df=x;info()});
function draw(){var g=cx.createLinearGradient(0,0,0,400);g.addColorStop(0,"#5aa9e6");g.addColorStop(.75,"#cfe6ff");g.addColorStop(1,"#FFD700");cx.fillStyle=g;cx.fillRect(0,0,320,400);cx.textAlign="center";cx.textBaseline="middle";
C.items.forEach(function(i){cx.font=i.z+"px "+FONT;if(i.gold){cx.shadowColor="#FFD700";cx.shadowBlur=16}cx.fillText(i.e,i.x,i.y);cx.shadowBlur=0});
cx.font="40px "+FONT;cx.fillText("🧺",C.px,378);
C.pops.forEach(function(p){cx.font="800 18px sans-serif";cx.fillStyle=p.c;cx.fillText(p.t,p.x,p.y)});
if(C.hit>0){cx.fillStyle="rgba(200,30,30,"+C.hit+")";cx.fillRect(0,0,320,400)}}
function add(e,x,df2,o){var tr=rnd(3),z=[24,30,40][rnd(3)],sm=z===24?1.25:z===40?.85:1;
C.items.push({e:e,x:x,x0:x,y:-20,z:z,v:(90+150*df2)*CF[df].v*sm*(.9+Math.random()*.3),tr:tr,a:0,vx:tr===2?(Math.random()<.5?-45:45):0,gold:o.gold,p:o.p,bad:o.bad,dec:o.dec})}
function spawn(df2){var r=Math.random(),cf=CF[df],x=24+Math.random()*272;
if(r<cf.bad*(.7+.6*df2))add(BADS[rnd(df==="hard"?2:1)],x,df2,{bad:1});else if(r<cf.bad*(.7+.6*df2)+.1)add("🌼",x,df2,{dec:1,p:0});else if(r<.84)add(GOOD[rnd(3)],x,df2,{p:10});else add("🔱",x,df2,{gold:1,p:50})}
function wave(df2){var gap=rnd(4),i,gold=Math.random()<.25;for(i=0;i<5;i++){var x=32+i*64,it;
if(i===gap||i===gap+1){var gd=gold&&i===gap;add(gd?"🔱":GOOD[rnd(3)],x,df2,{p:gd?50:10,gold:gd})}else add(BADS[rnd(2)],x,df2,{bad:1});
it=C.items[C.items.length-1];it.tr=0;it.z=30;it.vx=0;it.v=130*CF[df].v}}
function loop(ts){if(!C.run||C.paused)return;if(!C.last)C.last=ts;var dt=Math.min(.05,(ts-C.last)/1000);C.last=ts;C.t+=dt;var df2=Math.min(1,C.t/45);
C.px=clamp(C.px+C.dir*360*dt,24,296);C.sp-=dt;if(C.sp<=0){spawn(df2);C.sp=(.95-.5*df2)*CF[df].sp}
C.wv-=dt;if(C.wv<=0){wave(df2);C.wv=CF[df].wave}
if(C.hit>0)C.hit=Math.max(0,C.hit-dt);
for(var i=C.items.length-1;i>=0;i--){var it=C.items[i];it.a+=dt;it.y+=it.v*dt;it.x=clamp(it.x0+it.vx*it.a+(it.tr===1?Math.sin(it.a*3)*28:0),12,308);
if(it.y>348&&it.y<395&&Math.abs(it.x-C.px)<24+it.z*.35){catchIt(it);C.items.splice(i,1)}else if(it.y>430)C.items.splice(i,1)}
C.pops=C.pops.filter(function(p){p.a+=dt;p.y-=40*dt;return p.a<.7});
draw();info();if(C.lives<=0||C.t>=45)end();else C.raf=requestAnimationFrame(loop)}
function catchIt(it){var t,c="#0057B7";
if(it.bad){C.lives--;C.score=Math.max(0,C.score-20);C.combo=0;C.hit=.35;t="−20 ♥";c="#c0392b"}
else if(it.dec){C.combo=0;t="0";c="#777"}
else{C.combo++;var p=Math.round(it.p*mult());C.score+=p;t="+"+p}
C.pops.push({x:it.x,y:340,t:t,c:c,a:0})}
function start(){cancelAnimationFrame(C.raf);C.run=true;C.paused=false;C.t=0;C.score=0;C.lives=3;C.combo=0;C.items=[];C.pops=[];C.sp=.3;C.wv=CF[df].wave*.8;C.hit=0;C.last=0;ov.hidden=true;bs.hidden=true;bp.hidden=false;bp.textContent="Pause";br.hidden=false;
dseg.querySelectorAll("button").forEach(function(b){b.disabled=true});info();C.raf=requestAnimationFrame(loop)}
function pause(by){if(!C.run||C.paused)return;C.paused=true;C.by=by;cancelAnimationFrame(C.raf);bp.textContent="Resume";ov.hidden=false;ov.innerHTML='<b>Paused</b><button class="btn y" id="cRes">Resume</button>';$("#cRes").onclick=resume}
function resume(){if(!C.run||!C.paused)return;C.paused=false;C.last=0;bp.textContent="Pause";ov.hidden=true;C.raf=requestAnimationFrame(loop)}
function end(){C.run=false;C.dir=0;var nb=C.score>st.cb[df];if(nb){st.cb[df]=C.score;save();render()}info();ov.hidden=false;
ov.innerHTML='<b>'+(C.lives<=0?"Out of hearts!":"Time’s up!")+'</b><span>Score '+C.score+' · Best '+st.cb[df]+(nb?" 🎉 new best!":"")+'</span>';bs.hidden=false;bs.textContent="Play Again";bp.hidden=true;br.hidden=true;dseg.querySelectorAll("button").forEach(function(b){b.disabled=false})}
C.pause=pause;C.resume=resume;
bs.onclick=start;br.onclick=start;bp.onclick=function(){C.paused?resume():pause("button")};
cw.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();C.px=clamp((e.clientX-r.left)/r.width*320,24,296);if(!C.run||C.paused)draw()});
cw.addEventListener("pointerleave",function(e){if(e.pointerType==="mouse")pause("leave")});
cw.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"&&C.paused&&C.by==="leave")resume()});
intro();info();draw()}
/* ================= Ukrainian Labyrinth ================= */
var MC={easy:{W:15,Z:22,lim:90,ob:1,tr:2,step:500},normal:{W:21,Z:16,lim:120,ob:3,tr:3,step:420},hard:{W:27,Z:12,lim:150,ob:5,tr:4,step:320}};
function mazeGame(){stop();G.mode="maze";var df="normal";
openD('<div class="gin"><h3>Ukrainian Labyrinth</h3>'+seg("mD",df)+'<div class="hud"><span>⏱ <b id="mT">0</b>s</span><span>Score <b id="mS">0</b></span><span>💎 <b id="mG">0</b></span><span>Best <b id="mB"></b></span></div><div class="gbar"><i id="mP"></i></div><div class="cw"><canvas id="mv"></canvas><div class="ov" id="mO" hidden></div></div><div class="pad"><button data-d="0,-1" aria-label="Up">▲</button><button data-d="-1,0" aria-label="Left">◀</button><button data-d="1,0" aria-label="Right">▶</button><button data-d="0,1" aria-label="Down">▼</button></div><div class="gbtns"><button class="btn y" id="mNew">New Maze</button></div></div>');
var cv=$("#mv"),cx=cv.getContext("2d"),ov=$("#mO"),g,dist,W,Z,cf;
function gen(){cf=MC[df];W=cf.W;Z=cf.Z;cv.width=cv.height=W*Z;var i,j,stack=[[1,1]];g=[];for(i=0;i<W;i++){g.push([]);for(j=0;j<W;j++)g[i].push(1)}g[1][1]=0;
while(stack.length){var c=stack[stack.length-1],o=[[0,-2],[0,2],[-2,0],[2,0]].filter(function(v){var x=c[0]+v[0],y=c[1]+v[1];return x>0&&y>0&&x<W-1&&y<W-1&&g[y][x]===1});
if(!o.length){stack.pop();continue}var v=o[rnd(o.length)];g[c[1]+v[1]/2][c[0]+v[0]/2]=0;g[c[1]+v[1]][c[0]+v[0]]=0;stack.push([c[0]+v[0],c[1]+v[1]])}
for(i=1;i<W-1;i++)for(j=1;j<W-1;j++)if(g[i][j]&&Math.random()<.07&&((g[i][j-1]===0&&g[i][j+1]===0&&i%2===1)||(g[i-1][j]===0&&g[i+1][j]===0&&j%2===1)))g[i][j]=0;
var goal=W-2;dist=g.map(function(r){return r.map(function(){return -1})});dist[goal][goal]=0;var q=[[goal,goal]];
while(q.length){var p=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(v){var x=p[0]+v[0],y=p[1]+v[1];if(g[y][x]===0&&dist[y][x]<0){dist[y][x]=dist[p[1]][p[0]]+1;q.push([x,y])}})}
var ends=[];for(i=1;i<W-1;i++)for(j=1;j<W-1;j++)if(g[i][j]===0&&!(j===1&&i===1)&&!(j===goal&&i===goal)&&[[1,0],[-1,0],[0,1],[0,-1]].filter(function(v){return g[i+v[1]][j+v[0]]===0}).length===1)ends.push([j,i]);
M.tr=[];var pool=ends.slice();pool.sort(function(){return Math.random()-.5});pool.slice(0,cf.tr).forEach(function(e){M.tr.push({x:e[0],y:e[1],got:false})});
M.ob=[];var runs=[];for(i=1;i<W-1;i++){var s=-1;for(j=1;j<=W-1;j++){if(j<W-1&&g[i][j]===0){if(s<0)s=j}else{if(s>=0&&j-s>=5)runs.push(Array.from({length:j-s},function(_,k){return[s+k,i]}));s=-1}}}
for(j=1;j<W-1;j++){var s2=-1;for(i=1;i<=W-1;i++){if(i<W-1&&g[i][j]===0){if(s2<0)s2=i}else{if(s2>=0&&i-s2>=5)runs.push(Array.from({length:i-s2},function(_,k){return[j,s2+k]}));s2=-1}}}
runs=runs.filter(function(r){return r.every(function(c){return c[0]+c[1]>8&&dist[c[1]][c[0]]>6})});runs.sort(function(){return Math.random()-.5});
runs.slice(0,cf.ob).forEach(function(r){M.ob.push({seg:r,i:rnd(r.length),dir:1})})}
function live(){var rem=Math.max(0,cf.lim-(performance.now()-M.t0)/1000),pen=Math.min(40,Math.max(0,M.bumps-3)*2)+25*M.hits;return Math.max(50,Math.round(300+rem/cf.lim*300+75*M.got-pen))}
function hud(){var rem=Math.max(0,cf.lim-(performance.now()-M.t0)/1000);$("#mT").textContent=Math.ceil(rem);$("#mS").textContent=M.run?live():0;$("#mG").textContent=M.got+"/"+M.tr.length;$("#mB").textContent=st.mb[df];$("#mP").style.width=Math.round(100*(1-dist[M.y][M.x]/dist[1][1]))+"%"}
function draw(){cx.textAlign="center";cx.textBaseline="middle";var y,x,h=Z/2;for(y=0;y<W;y++)for(x=0;x<W;x++){cx.fillStyle=g[y][x]?"#0057B7":"#fff3b0";cx.fillRect(x*Z,y*Z,Z,Z)}
cx.font=Math.round(Z*.8)+"px "+FONT;cx.fillText("💰",(W-2)*Z+h,(W-2)*Z+h+1);
M.tr.forEach(function(t){if(!t.got&&Math.abs(t.x-M.x)+Math.abs(t.y-M.y)<=5)cx.fillText("💎",t.x*Z+h,t.y*Z+h+1)});
M.ob.forEach(function(o){var c=o.seg[o.i];cx.fillText("🔥",c[0]*Z+h,c[1]*Z+h+1)});
if(M.inv>performance.now()&&Math.floor(performance.now()/150)%2)return;cx.fillStyle="#FFD700";cx.strokeStyle="#14213d";cx.lineWidth=2;cx.beginPath();cx.arc(M.x*Z+h,M.y*Z+h,Z*.33,0,7);cx.fill();cx.stroke()}
function hitCheck(){if(M.inv>performance.now())return;M.ob.forEach(function(o){var c=o.seg[o.i];if(c[0]===M.x&&c[1]===M.y){M.hits++;M.inv=performance.now()+1500}})}
function tickM(){if(!M.run)return;var now=performance.now();if(now-M.last>=cf.step){M.last=now;M.ob.forEach(function(o){if(o.i+o.dir<0||o.i+o.dir>=o.seg.length)o.dir=-o.dir;o.i+=o.dir});hitCheck()}
hud();draw();if(now-M.t0>=cf.lim*1000)over(false)}
function over(win){if(!M.run)return;M.run=false;clearInterval(M.tm);var sec=(performance.now()-M.t0)/1000,sc=win?live():0,nb=win&&sc>st.mb[df];if(nb){st.mb[df]=sc;save();render()}hud();
ov.hidden=false;ov.innerHTML=win?'<b>You found the treasure! 🏆</b><span>Time '+sec.toFixed(1)+'s · Score '+sc+' · 💎 '+M.got+'/'+M.tr.length+' · Best '+st.mb[df]+(nb?" 🎉":"")+'</span><button class="btn y" id="mAgain">Play Again</button>':'<b>Time’s up!</b><span>You reached '+$("#mP").style.width+' of the way.</span><button class="btn y" id="mAgain">Try Again</button>';$("#mAgain").onclick=fresh}
function begin(){M.run=true;M.t0=performance.now();M.last=M.t0;ov.hidden=true;clearInterval(M.tm);M.tm=setInterval(tickM,100);hud();draw()}
function fresh(){clearInterval(M.tm);M.run=false;gen();M.x=1;M.y=1;M.got=0;M.bumps=0;M.hits=0;M.inv=0;M.t0=performance.now();hud();draw();ov.hidden=false;
ov.innerHTML='<b>Ready?</b><span class="sm">Reach 💰 before time runs out. Look for hidden 💎 in dead ends (+75). Avoid moving 🔥 (−25). Bumping walls more than 3 times costs 2 points each. Arrow keys / WASD or the pad.</span><button class="btn y" id="mGo">Go!</button>';$("#mGo").onclick=begin}
M.move=function(dx,dy){if(!M.run)return;var nx=M.x+dx,ny=M.y+dy;if(g[ny]&&g[ny][nx]===0){M.x=nx;M.y=ny;M.tr.forEach(function(t){if(!t.got&&t.x===nx&&t.y===ny){t.got=true;M.got++}});hitCheck();hud();draw();if(nx===W-2&&ny===W-2)over(true)}else{M.bumps++;hud()}};
segBind("mD",function(x){df=x;fresh()});$("#mNew").onclick=fresh;
d.querySelectorAll(".pad button").forEach(function(b){var v=b.dataset.d.split(",").map(Number);b.onpointerdown=function(e){e.preventDefault();clearInterval(M.rep);M.move(v[0],v[1]);M.rep=setInterval(function(){M.move(v[0],v[1])},160)};["onpointerup","onpointerleave","onpointercancel"].forEach(function(n){b[n]=function(){clearInterval(M.rep)}})});
fresh()}
/* ================= global listeners (added once) ================= */
document.addEventListener("keydown",function(e){var k=e.key.toLowerCase();
if(G.mode==="catch"){if(k==="arrowleft"||k==="a"){C.dir=-1;e.preventDefault()}else if(k==="arrowright"||k==="d"){C.dir=1;e.preventDefault()}else if(k==="p"&&C.run){C.paused?C.resume():C.pause("key")}}
else if(G.mode==="maze"){var m={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]}[k];if(m&&M.move){e.preventDefault();M.move(m[0],m[1])}}});
document.addEventListener("keyup",function(e){var k=e.key.toLowerCase();if(G.mode==="catch"&&(k==="arrowleft"||k==="a"||k==="arrowright"||k==="d"))C.dir=0});
document.addEventListener("visibilitychange",function(){if(document.hidden&&G.mode==="catch"&&C.pause)C.pause("hidden")});
/* init: resume a saved hunt (timer is wall-clock based, so refreshing cannot reset or extend it) */
if(st.run&&!st.run.over&&HC[st.run.d].lim&&elapsed()>=HC[st.run.d].lim*1000)finish("time");
place();render();
})();
