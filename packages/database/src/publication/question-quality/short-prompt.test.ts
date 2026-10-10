import {describe,it,expect} from "vitest";
import {checkShortPrompt} from "./short-prompt";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkShortPrompt",()=>{
it("accepts valid question",()=>expect(checkShortPrompt([good])).toEqual([]));
it("flags invalid question",()=>expect(checkShortPrompt([{...good,prompt:"Short"}])).toMatchObject([{questionId:"m01",rule:"short-prompt"}]));
it("handles empty bank",()=>expect(checkShortPrompt([])).toEqual([]));
});
