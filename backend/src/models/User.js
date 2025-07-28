const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if not using OAuth
      return !this.oauthProvider;
    },
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // OAuth fields
  oauthProvider: {
    type: String,
    enum: ['google', 'github', null],
    default: null,
  },
  oauthId: {
    type: String,
    sparse: true, // Allows multiple null values
  },
  avatar: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Compound index for OAuth
userSchema.index({ oauthProvider: 1, oauthId: 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema); 