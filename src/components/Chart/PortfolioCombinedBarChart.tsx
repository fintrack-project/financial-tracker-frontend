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
import { fetchPortfolioCombinedBarChartData, CombinedChartData, ChartData } from '../../services/portfolioChartService'; // Services to fetch data
import { fetchCategories } from '../../services/categoryService';
import { useBaseCurrency } from '../../hooks/useBaseCurrency'; // Custom hook to get base currency
import { formatNumber } from '../../utils/FormatNumber';
import CategoryDropdown from '../DropDown/CategoryDropdown';
import TimeRangeDropdown from '../DropDown/TimeRangeDropDown';
import './PortfolioCombinedBarChart.css';

interface PortfolioCombinedBarChartProps {
  accountId: string | null;
}

const PortfolioCombinedBarChart: React.FC<PortfolioCombinedBarChartProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]); // List of categories
  const [selectedCategory, setSelectedCategory] = useState<string>('None'); // Default category
  const [chartData, setChartData] = useState<CombinedChartData[]>([]); // Data for the bar chart
  const [filteredData, setFilteredData] = useState<CombinedChartData[]>([]); // Filtered data based on time range
  const [timeRange, setTimeRange] = useState<string>('Monthly'); // Default time range
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { baseCurrency, loading: baseCurrencyLoading } = useBaseCurrency(accountId);

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

      if(!baseCurrency) {
        console.warn('Base currency is null, skipping fetch'); // Debug log
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchPortfolioCombinedBarChartData(accountId, selectedCategory, baseCurrency); // Fetch data from backend
        console.log('Fetched chart data:', data); // Debug log
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

  // Filter data based on the selected time range
  useEffect(() => {
    const filterDataByTimeRange = () => {
      let filtered: CombinedChartData[] = [];

      if (timeRange === 'Monthly') {
        filtered = chartData; // No filtering needed for monthly data
      } else if (timeRange === 'Quarterly') {
        // Filter for 01-01, 04-01, 07-01, 10-01 of each year
        filtered = chartData.filter((entry) => {
          const month = new Date(entry.date).getMonth() + 1; // Months are 0-indexed
          return month === 1 || month === 4 || month === 7 || month === 10;
        });
      } else if (timeRange === 'Annual') {
        // Filter for 01-01 of each year
        filtered = chartData.filter((entry) => {
          const month = new Date(entry.date).getMonth() + 1; // Months are 0-indexed
          const day = new Date(entry.date).getDate();
          return month === 1 && day === 1;
        });
      }

      // Always include the last data point (most recent date)
      if (chartData.length > 0) {
        const lastDataPoint = chartData[chartData.length - 1];
        if (!filtered.includes(lastDataPoint)) {
          filtered = [...filtered, lastDataPoint];
        }
      }

      setFilteredData(filtered);
    };

    filterDataByTimeRange();
  }, [chartData, timeRange]);

  // Extract unique asset names or subcategories for the bars
  const assetNames = Array.from(
    new Set(
      chartData.flatMap((entry) =>
        entry.assets.map((asset: ChartData) => (selectedCategory === 'None' ? asset.assetName : asset.subcategory))
      )
    )
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
        <h2 className="chart-title">Monthly Holdings Distribution ({baseCurrency})</h2>
        <div className="dropdown-container">
          <CategoryDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            categories={categories}
            />
          <TimeRangeDropdown 
            value={timeRange} 
            onChange={setTimeRange} 
          />
        </div>
      </div>
      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredData.length === 0 ? (
        <div className="no-monthly-holdings-message">
          No monthly holdings
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {assetNames.map((assetName) => (
              <Bar
                key={assetName}
                dataKey={(entry) =>
                  entry.assets
                    .filter((asset: ChartData) =>
                      selectedCategory === 'None' ? asset.assetName === assetName : asset.subcategory === assetName
                    )
                    .reduce((sum: number, asset: ChartData) => sum + asset.value, 0)
                }
                name={assetName}
                stackId="a"
                fill={
                  filteredData[0]?.assets.find((asset: ChartData) =>
                    selectedCategory === 'None' ? asset.assetName === assetName : asset.subcategory === assetName
                  )?.color || '#8884d8'
                }
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.assets.find((asset: ChartData) =>
                        selectedCategory === 'None' ? asset.assetName === assetName : asset.subcategory === assetName
                      )?.color || '#8884d8'
                    }
                  />
                ))}
              </Bar>
            ))}
            <Line
              type="monotone"
              dataKey={(entry: CombinedChartData) =>
                entry.assets.reduce((sum: number, asset: ChartData) => sum + asset.value, 0)
              }
              stroke="#ff7300"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Value"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PortfolioCombinedBarChart;