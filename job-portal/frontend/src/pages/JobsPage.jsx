import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiMapPin, FiFilter, FiX, FiSliders } from 'react-icons/fi';
import api from '../utils/api.js';
import JobCard from '../components/common/JobCard.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { PageLoader } from '../components/common/Spinner.jsx';
import useAuthStore from '../context/authStore.js';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = ['fresher', '1-2 years', '3-5 years', '5+ years'];
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering'];
const SALARY_RANGES = [
  { label: 'Any', min: '', max: '' },
  { label: 'Under ₹3L', min: '', max: '300000' },
  { label: '₹3L – ₹6L', min: '300000', max: '600000' },
  { label: '₹6L – ₹12L', min: '600000', max: '1200000' },
  { label: '₹12L – ₹25L', min: '1200000', max: '2500000' },
  { label: '₹25L+', min: '2500000', max: '' },
];

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    experience: searchParams.get('experience') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  const [searchInput, setSearchInput] = useState(filters.keyword);
  const [locationInput, setLocationInput] = useState(filters.location);

  useEffect(() => {
    if (user) {
      api.get('/users/saved-jobs').then(({ data }) => {
        setSavedIds(data.savedJobs.map(j => j._id));
      }).catch(() => {});
    }
  }, [user]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    const params = {};
    Object.entries(next).forEach(([k, v]) => { if (v && !(k === 'page' && v === 1)) params[k] = v; });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const next = { ...filters, keyword: searchInput, location: locationInput, page: 1 };
    setFilters(next);
    const params = {};
    Object.entries(next).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const reset = { keyword: '', location: '', type: '', category: '', experience: '', salaryMin: '', salaryMax: '', page: 1 };
    setFilters(reset);
    setSearchInput('');
    setLocationInput('');
    setSearchParams({});
  };

  const handleSaveToggle = (jobId, saved) => {
    setSavedIds(prev => saved ? [...prev, jobId] : prev.filter(id => id !== jobId));
  };

  const activeFiltersCount = [filters.type, filters.category, filters.experience, filters.salaryMin || filters.salaryMax].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Job Type</h4>
        <div className="space-y-2">
          {JOB_TYPES.map(type => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value={type}
                checked={filters.type === type}
                onChange={() => updateFilter('type', filters.type === type ? '' : type)}
                className="accent-primary-600"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={() => updateFilter('category', filters.category === cat ? '' : cat)}
                className="accent-primary-600"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Experience Level</h4>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map(exp => (
            <label key={exp} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="experience"
                value={exp}
                checked={filters.experience === exp}
                onChange={() => updateFilter('experience', filters.experience === exp ? '' : exp)}
                className="accent-primary-600"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors capitalize">{exp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Salary Range</h4>
        <div className="space-y-2">
          {SALARY_RANGES.map(({ label, min, max }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="salary"
                checked={filters.salaryMin === min && filters.salaryMax === max}
                onChange={() => {
                  const next = { ...filters, salaryMin: min, salaryMax: max, page: 1 };
                  setFilters(next);
                  const params = {};
                  Object.entries(next).forEach(([k, v]) => { if (v) params[k] = v; });
                  setSearchParams(params);
                }}
                className="accent-primary-600"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="w-full btn-secondary text-sm justify-center">
          <FiX className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="card p-3 flex flex-col sm:flex-row gap-2 mb-6">
        <div className="flex items-center gap-3 flex-1 px-3 py-2">
          <FiSearch className="text-slate-400 w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            placeholder="Job title, keyword..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 outline-none bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 text-sm"
          />
        </div>
        <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700 self-stretch" />
        <div className="flex items-center gap-3 flex-1 px-3 py-2">
          <FiMapPin className="text-slate-400 w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            placeholder="Location..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="flex-1 outline-none bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`sm:hidden btn-secondary text-sm py-2 gap-2 ${activeFiltersCount ? 'ring-2 ring-primary-500' : ''}`}
          >
            <FiSliders className="w-4 h-4" />
            {activeFiltersCount > 0 && <span className="badge bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-md">{activeFiltersCount}</span>}
          </button>
          <button type="submit" className="btn-primary text-sm py-2 px-5 whitespace-nowrap">Search</button>
        </div>
      </form>

      <div className="flex gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden sm:block w-56 lg:w-64 flex-shrink-0">
          <div className="card p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Filters
              </h3>
              {activeFiltersCount > 0 && (
                <span className="badge bg-primary-600 text-white">{activeFiltersCount}</span>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="sm:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="btn-ghost p-2"><FiX className="w-5 h-5" /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Job Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {loading ? 'Searching...' : <><span className="font-semibold text-slate-900 dark:text-white">{total.toLocaleString()}</span> jobs found</>}
            </p>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                <FiX className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <PageLoader />
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} savedIds={savedIds} onSaveToggle={handleSaveToggle} />
                ))}
              </div>
              <Pagination
                page={filters.page}
                pages={pages}
                onPageChange={(p) => updateFilter('page', p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
