import {describe,it,expect} from "vitest";
import {checkMissingId} from "./missing-id";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkMissingId",()=>{
it("accepts valid question",()=>expect(checkMissingId([good])).toEqual([]));
it("flags invalid question",()=>expect(checkMissingId([{...good,id:""}])).toMatchObject([{questionId:"",rule:"missing-id"}]));
it("handles empty bank",()=>expect(checkMissingId([])).toEqual([]));
});
