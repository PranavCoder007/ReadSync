import React, {useState} from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css';
import read from '../../assets/logo.png';
import search_icon from '../../assets/search.png';
import { GoHome } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      try {
        const response = await axios.post('http://localhost:8000/search', { 
          title: searchValue, 
        });

        if (response.data.success) {
          const searchResults = response.data.books;
          console.log("Search Results:", searchResults);

          navigate('/searchpage', { state: { data: searchResults } });

        } else {
          console.log('Failed to find book');
        }
      } catch (error) {
        console.error("Error occurred during search:", error);
        alert('An error occurred while performing the search');
      }
    }
  };
  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img src={read} alt="ReadSync Logo" className='logo' />
      </div>

      <div className='search-box'>
      <input 
          type="text" 
          placeholder='Search' 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)} 
          onKeyDown={handleKeyDown} 
        />
        <img src={search_icon} alt="Search Icon" className="search-icon" />
      </div>

      <ul className="navbar-links">
        <li><GoHome /> <Link to="/Homepage">Home</Link></li>
        
        <li><VscLibrary to="/library"/><Link to="/library">Library</Link></li> 
        <li><BiLogOut /><Link to="/">Logout</Link></li> 
        <li><AiOutlineExclamationCircle /><Link to="/about">About</Link></li> 
      </ul>
    </div>
  );
};

export default Navbar;
