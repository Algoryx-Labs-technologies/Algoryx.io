import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';
import { PrimePageShell } from '../components/prime/PrimePageShell';
import { AboutEditorialBlock } from '../components/about/AboutEditorialBlock';
import { TeamMemberCard } from '../components/about/TeamMemberCard';
import { ABOUT_INTRO, ABOUT_JOURNEY } from '../../data/aboutContent';
import { TEAM_MEMBERS } from '../../data/teamMembers';

const leadershipProfiles = TEAM_MEMBERS.filter((m) => m.expandedProfile);
const supportingMembers = TEAM_MEMBERS.filter((m) => !m.expandedProfile);

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

              <AboutEditorialBlock className="max-w-2xl text-gray-400">
                <p>{ABOUT_INTRO}</p>
              </AboutEditorialBlock>
            </ScrollReveal>
          </div>
        </section>

        {/* Journey */}
        <section className="pb-20 md:pb-28 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
                {ABOUT_JOURNEY.eyebrow}
              </p>
              <h2 className="font-tagline text-3xl md:text-4xl lg:text-5xl text-white font-medium mb-8 max-w-3xl leading-tight">
                {ABOUT_JOURNEY.title}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <AboutEditorialBlock className="max-w-3xl space-y-6 mb-12">
                {ABOUT_JOURNEY.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </AboutEditorialBlock>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <blockquote className="max-w-3xl">
                <p className="font-tagline text-2xl md:text-3xl text-white/90 italic leading-snug border-l border-white/20 pl-6 md:pl-8">
                  &ldquo;{ABOUT_JOURNEY.pullQuote}&rdquo;
                </p>
              </blockquote>
            </ScrollReveal>
          </div>
        </section>

        {/* Leadership */}
        <section className="pb-24 md:pb-32 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <ScrollReveal>
              <h2 className="font-tagline text-3xl md:text-4xl lg:text-5xl text-white font-medium mb-12">
                Leadership
              </h2>
              <p className="text-gray-500 max-w-2xl mb-14 text-base md:text-lg leading-relaxed">
                Three pillars of Algoryx Labs—strategy, technology, and client delivery—working as one
                team for disciplined outcomes.
              </p>
            </ScrollReveal>

            <div className="space-y-16 md:space-y-20 mb-16 md:mb-20">
              {leadershipProfiles.map((member, index) => (
                <ScrollReveal key={member.id} delay={0.06 + index * 0.06}>
                  <TeamMemberCard member={member} expanded />
                </ScrollReveal>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {supportingMembers.map((member, index) => (
                <ScrollReveal key={member.id} delay={0.1 + index * 0.06}>
                  <TeamMemberCard member={member} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PrimePageShell>
  );
}
