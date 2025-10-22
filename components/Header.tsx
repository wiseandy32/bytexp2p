"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-[999] bg-gray-800 bg-opacity-80 backdrop-blur-md">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/bytexp2p-logo.png" alt="Bytexp2p" className="w-28" />
          </Link>

          {/* Mobile menu button (hidden on large screens) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu (hidden on small screens) */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/about-us"
              className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              About US
            </Link>
            <Link
              href="/escrow-process"
              className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Our Approach
            </Link>
            <Link
              href="/escrow-service-guarantee"
              className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Guarantee
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Exchange
            </Link>
            <Link
              href="/#faqs"
              className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              FAQs
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-white bg-green-500 hover:bg-green-600 rounded font-bold px-4 py-2 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Admin
            </Link>
            <Link
              href="/about-us"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              About US
            </Link>
            <Link
              href="/escrow-process"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Our Approach
            </Link>
            <Link
              href="/escrow-service-guarantee"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Guarantee
            </Link>
            <Link
              href="/auth/register"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Exchange
            </Link>
            <Link
              href="/#faqs"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              FAQs
            </Link>
            <Link
              href="/auth/login"
              className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Login
            </Link>
            <Link href="/auth/register" className="block w-full text-sm text-white bg-green-500 hover:bg-green-600 rounded font-bold px-4 py-2 transition-colors">
                Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
