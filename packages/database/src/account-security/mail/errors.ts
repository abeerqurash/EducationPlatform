export class DeliveryError extends Error {constructor(public code:string,public retryable:boolean){super(code);}}
