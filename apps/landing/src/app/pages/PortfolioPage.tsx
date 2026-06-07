import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Portfolio } from '../components/Portfolio';
import { PrimePageShell } from '../components/prime/PrimePageShell';

export function PortfolioPage() {
  return (
    <PrimePageShell>
      <Header />

      <main className="font-footer overflow-x-hidden">
        <div className="container mx-auto px-6 max-w-7xl pt-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Portfolio />
      </main>

      <Footer />
    </PrimePageShell>
  );
}
