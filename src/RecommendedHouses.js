import React from 'react';
import './index.css';
import house1 from './images/3589453_0.jpg';


const RecommendedHouses = ({ recommendedHouses }) => {
  console.log('Recommended Houses in component:', recommendedHouses);
  return (
    <div className="recommendedHouses">
      {recommendedHouses.map((house) => (
        <div key={house._id} className="recommendedHouse">
          <img src={house1} width={400} height={300} className = "recommendedHouse"/>
          <h3>{house.brokerTitle}</h3>
          <p>${house.price}</p>
          <p>{house.beds} Beds</p>
          <p>{house.bath} Baths</p>
          <p>{house.propertySqFt} SqFt</p>
          <p>{house.formattedAddress}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendedHouses;
