const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3050;

app.use(cors());
app.use(express.json());

const recordsPath = path.join(__dirname, 'car_records.json');
const recordsData = JSON.parse(fs.readFileSync(recordsPath, 'utf8'));

const estimatePrice = (car) => {
  const ageFactor = Math.max(0, (car.year - 2015) * 1200);
  const mileagePenalty = Math.floor((car.mileage || 0) * 0.08);
  const base = 42000 + ageFactor - mileagePenalty;
  return Math.max(8000, Math.min(90000, Math.round(base / 100) * 100));
};

const carsSeed = (recordsData.cars || []).map((car) => ({
  ...car,
  price: typeof car.price === 'number' ? car.price : estimatePrice(car),
}));

mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'carsInventoryDB' });

const Cars = require('./inventory');

mongoose.connection.once('open', async () => {
  try {
    await Cars.deleteMany({});
    await Cars.insertMany(carsSeed);
    console.log(`Seeded ${carsSeed.length} cars`);
  } catch (error) {
    console.error('Error seeding cars collection', error);
  }
});

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/cars/:id', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const docs = await Cars.find({ dealer_id: dealerId });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars' });
  }
});

app.get('/carsbymake/:id/:make', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const docs = await Cars.find({
      dealer_id: dealerId,
      make: { $regex: `^${req.params.make}$`, $options: 'i' },
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by make' });
  }
});

app.get('/carsbymodel/:id/:model', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const docs = await Cars.find({
      dealer_id: dealerId,
      model: { $regex: `^${req.params.model}$`, $options: 'i' },
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by model' });
  }
});

app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const mileage = Number(req.params.mileage);

    let mileageFilter = { $gt: 200000 };
    if (mileage <= 50000) mileageFilter = { $lte: 50000 };
    else if (mileage <= 100000) mileageFilter = { $gt: 50000, $lte: 100000 };
    else if (mileage <= 150000) mileageFilter = { $gt: 100000, $lte: 150000 };
    else if (mileage <= 200000) mileageFilter = { $gt: 150000, $lte: 200000 };

    const docs = await Cars.find({ dealer_id: dealerId, mileage: mileageFilter });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by mileage' });
  }
});

app.get('/carsbyprice/:id/:price', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const price = Number(req.params.price);

    let priceFilter = { $gt: 80000 };
    if (price <= 20000) priceFilter = { $lte: 20000 };
    else if (price <= 40000) priceFilter = { $gt: 20000, $lte: 40000 };
    else if (price <= 60000) priceFilter = { $gt: 40000, $lte: 60000 };
    else if (price <= 80000) priceFilter = { $gt: 60000, $lte: 80000 };

    const docs = await Cars.find({ dealer_id: dealerId, price: priceFilter });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by price' });
  }
});

app.get('/carsbyyear/:id/:year', async (req, res) => {
  try {
    const dealerId = Number(req.params.id);
    const year = Number(req.params.year);
    const docs = await Cars.find({ dealer_id: dealerId, year: { $gte: year } });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by year' });
  }
});

app.listen(port, () => {
  console.log(`Cars inventory service running on http://localhost:${port}`);
});
