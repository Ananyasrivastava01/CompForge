const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Placeholder routes - will be implemented later
router.get('/', (req, res) => {
  res.json({ message: 'Components route - to be implemented' });
});

module.exports = router; 