import React from 'react';

const InputField = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  error = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="form-control"
        style={{
          borderColor: error ? 'var(--danger)' : 'var(--border-color)',
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--danger)',
            marginTop: '4px',
            display: 'block',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
