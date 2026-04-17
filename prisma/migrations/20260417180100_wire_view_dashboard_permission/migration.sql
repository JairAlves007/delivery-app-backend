-- Ensure the VIEW_DASHBOARD permission row exists (idempotent)
INSERT INTO "permissions" ("name")
VALUES ('VIEW_DASHBOARD')
ON CONFLICT ("name") DO NOTHING;

-- Grant VIEW_DASHBOARD to ADMIN and ESTABLISHMENT_OWNER roles (idempotent)
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r
CROSS JOIN "permissions" p
WHERE p."name" = 'VIEW_DASHBOARD'
  AND r."name" IN ('ADMIN', 'ESTABLISHMENT_OWNER')
ON CONFLICT DO NOTHING;
