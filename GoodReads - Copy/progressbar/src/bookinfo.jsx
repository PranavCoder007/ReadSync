import React from 'react';
import './bookinfo.css';
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaAmazon } from "react-icons/fa";
import { SiFlipkart } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa";
import Rating from './Components/Rating'; // Import the Rating component
import { useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx'; 
import { useNavigate } from 'react-router-dom';

const Bookinfo = () => {
    const location = useLocation();
    const { book } = location.state; // Get the book data from the location state
    console.log(book);

    const navigate = useNavigate();

    const handleAmazonRedirect = () => {
        // Open the Amazon link in a new tab/window
        window.open(book.buylink, '_blank');
    };
    const handleFlipkart = () => {
        // Open the Amazon link in a new tab/window
        window.open(`https://www.flipkart.com/search?q=${encodeURIComponent(book.title)} ${encodeURIComponent(book.author)}`);
    };
    return (
        <div className='bookinfo_container'>
            <Navbar />
            <h1 className='heading'>{book.title}</h1>
            <div className="bf-diamond-line"></div>
            <div className='bookinfo_content'>
                <img src={book.imageSrc} alt="" className='bookinfo_img' />
                <div className='bookinfo_details'>
                    <h1 className='info_title'>Title: <span className='highlight'>{book.title}</span></h1>
                    <h2 className='info_author'>Author: <span className='highlight'>{book.author}</span></h2>
                    <h3 className='info_desc'>Description: <span className='info_desc_details'>
                         Rich Dad Poor Dad is a personal finance book written by Robert Kiyosaki and Sharon Lechter. The book contrasts the financial philosophies and lifestyles of two men who played a significant role in Kiyosaki’s life: his “poor dad” (biological father) and his “rich dad”.
                    </span></h3>
                </div>
            </div>
            {/* Move the Rating component below the image */}
            <div className='rating_wrapper'>
                {/* Other details */}
                <Rating rating={4} /> {/* Example rating */}
            </div>
            {/* Button Container moved out of .bookinfo_content */}
            <div className='button_container'>
                <button type="button" className='addtolib'>
                    Open PDF <FaFilePdf className='addtolib_icon' />
                </button>
                <button type="button" className='addtolib'>
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

