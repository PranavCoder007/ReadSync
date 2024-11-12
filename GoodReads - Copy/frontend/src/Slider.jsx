import React, { useEffect, useState } from 'react';
import './Slider.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';

const Slider = () => {
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

    
    const fetchTrendingBooks = async () => {
        try {
            const response = await fetch('http://localhost:8000/trending');  
            const trendingData = await response.json();
            setData(trendingData.books);  
        } catch (error) {
            console.error('Error fetching trending books:', error);
        }
    };

   
    useEffect(() => {
        fetchTrendingBooks();
    }, []);  

    const handleClick = (book) => {
        
        navigate('/bookinfo', { state: { book } });
    };

    return (
        <div className='slider_container'>
            <Carousel responsive={responsive} showDots={true}>
                {data.map((book, index) => (
                    <div onClick={() => handleClick(book)} className='slider_card' key={index}>
                        <img src={book.imageSrc} alt={book.title} className='slider_img' />
                        <h2 className='slideh2'>{book.title}</h2>
                        <h3 className='slideh3'>{book.author}</h3>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Slider;

