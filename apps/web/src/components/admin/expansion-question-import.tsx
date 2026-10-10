'use client';
import { dashboardAction } from '@/components/shared/dashboard-action-styles';
import { useState,useTransition } from 'react';
import { importExpansionQuestionsAction } from '@/app/actions/question-bank';
export function ExpansionQuestionImport(){const [message,setMessage]=useState('');const [pending,start]=useTransition();return <div><button disabled={pending} className={dashboardAction} onClick={()=>start(async()=>{const result=await importExpansionQuestionsAction();setMessage(result.ok?`${result.imported} drafts imported; ${result.skipped} already present. Independent review is required.`:result.error);})}>{pending?'Importing…':'Import 66 expansion drafts'}</button><p role="status" className="mt-2 max-w-md text-xs text-[#6c7162]">{message}</p></div>;}
