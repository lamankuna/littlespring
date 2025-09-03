"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV } from '@littlespring/core';

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ slug: string; title: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
      if (!res.ok) return;
      const data = await res.json();
      setResults(data.products || []);
    };
    run().catch(() => {});
    return () => ctrl.abort();
  }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
      <div className="mx-auto mt-24 w-full max-w-xl rounded-xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, categories, ages" className="w-full rounded-md border border-black/10 p-2" />
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm font-medium mb-1">Products</div>
            <ul className="text-sm max-h-52 overflow-auto">
              {results.map((r) => (
                <li key={r.slug}><Link href={`/products/${r.slug}`} className="block rounded-md px-2 py-1 hover:bg-black/5" onClick={() => setOpen(false)}>{r.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Categories</div>
            <ul className="text-sm">
              {NAV.pillars.slice(0,5).map((p) => (
                <li key={p.slug}><Link href={`/c/${p.slug}`} className="block rounded-md px-2 py-1 hover:bg-black/5" onClick={() => setOpen(false)}>{p.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Ages</div>
            <div className="flex flex-wrap gap-2">
              {NAV.ages.map((a) => (
                <Link key={a} href={`/age/${a}`} className="text-xs rounded-full bg-black/5 px-2 py-1 hover:bg-black/10" onClick={() => setOpen(false)}>{a}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

