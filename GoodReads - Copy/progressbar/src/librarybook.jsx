import React, { useState } from "react";
import "./librarybook.css"; 
import book1 from './assets/can.jpg';

function librarybook() {
  const [pagesRead, setPagesRead] = useState(25);
  const totalPages = 175;

  const handlePageChange = (event) => {
    const newPageCount = event.target.value;
    if (newPageCount >= 0 && newPageCount <= totalPages) {
      setPagesRead(newPageCount);
    }
  };

  return (
    <div className="con1">
      <div className="book-info">
        <img src={book1} alt="" className="book-cover" />
        <div className="book-details">
          <h2>Title: Can't Hurt Me</h2>
          <h4>Author: David Goggins</h4>
          <div className="progress">
            <progress value={pagesRead} max={totalPages}></progress>
            <span>{Math.round((pagesRead / totalPages) * 100)}%</span>
          </div>
          <p>Pages: {pagesRead}/{totalPages}</p>
          <h>Edit pages:
          <input
            type="number"
            value={pagesRead}
            onChange={handlePageChange}
            className="edit-pages"
          />
          </h>
          
        </div>
      </div>
    </div>
  );
}

export default librarybook;