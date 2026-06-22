// ============== SafeSteel AI — static prototype ==============

// ---------- Tabs ----------
const WEATHER_KEY="dd2fa0931c9451c317652098ae4cbe0d";
const GEMINI_API_KEY = "AQ.Ab8RN6KQMGg2gF87RdtmtxojvbKTcFArs4HJ_Qw-cVt_7oc5Vg";
const tabs = document.querySelectorAll('.nav-item');
const pageTitles = {
  dashboard: ['Dashboard', 'Plant Digital Twin'],
  risk: ['Risk Engine', 'AI Compound Risk Analysis'],
  cctv: ['CCTV', 'Vision AI Surveillance'],
  copilot: ['Copilot', 'AI Safety Copilot'],
  emergency: ['Emergency', 'Emergency Response Center'],
};
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  const id = t.dataset.tab;
  document.querySelectorAll('.tab').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  const [crumb, title] = pageTitles[id];
  document.getElementById('crumb-page').textContent = crumb;
  document.getElementById('page-title').textContent = title;
}));

// ---------- Zones ----------
const ZONES = [
  { id:'coke',  name:'Coke Oven Battery 4', sub:'CH₄ · Hot work',     x:40,  y:60,  w:200, h:120, risk:8 },
  { id:'bf',    name:'Blast Furnace 3',     sub:'Thermal · Slag',      x:280, y:40,  w:200, h:150, risk:18 },
  { id:'ld',    name:'LD Converter 2',      sub:'Slopping risk',       x:520, y:60,  w:240, h:120, risk:14 },
  { id:'sint',  name:'Sinter Plant',        sub:'Dust · CO',           x:40,  y:230, w:200, h:180, risk:6 },
  { id:'cast',  name:'Continuous Caster',   sub:'Steam · Heat',        x:280, y:230, w:200, h:180, risk:10 },
  { id:'mill',  name:'Hot Rolling Mill',    sub:'PPE · Pinch points',  x:520, y:230, w:240, h:180, risk:12 },
];

const zonesG = document.getElementById('zones');
const workersG = document.getElementById('workers');

function renderZones() {
  zonesG.innerHTML = ZONES.map(z => {
    const lvl = z.risk >= 70 ? 'crit' : z.risk >= 35 ? 'warn' : 'ok';
    return `<g class="zone ${lvl}" data-id="${z.id}">
      <rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="10" stroke-width="1.5"/>
      <text class="zone-label" x="${z.x+12}" y="${z.y+22}">${z.name}</text>
      <text class="zone-sub" x="${z.x+12}" y="${z.y+38}">${z.sub} · risk ${z.risk}</text>
    </g>`;
  }).join('');
}
function renderWorkers() {
  let html = '';
  ZONES.forEach(z => {
    const n = 6 + Math.floor(Math.random()*8);
    for (let i=0;i<n;i++){
      const x = z.x + 18 + Math.random()*(z.w-36);
      const y = z.y + 50 + Math.random()*(z.h-70);
      const danger = z.risk >= 70 && Math.random() < .4;
      html += `<circle class="worker ${danger?'danger':''}" cx="${x}" cy="${y}" r="3"/>`;
    }
  });
  workersG.innerHTML = html;
}
renderZones(); renderWorkers();
setInterval(renderWorkers, 2500);

// ---------- Sparkline canvas charts ----------
function makeSeries(base, jitter, n=60) {
  const a = [];
  for (let i=0;i<n;i++) a.push(base + (Math.random()-.5)*jitter);
  return a;
}
const state = {
  ch4: makeSeries(8, 2),
  temp: makeSeries(142, 6),
  pres: makeSeries(4.2, .3),
  prob: makeSeries(2, 1),
  risk: 12,
  scenario: 0, // 0 idle, 1..7 stages
};

