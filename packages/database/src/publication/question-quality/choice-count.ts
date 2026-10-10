import {type Question,type Finding,issue} from "./shared";
export function checkChoiceCount(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>q.choices.length!==4).map(q=>issue(q,"choice-count","Practice questions must have four answer choices"));
}
