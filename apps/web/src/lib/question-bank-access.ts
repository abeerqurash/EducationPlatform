import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { resolvePublicationActor } from "../../../../packages/database/src/publication/actor-resolver";
import { isQuestionId, questionBankPermissions } from "@education/database/question-bank/contract";

export async function requireQuestionBankAccess(path: string) {
  const session = await auth();
  const user = session?.user;
  const id = user?.id?.trim();
  if (!user || !isQuestionId(id)) redirect(`/login?callbackUrl=${encodeURIComponent(path)}`);
  const actor = await resolvePublicationActor(id);
  const canAuthor = actor.permissionKeys.includes(questionBankPermissions.author);
  const canReview = actor.permissionKeys.includes(questionBankPermissions.review);
  if (!canAuthor && !canReview) redirect("/dashboard");
  return { user, actor, canAuthor, canReview };
}
