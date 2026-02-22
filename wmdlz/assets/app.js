const state={language:'zh',currency:'CNY',cart:[]}
const config={payment:{stripe:{enabled:false,link:''},paypal:{enabled:false,link:''},wechat:{enabled:false,link:''},alipay:{enabled:false,link:''}}}
const defaultProducts=[
  {id:'p1',name:{zh:'纯棉T恤',en:'Cotton T-Shirt'},priceUSD:18.9,image:'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop',active:true},
  {id:'p2',name:{zh:'休闲牛仔裤',en:'Casual Jeans'},priceUSD:39.5,image:'https://images.unsplash.com/photo-1602810318383-8ab5e88ba0e9?q=80&w=800&auto=format&fit=crop',active:true},
  {id:'p3',name:{zh:'轻薄风衣',en:'Lightweight Trench'},priceUSD:59,image:'https://images.unsplash.com/photo-1517021897933-0e0319cfbc34?q=80&w=800&auto=format&fit=crop',active:true},
  {id:'p4',name:{zh:'针织开衫',en:'Knit Cardigan'},priceUSD:42.3,image:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',active:true},
  {id:'p5',name:{zh:'商务衬衫',en:'Business Shirt'},priceUSD:32,image:'https://images.unsplash.com/photo-1520974982471-4b5f03a388aa?q=80&w=800&auto=format&fit=crop',active:true},
  {id:'p6',name:{zh:'印花连衣裙',en:'Printed Dress'},priceUSD:48.6,image:'https://images.unsplash.com/photo-1542326237-94b1c5a5b2a8?q=80&w=800&auto=format&fit=crop',active:true},
  {id:'p7',name:{zh:'运动卫衣',en:'Hoodie'},priceUSD:36.2,image:'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop',active:true},
  {id:'p8',name:{zh:'羽绒外套',en:'Down Jacket'},priceUSD:89,image:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',active:true}
]
function loadProducts(){try{return JSON.parse(localStorage.getItem('wmdlz_products')||'null')}catch(e){return null}}
let products=loadProducts()||defaultProducts
function saveProducts(){localStorage.setItem('wmdlz_products',JSON.stringify(products))}
const rates={USD:1,EUR:0.92,CNY:7.1}
const symbols={USD:'$ ',EUR:'€ ',CNY:'¥ '}
function loadState(){try{const s=JSON.parse(localStorage.getItem('wmdlz_state')||'{}');if(s.language)state.language=s.language;if(s.currency)state.currency=s.currency;if(Array.isArray(s.cart))state.cart=s.cart}catch(e){}}
function saveState(){localStorage.setItem('wmdlz_state',JSON.stringify(state))}
function loadOrders(){try{return JSON.parse(localStorage.getItem('wmdlz_orders')||'[]')}catch(e){return []}}
function saveOrders(list){localStorage.setItem('wmdlz_orders',JSON.stringify(list))}
let orders=loadOrders()
function qs(id){return document.getElementById(id)}
function show(el){el.classList.remove('hidden')}
function hide(el){el.classList.add('hidden')}
function tLabel(k){return dict[state.language][k]}
function convert(amountUSD){return amountUSD*rates[state.currency]}
function fmt(amountUSD){const v=convert(amountUSD);return symbols[state.currency]+v.toFixed(state.currency==='CNY'?2:2)}
function fmtCurrency(amountUSD,c){const v=amountUSD*rates[c];return symbols[c]+v.toFixed(2)}
function cartCount(){return state.cart.reduce((a,b)=>a+b.qty,0)}
function findProduct(id){return products.find(p=>p.id===id)}
function addToCart(id){const item=state.cart.find(i=>i.id===id);if(item){item.qty+=1}else{state.cart.push({id,qty:1})}saveState();renderCart();updateCartBadge()}
function removeFromCart(id){state.cart=state.cart.filter(i=>i.id!==id);saveState();renderCart();updateCartBadge()}
function setQty(id,qty){const i=state.cart.find(x=>x.id===id);if(!i)return;i.qty=qty<1?1:qty;saveState();renderCart();updateCartBadge()}
function updateCartBadge(){qs('cartBtn').textContent=tLabel('cart')+' ('+cartCount()+')'}
function renderProducts(){const grid=qs('productGrid');grid.innerHTML='';products.filter(p=>p.active).forEach(p=>{const el=document.createElement('div');el.className='card';el.innerHTML=`<img src="${p.image}" alt="${p.name[state.language]}"><div class="card-body"><div class="card-title">${p.name[state.language]}</div><div class="price">${fmt(p.priceUSD)}</div><div class="actions"><button class="btn primary" data-id="${p.id}">${state.language==='zh'?'加入购物车':'Add to Cart'}</button></div></div>`;grid.appendChild(el)});grid.querySelectorAll('button[data-id]').forEach(btn=>btn.addEventListener('click',e=>addToCart(e.currentTarget.getAttribute('data-id'))))}
function renderCart(){const box=qs('cartItems');box.innerHTML='';let totalUSD=0;state.cart.forEach(i=>{const p=findProduct(i.id);if(!p)return;totalUSD+=p.priceUSD*i.qty;const row=document.createElement('div');row.className='cart-item';row.innerHTML=`<img src="${p.image}"><div><div>${p.name[state.language]}</div><div class="muted">${fmt(p.priceUSD)} × ${i.qty}</div></div><div><div style="display:flex;gap:6px;align-items:center"><button class="btn" data-act="dec" data-id="${i.id}">-</button><span>${i.qty}</span><button class="btn" data-act="inc" data-id="${i.id}">+</button><button class="btn" data-act="rm" data-id="${i.id}">✕</button></div></div>`;box.appendChild(row)});qs('cartTotal').textContent=(state.language==='zh'?'总计: ':'Total: ')+fmt(totalUSD)}
function bindCartActions(){qs('cartItems').addEventListener('click',e=>{const t=e.target;if(!(t instanceof HTMLElement))return;const act=t.getAttribute('data-act');const id=t.getAttribute('data-id');if(!act||!id)return;if(act==='inc'){const item=state.cart.find(x=>x.id===id);if(item)setQty(id,item.qty+1)}else if(act==='dec'){const item=state.cart.find(x=>x.id===id);if(item)setQty(id,item.qty-1)}else if(act==='rm'){removeFromCart(id)}})}
function initUI(){qs('langSelect').value=state.language;qs('currencySelect').value=state.currency;qs('langSelect').addEventListener('change',e=>{state.language=e.target.value;saveState();updateTexts();renderProducts();renderCart()});qs('currencySelect').addEventListener('change',e=>{state.currency=e.target.value;saveState();updateTexts();renderProducts();renderCart()});qs('cartBtn').addEventListener('click',()=>{renderCart();show(qs('cartModal'))})}
const dict={zh:{catalog:'商品目录',cart:'购物车',checkout:'结算',submit:'提交订单',loading:'正在加载商品...'},en:{catalog:'Catalog',cart:'Cart',checkout:'Checkout',submit:'Place Order',loading:'Loading products...'}}
function updateTexts(){document.querySelectorAll('.section-title')[0].textContent=dict[state.language].catalog;updateCartBadge()}
function boot(){loadState();renderProducts();updateTexts();bindProductForm()}
document.addEventListener('DOMContentLoaded',boot)
function fmtCurrency(amountUSD,c){const v=amountUSD*rates[c];return symbols[c]+v.toFixed(2)}
function createOrder(payload){const id='O'+Date.now();const o={id,...payload};orders.unshift(o);saveOrders(orders);return o}
function renderOrders(){}
function renderProductsAdmin(){}
function bindProductForm(){}
function handlePayment(order){}
function selfTest(){try{const cur=state.currency;const a=convert(10);state.currency='USD';const b=convert(10);state.currency='CNY';const c=convert(10);state.currency=cur;const ok1=Math.abs(a-10*rates[cur])<1e-6;const ok2=Math.abs(b-10)<1e-6;const ok3=Math.abs(c-71)<1e-6;const pre=cartCount();addToCart(products[0].id);const ok4=cartCount()===pre+1;if(cur!==state.currency){state.currency=cur}console.log('selfTest',ok1&&ok2&&ok3&&ok4)}catch(e){console.log('selfTest',false)}}
setTimeout(selfTest,300)
function loadMacro(){try{return JSON.parse(localStorage.getItem('wmdlz_macro')||'null')}catch(e){return null}}
function saveMacro(d){localStorage.setItem('wmdlz_macro',JSON.stringify(d))}
const defaultMacro={pmi:50.2,newOrders:51,tsfYoY:8.5,m1YoY:4.2,m2YoY:5.3,houseWoW:6.8,cpiYoY:1.2,unemp:5.1}
let macro=loadMacro()||defaultMacro
function renderMacroForm(){const ids=['pmi','newOrders','tsfYoY','m1YoY','m2YoY','houseWoW','cpiYoY','unemp'];ids.forEach(k=>{const el=qs(k);if(el)el.value=macro[k]??''})}
function readMacroFromUI(){const v=x=>{const el=qs(x);return el?parseFloat(el.value):NaN};const m={pmi:v('pmi'),newOrders:v('newOrders'),tsfYoY:v('tsfYoY'),m1YoY:v('m1YoY'),m2YoY:v('m2YoY'),houseWoW:v('houseWoW'),cpiYoY:v('cpiYoY'),unemp:v('unemp')};Object.keys(m).forEach(k=>{if(isNaN(m[k]))m[k]=macro[k]});macro=m;saveMacro(macro)}
function analyzeMacro(){readMacroFromUI();const pmiExp=macro.pmi>50;const pmiWeak=macro.pmi<48;const m1gtm2=macro.m1YoY>macro.m2YoY;const overheating=macro.pmi>52&&macro.cpiYoY>3;const stagf=macro.pmi<48&&macro.cpiYoY>4&&macro.unemp>5.5;let scenario='观望区间';let desc='信号不明显，继续跟踪先行指标组合';let advice='控制节奏，等待更明确的趋势组合';if(stagf){scenario='滞胀风险';desc='盈利下滑与通胀上行并存，失业率偏高';advice='降低仓位，现金为主，优先保本'}else if(overheating){scenario='过热预警';desc='扩张强劲伴随通胀抬升，政策收紧预期增强';advice='避免追高，关注防御板块与政策信号'}else if(pmiWeak&&(macro.tsfYoY<0||macro.houseWoW<0||!m1gtm2)){scenario='下行压力';desc='先行指标偏弱，信用与需求走弱';advice='谨慎为主，避免过早抄底，关注政策宽松'}else if(pmiExp&&m1gtm2&&macro.tsfYoY>=0){scenario='复苏初期';desc='流动性改善与扩张信号共振';advice='关注金融、地产、制造等周期板块'}renderMacroResult({scenario,desc,advice});renderMacroCards()}
function renderMacroResult(r){const box=qs('macroResult');if(!box)return;box.innerHTML=`<div style="display:flex;flex-direction:column;gap:8px"><div style="font-weight:600;font-size:18px">${r.scenario}</div><div>${r.desc}</div><div style="color:var(--ok)">${r.advice}</div></div>`}
function card(title,value,ok){const el=document.createElement('div');el.className='card';el.innerHTML=`<div class="card-body"><div class="card-title">${title}</div><div class="price" style="color:${ok?'var(--ok)':'var(--danger)'}">${value}</div></div>`;return el}
function renderMacroCards(){const g=qs('macroCards');if(!g)return;g.innerHTML='';const m1gtm2=macro.m1YoY>macro.m2YoY;g.appendChild(card('制造业PMI',macro.pmi.toFixed(1),macro.pmi>=50));g.appendChild(card('新订单指数',macro.newOrders.toFixed(1),macro.newOrders>=macro.pmi));g.appendChild(card('社融存量同比(%)',macro.tsfYoY.toFixed(1),macro.tsfYoY>=0));g.appendChild(card('M1同比(%)',macro.m1YoY.toFixed(1),m1gtm2));g.appendChild(card('M2同比(%)',macro.m2YoY.toFixed(1),!m1gtm2));g.appendChild(card('30城成交周环比(%)',macro.houseWoW.toFixed(1),macro.houseWoW>=0));g.appendChild(card('CPI同比(%)',macro.cpiYoY.toFixed(1),macro.cpiYoY<=3));g.appendChild(card('城镇失业率(%)',macro.unemp.toFixed(1),macro.unemp<=5.5))}
function bindMacro(){renderMacroForm();const analyze=qs('analyzeBtn');if(analyze)analyze.onclick=analyzeMacro;const sample=qs('loadSampleBtn');if(sample)sample.onclick=()=>{macro={...defaultMacro};renderMacroForm();analyzeMacro()};const clr=qs('clearMacroBtn');if(clr)clr.onclick=()=>{macro={pmi:0,newOrders:0,tsfYoY:0,m1YoY:0,m2YoY:0,houseWoW:0,cpiYoY:0,unemp:0};renderMacroForm();qs('macroResult').innerHTML='';qs('macroCards').innerHTML='';saveMacro(macro)}}
document.addEventListener('DOMContentLoaded',bindMacro)
function loadMacroSource(){try{return JSON.parse(localStorage.getItem('wmdlz_macro_source')||'{}')}catch(e){return {}}}
function saveMacroSource(s){localStorage.setItem('wmdlz_macro_source',JSON.stringify(s))}
let macroSource=loadMacroSource()
function renderMacroSourceForm(){const u=qs('macroSourceUrl'),k=qs('macroSourceKey'),p=qs('macroProxy');if(u)u.value=macroSource.url||'';if(k)k.value=macroSource.key||'';if(p)p.value=macroSource.proxy||''}
function readMacroSourceFromUI(){const u=qs('macroSourceUrl'),k=qs('macroSourceKey'),p=qs('macroProxy');macroSource={url:u?u.value.trim():'',key:k?k.value.trim():'',proxy:p?p.value.trim():''};saveMacroSource(macroSource)}
function normalizeMacroPayload(data){const g=(obj,keys)=>{for(const key of keys){if(obj[key]!=null)return obj[key]}return undefined};const r={pmi:parseFloat(g(data,['pmi','PMI'])),newOrders:parseFloat(g(data,['new_orders','newOrders','newOrdersIndex'])),tsfYoY:parseFloat(g(data,['tsf_yoy','social_financing_yoy'])),m1YoY:parseFloat(g(data,['m1_yoy','M1'])),m2YoY:parseFloat(g(data,['m2_yoy','M2'])),houseWoW:parseFloat(g(data,['house_wow','houseWoW','housing_sales_wow'])),cpiYoY:parseFloat(g(data,['cpi_yoy','CPI'])),unemp:parseFloat(g(data,['unemp','unemployment','unemployment_rate']))};Object.keys(r).forEach(k=>{if(isNaN(r[k]))r[k]=macro[k]});return r}
async function fetchMacroFromSource(){readMacroSourceFromUI();const msg=qs('macroSourceMsg');if(!macroSource.url){if(msg)msg.textContent='请填写数据源URL';return}let url=macroSource.url;if(macroSource.proxy){url=macroSource.proxy+(macroSource.proxy.endsWith('?url=')?encodeURIComponent(macroSource.url):macroSource.url)}
 try{const res=await fetch(url,{headers:macroSource.key?{'X-API-Key':macroSource.key}:{}});if(!res.ok)throw new Error('状态码 '+res.status);const ct=res.headers.get('content-type')||'';let data;if(ct.includes('application/json')){data=await res.json()}else{const txt=await res.text();data=JSON.parse(txt)}const m=normalizeMacroPayload(data);macro=m;saveMacro(macro);renderMacroForm();analyzeMacro();localStorage.setItem('wmdlz_macro_last_fetch',String(Date.now()));if(msg)msg.textContent='采集成功'}catch(e){if(msg)msg.textContent='采集失败：'+e.message}}
function scheduleDailyFetch(){const last=parseInt(localStorage.getItem('wmdlz_macro_last_fetch')||'0',10);const now=Date.now();if(now-last>=24*60*60*1000){fetchMacroFromSource()}}
function bindMacroSource(){renderMacroSourceForm();const t=qs('testSourceBtn');if(t)t.onclick=()=>{fetchMacroFromSource()};const n=qs('fetchNowBtn');if(n)n.onclick=()=>{fetchMacroFromSource()};scheduleDailyFetch()}
document.addEventListener('DOMContentLoaded',bindMacroSource)
