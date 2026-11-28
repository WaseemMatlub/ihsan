const V="ihsan-7ec76a30ab", D="ihsan-data", F="ihsan-fonts";
const CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-maskable-192.png","icon-maskable-512.png","apple-touch-icon.png","favicon.png","logo-256.png","data/meta.json"];
self.addEventListener("push",e=>{let d={};try{d=e.data.json()}catch(x){d={title:"Dār aṣ-Ṣiddīq",body:e.data?e.data.text():""}} e.waitUntil(self.registration.showNotification(d.title||"Dār aṣ-Ṣiddīq",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:"streak"}))});
self.addEventListener("notificationclick",e=>{e.notification.close(); e.waitUntil(clients.matchAll({type:"window"}).then(ws=>{for(const w of ws){if("focus" in w) return w.focus()} return clients.openWindow("./")}))});
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>caches.open(D)).then(c=>c.addAll(["data/learn.json?v=ac64729a","data/guides.json","data/salawat.json","data/duas.json","data/stories.json","data/dalail.json","data/quotes.json","data/decks/fard_aqeedah.json","data/decks/fard_tahara.json","data/decks/fard_salah.json","data/decks/fard_sawm.json","data/decks/fard_zakat.json"]).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("ihsan-")&&![V,D,F].includes(k)).map(k=>caches.delete(k))))
  .then(()=>caches.open(D)).then(c=>c.keys().then(rs=>Promise.all(rs.filter(q=>/learn\.json\?v=/.test(q.url)&&!q.url.includes("v=ac64729a")).map(q=>c.delete(q))))).then(()=>self.clients.claim()))});
/* Three stores: V = the app itself (replaced on each update), D = lessons, books and audio (kept across updates, refreshed in the background),
   F = fonts. So anything learnt or saved for offline stays available without internet. */
self.addEventListener("fetch",e=>{const r=e.request; if(r.method!=="GET") return; const u=new URL(r.url);
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){ e.respondWith(caches.open(F).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res})))); return; }
  if(u.origin!==location.origin) return;
  if(u.pathname.endsWith("config.json")) return;
  if(r.mode==="navigate"||r.destination==="document"){ const net=fetch(r).then(res=>{if(res.ok)caches.open(V).then(c=>c.put("index.html",res.clone()));return res});
    e.respondWith(Promise.race([net.catch(()=>null),new Promise(ok=>setTimeout(()=>ok(null),3500))]).then(res=>res||caches.match("index.html").then(hit=>hit||net))); return; }
  if(u.pathname.endsWith("fixes.json")){ e.respondWith(fetch(r).then(res=>{caches.open(D).then(c=>c.put(u.pathname,res.clone()));return res}).catch(()=>caches.match(u.pathname))); return; }
  if(/\/(data|audio)\//.test(u.pathname)){ const key=u.origin+u.pathname+(/[?&]v=/.test(u.search)?u.search:""); e.respondWith(caches.open(D).then(c=>c.match(key).then(hit=>{const net=fetch(r).then(res=>{if(res.ok)c.put(key,res.clone());return res}).catch(()=>hit);return hit||net}))); return; }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok)caches.open(V).then(c=>c.put(r,res.clone()));return res})))});
