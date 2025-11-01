"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdminPage = exports.authenticateAdmin = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../lib/prisma");
const apiError_1 = require("../utils/apiError");
const authenticateAdmin = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.accessToken;
        if (!token) {
            throw new apiError_1.ApiError(401, 'Access token not found. Please login as admin.');
        }
        // Verify token
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (!decoded || !decoded.userId) {
            throw new apiError_1.ApiError(401, 'Invalid access token');
        }
        // Get user from database
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: parseInt(decoded.userId) }
        });
        if (!user) {
            throw new apiError_1.ApiError(401, 'User not found');
        }
        // Check if user has ADMIN role
        if (user.role !== 'ADMIN') {
            throw new apiError_1.ApiError(403, 'Access denied. Admin privileges required.');
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof apiError_1.ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};
exports.authenticateAdmin = authenticateAdmin;
const authenticateAdminPage = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.accessToken;
        if (!token) {
            return res.redirect('/api/v1/users/admin/login?error=Please login as admin first');
        }
        // Verify token
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (!decoded || !decoded.userId) {
            return res.redirect('/api/v1/users/admin/login?error=Invalid session. Please login again');
        }
        // Get user from database
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: parseInt(decoded.userId) }
        });
        if (!user) {
            return res.redirect('/api/v1/users/admin/login?error=User not found. Please login again');
        }
        // Check if user has ADMIN role
        if (user.role !== 'ADMIN') {
            return res.redirect('/api/v1/users/admin/login?error=Access denied. Admin privileges required');
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Page auth middleware error:', error);
        return res.redirect('/api/v1/users/admin/login?error=Authentication failed. Please login again');
    }
};
exports.authenticateAdminPage = authenticateAdminPage;
//# sourceMappingURL=authMiddleware.js.map