/** The footer marker shares the local clock and hourly color of the background. */
export function TimeOfDayTracker() {
  return <span className="site-time-tracker" aria-hidden="true">
    <span className="site-time-tracker__marker" />
  </span>;
}
