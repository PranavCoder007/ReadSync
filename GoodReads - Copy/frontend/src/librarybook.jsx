import React, { useState, useContext,useEffect } from "react";
import "./librarybook.css"; 
import book1 from './assets/can.jpg';
import { UserContext } from './App';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { TwitterShareButton, TwitterIcon, FacebookShareButton,  FacebookIcon,  PinterestShareButton,   PinterestIcon  } from 'react-share';
function librarybook({ book }) {
  const [pagesRead, setPagesRead] = useState(book.pagesread);
  const [tempPagesRead, setTempPagesRead] = useState(book.pagesread);
  const totalPages = book.totalpages;
  const {userId} = useContext(UserContext);
  const [storedUsername, setStoredUsername] = useState('');
  const navigate = useNavigate();
  const handlePageChange = (event) => {
    const newPageCount = event.target.value;
    setTempPagesRead(newPageCount);
  };
  useEffect(() => {
    // Get the username from localStorage
    const usernameFromStorage = localStorage.getItem('userlocal');
    if (usernameFromStorage) {
      setStoredUsername(usernameFromStorage);
    }
  }, []);
  const handleBlur = async () => {
    const newPageCount = Number(tempPagesRead);
    console.log(newPageCount);
    if (newPageCount >= 0 && newPageCount <= totalPages) {
      try {
        const response = await axios.post('http://localhost:8000/updatePagesRead', {
          userId: storedUsername,
          bookTitle: book.title,
          pagesRead: newPageCount
        });

        if (response.data.success) {
          setPagesRead(newPageCount); 
        } else {
          alert(response.data.message);
          setTempPagesRead(pagesRead); 
        }
      } catch (error) {
        console.error("Error updating pages read:", error);
        setTempPagesRead(pagesRead); 
      }
    } else {
      setTempPagesRead(pagesRead);
    }
  };
  const handleClick = async (book) => {
    try {
      const response = await axios.get(`http://localhost:8000/bookdetails/${book.title}`, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.success) {
        navigate('/bookinfo', { state: { book: response.data.book } });
      } else {
        console.error("Failed to fetch book details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };
  const shareText = `I have completed ${(pagesRead / totalPages * 100).toFixed(1)}% of \"${book.title}\"!`;
  return (
    <div>
      <div className="con1">
        <div className="book-info">
          <img src={book.bookimage} alt="" className="book-cover" onClick={() => handleClick(book)} />
          <div className="book-details">
            <h2>Title: {book.title}</h2>
            <h4>Author: {book.author}</h4>
            <div className="progress">
              <progress value={pagesRead} max={totalPages}></progress>
              <span>{Math.round((pagesRead / totalPages) * 100)}%</span>
            </div>
            <p>Pages: {pagesRead}/{totalPages}</p>
            <div className="edit-section">
            <h>Edit pages:
              <input
                type="number"
                value={tempPagesRead}
                onChange={handlePageChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="edit-pages"
              />
              <div className="share-section">
              <TwitterShareButton  url="Readsync.com" title={shareText}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
          
              <FacebookShareButton url="Readsync.com" quote={shareText}>
                  <FacebookIcon size={32} round={true} />
              </FacebookShareButton>

            
              <PinterestShareButton url="Readsync.com" media={book.bookimage} description={shareText}>
                  <PinterestIcon size={32} round={true} />
              </PinterestShareButton>
              </div>
            </h>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default librarybook;
