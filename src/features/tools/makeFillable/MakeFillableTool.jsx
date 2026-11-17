// Make PDF Fillable screen: place text boxes, tick boxes and drop-down lists on pages, then save real fill-in fields.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import OverlayToolScreen from '../overlay/OverlayToolScreen.jsx';
import { makeField } from '../overlay/overlayModel.js';

const SIZES = { text: [0.35, 0.04], check: [0.04, 0.04], dropdown: [0.35, 0.04] };

export default function MakeFillableTool({ tool }) {
  const { t } = useI18n();
  const extra = (api) => ['text', 'check', 'dropdown'].map((kind) => (
    <Button key={kind} variant="secondary" onClick={() => api.addCentered((x, y) => makeField(kind, x, y, ...SIZES[kind]), ...SIZES[kind])}>
      {t(`fillable.add.${kind}`)}
    </Button>
  ));
  return <OverlayToolScreen tool={tool} tools={['select']} extra={extra} task="addFields" suffix="-fillable" noteKey="fillable.note" />;
}
