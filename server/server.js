const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const House = require('./models/House'); // Mongoose model

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/housingDatabase';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Haversine function
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dlat = ((lat2 - lat1) * Math.PI) / 180;
  const dlon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Pairwise distance function
function pairwiseDistanceFunction(house1, house2) {
  const geoDistance = haversine(
    house1.latitude,
    house1.longitude,
    house2.latitude,
    house2.longitude
  );
  const propertyDistance =
    Math.abs(house1.price - house2.price) +
    Math.abs(house1.beds - house2.beds) +
    Math.abs(house1.bath - house2.bath) +
    Math.abs(house1.propertySqFt - house2.propertySqFt);

  return 0.2 * geoDistance + 0.8 * propertyDistance;
}

// Fetch a random house
app.get('/random-house', async (req, res) => {
    try {
      const count = await House.countDocuments();
      const randomIndex = Math.floor(Math.random() * count);
      const randomHouse = await House.findOne().skip(randomIndex);
      res.json(randomHouse);
    } catch (error) {
      console.error('Error fetching random house:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Recommendation endpoint
app.post('/recommend', async (req, res) => {
  const { houseId } = req.body;
  if (!houseId) {
    return res.status(400).json({ error: 'House ID is required' });
  }

  try {
    const targetHouse = await House.findById(houseId);
    if (!targetHouse) {
      return res.status(404).json({ error: 'House not found' });
    }

    const allHouses = await House.find();
    const distances = allHouses
      .map((house) => ({
        house,
        distance: pairwiseDistanceFunction(targetHouse, house),
      }))
      .filter((entry) => entry.house._id.toString() !== houseId);

    distances.sort((a, b) => a.distance - b.distance);
    const recommendedHouses = distances.slice(0, 5).map((entry) => entry.house);

    res.json(recommendedHouses);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
