"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createQuestionDraft, importQuestionDrafts, transitionQuestionRevision } from "@education/database/question-bank";
import { isQuestionId, QuestionBankError } from "@education/database/question-bank/contract";
import { PRACTICE_QUESTIONS } from "@/app/dashboard/test-prep/practice/question-bank";
import { EXPANSION_DRAFTS } from '@education/database/question-bank/expansion';

async function actorId() {
  const session = await auth();
  const id = session?.user?.id?.trim();
  if (!isQuestionId(id)) throw new QuestionBankError("Authentication required.");
  return id;
}
export async function importExpansionQuestionsAction(){try{const result=await importQuestionDrafts(await actorId(),EXPANSION_DRAFTS);refresh();return {ok:true as const,...result};}catch(error){return {ok:false as const,error:error instanceof QuestionBankError?error.message:'Unable to import expansion drafts.'};}}
function refresh() { revalidatePath("/admin/question-bank", "layout"); revalidatePath("/dashboard/test-prep/practice/library"); }
export async function createQuestionDraftAction(input: { slug?: string; entryId?: string; content: unknown }) {
  try { const revision = await createQuestionDraft(await actorId(), input); refresh(); return { ok: true as const, id: revision.id }; }
  catch (error) { return { ok: false as const, error: error instanceof QuestionBankError ? error.message : "Unable to create draft. Check that migration 0006 is applied and try again." }; }
}
export async function transitionQuestionAction(revisionId: string, action: "submit" | "publish" | "reject" | "retire", note: string) {
  if (!["submit", "publish", "reject", "retire"].includes(action)) return { ok: false as const, error: "Invalid action." };
  try { await transitionQuestionRevision(await actorId(), revisionId, action, note); refresh(); return { ok: true as const }; }
  catch (error) { return { ok: false as const, error: error instanceof QuestionBankError ? error.message : "Unable to update this revision. Refresh and try again." }; }
}
export async function importStarterQuestionsAction() {
  try {
    const result = await importQuestionDrafts(await actorId(), PRACTICE_QUESTIONS.map(question => ({ slug: `starter-${question.id}`, content: {
      exam: question.exam, topic: question.topic, difficulty: "foundation", prompt: question.prompt,
      choices: [...question.choices], correct: question.correct, explanation: question.explanation,
      source: "Original EducationPlatform illustrative practice question; imported from the existing starter bank."
    } })));
    refresh(); return { ok: true as const, ...result };
  } catch (error) { return { ok: false as const, error: error instanceof QuestionBankError ? error.message : "Unable to import starter drafts. Check migration and author permissions." }; }
}
