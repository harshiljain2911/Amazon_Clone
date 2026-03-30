import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

import Product from './models/productModel.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

import dummyProducts from './data/products.js';

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    if(products && products.length > 0) {
      res.json(products);
    } else {
      res.json(dummyProducts);
    }
  } catch (error) {
    res.json(dummyProducts);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    }
  } catch (error) {
    // maybe ID isn't a mongoose ID, let's check dummy products
  }
  const dummyProduct = dummyProducts.find((p) => String(p._id) === req.params.id || p.name === req.params.id);
  if (dummyProduct) {
     res.json(dummyProduct);
  } else {
     res.json(dummyProducts[0]); // fallback to first just in case
  }
});

let PORT = process.env.PORT || 5000;

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is in use, trying port ${PORT + 1}...`);
      PORT++;
      startServer();
    } else {
      console.error('Server encountered an error:', err);
    }
  });
};

startServer();
