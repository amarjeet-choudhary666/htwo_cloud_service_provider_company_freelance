import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import multer from 'multer';

// Configure multer for memory storage
export const upload = multer({ storage: multer.memoryStorage() });

// Get all partners
export const getAllPartners = asyncHandler(async (_req: Request, res: Response) => {
  const partners = await prisma.partner.findMany({
    where: {
      status: 'approved'
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json(new ApiResponse(200, partners, 'Partners retrieved successfully'));
});


// Get partner by ID
export const getPartnerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const partner = await prisma.partner.findUnique({
    where: { id: parseInt(id) }
  });

  if (!partner) {
    throw new ApiError(404, 'Partner not found');
  }

  res.status(200).json(new ApiResponse(200, partner, 'Partner retrieved successfully'));
});


// Update partner
export const updatePartner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, company, website, description, status, partnerType } = req.body;

  const existingPartner = await prisma.partner.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingPartner) {
    throw new ApiError(404, 'Partner not found');
  }

  let logoUrl = existingPartner.logoUrl;

  // Handle logo upload if new file provided
  if (req.file) {
    // Delete old logo if exists
    if (existingPartner.logoUrl) {
      // Extract public ID from URL (Cloudinary specific)
      const publicId = existingPartner.logoUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await deleteFromCloudinary(`partners/${publicId}`);
      }
    }
    logoUrl = await uploadToCloudinary(req.file.buffer, 'partners');
  }

  const partner = await prisma.partner.update({
    where: { id: parseInt(id) },
    data: {
      name,
      email,
      phone,
      company,
      website,
      description,
      status,
      partnerType,
      logoUrl
    }
  });

  res.status(200).json(new ApiResponse(200, partner, 'Partner updated successfully'));
});

// Delete partner
export const deletePartner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingPartner = await prisma.partner.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingPartner) {
    throw new ApiError(404, 'Partner not found');
  }

  // Delete logo from Cloudinary if exists
  if (existingPartner.logoUrl) {
    const publicId = existingPartner.logoUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      await deleteFromCloudinary(`partners/${publicId}`);
    }
  }

  await prisma.partner.delete({
    where: { id: parseInt(id) }
  });

  res.status(200).json(new ApiResponse(200, null, 'Partner deleted successfully'));
});

// Update partner status (approve/reject)
export const updatePartnerStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Invalid status. Must be pending, approved, or rejected');
  }

  const partner = await prisma.partner.update({
    where: { id: parseInt(id) },
    data: { status }
  });

  res.status(200).json(new ApiResponse(200, partner, 'Partner status updated successfully'));
});

// Multer middleware for file upload
export const uploadPartnerLogo = upload.single('logo');
