import { sql } from 'drizzle-orm';
import { db,client } from '../client';
try{
 const tables=['learning_classrooms','learning_classroom_members','learning_invites','learning_parent_links','learning_assignments','learning_assignment_work','support_tickets','support_messages'];
 const rows=await db.execute<{table_name:string}>(sql`select table_name from information_schema.tables where table_schema='public' and table_name in (${sql.join(tables.map(name=>sql`${name}`),sql`,`)})`);
 const installed=new Set(rows.map(row=>row.table_name));const missingTables=tables.filter(table=>!installed.has(table));
 const columns=await db.execute<{column_name:string}>(sql`select column_name from information_schema.columns where table_schema='public' and table_name='support_tickets' and column_name in ('priority','assignee_id')`);
 const present=new Set(columns.map(row=>row.column_name));const missingColumns=['priority','assignee_id'].filter(column=>!present.has(column));
 const migrationInstalled=missingTables.length===0&&missingColumns.length===0;
 console.log({migrationInstalled,missingTables,missingColumns,paymentsEnabled:false});if(!migrationInstalled)process.exitCode=1;
}catch{console.error('Workspace doctor could not connect.');process.exitCode=1;}finally{await client.end();}
