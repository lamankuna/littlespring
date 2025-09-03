export type SupplierTag = '4akid' | 'wonderprint' | 'bigbuy';

export function etaFor(supplier: SupplierTag, fallbackDays = 5) {
  if (supplier === '4akid') return { label: 'Ships in 1–5 business days', badge: 'FAST SHIP ZA' } as const;
  if (supplier === 'wonderprint') return { label: 'Little Spring Apparel • ~3–4 days avg', badge: 'LITTLE SPRING APPAREL' } as const;
  return { label: `Express EU • ≤ 7 days`, badge: 'FAST SHIP' } as const;
}
