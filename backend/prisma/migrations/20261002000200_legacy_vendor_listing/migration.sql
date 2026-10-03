-- Include historical vendor-onboarding registrations in the same Panda directory.
-- Preserve their existing KYC status and bookings; never duplicate a phone number.
INSERT INTO "Panda" ("id", "vendorId", "name", "phone", "email", "photoUrl", "bio", "languages", "experience", "specialities", "status", "updatedAt")
SELECT 'vendor-panda-' || v."id", v."id", COALESCE(u."name", 'Panda Ji'), u."phone", u."email",
  COALESCE(v."photoUrl", v."selfieUrl", ''), v."bio", COALESCE(v."languages", ARRAY[]::TEXT[]),
  v."yearsExperience", COALESCE(v."specializations", ARRAY[]::TEXT[]), 'REGISTERED', CURRENT_TIMESTAMP
FROM "VendorProfile" v JOIN "User" u ON u."id" = v."userId"
WHERE NOT EXISTS (SELECT 1 FROM "Panda" p WHERE p."phone" = u."phone" OR p."vendorId" = v."id")
ON CONFLICT ("phone") DO NOTHING;
