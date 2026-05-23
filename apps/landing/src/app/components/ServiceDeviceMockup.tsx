import React from 'react';
import type { Service } from '../../data/services';
import { ServiceLaptopMockup } from './ServiceLaptopMockup';
import { ServicePhoneMockup } from './ServicePhoneMockup';

const LAPTOP_SERVICE_IDS = new Set(['saas-development', 'devops', 'video-editing']);

type ServiceDeviceMockupProps = {
  service: Service;
};

export function ServiceDeviceMockup({ service }: ServiceDeviceMockupProps) {
  if (LAPTOP_SERVICE_IDS.has(service.id)) {
    return <ServiceLaptopMockup service={service} />;
  }
  return <ServicePhoneMockup service={service} />;
}
