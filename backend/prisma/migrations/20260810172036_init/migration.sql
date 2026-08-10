-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "InstrumentStatus" AS ENUM ('AVAILABLE', 'SOLD', 'MADE_TO_ORDER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ES', 'EN');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "refreshTokenHash" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" UUID NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'MarzTone',
    "signature" TEXT NOT NULL DEFAULT 'by Manuel Robles Urquiza',
    "sloganEs" TEXT NOT NULL,
    "sloganEn" TEXT NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "whatsappMessageEs" TEXT NOT NULL,
    "whatsappMessageEn" TEXT NOT NULL,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "spotifyUrl" TEXT,
    "addressEs" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "openingHoursEs" TEXT NOT NULL,
    "openingHoursEn" TEXT NOT NULL,
    "mapEmbedUrl" TEXT,
    "seoTitleEs" TEXT NOT NULL,
    "seoTitleEn" TEXT NOT NULL,
    "seoDescriptionEs" TEXT NOT NULL,
    "seoDescriptionEn" TEXT NOT NULL,
    "ogImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "subtitleEs" TEXT,
    "subtitleEn" TEXT,
    "contentEs" TEXT,
    "contentEn" TEXT,
    "imageUrl" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshop_images" (
    "id" UUID NOT NULL,
    "titleEs" TEXT,
    "titleEn" TEXT,
    "descriptionEs" TEXT,
    "descriptionEn" TEXT,
    "imageUrl" TEXT NOT NULL,
    "altEs" TEXT NOT NULL,
    "altEn" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshop_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument_categories" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrument_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruments" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "materialsEs" TEXT,
    "materialsEn" TEXT,
    "specificationsEs" TEXT,
    "specificationsEn" TEXT,
    "status" "InstrumentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "price" DECIMAL(10,2),
    "currency" TEXT,
    "mainImageUrl" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "whatsappMessageEs" TEXT,
    "whatsappMessageEn" TEXT,
    "categoryId" UUID NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument_images" (
    "id" UUID NOT NULL,
    "instrumentId" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altEs" TEXT NOT NULL,
    "altEn" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instrument_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stageName" TEXT,
    "biographyEs" TEXT NOT NULL,
    "biographyEn" TEXT NOT NULL,
    "instrumentUsedEs" TEXT,
    "instrumentUsedEn" TEXT,
    "imageUrl" TEXT NOT NULL,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "spotifyUrl" TEXT,
    "websiteUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "icon" TEXT,
    "imageUrl" TEXT,
    "whatsappMessageEs" TEXT,
    "whatsappMessageEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" UUID NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerImageUrl" TEXT,
    "relatedWorkEs" TEXT,
    "relatedWorkEn" TEXT,
    "commentEs" TEXT NOT NULL,
    "commentEn" TEXT NOT NULL,
    "artistUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "inquiryType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'ES',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altEs" TEXT,
    "altEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_email_idx" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "page_sections_key_key" ON "page_sections"("key");

-- CreateIndex
CREATE INDEX "page_sections_displayOrder_idx" ON "page_sections"("displayOrder");

-- CreateIndex
CREATE INDEX "workshop_images_displayOrder_idx" ON "workshop_images"("displayOrder");

-- CreateIndex
CREATE INDEX "workshop_images_isPublished_idx" ON "workshop_images"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "instrument_categories_slug_key" ON "instrument_categories"("slug");

-- CreateIndex
CREATE INDEX "instrument_categories_displayOrder_idx" ON "instrument_categories"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "instruments_slug_key" ON "instruments"("slug");

-- CreateIndex
CREATE INDEX "instruments_categoryId_idx" ON "instruments"("categoryId");

-- CreateIndex
CREATE INDEX "instruments_status_idx" ON "instruments"("status");

-- CreateIndex
CREATE INDEX "instruments_isPublished_idx" ON "instruments"("isPublished");

-- CreateIndex
CREATE INDEX "instruments_displayOrder_idx" ON "instruments"("displayOrder");

-- CreateIndex
CREATE INDEX "instruments_deletedAt_idx" ON "instruments"("deletedAt");

-- CreateIndex
CREATE INDEX "instrument_images_instrumentId_idx" ON "instrument_images"("instrumentId");

-- CreateIndex
CREATE INDEX "instrument_images_displayOrder_idx" ON "instrument_images"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "artists_slug_key" ON "artists"("slug");

-- CreateIndex
CREATE INDEX "artists_isPublished_idx" ON "artists"("isPublished");

-- CreateIndex
CREATE INDEX "artists_displayOrder_idx" ON "artists"("displayOrder");

-- CreateIndex
CREATE INDEX "artists_deletedAt_idx" ON "artists"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_isActive_idx" ON "services"("isActive");

-- CreateIndex
CREATE INDEX "services_displayOrder_idx" ON "services"("displayOrder");

-- CreateIndex
CREATE INDEX "testimonials_isPublished_idx" ON "testimonials"("isPublished");

-- CreateIndex
CREATE INDEX "testimonials_displayOrder_idx" ON "testimonials"("displayOrder");

-- CreateIndex
CREATE INDEX "contact_messages_isRead_idx" ON "contact_messages"("isRead");

-- CreateIndex
CREATE INDEX "contact_messages_createdAt_idx" ON "contact_messages"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "media_files_storageKey_key" ON "media_files"("storageKey");

-- CreateIndex
CREATE INDEX "media_files_createdAt_idx" ON "media_files"("createdAt");

-- AddForeignKey
ALTER TABLE "instruments" ADD CONSTRAINT "instruments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "instrument_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instrument_images" ADD CONSTRAINT "instrument_images_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instruments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
