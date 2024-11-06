import React, { useEffect, useState } from 'react';
import './searchpage.css';
import Rating from './Components/Rating.jsx';
import { useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx'; 
import { useNavigate } from 'react-router-dom';
const SearchPage = () => {
  const navigate = useNavigate();
  const handleClick = (book) => {
        
    navigate('/bookinfo', { state: { book } });
};
  const location = useLocation();
  const { data } = location.state || { data: [] };;
  return (
    <div >
      <Navbar />
    <div className='search'>
      <div className='line_contain'>
        <h1>Search Results</h1>
        <div className='search-diamond-line'></div>
      </div>
      <div className="search-page">
        {data.map((book, index) => (
          <div onClick={() => handleClick(book)} className="search_container" key={index}>
            <img src={book.imageSrc} alt={book.title} className="search-image" />
            <div className="search_text">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Author:</strong> {book.author}</p>
              <Rating rating={book.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default SearchPage;
