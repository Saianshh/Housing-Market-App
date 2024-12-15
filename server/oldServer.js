const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let housingData = [];

fs.createReadStream('./NY-House-Dataset 2.csv')
  .pipe(csv())
  .on('data', (row) => {
    row.PRICE = parseFloat(row.PRICE);
    row.BEDS = parseInt(row.BEDS);
    row.BATH = parseFloat(row.BATH);
    row.PROPERTYSQFT = parseFloat(row.PROPERTYSQFT);
    row.LATITUDE = parseFloat(row.LATITUDE);
    row.LONGITUDE = parseFloat(row.LONGITUDE);
    housingData.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371.0; // Earth radius (km)
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

function pairwiseDistanceFunction(row1, row2) {
  const geoDistance = haversine(
    row1.LATITUDE,
    row1.LONGITUDE,
    row2.LATITUDE,
    row2.LONGITUDE
  );
  const propertyDistance = ['PRICE', 'BEDS', 'BATH', 'PROPERTYSQFT'].reduce(
    (sum, feature) => sum + Math.abs(row1[feature] - row2[feature]),
    0
  );

  return 0.2 * geoDistance + 0.8 * propertyDistance;
}

// Recommendation logic
function recommendSimilarHouses(houseId, k = 6) {
  const targetHouse = housingData[houseId];
  if (!targetHouse) return [];

  const distances = housingData
    .map((house, index) => ({
      index,
      distance: pairwiseDistanceFunction(targetHouse, house),
    }))
    .filter((_, index) => index !== houseId);

  distances.sort((a, b) => a.distance - b.distance);

  return distances.slice(0, k).map(({ index }) => housingData[index]);
}

app.post('/recommend', (req, res) => {
  const { houseId } = req.body;
  if (houseId === undefined || houseId < 0 || houseId >= housingData.length) {
    return res.status(400).json({ error: 'Invalid house ID' });
  }

  const recommendations = recommendSimilarHouses(houseId);
  res.json(recommendations);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
