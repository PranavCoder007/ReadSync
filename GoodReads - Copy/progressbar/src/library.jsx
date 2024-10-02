import React from 'react';
import Librarybook from './librarybook';
import './library.css'
import Navbar from './Components/Navbar/Navbar.jsx'; 
const library = () => {
  return (
    <div>
      <Navbar />
    <div className="con">
      
      
      <div className="library-section">
        <h1>My Reads</h1>
        <div class="lib-diamond-line"></div>
        <Librarybook />
        <hr />
        <Librarybook />
        <hr />
        
      </div>
      <div className="quote-section">
        <h3>Quotes</h3>
        <p>
          "One glance at a book and you hear the voice of another person, perhaps
          someone dead for 1,000 years. To read is to voyage through time."
          <br />– Carl Sagan
        </p>
        
        <p>
          "A book is a garden, an orchard, a storehouse, a party, a company by the way,
          a counselor, a multitude of counselors."
          <br />– Charles Baudelaire
        </p>
      </div>
    </div>
    </div>
  );
};

export default library;
