import {type Question,type Finding,issue} from "./shared";
export function checkExplanationLength(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>q.explanation.length>5000).map(q=>issue(q,"explanation-length","Explanation exceeds 5000 characters"));
}
