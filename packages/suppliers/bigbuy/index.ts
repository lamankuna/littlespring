export interface ShippingOptionInput {
  dest: { country: string; province?: string; postalCode?: string };
  lines: { sku: string; qty: number; weightKg?: number }[];
}

export interface ShippingOption {
  carrier: string;
  service: string;
  etaBusinessDays: number;
  priceZar: number;
}

export async function getShippingOptions(input: ShippingOptionInput): Promise<ShippingOption[]> {
  const enabled = process.env.FEATURE_ENABLE_SUPPLIER_BIGBUY === 'true';
  void input;
  if (!enabled) {
    // Demo: show sample fast options
    return [
      { carrier: 'DHL', service: 'Express', etaBusinessDays: 5, priceZar: 299 },
      { carrier: 'UPS', service: 'Saver', etaBusinessDays: 7, priceZar: 239 },
    ];
  }
  // TODO: Call BigBuy Shipping Costs endpoint when enabled
  return [
    { carrier: 'BigBuyCarrier', service: 'Priority', etaBusinessDays: 6, priceZar: 310 },
  ];
}

export async function createOrder(order: unknown, carrier: string): Promise<{ disabled: boolean; message: string }>{
  const enabled = process.env.FEATURE_ENABLE_SUPPLIER_BIGBUY === 'true';
  void order; void carrier;
  if (!enabled) return { disabled: true, message: 'BigBuy adapter disabled by feature flag' };
  // TODO: Implement create order when enabled
  return { disabled: false, message: 'Stub: would create BigBuy order' };
}

export async function getTracking(externalId: string): Promise<{ disabled: boolean; message: string }>{
  const enabled = process.env.FEATURE_ENABLE_SUPPLIER_BIGBUY === 'true';
  void externalId;
  if (!enabled) return { disabled: true, message: 'BigBuy adapter disabled by feature flag' };
  return { disabled: false, message: 'Stub: would fetch BigBuy tracking' };
}

