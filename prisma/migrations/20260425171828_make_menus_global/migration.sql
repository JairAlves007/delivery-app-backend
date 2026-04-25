-- Reattach submenus from duplicate menus to the canonical (lowest id) per (slug, for_role)
WITH canonical AS (
  SELECT slug, for_role, MIN(id) AS canonical_id
  FROM "menus"
  GROUP BY slug, for_role
)
UPDATE "submenus" s
SET "menu_id" = c.canonical_id
FROM "menus" m
JOIN canonical c ON c.slug = m.slug AND c.for_role = m.for_role
WHERE s."menu_id" = m.id AND m.id <> c.canonical_id;

-- Drop duplicate submenus (keep one per (menu_id, slug))
DELETE FROM "submenus" s
USING "submenus" s2
WHERE s."menu_id" = s2."menu_id" AND s.slug = s2.slug AND s.id > s2.id;

-- Drop duplicate menus
DELETE FROM "menus" m
USING "menus" m2
WHERE m.slug = m2.slug AND m.for_role = m2.for_role AND m.id > m2.id;

-- Drop FK and old constraints/indexes
ALTER TABLE "menus" DROP CONSTRAINT IF EXISTS "menus_establishment_id_fkey";
ALTER TABLE "menus" DROP CONSTRAINT IF EXISTS "menus_establishment_id_slug_for_role_key";
DROP INDEX IF EXISTS "idx_menus_establishment_id";

-- Drop column
ALTER TABLE "menus" DROP COLUMN "establishment_id";

-- New unique constraint
ALTER TABLE "menus" ADD CONSTRAINT "menus_slug_for_role_key" UNIQUE ("slug", "for_role");
