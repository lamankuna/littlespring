import { z } from 'zod';

export const PurchaseOrderSchema = z.object({
  orderId: z.string(),
  items: z.array(
    z.object({ sku: z.string(), quantity: z.number().int().positive(), title: z.string().optional() })
  ),
  shipping: z.object({ name: z.string(), address: z.string(), phone: z.string().optional() }),
});
export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;

export interface SendPurchaseOrderEmailResult {
  disabled: boolean;
  message: string;
}

export async function sendPurchaseOrderEmail(order: PurchaseOrder): Promise<SendPurchaseOrderEmailResult> {
  const enabled = process.env.FEATURE_ENABLE_SUPPLIER_4AKID === 'true';
  if (!enabled) {
    return { disabled: true, message: '4aKid adapter disabled by feature flag' };
  }
  // TODO: generate PDF + JSON attachment and send to FOUR_A_KID_EMAIL
  // For now, NOOP
  return { disabled: false, message: 'Stub: would send PO email to 4aKid' };
}

export function parseTrackingFromEmail(raw: string): { carrier?: string; trackingNo?: string } {
  // Parser stub (TODO): extract tracking details from supplier emails
  void raw;
  return {};
}

