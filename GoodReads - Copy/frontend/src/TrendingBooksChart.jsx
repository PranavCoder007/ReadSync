// TrendingBooksChart.jsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Text } from 'recharts';
import './TrendingBooksChart.css';

const TrendingBooksChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('https://readsync-backend.onrender.com/charts');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          console.error("No data available");
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="_id" 
          tick={{ fontSize: 14 }}
          label={{ 
            value: "Genre", 
            position: "insideBottom", 
            offset: -10, 
            style: { fontSize: 16, fontWeight: 'bold' } 
          }} 
        />
        <YAxis 
          label={({ viewBox }) => (
            <Text 
              x={viewBox.x - 5} // Adjusted to avoid clipping
              y={viewBox.y + (viewBox.height / 2)} 
              angle={-90}
              fontSize={16}
              fontWeight="bold"
              textAnchor="middle"
              color="black"
            >
              Number of Trending Books
            </Text>
          )}
        />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" name="Trending Books" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TrendingBooksChart;
