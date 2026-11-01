import React, { useMemo, useState } from 'react';
import { QuickAdd, AttentionList, HomeWatchlist, MonitoringSummary, HomeProgress, MyWins } from './components/home.jsx';
import { ProductFilters, filterAndSortProducts } from './components/product-filters.jsx';
import { CATEGORIES, categoryLabel, categoryOptions } from './data/categories.js';
import { ArrowRight, Check, Clock3, Target, Trash2 } from 'lucide-react';
import { AppShell, PageHeader, Button, BackButton, SurfaceCard, URLField, TextField, PriceField, SearchField, FieldError, EmptyState, InfoMessage, ConfirmDialog, Toast, RetailerLink, SavingsCard, StatCard, StatGrid, ProductList, PriceDisplay, PurchaseSummary, MonitoringCountdown, HistoryCard, recordedSavings, monitoringDaysLeft, PriceComparison, PriceHistoryChart, StatusBadge, CategorySelect, CategoryFilters } from './components/index.js';

const KEY='arxa-products-v1';
const seed=[
{id:'demo-1',title:'Sony WH-1000XM5 Headphones',store:'Best Buy',url:'https://www.bestbuy.com/',price:329.99,target:275,addedAt:'2026-10-25T10:00:00.000Z',status:'watching',category:'electronics',demo:true},
{id:'demo-2',title:'Apple iPad Air 11-inch',store:'Apple',url:'https://www.apple.com/',price:599,target:499,addedAt:'2026-10-26T10:00:00.000Z',status:'watching',category:'computers',demo:true},
{id:'demo-3',title:'Garmin Forerunner 165',store:'Garmin',url:'https://www.garmin.com/',price:249.99,target:190,addedAt:'2026-10-29T10:00:00.000Z',status:'watching',category:'health',demo:true}
];
function load(){try{const raw=localStorage.getItem(KEY);const value=raw===null?seed:JSON.parse(raw);return Array.isArray(value)?value:seed}catch{return seed}}
function validUrl(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url:null}catch{return null}}
export default function App(){
const [products,setProducts]=useState(load);
const [page,setPage]=useState('home'),[selected,setSelected]=useState(null),[search,setSearch]=useState(''),[categoryFilter,setCategoryFilter]=useState('all'),[priceFilter,setPriceFilter]=useState('all'),[sortOrder,setSortOrder]=useState('newest');
const [form,setForm]=useState({url:'',title:'',price:'',target:'',category:'other'}),[purchasePrice,setPurchasePrice]=useState('');
const [error,setError]=useState(''),[toast,setToast]=useState(''),[deleteId,setDeleteId]=useState(null);
const save=updater=>setProducts(prev=>{const next=updater(prev);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{setError('Unable to save in this browser. Check your storage settings.')}return next});
const navigate=next=>{setPage(next);setSelected(null);setError('')};
const quickAdd=url=>{setForm(prev=>({...prev,url}));navigate('add')};
const manualAdd=()=>{setForm(prev=>({...prev,url:''}));navigate('add')};
const active=products.filter(p=>p.status==='watching'),purchased=products.filter(p=>p.status==='purchased');
const savings=purchased.reduce((sum,p)=>sum+recordedSavings(p),0);
const watching=useMemo(()=>filterAndSortProducts(active,{query:search,category:categoryFilter,price:priceFilter,sort:sortOrder}),[products,search,categoryFilter,priceFilter,sortOrder]);
const clearFilters=()=>{setSearch('');setCategoryFilter('all');setPriceFilter('all');setSortOrder('newest')};
const hasFilters=Boolean(search.trim())||categoryFilter!=='all'||priceFilter!=='all'||sortOrder!=='newest';
const current=products.find(p=>p.id===selected);
const select=id=>{setSelected(id);setPage('details');setError('')};
const notify=message=>{setToast(message)};
function add(e){e.preventDefault();const url=validUrl(form.url.trim()),price=Number(form.price),target=Number(form.target);
if(form.url.trim()&&!url)return setError('Enter a valid http or https product URL.');
if(!form.title.trim())return setError('Enter a product name.');
if(!Number.isFinite(price)||price<=0||!Number.isFinite(target)||target<=0)return setError('Enter valid prices above zero.');
const item={id:globalThis.crypto?.randomUUID?.()||String(Date.now()),title:form.title.trim(),store:url?url.hostname.replace(/^www\./,''):'Manual entry',url:url?.href||'',price,target,category:form.category,addedAt:new Date().toISOString(),status:'watching'};
save(prev=>[item,...prev]);setForm({url:'',title:'',price:'',target:'',category:'other'});navigate('watchlist');notify('Product added to watchlist');
}
function purchase(){const amount=Number(purchasePrice);if(!Number.isFinite(amount)||amount<=0)return setError('Enter a purchase price greater than zero.');
save(prev=>prev.map(p=>p.id===selected?{...p,status:'purchased',purchasePrice:amount,priceAtPurchase:p.price,purchasedAt:new Date().toISOString()}:p));setPurchasePrice('');setError('');notify('Purchase saved to your history');
}
function remove(){save(prev=>prev.filter(p=>p.id!==deleteId));setDeleteId(null);navigate('watchlist');notify('Product record deleted')}
return <AppShell page={page} count={active.length} savings={savings} navigate={navigate}>
{page==='home'&&<section className="content home-v2"><PageHeader eyebrow="YOUR SHOPPING COMPANION" title="Make every purchase count" description="A place for what you're watching, what you've bought, and what comes next."/><QuickAdd onContinue={quickAdd} onManual={manualAdd}/><AttentionList events={[]} onSelect={select}/><HomeWatchlist products={active} onSelect={select} onAll={()=>navigate('watchlist')} onAdd={manualAdd}/><MonitoringSummary products={purchased} onSelect={select} onHistory={()=>navigate('history')}/><HomeProgress savings={savings} products={active.length} purchases={purchased.length} onOpen={()=>navigate('wins')}/></section>}
{page==='watchlist'&&<section className="content"><PageHeader eyebrow="TRACK YOUR FINDS" title="Watchlist" description="All the products you're keeping an eye on."/><ProductFilters query={search} onQueryChange={setSearch} category={categoryFilter} onCategoryChange={setCategoryFilter} price={priceFilter} onPriceChange={setPriceFilter} sort={sortOrder} onSortChange={setSortOrder} onClear={clearFilters} total={active.length} results={watching.length}/>{watching.length?<ProductList products={watching} onSelect={select}/>:<EmptyState title={hasFilters?'No products match your search':'No products yet'} description={hasFilters?'Try adjusting your search or filters.':'Start by adding a product to your watchlist.'} action={hasFilters?<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>:<Button onClick={()=>navigate('add')}>Add product</Button>}/>} </section>}
{page==='add'&&<section className="content narrow"><BackButton onClick={()=>navigate('watchlist')}>Back to watchlist</BackButton><PageHeader eyebrow="START WATCHING" title="Add a product" description="Save a link or enter the details yourself. Set the price you're willing to pay."/><SurfaceCard as="form" className="form" onSubmit={add}><URLField label="Product URL (optional for manual entry)" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://store.com/product"/><TextField required label="Product name" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Garmin Forerunner 165"/><CategorySelect value={form.category} onChange={category=>setForm({...form,category})}/><div className="form-grid"><PriceField required label="Current price ($)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="249.99"/><PriceField required label="Target price ($)" value={form.target} onChange={e=>setForm({...form,target:e.target.value})} placeholder="190.00"/></div><FieldError>{error}</FieldError><InfoMessage>Prices are entered manually in this preview. Live retailer tracking isn't connected.</InfoMessage><Button type="submit">Add to watchlist</Button></SurfaceCard></section>}
{page==='details'&&current&&<section className="content narrow"><BackButton onClick={()=>navigate(current.status==='watching'?'watchlist':'history')}/><PageHeader eyebrow={current.status==='purchased'?'PURCHASE RECORD':'PRODUCT DETAILS'} title={current.title} description={current.store}/><SurfaceCard className="details"><div className="details-row"><span>Category</span><strong>{categoryLabel(current.category)}</strong></div><PriceComparison recorded={current.price} target={current.target}/><div className="details-row"><span>Status</span>{current.status==='watching'?<StatusBadge status="watching">Watching</StatusBadge>:<MonitoringCountdown product={current}/>}</div>{current.status==='purchased'&&<PurchaseSummary product={current}/>}<RetailerLink url={current.url}/></SurfaceCard>{current.status==='watching'&&<SurfaceCard className="form"><h2>Did you buy it?</h2><p className="muted">Your purchase stays in history after its 30-day monitoring window ends.</p><PriceField label="Purchase price ($)" value={purchasePrice} onChange={e=>setPurchasePrice(e.target.value)} placeholder="Price you paid"/><FieldError>{error}</FieldError><Button onClick={purchase}><Check size={17}/> Mark purchased</Button></SurfaceCard>}<SurfaceCard><h2>Price history</h2><PriceHistoryChart history={current.priceHistory||[]}/></SurfaceCard><Button variant="destructive" onClick={()=>setDeleteId(current.id)}><Trash2 size={17}/> Delete record</Button></section>}
{page==='wins'&&<section className="content"><PageHeader eyebrow="YOUR SHOPPING PROGRESS" title="My Wins" description="Your purchase history, savings trends, and shopping progress in one place."/><MyWins purchases={purchased} onSelect={select}/></section>}
{page==='history'&&<section className="content"><PageHeader eyebrow="YOUR SHOPPING JOURNEY" title="Purchase history" description="A lasting record of your purchases and recorded savings."/><div className="history-total"><span>Total recorded savings</span><strong><PriceDisplay value={savings}/></strong></div>{purchased.length?<div className="products">{purchased.map(p=><HistoryCard key={p.id} product={p} onClick={select}/>)}</div>:<EmptyState title="No purchases yet" description="When you buy a watched product, record it here and keep its history."/>}</section>}
<ConfirmDialog open={!!deleteId} title="Delete product record?" message="This permanently removes the product and any saved purchase information from this browser." onCancel={()=>setDeleteId(null)} onConfirm={remove}/><Toast message={toast} onClose={()=>setToast('')}/>
</AppShell>;
}
