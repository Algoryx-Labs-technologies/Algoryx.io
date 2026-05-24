import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-transparent font-header">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <BrandLogo variant="header" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#home" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/#services" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Services</Link>
            <Link to="/#ai-tool" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Alryx AI</Link>
            <Link to="/#why-algoryx" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Why Algoryx</Link>
            <Link to="/#prime" className="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium">Prime</Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
            <Link to="/#work-with-labs" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Connect</Link>
            <Link to="/#faq" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">FAQs</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
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
            <Link to="/#home" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/#services" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link to="/#ai-tool" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Alryx AI</Link>
            <Link to="/#why-algoryx" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Why Algoryx</Link>
            <Link to="/#prime" className="block text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>Prime</Link>
            <Link to="/about" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/#work-with-labs" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Connect</Link>
            <Link to="/#faq" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>FAQs</Link>
          </div>
        )}
      </nav>
    </header>
  );
}

