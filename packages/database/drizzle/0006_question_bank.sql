-- Batch 173: additive editorial library and private server-timed sessions.
CREATE TABLE "question_entries" (
 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
 "slug" varchar(100) NOT NULL CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 "created_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "question_entries_slug_uidx" ON "question_entries"("slug");
--> statement-breakpoint
CREATE TABLE "question_revisions" (
 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
 "entry_id" uuid NOT NULL REFERENCES "question_entries"("id") ON DELETE RESTRICT,
 "version" integer NOT NULL CHECK ("version" > 0),
 "status" varchar(20) DEFAULT 'draft' NOT NULL CHECK ("status" IN ('draft','in_review','published','rejected','retired')),
 "content" jsonb NOT NULL CHECK (jsonb_typeof("content") = 'object'),
 "author_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
 "reviewer_user_id" uuid REFERENCES "users"("id") ON DELETE RESTRICT,
 "review_note" text,
 "created_at" timestamptz DEFAULT now() NOT NULL,
 "reviewed_at" timestamptz,
 CONSTRAINT "question_revisions_separate_reviewer" CHECK ("reviewer_user_id" IS NULL OR "reviewer_user_id" <> "author_user_id"),
 CONSTRAINT "question_revisions_review_required" CHECK ("status" NOT IN ('published','rejected','retired') OR ("reviewer_user_id" IS NOT NULL AND "reviewed_at" IS NOT NULL AND length(btrim("review_note")) >= 10))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "question_revisions_version_uidx" ON "question_revisions"("entry_id","version");
--> statement-breakpoint
CREATE UNIQUE INDEX "question_revisions_published_uidx" ON "question_revisions"("entry_id") WHERE "status" = 'published';
--> statement-breakpoint
CREATE INDEX "question_revisions_status_idx" ON "question_revisions"("status","created_at");
--> statement-breakpoint
CREATE FUNCTION "protect_question_revision"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Question revisions are immutable; retire instead'; END IF;
 IF TG_OP = 'INSERT' THEN
  IF NEW.status <> 'draft' OR NEW.reviewer_user_id IS NOT NULL OR NEW.reviewed_at IS NOT NULL THEN RAISE EXCEPTION 'New revisions must start as drafts'; END IF;
  RETURN NEW;
 END IF;
 IF NEW.id IS DISTINCT FROM OLD.id OR NEW.entry_id IS DISTINCT FROM OLD.entry_id OR NEW.version IS DISTINCT FROM OLD.version OR NEW.content IS DISTINCT FROM OLD.content OR NEW.author_user_id IS DISTINCT FROM OLD.author_user_id OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
  RAISE EXCEPTION 'Create a new revision to change question content';
 END IF;
 IF NOT ((OLD.status = 'draft' AND NEW.status = 'in_review') OR (OLD.status = 'in_review' AND NEW.status IN ('published','rejected')) OR (OLD.status = 'published' AND NEW.status = 'retired')) THEN
  RAISE EXCEPTION 'Invalid question revision transition';
 END IF;
 IF OLD.status <> 'in_review' AND (NEW.reviewer_user_id IS DISTINCT FROM OLD.reviewer_user_id OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at OR NEW.review_note IS DISTINCT FROM OLD.review_note) THEN
  RAISE EXCEPTION 'Reviewer evidence must be preserved';
 END IF;
 RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER "question_revision_immutable" BEFORE INSERT OR UPDATE OR DELETE ON "question_revisions" FOR EACH ROW EXECUTE FUNCTION "protect_question_revision"();
--> statement-breakpoint
ALTER TABLE "practice_attempts" ADD COLUMN "question_snapshots" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
CREATE TABLE "question_practice_sessions" (
 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
 "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
 "exam" varchar(8) NOT NULL CHECK ("exam" IN ('SAT','ACT')),
 "revision_ids" jsonb NOT NULL CHECK (jsonb_typeof("revision_ids") = 'array' AND jsonb_array_length("revision_ids") BETWEEN 1 AND 20),
 "draft_answers" jsonb DEFAULT '[]'::jsonb NOT NULL CHECK (jsonb_typeof("draft_answers") = 'array'),
 "created_at" timestamptz DEFAULT now() NOT NULL,
 "expires_at" timestamptz NOT NULL,
 "submitted_attempt_id" uuid REFERENCES "practice_attempts"("id") ON DELETE SET NULL,
 "submitted_at" timestamptz,
 CONSTRAINT "question_sessions_expiry" CHECK ("expires_at" > "created_at"),
 CONSTRAINT "question_sessions_submission" CHECK ("submitted_attempt_id" IS NULL OR "submitted_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE INDEX "question_practice_sessions_user_idx" ON "question_practice_sessions"("user_id","created_at");
