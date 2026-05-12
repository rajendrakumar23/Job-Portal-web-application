import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiUsers, FiFileText, FiTrendingUp,
  FiArrowRight, FiCheckCircle, FiClock, FiAlertCircle
} from 'react-icons/fi';
import api from '../utils/api.js';
import { PageLoader } from '../components/common/Spinner.jsx';

const STATUS_CONFIG = {
  pending:     { color: 'badge-gray',   label: 'Pending' },
  reviewing:   { color: 'badge-blue',   label: 'Reviewing' },
  shortlisted: { color: 'badge-orange', label: 'Shortlisted' },
  accepted:    { color: 'badge-green',  label: 'Accepted' },
  rejected:    { color: 'badge-red',    label: 'Rejected' },
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data: res }) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { stats, recentJobs, recentApplications, applicationsByStatus } = data;

  const STAT_CARDS = [
    { label: 'Total Jobs', value: stats.totalJobs, icon: FiBriefcase, color: 'bg-primary-50 dark:bg-primary-900/20', iconColor: 'text-primary-600 dark:text-primary-400', link: '/admin/jobs' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: FiTrendingUp, color: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400', link: '/admin/jobs' },
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400', link: '/admin/users' },
    { label: 'Applications', value: stats.totalApplications, icon: FiFileText, color: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-600 dark:text-orange-400', link: '/admin/applications' },
  ];

  const statusMap = {};
  applicationsByStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of your job portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, iconColor, link }) => (
          <Link key={label} to={link} className="card p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <FiArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Applications by Status */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Applications by Status
          </h3>
          <div className="space-y-3">
            {['pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'].map(status => {
              const count = statusMap[status] || 0;
              const total = stats.totalApplications || 1;
              const pct = Math.round((count / total) * 100);
              const s = STATUS_CONFIG[status];
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">{s.label}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${{
                        pending: 'bg-slate-400',
                        reviewing: 'bg-blue-500',
                        shortlisted: 'bg-orange-500',
                        accepted: 'bg-emerald-500',
                        rejected: 'bg-red-500',
                      }[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Recent Jobs</h3>
            <Link to="/admin/jobs" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map(job => (
              <div key={job._id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{job.title}</p>
                  <p className="text-xs text-slate-400">{job.company}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 text-xs text-slate-500">
                  <FiUsers className="w-3.5 h-3.5" />
                  {job.applicationsCount}
                </div>
              </div>
            ))}
            {recentJobs.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">No jobs posted yet</p>
            )}
          </div>
          <Link to="/admin/jobs" className="btn-primary text-sm py-2 w-full justify-center mt-4">
            Post New Job
          </Link>
        </div>

        {/* Recent Applications */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Recent Applications</h3>
            <Link to="/admin/applications" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map(app => {
              const s = STATUS_CONFIG[app.status];
              return (
                <div key={app._id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{app.applicant?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{app.job?.title}</p>
                  </div>
                  <span className={`badge ${s.color} flex-shrink-0`}>{s.label}</span>
                </div>
              );
            })}
            {recentApplications.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">No applications yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
