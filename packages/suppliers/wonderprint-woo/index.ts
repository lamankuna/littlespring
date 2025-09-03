export interface WooOrderLine {
  product_id?: number;
  sku?: string;
  quantity: number;
}

export interface WooOrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: { first_name: string; last_name: string; email: string; phone?: string; address_1: string };
  shipping: { first_name: string; last_name: string; address_1: string };
  line_items: WooOrderLine[];
}

export async function createWooOrder(order: WooOrderPayload): Promise<{ disabled: boolean; status: number; message: string }>
{
  const enabled = process.env.FEATURE_ENABLE_SUPPLIER_WONDERPRINT === 'true';
  if (!enabled) return { disabled: true, status: 200, message: 'Wonderprint bridge disabled by feature flag' };

  const base = process.env.WONDERPRINT_WOO_BASE_URL;
  const key = process.env.WONDERPRINT_WOO_KEY;
  const secret = process.env.WONDERPRINT_WOO_SECRET;
  if (!base || !key || !secret) {
    return { disabled: true, status: 500, message: 'Wonderprint env not configured' };
  }

  // NOTE: This is a stub; real call intentionally omitted
  void order; // keep TS happy
  return { disabled: false, status: 200, message: 'Stub: would POST order to WooCommerce' };
}

export function handleWebhook(body: unknown): { ok: true } {
  // Accept order status/tracking updates; stubbed until enabled
  void body;
  return { ok: true };
}

