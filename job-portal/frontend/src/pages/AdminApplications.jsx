import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiExternalLink, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import { PageLoader } from '../components/common/Spinner.jsx';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: 'badge-gray' },
  reviewing:   { label: 'Reviewing',   color: 'badge-blue' },
  shortlisted: { label: 'Shortlisted', color: 'badge-orange' },
  accepted:    { label: 'Accepted',    color: 'badge-green' },
  rejected:    { label: 'Rejected',    color: 'badge-red' },
};

const STATUSES = Object.keys(STATUS_CONFIG);

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filterStatus) params.status = filterStatus;
      const { data } = await api.get('/admin/applications', { params });
      setApplications(data.applications);
      setTotal(data.total);
      setPages(Math.ceil(data.total / 20));
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, [page, filterStatus]);

  const handleStatusChange = async (appId, status) => {
    setUpdatingId(appId);
    try {
      const { data } = await api.put(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: data.application.status } : a));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const filtered = applications.filter(a =>
    !search ||
    a.applicant?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.job?.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          All Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{total} total applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="card p-3 flex items-center gap-3 flex-1">
          <FiSearch className="text-slate-400 w-4 h-4 ml-1 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search applicant, job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="input w-auto min-w-40"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => { setFilterStatus(''); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!filterStatus ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}
        >
          All
        </button>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary-300'}`}
          >
            {STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : (
        <div className="card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Applicant', 'Job', 'Applied Date', 'Resume', 'Status', 'Change Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(app => {
                  const s = STATUS_CONFIG[app.status];
                  return (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-sm flex-shrink-0">
                            {app.applicant?.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{app.applicant?.name}</p>
                            <p className="text-xs text-slate-400">{app.applicant?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/jobs/${app.job?._id}`} className="font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1">
                          {app.job?.title}
                          <FiExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">{app.job?.company}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        {app.resume ? (
                          <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
                            View Resume
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">Not uploaded</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          disabled={updatingId === app._id}
                          className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-slate-400">No applications found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(app => {
              const s = STATUS_CONFIG[app.status];
              return (
                <div key={app._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{app.applicant?.name}</p>
                      <p className="text-xs text-slate-400">{app.applicant?.email}</p>
                    </div>
                    <span className={`badge ${s.color} flex-shrink-0`}>{s.label}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{app.job?.title}</p>
                    <p className="text-xs text-slate-400">{app.job?.company}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</p>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updatingId === app._id}
                      className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-slate-400">No applications found</div>
            )}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-1 p-4 border-t border-slate-100 dark:border-slate-800">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
