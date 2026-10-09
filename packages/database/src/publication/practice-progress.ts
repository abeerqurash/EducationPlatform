export type PracticeHistoryEntry = Readonly<{
  exam: string; correct: number; total: number; percentage: number;
  durationSeconds: number; createdAt: Date | string;
}>;
export function summarizePracticeHistory(entries: readonly PracticeHistoryEntry[]) {
  const totals = { attempts: entries.length, questions: 0, correct: 0, durationSeconds: 0 };
  const byExam = new Map<string, { attempts: number; questions: number; correct: number }>();
  for (const entry of entries) {
    if (!Number.isSafeInteger(entry.total) || entry.total < 1 ||
      !Number.isSafeInteger(entry.correct) || entry.correct < 0 || entry.correct > entry.total ||
      !Number.isSafeInteger(entry.durationSeconds) || entry.durationSeconds < 0) {
      throw new Error("Invalid practice history entry");
    }
    totals.questions += entry.total; totals.correct += entry.correct;
    totals.durationSeconds += entry.durationSeconds;
    const exam = byExam.get(entry.exam) ?? { attempts: 0, questions: 0, correct: 0 };
    exam.attempts++; exam.questions += entry.total; exam.correct += entry.correct;
    byExam.set(entry.exam, exam);
  }
  return {
    ...totals, accuracy: totals.questions ? Math.round(100 * totals.correct / totals.questions) : 0,
    exams: [...byExam].map(([exam, data]) => ({
      exam, ...data, accuracy: data.questions ? Math.round(100 * data.correct / data.questions) : 0,
    })),
  };
}
