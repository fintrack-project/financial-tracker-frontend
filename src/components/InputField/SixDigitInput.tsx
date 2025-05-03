import React, { useState, useRef } from 'react';
import './SixDigitInput.css'; // Add styles for the input boxes

interface SixDigitInputProps {
  value: string; // The current value of the input
  onChange: (value: string) => void; // Callback to pass the entered value
}

const SixDigitInput: React.FC<SixDigitInputProps> = ({ value, onChange }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d?$/.test(digit)) return; // Allow only single digits

    const newValues = value.split('');
    newValues[index] = digit;
    const newValue = newValues.join('');
    onChange(newValue); // Pass the concatenated value to the parent component

    // Move focus to the next input box if a digit is entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !value[index] && index > 0) {
      // Move focus to the previous input box on backspace if the current box is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="six-digit-input">
      {Array.from({ length: 6 }).map((_, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => (inputRefs.current[index] = el!)}
            type="text"
            maxLength={1}
            value={value[index] || ''} // Use the corresponding character from the value prop
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