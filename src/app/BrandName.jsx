// The site logo: three stacked pages and the site name, with a trailing "PDF" in the accent colour.
import { config } from '../config.js';

export function BrandName() {
  const name = config.siteName;
  const split = name.length > 3 && name.endsWith('PDF');
  return (
    <>
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      <span className="brand-name">
        {split ? <>{name.slice(0, -3)}<span>PDF</span></> : name}
      </span>
    </>
  );
}
