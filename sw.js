const CACHE="quiz-master-v19";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg","./question-bank.js","./question-bank-new.js","./question-bank-islamic.js","./question-bank-live.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 if(e.request.mode==="navigate"||url.pathname.endsWith("/index.html")){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put("./index.html",copy));}return res;}).catch(()=>caches.match("./index.html")));
  return;
 }
 if(url.pathname.endsWith("/question-bank-live.json")){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res;}).catch(()=>caches.match(e.request)));
  return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match("./index.html"))));
});
