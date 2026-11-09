// Loads the chosen picture file and gives its size and a preview address. Cleans up when the file changes.
import { useEffect, useState } from 'react';
import { loadImage } from './imageIO.js';

export function useImage(file) {
  const [state, setState] = useState({ status: 'empty' });
  useEffect(() => {
    if (!file) {
      setState({ status: 'empty' });
      return undefined;
    }
    let cancelled = false;
    let loaded = null;
    setState({ status: 'loading' });
    loadImage(file).then(
      (image) => {
        loaded = image;
        if (cancelled) URL.revokeObjectURL(image.url);
        else setState({ status: 'ready', ...image });
      },
      (error) => { if (!cancelled) setState({ status: 'error', errorKey: error.errorKey ?? 'error.imageBad' }); },
    );
    return () => {
      cancelled = true;
      if (loaded) URL.revokeObjectURL(loaded.url);
    };
  }, [file]);
  return state;
}
