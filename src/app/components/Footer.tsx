import React from 'react';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-black text-sm">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Algoryx
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              India's first platform for algorithmic trading education and quantitative research.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Courses
                </a>
              </li>
              <li>
                <a href="#labs" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Labs
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-lg flex items-center justify-center transition-all group"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-lg flex items-center justify-center transition-all group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-lg flex items-center justify-center transition-all group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-lg flex items-center justify-center transition-all group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* Bottom bar */}
        <ScrollReveal delay={0.2}>
          <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © Algoryx 2025. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs text-center md:text-right max-w-md">
              Disclaimer: Trading in financial markets involves substantial risk. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
