import {describe,it,expect} from "vitest";
import {auditQuestionBank} from "./index";
const q={id:"a",exam:"SAT",topic:"Math",prompt:"What is the correct answer?",choices:["A","B","C","D"],correct:0,explanation:"This explanation is long enough."};
describe("auditQuestionBank",()=>{
 it("accepts a valid bank",()=>expect(auditQuestionBank([q])).toEqual([]));
 it("detects duplicate IDs",()=>expect(auditQuestionBank([q,q]).some(x=>x.rule==="duplicate-id")).toBe(true));
});
