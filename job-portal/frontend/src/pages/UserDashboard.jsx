import { useState, useEffect } from 'react';
import {
  FiUser, FiBriefcase, FiBookmark, FiUpload, FiEdit2, FiSave,
  FiX, FiFileText, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle, FiTrash2
} from 'react-icons/fi';
import api from '../utils/api.js';
import useAuthStore from '../context/authStore.js';
import { PageLoader } from '../components/common/Spinner.jsx';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ResumeAnalyzer from "../components/ai/ResumeAnalyzer";

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-gray', icon: FiClock },
  reviewing: { label: 'Reviewing', color: 'badge-blue', icon: FiAlertCircle },
  shortlisted: { label: 'Shortlisted', color: 'badge-orange', icon: FiCheckCircle },
  accepted: { label: 'Accepted', color: 'badge-green', icon: FiCheckCircle },
  rejected: { label: 'Rejected', color: 'badge-red', icon: FiXCircle },
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiUser },
  { id: 'applications', label: 'Applications', icon: FiBriefcase },
  { id: 'saved', label: 'Saved Jobs', icon: FiBookmark },
  { id: 'profile', label: 'Edit Profile', icon: FiEdit2 },
];

export default function UserDashboard() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || 'fresher',
  });
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, savedRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/users/saved-jobs'),
        ]);
        setApplications(appRes.data.applications);
        setSavedJobs(savedRes.data.savedJobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append('resume', resumeFile);
    setUploadingResume(true);
    try {
      const { data } = await api.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      setResumeFile(null);
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(prev => prev.filter(a => a._id !== id));
      toast.success('Application withdrawn');
    } catch {
      toast.error('Failed to withdraw');
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.post(`/users/save/${jobId}`);
      setSavedJobs(prev => prev.filter(j => j._id !== jobId));
      toast.success('Job removed from saved');
    } catch {
      toast.error('Failed to unsave');
    }
  };

  if (loading) return <PageLoader />;

  const stats = [
    { label: 'Total Applied', value: applications.length, color: 'text-primary-600 dark:text-primary-400' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-orange-500' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'text-emerald-500' },
    { label: 'Saved Jobs', value: savedJobs.length, color: 'text-blue-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            {user?.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`text-3xl font-bold ${color}`} style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === id
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Applications */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Recent Applications
            </h3>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FiBriefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No applications yet</p>
                <Link to="/jobs" className="btn-primary text-sm mt-4 inline-flex">Browse Jobs</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => {
                  const s = STATUS_CONFIG[app.status];
                  return (
                    <div key={app._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">{app.job?.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{app.job?.company}</p>
                      </div>
                      <span className={`badge ${s.color} flex-shrink-0`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile Completion */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Profile Completion
            </h3>
            {[
              { label: 'Name', done: !!user?.name },
              { label: 'Phone', done: !!user?.phone },
              { label: 'Location', done: !!user?.location },
              { label: 'Bio', done: !!user?.bio },
              { label: 'Skills', done: user?.skills?.length > 0 },
              { label: 'Resume', done: !!user?.resume },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                {done ? (
                  <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="text-xs text-orange-500 font-medium">Missing</span>
                )}
              </div>
            ))}
            {(() => {
              const done = [user?.name, user?.phone, user?.location, user?.bio, user?.skills?.length, user?.resume].filter(Boolean).length;
              const pct = Math.round((done / 6) * 100);
              return (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Profile strength</span><span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {tab === 'applications' && (
        <div className="card overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <FiBriefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't applied to any jobs yet</p>
              <Link to="/jobs" className="btn-primary">Find Jobs</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-left">
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Job</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Company</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Applied</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map(app => {
                    const s = STATUS_CONFIG[app.status];
                    return (
                      <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4">
                          <Link to={`/jobs/${app.job?._id}`} className="font-medium text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400">
                            {app.job?.title}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{app.job?.company}</td>
                        <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`badge ${s.color}`}>{s.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          {app.status === 'pending' && (
                            <button
                              onClick={() => handleWithdraw(app._id)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" /> Withdraw
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div>
          {savedJobs.length === 0 ? (
            <div className="card text-center py-16">
              <FiBookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">No saved jobs yet</p>
              <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedJobs.map(job => (
                <div key={job._id} className="card p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{job.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{job.company}</p>
                    </div>
                    <button onClick={() => handleUnsave(job._id)} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="badge-blue">{job.type}</span>
                    <span className="badge-gray">{job.location}</span>
                  </div>
                  <Link to={`/jobs/${job._id}`} className="btn-primary text-xs py-1.5 w-full justify-center">View Job</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card p-6 space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={profileForm.location} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} placeholder="Mumbai, Maharashtra" />
              </div>
              <div>
                <label className="label">Experience Level</label>
                <select className="input" value={profileForm.experience} onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })}>
                  {['fresher', '1-2 years', '3-5 years', '5+ years'].map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Bio</label>
                <textarea className="input resize-none" rows={3} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Tell employers about yourself..." />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Skills (comma-separated)</label>
                <input className="input" value={profileForm.skills} onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })} placeholder="React, Node.js, MongoDB..." />
              </div>
            </div>
            <button onClick={handleProfileSave} disabled={saving} className="btn-primary gap-2">
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>


      <div className="space-y-4">

  {/* Resume Upload */}
  <div className="card p-5">

    <h3
      className="font-bold text-slate-900 dark:text-white mb-4 text-sm"
      style={{ fontFamily: 'Syne, sans-serif' }}
    >
      Resume
    </h3>

    {user?.resume && (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 mb-3">
        <FiFileText className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />

        <a
          href={user.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline truncate"
        >
          View Current Resume
        </a>
      </div>
    )}

    <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors">
      <FiUpload className="w-6 h-6 text-slate-400" />

      <span className="text-xs text-slate-500 text-center">
        {resumeFile
          ? resumeFile.name
          : 'Click to upload PDF, DOC, DOCX'}
      </span>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) =>
          setResumeFile(e.target.files[0])
        }
      />
    </label>

    {resumeFile && (
      <button
        onClick={handleResumeUpload}
        disabled={uploadingResume}
        className="btn-primary w-full justify-center mt-3 text-sm py-2"
      >
        {uploadingResume
          ? 'Uploading...'
          : 'Upload Resume'}
      </button>
    )}

  </div>

  {/* AI Resume Analyzer */}
  <ResumeAnalyzer />

</div>
</div>
      )}
      </div>
  );
}

          
          