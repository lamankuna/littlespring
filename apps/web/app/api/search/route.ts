import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '../../../lib/catalog';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const products = await getProducts({});
  const filtered = products
    .filter((p) => !q || p.title.toLowerCase().includes(q))
    .slice(0, 10)
    .map((p) => ({ slug: p.slug, title: p.title }));
  return NextResponse.json({ products: filtered });
}

