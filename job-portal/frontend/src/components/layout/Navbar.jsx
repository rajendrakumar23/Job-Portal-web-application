import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiBriefcase, FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import useAuthStore from '../../context/authStore.js';
import useThemeStore from '../../context/themeStore.js';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Browse Jobs' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800' 
               : 'bg-white dark:bg-slate-950'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiBriefcase className="text-white w-4 h-4" />
            </div>
            <span className="text-slate-900 dark:text-white">Job<span className="text-primary-600">Sphere</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                             : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                             : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                        {user.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-24 truncate">{user.name}</span>
                  <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 card shadow-lg border border-slate-100 dark:border-slate-800 py-2 animate-fade-in">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <FiUser className="w-4 h-4" /> Dashboard
                    </Link>
                    <hr className="my-1 border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggle} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1 animate-slide-up">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Admin</Link>
          )}
          <hr className="border-slate-100 dark:border-slate-800 my-2" />
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm flex-1 justify-center">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 justify-center">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
