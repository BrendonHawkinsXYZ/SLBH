/** Uniformly choose an opening image, avoiding the previous opening when possible. */
export function getRandomArtworkIndex(count: number, previous = -1, random = Math.random): number {
  if (count <= 1) return 0;
  const excludePrevious = Number.isInteger(previous) && previous >= 0 && previous < count;
  const selected = Math.floor(random() * (count - (excludePrevious ? 1 : 0)));
  return excludePrevious && selected >= previous ? selected + 1 : selected;
}
