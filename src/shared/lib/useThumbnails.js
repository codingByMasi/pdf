// Makes small page pictures of a PDF, one by one, and cleans them up afterwards.
import { useEffect, useState } from 'react';
import { config } from '../../config.js';
import { loadPdfjs } from './pdfjs.js';
import { friendlyErrorKey } from './friendlyError.js';

const THUMB_WIDTH = 240;
const idle = { status: 'idle', numPages: 0, urls: [], errorKey: '' };

export function useThumbnails(file) {
  const [state, setState] = useState(idle);

  useEffect(() => {
    if (!file) {
      setState(idle);
      return undefined;
    }
    let cancelled = false;
    let doc = null;
    const urls = [];
    setState({ ...idle, status: 'loading' });

    (async () => {
      try {
        const [pdfjs, buffer] = await Promise.all([loadPdfjs(), file.arrayBuffer()]);
        // pdf.js takes over the data it is given, so it gets its own copy.
        doc = await pdfjs.getDocument({ data: new Uint8Array(buffer).slice(), isEvalSupported: false }).promise;
        if (doc.numPages > config.limits.maxThumbPages) throw Object.assign(new Error('pages'), { errorKey: 'error.tooManyPages' });
        if (cancelled) return;
        setState({ status: 'loading', numPages: doc.numPages, urls: [], errorKey: '' });
        for (let n = 1; n <= doc.numPages; n += 1) {
          const page = await doc.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: THUMB_WIDTH / base.width });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
          page.cleanup();
          if (cancelled) return;
          urls.push(URL.createObjectURL(blob));
          setState((s) => ({ ...s, urls: [...urls] }));
        }
        if (!cancelled) setState((s) => ({ ...s, status: 'ready' }));
      } catch (error) {
        if (!cancelled) setState({ ...idle, status: 'error', errorKey: error?.errorKey ?? friendlyErrorKey(error) });
      }
    })();

    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
      doc?.destroy();
    };
  }, [file]);

  return state;
}
