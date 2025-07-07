import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { fetchPortfolioPieChartData } from '../../services/portfolioChartService'; // Service to fetch chart data
import { fetchCategoryNames } from '../../../categories/services/categoryService'; // Service to fetch categories
import { useBaseCurrency } from '../../../../shared/hooks/useBaseCurrency'; // Custom hook to get base currency 
import { formatNumber } from '../../../../shared/utils/FormatNumber'; // Utility function to format numbers
import { getCurrentBreakpoint, createBreakpointListener } from '../../../../shared/utils/breakpoints'; // New breakpoint utilities
import CategoryDropdown from '../../../../shared/components/DropDown/CategoryDropdown';
import './PortfolioPieChart.css';

interface PortfolioPieChartProps {
  accountId: string | null;
}

// Custom hook for responsive chart sizing
const useChartSize = () => {
  const [chartSize, setChartSize] = useState(() => {
    // Initialize with current breakpoint
    const current = getCurrentBreakpoint();
    switch (current) {
      case 'mobile':
        return { height: 400, outerRadius: 120 };
      case 'tablet':
        return { height: 500, outerRadius: 160 };
      case 'desktop':
        return { height: 600, outerRadius: 200 };
      default:
        return { height: 400, outerRadius: 120 };
    }
  });

  useEffect(() => {
    const updateSize = () => {
      const current = getCurrentBreakpoint();
      switch (current) {
        case 'mobile':
          // Mobile: Compact chart for small screens
          setChartSize({ height: 400, outerRadius: 120 });
          break;
        case 'tablet':
          // Tablet: Medium-sized chart for balanced view
          setChartSize({ height: 500, outerRadius: 160 });
          break;
        case 'desktop':
          // Desktop: Large chart for detailed view
          setChartSize({ height: 600, outerRadius: 200 });
          break;
        default:
          setChartSize({ height: 400, outerRadius: 120 });
      }
    };

    // Initial size update
    updateSize();

    // Create listeners for all breakpoints
    const cleanupFunctions = [
      createBreakpointListener('mobile', updateSize),
      createBreakpointListener('tablet', updateSize),
      createBreakpointListener('desktop', updateSize)
    ];

    return () => cleanupFunctions.forEach(cleanup => cleanup());
  }, []);

  return chartSize;
};

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]); // Default category
  const [selectedCategory, setSelectedCategory] = useState<string>('None'); // Default category
  const [chartData, setChartData] = useState<any[]>([]); // Data for the pie chart
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { baseCurrency } = useBaseCurrency(accountId);
  const { height, outerRadius } = useChartSize();

  // Fetch category names when the component loads
  useEffect(() => {
    const updateCategoryNames = async () => {
      if (!accountId) {
        console.warn('Account ID is null, skipping fetch'); // Debug log
        return;
      }

      try {
        const categoryNames = await fetchCategoryNames(accountId); // Fetch category names
        setCategories(['None', ...categoryNames]); // Add "None" as the default option
      } catch (err) {
        console.error('Error fetching category names:', err);
        setError('Failed to load categories');
      }
    };

    updateCategoryNames();
  }, [accountId]);

  // Fetch chart data from the backend
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) {
        console.warn('Account ID is null, skipping fetch'); // Debug log
        return;
      }

      if(!baseCurrency) {
        console.warn('Base currency is null, skipping fetch'); // Debug log
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching chart data for accountId:', accountId, 'and category:', selectedCategory, ', with base currency:', baseCurrency); // Debug log
        const data = await fetchPortfolioPieChartData(accountId, selectedCategory, baseCurrency); // Fetch data from backend
        console.log('Chart data fetched:', data); // Debug log
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, selectedCategory, baseCurrency]);

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const { payload: sliceData, color } = payload[0];
    const name = sliceData.subcategory === "None" ? sliceData.assetName : sliceData.subcategory;
    const value = sliceData.subcategory === "None" ? sliceData.value : sliceData.subcategoryValue;
    const percentage = sliceData.subcategory === "None" ? sliceData.percentage : sliceData.percentageOfSubcategory;
    
    return (
      <div className="custom-tooltip">
        <p><span className="color-dot" style={{ backgroundColor: color }}></span>{name}</p>
        <p>Value: {formatNumber(value)}</p>
        <p>Percentage: {formatNumber(percentage)}%</p>
      </div>
    );
  };

  return (
    <div className="portfolio-pie-chart">
      <div className="chart-header">
        <h2 className="fintrack-subsection-title">Holdings Distribution ({baseCurrency})</h2>
        <div className="dropdown-container">
          <CategoryDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            categories={categories}
          />
        </div>
      </div>
      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : chartData.length === 0 ? (
        <div className="no-holdings-message">
          No holdings
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="assetName"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${formatNumber(value)}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value) => <span className="legend-text">{value}</span>}
              wrapperStyle={{
                marginTop: 24,
                maxHeight: 100,
                overflowY: "auto"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PortfolioPieChart;