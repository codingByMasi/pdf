// Favicon Maker screen: turns a picture into the small icon files websites need, in one zip.
import { canvasToFile, drawImage, makeCanvas } from '../../../shared/lib/imageIO.js';
import { makeZip } from '../../../shared/lib/zipFiles.js';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { writeIco } from '../imageKit/icoWriter.js';

const SIZES = [16, 32, 48, 180, 192, 512];
const NAMES = { 16: 'favicon-16x16.png', 32: 'favicon-32x32.png', 48: 'favicon-48x48.png', 180: 'apple-touch-icon.png', 192: 'icon-192.png', 512: 'icon-512.png' };

// A square cut from the middle of the picture.
function squareOf(image) {
  const side = Math.min(image.width, image.height);
  const canvas = makeCanvas(side, side);
  canvas.getContext('2d').drawImage(image.element, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, side, side);
  return canvas;
}

export default function FaviconTool({ tool }) {
  const run = async ({ image, onProgress }) => {
    const square = squareOf(image);
    const files = [];
    const ico = [];
    for (const size of SIZES) {
      const { blob } = await canvasToFile(drawImage(square, size, size), 'png');
      const bytes = new Uint8Array(await blob.arrayBuffer());
      files.push({ name: NAMES[size], data: bytes });
      if (size <= 48) ico.push({ size, bytes });
      onProgress((files.length / SIZES.length) * 100);
    }
    files.push({ name: 'favicon.ico', data: writeIco(ico) });
    return { blob: new Blob([makeZip(files)], { type: 'application/zip' }), fileName: 'favicon-files.zip', noteKey: 'favicon.done' };
  };
  return <ImageEditScreen tool={tool} run={run} />;
}
