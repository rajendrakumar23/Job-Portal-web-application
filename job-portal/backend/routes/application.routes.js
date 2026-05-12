import express from 'express';
import {
  applyJob, getUserApplications, getJobApplications,
  updateApplicationStatus, withdrawApplication
} from '../controllers/application.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/apply', protect, upload.single('resume'), applyJob);
router.get('/my', protect, getUserApplications);
router.get('/job/:jobId', protect, adminOnly, getJobApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);
router.delete('/:id', protect, withdrawApplication);

export default router;
