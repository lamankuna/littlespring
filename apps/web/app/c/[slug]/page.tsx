import { ProductGrid } from '../../../components/product-grid';
import { Filters } from '../../../components/plp/Filters';
import { getProducts } from '../../../lib/catalog';
import { NAV } from '@littlespring/core';

function parseArray(v?: string | string[] | null) {
  if (!v) return [] as string[];
  return Array.isArray(v) ? v : v.split(',');
}

function parsePrice(v?: string | string[] | null): [number, number] | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return undefined;
  const [min, max] = s.split('-').map((x) => Number(x));
  if (Number.isFinite(min) && Number.isFinite(max)) return [min, max];
  return undefined;
}

export default async function CollectionPage({ params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const age = parseArray(searchParams.age);
  const badge = parseArray(searchParams.badge);
  const category = parseArray(searchParams.category);
  const material = parseArray(searchParams.material);
  const supplier = parseArray(searchParams.supplier);
  const price = parsePrice(searchParams.price);

  const selectedCategory = params.slug;
  const products = await getProducts({
    categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
    filters: { age, badge, category, material, price, supplier },
  });
  const pillarLabel = NAV.pillars.find((p) => p.slug === selectedCategory)?.label;
  const title = pillarLabel || selectedCategory.replace(/-/g, ' ');

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Filters searchParams={searchParams} selectedCategory={selectedCategory} />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
