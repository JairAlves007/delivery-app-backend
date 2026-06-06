-- Add the "Cardápio Digital" menu entry for ESTABLISHMENT_OWNER and ADMIN (idempotent)
INSERT INTO "menus" ("label", "slug", "order", "view_type", "for_audience", "updated_at")
VALUES
  ('Cardápio Digital', 'digital-menu', 10, 'VIEW_DIGITAL_MENU', 'ESTABLISHMENT_OWNER', CURRENT_TIMESTAMP),
  ('Cardápio Digital', 'digital-menu', 10, 'VIEW_DIGITAL_MENU', 'ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT ("slug", "for_audience") DO NOTHING;
