export default function CheckoutPage() {
  const enabled = process.env.FEATURE_ENABLE_CHECKOUT === 'true';
  if (!enabled) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-6 space-y-3">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p>Checkout is currently disabled while we finalise payments and logistics. Thank you for your patience!</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6">
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>
      <p className="text-black/70">Payments are enabled. Continue securely.</p>
    </div>
  );
}

