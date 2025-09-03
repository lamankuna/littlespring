function demoOrders() {
  return [
    {
      id: 'LS1001',
      placedAt: '2025-08-20',
      status: 'Shipped',
      trackingNo: 'ZA123456789',
      trackUrl: '#',
      items: [
        { title: 'Silicone Bib — Mint', qty: 1, priceZar: 149 },
        { title: 'Gentle Bath Mitt', qty: 2, priceZar: 89 },
      ],
    },
  ];
}

export default function OrdersPage() {
  const orders = demoOrders();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-lg border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order {o.id}</div>
              <div className="text-sm text-black/70">Placed {o.placedAt}</div>
            </div>
            <div className="mt-2 text-sm">{o.status} · Tracking: {o.trackingNo}</div>
            <div className="mt-3 text-sm text-black/80">{o.items.map(i => `${i.qty}× ${i.title}`).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

