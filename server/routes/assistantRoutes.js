const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const ChatHistory = require('../models/ChatHistory');

const router = express.Router();

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const buildSystemPrompt = (user = {}) => {
  const name = user.name || 'colleague';
  const role = user.role || 'employee';
  const company = user.company || 'Techackode';
  return [
    `You are Techackode Copilot, an AI assistant supporting engineers, designers, and operations teams at ${company}.`,
    'Provide concise, actionable answers focused on company workflows, product design, and full-stack web development.',
    'Prefer step-by-step guidance, surface potential risks, and link back to requirements when possible.',
    `Keep tone friendly and professional, as if pairing with ${name} (${role}).`,
  ].join(' ');
};

/**
 * @swagger
 * /api/assistant/chat:
 *   post:
 *     summary: Chat with AI assistant (Techackode Copilot)
 *     tags: [Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssistantChatRequest'
 *     responses:
 *       200:
 *         description: AI assistant response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssistantChatResponse'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/chat', auth, authorizeAccess, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ msg: 'OpenRouter API key not configured on server.' });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ msg: 'Messages array is required.' });
    }

    const formattedMessages = [
      { role: 'system', content: buildSystemPrompt(req.user) },
      ...messages.map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content || '',
      })),
    ];

    const { data } = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openrouter/anthropic/claude-3.5-sonnet',
        messages: formattedMessages,
        max_tokens: 800,
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.OPENROUTER_REFERRER || 'https://worklogz.netlify.app',
          'X-Title': 'Techackode Copilot',
        },
      }
    );

    const assistantMessage = data?.choices?.[0]?.message;

    if (!assistantMessage) {
      return res.status(502).json({ msg: 'No response returned from OpenRouter.' });
    }

    res.json({
      message: assistantMessage,
      usage: data?.usage,
      model: data?.model,
    });
  } catch (error) {
    console.error('Assistant chat error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    res.status(status).json({
      msg: error.response?.data?.error || 'Failed to reach AI assistant.',
    });
  }
});

// Skill Development Chat using Groq AI
const buildSkillDevelopmentPrompt = (user = {}) => {
  const name = user.name || 'learner';
  const role = user.role || 'employee';
  const position = user.position || 'professional';
  return [
    `You are a Skill Development AI Assistant helping ${name}, a ${position} (${role}), to develop and improve their professional skills.`,
    'Your role is to provide personalized guidance, learning resources, career advice, and skill development strategies.',
    'Focus on practical, actionable advice for professional growth, technical skills, soft skills, and career advancement.',
    'Provide step-by-step learning paths, recommend resources, explain concepts clearly, and help with problem-solving.',
    'Be encouraging, supportive, and adapt your teaching style to the user\'s level and needs.',
    'When asked about specific technologies or skills, provide detailed explanations, best practices, and real-world examples.',
  ].join(' ');
};

/**
 * @swagger
 * /api/assistant/skill-chat:
 *   post:
 *     summary: Chat with skill development AI assistant
 *     tags: [Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssistantChatRequest'
 *     responses:
 *       200:
 *         description: AI assistant response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssistantChatResponse'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/skill-chat', auth, authorizeAccess, async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ msg: 'Groq API key not configured on server.' });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ msg: 'Messages array is required.' });
    }

    const formattedMessages = [
      { role: 'system', content: buildSkillDevelopmentPrompt(req.user) },
      ...messages.map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content || '',
      })),
    ];

    const { data } = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // Using Llama 3.3 70B model
        messages: formattedMessages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantMessage = data?.choices?.[0]?.message;

    if (!assistantMessage) {
      return res.status(502).json({ msg: 'No response returned from Groq AI.' });
    }

    res.json({
      message: assistantMessage,
      usage: data?.usage,
      model: data?.model,
    });
  } catch (error) {
    console.error('Skill development chat error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    res.status(status).json({
      msg: error.response?.data?.error?.message || 'Failed to reach AI assistant.',
    });
  }
});

// Worklogz AI Chatbot using Groq API
const buildWorklogzAIPrompt = (user = {}) => {
  const name = user.name || 'User';
  return [
    `You are Worklogz AI, a friendly AI assistant for the Worklogz platform.`,
    `The user's name is ${name}.`,
    `Worklogz is an employee management and work tracking platform developed by Ranjith Kumar and Gayathri B.`,
    `When users ask about Worklogz, its developers (Ranjith Kumar, Gayathri B), or the company, provide accurate information:`,
    `- Worklogz is developed by Ranjith Kumar and Gayathri B`,
    `- Ranjith Kumar is the boss/lead developer`,
    `- It's an employee management system for tracking work, attendance, and productivity`,
    `- Be helpful, friendly, and professional`,
    `- For other questions, provide helpful answers using your knowledge`,
    `- Keep responses concise but informative`,
  ].join(' ');
};

// Check if message is about Worklogz/developers
const isWorklogzRelated = (message) => {
  const lowerMessage = message.toLowerCase();
  const keywords = ['worklogz', 'ranjith', 'gayathri', 'developer', 'developed', 'boss', 'created', 'made', 'who made', 'who created'];
  return keywords.some(keyword => lowerMessage.includes(keyword));
};

// Get chat history for user
router.get('/worklogz-chat/history', auth, authorizeAccess, async (req, res) => {
  try {
    const userId = req.user._id;
    const chatHistory = await ChatHistory.findOne({ userId })
      .sort({ updatedAt: -1 })
      .limit(1);
    
    if (!chatHistory) {
      return res.json({ messages: [] });
    }
    
    res.json({ messages: chatHistory.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ msg: 'Failed to fetch chat history.' });
  }
});

// Worklogz AI Chat endpoint
router.post('/worklogz-chat', auth, authorizeAccess, async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ msg: 'Groq API key not configured on server.' });
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ msg: 'Message is required.' });
    }

    const userId = req.user._id;
    const userName = req.user.name || 'User';

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ userId })
      .sort({ updatedAt: -1 })
      .limit(1);

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId,
        messages: []
      });
    }

    // Add user message to history
    chatHistory.messages.push({
      role: 'user',
      content: message
    });

    // Prepare messages for API (include system prompt and recent history)
    const systemPrompt = buildWorklogzAIPrompt(req.user);
    const recentMessages = chatHistory.messages.slice(-10); // Keep last 10 messages for context
    
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Handle Worklogz-specific questions
    let assistantResponse = '';
    let apiData = null;
    
    if (isWorklogzRelated(message)) {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('ranjith') || lowerMessage.includes('boss')) {
        assistantResponse = `Hello ${userName}! Yes, Ranjith Kumar is the boss and one of the developers of Worklogz. Worklogz is developed by Ranjith Kumar and Gayathri B. It's an employee management platform designed to help companies track work, attendance, and productivity. How can I help you today?`;
      } else if (lowerMessage.includes('gayathri')) {
        assistantResponse = `Hello ${userName}! Yes, Gayathri B is one of the developers of Worklogz. Worklogz is developed by Ranjith Kumar and Gayathri B. It's an employee management platform designed to help companies track work, attendance, and productivity. How can I help you today?`;
      } else if (lowerMessage.includes('worklogz') && (lowerMessage.includes('who') || lowerMessage.includes('develop') || lowerMessage.includes('create'))) {
        assistantResponse = `Hello ${userName}! Worklogz is developed by Ranjith Kumar and Gayathri B. Ranjith Kumar is the boss. It's an employee management platform designed to help companies track work, attendance, and productivity. How can I help you today?`;
      }
    }

    // If no specific response, use Groq API
    if (!assistantResponse) {
      const { data } = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.3-70b-versatile',
          messages: formattedMessages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      apiData = data;
      const assistantMessage = data?.choices?.[0]?.message;
      if (!assistantMessage) {
        console.error('Groq API response structure:', JSON.stringify(data, null, 2));
        return res.status(502).json({ msg: 'No response returned from Groq AI.' });
      }
      assistantResponse = assistantMessage.content || assistantMessage.text || '';
      
      if (!assistantResponse || assistantResponse.trim() === '') {
        console.error('Empty assistant response:', assistantMessage);
        return res.status(502).json({ msg: 'Empty response from Groq AI.' });
      }
    }

    // Add assistant response to history
    chatHistory.messages.push({
      role: 'assistant',
      content: assistantResponse
    });

    // Save chat history
    await chatHistory.save();

    res.json({
      message: assistantResponse,
      usage: apiData?.usage || null,
      model: 'llama-3.3-70b-versatile',
    });
  } catch (error) {
    console.error('Worklogz AI chat error:', error.response?.data || error.message);
    console.error('Full error:', error);
    
    let errorMessage = 'Failed to reach AI assistant.';
    const status = error.response?.status || 500;
    
    if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error.response?.data?.error) {
      errorMessage = typeof error.response.data.error === 'string' 
        ? error.response.data.error 
        : 'API error occurred.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(status).json({
      msg: errorMessage,
      error: error.response?.data || error.message,
    });
  }
});

// Clear chat history
router.delete('/worklogz-chat/history', auth, authorizeAccess, async (req, res) => {
  try {
    const userId = req.user._id;
    await ChatHistory.deleteMany({ userId });
    res.json({ msg: 'Chat history cleared successfully.' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ msg: 'Failed to clear chat history.' });
  }
});

module.exports = router;

