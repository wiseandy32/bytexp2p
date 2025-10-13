'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  Menu,
  PlusCircle,
  User,
  Wallet,
  Sun,
  Moon,
} from 'lucide-react';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { href: '/dashboard/overview', label: 'Overview' },
    { href: '/dashboard/deposit', label: 'Deposit' },
    { href: '/dashboard/withdraw', label: 'Withdraw' },
    { href: '/dashboard/transactions', label: 'Transactions' },
  ];

  const exchangeNavItems = [
    { href: '/dashboard/create-trade', label: 'Create Trade' },
    { href: '/dashboard/join-trade', label: 'Join Trade' },
    { href: '/dashboard/my-exchanges', label: 'My Exchanges' },
    { href: '/dashboard/request-cryptocurrency', label: 'Request Cryptocurrency' },
  ];

  const allNavItems = [...navItems, ...exchangeNavItems];

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const href = '/' + arr.slice(0, index + 1).join('/');
      const item = allNavItems.find((navItem) => navItem.href === href);
      return {
        href,
        label: item ? item.label : segment.charAt(0).toUpperCase() + segment.slice(1),
      };
    });

  const SidebarContent = () => (
    <nav className="flex flex-col gap-2 p-4">
      <div className="flex items-center mb-4 px-4">
        <img
          src="https://peershieldex.com/assets/images/favicon.png"
          alt="bytexp2p Logo"
          className="w-8 h-8 mr-2"
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">bytexp2p</h1>
      </div>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setSidebarOpen(false)}
          className={`px-4 py-2 rounded-md font-medium text-gray-700 dark:text-gray-300 ${
            pathname === item.href
              ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {item.label}
        </Link>
      ))}

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      <h2 className="px-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Exchange/Escrow
      </h2>
      {exchangeNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setSidebarOpen(false)}
          className={`px-4 py-2 rounded-md font-medium text-gray-700 dark:text-gray-300 ${
            pathname === item.href
              ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <aside className="relative bg-white w-64 flex-shrink-0 dark:bg-gray-800">
          <SidebarContent />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 flex-shrink-0 dark:bg-gray-800 dark:border-gray-700">
        <SidebarContent />
      </aside>

      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:hidden flex justify-between items-center dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full py-3">
          <div className="flex items-center px-4">
            <div className="m-0 text-gray-500 dark:text-gray-400 flex-1 flex items-center">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.href} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
                  <Link href={breadcrumb.href} className="hover:text-gray-800 dark:hover:text-white">
                    {breadcrumb.label}
                  </Link>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/create-trade"
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100 px-3 py-1 text-sm rounded-md flex items-center"
            >
              <PlusCircle size={16} className="mr-1" />
              new trade
            </Link>
            <Link
              href="/dashboard/my-exchanges"
              className="ml-4 text-sm flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              <ArrowLeftRight size={16} className="mr-1" />
              active trade
            </Link>
            <Link
              href="/dashboard/overview"
              className="ml-4 text-sm flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              <Wallet size={16} className="mr-1" />
              wallets
            </Link>

            <button
              onClick={toggleTheme}
              className="ml-4 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="relative ml-4">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="bg-gray-200 dark:bg-gray-700 rounded-md py-1 px-3 flex items-center cursor-pointer"
              >
                <User size={16} className="text-gray-800 dark:text-gray-200" />
                <ChevronDown size={16} className="text-gray-800 dark:text-gray-200" />
              </button>
              {/* Dropdown for account management can be added here */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
