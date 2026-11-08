// Reads how many pages a PDF has, and reports password or damaged-file problems early.
import { useEffect, useState } from 'react';
import { loadPdf } from './pdfLoad.js';
import { friendlyErrorKey } from './friendlyError.js';

const idle = { status: 'idle', pageCount: 0, errorKey: '' };

export function usePdfInfo(file) {
  const [info, setInfo] = useState(idle);

  useEffect(() => {
    if (!file) {
      setInfo(idle);
      return undefined;
    }
    let cancelled = false;
    setInfo({ ...idle, status: 'loading' });
    file
      .arrayBuffer()
      .then((buffer) => loadPdf(new Uint8Array(buffer)))
      .then((doc) => {
        if (!cancelled) setInfo({ status: 'ready', pageCount: doc.getPageCount(), errorKey: '' });
      })
      .catch((error) => {
        if (!cancelled) setInfo({ status: 'error', pageCount: 0, errorKey: error?.errorKey ?? friendlyErrorKey(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  return info;
}
