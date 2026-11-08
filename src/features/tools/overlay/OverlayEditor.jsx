// The page editor shared by Annotate, Edit, Sign and Redact: page picture, tool choice, colours, undo.
import { useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePdfViewer } from '../../../shared/lib/usePdfViewer.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { prepareImage } from '../jpgToPdf/prepareImage.js';
import { ColorPicker } from './ColorPicker.jsx';
import { ItemPanel } from './ItemPanel.jsx';
import { makeImage, makeText, COLORS } from './overlayModel.js';
import { PageNav } from './PageNav.jsx';
import { PageOverlay } from './PageOverlay.jsx';

const DEFAULT_COLOR = { pen: COLORS.blue, highlight: COLORS.yellow, rect: COLORS.red, ellipse: COLORS.red, line: COLORS.red };
const WIDTHS = { thin: 0.003, medium: 0.006, thick: 0.012 };
const BOX_KINDS = ['highlight', 'redact', 'rect', 'ellipse', 'line'];

// file: the PDF. overlay: from useOverlay. tools: which tools to offer, e.g. ['select', 'pen', 'highlight'].
// addText / addPicture: show the buttons for adding text or a picture. extra(api): more buttons, e.g. add signature.
export function OverlayEditor({ file, overlay, tools, addText = false, addPicture = false, extra }) {
  const { t } = useI18n();
  const viewer = usePdfViewer(file);
  const [tool, setTool] = useState(tools[0]);
  const [colors, setColors] = useState(DEFAULT_COLOR);
  const [widthName, setWidthName] = useState('medium');
  const [selectedId, setSelectedId] = useState(null);
  const [pictureError, setPictureError] = useState('');
  const picker = useRef(null);
  const { page, size } = viewer;
  const items = overlay.byPage[page] ?? [];
  const selected = items.find((item) => item.id === selectedId);

  if (viewer.status === 'error') return <StatusMessage title={t('error.heading')}>{t(viewer.errorKey)}</StatusMessage>;
  if (viewer.status !== 'ready') return <p>{t('progress.wait')}</p>;

  const height = size ? size.height / size.width : 1.4;
  const kind = BOX_KINDS.includes(tool) ? tool : 'rect';
  const brush = { kind: tool === 'pen' ? 'pen' : kind, color: colors[tool] ?? COLORS.black, width: WIDTHS[widthName] };
  const mode = tool === 'select' ? 'select' : tool === 'pen' ? 'pen' : 'box';

  const addCentered = (make, w, h) => {
    const item = make(Math.max(0, (1 - w) / 2), Math.max(0, (height - h) / 2));
    overlay.add(page, item);
    setTool('select');
    setSelectedId(item.id);
  };

  async function pickPicture(event) {
    const chosen = event.target.files[0];
    event.target.value = '';
    if (!chosen) return;
    try {
      const { bytes, type } = await prepareImage(chosen);
      const mime = type === 'png' ? 'image/png' : 'image/jpeg';
      const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      const probe = new Image();
      probe.src = url;
      await probe.decode();
      const w = 0.3;
      setPictureError('');
      addCentered((x, y) => makeImage(x, y, w, (w * probe.naturalHeight) / probe.naturalWidth, bytes, mime, url), w, (w * probe.naturalHeight) / probe.naturalWidth);
    } catch {
      setPictureError('error.imageBad');
    }
  }

  const api = { page, height, addCentered, select: setSelectedId };
  const drawing = tool === 'pen' || tool === 'rect' || tool === 'ellipse' || tool === 'line';

  return (
    <div className="editor">
      <PageNav page={page} numPages={viewer.numPages} onChange={(n) => { viewer.setPage(n); setSelectedId(null); }} />
      {size ? (
        <PageOverlay
          url={viewer.url}
          size={size}
          alt={t('viewer.pageAlt', { page: page + 1 })}
          items={items}
          mode={mode}
          brush={brush}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={(item) => overlay.add(page, item)}
          onReplace={(id, item) => overlay.replace(page, id, item)}
          onDragStart={overlay.mark}
        />
      ) : <p>{t('progress.wait')}</p>}
      <p className="editor-hint">{t(mode === 'select' ? 'overlay.hintSelect' : 'overlay.hintDraw')}</p>
      <ChoiceGroup
        legend={t('overlay.tool')}
        value={tool}
        onChange={(value) => { setTool(value); setSelectedId(null); }}
        options={tools.map((name) => ({ value: name, label: t(`overlay.tool.${name}`) }))}
      />
      {tool !== 'select' && tool !== 'redact' ? (
        <ColorPicker value={colors[tool]} onChange={(color) => setColors({ ...colors, [tool]: color })} />
      ) : null}
      {drawing ? (
        <ChoiceGroup
          legend={t('overlay.thickness')}
          value={widthName}
          onChange={setWidthName}
          options={Object.keys(WIDTHS).map((name) => ({ value: name, label: t(`overlay.thickness.${name}`) }))}
        />
      ) : null}
      <div className="editor-actions">
        {addText ? (
          <Button variant="secondary" onClick={() => addCentered((x, y) => makeText(x, y, t('overlay.sampleText'), 0.05, COLORS.black), 0.3, 0.07)}>
            {t('overlay.addText')}
          </Button>
        ) : null}
        {addPicture ? <Button variant="secondary" onClick={() => picker.current.click()}>{t('overlay.addPicture')}</Button> : null}
        {extra?.(api)}
        <Button variant="secondary" disabled={!overlay.canUndo} onClick={overlay.undo}>{t('overlay.undo')}</Button>
        <Button variant="secondary" disabled={items.length === 0} onClick={() => { overlay.clearPage(page); setSelectedId(null); }}>{t('overlay.clearPage')}</Button>
      </div>
      {addPicture ? (
        <input ref={picker} className="visually-hidden" type="file" tabIndex={-1} aria-label={t('overlay.addPicture')} accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={pickPicture} />
      ) : null}
      {pictureError ? <StatusMessage title={t('error.heading')}>{t(pictureError)}</StatusMessage> : null}
      {selected ? (
        <ItemPanel
          item={selected}
          height={height}
          onChange={(next) => overlay.replace(page, selected.id, next)}
          onRemove={() => { overlay.remove(page, selected.id); setSelectedId(null); }}
        />
      ) : null}
    </div>
  );
}
