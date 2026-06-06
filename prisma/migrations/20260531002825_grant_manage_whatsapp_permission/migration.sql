-- Ensure the MANAGE_WHATSAPP permission row exists (idempotent)
INSERT INTO "permissions" ("name")
VALUES ('MANAGE_WHATSAPP')
ON CONFLICT ("name") DO NOTHING;

-- Grant MANAGE_WHATSAPP to the ESTABLISHMENT_OWNER role (idempotent)
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r
CROSS JOIN "permissions" p
WHERE p."name" = 'MANAGE_WHATSAPP'
  AND r."name" = 'ESTABLISHMENT_OWNER'
ON CONFLICT DO NOTHING;
