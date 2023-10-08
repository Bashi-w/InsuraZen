//creating a constant for static cache
const statCache='statv17';

//creating a constant for dynamic cache
const dynaCache='dynav8';

//storing shell/static assets in an array
const assets=[
    '/',
    '/index.html',
    '/health.html',
    '/retirement.html',
    '/protection.html',
    '/motor.html',
    '/assets/css/main.css',
    '/assets/css/common.css',
    '/assets/js/main.js',
    '/assets/testimonial.json',
    '/fallback.html',
    '/assets/img/fallback-nobg.png',
    '/assets/img/test2-nobg2.webp',
    '/assets/img/health2.webp',
    '/assets/img/health.gif',
    '/assets/img/car.webp',
    '/assets/img/motor.gif',
    '/assets/img/protection.webp',
    '/assets/img/family.gif',
    '/assets/img/old.webp',
    '/assets/img/retiregif.gif',
    '/assets/js/lordicon.js'
];



//the install event
self.addEventListener('install',(evt)=>{
    console.log("Service worker installed.");
    //install event should wait until whatever inside evt.waitUntil() finishes.
    evt.waitUntil(
        //open static cache
        caches.open(statCache)
    .then((cache)=>{
        console.log("Caching assets...");
        //adding all assets in assets array into cache..
        cache.addAll(assets);
    })
    );
    
});
//The activate event
self.addEventListener('activate',(evt)=>{
    console.log("Service worker is active!");
    evt.waitUntil(
        //accessing all versions of caches available currently
        caches.keys()
        .then((keys)=>{
            //console.log(keys);
            //going through the list of caches, checking whether the cache name is equal to current cache version/s:static and dynamic and getting rid of any old cache versions
            return Promise.all(
                keys.filter(key=>key!==statCache && key!==dynaCache)
                .map(key=>caches.delete(key))
            );

        })
    );
});

//The fetch event handler
self.addEventListener('fetch',(evt)=>{
    // console.log("Fetch event",evt);
    //interrupt the normal request and respond with a custom response
    evt.respondWith(
        //check if the resource exists in cache
        caches.match(evt.request)
        .then((cacheRes)=>{
            //return from cache if it is there in cache. or else fetch from server
            return cacheRes || fetch(evt.request)
            //when fetching from server, add the request and response to dynamic cache to access the resource/s when offline
            .then(fetchRes=>{
                return caches.open(dynaCache)
                .then(cache=>{
                    cache.put(evt.request.url,fetchRes.clone());
                    return fetchRes;
                });
            });

            //returning the fallback page if the resource is not available in any of the caches
        }).catch(()=>{
            //check whether the request url contains .html in it
            if(evt.request.url.indexOf('.html')>-1){
                return caches.match('/fallback.html')
            }
            })
    );
})