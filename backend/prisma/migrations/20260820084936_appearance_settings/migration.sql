-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "colorTheme" TEXT NOT NULL DEFAULT 'cobre',
ADD COLUMN     "fontBody" TEXT NOT NULL DEFAULT 'Inter',
ADD COLUMN     "fontHeading" TEXT NOT NULL DEFAULT 'Cormorant Garamond';
