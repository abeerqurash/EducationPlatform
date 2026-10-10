"use client";
import { useMemo,useSyncExternalStore } from 'react';
const empty={token:'',ready:false};
function createLinkStore(){
  let snapshot=empty;
  return {getSnapshot:()=>snapshot,subscribe:(notify:()=>void)=>{
   const capture=()=>{const value=new URLSearchParams(window.location.hash.slice(1)).get('token')??'';
    if(!snapshot.ready||value){snapshot={token:/^[a-f0-9]{64}$/.test(value)?value:'',ready:true};window.history.replaceState(null,'',window.location.pathname);notify();}
   };
   capture();window.addEventListener('hashchange',capture);return ()=>window.removeEventListener('hashchange',capture);
  }};
}
export function useAccountLink(){
 const store=useMemo(()=>createLinkStore(),[]);
 return useSyncExternalStore(store.subscribe,store.getSnapshot,()=>empty);
}
