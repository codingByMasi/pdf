// PDF to JPG screen: uses the shared picture-export screen with the JPG format.
import { ImageExportScreen } from '../pdfToImage/ImageExportScreen.jsx';

export default function PdfToJpgTool({ tool }) {
  return <ImageExportScreen tool={tool} />;
}
