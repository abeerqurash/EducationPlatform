import { ConsentControls } from '@/components/privacy/consent-controls';
export const metadata={title:'Privacy preferences',robots:{index:false,follow:false}};
export default function Page(){return <main className="site-container py-12"><h1 className="mb-6 text-3xl font-extrabold">Privacy preferences</h1><ConsentControls/><p className="mt-6 text-sm text-slate-600">Choices apply to this browser. You can change them at any time here. Existing required authentication storage is managed by your account session.</p></main>;}
