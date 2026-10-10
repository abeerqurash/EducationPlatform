import {type Question,type Finding,issue} from "./shared";
export function checkShortExplanation(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>q.explanation.trim().length<15).map(q=>issue(q,"short-explanation","Answer explanation should contain at least 15 characters"));
}
