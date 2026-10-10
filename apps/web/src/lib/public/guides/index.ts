import { guide as guide0 } from './credit-weighted-gpa';
import { guide as guide1 } from './weighted-course-grades';
import { guide as guide2 } from './final-exam-targets';
import { guide as guide3 } from './percentage-basics';
import { guide as guide4 } from './percentage-change';
import { guide as guide5 } from './averages-and-weights';
import { guide as guide6 } from './weekly-study-planning';
import { guide as guide7 } from './practice-error-log';
import { guide as guide8 } from './practice-score-interpretation';
import { guide as guide9 } from './application-checklist';
import { guide as guide10 } from './reading-review';
import { guide as guide11 } from './math-review';
export const guides = [guide0,guide1,guide2,guide3,guide4,guide5,guide6,guide7,guide8,guide9,guide10,guide11];
export function findGuide(slug: string) { return guides.find(g => g.slug === slug); }
