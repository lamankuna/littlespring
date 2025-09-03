import { NextRequest, NextResponse } from 'next/server';
import { paystack } from '@littlespring/payments';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { amountZAR, email } = body || {};
  const result = await paystack.init({ amountZAR: Number(amountZAR) || 0, email: String(email || '') });
  return NextResponse.json(result);
}

