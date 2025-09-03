/**
 * CJ Dropshipping client wrapper with token caching and fetch helpers.
 * Node 18+ required (uses global fetch).
 */

export interface CjClientOptions {
  host?: string;
  email?: string;
  password?: string;
  platformToken?: string | null;
  timeoutMs?: number;
}

interface TokenCache {
  accessToken: string;
  /** epoch ms */
  expiresAt: number;
  /** epoch ms; guard re-fetch at least 5 minutes apart. */
  lastFetchAt: number;
}

/** Minimal CJ response envelope. */
interface CjResponse<T> {
  code: number;
  message?: string;
  data?: T;
}

const FIVE_MIN = 5 * 60 * 1000;

export class CjClient {
  private host: string;
  private email: string;
  private password: string;
  private platformToken?: string | null;
  private timeoutMs: number;
  private token?: TokenCache;

  constructor(opts: CjClientOptions = {}) {
    this.host = (opts.host || process.env.CJ_API_HOST || 'https://developers.cjdropshipping.com').replace(/\/$/, '');
    this.email = opts.email || process.env.CJ_EMAIL || '';
    this.password = opts.password || process.env.CJ_PASSWORD || '';
    this.platformToken = opts.platformToken ?? process.env.CJ_PLATFORM_TOKEN ?? null;
    this.timeoutMs = Number(opts.timeoutMs ?? process.env.CJ_TIMEOUT_MS ?? 10000);
  }

  /** Returns a cached access token; refetches at most once per 5 minutes. */
  async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.token && this.token.expiresAt > now + 30_000) {
      return this.token.accessToken;
    }
    if (this.token && now - this.token.lastFetchAt < FIVE_MIN) {
      // Within 5-minute guard window: reuse token even if expiring soon.
      return this.token.accessToken;
    }
    const url = `${this.host}/api2.0/v1/auth/accessToken`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`CJ auth failed: ${res.status}`);
      const json = (await res.json()) as CjResponse<{ accessToken: string; expiresIn?: number }>;
      if (!json.data?.accessToken) throw new Error(`CJ auth error: ${json.message || 'no token'}`);
      const expiresInMs = (json.data.expiresIn ?? 60 * 60) * 1000; // default 1h if not present
      this.token = {
        accessToken: json.data.accessToken,
        expiresAt: Date.now() + expiresInMs,
        lastFetchAt: Date.now(),
      };
      return this.token.accessToken;
    } finally {
      clearTimeout(t);
    }
  }

  private async cjFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await this.getAccessToken();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${this.host}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          'CJ-Access-Token': token,
          ...(this.platformToken ? { 'CJ-Platform-Token': this.platformToken } : {}),
          ...(init?.headers || {}),
        },
        signal: ctrl.signal,
      });
      const json = (await res.json()) as CjResponse<T> | T;
      // Some endpoints may return plain data; tolerate both shapes.
      const data = (json as any).data ?? json;
      if (!res.ok) throw new Error(`CJ error ${res.status}: ${(json as any).message || res.statusText}`);
      return data as T;
    } finally {
      clearTimeout(t);
    }
  }

  /** Freight calculation for ZA shipments. */
  async freightCalculate(params: {
    endCountryCode?: string;
    province?: string;
    city?: string;
    postalCode?: string;
    address?: string;
    phone?: string;
    lines: { vid: string; quantity: number }[];
  }): Promise<{
    logisticList: Array<{ logisticName: string; price: number; currency?: string; dayMin?: number; dayMax?: number }>
  }> {
    const payload = {
      endCountryCode: params.endCountryCode || process.env.COUNTRY_CODE || 'ZA',
      productList: params.lines.map((l) => ({ vid: l.vid, quantity: l.quantity })),
      // Optional address fields can be included as per CJ docs
      province: params.province,
      city: params.city,
      postalCode: params.postalCode,
      address: params.address,
      phone: params.phone,
    };
    return this.cjFetch('/api2.0/v1/logistic/freightCalculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /** Create CJ order (V2). */
  async createOrderV2(payload: Record<string, unknown>): Promise<{ cjOrderId: string }> {
    return this.cjFetch('/api2.0/v1/order/createOrderV2', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /** Get product detail by CJ product id. */
  async getProductDetail(productId: string): Promise<Record<string, unknown>> {
    return this.cjFetch(`/api2.0/v1/product/getProductDetail?id=${encodeURIComponent(productId)}`);
  }

  /** List products (minimal; used by import script). */
  async listProducts(params: { categoryId?: string; page?: number; pageSize?: number }): Promise<Record<string, unknown>> {
    const qs = new URLSearchParams();
    if (params.categoryId) qs.set('categoryId', params.categoryId);
    if (params.page) qs.set('page', String(params.page));
    if (params.pageSize) qs.set('pageSize', String(params.pageSize));
    return this.cjFetch(`/api2.0/v1/product/list?${qs.toString()}`);
  }
}

export const cj = new CjClient();

