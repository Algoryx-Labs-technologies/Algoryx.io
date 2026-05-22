import React from 'react';
import type { TeamMember } from '../../../data/teamMembers';

type TeamMemberCardProps = {
  member: TeamMember;
  expanded?: boolean;
};

export function TeamMemberCard({ member, expanded = false }: TeamMemberCardProps) {
  if (expanded && member.featured) {
    return (
      <article
        id={member.id}
        className="grid lg:grid-cols-[minmax(200px,280px)_1fr] gap-10 lg:gap-16 items-start"
      >
        <div className="relative">
          <div className="aspect-[4/5] max-w-[280px] rounded-sm border border-white/10 bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-tagline text-6xl md:text-7xl text-white/15 select-none">
                {member.initials}
              </span>
            </div>
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }}
              aria-hidden
            />
          </div>
        </div>

        <div className="space-y-6 min-w-0">
          <header>
            <h3 className="font-tagline text-3xl md:text-4xl text-white font-semibold tracking-tight">
              {member.name}
            </h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#22c55e] font-medium">
              {member.role}
            </p>
          </header>

          <div className="space-y-4 text-gray-400 text-base md:text-lg leading-relaxed">
            {member.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          {member.quote && (
            <blockquote className="border-l border-white/20 pl-6 md:pl-8">
              <p className="font-tagline text-xl md:text-2xl text-white/90 italic leading-snug">
                &ldquo;{member.quote}&rdquo;
              </p>
            </blockquote>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      id={member.id}
      className="group rounded-sm border border-white/10 bg-white/[0.02] p-6 md:p-8 hover:border-white/20 transition-colors"
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-14 h-14 rounded-sm border border-white/10 bg-black flex items-center justify-center">
          <span className="font-tagline text-lg text-white/40">{member.initials}</span>
        </div>
        <div className="min-w-0 space-y-3">
          <div>
            <h3 className="font-tagline text-xl md:text-2xl text-white font-medium">{member.name}</h3>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mt-1">{member.role}</p>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">{member.bio[0]}</p>
        </div>
      </div>
    </article>
  );
}
