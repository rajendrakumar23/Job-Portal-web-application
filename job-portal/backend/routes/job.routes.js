import express from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob, getFeaturedJobs } from '../controllers/job.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/:id', getJobById);
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

export default router;
