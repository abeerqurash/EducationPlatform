CREATE TABLE "student_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "timezone" varchar(80) DEFAULT 'UTC' NOT NULL,
  "weekly_study_target_minutes" integer DEFAULT 300 NOT NULL,
  "email_study_reminders" boolean DEFAULT false NOT NULL,
  "preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_goals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "title" varchar(160) NOT NULL,
  "description" text,
  "target_date" date,
  "target_minutes" integer,
  "completed_at" date,
  "is_archived" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_activities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "activity_type" varchar(80) NOT NULL,
  "title" varchar(180) NOT NULL,
  "duration_minutes" integer DEFAULT 0 NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "study_goals" ADD CONSTRAINT "study_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "study_activities" ADD CONSTRAINT "study_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "student_profiles_user_uidx" ON "student_profiles" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "study_goals_user_created_idx" ON "study_goals" USING btree ("user_id","created_at");
--> statement-breakpoint
CREATE INDEX "study_goals_user_archived_idx" ON "study_goals" USING btree ("user_id","is_archived");
--> statement-breakpoint
CREATE INDEX "study_activities_user_created_idx" ON "study_activities" USING btree ("user_id","created_at");
--> statement-breakpoint
CREATE INDEX "study_activities_user_type_idx" ON "study_activities" USING btree ("user_id","activity_type");
