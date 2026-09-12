export const WATCH_HISTORY_KEY = 'marvel-atlas:watch-history:v1';

export function parseWatchHistory(raw: string | null, validIds: ReadonlySet<string>): string[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (
      !data ||
      typeof data !== 'object' ||
      !('version' in data) ||
      data.version !== 1 ||
      !('watchedIds' in data) ||
      !Array.isArray(data.watchedIds)
    )
      return [];
    return [
      ...new Set(
        data.watchedIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)),
      ),
    ].sort();
  } catch {
    return [];
  }
}

export function serializeWatchHistory(watchedIds: readonly string[]): string {
  return JSON.stringify({ version: 1, watchedIds: [...new Set(watchedIds)].sort() });
}
