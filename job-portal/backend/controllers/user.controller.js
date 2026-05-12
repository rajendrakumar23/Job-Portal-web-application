import User from '../models/User.js';
import Job from '../models/Job.js';
import { analyzeResume } from "../ai/resumeAnalyzer.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, bio, skills, experience } = req.body;
    const updates = { name, phone, location, bio, experience };
    if (skills) updates.skills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
    if (req.file) updates.avatar = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResume = async (
  req,
  res
) => {

  try {

    const user = await User.findById(
      req.user.id
    );

    user.resume =
      `/uploads/resumes/${req.file.filename}`;

    await user.save();

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;
    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({ success: true, saved: !isSaved, savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const analyzeUserResume = async (
  req,
  res
) => {

  console.log("Resume Analyze API Hit");

  console.log(req.file);

  try {

    const resumePath = req.file.path;

    const analysis = await analyzeResume(
      resumePath
    );

    res.json({
      success: true,
      analysis,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};