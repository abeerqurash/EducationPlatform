"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { abandonQuestionPractice, saveQuestionPracticeDraft, startQuestionPractice, submitQuestionPractice } from "@education/database/question-bank";
import { isQuestionId, QuestionBankError } from "@education/database/question-bank/contract";
async function userId() {
  const session = await auth(); const id = session?.user?.id?.trim();
  if (!isQuestionId(id)) throw new QuestionBankError("Authentication required.");
  return id;
}
const message = (error: unknown) => error instanceof QuestionBankError ? error.message : "Unable to complete this request. Check your connection and try again.";
export async function startLibraryAction(exam: "SAT" | "ACT", topic: string) {
  try { const session = await startQuestionPractice(await userId(), exam, topic); return { ok: true as const, session }; }
  catch (error) { return { ok: false as const, error: message(error) }; }
}
export async function submitLibraryAction(id: string, answers: unknown) {
  try {
    const result = await submitQuestionPractice(await userId(), id, answers);
    for (const path of ["/dashboard/test-prep/practice/history", "/dashboard/test-prep/practice/readiness", "/dashboard/test-prep/practice/library"]) revalidatePath(path);
    return { ok: true as const, ...result };
  } catch (error) { return { ok: false as const, error: message(error) }; }
}
export async function saveLibraryDraftAction(id: string, answers: unknown) {
  try { await saveQuestionPracticeDraft(await userId(), id, answers); return { ok: true as const }; }
  catch (error) { return { ok: false as const, error: message(error) }; }
}
export async function abandonLibraryAction(id: string) {
  try { await abandonQuestionPractice(await userId(), id); revalidatePath("/dashboard/test-prep/practice/library"); return { ok: true as const }; }
  catch (error) { return { ok: false as const, error: message(error) }; }
}
