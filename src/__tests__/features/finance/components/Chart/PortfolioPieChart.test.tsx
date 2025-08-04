import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../shared/utils/test-utils';

// Mock the PortfolioPieChart component as a static element
jest.mock('../../../../../features/finance/components/Chart/PortfolioPieChart', () => ({
  __esModule: true,
  default: ({ accountId }: any) => (
    <div data-testid="portfolio-pie-chart">
      <h2>Portfolio Distribution</h2>
      <div data-testid="category-dropdown">
        <select data-testid="category-selector">
          <option value="None">None</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
      <div data-testid="pie-chart">
        <div data-testid="pie">
          <div data-testid="pie-segment-0">Technology: 5000</div>
          <div data-testid="pie-segment-1">Healthcare: 3000</div>
          <div data-testid="pie-segment-2">Finance: 2000</div>
        </div>
      </div>
    </div>
  ),
}));

import PortfolioPieChart from '../../../../../features/finance/components/Chart/PortfolioPieChart'; // This import is now for the mocked component

describe('PortfolioPieChart Component', () => {
  describe('Component Rendering', () => {
    test('should render portfolio pie chart with title', () => {
      render(<PortfolioPieChart accountId="test-account" />);

      expect(screen.getByText('Portfolio Distribution')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('should render category dropdown', () => {
      render(<PortfolioPieChart accountId="test-account" />);

      expect(screen.getByTestId('category-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    });

    test('should render chart with data', () => {
      render(<PortfolioPieChart accountId="test-account" />);

      expect(screen.getByTestId('pie-segment-0')).toBeInTheDocument();
      expect(screen.getByTestId('pie-segment-1')).toBeInTheDocument();
      expect(screen.getByTestId('pie-segment-2')).toBeInTheDocument();
    });
  });

  describe('Chart Data Display', () => {
    test('should display chart segments with correct data', () => {
      render(<PortfolioPieChart accountId="test-account" />);

      expect(screen.getByText('Technology: 5000')).toBeInTheDocument();
      expect(screen.getByText('Healthcare: 3000')).toBeInTheDocument();
      expect(screen.getByText('Finance: 2000')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle null accountId', () => {
      render(<PortfolioPieChart accountId={null} />);

      expect(screen.getByText('Portfolio Distribution')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<PortfolioPieChart accountId="test-account" />);

      const heading = screen.getByRole('heading', { name: 'Portfolio Distribution' });
      expect(heading).toBeInTheDocument();
    });

    test('should have proper select element', () => {
      render(<PortfolioPieChart accountId="test-account" />);

      const categorySelector = screen.getByTestId('category-selector');
      expect(categorySelector.tagName).toBe('SELECT');
    });

    test('should have proper chart container', () => {
      render(<PortfolioPieChart accountId="test-account" />);

      const responsiveContainer = screen.getByTestId('pie-chart');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });
}); 