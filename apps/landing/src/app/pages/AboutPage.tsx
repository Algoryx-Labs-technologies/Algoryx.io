import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';
import { PrimePageShell } from '../components/prime/PrimePageShell';
import { AboutEditorialBlock } from '../components/about/AboutEditorialBlock';
import { LeadershipGrid, TeamMemberCard } from '../components/about/TeamMemberCard';
import { ABOUT_INTRO } from '../../data/aboutContent';
import { TEAM_MEMBERS } from '../../data/teamMembers';

const LEADERSHIP_ORDER = ['varun-pandya', 'abhishek-gupta', 'pratyush-birole'] as const;

const leadershipProfiles = LEADERSHIP_ORDER.map((id) => TEAM_MEMBERS.find((m) => m.id === id)).filter(
  (m): m is (typeof TEAM_MEMBERS)[number] => m !== undefined
);

export function AboutPage() {
  return (
    <PrimePageShell>
      <Header />

      <main className="font-footer overflow-x-hidden">
        {/* Hero — reference: left-aligned serif, candlestick accent */}
        <section className="pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <ScrollReveal>
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors mb-12"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>

              <h1 className="font-tagline text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-semibold leading-[1.05] tracking-tight mb-10">
                <span className="block">About</span>
                <span className="block mt-1">Algoryx</span>
                <span className="block mt-1">Labs</span>
              </h1>

              <AboutEditorialBlock className="max-w-3xl space-y-5">
                {ABOUT_INTRO.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </AboutEditorialBlock>
            </ScrollReveal>
          </div>
        </section>

        {/* Leadership */}
        <section className="pb-24 md:pb-32 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <ScrollReveal>
              <h2 className="font-tagline text-3xl md:text-4xl lg:text-5xl text-white font-medium mb-12">
                Leadership
              </h2>
              <p className="text-gray-500 max-w-2xl mb-14 text-base md:text-lg leading-relaxed">
                Three founders across strategy, markets, and engineering—building disciplined outcomes
                for global investors.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <div className="lg:hidden space-y-14 divide-y divide-white/10">
                {leadershipProfiles.map((member) => (
                  <div key={member.id} className="first:pt-0 pt-14 first:border-0">
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
              <LeadershipGrid members={leadershipProfiles} />
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </PrimePageShell>
  );
}
