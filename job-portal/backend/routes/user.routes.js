// import express from 'express';
// import { updateProfile, uploadResume, saveJob, getSavedJobs, changePassword } from '../controllers/user.controller.js';
// import { protect } from '../middleware/auth.middleware.js';
// import { upload } from '../middleware/upload.middleware.js';


// const router = express.Router();

// router.put('/profile', protect, upload.single('avatar'), updateProfile);
// router.post('/resume', protect, upload.single('resume'), uploadResume);
// router.post('/save/:jobId', protect, saveJob);
// router.get('/saved-jobs', protect, getSavedJobs);
// router.put('/change-password', protect, changePassword);

// export default router;

import express from "express";

import {
  updateProfile,
  uploadResume,
  saveJob,
  getSavedJobs,
  changePassword,
  analyzeUserResume,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();


// ==============================
// USER PROFILE
// ==============================

// Update profile + avatar upload
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  updateProfile
);


// ==============================
// RESUME
// ==============================

// Upload resume
router.post(
  "/analyze-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

// AI Resume Analyzer
router.post(
  "/analyze-resume",
  protect,
  upload.single("resume"),
  analyzeUserResume
);


// ==============================
// SAVED JOBS
// ==============================

// Save / Unsave Job
router.post(
  "/save/:jobId",
  protect,
  saveJob
);

// Get saved jobs
router.get(
  "/saved-jobs",
  protect,
  getSavedJobs
);


// ==============================
// PASSWORD
// ==============================

// Change password
router.put(
  "/change-password",
  protect,
  changePassword
);

export default router;
