// Split by Bookmarks or Blank Pages screen: cuts the PDF into parts and gives them as one zip file.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { readOutlineStarts } from '../../../shared/lib/pdfOutline.js';
import { usePdfInfo } from '../../../shared/lib/usePdfInfo.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { findBlankPages } from '../blankPages/findBlankPages.js';
import { runTask } from '../worker/runTask.js';
import { groupsFromBlanks, groupsFromStarts } from './splitGroups.js';

export default function SplitByTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const [by, setBy] = usePref('splitby.by', 'bookmarks');
  const file = selection.items[0]?.file;
  const info = usePdfInfo(file);

  function run() {
    job.run(async (onProgress) => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let groups;
      let names = [];
      if (by === 'bookmarks') {
        const marks = (await readOutlineStarts(file)).sort((a, b) => a.page - b.page);
        if (marks.length === 0) throw Object.assign(new Error('no bookmarks'), { errorKey: 'error.noBookmarks' });
        groups = groupsFromStarts(marks.map((m) => m.page), info.pageCount);
        names = groups.map((group) => marks.find((m) => m.page === group[0])?.title ?? '');
      } else {
        const blank = await findBlankPages(bytes, 'normal', (v) => onProgress(v * 0.5));
        groups = groupsFromBlanks(blank, info.pageCount);
        if (groups.length === 0) throw Object.assign(new Error('all blank'), { errorKey: 'error.allBlank' });
      }
      const result = await runTask('splitGroups', { bytes, groups, names }, { onProgress: (v) => onProgress(50 + v / 2) });
      return { blob: new Blob([result.bytes], { type: 'application/zip' }), fileName: outputName(file.name, '-parts', 'zip'), noteKey: 'split.parts', noteVars: { count: result.parts } };
    });
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={{ key: info.errorKey }} hasFiles={Boolean(file) && info.status !== 'error'} action={{ labelKey: 'run.splitBy', enabled: info.status === 'ready', onRun: run }}>
      <ChoiceGroup legend={t('splitby.by')} value={by} onChange={setBy} options={[{ value: 'bookmarks', label: t('splitby.bookmarks') }, { value: 'blank', label: t('splitby.blank') }]} />
      <p className="field-hint">{t(by === 'bookmarks' ? 'splitby.bookmarksNote' : 'splitby.blankNote')}</p>
    </ToolWorkspace>
  );
}
