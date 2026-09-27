import { Router } from 'express';
import { createFAQ, getFAQs, getFAQ, updateFAQ, deleteFAQ, searchFAQs } from '../controllers/faqController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/search', searchFAQs);
router.get('/', getFAQs);
router.get('/:id', getFAQ);
router.post('/', protect, authorize('admin', 'creator'), createFAQ);
router.put('/:id', protect, authorize('admin', 'creator'), updateFAQ);
router.delete('/:id', protect, authorize('admin', 'creator'), deleteFAQ);
export default router;
