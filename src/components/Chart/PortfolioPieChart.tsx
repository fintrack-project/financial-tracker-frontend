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
import { fetchCategoryNames } from '../../services/categoryService'; // Service to fetch categories
import { useBaseCurrency } from '../../hooks/useBaseCurrency'; // Custom hook to get base currency 
import { formatNumber } from '../../utils/FormatNumber'; // Utility function to format numbers
import CategoryDropdown from '../DropDown/CategoryDropdown';
import './PortfolioPieChart.css';


interface PortfolioPieChartProps {
  accountId: string | null;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]); // Default category
  const [selectedCategory, setSelectedCategory] = useState<string>('None'); // Default category
  const [chartData, setChartData] = useState<any[]>([]); // Data for the pie chart
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { baseCurrency, loading: baseCurrencyLoading } = useBaseCurrency(accountId);

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
    
    const { payload: sliceData } = payload[0];
    const name = sliceData.subcategory === "None" ? sliceData.assetName : sliceData.subcategory;
    const value = sliceData.subcategory === "None" ? sliceData.value : sliceData.subcategoryValue;
    const percentage = sliceData.subcategory === "None" ? sliceData.percentage : sliceData.percentageOfSubcategory;
    
    return (
      <div className="custom-tooltip">
        <p>{name}</p>
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
        <ResponsiveContainer width="100%" height={600}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="assetName"
              cx="50%"
              cy="50%"
              outerRadius={200}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${formatNumber(value)}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className="legend-text">{value}</span>}
              wrapperStyle={{
                right: 24,
                paddingLeft: 20,
                maxHeight: 400,
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