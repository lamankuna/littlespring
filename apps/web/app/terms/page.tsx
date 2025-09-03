import Terms from '@littlespring/legal/terms.mdx';

export default function TermsPage() {
  return (
    <article className="prose prose-sm max-w-none prose-headings:font-semibold">
      {/* @ts-expect-error mdx */}
      <Terms />
    </article>
  );
}

