// Stand-in for tools that are not built yet: shows the shared pieces and a "coming soon" note.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { StatusMessage } from '../../shared/ui/StatusMessage.jsx';
import { usePdfJob } from '../../shared/lib/usePdfJob.js';
import { ToolWorkspace } from './ToolWorkspace.jsx';
import { useFileSelection } from './useFileSelection.js';

export default function PlaceholderTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  return (
    <ToolWorkspace tool={tool} selection={selection} job={job}>
      <StatusMessage kind="info">{t('tool.comingSoon')}</StatusMessage>
    </ToolWorkspace>
  );
}
