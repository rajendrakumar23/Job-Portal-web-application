import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending',
  },
  coverLetter: { type: String, default: '' },
  resume: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
