import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  style = {},
  ...props
}) => {
  const getClassName = () => {
    let base = 'btn';
    if (variant === 'primary') base += ' btn-primary';
    else if (variant === 'secondary') base += ' btn-secondary';
    else if (variant === 'danger') base += ' btn-danger';
    else if (variant === 'success') base += ' btn-success';
    else if (variant === 'outline') base += ' btn-outline';

    if (size === 'sm') base += ' btn-sm';
    else if (size === 'lg') base += ' btn-lg';

    return base;
  };

  return (
    <button
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...style }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
            marginRight: '8px',
          }}
        />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
