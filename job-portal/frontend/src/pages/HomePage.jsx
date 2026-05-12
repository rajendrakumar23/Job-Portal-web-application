import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, FiTrendingUp, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api.js';
import JobCard from '../components/common/JobCard.jsx';
import Spinner from '../components/common/Spinner.jsx';

const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering'];
const STATS = [
  { icon: FiBriefcase, value: '10,000+', label: 'Active Jobs' },
  { icon: FiUsers, value: '50,000+', label: 'Job Seekers' },
  { icon: FiCheckCircle, value: '8,000+', label: 'Placements' },
  { icon: FiTrendingUp, value: '500+', label: 'Companies' },
];

export default function HomePage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/featured')
      .then(({ data }) => setFeaturedJobs(data.jobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Over 10,000 jobs available right now
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Find Your{' '}
              <span className="relative">
                Dream Job
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C60 4 160 2 298 8" stroke="rgba(251,191,36,0.7)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <br />With JobSphere
            </h1>

            <p className="text-lg text-primary-100 mb-10 leading-relaxed">
              Connect with top companies, discover exciting opportunities, and take the next step in your career journey.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-3 flex-1 px-3 py-2">
                <FiSearch className="text-slate-400 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 text-sm"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700 self-stretch" />
              <div className="flex items-center gap-3 flex-1 px-3 py-2">
                <FiMapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 text-sm"
                />
              </div>
              <button type="submit" className="btn-primary px-6 py-3 rounded-xl justify-center whitespace-nowrap">
                Search Jobs
              </button>
            </form>

            {/* Popular searches */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-primary-200">
              <span>Popular:</span>
              {['React Developer', 'UI Designer', 'Data Analyst', 'Marketing Manager'].map(term => (
                <button
                  key={term}
                  onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(term)}`)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white text-xs"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-slate-50 dark:text-slate-950">
            <path d="M0 48V20C240 0 480 0 720 20C960 40 1200 40 1440 20V48H0Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="card p-5 text-center">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-2xl">Browse by Category</h2>
          <button onClick={() => navigate('/jobs')} className="btn-ghost text-sm">View all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat)}`)}
              className="card p-4 text-left hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 block">
                {{'Technology':'💻','Marketing':'📣','Design':'🎨','Finance':'💰','Healthcare':'🏥','Education':'📚','Sales':'📈','Engineering':'⚙️'}[cat]}
              </span>
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title text-2xl">Featured Jobs</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Hand-picked opportunities from top companies</p>
          </div>
          <button onClick={() => navigate('/jobs')} className="btn-secondary text-sm gap-1">
            All Jobs <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No featured jobs yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Ready to find your next role?</h2>
          <p className="text-primary-100 mb-8 text-lg">Create your free account and start applying today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/register')} className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
              Get Started Free
            </button>
            <button onClick={() => navigate('/jobs')} className="px-8 py-3 border-2 border-white/40 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Browse Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