function drawChart(canvasId, data, color, fillColor) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = c.height;
  c.width = w*dpr; c.style.height = h+'px';
  const ctx = c.getContext('2d'); ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);
  const min = Math.min(...data), max = Math.max(...data);
  const range = max-min || 1;
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = i*(w/(data.length-1));
    const y = h - ((v-min)/range)*(h-20) - 8;
    i? ctx.lineTo(x,y) : ctx.moveTo(x,y);
  });
  ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
  ctx.fillStyle = fillColor; ctx.fill();
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = i*(w/(data.length-1));
    const y = h - ((v-min)/range)*(h-20) - 8;
    i? ctx.lineTo(x,y) : ctx.moveTo(x,y);
  });
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  // last point dot
  const lx = w, ly = h - ((data[data.length-1]-min)/range)*(h-20) - 8;
  ctx.beginPath(); ctx.arc(lx-2,ly,3,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
}

function drawAll() {
  drawChart('ch4-chart', state.ch4, '#22d3ee', 'rgba(34,211,238,.12)');
  drawChart('temp-chart', state.temp, '#fbbf24', 'rgba(251,191,36,.12)');
  drawChart('pres-chart', state.pres, '#8b5cf6', 'rgba(139,92,246,.12)');
  drawChart('prob-chart', state.prob, '#ef4444', 'rgba(239,68,68,.15)');
}
drawAll();
window.addEventListener('resize', drawAll);

// ---------- Live tick ----------
function pushVal(arr, v){ arr.push(v); if (arr.length>60) arr.shift(); }

setInterval(()=>{
  const sc = state.scenario;
  // baseline drift
  let ch4 = state.ch4.at(-1) + (Math.random()-.5)*0.6;
  let temp = state.temp.at(-1) + (Math.random()-.5)*2;
  let pres = state.pres.at(-1) + (Math.random()-.5)*0.08;
  let prob = state.prob.at(-1) + (Math.random()-.5)*0.6;

  if (sc >= 2) { ch4 += 1.2; }
  if (sc >= 3) { temp += 2.2; }
  if (sc >= 4) { pres += 0.08; }
  if (sc >= 5) { prob += 4; }
  if (sc >= 6) { prob += 6; ch4 += 1.5; }

  ch4 = Math.max(2, Math.min(95, ch4));
  temp = Math.max(120, Math.min(420, temp));
  pres = Math.max(3.5, Math.min(9, pres));
  prob = Math.max(0, Math.min(96, prob));

  pushVal(state.ch4, ch4);
  pushVal(state.temp, temp);
  pushVal(state.pres, pres);
  pushVal(state.prob, prob);

  document.getElementById('ch4-val').textContent = ch4.toFixed(0) + ' ppm';
  document.getElementById('temp-val').textContent = temp.toFixed(0) + '°C';
  document.getElementById('pres-val').textContent = pres.toFixed(1) + ' bar';
  document.getElementById('prob-val').textContent = prob.toFixed(0) + '%';

  drawAll();
}, 900);

// ---------- Event feed ----------
const eventsEl = document.getElementById('events');
function pushEvent(text, kind='', src='SENSOR') {
  const time = new Date().toLocaleTimeString('en-GB');
  const srcClass = src === 'VISION' ? 'vision' : src === 'SYSTEM' ? 'ok' : kind === 'crit' ? 'crit' : '';
  const div = document.createElement('div');
  div.className = 'event ' + kind;
  div.innerHTML = `<span class="t">${time}</span><span class="src ${srcClass}">${src}</span> ${text}`;
  eventsEl.prepend(div);
  while (eventsEl.children.length > 20) eventsEl.lastChild.remove();
}

// ---------- Risk gauge + reasoning ----------
const gaugeArc = document.getElementById('gauge-arc');
const gaugeVal = document.getElementById('gauge-val');
const reasonList = document.getElementById('reason-list');
const riskTag = document.getElementById('risk-tag');
const riskChip = document.getElementById('risk-chip');
const riskNum = document.getElementById('risk-num');
const statusPill = document.getElementById('status-pill');
const statusText = document.getElementById('status-text');

