import React, { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowLeft, ArrowRight, Check, Clock3, ExternalLink, History, LayoutDashboard, Plus, Search, ShoppingBag, Target, Trash2, TrendingDown, X } from 'lucide-react';

const KEY = 'arxa-products-v1';
const initial = [
  { id: 'demo-1', title: 'Sony WH-1000XM5 Headphones', store: 'Best Buy', url: 'https://www.bestbuy.com/', price: 329.99, target: 275, addedAt: '2026-10-25T10:00:00.000Z', status: 'watching', demo: true },
  { id: 'demo-2', title: 'Apple iPad Air 11-inch', store: 'Apple', url: 'https://www.apple.com/', price: 599, target: 499, addedAt: '2026-10-26T10:00:00.000Z', status: 'watching', demo: true },
  { id: 'demo-3', title: 'Garmin Forerunner 165', store: 'Garmin', url: 'https://www.garmin.com/', price: 249.99, target: 190, addedAt: '2026-10-29T10:00:00.000Z', status: 'watching', demo: true },
];
const money = n => Number(n || 0).toLocaleString('en-US', { style:'currency', currency:'USD' });
const daysLeft = p => Math.max(0, Math.ceil((new Date(p.purchasedAt).getTime() + 30*86400000 - Date.now()) / 86400000));
function load() { try { const raw = localStorage.getItem(KEY); return raw === null ? initial : JSON.parse(raw); } catch { return initial; } }
function safeUrl(u) { try { const parsed = new URL(u); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : null; } catch { return null; } }

