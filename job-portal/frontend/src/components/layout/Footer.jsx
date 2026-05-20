import { Link } from 'react-router-dom';
import { FiBriefcase, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiBriefcase className="text-white w-4 h-4" />
              </div>
              <span className="text-white">Job<span className="text-primary-400">Sphere</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Connecting talented professionals with the world's best opportunities. Find your dream job today.
            </p>
            <div className="flex gap-3 mt-4">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              {['Browse Jobs', 'Create Account', 'Upload Resume', 'Career Advice'].map(item => (
                <li key={item}><Link to="/jobs" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Company</h4>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© {new Date().getFullYear()} JobSphere. All rights reserved.</p>
          <p>Rajendra Kumar</p>
          <p>Built with React, Node.js & MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
