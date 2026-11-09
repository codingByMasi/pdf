// Duplicate Pages screen: choose pages and how many extra copies each gets.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { parsePageRange } from '../../../shared/lib/parsePageRange.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';
import { duplicatePlan } from './duplicatePlan.js';

export default function DuplicateTool({ tool }) {
  const { t } = useI18n();
  const [range, setRange] = useState('');
  const [copies, setCopies] = useState('1');
  const count = Number(copies);
  const countOk = Number.isInteger(count) && count >= 1 && count <= 20;

  const prepare = (info) => {
    const parsed = parsePageRange(range, info.pageCount);
    if (parsed.errorKey) return { error: { key: parsed.errorKey, vars: parsed.vars } };
    return { task: 'buildPages', payload: { pages: duplicatePlan(info.pageCount, parsed.indices, count) } };
  };
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-duplicated" canRun={countOk}>
      <TextField label={t('duplicate.rangeLabel')} hint={t('duplicate.rangeHint')} value={range} onChange={(e) => setRange(e.target.value)} />
      <TextField label={t('duplicate.copiesLabel')} type="number" inputMode="numeric" min="1" max="20" value={copies} onChange={(e) => setCopies(e.target.value)} />
      {countOk ? null : <p role="alert">{t('duplicate.copiesBad')}</p>}
    </SimplePdfTool>
  );
}
