export const HOME_DAY_START_HOUR = 6;
export const HOME_DAY_END_HOUR = 18;

export function getHomeHeroMode(date: Date): "images" | "questions" {
  const hour = date.getHours();
  return hour >= HOME_DAY_START_HOUR && hour < HOME_DAY_END_HOUR ? "images" : "questions";
}
