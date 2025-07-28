const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  getOAuthUrls, 
  googleCallback, 
  githubCallback 
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// OAuth routes
router.get('/oauth/urls', getOAuthUrls);
router.get('/google/callback', googleCallback);
router.get('/github/callback', githubCallback);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router; 