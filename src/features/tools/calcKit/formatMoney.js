// Shows rupee amounts with Indian grouping (12,34,567.50). Falls back to plain numbers if the browser lacks it.
let formatter;
try {
  formatter = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
} catch {
  formatter = null;
}
export const rupees = (n) => `₹${formatter ? formatter.format(n) : n.toFixed(2)}`;
