"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminSubmissionController_1 = require("../../controllers/admin/adminSubmissionController");
const adminUserController_1 = require("../../controllers/admin/adminUserController");
const adminCategoryController_1 = require("../../controllers/admin/adminCategoryController");
const adminServiceController_1 = require("../../controllers/admin/adminServiceController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all admin routes
router.use(authMiddleware_1.authenticateAdmin);
// Dashboard
router.get('/', adminServiceController_1.adminServiceController.dashboard);
// Individual submission details
router.get('/submission/:id', adminSubmissionController_1.adminSubmissionController.getSubmissionDetails);
router.put('/submission/:id/status', adminSubmissionController_1.adminSubmissionController.updateSubmissionStatus);
router.delete('/submission/:id', adminSubmissionController_1.adminSubmissionController.deleteSubmission);
// Submission management routes
router.get('/submissions', adminSubmissionController_1.adminSubmissionController.getAllSubmissions); // Get all submissions
router.get('/submissions/demo', adminSubmissionController_1.adminSubmissionController.getDemoRequests);
router.get('/submissions/contact', adminSubmissionController_1.adminSubmissionController.getContactForms);
router.get('/submissions/get-in-touch', adminSubmissionController_1.adminSubmissionController.getInTouchForms);
// Users Management
router.get('/users', adminUserController_1.adminUserController.getUsers);
router.get('/users/:id', adminUserController_1.adminUserController.getUserDetails);
router.put('/users/:id', adminUserController_1.adminUserController.updateUser);
router.delete('/users/:id', adminUserController_1.adminUserController.deleteUser);
// Analytics
router.get('/analytics', adminServiceController_1.adminServiceController.getAnalytics);
router.get('/api/stats', adminServiceController_1.adminServiceController.getStats);
// Settings
router.get('/settings', adminServiceController_1.adminServiceController.getSettings);
router.put('/settings', adminServiceController_1.adminServiceController.updateSettings);
// Export data
router.get('/export/submissions', adminSubmissionController_1.adminSubmissionController.exportSubmissions);
router.get('/export/users', adminUserController_1.adminUserController.exportUsers);
// Bulk actions
router.post('/bulk/delete-submissions', adminSubmissionController_1.adminSubmissionController.bulkDeleteSubmissions);
router.post('/bulk/update-status', adminSubmissionController_1.adminSubmissionController.bulkUpdateStatus);
// Categories Management
router.get('/categories', adminCategoryController_1.adminCategoryController.getCategories);
router.post('/categories', adminCategoryController_1.adminCategoryController.createCategory);
router.put('/categories/:id', adminCategoryController_1.adminCategoryController.updateCategory);
router.delete('/categories/:id', adminCategoryController_1.adminCategoryController.deleteCategory);
// Category Types Management
router.get('/categories/:categoryId/types', adminCategoryController_1.adminCategoryController.getCategoryTypes);
router.post('/categories/:categoryId/types', adminCategoryController_1.adminCategoryController.createCategoryType);
router.put('/category-types/:id', adminCategoryController_1.adminCategoryController.updateCategoryType);
router.delete('/category-types/:id', adminCategoryController_1.adminCategoryController.deleteCategoryType);
// Partners Management - These will be handled by adminPartnerRoutes.ts
// Services by category type
router.get('/services/category-type/:id', adminServiceController_1.adminServiceController.getServicesByCategoryType);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map