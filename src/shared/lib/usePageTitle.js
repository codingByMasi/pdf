// Sets the browser tab title for the current page.
import { useEffect } from 'react';
import { config } from '../../config.js';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${config.siteName}` : config.siteName;
  }, [title]);
}
