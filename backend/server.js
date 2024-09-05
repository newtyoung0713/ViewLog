const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite database
const db = new sqlite3.Database('./viewlog.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the ViewLog API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});