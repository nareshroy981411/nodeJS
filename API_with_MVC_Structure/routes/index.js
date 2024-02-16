// routs/index.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers');

// Register route
router.post('/register', UserController.register);

// Login route
router.post('/login', UserController.login);

// Get users route
router.get('/users', UserController.getUsers);

module.exports = router;
