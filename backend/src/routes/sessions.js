const express = require('express');
const router = express.Router();
const {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  addChatMessage,
} = require('../controllers/sessionController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Session routes
router.route('/')
  .get(getSessions)
  .post(createSession);

router.route('/:id')
  .get(getSession)
  .put(updateSession)
  .delete(deleteSession);

// Chat routes
router.post('/:id/chat', addChatMessage);

module.exports = router; 