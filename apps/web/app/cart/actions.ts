"use server";
import { cookies } from 'next/headers';

export interface CartLine {
  id: string;
  title: string;
  priceZar: number;
  image?: string;
  qty?: number;
}

const CART_COOKIE = 'ls_cart';

function readCart(): CartLine[] {
  const raw = cookies().get(CART_COOKIE)?.value;
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function writeCart(lines: CartLine[]) {
  cookies().set(CART_COOKIE, JSON.stringify(lines), { path: '/', httpOnly: false });
}

export async function addToCartAction(line: CartLine) {
  const cart = readCart();
  const existing = cart.find((l) => l.id === line.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...line, qty: 1 });
  }
  writeCart(cart);
}

export async function removeFromCartAction(id: string) {
  const cart = readCart().filter((l) => l.id !== id);
  writeCart(cart);
}

export async function clearCartAction() {
  writeCart([]);
}

export async function getCartServer(): Promise<CartLine[]> {
  return readCart();
}

export async function addBundleToCartAction(lines: CartLine[]) {
  const cart = readCart();
  for (const line of lines) {
    const existing = cart.find((l) => l.id === line.id);
    if (existing) existing.qty = (existing.qty || 1) + 1;
    else cart.push({ ...line, qty: 1 });
  }
  writeCart(cart);
}
