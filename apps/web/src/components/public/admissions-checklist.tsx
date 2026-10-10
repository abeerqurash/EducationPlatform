"use client";
import { useState } from 'react';
import { admissionsTasks, validChecklist } from '@/lib/public/planning';
import { downloadText } from '@/lib/public/download';
const key = 'ep-admissions-checklist-v1';

export function AdmissionsChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  function load() { try { const data = localStorage.getItem(key); setChecked(data ? validChecklist(JSON.parse(data)) : []); setMessage(data ? 'Saved checklist loaded.' : 'No saved checklist on this browser.'); } catch { setMessage('The saved checklist could not be loaded. Your current checklist is unchanged.'); } }
  function save() { try { localStorage.setItem(key, JSON.stringify(checked)); setMessage('Saved on this browser.'); } catch { setMessage('Browser storage is unavailable. Download a copy instead.'); } }
  return <section className="public-panel"><h2>Your application checklist</h2><p>Use a separate downloaded copy for each institution. Requirements and deadlines vary; check official sources. This checklist does not calculate admission chances.</p><p>No account required. Saving is optional, stays in this browser and may be visible to other people using it.</p><p className="public-result" aria-live="polite">{checked.length} of {admissionsTasks.length} steps complete</p><div className="checklist">{admissionsTasks.map(task => <label className="checklist-item" key={task.id}><input type="checkbox" checked={checked.includes(task.id)} onChange={e => setChecked(e.target.checked ? [...checked,task.id] : checked.filter(id => id !== task.id))} /><span><strong>{task.title}</strong><span>{task.detail}</span></span></label>)}</div><div className="public-actions"><button className="button button--primary" onClick={save}>Save on this browser</button><button className="button button--secondary" onClick={load}>Load saved checklist</button><button className="button button--secondary" onClick={() => downloadText('admissions-checklist.txt', admissionsTasks.map(t => `${checked.includes(t.id)?'[x]':'[ ]'} ${t.title}\n${t.detail}`).join('\n\n'))}>Download checklist</button><button className="button button--secondary" onClick={() => {try {localStorage.removeItem(key);setChecked([]);setMessage('Saved and current checklist cleared.');} catch {setMessage('Could not clear browser storage. Clear site data in your browser settings.');}}}>Clear checklist</button></div><p role="status">{message}</p></section>;
}
