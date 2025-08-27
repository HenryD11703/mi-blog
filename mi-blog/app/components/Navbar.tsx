"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";
import { useSession } from "next-auth/react";
import { PenTool, Home, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <span>Mi Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home size={18} />
              <span>Inicio</span>
            </Link>
            
            {session && (
              <Link 
                href="/nuevo-post" 
                className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <PenTool size={18} />
                <span>Nuevo Post</span>
              </Link>
            )}
            
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Inicio</span>
            </Link>
            
            {session && (
              <Link 
                href="/nuevo-post" 
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PenTool size={18} />
                <span>Nuevo Post</span>
              </Link>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <AuthButtons />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}