import type { Request, Response, Router } from 'express';
import express from 'express';

/**
 * CJ webhook router.
 * Mount under /cj/webhook in the Express app.
 *
 * Verifies optional IP allowlist (CJ_WEBHOOK_ALLOWLIST comma-separated), and processes
 * product/stock/order/logistic events. In this repo we log and optionally forward to Medusa Admin API if configured.
 */
const router: Router = express.Router();

function isAllowedIp(req: Request) {
  const allow = (process.env.CJ_WEBHOOK_ALLOWLIST || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!allow.length) return true;
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
  return allow.includes(ip);
}

router.post('/', async (req: Request, res: Response) => {
  try {
    if (!isAllowedIp(req)) return res.status(403).json({ ok: false });
    const evt = req.body || {};
    const type = (evt as any).type || (evt as any).event || 'unknown';
    const idempotencyKey = (evt as any).eventId || (evt as any).id || `${type}-${Date.now()}`;
    // TODO: store idempotencyKey to avoid duplicates (requires DB/Redis). For now, best-effort log only.

    // Handle logistics/tracking update
    if (type.toLowerCase().includes('logistic') || type.toLowerCase().includes('tracking')) {
      const payload = (evt as any).data || {};
      const tracking_number = payload.trackingNumber || payload.tracking_no;
      const tracking_url = payload.trackingUrl || payload.track_url;
      const cjOrderId = payload.cjOrderId || payload.orderId;
      await updateFulfillmentTracking({ cjOrderId, tracking_number, tracking_url });
    }

    // Handle stock/variant updates (shape varies by CJ account)
    if (type.toLowerCase().includes('stock') || type.toLowerCase().includes('variant') || type.toLowerCase().includes('product')) {
      // Extract variant vid and stock/price fields if present
      const d = (evt as any).data || {};
      if (d.vid) {
        await updateVariantByCjVid(d.vid, { inventory_quantity: d.stock ?? d.inventory, priceUsd: d.priceUsd });
      }
    }

    return res.json({ ok: true, idempotencyKey });
  } catch (err) {
    console.error('[CJ webhook] error', err);
    return res.status(200).json({ ok: true }); // Always 200 quickly per spec
  }
});

export default router;

async function updateFulfillmentTracking({ cjOrderId, tracking_number, tracking_url }: { cjOrderId?: string; tracking_number?: string; tracking_url?: string }) {
  if (!cjOrderId) return;
  const admin = process.env.MEDUSA_ADMIN_URL;
  const token = process.env.MEDUSA_ADMIN_API_TOKEN;
  if (!admin || !token) {
    console.log('[CJ webhook] tracking', { cjOrderId, tracking_number, tracking_url });
    return;
  }
  // Example: PATCH /admin/fulfillments/search?cjOrderId=... (pseudo; depends on your Medusa setup)
  try {
    await fetch(`${admin}/cj/fulfillments/by-cj/${encodeURIComponent(cjOrderId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tracking_number, tracking_url }),
    });
  } catch (e) {
    console.warn('[CJ webhook] failed to forward tracking to admin API', e);
  }
}

async function updateVariantByCjVid(vid: string, fields: { inventory_quantity?: number; priceUsd?: number }) {
  const admin = process.env.MEDUSA_ADMIN_URL;
  const token = process.env.MEDUSA_ADMIN_API_TOKEN;
  if (!admin || !token) {
    console.log('[CJ webhook] variant update', vid, fields);
    return;
  }
  try {
    await fetch(`${admin}/cj/variants/by-vid/${encodeURIComponent(vid)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(fields),
    });
  } catch (e) {
    console.warn('[CJ webhook] failed to forward variant update', e);
  }
}

