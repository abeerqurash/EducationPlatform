CREATE TABLE learning_classrooms (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 owner_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT, title text NOT NULL CHECK(length(title) BETWEEN 3 AND 160),
 created_at timestamptz NOT NULL DEFAULT now(), archived_at timestamptz
);
CREATE INDEX learning_classrooms_owner_idx ON learning_classrooms(owner_id);
--> statement-breakpoint
CREATE TABLE learning_classroom_members (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), classroom_id uuid NOT NULL REFERENCES learning_classrooms(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX learning_members_class_user ON learning_classroom_members(classroom_id,user_id);
CREATE INDEX learning_members_user ON learning_classroom_members(user_id);
--> statement-breakpoint
CREATE TABLE learning_invites (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),kind text NOT NULL, creator_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 classroom_id uuid REFERENCES learning_classrooms(id) ON DELETE CASCADE,email text NOT NULL,token_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),expires_at timestamptz NOT NULL,used_at timestamptz,revoked_at timestamptz,
 CONSTRAINT learning_invite_scope CHECK((kind='parent' AND classroom_id IS NULL) OR (kind='classroom' AND classroom_id IS NOT NULL))
);
CREATE UNIQUE INDEX learning_invites_hash ON learning_invites(token_hash);
CREATE INDEX learning_invites_creator ON learning_invites(creator_id);
--> statement-breakpoint
CREATE TABLE learning_parent_links (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT learning_parent_distinct CHECK(student_id<>parent_id)
);
CREATE UNIQUE INDEX learning_parent_pair ON learning_parent_links(student_id,parent_id);
CREATE INDEX learning_parent_recipient ON learning_parent_links(parent_id);
--> statement-breakpoint
CREATE TABLE learning_assignments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),classroom_id uuid NOT NULL REFERENCES learning_classrooms(id) ON DELETE CASCADE,
 title text NOT NULL,exam text NOT NULL CHECK(exam IN ('SAT','ACT')),revision_ids jsonb NOT NULL,
 due_at timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),closed_at timestamptz,
 CONSTRAINT learning_assignment_questions CHECK(jsonb_typeof(revision_ids)='array' AND jsonb_array_length(revision_ids) BETWEEN 1 AND 20)
);
CREATE INDEX learning_assignments_class ON learning_assignments(classroom_id);
--> statement-breakpoint
CREATE TABLE learning_assignment_work (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),assignment_id uuid NOT NULL REFERENCES learning_assignments(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,started_at timestamptz NOT NULL DEFAULT now(),draft_answers jsonb NOT NULL DEFAULT '[]',
 submitted_at timestamptz,attempt_id uuid REFERENCES practice_attempts(id) ON DELETE SET NULL,percentage integer,
 CONSTRAINT learning_work_score CHECK(percentage IS NULL OR (submitted_at IS NOT NULL AND percentage BETWEEN 0 AND 100))
);
CREATE UNIQUE INDEX learning_work_assignment_user ON learning_assignment_work(assignment_id,user_id);
--> statement-breakpoint
CREATE TABLE support_tickets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,subject text NOT NULL,
 category text NOT NULL CHECK(category IN ('technical','account','content','accessibility')),status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','replied','closed')),
 created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX support_tickets_user ON support_tickets(user_id,created_at);
--> statement-breakpoint
CREATE TABLE support_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
 author_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,body text NOT NULL CHECK(length(body) BETWEEN 10 AND 4000),created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX support_messages_ticket ON support_messages(ticket_id,created_at);
