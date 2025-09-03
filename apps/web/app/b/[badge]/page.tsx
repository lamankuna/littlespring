import { ProductGrid } from '../../../components/product-grid';
import { Filters } from '../../../components/plp/Filters';
import { getProducts } from '../../../lib/catalog';

export default async function BadgePage({ params, searchParams }: { params: { badge: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const b = params.badge;
  const products = await getProducts({ filters: { badge: [b] } });
  const title = b === 'fast-ship-za' ? 'Fast Ship ZA' : b === 'local-pod' ? 'Little Spring Apparel' : b;
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Filters searchParams={{ ...searchParams, badge: b }} />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
