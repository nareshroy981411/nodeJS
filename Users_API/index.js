const express = require('express');
const app = express();

// Sample local storage (replace this with your actual data source)
const users = [
  { id: 1, username: 'naresh', email: 'naresh1@gmail.com', password:'naresh98' },
  { id: 2, username: 'suresh', email: 'suresh1@gmail.com', password:'suresh98' },
  { id: 2, username: 'harish', email: 'harish1@gmail.com',password:'harish98' },
  // Additional user data...
];

// Define route for fetching users
app.get('/users', (req, res) => {
  try {
    // Fetch all users from the local storage (in this case, the 'users' array)
    // Replace this logic with your actual data retrieval method (e.g., database query)
    const allUsers = users;

    // Check if there are users available
    if (allUsers.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Respond with the retrieved user data in JSON format
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
