const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = 3008;

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: true,
}));

const mongoURI = process.env.MONGOURI;

mongoose.connect(mongoURI, { 
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})
.then(() => {
    console.log('MongoDB connected...');
})
.catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

function loadRoutes(directory) {
  fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      const route = require(filePath);
      app.use('/api', route);
  });
}
const routesDirectory = path.join(__dirname, 'routes');
loadRoutes(routesDirectory);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