function setRisk(score, reasons) {
  state.risk = score;
  const pct = Math.min(1, score/100);
  gaugeArc.setAttribute('stroke-dashoffset', String(251 - 251*pct));
  gaugeVal.textContent = score;
  riskNum.textContent = score;
  const lvl = score >= 70 ? 'crit' : score >= 35 ? 'warn' : 'ok';
  riskTag.className = 'tag ' + (lvl==='ok'?'':lvl);
  riskTag.textContent = lvl==='crit' ? 'CRITICAL' : lvl==='warn' ? 'ELEVATED' : 'LOW';
  statusPill.className = 'status-pill ' + (lvl==='ok'?'':lvl);
  statusText.textContent = lvl==='crit' ? 'Emergency in progress — Coke Oven 4'
    : lvl==='warn' ? 'Elevated risk · monitoring' : 'All systems nominal';
  reasonList.innerHTML = reasons.map(r => `<li>${r}</li>`).join('');
}
setRisk(12, [
  'Sensors within normal range',
  'No active hot-work permits in hazard zones',
  'PPE compliance 98.2% across active shifts',
]);

// ---------- Signals (Risk Engine) ----------
function setSignal(id, pct, valText, lvl) {
  const el = document.querySelector(`.sig[data-sig="${id}"]`);
  if (!el) return;
  el.className = 'sig ' + (lvl||'');
  el.querySelector('.sig-bar i').style.width = pct + '%';
  el.querySelector('.sig-val').textContent = valText;
}

// ---------- Emergency UI ----------
const emgBanner = document.getElementById('emg-banner');
const emgState = document.getElementById('emg-state');
const emgSub = document.getElementById('emg-sub');
const emgTimer = document.getElementById('emg-timer');
const respList = document.querySelectorAll('#response-list li');
const people = document.querySelectorAll('#people li');
let evacInterval = null;
function startEvac() {
  let s = 180;
  emgTimer.textContent = '03:00';
  clearInterval(evacInterval);
  evacInterval = setInterval(()=>{
    s--; if (s<0){clearInterval(evacInterval); return;}
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    emgTimer.textContent = `${m}:${ss}`;
  }, 1000);
}
function setEmergency(on) {
  if (on) {
    emgBanner.classList.add('active');
    emgState.textContent = 'EMERGENCY ACTIVE';
    emgSub.textContent = 'Coke Oven Battery 4 · Compound risk signature detected';
    people.forEach(p => { p.classList.add('notified'); p.querySelector('.badge').textContent = 'Notified'; });
    startEvac();
  } else {
    emgBanner.classList.remove('active');
    emgState.textContent = 'STANDBY';
    emgSub.textContent = 'No active emergency. Plant operating normally.';
    emgTimer.textContent = '--:--';
    clearInterval(evacInterval);
    respList.forEach(li => { li.className = 'pending'; });
    people.forEach(p => { p.classList.remove('notified'); p.querySelector('.badge').textContent = 'Standby'; });
  }
}
function markResponse(i, cls) {
  if (respList[i]) respList[i].className = cls;
}

