"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiPlusCircle,
  FiUser,
  FiSun,
  FiMoon,
  FiX,
} from "react-icons/fi";
import AccountDropdown from "./AccountDropdown";
import { LuWallet, LuArrowRightLeft } from "react-icons/lu";
import WithdrawalModal from "./WithdrawalModal"; // Import the modal component
import JoinTradeDialog from "../app/dashboard/JoinTradeDialog";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isWithdrawalModalOpen, setWithdrawalModalOpen] = useState(false); // State for modal
  const [isJoinTradeModalOpen, setJoinTradeModalOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add(theme);
    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    { href: "/dashboard/overview", label: "Overview" },
    { href: "/dashboard/deposit", label: "Deposit" },
    { href: "/dashboard/withdraw", label: "Withdraw" },
    { href: "/dashboard/transactions", label: "Transactions" },
  ];

  const exchangeNavItems = [
    { href: "/dashboard/create-trade", label: "Create Trade" },
    { href: "/dashboard/join-trade", label: "Join Trade" },
    { href: "/dashboard/my-exchanges", label: "My Exchanges" },
    {
      href: "/dashboard/request-cryptocurrency",
      label: "Request Cryptocurrency",
    },
  ];

  const allNavItems = [...navItems, ...exchangeNavItems];

  const getCurrentRouteTitle = () => {
    if (pathname === "/dashboard") {
      return "Overview";
    }
    const currentNavItem = allNavItems.find((item) => item.href === pathname);
    return currentNavItem ? currentNavItem.label : "";
  };

  const SidebarContent = () => (
    <nav className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center">
          <img
            src="/bytexp2p-logo.png"
            alt="bytexp2p Logo"
            className="w-28 h-8 mr-2"
          />
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden">
          <FiX size={24} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      {navItems.map((item) => {
        if (item.href === "/dashboard/withdraw") {
          return (
            <button
              key={item.href}
              onClick={() => {
                setWithdrawalModalOpen(true);
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 rounded-md font-medium text-left text-gray-700 dark:text-gray-300 ${
                pathname === item.href
                  ? "bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {item.label}
            </button>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`px-4 py-2 rounded-md font-medium text-gray-700 dark:text-gray-300 ${
              pathname === item.href
                ? "bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      <h2 className="px-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Exchange/Escrow
      </h2>
      {exchangeNavItems.map((item) => {
        if (item.href === "/dashboard/join-trade") {
          return (
            <button
              key={item.href}
              onClick={() => {
                setJoinTradeModalOpen(true);
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 rounded-md font-medium text-left text-gray-700 dark:text-gray-300 ${
                pathname === item.href
                  ? "bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {item.label}
            </button>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`px-4 py-2 rounded-md font-medium text-gray-700 dark:text-gray-300 ${
              pathname === item.href
                ? "bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
      />
      <JoinTradeDialog
        show={isJoinTradeModalOpen}
        onHide={() => setJoinTradeModalOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <aside
          className={`absolute top-0 right-0 h-full bg-white w-64 flex-shrink-0 dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SidebarContent />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 flex-shrink-0 dark:bg-gray-800 dark:border-gray-700">
        <SidebarContent />
      </aside>

      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <header className="md:hidden px-2.5 container-fluid sticky-top border-bottom sans-pro dark:bg-gray-800 dark:border-gray-700 py-2 flex items-center">
          <div className="flex-1 flex items-center ml-4">
            <FiChevronRight className="text-gray-500" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-2">
              {getCurrentRouteTitle()}
            </p>
          </div>
          <div className="relative">
            <p className="text-xs m-0 top-5 mr-3">
              <FiUser
                size={26}
                className="text-gray-400 cursor-pointer"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              />
            </p>
            {accountMenuOpen && <AccountDropdown />}
          </div>
          <div
            id="toggleDrawer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="cursor-pointer"
          >
            <FiMenu size={28} className="text-gray-400" />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gamma-700 w-full py-3">
          <div className="flex items-center px-4">
            <div className="m-0 text-gray-500 dark:text-gray-400 flex-1 flex items-center">
              <FiChevronRight />
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-2">
                {getCurrentRouteTitle()}
              </h1>
            </div>
            <Link
              href="/dashboard/create-trade"
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100 px-3 py-1 text-sm rounded-md flex items-center"
            >
              <FiPlusCircle size={16} className="mr-1" />
              new trade
            </Link>
            <Link
              href="/dashboard/my-exchanges"
              className="ml-4 text-sm flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              <LuArrowRightLeft size={16} className="mr-1" />
              active trade
            </Link>
            <Link
              href="/dashboard/overview"
              className="ml-4 text-sm flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              <LuWallet size={16} className="mr-1" />
              wallets
            </Link>

            <button
              onClick={toggleTheme}
              className="ml-4 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            <div className="relative ml-4">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="bg-gray-200 dark:bg-gray-700 rounded-md py-1 px-3 flex items-center cursor-pointer"
              >
                <FiUser
                  size={16}
                  className="text-gray-800 dark:text-gray-200"
                />
                <FiChevronDown
                  size={16}
                  className="text-gray-800 dark:text-gray-200"
                />
              </button>
              {accountMenuOpen && <AccountDropdown />}
            </div>
          </div>
        </header>

        <main className="flex-1 w-[100vw] md:w-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
