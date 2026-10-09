/** Original illustrative practice items. Not affiliated with or endorsed by test owners. */
export type PracticeExam = "SAT" | "ACT";
export type PracticeTopic = "Math" | "Reading" | "English" | "Science";
export type PracticeQuestion = Readonly<{ id: string; exam: PracticeExam | "Both"; topic: PracticeTopic; prompt: string; choices: readonly [string, string, string, string]; correct: number; explanation: string }>;
export const PRACTICE_QUESTIONS: readonly PracticeQuestion[] = [
  {id:"m01",exam:"Both",topic:"Math",prompt:"Solve 3x + 7 = 22.",choices:["3","5","7","9"],correct:1,explanation:"Subtract 7 from both sides, then divide 15 by 3."},
  {id:"m02",exam:"Both",topic:"Math",prompt:"A $80 jacket is discounted by 25%. What is its sale price?",choices:["$20","$55","$60","$65"],correct:2,explanation:"25% of 80 is 20; 80 − 20 = 60."},
  {id:"m03",exam:"Both",topic:"Math",prompt:"What is the slope of a line through (1, 2) and (5, 10)?",choices:["1","2","4","8"],correct:1,explanation:"Slope = (10 − 2)/(5 − 1) = 8/4 = 2."},
  {id:"m04",exam:"Both",topic:"Math",prompt:"The mean of 4, 8, 10, and x is 9. Find x.",choices:["12","14","16","18"],correct:1,explanation:"Four values sum to 36; the known values sum to 22, so x = 14."},
  {id:"m05",exam:"Both",topic:"Math",prompt:"If f(x) = 2x² − 3, what is f(3)?",choices:["9","12","15","18"],correct:2,explanation:"2 × 3² − 3 = 18 − 3 = 15."},
  {id:"m06",exam:"Both",topic:"Math",prompt:"A right triangle has legs 6 and 8. What is its hypotenuse?",choices:["9","10","12","14"],correct:1,explanation:"By the Pythagorean theorem, √(36 + 64) = 10."},
  {id:"m07",exam:"Both",topic:"Math",prompt:"If 2/5 of a number is 18, what is the number?",choices:["36","40","45","50"],correct:2,explanation:"18 × 5/2 = 45."},
  {id:"m08",exam:"Both",topic:"Math",prompt:"Which expression equals (x + 4)(x − 4)?",choices:["x² + 16","x² − 16","x² − 8x + 16","x² + 8x − 16"],correct:1,explanation:"This is a difference of squares: x² − 4²."},
  {id:"r01",exam:"Both",topic:"Reading",prompt:"Passage: 'The path was muddy, yet Mira continued toward the summit.' Which inference is best supported?",choices:["Mira turned back","Mira persisted despite difficulty","The path was paved","Mira arrived by car"],correct:1,explanation:"The contrast word 'yet' emphasizes that Mira continued despite the muddy path."},
  {id:"r02",exam:"Both",topic:"Reading",prompt:"Passage: 'The new library extended its hours so more residents could visit after work.' What was the likely purpose?",choices:["Reduce book loans","Increase accessibility","Close earlier","Limit visitors"],correct:1,explanation:"Later hours allow working residents additional opportunities to visit."},
  {id:"r03",exam:"Both",topic:"Reading",prompt:"In 'The scientist's claim was tentative pending further trials,' tentative most nearly means:",choices:["certain","temporary or uncertain","angry","unrelated"],correct:1,explanation:"A tentative claim is provisional until more evidence is available."},
  {id:"r04",exam:"Both",topic:"Reading",prompt:"Passage: 'Unlike the first model, the updated device consumes less energy.' What is being compared?",choices:["Device colors","Energy consumption","Purchase locations","Repair costs"],correct:1,explanation:"The comparison specifically concerns energy use."},
  {id:"r05",exam:"Both",topic:"Reading",prompt:"Passage: 'Although attendance fell in June, participation recovered in July.' What is the relationship between the clauses?",choices:["Contrast","Cause only","Repetition","Definition"],correct:0,explanation:"'Although' introduces a contrast between the June decline and July recovery."},
  {id:"r06",exam:"Both",topic:"Reading",prompt:"Passage: 'Each tree was labeled before researchers measured its height.' Which action happened first?",choices:["Measuring height","Labeling trees","Publishing results","Cutting trees"],correct:1,explanation:"The passage explicitly says labeling occurred before measuring."},
  {id:"e01",exam:"Both",topic:"English",prompt:"Choose the grammatically correct sentence.",choices:["Neither student were late.","Neither student was late.","Neither students was late.","Neither student are late."],correct:1,explanation:"The singular subject 'neither student' takes 'was.'"},
  {id:"e02",exam:"Both",topic:"English",prompt:"Choose the sentence with correct punctuation.",choices:["After the rain stopped we left.","After the rain stopped, we left.","After, the rain stopped we left.","After the rain, stopped we left."],correct:1,explanation:"A comma separates the introductory dependent clause from the main clause."},
  {id:"e03",exam:"Both",topic:"English",prompt:"Choose the most concise revision: 'Due to the fact that the train was late, we waited.'",choices:["Because the train was late, we waited.","Due to the train being late in time, we waited.","In light of the fact the train was late, we waited.","As a result of the train being in lateness, we waited."],correct:0,explanation:"'Because' expresses the reason directly and concisely."},
  {id:"e04",exam:"Both",topic:"English",prompt:"Choose the correct word: 'The committee reached ___ decision.'",choices:["their","its","it's","them"],correct:1,explanation:"The singular collective noun 'committee' takes the possessive 'its' in this construction."},
  {id:"e05",exam:"Both",topic:"English",prompt:"Choose the sentence with parallel structure.",choices:["She likes hiking, to swim, and cycling.","She likes hiking, swimming, and cycling.","She likes to hike, swimming, and cycling.","She likes hiking, swimming, and to cycle."],correct:1,explanation:"All three activities use the same -ing grammatical form."},
  {id:"e06",exam:"Both",topic:"English",prompt:"Choose the correct transition: 'The evidence was limited; ___, the researchers called for more trials.'",choices:["however","therefore","meanwhile","similarly"],correct:1,explanation:"'Therefore' introduces a conclusion resulting from limited evidence."},
  {id:"s01",exam:"ACT",topic:"Science",prompt:"A plant grew 2 cm in week 1 and 5 cm in week 2. What is the increase in growth?",choices:["2 cm","3 cm","5 cm","7 cm"],correct:1,explanation:"5 − 2 = 3 cm."},
  {id:"s02",exam:"ACT",topic:"Science",prompt:"In a controlled experiment, which variable is deliberately changed?",choices:["Dependent variable","Independent variable","Constant","Control group"],correct:1,explanation:"The independent variable is manipulated to study its effect."},
  {id:"s03",exam:"ACT",topic:"Science",prompt:"A sample has mass 24 g and volume 8 cm³. What is its density?",choices:["2 g/cm³","3 g/cm³","8 g/cm³","32 g/cm³"],correct:1,explanation:"Density = mass/volume = 24/8 = 3 g/cm³."},
  {id:"s04",exam:"ACT",topic:"Science",prompt:"As light intensity increased, photosynthesis increased then leveled off. What does the plateau suggest?",choices:["Light is the only limiting factor","Another factor may limit the rate","Photosynthesis stopped entirely","Measurements must be invalid"],correct:1,explanation:"At high light levels, another resource can limit the process."},
];
export function selectPracticeQuestions(exam: PracticeExam, topic: PracticeTopic | "All" = "All", limit = 10): PracticeQuestion[] {
  const n = Number.isFinite(limit) ? Math.max(1, Math.min(24, Math.floor(limit))) : 10;
  return PRACTICE_QUESTIONS.filter(q => (q.exam === exam || q.exam === "Both") && (topic === "All" || q.topic === topic)).slice(0, n);
}
export type PracticeAnswer = Readonly<{ id: string; choice: number }>;
export function gradePracticeSession(questions: readonly PracticeQuestion[], answers: readonly PracticeAnswer[]) {
  const selected = new Map(answers.map(a => [a.id, a.choice]));
  const results = questions.map(q => { const answer = selected.get(q.id); return { id: q.id, topic: q.topic, selected: Number.isInteger(answer) && answer! >= 0 && answer! <= 3 ? answer : null, correct: q.correct, isCorrect: answer === q.correct, explanation: q.explanation }; });
  const answered = results.filter(r => r.selected !== null).length;
  const correct = results.filter(r => r.isCorrect).length;
  return { total: questions.length, answered, correct, incorrect: answered - correct, unanswered: questions.length - answered, percentage: questions.length ? Math.round(correct * 100 / questions.length) : 0, results };
}
export function practiceReport(exam: PracticeExam, questions: readonly PracticeQuestion[], answers: readonly PracticeAnswer[]) {
  const score = gradePracticeSession(questions, answers);
  return [`${exam} ORIGINAL PRACTICE SESSION`, `Correct: ${score.correct}/${score.total} (${score.percentage}%)`, `Answered: ${score.answered}; Unanswered: ${score.unanswered}`, `Not an official ${exam} score.`, "", ...questions.flatMap((q, i) => { const selected = score.results[i]?.selected; return [`${i+1}. ${q.prompt}`, `Your answer: ${selected === null || selected === undefined ? "Not answered" : (q.choices[selected] ?? "Not answered")}`, `Correct answer: ${q.choices[q.correct]}`, `Explanation: ${q.explanation}`, ""]; })].join("\n");
}
