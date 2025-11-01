import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getServicesByPriority,
  getServicesByCategoryAndPriority,
  getServicesByCategoryType
} from '../controllers/serviceController';
import { authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Public routes for services
router.get('/services', getAllServices);
router.get('/services/category/:category', getServicesByCategory);
router.get('/services/priority/:priority', getServicesByPriority);
router.get('/services/category/:category/priority/:priority', getServicesByCategoryAndPriority);
router.get('/services/category-type/:id', getServicesByCategoryType);

// Admin routes for services (protected by admin authentication)
router.get('/admin/services', authenticateAdmin, getAllServices);
router.get('/admin/services/:id', authenticateAdmin, getServiceById);
router.post('/admin/services', authenticateAdmin, createService);
router.put('/admin/services/:id', authenticateAdmin, updateService);
router.delete('/admin/services/:id', authenticateAdmin, deleteService);

export default router;