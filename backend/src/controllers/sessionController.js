const Session = require('../models/Session');

// @desc    Get all sessions for user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-chatHistory');

    console.log('Sessions found:', sessions.map(s => ({ id: s._id, name: s.name }))); // Debug log

    res.json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error('Get sessions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Get session error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Session name is required' });
    }

    const session = new Session({
      userId: req.user._id,
      name,
      description,
    });

    await session.save();

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Create session error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = async (req, res) => {
  try {
    console.log('Update session request:', { id: req.params.id, body: req.body }); // Debug log
    
    const { name, description, currentComponent, chatHistory } = req.body;

    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      console.log('Session not found for update'); // Debug log
      return res.status(404).json({ message: 'Session not found' });
    }

    console.log('Found session for update:', session._id); // Debug log

    // Update fields
    if (name !== undefined) session.name = name;
    if (description !== undefined) session.description = description;
    if (currentComponent !== undefined) session.currentComponent = currentComponent;
    if (chatHistory !== undefined) session.chatHistory = chatHistory;

    await session.save();

    console.log('Session updated successfully'); // Debug log

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Update session error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
  try {
    console.log('Attempting to delete session with ID:', req.params.id); // Debug log
    
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      console.log('Session not found for deletion'); // Debug log
      return res.status(404).json({ message: 'Session not found' });
    }

    console.log('Session deleted successfully:', session._id); // Debug log

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('Delete session error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add chat message to session
// @route   POST /api/sessions/:id/chat
// @access  Private
const addChatMessage = async (req, res) => {
  try {
    const { role, content, metadata } = req.body;

    if (!role || !content) {
      return res.status(400).json({ 
        message: 'Role and content are required' 
      });
    }

    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const message = {
      role,
      content,
      timestamp: new Date(),
      metadata: metadata || {},
    };

    session.chatHistory.push(message);
    await session.save();

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Add chat message error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  addChatMessage,
}; 