import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchPortfolioPieChartData } from '../../services/portfolioPieChartService'; // Service to fetch chart data
import { fetchCategories } from '../../services/categoryService'; // Service to fetch categories
import './PortfolioPieChart.css';

interface PortfolioPieChartProps {
  accountId: string;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ accountId }) => {
  const [categories, setCategories] = useState<string[]>([]); // Default category
  const [selectedCategory, setSelectedCategory] = useState<string>('Unnamed'); // Default category
  const [chartData, setChartData] = useState<any[]>([]); // Data for the pie chart
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6F61'];
  
  // Fetch category names when the component loads
  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const categoryNames = await fetchCategories(accountId); // Fetch category names
        setCategories(categoryNames);
      } catch (err) {
        console.error('Error fetching category names:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategoryNames();
  }, [accountId]);

  // Fetch chart data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPortfolioPieChartData(accountId, selectedCategory); // Fetch data from backend
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, selectedCategory]);

  return (
    <div className="portfolio-pie-chart">
      <div className="chart-header">
        <h2>Holdings Distribution</h2>
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
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PortfolioPieChart;