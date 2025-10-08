"use client";
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-[999] bg-gray-800 bg-opacity-80 backdrop-blur-md">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img src="https://peershieldex.com/assets/images/favicon.png" alt="Peershieldex" className="h-7 w-7" />
            <span className="font-sans text-white font-bold text-lg">Peershieldex</span>
          </a>

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
            <a href="https://peershieldex.com/about-us" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">About US</a>
            <a href="https://peershieldex.com/escrow-process" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Our Approach</a>
            <a href="https://peershieldex.com/escrow-service-guarantee" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Guarantee</a>
            <a href="https://peershieldex.com/register" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Exchange</a>
            <a href="https://peershieldex.com#faqs" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">FAQs</a>
            <a href="https://peershieldex.com/login" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Login</a>
            <a href="https://peershieldex.com/register">
              <button className="text-sm text-white bg-green-500 hover:bg-green-600 rounded font-bold px-4 py-2 transition-colors">
                Register
              </button>
            </a>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="https://peershieldex.com/about-us" className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">About US</a>
            <a href="https://peershieldex.com/escrow-process" className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Our Approach</a>
            <a href="https://peershieldex.com/escrow-service-guarantee" className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Guarantee</a>
            <a href="https://peershieldex.com/register" className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Exchange</a>
            <a href="https://peershieldex.com#faqs" className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">FAQs</a>
            <a href="https://peershieldex.com/login" className="block text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md">Login</a>
            <a href="https://peershieldex.com/register" className="block">
              <button className="w-full text-sm text-white bg-green-500 hover:bg-green-600 rounded font-bold px-4 py-2 transition-colors">
                Register
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
