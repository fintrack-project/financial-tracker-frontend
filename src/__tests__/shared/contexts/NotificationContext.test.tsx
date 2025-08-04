import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../shared/utils/test-utils';
import { NotificationProvider, useNotification } from '../../../shared/contexts/NotificationContext';

// Mock the NotificationContext
jest.mock('../../../shared/contexts/NotificationContext', () => ({
  ...jest.requireActual('../../../shared/contexts/NotificationContext'),
  useNotification: jest.fn(),
}));

const mockUseNotification = useNotification as jest.MockedFunction<typeof useNotification>;

// Test component that uses the notification context
const TestComponent = () => {
  const { showNotification, hideNotification, notifications } = useNotification();
  
  return (
    <div>
      <button data-testid="show-success" onClick={() => showNotification('Success message', 'success')}>
        Show Success
      </button>
      <button data-testid="show-error" onClick={() => showNotification('Error message', 'error')}>
        Show Error
      </button>
      <button data-testid="show-warning" onClick={() => showNotification('Warning message', 'warning')}>
        Show Warning
      </button>
      <button data-testid="hide-notification" onClick={() => hideNotification(0)}>
        Hide Notification
      </button>
      <div data-testid="notifications-count">
        {notifications.length} notifications
      </div>
      {notifications.map((notification, index) => (
        <div key={index} data-testid={`notification-${index}`}>
          {notification.message} - {notification.type}
        </div>
      ))}
    </div>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    mockUseNotification.mockReturnValue({
      notifications: [],
      showNotification: jest.fn(),
      hideNotification: jest.fn(),
      clearNotifications: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('NotificationProvider', () => {
    test('should render children', () => {
      render(
        <NotificationProvider>
          <div data-testid="test-child">Test Child</div>
        </NotificationProvider>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    test('should provide notification context', () => {
      const mockContext = {
        notifications: [
          { id: '1', message: 'Test notification', type: 'success' as const }
        ],
        showNotification: jest.fn(),
        hideNotification: jest.fn(),
        clearNotifications: jest.fn(),
      };

      mockUseNotification.mockReturnValue(mockContext);

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1 notifications');
      expect(screen.getByTestId('notification-0')).toHaveTextContent('Test notification - success');
    });
  });

  describe('useNotification Hook', () => {
    test('should provide showNotification function', () => {
      const mockShowNotification = jest.fn();
      mockUseNotification.mockReturnValue({
        notifications: [],
        showNotification: mockShowNotification,
        hideNotification: jest.fn(),
        clearNotifications: jest.fn(),
      });

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const showSuccessButton = screen.getByTestId('show-success');
      fireEvent.click(showSuccessButton);

      expect(mockShowNotification).toHaveBeenCalledWith('Success message', 'success');
    });

    test('should provide hideNotification function', () => {
      const mockHideNotification = jest.fn();
      mockUseNotification.mockReturnValue({
        notifications: [],
        showNotification: jest.fn(),
        hideNotification: mockHideNotification,
        clearNotifications: jest.fn(),
      });

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const hideButton = screen.getByTestId('hide-notification');
      fireEvent.click(hideButton);

      expect(mockHideNotification).toHaveBeenCalledWith(0);
    });

    test('should handle different notification types', () => {
      const mockShowNotification = jest.fn();
      mockUseNotification.mockReturnValue({
        notifications: [],
        showNotification: mockShowNotification,
        hideNotification: jest.fn(),
        clearNotifications: jest.fn(),
      });

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const showErrorButton = screen.getByTestId('show-error');
      const showWarningButton = screen.getByTestId('show-warning');

      fireEvent.click(showErrorButton);
      fireEvent.click(showWarningButton);

      expect(mockShowNotification).toHaveBeenCalledWith('Error message', 'error');
      expect(mockShowNotification).toHaveBeenCalledWith('Warning message', 'warning');
    });
  });

  describe('Notification State Management', () => {
    test('should display notifications count', () => {
      const mockNotifications = [
        { id: '1', message: 'First notification', type: 'success' as const },
        { id: '2', message: 'Second notification', type: 'error' as const },
      ];

      mockUseNotification.mockReturnValue({
        notifications: mockNotifications,
        showNotification: jest.fn(),
        hideNotification: jest.fn(),
        clearNotifications: jest.fn(),
      });

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      expect(screen.getByTestId('notifications-count')).toHaveTextContent('2 notifications');
      expect(screen.getByTestId('notification-0')).toHaveTextContent('First notification - success');
      expect(screen.getByTestId('notification-1')).toHaveTextContent('Second notification - error');
    });

    test('should handle empty notifications', () => {
      mockUseNotification.mockReturnValue({
        notifications: [],
        showNotification: jest.fn(),
        hideNotification: jest.fn(),
        clearNotifications: jest.fn(),
      });

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      expect(screen.getByTestId('notifications-count')).toHaveTextContent('0 notifications');
      expect(screen.queryByTestId('notification-0')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper button structure', () => {
      mockUseNotification.mockReturnValue({
        notifications: [],
        showNotification: jest.fn(),
        hideNotification: jest.fn(),
        clearNotifications: jest.fn(),
      });

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
      
      expect(screen.getByTestId('show-success')).toBeInTheDocument();
      expect(screen.getByTestId('show-error')).toBeInTheDocument();
      expect(screen.getByTestId('show-warning')).toBeInTheDocument();
      expect(screen.getByTestId('hide-notification')).toBeInTheDocument();
    });
  });
}); 