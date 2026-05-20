import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiSearch } from 'react-icons/fi';
import api from '../utils/api.js';
import { PageLoader } from '../components/common/Spinner.jsx';
import Modal from '../components/common/Modal.jsx';
import toast from 'react-hot-toast';

  const F = ({ label, required, children }) => (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );

const EMPTY_JOB = {
  title: '', company: '', location: '', type: 'Full-time', category: 'Technology',
  description: '', salaryMin: '', salaryMax: '', experience: 'fresher',
  requirements: '', responsibilities: '', skills: '', isActive: true, deadline: '',
};

const TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering'];
const EXPERIENCES = ['fresher', '1-2 years', '3-5 years', '5+ years'];

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(EMPTY_JOB);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.keyword = search;
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [page, search]);

  const openCreate = () => { setEditJob(null); setForm(EMPTY_JOB); setShowModal(true); };
  const openEdit = (job) => {
    setEditJob(job);
    setForm({
      ...job,
      requirements: job.requirements?.join('\n') || '',
      responsibilities: job.responsibilities?.join('\n') || '',
      skills: job.skills?.join(', ') || '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.company || !form.location || !form.description) {
      toast.error('Please fill required fields');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : [],
      responsibilities: form.responsibilities ? form.responsibilities.split('\n').filter(Boolean) : [],
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
    };
    try {
      if (editJob) {
        const { data } = await api.put(`/jobs/${editJob._id}`, payload);
        setJobs(prev => prev.map(j => j._id === editJob._id ? data.job : j));
        toast.success('Job updated!');
      } else {
        const { data } = await api.post('/jobs', payload);
        setJobs(prev => [data.job, ...prev]);
        setTotal(t => t + 1);
        toast.success('Job posted!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job? All applications will be removed.')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      setTotal(t => t - 1);
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete job'); }
  };

  const handleToggle = async (job) => {
    try {
      const { data } = await api.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      setJobs(prev => prev.map(j => j._id === job._id ? data.job : j));
      toast.success(`Job ${data.job.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update job'); }
  };



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Manage Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{total} total jobs</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <FiPlus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      {/* Search */}
      <div className="card p-3 mb-5 flex items-center gap-3">
        <FiSearch className="text-slate-400 w-4 h-4 ml-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 outline-none bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400"
        />
      </div>

      {loading ? <PageLoader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Job Title', 'Company', 'Type', 'Experience', 'Applicants', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {jobs.map(job => (
                  <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{job.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{job.location}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{job.company}</td>
                    <td className="px-5 py-4">
                      <span className="badge-blue">{job.type}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 capitalize">{job.experience}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{job.applicationsCount}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(job)}
                        className={`flex items-center gap-1.5 text-xs font-medium ${job.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
                      >
                        {job.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                        {job.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(job)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors">
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(job._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-slate-400">No jobs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-1 p-4 border-t border-slate-100 dark:border-slate-800">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Form Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editJob ? 'Edit Job' : 'Post New Job'} size="xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Job Title" required>
              <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior React Developer" />
            </F>
            <F label="Company Name" required>
              <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Inc." />
            </F>
            <F label="Location" required>
              <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bengaluru, Remote" />
            </F>
            <F label="Job Type">
              <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </F>
            <F label="Category">
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </F>
            <F label="Experience Level">
              <select className="input" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}>
                {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </F>
            <F label="Min Salary (₹)">
              <input type="number" className="input" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} placeholder="e.g. 500000" />
            </F>
            <F label="Max Salary (₹)">
              <input type="number" className="input" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} placeholder="e.g. 1000000" />
            </F>
            <F label="Application Deadline">
              <input type="date" className="input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </F>
            <F label="Status">
              <select className="input" value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </F>
          </div>
          <F label="Job Description" required>
            <textarea className="input resize-none" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the role, team, and what you're building..." />
          </F>
          <F label="Requirements (one per line)">
            <textarea className="input resize-none font-mono text-xs" rows={4} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} placeholder={"Bachelor's in CS or equivalent\n3+ years of React experience"} />
          </F>
          <F label="Responsibilities (one per line)">
            <textarea className="input resize-none font-mono text-xs" rows={4} value={form.responsibilities} onChange={e => setForm({ ...form, responsibilities: e.target.value })} placeholder={"Build and maintain React applications\nCollaborate with design team"} />
          </F>
          <F label="Required Skills (comma-separated)">
            <input className="input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, TypeScript, Node.js, MongoDB" />
          </F>
        </div>
        <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
            {saving ? 'Saving...' : editJob ? 'Update Job' : 'Post Job'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
