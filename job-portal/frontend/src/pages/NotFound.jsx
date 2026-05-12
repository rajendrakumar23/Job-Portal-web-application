import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-primary-100 dark:text-primary-900 mb-2 select-none" style={{ fontFamily: 'Syne, sans-serif' }}>
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          Page not found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/jobs" className="btn-secondary">Browse Jobs</Link>
        </div>
      </div>
    </div>
  );
}
