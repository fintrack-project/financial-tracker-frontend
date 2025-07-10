import React from 'react';
import './InputField.css';

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  isTextArea = false,
  label,
  error,
  disabled = false,
  required = false,
  size = 'md',
  fullWidth = false,
  className = '',
  id,
  name,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  readOnly = false,
}) => {
  const baseClasses = [
    'input-field',
    `input-field--${size}`,
    fullWidth ? 'input-field--full-width' : '',
    error ? 'input-field--error' : '',
    disabled ? 'input-field--disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  const inputProps = {
    id,
    name,
    placeholder,
    value,
    onChange,
    disabled,
    required,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    readOnly,
    className: baseClasses,
  };

  return (
    <div className={`input-field-container ${fullWidth ? 'input-field-container--full-width' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-field-label">
          {label}
          {required && <span className="input-field-required">*</span>}
        </label>
      )}
      
      {isTextArea ? (
        <textarea
          {...inputProps}
          rows={4}
        />
      ) : (
        <input
          type={type}
          {...inputProps}
        />
      )}
      
      {error && (
        <div className="input-field-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputField;