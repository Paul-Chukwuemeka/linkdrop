-- Case-insensitive uniqueness for usernames and emails.
--
-- The app already guards writes with insensitive pre-checks; these indexes
-- close the remaining TOCTOU race so "Alice" + "alice" / "a@x.com" + "A@x.com"
-- can never both exist.
--
-- Emails are normalized to lowercase as part of this migration so app lookups
-- (which now use exact match on lowercased values) keep working for legacy rows.
--
-- NOTE: this migration FAILS if existing data already contains case-collisions
-- (e.g. both "Alice" and "alice"). Reconcile those rows before applying. The
-- username index is NOT preceded by an UPDATE because usernames preserve case
-- for display; only emails are force-normalized.
--
-- Pre-flight check (run before `prisma migrate deploy`):
--   SELECT LOWER(email),    count(*) FROM users GROUP BY LOWER(email)    HAVING count(*) > 1;
--   SELECT LOWER(username), count(*) FROM users GROUP BY LOWER(username) HAVING count(*) > 1;
-- See README → Deploying for reconciliation guidance.

UPDATE "users" SET "email" = LOWER("email")
WHERE "email" <> LOWER("email");

CREATE UNIQUE INDEX "users_username_lower_key" ON "users" (LOWER("username"));
CREATE UNIQUE INDEX "users_email_lower_key" ON "users" (LOWER("email"));