import type { ComputeEtaInput, EtaResult } from '../index';

export function computeEta({ supplier }: ComputeEtaInput): EtaResult {
  switch (supplier) {
    case '4akid':
      return {
        badge: 'Fast Ship ZA',
        display: 'Ships in 1–5 business days',
        showAddToCart: true,
      };
    case 'wonderprint':
      return {
        badge: 'Local POD',
        display: 'Local POD • ~3–4 days avg',
        showAddToCart: true,
      };
    case 'bigbuy': {
      // demo rule: only show if ETA <= 7 business days
      // We'll assume 5–7d fast option in demo
      const fastWithin7 = true;
      return {
        badge: 'Fast EU Ship',
        display: fastWithin7 ? 'Fast EU ship • 5–7 business days' : 'Slower EU ship',
        showAddToCart: fastWithin7,
      };
    }
    default:
      return { badge: 'Ship', display: 'Standard shipping', showAddToCart: true };
  }
}

