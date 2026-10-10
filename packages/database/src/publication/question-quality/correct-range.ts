import {type Question,type Finding,issue} from "./shared";
export function checkCorrectRange(questions:readonly Question[]):Finding[] {
 return questions.filter(q=>!Number.isSafeInteger(q.correct)||q.correct<0||q.correct>=q.choices.length).map(q=>issue(q,"correct-range","Correct answer index must reference a choice"));
}
