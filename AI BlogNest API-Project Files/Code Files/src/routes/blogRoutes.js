const express = require('express');
const { body } = require('express-validator');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { generateBlog } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  createBlog
);

// Generate a draft blog using the AI provider and save it as a draft for the signed-in user
router.post(
  '/generate',
  authMiddleware,
  [
    body('topic').notEmpty().withMessage('Topic is required'),
    body('keywords').optional().isArray().withMessage('Keywords must be an array'),
    body('audience').optional().isString(),
    body('tone').optional().isString(),
    body('language').optional().isString(),
    body('length').optional().isString(),
  ],
  generateBlog
);

router.get('/', authMiddleware, getAllBlogs);
router.get('/:id', authMiddleware, getBlogById);

router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  ],
  updateBlog
);

router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
