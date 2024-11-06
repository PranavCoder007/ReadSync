// Dashboard.jsx
import React from 'react';
import Navbar from './Components/Navbar/Navbar.jsx'
import TrendingBooksChart from './TrendingBooksChart';
import GenreDistributionPieChart from './GenreDistributionPieChart';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div>
      {/* Navbar at the top */}

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Trending Books Bar Chart */}
        <div className="d-chart-container">
          <h2>Trending Books by Genre</h2>
          <p>This chart shows the trending books by genre, giving insights into the most popular genres.</p>
          <TrendingBooksChart />
        </div>

        {/* Genre Distribution Pie Chart */}
        <div className="d-chart-container">
          <h2>Genre Distribution of User Library</h2>
          <p>This chart represents the distribution of different genres in the user's library.</p>
          <GenreDistributionPieChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
