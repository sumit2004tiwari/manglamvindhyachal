-- Additive migration. Preserve existing Panda and booking records.
CREATE TABLE IF NOT EXISTS "Panda" (
  "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "phone" TEXT NOT NULL,
  "email" TEXT, "photoUrl" TEXT NOT NULL, "bio" TEXT, "languages" TEXT[],
  "experience" INTEGER, "specialities" TEXT[], "status" TEXT NOT NULL DEFAULT 'APPROVED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Panda_phone_key" ON "Panda"("phone");
ALTER TABLE "Panda" ADD COLUMN "vendorId" TEXT;
ALTER TABLE "VendorProfile" ADD COLUMN "dateOfBirth" DATE,
  ADD COLUMN "address" TEXT, ADD COLUMN "identityType" TEXT, ADD COLUMN "identityLastFour" TEXT;
ALTER TABLE "Booking" ADD COLUMN "customerName" TEXT, ADD COLUMN "customerPhone" TEXT,
  ADD COLUMN "location" TEXT, ADD COLUMN "notes" TEXT;

-- Link historical registrations to their verified-phone account. KYC remains pending.
INSERT INTO "User" ("id", "phone", "name", "role", "updatedAt")
SELECT 'panda-user-' || p."id", p."phone", p."name", 'VENDOR', CURRENT_TIMESTAMP FROM "Panda" p
ON CONFLICT ("phone") DO NOTHING;
UPDATE "User" u SET "role" = 'VENDOR' WHERE u."role" = 'USER' AND EXISTS (SELECT 1 FROM "Panda" p WHERE p."phone" = u."phone");
INSERT INTO "VendorProfile" ("id", "userId", "bio", "languages", "yearsExperience", "specializations", "photoUrl", "updatedAt")
SELECT 'panda-vendor-' || p."id", u."id", p."bio", COALESCE(p."languages", ARRAY[]::TEXT[]), p."experience", COALESCE(p."specialities", ARRAY[]::TEXT[]), p."photoUrl", CURRENT_TIMESTAMP
FROM "Panda" p JOIN "User" u ON u."phone" = p."phone" ON CONFLICT ("userId") DO NOTHING;
UPDATE "Panda" p SET "vendorId" = v."id" FROM "VendorProfile" v JOIN "User" u ON u."id" = v."userId" WHERE u."phone" = p."phone";
INSERT INTO "Listing" ("id", "vendorId", "title", "description", "category", "price", "priceType", "photos", "updatedAt")
SELECT 'panda-listing-' || md5(p."id" || s.title), p."vendorId", s.title, 'Price to be agreed with the Panda.', 'Pooja', 0, 'QUOTE_ONLY', ARRAY[]::TEXT[], CURRENT_TIMESTAMP
FROM "Panda" p CROSS JOIN LATERAL unnest(CASE WHEN cardinality(p."specialities") > 0 THEN p."specialities" ELSE ARRAY['Pooja'] END) s(title)
WHERE NOT EXISTS (SELECT 1 FROM "Listing" l WHERE l."vendorId" = p."vendorId" AND l."title" = s.title)
ON CONFLICT ("id") DO NOTHING;
CREATE UNIQUE INDEX "Panda_vendorId_key" ON "Panda"("vendorId");
ALTER TABLE "Panda" ADD CONSTRAINT "Panda_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Booking_vendorId_scheduledDate_idx" ON "Booking"("vendorId", "scheduledDate");
-- Fails without deleting data if historical double bookings need manual resolution.
CREATE UNIQUE INDEX "Booking_vendor_schedule_active_key" ON "Booking"("vendorId", "scheduledDate") WHERE "status" <> 'CANCELLED';
