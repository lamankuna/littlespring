export type Supplier = '4akid' | 'wonderprint' | 'bigbuy';
export type SupplierTag = Supplier;

export type Province =
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Eastern Cape'
  | 'Free State'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'North West'
  | 'Northern Cape';

export interface EtaResult {
  badge: string; // e.g., "Fast Ship ZA"
  display: string; // e.g., "Ships in 1–5 business days"
  showAddToCart?: boolean; // bigbuy hidden when ETA > 7d
}

export interface ComputeEtaInput {
  supplier: Supplier;
  destProvince?: Province;
}

export { computeEta } from './lib/eta';

export interface Price {
  currency: 'ZAR';
  amount: number; // cents
}

export interface VariantOption {
  id: string;
  title: string;
}

export interface Variant {
  id: string;
  title: string;
  options?: VariantOption[];
}

export interface ProductLite {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  // Category now uses slug e.g. 'plates-bowls', 'bibs', etc. (from NAV)
  category: string;
  supplier: Supplier;
  // price is stored in cents; priceZar is a derived convenience in rands
  price?: number; // cents
  priceZar: number; // rands
  images: string[];
  etaDisplay?: string;
  safetyNotes?: string;
  careNotes?: string;
  badges?: string[]; // e.g., ['fast-ship-za']
  ageTags?: string[]; // e.g., ['6-12m']
  material?: string; // 'silicone' | 'cotton' | ...
  variants?: Variant[];
  attributes?: Record<string, string>;
}
export { NAV, type NavPillar } from './nav';
export { inferAgeTags } from './age-map';
export { etaFor } from './eta';
