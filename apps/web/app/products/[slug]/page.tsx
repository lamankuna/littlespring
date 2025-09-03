import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getPairsWith } from '../../../lib/catalog';
import { AddToCart } from './purchase';
import { Card } from '@littlespring/ui';
import { EtaBadge } from '../../../components/pdp/EtaBadge';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();
  const pairs = await getPairsWith(product.category, product.slug, 10);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="overflow-hidden">
        <div className="relative aspect-square bg-black/5">
          {product.images[0] && (
            <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
          )}
        </div>
        <div className="grid grid-cols-4 gap-2 p-3">
          {product.images.slice(0, 4).map((img, i) => (
            <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-black/5">
              <Image src={img} alt="thumb" fill className="object-cover" />
            </div>
          ))}
        </div>
      </Card>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{product.title}</h1>
          <div className="text-black/70">{product.blurb}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-semibold">R{product.priceZar.toFixed(0)}</div>
          <EtaBadge supplier={product.supplier} />
        </div>
        {product.ageTags?.length ? (
          <div className="flex flex-wrap gap-2">
            {product.ageTags.map((t) => (
              <Link key={t} href={`/age/${t}`} className="text-xs rounded-full bg-black/5 px-2 py-1 hover:bg-black/10">{t}</Link>
            ))}
          </div>
        ) : null}
        {product.variants?.length ? (
          <div>
            <div className="font-medium mb-2">Options</div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <span key={v.id} className="text-sm rounded-full bg-black/5 px-3 py-1">{v.title}</span>
              ))}
            </div>
          </div>
        ) : null}
        <AddToCart product={product} canAdd={eta.showAddToCart !== false} />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <div className="font-medium mb-2">Why parents love it</div>
            <ul className="list-disc pl-5 text-sm text-black/80 space-y-1">
              <li>Gentle materials and safe finishes</li>
              <li>Easy to clean and care</li>
              <li>Designed for everyday use</li>
            </ul>
          </Card>
          <Card className="p-4">
            <div className="font-medium mb-2">Safety & care</div>
            <div className="text-sm text-black/80 whitespace-pre-line">{product.safetyNotes || 'Always supervise infants. Follow age guidance.'}</div>
            <div className="text-sm text-black/80 mt-2 whitespace-pre-line">{product.careNotes || 'Wipe clean or gentle cycle. Air dry.'}</div>
          </Card>
        </div>
        {pairs.length ? (
          <div>
            <div className="font-medium mb-2">Pairs with</div>
            <div className="-mx-1 flex overflow-x-auto gap-2 py-1">
              {pairs.map((pp) => (
                <Link key={pp.id} href={`/products/${pp.slug}`} className="min-w-[160px] max-w-[160px] rounded-lg border border-black/10 bg-white p-2 hover:shadow">
                  <div className="relative aspect-square bg-black/5 rounded-md overflow-hidden">
                    {pp.images[0] && <Image src={pp.images[0]} alt={pp.title} fill className="object-cover" />}
                  </div>
                  <div className="mt-2 text-sm line-clamp-1">{pp.title}</div>
                  <div className="text-sm font-semibold">R{pp.priceZar.toFixed(0)}</div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
