import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data/categories.js';

const priceRanges=[
  {id:'all',label:'Any price'},
  {id:'under50',label:'Under $50'},
  {id:'50to200',label:'$50–$200'},
  {id:'200to500',label:'$200–$500'},
  {id:'over500',label:'Over $500'}
];
const sortOptions=[
  {id:'newest',label:'Recently added'},
  {id:'oldest',label:'Oldest first'},
  {id:'price-low',label:'Price: low to high'},
  {id:'price-high',label:'Price: high to low'},
  {id:'name',label:'Product name A–Z'},
  {id:'target-low',label:'Lowest target first'}
];
export function matchesPrice(price,range){
 const value=Number(price);
 if(!Number.isFinite(value))return range==='all';
 if(range==='under50')return value<50;
 if(range==='50to200')return value>=50&&value<=200;
 if(range==='200to500')return value>200&&value<=500;
 if(range==='over500')return value>500;
 return true;
}
export function filterAndSortProducts(products,{query='',category='all',price='all',sort='newest'}={}){
 const q=query.trim().toLocaleLowerCase();
 const filtered=products.filter(p=>(category==='all'||(p.category||'other')===category)&&matchesPrice(p.price,price)&&(!q||[p.title,p.store,p.retailer,p.seller,p.category&&CATEGORIES.find(c=>c.id===p.category)?.label].filter(Boolean).join(' ').toLocaleLowerCase().includes(q)));
 return [...filtered].sort((a,b)=>{
  switch(sort){
   case 'oldest':return new Date(a.addedAt||0)-new Date(b.addedAt||0);
   case 'price-low':return Number(a.price)-Number(b.price);
   case 'price-high':return Number(b.price)-Number(a.price);
   case 'name':return String(a.title).localeCompare(String(b.title));
   case 'target-low':return Number(a.target)-Number(b.target);
   default:return new Date(b.addedAt||0)-new Date(a.addedAt||0);
  }
 });
}
export function ProductFilters({query,onQueryChange,category,onCategoryChange,price,onPriceChange,sort,onSortChange,onClear,total,results}){
 const active=Boolean(query.trim())||category!=='all'||price!=='all'||sort!=='newest';
 return <section className="product-filters" aria-label="Find products">
  <div className="product-filters-heading"><div><SlidersHorizontal size={18}/><strong>Find a product</strong></div><span aria-live="polite">{results} of {total} products</span></div>
  <div className="product-search-wrap"><Search size={19} aria-hidden="true"/><input type="search" value={query} onChange={e=>onQueryChange(e.target.value)} placeholder="Search products, stores, categories…" aria-label="Search products, stores, and categories"/>{query&&<button type="button" className="clear-search" aria-label="Clear search" onClick={()=>onQueryChange('')}><X size={17}/></button>}</div>
  <div className="product-filter-fields">
   <label>Category<select value={category} onChange={e=>onCategoryChange(e.target.value)}><option value="all">All categories</option>{CATEGORIES.map(c=><option value={c.id} key={c.id}>{c.label}</option>)}</select></label>
   <label>Recorded price<select value={price} onChange={e=>onPriceChange(e.target.value)}>{priceRanges.map(p=><option value={p.id} key={p.id}>{p.label}</option>)}</select></label>
   <label>Sort by<select value={sort} onChange={e=>onSortChange(e.target.value)}>{sortOptions.map(p=><option value={p.id} key={p.id}>{p.label}</option>)}</select></label>
  </div>
  {active&&<button className="reset-filters" type="button" onClick={onClear}><X size={14}/> Clear search & filters</button>}
 </section>;
}
