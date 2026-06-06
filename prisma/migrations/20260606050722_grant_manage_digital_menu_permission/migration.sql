-- Ensure the MANAGE_DIGITAL_MENU permission row exists (idempotent)
INSERT INTO "permissions" ("name")
VALUES ('MANAGE_DIGITAL_MENU')
ON CONFLICT ("name") DO NOTHING;

-- Grant MANAGE_DIGITAL_MENU to ESTABLISHMENT_OWNER and ADMIN roles (idempotent)
INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r
CROSS JOIN "permissions" p
WHERE p."name" = 'MANAGE_DIGITAL_MENU'
  AND r."name" IN ('ESTABLISHMENT_OWNER', 'ADMIN')
ON CONFLICT DO NOTHING;
