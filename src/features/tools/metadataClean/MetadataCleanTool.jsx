// Metadata cleaner screen: shows which hidden details the PDF has, and saves a copy without them.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';
import { findMetadata } from './cleanMetadata.js';

function Found({ file }) {
  const { t } = useI18n();
  const [list, setList] = useState(null);
  useEffect(() => {
    let live = true;
    file.arrayBuffer().then((b) => findMetadata(new Uint8Array(b))).then((l) => live && setList(l)).catch(() => live && setList([]));
    return () => { live = false; };
  }, [file]);
  if (!list) return null;
  return list.length ? <p>{t('metaclean.found', { list: list.join(', ') })}</p> : <p>{t('metaclean.none')}</p>;
}

export default function MetadataCleanTool({ tool }) {
  const { t } = useI18n();
  return (
    <SimplePdfTool tool={tool} prepare={() => ({ task: 'cleanMetadata', payload: {} })} suffix="-clean" note={() => ({ noteKey: 'metaclean.done' })}>
      {(info, file) => (file ? <Found file={file} /> : <p>{t('file.reading')}</p>)}
    </SimplePdfTool>
  );
}
