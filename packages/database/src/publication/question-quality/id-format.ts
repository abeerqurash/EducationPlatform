import {type Question,type Finding,issue} from "./shared";
export function checkIdFormat(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>!/^[A-Za-z0-9_-]{1,100}$/.test(q.id)).map(q=>issue(q,"id-format","ID must be 1–100 ASCII letters, digits, hyphens or underscores"));
}
