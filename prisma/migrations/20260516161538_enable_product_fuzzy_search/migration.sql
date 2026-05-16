-- Enable fuzzy/accent-insensitive search for products
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Immutable wrapper required to use unaccent inside expression indexes
CREATE OR REPLACE FUNCTION f_unaccent(text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  PARALLEL SAFE
  STRICT
AS $$
  SELECT public.unaccent('public.unaccent'::regdictionary, $1)
$$;

-- Trigram GIN indexes on accent-stripped product name and description
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON products
  USING GIN (f_unaccent(name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_products_description_trgm
  ON products
  USING GIN (f_unaccent(description) gin_trgm_ops);
