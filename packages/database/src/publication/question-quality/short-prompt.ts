import {type Question,type Finding,issue} from "./shared";
export function checkShortPrompt(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>q.prompt.trim().length<12).map(q=>issue(q,"short-prompt","Prompt should contain at least 12 characters"));
}
