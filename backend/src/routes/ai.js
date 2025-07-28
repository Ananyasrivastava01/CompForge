const express = require('express');
const router = express.Router();
const {
  generateComponent,
  modifyComponent,
  chatWithAI,
} = require('../controllers/aiController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// AI routes
router.post('/generate', generateComponent);
router.post('/modify', modifyComponent);
router.post('/chat', chatWithAI);

module.exports = router; 