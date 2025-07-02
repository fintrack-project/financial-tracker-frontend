import React from 'react';
import { TimeRangePresetOption, TimeRangePreset } from '../../types/TimeRange';
import './PresetRanges.css';

interface PresetRangesProps {
  presets: TimeRangePresetOption[];
  currentPreset?: TimeRangePreset;
  onPresetClick: (preset: string) => void;
  onCustomToggle: () => void;
  showCustomInput: boolean;
  disabled?: boolean;
}

const PresetRanges: React.FC<PresetRangesProps> = ({
  presets,
  currentPreset,
  onPresetClick,
  onCustomToggle,
  showCustomInput,
  disabled = false
}) => {
  return (
    <div className="preset-ranges">
      <div className="preset-buttons">
        {presets.map((preset) => (
          <button
            key={preset.value}
            className={`preset-button ${currentPreset === preset.value ? 'active' : ''}`}
            onClick={() => onPresetClick(preset.value)}
            disabled={disabled}
            type="button"
          >
            {preset.label}
          </button>
        ))}
        <button
          className={`preset-button custom-button ${showCustomInput ? 'active' : ''}`}
          onClick={onCustomToggle}
          disabled={disabled}
          type="button"
        >
          Custom
        </button>
      </div>
    </div>
  );
};

export default PresetRanges; 