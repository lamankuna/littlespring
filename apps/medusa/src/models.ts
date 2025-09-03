import { z } from 'zod';

export const Product = z.object({
  id: z.string(),
  title: z.string(),
});

export type Product = z.infer<typeof Product>;

export const SupplierProduct = z.object({
  supplier: z.enum(['4akid', 'wonderprint', 'bigbuy']),
  supplierProductId: z.string(),
  variantMap: z.record(z.string()).optional(),
  cost: z.number().optional(),
  leadTimeDays: z.number().optional(),
  warehouseRegion: z.string().optional(),
});

export const Order = z.object({ id: z.string() });
export const OrderItem = z.object({ id: z.string(), orderId: z.string(), productId: z.string(), qty: z.number() });
export const Payment = z.object({ id: z.string(), amount: z.number(), provider: z.string() });
export const SupplierOrder = z.object({ externalId: z.string(), carrier: z.string().optional(), trackingNo: z.string().optional(), trackUrl: z.string().optional() });

export const ContentBlock = z.object({ key: z.enum(['delivery', 'returns', 'terms', 'privacy']), body: z.string() });

