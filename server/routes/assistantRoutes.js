const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

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

router.post('/chat', auth, async (req, res) => {
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

router.post('/skill-chat', auth, async (req, res) => {
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
        model: 'llama-3.1-70b-versatile', // Using Llama 3.1 70B model
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

module.exports = router;

