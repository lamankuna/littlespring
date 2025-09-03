"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV } from '@littlespring/core';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <>
      <button aria-label="Open menu" className="p-2 rounded-md hover:bg-black/5 lg:hidden" onClick={() => setOpen(true)}>
        ☰
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div ref={panelRef} className="ml-auto h-full w-80 max-w-[90vw] bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Menu</div>
              <button aria-label="Close menu" className="p-2 rounded-md hover:bg-black/5" onClick={() => setOpen(false)}>✕</button>
            </div>
            <input placeholder="Search" className="w-full mb-4 rounded-md border border-black/10 p-2" />

            <div className="space-y-2">
              {NAV.pillars.map((p) => (
                <details key={p.slug} className="rounded-md border border-black/10">
                  <summary className="cursor-pointer list-none px-3 py-2 font-medium">{p.label}</summary>
                  <div className="px-3 pb-3 flex flex-wrap gap-2">
                    {p.children.map((c) => (
                      <Link key={c} href={`/c/${c}`} className="text-xs rounded-full bg-black/5 px-2 py-1 hover:bg-black/10" onClick={() => setOpen(false)}>
                        {c}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-sm text-black/60 mb-2">Shop by Age</div>
              <div className="flex flex-wrap gap-2">
                {NAV.ages.map((a) => (
                  <Link key={a} href={`/age/${a}`} className="text-xs rounded-full bg-black/5 px-2 py-1 hover:bg-black/10" onClick={() => setOpen(false)}>
                    {a}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-black/60 mb-2">Badges</div>
              <div className="flex flex-wrap gap-2">
                <Link href="/b/fast-ship-za" className="text-xs rounded-full bg-[#E6F8EE] px-2 py-1" onClick={() => setOpen(false)}>Fast Ship ZA</Link>
                <Link href="/b/local-pod" className="text-xs rounded-full bg-[#FFF0E7] px-2 py-1" onClick={() => setOpen(false)}>Little Spring Apparel</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