export default function App() {
  const [products, setProducts] = useState(load);
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({url:'',title:'',price:'',target:''});
  const [purchasePrice, setPurchasePrice] = useState('');
  const [error, setError] = useState('');
  const save = updater => setProducts(prev => { const next = typeof updater === 'function' ? updater(prev) : updater; localStorage.setItem(KEY, JSON.stringify(next)); return next; });
  const active = products.filter(p => p.status === 'watching');
  const purchased = products.filter(p => p.status === 'purchased');
  const savings = purchased.reduce((n,p) => n + Math.max(0, (p.priceAtPurchase ?? p.price) - p.purchasePrice), 0);
  const watching = useMemo(() => active.filter(p => [p.title,p.store].join(' ').toLowerCase().includes(search.toLowerCase())), [products, search]);
  const current = products.find(p => p.id === selected);
  const nav = [{id:'home',label:'Overview',icon:LayoutDashboard},{id:'watchlist',label:'Watchlist',icon:Target},{id:'history',label:'Purchase history',icon:History}];
  const go = name => {setPage(name);setSelected(null);setError('');};
  function add(e) {
    e.preventDefault();
    const url = safeUrl(form.url.trim()), price = Number(form.price), target = Number(form.target);
    if (!url) return setError('Enter a valid http or https product URL.');
    if (!form.title.trim()) return setError('Enter the product name.');
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(target) || target <= 0) return setError('Prices must be greater than zero.');
    const host = new URL(url).hostname.replace(/^www\./,'');
    save(prev => [{id:crypto.randomUUID(),title:form.title.trim(),store:host,url,price,target,addedAt:new Date().toISOString(),status:'watching'},...prev]);
    setForm({url:'',title:'',price:'',target:''}); go('watchlist');
  }
  function purchase() {
    const amount = Number(purchasePrice);
    if (!Number.isFinite(amount) || amount <= 0) return setError('Enter a purchase price greater than zero.');
    save(prev => prev.map(p => p.id === selected ? {...p,status:'purchased',purchasePrice:amount,priceAtPurchase:p.price,purchasedAt:new Date().toISOString()} : p));
    setPurchasePrice('');setError('');
  }
  const remove = id => { if (window.confirm('Remove this item and its history?')) {save(prev=>prev.filter(p=>p.id!==id));go('watchlist');} };
  const productCard = p => <button className="product-card" key={p.id} onClick={() => {setSelected(p.id);setPage('details');setError('');}}>
    <span className="product-icon"><ShoppingBag size={24}/></span>
    <span className="product-info"><strong>{p.title}</strong><small>{p.store} {p.demo ? '· Demo' : ''}</small><span className="target"><Target size={13}/> Target {money(p.target)}</span></span>
    <span className="product-price"><strong>{money(p.price)}</strong><small>Recorded price</small><ArrowRight size={17}/></span>
  </button>;
  return <div className="app">
    <aside className="sidebar"><button className="brand" onClick={()=>go('home')}>arxa<span>.</span></button><p className="sidebar-caption">YOUR SHOPPING COMPANION</p><nav>{nav.map(item=><button key={item.id} className={'nav-item '+(page===item.id || (page==='details'&&item.id==='watchlist')?'active':'')} onClick={()=>go(item.id)}><item.icon size={19}/>{item.label}{item.id==='watchlist'&&<span className="nav-count">{active.length}</span>}</button>)}</nav><div className="sidebar-note">Buy smarter, keep more.<br/><small>ARXA early preview · v0.1</small></div></aside>
    <main className="main">
      <header className="topbar"><span className="mobile-brand">arxa<span>.</span></span><span className="topbar-label">Your personal price tracker</span><button className="add-button" onClick={()=>go('add')}><Plus size={18}/> <span>Add product</span></button></header>
      {page==='home'&&<section className="content">
        <div className="eyebrow">YOUR DASHBOARD</div><h1>Shop with confidence<span className="period">.</span></h1><p className="subheading">Track what you love. Know when the price is right.</p>
        <div className="hero"><div><span className="hero-label"><TrendingDown size={16}/> YOUR SAVINGS SO FAR</span><div className="hero-value">{money(savings)}</div><p>Calculated from recorded purchase prices. Your shopping wins stay here.</p></div><div className="hero-decoration"><ArrowDownRight size={74}/></div></div>
        <div className="stat-grid"><div className="stat"><Target size={20}/><strong>{active.length}</strong><span>Products watching</span></div><div className="stat"><Check size={20}/><strong>{purchased.length}</strong><span>Purchases recorded</span></div><div className="stat"><Clock3 size={20}/><strong>{purchased.filter(p=>daysLeft(p)>0).length}</strong><span>In 30-day window</span></div></div>
        <div className="section-heading"><h2>Your watchlist</h2><button className="text-link" onClick={()=>go('watchlist')}>See all <ArrowRight size={16}/></button></div>
        {active.length ? <div className="products">{active.slice(0,3).map(productCard)}</div> : <div className="empty">No tracked products yet. Add your first product to get started.</div>}
      </section>}
      {page==='watchlist'&&<section className="content"><div className="eyebrow">TRACK YOUR FINDS</div><h1>Watchlist<span className="period">.</span></h1><p className="subheading">All the products you're keeping an eye on.</p><div className="list-toolbar"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your watchlist" aria-label="Search watchlist"/></div><span>{watching.length} products</span></div>{watching.length?<div className="products">{watching.map(productCard)}</div>:<div className="empty">No matching products. Try a different search or add a product.</div>}</section>}
      {page==='add'&&<section className="content narrow"><button className="back" onClick={()=>go('watchlist')}><ArrowLeft size={16}/> Back to watchlist</button><div className="eyebrow">START WATCHING</div><h1>Add a product<span className="period">.</span></h1><p className="subheading">Save a product link and set the price you're willing to pay.</p><form className="panel form" onSubmit={add}><label>Product URL<input required type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://store.com/product" /></label><label>Product name<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Garmin Forerunner 165"/></label><div className="form-grid"><label>Current price ($)<input required type="number" min="0.01" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="249.99"/></label><label>Target price ($)<input required type="number" min="0.01" step="0.01" value={form.target} onChange={e=>setForm({...form,target:e.target.value})} placeholder="190.00"/></label></div>{error&&<p role="alert" className="error">{error}</p>}<div className="hint">Prices are entered manually in this preview. ARXA doesn't fetch retailer prices yet.</div><button className="primary" type="submit"><Plus size={18}/> Add to watchlist</button></form></section>}
      {page==='details'&&current&&<section className="content narrow"><button className="back" onClick={()=>go(current.status==='watching'?'watchlist':'history')}><ArrowLeft size={16}/> Back</button><div className="eyebrow">{current.status==='purchased'?'PURCHASE RECORD':'PRODUCT DETAILS'}</div><h1>{current.title}<span className="period">.</span></h1><p className="subheading">{current.store}</p><div className="panel details"><div className="details-row"><span>Recorded price</span><strong>{money(current.price)}</strong></div><div className="details-row"><span>Target price</span><strong>{money(current.target)}</strong></div><div className="details-row"><span>Status</span><strong>{current.status==='watching'?'Watching':daysLeft(current)>0?'Purchased · '+daysLeft(current)+' days left':'Purchased · monitoring ended'}</strong></div>{current.status==='purchased'&&<><div className="details-row"><span>Paid</span><strong>{money(current.purchasePrice)}</strong></div><div className="details-row"><span>Recorded savings*</span><strong className="good">{money(Math.max(0,(current.priceAtPurchase??current.price)-current.purchasePrice))}</strong></div><div className="hint">*Compared with the price recorded when purchased. The post-purchase 30-day window is informational until automated checking is built.</div></>}{safeUrl(current.url)&&<a className="external" href={safeUrl(current.url)} target="_blank" rel="noopener noreferrer">View retailer link <ExternalLink size={15}/></a>}</div>
        {current.status==='watching'&&<div className="panel form"><h2>Did you buy it?</h2><p className="muted">Log the price you paid. The purchase remains in your history after its 30-day monitoring window expires.</p><label>Purchase price ($)<input type="number" min="0.01" step="0.01" value={purchasePrice} onChange={e=>setPurchasePrice(e.target.value)} placeholder="Price you actually paid"/></label>{error&&<p role="alert" className="error">{error}</p>}<button className="primary" onClick={purchase}><Check size={17}/> Mark purchased</button></div>}<button className="danger" onClick={()=>remove(current.id)}><Trash2 size={17}/> Delete this record</button></section>}
      {page==='history'&&<section className="content"><div className="eyebrow">YOUR SHOPPING JOURNEY</div><h1>Purchase history<span className="period">.</span></h1><p className="subheading">A lasting record of the purchases you've made and the savings you've logged.</p><div className="history-total"><span>Total recorded savings</span><strong>{money(savings)}</strong></div>{purchased.length?<div className="products">{purchased.map(p=><button className="history-card" key={p.id} onClick={()=>{setSelected(p.id);setPage('details');}}><div><strong>{p.title}</strong><small>Purchased {new Date(p.purchasedAt).toLocaleDateString()} · {daysLeft(p)>0?daysLeft(p)+' days of monitoring remaining':'Monitoring window ended'}</small></div><div className="right"><strong>{money(p.purchasePrice)}</strong><small>Saved {money(Math.max(0,(p.priceAtPurchase??p.price)-p.purchasePrice))}</small></div></button>)}</div>:<div className="empty">Your purchases will appear here once you mark a product as purchased.</div>}</section>}
    </main><nav className="bottom-nav">{nav.map(item=><button key={item.id} className={page===item.id?'active':''} onClick={()=>go(item.id)}><item.icon size={20}/><span>{item.label==='Purchase history'?'History':item.label}</span></button>)}<button className={page==='add'?'active':''} onClick={()=>go('add')}><Plus size={20}/><span>Add</span></button></nav>
  </div>;
}
