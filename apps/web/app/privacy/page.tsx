import Privacy from '@littlespring/legal/privacy.mdx';

export default function PrivacyPage() {
  return (
    <article className="prose prose-sm max-w-none prose-headings:font-semibold">
      {/* @ts-expect-error mdx */}
      <Privacy />
    </article>
  );
}

