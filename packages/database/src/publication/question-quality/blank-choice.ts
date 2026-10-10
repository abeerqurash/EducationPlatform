import {type Question,type Finding,issue} from "./shared";
export function checkBlankChoice(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>q.choices.some(c=>!c.trim())).map(q=>issue(q,"blank-choice","All choices must have visible text"));
}
