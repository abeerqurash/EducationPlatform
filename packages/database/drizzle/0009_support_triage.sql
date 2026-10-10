ALTER TABLE support_tickets ADD COLUMN priority text NOT NULL DEFAULT 'normal';
ALTER TABLE support_tickets ADD COLUMN assignee_id uuid REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE support_tickets ADD CONSTRAINT support_ticket_priority CHECK(priority IN ('low','normal','high'));
CREATE INDEX support_tickets_updated_idx ON support_tickets(updated_at,id);
CREATE INDEX support_tickets_user_updated_idx ON support_tickets(user_id,updated_at,id);
CREATE INDEX support_tickets_assignee_updated_idx ON support_tickets(assignee_id,updated_at);
