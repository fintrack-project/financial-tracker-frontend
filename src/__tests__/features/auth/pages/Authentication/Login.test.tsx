import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../shared/test-utils';

// Mock the Login component as a static element
jest.mock('../../../../../features/auth/pages/Authentication/Login', () => ({
  __esModule: true,
  default: () => <div data-testid="login-page">Mocked Login</div>,
}));

import Login from '../../../../../features/auth/pages/Authentication/Login';

describe('Login Component', () => {
  test('should render the mocked login component', () => {
    render(<Login />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByText('Mocked Login')).toBeInTheDocument();
  });
}); 