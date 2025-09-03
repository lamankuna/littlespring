import Image from 'next/image';
import Link from 'next/link';
import { getCartServer, clearCartAction, removeFromCartAction } from './actions';
import { Button } from '@littlespring/ui';

function isCheckoutEnabled() {
  return process.env.FEATURE_ENABLE_CHECKOUT === 'true';
}

export default async function CartPage() {
  const lines = await getCartServer();
  const total = lines.reduce((acc, l) => acc + l.priceZar * (l.qty || 1), 0);
  const enabled = isCheckoutEnabled();
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Your cart</h1>
      {lines.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <p>Your cart is empty.</p>
          <div className="mt-3"><Link href="/collections" className="underline">Continue shopping</Link></div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {lines.map((l) => (
              <div key={l.id} className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-3">
                <div className="relative h-16 w-16 rounded-md bg-black/5 overflow-hidden">
                  {l.image && <Image src={l.image} alt={l.title} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{l.title}</div>
                  <div className="text-sm text-black/70">Qty: {l.qty || 1}</div>
                </div>
                <div className="font-semibold">R{l.priceZar.toFixed(0)}</div>
                <form action={removeFromCartAction.bind(null, l.id)}>
                  <Button variant="ghost" aria-label="Remove">Remove</Button>
                </form>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 space-y-4 h-fit">
            <div className="flex items-center justify-between">
              <div className="text-black/70">Subtotal</div>
              <div className="font-semibold">R{total.toFixed(0)}</div>
            </div>
            {enabled ? (
              <Link href="/checkout" className="inline-flex items-center justify-center rounded-md bg-[#7ED9A3] px-4 py-2 font-medium text-black hover:bg-[#68c88f] w-full">Proceed to checkout</Link>
            ) : (
              <ComingSoon />
            )}
            <form action={clearCartAction}>
              <Button variant="ghost" className="w-full">Clear cart</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="rounded-md border border-black/10 bg-[#FFF0E7] p-3 text-sm text-black/80">
      Checkout is coming soon. Meanwhile you can browse and add items.
    </div>
  );
}

