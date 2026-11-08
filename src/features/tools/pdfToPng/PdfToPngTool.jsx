// PDF to PNG screen: uses the shared picture-export screen with the PNG format.
import { ImageExportScreen } from '../pdfToImage/ImageExportScreen.jsx';

export default function PdfToPngTool({ tool }) {
  return <ImageExportScreen tool={tool} />;
}
