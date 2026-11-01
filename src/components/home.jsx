import React, { useState } from 'react';
import { ArrowRight, Clock3, Link2, Target, Wallet, AlertCircle } from 'lucide-react';
import { Button, EmptyState, ProductList } from './index.js';
import { money, monitoringDaysLeft, recordedSavings } from './product.jsx';

export function QuickAdd({onContinue,onManual}) {
 const [url,setUrl]=useState(''),[error,setError]=useState('');
 function submit(e){e.preventDefault();const value=url.trim();try{const parsed=new URL(value);if(!['http:','https:'].includes(parsed.protocol))throw Error();setError('');onContinue(value)}catch{setError('Enter a valid http or https product link.')}}
 return <section className="home-quick-add" aria-labelledby="quick-add-title"><div><span className="eyebrow">START WITH A LINK</span><h2 id="quick-add-title">A better buy begins here.</h2><p>Save what you're considering, then decide the price that's right for you.</p></div><form className="quick-add-form" onSubmit={submit} noValidate><label htmlFor="home-product-url">Product link</label><div className="quick-add-field"><Link2 size={19}/><input id="home-product-url" type="url" inputMode="url" autoComplete="url" value={url} onChange={e=>{setUrl(e.target.value);if(error)setError('')}} placeholder="Paste a product URL" aria-invalid={Boolean(error)} aria-describedby={error?'quick-add-error':undefined}/><Button type="submit">Continue <ArrowRight size={16}/></Button></div>{error&&<p id="quick-add-error" role="alert" className="error">{error}</p>}<button className="quick-add-manual" type="button" onClick={onManual}>Or enter a product manually <ArrowRight size={14}/></button></form></section>
}

export function AttentionList({events=[],onSelect}) {
 if(!events.length)return null;
 return <section className="home-section" aria-labelledby="attention-title"><div className="section-heading"><h2 id="attention-title">Needs your attention</h2><span className="home-section-note">{events.length} updates</span></div><div className="home-attention-list">{events.slice(0,3).map(event=><button key={event.id} className="home-attention-item" onClick={()=>onSelect(event.productId)}><AlertCircle size={18}/><span><strong>{event.title}</strong><small>{event.description}</small></span><ArrowRight size={16}/></button>)}</div></section>
}

export function HomeWatchlist({products,onSelect,onAll,onAdd}) {
 return <section className="home-section" aria-labelledby="home-watchlist"><div className="section-heading"><div><h2 id="home-watchlist">Your watchlist</h2><p className="home-section-note">{products.length ? 'Your recently added products' : 'Ready when you are'}</p></div>{products.length>0&&<Button variant="tertiary" onClick={onAll}>View all <ArrowRight size={16}/></Button>}</div>{products.length?<ProductList products={[...products].sort((a,b)=>new Date(b.addedAt||0)-new Date(a.addedAt||0)).slice(0,4)} onSelect={onSelect}/>:<EmptyState title="Nothing on your watchlist yet" description="Add a product to keep its price and your target in one place." action={<Button onClick={onAdd}>Add your first product</Button>}/>}</section>
}

export function MonitoringSummary({products=[],onSelect,onHistory}) {
 const monitoring=products.filter(p=>p.status==='purchased'&&monitoringDaysLeft(p)>0).sort((a,b)=>monitoringDaysLeft(a)-monitoringDaysLeft(b));
 if(!monitoring.length)return null;
 return <section className="home-section" aria-labelledby="monitoring-title"><div className="section-heading"><div><h2 id="monitoring-title">After your purchase</h2><p className="home-section-note">Your 30-day window · automatic price checks aren't active yet</p></div><Button variant="tertiary" onClick={onHistory}>History <ArrowRight size={16}/></Button></div><div className="home-monitoring">{monitoring.slice(0,2).map(p=><button key={p.id} onClick={()=>onSelect(p.id)} className="home-monitoring-item"><Clock3 size={20}/><span className="home-monitoring-copy"><strong>{p.title}</strong><small>Paid {money(p.purchasePrice)} · {new Date(p.purchasedAt).toLocaleDateString()}</small></span><span className="home-monitoring-days">{monitoringDaysLeft(p)} days left</span></button>)}</div></section>
}

export function HomeProgress({savings,products,purchases,onOpen}) {
 return <section className="home-progress" aria-labelledby="progress-title"><div><span className="eyebrow">YOUR SHOPPING PROGRESS</span><h2 id="progress-title">Every good decision adds up.</h2><p>{purchases ? 'Your recorded purchases and savings, together in one place.' : 'Your progress will grow as you record purchases.'}</p></div><div className="home-progress-values"><div><strong>{money(savings)}</strong><small>Recorded savings</small></div><div><strong>{products}</strong><small>Watching</small></div><div><strong>{purchases}</strong><small>Purchased</small></div></div><Button variant="tertiary" onClick={onOpen}>Explore My Wins <ArrowRight size={16}/></Button></section>
}

export function MyWins({purchases=[],onSelect}) {
 const savings=purchases.reduce((n,p)=>n+recordedSavings(p),0);
 const byMonth=new Map(),byCategory=new Map();
 for(const p of purchases){const amount=recordedSavings(p);const date=new Date(p.purchasedAt);if(!Number.isNaN(date.getTime())){const month=date.toLocaleDateString('en-US',{month:'short',year:'numeric'});byMonth.set(month,(byMonth.get(month)||0)+amount)}const category=p.category||'other';byCategory.set(category,(byCategory.get(category)||0)+amount)}
 return <div className="wins-content"><div className="wins-summary"><Wallet size={21}/><span>Lifetime recorded savings</span><strong>{money(savings)}</strong><small>Compared with manually recorded prices at purchase, not verified retailer discounts.</small></div><div className="wins-summary-secondary"><div><strong>{purchases.length}</strong><span>Purchases recorded</span></div><div><strong>{purchases.length?money(savings/purchases.length):money(0)}</strong><span>Average recorded savings per purchase</span></div></div><section className="home-section"><h2>Savings by month</h2>{byMonth.size?<div className="wins-breakdown">{[...byMonth].reverse().map(([name,value])=><div key={name}><span>{name}</span><strong>{money(value)}</strong></div>)}</div>:<p className="muted">Monthly trends will appear after you log your first purchase.</p>}</section><section className="home-section"><h2>Savings by category</h2>{byCategory.size?<div className="wins-breakdown">{[...byCategory].map(([name,value])=><div key={name}><span>{name.replaceAll('-',' ')}</span><strong>{money(value)}</strong></div>)}</div>:<p className="muted">Your category breakdown will appear here.</p>}</section><section className="home-section"><h2>Your purchase wins</h2>{purchases.length?<div className="wins-breakdown">{[...purchases].sort((a,b)=>new Date(b.purchasedAt)-new Date(a.purchasedAt)).map(p=><button key={p.id} onClick={()=>onSelect(p.id)}><span>{p.title}</span><strong>Saved {money(recordedSavings(p))}</strong></button>)}</div>:<EmptyState title="Your wins start with your first purchase" description="Once you mark a watched product as purchased, you'll see its recorded savings here."/>}</section></div>
}
