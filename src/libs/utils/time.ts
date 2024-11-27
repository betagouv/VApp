export function msToMinutesAndSeconds(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(0);
  return `${m}m${s.padStart(2, '0')}s`;
}
