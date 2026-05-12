import { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiMail, FiMapPin, FiCalendar } from 'react-icons/fi';
import api from '../utils/api.js';
import { PageLoader } from '../components/common/Spinner.jsx';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { page, limit: 20 } });
      setUsers(data.users);
      setTotal(data.total);
      setPages(Math.ceil(data.total / 20));
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Manage Users
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{total} registered users</p>
      </div>

      {/* Search */}
      <div className="card p-3 mb-5 flex items-center gap-3">
        <FiSearch className="text-slate-400 w-4 h-4 ml-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400"
        />
      </div>

      {loading ? <PageLoader /> : (
        <div className="card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['User', 'Email', 'Location', 'Experience', 'Skills', 'Joined'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                          {user.name[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{user.location || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="badge-blue capitalize">{user.experience || 'fresher'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-48">
                        {user.skills?.slice(0, 3).map(skill => (
                          <span key={skill} className="badge-gray text-xs">{skill}</span>
                        ))}
                        {user.skills?.length > 3 && (
                          <span className="text-xs text-slate-400">+{user.skills.length - 3}</span>
                        )}
                        {(!user.skills || user.skills.length === 0) && <span className="text-slate-400 text-xs">None</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-slate-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(user => (
              <div key={user._id} className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {user.location && <span className="badge-gray">{user.location}</span>}
                  <span className="badge-blue capitalize">{user.experience || 'fresher'}</span>
                </div>
              </div>
            ))}
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
