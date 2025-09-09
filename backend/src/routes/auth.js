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
// router.get('/google/url', (req, res) => {
//   const { redirect_uri } = req.query;
//   const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
//   const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${baseUrl}/api/auth/google/callback&response_type=code&scope=email profile&state=${encodeURIComponent(redirect_uri || '')}`;
//   res.json({ authUrl: googleAuthUrl });
// });
// router.get('/google/url', (req, res) => {
//   const { redirect_uri } = req.query;

//   // Use your FRONTEND_URL for redirect, not backend URL
//   const frontendCallback = `${process.env.FRONTEND_URL}/auth/callback`;

//   const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${frontendCallback}&response_type=code&scope=email profile&state=${encodeURIComponent(redirect_uri || '')}`;

//   res.json({ authUrl: googleAuthUrl });
// });
router.get('/google/url', (req, res) => {
  const { redirect_uri } = req.query;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${baseUrl}/api/auth/google/callback&response_type=code&scope=email profile&state=${encodeURIComponent(redirect_uri || '')}`;
  res.json({ authUrl: googleAuthUrl });
});


router.get('/google/callback', googleCallback);
router.get('/github/callback', githubCallback);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router; 