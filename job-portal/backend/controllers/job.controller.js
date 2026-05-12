import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getJobs = async (req, res) => {
  try {
    const { keyword, location, type, category, experience, salaryMin, salaryMax, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (keyword) query.$text = { $search: keyword };
    if (location) query.location = new RegExp(location, 'i');
    if (type) query.type = type;
    if (category) query.category = new RegExp(category, 'i');
    if (experience) query.experience = experience;
    if (salaryMin) query.salaryMax = { $gte: Number(salaryMin) };
    if (salaryMax) query.salaryMin = { ...(query.salaryMin || {}), $lte: Number(salaryMax) };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    await Application.deleteMany({ job: req.params.id });
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ applicationsCount: -1, createdAt: -1 }).limit(6);
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
