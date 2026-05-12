import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'], required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  experience: { type: String, enum: ['fresher', '1-2 years', '3-5 years', '5+ years'], required: true },
  skills: [{ type: String }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  deadline: { type: Date },
  applicationsCount: { type: Number, default: 0 },
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', description: 'text' });

export default mongoose.model('Job', jobSchema);
