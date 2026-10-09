import { type Attempt, percent } from "./shared";
export function scoreBands(entries:readonly Attempt[]) {const bands={below50:0,from50To74:0,from75To89:0,atLeast90:0};for(const a of entries){const p=percent(a.correct,a.total);if(p<50)bands.below50++;else if(p<75)bands.from50To74++;else if(p<90)bands.from75To89++;else bands.atLeast90++;}return bands;}
