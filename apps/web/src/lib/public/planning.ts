export type StudySubject = { name: string; weight: number };
export function allocateStudyMinutes(minutes: number, subjects: StudySubject[]) {
  if (!Number.isInteger(minutes) || minutes < 15 || minutes > 10080) throw new Error('Enter 15–10,080 whole minutes per week.');
  if (!subjects.length || subjects.length > 12) throw new Error('Choose 1–12 subjects.');
  if (subjects.some(s => !s.name.trim() || s.name.length > 80 || !Number.isInteger(s.weight) || s.weight < 1 || s.weight > 5)) throw new Error('Use a subject name and a priority from 1 to 5.');
  const total = subjects.reduce((sum, s) => sum + s.weight, 0);
  const rows = subjects.map((s, index) => ({ name: s.name.trim(), minutes: Math.floor(minutes * s.weight / total), remainder: minutes * s.weight / total % 1, index }));
  const remainder = minutes - rows.reduce((sum, s) => sum + s.minutes, 0);
  [...rows].sort((a, b) => b.remainder - a.remainder || a.index - b.index).slice(0, remainder).forEach(s => s.minutes++);
  return rows.map(({ name, minutes }) => ({ name, minutes }));
}

export const admissionsTasks = [
  { id: 'requirements', title: 'Check each institution’s requirements', detail: 'Read the official admissions page and record the application route, required documents and eligibility criteria.' },
  { id: 'deadlines', title: 'Record deadlines and time zones', detail: 'Include application, scholarship, portfolio and financial-support deadlines. Verify them directly with each institution.' },
  { id: 'records', title: 'Arrange academic records', detail: 'Ask your school how transcripts and any required translations are sent. Keep a record of requests and delivery.' },
  { id: 'references', title: 'Request references when required', detail: 'Give your referees context, instructions and sufficient notice. Confirm which submission method the institution accepts.' },
  { id: 'tests', title: 'Confirm test and language policies', detail: 'Check whether scores are required, optional or accepted, and how official reports must be delivered.' },
  { id: 'writing', title: 'Prepare application writing', detail: 'Answer the actual prompt in your own voice. Check word limits, review examples for specificity and proofread the final version.' },
  { id: 'costs', title: 'Compare costs and support', detail: 'Record tuition, living costs, available support and application fees from official sources. Keep currencies separate.' },
  { id: 'review', title: 'Review and confirm submission', detail: 'Check names, dates and attachments before submitting. Save confirmation details and follow up on missing documents.' },
] as const;

export function validChecklist(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error('The saved checklist is invalid.');
  const allowed = new Set<string>(admissionsTasks.map(t => t.id));
  if (value.some(v => typeof v !== 'string' || !allowed.has(v))) throw new Error('The saved checklist is invalid.');
  return [...new Set(value)] as string[];
}
