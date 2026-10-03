import { Injectable, BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import type { CreatePandaDto } from './panda.dto.js';
import { optimizeUpload } from './upload-optimization.js';

@Injectable()
export class PandasService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreatePandaDto, allowUpdate = false) {
    const dob = new Date(`${data.dateOfBirth}T00:00:00Z`);
    if (!Number.isFinite(dob.getTime()) || dob.toISOString().slice(0, 10) !== data.dateOfBirth || dob >= new Date()) {
      throw new BadRequestException('Enter a valid date of birth in the past.');
    }
    const specialities = [...new Set(data.specialities.map(s => s.trim()).filter(Boolean))];
    const languages = [...new Set(data.languages.map(s => s.trim()).filter(Boolean))];
    if (!specialities.length || !languages.length || !data.name.trim() || !data.bio.trim()) {
      throw new BadRequestException('Name, introduction, languages and Pooja specialities are required.');
    }
    const [photoUrl, identityDocument] = await Promise.all([
      optimizeUpload(data.photoUrl, 'photo'), optimizeUpload(data.identityDocument, 'document'),
    ]);
    try {
      return await this.prisma.$transaction(async tx => {
        const user = await tx.user.findUnique({ where: { id: userId }, select: { phone: true, email: true, role: true } });
        if (!user || user.phone !== data.phone) throw new ForbiddenException('Use the phone number verified during login.');
        const existing = await tx.panda.findUnique({ where: { phone: data.phone }, select: { id: true, vendorId: true, email: true } });
        if (existing?.vendorId && !allowUpdate) throw new ConflictException('You are already registered. Open your Panda dashboard.');
        await tx.user.update({ where: { id: userId }, data: { name: data.name.trim(), ...(data.email && { email: data.email }), role: user.role === 'ADMIN' ? 'ADMIN' : 'VENDOR' }, select: { id: true } });
        const profile = {
          bio: data.bio.trim(), languages, specializations: specialities, yearsExperience: data.experience,
          photoUrl, aadhaarDocUrl: identityDocument, selfieUrl: photoUrl,
          dateOfBirth: dob, address: data.address.trim(), identityType: data.identityType,
          identityLastFour: data.identityLastFour, lineageDetails: data.lineageDetails,
          verificationStatus: 'PENDING' as const,
        };
        // KYC includes large images. Only the ID is needed by the remaining writes.
        // Avoid sending each image in both INSERT and UPDATE parameters of an upsert.
        const existingVendor = await tx.vendorProfile.findUnique({ where: { userId }, select: { id: true } });
        const vendor = existingVendor
          ? await tx.vendorProfile.update({ where: { id: existingVendor.id }, data: profile, select: { id: true } })
          : await tx.vendorProfile.create({ data: { userId, ...profile }, select: { id: true } });
        // Specialities become bookable quote requests. No price is invented.
        const existingListings = await tx.listing.findMany({
          where: { vendorId: vendor.id, title: { in: specialities } }, select: { title: true },
        });
        const existingTitles = new Set(existingListings.map(listing => listing.title));
        const missingTitles = specialities.filter(title => !existingTitles.has(title));
        if (missingTitles.length) {
          await tx.listing.createMany({ data: missingTitles.map(title => ({
            vendorId: vendor.id, title, description: `Request ${title} with ${data.name.trim()}. Price to be agreed with the Panda.`,
            category: 'Pooja', price: 0, priceType: 'QUOTE_ONLY', photos: [],
          })) });
        }
        const panda = { vendorId: vendor.id, name: data.name.trim(), phone: user.phone, email: data.email || existing?.email || user.email || null, photoUrl, bio: data.bio.trim(), languages, experience: data.experience, specialities, status: 'REGISTERED' };
        return existing
          ? tx.panda.update({ where: { id: existing.id }, data: panda })
          : tx.panda.create({ data: panda });
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('This phone or email is already registered.');
      throw error;
    }
  }

  async findAll() {
    return this.prisma.panda.findMany({
      where: { OR: [{ vendorId: null }, { vendor: { verificationStatus: { not: 'REJECTED' } } }] },
      include: { vendor: { select: { verificationStatus: true } } }, orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const panda = await this.prisma.panda.findUnique({ where: { id }, include: { vendor: { select: { id: true, verificationStatus: true, lineageDetails: true, listings: { where: { status: 'ACTIVE' } } } } } });
    if (!panda || panda.vendor?.verificationStatus === 'REJECTED') throw new NotFoundException('Panda profile not found.');
    return panda;
  }
}
