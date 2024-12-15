import axios from 'axios';
import React, { useState } from 'react';

const SwipeComponent = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSwipeRight = async (houseId) => {
    try {
      const response = await axios.post('http://localhost:5000/recommend', {
        houseId,
      });
      setRecommendations(response.data);
      console.log('Recommended Houses:', response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

    const handleInputChange = (event) => { 
    setInputValue(event.target.value);
    };
    

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter House ID" />
      <button onClick={() => handleSwipeRight(inputValue)}>Swipe Right</button>

      <h2>Recommendations:</h2>
      <ul>
        {recommendations.map((house, index) => (
          <li key={index}>
            {house.BROKERTITLE}, {house.TYPE}, ${house.PRICE}, {house.BEDS} Beds, {house.BATH} Baths, {house.PROPERTYSQFT} Sqft, {house.LATITUDE}, {house.LONGITUDE}, {house.FORMATTED_ADDRESS}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SwipeComponent;