import {type Question,type Finding,issue} from "./shared";
export function checkTopicValue(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>!["Math","Reading","English","Science"].includes(q.topic)).map(q=>issue(q,"topic-value","Unknown practice topic"));
}
