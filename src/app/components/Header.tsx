import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10 font-header">
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
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#courses" className="text-gray-300 hover:text-white transition-colors">Courses</a>
            <a href="#ai-tool" className="text-gray-300 hover:text-white transition-colors">Alryx AI</a>
            <a href="#why-algoryx" className="text-gray-300 hover:text-white transition-colors">Why Algoryx</a>
            <a href="#labs" className="text-gray-300 hover:text-white transition-colors">Labs</a>
            <a href="#work-with-labs" className="text-gray-300 hover:text-white transition-colors">Connect</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Login
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#home" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#features" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#courses" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Courses</a>
            <a href="#ai-tool" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Alryx AI</a>
            <a href="#why-algoryx" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Why Algoryx</a>
            <a href="#labs" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Labs</a>
            <a href="#work-with-labs" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Connect</a>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white w-full">
                Login
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 w-full">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
