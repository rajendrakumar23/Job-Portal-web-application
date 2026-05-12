import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiUsers, FiCalendar,
  FiBookmark, FiArrowLeft, FiCheckCircle, FiSend, FiUpload
} from 'react-icons/fi';
import api from '../utils/api.js';
import useAuthStore from '../context/authStore.js';
import { PageLoader } from '../components/common/Spinner.jsx';
import Modal from '../components/common/Modal.jsx';
import toast from 'react-hot-toast';

const TYPE_COLORS = {
  'Full-time': 'badge-green', 'Part-time': 'badge-orange', 'Remote': 'badge-blue',
  'Contract': 'badge-gray', 'Internship': 'badge-orange',
};

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (user) {
      api.get('/applications/my').then(({ data }) => {
        const isApplied = data.applications.some(a => a.job?._id === id);
        setApplied(isApplied);
      }).catch(() => {});
      api.get('/users/saved-jobs').then(({ data }) => {
        setSaved(data.savedJobs.some(j => j._id === id));
      }).catch(() => {});
    }
  }, [user, id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);
      if (resumeFile) formData.append('resume', resumeFile);
      await api.post('/applications/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setApplied(true);
      setShowModal(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.post(`/users/save/${id}`);
      setSaved(data.saved);
      toast.success(data.saved ? 'Job saved!' : 'Job unsaved');
    } catch {
      toast.error('Failed to save job');
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Negotiable';
    const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${(n / 1000).toFixed(0)}K`;
    if (min && max) return `₹${fmt(min)} – ₹${fmt(max)} / year`;
    if (min) return `₹${fmt(min)}+ / year`;
    return `Up to ₹${fmt(max)} / year`;
  };

  if (loading) return <PageLoader />;
  if (!job) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost mb-6 text-sm"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl font-bold text-primary-600">{job.company[0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {job.title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{job.company}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={TYPE_COLORS[job.type] || 'badge-gray'}>{job.type}</span>
                  <span className="badge-gray capitalize">{job.experience}</span>
                  {job.category && <span className="badge-blue">{job.category}</span>}
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              {[
                { icon: FiMapPin, label: 'Location', value: job.location },
                { icon: FiDollarSign, label: 'Salary', value: formatSalary(job.salaryMin, job.salaryMax) },
                { icon: FiUsers, label: 'Applicants', value: `${job.applicationsCount || 0}` },
                { icon: FiCalendar, label: 'Posted', value: new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{label}</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                    <span className="truncate">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Job Description
            </h2>
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Requirements
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <FiCheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Responsibilities
              </h2>
              <ul className="space-y-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-20">
            <div className="space-y-3 mb-5">
              {applied ? (
                <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                  <FiCheckCircle className="w-5 h-5" /> Applied Successfully
                </div>
              ) : (
                <button
                  onClick={() => user ? setShowModal(true) : navigate('/login')}
                  className="btn-primary w-full justify-center py-3"
                >
                  <FiSend className="w-4 h-4" /> Apply Now
                </button>
              )}
              <button
                onClick={handleSave}
                className={`w-full btn-secondary justify-center py-3 ${saved ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400' : ''}`}
              >
                <FiBookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save Job'}
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <FiBriefcase className="w-4 h-4 text-primary-500" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <FiMapPin className="w-4 h-4 text-primary-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <FiDollarSign className="w-4 h-4 text-primary-500" />
                <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
              </div>
              {job.deadline && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FiCalendar className="w-4 h-4 text-primary-500" />
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* About Company */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>About the Company</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">{job.company[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{job.company}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{job.category}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Posted by {job.postedBy?.name}</p>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for this Job" size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Cover Letter</label>
            <textarea
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit for this role..."
              className="input resize-none"
            />
          </div>
          <div>
            <label className="label">Resume (optional — uses your profile resume if not provided)</label>
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors">
              <FiUpload className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {resumeFile ? resumeFile.name : 'Upload Resume'}
                </p>
                <p className="text-xs text-slate-400">PDF, DOC, DOCX (max 5MB)</p>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleApply} disabled={applying} className="btn-primary flex-1 justify-center">
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
