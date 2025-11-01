"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// User registration route
router.post('/register', authController_1.SignupUser);
router.post("/admin/register", authController_1.SignupAdmin);
// User login route
router.post('/login', authController_1.SigninUser);
// Admin login routes
router.get('/admin/login', authController_1.renderAdminLogin);
router.post('/admin/login', authController_1.SigninAdmin);
router.get('/admin/verify', authController_1.verifyAdmin);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map