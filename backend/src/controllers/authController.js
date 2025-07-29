const jwt = require('jsonwebtoken');
const User = require('../models/User');
const oauthService = require('../services/oauthService');
const axios = require('axios');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Please provide email, password, and name' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get me error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get OAuth URLs
// @route   GET /api/auth/oauth/urls
// @access  Public
const getOAuthUrls = async (req, res) => {
  try {
    const urls = oauthService.getOAuthUrls();
    res.json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error('Get OAuth URLs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      console.error('No authorization code received');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=No authorization code received`);
    }

    console.log('Received Google OAuth code, exchanging for token...');

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    });

    console.log('Token exchange successful');

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      console.error('No access token received from Google');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=No access token received from Google`);
    }

    // Get user profile
    console.log('Fetching user profile from Google...');
    const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const profile = profileResponse.data;
    console.log('User profile received:', { id: profile.id, email: profile.email, name: profile.name });

    // Find or create user
    console.log('Finding or creating user...');
    const user = await oauthService.handleGoogleCallback(profile);

    // Generate token
    const token = oauthService.generateToken(user._id);
    console.log('User authenticated successfully:', user._id);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);

  } catch (error) {
    console.error('Google OAuth callback error:', error.message);
    console.error('Error details:', error.response?.data || error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/error?message=Google authentication failed: ${error.message}`);
  }
};

// @desc    GitHub OAuth callback
// @route   GET /api/auth/github/callback
// @access  Public
const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const { access_token } = tokenResponse.data;

    // Get user profile
    const profileResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const profile = profileResponse.data;

    // Get user email
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const primaryEmail = emailResponse.data.find(email => email.primary);
    profile.emails = [{ value: primaryEmail.email }];

    // Find or create user
    const user = await oauthService.handleGitHubCallback(profile);

    // Generate token
    const token = oauthService.generateToken(user._id);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);

  } catch (error) {
    console.error('GitHub OAuth callback error:', error.message);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/error?message=GitHub authentication failed`);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getOAuthUrls,
  googleCallback,
  githubCallback,
}; 