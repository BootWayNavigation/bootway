'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout, isAdminOrHR } = useAuthContext();
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin') ?? false;

  // Persist dark mode
  useEffect(() => {
    const saved = localStorage.getItem('bw-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bw-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bw-theme', 'light');
    }
  };

  // Track scroll for shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const candidateLinks = [
    { name: 'Careers', path: '/' },
    ...(isAuthenticated ? [{ name: 'My Applications', path: '/applications' }] : []),
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Jobs', path: '/admin/jobs' },
    { name: 'Applications', path: '/admin/applications' },
    { name: 'Interview', path: '/admin/interviews' },
    { name: 'Employee', path: '/admin/employees' },
  ];

  const links = isAdminPath ? adminLinks : candidateLinks;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full bg-white dark:bg-gray-900 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href={isAdminPath ? '/admin/dashboard' : '/'}
            className="flex shrink-0 items-center py-4"
            aria-label="BootWay Home"
          >
            {/* Dark logo for light mode */}
            <Image
              src="/assets/images/logo/logo-b-re.png"
              alt="BootWay"
              width={160}
              height={40}
              className="block h-10 w-auto dark:hidden"
              priority
            />
            {/* Light logo for dark mode */}
            <Image
              src="/assets/images/logo/logo-w-re.png"
              alt="BootWay"
              width={160}
              height={40}
              className="hidden h-10 w-auto dark:block"
              priority
            />
            {isAdminPath && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                HR Portal
              </span>
            )}
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`mx-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Right Side ── */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Auth buttons */}
            {isAdminPath ? (
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-red-400 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hello, {user?.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 transition-colors"
                >
                  Logout
                </button>
                {isAdminOrHR && (
                  <Link
                    href="/admin/dashboard"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    HR Portal
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/candidate/signup"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle Dark Mode"
              className="ml-1 rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                /* Sun icon */
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.2375C12.45 4.2375 12.8625 3.8625 12.8625 3.375V1.5C12.8625 1.05 12.4875 0.637497 12 0.637497C11.55 0.637497 11.1375 1.0125 11.1375 1.5V3.4125C11.175 3.8625 11.55 4.2375 12 4.2375ZM12 6.89999C9.18752 6.89999 6.90002 9.18749 6.90002 12C6.90002 14.8125 9.18752 17.1 12 17.1C14.8125 17.1 17.1 14.8125 17.1 12C17.1 9.18749 14.8125 6.89999 12 6.89999ZM12 15.4125C10.125 15.4125 8.58752 13.875 8.58752 12C8.58752 10.125 10.125 8.58749 12 8.58749C13.875 8.58749 15.4125 10.125 15.4125 12C15.4125 13.875 13.875 15.4125 12 15.4125ZM12 19.7625C11.55 19.7625 11.1375 20.1375 11.1375 20.625V22.5C11.1375 22.95 11.5125 23.3625 12 23.3625C12.45 23.3625 12.8625 22.9875 12.8625 22.5V20.5875C12.8625 20.1375 12.45 19.7625 12 19.7625ZM22.5 11.175H20.5875C20.1375 11.175 19.725 11.55 19.725 12.0375C19.725 12.4875 20.1 12.9 20.5875 12.9H22.5C22.95 12.9 23.3625 12.525 23.3625 12.0375C23.3625 11.55 22.95 11.175 22.5 11.175ZM3.37501 11.1375H1.50001C1.05001 11.1375 0.637512 11.5125 0.637512 12C0.637512 12.45 1.01251 12.8625 1.50001 12.8625H3.41251C3.86251 12.8625 4.23751 12.45 4.23751 12C4.23751 11.55 3.86251 11.1375 3.37501 11.1375ZM18.7125 4.08749C18.3375 3.74999 17.8125 3.74999 17.475 4.08749C17.1375 4.4625 17.1375 4.9875 17.475 5.325L18.675 6.525C18.825 6.675 19.05 6.7875 19.275 6.7875C19.5 6.7875 19.725 6.7125 19.875 6.525C20.2125 6.1875 20.2125 5.6625 19.875 5.325L18.7125 4.08749ZM5.32501 17.5125C4.98751 17.175 4.46251 17.175 4.12501 17.5125C3.78751 17.85 3.78751 18.375 4.12501 18.7125L5.32501 19.9125C5.47501 20.0625 5.70001 20.175 5.92501 20.175C6.15001 20.175 6.37501 20.1 6.52501 19.9125C6.86251 19.575 6.86251 19.05 6.52501 18.7125L5.32501 17.5125ZM19.9125 18.7125L18.7125 17.5125C18.375 17.175 17.85 17.175 17.5125 17.5125C17.175 17.85 17.175 18.375 17.5125 18.7125L18.7125 19.9125C18.8625 20.0625 19.0875 20.175 19.3125 20.175C19.5375 20.175 19.7625 20.1 19.9125 19.9125C20.25 19.575 20.25 19.05 19.9125 18.7125ZM5.32501 4.125L4.12501 5.325C3.78751 5.6625 3.78751 6.1875 4.12501 6.525C4.27501 6.675 4.50001 6.7875 4.72501 6.7875C4.95001 6.7875 5.17501 6.7125 5.32501 6.525L6.52501 5.325C6.86251 4.9875 6.86251 4.4625 6.52501 4.125C6.18751 3.7875 5.62501 3.7875 5.32501 4.125Z" />
                </svg>
              ) : (
                /* Moon icon */
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.3125 1.50001C12.675 1.31251 12.0375 1.16251 11.3625 1.05001C10.875 0.975006 10.35 1.23751 10.1625 1.68751C9.93751 2.13751 10.05 2.70001 10.425 3.00001C13.0875 5.47501 14.0625 9.11251 12.975 12.525C11.775 16.3125 8.25001 18.975 4.16251 19.0875C3.63751 19.0875 3.22501 19.425 3.07501 19.9125C2.92501 20.4 3.15001 20.925 3.56251 21.1875C4.50001 21.75 5.43751 22.2 6.37501 22.5C7.46251 22.8375 8.58751 22.9875 9.71251 22.9875C11.625 22.9875 13.5 22.5 15.1875 21.5625C17.85 20.1 19.725 17.7375 20.55 14.8875C22.1625 9.26251 18.975 3.37501 13.3125 1.50001ZM18.9375 14.4C18.2625 16.8375 16.6125 18.825 14.4 20.0625C12.075 21.3375 9.41251 21.6 6.90001 20.85C6.63751 20.775 6.33751 20.6625 6.07501 20.55C10.05 19.7625 13.35 16.9125 14.5875 13.0125C15.675 9.56251 15 5.92501 12.7875 3.07501C17.5875 4.68751 20.2875 9.67501 18.9375 14.4Z" />
                </svg>
              )}
            </button>
          </div>

          {/* ── Mobile: dark toggle + hamburger ── */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleDark}
              aria-label="Toggle Dark Mode"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6.89999C9.18752 6.89999 6.90002 9.18749 6.90002 12C6.90002 14.8125 9.18752 17.1 12 17.1C14.8125 17.1 17.1 14.8125 17.1 12C17.1 9.18749 14.8125 6.89999 12 6.89999ZM12 15.4125C10.125 15.4125 8.58752 13.875 8.58752 12C8.58752 10.125 10.125 8.58749 12 8.58749C13.875 8.58749 15.4125 10.125 15.4125 12C15.4125 13.875 13.875 15.4125 12 15.4125ZM12 4.2375C12.45 4.2375 12.8625 3.8625 12.8625 3.375V1.5C12.8625 1.05 12.4875 0.637497 12 0.637497C11.55 0.637497 11.1375 1.0125 11.1375 1.5V3.4125C11.175 3.8625 11.55 4.2375 12 4.2375ZM12 19.7625C11.55 19.7625 11.1375 20.1375 11.1375 20.625V22.5C11.1375 22.95 11.5125 23.3625 12 23.3625C12.45 23.3625 12.8625 22.9875 12.8625 22.5V20.5875C12.8625 20.1375 12.45 19.7625 12 19.7625ZM22.5 11.175H20.5875C20.1375 11.175 19.725 11.55 19.725 12.0375C19.725 12.4875 20.1 12.9 20.5875 12.9H22.5C22.95 12.9 23.3625 12.525 23.3625 12.0375C23.3625 11.55 22.95 11.175 22.5 11.175ZM3.37501 11.1375H1.50001C1.05001 11.1375 0.637512 11.5125 0.637512 12C0.637512 12.45 1.01251 12.8625 1.50001 12.8625H3.41251C3.86251 12.8625 4.23751 12.45 4.23751 12C4.23751 11.55 3.86251 11.1375 3.37501 11.1375Z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.3125 1.50001C12.675 1.31251 12.0375 1.16251 11.3625 1.05001C10.875 0.975006 10.35 1.23751 10.1625 1.68751C9.93751 2.13751 10.05 2.70001 10.425 3.00001C13.0875 5.47501 14.0625 9.11251 12.975 12.525C11.775 16.3125 8.25001 18.975 4.16251 19.0875C3.63751 19.0875 3.22501 19.425 3.07501 19.9125C2.92501 20.4 3.15001 20.925 3.56251 21.1875C4.50001 21.75 5.43751 22.2 6.37501 22.5C7.46251 22.8375 8.58751 22.9875 9.71251 22.9875C11.625 22.9875 13.5 22.5 15.1875 21.5625C17.85 20.1 19.725 17.7375 20.55 14.8875C22.1625 9.26251 18.975 3.37501 13.3125 1.50001ZM18.9375 14.4C18.2625 16.8375 16.6125 18.825 14.4 20.0625C12.075 21.3375 9.41251 21.6 6.90001 20.85C6.63751 20.775 6.33751 20.6625 6.07501 20.55C10.05 19.7625 13.35 16.9125 14.5875 13.0125C15.675 9.56251 15 5.92501 12.7875 3.07501C17.5875 4.68751 20.2875 9.67501 18.9375 14.4Z" />
                </svg>
              )}
            </button>

            <button
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${isActive(link.path)
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-2">
              {isAdminPath ? (
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 transition-colors"
                >
                  ← Candidate View
                </Link>
              ) : isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Signed in as <strong>{user?.fullName}</strong>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/candidate/signup"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
