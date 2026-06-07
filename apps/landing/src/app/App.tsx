import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PageSeo } from './components/PageSeo';
import { HomePage } from './pages/HomePage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { AlgoryxPrimePage } from './pages/AlgoryxPrimePage';
import { AlgoryxPrimeDetailPage } from './pages/AlgoryxPrimeDetailPage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { CalEmbedProvider } from './contexts/CalEmbedProvider';
import { AlgoryxChatWidget } from './components/chat/AlgoryxChatWidget';

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = hash.replace('#', '');
    const scrollToTarget = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Wait for layout + ScrollReveal mounts when opening /#prime directly
    const timer = setTimeout(scrollToTarget, 350);
    requestAnimationFrame(() => requestAnimationFrame(scrollToTarget));

    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CalEmbedProvider>
        <PageSeo />
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/service-details" element={<ServiceDetailsPage />} />
          <Route path="/algoryx-prime" element={<AlgoryxPrimePage />} />
          <Route path="/algoryx-prime/:serviceId" element={<AlgoryxPrimeDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
        <AlgoryxChatWidget />
      </CalEmbedProvider>
    </BrowserRouter>
  );
}
