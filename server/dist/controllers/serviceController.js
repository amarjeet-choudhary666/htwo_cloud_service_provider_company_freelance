"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServicesByCategoryAndPriority = exports.getServicesByPriority = exports.getServicesByCategoryType = exports.getServicesByCategory = exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getAllServices = void 0;
const prisma_1 = require("../lib/prisma");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
// Get all services
exports.getAllServices = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const services = await prisma_1.prisma.service.findMany({
        include: {
            category: true,
            categoryType: true
        },
        orderBy: { priority: 'asc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, services, 'Services retrieved successfully'));
});
// Get service by ID
exports.getServiceById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const service = await prisma_1.prisma.service.findUnique({
        where: { id: parseInt(id) },
        include: {
            category: true,
            categoryType: true
        }
    });
    if (!service) {
        throw new apiError_1.ApiError(404, 'Service not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, service, 'Service retrieved successfully'));
});
// Create new service
exports.createService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, categoryId, categoryTypeId, description, monthlyPrice, yearlyPrice, imageUrl, features, status, priority, ram, storage } = req.body;
    const service = await prisma_1.prisma.service.create({
        data: {
            name,
            categoryId: categoryId ? parseInt(categoryId) : null,
            categoryTypeId: categoryTypeId ? parseInt(categoryTypeId) : null,
            description,
            monthlyPrice: monthlyPrice !== undefined && monthlyPrice !== '' ? parseFloat(monthlyPrice) : null,
            yearlyPrice: yearlyPrice !== undefined && yearlyPrice !== '' ? parseFloat(yearlyPrice) : null,
            imageUrl,
            features,
            status: status || 'active',
            priority: priority || 'LOW',
            ram: ram !== undefined && ram !== '' ? ram : "",
            storage,
            ownerId: 1 // Assuming admin user ID, you might want to get this from auth
        }
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, service, 'Service created successfully'));
});
// Update service
exports.updateService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, categoryId, categoryTypeId, description, monthlyPrice, yearlyPrice, imageUrl, features, status, priority, ram, storage } = req.body;
    const service = await prisma_1.prisma.service.update({
        where: { id: parseInt(id) },
        data: {
            name,
            categoryId: categoryId ? parseInt(categoryId) : null,
            categoryTypeId: categoryTypeId ? parseInt(categoryTypeId) : null,
            description,
            monthlyPrice: monthlyPrice !== undefined && monthlyPrice !== '' ? parseFloat(monthlyPrice) : null,
            yearlyPrice: yearlyPrice !== undefined && yearlyPrice !== '' ? parseFloat(yearlyPrice) : null,
            imageUrl,
            features,
            status,
            priority,
            ram: ram !== undefined && ram !== '' ? ram : "",
            storage
        }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, service, 'Service updated successfully'));
});
// Delete service
exports.deleteService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await prisma_1.prisma.service.delete({
        where: { id: parseInt(id) }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Service deleted successfully'));
});
// Get services by category
exports.getServicesByCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { category } = req.params;
    const services = await prisma_1.prisma.service.findMany({
        where: {
            category: {
                name: {
                    equals: category,
                    mode: 'insensitive'
                }
            },
            status: 'active'
        },
        include: {
            category: true,
            categoryType: true
        },
        orderBy: { priority: 'asc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, services, 'Services retrieved successfully'));
});
// Get services by category type
exports.getServicesByCategoryType = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const services = await prisma_1.prisma.service.findMany({
        where: {
            categoryTypeId: parseInt(id),
            status: 'active'
        },
        include: {
            category: true,
            categoryType: true
        },
        orderBy: { priority: 'asc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, services, 'Services retrieved successfully'));
});
// Get services by priority
exports.getServicesByPriority = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { priority } = req.params;
    const priorityEnum = priority.toUpperCase();
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(priorityEnum)) {
        throw new apiError_1.ApiError(400, 'Invalid priority value. Must be LOW, MEDIUM, or HIGH');
    }
    const services = await prisma_1.prisma.service.findMany({
        where: {
            priority: priorityEnum,
            status: 'active'
        },
        include: {
            category: true,
            categoryType: true
        },
        orderBy: { priority: 'asc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, services, 'Services retrieved successfully'));
});
// Get services by category and priority
exports.getServicesByCategoryAndPriority = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { category, priority } = req.params;
    const priorityEnum = priority.toUpperCase();
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(priorityEnum)) {
        throw new apiError_1.ApiError(400, 'Invalid priority value. Must be LOW, MEDIUM, or HIGH');
    }
    const services = await prisma_1.prisma.service.findMany({
        where: {
            category: {
                name: {
                    equals: category,
                    mode: 'insensitive'
                }
            },
            priority: priorityEnum,
            status: 'active'
        },
        include: {
            category: true,
            categoryType: true
        },
        orderBy: { priority: 'asc' }
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, services, 'Services retrieved successfully'));
});
//# sourceMappingURL=serviceController.js.map