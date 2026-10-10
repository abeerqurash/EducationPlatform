import { auditLogs } from '../schema/audit';
import type { WorkspaceActor,WorkspaceTransaction } from './access';
/** Record successful sensitive mutations in the same transaction; never store codes, emails, answers, or message bodies. */
export async function workspaceAudit(tx:WorkspaceTransaction,actor:WorkspaceActor,scope:string,id:string,operation:string){await tx.insert(auditLogs).values({actorUserId:actor.id,action:'update',entityType:`workspace.${scope}`,entityId:id,metadata:{operation}});}
