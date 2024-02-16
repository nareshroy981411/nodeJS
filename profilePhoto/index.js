const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'naresh@123',
  database: 'local_db'
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database!');
});

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });


app.post('/register', upload.single('profilePhoto'), (req, res) => {
    const { username, email, password } = req.body;
    const profilePhoto = req.file;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' });
    }
  
    // Validate username, email, password, etc.
  
    if (!profilePhoto) {
      return res.status(400).json({ message: 'Please upload a profile photo.' });
    }
  
    const imagePath = profilePhoto.path;
  
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    mysqlConnection.query(checkUserQuery, [email], (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ message: 'Error registering user.' });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }
  
      const insertUserQuery = 'INSERT INTO users (username, email, password, profilePhoto) VALUES (?, ?, ?, ?)';
      const values = [username, email, password, imagePath];
  
      mysqlConnection.query(insertUserQuery, values, (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ message: 'Error registering user.' });
        }
  
        // Fetch the registered user details
        const fetchUserQuery = 'SELECT * FROM users WHERE id = ?';
        mysqlConnection.query(fetchUserQuery, [result.insertId], (err, userResult) => {
          if (err) {
            console.error('Error fetching user details:', err);
            return res.status(500).json({ message: 'Error fetching user details.' });
          }
  
          if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
          }
  
          const registeredUser = userResult[0];
          res.status(201).json({
            message: 'User registered successfully.',
            user: {
              id: registeredUser.id,
              username: registeredUser.username,
              email: registeredUser.email,
              profilePhoto: registeredUser.profilePhoto
            }
          });
        });
      });
    });
  });
  
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  mysqlConnection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ message: 'Error logging in.' });
    }

    const user = results[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (req.session.loggedUser === user.id) {
      return res.status(409).json({ message: 'User is already logged in.' });
    }

    req.session.loggedUser = user.id;

    res.json({ message: 'Login successful!', user: { id: user.id, name: user.username, email: user.email } });
  });
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  mysqlConnection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users.' });
    }
    res.json(results);
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
