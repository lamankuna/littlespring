import { NAV } from '@littlespring/core';

function parseQueryArray(val?: string | string[] | null): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : val.split(',').filter(Boolean);
}

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function linkWith(next: Record<string, string | undefined>, current: URLSearchParams) {
  const params = new URLSearchParams(current);
  for (const [k, v] of Object.entries(next)) {
    if (v === undefined || v === '') params.delete(k);
    else params.set(k, v);
  }
  return `?${params.toString()}`;
}

export function Filters({
  searchParams,
  selectedCategory,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  selectedCategory?: string;
}) {
  const current = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (Array.isArray(v)) current.set(k, v.join(','));
    else if (v) current.set(k, v);
  });

  const age = parseQueryArray(searchParams.age as any);
  const badge = parseQueryArray(searchParams.badge as any);
  const cat = parseQueryArray(searchParams.category as any);
  const material = parseQueryArray(searchParams.material as any);
  const supplier = parseQueryArray(searchParams.supplier as any);

  const categories = NAV.pillars.flatMap((p) => p.children);
  const materials = ['silicone', 'cotton', 'bamboo', 'polyester', 'glass'];
  const suppliers = ['4akid', 'wonderprint', 'bigbuy'];
  const priceQuick: [string, [number, number]][] = [
    ['Under R200', [0, 200]],
    ['R200–R500', [200, 500]],
    ['R500–R1000', [500, 1000]],
  ];

  return (
    <aside className="space-y-6">
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <div className="font-semibold mb-3">Filters</div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-black/60">Age</div>
          <div className="flex flex-wrap gap-2">
            {NAV.ages.map((v) => {
              const next = toggleInArray(age, v);
              return (
                <a key={v} href={linkWith({ age: next.join(',') || undefined }, current)} className={`text-xs rounded-full px-2 py-1 ${age.includes(v) ? 'bg-[#7ED9A3] text-black' : 'bg-black/5 hover:bg-black/10'}`}>{v}</a>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-black/60">Badge</div>
          <div className="flex flex-wrap gap-2">
            {NAV.badges.map((b) => {
              const next = toggleInArray(badge, b);
              const label = b === 'fast-ship-za' ? 'Fast Ship ZA' : 'Little Spring Apparel';
              return (
                <a key={b} href={linkWith({ badge: next.join(',') || undefined }, current)} className={`text-xs rounded-full px-2 py-1 ${badge.includes(b) ? 'bg-[#FFC8A2] text-black' : 'bg-black/5 hover:bg-black/10'}`}>{label}</a>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-black/60">Category</div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-auto pr-1">
            {categories.map((c) => {
              const next = toggleInArray(cat, c);
              return (
                <a key={c} href={linkWith({ category: next.join(',') || undefined }, current)} className={`text-xs rounded-full px-2 py-1 ${cat.includes(c) ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'}`}>{c}</a>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-black/60">Material</div>
          <div className="flex flex-wrap gap-2">
            {materials.map((m) => {
              const next = toggleInArray(material, m);
              return (
                <a key={m} href={linkWith({ material: next.join(',') || undefined }, current)} className={`text-xs rounded-full px-2 py-1 ${material.includes(m) ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'}`}>{m}</a>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-black/60">Supplier</div>
          <div className="flex flex-wrap gap-2">
            {suppliers.map((s) => {
              const next = toggleInArray(supplier, s);
              return (
                <a key={s} href={linkWith({ supplier: next.join(',') || undefined }, current)} className={`text-xs rounded-full px-2 py-1 ${supplier.includes(s) ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10'}`}>{s}</a>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-black/60">Price</div>
          <div className="flex flex-wrap gap-2">
            {priceQuick.map(([label, [min,max]]) => (
              <a key={label} href={linkWith({ price: `${min}-${max}` }, current)} className="text-xs rounded-full bg-black/5 px-2 py-1 hover:bg-black/10">{label}</a>
            ))}
            <a href={linkWith({ price: undefined }, current)} className="text-xs rounded-full bg-black/5 px-2 py-1 hover:bg-black/10">Clear</a>
          </div>
        </div>
      </div>
    </aside>
  );
}
