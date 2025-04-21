import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { fetchPortfolioCombinedBarChartData } from '../../services/portfolioChartService'; // Services to fetch data
import { fetchCategories } from '../../services/categoryService'; // Service to fetch categories
import './PortfolioCombinedBarChart.css';

interface PortfolioCombinedBarChartProps {
  accountId: string | null;
}

const PortfolioCombinedBarChart: React.FC<PortfolioCombinedBarChartProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]); // List of categories
  const [selectedCategory, setSelectedCategory] = useState<string>('None'); // Default category
  const [chartData, setChartData] = useState<any[]>([]); // Data for the bar chart
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories when the component loads
  useEffect(() => {
    const fetchCategoryNames = async () => {
      if (!accountId) {
        console.warn('Account ID is null, skipping fetch'); // Debug log
        return;
      }

      try {
        const categoryNames = await fetchCategories(accountId); // Fetch category names
        setCategories(['None', ...categoryNames]); // Add "None" as the default option
      } catch (err) {
        console.error('Error fetching category names:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategoryNames();
  }, [accountId]);

  // Fetch chart data when accountId or selectedCategory changes
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) {
        console.warn('Account ID is null, skipping fetch'); // Debug log
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchPortfolioCombinedBarChartData(accountId, selectedCategory); // Fetch data from backend
        console.log('Fetched chart data:', data); // Debug log

        // Transform the data for the chart
        const transformedData = data.map((entry: any) => {
          const transformedEntry: any = { date: entry.date }; // Initialize with the date
          entry.data.forEach((asset: any) => {
            transformedEntry[asset.assetName] = {
              value: asset.value,
              color: asset.color,
            }; // Store both value and color for each asset
          });
          return transformedEntry;
        });
        console.log('Transformed chart data:', transformedData); // Debug log
        setChartData(transformedData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, selectedCategory]);

  // Extract unique asset names for the bars
  const assetNames = Array.from(
    new Set(chartData.flatMap((entry) => Object.keys(entry).filter((key) => key !== 'date')))
  );

  return (
    <div className="portfolio-bar-chart">
      <div className="chart-header">
        <h2>Monthly Holdings Distribution</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-dropdown"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {assetNames.map((assetName) => (
              <Bar
                key={assetName}
                dataKey={(entry) => entry[assetName]?.value || 0} // Use the value for the bar height
                name={assetName}
                stackId="a" // Stack all bars together
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry[assetName]?.color || '#8884d8'} // Dynamically set the color for each segment
                  />
                ))}
              </Bar>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PortfolioCombinedBarChart;