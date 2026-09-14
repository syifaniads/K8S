const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');

const requiredEnv = ['DB_PASSWORD', 'SESSION_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for the lab upload workflow.
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const app = express();
const port = process.env.PORT || 3000;

// Database configuration. Real credentials must be injected by the environment.
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'loginapp'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database');

  db.query('SET FOREIGN_KEY_CHECKS=0;');

  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.query('SET FOREIGN_KEY_CHECKS=1;');
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Authentication required' });
};

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  db.query(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [username, password, email],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ success: false, message: 'Username already exists' });
        }
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({
        success: true,
        message: 'Registration successful! Please login.',
        userId: results.insertId
      });
    }
  );
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length > 0) {
        req.session.userId = results[0].id;
        req.session.username = results[0].username;

        return res.json({
          success: true,
          message: 'Login successful!',
          userId: results[0].id,
          username: results[0].username
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.post('/upload', isAuthenticated, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }

  const userId = req.session.userId;
  const filename = req.file.filename;
  const originalName = req.file.originalname;

  db.query(
    'INSERT INTO uploads (user_id, filename, original_name) VALUES (?, ?, ?)',
    [userId, filename, originalName],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({
        success: true,
        message: 'Upload successful!',
        file: {
          id: result.insertId,
          filename,
          originalName
        }
      });
    }
  );
});

app.get('/uploads', isAuthenticated, (req, res) => {
  const userId = req.session.userId;

  db.query(
    'SELECT * FROM uploads WHERE user_id = ? ORDER BY upload_date DESC',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({ success: true, uploads: results });
    }
  );
});

app.get('/auth/status', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({
      authenticated: true,
      username: req.session.username,
      userId: req.session.userId
    });
  }

  res.json({ authenticated: false });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
