const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const static = path.join(__dirname, '../client/assets');

// Import Controllers
const photoController = require('./photoController');



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", ['X-PINGOTHER', 'Content-Type']);
  res.setHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/static', express.static(static))

// GET Endpoints

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'));
});

app.post('/upload/photo', photoController.uploadPhoto, (req, res) => {
  res.status(201).json({ photoUrl: "url/to/photo.jpg", success: true });
})

app.put('/upload/photo/location', photoController.saveAdditionalInformation, (req, res) => {
  res.status(201).json({ success: true });
})

// Server Port
app.listen(3000, () => console.log('Listening on Port: 3000 .-.'));

