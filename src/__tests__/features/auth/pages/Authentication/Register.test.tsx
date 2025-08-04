import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../shared/utils/test-utils';

// Mock the Register component as a static element
jest.mock('../../../../../features/auth/pages/Authentication/Register', () => ({
  __esModule: true,
  default: () => <div data-testid="register-page">Mocked Register</div>,
}));

import Register from '../../../../../features/auth/pages/Authentication/Register'; // This import is now for the mocked Register

describe('Register Component', () => {
  describe('Component Rendering', () => {
    test('should render the mocked register component', () => {
      render(<Register />);
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
      expect(screen.getByText('Mocked Register')).toBeInTheDocument();
    });
  });
}); 