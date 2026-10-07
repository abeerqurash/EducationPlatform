import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "parent",
  "tutor",
  "teacher",
  "school_admin",
  "organization_admin",
  "support_agent",
  "content_editor",
  "seo_manager",
  "marketing_manager",
  "finance",
  "reviewer",
  "admin",
  "super_admin",
]);

export const publicationStatusEnum = pgEnum("publication_status", [
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
]);

export const toolAccessEnum = pgEnum("tool_access", [
  "free",
  "premium",
]);

export const organizationTypeEnum = pgEnum("organization_type", [
  "school",
  "tutoring_company",
  "college",
  "university",
  "test_prep_center",
  "education_company",
  "other",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "invited",
  "active",
  "suspended",
  "removed",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "unverified",
  "pending",
  "verified",
  "rejected",
  "outdated",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "changes_requested",
  "rejected",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "official",
  "government",
  "academic",
  "institution",
  "documentation",
  "research",
  "other",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "restore",
  "publish",
  "unpublish",
  "archive",
  "verify",
  "approve",
  "reject",
  "login",
  "logout",
  "permission_change",
  "other",
]);