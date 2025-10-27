import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={"/"} className="flex-shrink-0 flex items-center">
              <img src="/logo.png" className="size-7" />
              <span className="ml-2 text-xl font-bold text-primary">
                TerraSentra
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <div
                className="relative"
                onMouseEnter={() => {
                  setIsFeaturesOpen(true);

                  if (window.dropdownTimeout) {
                    clearTimeout(window.dropdownTimeout);
                    window.dropdownTimeout = null;
                  }
                }}
                onMouseLeave={() => {
                  window.dropdownTimeout = setTimeout(() => {
                    setIsFeaturesOpen(false);
                  }, 300);
                }}
              >
                <div className="flex gap-8">
                  <a
                    href="/potential-regions"
                    className="hover:bg-gray-100 text-sm"
                  >
                    Potential Region
                  </a>
                  <a
                    href="/greenbond-investment"
                    className="hover:bg-gray-100 text-sm"
                  >
                    Green Bond Investment
                  </a>
                  <a
                    href="/carbon-offset-exchange"
                    className=" hover:bg-gray-100 text-sm"
                  >
                    Carbon Offset Exchange
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            <a
              href="#how-it-works"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
