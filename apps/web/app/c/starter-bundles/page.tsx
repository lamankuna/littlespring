import bundles from '../../../seed/bundles.json';
import { getProductBySlug } from '../../../lib/catalog';
import Image from 'next/image';
import { addBundleToCartAction } from '../../cart/actions';

export default async function BundlesPage() {
  const enriched = await Promise.all(
    (bundles as any[]).map(async (b) => {
      const items = await Promise.all(b.items.map((slug: string) => getProductBySlug(slug)));
      const products = items.filter(Boolean) as any[];
      const price = products.reduce((acc, p) => acc + p.priceZar, 0);
      return { ...b, products, price };
    })
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Starter Bundles</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {enriched.map((b) => (
          <form key={b.slug} action={async () => {
            'use server';
            await addBundleToCartAction(b.products.map((p: any) => ({ id: p.id, title: p.title, priceZar: p.priceZar, image: p.images[0] })));
          }} className="rounded-lg border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-black/70">{b.products.length} items</div>
              </div>
              <button className="rounded-md bg-[#7ED9A3] px-3 py-1.5 text-sm font-medium">Add bundle (R{b.price.toFixed(0)})</button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto py-1">
              {b.products.map((p: any) => (
                <div key={p.id} className="min-w-[120px] max-w-[120px]">
                  <div className="relative aspect-square rounded-md overflow-hidden bg-black/5">
                    {p.images[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" />}
                  </div>
                  <div className="mt-1 text-xs line-clamp-2">{p.title}</div>
                </div>
              ))}
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

