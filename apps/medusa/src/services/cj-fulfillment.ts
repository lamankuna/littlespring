/**
 * CJ fulfillment provider (Medusa v1 compatible shape).
 *
 * Note: This file avoids a hard dependency on Medusa types to keep the build green
 * in this repo. In a real Medusa project, extend AbstractFulfillmentService from
 * `@medusajs/medusa` and wire via the loaders. The public API methods below match
 * Medusa v1 expectations.
 */
import { cj, CjClient } from '../loaders/cj';

type Currency = 'ZAR' | 'USD';

export interface FulfillmentOption {
  id: string;
  name: string;
  amount: number; // in minor units (ZAR cents)
  currency: Currency;
  data: { logisticName: string; eta?: { min?: number; max?: number } };
}

export interface CartLineLike {
  quantity: number;
  variant: { id: string; metadata?: Record<string, any> };
}

export interface CartLike {
  id: string;
  region?: { currency_code?: string; country_code?: string } | null;
  items: CartLineLike[];
  shipping_address?: Partial<{
    country_code: string; province?: string; city?: string; postal_code?: string; address_1?: string; phone?: string;
  }> | null;
  metadata?: Record<string, any>;
}

/** Basic FX conversion placeholder. Replace with a real service later. */
export function usdToZar(usd: number, rate = Number(process.env.FX_USD_TO_ZAR || 18.5)) {
  return usd * rate;
}

/**
 * Maps a Medusa-like cart to CJ freight options.
 */
export async function getFulfillmentOptionsFromCart(cart: CartLike, client: CjClient = cj): Promise<FulfillmentOption[]> {
  const lines = cart.items
    .map((i) => ({ vid: String(i.variant?.metadata?.cj_vid || ''), quantity: i.quantity }))
    .filter((l) => !!l.vid);
  if (!lines.length) return [];
  const addr = cart.shipping_address || {};
  const res = await client.freightCalculate({
    endCountryCode: (addr.country_code || process.env.COUNTRY_CODE || 'ZA').toUpperCase(),
    province: addr.province,
    city: (addr as any).city,
    postalCode: addr.postal_code,
    address: addr.address_1,
    phone: addr.phone,
    lines,
  });
  const currency = (cart.region?.currency_code || process.env.CURRENCY || 'ZAR').toUpperCase() as Currency;
  return (res.logisticList || []).map((o, idx) => {
    const amountZar = o.currency === 'USD' ? Math.round(usdToZar(o.price) * 100) : Math.round(o.price * 100);
    return {
      id: `${o.logisticName}-${idx}`,
      name: o.logisticName,
      amount: amountZar,
      currency,
      data: { logisticName: o.logisticName, eta: { min: o.dayMin, max: o.dayMax } },
    } satisfies FulfillmentOption;
  });
}

/** Validates the selected option against CJ quotes for the current cart. */
export async function validateOption(cart: CartLike, selectedLogisticName: string, client: CjClient = cj) {
  const options = await getFulfillmentOptionsFromCart(cart, client);
  const found = options.find((o) => o.data.logisticName === selectedLogisticName);
  if (!found) throw new Error(`Invalid logistic option: ${selectedLogisticName}`);
  return found;
}

/** Calculates the price for a selected CJ option. */
export async function calculatePrice(cart: CartLike, selectedLogisticName: string, client: CjClient = cj) {
  const opt = await validateOption(cart, selectedLogisticName, client);
  return opt.amount;
}

export interface OrderLike {
  id: string;
  email?: string;
  shipping_address?: Partial<{ first_name: string; last_name: string; address_1: string; city: string; province?: string; postal_code?: string; country_code: string; phone?: string }>;
  items: CartLineLike[];
  metadata?: Record<string, any>;
}

/**
 * Creates a CJ order when a Medusa order is paid.
 * Stores returned cjOrderId and initial tracking if available (via the provided persistence callback).
 */
export async function createCjFulfillment(params: {
  order: OrderLike;
  logisticName: string;
  persist: (data: { orderId: string; metadata: Record<string, any> }) => Promise<void>;
  client?: CjClient;
}) {
  const { order, logisticName } = params;
  const client = params.client || cj;
  const lines = order.items
    .map((i) => ({ vid: String(i.variant?.metadata?.cj_vid || ''), quantity: i.quantity }))
    .filter((l) => !!l.vid);
  if (!lines.length) throw new Error('No CJ VIDs found on order variants');

  const addr = order.shipping_address || {};
  const payload = {
    endCountryCode: (addr.country_code || process.env.COUNTRY_CODE || 'ZA').toUpperCase(),
    recipient: `${addr.first_name || ''} ${addr.last_name || ''}`.trim() || order.email,
    phone: addr.phone,
    address: addr.address_1,
    city: addr.city,
    province: addr.province,
    postalCode: addr.postal_code,
    email: order.email,
    logisticName,
    productList: lines,
  } as const;
  const res = await client.createOrderV2(payload as unknown as Record<string, unknown>);
  const cjOrderId = (res as any).cjOrderId || (res as any).id || 'unknown';
  await params.persist({ orderId: order.id, metadata: { cjOrderId } });
  return { cjOrderId };
}

/** Attempts to cancel a CJ order; CJ may not allow cancellation at all stages. */
export async function cancelCjFulfillment(cjOrderId: string): Promise<never> {
  // CJ cancel API is not publicly documented in all accounts; document behavior:
  throw new Error(`CJ order ${cjOrderId} cannot be cancelled via API in this integration.`);
}

