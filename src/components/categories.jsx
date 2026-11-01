import React from 'react';
import { CATEGORIES, categoryOptions } from '../data/categories.js';
export function CategorySelect({value,onChange,label='Product category'}) {return <label className="ui-field"><span>{label}</span><select value={value} onChange={event=>onChange(event.target.value)}>{CATEGORIES.map(category=><option key={category.id} value={category.id}>{category.label}</option>)}</select></label>}
export function CategoryFilters({value,onChange}) {return <div className="category-filters" role="group" aria-label="Filter by category">{categoryOptions.map(category=><button key={category.id} type="button" className={'category-filter '+(value===category.id?'is-active':'')} aria-pressed={value===category.id} onClick={()=>onChange(category.id)}>{category.label}</button>)}</div>}
