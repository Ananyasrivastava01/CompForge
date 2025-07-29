const aiService = require('../services/aiService');
const Session = require('../models/Session');

// @desc    Generate component
// @route   POST /api/ai/generate
// @access  Private
const generateComponent = async (req, res) => {
  try {
    const { prompt, sessionId, stream = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Get chat history if sessionId is provided
    let chatHistory = [];
    if (sessionId) {
      const session = await Session.findOne({
        _id: sessionId,
        userId: req.user._id,
      });
      
      if (session) {
        chatHistory = session.chatHistory;
      }
    }

    if (stream) {
      // Stream the response
      return aiService.streamComponent(prompt, chatHistory, res);
    } else {
      // Regular response
      const result = await aiService.generateComponent(prompt, chatHistory);
      
      // Return the result directly without the data wrapper
      res.json(result);
    }
  } catch (error) {
    console.error('Generate component error:', error.message);
    res.status(500).json({ message: 'Failed to generate component' });
  }
};

// @desc    Modify component
// @route   POST /api/ai/modify
// @access  Private
const modifyComponent = async (req, res) => {
  try {
    const { originalCode, modificationPrompt, sessionId } = req.body;

    if (!originalCode || !modificationPrompt) {
      return res.status(400).json({ 
        message: 'Original code and modification prompt are required' 
      });
    }

    // Get chat history if sessionId is provided
    let chatHistory = [];
    if (sessionId) {
      const session = await Session.findOne({
        _id: sessionId,
        userId: req.user._id,
      });
      
      if (session) {
        chatHistory = session.chatHistory;
      }
    }

    const result = await aiService.modifyComponent(
      originalCode, 
      modificationPrompt, 
      chatHistory
    );

    // Return the result directly without the data wrapper
    res.json(result);
  } catch (error) {
    console.error('Modify component error:', error.message);
    res.status(500).json({ message: 'Failed to modify component' });
  }
};

const chatWithAI = async (req, res) => {
  try {
    const { message, sessionId, stream = false } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get chat history if sessionId is provided
    let chatHistory = [];
    if (sessionId) {
      const session = await Session.findOne({
        _id: sessionId,
        userId: req.user._id,
      });
      
      if (session) {
        chatHistory = session.chatHistory;
      }
    }

    if (stream) {
      // Stream the response
      return aiService.streamComponent(message, chatHistory, res);
    } else {
      // Regular response
      const result = await aiService.generateComponent(message, chatHistory);
      
      // Return the result directly without the data wrapper
      res.json(result);
    }
  } catch (error) {
    console.error('Chat with AI error:', error.message);
    res.status(500).json({ message: 'Failed to process chat message' });
  }
};

module.exports = {
  generateComponent,
  modifyComponent,
  chatWithAI,
}; 