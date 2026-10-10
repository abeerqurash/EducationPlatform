import { PublicShell } from '@/components/public/public-shell';
import { StudyPlanner } from '@/components/public/study-planner';
import { publicMetadata } from '@/lib/public/seo';
export const metadata = publicMetadata("Weekly study time planner", "Allocate weekly study minutes across subjects using relative priorities.", '/tools/study/study-time-planner');
export default function Page() {return <PublicShell title={"Weekly study time planner"} description={"Allocate weekly study minutes across subjects using relative priorities."} eyebrow="Free planning tool"><StudyPlanner /></PublicShell>;}
