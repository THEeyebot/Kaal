const PRODUCTS = [
  {id:'p1',name:'Wireless Earbuds Pro',price:59,oldPrice:79,category:'Electronics',sub:'Audio',label:'Trending',rating:4.6,images:['https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=900','https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900'],videos:['https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'],desc:'Noise-cancelling earbuds with long battery.',stock:37},
  {id:'p2',name:'Smart Fitness Band',price:39,oldPrice:59,category:'Electronics',sub:'Wearables',label:'Best Seller',rating:4.4,images:['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=900','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900'],videos:[],desc:'Health tracking and notifications.',stock:52},
  {id:'p3',name:'Women Casual Sneakers',price:49,oldPrice:69,category:'Fashion',sub:'Shoes',label:'Flash Sale',rating:4.7,images:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'],videos:[],desc:'Comfortable everyday sneakers.',stock:21},
  {id:'p4',name:'Minimal Desk Lamp',price:29,oldPrice:45,category:'Home',sub:'Decor',label:'Deal',rating:4.3,images:['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900'],videos:[],desc:'Warm light with touch controls.',stock:15},
  {id:'p5',name:'Gaming Keyboard RGB',price:89,oldPrice:119,category:'Electronics',sub:'Accessories',label:'Trending',rating:4.8,images:['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=900'],videos:[],desc:'Mechanical keys and dynamic RGB.',stock:9},
  {id:'p6',name:'Organic Green Tea Pack',price:19,oldPrice:29,category:'Groceries',sub:'Beverages',label:'Recommended',rating:4.2,images:['https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=900'],videos:[],desc:'Refreshing premium green tea.',stock:80}
];

const q=(s)=>document.querySelector(s), qa=(s)=>document.querySelectorAll(s);
const getCart=()=>JSON.parse(localStorage.getItem('cart_v2')||'[]');
const saveCart=(cart)=>{localStorage.setItem('cart_v2',JSON.stringify(cart)); updateCartCount();};
const updateCartCount=()=>qa('.cartCount').forEach(e=>e.textContent=getCart().reduce((a,c)=>a+c.qty,0));

function renderProductCards(selector, list){
  const m=q(selector); if(!m) return;
  m.innerHTML=list.map(p=>`<article class="card product"><img src="${p.images[0]}" alt="${p.name}" loading="lazy"><h3>${p.name}</h3><p class='meta'>${p.category} / ${p.sub}</p><p><strong>$${p.price}</strong> <span class='old'>$${p.oldPrice}</span></p><div class='row'><a class='btn' href='product.html?id=${p.id}'>View</a><button class='btn primary add' data-id='${p.id}'>Add</button></div></article>`).join('');
}
function addToCart(id){ const p=PRODUCTS.find(x=>x.id===id); if(!p) return; const cart=getCart(); const ex=cart.find(i=>i.id===id); ex?ex.qty++:cart.push({id,qty:1}); saveCart(cart); }
function renderCart(){ const m=q('#cartItems'); if(!m) return; const cart=getCart(); if(!cart.length){m.innerHTML='<p class="card">Cart empty.</p>'; q('#cartTotal').textContent='0.00'; return;} m.innerHTML=cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id); return `<div class='card row between'><div><h4>${p.name}</h4><small>${i.qty} x $${p.price}</small></div><div><button class='btn small dec' data-id='${i.id}'>-</button><button class='btn small inc' data-id='${i.id}'>+</button></div></div>`}).join(''); q('#cartTotal').textContent=cart.reduce((a,i)=>a+PRODUCTS.find(p=>p.id===i.id).price*i.qty,0).toFixed(2); }

