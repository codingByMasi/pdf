// The site logo: three stacked pages and the site name, with the word "PDF" in the accent colour.
import { config } from '../config.js';

export function BrandName() {
  const name = config.siteName;
  let text = name;
  if (name.length > 3 && name.endsWith('PDF')) text = <>{name.slice(0, -3)}<span>PDF</span></>;
  else if (name.length > 4 && name.startsWith('PDF ')) text = <><span>PDF</span>{name.slice(3)}</>;
  return (
    <>
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      <span className="brand-name">{text}</span>
    </>
  );
}
