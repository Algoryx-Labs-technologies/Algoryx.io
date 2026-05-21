import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';
import { PrimePageShell } from '../components/prime/PrimePageShell';
import { AboutEditorialBlock } from '../components/about/AboutEditorialBlock';
import { TeamMemberCard } from '../components/about/TeamMemberCard';
import {
  ABOUT_INTRO,
  ABOUT_JOURNEY,
  ABOUT_MISSION,
  ABOUT_VISION,
  CORE_VALUES,
} from '../../data/aboutContent';
import { TEAM_MEMBERS } from '../../data/teamMembers';

const featuredMember = TEAM_MEMBERS.find((m) => m.featured);
const supportingMembers = TEAM_MEMBERS.filter((m) => !m.featured);

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

        {/* Mission & Vision */}
        <section className="pb-20 md:pb-28 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-5xl grid md:grid-cols-2 gap-16 md:gap-20">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
                {ABOUT_MISSION.eyebrow}
              </p>
              <h2 className="font-tagline text-3xl md:text-4xl text-white font-medium mb-6 leading-tight">
                {ABOUT_MISSION.title}
              </h2>
              <AboutEditorialBlock>
                <p>{ABOUT_MISSION.body}</p>
              </AboutEditorialBlock>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
                {ABOUT_VISION.eyebrow}
              </p>
              <h2 className="font-tagline text-3xl md:text-4xl text-white font-medium mb-6 leading-tight">
                {ABOUT_VISION.title}
              </h2>
              <AboutEditorialBlock>
                <p>{ABOUT_VISION.body}</p>
              </AboutEditorialBlock>
            </ScrollReveal>
          </div>
        </section>

        {/* Core values */}
        <section className="pb-20 md:pb-28 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">Core Values</p>
              <h2 className="font-tagline text-3xl md:text-4xl text-white font-medium mb-12">
                What we stand for
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-10 md:gap-12">
              {CORE_VALUES.map((value, index) => (
                <ScrollReveal key={value.title} delay={index * 0.06}>
                  <div className="space-y-4">
                    <h3 className="font-tagline text-xl md:text-2xl text-white">{value.title}</h3>
                    <AboutEditorialBlock className="text-sm md:text-base pl-5 md:pl-6">
                      <p>{value.description}</p>
                    </AboutEditorialBlock>
                  </div>
                </ScrollReveal>
              ))}
            </div>
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

            {featuredMember && (
              <ScrollReveal delay={0.06} className="mb-16 md:mb-20">
                <TeamMemberCard member={featuredMember} expanded />
              </ScrollReveal>
            )}

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
