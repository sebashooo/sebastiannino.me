/** First focusable element on every page. Visible only while focused. Target: <main id="main">. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-button focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
    >
      Skip to content
    </a>
  );
}
