const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const House = require('./models/House'); // Assuming the schema is in models/House.js
const { format } = require('path');

const mongoURI = 'mongodb://localhost:27017/housingDatabase'; // Update with your MongoDB URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

async function importCSV(filePath) {
  try {
    // Clear existing data
    await House.deleteMany({});
    console.log('Existing houses deleted');

    const houses = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map CSV fields to schema
        houses.push({
          brokerTitle: row.BROKERTITLE,
          type: row.TYPE,
          price: parseFloat(row.PRICE),
          beds: parseInt(row.BEDS),
          bath: parseFloat(row.BATH),
          propertySqFt: parseFloat(row.PROPERTYSQFT),
          address: row.ADDRESS,
          formattedAddress: row.FORMATTED_ADDRESS,
          locality: row.LOCALITY,
          latitude: parseFloat(row.LATITUDE),
          longitude: parseFloat(row.LONGITUDE),
        });
      })
      .on('end', async () => {
        await House.insertMany(houses);
        console.log('Houses imported successfully');
        mongoose.disconnect();
      });
  } catch (error) {
    console.error('Error importing CSV:', error);
  }
}

// Call the function with your CSV file path
importCSV('./NY-House-Dataset 2.csv');
