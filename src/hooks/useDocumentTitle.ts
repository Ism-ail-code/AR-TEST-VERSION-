import { useEffect } from 'react';

const BASE_TITLE = 'Rapidify';

/** Keeps `document.title` in sync for the active route (cheap SEO polish). */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${BASE_TITLE}` : `${BASE_TITLE} — AR Commerce Platform`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
