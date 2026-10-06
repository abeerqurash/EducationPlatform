export type UserRole =
  | "student"
  | "parent"
  | "tutor"
  | "teacher"
  | "school_admin"
  | "organization_admin"
  | "support_agent"
  | "content_editor"
  | "seo_manager"
  | "marketing_manager"
  | "finance"
  | "reviewer"
  | "admin"
  | "super_admin";

export type ToolAccess = "free" | "premium";

export type PublicationStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}