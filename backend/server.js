// server.js
const express = require('express');
const helmet = require('helmet');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const db = new sqlite3.Database(path.join(__dirname, 'viewlog.db'));   // Initial SQLite

const port = process.env.PORT || 5000;

app.use(helmet());

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Create SQLite database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL)`);

  // Create Records Table
  db.run(`CREATE TABLE IF NOT EXISTS Records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    media_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'watching' CHECK(status IN ('watching', 'completed', 'on hold', 'dropped')),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES Media(id) ON DELETE CASCADE)`);
    
  // Create Media Table
  db.run(`CREATE TABLE IF NOT EXISTS Media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    country_code CHAR(3),
    year INTEGER)`);

  // Create Genres Table
  db.run(`CREATE TABLE IF NOT EXISTS Genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre_name TEXT UNIQUE NOT NULL)`);

  // Create Media_Genres Table
  db.run(`CREATE TABLE IF NOT EXISTS Media_Genres (
    media_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    FOREIGN KEY (media_id) REFERENCES Media(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(id) ON DELETE CASCADE,
    PRIMARY KEY (media_id, genre_id))`);

  // Create Movie Table
  db.run(`CREATE TABLE IF NOT EXISTS Movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    FOREIGN KEY (media_id) REFERENCES Media(id) ON DELETE CASCADE)`);
    
  // Create Drama Table
  db.run(`CREATE TABLE IF NOT EXISTS Dramas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    season INTEGER,
    episode INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id) ON DELETE CASCADE)`);
      
  // Create Variety_Shows Table
  db.run(`CREATE TABLE IF NOT EXISTS Variety_Shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    season INTEGER,
    episode INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id) ON DELETE CASCADE)`);
    
  // Create Animation Table
  db.run(`CREATE TABLE IF NOT EXISTS Animations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    season INTEGER,
    episode INTEGER,
    FOREIGN KEY (media_id) REFERENCES Media(id) ON DELETE CASCADE)`);
});

// Helper function to generate JWT tokens
const generateToken = (user) => {
  // return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  return jwt.sign(user, 'your_jwt_secret', { expiresIn: '1h' });
};

// Register API
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  
  const hashedPassword = await bcrypt.hash(password, 16);

  // Searching is there any same email account in database
  db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (user) return res.status(400).json({ error: 'Email already exists' });
    
    // If the user is not exist, then insertion a new user
    db.run(`INSERT INTO Users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: err.message });
      }
    });
    // Return a successful insertion message
    res.status(201).json({ message: 'User registered successfully', id: this.lastID });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  // Checking the user from database
  db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'User Not Found' });
    
    // Comparing is the password matching
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
      
      // Generating a JWT token
      const token = generateToken({ id: user.id, username: user.username });
      // Return token and username (email in this case)
      res.json({ token, username: user.email });
    });
  });
});

// Login API for preventing login again
app.get('/login', (req, res) => {
  const token = req.headers['authorization'];
  // If logged, redirect to main page
  if (token) {
    res.redirect('/');
    return res.status(200).json({ message: 'Already logged in' });
  } else {
    // If not log in, user can access login page
    res.render('login');
    return res.status(401).json({ message: 'Not logged in' });
  }
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Token missing' });

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// // Use this middleware to protect API routes that require authentication
// app.get('/protected', authenticateToken, (req, res) => {
//   res.json({ message: 'This is a protected route', user: req.user });
// });

// API to get watch records for the authenticated user
app.get('/records', (req, res) => {
  console.log('req.user:', req.user);
  const user_id = req.user.id;

  db.all(`SELECT Records.id, Media.title, Media.country_code, Media.year, Records.timestamp, Records.status
          FROM Records
          JOIN Media ON Records.media_id = Media.id
          WHERE Records.user_id = ?`, [user_id], (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// API to add a new watch record (for movies, dramas, etc.)
app.post('/addRecord', authenticateToken, (req, res) => {
  const { mediaType, title, countryCode, year, season, episode, status } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Bearer toke
  console.log(req.headers.authorization);
  const decoded = jwt.decode(token);
  console.log(decoded.exp);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Invalid token' });
    const userId = decoded.id;

    db.run(`INSERT INTO Media (title, country_code, year) VALUES (?, ?, ?)`,
      [title, countryCode, year], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      const mediaId = this.lastID;

      if (mediaType === 'movie') {
        db.run(`INSERT INTO Movies (media_id) VALUES (?)`, [mediaId], function(err) {
          if (err) return res.status(500).json({ error: err.message });
        });
      } else if (mediaType === 'drama') {
        db.run(`INSERT INTO Dramas (media_id, season, episode) VALUES (?, ?, ?)`, [mediaId, season, episode], function(err) {
          if (err) return res.status(500).json({ error: err.message });
        });
      } else if (mediaType === 'variety_show') {
        db.run(`INSERT INTO Variety_Shows (media_id, season, episode) VALUES (?, ?, ?)`, [mediaId, season, episode], function(err) {
          if (err) return res.status(500).json({ error: err.message });
        });
      } else if (mediaType === 'animation') {
        db.run(`INSERT INTO Animations (media_id, season, episode) VALUES (?, ?, ?)`, [mediaId, season, episode], function(err) {
          if (err) return res.status(500).json({ error: err.message });
        });
      }
      
      db.run(`INSERT INTO Records (user_id, media_id, status) VALUES (?, ?, ?)`,
        [userId, mediaId, status],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Record added successfully' });
      });
    });
  });
});

// // API to get a watch record
// app.get('/records/:id', (req, res) => {
//   const userId = req.params.userId;

//   db.run(`SELECT Records.id, Media.title, Records.status, Media.year, Media.country_code
//           FROM Records
//           JOIN Media ON Records.media_id = Media.id
//           WHERE Records.user_id = ?`,
//     [userId], (err, rows) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(rows);
//     }
//   );
// });

// // API to update a watch record
// app.put('/records/:id', (req, res) => {
//   const record_id = req.params.id;
//   const { progress, status } = req.body;
//   const user_id = req.user.id;

//   db.run(`UPDATE Records SET progress = ?, status = ? WHERE id = ? AND user_id = ?`,
//     [progress, status, record_id, user_id],
//     function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       if (this.changes === 0) return res.status(404).json({ error: 'Record Not Found' });
//       res.json({ message: 'Record updated successfully' });
//     }
//   );
// });

// // API to delete a watch record
// app.delete('/records/:id', (req, res) => {
//   // const record_id = req.params.id;
//   // const user_id = req.user.id;

//   db.run(`DELETE FROM Records WHERE id = ?`, [req.params.id], function (err) {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ deleted: this.changes });
//   });
// });

// // API to get a movie
// app.get('/movies', (req, res) => {
//   db.all('SELECT * FROM Movies', (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });

// // API to get a movie by ID
// app.get('/movies/:id', (req, res) => {
//   const id = req.params.id;
//   db.get('SELECT * FROM Movies WHERE id = ?', [id], (err, row) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!row) return res.status(404).json({ error: 'Movie Not Found' });
//     res.json(row);
//   });
// });

// // API to get a genre
// app.get('/genres', (req, res) => {
//   db.all('SELECT * FROM Genres', (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });

// // API to get a genres of a movie
// app.get('/movies/:id/genres', (req, res) => {
//   const id = req.params.id;
//   db.all(`SELECT Genres.* FROM Genres
//           JOIN Movie_Genres ON Genres.id = Movie_Genres.genre_id
//           WHERE Movie_Genres.movie_id = ?`, [id], (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(rows);
//   });
// });

app.get('/', (req, res) => {
  res.send('Welcome to the ViewLog API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});