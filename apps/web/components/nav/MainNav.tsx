"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV } from '@littlespring/core';
import { usePathname, useSearchParams } from 'next/navigation';

export function MainNav() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!panelRef.current || !btnRef.current) return;
      if (!panelRef.current.contains(e.target as Node) && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const pathname = usePathname();
  const params = useSearchParams();
  const activeAgePath = pathname?.startsWith('/age/') ? pathname.split('/age/')[1]?.split(/[/?#]/)[0] : null;
  const activeAgesQuery = (params?.get('age') || '').split(',').filter(Boolean);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') setOpen(true);
        }}
        className="px-3 py-2 rounded-md hover:bg-black/5"
      >
        Shop
      </button>
      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Shop mega menu"
          className="absolute left-0 mt-2 w-[900px] max-w-[95vw] rounded-xl border border-black/10 bg-white shadow-xl p-6 grid grid-cols-3 gap-6"
        >
          <div>
            <div className="font-semibold mb-3">Pillars</div>
            <ul className="space-y-1">
              {NAV.pillars.map((p) => (
                <li key={p.slug}>
                  <Link href={`/c/${p.slug}`} className="block rounded-md px-2 py-1 hover:bg-black/5">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Shop by Age</div>
            <div className="flex flex-wrap gap-2">
              {NAV.ages.map((a) => {
                const selected = activeAgePath === a || activeAgesQuery.includes(a);
                return (
                  <Link
                    key={a}
                    href={`/age/${a}`}
                    aria-checked={selected}
                    role="menuitemradio"
                    className={`inline-flex items-center gap-1 text-xs rounded-full border px-2.5 py-1 transition ${selected ? 'bg-[#7ED9A3] border-transparent text-black' : 'bg-black/5 border-black/10 hover:bg-black/10'}`}
                  >
                    {selected && <span aria-hidden>✓</span>}
                    <span>{a}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <FeatureTile href="/c/feeding-sets" title="Feeding Sets" subtitle="Mix & match essentials" />
            <FeatureTile href="/c/apparel" title="Little Spring Apparel" subtitle="Little Spring branded" />
            <FeatureTile href="/b/fast-ship-za" title="Fast Ship ZA" subtitle="Quick to your door" />
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureTile({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link href={href} className="block rounded-lg border border-black/10 p-3 hover:shadow">
      <div className="text-sm text-black/60">{subtitle}</div>
      <div className="font-semibold">{title}</div>
    </Link>
  );
}
