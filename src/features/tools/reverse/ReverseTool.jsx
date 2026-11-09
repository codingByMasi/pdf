// Reverse Pages screen: the last page becomes the first. No options.
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function ReverseTool({ tool }) {
  const prepare = (info) => ({
    task: 'buildPages',
    payload: { pages: Array.from({ length: info.pageCount }, (_, i) => ({ index: info.pageCount - 1 - i })) },
  });
  return <SimplePdfTool tool={tool} prepare={prepare} suffix="-reversed" />;
}
