import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { freightCalculateServer } from '../../../../lib/cj';

const Schema = z.object({
  destination: z
    .object({ countryCode: z.string().default('ZA'), province: z.string().optional(), city: z.string().optional(), postalCode: z.string().optional(), address: z.string().optional(), phone: z.string().optional() })
    .optional(),
  lines: z.array(z.object({ cjVid: z.string().min(1), quantity: z.number().int().positive() })).min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));
  const body = Schema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  try {
    const options = await freightCalculateServer({ destination: body.data.destination || { }, lines: body.data.lines });
    return NextResponse.json({ options });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'freight error' }, { status: 500 });
  }
}