// ---------- Simulation (Tata Steel coke oven scenario) ----------
const btnSim = document.getElementById('btn-sim');
let simRunning = false;
const scenes = [
  { // 0
    delay: 0, run() {
      pushEvent('Simulation initiated · Coke Oven Battery 4 scenario', '', 'SYSTEM');
      state.scenario = 1;
      ZONES.find(z=>z.id==='coke').risk = 22;
      renderZones();
    }
  },
  { // 1
    delay: 2500, run() {
      pushEvent('Methane sensor MTH-04 rising · 18 ppm at CO Battery 4', 'warn');
      setSignal('ch4', 35, '18 ppm · elevated', 'warn');
      setRisk(34, [
        'Methane (CH₄) rising at Coke Oven Battery 4',
        'No mitigation actions taken yet',
        'Wind direction concentrating gas near hot work area',
      ]);
      state.scenario = 2;
      ZONES.find(z=>z.id==='coke').risk = 38;
      renderZones();
    }
  },
  { // 2
    delay: 3500, run() {
      pushEvent('Hot-work permit HW-2087 ACTIVE in CO Battery 4 (welding)', 'warn', 'SYSTEM');
      setSignal('permit', 80, 'HW-2087 active · welding', 'warn');
      setRisk(52, [
        'Methane CH₄ rising AND active hot-work permit in same zone',
        'Compound risk signature MATCH: gas + ignition source',
        'Temperature trending up 8°C in last 90s',
      ]);
      state.scenario = 3;
      ZONES.find(z=>z.id==='coke').risk = 58;
      renderZones();
      markResponse(0,'active');
    }
  },
  { // 3
    delay: 3500, run() {
      pushEvent('CAM-07 vision AI: Worker #07 — NO HELMET in hot zone', 'crit', 'VISION');
      document.getElementById('bbox-violation').style.display = 'block';
      const det = document.getElementById('detections');
      det.innerHTML = `
        <li><span class="dot"></span> Helmet detected — 2 workers</li>
        <li><span class="dot bad"></span> Worker #07 — NO HELMET (12s)</li>
        <li><span class="dot bad"></span> 3 workers in restricted radius</li>`;
      setSignal('ppe', 62, '88% · violation detected', 'warn');
      setSignal('prox', 70, '5 in zone · 3 at risk', 'warn');
      setRisk(71, [
        'Gas + ignition + PPE violation — triple correlated risk',
        'Worker #07 within 8m of welding arc without helmet',
        'Recommend: halt hot-work, evacuate radius, vent zone',
      ]);
      markResponse(0,'done'); markResponse(1,'active');
    }
  },
  { // 4
    delay: 3000, run() {
      pushEvent('Pressure spike PR-04 · 4.9 bar in offtake line', 'crit');
      setSignal('temp', 70, '178°C · rising', 'warn');
      setSignal('ch4', 78, '46 ppm · CRITICAL', 'crit');
      setRisk(84, [
        'Pressure spike in offtake line indicates blockage / backflow',
        'Methane now 46 ppm — above LEL warning threshold',
        'AI recommends IMMEDIATE evacuation of Battery 4',
      ]);
      state.scenario = 5;
      ZONES.find(z=>z.id==='coke').risk = 82;
      renderZones();
      markResponse(1,'done'); markResponse(2,'active');
    }
  },
  { // 5
    delay: 2500, run() {
      pushEvent('AI DECISION: Trigger emergency protocol — Battery 4', 'crit', 'SYSTEM');
      pushEvent('Sirens activated · gas valves isolated · zone locked', 'crit', 'SYSTEM');
      setEmergency(true);
      pushEvent(
"Emergency evacuation route activated",
"crit",
"SYSTEM"
);
map.setZoom(17);
      markResponse(2,'done'); markResponse(3,'active');
      state.scenario = 6;
      ZONES.find(z=>z.id==='coke').risk = 91;
      renderZones();
      setRisk(91, [
        'Compound risk score 91 — explosion probability 78%',
        'Evacuation routes pushed to 412 worker wearables',
        'Operations Head + Fire Response + local authorities notified',
      ]);
    }
  },
  { // 6
    delay: 2500, run() {
      pushEvent('Evac route Δ → Assembly Point B broadcast to wearables', 'warn', 'SYSTEM');
      markResponse(3,'done'); markResponse(4,'active');
    }
  },
  { // 7
    delay: 2500, run() {
      pushEvent('Incident report INC-2026-0641 auto-generated', '', 'SYSTEM');
      markResponse(4,'done'); markResponse(5,'done');
      simRunning = false;
      btnSim.textContent = '↻ Reset Simulation';
      btnSim.disabled = false;
    }
  },
];

