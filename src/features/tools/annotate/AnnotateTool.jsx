// PDF Annotator screen: draw with a pen, highlight, or add text on top of pages.
import OverlayToolScreen from '../overlay/OverlayToolScreen.jsx';

export default function AnnotateTool({ tool }) {
  return <OverlayToolScreen tool={tool} tools={['pen', 'highlight', 'select']} addText suffix="-annotated" />;
}
