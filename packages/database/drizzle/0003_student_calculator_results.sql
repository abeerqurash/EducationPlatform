CREATE TABLE "student_calculator_results" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "tool_id" uuid,
  "tool_slug" varchar(200) NOT NULL,
  "tool_name" varchar(180) NOT NULL,
  "calculator_version" varchar(50),
  "input_snapshot" jsonb NOT NULL,
  "result_snapshot" jsonb NOT NULL,
  "summary" varchar(300) NOT NULL,
  "is_saved" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_calculator_results"
  ADD CONSTRAINT "student_calculator_results_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
  ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_calculator_results"
  ADD CONSTRAINT "student_calculator_results_tool_id_tools_id_fk"
  FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id")
  ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "student_results_user_created_idx"
  ON "student_calculator_results" USING btree ("user_id","created_at");
--> statement-breakpoint
CREATE INDEX "student_results_user_saved_idx"
  ON "student_calculator_results" USING btree ("user_id","is_saved");
--> statement-breakpoint
CREATE INDEX "student_results_tool_slug_idx"
  ON "student_calculator_results" USING btree ("tool_slug");
