import { NextRequest, NextResponse } from 'next/server';
import { WonderprintWoo } from '@littlespring/suppliers';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const res = WonderprintWoo.handleWebhook(body);
  return NextResponse.json(res);
}

