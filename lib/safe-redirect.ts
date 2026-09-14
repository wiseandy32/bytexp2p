/** Returns the value only if it is a safe in-app path (blocks open redirects). */
export function getSafeNext(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('/')) return null;
  if (value.startsWith('//') || value.startsWith('/\\')) return null;
  if (/[\r\n]/.test(value)) return null;
  return value;
}
