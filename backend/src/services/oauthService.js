const User = require('../models/User');
const jwt = require('jsonwebtoken');

class OAuthService {
  // Generate JWT Token
  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  // Find or create user from OAuth profile
  async findOrCreateUser(profile, provider) {
    try {
      console.log('Processing OAuth profile:', {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        emails: profile.emails,
        displayName: profile.displayName
      });

      // Validate profile has required fields
      if (!profile.id) {
        throw new Error('Profile ID is required');
      }

      // Get email from profile (Google provides email directly)
      const email = profile.email || (profile.emails && profile.emails[0] && profile.emails[0].value);
      
      if (!email) {
        throw new Error('Email is required for OAuth authentication');
      }

      // Check if user exists with this OAuth ID
      let user = await User.findOne({
        oauthProvider: provider,
        oauthId: profile.id,
      });

      if (user) {
        console.log('Found existing user by OAuth ID:', user._id);
        return user;
      }

      // Check if user exists with this email
      user = await User.findOne({ email: email });

      if (user) {
        console.log('Found existing user by email, linking OAuth:', user._id);
        // Link existing account to OAuth
        user.oauthProvider = provider;
        user.oauthId = profile.id;
        user.avatar = profile.picture || profile.photos?.[0]?.value;
        user.emailVerified = true;
        await user.save();
        return user;
      }

      // Create new user
      const userName = profile.name || profile.displayName || profile.given_name || 'User';
      
      user = new User({
        email: email,
        name: userName,
        oauthProvider: provider,
        oauthId: profile.id,
        avatar: profile.picture || profile.photos?.[0]?.value,
        emailVerified: true,
      });

      await user.save();
      console.log('Created new user:', user._id);
      return user;
    } catch (error) {
      console.error('OAuth user creation error:', error);
      throw error;
    }
  }

  // Google OAuth callback
  async handleGoogleCallback(profile) {
    return this.findOrCreateUser(profile, 'google');
  }

  // GitHub OAuth callback
  async handleGitHubCallback(profile) {
    return this.findOrCreateUser(profile, 'github');
  }

  // Get OAuth URLs
  getOAuthUrls() {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    return {
      google: {
        authUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${baseUrl}/api/auth/google/callback&response_type=code&scope=email profile`,
        callbackUrl: `${baseUrl}/api/auth/google/callback`,
      },
      github: {
        authUrl: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${baseUrl}/api/auth/github/callback&scope=user:email`,
        callbackUrl: `${baseUrl}/api/auth/github/callback`,
      },
    };
  }
}

module.exports = new OAuthService(); 