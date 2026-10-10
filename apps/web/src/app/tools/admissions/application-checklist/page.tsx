import { PublicShell } from '@/components/public/public-shell';
import { AdmissionsChecklist } from '@/components/public/admissions-checklist';
import { publicMetadata } from '@/lib/public/seo';
export const metadata = publicMetadata("Application checklist", "Track application preparation and optionally save a checklist in your browser.", '/tools/admissions/application-checklist');
export default function Page() {return <PublicShell title={"Application checklist"} description={"Track application preparation and optionally save a checklist in your browser."} eyebrow="Free planning tool"><AdmissionsChecklist /></PublicShell>;}
