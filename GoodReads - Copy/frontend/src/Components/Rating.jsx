import React from 'react';
import './Rating.css';

const Rating = ({ rating }) => {
    const fullStars = Math.floor(rating); 
    const partial = rating - fullStars; 
    const tenthStars = Math.round(partial * 10); 
    const emptyStars = 5 - fullStars - (tenthStars > 0 ? 1 : 0); 

    return (
        <div className="rating_container">
            <div className="stars">
                {[...Array(fullStars)].map((_, index) => (
                    <span key={index} className="star filled">★</span>
                ))}
                {tenthStars > 0 && (
                    <span className={`star tenth-${tenthStars}`}>★</span>
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="star">★</span>
                ))}
            </div>
            <div className="rating_text">Rating: {rating.toFixed(1)}</div>
        </div>
    );
}

export default Rating;


