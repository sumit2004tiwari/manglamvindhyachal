// KYC documents, date of birth, home address and bank details are private.
export const publicVendorSelect = {
  id: true, userId: true, bio: true, lineageDetails: true, languages: true,
  yearsExperience: true, specializations: true, photoUrl: true,
  videoIntroUrl: true, avgRating: true, verificationStatus: true,
  user: { select: { id: true, name: true, phone: true } },
} as const;
