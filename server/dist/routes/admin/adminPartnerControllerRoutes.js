"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminPartnerController_1 = require("../../controllers/admin/adminPartnerController");
const router = (0, express_1.Router)();
// Apply authentication middleware to all admin partner routes
router.use(authMiddleware_1.authenticateAdmin);
// Get all partners with status breakdown (pending, approved, rejected)
router.get('/all-with-status', adminPartnerController_1.adminPartnerController.getAllPartnersWithStatus);
// Get all partners in a single array
router.get('/all', adminPartnerController_1.adminPartnerController.getAllPartners);
exports.default = router;
//# sourceMappingURL=adminPartnerControllerRoutes.js.map