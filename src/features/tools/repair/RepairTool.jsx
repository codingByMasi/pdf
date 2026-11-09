// Repair PDF screen: tries to rescue the pages of a damaged PDF into a clean file.
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function RepairTool({ tool }) {
  const prepare = () => ({ task: 'repair', payload: {} });
  const note = (r) => (r.lost > 0 ? { noteKey: 'repair.lost', noteVars: { count: r.lost } } : { noteKey: 'repair.ok', noteVars: { count: r.pages } });
  return <SimplePdfTool tool={tool} prepare={prepare} suffix="-repaired" note={note} />;
}
