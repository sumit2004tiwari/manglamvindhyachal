import type { BookableListing } from '@/components/BookingForm';

export interface PandaProfile {
  id: string; vendorId?: string | null; name: string; phone: string; email?: string | null;
  photoUrl: string; bio?: string | null; languages: string[]; specialities: string[];
  experience?: number | null;
  vendor?: { id?: string; verificationStatus: string; lineageDetails?: string | null; listings: BookableListing[] } | null;
}
