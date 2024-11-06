import React,{ useState, useContext } from 'react';
import './bookinfo.css';
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaAmazon } from "react-icons/fa";
import { SiFlipkart } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa";
import { HiOutlineDocumentRemove } from "react-icons/hi";
import Rating from './Components/Rating'; 
import { useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import { UserContext } from './App';
const Bookinfo = () => {
    const location = useLocation();
    const { book } = location.state; 
    const { userId,token } = useContext(UserContext);
    console.log(book);
    
    const navigate = useNavigate();

    const handleAmazonRedirect = () => {
        window.open(book.buylink, '_blank');
    };

    const handleFlipkart = () => {
        window.open(`https://www.flipkart.com/search?q=${encodeURIComponent(book.title)} ${encodeURIComponent(book.author)}`);
    };

    const handleAddToLibrary = async () => {

        try {
            const response = await axios.post('http://localhost:8000/addlib', { 
                userId: userId, 
                bookTitle: book.title 
            });

            if (response.data.success) {
                alert('Book added to your library');
            } else if (response.data.message === "Book already in the library") {
                alert('Book already in your library');
            } else {
                alert('Failed to add book');
            }
        } catch (error) {
            console.error("Error adding book to library:", error);
            alert('An error occurred while adding the book');
        }
    };
    const handleRemoveToLibrary = async () => {

        try {
            const response = await axios.post('http://localhost:8000/removelib', { 
                userId: userId, 
                bookTitle: book.title 
            });

            if (response.data.success) {
                alert('Book removed from your library');
            } else if (response.data.message === "Book not found in the user's library") {
                alert('Book not found in the users library');
            } else {
                alert('Failed to remove book');
            }
        } catch (error) {
            console.error("Error adding book to library:", error);
            alert('An error occurred while adding the book');
        }
    };
    return (
        <div className='bookinfo_container'>
            <Navbar />
            <h1 className='heading'>Bookinfo</h1>
            <div className="bf-diamond-line"></div>
            <div className='bookinfo_content'>
                <img src={book.imageSrc} alt="" className='bookinfo_img' />
                <div className='bookinfo_details'>
                    <h1 className='info_title'>Title: <span className='highlight'>{book.title}</span></h1>
                    <h2 className='info_author'>Author: <span className='highlight'>{book.author}</span></h2>
                    <h3 className='info_desc'>Description: <span className='info_desc_details'>
                         {book.description}
                    </span></h3>
                </div>
            </div>
            <div className='rating_wrapper'>
                <Rating rating={book.rating} /> 
            </div>
            <div className='button_container'>
                <button type="button" className='addtolib' onClick={handleRemoveToLibrary}>
                    Remove library <HiOutlineDocumentRemove className='addtolib_icon' />
                </button>
                <button type="button" className='addtolib' onClick={handleAddToLibrary}>
                    Add to Library <HiOutlineDocumentAdd className='addtolib_icon' />
                </button>
                <button onClick={handleFlipkart} type="button" className='addtolib'>
                    Available at <SiFlipkart className='addtolib_icon' />
                </button>
                <button onClick={handleAmazonRedirect} type="button" className='addtolib'>
                    Available at <FaAmazon className='addtolib_icon' />
                </button>
            </div>
        </div>
    );
}

export default Bookinfo;


