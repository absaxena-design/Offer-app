import React from 'react';
import { ArrowRight, ShoppingBag, Target } from 'lucide-react';
import { StatusBadge } from './ui.jsx';
export const money=n=>Number(n||0).toLocaleString('en-US',{style:'currency',currency:'USD'});
export function monitoringDaysLeft(product,now=Date.now()){if(!product?.purchasedAt)return 0;const time=new Date(product.purchasedAt).getTime();return Number.isFinite(time)?Math.max(0,Math.ceil((time+30*86400000-now)/86400000)):0}
export function recordedSavings(p) {return Math.max(0,(Number(p.priceAtPurchase??p.price)||0)-(Number(p.purchasePrice)||0))}
export function PriceDisplay({value,className=''}) {return <span className={className}>{money(value)}</span>}
export function TargetPrice({value}) {return <span className="target"><Target size={13}/> Target {money(value)}</span>}
export function ProductIcon(){return <span className="product-icon"><ShoppingBag size={24}/></span>}
export function ProductCard({product:p,onClick}) {return <button className="product-card" onClick={()=>onClick(p.id)}><ProductIcon/><span className="product-info"><strong>{p.title}</strong><small>{p.store}{p.demo?' · Demo':''}</small><TargetPrice value={p.target}/></span><span className="product-price"><strong><PriceDisplay value={p.price}/></strong><small>Recorded price</small><ArrowRight size={17}/></span></button>}
export function ProductList({products,onSelect}) {return <div className="products">{products.map(p=><ProductCard key={p.id} product={p} onClick={onSelect}/>)}</div>}
export function MonitoringCountdown({product}) {const days=monitoringDaysLeft(product);return <StatusBadge status={days?'purchased':'ended'}>{days?days+' days left':'Monitoring ended'}</StatusBadge>}
export function PurchaseSummary({product}) {return <><div className="details-row"><span>Paid</span><strong><PriceDisplay value={product.purchasePrice}/></strong></div><div className="details-row"><span>Recorded savings*</span><strong className="good"><PriceDisplay value={recordedSavings(product)}/></strong></div><div className="hint">*Compared with the price recorded at purchase. Automated post-purchase price checks are not available yet.</div></>}
export function PriceComparison({recorded,target}) {return <div className="ui-price-comparison"><div><small>Recorded</small><strong><PriceDisplay value={recorded}/></strong></div><div><small>Target</small><strong><PriceDisplay value={target}/></strong></div></div>}
export function HistoryCard({product:p,onClick}) {return <button className="history-card" onClick={()=>onClick(p.id)}><div><strong>{p.title}</strong><small>Purchased {new Date(p.purchasedAt).toLocaleDateString()}</small><MonitoringCountdown product={p}/></div><div className="right"><strong><PriceDisplay value={p.purchasePrice}/></strong><small>Saved <PriceDisplay value={recordedSavings(p)}/></small></div></button>}
