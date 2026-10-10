import { changeAccountPassword } from '@education/database/account-security';
import { accountPost, accountSession } from '@/lib/auth/account-http';
export async function POST(request:Request){return accountPost(request,async body=>{const user=await accountSession();return changeAccountPassword(user.id,user.authVersion,body);});}
