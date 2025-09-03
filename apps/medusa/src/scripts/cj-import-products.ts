#!/usr/bin/env tsx
/**
 * Minimal CJ → Medusa import script.
 *
 * Flags:
 *  --category <id>
 *  --limit <n>
 *  --only-my-products (ignored in this stub)
 */
import { cj } from '../loaders/cj';

function parseArgs() {
  const out: Record<string, string | boolean> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--only-my-products') out.onlyMyProducts = true;
    else if (a.startsWith('--')) { out[a.slice(2)] = argv[i + 1]; i++; }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const limit = Number(args.limit || 10);
  const cat = (args.category as string) || undefined;
  const list = await cj.listProducts({ categoryId: cat, page: 1, pageSize: limit });
  const products = (list as any).products || (list as any).list || [];
  console.log(`[cj-import] fetched ${products.length} items`);

  const admin = process.env.MEDUSA_ADMIN_URL;
  const token = process.env.MEDUSA_ADMIN_API_TOKEN;
  const margin = Number(process.env.MARGIN_PCT || 30);

  for (const p of products) {
    // Extract minimal fields (shape varies; adjust with your account’s schema)
    const title = p.name || p.title;
    const images: string[] = p.images || p.imageList || [];
    const variants = (p.variants || p.variantList || []).map((v: any) => ({
      title: v.name || v.sku,
      sku: v.sku,
      metadata: { cj_vid: String(v.vid || v.id) },
      inventory_quantity: v.stock ?? 0,
      prices: [{ currency_code: 'zar', amount: Math.round(((v.priceUsd || v.price || 1) * (1 + margin / 100)) * 18.5 * 100) }],
    }));

    if (admin && token) {
      // Example Admin API upsert (adjust to your custom endpoints or Medusa Admin endpoints)
      await fetch(`${admin}/cj/import/upsert-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, images, variants }),
      });
    } else {
      console.log('[cj-import] preview', { title, imagesCount: images.length, variants: variants.length });
    }
  }
}

main().catch((e) => {
  console.error('[cj-import] error', e);
  process.exit(1);
});

