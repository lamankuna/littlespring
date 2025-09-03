export function AnalyticsPlaceholders() {
  const enabled = process.env.FEATURE_ENABLE_ANALYTICS === 'true';
  if (!enabled) return null;
  const gaId = process.env.NEXT_PUBLIC_GA4_ID || '';
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || '';
  return (
    <>
      {/* GA4 placeholder */}
      {gaId && (
        <script dangerouslySetInnerHTML={{ __html: `/* GA4(${gaId}) placeholder */` }} />
      )}
      {/* Sentry placeholder */}
      {sentryDsn && (
        <script dangerouslySetInnerHTML={{ __html: `/* Sentry(${sentryDsn}) placeholder */` }} />
      )}
    </>
  );
}

