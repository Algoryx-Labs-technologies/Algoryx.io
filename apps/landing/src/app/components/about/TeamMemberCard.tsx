import React from 'react';
import type { TeamMember } from '../../../data/teamMembers';

type TeamMemberPartProps = {
  member: TeamMember;
};

function leadershipColumnClass(index: number): string {
  const base = 'min-w-0 flex flex-col px-6 xl:px-8';
  return index > 0 ? `${base} border-l border-white/10` : base;
}

export function TeamMemberHeader({ member }: TeamMemberPartProps) {
  return (
    <header>
      <h3 className="font-tagline text-2xl xl:text-3xl text-white font-semibold tracking-tight leading-tight">
        {member.name}
      </h3>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#22c55e] font-medium">{member.role}</p>
    </header>
  );
}

export function TeamMemberBio({ member }: TeamMemberPartProps) {
  return (
    <div className="space-y-4 text-gray-400 text-sm leading-relaxed xl:text-[0.9375rem] xl:leading-relaxed">
      {member.bio.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function TeamMemberQuote({ member }: TeamMemberPartProps) {
  if (!member.quote) return null;

  return (
    <blockquote className="border-l border-white/20 pl-4 xl:pl-5">
      <p className="font-tagline text-base xl:text-lg text-white/90 italic leading-snug">
        &ldquo;{member.quote}&rdquo;
      </p>
    </blockquote>
  );
}

type TeamMemberCardProps = {
  member: TeamMember;
};

/** Stacked layout for mobile */
export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article id={member.id} className="space-y-5">
      <TeamMemberHeader member={member} />
      <TeamMemberBio member={member} />
      <TeamMemberQuote member={member} />
    </article>
  );
}

type LeadershipGridProps = {
  members: TeamMember[];
};

/** Three equal-width columns; quotes align at the bottom (lg+) */
export function LeadershipGrid({ members }: LeadershipGridProps) {
  return (
    <div
      className="hidden lg:grid w-full lg:gap-y-0"
      style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
    >
      {members.map((member, index) => (
        <article key={member.id} id={member.id} className={leadershipColumnClass(index)}>
          <TeamMemberHeader member={member} />
          <div className="mt-5 flex flex-1 flex-col min-h-0">
            <TeamMemberBio member={member} />
            <div className="mt-auto pt-8">
              <TeamMemberQuote member={member} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
