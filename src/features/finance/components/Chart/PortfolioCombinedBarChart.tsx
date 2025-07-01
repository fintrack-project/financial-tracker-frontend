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
import { fetchCategoryNames } from '../../../../services/categoryService';
import { useBaseCurrency } from '../../../../shared/hooks/useBaseCurrency'; // Custom hook to get base currency
import { formatNumber } from '../../../../shared/utils/FormatNumber';
import { ChartData } from '../../types/ChartData';
import { CombinedChartData } from '../../types/CombinedChartData';
import CategoryDropdown from '../../../../shared/components/DropDown/CategoryDropdown';
import TimeRangeDropdown from '../../../../shared/components/DropDown/TimeRangeDropDown';
import './PortfolioCombinedBarChart.css';

interface PortfolioCombinedBarChartProps {
  accountId: string | null;
}

const PortfolioCombinedBarChart: React.FC<PortfolioCombinedBarChartProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]); // List of categories
  const [selectedCategory, setSelectedCategory] = useState<string>('None'); // Default category
  const [chartData, setChartData] = useState<CombinedChartData[]>([]); // Data for the bar chart
  const [filteredData, setFilteredData] = useState<CombinedChartData[]>([]); // Filtered data based on time range
  const [timeRange, setTimeRange] = useState<string>('Quarterly'); // Default time range
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { baseCurrency } = useBaseCurrency(accountId);

  // Calculate dynamic height based on data points and asset names
  const calculateChartHeight = () => {
    if (!filteredData.length || !assetNames.length) return 300;
    const baseHeight = 300;
    const dataPointsHeight = Math.min(filteredData.length * 30, 150); // 30px per data point, max 150px additional
    const assetNamesHeight = Math.min(assetNames.length * 20, 100); // 20px per asset, max 100px additional
    return baseHeight + dataPointsHeight + assetNamesHeight;
  };

  // Fetch categories when the component loads
  useEffect(() => {
    const updateCategoryNames = async () => {
      if (!accountId) {
        console.warn('Account ID is null, skipping fetch'); // Debug log
        return;
      }

      try {
        const categoryNames = await fetchCategoryNames(accountId); // Fetch category names
        console.log('Fetched categories:', categoryNames); // Debug log
        setCategories(['None', ...categoryNames]); // Add "None" as the default option
      } catch (err) {
        console.error('Error fetching category names:', err);
        setError('Failed to load categories');
      }
    };

    updateCategoryNames();
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

  // Format date based on timeRange
  const formatLineBarChartDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const isCurrentDate = date.toDateString() === new Date().toDateString();

    if (isCurrentDate) {
      // For current date, show full date
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    switch (timeRange) {
      case 'Monthly':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      case 'Quarterly':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `${date.getFullYear()} Q${quarter}`; // YYYY QN
      case 'Annual':
        return `${date.getFullYear()}`; // YYYY
      default:
        return dateStr;
    }
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Filter out entries with "value: 0" and keep only relevant data
    const filteredPayload = payload.filter((item: any) => item.value !== 0);

    return (
      <div className="custom-tooltip">
        <p>{`${formatLineBarChartDate(label)}`}</p>
        {filteredPayload.map((item: any, index: number) => {
          // Find the corresponding asset data to get the percentage
          const assetData = filteredData.find(entry => entry.date === label)?.assets.find(
            asset => (selectedCategory === 'None' ? asset.assetName : asset.subcategory) === item.name
          );

          return (
            <p key={index}>
              {item.name}: {formatNumber(item.value)}
              {item.name !== 'Total Value' && assetData && (
                ` (${formatNumber(selectedCategory === 'None' ? assetData.percentage : assetData.percentageOfSubcategory)}%)`
              )}
            </p>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="portfolio-bar-chart">
      <div className="chart-header">
        <h2 className="fintrack-subsection-title">{timeRange} Holdings Distribution ({baseCurrency})</h2>
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
        <div className="no-holdings-by-time-message">
          No {timeRange} holdings
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={calculateChartHeight()}>
          <ComposedChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatLineBarChartDate}
              angle={-45}
              textAnchor="end"
              height={60}
            />
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