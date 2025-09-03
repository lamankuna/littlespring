"use client";
import Link from 'next/link';
import { useState } from 'react';
import { NAV } from '@littlespring/core';

export function GuidedFinder() {
  const tabs: ('category'|'age'|'need')[] = ['category','age','need'];
  const [active, setActive] = useState<'category'|'age'|'need'>('category');
  return (
    <section className="rounded-xl border border-black/10 bg-white p-6">
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActive(t)} className={`px-3 py-1.5 rounded-md text-sm ${active===t?'bg-black text-white':'bg-black/5 hover:bg-black/10'}`}>{t === 'category' ? 'By Category' : t==='age' ? 'By Age' : 'By Need'}</button>
        ))}
      </div>
      {active === 'category' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NAV.pillars.map((p) => (
            <Link key={p.slug} href={`/c/${p.slug}`} className="rounded-lg border border-black/10 p-4 hover:shadow">
              <div className="font-medium">{p.label}</div>
              <div className="text-sm text-black/60">{p.children.length} subcategories</div>
            </Link>
          ))}
        </div>
      )}
      {active === 'age' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {NAV.ages.map((a) => (
              <Link key={a} href={`/age/${a}`} className="text-xs rounded-full bg-black/5 px-2 py-1 hover:bg-black/10">{a}</Link>
            ))}
          </div>
        </div>
      )}
      {active === 'need' && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/c/weaning-starter" className="rounded-lg border border-black/10 p-4 hover:shadow">
            <div className="font-medium">Weaning starter set</div>
            <div className="text-sm text-black/60">Ready-to-go feeding basics</div>
          </Link>
          <Link href="/c/bathtime-kit" className="rounded-lg border border-black/10 p-4 hover:shadow">
            <div className="font-medium">Bathtime kit</div>
            <div className="text-sm text-black/60">Soft towels and rinsers</div>
          </Link>
          <Link href="/c/stroller-setup" className="rounded-lg border border-black/10 p-4 hover:shadow">
            <div className="font-medium">Stroller setup</div>
            <div className="text-sm text-black/60">Hooks and organizers</div>
          </Link>
        </div>
      )}
    </section>
  );
}

