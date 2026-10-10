"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="p-6"><h2 className="text-xl font-bold">Account security could not be loaded</h2><p>Please try again or sign in again if your session ended.</p><button className="button button--primary" onClick={reset}>Try again</button></section>;}
