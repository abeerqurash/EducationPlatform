import { cleanupAccountSecurity } from './cleanup';
import { client } from '../client';
try {console.log(await cleanupAccountSecurity());} finally {await client.end();}
