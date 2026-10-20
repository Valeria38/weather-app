export function formatTimeAtOffset(
  timestamp: number,
  offsetSeconds: number,
  locale?: string | string[],
) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }).format(new Date((timestamp + offsetSeconds) * 1000));
}
