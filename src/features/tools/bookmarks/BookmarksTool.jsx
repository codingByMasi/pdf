// Bookmarks screen: one bookmark per page, or a typed list of "Title | page" lines.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';
import { pageBookmarks, parseBookmarks } from './parseBookmarks.js';

export default function BookmarksTool({ tool }) {
  const { t } = useI18n();
  const [mode, setMode] = useState('pages');
  const [list, setList] = useState('');
  const prepare = (info) => {
    if (mode === 'pages') return { task: 'bookmarks', payload: { items: pageBookmarks(info.pageCount, t('bookmarks.pageWord')) } };
    const parsed = parseBookmarks(list, info.pageCount);
    if (parsed.errorKey) return { error: { key: parsed.errorKey, vars: parsed.vars } };
    return { task: 'bookmarks', payload: { items: parsed.items } };
  };
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-bookmarks">
      <ChoiceGroup
        legend={t('bookmarks.modeLabel')}
        value={mode}
        onChange={setMode}
        options={[{ value: 'pages', label: t('bookmarks.modePages') }, { value: 'list', label: t('bookmarks.modeList') }]}
      />
      {mode === 'list' ? <TextField label={t('bookmarks.listLabel')} hint={t('bookmarks.listHint')} multiline value={list} onChange={(e) => setList(e.target.value)} /> : null}
    </SimplePdfTool>
  );
}
