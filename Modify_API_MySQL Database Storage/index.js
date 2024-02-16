const express = require('express');
const session = require('express-session');
const mysql = require('mysql');

// Create an Express app
const app = express();

// Initialize the session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a random secret
    resave: false,
    saveUninitialized: true
  }));

// MySQL Connection Configuration
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'naresh@123',
  database: 'local_db'
});

// Connect to MySQL
mysqlConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database!');
});

// Middleware to parse JSON data
app.use(express.json());


// Register API endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
  
  if (!username && email && !password ) {
    return res.status(400).json({ message: 'Please enter the all fields' });
  }
    // Check for empty username field
    if (!username && email) {
      return res.status(400).json({ message: 'Please enter the username and email.' });
    }
  // Check for empty email and password fields
  if (!username && !password) {
    return res.status(400).json({ message: 'Please enter the username and password.' });
  }
  if (!username) {
    return res.status(400).json({ message: 'Please enter the username.' });
  }
    // Check for empty email field
    if (!email && !password) {
      return res.status(400).json({ message: 'Please enter the email and password.' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Please enter the email.' });
      }
  
    // Check for empty password field
    if (!password) {
      return res.status(400).json({ message: 'Please enter the password.' });
    }
  
    // Validate password complexity (at least one letter, one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d,]$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password should contain at least 8 characters including one letter and one number.' });
    }
  
    // Validate email domain
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid Gmail address.' });
    }
  
    // Perform additional username validation if needed
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Please provide a valid username.' });
    }
  
    // Check for existing user with the same email
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    mysqlConnection.query(checkUserQuery, [email], (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ message: 'Error registering user.' });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }
  
      // Insert the new user
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const values = [username, email, password];
  
      mysqlConnection.query(insertUserQuery, values, (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ message: 'Error registering user.' });
        }
        res.status(201).json({ message: 'User registered successfully.', userId: result.insertId });
      });
    });
  });
  
  

//  Login API endpoint


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
  
      // Check if the user is already logged in (stored in session)
      if (req.session.loggedUser === user.id) {
        return res.status(409).json({ message: 'User is already logged in.' });
      }
  
      // Store the logged-in user in the session
      req.session.loggedUser = user.id;
  
      res.json({ message: 'Login successful!', user: { id: user.id, name: user.username, email: user.email } });
    });
  });

// Get users API endpoint
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

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
