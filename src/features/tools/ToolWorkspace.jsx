// Working area shared by all tools: add files, check them, show the list and any error.
import { useState } from 'react';
import { config } from '../../config.js';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { validateFile } from '../../shared/lib/validateFile.js';
import { DropZone } from '../../shared/ui/DropZone.jsx';
import { FileList } from '../../shared/ui/FileList.jsx';
import { StatusMessage } from '../../shared/ui/StatusMessage.jsx';

let nextId = 1;

export function ToolWorkspace({ tool }) {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [errorKey, setErrorKey] = useState('');

  function addFiles(files) {
    const maxBytes = config.limits.maxFileMB * 1024 * 1024;
    const good = [];
    let problem = '';
    for (const file of files) {
      const result = validateFile(file, { kind: tool.kind, maxBytes });
      if (result.ok) good.push({ id: nextId++, file });
      else problem = result.errorKey;
    }
    const merged = tool.multiple ? [...items, ...good] : good.slice(0, 1).length ? good.slice(0, 1) : items;
    if (merged.length > config.limits.maxFiles) {
      setErrorKey('error.tooMany');
      return;
    }
    setErrorKey(problem);
    setItems(merged);
  }

  return (
    <section className="workspace" aria-labelledby="workspace-heading">
      <h2 id="workspace-heading" className="visually-hidden">{t('tool.workspace')}</h2>
      <DropZone kind={tool.kind} multiple={tool.multiple} onFiles={addFiles} />
      {errorKey ? <StatusMessage title={t('error.heading')}>{t(errorKey)}</StatusMessage> : null}
      <FileList items={items} onRemove={(id) => setItems(items.filter((i) => i.id !== id))} />
      <StatusMessage kind="info">{t('tool.comingSoon')}</StatusMessage>
    </section>
  );
}