function resetSim() {
  state.scenario = 0;
  state.ch4 = makeSeries(8, 2);
  state.temp = makeSeries(142, 6);
  state.pres = makeSeries(4.2, .3);
  state.prob = makeSeries(2, 1);
  ZONES.forEach(z => z.risk = [8,18,14,6,10,12][ZONES.indexOf(z)]);
  renderZones();
  document.getElementById('bbox-violation').style.display = 'none';
  document.getElementById('detections').innerHTML = `
    <li><span class="dot"></span> Helmet detected — 3 workers</li>
    <li><span class="dot"></span> High-vis vest detected — 3 workers</li>
    <li><span class="dot"></span> Restricted zone clear</li>`;
  setSignal('ch4', 8, '8 ppm · normal', '');
  setSignal('temp', 30, '142°C · normal', '');
  setSignal('permit', 0, 'none active', '');
  setSignal('ppe', 98, '98.2%', '');
  setSignal('vent', 92, 'nominal', '');
  setSignal('prox', 20, '3 in zone', '');
  setRisk(12, [
    'Sensors within normal range',
    'No active hot-work permits in hazard zones',
    'PPE compliance 98.2% across active shifts',
  ]);
  setEmergency(false);
  map.setZoom(15);
  eventsEl.innerHTML = '';
  pushEvent('Simulation reset · plant returned to baseline', '', 'SYSTEM');
  btnSim.textContent = '▶ Run AI Safety Simulation';
}

btnSim.addEventListener('click', async () => {
  if (simRunning) return;
  if (btnSim.textContent.includes('Reset')) { resetSim(); return; }
  simRunning = true;
  btnSim.disabled = true;
  btnSim.textContent = '● Simulation running…';
  for (const sc of scenes) {
    await new Promise(r => setTimeout(r, sc.delay));
    sc.run();
  }
});

