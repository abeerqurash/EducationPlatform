import {type Question,type Finding,issue} from "./shared";
export function checkScienceEligibility(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>q.topic==="Science"&&q.exam!=="ACT").map(q=>issue(q,"science-eligibility","Science questions must be ACT-specific"));
}
