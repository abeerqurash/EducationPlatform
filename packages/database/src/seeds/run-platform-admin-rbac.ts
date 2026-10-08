import { client } from "../client";
import { seedPlatformAdminRBAC } from "./platform-admin-rbac";

try {
  const result = await seedPlatformAdminRBAC();
  console.log("Platform Admin RBAC ready:", result);
} finally {
  await client.end();
}
