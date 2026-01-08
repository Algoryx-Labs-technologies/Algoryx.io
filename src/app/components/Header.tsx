import React, { useState } from 'react';
import { Menu, X, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-transparent font-header">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Algoryx
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Home</a>
            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#courses" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Courses</a>
            <a href="#ai-tool" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Alryx AI</a>
            <a href="#why-algoryx" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Why Algoryx</a>
            <a href="#labs" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Labs</a>
            <a href="#work-with-labs" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Connect</a>
          </div>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border border-slate-300/50 dark:border-slate-700/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#home" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#features" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#courses" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Courses</a>
            <a href="#ai-tool" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Alryx AI</a>
            <a href="#why-algoryx" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Why Algoryx</a>
            <a href="#labs" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Labs</a>
            <a href="#work-with-labs" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Connect</a>
          </div>
        )}
      </nav>
    </header>
  );
}

