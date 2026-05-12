import express from 'express';
import { getDashboardStats, getAllUsers, getAllApplications, toggleUserStatus } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/applications', getAllApplications);
router.put('/users/:id/toggle', toggleUserStatus);

export default router;
