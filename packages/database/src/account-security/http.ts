import { AccountError } from './contract';
/** Bound streamed request bodies independently of caller-supplied Content-Length. */
export async function readAccountBody(request:Request,allowedOrigins:readonly string[]){
 const origin=request.headers.get('origin');
 if(!origin||!allowedOrigins.includes(origin))throw new AccountError('INVALID_INPUT');
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new AccountError('INVALID_INPUT');
 const reader=request.body?.getReader();if(!reader)throw new AccountError('INVALID_INPUT');
 let size=0;const chunks:Uint8Array[]=[];
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();throw new AccountError('INVALID_INPUT');}chunks.push(value);}
 let value:unknown;try{value=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new AccountError('INVALID_INPUT');}
 if(!value||typeof value!=='object'||Array.isArray(value))throw new AccountError('INVALID_INPUT');
 return value as Record<string,unknown>;
}
