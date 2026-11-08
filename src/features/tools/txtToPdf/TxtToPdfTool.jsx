// TXT to PDF screen: a plain text file (or pasted text) becomes a PDF.
import TextConvertScreen from '../textConvert/TextConvertScreen.jsx';

const prepare = async (text) => ({ task: 'textToPdf', payload: { text } });

export default function TxtToPdfTool({ tool }) {
  return <TextConvertScreen tool={tool} prepare={prepare} />;
}
