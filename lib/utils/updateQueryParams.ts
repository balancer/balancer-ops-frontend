// Updates the current URL's query string in place via history.replaceState,
// so deep links stay shareable as the user changes selections without
// triggering a navigation or re-running route effects.
//
// Pass `null` or "" to remove a param.
export function updateQueryParams(params: Record<string, string | null | undefined>) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }
  window.history.replaceState({ ...window.history.state }, "", url.toString());
}
