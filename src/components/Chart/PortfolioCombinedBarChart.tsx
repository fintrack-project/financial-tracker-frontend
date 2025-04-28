import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { fetchPortfolioCombinedBarChartData } from '../../services/portfolioChartService'; // Services to fetch data
import { fetchCategories } from '../../services/categoryService';
import { formatNumber } from '../../utils/FormatNumber';
import CategoryDropdown from '../DropDown/CategoryDropdown';
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
          let totalValue = 0; // Initialize total value for the month
          const filteredAssets = Array.isArray(entry.data) ? entry.data : []; // Ensure entry.data is an array
        
          filteredAssets.forEach((asset: any) => {
            if (selectedCategory === "None") {
              // Transform by asset name
              transformedEntry[asset.assetName] = {
                value: asset.value, // Use the individual asset value
                color: asset.color, // Use the asset's color
              };
              totalValue += asset.value; // Accumulate total value
            } else {
              // Transform by subcategory
              if (!transformedEntry[asset.subcategory]) {
                transformedEntry[asset.subcategory] = {
                  value: 0,
                  color: asset.color, // Use the subcategory's color
                };
              }
              transformedEntry[asset.subcategory].value += asset.value; // Accumulate asset value for the subcategory
              totalValue += asset.value; // Accumulate total value
            }
          });

          transformedEntry.totalValue = totalValue; // Add total value to the entry
          console.log('Transformed entry:', transformedEntry); // Debug log
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

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Filter out entries with "value: 0" and keep only relevant data
      const filteredPayload = payload.filter((item: any) => item.value !== 0);

      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`Date: ${label}`}</p>
          {filteredPayload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {formatNumber(item.value)}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };
  
  return (
    <div className="portfolio-bar-chart">
      <div className="chart-header">
        <h2 className="chart-title">Monthly Holdings Distribution</h2>
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
      ) : chartData.length === 0 ? ( // Check if chartData is empty
        <div className="no-monthly-holdings-message">
          No monthly holdings
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}
            <Legend />
            {assetNames.map((assetName) => (
              <Bar
                key={assetName}
                dataKey={(entry) => entry[assetName]?.value || 0} // Use the value for the bar height
                name={assetName}
                stackId="a" // Stack all bars together
                fill={chartData[0]?.[assetName]?.color || '#8884d8'} // Set the color for the legend
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry[assetName]?.color || '#8884d8'} // Dynamically set the color for each segment
                  />
                ))}
              </Bar>
            ))}
            <Line
              type="monotone"
              dataKey="totalValue"
              stroke="#ff7300"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Value"
            >
              {/* Add labels to display the total value */}
              {chartData.map((entry, index) => (
                <text
                  key={`label-${index}`}
                  x={index * 50} // Adjust the x position dynamically
                  y={entry.totalValue - 10} // Adjust the y position dynamically
                  fill="#ff7300"
                  fontSize={12}
                  textAnchor="middle"
                >
                  {entry.totalValue}
                </text>
              ))}
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PortfolioCombinedBarChart;