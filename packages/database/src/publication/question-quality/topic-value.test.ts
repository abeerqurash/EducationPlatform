import {describe,it,expect} from "vitest";
import {checkTopicValue} from "./topic-value";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkTopicValue",()=>{
it("accepts valid question",()=>expect(checkTopicValue([good])).toEqual([]));
it("flags invalid question",()=>expect(checkTopicValue([{...good,topic:"Other"}])).toMatchObject([{questionId:"m01",rule:"topic-value"}]));
it("handles empty bank",()=>expect(checkTopicValue([])).toEqual([]));
});
