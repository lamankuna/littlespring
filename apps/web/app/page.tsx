import Link from 'next/link';
import { etaFor } from '@littlespring/core';
import { getFeaturedCollections, getProducts } from '../lib/catalog';
import { ProductGrid } from '../components/product-grid';
import { Suspense } from 'react';
import { GuidedFinder } from '../components/home/GuidedFinder';

export default async function HomePage() {
  const collections = await getFeaturedCollections();
  const products = await getProducts({ limit: 12 });
  const bigbuyEta = etaFor('bigbuy');
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-8 shadow-sm border border-black/10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Fast-ship baby & kids essentials</h1>
            <p className="text-black/70">Calm, spring, safety-first. Shop handpicked essentials with clear ETAs. {bigbuyEta.showAddToCart ? '' : 'EU items may show as unavailable if slower than 7 business days.'}</p>
            <div className="flex gap-3">
              <Link href="/collections" className="inline-flex items-center rounded-md bg-[#7ED9A3] px-4 py-2 text-black font-medium hover:bg-[#68c88f]">Browse collections</Link>
              <Link href="/about" className="inline-flex items-center rounded-md bg-black/5 px-4 py-2 hover:bg-black/10">About</Link>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-[#E6F8EE] to-[#FFF0E7]" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Featured collections</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections?c=${encodeURIComponent(c.slug)}`} className="block rounded-xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-md transition">
              <div className="h-32 rounded-md bg-black/5 mb-3" />
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-black/60">{c.count} items</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Popular right now</h2>
        <ProductGrid products={products} />
      </section>

      <GuidedFinder />

      <section className="rounded-xl border border-black/10 bg-white p-6">
        <h3 className="text-lg font-semibold mb-2">Little Spring Apparel</h3>
        <p className="text-black/70 mb-3">Branded apparel with quick local turnaround.</p>
        <Link href="/c/apparel" className="inline-flex items-center rounded-md bg-[#FFC8A2] px-4 py-2 text-black font-medium hover:bg-[#f7b48b]">Explore apparel</Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">💨 Fast Ship ZA</h2>
        <Suspense>
          {/* Inline fetch for badge filtered products */}
          {/* @ts-expect-error Async Server Component */}
          <RowByBadge badge="fast-ship-za" />
        </Suspense>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">🎨 Little Spring Apparel</h2>
        <Suspense>
          {/* @ts-expect-error Async Server Component */}
          <RowByBadge badge="local-pod" />
        </Suspense>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Free 0–3m checklist (PDF)</h3>
          <p className="text-black/70">New parent? Download our simple starter checklist.</p>
        </div>
        <Link href="/checklists/0-3m.pdf" className="inline-flex items-center rounded-md bg-[#7ED9A3] px-4 py-2 text-black font-medium hover:bg-[#68c88f]">Download</Link>
      </section>
    </div>
  );
}

// GuidedFinder moved to a client component in components/home/GuidedFinder.tsx

async function RowByBadge({ badge }: { badge: 'fast-ship-za'|'local-pod' }) {
  const products = await getProducts({ filters: { badge: [badge] }, limit: 6 });
  return <ProductGrid products={products} />;
}
