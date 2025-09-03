import crypto from 'node:crypto';

export interface InitInput {
  amountZAR: number;
  email: string;
}

export interface InitResponse {
  disabled?: true;
  message?: string;
  authorizationUrl?: string;
}

export function isCheckoutEnabled() {
  return process.env.FEATURE_ENABLE_CHECKOUT === 'true';
}

export async function init(input: InitInput): Promise<InitResponse> {
  if (!isCheckoutEnabled()) {
    return { disabled: true, message: 'Checkout disabled' };
  }
  // Stubbed init: would create Paystack transaction and return authorization URL
  void input;
  return { authorizationUrl: 'https://paystack.com/pay/placeholder' };
}

export async function verify(reference: string): Promise<{ disabled?: true; message?: string; status?: 'success' | 'failed' }>{
  if (!isCheckoutEnabled()) {
    return { disabled: true, message: 'Checkout disabled' };
  }
  void reference;
  return { status: 'success' };
}

export function verifyWebhookSignature(payload: string, headerSig: string | null | undefined): boolean {
  const secret = process.env.PAYSTACK_SECRET || '';
  if (!headerSig) return false;
  const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
  return hash === headerSig;
}

