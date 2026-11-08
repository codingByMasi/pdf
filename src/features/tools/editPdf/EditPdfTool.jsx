// Edit PDF screen: add text, pictures and shapes on top of pages. The original text cannot be changed.
import OverlayToolScreen from '../overlay/OverlayToolScreen.jsx';

export default function EditPdfTool({ tool }) {
  return (
    <OverlayToolScreen
      tool={tool}
      tools={['select', 'rect', 'ellipse', 'line']}
      addText
      addPicture
      suffix="-edited"
      noteKey="edit.note"
    />
  );
}
