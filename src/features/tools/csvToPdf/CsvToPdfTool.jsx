// CSV to PDF screen: a CSV file (or pasted rows) becomes a PDF table.
import TextConvertScreen from '../textConvert/TextConvertScreen.jsx';

const prepare = async (text) => ({ task: 'csvToPdf', payload: { text } });

export default function CsvToPdfTool({ tool }) {
  return <TextConvertScreen tool={tool} prepare={prepare} />;
}
