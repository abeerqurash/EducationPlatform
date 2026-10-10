import {type Question,type Finding,issue} from "./shared";
export function checkMissingExplanation(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>!q.explanation.trim()).map(q=>issue(q,"missing-explanation","Answer explanation is required"));
}
