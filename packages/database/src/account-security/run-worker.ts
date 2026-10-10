import { processAccountOutbox } from './outbox';
import { client } from '../client';
try {console.log(await processAccountOutbox(Number(process.env.EMAIL_WORKER_LIMIT??20)));} finally {await client.end();}
