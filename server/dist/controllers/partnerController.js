"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPartnerLogo = exports.updatePartnerStatus = exports.deletePartner = exports.updatePartner = exports.getPartnerById = exports.getAllPartners = exports.upload = void 0;
const prisma_1 = require("../lib/prisma");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
const multer_1 = __importDefault(require("multer"));
// Configure multer for memory storage
exports.upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Get all partners
exports.getAllPartners = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const partners = await prisma_1.prisma.partner.findMany({
        where: {
            status: 'approved'
        },
        orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, partners, 'Partners retrieved successfully'));
});
// Get partner by ID
exports.getPartnerById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const partner = await prisma_1.prisma.partner.findUnique({
        where: { id: parseInt(id) }
    });
    if (!partner) {
        throw new apiError_1.ApiError(404, 'Partner not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, partner, 'Partner retrieved successfully'));
});
// Update partner
exports.updatePartner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, website, description, status, partnerType } = req.body;
    const existingPartner = await prisma_1.prisma.partner.findUnique({
        where: { id: parseInt(id) }
    });
    if (!existingPartner) {
        throw new apiError_1.ApiError(404, 'Partner not found');
    }
    let logoUrl = existingPartner.logoUrl;
    // Handle logo upload if new file provided
    if (req.file) {
        // Delete old logo if exists
        if (existingPartner.logoUrl) {
            // Extract public ID from URL (Cloudinary specific)
            const publicId = existingPartner.logoUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
                await (0, cloudinary_1.deleteFromCloudinary)(`partners/${publicId}`);
            }
        }
        logoUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'partners');
    }
    const partner = await prisma_1.prisma.partner.update({
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
    res.status(200).json(new apiResponse_1.ApiResponse(200, partner, 'Partner updated successfully'));
});
// Delete partner
exports.deletePartner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const existingPartner = await prisma_1.prisma.partner.findUnique({
        where: { id: parseInt(id) }
    });
    if (!existingPartner) {
        throw new apiError_1.ApiError(404, 'Partner not found');
    }
    // Delete logo from Cloudinary if exists
    if (existingPartner.logoUrl) {
        const publicId = existingPartner.logoUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
            await (0, cloudinary_1.deleteFromCloudinary)(`partners/${publicId}`);
        }
    }
    await prisma_1.prisma.partner.delete({
        where: { id: parseInt(id) }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Partner deleted successfully'));
});
// Update partner status (approve/reject)
exports.updatePartnerStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
        throw new apiError_1.ApiError(400, 'Invalid status. Must be pending, approved, or rejected');
    }
    const partner = await prisma_1.prisma.partner.update({
        where: { id: parseInt(id) },
        data: { status }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, partner, 'Partner status updated successfully'));
});
// Multer middleware for file upload
exports.uploadPartnerLogo = exports.upload.single('logo');
//# sourceMappingURL=partnerController.js.map