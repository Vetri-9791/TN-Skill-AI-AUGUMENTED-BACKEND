const { validationResult } = require('express-validator');
const { callGemini } = require('../services/geminiService');
const Blog = require('../models/Blog');

const buildPrompt = ({ topic, keywords, audience, tone, language, length }) => {
  let prompt = `Write a blog post about ${topic}.`;
  if (keywords && Array.isArray(keywords) && keywords.length) {
    prompt += ` Include these keywords: ${keywords.join(', ')}.`;
  }
  if (audience) prompt += ` Target audience: ${audience}.`;
  if (tone) prompt += ` Tone: ${tone}.`;
  if (language) prompt += ` Language: ${language}.`;
  if (length) prompt += ` Desired length: ${length}.`;
  prompt += ` Include a strong introduction, key points with short sections, and a clear conclusion. Do not include markdown headings or extra formatting.`;
  return prompt;
};

const cleanGeneratedText = (text) => {
  if (!text) return '';
  return text
    .replace(/^\s*#{1,6}\s*/gm, '')
    .replace(/^\s*[\*\-\+]\s*/gm, '')
    .replace(/\*{1,3}(.+?)\*{1,3}/g, '$1')
    .replace(/[\*_]{2,}/g, '')
    .replace(/\r\n|\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const inferCategory = (topic) => {
  const normalized = topic.toLowerCase();
  const mapping = [
    { keywords: ['ai', 'technology', 'software', 'programming', 'cloud'], category: 'Technology' },
    { keywords: ['learning', 'school', 'education', 'teaching', 'study'], category: 'Education' },
    { keywords: ['health', 'fitness', 'medicine', 'wellness', 'mental'], category: 'Health' },
    { keywords: ['sports', 'football', 'basketball', 'soccer', 'athlete'], category: 'Sports' },
    { keywords: ['lifestyle', 'fashion', 'travel', 'home', 'beauty'], category: 'Lifestyle' },
    { keywords: ['business', 'startup', 'finance', 'economy', 'marketing'], category: 'Business' },
    { keywords: ['travel', 'tourism', 'destination', 'adventure', 'holiday'], category: 'Travel' },
    { keywords: ['money', 'investment', 'stocks', 'banking', 'crypto'], category: 'Finance' },
    { keywords: ['entertainment', 'movies', 'music', 'celebrity', 'gaming'], category: 'Entertainment' },
  ];

  const match = mapping.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
  return match ? match.category : 'Unidentified';
};

const generateBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { topic, keywords, audience, tone, language, length, category } = req.body;
    const prompt = buildPrompt({ topic, keywords, audience, tone, language, length });
    const result = await callGemini(prompt);
    const title = `Guide to ${topic}`;
    const content = cleanGeneratedText(result);
    const resolvedCategory = category || inferCategory(topic);

    const blog = await Blog.create({
      title,
      content,
      category: resolvedCategory,
      author: req.user._id,
      authorName: req.user.name,
    });

    res.status(201).json(blog);
  } catch (error) {
    if (error.message && error.message.toLowerCase().includes('gemini')) {
      return res.status(502).json({ message: 'AI provider error', detail: error.message });
    }
    next(error);
  }
};

const summarizeBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { content } = req.body;
    const prompt = `Summarize the following blog content in a short, easy-to-read paragraph:\n\n${content}`;
    const summaryText = await callGemini(prompt);

    res.json({ summary: cleanGeneratedText(summaryText) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateBlog,
  summarizeBlog,
};
