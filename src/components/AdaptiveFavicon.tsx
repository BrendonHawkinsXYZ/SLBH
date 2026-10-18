// Keep a static PNG discoverable by crawlers, then select its theme early for Safari.
const faviconScript = `(() => {
  const theme = window.matchMedia("(prefers-color-scheme: dark)");
  const icon = document.querySelector('link[rel="icon"]') || document.createElement("link");
  icon.id = "slbh-favicon";
  icon.rel = "icon";
  icon.type = "image/png";
  icon.sizes = "32x32";

  const mask = document.createElement("link");
  mask.rel = "mask-icon";
  mask.href = "/safari-pinned-tab.svg";

  const update = () => {
    const href = theme.matches ? "/favicon-dark-32.png?v=3" : "/favicon-32.png?v=3";
    document.head.querySelectorAll('link[rel="icon"]').forEach((link) => {
      link.href = href;
      link.type = "image/png";
      link.sizes = "32x32";
    });
    mask.setAttribute("color", theme.matches ? "#fff" : "#000");
  };

  document.head.append(icon, mask);
  update();
  theme.addEventListener("change", update);

  // Next.js can restore static metadata during hydration and navigation.
  new MutationObserver((records) => {
    if (records.some((record) => Array.from(record.addedNodes).some(
      (node) => node.nodeName === "LINK" && node.rel === "icon"
    ))) update();
  }).observe(document.head, { childList: true });
})();`;

export function AdaptiveFavicon() {
  return (
    <>
      <script id="favicon-theme" dangerouslySetInnerHTML={{ __html: faviconScript }} />
      <noscript>
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" sizes="any" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000" />
      </noscript>
    </>
  );
}
