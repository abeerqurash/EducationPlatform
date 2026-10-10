import {type Question,type Finding,issue} from "./shared";
export function checkMissingId(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>!q.id.trim()).map(q=>issue(q,"missing-id","Question ID is required"));
}
