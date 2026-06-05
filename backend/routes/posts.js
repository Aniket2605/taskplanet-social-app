const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// ✅ CREATE POST
router.post('/', auth, async (req, res) => {
  const { text, image } = req.body;

  try {
    // At least text or image required
    if (!text && !image) {
      return res.status(400).json({ 
        message: 'Post must have text or image' 
      });
    }

    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      text: text || '',
      image: image || ''
    });

    await newPost.save();

    res.status(201).json(newPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET ALL POSTS (Feed)
router.get('/', async (req, res) => {
  try {
    // Get posts newest first
    // Pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET SINGLE POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LIKE / UNLIKE POST
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const username = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      // Unlike - remove username
      post.likes = post.likes.filter(u => u !== username);
    } else {
      // Like - add username
      post.likes.push(username);
    }

    await post.save();

    res.status(200).json({
      likes: post.likes,
      likeCount: post.likes.length,
      liked: !alreadyLiked
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ ADD COMMENT
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      username: req.user.username,
      text
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      comments: post.comments,
      commentCount: post.comments.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE POST (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;