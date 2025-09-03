import { ProductGrid } from '../../../components/product-grid';
import { Filters } from '../../../components/plp/Filters';
import { getProducts } from '../../../lib/catalog';

export default async function AgePage({ params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const age = params.slug;
  const products = await getProducts({ filters: { age: [age] } });
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Filters searchParams={{ ...searchParams, age }} />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Shop by age: {age}</h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

