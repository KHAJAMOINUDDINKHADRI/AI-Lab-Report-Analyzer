import Link from "next/link";
import React from "react";

function navbar() {
  return (
    <nav className="w-full shadow bg-zinc-900 text-white border-1 border-zinc-800">
      <div className="max-w-8xl mx-6 px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-extrabold">
            <Link href="/" className="text-white">
              Lab <span className="text-blue-600">Analyzer</span>
            </Link>
          </div>    
          {/* Login Button */}
          <div className="flex items-center gap-8 text-lg font-medium">
            <Link
              href="/"
              className="text-white hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-blue-600 transition"
            >
              About
            </Link>
            <Link href="/upload">
              <button className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold transition">
                Upload Report
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default navbar;
