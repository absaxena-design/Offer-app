// Public Supabase project identifiers only. Never include service-role or secret keys here.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ljuhuajevqiltynibvli.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ruPu8iCPevP4EUxBt544eA_RDgnBhl1';
const SESSION_KEY = 'arxa-supabase-session-v1';
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
export function getSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
function setSession(value){if(value)localStorage.setItem(SESSION_KEY,JSON.stringify(value));else localStorage.removeItem(SESSION_KEY);return value}
async function request(path,{method='GET',body,token,headers={}}={}){
 const r=await fetch(SUPABASE_URL+path,{method,headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...headers},...(body!==undefined?{body:JSON.stringify(body)}:{})});
 const raw=await r.text();let data;try{data=raw?JSON.parse(raw):null}catch{data=raw}
 if(!r.ok)throw new Error(data?.msg||data?.message||data?.error_description||data?.error||'Supabase request failed ('+r.status+')');
 return data;
}
export async function signIn(email,password){const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});return setSession(data)}
export async function signUp(email,password){const data=await request('/auth/v1/signup',{method:'POST',body:{email,password}});if(data?.access_token)setSession(data);return data}
export async function signOut(){const session=getSession();try{if(session?.access_token)await request('/auth/v1/logout',{method:'POST',token:session.access_token})}finally{setSession(null)}}
export async function activeSession(){let session=getSession();if(!session?.access_token)return null;if(session.expires_at&&session.expires_at*1000>Date.now()+60000)return session;if(!session.refresh_token)return null;try{const data=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}});session=setSession(data);return session}catch{setSession(null);return null}}
export async function listCloudProducts(){const session=await activeSession();if(!session?.access_token)return null;const result=await request('/rest/v1/watchlist_records?select=id,payload&order=created_at.desc',{token:session.access_token});return result.map(r=>r.payload)}
export async function upsertCloudProduct(product){const session=await activeSession();if(!session?.access_token)throw Error('Sign in again to sync products');const id=String(product.id);await request('/rest/v1/watchlist_records?on_conflict=user_id,id',{method:'POST',token:session.access_token,headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:{id,user_id:session.user.id,payload:product}})}
export async function deleteCloudProduct(id){const session=await activeSession();if(!session?.access_token)throw Error('Sign in again to sync products');await request('/rest/v1/watchlist_records?id=eq.'+encodeURIComponent(id),{method:'DELETE',token:session.access_token})}
export function currentAccount(){return getSession()?.user||null}
