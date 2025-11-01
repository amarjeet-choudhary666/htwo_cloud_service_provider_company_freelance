"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPartnerController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
const asyncHandler_1 = require("../../utils/asyncHandler");
const prisma_1 = __importDefault(require("../../lib/prisma"));
exports.adminPartnerController = {
    // Get all partners with their statuses (pending, approved, rejected)
    getAllPartnersWithStatus: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        // Get partners grouped by status
        const [pendingPartners, approvedPartners, rejectedPartners] = await Promise.all([
            prisma_1.default.partner.findMany({
                where: { status: 'pending' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    company: true,
                    logoUrl: true,
                    website: true,
                    description: true,
                    status: true,
                    partnerType: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma_1.default.partner.findMany({
                where: { status: 'approved' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    company: true,
                    logoUrl: true,
                    website: true,
                    description: true,
                    status: true,
                    partnerType: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma_1.default.partner.findMany({
                where: { status: 'rejected' },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    company: true,
                    logoUrl: true,
                    website: true,
                    description: true,
                    status: true,
                    partnerType: true,
                    createdAt: true,
                    updatedAt: true
                }
            })
        ]);
        // Get summary counts
        const [pendingCount, approvedCount, rejectedCount, totalCount] = await Promise.all([
            prisma_1.default.partner.count({ where: { status: 'pending' } }),
            prisma_1.default.partner.count({ where: { status: 'approved' } }),
            prisma_1.default.partner.count({ where: { status: 'rejected' } }),
            prisma_1.default.partner.count()
        ]);
        const summary = {
            total: totalCount,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount
        };
        res.status(200).json(new apiResponse_1.ApiResponse(200, {
            summary,
            partners: {
                pending: pendingPartners,
                approved: approvedPartners,
                rejected: rejectedPartners
            }
        }, "All partners retrieved successfully with status breakdown"));
    }),
    // Get all partners in a single array (alternative endpoint)
    getAllPartners: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const partners = await prisma_1.default.partner.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                company: true,
                logoUrl: true,
                website: true,
                description: true,
                status: true,
                partnerType: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.status(200).json(new apiResponse_1.ApiResponse(200, partners, "All partners retrieved successfully"));
    })
};
//# sourceMappingURL=adminPartnerController.js.map