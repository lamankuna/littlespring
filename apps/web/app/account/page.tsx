import Link from 'next/link';

export default function AccountIndex() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Your account</h1>
      <p className="text-black/70">Welcome back. View your <Link href="/account/orders" className="underline">orders</Link>.</p>
    </div>
  );
}

