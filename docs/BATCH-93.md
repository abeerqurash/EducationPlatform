# Batch 93 — Student history management

- Users can remove their own manually recorded study sessions from recent activity. Calculator-generated events cannot be deleted through this action.
- The progress view and dashboard are revalidated after a successful deletion.
- Users can see their 50 most recently archived goals and restore them to the active study plan.
- All mutations validate UUIDs and scope database writes to the authenticated user.
- No migrations or new dependencies.
- Existing seven-day and 30-day analytics retained.
