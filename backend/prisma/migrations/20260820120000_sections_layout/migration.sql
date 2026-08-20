-- AlterTable: nombre editable y layout por sección
ALTER TABLE "page_sections" ADD COLUMN     "label" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "layout" TEXT NOT NULL DEFAULT 'imagen-derecha';

-- Etiquetas y layouts iniciales para las secciones existentes
UPDATE "page_sections" SET "label" = 'Portada',        "layout" = 'imagen-fondo'   WHERE "key" = 'hero';
UPDATE "page_sections" SET "label" = 'Sobre nosotros', "layout" = 'imagen-derecha' WHERE "key" = 'about';
UPDATE "page_sections" SET "label" = 'El taller',      "layout" = 'texto-centrado' WHERE "key" = 'workshop';
UPDATE "page_sections" SET "label" = 'Contacto',       "layout" = 'texto-centrado' WHERE "key" = 'contact';

-- Nuevas secciones (colecciones) para poder ordenarlas y darles layout desde el panel
INSERT INTO "page_sections" ("id", "key", "label", "layout", "titleEs", "titleEn", "subtitleEs", "subtitleEn", "contentEs", "contentEn", "isVisible", "displayOrder", "updatedAt")
VALUES
  (gen_random_uuid(), 'instruments', 'Instrumentos', 'texto-centrado', 'Instrumentos', 'Instruments', 'Nuestro trabajo', 'Our work', NULL, NULL, true, 3, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'artists',     'Artistas',     'texto-centrado', 'Artistas',     'Artists',     'Confían en MarzTone', 'They trust MarzTone', NULL, NULL, true, 4, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

-- Reordenar el resto para dejar contacto al final
UPDATE "page_sections" SET "displayOrder" = 5 WHERE "key" = 'contact';
