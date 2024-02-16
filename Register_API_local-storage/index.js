// const express = require('express');
// const app = express();

// // Sample local storage (replace this with your actual data source)
// let users = [];

// app.use(express.json());

// // Define route for user registration
// app.post('/register', (req, res) => {
//   try {
//     // Extract user data from the request body
//     const { username, email, password } = req.body;

//     // Check if required data is present
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: 'Please provide username, email, and password.' });
//     }

//     // Check if the email is already registered
//     const existingUser = users.find(user => user.email === email);
//     if (existingUser) {
//       return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
//     }

//     // Create a new user object
//     const newUser = {
//       id: users.length + 1, // Replace this with a proper ID mechanism
//       username,
//       email,
//       password // In a real scenario, this should be encrypted before storage
//     };

//     // Store the user data
//     users.push(newUser);

//     // Respond with a success message
//     res.status(201).json({ message: 'User registered successfully.', user: newUser });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ message: 'Error registering user.' });
//   }
// });

// // Start the server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const multer = require('multer');
const app = express();

// Sample local storage (replace this with your actual data source)
let users = [];

app.use(express.json());

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // Rename the file to avoid name conflicts
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define route for user registration
app.post('/register', upload.single('profilePhoto'), (req, res) => {
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

    // Get the file information if uploaded
    let profilePhoto = null;
    if (req.file) {
      profilePhoto = req.file.path; // Save the path to the profile photo
    }

    // Create a new user object with the profile photo information
    const newUser = {
      id: users.length + 1, // Replace this with a proper ID mechanism
      username,
      email,
      password, // In a real scenario, this should be encrypted before storage
      profilePhoto // Store the profile photo path in the user object
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
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
