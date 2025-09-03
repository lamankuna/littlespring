import Returns from '@littlespring/legal/returns.mdx';

export default function ReturnsPage() {
  return (
    <article className="prose prose-sm max-w-none prose-headings:font-semibold">
      {/* @ts-expect-error mdx */}
      <Returns />
    </article>
  );
}

