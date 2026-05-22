import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PrimePageShell } from '../components/prime/PrimePageShell';
import { PrimeServiceDetail } from '../components/prime/PrimeServiceDetail';
import { getPrimeServiceById } from '../../data/primeServices';

export function AlgoryxPrimeDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId ? getPrimeServiceById(serviceId) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  if (!service) {
    return <Navigate to="/algoryx-prime" replace />;
  }

  return (
    <PrimePageShell>
      <Header />
      <main>
        <PrimeServiceDetail service={service} />
      </main>
      <Footer />
    </PrimePageShell>
  );
}
