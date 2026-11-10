/** Uniformly choose a fresh opening, avoiding prior starting/displayed images. */
export function getRandomArtworkIndex(count: number, previous: number | readonly number[] = -1, random = Math.random): number {
  if (count <= 1) return 0;
  const history = typeof previous === "number" ? [previous] : previous;
  const excluded = new Set(history.filter(index => Number.isInteger(index) && index >= 0 && index < count));
  const all = Array.from({ length: count }, (_, index) => index);
  const fresh = all.filter(index => !excluded.has(index));
  // A small collection may have no unseen choice; still avoid its last image.
  const choices = fresh.length ? fresh : all.filter(index => index !== history[0]);
  return choices[Math.floor(random() * choices.length)];
}
