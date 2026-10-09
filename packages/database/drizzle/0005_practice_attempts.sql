-- Batch 164: apply through the project's managed migration process.
-- The application must authenticate the user and calculate results server-side.
CREATE TABLE IF NOT EXISTS "practice_attempts" (
 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
 "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
 "exam" varchar(8) NOT NULL CHECK ("exam" IN ('SAT','ACT')),
 "total" integer NOT NULL CHECK ("total" BETWEEN 1 AND 100),
 "answered" integer NOT NULL CHECK ("answered" BETWEEN 0 AND 100),
 "correct" integer NOT NULL CHECK ("correct" BETWEEN 0 AND 100),
 "incorrect" integer NOT NULL CHECK ("incorrect" BETWEEN 0 AND 100),
 "unanswered" integer NOT NULL CHECK ("unanswered" BETWEEN 0 AND 100),
 "percentage" integer NOT NULL CHECK ("percentage" BETWEEN 0 AND 100),
 "duration_seconds" integer NOT NULL CHECK ("duration_seconds" BETWEEN 0 AND 14400),
 "question_ids" jsonb NOT NULL,
 "answers" jsonb NOT NULL,
 "topic_breakdown" jsonb NOT NULL,
 "created_at" timestamptz DEFAULT now() NOT NULL,
 "updated_at" timestamptz DEFAULT now() NOT NULL,
 CONSTRAINT "practice_attempts_counts_check" CHECK ("correct" + "incorrect" = "answered" AND "answered" + "unanswered" = "total")
);
CREATE INDEX IF NOT EXISTS "practice_attempts_user_created_idx" ON "practice_attempts"("user_id","created_at");
CREATE INDEX IF NOT EXISTS "practice_attempts_user_exam_created_idx" ON "practice_attempts"("user_id","exam","created_at");
