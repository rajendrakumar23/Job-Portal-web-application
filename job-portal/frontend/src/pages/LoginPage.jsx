import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi';
import useAuthStore from '../context/authStore.js';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <FiBriefcase className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>JobSphere</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your next big<br />opportunity awaits
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed">
            Sign in to explore thousands of jobs, track your applications, and connect with top employers.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-3">
          {['10,000+ Jobs', '500+ Companies', '50,000+ Users', '8,000+ Placed'].map(stat => (
            <div key={stat} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-white font-semibold text-sm">{stat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Welcome back
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Sign in to your JobSphere account</p>
          </div>

          <div className="card p-7 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={`input pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
            <p className="font-semibold mb-1">Demo credentials:</p>
            <p>Admin: admin@jobsphere.com / admin123</p>
            <p>User: user@jobsphere.com / user1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
