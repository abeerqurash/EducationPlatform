import { client } from '../client';
import { seedLearningWorkspacesRBAC } from './learning-workspaces-rbac';
try{await seedLearningWorkspacesRBAC();console.log({roleKeys:['educator_workspace','support_workspace'],userGrantsChanged:false});}catch{console.error('Workspace role seed failed. Check migrations and connectivity.');process.exitCode=1;}finally{await client.end();}
