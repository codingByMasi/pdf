// Extract Attachments screen: gets back the files hidden inside a PDF, as one zip file.
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function ExtractAttachmentsTool({ tool }) {
  const prepare = () => ({ task: 'extractAttachments', payload: {} });
  const note = (r) => ({ noteKey: r.count > 0 ? 'attach.found' : 'attach.none', noteVars: { count: r.count } });
  return <SimplePdfTool tool={tool} prepare={prepare} suffix="-attachments" ext="zip" mime="application/zip" note={note} />;
}
