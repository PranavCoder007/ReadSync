import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';
import read from '../../assets/logo.png';
import search_icon from '../../assets/search.png';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img src={read} alt="ReadSync Logo" className='logo' />
      </div>

      <div className='search-box'>
        <input type="text" placeholder='Search' />
        <img src={search_icon} alt="Search Icon" className="search-icon" />
      </div>

      <ul className="navbar-links">
        <li><Link to="/Homepage">Home</Link></li> {/* Use Link for navigation */}
        <li><Link to="/library">Library</Link></li> {/* Navigate to Library page */}
      </ul>
    </div>
  );
};

export default Navbar;
