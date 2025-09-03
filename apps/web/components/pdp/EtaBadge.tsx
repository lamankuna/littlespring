import { etaFor } from '@littlespring/core';
import { Badge } from '@littlespring/ui';

export function EtaBadge({ supplier }: { supplier: '4akid'|'wonderprint'|'bigbuy' }) {
  const eta = etaFor(supplier);
  return (
    <div className="flex items-center gap-2" title={eta.label} aria-label={`ETA: ${eta.label}`}>
      <Badge tone={supplier === 'wonderprint' ? 'peach' : 'mint'}>{eta.badge}</Badge>
      <span className="text-sm text-black/70">{eta.label}</span>
    </div>
  );
}

