import React, { useState } from 'react';
import { Instagram, Twitter, Linkedin, Github, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm font-footer">
      <div className="container mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
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
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTermsOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setDisclaimerOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  Disclaimer
                </button>
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

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Privacy Policy</DialogTitle>
            <DialogDescription className="text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <section>
              <h3 className="text-white font-semibold mb-2">1. Information We Collect</h3>
              <p>
                We collect information that you provide directly to us, including when you register for an account, 
                enroll in courses, use our services, or contact us for support. This may include your name, email address, 
                phone number, payment information, and any other information you choose to provide.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">2. How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and improve our services, process transactions, 
                send you technical notices and support messages, respond to your comments and questions, and communicate 
                with you about products, services, and promotional offers.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">3. Information Sharing</h3>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information 
                only in the circumstances described in this policy, such as with service providers who assist us in operating 
                our platform, or when required by law.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">4. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet 
                is 100% secure.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">5. Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information at any time. You may also opt out 
                of certain communications from us. To exercise these rights, please contact us using the information provided below.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">6. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@algoryx.com
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Terms of Service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <section>
              <h3 className="text-white font-semibold mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using Algoryx, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">2. Use License</h3>
              <p>
                Permission is granted to temporarily access the materials on Algoryx for personal, non-commercial transitory 
                viewing only. This is the grant of a license, not a transfer of title, and under this license you may not 
                modify or copy the materials, use the materials for any commercial purpose, or remove any copyright or other 
                proprietary notations from the materials.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">3. User Accounts</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
                responsibility for all activities that occur under your account or password. You must notify us immediately 
                of any unauthorized use of your account.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">4. Payment Terms</h3>
              <p>
                All fees are payable in advance. We reserve the right to change our pricing at any time. Refunds are subject 
                to our refund policy, which may be updated from time to time.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">5. Intellectual Property</h3>
              <p>
                All content, features, and functionality of Algoryx, including but not limited to text, graphics, logos, 
                and software, are the exclusive property of Algoryx and are protected by copyright, trademark, and other laws.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">6. Limitation of Liability</h3>
              <p>
                In no event shall Algoryx or its suppliers be liable for any damages (including, without limitation, damages 
                for loss of data or profit, or due to business interruption) arising out of the use or inability to use the 
                materials on Algoryx.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">7. Contact Information</h3>
              <p>
                For questions about these Terms of Service, please contact us at legal@algoryx.com
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disclaimer Dialog */}
      <Dialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Disclaimer</DialogTitle>
            <DialogDescription className="text-gray-400">
              Important Information About Trading and Financial Markets
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <section>
              <h3 className="text-white font-semibold mb-2">Trading Risk Warning</h3>
              <p className="text-red-400 font-medium">
                Trading in financial markets involves substantial risk of loss and is not suitable for all investors. 
                You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, 
                and financial resources.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">No Investment Advice</h3>
              <p>
                The information provided on Algoryx is for educational purposes only and does not constitute investment advice, 
                financial advice, trading advice, or any other sort of advice. You should not treat any of the content on 
                Algoryx as such. We do not recommend that any cryptocurrency, stock, or other financial instrument should be 
                bought, sold, or held by you.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">Past Performance</h3>
              <p>
                Past performance is not indicative of future results. Any historical returns, expected returns, or probability 
                projections may not reflect actual future performance. All investments involve risk, including the possible loss 
                of principal.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">Educational Content</h3>
              <p>
                The courses, tools, and content provided by Algoryx are designed for educational purposes. While we strive to 
                provide accurate and up-to-date information, we make no representations or warranties of any kind, express or 
                implied, about the completeness, accuracy, reliability, or suitability of the information.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">No Guarantee of Results</h3>
              <p>
                Algoryx does not guarantee that you will achieve any particular results from using our services. Your success 
                in trading depends on many factors, including your skill, knowledge, risk management, and market conditions.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">Regulatory Compliance</h3>
              <p>
                You are responsible for ensuring that your use of Algoryx and any trading activities comply with all applicable 
                laws and regulations in your jurisdiction. Algoryx is not responsible for any violations of laws or regulations 
                by users.
              </p>
            </section>
            <section>
              <h3 className="text-white font-semibold mb-2">Consult a Professional</h3>
              <p>
                Before making any financial decisions, you should consult with a qualified financial advisor or professional 
                who can provide advice tailored to your specific situation.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
