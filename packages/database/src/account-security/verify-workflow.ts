import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {parse} from 'dotenv';
import postgres from 'postgres';
import {eq,sql} from 'drizzle-orm';
const directory=path.dirname(fileURLToPath(import.meta.url));
const testUrl=process.env.ACCOUNT_TEST_DATABASE_URL;
if(!testUrl)throw new Error('Set ACCOUNT_TEST_DATABASE_URL to a separate EMPTY disposable PostgreSQL database.');
function identity(value:string){const url=new URL(value);return `${url.hostname}:${url.port||'5432'}${url.pathname}`;}
let appUrl:string|undefined;try{appUrl=parse(await readFile(path.resolve(directory,'../../../../.env.local'))).DATABASE_URL;}catch{}
if([appUrl,process.env.DATABASE_URL].some(value=>value&&identity(value)===identity(testUrl)))throw new Error('Refusing to use the application database.');
const bootstrap=postgres(testUrl,{max:1,prepare:false,onnotice:()=>{}});
let appClient:{end:()=>Promise<void>}|undefined;
let checks=0;
function assert(condition:unknown,label:string):asserts condition{if(!condition)throw new Error(label);checks++;}
async function denied(fn:()=>Promise<unknown>,label:string){let rejected=false;try{await fn();}catch{rejected=true;}assert(rejected,label);}
function first<T>(rows:T[]){const value=rows[0];if(!value)throw new Error('Missing acceptance fixture.');return value;}
try{
 const count=first(await bootstrap`SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema='public'`).count;
 if(count!==0)throw new Error('Test database must be empty.');
 const journal=JSON.parse(await readFile(path.resolve(directory,'../../drizzle/meta/_journal.json'),'utf8')) as {entries:{tag:string}[]};
 await bootstrap.begin(async tx=>{for(const entry of journal.entries){const migration=await readFile(path.resolve(directory,`../../drizzle/${entry.tag}.sql`),'utf8');for(const statement of migration.split('--> statement-breakpoint'))if(statement.trim())await tx.unsafe(statement);}});checks++;
 process.env.DATABASE_URL=testUrl;process.env.EMAIL_TRANSPORT='file';process.env.AUTH_EMAIL_ORIGIN='http://localhost:3020';process.env.AUTH_SECRET='Batch175DisposableOnlySecret012345678901234567890';process.env.EMAIL_OUTBOX_SECRET=process.env.AUTH_SECRET;
 const {db,client}=await import('../client');appClient=client;
 const {users,emailVerificationTokens,passwordResetTokens,accountEmailOutbox,accountRateLimits}=await import('../schema');
 const account=await import('./index');const {openPayload}=await import('./crypto');const {mailSettings}=await import('./mail/config');const {DeliveryError}=await import('./mail/errors');const {hashToken}=await import('@education/auth/tokens');const {verifyPassword}=await import('@education/auth/password');const {takeRateLimit}=await import('./rate-limit');
 const settings=mailSettings();
 const signup={name:'Account Acceptance',email:'account175@example.test',password:'Acceptance175Password!',confirmPassword:'Acceptance175Password!'};
 const created=await account.registerAccount(signup);assert(created.success&&!JSON.stringify(created).includes('token'),'Registration must not expose a raw token');
 await account.registerAccount(signup);assert((await db.select().from(users).where(eq(users.email,signup.email))).length===1,'Duplicate registration must not create another user');
 const user=first(await db.select().from(users).where(eq(users.email,signup.email)));
 const initial=first(await db.select().from(accountEmailOutbox).where(eq(accountEmailOutbox.userId,user.id)));
 assert(initial.encryptedPayload&&!initial.encryptedPayload.includes(signup.email),'Email payload must be encrypted');
 function tokenFrom(payload:string){const mail=openPayload(payload,settings.secret) as {url:string};return new URL(mail.url).hash.slice('#token='.length);}
 const verifyToken=tokenFrom(initial.encryptedPayload!);
 assert(first(await db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.userId,user.id))).tokenHash===hashToken(verifyToken),'Verification table stores only a hash');
 const verification=await Promise.allSettled([account.verifyAccountEmail(verifyToken),account.verifyAccountEmail(verifyToken)]);
 assert(verification.filter(r=>r.status==='fulfilled').length===1,'Concurrent verification must consume once');
 assert(!!first(await db.select().from(users).where(eq(users.id,user.id))).emailVerifiedAt,'Verification updates the account');
 await denied(()=>account.verifyAccountEmail(verifyToken),'Verification replay denied');
 const before=await db.select().from(accountEmailOutbox);await account.requestAccountEmail('reset','unknown175@example.test');assert((await db.select().from(accountEmailOutbox)).length===before.length,'Unknown accounts must not create mail');
 await account.requestAccountEmail('reset',signup.email);
 const resets=await db.select().from(accountEmailOutbox).where(eq(accountEmailOutbox.userId,user.id));const resetRow=first(resets.filter(r=>r.kind==='reset'&&r.status==='pending'));
 const resetToken=tokenFrom(resetRow.encryptedPayload!);
 assert(await account.validateAccountSession(user.id,0),'Initial active session version is valid');
 const newPassword='Replacement175Password!';
 const resetResult=await Promise.allSettled([account.resetAccountPassword({token:resetToken,password:newPassword,confirmPassword:newPassword}),account.resetAccountPassword({token:resetToken,password:newPassword,confirmPassword:newPassword})]);
 assert(resetResult.filter(r=>r.status==='fulfilled').length===1,'Concurrent reset must consume once');
 assert(!await account.validateAccountSession(user.id,0),'Reset revokes previous sessions');
 let updated=first(await db.select().from(users).where(eq(users.id,user.id)));
 assert(updated.authVersion===1&&!!updated.passwordChangedAt,'Reset increments persisted auth version');
 assert(await verifyPassword(updated.passwordHash!,newPassword)&&!await verifyPassword(updated.passwordHash!,signup.password),'Reset replaces the password hash');
 await denied(()=>account.resetAccountPassword({token:resetToken,password:newPassword,confirmPassword:newPassword}),'Reset replay denied');
 const expired='e'.repeat(64);await db.insert(passwordResetTokens).values({userId:user.id,tokenHash:hashToken(expired),expiresAt:new Date(Date.now()-1)});
 await denied(()=>account.resetAccountPassword({token:expired,password:newPassword,confirmPassword:newPassword}),'Expired reset denied');
 await account.requestAccountEmail('reset',signup.email);const previousToken=first(await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.userId,user.id)).orderBy(sql`created_at DESC`));
 await account.requestAccountEmail('reset',signup.email);assert(!!first(await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.id,previousToken.id))).usedAt,'New reset request invalidates older tokens');
 await denied(()=>account.requestAccountEmail('reset',signup.email),'Per-account reset requests are rate limited');
 await denied(()=>account.changeAccountPassword(user.id,1,{currentPassword:'wrong',password:'Changed175Password!',confirmPassword:'Changed175Password!'}),'Wrong current password denied');
 assert(first(await db.select().from(users).where(eq(users.id,user.id))).authVersion===1,'Failed change leaves sessions valid');
 await account.changeAccountPassword(user.id,1,{currentPassword:newPassword,password:'Changed175Password!',confirmPassword:'Changed175Password!'});assert(!await account.validateAccountSession(user.id,1),'Password change revokes all sessions');
 await denied(()=>account.revokeAccountSessions(user.id,2,'wrong'),'Session revocation requires current password');
 await account.revokeAccountSessions(user.id,2,'Changed175Password!');assert(!await account.validateAccountSession(user.id,2),'Explicit revocation invalidates current version');
 const security=await account.getAccountSecurity(user.id);const serialized=JSON.stringify(security);assert(!serialized.includes('passwordHash')&&!serialized.includes('encryptedPayload')&&!serialized.includes('tokenHash'),'Security export omits secrets');
 assert(security.events.some(e=>e.kind==='password_changed')&&security.events.some(e=>e.kind==='sessions_revoked'),'Security history records successful actions');
 await db.update(users).set({isActive:false}).where(eq(users.id,user.id));assert(!await account.validateAccountSession(user.id,3),'Inactive users cannot keep sessions');await denied(()=>account.getAccountSecurity(user.id),'Inactive security data denied');
 await takeRateLimit('atomic-test','subject',settings.secret,1);await denied(()=>takeRateLimit('atomic-test','subject',settings.secret,1),'Persistent request limit enforced');
 const browserEmail='browser175@example.test';await account.registerAccount({name:'Browser Acceptance',email:browserEmail,password:'BrowserOnly175Password!',confirmPassword:'BrowserOnly175Password!'});
 const browserUser=first(await db.select().from(users).where(eq(users.email,browserEmail)));
 const summary=await account.processAccountOutbox(100,settings,async()=>{throw new DeliveryError('HTTP_503',true);});assert(summary.retried>=1,'Transient provider failure schedules retry');
 const pending=first(await db.select().from(accountEmailOutbox).where(eq(accountEmailOutbox.userId,browserUser.id)));assert(pending.status==='pending'&&pending.attempts===1&&pending.availableAt>new Date(),'Retry preserves encrypted payload and defers processing');
 await db.update(accountEmailOutbox).set({availableAt:new Date(0)}).where(eq(accountEmailOutbox.id,pending.id));
 const sent=await account.processAccountOutbox(100,settings,async()=> 'mock-provider');assert(sent.sent>=1,'Worker completes a successful delivery');
 const delivered=first(await db.select().from(accountEmailOutbox).where(eq(accountEmailOutbox.id,pending.id)));assert(delivered.status==='sent'&&delivered.encryptedPayload===null&&delivered.attempts===2,'Sent payload is scrubbed');
 // Restore an unverified browser fixture with a fresh queued verification link.
 await account.requestAccountEmail('verification',browserEmail);
 await db.insert(accountRateLimits).values({key:'f'.repeat(64),count:1,expiresAt:new Date(0)});
 const cleanup=await account.cleanupAccountSecurity();assert(cleanup.rateLimitsRemoved>=1,'Cleanup removes expired abuse counters');
 await denied(()=>db.execute(sql`INSERT INTO account_email_outbox(user_id,kind,status,expires_at) VALUES (${browserUser.id},'reset','invalid',now())`),'Migration enforces email status checks');
 console.log(JSON.stringify({checks,isolatedPostgres:true,allMigrations:true,registration:true,encryptedOutbox:true,verificationReplay:true,concurrentReset:true,passwordChange:true,sessionRevocation:true,rateLimits:true,workerRetry:true,payloadScrubbing:true,applicationDatabaseChanged:false,liveEmailSent:false}));
}finally{if(appClient)await appClient.end();await bootstrap.end();}
