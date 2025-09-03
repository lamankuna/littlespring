import Image from 'next/image';
import Link from 'next/link';
import { Badge, Card } from '@littlespring/ui';
import type { ProductLite } from '@littlespring/core';
import { etaFor } from '@littlespring/core';

export function ProductGrid({ products }: { products: ProductLite[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const eta = etaFor(p.supplier);
        return (
          <Card key={p.id} className="overflow-hidden">
            <Link href={`/products/${p.slug}`}>
              <div className="relative aspect-square bg-black/5">
                {/* Using next/image with fill for performant loading; demo uses remote placeholders */}
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium line-clamp-1">{p.title}</h3>
                  <div className="text-sm font-semibold">R{p.priceZar.toFixed(0)}</div>
                </div>
                <div className="text-sm text-black/70 line-clamp-2">{p.blurb}</div>
                <div className="pt-2">
                  <Badge tone={p.supplier === 'wonderprint' ? 'peach' : 'mint'}>{eta.badge}</Badge>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
