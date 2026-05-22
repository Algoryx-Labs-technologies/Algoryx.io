import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyPageSeo, resolvePageSeo } from '../../lib/seo';

/** Updates document title, meta tags, and canonical URL on client-side route changes. */
export function PageSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyPageSeo(resolvePageSeo(pathname));
  }, [pathname]);

  return null;
}
