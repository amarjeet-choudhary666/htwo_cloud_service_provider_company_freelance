"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_temp_1 = require("../controllers/adminController.temp");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all admin routes
router.use(authMiddleware_1.authMiddleware);
// Dashboard
router.get('/', adminController_temp_1.adminController.dashboard);
// Form Submissions
router.get('/demo-requests', adminController_temp_1.adminController.getDemoRequests);
router.get('/contact-forms', adminController_temp_1.adminController.getContactForms);
router.get('/get-in-touch', adminController_temp_1.adminController.getInTouchForms);
// Individual submission details
router.get('/submission/:id', adminController_temp_1.adminController.getSubmissionDetails);
router.put('/submission/:id/status', adminController_temp_1.adminController.updateSubmissionStatus);
router.delete('/submission/:id', adminController_temp_1.adminController.deleteSubmission);
// Users Management
router.get('/users', adminController_temp_1.adminController.getUsers);
router.get('/users/:id', adminController_temp_1.adminController.getUserDetails);
router.put('/users/:id', adminController_temp_1.adminController.updateUser);
router.delete('/users/:id', adminController_temp_1.adminController.deleteUser);
// Analytics
router.get('/analytics', adminController_temp_1.adminController.getAnalytics);
router.get('/api/stats', adminController_temp_1.adminController.getStats);
// Settings
router.get('/settings', adminController_temp_1.adminController.getSettings);
router.put('/settings', adminController_temp_1.adminController.updateSettings);
// Export data
router.get('/export/submissions', adminController_temp_1.adminController.exportSubmissions);
router.get('/export/users', adminController_temp_1.adminController.exportUsers);
// Bulk actions
router.post('/bulk/delete-submissions', adminController_temp_1.adminController.bulkDeleteSubmissions);
router.post('/bulk/update-status', adminController_temp_1.adminController.bulkUpdateStatus);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map