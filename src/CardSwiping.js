import React from 'react';
import TinderCard from 'react-tinder-card';
import Slider from 'react-slick';
import './index.css';
import house1 from './images/3589453_0.jpg';

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div className="arrow next" onClick={onClick}>
      ➔
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div className="arrow prev" onClick={onClick}>
      ←
    </div>
  );
}

function CardSwiping({ house, onSwipe }) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div>
      <TinderCard
        className="swipe"
        onSwipe={(direction) => onSwipe(direction)}
        preventSwipe={['up', 'down']}
      >
        <div className="card">
          <Slider {...sliderSettings}>
            {(house.images && house.images.length > 0 ? house.images : [house1]).map((imgUrl, index) => (
              <div key={index} className="carouselImage">
                <img src={imgUrl} alt={`${house.name} - ${index + 1}`} />
              </div>
            ))}

          </Slider>
          <h3 style={{ color: 'black' }} className='houseDescription'>{house.brokerTitle}</h3>
          <h3 className = "houseDescription">{house.type}</h3>
          <p className = "description">{house.price}</p>
          <p className='description'>{house.beds} Beds</p>
          <p className='description'>{house.bath} Baths</p>
          <p className = 'description'>{house.propertySqFt} SqFt</p>
          <p className = 'description'>{house.formattedAddress}</p>
        </div>
      </TinderCard>
      <h3 style={{ color: 'black' }} className='houseDescription'>{house.brokerTitle}</h3>
      <h3 className = "houseDescription">{house.type}</h3>
      <h3 className = "houseDescription">${house.price}</h3>
      <h3 className = "houseDescription">{house.beds} Beds</h3>
      <h3 className = "houseDescription">{house.bath} Baths</h3>
      <h3 className = "houseDescription">{house.propertySqFt} SqFt</h3>
      <h3 className = "houseDescription">{house.formattedAddress}</h3>
    </div>

  );
}

export default CardSwiping;
