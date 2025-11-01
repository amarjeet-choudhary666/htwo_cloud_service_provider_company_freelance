"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// Simple authentication middleware for demo purposes
// In production, use proper JWT authentication or session management
const authMiddleware = (_req, res, next) => {
    // For demo purposes, we'll skip authentication
    // In production, implement proper authentication logic
    const isAuthenticated = true; // Replace with actual auth check
    if (!isAuthenticated) {
        return res.redirect('/admin/login');
    }
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map