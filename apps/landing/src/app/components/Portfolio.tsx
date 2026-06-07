import React, { useEffect, useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { fetchPublicPortfolio, type PublicPortfolio } from '../../lib/api';
import { PORTFOLIO_SECTIONS, type PortfolioProject } from '../../data/portfolio';

function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_24px_rgba(59,130,246,0.18)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900/70">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {project.clientName && (
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80 font-medium">
            {project.clientName}
          </p>
        )}
        <h3 className="mt-2 text-lg font-semibold text-white">{project.title}</h3>
        {project.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-400 line-clamp-3">
            {project.description}
          </p>
        )}
        {project.techStack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-slate-950/50 px-2.5 py-1 text-[11px] text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function PortfolioSectionBlock({
  title,
  description,
  projects,
}: {
  title: string;
  description: string;
  projects: PortfolioProject[];
}) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <ScrollReveal>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm md:text-base text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ScrollReveal key={project.id}>
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export function Portfolio() {
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPortfolio = async () => {
      setLoading(true);
      const response = await fetchPublicPortfolio();

      if (!mounted) {
        return;
      }

      if (!response.success || !response.data) {
        setError(response.error || 'Unable to load portfolio');
        setPortfolio(null);
      } else {
        setPortfolio(response.data);
        setError(null);
      }

      setLoading(false);
    };

    void loadPortfolio();

    return () => {
      mounted = false;
    };
  }, []);

  const totalProjects = portfolio
    ? portfolio.recent.length + portfolio.ongoing.length + portfolio.past.length
    : 0;

  return (
    <div className="py-10 md:py-14 relative font-features">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center px-3 md:px-4 py-1.5 bg-blue-500/10 border border-blue-400/40 rounded-full text-blue-200 text-xs md:text-sm font-medium mb-4">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Work We Ship
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Explore recent launches, active builds, and selected past projects from Algoryx Labs.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[320px] rounded-2xl border border-white/10 bg-slate-900/40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center text-red-300">
            {error}
          </div>
        ) : totalProjects === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-6 py-12 text-center text-gray-400">
            Portfolio projects will appear here once published from the admin dashboard.
          </div>
        ) : (
          <div className="space-y-14 md:space-y-20">
            {PORTFOLIO_SECTIONS.map((section) => (
              <PortfolioSectionBlock
                key={section.key}
                title={section.title}
                description={section.description}
                projects={portfolio?.[section.key] ?? []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
