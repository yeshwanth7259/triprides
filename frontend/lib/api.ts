const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000/api';
export async function api<T=any>(path:string,options:RequestInit={}){const token=typeof window!=='undefined'?localStorage.getItem('tripride_token'):null;const headers=new Headers(options.headers);headers.set('Content-Type','application/json');if(token)headers.set('Authorization',`Bearer ${token}`);const res=await fetch(`${API}${path}`,{...options,headers,cache:'no-store'});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||'Request failed');return data as T;}
export function saveAuth(token:string,user:any){localStorage.setItem('tripride_token',token);localStorage.setItem('tripride_user',JSON.stringify(user));}
export function getUser(){if(typeof window==='undefined')return null;try{return JSON.parse(localStorage.getItem('tripride_user')||'null')}catch{return null}}
export function logout(){localStorage.removeItem('tripride_token');localStorage.removeItem('tripride_user');}
