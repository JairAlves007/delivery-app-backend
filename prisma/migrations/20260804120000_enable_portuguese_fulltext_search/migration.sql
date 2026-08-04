-- Full-text search em portugues com remocao de acentos
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Configuracao de busca: stemmer portugues + dicionario unaccent.
-- Usar o dicionario (e nao a funcao unaccent, que e STABLE) mantem
-- to_tsvector(regconfig, text) IMMUTABLE e portanto indexavel.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_ts_config c
    JOIN pg_namespace n ON n.oid = c.cfgnamespace
    WHERE c.cfgname = 'pt_unaccent'
      AND n.nspname = 'public'
  ) THEN
    CREATE TEXT SEARCH CONFIGURATION public.pt_unaccent (COPY = pg_catalog.portuguese);

    ALTER TEXT SEARCH CONFIGURATION public.pt_unaccent
      ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part
      WITH public.unaccent, portuguese_stem;
  END IF;
END
$$;

-- Indices invertidos (GIN). A expressao precisa ser identica a usada no WHERE,
-- incluindo ordem dos campos, coalesce e pesos.
CREATE INDEX IF NOT EXISTS search_products_idx
  ON products
  USING GIN ((
    setweight(to_tsvector('public.pt_unaccent', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('public.pt_unaccent', coalesce(description, '')), 'B')
  ));

CREATE INDEX IF NOT EXISTS search_establishments_idx
  ON establishments
  USING GIN ((
    setweight(to_tsvector('public.pt_unaccent', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('public.pt_unaccent', coalesce(description, '')), 'B')
  ));

-- Trigramas para o fallback de erro de digitacao no hub
CREATE INDEX IF NOT EXISTS idx_establishments_name_trgm
  ON establishments
  USING GIN (f_unaccent(name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_establishments_description_trgm
  ON establishments
  USING GIN (f_unaccent(description) gin_trgm_ops);
