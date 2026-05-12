import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const resume = req.file ? `/uploads/resumes/${req.file.filename}` : req.user.resume;

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume,
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    await application.populate([
      { path: 'job', select: 'title company location type' },
      { path: 'applicant', select: 'name email' },
    ]);

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salaryMin salaryMax companyLogo')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills experience avatar resume')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('job applicant');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      applicant: req.user._id,
    });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } });
    res.json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
