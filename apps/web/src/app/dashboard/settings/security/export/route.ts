import { getAccountSecurity } from '@education/database/account-security';
import { accountSession, accountFailure } from '@/lib/auth/account-http';
export async function GET(){try{const user=await accountSession();const data=await getAccountSecurity(user.id);return Response.json({exportedAt:new Date().toISOString(),scope:'Account status and latest 50 security events',...data},{headers:{'Cache-Control':'no-store','Content-Disposition':'attachment; filename="account-security.json"','X-Content-Type-Options':'nosniff'}});}catch(error){return accountFailure(error);}}
