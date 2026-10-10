import { accountSecurityEvents } from '../schema/account-security';
import type { AccountTransaction } from './transaction';
import type { SecurityEventKind } from './contract';
export function recordSecurityEvent(tx:AccountTransaction,userId:string,kind:SecurityEventKind){return tx.insert(accountSecurityEvents).values({userId,kind});}
