'use client';
import Link from 'next/link';
export default function Error({reset}:{reset:()=>void}){return <div className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-bold">Workspace unavailable</h1><p className="my-4 text-sm text-slate-600">Check your invitation, account verification, and workspace permission. An archived classroom or closed assignment may no longer be available.</p><button onClick={reset} className="mr-4 rounded-xl border p-3 text-sm">Try again</button><Link className="text-sm underline" href="/dashboard/workspaces">Back to workspaces</Link></div>;}
