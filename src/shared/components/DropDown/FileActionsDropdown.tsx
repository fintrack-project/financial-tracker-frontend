import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Icon from '../Card/Icon';
import ReactDOM from 'react-dom';
import './FileActionsDropdown.css';

interface FileActionsDropdownProps {
  actionName: string;
  fileFormat: 'xlsx' | 'csv';
  onFileFormatChange: (format: 'xlsx' | 'csv') => void;
  onDownload: () => void;
}

const FileActionsDropdown: React.FC<FileActionsDropdownProps> = ({ 
  actionName,
  fileFormat, 
  onFileFormatChange, 
  onDownload 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const selectorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position the dropdown menu absolutely in the viewport
  useEffect(() => {
    if (dropdownOpen && selectorRef.current) {
      const rect = selectorRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        minWidth: rect.width,
        zIndex: 1000
      });
    }
  }, [dropdownOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't close if clicking on the selector or menu
      if (
        selectorRef.current &&
        !selectorRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Handle dropdown item clicks
  const handleItemClick = (format: 'xlsx' | 'csv') => {
    console.log('Dropdown item clicked:', format);
    onFileFormatChange(format);
    setDropdownOpen(false);
  };

  // Dropdown menu content
  const menu = (
    <div className="dropdown-menu" style={menuStyle} ref={menuRef}>
      <div
        className="dropdown-item"
        onClick={() => handleItemClick('csv')}
      >
        .csv
      </div>
      <div
        className="dropdown-item"
        onClick={() => handleItemClick('xlsx')}
      >
        .xlsx
      </div>
    </div>
  );

  return (
    <div className="file-actions">
      <button className="button" onClick={onDownload}>
        {actionName}
      </button>
      <div className="file-actions-dropdown-container">
        <div
          className="dropdown-selector"
          ref={selectorRef}
          onClick={() => setDropdownOpen((prev) => !prev)}
          tabIndex={0}
        >
          .{fileFormat.toLowerCase()} 
          <span>
            <Icon 
              icon={FaChevronDown}
              style={{
                transition: 'transform var(--transition-fast)',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
              aria-hidden={true}
              size={14}
            />
          </span>
        </div>
        {dropdownOpen && ReactDOM.createPortal(menu, document.body)}
      </div>
    </div>
  );
};

export default FileActionsDropdown;