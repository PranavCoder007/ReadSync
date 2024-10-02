import React from 'react';
import Navbar from './Components/Navbar/Navbar.jsx'; 
import './Homepage.css'; 
import book1 from './assets/book1.jpg'; 
import book2 from './assets/book2.jpg';
import book3 from './assets/book3.jpg';
import book4 from './assets/book4.jpg';
import Slider from './Slider.jsx';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />

      <div className="welcome-section">
        <h1>Welcome to ReadSync</h1>
        <p>We sync what you read!</p>
      </div>
      <div className="home-diamond-line"></div>
         <h2 className='trending'>Trending Now</h2>
        <Slider />
    </div>
  );
};

export default Home;