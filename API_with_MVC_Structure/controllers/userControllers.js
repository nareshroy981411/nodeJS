// const User = require("../models/user");

// const UserController = {
//   //   async register(req, res) {
//   //     try {
//   //       const { username, email, password } = req.body;
//   //       const newUser = await User.createUser({ username, email, password });
//   //       res.status(201).json({ message: 'User registered successfully.', user: newUser });
//   //     } catch (error) {
//   //       console.error('Error registering user:', error);
//   //       res.status(500).json({ message: 'Error registering user.' });
//   //     }
//   //   },

//   //   async login(req, res) {
//   //     try {
//   //       const { email, password } = req.body;
//   //       const user = await User.getUserByEmail(email);

//   //       if (!user || user.password !== password) {
//   //         return res.status(401).json({ message: 'Invalid credentials.' });
//   //       }

//   //       res.json({ message: 'Login successful!', user });
//   //     } catch (error) {
//   //       console.error('Error logging in:', error);
//   //       res.status(500).json({ message: 'Error logging in.' });
//   //     }
//   //   },

//   async register(req, res) {
//     try {
//       const { username, email, password } = req.body;

//       // Check for empty fields (username, email, password)
//       if (!username || !email || !password) {
//         return res.status(400).json({ message: "Please fill in all fields." });
//       }

//       // Check if the user already exists by email
//       const existingUser = await User.getUserByEmail(email);
//       if (existingUser) {
//         return res
//           .status(409)
//           .json({ message: "User is already registered. Please login." });
//       }

//       const newUser = await User.createUser({ username, email, password });
//       res
//         .status(201)
//         .json({ message: "User registered successfully.", user: newUser });
//     } catch (error) {
//       console.error("Error during registration:", error);
//       res.status(500).json({ message: "Error registering user." });
//     }
//   },

//   async login(req, res) {
//     try {
//       const { email, password } = req.body;

//       // Check for empty email and password fields
//       if (!email && !password) {
//         return res
//           .status(400)
//           .json({ message: "Please enter the email and password." });
//       }

//       // Check for empty email field
//       if (!email) {
//         return res.status(400).json({ message: "Please enter the email." });
//       }

//       const user = await User.getUserByEmail(email);

//       if (!user || user.password !== password) {
//         return res.status(401).json({ message: "Invalid credentials." });
//       }

//       res.json({ message: "Login successful!", user });
//     } catch (error) {
//       console.error("Error logging in:", error);
//       res.status(500).json({ message: "Error logging in." });
//     }
//   },

//   async getUsers(req, res) {
//     try {
//       const users = await User.getAllUsers();
//       res.json(users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).json({ message: "Error fetching users." });
//     }
//   },

//   // Other controller methods for user-related operations
// };

// module.exports = UserController;

// userController.js

const mysqlConnection = require('../config/db'); // Import your MySQL connection configuration
const User = require("../models/user")

const UserController = {
  async registerWithPhoto(req, res) {
    try {
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
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Error registering user.' });
    }
  },

  // Add other controller methods for login, fetching users, etc. as needed
};

module.exports = UserController;
