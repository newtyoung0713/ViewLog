// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database('./viewlog.db');   // Initial SQLite

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Create SQLite database
db.serialize(() => {
  db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)");

  // Create Records Table
  db.run(`CREATE TABLE IF NOT EXISTS Records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    media_type TEXT NOT NULL,
    media_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    progress TEXT,
    status TEXT DEFAULT 'watching',
    FOREIGN KEY (user_id) REFERENCES Users(id)`);

  // Create Media Table
  db.run(`CREATE TABLE IF NOT EXISTS Media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    country TEXT,
    year INTEGER)`);

  // Create Genres Table
  db.run(`CREATE TABLE IF NOT EXISTS Genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre_name TEXT UNIQUE)`);

  // Create Movie Table
  db.run(`CREATE TABLE IF NOT EXISTS Movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    country TEXT,
    year INTEGER)`);
  // Create Movie_Genres Relational Table
  db.run(`CREATE TABLE IF NOT EXISTS Movie_Genres (
    movie_id INTEGER,
    genre_id INTEGER,
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id),
    PRIMARY KEY (movie_id, genre_id))`);
    
  // Create Drama Table
  db.run(`CREATE TABLE IF NOT EXISTS Drama (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    country TEXT,
    season INTEGER,
    episode INTEGER,
    year INTEGER)`);
  // Create Drama_Genres Relational Table
  db.run(`CREATE TABLE IF NOT EXISTS Drama_Genres (
    drama_id INTEGER,
    genre_id INTEGER,
    FOREIGN KEY (drama_id) REFERENCES Drama(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id),
    PRIMARY KEY (drama_id, genre_id))`);
    
  // Create Variety_Shows Table
  db.run(`CREATE TABLE IF NOT EXISTS Variety_Shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    country TEXT,
    season INTEGER,
    episode INTEGER)`);
  // Create Variety_Shows_Genres Relational Table
  db.run(`CREATE TABLE IF NOT EXISTS Variety_Shows_Genres (
    variety_show_id INTEGER,
    genre_id INTEGER,
    FOREIGN KEY (variety_show_id) REFERENCES Variety_Shows(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id),
    PRIMARY KEY (variety_show_id, genre_id))`);
    
  // Create Animation Table
  db.run(`CREATE TABLE IF NOT EXISTS Animation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    country TEXT,
    season INTEGER,
    episode INTEGER)`);
  // Create Animation_Genres Relational Table
  db.run(`CREATE TABLE IF NOT EXISTS Animation_Genres (
    animation_id INTEGER,
    genre_id INTEGER,
    FOREIGN KEY (animation_id) REFERENCES Animation(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id),
    PRIMARY KEY (animation_id, genre_id))`);
});
db.close();

// Helper function to generate JWT tokens
const generateToken = (user) => {
  return jwt.sign(user, 'your_jwt_secret', { expiresIn: '1h' });
};

// Register API
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // const hashedPassword = await bcrypt.hash(password, 10);
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run('INSERT INTO Users (email, password) VALUES (?, ?)', [email, hash], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'User Not Found' });
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result) return res.status(401).json({ error: 'Invalid password' });

      const token = generateToken({ id: user.id, email: user.email });
      res.json({ token });
    });
  });
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};



// API to get a movie
app.get('/movies', (req, res) => {
  db.all('SELECT * FROM Movies', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API to get a movie by ID
app.get('/movies/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM Movies WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Movie Not Found' });
    res.json(row);
  });
});

// API to get a genre
app.get('/genres', (req, res) => {
  db.all('SELECT * FROM Genres', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API to get a genres of a movie
app.get('/movies/:id/genres', (req, res) => {
  const id = req.params.id;
  db.all(`SELECT Genres.* FROM Genres
          JOIN Movie_Genres ON Genres.id = Movie_Genres.genre_id
          WHERE Movie_Genres.movie_id = ?`, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the ViewLog API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});