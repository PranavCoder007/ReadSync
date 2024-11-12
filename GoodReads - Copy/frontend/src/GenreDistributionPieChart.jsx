import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import axios from 'axios';
import './GenreDistributionPieChart.css';

const COLORS = ['#6c63ff', '#ff7f50', '#87ceeb', '#ff69b4', '#8a2be2', '#20b2aa', '#ffa07a'];

const GenreDistributionPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch genre distribution data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user-library-genre-distribution');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching genre distribution data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-container">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="count" // Using 'count' as the dataKey for the number of books
          nameKey="_id" // Using '_id' as the nameKey for genre
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default GenreDistributionPieChart;
