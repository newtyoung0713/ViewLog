// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const db = new sqlite3.Database('./viewlog.db');   // Initial SQLite

const port = process.env.PORT || 5000;

// app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Create SQLite database
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)");

  // Create Records Table
  db.run(`CREATE TABLE IF NOT EXISTS Records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    media_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    progress TEXT,
    status TEXT DEFAULT 'watching',
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (media_id) REFERENCES Media(id))`);

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

  // Create Media_Genres Table
  db.run(`CREATE TABLE IF NOT EXISTS Media_Genres (
    media_id INTEGER,
    genre_id INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id),
    PRIMARY KEY (media_id, genre_id))`);

  // Create Movie Table
  db.run(`CREATE TABLE IF NOT EXISTS Movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id))`);
    
  // Create Drama Table
  db.run(`CREATE TABLE IF NOT EXISTS Drama (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER,
    season INTEGER,
    episode INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id))`);
      
  // Create Variety_Shows Table
  db.run(`CREATE TABLE IF NOT EXISTS Variety_Shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER,
    season INTEGER,
    episode INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id))`);
    
  // Create Animation Table
  db.run(`CREATE TABLE IF NOT EXISTS Animation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER,
    season INTEGER,
    episode INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id))`);
});
// db.close();

// Helper function to generate JWT tokens
const generateToken = (user) => {
  return jwt.sign(user, 'your_jwt_secret', { expiresIn: '1h' });
};

// Register API
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 16);

  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (user) return res.status(400).json({ error: 'Email already exists' });
    
    db.run(`INSERT INTO Users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
      if (err && err.code === 'SQLITE_CONSTRAINT')
        return res.status(400).json({ error: 'Email already exists' }); 
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: err.message });
      }
    });
    res.status(201).json({ message: 'User registered successfully', id: this.lastID });
    // res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'User Not Found' });
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: 'Invalid password' });
      const token = generateToken({ id: user.id, email: user.email });
      // Return token and username (email in this case)
      res.json({ token, username: user.email });
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

// Use this middleware to protect API routes that require authentication
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// API to add a new watch record (for movies, dramas, etc.)
app.post('/records', (req, res) => {
  const { media_id, progress, status } = req.body;
  const user_id = req.user.id;

  db.run(`INSERT INTO Records (user_id, media_id, progress, status) VALUES (?, ?, ?, ?)`,
    [user_id, media_id, progress, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ record_id: this.lastID });
    }
  );
});

// API to update a watch record
app.put('/records/:id', (req, res) => {
  const record_id = req.params.id;
  const { progress, status } = req.body;
  const user_id = req.user.id;

  db.run(`UPDATE Records SET progress = ?, status = ? WHERE id = ? AND user_id = ?`,
    [progress, status, record_id, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Record Not Found' });
      res.json({ message: 'Record updated successfully' });
    }
  );
});

// API to get watch records for the authenticated user
app.get('/records', (req, res) => {
  const user_id = req.user.id;

  db.all(`SELECT Records.*, Media.title FROM Records
          JOIN Media ON Records.media_id = Media.id
          WHERE Records.user_id = ?`, [user_id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
          });
});

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