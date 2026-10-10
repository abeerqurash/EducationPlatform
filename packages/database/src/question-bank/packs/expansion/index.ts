import { questions as algebra } from './linear-equations';
import { questions as percentages } from './percent-discounts';
import { questions as rates } from './unit-rates';
import { questions as geometry } from './rectangle-area';
import { questions as statistics } from './arithmetic-mean';
import { questions as counting } from './integer-probability';
import { questions as english } from './english-editing';
import { questions as reading } from './reading-evidence';
import { questions as science } from './science-data';
/** 48 parameterized math exercises plus 18 individually written verbal/data exercises. Import as drafts only. */
export const EXPANSION_DRAFTS=[...algebra,...percentages,...rates,...geometry,...statistics,...counting,...english,...reading,...science] as const;
