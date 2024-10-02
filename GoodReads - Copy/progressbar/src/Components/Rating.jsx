import React from 'react';
import './Rating.css'; // Import any necessary CSS styles

const Rating = ({ rating }) => {
    return (
        <div className="rating_container">
            {/* Render stars based on rating */}
            <div className="stars">
                {[...Array(5)].map((_, index) => (
                    <span key={index} className={index < rating ? 'star filled' : 'star'}>★</span>
                ))}
            </div>
            {/* Display rating text below stars */}
            <div className="rating_text">Rating: {rating}</div>
        </div>
    );
}

export default Rating;
