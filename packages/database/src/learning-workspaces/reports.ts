/** Escape spreadsheet formulas as well as CSV quotes; every cell is quoted. */
export function workspaceCsvCell(value:unknown){let text=value==null?'':String(value);if(/^[\s]*[=+@-]/.test(text)||/^[\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
export function classroomGradebook(data:{room:{title:string};assignments:{id:string;title:string;exam:string;dueAt:Date}[];roster:{id:string;name:string|null;email:string|null}[];work:{assignmentId:string;userId:string;submittedAt:Date|null;percentage:number|null}[]}){
 const rows:unknown[][]=[['Classroom','Assignment','Exam','Due UTC','Learner','Email','Status','Percent correct','Submitted UTC']];
 for(const assignment of data.assignments)for(const learner of data.roster){const work=data.work.find(w=>w.assignmentId===assignment.id&&w.userId===learner.id);rows.push([data.room.title,assignment.title,assignment.exam,assignment.dueAt.toISOString(),learner.name,learner.email,work?.submittedAt?'submitted':work?'started':'not started',work?.submittedAt?work.percentage:'',work?.submittedAt?.toISOString()??'']);}
 return rows.map(row=>row.map(workspaceCsvCell).join(',')).join('\r\n')+'\r\n';
}
