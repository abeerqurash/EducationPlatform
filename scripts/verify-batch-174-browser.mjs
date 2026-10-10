import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
// Optional browser acceptance: set PLAYWRIGHT_MODULE to an installed module URL.
// CHROMIUM_EXECUTABLE is optional if Playwright's default browser is installed.
if (!process.env.PLAYWRIGHT_MODULE) throw new Error('Set PLAYWRIGHT_MODULE to your installed Playwright module URL.');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
const port = '3019';
const base = `http://localhost:${port}`;
const server = spawn(process.execPath,['node_modules/next/dist/bin/next','start','apps/web','--port',port],{cwd:process.cwd(),windowsHide:true,stdio:'ignore'});
let browser;
const errors=[];
try {
  let ready=false;
  for(let i=0;i<80;i++){try{if((await fetch(base+'/about')).status===200){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}
  if(!ready)throw new Error('Test server did not start. Run the production build first and check port 3019.');
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
  const page=await browser.newPage({viewport:{width:1366,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/tools/study/study-time-planner');
  await page.getByRole('button',{name:'Calculate plan',exact:true}).click();
  await page.getByRole('heading',{name:'Your weekly plan',exact:true}).waitFor();
  assert.match(await page.locator('.public-result').innerText(),/Math: 180 minutes/);
  assert.match(await page.locator('.public-result').innerText(),/Reading: 120 minutes/);
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download plan',exact:true}).click();assert.equal((await downloadPromise).suggestedFilename(),'weekly-study-plan.txt');
  await page.getByLabel('Available study minutes per week').fill('400');assert.equal(await page.getByRole('heading',{name:'Your weekly plan',exact:true}).count(),0);
  await page.goto(base+'/tools/admissions/application-checklist');
  assert.equal(await page.evaluate(()=>localStorage.getItem('ep-admissions-checklist-v1')),null);
  await page.getByRole('checkbox').first().check();await page.getByRole('button',{name:'Save on this browser',exact:true}).click();await page.reload();
  assert.equal(await page.getByRole('checkbox').first().isChecked(),false);
  await page.getByRole('button',{name:'Load saved checklist',exact:true}).click();assert.equal(await page.getByRole('checkbox').first().isChecked(),true);
  await page.evaluate(()=>localStorage.setItem('ep-admissions-checklist-v1','["bad-id"]'));await page.getByRole('button',{name:'Load saved checklist',exact:true}).click();await page.getByText('The saved checklist could not be loaded. Your current checklist is unchanged.',{exact:true}).waitFor();assert.equal(await page.getByRole('checkbox').first().isChecked(),true);
  await page.getByRole('button',{name:'Clear checklist',exact:true}).click();assert.equal(await page.getByRole('checkbox').first().isChecked(),false);assert.equal(await page.evaluate(()=>localStorage.getItem('ep-admissions-checklist-v1')),null);
  await page.goto(base+'/guides?q=credit');await page.getByRole('status').filter({hasText:'1 guides found'}).waitFor();
  assert.match(await page.locator('meta[name=robots]').getAttribute('content'),/noindex/);
  await page.goto(base+'/guides/credit-weighted-gpa');const data=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());assert.equal(data['@type'],'Article');
  await page.goto(base+'/tools?q=does-not-exist');await page.getByRole('heading',{name:'No matching tools',exact:true}).waitFor();
  await page.goto(base+'/tools/test-prep/sat-score-calculator');assert.match(page.url(),/digital-sat-score-calculator$/);
  const links=new Set();
  for(const path of ['/tools','/guides','/about','/resources']){
    await page.goto(base+path);
    for(const href of await page.locator('a[href^="/"]').evaluateAll(elements=>elements.map(e=>e.getAttribute('href'))))links.add(href);
  }
  for(const href of links){const response=await page.request.get(base+href);assert.ok(response.status()<400,`${href}: HTTP ${response.status()}`);}
  await page.setViewportSize({width:375,height:812});
  for(const path of ['/tools','/guides','/guides/credit-weighted-gpa','/tools/study/study-time-planner','/tools/admissions/application-checklist']){
    await page.goto(base+path);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,`Overflow: ${path}`);
  }
  if(process.env.PUBLIC_SCREENSHOT_DIRECTORY){await page.screenshot({path:process.env.PUBLIC_SCREENSHOT_DIRECTORY+'/Batch-174-checklist-mobile.png',fullPage:true});await page.goto(base+'/guides/credit-weighted-gpa');await page.screenshot({path:process.env.PUBLIC_SCREENSHOT_DIRECTORY+'/Batch-174-guide-mobile.png',fullPage:true});}
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({studyAllocation:true,download:true,staleResultCleared:true,optionalStorage:true,reloadRecovery:true,corruptStorageHandled:true,clearStorage:true,guideSearch:true,filteredNoindex:true,structuredData:true,legacyRedirect:true,publicLinksChecked:links.size,mobilePagesChecked:5,horizontalOverflow:false,pageErrors:0}));
} finally {if(browser)await browser.close();server.kill();}
