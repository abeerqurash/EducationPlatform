import {type Question,type Finding,issue} from "./shared";
export function checkExamValue(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>!["SAT","ACT","Both"].includes(q.exam)).map(q=>issue(q,"exam-value","Exam must be SAT, ACT or Both"));
}