function renderProductDetail(){
  const m=q('#productDetail'); if(!m) return;
  const id=new URLSearchParams(location.search).get('id')||'p1';
  const p=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
  let media=[...p.images.map(src=>({type:'img',src})),...p.videos.map(src=>({type:'video',src}))];
  let active=0;
  m.innerHTML=`<div class='pd-grid'><div><div id='mainMedia' class='main-media'></div><div class='thumbs' id='thumbs'></div></div><div><h1>${p.name}</h1><p>${p.desc}</p><p class='price-big'>$${p.price} <span class='old'>$${p.oldPrice}</span></p><p>⭐ ${p.rating} | Stock: ${p.stock}</p><button class='btn primary add' data-id='${p.id}'>Add to Cart</button></div></div>`;
  const renderMedia=()=>{q('#mainMedia').innerHTML=media[active].type==='img'?`<img src='${media[active].src}' alt='${p.name}'>`:`<video controls playsinline preload='metadata' src='${media[active].src}'></video>`; q('#thumbs').innerHTML=media.map((m,i)=>`<button class='thumb ${i===active?'on':''}' data-i='${i}'>${m.type==='img'?`<img src='${m.src}'>`:`<video src='${m.src}' muted></video>`}</button>`).join('');};
  renderMedia();
  let sx=0; q('#mainMedia').addEventListener('touchstart',e=>sx=e.touches[0].clientX); q('#mainMedia').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40){active=(active+(dx<0?1:-1)+media.length)%media.length; renderMedia();}});
  m.addEventListener('click',e=>{const t=e.target.closest('.thumb'); if(t){active=Number(t.dataset.i); renderMedia();}});
}

function initSearch(){
  const box=q('#searchBox'), live=q('#liveResults'); if(!box) return;
  box.addEventListener('input',()=>{const v=box.value.toLowerCase().trim(); const results=PRODUCTS.filter(p=>p.name.toLowerCase().includes(v)||p.category.toLowerCase().includes(v)).slice(0,6); if(!v){live.innerHTML=''; return;} live.innerHTML=results.map(r=>`<a href='product.html?id=${r.id}'>${r.name} <small>${r.category}</small></a>`).join('')||'<span>No results</span>';});
  q('#searchForm')?.addEventListener('submit',e=>{e.preventDefault(); location.href=`search.html?q=${encodeURIComponent(box.value)}`;});
  const mount=q('#searchResults'); if(mount){const qv=(new URLSearchParams(location.search).get('q')||'').toLowerCase(); q('#searchTitle').textContent=qv; renderProductCards('#searchResults',PRODUCTS.filter(p=>p.name.toLowerCase().includes(qv)||p.category.toLowerCase().includes(qv)));}
}

function initFilters(){
  const m=q('#categoryGrid'); if(!m) return; let list=[...PRODUCTS];
  renderProductCards('#categoryGrid',list);
  q('#categoryFilter')?.addEventListener('change',e=>{const v=e.target.value; list=v==='All'?PRODUCTS:PRODUCTS.filter(p=>p.category===v); renderProductCards('#categoryGrid',list);});
}

function initCountdown(){ const el=q('#dealTimer'); if(!el) return; let t=3600*6; setInterval(()=>{t=Math.max(0,t-1); const h=String(Math.floor(t/3600)).padStart(2,'0'); const m=String(Math.floor((t%3600)/60)).padStart(2,'0'); const s=String(t%60).padStart(2,'0'); el.textContent=`${h}:${m}:${s}`;},1000); }

document.addEventListener('click',e=>{if(e.target.classList.contains('add')) addToCart(e.target.dataset.id); if(e.target.classList.contains('inc')||e.target.classList.contains('dec')){const id=e.target.dataset.id; const cart=getCart(); const i=cart.find(x=>x.id===id); if(!i)return; e.target.classList.contains('inc')?i.qty++:i.qty--; const next=cart.filter(x=>x.qty>0); saveCart(next); renderCart();} if(e.target.classList.contains('menuToggle')) q('.nav').classList.toggle('open');});

function bootstrap(){updateCartCount(); renderProductCards('#homeProducts',PRODUCTS); renderProductCards('#trendingProducts',PRODUCTS.filter(p=>p.label==='Trending')); renderProductCards('#bestProducts',PRODUCTS.filter(p=>p.label.includes('Best'))); renderProductCards('#flashProducts',PRODUCTS.filter(p=>p.label.includes('Flash'))); renderProductCards('#labelProducts',PRODUCTS.filter(p=>p.label===((new URLSearchParams(location.search).get('name'))||'Trending'))); renderCart(); renderProductDetail(); initSearch(); initFilters(); initCountdown();}
bootstrap();
