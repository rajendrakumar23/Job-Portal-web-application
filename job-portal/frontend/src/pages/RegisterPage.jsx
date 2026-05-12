import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiCheckCircle } from 'react-icons/fi';
import useAuthStore from '../context/authStore.js';
import toast from 'react-hot-toast';

const PERKS = [
  'Apply to 10,000+ jobs instantly',
  'Track all your applications',
  'Save and bookmark jobs',
  'Upload your resume once',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to JobSphere 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const strength = (() => {
    const pw = form.password;
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'][strength];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-primary-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
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
            Join 50,000+<br />professionals
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            Create your free account and start your journey toward the career of your dreams.
          </p>
          <div className="space-y-3">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3 text-slate-200">
                <div className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="w-3.5 h-3.5 text-primary-300" />
                </div>
                <span className="text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center font-bold text-white">R</div>
              <div>
                <p className="text-white font-semibold text-sm">Rahul Sharma</p>
                <p className="text-slate-400 text-xs">Software Engineer at Google</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm italic">"Found my dream job within 2 weeks of joining JobSphere. The application tracking is a game-changer!"</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Create your account
            </h1>
            <p className="text-slate-500 dark:text-slate-400">It's free and takes less than a minute</p>
          </div>

          <div className="card p-7 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className={`input pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

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
                    placeholder="Min. 6 characters"
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
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-slate-200 dark:bg-slate-700'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">{strengthLabel}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Repeat your password"
                    className={`input pl-10 ${errors.confirm ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : 'Create Free Account'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
