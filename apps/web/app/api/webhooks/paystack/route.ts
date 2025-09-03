import { NextRequest, NextResponse } from 'next/server';
import { paystack } from '@littlespring/payments';

export async function POST(req: NextRequest) {
  const enabled = process.env.FEATURE_ENABLE_CHECKOUT === 'true';
  const payload = await req.text();
  const sig = req.headers.get('x-paystack-signature');
  if (enabled) {
    const ok = paystack.verifyWebhookSignature(payload, sig);
    if (!ok) return new NextResponse('invalid signature', { status: 401 });
    // TODO: handle event
  }
  return new NextResponse('ok');
}

