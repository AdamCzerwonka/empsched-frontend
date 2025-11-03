export function sanitizeParams<T extends Record<string, any>>(
  obj: T | undefined
): Partial<T> | undefined {
  if (!obj) return undefined;

  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      return (
        value !== undefined &&
        value !== null &&
        (typeof value !== "string" || value.trim() !== "")
      );
    })
  ) as Partial<T>;
}
