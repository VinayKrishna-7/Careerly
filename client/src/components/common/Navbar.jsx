import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice.js';
import { showToast } from '../../store/slices/uiSlice.js';
import Button from '../ui/Button.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { FileText, LayoutDashboard, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { getInitials } from '../../utils/formatters.js';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(showToast({ message: 'Logged out successfully', type: 'info' }));
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#faf5eb]/90 backdrop-blur-md dark:border-white/10 dark:bg-black/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-black dark:text-[#faf5eb] text-lg sm:text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <span>
            Career<span>ly</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-black dark:text-[#faf5eb] font-bold'
                  : 'text-[#756d61] hover:text-black dark:text-[#a39b8e] dark:hover:text-[#faf5eb] font-medium'
              }`}
            >
              Resumes
            </Link>
            <Link
              to="/cover-letters"
              className={`text-sm transition-colors ${
                location.pathname.startsWith('/cover-letters')
                  ? 'text-black dark:text-[#faf5eb] font-bold'
                  : 'text-[#756d61] hover:text-black dark:text-[#a39b8e] dark:hover:text-[#faf5eb] font-medium'
              }`}
            >
              Cover Letters
            </Link>
            <Link
              to="/profile"
              className={`text-sm transition-colors ${
                location.pathname === '/profile'
                  ? 'text-black dark:text-[#faf5eb] font-bold'
                  : 'text-[#756d61] hover:text-black dark:text-[#a39b8e] dark:hover:text-[#faf5eb] font-medium'
              }`}
            >
              Account Settings
            </Link>
          </nav>
        )}

        {/* Right CTA / Theme Toggle / User Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-black/15 bg-white p-1.5 pr-3 hover:bg-black/5 dark:border-white/15 dark:bg-[#0c0c0e] dark:hover:bg-white/10 transition-colors focus:outline-none"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black text-xs font-bold shadow-xs">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <span className="text-xs font-semibold text-black dark:text-[#faf5eb] max-w-[120px] truncate">
                  {user?.name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#0c0c0e] p-1.5 shadow-floating border border-black/10 dark:border-white/10 animate-in fade-in zoom-in-95 duration-100 z-50"
                >
                  {/* User Identity Header */}
                  <div className="px-3 py-2.5 border-b border-black/10 dark:border-white/10">
                    <p className="text-xs font-bold text-black dark:text-[#faf5eb] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#756d61] dark:text-[#a39b8e] truncate mt-0.5">{user?.email}</p>
                  </div>

                  {/* Account Actions */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-black dark:text-[#faf5eb] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <User className="h-4 w-4 text-[#756d61] dark:text-[#a39b8e]" />
                      <span>Profile &amp; Settings</span>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-black/10 dark:border-white/10 pt-1 mt-0.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-black hover:bg-black/5 dark:text-[#faf5eb] dark:hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-black/10 bg-[#faf5eb] dark:border-white/10 dark:bg-black px-4 py-4 md:hidden animate-in slide-in-from-top-2">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-2 py-2 border-b border-black/10 dark:border-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[#faf5eb] dark:bg-[#faf5eb] dark:text-black text-xs font-bold shadow-xs">
                  {getInitials(user?.name)}
                </div>
                <div>
                  <p className="text-xs font-bold text-black dark:text-[#faf5eb]">{user?.name}</p>
                  <p className="text-[10px] text-[#756d61] dark:text-[#a39b8e]">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black dark:text-[#faf5eb] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <LayoutDashboard className="h-4 w-4 text-[#756d61] dark:text-[#a39b8e]" />
                Resumes
              </Link>
              <Link
                to="/cover-letters"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black dark:text-[#faf5eb] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <FileText className="h-4 w-4 text-[#756d61] dark:text-[#a39b8e]" />
                Cover Letters
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black dark:text-[#faf5eb] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <User className="h-4 w-4 text-[#756d61] dark:text-[#a39b8e]" />
                Profile & Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold text-black dark:text-[#faf5eb] py-2 rounded-lg border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold text-[#faf5eb] bg-black dark:bg-[#faf5eb] dark:text-black py-2 rounded-lg shadow-xs hover:opacity-90"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
