/**
 * Server-only CJ client for Next.js API routes.
 */
export type FreightLine = { cjVid: string; quantity: number };
export type FreightOption = { id: string; logisticName: string; amount: number; currency: 'ZAR'; etaDays?: [number, number] };

function env(name: string, def?: string) { return process.env[name] || def || ''; }

async function getToken() {
  // lightweight: fetch fresh token per cold start; API is rate-limited so consider adding KV cache if needed
  const res = await fetch(`${env('CJ_API_HOST','https://developers.cjdropshipping.com')}/api2.0/v1/auth/accessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: env('CJ_EMAIL'), password: env('CJ_PASSWORD') }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`CJ auth failed: ${json?.message || res.status}`);
  return json.data?.accessToken as string;
}

export async function freightCalculateServer(params: { destination?: Partial<{ province: string; city: string; postalCode: string; address: string; phone: string }>; lines: FreightLine[] }): Promise<FreightOption[]> {
  const token = await getToken();
  const payload = {
    endCountryCode: (process.env.COUNTRY_CODE || 'ZA').toUpperCase(),
    productList: params.lines.map((l) => ({ vid: l.cjVid, quantity: l.quantity })),
    ...params.destination,
  };
  const res = await fetch(`${env('CJ_API_HOST','https://developers.cjdropshipping.com')}/api2.0/v1/logistic/freightCalculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token,
      ...(env('CJ_PLATFORM_TOKEN') ? { 'CJ-Platform-Token': env('CJ_PLATFORM_TOKEN') } : {}),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`CJ freight error: ${json?.message || res.status}`);
  const list = json.data?.logisticList || json.logisticList || [];
  const rate = Number(process.env.FX_USD_TO_ZAR || 18.5);
  return list.map((o: any, i: number) => {
    const priceZar = o.currency === 'USD' ? o.price * rate : o.price;
    return { id: `${o.logisticName}-${i}`, logisticName: o.logisticName, amount: Math.round(priceZar * 100), currency: 'ZAR', etaDays: [o.dayMin, o.dayMax] as [number, number] };
  });
}

