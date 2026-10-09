import { describe, expect, it } from "vitest";
import { filterStudyActivities, paginateStudyActivities, type StudyActivityRow } from "../../../../apps/web/src/components/dashboard/study-activity-filter";
const rows: StudyActivityRow[] = [
  {id:"1",title:"SAT Reading",activityType:"study_session",durationMinutes:40,createdAt:"2026-10-08T10:00:00.000Z",manual:true},
  {id:"2",title:"GPA Calculator",activityType:"calculator",durationMinutes:5,createdAt:"2026-10-09T10:00:00.000Z",manual:false},
  {id:"3",title:"Math practice",activityType:"study_session",durationMinutes:60,createdAt:"2026-10-07T10:00:00.000Z",manual:true},
];
const filters = {query:"",type:"all",sort:"newest"};
describe("study activity history", () => {
  it("orders newest first without mutating input", () => {expect(filterStudyActivities(rows,filters).map(r=>r.id)).toEqual(["2","1","3"]);expect(rows[0].id).toBe("1");});
  it("searches case-insensitively", () => expect(filterStudyActivities(rows,{...filters,query:"  sat "}).map(r=>r.id)).toEqual(["1"]));
  it("filters sessions", () => expect(filterStudyActivities(rows,{...filters,type:"sessions"})).toHaveLength(2));
  it("filters calculator activity", () => expect(filterStudyActivities(rows,{...filters,type:"calculators"}).map(r=>r.id)).toEqual(["2"]));
  it("sorts longest first", () => expect(filterStudyActivities(rows,{...filters,sort:"longest"}).map(r=>r.id)).toEqual(["3","1","2"]));
  it("sorts oldest first", () => expect(filterStudyActivities(rows,{...filters,sort:"oldest"}).map(r=>r.id)).toEqual(["3","1","2"]));
  it("sorts by title", () => expect(filterStudyActivities(rows,{...filters,sort:"title"}).map(r=>r.id)).toEqual(["2","3","1"]));
  it("handles empty pages", () => expect(paginateStudyActivities([],5,10)).toMatchObject({page:1,totalPages:1,start:0,end:0,items:[]}));
  it("clamps pages and page sizes", () => expect(paginateStudyActivities(rows,100,999)).toMatchObject({page:1,pageSize:10,total:3}));
  it("handles multiple pages", () => expect(paginateStudyActivities(Array.from({length:12},(_,i)=>i),3,5)).toMatchObject({page:3,start:11,end:12,items:[10,11]}));
});
