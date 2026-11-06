const plates=[
 ['PA','Pacific Plate',-145,5,'The largest plate lies beneath much of the Pacific Ocean.'],
 ['NA','North American Plate',-100,48,'Look beneath North America and Greenland.'],
 ['SA','South American Plate',-50,-22,'Look beneath South America and the Atlantic to its east.'],
 ['EU','Eurasian Plate',65,48,'This plate carries much of Europe and Asia.'],
 ['AF','African Plate',10,5,'Look beneath western and central Africa. This model separates the Somali Plate to the east.'],
 ['AN','Antarctic Plate',15,-75,'Look around the South Pole, along the bottom of the map.'],
 ['AU','Australian Plate',135,-28,'Look beneath Australia. This model treats India separately.'],
 ['IN','Indian Plate',75,5,'Look south of the Himalayas, around India and the northern Indian Ocean.'],
 ['NZ','Nazca Plate',-90,-25,'Find the oceanic plate just west of South America.'],
 ['CA','Caribbean Plate',-72,15,'Look between North and South America, in the Caribbean Sea.'],
 ['CO','Cocos Plate',-98,8,'Look in the Pacific just off Central America’s western coast.'],
 ['PS','Philippine Sea Plate',135,20,'Look east of the Philippines and south of Japan.']
].map(([code,name,lon,lat,hint],i)=>({code,name,lon,lat,hint,number:i+1}));
const $=s=>document.querySelector(s),ns='http://www.w3.org/2000/svg';
let selected=null,matched=new Set(),attempts=0,ready=false;
function el(tag,attrs,parent){const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);parent.append(e);return e;}
const xy=([lon,lat])=>[(lon+180)/360*1000,(90-lat)/180*500];
function path(geometry){const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;return polygons.map(poly=>poly.map(ring=>ring.map((point,i)=>`${i?'L':'M'}${xy(point).map(n=>n.toFixed(2)).join(',')}`).join(' ')+'Z').join(' ')).join(' ');}
function feedback(message,type=''){$('#feedback').textContent=message;$('#feedback').className=type;}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function clearHint(){document.querySelectorAll('.hinted').forEach(e=>e.classList.remove('hinted'));}
function choose(code){if(!ready||matched.has(code))return;selected=code;clearHint();document.querySelectorAll('#names button').forEach(b=>{b.classList.toggle('selected',b.dataset.code===code);b.setAttribute('aria-pressed',b.dataset.code===code);});feedback(`Find the ${plates.find(p=>p.code===code).name}. Click a region or its numbered marker.`);}
function match(code){if(!ready||matched.has(code))return;if(!selected){feedback('First choose a plate name from the list.');return;}attempts++;if(code!==selected){feedback('Not quite. Your chosen name is still selected. Try another region, or ask for a hint.','error');return;}
const plate=plates.find(p=>p.code===code);matched.add(code);selected=null;clearHint();document.querySelectorAll(`.plate[data-code="${code}"]`).forEach(e=>{e.classList.add('matched');e.setAttribute('aria-label',`${plate.name}, matched`);});const marker=$(`.marker[data-code="${code}"]`);marker.classList.add('matched');marker.querySelector('text').textContent='✓';const button=$(`#names button[data-code="${code}"]`);button.classList.remove('selected');button.classList.add('matched');button.disabled=true;button.setAttribute('aria-pressed','false');button.querySelector('span').textContent='✓';$('#score').textContent=`${matched.size} / ${plates.length}`;$('#remaining').textContent=`${plates.length-matched.size} remaining`;feedback(matched.size===plates.length?`You mapped them all! ${plates.length} plates matched in ${attempts} attempts. Start again for another round.`:`Correct! Region ${plate.number} is the ${plate.name}. Choose your next name.`,'success');}
function reset(){selected=null;matched=new Set();attempts=0;clearHint();$('#score').textContent=`0 / ${plates.length}`;$('#remaining').textContent=`${plates.length} remaining`;$('#names').replaceChildren();shuffle(plates).forEach(p=>{const b=document.createElement('button');b.dataset.code=p.code;b.setAttribute('aria-pressed','false');b.textContent=p.name;const span=document.createElement('span');span.textContent='↗';b.append(span);b.onclick=()=>choose(p.code);$('#names').append(b);});document.querySelectorAll('.plate.playable').forEach(e=>{e.classList.remove('matched');const p=plates.find(p=>p.code===e.dataset.code);e.setAttribute('aria-label',`Plate region ${p.number}`);});document.querySelectorAll('.marker').forEach(e=>{e.classList.remove('matched');e.querySelector('text').textContent=plates.find(p=>p.code===e.dataset.code).number;});feedback('Choose a name on the left to begin your journey.');}
$('#restart').onclick=()=>{if(ready)reset();};$('#hint').onclick=()=>{if(!selected){feedback('Select a plate name first, then ask for a hint.');return;}const p=plates.find(p=>p.code===selected);feedback(p.hint);document.querySelectorAll(`.plate[data-code="${selected}"]`).forEach(e=>e.classList.add('hinted'));};
async function load(){try{const responses=await Promise.all(['data/plates.geojson','data/land.geojson'].map(u=>fetch(u)));if(responses.some(r=>!r.ok))throw new Error('Map files unavailable');const [boundaries,land]=await Promise.all(responses.map(r=>r.json()));
for(let lon=-180;lon<=180;lon+=30){const x=xy([lon,0])[0];el('line',{x1:x,y1:0,x2:x,y2:500,stroke:'#dbe4d6','stroke-width':.6},$('#grid'));}for(let lat=-60;lat<=60;lat+=30){const y=xy([0,lat])[1];el('line',{x1:0,y1:y,x2:1000,y2:y,stroke:'#dbe4d6','stroke-width':.6},$('#grid'));}
boundaries.features.forEach(f=>{const code=f.properties.Code,p=plates.find(p=>p.code===code);const e=el('path',{d:path(f.geometry),class:`plate ${p?'playable':'inactive'}`,'data-code':code,'fill-rule':'evenodd'},$('#regions'));if(p){e.setAttribute('role','button');e.setAttribute('tabindex','0');e.style.fill=['#c7d7b5','#d9d8b7','#c4d5c2','#d4daba'][p.number%4];e.onclick=()=>match(code);e.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();match(code);}};}});
land.features.forEach(f=>el('path',{d:path(f.geometry),'fill-rule':'evenodd'},$('#land')));
plates.forEach(p=>{const [x,y]=xy([p.lon,p.lat]);const g=el('g',{class:'marker','data-code':p.code},$('#markers'));el('circle',{cx:x,cy:y,r:10},g);el('text',{x,y},g).textContent=p.number;});ready=true;reset();}catch(error){feedback('The map could not load. Open this page using Live Server in VS Code (not by double-clicking the HTML file), and check that the data folder is present.','error');$('#hint').disabled=true;$('#restart').disabled=true;}}
load();
