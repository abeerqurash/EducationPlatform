import {type Question,type Finding,issue} from "./shared";
export function checkPromptLength(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>q.prompt.length>3000).map(q=>issue(q,"prompt-length","Prompt exceeds 3000 characters"));
}
