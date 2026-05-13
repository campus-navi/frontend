const RECENT_OFFICIAL_POST_SEARCHES_KEY = 'campusNavi:recentOfficialPostSearches';
const MAX_RECENT_OFFICIAL_POST_SEARCHES = 10;

export function getRecentOfficialPostSearches() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(RECENT_OFFICIAL_POST_SEARCHES_KEY);
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  } catch {
    return [];
  }
}

export function saveRecentOfficialPostSearches(searches: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      RECENT_OFFICIAL_POST_SEARCHES_KEY,
      JSON.stringify(searches.slice(0, MAX_RECENT_OFFICIAL_POST_SEARCHES)),
    );
  } catch {
    return;
  }
}

export function addRecentOfficialPostSearch(searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim();

  if (!normalizedSearchTerm) {
    return getRecentOfficialPostSearches();
  }

  const nextSearches = [
    normalizedSearchTerm,
    ...getRecentOfficialPostSearches().filter((item) => item !== normalizedSearchTerm),
  ].slice(0, MAX_RECENT_OFFICIAL_POST_SEARCHES);

  saveRecentOfficialPostSearches(nextSearches);

  return nextSearches;
}

export function removeRecentOfficialPostSearch(searchTerm: string) {
  const nextSearches = getRecentOfficialPostSearches().filter((item) => item !== searchTerm);

  saveRecentOfficialPostSearches(nextSearches);

  return nextSearches;
}

export function clearRecentOfficialPostSearches() {
  saveRecentOfficialPostSearches([]);

  return [];
}
