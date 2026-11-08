// Big, easy-to-tap button used everywhere.
export function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <button type="button" className={`button button-${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
