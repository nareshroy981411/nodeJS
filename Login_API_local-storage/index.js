const express = require('express');
const app = express();

// Sample local storage (replace this with your actual data source)
let users = [];

app.use(express.json());
// Assuming 'express' and 'app' are already defined and 'users' array is populated as in previous examples

app.post('/register', (req, res) => {
    try {
      // Extract user data from the request body
      const { username, email, password } = req.body;
  
      // Check if required data is present
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password.' });
      }
  
      // Check if the email is already registered
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
      }
  
      // Create a new user object
      const newUser = {
        id: users.length + 1, // Replace this with a proper ID mechanism
        username,
        email,
        password // In a real scenario, this should be encrypted before storage
      };
  
      // Store the user data
      users.push(newUser);
  
      // Respond with a success message
      res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user.' });
    }
  });
  
  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
// Define route for user login
app.post('/login', (req, res) => {
    try {
      // Extract login credentials from the request body
      const { email, password } = req.body;
  
      // Check if required data is present
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
      }
  
      // Find the user by email
      const user = users.find(user => user.email === email);
  
      // Check if user exists and validate password (in a real scenario, passwords should be encrypted)
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
      }
  
      // Respond with a success message
      res.json({ message: 'Login successful!', user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in.' });
    }
  });
  