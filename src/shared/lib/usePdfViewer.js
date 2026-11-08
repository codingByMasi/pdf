// Opens a PDF for on-screen viewing: gives the current page as a picture and lets you change pages.
import { useEffect, useRef, useState } from 'react';
import { friendlyErrorKey } from './friendlyError.js';
import { loadPdfjs } from './pdfjs.js';

const idle = { status: 'idle', numPages: 0, errorKey: '' };
const MAX_PIXELS = 12_000_000;

// renderWidth: width in pixels of the page picture. Returns { status, numPages, errorKey, page, setPage, url, size }.
// size is the page size in points as you see it (turned pages included).
export function usePdfViewer(file, renderWidth = 1000) {
  const [doc, setDoc] = useState(idle);
  const [page, setPage] = useState(0);
  const [shot, setShot] = useState({ url: '', size: null, forPage: -1 });
  const docRef = useRef(null);

  useEffect(() => {
    setPage(0);
    setShot({ url: '', size: null, forPage: -1 });
    if (!file) {
      setDoc(idle);
      return undefined;
    }
    let cancelled = false;
    let task = null;
    setDoc({ ...idle, status: 'loading' });
    (async () => {
      try {
        const [pdfjs, buffer] = await Promise.all([loadPdfjs(), file.arrayBuffer()]);
        task = pdfjs.getDocument({ data: new Uint8Array(buffer).slice(), isEvalSupported: false });
        const opened = await task.promise;
        if (cancelled) return;
        docRef.current = opened;
        setDoc({ status: 'ready', numPages: opened.numPages, errorKey: '' });
      } catch (error) {
        if (!cancelled) setDoc({ status: 'error', numPages: 0, errorKey: error?.errorKey ?? friendlyErrorKey(error) });
      }
    })();
    return () => {
      cancelled = true;
      docRef.current = null;
      task?.destroy();
    };
  }, [file]);

  useEffect(() => {
    if (doc.status !== 'ready') return undefined;
    let cancelled = false;
    let made = '';
    (async () => {
      try {
        const opened = docRef.current;
        const pdfPage = await opened.getPage(page + 1);
        const base = pdfPage.getViewport({ scale: 1 });
        const fit = Math.min(renderWidth / base.width, Math.sqrt(MAX_PIXELS / (base.width * base.height)));
        const viewport = pdfPage.getViewport({ scale: fit });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        await pdfPage.render({ canvasContext: context, viewport }).promise;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
        pdfPage.cleanup();
        if (cancelled || !blob) return;
        made = URL.createObjectURL(blob);
        setShot({ url: made, size: { width: base.width, height: base.height }, forPage: page });
      } catch (error) {
        if (!cancelled) setDoc({ status: 'error', numPages: 0, errorKey: friendlyErrorKey(error) });
      }
    })();
    return () => {
      cancelled = true;
      if (made) URL.revokeObjectURL(made);
    };
  }, [doc.status, page, renderWidth]);

  const goTo = (n) => setPage(Math.max(0, Math.min(doc.numPages - 1, n)));
  return { ...doc, page, setPage: goTo, url: shot.forPage === page ? shot.url : '', size: shot.size };
}