// ---------- Copilot ----------
const chat = document.getElementById('chat');
const chatText = document.getElementById('chat-text');
const chatSend = document.getElementById('chat-send');
function addMsg(who, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.innerHTML = `<b>${who==='ai'?'SafeSteel AI':'You'}</b><p>${text}</p>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
async function answer(q){

    const latestEvents=[...eventsEl.children]
        .slice(0,5)
        .map(e=>e.innerText)
        .join("\n");

    const prompt=`

You are SafeSteel AI.

You are an Industrial Safety AI used inside a steel plant.

Current Plant Status

Risk Score : ${state.risk}

Methane : ${state.ch4.at(-1).toFixed(1)} ppm

Temperature : ${state.temp.at(-1).toFixed(1)} °C

Pressure : ${state.pres.at(-1).toFixed(1)} bar

Explosion Probability : ${state.prob.at(-1).toFixed(0)} %

Latest Events

${latestEvents}

Answer the user's question professionally.

Question:

${q}

`;

    try{

        const response=await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                contents:[

                    {

                        parts:[

                            {

                                text:prompt

                            }

                        ]

                    }

                ]

            })

        });

        const data=await response.json();

        return data.candidates[0].content.parts[0].text;

    }

    catch(e){

        return "Unable to contact Gemini AI.";

    }

}

async function sendChat(){

    const q=chatText.value.trim();

    if(!q) return;

    addMsg("user",q);

    chatText.value="";

    addMsg("ai","Thinking...");

    const loading=chat.lastChild;

    const reply=await answer(q);

    loading.remove();

    addMsg("ai",reply);

}

const voiceBtn=document.getElementById("voice-btn");

if("webkitSpeechRecognition" in window){

    const recognition=new webkitSpeechRecognition();

    recognition.lang="en-IN";

    recognition.continuous=false;

    recognition.interimResults=false;

    voiceBtn.onclick=()=>{

        recognition.start();

        voiceBtn.innerHTML="🎙";

    };

    recognition.onresult=(event)=>{

        chatText.value=event.results[0][0].transcript;

        voiceBtn.innerHTML="🎤";

        sendChat();

    };

    recognition.onend=()=>{

        voiceBtn.innerHTML="🎤";

    };

}

const uploadBtn=document.getElementById("upload-btn");
const upload=document.getElementById("vision-upload");
const preview=document.getElementById("vision-preview");
uploadBtn.onclick=()=>upload.click();

function fileToBase64(file){
return new Promise((resolve)=>{
const reader=new FileReader();
reader.onload=()=>{
resolve(reader.result.split(",")[1]);
};

reader.readAsDataURL(file);

});

}

async function analyzeImage(file){

const base64=await fileToBase64(file);

const prompt=`

You are an industrial safety AI.

Analyze this factory image.

Return only bullet points.

Mention

Helmet

Vest

Gloves

Fire

Smoke

Unsafe behavior

Worker count

Hazards

`;

const response=await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

contents:[

{

parts:[

{

text:prompt

},

{

inline_data:{

mime_type:file.type,

data:base64}}]}]})});

const data=await response.json();

return data.candidates[0].content.parts[0].text;

}
upload.onchange=async()=>{

const file=upload.files[0];

if(!file) return;

preview.src=URL.createObjectURL(file);

preview.style.display="block";

document.getElementById("detections").innerHTML=

"<li>Analyzing image...</li>";

const result=await analyzeImage(file);

const bullets=result

.split("\n")

.filter(x=>x.trim());

document.getElementById("detections").innerHTML=

bullets

.map(x=>`<li><span class="dot"></span>${x}</li>`)

.join("");

};
chatSend.addEventListener('click', sendChat);
chatText.addEventListener('keydown', e => { if (e.key==='Enter') sendChat(); });
document.querySelectorAll('.suggest button').forEach(b => {
  b.addEventListener('click', () => { chatText.value = b.dataset.q; sendChat(); });
});

async function loadWeather(){

try{

const res=await fetch(

`https://api.openweathermap.org/data/2.5/weather?q=Jamshedpur&appid=${WEATHER_KEY}&units=metric`

);

const data=await res.json();

document.getElementById("weather-temp").innerHTML=

Math.round(data.main.temp)+"°C";

document.getElementById("humidity").innerHTML=

data.main.humidity+"%";

document.getElementById("wind").innerHTML=

data.wind.speed+" km/h";

document.getElementById("weather-type").innerHTML=

data.weather[0].main;

let impact="";

if(data.wind.speed<3)

impact="Poor gas dispersion. Leak risk may increase.";

else if(data.wind.speed<8)

impact="Moderate ventilation conditions.";

else

impact="Good ventilation. Gas disperses quickly.";

document.getElementById("weather-impact").innerHTML=

impact;

}

catch(e){

console.log(e);

}

}
loadWeather();

setInterval(loadWeather,600000);
let map;

function initEvacuationMap(){

map = new google.maps.Map(

document.getElementById("evac-map"),

{
center:{lat:22.8046,lng:86.2029},
zoom:15,
styles:[
{
featureType:"all",
elementType:"geometry",
stylers:[{color:"#0f172a"}]
},
{
featureType:"road",
elementType:"geometry",
stylers:[{color:"#1e293b"}]
}
]
}

);

const dangerZone = {

lat:22.8046,
lng:86.2029

};

const assemblyPoint = {

lat:22.8120,
lng:86.2115

};

new google.maps.Marker({

position:dangerZone,
map,
title:"Coke Oven Battery 4"

});

new google.maps.Marker({

position:assemblyPoint,
map,
title:"Assembly Point B"

});

new google.maps.Polyline({

path:[dangerZone,assemblyPoint],

geodesic:true,

strokeColor:"#ef4444",

strokeOpacity:1,

strokeWeight:5,

map

});

}
window.addEventListener("load",()=>{

if(window.google){

initEvacuationMap();

}

});