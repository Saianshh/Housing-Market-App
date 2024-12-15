import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardSwiping from './CardSwiping';
import './index.css';
import RecommendedHouses from './RecommendedHouses';
import Login from './login';

function App() {
  const [currentHouse, setCurrentHouse] = useState(null);
  const [recommendedHouses, setRecommendedHouses] = useState([]);
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState('');

  // Fetch a random house from the backend
  const fetchRandomHouse = async () => {
    try {
      const response = await axios.get('http://localhost:5000/random-house');
      setCurrentHouse(response.data);
    } catch (error) {
      console.error('Error fetching random house:', error);
    }
  };

  // Fetch recommendations for a house
  const fetchRecommendations = async (houseId) => {
    try {
      const response = await axios.post('http://localhost:5000/recommend', { houseId });
      setRecommendedHouses(response.data);
      console.log('Recommended Houses:', response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  // Handle swipe action
  const handleSwipe = (direction, houseId) => {
    if (direction === 'right') {
      fetchRandomHouse();
      fetchRecommendations(houseId);
    } else if (direction === 'left') {
      fetchRandomHouse();
    }
  };

  const handleLogin = () => {
    setLogin(true);
  }

  const settingUsername = (name) => {
    setUsername(name);
  }

  // Load initial random house on component mount
  useEffect(() => {
    fetchRandomHouse();
  }, []);

  if (login === false) {
    return(
    <Login handleLogin = {handleLogin} settingUsername = {settingUsername}/>
    );
  }
  return (
    <div className="app">
      <h1 style={{textAlign: 'center'}}>Welcome, {username}</h1>
      <div className="cardContainer">
        {currentHouse && (
          <CardSwiping
            key={currentHouse._id}
            house={currentHouse}
            onSwipe={(direction) => handleSwipe(direction, currentHouse._id)}
          />
        )}
      </div>
      <h2 style={{paddingLeft: '100px'}}>Recommended Houses:</h2>
      <RecommendedHouses recommendedHouses={recommendedHouses} />
    </div>
  );
}

export default App;
