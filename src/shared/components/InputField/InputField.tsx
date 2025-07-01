import React from 'react';

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder, value, onChange, isTextArea }) => {
  return isTextArea ? (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-field"
    />
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-field"
    />
  ); 
};

export default InputField;