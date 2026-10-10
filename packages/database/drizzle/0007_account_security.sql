ALTER TABLE "users" ADD COLUMN "auth_version" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE TABLE "account_rate_limits" (
 "key" varchar(64) PRIMARY KEY, "count" integer DEFAULT 0 NOT NULL,
 "expires_at" timestamptz NOT NULL,
 CONSTRAINT "account_rate_limits_count_check" CHECK ("count" >= 0)
);
CREATE INDEX "account_rate_limits_expiry_idx" ON "account_rate_limits" ("expires_at");
--> statement-breakpoint
CREATE TABLE "account_security_events" (
 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
 "kind" varchar(50) NOT NULL, "created_at" timestamptz DEFAULT now() NOT NULL,
 CONSTRAINT "account_security_events_kind_check" CHECK ("kind" IN ('registered','verification_requested','email_verified','reset_requested','password_reset','password_changed','sessions_revoked'))
);
CREATE INDEX "account_security_events_user_time_idx" ON "account_security_events" ("user_id", "created_at");
--> statement-breakpoint
CREATE TABLE "account_email_outbox" (
 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
 "kind" varchar(30) NOT NULL, "encrypted_payload" text,
 "status" varchar(20) DEFAULT 'pending' NOT NULL, "attempts" integer DEFAULT 0 NOT NULL,
 "available_at" timestamptz DEFAULT now() NOT NULL, "expires_at" timestamptz NOT NULL,
 "created_at" timestamptz DEFAULT now() NOT NULL, "sent_at" timestamptz,
 "error_code" varchar(50), "provider_id" varchar(200),
 CONSTRAINT "account_email_outbox_status_check" CHECK ("status" IN ('pending','sent','failed','cancelled')),
 CONSTRAINT "account_email_outbox_kind_check" CHECK ("kind" IN ('verification','reset')),
 CONSTRAINT "account_email_outbox_attempts_check" CHECK ("attempts" BETWEEN 0 AND 5)
);
CREATE INDEX "account_email_outbox_pending_idx" ON "account_email_outbox" ("status", "available_at");
CREATE INDEX "account_email_outbox_user_idx" ON "account_email_outbox" ("user_id");
