import { getPrimeServiceById } from '../data/primeServices';

export const SITE_URL = 'https://algoryx.io';
export const SITE_NAME = 'Algoryx.io';
export const BRAND_LABS = 'Algoryx Labs';
export const BRAND_TECH = 'Algoryx Tech';
export const BRAND_FULL = 'Algoryx Labs & Technologies';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/algoryx-labs-logo.png`;
export const DEFAULT_KEYWORDS =
  'Algoryx, Algoryx.io, Algoryx Labs, Algoryx Tech, Algoryx Technologies, algorithmic trading, trading bot development, fintech engineering, AI ML development, DevOps, web app development, Algoryx Prime, NSE BSE algo trading, quantitative trading India';

export const DEFAULT_DESCRIPTION =
  'Algoryx.io is the official home of Algoryx Labs & Algoryx Tech—engineering trading systems, AI/ML, web platforms, DevOps, and Algoryx Prime for serious market operators in India and worldwide.';

export type PageSeoConfig = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
};

const HOME_TITLE = `${SITE_NAME} | ${BRAND_LABS} & ${BRAND_TECH} — Trading Systems, AI & Platform Engineering`;

export const STATIC_PAGE_SEO: Record<string, PageSeoConfig> = {
  '/': {
    title: HOME_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  },
  '/about': {
    title: `About ${BRAND_LABS} | ${SITE_NAME}`,
    description:
      'Learn about Algoryx Labs—our journey from traders to a technology and markets firm delivering disciplined, research-backed engineering for clients in India and Canada.',
    path: '/about',
  },
  '/portfolio': {
    title: `Portfolio | ${BRAND_LABS} | ${SITE_NAME}`,
    description:
      'Explore recent launches, active builds, and selected past projects from Algoryx Labs—trading systems, AI products, and production-grade engineering.',
    path: '/portfolio',
  },
  '/service-details': {
    title: `Services | ${BRAND_LABS} & ${BRAND_TECH} | ${SITE_NAME}`,
    description:
      'Explore Algoryx Labs services: trading bots, web and app development, AI/ML, DevOps, MVP builds, and video production—end-to-end engineering from Algoryx Technologies.',
    path: '/service-details',
  },
  '/algoryx-prime': {
    title: `Algoryx Prime Desk | ${BRAND_LABS} | ${SITE_NAME}`,
    description:
      'Algoryx Prime is a production trading desk stack—broker integration, automation, backtesting, screeners, dashboards, alerts, and monitoring for full-time traders and funds.',
    path: '/algoryx-prime',
  },
};

export function resolvePageSeo(pathname: string): PageSeoConfig {
  const staticSeo = STATIC_PAGE_SEO[pathname];
  if (staticSeo) return staticSeo;

  const primeMatch = pathname.match(/^\/algoryx-prime\/([^/]+)$/);
  if (primeMatch) {
    const service = getPrimeServiceById(primeMatch[1]);
    if (service) {
      return {
        title: `${service.title} | Algoryx Prime | ${SITE_NAME}`,
        description: `${service.summary} — Algoryx Prime by ${BRAND_LABS} on ${SITE_NAME}.`,
        path: pathname,
      };
    }
  }

  return {
    title: HOME_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: pathname,
    noindex: true,
  };
}

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
  isProperty = attribute === 'property'
) {
  const selector = isProperty
    ? `meta[property="${key}"]`
    : `meta[name="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (isProperty) {
      el.setAttribute('property', key);
    } else {
      el.setAttribute('name', key);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyPageSeo(config: PageSeoConfig) {
  const canonicalUrl = `${SITE_URL}${config.path === '/' ? '/' : config.path}`;
  const ogImage = config.ogImage ?? DEFAULT_OG_IMAGE;
  const robots = config.noindex ? 'noindex, follow' : 'index, follow';

  document.title = config.title;

  upsertMeta('name', 'title', config.title);
  upsertMeta('name', 'description', config.description);
  upsertMeta('name', 'robots', robots);

  upsertMeta('property', 'og:type', config.ogType ?? 'website');
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:title', config.title);
  upsertMeta('property', 'og:description', config.description);
  upsertMeta('property', 'og:image', ogImage);
  upsertMeta('property', 'og:site_name', SITE_NAME);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:url', canonicalUrl);
  upsertMeta('name', 'twitter:title', config.title);
  upsertMeta('name', 'twitter:description', config.description);
  upsertMeta('name', 'twitter:image', ogImage);

  upsertLink('canonical', canonicalUrl);
}
