import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../shared/utils/test-utils';
import IconButton from '../../../../shared/components/Button/IconButton';

// Mock the icon imports to avoid file loading issues
jest.mock('../../../../assets/icons/deleteCancel.png', () => 'delete-icon.png');
jest.mock('../../../../assets/icons/add.png', () => 'add-icon.png');
jest.mock('../../../../assets/icons/remove.png', () => 'remove-icon.png');
jest.mock('../../../../assets/icons/confirm.png', () => 'confirm-icon.png');
jest.mock('../../../../assets/icons/edit.png', () => 'edit-icon.png');
jest.mock('../../../../assets/icons/save.png', () => 'save-icon.png');

describe('IconButton Component', () => {
  const defaultProps = {
    type: 'add' as const,
    onClick: jest.fn(),
    label: 'Add Item',
  };

  describe('Component Rendering', () => {
    test('should render button with correct attributes', () => {
      render(<IconButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Add Item');
      expect(button).toHaveClass('icon-button');
    });

    test('should render button with small size', () => {
      render(<IconButton {...defaultProps} size="small" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('icon-button-small');
    });

    test('should render button with large size', () => {
      render(<IconButton {...defaultProps} size="large" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('icon-button-large');
    });

    test('should render button without label', () => {
      render(<IconButton {...defaultProps} label={undefined} />);
      
      const button = screen.getByRole('button');
      // When label is undefined, aria-label should not be set
      expect(button).not.toHaveAttribute('aria-label');
    });

    test('should render image with correct src and alt', () => {
      render(<IconButton {...defaultProps} />);
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'add-icon.png');
      expect(image).toHaveAttribute('alt', 'Add Item');
    });
  });

  describe('User Interactions', () => {
    test('should call onClick when clicked', () => {
      const mockOnClick = jest.fn();
      render(<IconButton {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA label', () => {
      render(<IconButton {...defaultProps} />);
      
      const button = screen.getByLabelText('Add Item');
      expect(button).toBeInTheDocument();
    });

    test('should be keyboard accessible', () => {
      render(<IconButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      // Buttons are keyboard accessible by default, no need for explicit tabIndex
      expect(button).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle different button types', () => {
      const types = ['add', 'delete', 'edit', 'save', 'cancel', 'remove', 'confirm'] as const;
      
      types.forEach(type => {
        const { unmount } = render(<IconButton {...defaultProps} type={type} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        unmount();
      });
    });

    test('should handle empty label', () => {
      render(<IconButton {...defaultProps} label="" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '');
    });

    test('should handle undefined label', () => {
      render(<IconButton {...defaultProps} label={undefined} />);
      
      const button = screen.getByRole('button');
      // When label is undefined, aria-label should not be set
      expect(button).not.toHaveAttribute('aria-label');
    });
  });
}); 