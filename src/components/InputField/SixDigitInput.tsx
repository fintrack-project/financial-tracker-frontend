import React, { useState, useRef } from 'react';
import './SixDigitInput.css'; // Add styles for the input boxes

interface SixDigitInputProps {
  onChange: (value: string) => void; // Callback to pass the entered value
}

const SixDigitInput: React.FC<SixDigitInputProps> = ({ onChange }) => {
  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only single digits

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Move focus to the next input box if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Pass the concatenated value to the parent component
    onChange(newValues.join(''));
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !values[index] && index > 0) {
      // Move focus to the previous input box on backspace if the current box is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="six-digit-input">
      {values.map((value, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => (inputRefs.current[index] = el!)}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
          {index === 2 && <span className="divider">-</span>} {/* Add '-' after the third box */}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SixDigitInput;