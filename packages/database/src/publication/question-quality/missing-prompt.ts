import {type Question,type Finding,issue} from "./shared";
export function checkMissingPrompt(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>!q.prompt.trim()).map(q=>issue(q,"missing-prompt","Prompt is required"));
}
