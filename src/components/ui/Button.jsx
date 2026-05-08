import './ui.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
