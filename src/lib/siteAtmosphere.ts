export const SITE_BLACKS = [
  { name: "Blue black", color: "#0D121E", startHour: 0 },
  { name: "Violet black", color: "#17101C", startHour: 4 },
  { name: "Green black", color: "#0D1915", startHour: 8 },
  { name: "Ochre black", color: "#1E1B10", startHour: 12 },
  { name: "Sienna black", color: "#21170F", startHour: 16 },
  { name: "Red black", color: "#211116", startHour: 20 },
] as const;

export function getSiteBlack(date: Date) {
  return SITE_BLACKS[Math.floor(date.getHours() / 4)];
}

// Select the visitor's local color before the first paint, using the same palette
// as the client updater. No server time zone or location lookup is involved.
export const siteAtmosphereInit = `(() => {
  const colors = ${JSON.stringify(SITE_BLACKS.map(({ color }) => color))};
  document.documentElement.style.setProperty("--paper", colors[Math.floor(new Date().getHours() / 4)]);
})();`;
