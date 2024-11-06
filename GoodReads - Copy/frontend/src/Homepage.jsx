import React, { useContext , useState, useEffect} from 'react';
import Navbar from './Components/Navbar/Navbar.jsx'; 
import './Homepage.css'; 

import Slider from './Slider.jsx';
import { UserContext } from './App';
const Home = () => {
  const { userId,token } = useContext(UserContext);
  const [storedUsername, setStoredUsername] = useState('');
  useEffect(() => {
    const usernameFromStorage = localStorage.getItem('userlocal');
    if (usernameFromStorage) {
      setStoredUsername(usernameFromStorage);
    }
  }, []); 
  const openDashboardWindow = () => {
    // Set desired width and height for the pop-up
    const width = 800;
    const height = 400;
    
    // Calculate top and left position to center the pop-up on the screen
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    // Open the window with specified dimensions and position
    window.open(
      '/dashboard',
      'Dashboard',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=no`
    );
  };
  return (
    <div className="home-container">
      <Navbar />

      <div className="welcome-section">
        <h1>Welcome to ReadSync {storedUsername}</h1>
        <p>We sync what you read!</p>
      </div>
      <div className="home-diamond-line"></div>
         <h2 onClick={openDashboardWindow} className='trending'>Trending Now</h2>
        <Slider />
    </div>
  );
};

export default Home;