import {type Question,type Finding,issue,normalize} from "./shared";
export function checkDuplicateChoices(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>new Set(q.choices.map(normalize)).size!==q.choices.length).map(q=>issue(q,"duplicate-choices","Answer choices must be distinct"));
}
