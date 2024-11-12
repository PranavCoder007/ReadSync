import React, { useEffect, useState } from 'react';
import './Foryou.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Foryou = () => {
    const [data, setData] = useState([]); 
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
            slidesToSlide: 4,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };
    
    const navigate = useNavigate(); 

    
    const fetchRecommendation = async () => {

        try {
            const username = localStorage.getItem("userlocal");
            const searchItems = JSON.parse(localStorage.getItem("searchItems"));

            const response = await axios.post("http://localhost:8000/recommendations", {
            username,
            searchItems,
            });  
            
            const trendingData = await response.data.books;
            console.log(trendingData);
            setData(trendingData || []); 
            } catch (error) {
            console.error('Error fetching recommend books:', error);
        }
    };

   
    useEffect(() => {
        fetchRecommendation();
    }, []);  

    const handleClick = (book) => {
        
        navigate('/bookinfo', { state: { book } });
    };

    return (
        <div className='foryou_container'>
            <Carousel responsive={responsive} showDots={true}>
                {data.map((book, index) => (
                    <div onClick={() => handleClick(book)} className='foryou_card' key={index}>
                        <img src={book.imageSrc} alt={book.title} className='foryou_img' />
                        <h2 className='foryouh2'>{book.title}</h2>
                        <h3 className='foryouh3'>{book.author}</h3>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Foryou;

