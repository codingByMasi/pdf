// Markdown to PDF screen: a Markdown file or pasted Markdown becomes a PDF with headings, lists and tables.
import TextConvertScreen from '../textConvert/TextConvertScreen.jsx';
import { markdownToBlocks } from './markdownBlocks.js';

const prepare = (text) => {
  const { blocks, skippedImages } = markdownToBlocks(text);
  return { task: 'htmlToPdf', payload: { blocks }, noteKey: skippedImages > 0 ? 'note.markdownImages' : undefined };
};

export default function MarkdownToPdfTool({ tool }) {
  return <TextConvertScreen tool={tool} prepare={prepare} />;
}
