import { describe,it,expect } from 'vitest';
import { EXPANSION_DRAFTS } from './index';
import { parseQuestionContent,questionSlug } from '../../contract';
describe('original expansion draft pack',()=>{
 it('has 66 distinct drafts and prompts',()=>{expect(EXPANSION_DRAFTS).toHaveLength(66);expect(new Set(EXPANSION_DRAFTS.map(q=>q.slug)).size).toBe(66);expect(new Set(EXPANSION_DRAFTS.map(q=>q.content.prompt)).size).toBe(66);});
 it.each(EXPANSION_DRAFTS.map(q=>[q.slug,q] as const))('%s satisfies editorial content boundaries',(slug,q)=>{expect(questionSlug(slug)).toBe(slug);expect(parseQuestionContent(q.content)).toEqual(q.content);expect(q.content.source).toContain('Original EducationPlatform');expect(q.content.source).toContain('review');});
 const numericKeys:Record<string,number[]>={
  'linear-equations':[5,6,7,8,9,10,11,12],
  'percent-discounts':[45,60,75,90,105,120,135,150],
  'unit-rates':[6,7,8,9,10,11,12,13],
  'rectangle-area':[24,35,48,63,80,99,120,143],
  'arithmetic-mean':[6,7,8,9,10,11,12,13],
  'integer-probability':[8,10,12,14,16,18,20,22],
 };
 for(const [family,expected] of Object.entries(numericKeys)){it.each(expected.map((answer,index)=>[index+1,answer]))(`${family} variant %i has the independently checked key`,(variant,answer)=>{const q=EXPANSION_DRAFTS.find(q=>q.slug===`expansion-${family}-${variant}`);expect(q).toBeDefined();expect(Number(q!.content.choices[q!.content.correct])).toBe(answer);});}
 it('keeps all data questions ACT-only',()=>expect(EXPANSION_DRAFTS.filter(q=>q.content.topic==='Science').every(q=>q.content.exam==='ACT')).toBe(true));
 it('rotates correct answer positions',()=>expect(new Set(EXPANSION_DRAFTS.map(q=>q.content.correct)).size).toBe(4));
});
