import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, activeJobs, recentJobs, recentApplications] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Job.find().sort({ createdAt: -1 }).limit(5).select('title company location type createdAt applicationsCount'),
      Application.find().sort({ createdAt: -1 }).limit(5)
        .populate('job', 'title company')
        .populate('applicant', 'name email'),
    ]);

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalJobs, totalApplications, activeJobs },
      recentJobs,
      recentApplications,
      applicationsByStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments({ role: 'user' });
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('job', 'title company location')
      .populate('applicant', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, applications, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
