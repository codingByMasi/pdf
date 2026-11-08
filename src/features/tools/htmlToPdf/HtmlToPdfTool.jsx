// HTML to PDF screen: a simple web page (file or pasted code) becomes a PDF. Only plain content is kept.
import TextConvertScreen from '../textConvert/TextConvertScreen.jsx';
import { htmlToBlocks } from './htmlBlocks.js';

// The page is read here (the worker has no page parser), then drawn in the worker.
const prepare = async (text) => ({ task: 'htmlToPdf', payload: { blocks: htmlToBlocks(text).blocks }, noteKey: 'note.htmlSimple' });

export default function HtmlToPdfTool({ tool }) {
  return <TextConvertScreen tool={tool} prepare={prepare} />;
}
