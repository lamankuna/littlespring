import { NextRequest, NextResponse } from 'next/server';
import { paystack } from '@littlespring/payments';

export async function GET(req: NextRequest) {
  const reference = new URL(req.url).searchParams.get('reference') || '';
  const result = await paystack.verify(reference);
  return NextResponse.json(result);
}

