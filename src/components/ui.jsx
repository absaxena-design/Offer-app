import React, { useId, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink as ExternalIcon, Search, X, AlertCircle, CheckCircle2 } from 'lucide-react';
export function Button({variant='primary',size='md',loading=false,disabled=false,children,className='',...props}) {return <button className={['ui-button','ui-button--'+variant,'ui-button--'+size,className].join(' ')} disabled={disabled||loading} {...props}>{loading?'Working…':children}</button>}
export function IconButton({label,children,...props}) {return <Button variant="tertiary" aria-label={label} title={label} {...props}>{children}</Button>}
export function TextButton({children,...props}) {return <Button variant="tertiary" {...props}>{children}</Button>}
export function BackButton({onClick,children='Back'}) {return <button className="back" type="button" onClick={onClick}><ArrowLeft size={16}/>{children}</button>}
export function RetailerLink({url,children='View retailer link'}) {try {const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return null;return <a className="external" href={u.href} target="_blank" rel="noopener noreferrer">{children}<ExternalIcon size={15}/></a>}catch{return null}}
export function SurfaceCard({as:Tag='div',children,className='',...props}) {return <Tag className={'panel '+className} {...props}>{children}</Tag>}
export function FormField({label,hint,error,children}) {const id=useId();return <label className="ui-field"><span>{label}</span>{children}{hint&&<small className="hint">{hint}</small>}{error&&<small id={id} className="error" role="alert">{error}</small>}</label>}
export function TextField({label,hint,error,type='text',...props}) {return <FormField label={label} hint={hint} error={error}><input type={type} aria-invalid={!!error} {...props}/></FormField>}
export function URLField(props) {return <TextField type="url" inputMode="url" {...props}/>}
export function PriceField(props) {return <TextField type="number" inputMode="decimal" min="0.01" step="0.01" {...props}/>}
export function SearchField({value,onChange,placeholder='Search products'}) {return <div className="search"><Search size={18}/><input aria-label={placeholder} type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>}
export function FieldError({children}) {return children?<p role="alert" className="error">{children}</p>:null}
export function StatusBadge({status='watching',children}) {return <span className={'ui-status ui-status--'+status}>{children||status.replaceAll('-',' ')}</span>}
export function EmptyState({title='Nothing here yet',description,action}) {return <div className="empty"><strong>{title}</strong>{description&&<p>{description}</p>}{action}</div>}
export function LoadingState({label='Loading…'}) {return <div className="empty" role="status" aria-live="polite">{label}</div>}
export function ErrorMessage({children}) {return children?<div className="ui-message ui-message--error" role="alert"><AlertCircle size={17}/>{children}</div>:null}
export function InfoMessage({children}) {return <div className="ui-message">{children}</div>}
export function ConfirmDialog({open,title='Are you sure?',message,onCancel,onConfirm,confirmLabel='Delete'}) {return open?<div className="ui-dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onCancel()}}><div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" className="ui-dialog"><h2 id="confirm-title">{title}</h2><p id="confirm-desc">{message}</p><div className="ui-dialog-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button variant="destructive" onClick={onConfirm}>{confirmLabel}</Button></div></div></div>:null}
export function Toast({message,onClose}) {return message?<div role="status" className="ui-toast"><CheckCircle2 size={18}/>{message}<IconButton label="Dismiss notification" onClick={onClose}><X size={16}/></IconButton></div>:null}
