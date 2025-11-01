"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partnerController_1 = require("../controllers/partnerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/partners', partnerController_1.getAllPartners);
router.get('/partners/:id', partnerController_1.getPartnerById);
// Admin routes for partners (protected by admin authentication)
router.get('/admin/partners', authMiddleware_1.authenticateAdmin, partnerController_1.getAllPartners);
router.put('/admin/partners/:id', authMiddleware_1.authenticateAdmin, partnerController_1.uploadPartnerLogo, partnerController_1.updatePartner);
router.delete('/admin/partners/:id', authMiddleware_1.authenticateAdmin, partnerController_1.deletePartner);
router.patch('/admin/partners/:id/status', authMiddleware_1.authenticateAdmin, partnerController_1.updatePartnerStatus);
exports.default = router;
//# sourceMappingURL=partnerRoutes.js.map