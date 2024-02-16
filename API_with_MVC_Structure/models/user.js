// models/user.js
// Your User model implementation interacting with the database
const db = require('../config/db'); // Assuming you have a database connection configuration

const User = {
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users', (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  },

  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows[0]);
      });
    });
  },
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows[0] || null);
      });
    });
  },

  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users SET ?', userData, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve({ id: result.insertId, ...userData });
      });
    });
  },

  // Add other methods for updating, deleting users, etc. as needed
};

module.exports = User;
