import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiBookmark, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';
import api from '../../utils/api.js';
import useAuthStore from '../../context/authStore.js';
import toast from 'react-hot-toast';

const TYPE_COLORS = {
  'Full-time': 'badge-green',
  'Part-time': 'badge-orange',
  'Remote': 'badge-blue',
  'Contract': 'badge-gray',
  'Internship': 'badge-orange',
};

const EXP_COLORS = {
  'fresher': 'badge-green',
  '1-2 years': 'badge-blue',
  '3-5 years': 'badge-orange',
  '5+ years': 'badge-red',
};

export default function JobCard({ job, savedIds = [], onSaveToggle }) {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const isSaved = savedIds.includes(job._id);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Negotiable';
    const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${(n / 1000).toFixed(0)}K`;
    if (min && max) return `₹${fmt(min)} – ₹${fmt(max)}`;
    if (min) return `₹${fmt(min)}+`;
    return `Up to ₹${fmt(max)}`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to save jobs'); return; }
    setSaving(true);
    try {
      const { data } = await api.post(`/users/save/${job._id}`);
      onSaveToggle?.(job._id, data.saved);
      toast.success(data.saved ? 'Job saved!' : 'Job removed from saved');
    } catch {
      toast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card p-5 flex flex-col gap-3 hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/50 transition-all duration-200 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
            ) : (
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {job.company[0]}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{job.company}</p>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
              {job.title}
            </h3>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isSaved ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isSaved ? 'Unsave' : 'Save job'}
        >
          <FiBookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={TYPE_COLORS[job.type] || 'badge-gray'}>{job.type}</span>
        <span className={EXP_COLORS[job.experience] || 'badge-gray'}>{job.experience}</span>
        {job.category && <span className="badge-gray">{job.category}</span>}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiDollarSign className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiClock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <span className="text-xs text-slate-400">{job.applicationsCount || 0} applicants</span>
        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:gap-2 transition-all">
          View Job <FiExternalLink className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
