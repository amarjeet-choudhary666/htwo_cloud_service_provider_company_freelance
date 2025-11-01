"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes for services
router.get('/services', serviceController_1.getAllServices);
router.get('/services/category/:category', serviceController_1.getServicesByCategory);
router.get('/services/priority/:priority', serviceController_1.getServicesByPriority);
router.get('/services/category/:category/priority/:priority', serviceController_1.getServicesByCategoryAndPriority);
router.get('/services/category-type/:id', serviceController_1.getServicesByCategoryType);
// Admin routes for services (protected by admin authentication)
router.get('/admin/services', authMiddleware_1.authenticateAdmin, serviceController_1.getAllServices);
router.get('/admin/services/:id', authMiddleware_1.authenticateAdmin, serviceController_1.getServiceById);
router.post('/admin/services', authMiddleware_1.authenticateAdmin, serviceController_1.createService);
router.put('/admin/services/:id', authMiddleware_1.authenticateAdmin, serviceController_1.updateService);
router.delete('/admin/services/:id', authMiddleware_1.authenticateAdmin, serviceController_1.deleteService);
exports.default = router;
//# sourceMappingURL=serviceRoutes.js.map