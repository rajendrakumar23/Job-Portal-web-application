export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  return (
    <div className={`${sizes[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}
