import {describe,it,expect} from "vitest";
import {checkIdFormat} from "./id-format";
import type {Question} from "./shared";
const good:Question={id:"m01",exam:"SAT",topic:"Math",prompt:"What is the answer to this problem?",choices:["Alpha","Beta","Gamma","Delta"],correct:1,explanation:"Because the second choice is correct."};
describe("checkIdFormat",()=>{
it("accepts valid question",()=>expect(checkIdFormat([good])).toEqual([]));
it("flags invalid question",()=>expect(checkIdFormat([{...good,id:"bad id"}])).toMatchObject([{questionId:"bad id",rule:"id-format"}]));
it("handles empty bank",()=>expect(checkIdFormat([])).toEqual([]));
});
