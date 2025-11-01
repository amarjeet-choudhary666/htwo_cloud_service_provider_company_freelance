"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.renderAdminLogin = exports.SigninAdmin = exports.SigninUser = exports.SignupAdmin = exports.SignupUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const authValidation_1 = require("../validation/authValidation");
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../utils/jwt");
exports.SignupUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        // Check if request body exists
        if (!req.body || req.body === undefined) {
            return res.status(400).json({
                success: false,
                message: "Request body is required. Please send data in JSON format.",
                errors: []
            });
        }
        const result = authValidation_1.registerUserSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues
            });
        }
        const { firstname, email, password, address, companyName, gstNumber } = result.data;
        // Check if user already exists
        const existing = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (existing) {
            throw new apiError_1.ApiError(409, "User already exists with this email");
        }
        // Hash password
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await prisma_1.default.user.create({
            data: {
                firstname,
                email,
                password: hashPassword,
                address,
                companyName,
                gstNumber
            },
            select: {
                id: true,
                firstname: true,
                email: true,
                address: true,
                companyName: true,
                gstNumber: true,
                createdAt: true
            }
        });
        return res.status(201).json(new apiResponse_1.ApiResponse(201, user, "User registered successfully"));
    }
    catch (error) {
        console.error("Registration error:", error);
        if (error instanceof apiError_1.ApiError) {
            throw error;
        }
        throw new apiError_1.ApiError(500, "Internal server error during registration");
    }
});
// signupadmin
exports.SignupAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        // Check if request body exists
        if (!req.body || req.body === undefined) {
            return res.status(400).json({
                success: false,
                message: "Request body is required. Please send data in JSON format.",
                errors: []
            });
        }
        const result = authValidation_1.registeradminSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues
            });
        }
        const { email, password } = result.data;
        // Check if user already exists
        const existing = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (existing) {
            throw new apiError_1.ApiError(409, "User already exists with this email");
        }
        // Hash password
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashPassword,
                role: "ADMIN"
            },
            select: {
                id: true,
                firstname: true,
                email: true,
                role: true
            }
        });
        return res.status(201).json(new apiResponse_1.ApiResponse(201, user, "User registered successfully"));
    }
    catch (error) {
        console.error("Registration error:", error);
        if (error instanceof apiError_1.ApiError) {
            throw error;
        }
        throw new apiError_1.ApiError(500, "Internal server error during registration");
    }
});
// Login controller
exports.SigninUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        // Check if request body exists
        if (!req.body || req.body === undefined) {
            return res.status(400).json({
                success: false,
                message: "Request body is required. Please send email and password in JSON format.",
                errors: []
            });
        }
        const result = authValidation_1.loginUserSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues
            });
        }
        const { email, password } = result.data;
        // Find user
        const user = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new apiError_1.ApiError(401, "Invalid credentials");
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new apiError_1.ApiError(401, "Invalid credentials");
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id.toString());
        await prisma_1.default.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken
            }
        });
        const userResponse = {
            id: user.id,
            firstname: user.firstname,
            email: user.email,
            address: user.address,
            companyName: user.companyName,
            gstNumber: user.gstNumber,
        };
        const responseData = {
            user: userResponse,
            accessToken,
            refreshToken
        };
        return res.status(200).json(new apiResponse_1.ApiResponse(200, responseData, "Login successful"));
    }
    catch (error) {
        console.error("Login error:", error);
        if (error instanceof apiError_1.ApiError) {
            throw error;
        }
        throw new apiError_1.ApiError(500, "Internal server error during login");
    }
});
// Admin login
exports.SigninAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        // Check if admin
        if (user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id.toString());
        await prisma_1.default.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken
            }
        });
        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        const userResponse = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: {
                user: userResponse,
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during admin login"
        });
    }
});
// Render admin login page
exports.renderAdminLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    res.render('admin-login', { error: req.query.error || null });
});
// Verify admin authentication
exports.verifyAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        // Check if access token exists in cookies
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: 'No access token found'
            });
        }
        // Verify token
        const decoded = (0, jwt_1.verifyAccessToken)(accessToken);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid access token'
            });
        }
        // Check if user exists and is admin
        const user = await prisma_1.default.user.findUnique({
            where: { id: parseInt(decoded.userId) }
        });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        // Return success if all checks pass
        res.json({
            success: true,
            message: 'Admin verified',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
    catch (error) {
        console.error('Admin verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
});
//# sourceMappingURL=authController.js.map