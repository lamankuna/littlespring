import Delivery from '@littlespring/legal/delivery.mdx';

export default function DeliveryPage() {
  return (
    <article className="prose prose-sm max-w-none prose-headings:font-semibold">
      {/* @ts-expect-error mdx */}
      <Delivery />
    </article>
  );
}

