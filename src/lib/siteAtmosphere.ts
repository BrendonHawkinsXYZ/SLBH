// One authored color for each hour of the visitor's local day, starting at 00:00.
export const SITE_HOURS = [
  { name: "Midnight blue", color: "#7186B9" },
  { name: "Iris", color: "#7A80BA" },
  { name: "Violet", color: "#8D80BD" },
  { name: "Mauve", color: "#A28AC7" },
  { name: "Lilac", color: "#BD99CE" },
  { name: "Rose", color: "#D7A0B7" },
  { name: "Blush", color: "#E8AEAB" },
  { name: "Peach", color: "#EDBA91" },
  { name: "Honey", color: "#E6BC69" },
  { name: "Straw", color: "#DDD17A" },
  { name: "Sage", color: "#BACD98" },
  { name: "Sea glass", color: "#91C8B6" },
  { name: "Sky", color: "#73BDCC" },
  { name: "Cerulean", color: "#83B4D6" },
  { name: "Periwinkle", color: "#9CAAD9" },
  { name: "Wisteria", color: "#BDA4D0" },
  { name: "Coral rose", color: "#DCA4B4" },
  { name: "Apricot", color: "#E9916E" },
  { name: "Terracotta", color: "#D9856B" },
  { name: "Clay rose", color: "#C67A79" },
  { name: "Wine", color: "#B8758F" },
  { name: "Mulberry", color: "#9D7BA4" },
  { name: "Amethyst", color: "#8A85B5" },
  { name: "Twilight blue", color: "#7989B8" },
] as const;

export function getSiteHorizon(date: Date) {
  const hour = date.getHours();
  const current = SITE_HOURS[hour].color;
  const next = SITE_HOURS[(hour + 1) % SITE_HOURS.length].color;
  return `color-mix(in oklab, ${current} ${100 - date.getMinutes() / 60 * 100}%, ${next})`;
}

export function getSiteDayProgress(date: Date) {
  return (date.getHours() * 60 + date.getMinutes()) / 1440;
}

// Match getSiteHorizon before the first paint, including the minute's blend.
// The client updater keeps it current without a server time zone or location lookup.
export const siteAtmosphereInit = `(() => {
  const colors = ${JSON.stringify(SITE_HOURS.map(({ color }) => color))};
  const date = new Date();
  const hour = date.getHours();
  const current = colors[hour];
  const next = colors[(hour + 1) % colors.length];
  const color = "color-mix(in oklab, " + current + " " + (100 - date.getMinutes() / 60 * 100) + "%, " + next + ")";
  document.documentElement.style.setProperty("--paper-horizon", color);
  document.documentElement.style.setProperty("--site-day-progress", String((hour * 60 + date.getMinutes()) / 1440));
})();`;
