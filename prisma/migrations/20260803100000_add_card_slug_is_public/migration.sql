-- Per-card public pages: unique-per-user slug and publish flag.
--
-- The unique index is per (user_id, slug); Postgres treats NULLs as distinct,
-- so unpublished cards (slug NULL) never collide. Slugs for existing cards are
-- generated lazily at first publish/rename, so no backfill is required.

ALTER TABLE "cards" ADD COLUMN "slug" TEXT;
ALTER TABLE "cards" ADD COLUMN "is_public" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "cards_user_id_slug_key" ON "cards"("user_id", "slug");
