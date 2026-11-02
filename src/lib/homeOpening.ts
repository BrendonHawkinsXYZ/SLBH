export const HOME_OPENING_STORAGE_KEY = "slbh-home-intro-seen";

// Runs in the head, before the homepage can paint. No server cookie or request
// is needed for this browser-local preference; returning visits skip the intro.
export const homeOpeningInit = `(() => {
  if (window.location.pathname !== "/") return;
  const root = document.documentElement;
  let seen = false;
  try { seen = localStorage.getItem(${JSON.stringify(HOME_OPENING_STORAGE_KEY)}) === "1"; } catch {}
  const skip = seen || !!window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.dataset.homeOpening = skip ? "ready" : "intro";
  if (!skip) window.setTimeout(() => {
    if (root.dataset.homeOpening && root.dataset.homeOpening !== "ready") {
      root.dataset.homeOpening = "ready";
      document.dispatchEvent(new Event("slbh-home-opening-skip"));
    }
  }, 10000);
})();`;
