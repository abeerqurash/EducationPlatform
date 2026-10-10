import { resetAccountPassword } from '@education/database/account-security';
import { accountPost } from '@/lib/auth/account-http';
export async function POST(request:Request){return accountPost(request,async body=>{return resetAccountPassword(body);});}
