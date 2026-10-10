import * as workspaces from '@education/database/learning-workspaces';
import { WorkspaceError } from '@education/database/learning-workspaces/contract';
import { QuestionBankError } from '@education/database/question-bank/contract';
import { accountJson,accountSession,accountResponse,accountFailure } from '@/lib/auth/account-http';
export async function POST(request:Request){try{const body=await accountJson(request);const user=await accountSession();const actor={id:user.id!,authVersion:user.authVersion!};let result:unknown;
 switch(body.action){
 case 'classroom.create':result=await workspaces.createClassroom(actor,body.title);break;
 case 'classroom.archive':result=await workspaces.manageClassroom(actor,body.id,'archive');break;
 case 'classroom.remove':result=await workspaces.manageClassroom(actor,body.id,'remove',body.userId);break;
 case 'invite.create':result=await workspaces.createLearningInvite(actor,body.kind,body.email,body.classroomId);break;
 case 'invite.accept':result=await workspaces.acceptLearningInvite(actor,body.token);break;
 case 'invite.revoke':result=await workspaces.revokeLearningInvite(actor,body.id);break;
 case 'parent.remove':result=await workspaces.removeParentLink(actor,body.id);break;
 case 'assignment.create':result=await workspaces.createClassroomAssignment(actor,body.classroomId,body.title,body.exam,body.ids,body.due);break;
 case 'assignment.close':result=await workspaces.closeClassroomAssignment(actor,body.id);break;
 case 'assignment.start':result=await workspaces.assignmentSession(actor,body.id,true);break;
 case 'assignment.save':result=await workspaces.saveAssignmentWork(actor,body.id,body.answers,false);break;
 case 'assignment.submit':result=await workspaces.saveAssignmentWork(actor,body.id,body.answers,true);break;
 case 'ticket.create':result=await workspaces.createSupportTicket(actor,body.subject,body.category,body.message);break;
 case 'ticket.reply':result=await workspaces.replySupportTicket(actor,body.id,body.message,body.staff===true);break;
 case 'ticket.status':result=await workspaces.setSupportStatus(actor,body.id,body.status,body.staff===true);break;
 default:throw new WorkspaceError('Unknown workspace action.');
 }return accountResponse(result);
 }catch(error){if(error instanceof WorkspaceError||error instanceof QuestionBankError)return accountResponse({success:false,error:error.message},400);return accountFailure(error);}}
