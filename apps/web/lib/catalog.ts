import rawSeed from '../seed/catalog.json';
import type { ProductLite } from '@littlespring/core';
import { inferAgeTags, NAV } from '@littlespring/core';

export interface ProductQuery {
  limit?: number;
  categorySlug?: string; // maps to product.category (slug)
  filters?: {
    age?: string[];
    badge?: string[];
    category?: string[];
    material?: string[];
    price?: [number, number]; // rands min/max
    supplier?: string[];
  };
}

const FEATURE_DEMO = process.env.FEATURE_ENABLE_DEMO_CATALOG !== 'false';

function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function inflate(seedItems: ProductLite[]): ProductLite[] {
  // Generate ~60+ SKUs by combining sizes/colors where plausible
  const out: ProductLite[] = [];
  for (const p0 of seedItems) {
    const p: ProductLite = {
      ...p0 as any,
      ageTags: (p0 as any).ageTags && (p0 as any).ageTags.length ? (p0 as any).ageTags : inferAgeTags(p0.title, p0.blurb),
      priceZar: p0.price ? p0.price / 100 : (p0 as any).priceZar ?? 0,
    };
    out.push(p);
    // Small variations to reach visual density
    if (p.category === 'plates-bowls') {
      ['Pear', 'Leaf', 'Cloud'].forEach((shape, i) => {
        const id = `${p.id}-${slugify(shape)}`;
        const title = p.title.includes('—') ? p.title.split('—')[0] + ` — ${shape}` : `${p.title} — ${shape}`;
        out.push({ ...p, id, slug: slugify(title), title });
      });
    }
    if (['tees','onesies','beanies'].includes(p.category)) {
      const sizes = ['2-3y', '3-4y', '5-6y'];
      sizes.forEach((s) => {
        const id = `${p.id}-${slugify(s)}`;
        const title = `${p.title} (${s})`;
        out.push({ ...p, id, slug: slugify(title), title });
      });
    }
  }
  // Duplicate categories slightly to reach target count
  while (out.length < 64) {
    const base = out[out.length % seedItems.length];
    const idx = out.length;
    const id = `${base.id}-v${idx}`;
    const title = `${base.title} v${idx}`;
    out.push({ ...base, id, slug: slugify(title), title });
  }
  return out;
}

const CATALOG: ProductLite[] = FEATURE_DEMO ? inflate(rawSeed as unknown as ProductLite[]) : [];

export async function getProducts(query: ProductQuery = {}): Promise<ProductLite[]> {
  let list = [...CATALOG];
  if (query.categorySlug) {
    const pillar = NAV.pillars.find((pl) => pl.slug === query.categorySlug);
    if (pillar) list = list.filter((p) => pillar.children.includes(p.category));
    else list = list.filter((p) => p.category === query.categorySlug);
  }
  const { age = [], badge = [], category = [], material = [], price, supplier = [] } = query.filters || {};
  if (age.length) list = list.filter((p) => p.ageTags?.some((t) => age.includes(t)));
  if (badge.length) list = list.filter((p) => p.badges?.some((b) => badge.includes(b)));
  if (category.length) list = list.filter((p) => category.includes(p.category));
  if (material.length) list = list.filter((p) => material.includes(p.material || ''));
  if (supplier.length) list = list.filter((p) => supplier.includes(p.supplier));
  if (price) list = list.filter((p) => {
    const val = p.priceZar;
    return val >= price[0] && val <= price[1];
  });
  if (query.limit) list = list.slice(0, query.limit);
  return list;
}

export async function getProductBySlug(slug: string): Promise<ProductLite | undefined> {
  return CATALOG.find((p) => p.slug === slug);
}

export async function getFeaturedCollections() {
  const picks = ['feeding-mess', 'bath-care', 'apparel'];
  const map = new Map<string, number>();
  for (const p of CATALOG) {
    const pillar = NAV.pillars.find((pl) => pl.children.includes(p.category));
    if (pillar && picks.includes(pillar.slug)) {
      map.set(pillar.slug, (map.get(pillar.slug) || 0) + 1);
    }
  }
  return picks.map((slug) => ({ slug, title: NAV.pillars.find((p) => p.slug === slug)?.label || slug, count: map.get(slug) || 0 }));
}

export async function getAllFilters() {
  const ages = new Set<string>();
  const mats = new Set<string>();
  for (const p of CATALOG) {
    p.ageTags?.forEach((t) => ages.add(t));
    if (p.material) mats.add(p.material);
  }
  return { age: [...ages], material: [...mats] };
}

export async function getByCategory(category: string, limit = 12) {
  return (await getProducts({ categorySlug: category, limit }));
}

export async function getPairsWith(category: string, excludeSlug?: string, limit = 10) {
  return (await getProducts({ categorySlug: category })).filter((p) => p.slug !== excludeSlug).slice(0, limit);
}
