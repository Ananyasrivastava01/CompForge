const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  currentComponent: {
    jsxCode: {
      type: String,
      default: '',
    },
    cssCode: {
      type: String,
      default: '',
    },
    metadata: {
      name: {
        type: String,
        default: 'Untitled Component',
      },
      description: String,
      tags: [String],
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  chatHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      elementId: String,
      imageUrl: String,
      jsxCode: String,
      cssCode: String,
    },
  }],
}, {
  timestamps: true,
});

// Index for faster queries
sessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Session', sessionSchema); 